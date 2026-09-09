import express from "express";
import {
  create,
  getAll,
  getOne,
  update,
  remove,
  publish,
  unpublish,
} from "./results.controller.js";
import { authenticate, authorizePermission } from "../../middleware/auth.middleware.js";

const router = express.Router();

router.use(authenticate);

// GET all results
router.get("/", authorizePermission("results.view"), getAll);

// CREATE result
router.post("/", authorizePermission("results.enter"), create);

// GET single result
router.get("/:id", authorizePermission("results.view"), getOne);

// UPDATE result
router.put("/:id", authorizePermission("results.edit"), update);

// DELETE result
router.delete("/:id", authorizePermission("results.edit"), remove);

// PUBLISH / UNPUBLISH
router.patch("/:id/publish", authorizePermission("results.publish"), publish);
router.patch("/:id/unpublish", authorizePermission("results.publish"), unpublish);

export default router;