import dotenv from "dotenv";
import path from "path";
import dns from "dns";
import { fileURLToPath } from "url";
import { MongoClient } from "mongodb";
import bcrypt from "bcryptjs";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

const envPath = path.resolve("server/server.env");
dotenv.config({ path: envPath });

async function checkPass() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB_NAME || "mpsa_school";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db(dbName);
    const usersCol = db.collection("users");

    const envEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const envPassword = process.env.ADMIN_PASSWORD || "";

    console.log("Checking admin user in DB...");
    const adminUser = await usersCol.findOne({ role: "Admin" });

    if (adminUser) {
      console.log("Found admin user ID:", adminUser._id);
      console.log("DB Admin Email:", adminUser.email);
      console.log("DB Admin Username:", adminUser.username);
      console.log("Is DB email equal to env ADMIN_EMAIL?", adminUser.email === envEmail ? "YES" : "NO");

      const matchEnvPass = await bcrypt.compare(envPassword, adminUser.password);
      console.log("Does DB password hash match env ADMIN_PASSWORD?", matchEnvPass ? "YES" : "NO");

      // Also check standard default fallback passwords in case it was seeded earlier
      const defaultPasses = ["Admin@MPSA2026", "admin123", "admin", "Admin@123"];
      for (const dp of defaultPasses) {
        if (await bcrypt.compare(dp, adminUser.password)) {
          console.log(`DB password hash matches legacy fallback password "${dp}": YES`);
        }
      }
    }
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

checkPass();
