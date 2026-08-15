import { Link, useLocation } from "react-router-dom";
import "../Style/sidebar.css";

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="sidebar">

      <div className="brand">
        <div className="logo">M</div>

        <div className="brand-text">
          <h2>MPSA</h2>
          <span>School ERP</span>
        </div>
      </div>

      <p className="menu-title">MAIN MENU</p>

      <nav className="sidebar-nav">

        <Link
          to="/"
          className={
            location.pathname === "/"
              ? "sidebar-link active-link"
              : "sidebar-link"
          }
        >
          <span className="menu-icon">🏠</span>
          <span>Dashboard</span>
        </Link>

        <Link
          to="/students"
          className={
            location.pathname === "/students"
              ? "sidebar-link active-link"
              : "sidebar-link"
          }
        >
          <span className="menu-icon">👨‍🎓</span>
          <span>Students</span>
        </Link>

        <Link
          to="/teachers"
          className={
            location.pathname === "/teachers"
              ? "sidebar-link active-link"
              : "sidebar-link"
          }
        >
          <span className="menu-icon">👨‍🏫</span>
          <span>Teachers</span>
        </Link>

        <Link
          to="/classes"
          className={
            location.pathname === "/classes"
              ? "sidebar-link active-link"
              : "sidebar-link"
          }
        >
          <span className="menu-icon">📚</span>
          <span>Classes</span>
        </Link>

        <Link
          to="/attendance"
          className={
            location.pathname === "/attendance"
              ? "sidebar-link active-link"
              : "sidebar-link"
          }
        >
          <span className="menu-icon">📅</span>
          <span>Student Attendance</span>
        </Link>

        <Link
          to="/teacher-attendance"
          className={
            location.pathname === "/teacher-attendance"
              ? "sidebar-link active-link"
              : "sidebar-link"
          }
        >
          <span className="menu-icon">👨‍🏫</span>
          <span>Teacher Attendance</span>
        </Link>

        <Link
          to="/fees"
          className={
            location.pathname === "/fees"
              ? "sidebar-link active-link"
              : "sidebar-link"
          }
        >
          <span className="menu-icon">💰</span>
          <span>Fees</span>
        </Link>

        <Link
          to="/results"
          className={
            location.pathname === "/results"
              ? "sidebar-link active-link"
              : "sidebar-link"
          }
        >
          <span className="menu-icon">📝</span>
          <span>Exams & Results</span>
        </Link>

        <Link
          to="/notices"
          className={
            location.pathname === "/notices"
              ? "sidebar-link active-link"
              : "sidebar-link"
          }
        >
          <span className="menu-icon">📢</span>
          <span>Notices</span>
        </Link>

        <Link
          to="/settings"
          className={
            location.pathname === "/settings"
              ? "sidebar-link active-link"
              : "sidebar-link"
          }
        >
          <span className="menu-icon">⚙️</span>
          <span>Settings</span>
        </Link>

      </nav>

      <div className="sidebar-bottom">

        <button
          className="sidebar-button logout-btn"
          type="button"
        >
          <span className="menu-icon">🚪</span>
          <span>Logout</span>
        </button>

        <div className="admin-profile">

          <div className="admin-avatar">
            A
          </div>

          <div>
            <strong>Admin</strong>
            <span>Administrator</span>
          </div>

        </div>

      </div>

    </aside>
  );
}

export default Sidebar;