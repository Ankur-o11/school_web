import express from "express";
import { getActivityLogs } from "./activityLog.controller.js";
import { authenticate, authorizePermission } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticate);

router.get("/", authorizePermission("settings.manage"), getActivityLogs);

export default router;