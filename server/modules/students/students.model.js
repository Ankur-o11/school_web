import { ObjectId } from "mongodb";

export const STUDENTS_COLLECTION = "students";

export const studentIndexes = [
  {
    key: { admissionNo: 1 },
    options: {
      name: "admissionNo_1",
      unique: true,
      sparse: true,
    },
  },
  {
    key: { mobile: 1 },
    options: {
      name: "mobile_1",
      sparse: true,
    },
  },
  {
    key: { class: 1, section: 1 },
    options: {
      name: "class_1_section_1",
    },
  },
  {
    key: { session: 1 },
    options: {
      name: "session_1",
    },
  },
  {
    key: { status: 1 },
    options: {
      name: "status_1",
    },
  },
];

export function createStudentDocument(data = {}) {
  const now = new Date();

  return {
    name: String(data.name || "").trim(),
    father: String(data.father || "").trim(),
    mother: String(data.mother || "").trim(),

    dob: data.dob || "",
    gender: data.gender || "",
    bloodGroup: data.bloodGroup || "",

    aadhaar: String(data.aadhaar || "").trim(),
    penNo: String(data.penNo || "").trim(),

    admissionNo: String(data.admissionNo || "").trim(),
    admissionDate: data.admissionDate || "",

    session: data.session || "2026-27",
    admissionType: data.admissionType || "New",

    class: String(data.class || "").trim(),
    section: String(data.section || "").trim(),
    rollNo: String(data.rollNo || "").trim(),

    mobile: String(data.mobile || "").trim(),
    alternateMobile: String(data.alternateMobile || "").trim(),

    email: String(data.email || "").trim(),
    address: String(data.address || "").trim(),
    previousSchool: String(data.previousSchool || "").trim(),

    receiptNo: String(data.receiptNo || "").trim(),

    status: data.status || "Active",

    createdAt: now,
    updatedAt: now,
  };
}

export function sanitizeStudent(student) {
  if (!student) return null;

  return {
    ...student,
    id: student._id
      ? student._id.toString()
      : student.id,

    _id: undefined,
  };
}

export function toObjectId(id) {
  if (!id) return null;

  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}