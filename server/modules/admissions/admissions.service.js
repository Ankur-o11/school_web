import {
  ADMISSIONS_COLLECTION,
  createAdmissionDocument,
  sanitizeAdmission,
  computePendingItems,
  toObjectId,
  generateTrackingToken,
} from "./admissions.model.js";

import { createStudentDocument } from "../students/students.model.js";

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

export async function createAdmission(data) {
  const doc = createAdmissionDocument(data);
  const result = await collection().insertOne(doc);
  const saved = await collection().findOne({ _id: result.insertedId });
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
  return sanitizeAdmission(saved);
}

export async function updateOnlineApplicationByToken(token, updates) {
  const existing = await collection().findOne({ trackingToken: token });
  if (!existing) {
    throw new Error("Application record not found for provided tracking token");
  }

  if (existing.status === "Confirmed") {
    throw new Error("Confirmed applications cannot be edited");
  }

  // Allowed editable fields for parents during correction phase
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

  // Resolve correction flag if updating
  allowedFields.correctionRequired = false;
  allowedFields.status = "Under Review";
  allowedFields.updatedAt = new Date();

  await collection().updateOne({ trackingToken: token }, { $set: allowedFields });
  const updated = await collection().findOne({ trackingToken: token });
  return sanitizeAdmission(updated);
}

export async function requestCorrection(id, notes) {
  const objectId = toObjectId(id);
  const query = objectId
    ? { $or: [{ _id: objectId }, { id }, { applicationNo: id }] }
    : { $or: [{ id }, { applicationNo: id }] };

  const existing = await collection().findOne(query);
  if (!existing) {
    throw new Error("Admission record not found");
  }

  await collection().updateOne(query, {
    $set: {
      correctionRequired: true,
      correctionNotes: notes || "Please review and update application details.",
      status: "Correction Required",
      updatedAt: new Date(),
    },
  });

  const updated = await collection().findOne(query);
  return sanitizeAdmission(updated);
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
    newStatus = "Ready for Confirmation";
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

export async function updateAdmissionStatus(id, status) {
  const objectId = toObjectId(id);
  const query = objectId
    ? { $or: [{ _id: objectId }, { id }, { applicationNo: id }] }
    : { $or: [{ id }, { applicationNo: id }] };

  const existing = await collection().findOne(query);
  if (!existing) {
    throw new Error("Admission record not found");
  }

  if (status === "Confirmed" && existing.createdStudentId) {
    await collection().updateOne(query, {
      $set: { status: "Confirmed", updatedAt: new Date() },
    });
    const updated = await collection().findOne(query);
    return sanitizeAdmission(updated);
  }

  if (status === "Confirmed" || status === "Approved & Confirmed") {
    return await confirmAndCreateStudent(existing);
  }

  await collection().updateOne(query, {
    $set: { status, updatedAt: new Date() },
  });

  const updated = await collection().findOne(query);
  return sanitizeAdmission(updated);
}

export async function confirmAndCreateStudent(admissionDoc) {
  if (admissionDoc.createdStudentId) {
    // Check if student already exists in DB
    const existingStudent = await studentsCollection().findOne({ _id: toObjectId(admissionDoc.createdStudentId) });
    if (existingStudent) {
      return {
        admission: sanitizeAdmission(admissionDoc),
        studentCreated: {
          id: existingStudent._id.toString(),
          admissionNo: existingStudent.admissionNo,
          name: existingStudent.name,
          class: existingStudent.class,
        },
      };
    }
  }

  const now = new Date();
  const year = now.getFullYear();
  const count = await studentsCollection().countDocuments();
  const admissionNo = `MPSA-${year}-${String(count + 1).padStart(3, "0")}`;

  const studentData = createStudentDocument({
    admissionNo,
    admissionId: admissionDoc._id ? admissionDoc._id.toString() : admissionDoc.id,
    applicationId: admissionDoc.applicationNo,
    name: admissionDoc.applicantName,
    class: admissionDoc.appliedClass,
    section: "A",
    rollNo: String(count + 1),
    gender: admissionDoc.gender || "Male",
    dob: admissionDoc.dob || "2018-01-01",
    fatherName: admissionDoc.parentName,
    motherName: "",
    parentPhone: admissionDoc.parentPhone,
    phone: admissionDoc.parentPhone,
    email: admissionDoc.email || "",
    address: admissionDoc.address || "MPSA School Campus",
    city: admissionDoc.city || "",
    state: admissionDoc.state || "",
    pincode: admissionDoc.pincode || "",
    joiningDate: admissionDoc.appliedDate || now.toISOString().split("T")[0],
    totalFees: 15000,
    status: "Active",
  });

  const studentResult = await studentsCollection().insertOne(studentData);
  const createdStudentId = studentResult.insertedId.toString();

  const query = { _id: admissionDoc._id };
  await collection().updateOne(query, {
    $set: {
      status: "Confirmed",
      createdStudentId,
      createdAdmissionNo: admissionNo,
      hasPendingItems: false,
      updatedAt: now,
    },
  });

  const updated = await collection().findOne(query);
  return {
    admission: sanitizeAdmission(updated),
    studentCreated: {
      id: createdStudentId,
      admissionNo,
      name: admissionDoc.applicantName,
      class: admissionDoc.appliedClass,
    },
  };
}
