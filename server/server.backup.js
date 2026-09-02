// =====================================================
// MPSA SCHOOL MANAGEMENT SYSTEM
// SERVER.JS - PART 1
// MongoDB + Express + Students + Admission Base
// =====================================================

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dns from "dns";
import { MongoClient, ObjectId } from "mongodb";

// =====================================================
// ENVIRONMENT
// =====================================================

dotenv.config({
  path: "./server.env",
});

// MongoDB SRV DNS fix
dns.setServers([
  "8.8.8.8",
  "1.1.1.1",
]);

// =====================================================
// EXPRESS APP
// =====================================================

const app = express();

const PORT =
  process.env.PORT || 5000;

const MONGODB_URI =
  process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error(
    "❌ MONGODB_URI is missing in server.env"
  );

  process.exit(1);
}

// =====================================================
// MIDDLEWARE
// =====================================================

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

// =====================================================
// MONGODB CLIENT
// =====================================================

const client =
  new MongoClient(
    MONGODB_URI,
    {
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
    }
  );

// =====================================================
// DATABASE VARIABLES
// =====================================================

let db;

// Main collections
let studentsCollection;
let studentAttendanceCollection;

let teachersCollection;
let teacherAttendanceCollection;
let teacherSalaryCollection;

let feesCollection;
let resultsCollection;

// Other modules
let classesCollection;
let subjectsCollection;
let examsCollection;
let timetableCollection;
let noticesCollection;

let admissionsCollection;
let certificatesCollection;
let transportCollection;
let inventoryCollection;
let galleryCollection;

let usersCollection;
let activityLogCollection;

// =====================================================
// HELPER - MONGODB OBJECT ID
// =====================================================

function mongoId(id) {
  if (!id) {
    return null;
  }

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
// HELPER - CLEAN DOCUMENT
// =====================================================

function cleanDocument(doc) {
  if (!doc) {
    return null;
  }

  const cleaned = {
    ...doc,

    id: doc._id
      ? doc._id.toString()
      : doc.id,
  };

  delete cleaned._id;

  return cleaned;
}

// =====================================================
// HELPER - CLEAN DOCUMENTS
// =====================================================

function cleanDocuments(docs) {
  return docs.map(
    (doc) => cleanDocument(doc)
  );
}

// =====================================================
// HELPER - ERROR RESPONSE
// =====================================================

function sendError(
  res,
  error,
  message = "Server error"
) {
  console.error(
    message,
    error
  );

  return res.status(500).json({
    success: false,
    message,
    error:
      error?.message ||
      String(error),
  });
}

// =====================================================
// HELPER - NUMBER
// =====================================================

function parseNumber(
  value,
  defaultValue = 0
) {
  const number =
    Number(value);

  return Number.isFinite(number)
    ? number
    : defaultValue;
}

// =====================================================
// HELPER - BOOLEAN
// =====================================================

function parseBoolean(
  value,
  defaultValue = true
) {
  if (
    value === undefined ||
    value === null
  ) {
    return defaultValue;
  }

  if (
    typeof value === "boolean"
  ) {
    return value;
  }

  return (
    String(value).toLowerCase() ===
    "true"
  );
}

// =====================================================
// HELPER - FIND BY ID
// =====================================================

async function findById(
  collection,
  id
) {
  const objectId =
    mongoId(id);

  if (!objectId) {
    return null;
  }

  return collection.findOne({
    _id: objectId,
  });
}

// =====================================================
// HEALTH CHECK
// =====================================================

app.get(
  "/",
  (req, res) => {
    res.json({
      success: true,

      message:
        "MPSA School Management API is running",

      database: db
        ? "MongoDB connected"
        : "MongoDB not connected",
    });
  }
);

// =====================================================
// API HEALTH
// =====================================================

app.get(
  "/api/health",
  async (req, res) => {
    try {
      if (!db) {
        return res.status(503).json({
          success: false,
          database:
            "disconnected",
        });
      }

      await db.command({
        ping: 1,
      });

      return res.json({
        success: true,

        database:
          "MongoDB connected",

        databaseName:
          db.databaseName,
      });
    } catch (error) {
      return sendError(
        res,
        error,
        "Database health check failed"
      );
    }
  }
);

// =====================================================
// STUDENT DATA NORMALIZER
// =====================================================

function normalizeStudentData(
  body = {}
) {
  return {
    name:
      String(
        body.name || ""
      ).trim(),

    father:
      String(
        body.father || ""
      ).trim(),

    mother:
      String(
        body.mother || ""
      ).trim(),

    dob:
      body.dob || "",

    gender:
      body.gender || "",

    bloodGroup:
      body.bloodGroup || "",

    aadhaar:
      String(
        body.aadhaar || ""
      ).trim(),

    pan:
      String(
        body.pan || ""
      ).trim(),

    penNo:
      String(
        body.penNo || ""
      ).trim(),

    admissionNo:
      String(
        body.admissionNo || ""
      ).trim(),

    admissionDate:
      body.admissionDate || "",

    admissionType:
      body.admissionType ||
      "New",

    session:
      body.session || "",

    class:
      body.class ||
      body.className ||
      "",

    className:
      body.className ||
      body.class ||
      "",

    section:
      body.section || "",

    rollNo:
      String(
        body.rollNo ||
          body.roll ||
          ""
      ).trim(),

    roll:
      String(
        body.roll ||
          body.rollNo ||
          ""
      ).trim(),

    mobile:
      String(
        body.mobile || ""
      ).trim(),

    alternateMobile:
      String(
        body.alternateMobile ||
          ""
      ).trim(),

    email:
      String(
        body.email || ""
      ).trim(),

    address:
      String(
        body.address || ""
      ).trim(),

    previousSchool:
      String(
        body.previousSchool ||
          ""
      ).trim(),

    receiptNo:
      String(
        body.receiptNo || ""
      ).trim(),

    status:
      body.status ||
      "Active",
  };
}

// =====================================================
// STUDENTS - GET ALL
// =====================================================

app.get(
  "/api/students",
  async (req, res) => {
    try {
      const students =
        await studentsCollection
          .find({})
          .sort({
            createdAt: -1,
          })
          .toArray();

      return res.json({
        success: true,

        students:
          cleanDocuments(
            students
          ),

        total:
          students.length,
      });
    } catch (error) {
      return sendError(
        res,
        error,
        "Failed to load students"
      );
    }
  }
);

// =====================================================
// STUDENTS - GET SINGLE
// =====================================================

app.get(
  "/api/students/:id",
  async (req, res) => {
    try {
      const objectId =
        mongoId(
          req.params.id
        );

      if (!objectId) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid student ID",
        });
      }

      const student =
        await studentsCollection.findOne(
          {
            _id: objectId,
          }
        );

      if (!student) {
        return res.status(404).json({
          success: false,
          message:
            "Student not found",
        });
      }

      return res.json({
        success: true,

        student:
          cleanDocument(
            student
          ),
      });
    } catch (error) {
      return sendError(
        res,
        error,
        "Failed to load student"
      );
    }
  }
);

// =====================================================
// STUDENTS - ADD
// =====================================================

app.post(
  "/api/students",
  async (req, res) => {
    try {
      const studentData =
        normalizeStudentData(
          req.body
        );

      // -----------------------------------------------
      // BASIC VALIDATION
      // -----------------------------------------------

      if (
        !studentData.name
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Student name is required",
        });
      }

      // -----------------------------------------------
      // DUPLICATE ADMISSION NUMBER
      // -----------------------------------------------

      if (
        studentData.admissionNo
      ) {
        const existing =
          await studentsCollection.findOne(
            {
              admissionNo:
                studentData.admissionNo,
            }
          );

        if (existing) {
          return res.status(409).json({
            success: false,
            message:
              "Admission number already exists",
          });
        }
      }

      // -----------------------------------------------
      // DUPLICATE RECEIPT NUMBER
      // -----------------------------------------------

      if (
        studentData.receiptNo
      ) {
        const existingReceipt =
          await studentsCollection.findOne(
            {
              receiptNo:
                studentData.receiptNo,
            }
          );

        if (existingReceipt) {
          return res.status(409).json({
            success: false,
            message:
              "Receipt number already exists",
          });
        }
      }

      // -----------------------------------------------
      // TIMESTAMPS
      // -----------------------------------------------

      const now =
        new Date();

      studentData.createdAt =
        now;

      studentData.updatedAt =
        now;

      // -----------------------------------------------
      // INSERT
      // -----------------------------------------------

      const result =
        await studentsCollection.insertOne(
          studentData
        );

      // -----------------------------------------------
      // GET SAVED DOCUMENT
      // -----------------------------------------------

      const savedStudent =
        await studentsCollection.findOne(
          {
            _id:
              result.insertedId,
          }
        );

      return res.status(201).json({
        success: true,

        message:
          "Student added successfully",

        student:
          cleanDocument(
            savedStudent
          ),
      });
    } catch (error) {
      console.error(
        "Add student error:",
        error
      );

      // MongoDB duplicate key
      if (
        error?.code === 11000
      ) {
        return res.status(409).json({
          success: false,

          message:
            "Duplicate student record. A unique field already exists.",

          error:
            error.message,
        });
      }

      return sendError(
        res,
        error,
        "Failed to add student"
      );
    }
  }
);

// =====================================================
// STUDENTS - UPDATE
// =====================================================

app.put(
  "/api/students/:id",
  async (req, res) => {
    try {
      const objectId =
        mongoId(
          req.params.id
        );

      if (!objectId) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid student ID",
        });
      }

      const existing =
        await studentsCollection.findOne(
          {
            _id: objectId,
          }
        );

      if (!existing) {
        return res.status(404).json({
          success: false,
          message:
            "Student not found",
        });
      }

      const updateData =
        normalizeStudentData(
          req.body
        );

      updateData.updatedAt =
        new Date();

      // Don't overwrite creation date
      delete updateData.createdAt;

      // -----------------------------------------------
      // DUPLICATE ADMISSION NUMBER CHECK
      // -----------------------------------------------

      if (
        updateData.admissionNo
      ) {
        const duplicate =
          await studentsCollection.findOne(
            {
              admissionNo:
                updateData.admissionNo,

              _id: {
                $ne: objectId,
              },
            }
          );

        if (duplicate) {
          return res.status(409).json({
            success: false,
            message:
              "Admission number already belongs to another student",
          });
        }
      }

      // -----------------------------------------------
      // DUPLICATE RECEIPT CHECK
      // -----------------------------------------------

      if (
        updateData.receiptNo
      ) {
        const duplicateReceipt =
          await studentsCollection.findOne(
            {
              receiptNo:
                updateData.receiptNo,

              _id: {
                $ne: objectId,
              },
            }
          );

        if (duplicateReceipt) {
          return res.status(409).json({
            success: false,
            message:
              "Receipt number already belongs to another student",
          });
        }
      }

      await studentsCollection.updateOne(
        {
          _id: objectId,
        },
        {
          $set:
            updateData,
        }
      );

      const updatedStudent =
        await studentsCollection.findOne(
          {
            _id: objectId,
          }
        );

      return res.json({
        success: true,

        message:
          "Student updated successfully",

        student:
          cleanDocument(
            updatedStudent
          ),
      });
    } catch (error) {
      console.error(
        "Update student error:",
        error
      );

      if (
        error?.code === 11000
      ) {
        return res.status(409).json({
          success: false,
          message:
            "Duplicate student data",
          error:
            error.message,
        });
      }

      return sendError(
        res,
        error,
        "Failed to update student"
      );
    }
  }
);

// =====================================================
// STUDENTS - DELETE
// =====================================================

app.delete(
  "/api/students/:id",
  async (req, res) => {
    try {
      const objectId =
        mongoId(
          req.params.id
        );

      if (!objectId) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid student ID",
        });
      }

      const result =
        await studentsCollection.deleteOne(
          {
            _id: objectId,
          }
        );

      if (
        result.deletedCount === 0
      ) {
        return res.status(404).json({
          success: false,
          message:
            "Student not found",
        });
      }

      return res.json({
        success: true,

        message:
          "Student deleted successfully",
      });
    } catch (error) {
      return sendError(
        res,
        error,
        "Failed to delete student"
      );
    }
  }
);

// =====================================================
// ADMISSION - NEXT RECEIPT NUMBER
// =====================================================

app.get(
  "/api/admissions/next-receipt",
  async (req, res) => {
    try {
      const latestStudent =
        await studentsCollection
          .find({
            receiptNo: {
              $exists: true,
              $ne: "",
            },
          })
          .sort({
            createdAt: -1,
          })
          .limit(1)
          .toArray();

      let nextNumber = 1;

      if (
        latestStudent.length > 0
      ) {
        const latestReceipt =
          String(
            latestStudent[0]
              .receiptNo || ""
          );

        // Extract last numeric portion
        const match =
          latestReceipt.match(
            /(\d+)$/
          );

        if (match) {
          nextNumber =
            parseInt(
              match[1],
              10
            ) + 1;
        }
      }

      const receiptNo =
        `REC-${new Date().getFullYear()}-${String(
          nextNumber
        ).padStart(4, "0")}`;

      return res.json({
        success: true,

        receiptNo,
      });
    } catch (error) {
      return sendError(
        res,
        error,
        "Failed to generate next receipt number"
      );
    }
  }
);

// =====================================================
// ADMISSION - CREATE STUDENT
// =====================================================

app.post(
  "/api/admissions",
  async (req, res) => {
    try {
      const studentData =
        normalizeStudentData(
          req.body
        );

      if (
        !studentData.name
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Student name is required",
        });
      }

      // Generate receipt if missing
      if (
        !studentData.receiptNo
      ) {
        const latest =
          await studentsCollection
            .find({
              receiptNo: {
                $exists: true,
                $ne: "",
              },
            })
            .sort({
              createdAt: -1,
            })
            .limit(1)
            .toArray();

        let nextNumber = 1;

        if (
          latest.length > 0
        ) {
          const match =
            String(
              latest[0]
                .receiptNo || ""
            ).match(
              /(\d+)$/
            );

          if (match) {
            nextNumber =
              parseInt(
                match[1],
                10
              ) + 1;
          }
        }

        studentData.receiptNo =
          `REC-${new Date().getFullYear()}-${String(
            nextNumber
          ).padStart(4, "0")}`;
      }

      // -----------------------------------------------
      // DUPLICATE ADMISSION NUMBER
      // -----------------------------------------------

      if (
        studentData.admissionNo
      ) {
        const duplicate =
          await studentsCollection.findOne(
            {
              admissionNo:
                studentData.admissionNo,
            }
          );

        if (duplicate) {
          return res.status(409).json({
            success: false,
            message:
              "Admission number already exists",
          });
        }
      }

      // -----------------------------------------------
      // DUPLICATE RECEIPT
      // -----------------------------------------------

      const duplicateReceipt =
        await studentsCollection.findOne(
          {
            receiptNo:
              studentData.receiptNo,
          }
        );

      if (duplicateReceipt) {
        return res.status(409).json({
          success: false,
          message:
            "Receipt number already exists",
        });
      }

      const now =
        new Date();

      studentData.createdAt =
        now;

      studentData.updatedAt =
        now;

      const result =
        await studentsCollection.insertOne(
          studentData
        );

      const savedStudent =
        await studentsCollection.findOne(
          {
            _id:
              result.insertedId,
          }
        );

      return res.status(201).json({
        success: true,

        message:
          "Admission saved successfully",

        student:
          cleanDocument(
            savedStudent
          ),
      });
    } catch (error) {
      console.error(
        "Admission error:",
        error
      );

      if (
        error?.code === 11000
      ) {
        return res.status(409).json({
          success: false,

          message:
            "Duplicate admission record",

          error:
            error.message,
        });
      }

      return sendError(
        res,
        error,
        "Failed to save admission"
      );
    }
  }
);

// =====================================================
// DATABASE INITIALIZATION
// =====================================================

async function initializeDatabase() {
  console.log(
    "Connecting to MongoDB..."
  );

  await client.connect();

  // Confirm connection
  await client
    .db("admin")
    .command({
      ping: 1,
    });

  // Main database
  db =
    client.db(
      "mpsa_school"
    );

  // ===================================================
  // COLLECTIONS
  // ===================================================

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

  classesCollection =
    db.collection(
      "classes"
    );

  subjectsCollection =
    db.collection(
      "subjects"
    );

  examsCollection =
    db.collection(
      "exams"
    );

  timetableCollection =
    db.collection(
      "timetable"
    );

  noticesCollection =
    db.collection(
      "notices"
    );

  admissionsCollection =
    db.collection(
      "admissions"
    );

  certificatesCollection =
    db.collection(
      "certificates"
    );

  transportCollection =
    db.collection(
      "transport"
    );

  inventoryCollection =
    db.collection(
      "inventory"
    );

  galleryCollection =
    db.collection(
      "gallery"
    );

  usersCollection =
    db.collection(
      "users"
    );

  activityLogCollection =
    db.collection(
      "activity_logs"
    );

  console.log(
    "📁 MongoDB collections initialized"
  );

  // ===================================================
  // IMPORTANT:
  // INDEX FIX
  // ===================================================
  //
  // Do NOT blindly call createIndex() on existing
  // indexes with different options.
  //
  // Existing database may already contain:
  //
  // studentId_1
  //
  // as a UNIQUE index.
  //
  // Calling createIndex({ studentId: 1 })
  // again without unique:true causes:
  //
  // IndexKeySpecsConflict
  //
  // So we inspect existing indexes first.
  // ===================================================

  await ensureIndex(
    studentAttendanceCollection,
    {
      studentId: 1,
      date: 1,
    },
    {
      unique: true,
      name:
        "studentId_date_unique",
    }
  );

  await ensureIndex(
    teacherAttendanceCollection,
    {
      teacherId: 1,
      date: 1,
    },
    {
      unique: true,
      name:
        "teacherId_date_unique",
    }
  );

  await ensureIndex(
    teacherSalaryCollection,
    {
      teacherId: 1,
      month: 1,
    },
    {
      unique: true,
      name:
        "teacherId_month_unique",
    }
  );

  // IMPORTANT:
  // We DO NOT recreate fees.studentId_1 blindly.
  //
  // Existing database already has:
  //
  // { studentId: 1, unique: true }
  //
  // Therefore we simply inspect it.
  await ensureExistingCompatibleIndex(
    feesCollection,
    {
      studentId: 1,
    }
  );

  await ensureIndex(
    resultsCollection,
    {
      studentId: 1,
      session: 1,
    },
    {
      unique: true,
      name:
        "studentId_session_unique",
    }
  );

  console.log(
    "✅ MongoDB indexes checked"
  );

  console.log(
    "✅ MongoDB connected successfully"
  );

  console.log(
    "Database:",
    db.databaseName
  );
}

// =====================================================
// SAFE INDEX CREATOR
// =====================================================

async function ensureIndex(
  collection,
  key,
  options = {}
) {
  try {
    const indexes =
      await collection.listIndexes().toArray();

    const requestedName =
      options.name;

    // Check exact named index
    if (
      requestedName &&
      indexes.some(
        (index) =>
          index.name ===
          requestedName
      )
    ) {
      console.log(
        `ℹ️ Index already exists: ${requestedName}`
      );

      return;
    }

    // Check same key pattern
    const existing =
      indexes.find(
        (index) =>
          JSON.stringify(
            index.key
          ) ===
          JSON.stringify(key)
      );

    if (existing) {
      console.log(
        `ℹ️ Compatible index already exists: ${existing.name}`
      );

      return;
    }

    const created =
      await collection.createIndex(
        key,
        options
      );

    console.log(
      `✅ Index created: ${created}`
    );
  } catch (error) {
    console.error(
      "Index creation warning:",
      error.message
    );

    // Don't stop server for index conflict
    if (
      error?.code === 86 ||
      error?.code === 85
    ) {
      console.log(
        "ℹ️ Existing MongoDB index retained."
      );

      return;
    }

    throw error;
  }
}

// =====================================================
// CHECK EXISTING COMPATIBLE INDEX
// =====================================================

async function ensureExistingCompatibleIndex(
  collection,
  key
) {
  try {
    const indexes =
      await collection.listIndexes().toArray();

    const existing =
      indexes.find(
        (index) =>
          JSON.stringify(
            index.key
          ) ===
          JSON.stringify(key)
      );

    if (existing) {
      console.log(
        `ℹ️ Existing index retained: ${existing.name}`
      );

      return;
    }

    // No index exists at all,
    // so creating a normal index is safe.
    const created =
      await collection.createIndex(
        key
      );

    console.log(
      `✅ Index created: ${created}`
    );
  } catch (error) {
    console.error(
      "Existing index check failed:",
      error.message
    );

    if (
      error?.code === 86 ||
      error?.code === 85
    ) {
      console.log(
        "ℹ️ MongoDB index conflict ignored safely."
      );

      return;
    }

    throw error;
  }
}

// =====================================================
// START SERVER
// =====================================================

async function startServer() {
  try {
    await initializeDatabase();

    app.listen(
      PORT,
      () => {
        console.log(
          "--------------------------------------------"
        );

        console.log(
          "🏫 MPSA SCHOOL MANAGEMENT SYSTEM"
        );

        console.log(
          `🚀 Server: http://localhost:${PORT}`
        );

        console.log(
          "--------------------------------------------"
        );

        console.log(
          "Students API: READY"
        );

        console.log(
          "Admission API: READY"
        );

        console.log(
          "Next Receipt API: READY"
        );

        console.log(
          "Health API: READY"
        );

        console.log(
          "--------------------------------------------"
        );
      }
    );
  } catch (error) {
    console.error(
      "\n❌ MongoDB connection failed"
    );

    console.error(
      error
    );

    process.exit(1);
  }
}

// =====================================================
// GRACEFUL SHUTDOWN
// =====================================================

process.on(
  "SIGINT",
  async () => {
    console.log(
      "\nClosing MongoDB connection..."
    );

    try {
      await client.close();
    } catch (error) {
      console.error(
        error.message
      );
    }

    process.exit(0);
  }
);

process.on(
  "SIGTERM",
  async () => {
    console.log(
      "\nClosing MongoDB connection..."
    );

    try {
      await client.close();
    } catch (error) {
      console.error(
        error.message
      );
    }

    process.exit(0);
  }
);

// =====================================================
// START
// =====================================================

startServer();

// ==================================================
// STUDENTS API
// ==================================================

// --------------------------------------------------
// GET ALL STUDENTS
// --------------------------------------------------

app.get("/api/students", async (req, res) => {
  try {
    const students = await studentsCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    res.json({
      success: true,
      students: cleanDocuments(students),
      total: students.length,
    });
  } catch (error) {
    sendError(
      res,
      error,
      "Failed to fetch students"
    );
  }
});


// --------------------------------------------------
// GET SINGLE STUDENT
// --------------------------------------------------

app.get("/api/students/:id", async (req, res) => {
  try {
    const id = mongoId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const student =
      await studentsCollection.findOne({
        _id: id,
      });

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      student: cleanDocument(student),
    });

  } catch (error) {
    sendError(
      res,
      error,
      "Failed to fetch student"
    );
  }
});


// --------------------------------------------------
// CREATE STUDENT / ADMISSION
// --------------------------------------------------

app.post("/api/students", async (req, res) => {
  try {

    const body = req.body || {};

    const className =
      body.className ||
      body.class ||
      "";

    const roll =
      body.roll ||
      body.rollNo ||
      "";

    // ----------------------------------------------
    // REQUIRED FIELDS
    // ----------------------------------------------

    if (
      !String(body.name || "").trim() ||
      !String(body.father || "").trim() ||
      !String(body.mother || "").trim() ||
      !body.dob ||
      !body.gender ||
      !String(className).trim() ||
      !String(body.section || "").trim() ||
      !String(body.mobile || "").trim() ||
      !String(body.address || "").trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Required student information is missing.",
      });
    }


    // ----------------------------------------------
    // DUPLICATE ADMISSION NUMBER
    // ----------------------------------------------

    const admissionNo =
      String(
        body.admissionNo || ""
      ).trim();

    if (admissionNo) {

      const existingAdmission =
        await studentsCollection.findOne({
          admissionNo,
        });

      if (existingAdmission) {
        return res.status(409).json({
          success: false,
          message:
            "Admission number already exists.",
        });
      }
    }


    // ----------------------------------------------
    // DUPLICATE RECEIPT
    // ----------------------------------------------

    const receiptNo =
      String(
        body.receiptNo || ""
      ).trim();

    if (receiptNo) {

      const existingReceipt =
        await studentsCollection.findOne({
          receiptNo,
        });

      if (existingReceipt) {
        return res.status(409).json({
          success: false,
          message:
            "Receipt number already exists.",
        });
      }
    }


    // ----------------------------------------------
    // STUDENT DOCUMENT
    // ----------------------------------------------

    const studentData = {

      name: String(
        body.name || ""
      ).trim(),

      father: String(
        body.father || ""
      ).trim(),

      mother: String(
        body.mother || ""
      ).trim(),


      // Personal
      dob: body.dob || "",

      gender:
        body.gender || "",

      bloodGroup:
        body.bloodGroup || "",


      // Identity
      aadhaar: String(
        body.aadhaar || ""
      ).trim(),

      pan: String(
        body.pan || ""
      ).trim(),

      penNo: String(
        body.penNo || ""
      ).trim(),


      // Admission
      admissionNo,

      admissionDate:
        body.admissionDate || "",

      admissionType:
        body.admissionType || "New",

      session:
        body.session || "",


      // Academic
      class: String(
        className
      ).trim(),

      className: String(
        className
      ).trim(),

      section: String(
        body.section || ""
      ).trim(),

      rollNo: String(
        roll
      ).trim(),

      roll: String(
        roll
      ).trim(),


      // Contact
      mobile: String(
        body.mobile || ""
      ).trim(),

      alternateMobile:
        String(
          body.alternateMobile || ""
        ).trim(),

      email: String(
        body.email || ""
      ).trim(),

      address: String(
        body.address || ""
      ).trim(),


      // Previous school
      previousSchool:
        String(
          body.previousSchool || ""
        ).trim(),


      // Receipt
      receiptNo,


      // Status
      status:
        body.status || "Active",

      active:
        parseBoolean(
          body.active,
          true
        ),


      // Dates
      createdAt: new Date(),

      updatedAt: new Date(),
    };


    // ----------------------------------------------
    // SAVE TO MONGODB
    // ----------------------------------------------

    const result =
      await studentsCollection.insertOne(
        studentData
      );


    const student =
      await studentsCollection.findOne({
        _id: result.insertedId,
      });


    // ----------------------------------------------
    // RESPONSE
    // ----------------------------------------------

    res.status(201).json({
      success: true,

      message:
        "Student admission saved successfully.",

      student:
        cleanDocument(student),
    });

  } catch (error) {

    console.error(
      "Create student error:",
      error
    );

    // Duplicate key protection
    if (
      error?.code === 11000
    ) {

      return res.status(409).json({
        success: false,

        message:
          "Duplicate student record. Admission number or receipt number may already exist.",

        error:
          error.message,
      });
    }

    sendError(
      res,
      error,
      "Failed to create student"
    );
  }
});


// --------------------------------------------------
// UPDATE STUDENT
// --------------------------------------------------

app.put("/api/students/:id", async (req, res) => {
  try {

    const id =
      mongoId(req.params.id);

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }


    const body =
      req.body || {};


    const className =
      body.className ||
      body.class ||
      "";


    const roll =
      body.roll ||
      body.rollNo ||
      "";


    // ----------------------------------------------
    // REQUIRED
    // ----------------------------------------------

    if (
      !String(body.name || "").trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Student name is required.",
      });
    }


    // ----------------------------------------------
    // CHECK STUDENT
    // ----------------------------------------------

    const existingStudent =
      await studentsCollection.findOne({
        _id: id,
      });

    if (!existingStudent) {
      return res.status(404).json({
        success: false,
        message:
          "Student not found.",
      });
    }


    // ----------------------------------------------
    // DUPLICATE ADMISSION NUMBER
    // ----------------------------------------------

    const admissionNo =
      String(
        body.admissionNo || ""
      ).trim();

    if (admissionNo) {

      const duplicate =
        await studentsCollection.findOne({
          admissionNo,
          _id: {
            $ne: id,
          },
        });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message:
            "Admission number already exists.",
        });
      }
    }


    // ----------------------------------------------
    // DUPLICATE RECEIPT
    // ----------------------------------------------

    const receiptNo =
      String(
        body.receiptNo || ""
      ).trim();

    if (receiptNo) {

      const duplicate =
        await studentsCollection.findOne({
          receiptNo,
          _id: {
            $ne: id,
          },
        });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message:
            "Receipt number already exists.",
        });
      }
    }


    // ----------------------------------------------
    // UPDATED DATA
    // ----------------------------------------------

    const updateData = {

      name:
        String(
          body.name || ""
        ).trim(),

      father:
        String(
          body.father || ""
        ).trim(),

      mother:
        String(
          body.mother || ""
        ).trim(),


      dob:
        body.dob || "",

      gender:
        body.gender || "",

      bloodGroup:
        body.bloodGroup || "",


      aadhaar:
        String(
          body.aadhaar || ""
        ).trim(),

      pan:
        String(
          body.pan || ""
        ).trim(),

      penNo:
        String(
          body.penNo || ""
        ).trim(),


      admissionNo,

      admissionDate:
        body.admissionDate || "",

      admissionType:
        body.admissionType || "New",

      session:
        body.session || "",


      class:
        String(
          className
        ).trim(),

      className:
        String(
          className
        ).trim(),

      section:
        String(
          body.section || ""
        ).trim(),


      rollNo:
        String(
          roll
        ).trim(),

      roll:
        String(
          roll
        ).trim(),


      mobile:
        String(
          body.mobile || ""
        ).trim(),

      alternateMobile:
        String(
          body.alternateMobile || ""
        ).trim(),

      email:
        String(
          body.email || ""
        ).trim(),

      address:
        String(
          body.address || ""
        ).trim(),


      previousSchool:
        String(
          body.previousSchool || ""
        ).trim(),

      receiptNo,


      status:
        body.status || "Active",

      active:
        parseBoolean(
          body.active,
          true
        ),


      updatedAt:
        new Date(),
    };


    // ----------------------------------------------
    // UPDATE MONGODB
    // ----------------------------------------------

    await studentsCollection.updateOne(
      {
        _id: id,
      },
      {
        $set: updateData,
      }
    );


    // ----------------------------------------------
    // GET UPDATED STUDENT
    // ----------------------------------------------

    const updatedStudent =
      await studentsCollection.findOne({
        _id: id,
      });


    res.json({
      success: true,

      message:
        "Student updated successfully.",

      student:
        cleanDocument(
          updatedStudent
        ),
    });

  } catch (error) {

    console.error(
      "Update student error:",
      error
    );

    if (
      error?.code === 11000
    ) {
      return res.status(409).json({
        success: false,
        message:
          "Duplicate admission number or receipt number.",
        error:
          error.message,
      });
    }

    sendError(
      res,
      error,
      "Failed to update student"
    );
  }
});


// --------------------------------------------------
// DELETE STUDENT
// --------------------------------------------------

app.delete(
  "/api/students/:id",
  async (req, res) => {

    try {

      const id =
        mongoId(req.params.id);

      if (!id) {
        return res.status(400).json({
          success: false,
          message:
            "Invalid student ID",
        });
      }


      const result =
        await studentsCollection.deleteOne({
          _id: id,
        });


      if (
        result.deletedCount === 0
      ) {
        return res.status(404).json({
          success: false,
          message:
            "Student not found.",
        });
      }


      res.json({
        success: true,

        message:
          "Student deleted successfully.",
      });

    } catch (error) {

      sendError(
        res,
        error,
        "Failed to delete student"
      );

    }

  }
);


// ==================================================
// NEXT RECEIPT NUMBER
// ==================================================

app.get(
  "/api/admissions/next-receipt",
  async (req, res) => {

    try {

      const latestStudent =
        await studentsCollection
          .find({
            receiptNo: {
              $exists: true,
              $ne: "",
            },
          })
          .sort({
            createdAt: -1,
          })
          .limit(1)
          .toArray();


      let nextNumber = 1;


      if (
        latestStudent.length > 0
      ) {

        const latestReceipt =
          latestStudent[0]
            .receiptNo;


        const match =
          String(
            latestReceipt
          ).match(
            /(\d+)$/
          );


        if (match) {

          nextNumber =
            Number(
              match[1]
            ) + 1;

        }

      }


      const receiptNo =
        `MPSA-${String(
          nextNumber
        ).padStart(4, "0")}`;


      res.json({
        success: true,
        receiptNo,
      });

    } catch (error) {

      sendError(
        res,
        error,
        "Failed to generate next receipt number"
      );

    }

  }
);

// ============================================================
// PART 3
// DATABASE INITIALIZATION + SAFE INDEX SYSTEM
// ============================================================


// ============================================================
// SAFE CREATE INDEX
// ============================================================

async function safeCreateIndex(
  collection,
  keys,
  options = {}
) {
  try {

    // --------------------------------------------------------
    // Generate the same name MongoDB would normally generate
    // --------------------------------------------------------

    const generatedName = Object.entries(keys)
      .map(([key, direction]) => `${key}_${direction}`)
      .join("_");


    const requestedName =
      options.name || generatedName;


    // --------------------------------------------------------
    // Check existing indexes
    // --------------------------------------------------------

    const indexes =
      await collection
        .listIndexes()
        .toArray();


    // --------------------------------------------------------
    // Check whether exact index already exists
    // --------------------------------------------------------

    const sameKeyIndex =
      indexes.find((index) => {

        const existingKeys =
          JSON.stringify(index.key);

        const requestedKeys =
          JSON.stringify(keys);

        return (
          existingKeys ===
          requestedKeys
        );

      });


    // --------------------------------------------------------
    // EXACT INDEX ALREADY EXISTS
    // --------------------------------------------------------

    if (sameKeyIndex) {

      // Same key + same important options
      // => nothing to do

      const existingUnique =
        Boolean(
          sameKeyIndex.unique
        );

      const requestedUnique =
        Boolean(
          options.unique
        );


      if (
        existingUnique ===
        requestedUnique
      ) {

        console.log(
          `✓ Index already exists: ${collection.collectionName}.${sameKeyIndex.name}`
        );

        return sameKeyIndex.name;
      }


      // ------------------------------------------------------
      // Same key but different UNIQUE option
      // ------------------------------------------------------

      console.log(
        `⚠️ Index conflict detected on ${collection.collectionName}.${sameKeyIndex.name}`
      );

      console.log(
        `   Existing unique: ${existingUnique}`
      );

      console.log(
        `   Requested unique: ${requestedUnique}`
      );


      // If requested index has the same name,
      // MongoDB cannot create another index with
      // different options.

      // We deliberately keep the existing index.
      // This prevents server startup failure.

      console.log(
        `✓ Keeping existing index: ${sameKeyIndex.name}`
      );

      return sameKeyIndex.name;
    }


    // --------------------------------------------------------
    // SAME NAME BUT DIFFERENT KEY
    // --------------------------------------------------------

    const sameNameIndex =
      indexes.find(
        (index) =>
          index.name ===
          requestedName
      );


    if (sameNameIndex) {

      console.log(
        `⚠️ Index name conflict: ${requestedName}`
      );

      console.log(
        `   Existing index is kept.`
      );

      return sameNameIndex.name;
    }


    // --------------------------------------------------------
    // CREATE NEW INDEX
    // --------------------------------------------------------

    const indexName =
      await collection.createIndex(
        keys,
        {
          ...options,
          name: requestedName,
        }
      );


    console.log(
      `✓ Index created: ${collection.collectionName}.${indexName}`
    );


    return indexName;

  } catch (error) {

    // --------------------------------------------------------
    // INDEX CONFLICT
    // --------------------------------------------------------

    if (
      error?.code === 85 ||
      error?.code === 86
    ) {

      console.log(
        `⚠️ Index conflict ignored: ${collection.collectionName}`
      );

      console.log(
        error.message
      );

      return null;
    }


    // --------------------------------------------------------
    // Other errors
    // --------------------------------------------------------

    console.error(
      `❌ Failed to create index on ${collection.collectionName}`,
      error
    );

    return null;
  }
}



// ============================================================
// INITIALIZE DATABASE
// ============================================================


// ============================================================
// PART 4
// SERVER START + MONGODB CONNECTION
// ============================================================


// ============================================================
// GLOBAL ERROR HANDLERS
// ============================================================

process.on("unhandledRejection", (reason) => {
  console.error(
    "\n❌ UNHANDLED PROMISE REJECTION"
  );

  console.error(reason);
});


process.on("uncaughtException", (error) => {
  console.error(
    "\n❌ UNCAUGHT EXCEPTION"
  );

  console.error(error);
});


// ============================================================
// 404 HANDLER
// ============================================================

app.use((req, res) => {

  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
    method: req.method,
  });

});


// ============================================================
// GLOBAL EXPRESS ERROR HANDLER
// ============================================================

app.use((error, req, res, next) => {

  console.error(
    "\n❌ EXPRESS ERROR:"
  );

  console.error(error);


  if (res.headersSent) {
    return next(error);
  }


  res.status(
    error.status || 500
  ).json({

    success: false,

    message:
      error.message ||
      "Internal server error",

  });

});


// ============================================================
// START SERVER
// ============================================================



// ============================================================
// START APPLICATION
// ============================================================

startServer();
