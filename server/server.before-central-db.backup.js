import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dns from "dns";
import { MongoClient } from "mongodb";

import studentsRoutes from "./modules/students/students.routes.js";
import subjectsRoutes from "./modules/subjects/subjects.routes.js";
import resultsRoutes from "./modules/results/results.routes.js";

dotenv.config({
  path: "./server.env",
});

dns.setServers([
  "8.8.8.8",
  "1.1.1.1",
]);

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("❌ MONGODB_URI is missing in server.env");
  process.exit(1);
}

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

const client = new MongoClient(MONGODB_URI, {
  serverSelectionTimeoutMS: 15000,
  connectTimeoutMS: 15000,
  socketTimeoutMS: 45000,
});

let db;

app.locals.db = null;

// =====================================================
// ACTIVE MODULES
// =====================================================

app.use("/api/students", studentsRoutes);
app.use("/api/subjects", subjectsRoutes);
app.use("/api/results", resultsRoutes);

// =====================================================
// HEALTH CHECK
// =====================================================

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "MPSA School backend is running",
    database: db ? "connected" : "not connected",
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
    console.log("Connecting to MongoDB...");

    await client.connect();

    await client.db("admin").command({
      ping: 1,
    });

    db = client.db("mpsa_school");

    app.locals.db = db;

    console.log("✅ MongoDB connected successfully");
    console.log("Database:", db.databaseName);

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

    try {
      await client.close();
    } catch {}

    process.exit(1);
  }
}

startServer();

process.on("SIGINT", async () => {
  console.log("\nShutting down server...");

  try {
    await client.close();
  } catch {}

  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\nShutting down server...");

  try {
    await client.close();
  } catch {}

  process.exit(0);
});
