import express from "express";
import {
  login,
  logout,
  getMe,
  changePassword,
} from "./auth.controller.js";
import { authenticate } from "../../middleware/auth.middleware.js";

const router = express.Router();

// Public routes
router.post("/login", login);

// Protected routes
router.post("/logout", authenticate, logout);
router.get("/me", authenticate, getMe);
router.post("/change-password", authenticate, changePassword);

export default router;
