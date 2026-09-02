
// =====================================================
// MPSA SCHOOL MANAGEMENT SYSTEM
// CLASSES SERVICE
// MongoDB CRUD + Automatic Student Count Sync
// =====================================================

import { ObjectId } from "mongodb";
import { getClassesCollection } from "./classes.model.js";
import { getDatabase } from "../../config/database.js";

// =====================================================
// NORMALIZE ID
// =====================================================

function normalizeId(id) {
  if (!id) return null;

  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

// =====================================================
// GET STUDENTS COLLECTION
// =====================================================

function getStudentsCollection() {
  const db = getDatabase();
  return db.collection("students");
}

// =====================================================
// DEFAULT SUBJECTS
// =====================================================

const defaultSubjects = [
  {
    name: "English",
    average: 0,
  },
  {
    name: "Hindi",
    average: 0,
  },
  {
    name: "Mathematics",
    average: 0,
  },
  {
    name: "Science",
    average: 0,
  },
  {
    name: "Social Science",
    average: 0,
  },
];

// =====================================================
// CLASS ORDER
// =====================================================

const classOrderMap = {
  PG: 1,
  Nursery: 2,
  LKG: 3,
  UKG: 4,

  "Class 1": 5,
  "Class 2": 6,
  "Class 3": 7,
  "Class 4": 8,
  "Class 5": 9,
  "Class 6": 10,
  "Class 7": 11,
  "Class 8": 12,
  "Class 9": 13,
  "Class 10": 14,
  "Class 11": 15,
  "Class 12": 16,
};

// =====================================================
// CLEAN CLASS DOCUMENT
// =====================================================

function cleanClass(doc) {
  if (!doc) return null;

  return {
    id: doc._id ? doc._id.toString() : null,

    className: doc.className || "",
    section: doc.section || "",

    classTeacher: doc.classTeacher || "",

    classRepresentative:
      doc.classRepresentative || "Not Assigned",

    students: Number(doc.students || 0),

    attendance: Number(doc.attendance || 0),

    totalFees: Number(doc.totalFees || 0),
    collectedFees: Number(doc.collectedFees || 0),
    discountFees: Number(doc.discountFees || 0),

    averageMarks: Number(doc.averageMarks || 0),
    passPercentage: Number(doc.passPercentage || 0),

    topStudent:
      doc.topStudent || "Not Available",

    lowestStudent:
      doc.lowestStudent || "Not Available",

    overallSubjects:
      Array.isArray(doc.overallSubjects)
        ? doc.overallSubjects
        : [],

    overallAverage:
      Number(doc.overallAverage || 0),

    status:
      doc.status || "Active",

    createdAt:
      doc.createdAt || null,

    updatedAt:
      doc.updatedAt || null,
  };
}

// =====================================================
// COUNT STUDENTS FOR EACH CLASS
// =====================================================
//
// Students collection:
// {
//   class: "Class 10",
//   section: "A"
// }
//
// Classes collection:
// {
//   className: "Class 10",
//   section: "A"
// }
//
// =====================================================

async function getStudentCount(
  className,
  section
) {
  const studentsCollection =
    getStudentsCollection();

  return await studentsCollection.countDocuments({
    class: className,
    section: section,
    status: "Active",
  });
}

// =====================================================
// SYNC ONE CLASS STUDENT COUNT
// =====================================================

async function syncClassStudentCount(
  classId
) {
  const objectId =
    normalizeId(classId);

  if (!objectId) return;

  const classesCollection =
    getClassesCollection();

  const classData =
    await classesCollection.findOne({
      _id: objectId,
    });

  if (!classData) return;

  const studentCount =
    await getStudentCount(
      classData.className,
      classData.section
    );

  await classesCollection.updateOne(
    {
      _id: objectId,
    },
    {
      $set: {
        students: studentCount,
        updatedAt: new Date(),
      },
    }
  );
}

// =====================================================
// SYNC ALL CLASS COUNTS
// =====================================================
//
// This is called whenever classes are loaded.
// Therefore the UI always receives the real
// student count from MongoDB.
// =====================================================

async function syncAllClassStudentCounts() {
  const classesCollection =
    getClassesCollection();

  const studentsCollection =
    getStudentsCollection();

  const classes =
    await classesCollection
      .find({})
      .toArray();

  if (classes.length === 0) {
    return;
  }

  // Get active student counts grouped
  // by class + section
  const groupedStudents =
    await studentsCollection
      .aggregate([
        {
          $match: {
            status: "Active",
          },
        },
        {
          $group: {
            _id: {
              class: "$class",
              section: "$section",
            },
            count: {
              $sum: 1,
            },
          },
        },
      ])
      .toArray();

  const countMap = new Map();

  for (const item of groupedStudents) {
    const key =
      `${item._id.class}|||${item._id.section}`;

    countMap.set(
      key,
      Number(item.count || 0)
    );
  }

  // Update every class
  for (const classData of classes) {
    const key =
      `${classData.className}|||${classData.section}`;

    const studentCount =
      countMap.get(key) || 0;

    // Only update if value changed
    if (
      Number(classData.students || 0) !==
      studentCount
    ) {
      await classesCollection.updateOne(
        {
          _id: classData._id,
        },
        {
          $set: {
            students: studentCount,
            updatedAt: new Date(),
          },
        }
      );
    }
  }
}

// =====================================================
// GET ALL CLASSES
// GET /api/classes
// =====================================================

export async function getAllClasses() {
  // Always synchronize actual student counts
  await syncAllClassStudentCounts();

  const collection =
    getClassesCollection();

  const classes =
    await collection
      .find({})
      .sort({
        classOrder: 1,
        section: 1,
      })
      .toArray();

  return classes.map(cleanClass);
}

// =====================================================
// GET CLASS BY ID
// =====================================================

export async function getClassById(id) {
  const objectId =
    normalizeId(id);

  if (!objectId) {
    throw new Error(
      "Invalid class ID"
    );
  }

  const collection =
    getClassesCollection();

  const classData =
    await collection.findOne({
      _id: objectId,
    });

  if (!classData) {
    throw new Error(
      "Class not found"
    );
  }

  // Make sure student count is current
  await syncClassStudentCount(id);

  const updatedClass =
    await collection.findOne({
      _id: objectId,
    });

  return cleanClass(updatedClass);
}

// =====================================================
// CREATE CLASS
// =====================================================

export async function createClass(
  data = {}
) {
  const collection =
    getClassesCollection();

  const className =
    String(
      data.className || ""
    ).trim();

  const section =
    String(
      data.section || ""
    ).trim();

  const classTeacher =
    String(
      data.classTeacher || ""
    ).trim();

  const classRepresentative =
    String(
      data.classRepresentative || ""
    ).trim();

  // ===================================================
  // VALIDATION
  // ===================================================

  if (!className) {
    throw new Error(
      "Class name is required"
    );
  }

  if (!section) {
    throw new Error(
      "Section is required"
    );
  }

  if (!classTeacher) {
    throw new Error(
      "Class teacher is required"
    );
  }

  // ===================================================
  // DUPLICATE CHECK
  // ===================================================

  const existingClass =
    await collection.findOne({
      className,
      section,
    });

  if (existingClass) {
    throw new Error(
      "This Class + Section already exists"
    );
  }

  // ===================================================
  // CLASS ORDER
  // ===================================================

  const classOrder =
    classOrderMap[className] || 999;

  // ===================================================
  // CHECK EXISTING STUDENTS
  // ===================================================

  const studentCount =
    await getStudentCount(
      className,
      section
    );

  // ===================================================
  // NEW CLASS DOCUMENT
  // ===================================================

  const newClass = {
    className,
    section,

    classTeacher,

    classRepresentative:
      classRepresentative ||
      "Not Assigned",

    students: studentCount,

    attendance: 0,

    totalFees: 0,
    collectedFees: 0,
    discountFees: 0,

    averageMarks: 0,
    passPercentage: 0,

    topStudent:
      "Not Available",

    lowestStudent:
      "Not Available",

    overallSubjects:
      defaultSubjects.map(
        (subject) => ({
          ...subject,
        })
      ),

    overallAverage: 0,

    status: "Active",

    classOrder,

    createdAt: new Date(),
    updatedAt: new Date(),
  };

  // ===================================================
  // INSERT
  // ===================================================

  const result =
    await collection.insertOne(
      newClass
    );

  return cleanClass({
    ...newClass,
    _id: result.insertedId,
  });
}

// =====================================================
// UPDATE CLASS
// =====================================================

export async function updateClass(
  id,
  data = {}
) {
  const objectId =
    normalizeId(id);

  if (!objectId) {
    throw new Error(
      "Invalid class ID"
    );
  }

  const collection =
    getClassesCollection();

  // ===================================================
  // FIND EXISTING
  // ===================================================

  const existingClass =
    await collection.findOne({
      _id: objectId,
    });

  if (!existingClass) {
    throw new Error(
      "Class not found"
    );
  }

  // ===================================================
  // VALUES
  // ===================================================

  const className =
    String(
      data.className ??
        existingClass.className ??
        ""
    ).trim();

  const section =
    String(
      data.section ??
        existingClass.section ??
        ""
    ).trim();

  const classTeacher =
    String(
      data.classTeacher ??
        existingClass.classTeacher ??
        ""
    ).trim();

  const classRepresentative =
    String(
      data.classRepresentative ??
        existingClass.classRepresentative ??
        ""
    ).trim();

  // ===================================================
  // VALIDATION
  // ===================================================

  if (!className) {
    throw new Error(
      "Class name is required"
    );
  }

  if (!section) {
    throw new Error(
      "Section is required"
    );
  }

  if (!classTeacher) {
    throw new Error(
      "Class teacher is required"
    );
  }

  // ===================================================
  // DUPLICATE CHECK
  // ===================================================

  const duplicate =
    await collection.findOne({
      className,
      section,

      _id: {
        $ne: objectId,
      },
    });

  if (duplicate) {
    throw new Error(
      "This Class + Section already exists"
    );
  }

  // ===================================================
  // CLASS ORDER
  // ===================================================

  const classOrder =
    classOrderMap[className] || 999;

  // ===================================================
  // UPDATE
  // ===================================================

  await collection.updateOne(
    {
      _id: objectId,
    },
    {
      $set: {
        className,
        section,
        classTeacher,

        classRepresentative:
          classRepresentative ||
          "Not Assigned",

        classOrder,

        updatedAt:
          new Date(),
      },
    }
  );

  // ===================================================
  // IMPORTANT
  // If class/section was changed,
  // calculate student count for new location.
  // ===================================================

  await syncClassStudentCount(id);

  // ===================================================
  // GET UPDATED CLASS
  // ===================================================

  const updatedClass =
    await collection.findOne({
      _id: objectId,
    });

  return cleanClass(
    updatedClass
  );
}

// =====================================================
// DELETE CLASS
// =====================================================

export async function deleteClass(
  id
) {
  const objectId =
    normalizeId(id);

  if (!objectId) {
    throw new Error(
      "Invalid class ID"
    );
  }

  const collection =
    getClassesCollection();

  // ===================================================
  // CHECK CLASS
  // ===================================================

  const classData =
    await collection.findOne({
      _id: objectId,
    });

  if (!classData) {
    throw new Error(
      "Class not found"
    );
  }

  // ===================================================
  // SAFETY CHECK
  // ===================================================
  // Do not delete a class that still has
  // active students assigned to it.
  // ===================================================

  const studentCount =
    await getStudentCount(
      classData.className,
      classData.section
    );

  if (studentCount > 0) {
    throw new Error(
      `Cannot delete ${classData.className}-${classData.section}. ${studentCount} active student(s) are assigned to this class.`
    );
  }

  // ===================================================
  // DELETE
  // ===================================================

  const result =
    await collection.deleteOne({
      _id: objectId,
    });

  if (
    result.deletedCount === 0
  ) {
    throw new Error(
      "Class not found"
    );
  }

  return true;
}

// =====================================================
// CLASS STATISTICS
// =====================================================

export async function getClassStats() {
  // Always synchronize first
  await syncAllClassStudentCounts();

  const collection =
    getClassesCollection();

  const classes =
    await collection
      .find({})
      .toArray();

  // ===================================================
  // TOTAL SECTIONS
  // ===================================================

  const totalSections =
    classes.length;

  // ===================================================
  // TOTAL STUDENTS
  // ===================================================

  const totalStudents =
    classes.reduce(
      (total, item) =>
        total +
        Number(
          item.students || 0
        ),
      0
    );

  // ===================================================
  // ACTIVE CLASSES
  // ===================================================

  const activeClasses =
    classes.filter(
      (item) =>
        item.status ===
        "Active"
    ).length;

  // ===================================================
  // AVERAGE SCHOOL MARKS
  // ===================================================

  const averageSchoolMarks =
    classes.length > 0
      ? classes.reduce(
          (total, item) =>
            total +
            Number(
              item.averageMarks ||
                0
            ),
          0
        ) / classes.length
      : 0;

  // ===================================================
  // SCHOOL ATTENDANCE
  // ===================================================

  const schoolAttendance =
    classes.length > 0
      ? classes.reduce(
          (total, item) =>
            total +
            Number(
              item.attendance ||
                0
            ),
          0
        ) / classes.length
      : 0;

  // ===================================================
  // RETURN
  // ===================================================

  return {
    totalSections,

    totalStudents,

    activeClasses,

    averageSchoolMarks:
      Number(
        averageSchoolMarks.toFixed(
          1
        )
      ),

    schoolAttendance:
      Number(
        schoolAttendance.toFixed(
          1
        )
      ),
  };
}

