// =====================================================
// RESULTS CONTROLLER
// =====================================================

import {
  createResult,
  getAllResults,
  getResultById,
  updateResult,
  deleteResult,
  updatePublishStatus,
} from "./results.service.js";

// =====================================================
// CREATE
// =====================================================

export async function create(req, res, next) {
  try {
    const result = await createResult(req.body);

    res.status(201).json({
      success: true,
      message: "Result created successfully.",
      result,
    });
  } catch (error) {
    next(error);
  }
}

// =====================================================
// GET ALL
// =====================================================

export async function getAll(req, res, next) {
  try {
    const results = await getAllResults(req.query);

    res.json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    next(error);
  }
}

// =====================================================
// GET ONE
// =====================================================

export async function getOne(req, res, next) {
  try {
    const result = await getResultById(req.params.id);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    next(error);
  }
}

// =====================================================
// UPDATE
// =====================================================

export async function update(req, res, next) {
  try {
    const result = await updateResult(
      req.params.id,
      req.body
    );

    res.json({
      success: true,
      message: "Result updated successfully.",
      result,
    });
  } catch (error) {
    next(error);
  }
}

// =====================================================
// DELETE
// =====================================================

export async function remove(req, res, next) {
  try {
    const result = await deleteResult(req.params.id);

    res.json({
      success: true,
      ...result,
    });
  } catch (error) {
    next(error);
  }
}

// =====================================================
// PUBLISH
// =====================================================

export async function publish(req, res, next) {
  try {
    const result = await updatePublishStatus(
      req.params.id,
      true
    );

    res.json({
      success: true,
      message: "Result published successfully.",
      result,
    });
  } catch (error) {
    next(error);
  }
}

// =====================================================
// UNPUBLISH
// =====================================================

export async function unpublish(req, res, next) {
  try {
    const result = await updatePublishStatus(
      req.params.id,
      false
    );

    res.json({
      success: true,
      message: "Result unpublished successfully.",
      result,
    });
  } catch (error) {
    next(error);
  }
}