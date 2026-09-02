// =====================================================
// RESULTS SERVICE
// =====================================================

import { ObjectId } from "mongodb";
import { getResultsCollection } from "./results.model.js";

function normalizeId(id) {
  if (!id) return null;

  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

function calculateResult(subjects = []) {
  let totalMarks = 0;
  let obtainedMarks = 0;

  const processedSubjects = subjects.map((subject) => {
    const maxMarks = Number(subject.maxMarks) || 0;
    const marks = Number(subject.marks) || 0;

    totalMarks += maxMarks;
    obtainedMarks += marks;

    const percentage =
      maxMarks > 0 ? (marks / maxMarks) * 100 : 0;

    let grade = "F";

    if (percentage >= 90) grade = "A+";
    else if (percentage >= 80) grade = "A";
    else if (percentage >= 70) grade = "B+";
    else if (percentage >= 60) grade = "B";
    else if (percentage >= 50) grade = "C";
    else if (percentage >= 33) grade = "D";

    return {
      ...subject,
      maxMarks,
      marks,
      percentage: Number(percentage.toFixed(2)),
      grade,
    };
  });

  const percentage =
    totalMarks > 0
      ? (obtainedMarks / totalMarks) * 100
      : 0;

  let grade = "F";

  if (percentage >= 90) grade = "A+";
  else if (percentage >= 80) grade = "A";
  else if (percentage >= 70) grade = "B+";
  else if (percentage >= 60) grade = "B";
  else if (percentage >= 50) grade = "C";
  else if (percentage >= 33) grade = "D";

  return {
    subjects: processedSubjects,
    totalMarks,
    obtainedMarks,
    percentage: Number(percentage.toFixed(2)),
    grade,
    status: percentage >= 33 ? "Pass" : "Fail",
  };
}

// =====================================================
// CREATE RESULT
// =====================================================

export async function createResult(data) {
  const collection = getResultsCollection();

  const calculated = calculateResult(data.subjects || []);

  const result = {
    studentId: data.studentId,
    studentName: data.studentName || "",
    admissionNumber: data.admissionNumber || "",
    className: data.className || "",
    section: data.section || "",
    rollNumber: data.rollNumber || "",
    examName: data.examName || "",
    session: data.session || "",
    subjects: calculated.subjects,
    totalMarks: calculated.totalMarks,
    obtainedMarks: calculated.obtainedMarks,
    percentage: calculated.percentage,
    grade: calculated.grade,
    status: calculated.status,
    remarks: data.remarks || "",
    published: data.published === true,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const existing = await collection.findOne({
    studentId: result.studentId,
    session: result.session,
    examName: result.examName,
  });

  if (existing) {
    const error = new Error(
      "Result already exists for this student, session and exam."
    );
    error.statusCode = 409;
    throw error;
  }

  const response = await collection.insertOne(result);

  return {
    ...result,
    id: response.insertedId.toString(),
  };
}

// =====================================================
// GET ALL RESULTS
// =====================================================

export async function getAllResults(filters = {}) {
  const collection = getResultsCollection();

  const query = {};

  if (filters.studentId) {
    query.studentId = filters.studentId;
  }

  if (filters.className) {
    query.className = filters.className;
  }

  if (filters.section) {
    query.section = filters.section;
  }

  if (filters.session) {
    query.session = filters.session;
  }

  if (filters.examName) {
    query.examName = filters.examName;
  }

  if (filters.published !== undefined) {
    query.published =
      filters.published === "true" ||
      filters.published === true;
  }

  const results = await collection
    .find(query)
    .sort({ createdAt: -1 })
    .toArray();

  return results.map((result) => ({
    ...result,
    id: result._id.toString(),
    _id: undefined,
  }));
}

// =====================================================
// GET RESULT BY ID
// =====================================================

export async function getResultById(id) {
  const collection = getResultsCollection();

  const objectId = normalizeId(id);

  if (!objectId) {
    const error = new Error("Invalid result ID.");
    error.statusCode = 400;
    throw error;
  }

  const result = await collection.findOne({
    _id: objectId,
  });

  if (!result) {
    const error = new Error("Result not found.");
    error.statusCode = 404;
    throw error;
  }

  return {
    ...result,
    id: result._id.toString(),
  };
}

// =====================================================
// UPDATE RESULT
// =====================================================

export async function updateResult(id, data) {
  const collection = getResultsCollection();

  const objectId = normalizeId(id);

  if (!objectId) {
    const error = new Error("Invalid result ID.");
    error.statusCode = 400;
    throw error;
  }

  const calculated = calculateResult(data.subjects || []);

  const updateData = {
    ...data,
    subjects: calculated.subjects,
    totalMarks: calculated.totalMarks,
    obtainedMarks: calculated.obtainedMarks,
    percentage: calculated.percentage,
    grade: calculated.grade,
    status: calculated.status,
    updatedAt: new Date(),
  };

  delete updateData._id;
  delete updateData.id;

  const response = await collection.findOneAndUpdate(
    { _id: objectId },
    { $set: updateData },
    {
      returnDocument: "after",
    }
  );

  if (!response) {
    const error = new Error("Result not found.");
    error.statusCode = 404;
    throw error;
  }

  return {
    ...response,
    id: response._id.toString(),
  };
}

// =====================================================
// DELETE RESULT
// =====================================================

export async function deleteResult(id) {
  const collection = getResultsCollection();

  const objectId = normalizeId(id);

  if (!objectId) {
    const error = new Error("Invalid result ID.");
    error.statusCode = 400;
    throw error;
  }

  const response = await collection.deleteOne({
    _id: objectId,
  });

  if (response.deletedCount === 0) {
    const error = new Error("Result not found.");
    error.statusCode = 404;
    throw error;
  }

  return {
    message: "Result deleted successfully.",
  };
}

// =====================================================
// PUBLISH / UNPUBLISH RESULT
// =====================================================

export async function updatePublishStatus(id, published) {
  const collection = getResultsCollection();

  const objectId = normalizeId(id);

  if (!objectId) {
    const error = new Error("Invalid result ID.");
    error.statusCode = 400;
    throw error;
  }

  const response = await collection.findOneAndUpdate(
    { _id: objectId },
    {
      $set: {
        published: Boolean(published),
        updatedAt: new Date(),
      },
    },
    {
      returnDocument: "after",
    }
  );

  if (!response) {
    const error = new Error("Result not found.");
    error.statusCode = 404;
    throw error;
  }

  return {
    ...response,
    id: response._id.toString(),
  };
}