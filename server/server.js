
import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";

dotenv.config({ path: "./server.env" });

const app = express();

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI not found in server.env");
  process.exit(1);
}

app.use(cors());
app.use(express.json());

/* =====================================================
   MONGODB
===================================================== */

const client = new MongoClient(MONGODB_URI);

let db;

let studentsCollection;
let studentAttendanceCollection;
let teachersCollection;
let teacherAttendanceCollection;
let teacherSalaryCollection;
let feesCollection;
let resultsCollection;

/* =====================================================
   HELPERS
===================================================== */

function mongoId(id) {
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

function cleanDocument(doc) {
  if (!doc) return null;

  return {
    ...doc,
    id: doc._id?.toString() || doc.id,
    _id: undefined,
  };
}

function cleanDocuments(docs) {
  return docs.map(cleanDocument);
}

async function findById(collection, id) {
  const objectId = mongoId(id);

  if (!objectId) return null;

  return collection.findOne({
    _id: objectId,
  });
}

/* =====================================================
   HOME
===================================================== */

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "MPSA School Backend is running successfully",
    database: db ? "MongoDB Connected" : "MongoDB Not Connected",
  });
});

/* =====================================================
   STUDENTS
===================================================== */

// GET ALL STUDENTS

app.get("/api/students", async (req, res) => {
  try {
    const students = await studentsCollection
      .find({})
      .sort({ _id: 1 })
      .toArray();

    res.json(cleanDocuments(students));
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch students",
    });
  }
});

// GET SINGLE STUDENT

app.get("/api/students/:id", async (req, res) => {
  try {
    const student = await findById(
      studentsCollection,
      req.params.id
    );

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json(cleanDocument(student));
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch student",
    });
  }
});

// ADD STUDENT

app.post("/api/students", async (req, res) => {
  try {
    const {
      name,
      father,
      mother,
      dob,
      gender,
      aadhaar,
      pan,
      admissionNo,
      admissionDate,
      class: studentClass,
      section,
      rollNo,
      mobile,
      alternateMobile,
      address,
      status,
    } = req.body;

    if (
      !name ||
      !father ||
      !studentClass ||
      !section ||
      !rollNo ||
      !mobile
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const newStudent = {
      name,
      father,
      mother: mother || "",
      dob: dob || "",
      gender: gender || "",
      aadhaar: aadhaar || "",
      pan: pan || "",
      admissionNo: admissionNo || "",
      admissionDate: admissionDate || "",
      class: studentClass,
      section,
      rollNo,
      mobile,
      alternateMobile: alternateMobile || "",
      address: address || "",
      status: status || "Active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result =
      await studentsCollection.insertOne(
        newStudent
      );

    const savedStudent = {
      ...newStudent,
      id: result.insertedId.toString(),
    };

    res.status(201).json({
      message: "Student added successfully",
      student: savedStudent,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to add student",
    });
  }
});

// UPDATE STUDENT

app.put("/api/students/:id", async (req, res) => {
  try {
    const objectId = mongoId(req.params.id);

    if (!objectId) {
      return res.status(400).json({
        message: "Invalid student ID",
      });
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date(),
    };

    delete updateData.id;
    delete updateData._id;

    const result =
      await studentsCollection.findOneAndUpdate(
        { _id: objectId },
        {
          $set: updateData,
        },
        {
          returnDocument: "after",
        }
      );

    if (!result) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json({
      message: "Student updated successfully",
      student: cleanDocument(result),
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update student",
    });
  }
});

// DELETE STUDENT

app.delete("/api/students/:id", async (req, res) => {
  try {
    const objectId = mongoId(req.params.id);

    if (!objectId) {
      return res.status(400).json({
        message: "Invalid student ID",
      });
    }

    const result =
      await studentsCollection.deleteOne({
        _id: objectId,
      });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        message: "Student not found",
      });
    }

    res.json({
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete student",
    });
  }
});

/* =====================================================
   STUDENT ATTENDANCE
===================================================== */

// GET ALL

app.get(
  "/api/student-attendance",
  async (req, res) => {
    try {
      const records =
        await studentAttendanceCollection
          .find({})
          .sort({ date: -1 })
          .toArray();

      res.json(cleanDocuments(records));
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch student attendance",
      });
    }
  }
);

// GET BY DATE

app.get(
  "/api/student-attendance/date/:date",
  async (req, res) => {
    try {
      const records =
        await studentAttendanceCollection
          .find({
            date: req.params.date,
          })
          .toArray();

      res.json(cleanDocuments(records));
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch attendance",
      });
    }
  }
);

// GET BY MONTH

app.get(
  "/api/student-attendance/month/:month",
  async (req, res) => {
    try {
      const records =
        await studentAttendanceCollection
          .find({
            date: {
              $regex: `^${req.params.month}`,
            },
          })
          .toArray();

      res.json(cleanDocuments(records));
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch monthly attendance",
      });
    }
  }
);

// SAVE ATTENDANCE

app.post(
  "/api/student-attendance",
  async (req, res) => {
    try {
      const { records } = req.body;

      if (
        !Array.isArray(records) ||
        records.length === 0
      ) {
        return res.status(400).json({
          message:
            "Attendance records are required",
        });
      }

      const savedRecords = [];

      for (const record of records) {
        const {
          studentId,
          date,
          status,
        } = record;

        if (!studentId || !date || !status) {
          continue;
        }

        const student =
          await findById(
            studentsCollection,
            studentId
          );

        if (!student) continue;

        const existing =
          await studentAttendanceCollection.findOne(
            {
              studentId: String(studentId),
              date,
            }
          );

        const attendance = {
          studentId: String(studentId),
          date,
          status,
          updatedAt: new Date(),
        };

        if (existing) {
          await studentAttendanceCollection.updateOne(
            {
              _id: existing._id,
            },
            {
              $set: attendance,
            }
          );

          savedRecords.push({
            ...attendance,
            id: existing._id.toString(),
          });
        } else {
          const result =
            await studentAttendanceCollection.insertOne(
              {
                ...attendance,
                createdAt: new Date(),
              }
            );

          savedRecords.push({
            ...attendance,
            id: result.insertedId.toString(),
          });
        }
      }

      res.json({
        message:
          "Student attendance saved successfully",
        records: savedRecords,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to save student attendance",
      });
    }
  }
);

// DELETE ATTENDANCE

app.delete(
  "/api/student-attendance/:id",
  async (req, res) => {
    try {
      const objectId = mongoId(req.params.id);

      if (!objectId) {
        return res.status(400).json({
          message: "Invalid attendance ID",
        });
      }

      const result =
        await studentAttendanceCollection.deleteOne(
          {
            _id: objectId,
          }
        );

      if (result.deletedCount === 0) {
        return res.status(404).json({
          message:
            "Attendance record not found",
        });
      }

      res.json({
        message:
          "Student attendance deleted successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to delete attendance",
      });
    }
  }
);

/* =====================================================
   TEACHERS
===================================================== */

// GET TEACHERS

app.get("/api/teachers", async (req, res) => {
  try {
    const teachers =
      await teachersCollection
        .find({})
        .sort({ _id: 1 })
        .toArray();

    res.json(cleanDocuments(teachers));
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch teachers",
    });
  }
});

// GET SINGLE TEACHER

app.get(
  "/api/teachers/:id",
  async (req, res) => {
    try {
      const teacher =
        await findById(
          teachersCollection,
          req.params.id
        );

      if (!teacher) {
        return res.status(404).json({
          message: "Teacher not found",
        });
      }

      res.json(cleanDocument(teacher));
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to fetch teacher",
      });
    }
  }
);

// ADD TEACHER

app.post("/api/teachers", async (req, res) => {
  try {
    const {
      name,
      father,
      gender,
      dob,
      mobile,
      alternateMobile,
      email,
      address,
      qualification,
      subject,
      joiningDate,
      employeeId,
      monthlySalary,
      status,
    } = req.body;

    if (
      !name ||
      !mobile ||
      !subject ||
      !employeeId ||
      monthlySalary === undefined
    ) {
      return res.status(400).json({
        message:
          "Please fill all required teacher fields",
      });
    }

    const newTeacher = {
      name,
      father: father || "",
      gender: gender || "",
      dob: dob || "",
      mobile,
      alternateMobile:
        alternateMobile || "",
      email: email || "",
      address: address || "",
      qualification:
        qualification || "",
      subject,
      joiningDate:
        joiningDate || "",
      employeeId,
      monthlySalary:
        Number(monthlySalary) || 0,
      status:
        status || "Active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result =
      await teachersCollection.insertOne(
        newTeacher
      );

    res.status(201).json({
      message: "Teacher added successfully",
      teacher: {
        ...newTeacher,
        id: result.insertedId.toString(),
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to add teacher",
    });
  }
});

// UPDATE TEACHER

app.put(
  "/api/teachers/:id",
  async (req, res) => {
    try {
      const objectId =
        mongoId(req.params.id);

      if (!objectId) {
        return res.status(400).json({
          message:
            "Invalid teacher ID",
        });
      }

      const updateData = {
        ...req.body,
        updatedAt: new Date(),
      };

      delete updateData.id;
      delete updateData._id;

      if (
        updateData.monthlySalary !==
        undefined
      ) {
        updateData.monthlySalary =
          Number(
            updateData.monthlySalary
          ) || 0;
      }

      const result =
        await teachersCollection.findOneAndUpdate(
          {
            _id: objectId,
          },
          {
            $set: updateData,
          },
          {
            returnDocument: "after",
          }
        );

      if (!result) {
        return res.status(404).json({
          message:
            "Teacher not found",
        });
      }

      res.json({
        message:
          "Teacher updated successfully",
        teacher:
          cleanDocument(result),
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to update teacher",
      });
    }
  }
);

// DELETE TEACHER

app.delete(
  "/api/teachers/:id",
  async (req, res) => {
    try {
      const objectId =
        mongoId(req.params.id);

      if (!objectId) {
        return res.status(400).json({
          message:
            "Invalid teacher ID",
        });
      }

      const result =
        await teachersCollection.deleteOne({
          _id: objectId,
        });

      if (result.deletedCount === 0) {
        return res.status(404).json({
          message:
            "Teacher not found",
        });
      }

      res.json({
        message:
          "Teacher deleted successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to delete teacher",
      });
    }
  }
);

/* =====================================================
   TEACHER ATTENDANCE
===================================================== */

// GET ALL

app.get(
  "/api/teacher-attendance",
  async (req, res) => {
    try {
      const records =
        await teacherAttendanceCollection
          .find({})
          .sort({ date: -1 })
          .toArray();

      res.json(cleanDocuments(records));
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch teacher attendance",
      });
    }
  }
);

// GET MONTH

app.get(
  "/api/teacher-attendance/month/:month",
  async (req, res) => {
    try {
      const records =
        await teacherAttendanceCollection
          .find({
            date: {
              $regex: `^${req.params.month}`,
            },
          })
          .toArray();

      res.json(cleanDocuments(records));
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch teacher attendance",
      });
    }
  }
);

// ADD / UPDATE

app.post(
  "/api/teacher-attendance",
  async (req, res) => {
    try {
      const {
        teacherId,
        date,
        status,
        leaveType,
        remark,
      } = req.body;

      if (
        !teacherId ||
        !date ||
        !status
      ) {
        return res.status(400).json({
          message:
            "Teacher, date and status are required",
        });
      }

      const teacher =
        await findById(
          teachersCollection,
          teacherId
        );

      if (!teacher) {
        return res.status(404).json({
          message:
            "Teacher not found",
        });
      }

      const existing =
        await teacherAttendanceCollection.findOne(
          {
            teacherId:
              String(teacherId),
            date,
          }
        );

      const attendance = {
        teacherId:
          String(teacherId),
        date,
        status,
        leaveType:
          status === "Leave"
            ? leaveType ||
              "Unpaid"
            : "",
        remark:
          remark || "",
        updatedAt:
          new Date(),
      };

      let attendanceId;

      if (existing) {
        await teacherAttendanceCollection.updateOne(
          {
            _id: existing._id,
          },
          {
            $set: attendance,
          }
        );

        attendanceId =
          existing._id.toString();
      } else {
        const result =
          await teacherAttendanceCollection.insertOne(
            {
              ...attendance,
              createdAt:
                new Date(),
            }
          );

        attendanceId =
          result.insertedId.toString();
      }

      res.json({
        message:
          "Teacher attendance saved successfully",
        attendance: {
          ...attendance,
          id: attendanceId,
        },
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to save teacher attendance",
      });
    }
  }
);

// DELETE

app.delete(
  "/api/teacher-attendance/:id",
  async (req, res) => {
    try {
      const objectId =
        mongoId(req.params.id);

      if (!objectId) {
        return res.status(400).json({
          message:
            "Invalid attendance ID",
        });
      }

      const result =
        await teacherAttendanceCollection.deleteOne(
          {
            _id: objectId,
          }
        );

      if (result.deletedCount === 0) {
        return res.status(404).json({
          message:
            "Attendance record not found",
        });
      }

      res.json({
        message:
          "Attendance deleted successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to delete attendance",
      });
    }
  }
);

/* =====================================================
   TEACHER SALARY
===================================================== */

async function calculateTeacherSalary(
  teacherId,
  month,
  workingDays,
  manualAdjustment = 0
) {
  const teacher =
    await findById(
      teachersCollection,
      teacherId
    );

  if (!teacher) return null;

  const safeWorkingDays =
    Number(workingDays) > 0
      ? Number(workingDays)
      : 26;

  const attendance =
    await teacherAttendanceCollection
      .find({
        teacherId:
          String(teacherId),
        date: {
          $regex: `^${month}`,
        },
      })
      .toArray();

  const absentDays =
    attendance.filter(
      (item) =>
        item.status ===
        "Absent"
    ).length;

  const paidLeaveDays =
    attendance.filter(
      (item) =>
        item.status ===
          "Leave" &&
        item.leaveType ===
          "Paid"
    ).length;

  const unpaidLeaveDays =
    attendance.filter(
      (item) =>
        item.status ===
          "Leave" &&
        item.leaveType !==
          "Paid"
    ).length;

  const deductionDays =
    absentDays +
    unpaidLeaveDays;

  const perDaySalary =
    Number(
      teacher.monthlySalary || 0
    ) /
    safeWorkingDays;

  const leaveDeduction =
    deductionDays *
    perDaySalary;

  const finalSalary =
    Number(
      teacher.monthlySalary || 0
    ) -
    leaveDeduction +
    Number(
      manualAdjustment || 0
    );

  return {
    teacherId:
      teacher._id.toString(),
    month,
    workingDays:
      safeWorkingDays,
    absentDays,
    paidLeaveDays,
    unpaidLeaveDays,
    deductionDays,
    perDaySalary:
      Number(
        perDaySalary.toFixed(2)
      ),
    leaveDeduction:
      Number(
        leaveDeduction.toFixed(2)
      ),
    manualAdjustment:
      Number(
        manualAdjustment || 0
      ),
    finalSalary:
      Number(
        Math.max(
          finalSalary,
          0
        ).toFixed(2)
      ),
  };
}

// CALCULATE

app.get(
  "/api/teacher-salary/calculate",
  async (req, res) => {
    try {
      const {
        teacherId,
        month,
        workingDays = 26,
      } = req.query;

      if (
        !teacherId ||
        !month
      ) {
        return res.status(400).json({
          message:
            "teacherId and month are required",
        });
      }

      const salary =
        await calculateTeacherSalary(
          teacherId,
          month,
          workingDays,
          0
        );

      if (!salary) {
        return res.status(404).json({
          message:
            "Teacher not found",
        });
      }

      res.json(salary);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to calculate salary",
      });
    }
  }
);

// SAVE SALARY

app.post(
  "/api/teacher-salary",
  async (req, res) => {
    try {
      const {
        teacherId,
        month,
        workingDays = 26,
        manualAdjustment = 0,
        note = "",
      } = req.body;

      if (
        !teacherId ||
        !month
      ) {
        return res.status(400).json({
          message:
            "teacherId and month are required",
        });
      }

      const existing =
        await teacherSalaryCollection.findOne(
          {
            teacherId:
              String(teacherId),
            month,
          }
        );

      if (existing) {
        return res.status(409).json({
          message:
            "Salary record already exists for this teacher and month",
          salary:
            cleanDocument(
              existing
            ),
        });
      }

      const salary =
        await calculateTeacherSalary(
          teacherId,
          month,
          workingDays,
          manualAdjustment
        );

      if (!salary) {
        return res.status(404).json({
          message:
            "Teacher not found",
        });
      }

      const salaryRecord = {
        ...salary,
        totalPaid: 0,
        remainingSalary:
          Number(
            salary.finalSalary ||
              0
          ),
        paid: false,
        note:
          note || "",
        payments: [],
        createdAt:
          new Date(),
        updatedAt:
          new Date(),
      };

      const result =
        await teacherSalaryCollection.insertOne(
          salaryRecord
        );

      res.status(201).json({
        message:
          "Teacher salary saved successfully",
        salary: {
          ...salaryRecord,
          id: result.insertedId.toString(),
        },
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to save salary",
      });
    }
  }
);

// GET SALARIES

app.get(
  "/api/teacher-salary",
  async (req, res) => {
    try {
      const salaries =
        await teacherSalaryCollection
          .find({})
          .sort({ month: -1 })
          .toArray();

      res.json(
        cleanDocuments(salaries)
      );
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch salaries",
      });
    }
  }
);

// GET ONE SALARY

app.get(
  "/api/teacher-salary/:teacherId/:month",
  async (req, res) => {
    try {
      const salary =
        await teacherSalaryCollection.findOne(
          {
            teacherId:
              String(
                req.params.teacherId
              ),
            month:
              req.params.month,
          }
        );

      if (!salary) {
        return res.status(404).json({
          message:
            "Salary record not found",
        });
      }

      res.json(
        cleanDocument(salary)
      );
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch salary",
      });
    }
  }
);

// ADD SALARY PAYMENT

app.post(
  "/api/teacher-salary/:id/payment",
  async (req, res) => {
    try {
      const {
        amount,
        type = "Salary",
        note = "",
        date,
      } = req.body;

      const paymentAmount =
        Number(amount);

      if (
        !paymentAmount ||
        paymentAmount <= 0
      ) {
        return res.status(400).json({
          message:
            "Valid payment amount is required",
        });
      }

      const salary =
        await findById(
          teacherSalaryCollection,
          req.params.id
        );

      if (!salary) {
        return res.status(404).json({
          message:
            "Salary record not found",
        });
      }

      const totalPaid =
        Number(
          salary.totalPaid ||
            0
        );

      const finalSalary =
        Number(
          salary.finalSalary ||
            0
        );

      const remaining =
        Math.max(
          finalSalary -
            totalPaid,
          0
        );

      if (
        paymentAmount >
        remaining
      ) {
        return res.status(400).json({
          message:
            "Payment cannot be greater than remaining salary",
        });
      }

      const newTotalPaid =
        totalPaid +
        paymentAmount;

      const newRemaining =
        Math.max(
          finalSalary -
            newTotalPaid,
          0
        );

      const paymentRecord = {
        id:
          Date.now().toString(),
        amount:
          paymentAmount,
        type,
        note:
          note || "",
        date:
          date ||
          new Date()
            .toISOString()
            .slice(0, 10),
      };

      await teacherSalaryCollection.updateOne(
        {
          _id:
            salary._id,
        },
        {
          $set: {
            totalPaid:
              Number(
                newTotalPaid.toFixed(
                  2
                )
              ),
            remainingSalary:
              Number(
                newRemaining.toFixed(
                  2
                )
              ),
            paid:
              newRemaining <=
              0,
            updatedAt:
              new Date(),
          },
          $push: {
            payments:
              paymentRecord,
          },
        }
      );

      const updatedSalary =
        await findById(
          teacherSalaryCollection,
          req.params.id
        );

      res.json({
        message:
          "Payment recorded successfully",
        salary:
          cleanDocument(
            updatedSalary
          ),
        payment:
          paymentRecord,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to record payment",
      });
    }
  }
);

// UPDATE SALARY

app.put(
  "/api/teacher-salary/:id",
  async (req, res) => {
    try {
      const salary =
        await findById(
          teacherSalaryCollection,
          req.params.id
        );

      if (!salary) {
        return res.status(404).json({
          message:
            "Salary record not found",
        });
      }

      const updatedSalary =
        await calculateTeacherSalary(
          salary.teacherId,
          salary.month,
          req.body.workingDays ||
            salary.workingDays,
          req.body
            .manualAdjustment !==
            undefined
            ? req.body
                .manualAdjustment
            : salary.manualAdjustment
        );

      if (!updatedSalary) {
        return res.status(404).json({
          message:
            "Teacher not found",
        });
      }

      const totalPaid =
        Number(
          salary.totalPaid ||
            0
        );

      const newRemaining =
        Math.max(
          Number(
            updatedSalary.finalSalary
          ) -
            totalPaid,
          0
        );

      await teacherSalaryCollection.updateOne(
        {
          _id:
            salary._id,
        },
        {
          $set: {
            ...updatedSalary,
            totalPaid,
            remainingSalary:
              Number(
                newRemaining.toFixed(
                  2
                )
              ),
            paid:
              newRemaining <=
              0,
            note:
              req.body.note !==
              undefined
                ? req.body.note
                : salary.note,
            updatedAt:
              new Date(),
          },
        }
      );

      const finalSalary =
        await findById(
          teacherSalaryCollection,
          req.params.id
        );

      res.json({
        message:
          "Salary updated successfully",
        salary:
          cleanDocument(
            finalSalary
          ),
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to update salary",
      });
    }
  }
);

// DELETE SALARY

app.delete(
  "/api/teacher-salary/:id",
  async (req, res) => {
    try {
      const objectId =
        mongoId(req.params.id);

      if (!objectId) {
        return res.status(400).json({
          message:
            "Invalid salary ID",
        });
      }

      const result =
        await teacherSalaryCollection.deleteOne(
          {
            _id:
              objectId,
          }
        );

      if (result.deletedCount === 0) {
        return res.status(404).json({
          message:
            "Salary record not found",
        });
      }

      res.json({
        message:
          "Salary record deleted successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to delete salary",
      });
    }
  }
);

/* =====================================================
   STUDENT FEES
===================================================== */

// GET ALL FEES

app.get("/api/fees", async (req, res) => {
  try {
    const fees =
      await feesCollection
        .find({})
        .sort({ _id: 1 })
        .toArray();

    const detailed = [];

    for (const fee of fees) {
      const student =
        await findById(
          studentsCollection,
          fee.studentId
        );

      const totalPaid =
        (fee.payments || []).reduce(
          (sum, payment) =>
            sum +
            Number(
              payment.amount || 0
            ),
          0
        );

      const totalFees =
        Number(
          fee.totalFees || 0
        );

      const discount =
        Number(
          fee.discount || 0
        );

      const netFees =
        Math.max(
          totalFees -
            discount,
          0
        );

      const pending =
        Math.max(
          netFees -
            totalPaid,
          0
        );

      detailed.push({
        ...cleanDocument(fee),
        student:
          student
            ? cleanDocument(student)
            : null,
        totalPaid,
        netFees,
        pending,
      });
    }

    res.json(detailed);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message:
        "Failed to fetch fees",
    });
  }
});

// GET FEE BY STUDENT

app.get(
  "/api/fees/student/:studentId",
  async (req, res) => {
    try {
      const fee =
        await feesCollection.findOne(
          {
            studentId:
              String(
                req.params.studentId
              ),
          }
        );

      if (!fee) {
        return res.status(404).json({
          message:
            "Fee record not found",
        });
      }

      const student =
        await findById(
          studentsCollection,
          req.params.studentId
        );

      const totalPaid =
        (fee.payments || []).reduce(
          (sum, payment) =>
            sum +
            Number(
              payment.amount || 0
            ),
          0
        );

      const netFees =
        Math.max(
          Number(
            fee.totalFees || 0
          ) -
            Number(
              fee.discount || 0
            ),
          0
        );

      res.json({
        ...cleanDocument(fee),
        student:
          student
            ? cleanDocument(student)
            : null,
        totalPaid,
        netFees,
        pending:
          Math.max(
            netFees -
              totalPaid,
            0
          ),
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch student fee",
      });
    }
  }
);

// GET SINGLE FEE

app.get(
  "/api/fees/:id",
  async (req, res) => {
    try {
      const fee =
        await findById(
          feesCollection,
          req.params.id
        );

      if (!fee) {
        return res.status(404).json({
          message:
            "Fee record not found",
        });
      }

      const student =
        await findById(
          studentsCollection,
          fee.studentId
        );

      const totalPaid =
        (fee.payments || []).reduce(
          (sum, payment) =>
            sum +
            Number(
              payment.amount || 0
            ),
          0
        );

      const netFees =
        Math.max(
          Number(
            fee.totalFees || 0
          ) -
            Number(
              fee.discount || 0
            ),
          0
        );

      res.json({
        ...cleanDocument(fee),
        student:
          student
            ? cleanDocument(student)
            : null,
        totalPaid,
        netFees,
        pending:
          Math.max(
            netFees -
              totalPaid,
            0
          ),
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch fee",
      });
    }
  }
);

// ADD FEE

app.post(
  "/api/fees",
  async (req, res) => {
    try {
      const {
        studentId,
        totalFees,
        discount = 0,
      } = req.body;

      if (
        !studentId ||
        totalFees ===
          undefined
      ) {
        return res.status(400).json({
          message:
            "studentId and totalFees are required",
        });
      }

      const student =
        await findById(
          studentsCollection,
          studentId
        );

      if (!student) {
        return res.status(404).json({
          message:
            "Student not found",
        });
      }

      const existing =
        await feesCollection.findOne(
          {
            studentId:
              String(studentId),
          }
        );

      if (existing) {
        return res.status(409).json({
          message:
            "Fee record already exists for this student",
          fee:
            cleanDocument(
              existing
            ),
        });
      }

      const newFee = {
        studentId:
          String(studentId),
        totalFees:
          Number(
            totalFees
          ) || 0,
        discount:
          Number(
            discount
          ) || 0,
        payments: [],
        createdAt:
          new Date(),
        updatedAt:
          new Date(),
      };

      const result =
        await feesCollection.insertOne(
          newFee
        );

      res.status(201).json({
        message:
          "Fee record created successfully",
        fee: {
          ...newFee,
          id:
            result.insertedId.toString(),
          student:
            cleanDocument(
              student
            ),
          totalPaid: 0,
          netFees:
            Math.max(
              Number(
                totalFees
              ) -
                Number(
                  discount
                ),
              0
            ),
          pending:
            Math.max(
              Number(
                totalFees
              ) -
                Number(
                  discount
                ),
              0
            ),
        },
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to create fee",
      });
    }
  }
);

// UPDATE FEE

app.put(
  "/api/fees/:id",
  async (req, res) => {
    try {
      const fee =
        await findById(
          feesCollection,
          req.params.id
        );

      if (!fee) {
        return res.status(404).json({
          message:
            "Fee record not found",
        });
      }

      const updateData = {
        updatedAt:
          new Date(),
      };

      if (
        req.body.totalFees !==
        undefined
      ) {
        updateData.totalFees =
          Number(
            req.body.totalFees
          );
      }

      if (
        req.body.discount !==
        undefined
      ) {
        updateData.discount =
          Number(
            req.body.discount
          );
      }

      await feesCollection.updateOne(
        {
          _id: fee._id,
        },
        {
          $set:
            updateData,
        }
      );

      const updated =
        await findById(
          feesCollection,
          req.params.id
        );

      res.json({
        message:
          "Fee updated successfully",
        fee:
          cleanDocument(
            updated
          ),
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to update fee",
      });
    }
  }
);

// ADD FEE PAYMENT

app.post(
  "/api/fees/:id/payment",
  async (req, res) => {
    try {
      const {
        amount,
        mode = "Cash",
        date,
        time,
      } = req.body;

      const paymentAmount =
        Number(amount);

      if (
        !paymentAmount ||
        paymentAmount <= 0
      ) {
        return res.status(400).json({
          message:
            "Valid payment amount is required",
        });
      }

      const fee =
        await findById(
          feesCollection,
          req.params.id
        );

      if (!fee) {
        return res.status(404).json({
          message:
            "Fee record not found",
        });
      }

      const totalPaid =
        (fee.payments || []).reduce(
          (sum, payment) =>
            sum +
            Number(
              payment.amount || 0
            ),
          0
        );

      const netFees =
        Math.max(
          Number(
            fee.totalFees || 0
          ) -
            Number(
              fee.discount || 0
            ),
          0
        );

      const remaining =
        Math.max(
          netFees -
            totalPaid,
          0
        );

      if (
        paymentAmount >
        remaining
      ) {
        return res.status(400).json({
          message:
            `Payment cannot be greater than pending amount ₹${remaining.toLocaleString(
              "en-IN"
            )}`,
          pending:
            remaining,
        });
      }

      const now =
        new Date();

      const receiptNo =
        "MPSA-" +
        String(
          Date.now()
        ).slice(-6);

      const paymentRecord = {
        id:
          Date.now().toString(),
        receiptNo,
        amount:
          paymentAmount,
        mode,
        date:
          date ||
          now.toLocaleDateString(
            "en-IN",
            {
              day: "2-digit",
              month: "short",
              year: "numeric",
            }
          ),
        time:
          time ||
          now.toLocaleTimeString(
            "en-IN",
            {
              hour: "2-digit",
              minute:
                "2-digit",
            }
          ),
      };

      await feesCollection.updateOne(
        {
          _id: fee._id,
        },
        {
          $push: {
            payments:
              paymentRecord,
          },
          $set: {
            updatedAt:
              new Date(),
          },
        }
      );

      const updated =
        await findById(
          feesCollection,
          req.params.id
        );

      const newTotalPaid =
        totalPaid +
        paymentAmount;

      const newPending =
        Math.max(
          netFees -
            newTotalPaid,
          0
        );

      res.json({
        message:
          "Fee payment recorded successfully",
        fee:
          cleanDocument(
            updated
          ),
        payment:
          paymentRecord,
        totalPaid:
          newTotalPaid,
        pending:
          newPending,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to record fee payment",
      });
    }
  }
);

// DELETE FEE PAYMENT

app.delete(
  "/api/fees/:feeId/payment/:paymentId",
  async (req, res) => {
    try {
      const fee =
        await findById(
          feesCollection,
          req.params.feeId
        );

      if (!fee) {
        return res.status(404).json({
          message:
            "Fee record not found",
        });
      }

      const paymentExists =
        (fee.payments || []).some(
          (payment) =>
            String(
              payment.id
            ) ===
            String(
              req.params.paymentId
            )
        );

      if (!paymentExists) {
        return res.status(404).json({
          message:
            "Payment not found",
        });
      }

      await feesCollection.updateOne(
        {
          _id: fee._id,
        },
        {
          $pull: {
            payments: {
              id:
                String(
                  req.params.paymentId
                ),
            },
          },
          $set: {
            updatedAt:
              new Date(),
          },
        }
      );

      const updated =
        await findById(
          feesCollection,
          req.params.feeId
        );

      res.json({
        message:
          "Fee payment deleted successfully",
        fee:
          cleanDocument(
            updated
          ),
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to delete payment",
      });
    }
  }
);

// DELETE FEE

app.delete(
  "/api/fees/:id",
  async (req, res) => {
    try {
      const objectId =
        mongoId(req.params.id);

      if (!objectId) {
        return res.status(400).json({
          message:
            "Invalid fee ID",
        });
      }

      const result =
        await feesCollection.deleteOne({
          _id:
            objectId,
        });

      if (
        result.deletedCount ===
        0
      ) {
        return res.status(404).json({
          message:
            "Fee record not found",
        });
      }

      res.json({
        message:
          "Fee record deleted successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to delete fee",
      });
    }
  }
);

// PAYMENT HISTORY

app.get(
  "/api/fees/:id/history",
  async (req, res) => {
    try {
      const fee =
        await findById(
          feesCollection,
          req.params.id
        );

      if (!fee) {
        return res.status(404).json({
          message:
            "Fee record not found",
        });
      }

      const student =
        await findById(
          studentsCollection,
          fee.studentId
        );

      res.json({
        student:
          student
            ? cleanDocument(
                student
              )
            : null,
        fee:
          cleanDocument(fee),
        payments:
          fee.payments || [],
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch payment history",
      });
    }
  }
);

/* =====================================================
   STUDENT RESULTS
===================================================== */

function getSubjectsByClass(
  studentClass
) {
  const classNumber =
    Number(studentClass);

  if (
    classNumber >= 1 &&
    classNumber <= 8
  ) {
    return [
      "Hindi",
      "English",
      "Mathematics",
      "Science",
      "Social Science",
      "Computer",
      "Art",
      "Game",
      "GK",
    ];
  }

  if (
    classNumber >= 9 &&
    classNumber <= 10
  ) {
    return [
      "Hindi",
      "English",
      "Mathematics",
      "Science",
      "Social Science",
      "Computer",
    ];
  }

  if (
    classNumber >= 11 &&
    classNumber <= 12
  ) {
    return [
      "Hindi",
      "English",
      "Mathematics",
      "Physics",
      "Chemistry",
    ];
  }

  return [];
}

function getGrade(
  percentage
) {
  if (percentage >= 90)
    return "A+";
  if (percentage >= 80)
    return "A";
  if (percentage >= 70)
    return "B+";
  if (percentage >= 60)
    return "B";
  if (percentage >= 50)
    return "C";
  if (percentage >= 40)
    return "D";

  return "F";
}

function calculateExam(
  subjects
) {
  const formattedSubjects =
    subjects.map(
      (subject) => {
        const internal =
          Math.min(
            Math.max(
              Number(
                subject.internal
              ) || 0,
              0
            ),
            30
          );

        const external =
          Math.min(
            Math.max(
              Number(
                subject.external
              ) || 0,
              0
            ),
            70
          );

        const total =
          internal +
          external;

        return {
          name:
            subject.name,
          internal,
          external,
          total,
          maxInternal: 30,
          maxExternal: 70,
          maxMarks: 100,
        };
      }
    );

  const totalMarks =
    formattedSubjects.reduce(
      (sum, subject) =>
        sum +
        subject.total,
      0
    );

  const maxMarks =
    formattedSubjects.length *
    100;

  const percentage =
    maxMarks > 0
      ? (totalMarks /
          maxMarks) *
        100
      : 0;

  const failedSubjects =
    formattedSubjects.filter(
      (subject) =>
        subject.total <
        33
    );

  return {
    subjects:
      formattedSubjects,
    totalMarks,
    maxMarks,
    percentage:
      Number(
        percentage.toFixed(2)
      ),
    grade:
      getGrade(
        percentage
      ),
    result:
      failedSubjects.length ===
      0
        ? "PASS"
        : "FAIL",
    failedSubjects:
      failedSubjects.map(
        (subject) =>
          subject.name
      ),
  };
}

// GET SUBJECTS

app.get(
  "/api/results/subjects/:className",
  (req, res) => {
    const subjects =
      getSubjectsByClass(
        req.params.className
      );

    if (
      subjects.length === 0
    ) {
      return res.status(400).json({
        message:
          "Invalid class",
      });
    }

    res.json({
      class:
        req.params.className,
      subjects,
    });
  }
);

// GET ALL RESULTS

app.get(
  "/api/results",
  async (req, res) => {
    try {
      const results =
        await resultsCollection
          .find({})
          .sort({
            _id: -1,
          })
          .toArray();

      const detailed = [];

      for (
        const result of results
      ) {
        const student =
          await findById(
            studentsCollection,
            result.studentId
          );

        detailed.push({
          ...cleanDocument(
            result
          ),
          student:
            student
              ? cleanDocument(
                  student
                )
              : null,
        });
      }

      res.json(detailed);
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch results",
      });
    }
  }
);

// GET RESULT BY STUDENT

app.get(
  "/api/results/student/:studentId",
  async (req, res) => {
    try {
      const student =
        await findById(
          studentsCollection,
          req.params.studentId
        );

      if (!student) {
        return res.status(404).json({
          message:
            "Student not found",
        });
      }

      const result =
        await resultsCollection.findOne(
          {
            studentId:
              String(
                req.params.studentId
              ),
          }
        );

      if (!result) {
        return res.status(404).json({
          message:
            "Result not found for this student",
        });
      }

      res.json({
        ...cleanDocument(
          result
        ),
        student:
          cleanDocument(
            student
          ),
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch result",
      });
    }
  }
);

// GET SINGLE RESULT

app.get(
  "/api/results/:id",
  async (req, res) => {
    try {
      const result =
        await findById(
          resultsCollection,
          req.params.id
        );

      if (!result) {
        return res.status(404).json({
          message:
            "Result not found",
        });
      }

      const student =
        await findById(
          studentsCollection,
          result.studentId
        );

      res.json({
        ...cleanDocument(
          result
        ),
        student:
          student
            ? cleanDocument(
                student
              )
            : null,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to fetch result",
      });
    }
  }
);

// SAVE / UPDATE EXAM

app.post(
  "/api/results/exam",
  async (req, res) => {
    try {
      const {
        studentId,
        exam,
        session = "2026-27",
        subjects,
      } = req.body;

      if (
        !studentId ||
        !exam ||
        !Array.isArray(
          subjects
        )
      ) {
        return res.status(400).json({
          message:
            "studentId, exam and subjects are required",
        });
      }

      const allowedExams = [
        "Exam 1",
        "Exam 2",
        "Exam 3",
      ];

      if (
        !allowedExams.includes(
          exam
        )
      ) {
        return res.status(400).json({
          message:
            "Invalid exam",
        });
      }

      const student =
        await findById(
          studentsCollection,
          studentId
        );

      if (!student) {
        return res.status(404).json({
          message:
            "Student not found",
        });
      }

      const allowedSubjects =
        getSubjectsByClass(
          student.class
        );

      const validSubjects =
        subjects.filter(
          (subject) =>
            allowedSubjects.includes(
              subject.name
            )
        );

      if (
        validSubjects.length ===
        0
      ) {
        return res.status(400).json({
          message:
            "No valid subjects found",
        });
      }

      for (
        const subject of
        validSubjects
      ) {
        const internal =
          Number(
            subject.internal
          );

        const external =
          Number(
            subject.external
          );

        if (
          internal < 0 ||
          internal > 30 ||
          external < 0 ||
          external > 70
        ) {
          return res.status(400).json({
            message:
              `Invalid marks for ${subject.name}. Internal must be 0-30 and External must be 0-70.`,
          });
        }
      }

      const examResult =
        calculateExam(
          validSubjects
        );

      const existing =
        await resultsCollection.findOne(
          {
            studentId:
              String(
                studentId
              ),
            session,
          }
        );

      const examData = {
        ...examResult,
        exam,
        updatedAt:
          new Date(),
      };

      if (existing) {
        await resultsCollection.updateOne(
          {
            _id:
              existing._id,
          },
          {
            $set: {
              [`exams.${exam}`]:
                examData,
              class:
                student.class,
              section:
                student.section,
              updatedAt:
                new Date(),
            },
          }
        );
      } else {
        await resultsCollection.insertOne(
          {
            studentId:
              String(
                studentId
              ),
            session,
            class:
              student.class,
            section:
              student.section,
            exams: {
              [exam]:
                examData,
            },
            createdAt:
              new Date(),
            updatedAt:
              new Date(),
          }
        );
      }

      const saved =
        await resultsCollection.findOne(
          {
            studentId:
              String(
                studentId
              ),
            session,
          }
        );

      res.json({
        message:
          `${exam} result saved successfully`,
        result: {
          ...cleanDocument(
            saved
          ),
          student:
            cleanDocument(
              student
            ),
        },
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to save result",
      });
    }
  }
);

// UPDATE RESULT

app.put(
  "/api/results/:id",
  async (req, res) => {
    try {
      const objectId =
        mongoId(req.params.id);

      if (!objectId) {
        return res.status(400).json({
          message:
            "Invalid result ID",
        });
      }

      const result =
        await resultsCollection.findOne(
          {
            _id:
              objectId,
          }
        );

      if (!result) {
        return res.status(404).json({
          message:
            "Result not found",
        });
      }

      const updateData = {
        ...req.body,
        updatedAt:
          new Date(),
      };

      delete updateData.id;
      delete updateData._id;

      await resultsCollection.updateOne(
        {
          _id:
            objectId,
        },
        {
          $set:
            updateData,
        }
      );

      const updated =
        await resultsCollection.findOne(
          {
            _id:
              objectId,
          }
        );

      const student =
        await findById(
          studentsCollection,
          updated.studentId
        );

      res.json({
        message:
          "Result updated successfully",
        result: {
          ...cleanDocument(
            updated
          ),
          student:
            student
              ? cleanDocument(
                  student
                )
              : null,
        },
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to update result",
      });
    }
  }
);

// DELETE RESULT

app.delete(
  "/api/results/:id",
  async (req, res) => {
    try {
      const objectId =
        mongoId(req.params.id);

      if (!objectId) {
        return res.status(400).json({
          message:
            "Invalid result ID",
        });
      }

      const result =
        await resultsCollection.deleteOne(
          {
            _id:
              objectId,
          }
        );

      if (
        result.deletedCount ===
        0
      ) {
        return res.status(404).json({
          message:
            "Result not found",
        });
      }

      res.json({
        message:
          "Result deleted successfully",
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message:
          "Failed to delete result",
      });
    }
  }
);

/* =====================================================
   DATABASE INITIALIZATION
===================================================== */

async function startServer() {
  try {
    console.log(
      "Connecting to MongoDB..."
    );

    await client.connect();

    db =
      client.db(
        "mpsa_school"
      );

    studentsCollection =
      db.collection(
        "students"
      );

    studentAttendanceCollection =
      db.collection(
        "student_attendance"
      );

    teachersCollection =
      db.collection(
        "teachers"
      );

    teacherAttendanceCollection =
      db.collection(
        "teacher_attendance"
      );

    teacherSalaryCollection =
      db.collection(
        "teacher_salaries"
      );

    feesCollection =
      db.collection(
        "fees"
      );

    resultsCollection =
      db.collection(
        "results"
      );

    /* -----------------------------------------------
       INDEXES
    ------------------------------------------------ */

    await studentAttendanceCollection.createIndex(
      {
        studentId: 1,
        date: 1,
      },
      {
        unique: true,
      }
    );

    await teacherAttendanceCollection.createIndex(
      {
        teacherId: 1,
        date: 1,
      },
      {
        unique: true,
      }
    );

    await teacherSalaryCollection.createIndex(
      {
        teacherId: 1,
        month: 1,
      },
      {
        unique: true,
      }
    );

    await feesCollection.createIndex(
      {
        studentId: 1,
      },
      {
        unique: true,
      }
    );

    await resultsCollection.createIndex(
      {
        studentId: 1,
        session: 1,
      },
      {
        unique: true,
      }
    );

    console.log(
      "✅ MongoDB connected successfully"
    );

    console.log(
      "Database: mpsa_school"
    );

    app.listen(
      PORT,
      () => {
        console.log(
          "--------------------------------"
        );

        console.log(
          "MPSA SCHOOL BACKEND STARTED"
        );

        console.log(
          `Server: http://localhost:${PORT}`
        );

        console.log(
          "Students API: READY"
        );

        console.log(
          "Student Attendance API: READY"
        );

        console.log(
          "Teachers API: READY"
        );

        console.log(
          "Teacher Attendance API: READY"
        );

        console.log(
          "Teacher Salary API: READY"
        );

        console.log(
          "Fees API: READY"
        );

        console.log(
          "Fee Payment API: READY"
        );

        console.log(
          "Results API: READY"
        );

        console.log(
          "--------------------------------"
        );
      }
    );
  } catch (error) {
    console.error(
      "❌ MongoDB connection failed:"
    );

    console.error(
      error.message
    );

    process.exit(1);
  }
}

startServer();

/* =====================================================
   GRACEFUL SHUTDOWN
===================================================== */

process.on(
  "SIGINT",
  async () => {
    console.log(
      "\nClosing MongoDB connection..."
    );

    await client.close();

    process.exit(0);
  }
);

process.on(
  "SIGTERM",
  async () => {
    console.log(
      "\nClosing MongoDB connection..."
    );

    await client.close();

    process.exit(0);
  }
);

