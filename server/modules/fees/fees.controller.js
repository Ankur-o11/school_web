// =====================================================
// MPSA SCHOOL
// FEES CONTROLLER
// =====================================================

import {
  getStudentsWithFees,
  getStudentFees,
  updateStudentFees,
  addPayment,
  getFeesStats,
} from "./fees.service.js";

// =====================================================
// GET ALL FEES
// GET /api/fees
// =====================================================

export async function getFees(req, res, next) {
  try {
    const db = req.app.locals.db;

    const academicYear =
      req.query.academicYear;

    const fees =
      await getStudentsWithFees(
        db,
        academicYear
          ? { academicYear }
          : {}
      );

    res.json({
      success: true,
      fees,
    });
  } catch (error) {
    next(error);
  }
}

// =====================================================
// GET SINGLE STUDENT FEE
// GET /api/fees/student/:studentId
// =====================================================

export async function getStudentFee(
  req,
  res,
  next
) {
  try {
    const db = req.app.locals.db;

    const {
      studentId,
    } = req.params;

    const academicYear =
      req.query.academicYear;

    const fee =
      await getStudentFees(
        db,
        studentId,
        academicYear
      );

    res.json({
      success: true,
      fee,
    });
  } catch (error) {
    next(error);
  }
}

// =====================================================
// UPDATE FEE STRUCTURE
// PUT /api/fees/student/:studentId
// =====================================================

export async function updateFee(
  req,
  res,
  next
) {
  try {
    const db = req.app.locals.db;

    const {
      studentId,
    } = req.params;

    const fee =
      await updateStudentFees(
        db,
        studentId,
        req.body
      );

    res.json({
      success: true,
      message: "Fee structure updated successfully",
      fee,
    });
  } catch (error) {
    next(error);
  }
}

// =====================================================
// CREATE PAYMENT
// POST /api/fees/student/:studentId/payment
// =====================================================

export async function createPayment(
  req,
  res,
  next
) {
  try {
    const db = req.app.locals.db;

    const {
      studentId,
    } = req.params;

    const payment =
      await addPayment(
        db,
        studentId,
        req.body
      );

    res.status(201).json({
      success: true,
      message: "Payment saved successfully",
      payment,
    });
  } catch (error) {
    next(error);
  }
}

// =====================================================
// FEES STATS
// GET /api/fees/stats
// =====================================================

export async function feesStats(
  req,
  res,
  next
) {
  try {
    const db = req.app.locals.db;

    const academicYear =
      req.query.academicYear;

    const stats =
      await getFeesStats(
        db,
        academicYear
      );

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    next(error);
  }
}