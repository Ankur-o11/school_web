// =====================================================
// MPSA SCHOOL MANAGEMENT SYSTEM
// DATABASE CONFIGURATION
// MongoDB Atlas
// =====================================================

import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import dns from "dns";
import path from "path";
import { fileURLToPath } from "url";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../server.env") });
dotenv.config({ path: "./server.env" });
dotenv.config({ path: "./server/server.env" });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error(
    "MONGODB_URI is missing in server.env"
  );
}

const client = new MongoClient(MONGODB_URI, {
  serverSelectionTimeoutMS: 15000,
  connectTimeoutMS: 15000,
  socketTimeoutMS: 45000,
});

let db = null;

// =====================================================
// CONNECT DATABASE
// =====================================================

export async function connectDatabase() {
  if (db) {
    return db;
  }

  console.log("Connecting to MongoDB...");

  await client.connect();

  db = client.db("mpsa_school");

  console.log("✅ MongoDB connected successfully");
  console.log("Database:", db.databaseName);

  // Initialize Indexes safely
  try {
    await db.collection("students").createIndex({ admissionNo: 1 }, { unique: true, sparse: true });
    await db.collection("students").createIndex({ class: 1, section: 1 });
    await db.collection("teachers").createIndex({ employeeId: 1 }, { unique: true, sparse: true });
    await db.collection("classes").createIndex({ className: 1, section: 1 }, { unique: true });
    await db.collection("subjects").createIndex({ code: 1, class: 1, section: 1 });
  } catch (idxErr) {
    console.warn("Index initialization notice:", idxErr.message);
  }

  return db;
}

// =====================================================
// GET DATABASE
// =====================================================

export function getDatabase() {
  if (!db) {
    throw new Error(
      "Database is not connected"
    );
  }

  return db;
}

// =====================================================
// CLOSE DATABASE
// =====================================================

export async function closeDatabase() {
  await client.close();

  db = null;

  console.log(
    "MongoDB connection closed"
  );
}
