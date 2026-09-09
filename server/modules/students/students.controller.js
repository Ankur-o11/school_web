import {
  STUDENTS_COLLECTION,
  createStudentDocument,
  sanitizeStudent,
  toObjectId,
} from "./students.model.js";

let db;

export function setStudentsDatabase(database) {
  db = database;
}

function collection() {
  if (!db) {
    throw new Error("Students database is not initialized");
  }

  return db.collection(STUDENTS_COLLECTION);
}

// Data-level authorization filter helper
function buildDataAccessFilter(req) {
  const filter = {};
  if (!req.user || req.user.role === "Admin" || req.user.permissions?.includes("*")) {
    return filter;
  }

  if (req.user.role === "Student") {
    // Student can only access their own record
    filter.$or = [
      { _id: toObjectId(req.user.id) },
      { id: req.user.id },
      { admissionNumber: req.user.username },
    ];
  } else if (req.user.role === "Parent") {
    // Parent can only access assigned children
    const childrenIds = (req.user.assignedChildren || []).map((cId) => toObjectId(cId) || cId);
    filter.$or = [
      { _id: { $in: childrenIds } },
      { id: { $in: req.user.assignedChildren || [] } },
      { parentPhone: req.user.username },
    ];
  } else if (req.user.role === "Teacher" && req.user.assignedClasses?.length > 0) {
    // Teacher can only access assigned classes
    filter.className = { $in: req.user.assignedClasses };
  }

  return filter;
}

// GET /api/students
export async function listStudents(req, res) {
  try {
    const dataFilter = buildDataAccessFilter(req);

    const items = await collection()
      .find(dataFilter)
      .sort({ createdAt: -1 })
      .toArray();

    res.json({
      success: true,
      students: items.map(sanitizeStudent),
    });
  } catch (error) {
    console.error("listStudents:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load students",
      error: error.message,
    });
  }
}

// GET /api/students/:id
export async function getStudent(req, res) {
  try {
    const targetId = req.params.id;
    const objectId = toObjectId(targetId);

    // Data-level check for Student/Parent role
    if (req.user && req.user.role === "Student") {
      if (req.user.id !== targetId && targetId !== "me") {
        return res.status(403).json({
          success: false,
          message: "Access forbidden. Students can only access their own record.",
        });
      }
    }

    const query = objectId ? { _id: objectId } : { id: targetId };
    const student = await collection().findOne(query);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Verify parent authorization
    if (req.user && req.user.role === "Parent") {
      const studentIdStr = student._id ? student._id.toString() : student.id;
      const isAssigned = (req.user.assignedChildren || []).includes(studentIdStr);
      if (!isAssigned) {
        return res.status(403).json({
          success: false,
          message: "Access forbidden. Parents can only access their linked children.",
        });
      }
    }

    res.json({
      success: true,
      student: sanitizeStudent(student),
    });
  } catch (error) {
    console.error("getStudent:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load student",
      error: error.message,
    });
  }
}

// POST /api/students
export async function addStudent(req, res) {
  try {
    const student = createStudentDocument(req.body);

    if (!student.name) {
      return res.status(400).json({
        success: false,
        message: "Student name is required",
      });
    }

    const result = await collection().insertOne(student);

    const savedStudent = await collection().findOne({
      _id: result.insertedId,
    });

    res.status(201).json({
      success: true,
      message: "Student added successfully",
      student: sanitizeStudent(savedStudent),
    });
  } catch (error) {
    console.error("addStudent:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate student record",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to add student",
      error: error.message,
    });
  }
}

// PUT /api/students/:id
export async function editStudent(req, res) {
  try {
    const objectId = toObjectId(req.params.id);

    if (!objectId) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const oldStudent = await collection().findOne({
      _id: objectId,
    });

    if (!oldStudent) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const updatedStudent = createStudentDocument({
      ...oldStudent,
      ...req.body,
    });

    delete updatedStudent._id;

    updatedStudent.createdAt =
      oldStudent.createdAt || new Date();

    updatedStudent.updatedAt = new Date();

    await collection().updateOne(
      { _id: objectId },
      {
        $set: updatedStudent,
      }
    );

    const savedStudent = await collection().findOne({
      _id: objectId,
    });

    res.json({
      success: true,
      message: "Student updated successfully",
      student: sanitizeStudent(savedStudent),
    });
  } catch (error) {
    console.error("editStudent:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Duplicate student record",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to update student",
      error: error.message,
    });
  }
}

// DELETE /api/students/:id
export async function removeStudent(req, res) {
  try {
    const objectId = toObjectId(req.params.id);

    if (!objectId) {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    const result = await collection().deleteOne({
      _id: objectId,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("removeStudent:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete student",
      error: error.message,
    });
  }
}

// GET /api/students/stats
export async function studentStats(req, res) {
  try {
    const students = collection();
    const dataFilter = buildDataAccessFilter(req);

    const total = await students.countDocuments(dataFilter);

    const active = await students.countDocuments({
      ...dataFilter,
      status: "Active",
    });

    const inactive = await students.countDocuments({
      ...dataFilter,
      status: {
        $ne: "Active",
      },
    });

    res.json({
      success: true,
      stats: {
        total,
        active,
        inactive,
      },
    });
  } catch (error) {
    console.error("studentStats:", error);

    res.status(500).json({
      success: false,
      message: "Failed to load student statistics",
      error: error.message,
    });
  }
}
