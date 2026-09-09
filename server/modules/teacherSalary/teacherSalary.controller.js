import { getDatabase } from "../../config/database.js";
import { logActivity } from "../../utils/logger.js";

function cleanDocument(doc) {
  if (!doc) return null;
  const cleaned = {
    ...doc,
    id: doc._id ? doc._id.toString() : doc.id,
  };
  delete cleaned._id;
  return cleaned;
}

// GET /api/teacher-salary/month/:month (e.g. 2026-09)
export async function getTeacherSalariesByMonth(req, res) {
  try {
    const { month } = req.params;
    const db = getDatabase();
    const salaryCollection = db.collection("teacher_salaries");
    const teachersCollection = db.collection("teachers");
    const attendanceCollection = db.collection("teacher_attendance");

    const existingSalaries = await salaryCollection
      .find({ month })
      .toArray();

    if (existingSalaries.length > 0) {
      return res.status(200).json(existingSalaries.map(cleanDocument));
    }

    // Calculate dynamic salary based on attendance if no record saved yet
    const teachers = await teachersCollection.find({ status: "Active" }).toArray();
    const attendanceRecords = await attendanceCollection
      .find({ date: { $regex: `^${month}` } })
      .toArray();

    const daysInMonth = 30; // standard school month base

    const calculatedList = teachers.map((teacher) => {
      const teacherIdStr = teacher._id ? teacher._id.toString() : teacher.id;
      const tAttendance = attendanceRecords.filter(
        (a) => a.teacherId === teacherIdStr || a.teacherId === teacher.employeeId
      );

      const presentDays = tAttendance.filter((a) => a.status === "Present").length;
      const paidLeaveDays = tAttendance.filter((a) => a.status === "Leave" && a.leaveType === "Paid").length;
      const unpaidLeaveDays = tAttendance.filter((a) => a.status === "Leave" && a.leaveType === "Unpaid").length;
      const absentDays = tAttendance.filter((a) => a.status === "Absent").length;

      const monthlySalary = Number(teacher.monthlySalary) || 0;
      const perDaySalary = monthlySalary > 0 ? monthlySalary / daysInMonth : 0;
      const deductionDays = absentDays + unpaidLeaveDays;
      const leaveDeduction = Math.round(deductionDays * perDaySalary);
      const finalSalary = Math.max(0, monthlySalary - leaveDeduction);

      return {
        teacherId: teacherIdStr,
        teacherName: teacher.name,
        employeeId: teacher.employeeId || "",
        month,
        monthlySalary,
        presentDays,
        paidLeaveDays,
        unpaidLeaveDays,
        absentDays,
        deductionDays,
        perDaySalary: Math.round(perDaySalary),
        leaveDeduction,
        finalSalary,
        status: "Pending",
      };
    });

    return res.status(200).json(calculatedList);
  } catch (error) {
    console.error("getTeacherSalariesByMonth error:", error);
    return res.status(500).json({ success: false, message: "Failed to compute teacher salaries." });
  }
}

// POST /api/teacher-salary/process
export async function processTeacherSalary(req, res) {
  try {
    const { month, salaries } = req.body;
    if (!month || !Array.isArray(salaries)) {
      return res.status(400).json({ success: false, message: "Month and salaries array are required." });
    }

    const db = getDatabase();
    const salaryCollection = db.collection("teacher_salaries");

    const bulkOps = salaries.map((item) => ({
      updateOne: {
        filter: { teacherId: item.teacherId, month },
        update: {
          $set: {
            ...item,
            month,
            status: "Paid",
            paidAt: new Date(),
            updatedAt: new Date(),
          },
        },
        upsert: true,
      },
    }));

    if (bulkOps.length > 0) {
      await salaryCollection.bulkWrite(bulkOps);
    }

    await logActivity(req, "TEACHER_SALARY_PROCESSED", "TEACHER_SALARY", { month, count: bulkOps.length });

    return res.status(200).json({ success: true, message: "Teacher salaries processed successfully." });
  } catch (error) {
    console.error("processTeacherSalary error:", error);
    return res.status(500).json({ success: false, message: "Failed to process teacher salary." });
  }
}
