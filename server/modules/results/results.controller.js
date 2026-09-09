import {
  createResult,
  getAllResults,
  getResultById,
  updateResult,
  deleteResult,
  updatePublishStatus,
} from "./results.service.js";

// Helper for data-level filters
function applyResultDataScoping(req, query = {}) {
  const scopedQuery = { ...query };
  if (!req.user || req.user.role === "Admin" || req.user.permissions?.includes("*")) {
    return scopedQuery;
  }

  if (req.user.role === "Student") {
    scopedQuery.studentId = req.user.id;
  } else if (req.user.role === "Parent") {
    scopedQuery.studentId = { $in: req.user.assignedChildren || [] };
  } else if (req.user.role === "Teacher" && req.user.assignedClasses?.length > 0) {
    scopedQuery.className = { $in: req.user.assignedClasses };
  }

  return scopedQuery;
}

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

export async function getAll(req, res, next) {
  try {
    const filters = applyResultDataScoping(req, req.query);
    const results = await getAllResults(filters);

    res.json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    next(error);
  }
}

export async function getOne(req, res, next) {
  try {
    const result = await getResultById(req.params.id);

    if (req.user && req.user.role === "Student") {
      if (result.studentId !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Access forbidden. Students can only view their own examination results.",
        });
      }
    }

    if (req.user && req.user.role === "Parent") {
      const isAssigned = (req.user.assignedChildren || []).includes(result.studentId);
      if (!isAssigned) {
        return res.status(403).json({
          success: false,
          message: "Access forbidden. Parents can only view results of linked children.",
        });
      }
    }

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    next(error);
  }
}

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

export async function publish(req, res, next) {
  try {
    const result = await updatePublishStatus(req.params.id, true);

    res.json({
      success: true,
      message: "Result published successfully.",
      result,
    });
  } catch (error) {
    next(error);
  }
}

export async function unpublish(req, res, next) {
  try {
    const result = await updatePublishStatus(req.params.id, false);

    res.json({
      success: true,
      message: "Result unpublished successfully.",
      result,
    });
  } catch (error) {
    next(error);
  }
}