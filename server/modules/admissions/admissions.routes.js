import express from "express";
import {
  listAdmissions,
  getPublicAdmission,
  getAdmission,
  addAdmission,
  updateAdmissionChecklist,
  changeAdmissionStatus,
  confirmAdmission,
  sendWhatsAppReminder,
} from "./admissions.controller.js";

import { authenticate, authorizePermission } from "../../middleware/auth.middleware.js";

const router = express.Router();

// Public parent status route (No auth required for parents to track application)
router.get("/public/:id", getPublicAdmission);

// Protected routes (Admin / Staff)
router.use(authenticate);

router.get("/", authorizePermission("admissions.view"), listAdmissions);
router.get("/:id", authorizePermission("admissions.view"), getAdmission);
router.post("/", authorizePermission("admissions.create"), addAdmission);
router.put("/:id/checklist", authorizePermission("admissions.edit"), updateAdmissionChecklist);
router.patch("/:id/checklist", authorizePermission("admissions.edit"), updateAdmissionChecklist);
router.put("/:id/status", authorizePermission("admissions.edit"), changeAdmissionStatus);
router.patch("/:id/status", authorizePermission("admissions.edit"), changeAdmissionStatus);
router.post("/:id/confirm", authorizePermission("admissions.edit"), confirmAdmission);
router.post("/:id/whatsapp-reminder", authorizePermission("admissions.view"), sendWhatsAppReminder);
router.get("/:id/whatsapp-reminder", authorizePermission("admissions.view"), sendWhatsAppReminder);

export default router;
