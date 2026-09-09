import express from "express";
import {
  listClasses,
  getClass,
  addClass,
  editClass,
  removeClass,
  classStats,
} from "./classes.controller.js";
import { authenticate, authorizePermission } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticate);

// GET /api/classes/stats
router.get("/stats", authorizePermission("classes.view"), classStats);

// GET /api/classes
router.get("/", authorizePermission("classes.view"), listClasses);

// GET /api/classes/:id
router.get("/:id", authorizePermission("classes.view"), getClass);

// POST /api/classes
router.post("/", authorizePermission("classes.manage"), addClass);

// PUT /api/classes/:id
router.put("/:id", authorizePermission("classes.manage"), editClass);

// DELETE /api/classes/:id
router.delete("/:id", authorizePermission("classes.manage"), removeClass);

export default router;