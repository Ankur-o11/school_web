import dotenv from "dotenv";
import path from "path";
import dns from "dns";
import { fileURLToPath } from "url";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const envPath = path.resolve("server/server.env");
dotenv.config({ path: envPath });

console.log("Environment Variables Presence Check:");
console.log("MONGODB_URI:", process.env.MONGODB_URI ? "PRESENT" : "MISSING");
console.log("MONGODB_DB_NAME:", process.env.MONGODB_DB_NAME ? "PRESENT" : "MISSING");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "PRESENT" : "MISSING");
console.log("ADMIN_EMAIL:", process.env.ADMIN_EMAIL ? "PRESENT" : "MISSING");
console.log("ADMIN_PASSWORD:", process.env.ADMIN_PASSWORD ? "PRESENT" : "MISSING");

async function runCheck() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || "mpsa_school";

  if (!uri) {
    console.error("No MONGODB_URI found.");
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log("Database: CONNECTED");

    const db = client.db(dbName);
    const usersCol = db.collection("users");

    const adminEmail = process.env.ADMIN_EMAIL || "admin@mpsa.com";
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@MPSA2026";

    // Look for admin user by email or username
    const adminUser = await usersCol.findOne({
      $or: [
        { email: adminEmail.trim().toLowerCase() },
        { username: "admin" },
        { role: "Admin" }
      ]
    });

    if (!adminUser) {
      console.log("Admin user: MISSING in collection");
    } else {
      console.log("Admin user: EXISTS");
      console.log("Email match:", adminUser.email === adminEmail.trim().toLowerCase() ? "YES" : "NO");
      console.log("Username:", adminUser.username || "N/A");
      console.log("Password hash:", adminUser.password ? "PRESENT" : "MISSING");
      console.log("Role:", adminUser.role);
      console.log("Status:", adminUser.status || "Active");

      if (adminUser.password) {
        const isMatchWithEnv = await bcrypt.compare(adminPassword, adminUser.password);
        console.log("Bcrypt check against ADMIN_PASSWORD env var:", isMatchWithEnv ? "PASS" : "FAIL");

        if (adminUser.password === adminPassword) {
          console.log("WARNING: Admin password stored as PLAIN TEXT!");
        }
      }
    }

    const allUsers = await usersCol.find({}, { projection: { email: 1, username: 1, role: 1, status: 1 } }).toArray();
    console.log("Total users in database:", allUsers.length);
    allUsers.forEach((u, i) => {
      console.log(`User ${i + 1}: email=${u.email}, username=${u.username}, role=${u.role}, status=${u.status}`);
    });

  } catch (err) {
    console.error("DB Check Error:", err.message);
  } finally {
    await client.close();
  }
}

runCheck();
