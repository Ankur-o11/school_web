import {
  ADMISSIONS_COLLECTION,
  createAdmissionDocument,
  sanitizeAdmission,
  computePendingItems,
  toObjectId,
  generateTrackingToken,
} from "./admissions.model.js";

import { createStudentDocument } from "../students/students.model.js";
import { sendEmail } from "../../utils/emailService.js";
import { generateWhatsAppLink } from "../../utils/whatsappService.js";
import { getTemplateByKey, compileTemplateText } from "../communications/templates.service.js";

let db;

export function setAdmissionsDatabase(database) {
  db = database;
  ensureIndexes();
}

async function ensureIndexes() {
  if (!db) return;
  try {
    const col = db.collection(ADMISSIONS_COLLECTION);
    await col.createIndex({ applicationNo: 1 }, { unique: true, sparse: true });
    await col.createIndex({ trackingToken: 1 }, { unique: true, sparse: true });
  } catch (err) {
    console.error("Admissions index initialization warning:", err.message);
  }
}

function collection() {
  if (!db) {
    throw new Error("Admissions database is not initialized");
  }
  return db.collection(ADMISSIONS_COLLECTION);
}

function studentsCollection() {
  if (!db) {
    throw new Error("Database is not initialized");
  }
  return db.collection("students");
}

function communicationLogsCollection() {
  if (!db) return null;
  return db.collection("communicationLogs");
}

export async function getAllAdmissions(query = {}) {
  const filter = {};
  if (query.status && query.status !== "All") {
    filter.status = query.status;
  }
  if (query.source && query.source !== "All") {
    filter.source = query.source;
  }
  if (query.hasPending === "true") {
    filter.hasPendingItems = true;
  }

  const items = await collection()
    .find(filter)
    .sort({ createdAt: -1 })
    .toArray();

  return items.map(sanitizeAdmission);
}

export async function getAdmissionById(id) {
  if (!id) return null;
  const objectId = toObjectId(id);
  const query = objectId
    ? { $or: [{ _id: objectId }, { id }, { applicationNo: id }, { trackingToken: id }] }
    : { $or: [{ id }, { applicationNo: id }, { trackingToken: id }] };

  const item = await collection().findOne(query);
  return sanitizeAdmission(item);
}

export async function getAdmissionByTrackingToken(token) {
  if (!token) return null;
  const item = await collection().findOne({ trackingToken: token });
  return sanitizeAdmission(item);
}

export async function createAdmission(data, actor = null) {
  const doc = createAdmissionDocument({
    ...data,
    actedBy: actor ? actor.name || actor.email : null,
  });
  const result = await collection().insertOne(doc);
  const saved = await collection().findOne({ _id: result.insertedId });

  // Trigger Application Received notification
  await triggerApplicationNotification(saved, "app_received", actor);

  return sanitizeAdmission(saved);
}

export async function createOnlineAdmission(data) {
  const doc = createAdmissionDocument({
    ...data,
    source: "online",
    status: "Submitted",
  });
  const result = await collection().insertOne(doc);
  const saved = await collection().findOne({ _id: result.insertedId });

  // Trigger Application Received notification
  await triggerApplicationNotification(saved, "app_received", null);

  return sanitizeAdmission(saved);
}

export async function updateOnlineApplicationByToken(token, updates) {
  const existing = await collection().findOne({ trackingToken: token });
  if (!existing) {
    throw new Error("Application record not found for provided tracking token");
  }

  if (existing.status === "Admitted" || existing.status === "Confirmed") {
    throw new Error("Admitted applications cannot be modified by applicant");
  }

  const allowedFields = {};
  if (updates.applicantName !== undefined) allowedFields.applicantName = updates.applicantName;
  if (updates.gender !== undefined) allowedFields.gender = updates.gender;
  if (updates.dob !== undefined) allowedFields.dob = updates.dob;
  if (updates.parentName !== undefined) allowedFields.parentName = updates.parentName;
  if (updates.parentPhone !== undefined) allowedFields.parentPhone = updates.parentPhone;
  if (updates.email !== undefined) allowedFields.email = updates.email;
  if (updates.address !== undefined) allowedFields.address = updates.address;
  if (updates.city !== undefined) allowedFields.city = updates.city;
  if (updates.state !== undefined) allowedFields.state = updates.state;
  if (updates.pincode !== undefined) allowedFields.pincode = updates.pincode;
  if (updates.prevSchool !== undefined) allowedFields.prevSchool = updates.prevSchool;

  allowedFields.correctionRequired = false;
  allowedFields.status = "Under Review";
  allowedFields.reviewedAt = new Date();
  allowedFields.updatedAt = new Date();

  await collection().updateOne({ trackingToken: token }, { $set: allowedFields });
  const updated = await collection().findOne({ trackingToken: token });
  return sanitizeAdmission(updated);
}

/**
 * Approve Application Flow
 */
export async function approveApplication(id, actor = null) {
  const existing = await getAdmissionById(id);
  if (!existing) throw new Error("Application record not found");

  if (existing.status === "Admitted" || existing.status === "Confirmed") {
    throw new Error("Application is already admitted");
  }

  const now = new Date();
  const query = { _id: toObjectId(existing.id) };

  await collection().updateOne(query, {
    $set: {
      status: "Approved",
      approvedAt: now,
      actedBy: actor ? actor.name || actor.email : existing.actedBy,
      updatedAt: now,
    },
  });

  const updated = await collection().findOne(query);

  // Send Notification
  await triggerApplicationNotification(updated, "app_approved", actor);

  return sanitizeAdmission(updated);
}

/**
 * Reject Application Flow
 */
export async function rejectApplication(id, reason, actor = null) {
  const existing = await getAdmissionById(id);
  if (!existing) throw new Error("Application record not found");

  if (!reason || !reason.trim()) {
    throw new Error("A rejection reason is required.");
  }

  const now = new Date();
  const query = { _id: toObjectId(existing.id) };

  await collection().updateOne(query, {
    $set: {
      status: "Rejected",
      rejectionReason: reason.trim(),
      rejectedAt: now,
      actedBy: actor ? actor.name || actor.email : existing.actedBy,
      updatedAt: now,
    },
  });

  const updated = await collection().findOne(query);

  // Send Notification
  await triggerApplicationNotification(updated, "app_rejected", actor, { reason: reason.trim() });

  return sanitizeAdmission(updated);
}

/**
 * Request Documents Flow
 */
export async function requestDocuments(id, { reason, documentList }, actor = null) {
  const existing = await getAdmissionById(id);
  if (!existing) throw new Error("Application record not found");

  const now = new Date();
  const query = { _id: toObjectId(existing.id) };
  const remarks = reason || "Please provide required documents to proceed with admission verification.";

  await collection().updateOne(query, {
    $set: {
      status: "Documents Required",
      correctionRequired: true,
      correctionNotes: remarks,
      docsRequestedAt: now,
      actedBy: actor ? actor.name || actor.email : existing.actedBy,
      updatedAt: now,
    },
  });

  const updated = await collection().findOne(query);

  // Send Notification
  await triggerApplicationNotification(updated, "docs_required", actor, {
    documentList: documentList || "Required Verification Documents",
    remarks,
  });

  return sanitizeAdmission(updated);
}

/**
 * Document Manager: Add Document to Application
 */
export async function addApplicationDocument(id, docData, actor = null) {
  const existing = await getAdmissionById(id);
  if (!existing) throw new Error("Application record not found");

  const newDoc = {
    id: `doc_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: docData.name || "Submitted Document",
    type: docData.type || "Other",
    fileUrl: docData.fileUrl || "",
    status: docData.status || "Uploaded",
    adminRemark: docData.adminRemark || "",
    uploadedBy: actor ? actor.name || actor.email : "Applicant",
    uploadedAt: new Date(),
    updatedAt: new Date(),
  };

  const updatedDocs = [...(existing.documents || []), newDoc];
  const query = { _id: toObjectId(existing.id) };

  await collection().updateOne(query, {
    $set: { documents: updatedDocs, updatedAt: new Date() },
  });

  const updated = await collection().findOne(query);
  return sanitizeAdmission(updated);
}

/**
 * Document Manager: Update Document Status
 */
export async function updateApplicationDocumentStatus(id, docId, { status, adminRemark }, actor = null) {
  const existing = await getAdmissionById(id);
  if (!existing) throw new Error("Application record not found");

  const updatedDocs = (existing.documents || []).map((d) => {
    if (d.id === docId) {
      return {
        ...d,
        status: status || d.status,
        adminRemark: adminRemark !== undefined ? adminRemark : d.adminRemark,
        updatedAt: new Date(),
      };
    }
    return d;
  });

  const query = { _id: toObjectId(existing.id) };
  await collection().updateOne(query, {
    $set: { documents: updatedDocs, updatedAt: new Date() },
  });

  const updated = await collection().findOne(query);
  return sanitizeAdmission(updated);
}

/**
 * Document Manager: Delete Document
 */
export async function deleteApplicationDocument(id, docId) {
  const existing = await getAdmissionById(id);
  if (!existing) throw new Error("Application record not found");

  const updatedDocs = (existing.documents || []).filter((d) => d.id !== docId);
  const query = { _id: toObjectId(existing.id) };

  await collection().updateOne(query, {
    $set: { documents: updatedDocs, updatedAt: new Date() },
  });

  const updated = await collection().findOne(query);
  return sanitizeAdmission(updated);
}

/**
 * Idempotent Confirm & Create Student Flow (Fixes E11000 admissionNo & Double Admission)
 */
export async function confirmAndCreateStudent(admissionDoc, actor = null) {
  // 1. Idempotency Check: Prevent Double Admission
  if (admissionDoc.createdStudentId || admissionDoc.status === "Admitted" || admissionDoc.status === "Confirmed") {
    let existingStudent = null;
    if (admissionDoc.createdStudentId) {
      existingStudent = await studentsCollection().findOne({ _id: toObjectId(admissionDoc.createdStudentId) });
    }
    if (!existingStudent && admissionDoc.createdAdmissionNo) {
      existingStudent = await studentsCollection().findOne({ admissionNo: admissionDoc.createdAdmissionNo });
    }

    return {
      isAlreadyAdmitted: true,
      message: "This application has already been admitted.",
      admission: sanitizeAdmission(admissionDoc),
      studentCreated: existingStudent
        ? {
            id: existingStudent._id.toString(),
            admissionNo: existingStudent.admissionNo,
            name: existingStudent.name,
            class: existingStudent.class,
          }
        : null,
    };
  }

  const now = new Date();
  const year = now.getFullYear();

  // 2. Race-Safe Atomic Admission Number Generation Loop
  // Query all existing MPSA-YYYY-* students to find max sequence integer
  const yearRegex = new RegExp(`^MPSA-${year}-`, "i");
  const existingStudents = await studentsCollection()
    .find({ admissionNo: yearRegex }, { projection: { admissionNo: 1 } })
    .toArray();

  let maxSeq = 0;
  for (const s of existingStudents) {
    if (s.admissionNo) {
      const match = s.admissionNo.match(/MPSA-\d{4}-(\d+)/i);
      if (match) {
        const seq = parseInt(match[1], 10);
        if (!isNaN(seq) && seq > maxSeq) {
          maxSeq = seq;
        }
      }
    }
  }

  let nextSeq = maxSeq + 1;
  let studentResult = null;
  let generatedAdmissionNo = "";
  let attempts = 0;

  const baseStudentObj = {
    admissionId: admissionDoc._id ? admissionDoc._id.toString() : admissionDoc.id,
    applicationId: admissionDoc.applicationNo || admissionDoc.applicationId,
    name: admissionDoc.applicantName,
    class: admissionDoc.appliedClass,
    section: "A",
    rollNo: String(nextSeq),
    gender: admissionDoc.gender || "Male",
    dob: admissionDoc.dob || "2018-01-01",
    fatherName: admissionDoc.parentName,
    father: admissionDoc.parentName,
    motherName: "",
    parentPhone: admissionDoc.parentPhone,
    mobile: admissionDoc.parentPhone,
    phone: admissionDoc.parentPhone,
    email: admissionDoc.email || "",
    address: admissionDoc.address || "MPSA School Campus",
    city: admissionDoc.city || "",
    state: admissionDoc.state || "",
    pincode: admissionDoc.pincode || "",
    joiningDate: admissionDoc.appliedDate || now.toISOString().split("T")[0],
    admissionDate: admissionDoc.appliedDate || now.toISOString().split("T")[0],
    totalFees: 15000,
    status: "Active",
  };

  // Attempt insertion with max + 1, retrying automatically on E11000 conflict
  while (attempts < 10) {
    generatedAdmissionNo = `MPSA-${year}-${String(nextSeq).padStart(3, "0")}`;
    const studentData = createStudentDocument({
      ...baseStudentObj,
      admissionNo: generatedAdmissionNo,
      rollNo: String(nextSeq),
    });

    try {
      studentResult = await studentsCollection().insertOne(studentData);
      break; // Successfully inserted!
    } catch (err) {
      if (err.code === 11000 || (err.message && err.message.includes("E11000"))) {
        console.warn(`[admissionNo Conflict] ${generatedAdmissionNo} already exists. Incrementing sequence...`);
        nextSeq++;
        attempts++;
      } else {
        throw err;
      }
    }
  }

  if (!studentResult || !studentResult.insertedId) {
    throw new Error("Failed to generate a unique admission number after multiple attempts. Please try again.");
  }

  const createdStudentId = studentResult.insertedId.toString();
  const query = { _id: toObjectId(admissionDoc._id ? admissionDoc._id.toString() : admissionDoc.id) };

  await collection().updateOne(query, {
    $set: {
      status: "Admitted",
      createdStudentId,
      createdAdmissionNo: generatedAdmissionNo,
      hasPendingItems: false,
      admittedAt: now,
      actedBy: actor ? actor.name || actor.email : admissionDoc.actedBy,
      updatedAt: now,
    },
  });

  const updated = await collection().findOne(query);

  // Send Confirmation Notification
  await triggerApplicationNotification(updated, "admission_confirmed", actor, {
    admissionNo: generatedAdmissionNo,
    section: "A",
  });

  return {
    isAlreadyAdmitted: false,
    admission: sanitizeAdmission(updated),
    studentCreated: {
      id: createdStudentId,
      admissionNo: generatedAdmissionNo,
      name: admissionDoc.applicantName,
      class: admissionDoc.appliedClass,
    },
  };
}

/**
 * Application Notification Orchestrator
 */
export async function triggerApplicationNotification(admissionDoc, triggerPrefix, actor = null, extraVars = {}) {
  if (!admissionDoc) return;

  const appLink = `https://school-web-rouge-nine.vercel.app/admission-status/${admissionDoc.trackingToken || admissionDoc.applicationNo}`;

  const vars = {
    studentName: admissionDoc.applicantName || "Student",
    parentName: admissionDoc.parentName || "Parent",
    applicationId: admissionDoc.applicationNo || admissionDoc.applicationId || "",
    admissionNo: admissionDoc.createdAdmissionNo || extraVars.admissionNo || "Pending",
    className: admissionDoc.appliedClass || "Applied Class",
    section: extraVars.section || "A",
    schoolName: "MPSA Inter College",
    submissionDate: admissionDoc.appliedDate || new Date().toISOString().split("T")[0],
    approvalDate: admissionDoc.approvedAt ? new Date(admissionDoc.approvedAt).toISOString().split("T")[0] : new Date().toISOString().split("T")[0],
    reason: extraVars.reason || admissionDoc.rejectionReason || "N/A",
    documentList: extraVars.documentList || "Required Verification Documents",
    remarks: extraVars.remarks || admissionDoc.correctionNotes || "",
    applicationLink: appLink,
    schoolPhone: "+91 90265 90221",
    schoolEmail: "admissions@mpsa.com",
    ...extraVars,
  };

  const waKey = `${triggerPrefix}_whatsapp`;
  const emailKey = `${triggerPrefix}_email`;

  const waTpl = await getTemplateByKey(waKey);
  const emailTpl = await getTemplateByKey(emailKey);

  const waMessage = waTpl ? compileTemplateText(waTpl.body, vars) : "";
  const emailSubject = emailTpl ? compileTemplateText(emailTpl.subject, vars) : `Notification from MPSA School (${vars.applicationId})`;
  const emailBody = emailTpl ? compileTemplateText(emailTpl.body, vars) : "";

  // 1. Dispatch Email
  let emailResult = { success: false, message: "No email address provided" };
  if (admissionDoc.email) {
    emailResult = await sendEmail({
      to: admissionDoc.email,
      subject: emailSubject,
      text: emailBody,
    });
  }

  // 2. Generate WhatsApp Link
  const waUrl = generateWhatsAppLink(admissionDoc.parentPhone, waMessage);

  // 3. Log to Application Communication History
  const historyEntries = [];
  const now = new Date();
  const sentBy = actor ? actor.name || actor.email : "System";

  if (admissionDoc.email) {
    historyEntries.push({
      id: `comm_${Date.now()}_email`,
      channel: "Email",
      type: triggerPrefix,
      recipient: admissionDoc.email,
      message: emailBody,
      status: emailResult.success ? "Sent" : "Failed",
      error: emailResult.error || null,
      timestamp: now,
      sentBy,
    });
  }

  if (admissionDoc.parentPhone) {
    historyEntries.push({
      id: `comm_${Date.now()}_wa`,
      channel: "WhatsApp",
      type: triggerPrefix,
      recipient: admissionDoc.parentPhone,
      message: waMessage,
      whatsappUrl: waUrl,
      status: "Sent",
      timestamp: now,
      sentBy,
    });
  }

  if (historyEntries.length > 0) {
    await collection().updateOne(
      { _id: toObjectId(admissionDoc.id || admissionDoc._id) },
      { $push: { communicationHistory: { $each: historyEntries } } }
    );
  }

  // 4. Log to System Communication Logs
  const logsCol = communicationLogsCollection();
  if (logsCol && historyEntries.length > 0) {
    try {
      await logsCol.insertMany(
        historyEntries.map((h) => ({
          ...h,
          applicationNo: vars.applicationId,
          studentName: vars.studentName,
          createdAt: now,
        }))
      );
    } catch (e) {
      console.error("Communication log writing error:", e.message);
    }
  }

  return {
    emailResult,
    whatsappUrl: waUrl,
    waMessage,
  };
}

export async function requestCorrection(id, notes, actor = null) {
  return await requestDocuments(id, { reason: notes, documentList: "Application Correction Required" }, actor);
}

export async function updateChecklist(id, checklistInput) {
  const objectId = toObjectId(id);
  const query = objectId
    ? { $or: [{ _id: objectId }, { id }, { applicationNo: id }] }
    : { $or: [{ id }, { applicationNo: id }] };

  const existing = await collection().findOne(query);
  if (!existing) {
    throw new Error("Admission record not found");
  }

  const updatedChecklist = {
    ...existing.checklist,
    ...checklistInput,
  };

  const pendingItems = computePendingItems(updatedChecklist);
  const hasPendingItems = pendingItems.length > 0;

  let newStatus = existing.status;
  if (hasPendingItems && (existing.status === "Submitted" || existing.status === "Approved")) {
    newStatus = "Under Review";
  } else if (!hasPendingItems && (existing.status === "Submitted" || existing.status === "Under Review")) {
    newStatus = "Approved";
  }

  await collection().updateOne(query, {
    $set: {
      checklist: updatedChecklist,
      pendingItems,
      hasPendingItems,
      status: newStatus,
      updatedAt: new Date(),
    },
  });

  const updated = await collection().findOne(query);
  return sanitizeAdmission(updated);
}

export async function updateAdmissionStatus(id, status, actor = null) {
  const existing = await getAdmissionById(id);
  if (!existing) throw new Error("Admission record not found");

  if (status === "Approved") {
    return await approveApplication(id, actor);
  }
  if (status === "Rejected") {
    return await rejectApplication(id, "Status changed to Rejected by admin", actor);
  }
  if (status === "Documents Required" || status === "Correction Required") {
    return await requestDocuments(id, { reason: "Document re-verification requested" }, actor);
  }
  if (status === "Admitted" || status === "Confirmed") {
    return await confirmAndCreateStudent(existing, actor);
  }

  const query = { _id: toObjectId(existing.id) };
  await collection().updateOne(query, {
    $set: { status, updatedAt: new Date() },
  });

  const updated = await collection().findOne(query);
  return sanitizeAdmission(updated);
}
