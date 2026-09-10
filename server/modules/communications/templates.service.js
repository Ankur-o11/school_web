const TEMPLATES_COLLECTION = "communicationTemplates";

let db;

export function setTemplatesDatabase(database) {
  db = database;
}

function collection() {
  if (!db) {
    throw new Error("Templates database is not initialized");
  }
  return db.collection(TEMPLATES_COLLECTION);
}

export const DEFAULT_TEMPLATES = [
  // 1. Application Received - WhatsApp
  {
    key: "app_received_whatsapp",
    name: "Application Received (WhatsApp)",
    channel: "WhatsApp",
    trigger: "Application Received",
    subject: "",
    body: "Dear {{parentName}}, thank you for applying to {{schoolName}} for {{studentName}} (App ID: {{applicationId}}). Your application is currently under review. Track status here: {{applicationLink}}",
  },
  // 2. Application Received - Email
  {
    key: "app_received_email",
    name: "Application Received (Email)",
    channel: "Email",
    trigger: "Application Received",
    subject: "Application Received - {{schoolName}} (ID: {{applicationId}})",
    body: "Dear {{parentName}},\n\nWe have received the online application for {{studentName}} for {{className}} (Academic Session {{academicSession}}).\n\nApplication ID: {{applicationId}}\nSubmission Date: {{submissionDate}}\n\nYou can track the application progress at:\n{{applicationLink}}\n\nRegards,\n{{schoolName}} Admissions Team\nPhone: {{schoolPhone}}",
  },
  // 3. Application Approved - WhatsApp
  {
    key: "app_approved_whatsapp",
    name: "Application Approved (WhatsApp)",
    channel: "WhatsApp",
    trigger: "Application Approved",
    subject: "",
    body: "Great news! The admission application for {{studentName}} (ID: {{applicationId}}) has been APPROVED at {{schoolName}}. Please contact admissions to finalize enrollment: {{schoolPhone}}",
  },
  // 4. Application Approved - Email
  {
    key: "app_approved_email",
    name: "Application Approved (Email)",
    channel: "Email",
    trigger: "Application Approved",
    subject: "Application Approved - {{schoolName}} (ID: {{applicationId}})",
    body: "Dear {{parentName}},\n\nWe are pleased to inform you that the admission application for {{studentName}} (Application ID: {{applicationId}}) has been APPROVED for {{className}}.\n\nApproval Date: {{approvalDate}}\n\nPlease visit the school administrative office or complete confirmation online to finalize enrollment.\n\nWarm regards,\n{{schoolName}} Admissions\nPhone: {{schoolPhone}}",
  },
  // 5. Application Rejected - WhatsApp
  {
    key: "app_rejected_whatsapp",
    name: "Application Rejected (WhatsApp)",
    channel: "WhatsApp",
    trigger: "Application Rejected",
    subject: "",
    body: "Dear {{parentName}}, regarding {{studentName}}'s application (ID: {{applicationId}}): status has been updated to Rejected. Reason: {{reason}}. Contact us at {{schoolPhone}} for queries.",
  },
  // 6. Application Rejected - Email
  {
    key: "app_rejected_email",
    name: "Application Rejected (Email)",
    channel: "Email",
    trigger: "Application Rejected",
    subject: "Application Status Update - {{schoolName}} (ID: {{applicationId}})",
    body: "Dear {{parentName}},\n\nWe regret to inform you that the application for {{studentName}} (ID: {{applicationId}}) was not approved.\n\nReason: {{reason}}\n\nIf you have any questions or require further clarification, please contact {{schoolPhone}} or email {{schoolEmail}}.\n\nSincerely,\n{{schoolName}} Admissions",
  },
  // 7. Documents Required - WhatsApp
  {
    key: "docs_required_whatsapp",
    name: "Documents Required (WhatsApp)",
    channel: "WhatsApp",
    trigger: "Documents Required",
    subject: "",
    body: "Dear {{parentName}}, action required for {{studentName}}'s application (ID: {{applicationId}}). Missing/Required documents: {{documentList}}. Remarks: {{remarks}}. Upload/Update here: {{applicationLink}}",
  },
  // 8. Documents Required - Email
  {
    key: "docs_required_email",
    name: "Documents Required (Email)",
    channel: "Email",
    trigger: "Documents Required",
    subject: "Action Required: Additional Documents Needed - {{schoolName}}",
    body: "Dear {{parentName}},\n\nTo proceed with {{studentName}}'s application (ID: {{applicationId}}), please provide the following document(s):\n\n{{documentList}}\n\nAdmin Remarks: {{remarks}}\n\nPlease visit your application portal to upload or resubmit the required documents:\n{{applicationLink}}\n\nRegards,\n{{schoolName}} Admissions",
  },
  // 9. Admission Confirmed - WhatsApp
  {
    key: "admission_confirmed_whatsapp",
    name: "Admission Confirmed (WhatsApp)",
    channel: "WhatsApp",
    trigger: "Admission Confirmed",
    subject: "",
    body: "Congratulations! {{studentName}}'s admission at {{schoolName}} is CONFIRMED! Admission No: {{admissionNo}}, Class: {{className}}. Welcome to MPSA School family!",
  },
  // 10. Admission Confirmed - Email
  {
    key: "admission_confirmed_email",
    name: "Admission Confirmed (Email)",
    channel: "Email",
    trigger: "Admission Confirmed",
    subject: "Official Admission Confirmation - {{schoolName}} (Admission No: {{admissionNo}})",
    body: "Dear {{parentName}},\n\nWe are delighted to confirm that {{studentName}} has been officially enrolled at {{schoolName}}!\n\nOfficial Admission Details:\n- Admission No: {{admissionNo}}\n- Application ID: {{applicationId}}\n- Class: {{className}}\n- Academic Session: {{academicSession}}\n\nWelcome to {{schoolName}}!\n\nBest regards,\nPrincipal & Administration\n{{schoolName}}\nPhone: {{schoolPhone}}",
  },
];

export async function getAllTemplates() {
  const col = collection();
  const dbTemplates = await col.find({}).toArray();
  const dbMap = new Map(dbTemplates.map((t) => [t.key, t]));

  // Merge with defaults to ensure all 10 templates exist
  return DEFAULT_TEMPLATES.map((def) => {
    const existing = dbMap.get(def.key);
    if (existing) {
      return {
        key: def.key,
        name: def.name,
        channel: def.channel,
        trigger: def.trigger,
        subject: existing.subject ?? def.subject,
        body: existing.body ?? def.body,
        updatedAt: existing.updatedAt || null,
        isCustomized: true,
      };
    }
    return {
      ...def,
      isCustomized: false,
    };
  });
}

export async function getTemplateByKey(key) {
  const col = collection();
  const existing = await col.findOne({ key });
  const def = DEFAULT_TEMPLATES.find((t) => t.key === key);

  if (existing) {
    return {
      key: existing.key,
      name: def?.name || existing.name,
      channel: def?.channel || existing.channel,
      trigger: def?.trigger || existing.trigger,
      subject: existing.subject,
      body: existing.body,
      updatedAt: existing.updatedAt,
    };
  }

  return def || null;
}

export async function updateTemplate(key, { subject, body }) {
  const col = collection();
  const def = DEFAULT_TEMPLATES.find((t) => t.key === key);
  if (!def) {
    throw new Error(`Invalid template key: ${key}`);
  }

  const now = new Date();
  await col.updateOne(
    { key },
    {
      $set: {
        key,
        name: def.name,
        channel: def.channel,
        trigger: def.trigger,
        subject: subject !== undefined ? subject : def.subject,
        body: body !== undefined ? body : def.body,
        updatedAt: now,
      },
    },
    { upsert: true }
  );

  return await getTemplateByKey(key);
}

export async function resetTemplate(key) {
  const col = collection();
  await col.deleteOne({ key });
  return DEFAULT_TEMPLATES.find((t) => t.key === key);
}

export function compileTemplateText(templateStr, variables = {}) {
  if (!templateStr) return "";

  const defaults = {
    schoolName: "MPSA Inter College",
    schoolPhone: "+91 90265 90221",
    schoolEmail: "admissions@mpsa.com",
    academicSession: "2026-27",
  };

  const combined = { ...defaults, ...variables };

  return templateStr.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    const val = combined[key];
    if (val !== undefined && val !== null) {
      return String(val);
    }
    // Return empty string or fallback instead of raw undefined/null
    return "";
  });
}
