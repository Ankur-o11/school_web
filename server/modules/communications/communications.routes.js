import express from "express";
import {
  getTemplates,
  saveTemplate,
  deleteTemplate,
  logCommunication,
  getAllCommunicationLogs,
  getStudentCommunicationHistory,
  compileStudentCommunication,
  compileBulkCommunication,
} from "./communications.controller.js";
import { authenticate, authorizePermission } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticate);

router.get("/templates", authorizePermission("communications.view"), getTemplates);
router.post("/templates", authorizePermission("communications.templates.manage"), saveTemplate);
router.delete("/templates/:id", authorizePermission("communications.templates.manage"), deleteTemplate);

router.post("/compile-student", authorizePermission("communications.view"), compileStudentCommunication);
router.post("/compile-bulk", authorizePermission("communications.view"), compileBulkCommunication);

router.post("/log", authorizePermission("communications.send"), logCommunication);
router.get("/logs", authorizePermission("communications.history.view"), getAllCommunicationLogs);
router.get("/history/:studentId", authorizePermission("communications.history.view"), getStudentCommunicationHistory);

export default router;
