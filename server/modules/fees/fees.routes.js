import express from "express";
import {
  getFees,
  getStudentFee,
  updateFee,
  createPayment,
  feesStats,
} from "./fees.controller.js";
import { authenticate, authorizePermission } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticate);

// All students + their fees
router.get("/", authorizePermission("fees.view"), getFees);

// Fee statistics
router.get("/stats", authorizePermission("fees.view"), feesStats);

// Single student's fees
router.get("/student/:studentId", authorizePermission("fees.view"), getStudentFee);

// Create / update fee structure
router.put("/student/:studentId", authorizePermission("fees.edit"), updateFee);

// Add payment + generate receipt
router.post("/student/:studentId/payment", authorizePermission("fees.create"), createPayment);

export default router;