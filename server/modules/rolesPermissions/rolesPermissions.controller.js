import { getDatabase } from "../../config/database.js";
import { DEFAULT_ROLE_PERMISSIONS } from "../auth/auth.controller.js";
import { logActivity } from "../../utils/logger.js";

const ALL_PERMISSIONS = [
  { id: "students.view", label: "View Students", category: "Students" },
  { id: "students.create", label: "Add Students", category: "Students" },
  { id: "students.edit", label: "Edit Students", category: "Students" },
  { id: "students.delete", label: "Delete Students", category: "Students" },

  { id: "teachers.view", label: "View Teachers", category: "Teachers" },
  { id: "teachers.create", label: "Add Teachers", category: "Teachers" },
  { id: "teachers.edit", label: "Edit Teachers", category: "Teachers" },
  { id: "teachers.delete", label: "Delete Teachers", category: "Teachers" },

  { id: "attendance.view", label: "View Attendance", category: "Attendance" },
  { id: "attendance.mark", label: "Mark Attendance", category: "Attendance" },
  { id: "attendance.edit", label: "Edit Attendance", category: "Attendance" },

  { id: "fees.view", label: "View Fees", category: "Fees & Finance" },
  { id: "fees.create", label: "Collect / Add Fees", category: "Fees & Finance" },
  { id: "fees.edit", label: "Edit Fees", category: "Fees & Finance" },
  { id: "fees.delete", label: "Delete Fee Records", category: "Fees & Finance" },

  { id: "salary.view", label: "View Teacher Salary", category: "Fees & Finance" },
  { id: "salary.create", label: "Process Salary", category: "Fees & Finance" },
  { id: "salary.edit", label: "Edit Salary", category: "Fees & Finance" },

  { id: "results.view", label: "View Results", category: "Academics" },
  { id: "results.enter", label: "Enter Marks", category: "Academics" },
  { id: "results.edit", label: "Edit Marks", category: "Academics" },
  { id: "results.publish", label: "Publish Results", category: "Academics" },

  { id: "classes.view", label: "View Classes", category: "Academics" },
  { id: "classes.manage", label: "Manage Classes & Sections", category: "Academics" },

  { id: "subjects.view", label: "View Subjects", category: "Academics" },
  { id: "subjects.manage", label: "Manage Subjects", category: "Academics" },

  { id: "timetable.view", label: "View Timetable", category: "Academics" },
  { id: "timetable.edit", label: "Edit Timetable", category: "Academics" },

  { id: "admissions.view", label: "View Admissions", category: "Administration" },
  { id: "admissions.manage", label: "Manage Admissions", category: "Administration" },

  { id: "notices.view", label: "View Notices", category: "Communication" },
  { id: "notices.manage", label: "Manage Notices", category: "Communication" },
  { id: "communications.view", label: "View Communications", category: "Communication" },
  { id: "communications.send", label: "Send WhatsApp Messages", category: "Communication" },
  { id: "communications.templates.manage", label: "Manage Message Templates", category: "Communication" },
  { id: "communications.history.view", label: "View Communication History", category: "Communication" },

  { id: "homework.view", label: "View Homework", category: "Academics" },
  { id: "homework.create", label: "Assign Homework", category: "Academics" },

  { id: "reports.view", label: "View Central Reports", category: "Reports" },
  { id: "reports.export", label: "Export Reports", category: "Reports" },

  { id: "users.view", label: "View Users", category: "Settings" },
  { id: "users.create", label: "Create Users", category: "Settings" },
  { id: "users.edit", label: "Edit Users", category: "Settings" },
  { id: "users.disable", label: "Disable Users", category: "Settings" },

  { id: "settings.manage", label: "Manage System Settings", category: "Settings" },
];

export async function getRolesAndPermissions(req, res) {
  try {
    const db = getDatabase();
    const rolesCollection = db.collection("roles");

    const customRoles = await rolesCollection.find({}).toArray();

    // Map default permissions
    const rolesMap = { ...DEFAULT_ROLE_PERMISSIONS };

    customRoles.forEach((r) => {
      rolesMap[r.roleName] = r.permissions || [];
    });

    const rolesList = Object.keys(rolesMap).map((roleName) => ({
      name: roleName,
      permissions: rolesMap[roleName],
      isSystem: ["Admin", "Teacher", "Accountant", "Student", "Parent", "Staff"].includes(roleName),
    }));

    return res.status(200).json({
      success: true,
      allPermissions: ALL_PERMISSIONS,
      roles: rolesList,
    });
  } catch (error) {
    console.error("getRolesAndPermissions error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to load roles and permissions.",
    });
  }
}

export async function updateRolePermissions(req, res) {
  try {
    const { roleName, permissions } = req.body;

    if (!roleName || !Array.isArray(permissions)) {
      return res.status(400).json({
        success: false,
        message: "Role name and permissions array are required.",
      });
    }

    const db = getDatabase();
    const rolesCollection = db.collection("roles");
    const usersCollection = db.collection("users");

    await rolesCollection.updateOne(
      { roleName },
      { $set: { roleName, permissions, updatedAt: new Date() } },
      { upsert: true }
    );

    // Update existing users with this role to receive new permissions
    await usersCollection.updateMany(
      { role: roleName },
      { $set: { permissions, updatedAt: new Date() } }
    );

    await logActivity(req, "ROLE_PERMISSIONS_UPDATED", "ROLES", { roleName, permissionsCount: permissions.length });

    return res.status(200).json({
      success: true,
      message: `Permissions updated for role ${roleName}.`,
    });
  } catch (error) {
    console.error("updateRolePermissions error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update role permissions.",
    });
  }
}
