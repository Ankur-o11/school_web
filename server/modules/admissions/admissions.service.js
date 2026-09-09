import {
  ADMISSIONS_COLLECTION,
  createAdmissionDocument,
  sanitizeAdmission,
  computePendingItems,
  toObjectId,
} from "./admissions.model.js";

import { createStudentDocument } from "../students/students.model.js";

let db;

export function setAdmissionsDatabase(database) {
  db = database;
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
    ? { $or: [{ _id: objectId }, { id }, { applicationNo: id }] }
    : { $or: [{ id }, { applicationNo: id }] };

  const item = await collection().findOne(query);
  return sanitizeAdmission(item);
}

export async function createAdmission(data) {
  const doc = createAdmissionDocument(data);
  const result = await collection().insertOne(doc);
  const saved = await collection().findOne({ _id: result.insertedId });
  return sanitizeAdmission(saved);
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

  // Auto transition status if pending checklist resolved
  let newStatus = existing.status;
  if (hasPendingItems && (existing.status === "Submitted" || existing.status === "Approved")) {
    newStatus = "Pending Checklist";
  } else if (!hasPendingItems && existing.status === "Pending Checklist") {
    newStatus = "Under Review";
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
    // Already confirmed and student created
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
  const now = new Date();
  const year = now.getFullYear();
  const count = await studentsCollection().countDocuments();
  const admissionNo = `MPSA-${year}-${String(count + 1).padStart(3, "0")}`;

  const studentData = createStudentDocument({
    admissionNo,
    name: admissionDoc.applicantName,
    class: admissionDoc.appliedClass,
    section: "A",
    rollNo: String(count + 1),
    gender: "Other",
    dob: "2018-01-01",
    fatherName: admissionDoc.parentName,
    motherName: "",
    parentPhone: admissionDoc.parentPhone,
    phone: admissionDoc.parentPhone,
    address: "MPSA School Campus",
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
