import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dns from "dns";
import path from "path";
import { fileURLToPath } from "url";

import {
  connectDatabase,
  closeDatabase,
} from "./config/database.js";

import {
  setStudentsDatabase,
} from "./modules/students/students.controller.js";
import {
  setAdmissionsDatabase,
} from "./modules/admissions/admissions.controller.js";

import { seedInitialAdmin } from "./modules/auth/auth.controller.js";

import authRoutes from "./modules/auth/auth.routes.js";
import usersRoutes from "./modules/users/users.routes.js";
import rolesPermissionsRoutes from "./modules/rolesPermissions/rolesPermissions.routes.js";
import teachersRoutes from "./modules/teachers/teachers.routes.js";
import teacherAttendanceRoutes from "./modules/teacherAttendance/teacherAttendance.routes.js";
import teacherSalaryRoutes from "./modules/teacherSalary/teacherSalary.routes.js";
import activityLogRoutes from "./modules/activityLog/activityLog.routes.js";

import studentsRoutes from "./modules/students/students.routes.js";
import admissionsRoutes from "./modules/admissions/admissions.routes.js";
import subjectsRoutes from "./modules/subjects/subjects.routes.js";
import resultsRoutes from "./modules/results/results.routes.js";
import classesRoutes from "./modules/classes/classes.routes.js";
import feesRoutes from "./modules/fees/fees.routes.js";
import attendanceRoutes from "./modules/attendance/attendance.routes.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "./server.env") });
dotenv.config({ path: "./server.env" });
dotenv.config({ path: "./server/server.env" });

dns.setServers([
  "8.8.8.8",
  "1.1.1.1",
]);

const app = express();
const PORT = process.env.PORT || 5000;

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
    limit: "10mb",
  })
);

import communicationsRoutes from "./modules/communications/communications.routes.js";

// =====================================================
// ACTIVE MODULES
// =====================================================

app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/roles-permissions", rolesPermissionsRoutes);
app.use("/api/teachers", teachersRoutes);
app.use("/api/teacher-attendance", teacherAttendanceRoutes);
app.use("/api/teacher-salary", teacherSalaryRoutes);
app.use("/api/activity-log", activityLogRoutes);
app.use("/api/communications", communicationsRoutes);

app.use("/api/students", studentsRoutes);
app.use("/api/admissions", admissionsRoutes);
app.use("/api/subjects", subjectsRoutes);
app.use("/api/results", resultsRoutes);
app.use("/api/classes", classesRoutes);
app.use("/api/fees", feesRoutes);
app.use("/api/student-attendance", attendanceRoutes);

// =====================================================
// HEALTH
// =====================================================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "MPSA School backend is running",
    database: "connected",
  });
});

// =====================================================
// API 404
// =====================================================

app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    path: req.originalUrl,
  });
});

// =====================================================
// ERROR HANDLER
// =====================================================

app.use((error, req, res, next) => {
  console.error("❌ Server error:", error);

  res.status(error.status || 500).json({
    success: false,
    message: error.message || "Internal server error",
  });
});

// =====================================================
// START SERVER
// =====================================================

async function startServer() {
  try {
    const db = await connectDatabase();

    // Students and Admissions modules use their own database setters.
    setStudentsDatabase(db);
    setAdmissionsDatabase(db);

    // Make database available to modules that use req.app.locals.db.
    app.locals.db = db;

    // Seed default admin safely if none exists
    await seedInitialAdmin(db);

    console.log("✅ Module databases initialized");

    app.listen(PORT, () => {
      console.log("======================================");
      console.log("🚀 MPSA SCHOOL BACKEND RUNNING");
      console.log(`📡 Server: http://localhost:${PORT}`);
      console.log(`❤️ Health: http://localhost:${PORT}/api/health`);
      console.log("======================================");
    });
  } catch (error) {
    console.error("❌ Failed to start server:");
    console.error(error);

    process.exit(1);
  }
}

// =====================================================
// SHUTDOWN
// =====================================================

async function shutdown() {
  console.log("\nShutting down server...");

  try {
    await closeDatabase();
  } catch (error) {
    console.error(
      "Database shutdown error:",
      error.message
    );
  }

  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

startServer();
