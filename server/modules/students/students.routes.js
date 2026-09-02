import express from "express";

import {
  listStudents,
  getStudent,
  addStudent,
  editStudent,
  removeStudent,
  studentStats,
} from "./students.controller.js";

const router = express.Router();

// GET /api/students
router.get("/", listStudents);

// GET /api/students/stats
router.get("/stats", studentStats);

// GET /api/students/:id
router.get("/:id", getStudent);

// POST /api/students
router.post("/", addStudent);

// PUT /api/students/:id
router.put("/:id", editStudent);

// DELETE /api/students/:id
router.delete("/:id", removeStudent);

export default router;