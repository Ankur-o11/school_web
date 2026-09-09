import { ObjectId } from "mongodb";

export const ADMISSIONS_COLLECTION = "admissions";

export function toObjectId(id) {
  if (!id) return null;
  if (id instanceof ObjectId) return id;
  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

export function createAdmissionDocument(input = {}) {
  const now = new Date();
  const applicationNo =
    input.applicationNo ||
    input.id ||
    `ADM-${now.getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

  const defaultChecklist = {
    aadhaar: { status: input.checklist?.aadhaar?.status || "Pending", required: true },
    birthCertificate: { status: input.checklist?.birthCertificate?.status || "Pending", required: true },
    photo: { status: input.checklist?.photo?.status || "Pending", required: true },
    transferCertificate: { status: input.checklist?.transferCertificate?.status || "Pending", required: false },
    registrationFee: { status: input.checklist?.registrationFee?.status || "Pending", amount: 500, required: true },
  };

  const pendingItems = computePendingItems(defaultChecklist);

  return {
    applicationNo,
    applicantName: input.applicantName || "",
    appliedClass: input.appliedClass || "Class 1",
    parentName: input.parentName || "",
    parentPhone: input.parentPhone || "",
    appliedDate: input.appliedDate || now.toISOString().split("T")[0],
    prevSchool: input.prevSchool || "N/A",
    status: input.status || (pendingItems.length > 0 ? "Pending Checklist" : "Submitted"),
    checklist: defaultChecklist,
    pendingItems,
    hasPendingItems: pendingItems.length > 0,
    createdStudentId: input.createdStudentId || null,
    createdAdmissionNo: input.createdAdmissionNo || null,
    createdAt: input.createdAt ? new Date(input.createdAt) : now,
    updatedAt: now,
  };
}

export function computePendingItems(checklist = {}) {
  const pending = [];
  if (checklist.aadhaar?.required && checklist.aadhaar?.status !== "Verified") {
    pending.push("Aadhaar Card");
  }
  if (checklist.birthCertificate?.required && checklist.birthCertificate?.status !== "Verified") {
    pending.push("Birth Certificate");
  }
  if (checklist.photo?.required && checklist.photo?.status !== "Verified") {
    pending.push("Passport Photo");
  }
  if (checklist.transferCertificate?.required && checklist.transferCertificate?.status !== "Verified") {
    pending.push("Transfer Certificate (TC)");
  }
  if (checklist.registrationFee?.required && checklist.registrationFee?.status !== "Paid") {
    pending.push("Registration Fee (₹500)");
  }
  return pending;
}

export function sanitizeAdmission(doc) {
  if (!doc) return null;
  const pendingItems = computePendingItems(doc.checklist || {});
  return {
    id: doc._id ? doc._id.toString() : doc.id,
    applicationNo: doc.applicationNo || doc.id,
    applicantName: doc.applicantName || "",
    appliedClass: doc.appliedClass || "",
    parentName: doc.parentName || "",
    parentPhone: doc.parentPhone || "",
    appliedDate: doc.appliedDate || "",
    prevSchool: doc.prevSchool || "N/A",
    status: doc.status || (pendingItems.length > 0 ? "Pending Checklist" : "Submitted"),
    checklist: doc.checklist || {},
    pendingItems,
    hasPendingItems: pendingItems.length > 0,
    createdStudentId: doc.createdStudentId || null,
    createdAdmissionNo: doc.createdAdmissionNo || null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}
