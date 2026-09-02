import {
  SUBJECTS_COLLECTION,
  createSubjectDocument,
  sanitizeSubject,
  toObjectId,
  createChapter,
} from "./subjects.model.js";

function getCollection(db) {
  if (!db) {
    throw new Error("Database is not initialized");
  }

  return db.collection(SUBJECTS_COLLECTION);
}

// =====================================================
// GET ALL SUBJECTS
// =====================================================

export async function listSubjects(db, query = {}) {
  const collection = getCollection(db);

  const filter = {};

  if (query.search) {
    const search = String(query.search).trim();

    filter.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        code: {
          $regex: search,
          $options: "i",
        },
      },
      {
        teacher: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  if (query.className) {
    filter.className =
      String(query.className).trim();
  }

  if (query.class) {
    filter.className =
      String(query.class).trim();
  }

  if (query.section) {
    filter.section =
      String(query.section).trim();
  }

  if (query.type) {
    filter.type =
      String(query.type).trim();
  }

  if (query.status) {
    filter.status =
      String(query.status).trim();
  }

  if (query.teacherId) {
    filter.teacherId =
      String(query.teacherId).trim();
  }

  const subjects = await collection
    .find(filter)
    .sort({
      className: 1,
      section: 1,
      name: 1,
    })
    .toArray();

  return subjects.map(
    sanitizeSubject
  );
}

// =====================================================
// GET ONE SUBJECT
// =====================================================

export async function getSubjectById(
  db,
  id
) {
  const objectId = toObjectId(id);

  if (!objectId) {
    throw new Error(
      "Invalid subject ID"
    );
  }

  const subject =
    await getCollection(db).findOne({
      _id: objectId,
    });

  if (!subject) {
    return null;
  }

  return sanitizeSubject(subject);
}

// =====================================================
// CREATE SUBJECT
// =====================================================

export async function createSubject(
  db,
  data
) {
  const subject =
    createSubjectDocument(data);

  if (!subject.name) {
    throw new Error(
      "Subject name is required"
    );
  }

  if (!subject.code) {
    throw new Error(
      "Subject code is required"
    );
  }

  if (!subject.className) {
    throw new Error(
      "Class is required"
    );
  }

  const collection =
    getCollection(db);

  const result =
    await collection.insertOne(
      subject
    );

  const saved =
    await collection.findOne({
      _id: result.insertedId,
    });

  return sanitizeSubject(saved);
}

// =====================================================
// UPDATE SUBJECT
// =====================================================

export async function updateSubject(
  db,
  id,
  data
) {
  const objectId =
    toObjectId(id);

  if (!objectId) {
    throw new Error(
      "Invalid subject ID"
    );
  }

  const collection =
    getCollection(db);

  const existing =
    await collection.findOne({
      _id: objectId,
    });

  if (!existing) {
    return null;
  }

  const allowed = {
    name:
      data.name !== undefined
        ? String(data.name).trim()
        : existing.name,

    code:
      data.code !== undefined
        ? String(data.code)
            .trim()
            .toUpperCase()
        : existing.code,

    className:
      data.className !== undefined
        ? String(data.className).trim()
        : existing.className,

    section:
      data.section !== undefined
        ? String(data.section).trim()
        : existing.section,

    type:
      data.type !== undefined
        ? data.type
        : existing.type,

    teacher:
      data.teacher !== undefined
        ? String(data.teacher).trim()
        : existing.teacher,

    teacherId:
      data.teacherId !== undefined
        ? data.teacherId
        : existing.teacherId,

    periods:
      data.periods !== undefined
        ? Number(data.periods) || 0
        : existing.periods,

    status:
      data.status !== undefined
        ? data.status
        : existing.status,

    updatedAt:
      new Date(),
  };

  await collection.updateOne(
    {
      _id: objectId,
    },
    {
      $set: allowed,
    }
  );

  const updated =
    await collection.findOne({
      _id: objectId,
    });

  return sanitizeSubject(updated);
}

// =====================================================
// DELETE SUBJECT
// =====================================================

export async function deleteSubject(
  db,
  id
) {
  const objectId =
    toObjectId(id);

  if (!objectId) {
    throw new Error(
      "Invalid subject ID"
    );
  }

  const result =
    await getCollection(db).deleteOne({
      _id: objectId,
    });

  return result.deletedCount > 0;
}

// =====================================================
// SUBJECTS BY CLASS
// =====================================================

export async function getSubjectsByClass(
  db,
  className,
  section = ""
) {
  const filter = {
    className:
      String(className).trim(),
  };

  if (section) {
    filter.section =
      String(section).trim();
  }

  const subjects =
    await getCollection(db)
      .find(filter)
      .sort({
        name: 1,
      })
      .toArray();

  return subjects.map(
    sanitizeSubject
  );
}

// =====================================================
// SUBJECT STATISTICS
// =====================================================

export async function getSubjectStats(
  db
) {
  const collection =
    getCollection(db);

  const [
    total,
    compulsory,
    optional,
    active,
  ] = await Promise.all([
    collection.countDocuments(),

    collection.countDocuments({
      type: "Compulsory",
    }),

    collection.countDocuments({
      type: "Optional",
    }),

    collection.countDocuments({
      status: "Active",
    }),
  ]);

  return {
    total,
    compulsory,
    optional,
    active,
  };
}

// =====================================================
// GET SYLLABUS
// =====================================================

export async function getSubjectSyllabus(
  db,
  id
) {
  const subject =
    await getSubjectById(
      db,
      id
    );

  if (!subject) {
    return null;
  }

  return {
    subjectId: subject.id,
    subjectName: subject.name,
    subjectCode: subject.code,
    className: subject.className,
    section: subject.section,
    teacher: subject.teacher,
    teacherId: subject.teacherId,
    syllabus:
      Array.isArray(subject.syllabus)
        ? subject.syllabus
        : [],
  };
}

// =====================================================
// UPDATE SYLLABUS
// =====================================================

export async function updateSubjectSyllabus(
  db,
  id,
  syllabus
) {
  const objectId =
    toObjectId(id);

  if (!objectId) {
    throw new Error(
      "Invalid subject ID"
    );
  }

  if (!Array.isArray(syllabus)) {
    throw new Error(
      "Syllabus must be an array"
    );
  }

  const chapters =
    syllabus.map(
      (chapter, index) =>
        createChapter({
          ...chapter,
          chapterNo:
            chapter.chapterNo ||
            index + 1,
        })
    );

  const collection =
    getCollection(db);

  const result =
    await collection.updateOne(
      {
        _id: objectId,
      },
      {
        $set: {
          syllabus: chapters,
          updatedAt: new Date(),
        },
      }
    );

  if (
    result.matchedCount === 0
  ) {
    return null;
  }

  const updated =
    await collection.findOne({
      _id: objectId,
    });

  return sanitizeSubject(updated);
}
