// =====================================================
// MPSA SCHOOL MANAGEMENT SYSTEM
// DATABASE CONFIGURATION
// MongoDB Atlas
// =====================================================

import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config({
  path: "./server.env",
});

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

  console.log("âœ… MongoDB connected successfully");
  console.log("Database:", db.databaseName);

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
