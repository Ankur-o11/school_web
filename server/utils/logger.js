import { getDatabase } from "../config/database.js";

export async function logActivity(req, action, moduleName, details = {}) {
  try {
    const db = getDatabase();
    const logsCollection = db.collection("activityLogs");

    // Remove any sensitive data if passed in details
    const sanitizedDetails = { ...details };
    delete sanitizedDetails.password;
    delete sanitizedDetails.token;
    delete sanitizedDetails.jwt;

    const logEntry = {
      user: req?.user ? {
        id: req.user.id,
        name: req.user.name || req.user.username,
        email: req.user.email,
        role: req.user.role,
      } : { name: "System / Anonymous", role: "Visitor" },
      action,
      module: moduleName,
      details: sanitizedDetails,
      ip: req?.ip || req?.headers?.["x-forwarded-for"] || "127.0.0.1",
      createdAt: new Date(),
    };

    await logsCollection.insertOne(logEntry);
  } catch (error) {
    console.error("⚠️ Failed to write activity log:", error.message);
  }
}
