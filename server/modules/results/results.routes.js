// =====================================================
// RESULTS ROUTES
// =====================================================

import express from "express";

import {
  create,
  getAll,
  getOne,
  update,
  remove,
  publish,
  unpublish,
} from "./results.controller.js";

const router = express.Router();

// GET all results
// Example:
// /api/results
// /api/results?className=10
// /api/results?session=2026-27
// /api/results?studentId=123
router.get("/", getAll);

// CREATE result
router.post("/", create);

// GET single result
router.get("/:id", getOne);

// UPDATE result
router.put("/:id", update);

// DELETE result
router.delete("/:id", remove);

// PUBLISH
router.patch("/:id/publish", publish);

// UNPUBLISH
router.patch("/:id/unpublish", unpublish);

export default router;