import express from "express";
import {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "./teachers.controller.js";
import { authenticate, authorizePermission } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticate);

router.get("/", authorizePermission("teachers.view"), getTeachers);
router.get("/:id", authorizePermission("teachers.view"), getTeacherById);
router.post("/", authorizePermission("teachers.create"), createTeacher);
router.put("/:id", authorizePermission("teachers.edit"), updateTeacher);
router.delete("/:id", authorizePermission("teachers.delete"), deleteTeacher);

export default router;
