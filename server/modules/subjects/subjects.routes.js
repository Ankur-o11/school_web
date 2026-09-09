import express from "express";
import {
  create,
  getAll,
  getOne,
  getByClass,
  getSyllabus,
  update,
  updateSubjectSyllabus,
  remove,
  stats,
} from "./subjects.controller.js";
import { authenticate, authorizePermission } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticate);

router.get("/stats", authorizePermission("subjects.view"), stats);
router.get("/class/:className", authorizePermission("subjects.view"), getByClass);
router.get("/", authorizePermission("subjects.view"), getAll);
router.post("/", authorizePermission("subjects.manage"), create);
router.get("/:id/syllabus", authorizePermission("subjects.view"), getSyllabus);
router.patch("/:id/syllabus", authorizePermission("subjects.manage"), updateSubjectSyllabus);
router.get("/:id", authorizePermission("subjects.view"), getOne);
router.put("/:id", authorizePermission("subjects.manage"), update);
router.delete("/:id", authorizePermission("subjects.manage"), remove);

export default router;