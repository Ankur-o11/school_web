import bcrypt from "bcryptjs";
import { getDatabase } from "../../config/database.js";
import { signToken } from "../../utils/jwt.js";
import { logActivity } from "../../utils/logger.js";
import { ObjectId } from "mongodb";

// =====================================================
// DEFAULT PERMISSIONS PER ROLE
// =====================================================

export const DEFAULT_ROLE_PERMISSIONS = {
  Admin: ["*"],
  Teacher: [
    "students.view",
    "attendance.view",
    "attendance.mark",
    "results.view",
    "results.enter",
    "timetable.view",
    "homework.view",
    "homework.create",
    "notices.view",
  ],
  Accountant: [
    "students.view",
    "fees.view",
    "fees.create",
    "fees.edit",
    "salary.view",
    "salary.create",
    "salary.edit",
    "reports.view",
  ],
  Student: [
    "results.view",
    "attendance.view",
    "timetable.view",
    "notices.view",
    "homework.view",
  ],
  Parent: [
    "students.view",
    "results.view",
    "attendance.view",
    "fees.view",
    "notices.view",
    "timetable.view",
  ],
  Staff: [
    "students.view",
    "notices.view",
    "inventory.view",
    "transport.view",
  ],
};

// =====================================================
// SEED INITIAL ADMIN SAFELY
// =====================================================

export async function seedInitialAdmin(db) {
  try {
    const usersCollection = db.collection("users");

    const adminEmail = (process.env.ADMIN_EMAIL || "admin@mpsa.com").trim().toLowerCase();
    const adminPassword = process.env.ADMIN_PASSWORD || "Admin@MPSA2026";

    // Check if any Admin already exists
    const adminUser = await usersCollection.findOne({ role: "Admin" });

    if (!adminUser) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      const initialAdmin = {
        name: "School Administrator",
        email: adminEmail,
        username: "admin",
        password: hashedPassword,
        role: "Admin",
        permissions: ["*"],
        status: "Active",
        mustChangePassword: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      await usersCollection.insertOne(initialAdmin);
      console.log("✅ Initial Admin user created successfully");
    } else {
      // Sync admin email and password with server.env configuration if needed
      const isEmailSame = adminUser.email === adminEmail;
      const isPasswordSame = await bcrypt.compare(adminPassword, adminUser.password);

      if (!isEmailSame || !isPasswordSame) {
        const hashedPassword = await bcrypt.hash(adminPassword, 10);
        await usersCollection.updateOne(
          { _id: adminUser._id },
          {
            $set: {
              email: adminEmail,
              password: hashedPassword,
              updatedAt: new Date(),
            },
          }
        );
        console.log("✅ Admin credentials synchronized with server environment");
      }
    }
  } catch (error) {
    console.error("❌ Failed to seed initial admin:", error.message);
  }
}

// =====================================================
// LOGIN
// =====================================================

export async function login(req, res) {
  try {
    const { identifier, password } = req.body; // identifier can be email or username

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: "Email/Username and password are required.",
      });
    }

    const db = getDatabase();
    const usersCollection = db.collection("users");

    // Find user by email or username
    const user = await usersCollection.findOne({
      $or: [
        { email: identifier.trim().toLowerCase() },
        { username: identifier.trim().toLowerCase() },
      ],
    });

    if (!user) {
      await logActivity(req, "LOGIN_FAILED", "AUTH", { identifier, reason: "User not found" });
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    if (user.status === "Inactive" || user.status === "Disabled") {
      await logActivity(req, "LOGIN_FAILED", "AUTH", { identifier, reason: "Account disabled" });
      return res.status(403).json({
        success: false,
        message: "Your account is disabled. Please contact system administrator.",
      });
    }

    // Compare bcrypt password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      await logActivity(req, "LOGIN_FAILED", "AUTH", { identifier, reason: "Invalid password" });
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    // Determine effective permissions
    const permissions = user.permissions && user.permissions.length > 0
      ? user.permissions
      : (DEFAULT_ROLE_PERMISSIONS[user.role] || []);

    const userIdStr = user._id ? user._id.toString() : user.id;

    // Generate JWT token containing only non-sensitive identifiers
    const token = signToken({
      userId: userIdStr,
      role: user.role,
    });

    const userProfile = {
      id: userIdStr,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      permissions,
      mustChangePassword: !!user.mustChangePassword,
    };

    req.user = userProfile;
    await logActivity(req, "LOGIN_SUCCESS", "AUTH", { role: user.role });

    return res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      user: userProfile,
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "An internal error occurred during login.",
    });
  }
}

// =====================================================
// GET CURRENT USER PROFILE (/api/auth/me)
// =====================================================

export async function getMe(req, res) {
  try {
    const db = getDatabase();
    const usersCollection = db.collection("users");

    let userIdObj;
    try {
      userIdObj = new ObjectId(req.user.id);
    } catch {
      userIdObj = req.user.id;
    }

    const user = await usersCollection.findOne({
      $or: [{ _id: userIdObj }, { id: req.user.id }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found.",
      });
    }

    const permissions = user.permissions && user.permissions.length > 0
      ? user.permissions
      : (DEFAULT_ROLE_PERMISSIONS[user.role] || []);

    const userProfile = {
      id: user._id ? user._id.toString() : user.id,
      name: user.name,
      email: user.email,
      username: user.username,
      role: user.role,
      permissions,
      mustChangePassword: !!user.mustChangePassword,
    };

    return res.status(200).json({
      success: true,
      user: userProfile,
    });
  } catch (error) {
    console.error("getMe error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve user profile.",
    });
  }
}

// =====================================================
// LOGOUT
// =====================================================

export async function logout(req, res) {
  try {
    await logActivity(req, "LOGOUT", "AUTH");
    return res.status(200).json({
      success: true,
      message: "Logged out successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout error.",
    });
  }
}

// =====================================================
// CHANGE PASSWORD
// =====================================================

export async function changePassword(req, res) {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required.",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters long.",
      });
    }

    const db = getDatabase();
    const usersCollection = db.collection("users");

    let userIdObj;
    try {
      userIdObj = new ObjectId(req.user.id);
    } catch {
      userIdObj = req.user.id;
    }

    const user = await usersCollection.findOne({ _id: userIdObj });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await usersCollection.updateOne(
      { _id: userIdObj },
      {
        $set: {
          password: hashedNewPassword,
          mustChangePassword: false,
          updatedAt: new Date(),
        },
      }
    );

    await logActivity(req, "PASSWORD_CHANGE", "AUTH");

    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.error("changePassword error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update password.",
    });
  }
}
