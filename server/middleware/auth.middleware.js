import { verifyToken } from "../utils/jwt.js";
import { getDatabase } from "../config/database.js";
import { ObjectId } from "mongodb";

export async function authenticate(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. No token provided.",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = verifyToken(token);

    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token.",
      });
    }

    const db = getDatabase();
    const usersCollection = db.collection("users");

    let userIdObj;
    try {
      userIdObj = new ObjectId(decoded.userId);
    } catch {
      userIdObj = decoded.userId;
    }

    const user = await usersCollection.findOne({
      $or: [{ _id: userIdObj }, { id: decoded.userId }],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account not found.",
      });
    }

    if (user.status === "Inactive" || user.status === "Disabled") {
      return res.status(403).json({
        success: false,
        message: "Account is disabled. Please contact administrator.",
      });
    }

    // Attach sanitized user to request
    req.user = {
      id: user._id ? user._id.toString() : user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      permissions: user.permissions || [],
      assignedClasses: user.assignedClasses || [],
      assignedChildren: user.assignedChildren || [],
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      success: false,
      message: "Authentication error",
    });
  }
}

export function authorizePermission(permission) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    // Admin has full access
    if (req.user.role === "Admin" || req.user.permissions?.includes("*")) {
      return next();
    }

    // Check specific granular permission
    if (req.user.permissions && req.user.permissions.includes(permission)) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `Access denied. Requires permission '${permission}'.`,
    });
  };
}

export function authorizeRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      });
    }

    if (allowedRoles.includes(req.user.role) || req.user.role === "Admin") {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Access denied. Insufficient role permissions.",
    });
  };
}
