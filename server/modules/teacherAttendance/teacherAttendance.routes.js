import express from "express";
import {
  getTeacherAttendanceByMonth,
  saveTeacherAttendance,
} from "./teacherAttendance.controller.js";
import { authenticate, authorizePermission } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticate);

router.get("/month/:month", authorizePermission("attendance.view"), getTeacherAttendanceByMonth);
router.post("/", authorizePermission("attendance.mark"), saveTeacherAttendance);

export default router;
