import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../Style/sidebar.css";

function Sidebar({ isOpen = false, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, hasPermission } = useAuth();

  const allMenuItems = [
    { path: "/", icon: "🏠", label: "Dashboard", permission: null },
    { path: "/school-admin", icon: "🧑‍💼", label: "School Admin", permission: "settings.manage" },

    { path: "/students", icon: "👨‍🎓", label: "Students", permission: "students.view" },
    { path: "/teachers", icon: "👨‍🏫", label: "Teachers", permission: "teachers.view" },
    { path: "/results", icon: "📝", label: "Results", permission: "results.view" },
    { path: "/attendance", icon: "📅", label: "Attendance", permission: "attendance.view" },
    { path: "/fees", icon: "💰", label: "Fees", permission: "fees.view" },
    { path: "/teacher-salary", icon: "🧑‍💼", label: "Teacher Salary", permission: "salary.view" },

    { path: "/admissions", icon: "🎓", label: "Admissions", permission: "admissions.view" },
    { path: "/classes", icon: "🏫", label: "Classes & Sections", permission: "classes.view" },
    { path: "/subjects", icon: "📚", label: "Subjects", permission: "subjects.view" },
    { path: "/exams", icon: "📝", label: "Exams", permission: "results.view" },
    { path: "/timetable", icon: "🗓️", label: "Timetable", permission: "timetable.view" },
    { path: "/notices", icon: "📢", label: "Notices", permission: "notices.view" },
    { path: "/certificates", icon: "📄", label: "Certificates", permission: "students.view" },
    { path: "/transport", icon: "🚌", label: "Transport", permission: "transport.view" },
    { path: "/inventory", icon: "📦", label: "Inventory", permission: "inventory.view" },
    { path: "/reports", icon: "📊", label: "Reports", permission: "reports.view" },
    { path: "/roles-permissions", icon: "🔐", label: "Roles & Permissions", permission: "settings.manage" },
    { path: "/activity-log", icon: "📜", label: "Activity Log", permission: "settings.manage" },
    { path: "/settings", icon: "⚙️", label: "Settings", permission: "settings.manage" },
    { path: "/gallery", icon: "🖼️", label: "Gallery", permission: null },

    { path: "/parents", icon: "👨‍👩‍👧", label: "Parents", permission: "students.view" },
    { path: "/parent-communication", icon: "💬", label: "Parent Communication", permission: "notices.view" },
    { path: "/events", icon: "🏆", label: "Events & Activities", permission: null },
    { path: "/homework", icon: "📖", label: "Homework & Assignments", permission: "homework.view" },
    { path: "/library", icon: "📚", label: "Library", permission: null },
    { path: "/health-records", icon: "🏥", label: "Health Records", permission: "students.view" },
    { path: "/notifications", icon: "🔔", label: "Notifications", permission: null },
  ];

  // Filter items based on permission
  const menuItems = allMenuItems.filter((item) => hasPermission(item.permission));

  const handleNav = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  const handleLogout = async () => {
    if (onClose) onClose();
    await logout();
    navigate("/login");
  };

  const getInitial = () => {
    if (!user || !user.name) return "A";
    return user.name.charAt(0).toUpperCase();
  };

  return (
    <>
      {/* MOBILE OVERLAY MASK */}
      <div
        className={`sidebar-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      />

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* BRAND */}
        <div className="brand">
          <div className="logo">M</div>
          <div className="brand-text">
            <h2>MPSA</h2>
            <span>School ERP</span>
          </div>
          {onClose && (
            <button className="sidebar-close-btn" type="button" onClick={onClose}>
              ✕
            </button>
          )}
        </div>

        {/* MENU */}
        <p className="menu-title">MAIN MENU</p>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const active =
              item.path === "/"
                ? location.pathname === "/"
                : location.pathname === item.path;

            return (
              <div
                key={item.path}
                className={
                  active
                    ? "sidebar-link active-link"
                    : "sidebar-link"
                }
                onClick={() => handleNav(item.path)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleNav(item.path);
                  }
                }}
              >
                <span className="menu-icon">{item.icon}</span>
                <span>{item.label}</span>
              </div>
            );
          })}
        </nav>

        {/* BOTTOM */}
        <div className="sidebar-bottom">
          <button
            className="sidebar-button logout-btn"
            type="button"
            onClick={handleLogout}
          >
            <span className="menu-icon">🚪</span>
            <span>Logout</span>
          </button>

          <div className="admin-profile">
            <div className="admin-avatar">{getInitial()}</div>
            <div style={{ overflow: "hidden" }}>
              <strong style={{ display: "block", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                {user?.name || "School User"}
              </strong>
              <span style={{ color: "#3b82f6", fontWeight: "600", fontSize: "12px" }}>
                {user?.role || "User"}
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;