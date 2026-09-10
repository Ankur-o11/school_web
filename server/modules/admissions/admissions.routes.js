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
  handleApproveApplication,
  handleRejectApplication,
  handleRequestDocuments,
  handleAddDocument,
  handleUpdateDocumentStatus,
  handleDeleteDocument,
  handleResendNotification,
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

// Status transition actions
router.post("/:id/approve", authorizePermission("admissions.edit"), handleApproveApplication);
router.post("/:id/reject", authorizePermission("admissions.edit"), handleRejectApplication);
router.post("/:id/request-documents", authorizePermission("admissions.edit"), handleRequestDocuments);
router.patch("/:id/request-correction", authorizePermission("admissions.edit"), handleRequestCorrection);

// Document Manager actions
router.post("/:id/documents", authorizePermission("admissions.edit"), handleAddDocument);
router.patch("/:id/documents/:docId", authorizePermission("admissions.edit"), handleUpdateDocumentStatus);
router.delete("/:id/documents/:docId", authorizePermission("admissions.edit"), handleDeleteDocument);

// Manual Notification Resend
router.post("/:id/resend-notification", authorizePermission("admissions.view"), handleResendNotification);

// Checklist & Legacy status actions
router.put("/:id/checklist", authorizePermission("admissions.edit"), updateAdmissionChecklist);
router.patch("/:id/checklist", authorizePermission("admissions.edit"), updateAdmissionChecklist);
router.put("/:id/status", authorizePermission("admissions.edit"), changeAdmissionStatus);
router.patch("/:id/status", authorizePermission("admissions.edit"), changeAdmissionStatus);
router.post("/:id/confirm", authorizePermission("admissions.edit"), confirmAdmission);
router.post("/:id/whatsapp-reminder", authorizePermission("admissions.view"), sendWhatsAppReminder);
router.get("/:id/whatsapp-reminder", authorizePermission("admissions.view"), sendWhatsAppReminder);

export default router;
