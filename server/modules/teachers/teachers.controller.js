import { getDatabase } from "../../config/database.js";
import { ObjectId } from "mongodb";
import { logActivity } from "../../utils/logger.js";

function cleanDocument(doc) {
  if (!doc) return null;
  const cleaned = {
    ...doc,
    id: doc._id ? doc._id.toString() : doc.id,
  };
  delete cleaned._id;
  return cleaned;
}

// GET /api/teachers
export async function getTeachers(req, res) {
  try {
    const db = getDatabase();
    const teachersCollection = db.collection("teachers");

    const { subject, status, search } = req.query;
    const filter = {};

    if (subject) filter.subject = subject;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { employeeId: { $regex: search, $options: "i" } },
        { mobile: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const teachers = await teachersCollection.find(filter).sort({ createdAt: -1 }).toArray();
    return res.status(200).json({
      success: true,
      data: teachers.map(cleanDocument),
    });
  } catch (error) {
    console.error("getTeachers error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch teachers.",
    });
  }
}

// GET /api/teachers/:id
export async function getTeacherById(req, res) {
  try {
    const { id } = req.params;
    const db = getDatabase();
    const teachersCollection = db.collection("teachers");

    let queryId;
    try {
      queryId = new ObjectId(id);
    } catch {
      queryId = id;
    }

    const teacher = await teachersCollection.findOne({
      $or: [{ _id: queryId }, { id: id }, { employeeId: id }],
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: cleanDocument(teacher),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch teacher details.",
    });
  }
}

// POST /api/teachers
export async function createTeacher(req, res) {
  try {
    const {
      name,
      employeeId,
      subject,
      teachingClasses,
      mobile,
      email,
      joiningDate,
      monthlySalary,
      status,
    } = req.body;

    if (!name || !mobile) {
      return res.status(400).json({
        success: false,
        message: "Teacher name and mobile number are required.",
      });
    }

    const db = getDatabase();
    const teachersCollection = db.collection("teachers");

    // Auto-generate employeeId if not provided
    let empId = employeeId;
    if (!empId) {
      const count = await teachersCollection.countDocuments();
      empId = `MPSA-T${String(count + 1).padStart(3, "0")}`;
    } else {
      const existing = await teachersCollection.findOne({ employeeId: empId });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: `Teacher with Employee ID ${empId} already exists.`,
        });
      }
    }

    const newTeacher = {
      ...req.body,
      employeeId: empId,
      monthlySalary: Number(monthlySalary) || 0,
      status: status || "Active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await teachersCollection.insertOne(newTeacher);
    const createdTeacher = cleanDocument({ ...newTeacher, _id: result.insertedId });

    await logActivity(req, "TEACHER_CREATED", "TEACHERS", { employeeId: empId, name });

    return res.status(201).json({
      success: true,
      message: "Teacher added successfully.",
      data: createdTeacher,
    });
  } catch (error) {
    console.error("createTeacher error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create teacher record.",
    });
  }
}

// PUT /api/teachers/:id
export async function updateTeacher(req, res) {
  try {
    const { id } = req.params;
    const db = getDatabase();
    const teachersCollection = db.collection("teachers");

    let queryId;
    try {
      queryId = new ObjectId(id);
    } catch {
      queryId = id;
    }

    const existing = await teachersCollection.findOne({
      $or: [{ _id: queryId }, { id: id }],
    });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "Teacher record not found.",
      });
    }

    const updateData = {
      ...req.body,
      updatedAt: new Date(),
    };
    delete updateData._id;
    delete updateData.id;

    await teachersCollection.updateOne(
      { _id: existing._id },
      { $set: updateData }
    );

    await logActivity(req, "TEACHER_UPDATED", "TEACHERS", { teacherId: id });

    const updated = await teachersCollection.findOne({ _id: existing._id });

    return res.status(200).json({
      success: true,
      message: "Teacher updated successfully.",
      data: cleanDocument(updated),
    });
  } catch (error) {
    console.error("updateTeacher error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update teacher record.",
    });
  }
}

// DELETE /api/teachers/:id
export async function deleteTeacher(req, res) {
  try {
    const { id } = req.params;
    const db = getDatabase();
    const teachersCollection = db.collection("teachers");

    let queryId;
    try {
      queryId = new ObjectId(id);
    } catch {
      queryId = id;
    }

    await teachersCollection.deleteOne({
      $or: [{ _id: queryId }, { id: id }],
    });

    await logActivity(req, "TEACHER_DELETED", "TEACHERS", { teacherId: id });

    return res.status(200).json({
      success: true,
      message: "Teacher record deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete teacher record.",
    });
  }
}
