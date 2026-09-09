import { getDatabase } from "../../config/database.js";
import { ObjectId } from "mongodb";
import { logActivity } from "../../utils/logger.js";
import { normalizePhoneNumber } from "../../utils/whatsappService.js";

const DEFAULT_TEMPLATES = [
  {
    id: "tpl_attendance_reminder",
    name: "Attendance Reminder",
    type: "Attendance Reminder",
    content: `Dear Parent/Guardian,

This is a reminder regarding the attendance of your ward {{studentName}}.

Current Attendance: {{attendancePercentage}}%
Class & Section: {{classSection}}
Total Working Days: {{totalWorkingDays}}
Present: {{presentDays}} | Absent: {{absentDays}}

Please ensure regular attendance.

Regards,
{{schoolName}}`,
    isDefault: true,
  },
  {
    id: "tpl_low_attendance_alert",
    name: "Low Attendance Alert",
    type: "Low Attendance Alert",
    content: `Dear Parent/Guardian,

⚠️ ATTENDANCE WARNING for {{studentName}} (Class {{classSection}}).

Current Attendance is LOW: {{attendancePercentage}}% (Required Minimum: 75%).
Total Working Days: {{totalWorkingDays}}
Present Days: {{presentDays}}
Absent Days: {{absentDays}}

Please contact the school administration.

Regards,
{{schoolName}}`,
    isDefault: true,
  },
  {
    id: "tpl_fee_reminder",
    name: "Fee Payment Reminder",
    type: "Fee Payment Reminder",
    content: `Dear Parent/Guardian,

This is a reminder that the school fee for {{studentName}}, Class {{classSection}}, is pending.

Pending Amount: ₹{{pendingAmount}}
Total Fee: ₹{{totalFee}}
Paid Amount: ₹{{paidAmount}}
Due Date: {{dueDate}}

Kindly clear the pending fee at the earliest.

Regards,
{{schoolName}}`,
    isDefault: true,
  },
  {
    id: "tpl_fee_overdue",
    name: "Fee Overdue Notice",
    type: "Fee Overdue Notice",
    content: `Dear Parent/Guardian,

⚠️ OVERDUE FEE NOTICE for {{studentName}}, Class {{classSection}}.

Pending Amount: ₹{{pendingAmount}}
Due Date: {{dueDate}}
Overdue Days: {{overdueDays}} Days

Kindly make the payment immediately to avoid any inconvenience.

Regards,
{{schoolName}}`,
    isDefault: true,
  },
  {
    id: "tpl_custom_message",
    name: "Custom Message",
    type: "Custom Message",
    content: `Dear Parent/Guardian,

Regarding {{studentName}} (Class {{classSection}}):

Please be informed about the upcoming school announcement.

Regards,
{{schoolName}}`,
    isDefault: true,
  },
];

function cleanDocument(doc) {
  if (!doc) return null;
  const cleaned = {
    ...doc,
    id: doc._id ? doc._id.toString() : doc.id,
  };
  delete cleaned._id;
  return cleaned;
}

// GET /api/communications/templates
export async function getTemplates(req, res) {
  try {
    const db = getDatabase();
    const collection = db.collection("communicationTemplates");

    const customTemplates = await collection.find({}).toArray();

    if (customTemplates.length === 0) {
      return res.status(200).json({
        success: true,
        data: DEFAULT_TEMPLATES,
      });
    }

    const merged = [...DEFAULT_TEMPLATES];
    customTemplates.forEach((t) => {
      const idx = merged.findIndex((m) => m.id === t.id || m.type === t.type);
      if (idx >= 0) {
        merged[idx] = cleanDocument(t);
      } else {
        merged.push(cleanDocument(t));
      }
    });

    return res.status(200).json({
      success: true,
      data: merged,
    });
  } catch (error) {
    console.error("getTemplates error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch message templates.",
    });
  }
}

// POST /api/communications/templates
export async function saveTemplate(req, res) {
  try {
    const { name, type, content, id } = req.body;

    if (!name || !content) {
      return res.status(400).json({
        success: false,
        message: "Template name and content are required.",
      });
    }

    const db = getDatabase();
    const collection = db.collection("communicationTemplates");

    const templateId = id || `tpl_${Date.now()}`;
    const updateData = {
      id: templateId,
      name,
      type: type || name,
      content,
      updatedAt: new Date(),
    };

    await collection.updateOne(
      { id: templateId },
      { $set: updateData },
      { upsert: true }
    );

    await logActivity(req, "TEMPLATE_SAVED", "COMMUNICATIONS", { templateName: name });

    return res.status(200).json({
      success: true,
      message: "Template saved successfully.",
      data: updateData,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to save template.",
    });
  }
}

// DELETE /api/communications/templates/:id
export async function deleteTemplate(req, res) {
  try {
    const { id } = req.params;
    const db = getDatabase();
    const collection = db.collection("communicationTemplates");

    await collection.deleteOne({ id });

    await logActivity(req, "TEMPLATE_DELETED", "COMMUNICATIONS", { templateId: id });

    return res.status(200).json({
      success: true,
      message: "Template deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete template.",
    });
  }
}

// POST /api/communications/log
export async function logCommunication(req, res) {
  try {
    const {
      studentId,
      studentName,
      recipientNumber,
      recipientPhone,
      recipientName,
      messageType,
      templateCategory,
      message,
      compiledMessage,
      source = "whatsapp_click_to_chat",
    } = req.body;

    const targetNumber = recipientNumber || recipientPhone;
    const targetMessage = message || compiledMessage;
    const categoryName = messageType || templateCategory || "General Message";

    if (!targetNumber || !targetMessage) {
      return res.status(400).json({
        success: false,
        message: "Recipient number and message content are required.",
      });
    }

    const db = getDatabase();
    const logsCollection = db.collection("communicationLogs");

    const normalizedNumber = normalizePhoneNumber(targetNumber);

    const logEntry = {
      studentId: studentId || null,
      studentName: studentName || "N/A",
      recipientNumber: normalizedNumber || targetNumber,
      recipientName: recipientName || "Parent/Guardian",
      messageType: categoryName,
      message: targetMessage,
      source,
      status: "whatsapp_link_opened",
      sentBy: req.user
        ? {
            id: req.user.id,
            name: req.user.name,
            role: req.user.role,
          }
        : { name: "System User" },
      sentAt: new Date(),
    };

    const result = await logsCollection.insertOne(logEntry);

    await logActivity(req, "WHATSAPP_LINK_OPENED", "COMMUNICATIONS", {
      studentId,
      recipientNumber: normalizedNumber,
      messageType: categoryName,
    });

    return res.status(201).json({
      success: true,
      message: "Communication recorded successfully.",
      logId: result.insertedId.toString(),
    });
  } catch (error) {
    console.error("logCommunication error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to record communication log.",
    });
  }
}

// GET /api/communications/logs
export async function getAllCommunicationLogs(req, res) {
  try {
    const db = getDatabase();
    const logsCollection = db.collection("communicationLogs");

    const logs = await logsCollection
      .find({})
      .sort({ sentAt: -1 })
      .limit(100)
      .toArray();

    return res.status(200).json({
      success: true,
      data: logs.map(cleanDocument),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch communication logs.",
    });
  }
}

// GET /api/communications/history/:studentId
export async function getStudentCommunicationHistory(req, res) {
  try {
    const { studentId } = req.params;
    const db = getDatabase();
    const logsCollection = db.collection("communicationLogs");

    // Verify parent / student data authorization
    if (req.user && req.user.role === "Student" && req.user.id !== studentId) {
      return res.status(403).json({
        success: false,
        message: "Access forbidden.",
      });
    }

    if (req.user && req.user.role === "Parent") {
      const isAssigned = (req.user.assignedChildren || []).includes(studentId);
      if (!isAssigned) {
        return res.status(403).json({
          success: false,
          message: "Access forbidden.",
        });
      }
    }

    const history = await logsCollection
      .find({ studentId })
      .sort({ sentAt: -1 })
      .toArray();

    return res.status(200).json({
      success: true,
      data: history.map(cleanDocument),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch communication history.",
    });
  }
}
