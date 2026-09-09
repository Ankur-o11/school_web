import express from "express";

import {
  listStudents,
  getStudent,
  addStudent,
  editStudent,
  removeStudent,
  studentStats,
} from "./students.controller.js";
import { authenticate, authorizePermission } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticate);

// GET /api/students/stats
router.get("/stats", authorizePermission("students.view"), studentStats);

// GET /api/students
router.get("/", authorizePermission("students.view"), listStudents);

// GET /api/students/:id
router.get("/:id", authorizePermission("students.view"), getStudent);

// POST /api/students
router.post("/", authorizePermission("students.create"), addStudent);

// PUT /api/students/:id
router.put("/:id", authorizePermission("students.edit"), editStudent);

// DELETE /api/students/:id
router.delete("/:id", authorizePermission("students.delete"), removeStudent);

export default router;