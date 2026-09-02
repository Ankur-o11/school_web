import { ObjectId } from "mongodb";

export const SUBJECTS_COLLECTION = "subjects";

export const subjectIndexes = [
  {
    key: {
      code: 1,
      className: 1,
      section: 1,
    },
    options: {
      name: "subject_code_class_section_unique",
      unique: true,
      sparse: true,
    },
  },
  {
    key: {
      className: 1,
      section: 1,
    },
    options: {
      name: "subject_class_section",
    },
  },
  {
    key: {
      teacherId: 1,
    },
    options: {
      name: "subject_teacher",
      sparse: true,
    },
  },
  {
    key: {
      status: 1,
    },
    options: {
      name: "subject_status",
    },
  },
];

export function createSubjectDocument(data = {}) {
  const now = new Date();

  return {
    name: String(data.name || "").trim(),

    code: String(data.code || "")
      .trim()
      .toUpperCase(),

    className: String(
      data.className || ""
    ).trim(),

    section: String(
      data.section || ""
    ).trim(),

    type:
      data.type === "Optional"
        ? "Optional"
        : "Compulsory",

    teacher: String(
      data.teacher || ""
    ).trim(),

    teacherId:
      data.teacherId || null,

    periods:
      Number(data.periods) || 0,

    status:
      data.status || "Active",

    syllabus:
      Array.isArray(data.syllabus)
        ? data.syllabus
        : [],

    createdAt: now,
    updatedAt: now,
  };
}

export function sanitizeSubject(subject) {
  if (!subject) return null;

  const result = {
    ...subject,

    id: subject._id
      ? subject._id.toString()
      : subject.id,
  };

  delete result._id;

  return result;
}

export function toObjectId(id) {
  if (!id) return null;

  try {
    return new ObjectId(id);
  } catch {
    return null;
  }
}

export function createLesson(data = {}) {
  return {
    id:
      data.id ||
      new ObjectId().toString(),

    title:
      String(data.title || "").trim(),

    description:
      String(
        data.description || ""
      ).trim(),

    topics:
      Array.isArray(data.topics)
        ? data.topics
        : [],

    content:
      String(
        data.content || ""
      ).trim(),

    completed:
      Boolean(data.completed),
  };
}

export function createChapter(data = {}) {
  return {
    id:
      data.id ||
      new ObjectId().toString(),

    chapterNo:
      Number(data.chapterNo) || 1,

    title:
      String(data.title || "").trim(),

    description:
      String(
        data.description || ""
      ).trim(),

    lessons:
      Array.isArray(data.lessons)
        ? data.lessons.map(
            createLesson
          )
        : [],
  };
}
