import { ObjectId } from "mongodb";
import crypto from "crypto";

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

export function generateTrackingToken() {
  return crypto.randomBytes(16).toString("hex");
}

export function createAdmissionDocument(input = {}) {
  const now = new Date();
  const year = now.getFullYear();
  const applicationNo =
    input.applicationNo ||
    input.applicationId ||
    `MPSA-${year}-${Math.floor(100000 + Math.random() * 900000)}`;

  const trackingToken = input.trackingToken || generateTrackingToken();
  const source = ["online", "admin", "walk-in"].includes(input.source)
    ? input.source
    : "admin";

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
    applicationId: applicationNo,
    trackingToken,
    source,
    applicantName: input.applicantName || "",
    gender: input.gender || "Male",
    dob: input.dob || "",
    appliedClass: input.appliedClass || "Class 1",
    academicSession: input.academicSession || `${year}-${year + 1}`,
    parentName: input.parentName || "",
    parentPhone: input.parentPhone || "",
    email: input.email || "",
    address: input.address || "",
    city: input.city || "",
    state: input.state || "",
    pincode: input.pincode || "",
    prevSchool: input.prevSchool || "N/A",
    appliedDate: input.appliedDate || now.toISOString().split("T")[0],

    // Status Model: Pending (Submitted) -> Under Review -> Documents Required -> Approved -> Rejected -> Admitted (Confirmed)
    status: input.status || "Submitted",
    checklist: defaultChecklist,
    pendingItems,
    hasPendingItems: pendingItems.length > 0,
    correctionRequired: Boolean(input.correctionRequired),
    correctionNotes: input.correctionNotes || "",
    rejectionReason: input.rejectionReason || "",

    // Sub-schemas
    documents: Array.isArray(input.documents) ? input.documents : [],
    communicationHistory: Array.isArray(input.communicationHistory) ? input.communicationHistory : [],

    // Audit Timestamps & Admin Info
    submittedAt: input.submittedAt ? new Date(input.submittedAt) : now,
    reviewedAt: input.reviewedAt ? new Date(input.reviewedAt) : null,
    docsRequestedAt: input.docsRequestedAt ? new Date(input.docsRequestedAt) : null,
    approvedAt: input.approvedAt ? new Date(input.approvedAt) : null,
    rejectedAt: input.rejectedAt ? new Date(input.rejectedAt) : null,
    admittedAt: input.admittedAt ? new Date(input.admittedAt) : null,
    actedBy: input.actedBy || null,

    createdStudentId: input.createdStudentId || null,
    createdAdmissionNo: input.createdAdmissionNo || null,
    createdAt: input.createdAt ? new Date(input.createdAt) : now,
    updatedAt: now,
  };
}

export function computePendingItems(checklist = {}) {
  const pending = [];
  if (checklist.aadhaar?.required && checklist.aadhaar?.status !== "Verified" && checklist.aadhaar?.status !== true) {
    pending.push("Aadhaar Card");
  }
  if (checklist.birthCertificate?.required && checklist.birthCertificate?.status !== "Verified" && checklist.birthCertificate?.status !== true) {
    pending.push("Birth Certificate");
  }
  if (checklist.photo?.required && checklist.photo?.status !== "Verified" && checklist.photo?.status !== true) {
    pending.push("Passport Photo");
  }
  if (checklist.transferCertificate?.required && checklist.transferCertificate?.status !== "Verified" && checklist.transferCertificate?.status !== true) {
    pending.push("Transfer Certificate (TC)");
  }
  if (checklist.registrationFee?.required && checklist.registrationFee?.status !== "Paid" && checklist.registrationFee?.status !== true) {
    pending.push("Registration Fee (₹500)");
  }
  return pending;
}

export function sanitizeAdmission(doc) {
  if (!doc) return null;
  const pendingItems = computePendingItems(doc.checklist || {});
  return {
    id: doc._id ? doc._id.toString() : doc.id,
    applicationNo: doc.applicationNo || doc.applicationId || doc.id,
    applicationId: doc.applicationNo || doc.applicationId || doc.id,
    trackingToken: doc.trackingToken || "",
    source: doc.source || "admin",
    applicantName: doc.applicantName || "",
    gender: doc.gender || "Male",
    dob: doc.dob || "",
    appliedClass: doc.appliedClass || "",
    academicSession: doc.academicSession || "",
    parentName: doc.parentName || "",
    parentPhone: doc.parentPhone || "",
    email: doc.email || "",
    address: doc.address || "",
    city: doc.city || "",
    state: doc.state || "",
    pincode: doc.pincode || "",
    appliedDate: doc.appliedDate || "",
    prevSchool: doc.prevSchool || "N/A",
    status: doc.status || "Submitted",
    checklist: doc.checklist || {},
    pendingItems,
    hasPendingItems: pendingItems.length > 0,
    correctionRequired: Boolean(doc.correctionRequired),
    correctionNotes: doc.correctionNotes || "",
    rejectionReason: doc.rejectionReason || "",

    documents: doc.documents || [],
    communicationHistory: doc.communicationHistory || [],

    submittedAt: doc.submittedAt || doc.createdAt,
    reviewedAt: doc.reviewedAt || null,
    docsRequestedAt: doc.docsRequestedAt || null,
    approvedAt: doc.approvedAt || null,
    rejectedAt: doc.rejectedAt || null,
    admittedAt: doc.admittedAt || null,
    actedBy: doc.actedBy || null,

    createdStudentId: doc.createdStudentId || null,
    createdAdmissionNo: doc.createdAdmissionNo || null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}
