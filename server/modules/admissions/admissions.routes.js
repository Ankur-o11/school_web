import express from "express";
import {
  listAdmissions,
  getPublicAdmission,
  getPublicAdmissionByToken,
  registerOnlineAdmission,
  updateOnlineAdmission,
  handleRequestCorrection,
  getAdmission,
  addAdmission,
  updateAdmissionChecklist,
  changeAdmissionStatus,
  confirmAdmission,
  sendWhatsAppReminder,
} from "./admissions.controller.js";

import { authenticate, authorizePermission } from "../../middleware/auth.middleware.js";

const router = express.Router();

// Public routes (No auth required for parents to register or track applications)
router.post("/online", registerOnlineAdmission);
router.get("/track/:token", getPublicAdmissionByToken);
router.patch("/track/:token", updateOnlineAdmission);
router.get("/public/:id", getPublicAdmission);

// Protected routes (Admin / Staff)
router.use(authenticate);

router.get("/", authorizePermission("admissions.view"), listAdmissions);
router.get("/:id", authorizePermission("admissions.view"), getAdmission);
router.post("/", authorizePermission("admissions.create"), addAdmission);
router.patch("/:id/request-correction", authorizePermission("admissions.edit"), handleRequestCorrection);
router.put("/:id/checklist", authorizePermission("admissions.edit"), updateAdmissionChecklist);
router.patch("/:id/checklist", authorizePermission("admissions.edit"), updateAdmissionChecklist);
router.put("/:id/status", authorizePermission("admissions.edit"), changeAdmissionStatus);
router.patch("/:id/status", authorizePermission("admissions.edit"), changeAdmissionStatus);
router.post("/:id/confirm", authorizePermission("admissions.edit"), confirmAdmission);
router.post("/:id/whatsapp-reminder", authorizePermission("admissions.view"), sendWhatsAppReminder);
router.get("/:id/whatsapp-reminder", authorizePermission("admissions.view"), sendWhatsAppReminder);

export default router;
