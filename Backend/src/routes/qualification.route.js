import { Router } from "express";
import { z } from "zod";
import { qualifyLead } from "../services/qualification.service.js";

const router = Router();

const requestSchema = z.object({
  lead: z.object({
    industry: z.string().optional(),
    employeeCount: z.number().int().nonnegative().optional(),
    supportAutomationNeed: z.boolean().optional(),
    hasRelevantContact: z.boolean().optional(),
  }),
  icp: z.object({
    industry: z.string().min(1),
    minEmployees: z.number().int().nonnegative(),
    maxEmployees: z.number().int().nonnegative(),
  }),
});

router.post("/score", (req, res) => {
  const parsed = requestSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      error: "Invalid qualification request",
      details: parsed.error.issues,
    });
  }

  const { lead, icp } = parsed.data;

  if (icp.minEmployees > icp.maxEmployees) {
    return res.status(400).json({
      error: "minEmployees cannot exceed maxEmployees",
    });
  }

  return res.status(200).json(qualifyLead(lead, icp));
});

export default router;