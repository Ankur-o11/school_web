// =====================================================
// MPSA SCHOOL MANAGEMENT SYSTEM
// CLASSES CONTROLLER
// =====================================================

import {
  getAllClasses,
  getClassById,
  createClass,
  updateClass,
  deleteClass,
  getClassStats,
} from "./classes.service.js";

// =====================================================
// GET ALL
// GET /api/classes
// =====================================================

export async function listClasses(
  req,
  res
) {
  try {
    const classes =
      await getAllClasses();

    res.json({
      success: true,
      classes,
      count: classes.length,
    });
  } catch (error) {
    console.error(
      "List classes error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to load classes",
      error: error.message,
    });
  }
}

// =====================================================
// GET ONE
// GET /api/classes/:id
// =====================================================

export async function getClass(
  req,
  res
) {
  try {
    const classData =
      await getClassById(
        req.params.id
      );

    if (!classData) {
      return res.status(404).json({
        success: false,
        message: "Class not found",
      });
    }

    res.json({
      success: true,
      class: classData,
    });
  } catch (error) {
    console.error(
      "Get class error:",
      error
    );

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

// =====================================================
// ADD
// POST /api/classes
// =====================================================

export async function addClass(
  req,
  res
) {
  try {
    const classData =
      await createClass(
        req.body
      );

    res.status(201).json({
      success: true,
      message:
        "Class created successfully",
      class: classData,
    });
  } catch (error) {
    console.error(
      "Add class error:",
      error
    );

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

// =====================================================
// UPDATE
// PUT /api/classes/:id
// =====================================================

export async function editClass(
  req,
  res
) {
  try {
    const classData =
      await updateClass(
        req.params.id,
        req.body
      );

    res.json({
      success: true,
      message:
        "Class updated successfully",
      class: classData,
    });
  } catch (error) {
    console.error(
      "Edit class error:",
      error
    );

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

// =====================================================
// DELETE
// DELETE /api/classes/:id
// =====================================================

export async function removeClass(
  req,
  res
) {
  try {
    await deleteClass(
      req.params.id
    );

    res.json({
      success: true,
      message:
        "Class deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete class error:",
      error
    );

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

// =====================================================
// STATS
// GET /api/classes/stats
// =====================================================

export async function classStats(
  req,
  res
) {
  try {
    const stats =
      await getClassStats();

    res.json({
      success: true,
      stats,
    });
  } catch (error) {
    console.error(
      "Class stats error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Unable to load class statistics",
      error: error.message,
    });
  }
}