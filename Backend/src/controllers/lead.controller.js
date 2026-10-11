import { z } from "zod";
import mongoose from "mongoose";
import Lead from "../models/Lead.js";
import { qualifyLead } from "../services/qualification.service.js";
import OutreachDraft from "../models/OutreachDraft.js";
import { generateOutreachDraft } from "../services/outreach.service.js";

const leadSchema = z.object({
  companyName: z.string().trim().min(1).max(150),
  website: z.string().trim().max(500).optional(),
  industry: z.string().trim().max(100).optional(),
  employeeCount: z.number().int().nonnegative().optional(),
  supportAutomationNeed: z.boolean().optional(),
  hasRelevantContact: z.boolean().optional(),
});

const updateSchema = leadSchema.partial();

function validateId(id, res) {
  if (!mongoose.isValidObjectId(id)) {
    res.status(400).json({ error: "Invalid lead ID" });
    return false;
  }

  return true;
}

// POST /api/leads
export async function createLead(req, res, next) {
  try {
    const parsed = leadSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid lead data",
        details: parsed.error.issues,
      });
    }

    const lead = await Lead.create(parsed.data);

    return res.status(201).json({ lead });
  } catch (error) {
    next(error);
  }
}

// GET /api/leads
export async function getLeads(req, res, next) {
  try {
    const page = Number(req.query.page ?? 1);
    const limit = Number(req.query.limit ?? 10);

    if (
      !Number.isInteger(page) ||
      !Number.isInteger(limit) ||
      page < 1 ||
      limit < 1 ||
      limit > 100
    ) {
      return res.status(400).json({
        error: "page must be positive and limit must be between 1 and 100",
      });
    }

    const filter = {};

    if (typeof req.query.industry === "string") {
      filter.industry = req.query.industry;
    }

    const [leads, total] = await Promise.all([
      Lead.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Lead.countDocuments(filter),
    ]);

    return res.status(200).json({
      leads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/leads/:id
export async function getLeadById(req, res, next) {
  try {
    if (!validateId(req.params.id, res)) return;

    const lead = await Lead.findById(req.params.id).lean();

    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }

    return res.status(200).json({ lead });
  } catch (error) {
    next(error);
  }
}

// PATCH /api/leads/:id
export async function updateLead(req, res, next) {
  try {
    if (!validateId(req.params.id, res)) return;

    const parsed = updateSchema.safeParse(req.body);

    if (!parsed.success || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: "Provide valid fields to update",
        details: parsed.success ? undefined : parsed.error.issues,
      });
    }

    const lead = await Lead.findByIdAndUpdate(
      req.params.id,
      { $set: parsed.data },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }

    return res.status(200).json({ lead });
  } catch (error) {
    next(error);
  }
}

// DELETE /api/leads/:id
export async function deleteLead(req, res, next) {
  try {
    if (!validateId(req.params.id, res)) return;

    const lead = await Lead.findByIdAndDelete(req.params.id);

    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }

    return res.status(200).json({
      message: "Lead deleted successfully",
      id: lead._id,
    });
  } catch (error) {
    next(error);
  }
}

// POST /api/leads/:id/score
export async function scoreLeadById(req, res, next) {
  try {
    if (!validateId(req.params.id, res)) return;

    const icpSchema = z.object({
      industry: z.string().trim().min(1),
      minEmployees: z.number().int().nonnegative(),
      maxEmployees: z.number().int().nonnegative(),
    }).refine(
      (icp) => icp.minEmployees <= icp.maxEmployees,
      { message: "minEmployees cannot exceed maxEmployees" }
    );

    const parsed = icpSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        error: "Invalid ideal customer profile",
        details: parsed.error.issues,
      });
    }

    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ error: "Lead not found" });
    }

    const result = qualifyLead(
      lead.toObject(),
      parsed.data
    );

    lead.qualification = result;
    await lead.save();

    return res.status(200).json({
      leadId: lead._id,
      companyName: lead.companyName,
      qualification: lead.qualification,
    });
  } catch (error) {
    next(error);
  }
}

export async function generateLeadOutreach(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid lead ID",
      });
    }

    const lead = await Lead.findById(id);

    if (!lead) {
      return res.status(404).json({
        success: false,
        error: "Lead not found",
      });
    }

    const content = await generateOutreachDraft(lead.toObject());

    const draft = await OutreachDraft.create({
      lead: lead._id,
      content,
      model: process.env.GROQ_MODEL,
    });

    return res.status(201).json({
      success: true,
      message: "Outreach draft generated successfully",
      draft,
    });
  } catch (error) {
    next(error);
  }
}

export async function getLeadOutreach(req, res, next) {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({
        success: false,
        error: "Invalid lead ID",
      });
    }

    const leadExists = await Lead.exists({ _id: id });

    if (!leadExists) {
      return res.status(404).json({
        success: false,
        error: "Lead not found",
      });
    }

    const drafts = await OutreachDraft.find({ lead: id })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      count: drafts.length,
      drafts,
    });
  } catch (error) {
    next(error);
  }
}