import {
  listSubjects as listSubjectsService,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
  getSubjectsByClass,
  getSubjectStats,
  getSubjectSyllabus,
  updateSubjectSyllabus,
} from "./subjects.service.js";

// =====================================================
// GET ALL SUBJECTS
// GET /api/subjects
// =====================================================

export async function getAll(req, res) {
  try {
    const subjects =
      await listSubjectsService(
        req.app.locals.db,
        req.query
      );

    res.json({
      success: true,
      subjects,
      total: subjects.length,
    });
  } catch (error) {
    console.error(
      "Get subjects error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch subjects",
      error: error.message,
    });
  }
}

// =====================================================
// GET ONE SUBJECT
// GET /api/subjects/:id
// =====================================================

export async function getOne(req, res) {
  try {
    const subject =
      await getSubjectById(
        req.app.locals.db,
        req.params.id
      );

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    res.json({
      success: true,
      subject,
    });
  } catch (error) {
    console.error(
      "Get subject error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch subject",
      error: error.message,
    });
  }
}

// =====================================================
// CREATE SUBJECT
// POST /api/subjects
// =====================================================

export async function create(req, res) {
  try {
    const subject =
      await createSubject(
        req.app.locals.db,
        req.body
      );

    res.status(201).json({
      success: true,
      message:
        "Subject created successfully",
      subject,
    });
  } catch (error) {
    console.error(
      "Create subject error:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "Subject with this code already exists for this class and section",
        error: error.message,
      });
    }

    res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to create subject",
    });
  }
}

// =====================================================
// UPDATE SUBJECT
// PUT /api/subjects/:id
// =====================================================

export async function update(req, res) {
  try {
    const subject =
      await updateSubject(
        req.app.locals.db,
        req.params.id,
        req.body
      );

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    res.json({
      success: true,
      message:
        "Subject updated successfully",
      subject,
    });
  } catch (error) {
    console.error(
      "Update subject error:",
      error
    );

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message:
          "Subject with this code already exists",
        error: error.message,
      });
    }

    res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to update subject",
    });
  }
}

// =====================================================
// DELETE SUBJECT
// DELETE /api/subjects/:id
// =====================================================

export async function remove(req, res) {
  try {
    const deleted =
      await deleteSubject(
        req.app.locals.db,
        req.params.id
      );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Subject not found",
      });
    }

    res.json({
      success: true,
      message:
        "Subject deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete subject error:",
      error
    );

    res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to delete subject",
    });
  }
}

// =====================================================
// GET SUBJECTS BY CLASS
// GET /api/subjects/class/:className
// =====================================================

export async function getByClass(
  req,
  res
) {
  try {
    const subjects =
      await getSubjectsByClass(
        req.app.locals.db,
        req.params.className,
        req.query.section || ""
      );

    res.json({
      success: true,
      subjects,
      total: subjects.length,
      className:
        req.params.className,
      section:
        req.query.section || "",
    });
  } catch (error) {
    console.error(
      "Get class subjects error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch class subjects",
      error: error.message,
    });
  }
}

// =====================================================
// GET STATISTICS
// GET /api/subjects/stats
// =====================================================

export async function stats(req, res) {
  try {
    const data =
      await getSubjectStats(
        req.app.locals.db
      );

    res.json({
      success: true,
      stats: data,
    });
  } catch (error) {
    console.error(
      "Subject stats error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to fetch subject statistics",
      error: error.message,
    });
  }
}

// =====================================================
// GET SYLLABUS
// GET /api/subjects/:id/syllabus
// =====================================================

export async function getSyllabus(
  req,
  res
) {
  try {
    const syllabus =
      await getSubjectSyllabus(
        req.app.locals.db,
        req.params.id
      );

    if (!syllabus) {
      return res.status(404).json({
        success: false,
        message:
          "Subject not found",
      });
    }

    res.json({
      success: true,
      syllabus,
    });
  } catch (error) {
    console.error(
      "Get syllabus error:",
      error
    );

    res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to fetch syllabus",
    });
  }
}

// =====================================================
// UPDATE SYLLABUS
// PATCH /api/subjects/:id/syllabus
// =====================================================

export async function updateSubjectSyllabusHandler(
  req,
  res
) {
  try {
    const syllabus =
      req.body.syllabus;

    const subject =
      await updateSubjectSyllabus(
        req.app.locals.db,
        req.params.id,
        syllabus
      );

    if (!subject) {
      return res.status(404).json({
        success: false,
        message:
          "Subject not found",
      });
    }

    res.json({
      success: true,
      message:
        "Syllabus updated successfully",
      subject,
    });
  } catch (error) {
    console.error(
      "Update syllabus error:",
      error
    );

    res.status(400).json({
      success: false,
      message:
        error.message ||
        "Failed to update syllabus",
    });
  }
}

// =====================================================
// EXPORT NAME USED BY ROUTES
// =====================================================

export {
  updateSubjectSyllabusHandler as updateSubjectSyllabus,
};
