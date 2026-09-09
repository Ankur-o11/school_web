import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "./users.controller.js";
import { authenticate, authorizePermission } from "../../middleware/auth.middleware.js";

const router = express.Router();

// All user management routes require authentication and user management permissions
router.use(authenticate);

router.get("/", authorizePermission("users.view"), getUsers);
router.get("/:id", authorizePermission("users.view"), getUserById);
router.post("/", authorizePermission("users.create"), createUser);
router.put("/:id", authorizePermission("users.edit"), updateUser);
router.delete("/:id", authorizePermission("users.disable"), deleteUser);

export default router;
