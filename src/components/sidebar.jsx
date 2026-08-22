import { useLocation, useNavigate } from "react-router-dom";
import "../Style/sidebar.css";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: "/", icon: "🏠", label: "Dashboard" },
    { path: "/school-admin", icon: "🧑‍💼", label: "School Admin" },

    { path: "/students", icon: "👨‍🎓", label: "Students" },
    { path: "/teachers", icon: "👨‍🏫", label: "Teachers" },
    { path: "/results", icon: "📝", label: "Results" },
    { path: "/attendance", icon: "📅", label: "Attendance" },
    { path: "/fees", icon: "💰", label: "Fees" },
    { path: "/teacher-salary", icon: "🧑‍💼", label: "Teacher Salary" },

    { path: "/admissions", icon: "🎓", label: "Admissions" },
    { path: "/classes", icon: "🏫", label: "Classes & Sections" },
    { path: "/subjects", icon: "📚", label: "Subjects" },
    { path: "/exams", icon: "📝", label: "Exams" },
    { path: "/timetable", icon: "🗓️", label: "Timetable" },
    { path: "/notices", icon: "📢", label: "Notices" },
    { path: "/certificates", icon: "📄", label: "Certificates" },
    { path: "/transport", icon: "🚌", label: "Transport" },
    { path: "/inventory", icon: "📦", label: "Inventory" },
    { path: "/reports", icon: "📊", label: "Reports" },
    { path: "/roles-permissions", icon: "🔐", label: "Roles & Permissions" },
    { path: "/activity-log", icon: "📜", label: "Activity Log" },
    { path: "/settings", icon: "⚙️", label: "Settings" },
    { path: "/gallery", icon: "🖼️", label: "Gallery" },

    { path: "/parents", icon: "👨‍👩‍👧", label: "Parents" },
    { path: "/parent-communication", icon: "💬", label: "Parent Communication" },
    { path: "/events", icon: "🏆", label: "Events & Activities" },
    { path: "/homework", icon: "📖", label: "Homework & Assignments" },
    { path: "/library", icon: "📚", label: "Library" },
    { path: "/health-records", icon: "🏥", label: "Health Records" },
    { path: "/notifications", icon: "🔔", label: "Notifications" },
  ];

  return (
    <aside className="sidebar">

      {/* BRAND */}

      <div className="brand">
        <div className="logo">M</div>

        <div className="brand-text">
          <h2>MPSA</h2>
          <span>School ERP</span>
        </div>
      </div>


      {/* MENU */}

      <p className="menu-title">
        MAIN MENU
      </p>

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
              onClick={() => navigate(item.path)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  navigate(item.path);
                }
              }}
            >
              <span className="menu-icon">
                {item.icon}
              </span>

              <span>
                {item.label}
              </span>
            </div>
          );
        })}

      </nav>


      {/* BOTTOM */}

      <div className="sidebar-bottom">

        <button
          className="sidebar-button logout-btn"
          type="button"
        >
          <span className="menu-icon">
            🚪
          </span>

          <span>
            Logout
          </span>
        </button>


        <div className="admin-profile">

          <div className="admin-avatar">
            A
          </div>

          <div>
            <strong>
              School Admin
            </strong>

            <span>
              Administrator
            </span>
          </div>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;