
// =====================================================
// MPSA SCHOOL
// ATTENDANCE ROUTES
// =====================================================

import express from "express";

import {
  getAttendanceStudents,
  getDateAttendance,
  getMonthAttendance,
  saveStudentAttendance,
  getStudentAttendanceController,
  getStudentAttendanceSummaryController,
  getClassAttendanceController,
  getAttendanceSummaryController,
  createHolidayController,
  getHolidaysController,
  deleteHolidayController,
} from "./attendance.controller.js";

const router = express.Router();

// =====================================================
// STUDENTS FOR ATTENDANCE
// =====================================================

router.get(
  "/students",
  getAttendanceStudents
);

// =====================================================
// DAILY ATTENDANCE
// =====================================================

router.get(
  "/date/:date",
  getDateAttendance
);

// =====================================================
// MONTHLY ATTENDANCE
// =====================================================

router.get(
  "/month/:month",
  getMonthAttendance
);

// =====================================================
// SAVE ATTENDANCE
// =====================================================

router.post(
  "/",
  saveStudentAttendance
);

// =====================================================
// STUDENT REPORT
// =====================================================

router.get(
  "/student/:studentId",
  getStudentAttendanceController
);

router.get(
  "/student/:studentId/summary",
  getStudentAttendanceSummaryController
);

// =====================================================
// CLASS REPORT
// =====================================================

router.get(
  "/class/:className",
  getClassAttendanceController
);

// =====================================================
// OVERALL SUMMARY
// =====================================================

router.get(
  "/summary",
  getAttendanceSummaryController
);

// =====================================================
// HOLIDAYS
// =====================================================

router.post(
  "/holiday",
  createHolidayController
);

router.get(
  "/holidays",
  getHolidaysController
);

router.delete(
  "/holiday/:id",
  deleteHolidayController
);

export default router;

