import express from "express";
import { authenticate, authorizePermission } from "../../middleware/auth.middleware.js";
import {
  getAllTemplates,
  getTemplateByKey,
  updateTemplate,
  resetTemplate,
} from "./templates.service.js";

const router = express.Router();

// GET /api/communication-templates (Get all 10 templates)
router.get("/", authenticate, authorizePermission("settings.manage"), async (req, res) => {
  try {
    const list = await getAllTemplates();
    res.json({ success: true, templates: list, data: list });
  } catch (err) {
    console.error("GET /api/communication-templates error:", err);
    res.status(500).json({ success: false, message: "Failed to load templates", error: err.message });
  }
});

// GET /api/communication-templates/:key
router.get("/:key", authenticate, authorizePermission("settings.manage"), async (req, res) => {
  try {
    const tpl = await getTemplateByKey(req.params.key);
    if (!tpl) {
      return res.status(404).json({ success: false, message: "Template not found" });
    }
    res.json({ success: true, template: tpl, data: tpl });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to load template", error: err.message });
  }
});

// PUT /api/communication-templates/:key (Edit template)
router.put("/:key", authenticate, authorizePermission("settings.manage"), async (req, res) => {
  try {
    const { subject, body } = req.body;
    const updated = await updateTemplate(req.params.key, { subject, body });
    res.json({ success: true, message: "Template updated successfully", template: updated, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || "Failed to update template" });
  }
});

// POST /api/communication-templates/:key/reset (Reset template to default)
router.post("/:key/reset", authenticate, authorizePermission("settings.manage"), async (req, res) => {
  try {
    const reset = await resetTemplate(req.params.key);
    res.json({ success: true, message: "Template reset to default", template: reset, data: reset });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message || "Failed to reset template" });
  }
});

export default router;
