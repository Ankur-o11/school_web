import { BrowserRouter, Routes, Route } from "react-router-dom";

import Sidebar from "./components/sidebar";

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

import "./App.css";


function App() {

  return (

    <BrowserRouter>

      <div className="app">

        {/* ================================
            SIDEBAR
        ================================= */}

        <Sidebar />


        {/* ================================
            MAIN CONTENT
        ================================= */}

        <main className="main-content">

          <Routes>

            {/* ================================
                DASHBOARD
            ================================= */}

            <Route
              path="/"
              element={<Dashboard />}
            />


            {/* ================================
                SCHOOL ADMIN
            ================================= */}

            <Route
              path="/school-admin"
              element={<SchoolAdmin />}
            />


            {/* ================================
                STUDENTS
            ================================= */}

            <Route
              path="/students"
              element={<Students />}
            />


            {/* ================================
                TEACHERS
            ================================= */}

            <Route
              path="/teachers"
              element={<Teachers />}
            />


            {/* ================================
                ATTENDANCE
            ================================= */}

            <Route
              path="/attendance"
              element={<Attendance />}
            />


            {/* ================================
                TEACHER ATTENDANCE
            ================================= */}

            <Route
              path="/teacher-attendance"
              element={<TeacherAttendance />}
            />


            {/* ================================
                TEACHER SALARY
            ================================= */}

            <Route
              path="/teacher-salary"
              element={<TeacherSalary />}
            />


            {/* ================================
                FEES
            ================================= */}

            <Route
              path="/fees"
              element={<Fees />}
            />


            {/* ================================
                RESULTS
            ================================= */}

            <Route
              path="/results"
              element={<Results />}
            />


            {/* ================================
                ADMISSIONS
            ================================= */}

            <Route
              path="/admissions"
              element={<Admission />}
            />


            {/* ================================
                CLASSES & SECTIONS
            ================================= */}

            <Route
              path="/classes"
              element={<Classes />}
            />


            {/* ================================
                SUBJECTS
            ================================= */}

            <Route
              path="/subjects"
              element={<Subjects />}
            />


            {/* ================================
                EXAMS
            ================================= */}

            <Route
              path="/exams"
              element={<Exams />}
            />


            {/* ================================
                TIMETABLE
            ================================= */}

            <Route
              path="/timetable"
              element={<Timetable />}
            />


            {/* ================================
                NOTICES
            ================================= */}

            <Route
              path="/notices"
              element={<Notices />}
            />


            {/* ================================
                CERTIFICATES
            ================================= */}

            <Route
              path="/certificates"
              element={<Certificates />}
            />


            {/* ================================
                TRANSPORT
            ================================= */}

            <Route
              path="/transport"
              element={<Transport />}
            />


            {/* ================================
                INVENTORY
            ================================= */}

            <Route
              path="/inventory"
              element={<Inventory />}
            />


            {/* ================================
                REPORTS
            ================================= */}

            <Route
              path="/reports"
              element={<Reports />}
            />


            {/* ================================
                ROLES & PERMISSIONS
            ================================= */}

            <Route
              path="/roles-permissions"
              element={<RolesPermissions />}
            />


            {/* ================================
                ACTIVITY LOG
            ================================= */}

            <Route
              path="/activity-log"
              element={<ActivityLog />}
            />


            {/* ================================
                SETTINGS
            ================================= */}

            <Route
              path="/settings"
              element={<Settings />}
            />


            {/* ================================
                GALLERY
            ================================= */}

            <Route
              path="/gallery"
              element={<Gallery />}
            />


            {/* ================================
                PARENTS
            ================================= */}

            <Route
              path="/parents"
              element={<Parents />}
            />


            {/* ================================
                PARENT COMMUNICATION
            ================================= */}

            <Route
              path="/parent-communication"
              element={<ParentCommunication />}
            />


            {/* ================================
                EVENTS & ACTIVITIES
            ================================= */}

            <Route
              path="/events"
              element={<Events />}
            />


            {/* ================================
                HOMEWORK & ASSIGNMENTS
            ================================= */}

            <Route
              path="/homework"
              element={<Homework />}
            />


            {/* ================================
                LIBRARY
            ================================= */}

            <Route
              path="/library"
              element={<Library />}
            />


            {/* ================================
                HEALTH RECORDS
            ================================= */}

            <Route
              path="/health-records"
              element={<HealthRecords />}
            />


            {/* ================================
                NOTIFICATIONS
            ================================= */}

            <Route
              path="/notifications"
              element={<Notifications />}
            />

          </Routes>

        </main>

      </div>

    </BrowserRouter>

  );
}

export default App;