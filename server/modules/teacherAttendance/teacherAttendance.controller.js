import { getDatabase } from "../../config/database.js";
import { ObjectId } from "mongodb";
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

// GET /api/teacher-attendance/month/:month (e.g. 2026-09)
export async function getTeacherAttendanceByMonth(req, res) {
  try {
    const { month } = req.params;
    const db = getDatabase();
    const collection = db.collection("teacher_attendance");

    const records = await collection
      .find({ date: { $regex: `^${month}` } })
      .toArray();

    return res.status(200).json(records.map(cleanDocument));
  } catch (error) {
    console.error("getTeacherAttendanceByMonth error:", error);
    return res.status(500).json({ success: false, message: "Failed to fetch teacher attendance." });
  }
}

// POST /api/teacher-attendance
export async function saveTeacherAttendance(req, res) {
  try {
    const { date, attendanceData } = req.body;
    if (!date || !attendanceData) {
      return res.status(400).json({ success: false, message: "Date and attendance data are required." });
    }

    const db = getDatabase();
    const collection = db.collection("teacher_attendance");

    const bulkOps = Object.keys(attendanceData).map((teacherId) => {
      const item = attendanceData[teacherId];
      return {
        updateOne: {
          filter: { teacherId, date },
          update: {
            $set: {
              teacherId,
              date,
              status: item.status || "Present",
              leaveType: item.leaveType || "Unpaid",
              remark: item.remark || "",
              updatedAt: new Date(),
            },
          },
          upsert: true,
        },
      };
    });

    if (bulkOps.length > 0) {
      await collection.bulkWrite(bulkOps);
    }

    await logActivity(req, "TEACHER_ATTENDANCE_SAVED", "TEACHER_ATTENDANCE", { date, count: bulkOps.length });

    return res.status(200).json({ success: true, message: "Teacher attendance saved successfully." });
  } catch (error) {
    console.error("saveTeacherAttendance error:", error);
    return res.status(500).json({ success: false, message: "Failed to save teacher attendance." });
  }
}
