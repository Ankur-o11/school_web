import bcrypt from "bcryptjs";
import { getDatabase } from "../../config/database.js";
import { ObjectId } from "mongodb";
import { logActivity } from "../../utils/logger.js";
import { DEFAULT_ROLE_PERMISSIONS } from "../auth/auth.controller.js";

function cleanUser(userDoc) {
  if (!userDoc) return null;
  const cleaned = {
    ...userDoc,
    id: userDoc._id ? userDoc._id.toString() : userDoc.id,
  };
  delete cleaned._id;
  delete cleaned.password; // NEVER return password or hash
  return cleaned;
}

// GET /api/users
export async function getUsers(req, res) {
  try {
    const db = getDatabase();
    const usersCollection = db.collection("users");

    const { role, status, search } = req.query;
    const filter = {};

    if (role) filter.role = role;
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } },
      ];
    }

    const users = await usersCollection.find(filter).sort({ createdAt: -1 }).toArray();
    const cleanedUsers = users.map(cleanUser);

    return res.status(200).json({
      success: true,
      data: cleanedUsers,
    });
  } catch (error) {
    console.error("getUsers error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch users.",
    });
  }
}

// GET /api/users/:id
export async function getUserById(req, res) {
  try {
    const { id } = req.params;
    const db = getDatabase();
    const usersCollection = db.collection("users");

    let userIdObj;
    try {
      userIdObj = new ObjectId(id);
    } catch {
      userIdObj = id;
    }

    const user = await usersCollection.findOne({
      $or: [{ _id: userIdObj }, { id: id }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: cleanUser(user),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch user.",
    });
  }
}

// POST /api/users
export async function createUser(req, res) {
  try {
    const { name, email, username, password, role, permissions, status } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        message: "Name, email, password, and role are required.",
      });
    }

    const db = getDatabase();
    const usersCollection = db.collection("users");

    const existingUser = await usersCollection.findOne({
      $or: [
        { email: email.trim().toLowerCase() },
        { username: (username || email).trim().toLowerCase() },
      ],
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this email or username already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const assignedPermissions = permissions && Array.isArray(permissions)
      ? permissions
      : (DEFAULT_ROLE_PERMISSIONS[role] || []);

    const newUser = {
      name,
      email: email.trim().toLowerCase(),
      username: (username || email.split("@")[0]).trim().toLowerCase(),
      password: hashedPassword,
      role,
      permissions: assignedPermissions,
      status: status || "Active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);
    const createdUser = cleanUser({ ...newUser, _id: result.insertedId });

    await logActivity(req, "USER_CREATED", "USERS", { userId: createdUser.id, email, role });

    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: createdUser,
    });
  } catch (error) {
    console.error("createUser error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create user.",
    });
  }
}

// PUT /api/users/:id
export async function updateUser(req, res) {
  try {
    const { id } = req.params;
    const { name, email, role, permissions, status, password } = req.body;

    const db = getDatabase();
    const usersCollection = db.collection("users");

    let userIdObj;
    try {
      userIdObj = new ObjectId(id);
    } catch {
      userIdObj = id;
    }

    const existingUser = await usersCollection.findOne({ _id: userIdObj });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const updateFields = {
      updatedAt: new Date(),
    };

    if (name) updateFields.name = name;
    if (email) updateFields.email = email.trim().toLowerCase();
    if (role) updateFields.role = role;
    if (permissions && Array.isArray(permissions)) updateFields.permissions = permissions;
    if (status) updateFields.status = status;

    if (password && password.trim() !== "") {
      updateFields.password = await bcrypt.hash(password, 10);
    }

    await usersCollection.updateOne({ _id: userIdObj }, { $set: updateFields });

    await logActivity(req, "USER_UPDATED", "USERS", { userId: id, status, role });

    const updatedUser = await usersCollection.findOne({ _id: userIdObj });

    return res.status(200).json({
      success: true,
      message: "User updated successfully.",
      data: cleanUser(updatedUser),
    });
  } catch (error) {
    console.error("updateUser error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update user.",
    });
  }
}

// DELETE /api/users/:id (or Disable)
export async function deleteUser(req, res) {
  try {
    const { id } = req.params;
    const db = getDatabase();
    const usersCollection = db.collection("users");

    let userIdObj;
    try {
      userIdObj = new ObjectId(id);
    } catch {
      userIdObj = id;
    }

    // Protect system from deleting self
    if (req.user.id === id) {
      return res.status(400).json({
        success: false,
        message: "You cannot delete your own account.",
      });
    }

    await usersCollection.deleteOne({ _id: userIdObj });

    await logActivity(req, "USER_DELETED", "USERS", { userId: id });

    return res.status(200).json({
      success: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete user.",
    });
  }
}
