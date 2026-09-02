// =====================================================
// MPSA SCHOOL MANAGEMENT SYSTEM
// SUBJECTS ROUTES
// =====================================================

import express from "express";

import {
  create,
  getAll,
  getOne,
  getByClass,
  getSyllabus,
  update,
  updateSubjectSyllabus,
  remove,
  stats,
} from "./subjects.controller.js";

const router =
  express.Router();

// =====================================================
// STATISTICS
// IMPORTANT: KEEP BEFORE /:id
// =====================================================

router.get(
  "/stats",
  stats
);

// =====================================================
// GET SUBJECTS BY CLASS
//
// Example:
// /api/subjects/class/Class%205?section=A
// =====================================================

router.get(
  "/class/:className",
  getByClass
);

// =====================================================
// GET ALL SUBJECTS
//
// /api/subjects
// /api/subjects?className=Class%205
// /api/subjects?section=A
// /api/subjects?search=Hindi
// /api/subjects?teacherId=123
// =====================================================

router.get(
  "/",
  getAll
);

// =====================================================
// CREATE
// =====================================================

router.post(
  "/",
  create
);

// =====================================================
// GET SYLLABUS
//
// /api/subjects/:id/syllabus
// =====================================================

router.get(
  "/:id/syllabus",
  getSyllabus
);

// =====================================================
// UPDATE SYLLABUS
//
// PATCH /api/subjects/:id/syllabus
// =====================================================

router.patch(
  "/:id/syllabus",
  updateSubjectSyllabus
);

// =====================================================
// GET ONE
// =====================================================

router.get(
  "/:id",
  getOne
);

// =====================================================
// UPDATE
// =====================================================

router.put(
  "/:id",
  update
);

// =====================================================
// DELETE
// =====================================================

router.delete(
  "/:id",
  remove
);

export default router;