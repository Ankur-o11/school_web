// =====================================================
// MPSA SCHOOL MANAGEMENT SYSTEM
// ACTIVITY LOG ROUTES
// =====================================================

import express from "express";

import {
  getAll,
  getOne,
  create,
  remove,
} from "./activityLog.controller.js";

const router = express.Router();

// =====================================================
// GET ALL ACTIVITY LOGS
// GET /api/activity-logs
// =====================================================

router.get("/", getAll);

// =====================================================
// GET SINGLE ACTIVITY LOG
// GET /api/activity-logs/:id
// =====================================================

router.get("/:id", getOne);

// =====================================================
// CREATE ACTIVITY LOG
// POST /api/activity-logs
// =====================================================

router.post("/", create);

// =====================================================
// DELETE ACTIVITY LOG
// DELETE /api/activity-logs/:id
// =====================================================

router.delete("/:id", remove);

export default router;