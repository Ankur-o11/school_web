// =====================================================
// MPSA SCHOOL MANAGEMENT SYSTEM
// MODULAR EXPRESS SERVER
// =====================================================

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dns from "dns";
import { MongoClient } from "mongodb";

// =====================================================
// MODULE ROUTES
// =====================================================

// Students
import studentsRoutes from "./modules/students/students.routes.js";

// Subjects
import subjectsRoutes from "./modules/subjects/subjects.routes.js";

// Results
import resultsRoutes from "./modules/results/results.routes.js";

// =====================================================
// ENVIRONMENT
// =====================================================

dotenv.config({
  path: "./server.env",
});

// =====================================================
// DNS
// =====================================================

dns.setServers([
  "8.8.8.8",
  "1.1.1.1",
]);

// =====================================================
// APP
// =====================================================

const app = express();

const PORT = process.env.PORT || 5000;

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error(
    "âŒ MONGODB_URI is missing in server.env"
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

app.use(express.json({ limit: "10mb" }));

app.use(
  express.urlencoded({
    extended: true,
    limit: "10mb",
  })
);

// =====================================================
// MONGODB
// =====================================================

const client = new MongoClient(MONGODB_URI, {
  serverSelectionTimeoutMS: 15000,
  connectTimeoutMS: 15000,
  socketTimeoutMS: 45000,
});

let db;

// =====================================================
// DATABASE CONNECTION
// =====================================================

async function connectDatabase() {
  console.log("Connecting to MongoDB...");

  await client.connect();

  await client
    .db("admin")
    .command({
      ping: 1,
    });

  db = client.db("mpsa_school");

  console.log(
    "âœ… MongoDB connected successfully"
  );

  console.log(
    "Database:",
    db.databaseName
  );

  return db;
}

// =====================================================
// HEALTH
// =====================================================

app.get(
  "/api/health",
  async (req, res) => {
    try {
      if (!db) {
        return res.status(503).json({
          success: false,
          message: "Database not connected",
        });
      }

      await db.command({
        ping: 1,
      });

      res.json({
        success: true,
        message:
          "MPSA School Backend is running",
        database: db.databaseName,
      });
    } catch (error) {
      console.error(
        "Health check error:",
        error
      );

      res.status(500).json({
        success: false,
        message:
          "Database health check failed",
      });
    }
  }
);

// =====================================================
// API ROUTES
// =====================================================

app.use(
  "/api/activity-log",
  activityLogRoutes
);

app.use(
  "/api/admissions",
  admissionsRoutes
);

app.use(
  "/api/attendance",
  attendanceRoutes
);

app.use(
  "/api/certificates",
  certificatesRoutes
);

app.use(
  "/api/classes",
  classesRoutes
);

app.use(
  "/api/dashboard",
  dashboardRoutes
);

app.use(
  "/api/events",
  eventsRoutes
);

app.use(
  "/api/exams",
  examsRoutes
);

app.use(
  "/api/fees",
  feesRoutes
);

app.use(
  "/api/gallery",
  galleryRoutes
);

app.use(
  "/api/health-records",
  healthRecordsRoutes
);

app.use(
  "/api/homework",
  homeworkRoutes
);

app.use(
  "/api/inventory",
  inventoryRoutes
);

app.use(
  "/api/library",
  libraryRoutes
);

app.use(
  "/api/notices",
  noticesRoutes
);

app.use(
  "/api/notifications",
  notificationsRoutes
);

app.use(
  "/api/parent-communication",
  parentCommunicationRoutes
);

app.use(
  "/api/parents",
  parentsRoutes
);

app.use(
  "/api/reports",
  reportsRoutes
);

app.use(
  "/api/results",
  resultsRoutes
);

app.use(
  "/api/roles-permissions",
  rolesPermissionsRoutes
);

app.use(
  "/api/settings",
  settingsRoutes
);

app.use(
  "/api/students",
  studentsRoutes
);

app.use(
  "/api/subjects",
  subjectsRoutes
);

app.use(
  "/api/teachers",
  teachersRoutes
);

app.use(
  "/api/teacher-salary",
  teacherSalaryRoutes
);

app.use(
  "/api/timetable",
  timetableRoutes
);

app.use(
  "/api/transport",
  transportRoutes
);

app.use(
  "/api/users",
  usersRoutes
);

// =====================================================
// API NOT FOUND
// =====================================================

app.use(
  "/api",
  (req, res) => {
    res.status(404).json({
      success: false,
      message:
        `API route not found: ${req.method} ${req.originalUrl}`,
    });
  }
);

// =====================================================
// GLOBAL ERROR HANDLER
// =====================================================

app.use(
  (error, req, res, next) => {
    console.error(
      "âŒ SERVER ERROR:",
      error
    );

    res.status(
      error.status || 500
    ).json({
      success: false,
      message:
        error.message ||
        "Internal server error",
    });
  }
);

// =====================================================
// START SERVER
// =====================================================

async function startServer() {
  try {
    await connectDatabase();

    app.listen(
      PORT,
      () => {
        console.log("");
        console.log(
          "========================================"
        );
        console.log(
          "ðŸš€ MPSA SCHOOL BACKEND"
        );
        console.log(
          "========================================"
        );
        console.log(
          `Server: http://localhost:${PORT}`
        );
        console.log(
          `Health: http://localhost:${PORT}/api/health`
        );
        console.log(
          "========================================"
        );
        console.log("");
      }
    );
  } catch (error) {
    console.error("");
    console.error(
      "âŒ FAILED TO START SERVER"
    );
    console.error(
      error
    );
    console.error("");

    try {
      await client.close();
    } catch {}

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
      "\nStopping server..."
    );

    await client.close();

    process.exit(0);
  }
);

process.on(
  "SIGTERM",
  async () => {
    console.log(
      "\nStopping server..."
    );

    await client.close();

    process.exit(0);
  }
);

// =====================================================
// START
// =====================================================

startServer();
