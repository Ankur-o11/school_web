// =====================================================
// MPSA SCHOOL
// FEES ROUTES
// =====================================================

import express from "express";

import {
  getFees,
  getStudentFee,
  updateFee,
  createPayment,
  feesStats,
} from "./fees.controller.js";

const router = express.Router();

// All students + their fees
router.get("/", getFees);

// Fee statistics
router.get("/stats", feesStats);

// Single student's fees
router.get(
  "/student/:studentId",
  getStudentFee
);

// Create / update fee structure
router.put(
  "/student/:studentId",
  updateFee
);

// Add payment + generate receipt
router.post(
  "/student/:studentId/payment",
  createPayment
);

export default router;