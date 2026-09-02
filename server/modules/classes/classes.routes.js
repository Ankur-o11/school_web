import express from "express";

import {
  listClasses,
  getClass,
  addClass,
  editClass,
  removeClass,
  classStats,
} from "./classes.controller.js";

const router = express.Router();

// GET /api/classes
router.get("/", listClasses);

// GET /api/classes/stats
router.get("/stats", classStats);

// GET /api/classes/:id
router.get("/:id", getClass);

// POST /api/classes
router.post("/", addClass);

// PUT /api/classes/:id
router.put("/:id", editClass);

// DELETE /api/classes/:id
router.delete("/:id", removeClass);

export default router;