
// =====================================================
// MPSA SCHOOL
// ATTENDANCE SERVICE
// MongoDB Attendance Logic
// =====================================================

import { ObjectId } from "mongodb";

import {
  ATTENDANCE_COLLECTION,
  HOLIDAYS_COLLECTION,
  ATTENDANCE_STATUS,
  createAttendanceDocument,
  createHolidayDocument,
} from "./attendance.model.js";

// =====================================================
// COLLECTIONS
// =====================================================

function attendanceCollection(db) {
  return db.collection(ATTENDANCE_COLLECTION);
}

function holidaysCollection(db) {
  return db.collection(HOLIDAYS_COLLECTION);
}

function studentsCollection(db) {
  return db.collection("students");
}

// =====================================================
// OBJECT ID HELPER
// =====================================================

function toObjectId(id) {
  if (!id) return null;

  try {
    if (id instanceof ObjectId) {
      return id;
    }

    if (ObjectId.isValid(id)) {
      return new ObjectId(id);
    }

    return null;
  } catch {
    return null;
  }
}

// =====================================================
// STUDENT ID NORMALIZER
// =====================================================

function studentIdQuery(studentId) {
  const objectId = toObjectId(studentId);

  if (objectId) {
    return {
      $or: [
        {
          studentId: objectId,
        },
        {
          studentId: String(studentId),
        },
      ],
    };
  }

  return {
    studentId: String(studentId),
  };
}

// =====================================================
// CLEAN STUDENT
// =====================================================

function cleanStudent(student) {
  if (!student) return null;

  const cleaned = {
    ...student,

    id: student._id
      ? student._id.toString()
      : student.id,
  };

  delete cleaned._id;

  return cleaned;
}

// =====================================================
// CLEAN ATTENDANCE
// =====================================================

function cleanAttendance(record) {
  if (!record) return null;

  const cleaned = {
    ...record,

    id: record._id
      ? record._id.toString()
      : record.id,

    studentId:
      record.studentId instanceof ObjectId
        ? record.studentId.toString()
        : String(record.studentId || ""),
  };

  delete cleaned._id;

  return cleaned;
}

// =====================================================
// CLEAN HOLIDAY
// =====================================================

function cleanHoliday(holiday) {
  if (!holiday) return null;

  const cleaned = {
    ...holiday,

    id: holiday._id
      ? holiday._id.toString()
      : holiday.id,
  };

  delete cleaned._id;

  return cleaned;
}

// =====================================================
// GET STUDENTS FOR ATTENDANCE
// =====================================================

export async function getStudentsForAttendance(db) {
  const students = await studentsCollection(db)
    .find({
      status: {
        $ne: "Inactive",
      },
    })
    .sort({
      class: 1,
      section: 1,
      rollNo: 1,
      name: 1,
    })
    .toArray();

  return students.map(cleanStudent);
}

// =====================================================
// GET ATTENDANCE BY DATE
// =====================================================

export async function getAttendanceByDate(
  db,
  date
) {
  if (!date) {
    throw new Error("Date is required");
  }

  const records =
    await attendanceCollection(db)
      .find({
        date: String(date),
      })
      .sort({
        date: 1,
      })
      .toArray();

  return records.map(cleanAttendance);
}

// =====================================================
// GET ATTENDANCE BY MONTH
// =====================================================

export async function getAttendanceByMonth(
  db,
  month
) {
  if (!month) {
    throw new Error("Month is required");
  }

  const monthString =
    String(month).trim();

  if (!/^\d{4}-\d{2}$/.test(monthString)) {
    throw new Error(
      "Invalid month format. Expected YYYY-MM"
    );
  }

  const records =
    await attendanceCollection(db)
      .find({
        date: {
          $regex: `^${monthString}-`,
        },
      })
      .sort({
        date: 1,
      })
      .toArray();

  return records.map(cleanAttendance);
}

// =====================================================
// SAVE ATTENDANCE
// =====================================================

export async function saveAttendance(
  db,
  records = []
) {
  if (!Array.isArray(records)) {
    throw new Error(
      "Attendance records must be an array"
    );
  }

  if (records.length === 0) {
    throw new Error(
      "No attendance records received"
    );
  }

  const collection =
    attendanceCollection(db);

  const savedRecords = [];

  for (const record of records) {
    const studentId =
      record?.studentId;

    const date =
      record?.date;

    const status =
      record?.status;

    if (!studentId || !date) {
      continue;
    }

    if (
      ![
        ATTENDANCE_STATUS.PRESENT,
        ATTENDANCE_STATUS.ABSENT,
        ATTENDANCE_STATUS.LEAVE,
      ].includes(status)
    ) {
      continue;
    }

    // -------------------------------------------------
    // FIND STUDENT
    // -------------------------------------------------

    const studentObjectId =
      toObjectId(studentId);

    let student = null;

    if (studentObjectId) {
      student =
        await studentsCollection(db).findOne({
          _id: studentObjectId,
        });
    }

    if (!student) {
      student =
        await studentsCollection(db).findOne({
          id: String(studentId),
        });
    }

    if (!student) {
      console.warn(
        `Student not found: ${studentId}`
      );

      continue;
    }

    // -------------------------------------------------
    // DATABASE STUDENT ID
    // -------------------------------------------------

    const databaseStudentId =
      student._id
        ? student._id.toString()
        : String(student.id);

    // -------------------------------------------------
    // UPSERT QUERY
    // -------------------------------------------------

    const query = {
      $and: [
        {
          date: String(date),
        },

        studentIdQuery(
          databaseStudentId
        ),
      ],
    };

    const now = new Date();

    await collection.updateOne(
      query,
      {
        $set: {
          studentId:
            databaseStudentId,

          date:
            String(date),

          status,

          updatedAt:
            now,
        },

        $setOnInsert: {
          createdAt:
            now,
        },
      },
      {
        upsert: true,
      }
    );

    const saved =
      await collection.findOne(
        query
      );

    if (saved) {
      savedRecords.push(
        cleanAttendance(saved)
      );
    }
  }

  return savedRecords;
}

// =====================================================
// GET SINGLE STUDENT ATTENDANCE
// =====================================================

export async function getStudentAttendance(
  db,
  studentId,
  from,
  to
) {
  if (!studentId) {
    throw new Error(
      "Student ID is required"
    );
  }

  const query = {
    ...studentIdQuery(studentId),
  };

  if (from || to) {
    query.date = {};

    if (from) {
      query.date.$gte =
        String(from);
    }

    if (to) {
      query.date.$lte =
        String(to);
    }
  }

  const records =
    await attendanceCollection(db)
      .find(query)
      .sort({
        date: 1,
      })
      .toArray();

  return records.map(
    cleanAttendance
  );
}

// =====================================================
// STUDENT ATTENDANCE SUMMARY
// =====================================================

export async function getStudentAttendanceSummary(
  db,
  studentId,
  from,
  to
) {
  const records =
    await getStudentAttendance(
      db,
      studentId,
      from,
      to
    );

  let present = 0;
  let absent = 0;
  let leave = 0;

  records.forEach(
    (record) => {
      if (
        record.status ===
        ATTENDANCE_STATUS.PRESENT
      ) {
        present++;
      }

      if (
        record.status ===
        ATTENDANCE_STATUS.ABSENT
      ) {
        absent++;
      }

      if (
        record.status ===
        ATTENDANCE_STATUS.LEAVE
      ) {
        leave++;
      }
    }
  );

  const workingDays =
    present +
    absent +
    leave;

  const average =
    workingDays > 0
      ? Number(
          (
            (present /
              workingDays) *
            100
          ).toFixed(1)
        )
      : 0;

  return {
    studentId:
      String(studentId),

    present,
    absent,
    leave,

    workingDays,

    totalMarkedDays:
      records.length,

    average,

    attendancePercentage:
      average,

    records,
  };
}

// =====================================================
// CLASS ATTENDANCE
// =====================================================

export async function getClassAttendance(
  db,
  className,
  section,
  from,
  to
) {
  if (!className) {
    throw new Error(
      "Class name is required"
    );
  }

  const studentQuery = {
    class:
      String(className),

    status: {
      $ne: "Inactive",
    },
  };

  if (
    section &&
    String(section) !== "All"
  ) {
    studentQuery.section =
      String(section);
  }

  const students =
    await studentsCollection(db)
      .find(studentQuery)
      .sort({
        rollNo: 1,
        name: 1,
      })
      .toArray();

  if (!students.length) {
    return [];
  }

  const attendanceQuery = {};

  if (from || to) {
    attendanceQuery.date = {};

    if (from) {
      attendanceQuery.date.$gte =
        String(from);
    }

    if (to) {
      attendanceQuery.date.$lte =
        String(to);
    }
  }

  const attendanceRecords =
    await attendanceCollection(db)
      .find(attendanceQuery)
      .toArray();

  const attendanceMap = {};

  attendanceRecords.forEach(
    (record) => {
      const studentId =
        record.studentId instanceof
        ObjectId
          ? record.studentId.toString()
          : String(
              record.studentId
            );

      if (
        !attendanceMap[
          studentId
        ]
      ) {
        attendanceMap[
          studentId
        ] = {};
      }

      attendanceMap[
        studentId
      ][record.date] =
        record.status;
    }
  );

  return students.map(
    (student) => {
      const studentId =
        student._id
          ? student._id.toString()
          : String(student.id);

      const records =
        attendanceMap[
          studentId
        ] || {};

      let present = 0;
      let absent = 0;
      let leave = 0;

      Object.values(
        records
      ).forEach(
        (status) => {
          if (
            status ===
            ATTENDANCE_STATUS.PRESENT
          ) {
            present++;
          }

          if (
            status ===
            ATTENDANCE_STATUS.ABSENT
          ) {
            absent++;
          }

          if (
            status ===
            ATTENDANCE_STATUS.LEAVE
          ) {
            leave++;
          }
        }
      );

      const workingDays =
        present +
        absent +
        leave;

      const average =
        workingDays > 0
          ? Number(
              (
                (present /
                  workingDays) *
                100
              ).toFixed(1)
            )
          : 0;

      return {
        student:
          cleanStudent(
            student
          ),

        studentId,

        name:
          student.name ||
          "",

        class:
          student.class ||
          student.className ||
          "",

        section:
          student.section ||
          "",

        rollNo:
          student.rollNo ||
          student.roll ||
          "",

        father:
          student.father ||
          student.fatherName ||
          "",

        present,
        absent,
        leave,

        workingDays,

        average,

        attendancePercentage:
          average,

        records,
      };
    }
  );
}

// =====================================================
// OVERALL ATTENDANCE SUMMARY
// =====================================================

export async function getAttendanceSummary(
  db,
  from,
  to
) {
  const query = {};

  if (from || to) {
    query.date = {};

    if (from) {
      query.date.$gte =
        String(from);
    }

    if (to) {
      query.date.$lte =
        String(to);
    }
  }

  const records =
    await attendanceCollection(db)
      .find(query)
      .toArray();

  let present = 0;
  let absent = 0;
  let leave = 0;

  records.forEach(
    (record) => {
      if (
        record.status ===
        ATTENDANCE_STATUS.PRESENT
      ) {
        present++;
      }

      if (
        record.status ===
        ATTENDANCE_STATUS.ABSENT
      ) {
        absent++;
      }

      if (
        record.status ===
        ATTENDANCE_STATUS.LEAVE
      ) {
        leave++;
      }
    }
  );

  const totalMarked =
    present +
    absent +
    leave;

  const average =
    totalMarked > 0
      ? Number(
          (
            (present /
              totalMarked) *
            100
          ).toFixed(1)
        )
      : 0;

  const uniqueDates = [
    ...new Set(
      records.map(
        (record) =>
          record.date
      )
    ),
  ];

  return {
    from:
      from || null,

    to:
      to || null,

    present,
    absent,
    leave,

    totalMarked,

    average,

    workingDays:
      uniqueDates.length,

    dates:
      uniqueDates.sort(),

    records:
      records.map(
        cleanAttendance
      ),
  };
}

// =====================================================
// CREATE HOLIDAY
// =====================================================

export async function createHoliday(
  db,
  data = {}
) {
  const date =
    String(
      data.date || ""
    ).trim();

  if (!date) {
    throw new Error(
      "Holiday date is required"
    );
  }

  const name =
    String(
      data.name ||
        data.reason ||
        "School Holiday"
    ).trim();

  const description =
    String(
      data.description || ""
    ).trim();

  const existing =
    await holidaysCollection(db)
      .findOne({
        date,
      });

  if (existing) {
    return cleanHoliday(
      existing
    );
  }

  const holiday =
    createHolidayDocument({
      date,
      name,
      description,
    });

  const result =
    await holidaysCollection(db)
      .insertOne(holiday);

  const saved =
    await holidaysCollection(db)
      .findOne({
        _id:
          result.insertedId,
      });

  return cleanHoliday(
    saved
  );
}

// =====================================================
// GET HOLIDAYS
// =====================================================

export async function getHolidays(
  db,
  from,
  to
) {
  const query = {};

  if (from || to) {
    query.date = {};

    if (from) {
      query.date.$gte =
        String(from);
    }

    if (to) {
      query.date.$lte =
        String(to);
    }
  }

  const holidays =
    await holidaysCollection(db)
      .find(query)
      .sort({
        date: 1,
      })
      .toArray();

  return holidays.map(
    cleanHoliday
  );
}

// =====================================================
// DELETE HOLIDAY
// =====================================================

export async function deleteHoliday(
  db,
  id
) {
  const objectId =
    toObjectId(id);

  if (!objectId) {
    throw new Error(
      "Invalid holiday ID"
    );
  }

  const result =
    await holidaysCollection(db)
      .deleteOne({
        _id: objectId,
      });

  if (
    result.deletedCount === 0
  ) {
    throw new Error(
      "Holiday not found"
    );
  }

  return true;
}

