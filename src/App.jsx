import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Students from "./pages/student";
import Fees from "./pages/fees";
import Results from "./pages/Results";
import Teachers from "./pages/teacher";
import Attendance from "./pages/Attendence";
import TeacherAttendance from "./pages/TeacherAttendance";
import TeacherSalary from "./pages/TeacherSalary";

import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app">

        {/* ================= SIDEBAR ================= */}

        <aside className="sidebar">

          {/* LOGO */}

          <div className="sidebar-logo">
            <div className="logo-box">
              M
            </div>

            <div>
              <h2>MPSA</h2>
              <span>School Management</span>
            </div>
          </div>

          {/* MENU */}

          <nav className="sidebar-menu">

            <p className="menu-title">
              MAIN
            </p>

            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link active-link"
                  : "sidebar-link"
              }
            >
              <span>🏠</span>
              Dashboard
            </NavLink>

            <NavLink
              to="/students"
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link active-link"
                  : "sidebar-link"
              }
            >
              <span>👨‍🎓</span>
              Students
            </NavLink>

            <NavLink
              to="/attendance"
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link active-link"
                  : "sidebar-link"
              }
            >
              <span>📅</span>
              Student Attendance
            </NavLink>

            <p className="menu-title">
              TEACHERS
            </p>

            <NavLink
              to="/teachers"
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link active-link"
                  : "sidebar-link"
              }
            >
              <span>👨‍🏫</span>
              Teachers
            </NavLink>

            <NavLink
              to="/teacher-attendance"
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link active-link"
                  : "sidebar-link"
              }
            >
              <span>🕘</span>
              Teacher Attendance
            </NavLink>

            <NavLink
              to="/teacher-salary"
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link active-link"
                  : "sidebar-link"
              }
            >
              <span>💰</span>
              Teacher Salary
            </NavLink>

            <p className="menu-title">
              MANAGEMENT
            </p>

            <NavLink
              to="/fees"
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link active-link"
                  : "sidebar-link"
              }
            >
              <span>💳</span>
              Fees
            </NavLink>

            <NavLink
              to="/results"
              className={({ isActive }) =>
                isActive
                  ? "sidebar-link active-link"
                  : "sidebar-link"
              }
            >
              <span>📝</span>
              Results
            </NavLink>

          </nav>

          {/* SIDEBAR FOOTER */}

          <div className="sidebar-footer">

            <div className="admin-avatar">
              A
            </div>

            <div>
              <strong>School Admin</strong>
              <small>Administrator</small>
            </div>

          </div>

        </aside>

        {/* ================= MAIN CONTENT ================= */}

        <main className="main-content">

          <Routes>

            {/* DASHBOARD */}

            <Route
              path="/"
              element={<Dashboard />}
            />

            {/* STUDENTS */}

            <Route
              path="/students"
              element={<Students />}
            />

            {/* STUDENT ATTENDANCE */}

            <Route
              path="/attendance"
              element={<Attendance />}
            />

            {/* TEACHERS */}

            <Route
              path="/teachers"
              element={<Teachers />}
            />

            {/* TEACHER ATTENDANCE */}

            <Route
              path="/teacher-attendance"
              element={<TeacherAttendance />}
            />

            {/* TEACHER SALARY */}

            <Route
              path="/teacher-salary"
              element={<TeacherSalary />}
            />

            {/* FEES */}

            <Route
              path="/fees"
              element={<Fees />}
            />

            {/* RESULTS */}

            <Route
              path="/results"
              element={<Results />}
            />

          </Routes>

        </main>

      </div>
    </BrowserRouter>
  );
}

export default App;