import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/sidebar";

/* ================================
   AUTH
================================ */
import Login from "./pages/Login";
import PublicAdmissionStatus from "./pages/PublicAdmissionStatus";
import PublicOnlineAdmission from "./pages/PublicOnlineAdmission";

/* ================================
   EXISTING PAGES
================================ */
import Dashboard from "./pages/Dashboard";
import Students from "./pages/student";
import Fees from "./pages/fees";
import Results from "./pages/Results";
import Teachers from "./pages/teacher";
import Attendance from "./pages/Attendence";
import TeacherAttendance from "./pages/TeacherAttendance";
import TeacherSalary from "./pages/TeacherSalary";
import SchoolAdmin from "./pages/SchoolAdmin";
import Admission from "./pages/Admission";
import Timetable from "./pages/Timetable";
import Classes from "./pages/Classes";
import Subjects from "./pages/Subjects";
import Exams from "./pages/Exams";

/* ================================
   NEW PAGES
================================ */
import Notices from "./pages/Notices";
import Certificates from "./pages/Certificates";
import Transport from "./pages/Transport";
import Inventory from "./pages/Inventory";
import Reports from "./pages/Reports";
import RolesPermissions from "./pages/RolesPermissions";
import ActivityLog from "./pages/ActivityLog";
import Settings from "./pages/Settings";
import Gallery from "./pages/Gallery";
import Parents from "./pages/Parents";
import ParentCommunication from "./pages/ParentCommunication";
import Events from "./pages/Events";
import Homework from "./pages/Homework";
import Library from "./pages/Library";
import HealthRecords from "./pages/HealthRecords";
import Notifications from "./pages/Notifications";

import { useState } from "react";
import "./App.css";

function AppLayout() {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="app">
      <header className="mobile-app-header">
        <div className="mobile-brand">
          <div className="mobile-brand-logo">M</div>
          <div className="mobile-brand-title">
            <h3>MPSA</h3>
            <span>School ERP</span>
          </div>
        </div>
        <button
          className="hamburger-btn"
          type="button"
          onClick={() => setIsMobileOpen((prev) => !prev)}
          aria-label="Toggle mobile menu"
        >
          ☰
        </button>
      </header>

      <Sidebar isOpen={isMobileOpen} onClose={() => setIsMobileOpen(false)} />

      <main className="main-content">
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/school-admin"
            element={
              <ProtectedRoute requiredPermission="settings.manage">
                <SchoolAdmin />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students"
            element={
              <ProtectedRoute requiredPermission="students.view">
                <Students />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teachers"
            element={
              <ProtectedRoute requiredPermission="teachers.view">
                <Teachers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/attendance"
            element={
              <ProtectedRoute requiredPermission="attendance.view">
                <Attendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher-attendance"
            element={
              <ProtectedRoute requiredPermission="attendance.view">
                <TeacherAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/teacher-salary"
            element={
              <ProtectedRoute requiredPermission="salary.view">
                <TeacherSalary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fees"
            element={
              <ProtectedRoute requiredPermission="fees.view">
                <Fees />
              </ProtectedRoute>
            }
          />
          <Route
            path="/results"
            element={
              <ProtectedRoute requiredPermission="results.view">
                <Results />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admissions"
            element={
              <ProtectedRoute requiredPermission="admissions.view">
                <Admission />
              </ProtectedRoute>
            }
          />
          <Route
            path="/classes"
            element={
              <ProtectedRoute requiredPermission="classes.view">
                <Classes />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subjects"
            element={
              <ProtectedRoute requiredPermission="subjects.view">
                <Subjects />
              </ProtectedRoute>
            }
          />
          <Route
            path="/exams"
            element={
              <ProtectedRoute requiredPermission="results.view">
                <Exams />
              </ProtectedRoute>
            }
          />
          <Route
            path="/timetable"
            element={
              <ProtectedRoute requiredPermission="timetable.view">
                <Timetable />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notices"
            element={
              <ProtectedRoute requiredPermission="notices.view">
                <Notices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/certificates"
            element={
              <ProtectedRoute requiredPermission="students.view">
                <Certificates />
              </ProtectedRoute>
            }
          />
          <Route
            path="/transport"
            element={
              <ProtectedRoute requiredPermission="transport.view">
                <Transport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute requiredPermission="inventory.view">
                <Inventory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute requiredPermission="reports.view">
                <Reports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/roles-permissions"
            element={
              <ProtectedRoute requiredPermission="settings.manage">
                <RolesPermissions />
              </ProtectedRoute>
            }
          />
          <Route
            path="/activity-log"
            element={
              <ProtectedRoute requiredPermission="settings.manage">
                <ActivityLog />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute requiredPermission="settings.manage">
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/gallery"
            element={
              <ProtectedRoute>
                <Gallery />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parents"
            element={
              <ProtectedRoute requiredPermission="students.view">
                <Parents />
              </ProtectedRoute>
            }
          />
          <Route
            path="/parent-communication"
            element={
              <ProtectedRoute requiredPermission="notices.view">
                <ParentCommunication />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <Events />
              </ProtectedRoute>
            }
          />
          <Route
            path="/homework"
            element={
              <ProtectedRoute requiredPermission="homework.view">
                <Homework />
              </ProtectedRoute>
            }
          />
          <Route
            path="/library"
            element={
              <ProtectedRoute>
                <Library />
              </ProtectedRoute>
            }
          />
          <Route
            path="/health-records"
            element={
              <ProtectedRoute requiredPermission="students.view">
                <HealthRecords />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/online-admission" element={<PublicOnlineAdmission />} />
          <Route path="/admission-status/:id" element={<PublicAdmissionStatus />} />
          <Route path="/*" element={<AppLayout />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;