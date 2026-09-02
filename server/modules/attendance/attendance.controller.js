
// =====================================================
// MPSA SCHOOL
// ATTENDANCE CONTROLLER
// =====================================================

import {
  getStudentsForAttendance,
  getAttendanceByDate,
  getAttendanceByMonth,
  saveAttendance,
  getStudentAttendance,
  getStudentAttendanceSummary,
  getClassAttendance,
  getAttendanceSummary,
  createHoliday,
  getHolidays,
  deleteHoliday,
} from "./attendance.service.js";

// =====================================================
// STUDENTS
// =====================================================

export async function getAttendanceStudents(
  req,
  res,
  next
) {
  try {
    const students =
      await getStudentsForAttendance(
        req.app.locals.db
      );

    res.json({
      success: true,
      students,
    });
  } catch (error) {
    next(error);
  }
}

// =====================================================
// DATE ATTENDANCE
// =====================================================

export async function getDateAttendance(
  req,
  res,
  next
) {
  try {
    const records =
      await getAttendanceByDate(
        req.app.locals.db,
        req.params.date
      );

    res.json({
      success: true,
      records,
      attendance: records,
    });
  } catch (error) {
    next(error);
  }
}

// =====================================================
// MONTH ATTENDANCE
// =====================================================

export async function getMonthAttendance(
  req,
  res,
  next
) {
  try {
    const records =
      await getAttendanceByMonth(
        req.app.locals.db,
        req.params.month
      );

    res.json({
      success: true,
      records,
      attendance: records,
    });
  } catch (error) {
    next(error);
  }
}

// =====================================================
// SAVE ATTENDANCE
// =====================================================

export async function saveStudentAttendance(
  req,
  res,
  next
) {
  try {
    const records =
      req.body?.records;

    const result =
      await saveAttendance(
        req.app.locals.db,
        records
      );

    res.json({
      success: true,

      message:
        "Attendance saved successfully",

      records: result,

      attendance: result,
    });
  } catch (error) {
    next(error);
  }
}

// =====================================================
// STUDENT ATTENDANCE
// =====================================================

export async function getStudentAttendanceController(
  req,
  res,
  next
) {
  try {
    const records =
      await getStudentAttendance(
        req.app.locals.db,
        req.params.studentId,
        req.query.from,
        req.query.to
      );

    res.json({
      success: true,
      records,
      attendance: records,
    });
  } catch (error) {
    next(error);
  }
}

// =====================================================
// STUDENT SUMMARY
// =====================================================

export async function getStudentAttendanceSummaryController(
  req,
  res,
  next
) {
  try {
    const summary =
      await getStudentAttendanceSummary(
        req.app.locals.db,
        req.params.studentId,
        req.query.from,
        req.query.to
      );

    res.json({
      success: true,
      summary,
    });
  } catch (error) {
    next(error);
  }
}

// =====================================================
// CLASS REPORT
// =====================================================

export async function getClassAttendanceController(
  req,
  res,
  next
) {
  try {
    const result =
      await getClassAttendance(
        req.app.locals.db,
        req.params.className,
        req.query.section,
        req.query.from,
        req.query.to
      );

    res.json({
      success: true,
      students: result,
      records: result,
    });
  } catch (error) {
    next(error);
  }
}

// =====================================================
// OVERALL SUMMARY
// =====================================================

export async function getAttendanceSummaryController(
  req,
  res,
  next
) {
  try {
    const summary =
      await getAttendanceSummary(
        req.app.locals.db,
        req.query.from,
        req.query.to
      );

    res.json({
      success: true,
      summary,
    });
  } catch (error) {
    next(error);
  }
}

// =====================================================
// CREATE HOLIDAY
// =====================================================

export async function createHolidayController(
  req,
  res,
  next
) {
  try {
    const holiday =
      await createHoliday(
        req.app.locals.db,
        req.body
      );

    res.status(201).json({
      success: true,
      message:
        "Holiday created",
      holiday,
    });
  } catch (error) {
    next(error);
  }
}

// =====================================================
// GET HOLIDAYS
// =====================================================

export async function getHolidaysController(
  req,
  res,
  next
) {
  try {
    const holidays =
      await getHolidays(
        req.app.locals.db,
        req.query.from,
        req.query.to
      );

    res.json({
      success: true,
      holidays,
    });
  } catch (error) {
    next(error);
  }
}

// =====================================================
// DELETE HOLIDAY
// =====================================================

export async function deleteHolidayController(
  req,
  res,
  next
) {
  try {
    await deleteHoliday(
      req.app.locals.db,
      req.params.id
    );

    res.json({
      success: true,
      message:
        "Holiday deleted",
    });
  } catch (error) {
    next(error);
  }
}

