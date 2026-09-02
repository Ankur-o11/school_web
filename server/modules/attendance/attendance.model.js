// =====================================================
// MPSA SCHOOL
// ATTENDANCE MODEL
// =====================================================

export const ATTENDANCE_COLLECTION =
  "student_attendance";

export const HOLIDAYS_COLLECTION =
  "school_holidays";

export const ATTENDANCE_STATUS = {
  PRESENT: "Present",
  ABSENT: "Absent",
  LEAVE: "Leave",
};


// =====================================================
// ATTENDANCE DOCUMENT
// =====================================================

export function createAttendanceDocument({
  studentId,
  date,
  status,
  academicYear = "2026-27",
}) {
  const now = new Date();

  return {
    studentId: String(studentId),
    date: String(date),
    status,
    academicYear,

    createdAt: now,
    updatedAt: now,
  };
}


// =====================================================
// HOLIDAY DOCUMENT
// =====================================================

export function createHolidayDocument({
  date,
  name,
  description = "",
}) {
  const now = new Date();

  return {
    date: String(date),
    name: String(name || "School Holiday"),
    description: String(description || ""),

    createdAt: now,
    updatedAt: now,
  };
}


// =====================================================
// INDEXES
// =====================================================

export const attendanceIndexes = [
  {
    key: {
      studentId: 1,
      date: 1,
    },

    options: {
      name: "studentId_date_unique",
      unique: true,
    },
  },

  {
    key: {
      date: 1,
    },

    options: {
      name: "attendance_date",
    },
  },

  {
    key: {
      status: 1,
    },

    options: {
      name: "attendance_status",
    },
  },
];


export const holidayIndexes = [
  {
    key: {
      date: 1,
    },

    options: {
      name: "holiday_date_unique",
      unique: true,
    },
  },
];