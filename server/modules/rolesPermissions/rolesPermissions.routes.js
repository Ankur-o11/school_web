import express from "express";
import {
  getRolesAndPermissions,
  updateRolePermissions,
} from "./rolesPermissions.controller.js";
import { authenticate, authorizePermission } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticate);

router.get("/", authorizePermission("settings.manage"), getRolesAndPermissions);
router.put("/", authorizePermission("settings.manage"), updateRolePermissions);

export default router;
