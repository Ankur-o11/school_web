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
import { authenticate, authorizePermission } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticate);

router.get("/students", authorizePermission("attendance.view"), getAttendanceStudents);
router.get("/date/:date", authorizePermission("attendance.view"), getDateAttendance);
router.get("/month/:month", authorizePermission("attendance.view"), getMonthAttendance);
router.post("/", authorizePermission("attendance.mark"), saveStudentAttendance);
router.get("/student/:studentId", authorizePermission("attendance.view"), getStudentAttendanceController);
router.get("/student/:studentId/summary", authorizePermission("attendance.view"), getStudentAttendanceSummaryController);
router.get("/class/:className", authorizePermission("attendance.view"), getClassAttendanceController);
router.get("/summary", authorizePermission("attendance.view"), getAttendanceSummaryController);
router.post("/holiday", authorizePermission("settings.manage"), createHolidayController);
router.get("/holidays", authorizePermission("attendance.view"), getHolidaysController);
router.delete("/holiday/:id", authorizePermission("settings.manage"), deleteHolidayController);

export default router;
