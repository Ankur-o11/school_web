import { getDatabase } from "../../config/database.js";

function cleanDocument(doc) {
  if (!doc) return null;
  const cleaned = {
    ...doc,
    id: doc._id ? doc._id.toString() : doc.id,
  };
  delete cleaned._id;
  return cleaned;
}

export async function getActivityLogs(req, res) {
  try {
    const db = getDatabase();
    const logsCollection = db.collection("activityLogs");

    const { module: moduleName, action, limit = 100 } = req.query;
    const filter = {};

    if (moduleName) filter.module = moduleName;
    if (action) filter.action = action;

    const logs = await logsCollection
      .find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .toArray();

    return res.status(200).json({
      success: true,
      data: logs.map(cleanDocument),
    });
  } catch (error) {
    console.error("getActivityLogs error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch activity logs.",
    });
  }
}
