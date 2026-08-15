import express from "express";
import cors from "cors";

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// =====================================================
// HOME
// =====================================================

app.get("/", (req, res) => {
  res.send("MPSA School Backend is running successfully 🚀");
});

// =====================================================
// STUDENTS
// =====================================================

let students = [
  {
    id: 1,
    name: "Rahul Kumar",
    father: "Rajesh Kumar",
    mother: "Sunita Kumar",
    dob: "2010-05-12",
    gender: "Male",
    aadhaar: "XXXX-XXXX-1234",
    pan: "ABCDE1234F",
    admissionNo: "MPSA-2026-001",
    admissionDate: "2026-04-01",
    class: "10",
    section: "A",
    rollNo: "101",
    mobile: "9876543210",
    alternateMobile: "9876543212",
    address: "MPSA School Area",
    status: "Active",
  },
  {
    id: 2,
    name: "Ankit Singh",
    father: "Rakesh Singh",
    mother: "Neha Singh",
    dob: "2008-08-20",
    gender: "Male",
    aadhaar: "XXXX-XXXX-5678",
    pan: "BCDEF5678G",
    admissionNo: "MPSA-2026-002",
    admissionDate: "2026-04-01",
    class: "12",
    section: "B",
    rollNo: "202",
    mobile: "9876543211",
    alternateMobile: "9876543213",
    address: "Main Road",
    status: "Active",
  },
];

// =====================================================
// STUDENT APIs
// =====================================================

app.get("/api/students", (req, res) => {
  res.json(students);
});

app.get("/api/students/:id", (req, res) => {
  const id = Number(req.params.id);

  const student = students.find(
    (item) => item.id === id
  );

  if (!student) {
    return res.status(404).json({
      message: "Student not found",
    });
  }

  res.json(student);
});

app.post("/api/students", (req, res) => {
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
    id: Date.now(),

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
  };

  students.push(newStudent);

  res.status(201).json({
    message: "Student added successfully",
    student: newStudent,
  });
});

app.put("/api/students/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = students.findIndex(
    (student) => student.id === id
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Student not found",
    });
  }

  students[index] = {
    ...students[index],
    ...req.body,
    id,
  };

  res.json({
    message: "Student updated successfully",
    student: students[index],
  });
});

app.delete("/api/students/:id", (req, res) => {
  const id = Number(req.params.id);

  const exists = students.some(
    (student) => student.id === id
  );

  if (!exists) {
    return res.status(404).json({
      message: "Student not found",
    });
  }

  students = students.filter(
    (student) => student.id !== id
  );

  res.json({
    message: "Student deleted successfully",
  });
});

// =====================================================
// STUDENT ATTENDANCE
// =====================================================

let studentAttendance = [];

/*
  Structure:

  {
    id,
    studentId,
    date,
    status
  }

  status:
  Present
  Absent
  Leave
*/

// GET ALL STUDENT ATTENDANCE

app.get("/api/student-attendance", (req, res) => {
  res.json(studentAttendance);
});

// GET STUDENT ATTENDANCE BY DATE

app.get(
  "/api/student-attendance/date/:date",
  (req, res) => {
    const date = req.params.date;

    const records = studentAttendance.filter(
      (item) => item.date === date
    );

    res.json(records);
  }
);

// GET STUDENT ATTENDANCE BY MONTH

app.get(
  "/api/student-attendance/month/:month",
  (req, res) => {
    const month = req.params.month;

    const records = studentAttendance.filter(
      (item) => item.date.startsWith(month)
    );

    res.json(records);
  }
);

// SAVE STUDENT ATTENDANCE

app.post(
  "/api/student-attendance",
  (req, res) => {
    const { records } = req.body;

    if (!Array.isArray(records)) {
      return res.status(400).json({
        message: "Attendance records are required",
      });
    }

    if (records.length === 0) {
      return res.status(400).json({
        message: "No attendance records received",
      });
    }

    const savedRecords = [];

    for (const record of records) {
      const studentId = Number(
        record.studentId
      );

      const date = record.date;
      const status = record.status;

      if (!studentId || !date || !status) {
        continue;
      }

      // CHECK STUDENT

      const student = students.find(
        (item) => item.id === studentId
      );

      if (!student) {
        continue;
      }

      // CHECK EXISTING RECORD

      const existingIndex =
        studentAttendance.findIndex(
          (item) =>
            item.studentId === studentId &&
            item.date === date
        );

      const newRecord = {
        id:
          existingIndex !== -1
            ? studentAttendance[existingIndex].id
            : Date.now() +
              Math.floor(
                Math.random() * 100000
              ),

        studentId,

        date,

        status,
      };

      // UPDATE

      if (existingIndex !== -1) {
        studentAttendance[
          existingIndex
        ] = newRecord;
      }

      // INSERT

      else {
        studentAttendance.push(
          newRecord
        );
      }

      savedRecords.push(newRecord);
    }

    res.json({
      message:
        "Student attendance saved successfully",

      records: savedRecords,
    });
  }
);

// DELETE STUDENT ATTENDANCE

app.delete(
  "/api/student-attendance/:id",
  (req, res) => {
    const id = Number(req.params.id);

    const exists = studentAttendance.some(
      (item) => item.id === id
    );

    if (!exists) {
      return res.status(404).json({
        message:
          "Student attendance record not found",
      });
    }

    studentAttendance =
      studentAttendance.filter(
        (item) => item.id !== id
      );

    res.json({
      message:
        "Student attendance deleted successfully",
    });
  }
);

// =====================================================
// TEACHERS
// =====================================================

let teachers = [
  {
    id: 1,
    name: "Rajesh Sharma",
    father: "Mohan Sharma",
    gender: "Male",
    dob: "1985-06-15",

    mobile: "9876500001",
    alternateMobile: "",
    email: "rajesh@mpsa.edu.in",
    address: "MPSA School Area",

    qualification: "M.Sc, B.Ed",
    subject: "Mathematics",

    joiningDate: "2024-04-01",

    employeeId: "MPSA-T-001",

    monthlySalary: 30000,

    status: "Active",
  },
];

// GET ALL TEACHERS

app.get("/api/teachers", (req, res) => {
  res.json(teachers);
});

// GET SINGLE TEACHER

app.get("/api/teachers/:id", (req, res) => {
  const id = Number(req.params.id);

  const teacher = teachers.find(
    (item) => item.id === id
  );

  if (!teacher) {
    return res.status(404).json({
      message: "Teacher not found",
    });
  }

  res.json(teacher);
});

// ADD TEACHER

app.post("/api/teachers", (req, res) => {
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
    id: Date.now(),

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
  };

  teachers.push(newTeacher);

  res.status(201).json({
    message: "Teacher added successfully",
    teacher: newTeacher,
  });
});

// UPDATE TEACHER

app.put("/api/teachers/:id", (req, res) => {
  const id = Number(req.params.id);

  const index = teachers.findIndex(
    (teacher) => teacher.id === id
  );

  if (index === -1) {
    return res.status(404).json({
      message: "Teacher not found",
    });
  }

  teachers[index] = {
    ...teachers[index],
    ...req.body,
    id,

    monthlySalary:
      req.body.monthlySalary !== undefined
        ? Number(req.body.monthlySalary)
        : teachers[index].monthlySalary,
  };

  res.json({
    message: "Teacher updated successfully",
    teacher: teachers[index],
  });
});

// DELETE TEACHER

app.delete("/api/teachers/:id", (req, res) => {
  const id = Number(req.params.id);

  const exists = teachers.some(
    (teacher) => teacher.id === id
  );

  if (!exists) {
    return res.status(404).json({
      message: "Teacher not found",
    });
  }

  teachers = teachers.filter(
    (teacher) => teacher.id !== id
  );

  res.json({
    message: "Teacher deleted successfully",
  });
});

// =====================================================
// TEACHER ATTENDANCE
// =====================================================

let teacherAttendance = [];

// GET ALL

app.get(
  "/api/teacher-attendance",
  (req, res) => {
    res.json(teacherAttendance);
  }
);

// GET BY MONTH

app.get(
  "/api/teacher-attendance/month/:month",
  (req, res) => {
    const month = req.params.month;

    const records =
      teacherAttendance.filter(
        (item) =>
          item.date.startsWith(month)
      );

    res.json(records);
  }
);

// ADD / UPDATE

app.post(
  "/api/teacher-attendance",
  (req, res) => {
    const {
      teacherId,
      date,
      status,
      leaveType,
      remark,
    } = req.body;

    if (!teacherId || !date || !status) {
      return res.status(400).json({
        message:
          "Teacher, date and status are required",
      });
    }

    const teacher = teachers.find(
      (item) =>
        item.id === Number(teacherId)
    );

    if (!teacher) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    const existingIndex =
      teacherAttendance.findIndex(
        (item) =>
          item.teacherId ===
            Number(teacherId) &&
          item.date === date
      );

    const attendanceRecord = {
      id:
        existingIndex !== -1
          ? teacherAttendance[
              existingIndex
            ].id
          : Date.now(),

      teacherId:
        Number(teacherId),

      date,

      status,

      leaveType:
        status === "Leave"
          ? leaveType || "Unpaid"
          : "",

      remark:
        remark || "",
    };

    if (existingIndex !== -1) {
      teacherAttendance[
        existingIndex
      ] = attendanceRecord;
    } else {
      teacherAttendance.push(
        attendanceRecord
      );
    }

    res.json({
      message:
        "Teacher attendance saved successfully",

      attendance:
        attendanceRecord,
    });
  }
);

// DELETE

app.delete(
  "/api/teacher-attendance/:id",
  (req, res) => {
    const id = Number(req.params.id);

    const exists =
      teacherAttendance.some(
        (item) => item.id === id
      );

    if (!exists) {
      return res.status(404).json({
        message:
          "Attendance record not found",
      });
    }

    teacherAttendance =
      teacherAttendance.filter(
        (item) => item.id !== id
      );

    res.json({
      message:
        "Attendance deleted successfully",
    });
  }
);

// =====================================================
// TEACHER SALARY
// =====================================================

let teacherSalaries = [];

// CALCULATE SALARY

function calculateTeacherSalary(
  teacherId,
  month,
  workingDays,
  manualAdjustment = 0
) {
  const teacher = teachers.find(
    (item) =>
      item.id === Number(teacherId)
  );

  if (!teacher) {
    return null;
  }

  const attendance =
    teacherAttendance.filter(
      (item) =>
        item.teacherId ===
          Number(teacherId) &&
        item.date.startsWith(month)
    );

  const absentDays =
    attendance.filter(
      (item) =>
        item.status === "Absent"
    ).length;

  const paidLeaveDays =
    attendance.filter(
      (item) =>
        item.status === "Leave" &&
        item.leaveType === "Paid"
    ).length;

  const unpaidLeaveDays =
    attendance.filter(
      (item) =>
        item.status === "Leave" &&
        item.leaveType !== "Paid"
    ).length;

  const perDaySalary =
    Number(teacher.monthlySalary) /
    Number(workingDays);

  const leaveDeduction =
    unpaidLeaveDays *
    perDaySalary;

  const finalSalary =
    Number(teacher.monthlySalary) -
    leaveDeduction +
    Number(manualAdjustment || 0);

  return {
    teacherId: teacher.id,

    month,

    workingDays:
      Number(workingDays),

    absentDays,

    paidLeaveDays,

    unpaidLeaveDays,

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

// GET CALCULATION

app.get(
  "/api/teacher-salary/calculate",
  (req, res) => {
    const {
      teacherId,
      month,
      workingDays = 26,
    } = req.query;

    if (!teacherId || !month) {
      return res.status(400).json({
        message:
          "teacherId and month are required",
      });
    }

    const salary =
      calculateTeacherSalary(
        teacherId,
        month,
        workingDays,
        0
      );

    if (!salary) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    res.json(salary);
  }
);

// SAVE SALARY

app.post(
  "/api/teacher-salary",
  (req, res) => {
    const {
      teacherId,
      month,
      workingDays = 26,
      manualAdjustment = 0,
      paid = false,
      note = "",
    } = req.body;

    if (!teacherId || !month) {
      return res.status(400).json({
        message:
          "teacherId and month are required",
      });
    }

    const salary =
      calculateTeacherSalary(
        teacherId,
        month,
        workingDays,
        manualAdjustment
      );

    if (!salary) {
      return res.status(404).json({
        message: "Teacher not found",
      });
    }

    const salaryRecord = {
      id: Date.now(),

      ...salary,

      paid: Boolean(paid),

      note,
    };

    teacherSalaries.push(
      salaryRecord
    );

    res.status(201).json({
      message:
        "Teacher salary saved successfully",

      salary:
        salaryRecord,
    });
  }
);

// GET SALARIES

app.get(
  "/api/teacher-salary",
  (req, res) => {
    res.json(teacherSalaries);
  }
);

// GET SALARY BY TEACHER + MONTH

app.get(
  "/api/teacher-salary/:teacherId/:month",
  (req, res) => {
    const teacherId =
      Number(req.params.teacherId);

    const month =
      req.params.month;

    const salary =
      teacherSalaries.find(
        (item) =>
          item.teacherId ===
            teacherId &&
          item.month === month
      );

    if (!salary) {
      return res.status(404).json({
        message:
          "Salary record not found",
      });
    }

    res.json(salary);
  }
);

// UPDATE SALARY

app.put(
  "/api/teacher-salary/:id",
  (req, res) => {
    const id =
      Number(req.params.id);

    const index =
      teacherSalaries.findIndex(
        (item) => item.id === id
      );

    if (index === -1) {
      return res.status(404).json({
        message:
          "Salary record not found",
      });
    }

    const oldSalary =
      teacherSalaries[index];

    const updatedSalary =
      calculateTeacherSalary(
        oldSalary.teacherId,
        oldSalary.month,
        req.body.workingDays ||
          oldSalary.workingDays,
        req.body.manualAdjustment !==
          undefined
          ? req.body.manualAdjustment
          : oldSalary.manualAdjustment
      );

    teacherSalaries[index] = {
      ...oldSalary,
      ...updatedSalary,

      paid:
        req.body.paid !== undefined
          ? Boolean(req.body.paid)
          : oldSalary.paid,

      note:
        req.body.note !== undefined
          ? req.body.note
          : oldSalary.note,

      id,
    };

    res.json({
      message:
        "Salary updated successfully",

      salary:
        teacherSalaries[index],
    });
  }
);

// DELETE SALARY

app.delete(
  "/api/teacher-salary/:id",
  (req, res) => {
    const id =
      Number(req.params.id);

    const exists =
      teacherSalaries.some(
        (item) => item.id === id
      );

    if (!exists) {
      return res.status(404).json({
        message:
          "Salary record not found",
      });
    }

    teacherSalaries =
      teacherSalaries.filter(
        (item) => item.id !== id
      );

    res.json({
      message:
        "Salary record deleted successfully",
    });
  }
);

// =====================================================
// SERVER START
// =====================================================

app.listen(PORT, () => {
  console.log("=================================");
  console.log(
    "MPSA SCHOOL BACKEND STARTED"
  );
  console.log(
    `Server: http://localhost:${PORT}`
  );
  console.log("Students API ready");
  console.log(
    "Student Attendance API ready"
  );
  console.log("Teachers API ready");
  console.log(
    "Teacher Attendance API ready"
  );
  console.log(
    "Teacher Salary API ready"
  );
  console.log("=================================");
});