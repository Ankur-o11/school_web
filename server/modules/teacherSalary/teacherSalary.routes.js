import express from "express";
import {
  getTeacherSalariesByMonth,
  processTeacherSalary,
} from "./teacherSalary.controller.js";
import { authenticate, authorizePermission } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticate);

router.get("/month/:month", authorizePermission("salary.view"), getTeacherSalariesByMonth);
router.post("/process", authorizePermission("salary.create"), processTeacherSalary);

export default router;
