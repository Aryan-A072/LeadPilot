import { Router } from "express";
import {
  createLead,
  getLeads,
  getLeadById,
  updateLead,
  deleteLead,
  scoreLeadById,
} from "../controllers/lead.controller.js";
import { generateLeadOutreach, getLeadOutreach } from "../controllers/lead.controller.js";


const router = Router();

router.post("/", createLead);
router.get("/", getLeads);
router.get("/:id", getLeadById);
router.patch("/:id", updateLead);
router.delete("/:id", deleteLead);

// Qualify an existing lead and save its latest assessment.
router.post("/:id/score", scoreLeadById);

router.post("/:id/outreach", generateLeadOutreach);
router.get("/:id/outreach", getLeadOutreach);

export default router;