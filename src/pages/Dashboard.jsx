import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../Style/dashboard.css";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

function Dashboard() {
  const navigate = useNavigate();

  // =====================================================
  // STATE
  // =====================================================

  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);

  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingTeachers, setLoadingTeachers] = useState(true);

  // =====================================================
  // FETCH STUDENTS
  // =====================================================

  useEffect(() => {
    fetch("http://localhost:5000/api/students")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Students API failed");
        }

        return response.json();
      })
      .then((data) => {
        setStudents(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Students API Error:", error);
        setStudents([]);
      })
      .finally(() => {
        setLoadingStudents(false);
      });
  }, []);

  // =====================================================
  // FETCH TEACHERS
  // =====================================================

  useEffect(() => {
    fetch("http://localhost:5000/api/teachers")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Teachers API failed");
        }

        return response.json();
      })
      .then((data) => {
        setTeachers(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error("Teachers API Error:", error);
        setTeachers([]);
      })
      .finally(() => {
        setLoadingTeachers(false);
      });
  }, []);

  // =====================================================
  // DASHBOARD CALCULATIONS
  // =====================================================

  const totalStudents = students.length;

  const totalTeachers = teachers.length;

  const activeStudents = students.filter(
    (student) =>
      !student.status ||
      student.status.toLowerCase() === "active"
  ).length;

  const activeTeachers = teachers.filter(
    (teacher) =>
      !teacher.status ||
      teacher.status.toLowerCase() === "active"
  ).length;

  // =====================================================
  // STATIC ATTENDANCE FOR NOW
  // FEES WILL BE CONNECTED LATER
  // =====================================================

  const attendanceData = [
    {
      name: "Present",
      value: 92,
    },
    {
      name: "Absent",
      value: 6,
    },
    {
      name: "Leave",
      value: 2,
    },
  ];

  const ATTENDANCE_COLORS = [
    "#22c55e",
    "#ef4444",
    "#f59e0b",
  ];

  // =====================================================
  // FEES DATA
  // TEMPORARY - DO NOT CONNECT FEES API YET
  // =====================================================

  const feeData = [
    {
      name: "Collected",
      value: 1850000,
    },
    {
      name: "Pending",
      value: 2650000,
    },
  ];

  const FEE_COLORS = [
    "#22c55e",
    "#e5e7eb",
  ];

  // =====================================================
  // DATE
  // =====================================================

  const today = new Date();

  const formattedDate = today.toLocaleDateString(
    "en-IN",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }
  );

  // =====================================================
  // RECENT STUDENTS
  // =====================================================

  const recentStudents = [...students]
    .reverse()
    .slice(0, 5);

  // =====================================================
  // LOADING TEXT
  // =====================================================

  const studentCountText = loadingStudents
    ? "..."
    : totalStudents;

  const teacherCountText = loadingTeachers
    ? "..."
    : totalTeachers;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="dashboard-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="dashboard-header">

        <div>

          <span className="dashboard-label">
            SCHOOL ADMINISTRATION
          </span>

          <h1>
            Good Evening, Admin 👋
          </h1>

          <p>
            MPSA School Management System
          </p>

        </div>

        <div className="dashboard-date">

          <span>
            📅
          </span>

          <div>

            <small>
              Today
            </small>

            <strong>
              {formattedDate}
            </strong>

          </div>

        </div>

      </div>

      {/* =====================================================
          STAT CARDS
      ===================================================== */}

      <div className="dashboard-stats">

        {/* STUDENTS */}

        <div className="dashboard-card">

          <div className="dashboard-icon blue">
            👨‍🎓
          </div>

          <div className="stat-content">

            <span>
              Total Students
            </span>

            <h2>
              {studentCountText}
            </h2>

            <small className="positive">
              ✓ {activeStudents} active students
            </small>

          </div>

        </div>

        {/* TEACHERS */}

        <div className="dashboard-card">

          <div className="dashboard-icon purple">
            👨‍🏫
          </div>

          <div className="stat-content">

            <span>
              Total Teachers
            </span>

            <h2>
              {teacherCountText}
            </h2>

            <small className="positive">
              ✓ {activeTeachers} active teachers
            </small>

          </div>

        </div>

        {/* FEES */}

        <div className="dashboard-card">

          <div className="dashboard-icon green">
            💰
          </div>

          <div className="stat-content">

            <span>
              Fees Collected
            </span>

            <h2>
              ₹18.5L
            </h2>

            <small className="positive">
              Current session
            </small>

          </div>

        </div>

        {/* ATTENDANCE */}

        <div className="dashboard-card">

          <div className="dashboard-icon orange">
            📅
          </div>

          <div className="stat-content">

            <span>
              Today's Attendance
            </span>

            <h2>
              92%
            </h2>

            <small className="positive">
              ✓ Good attendance
            </small>

          </div>

        </div>

      </div>

      {/* =====================================================
          ATTENDANCE + FEES
      ===================================================== */}

      <div className="dashboard-grid">

        {/* =====================================================
            ATTENDANCE
        ===================================================== */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <div>

              <h2>
                Today's Attendance
              </h2>

              <p>
                Student attendance overview
              </p>

            </div>

            <button
              className="panel-btn"
              onClick={() => navigate("/attendance")}
            >
              View Details
            </button>

          </div>

          <div className="attendance-box">

            {/* CHART */}

            <div className="attendance-chart-wrapper">

              <ResponsiveContainer
                width="100%"
                height={220}
              >

                <PieChart>

                  <Pie
                    data={attendanceData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >

                    {attendanceData.map(
                      (entry, index) => (
                        <Cell
                          key={`attendance-${index}`}
                          fill={
                            ATTENDANCE_COLORS[index]
                          }
                        />
                      )
                    )}

                  </Pie>

                  <Tooltip
                    formatter={(value) =>
                      `${value}%`
                    }
                  />

                </PieChart>

              </ResponsiveContainer>

              <div className="attendance-chart-center">

                <strong>
                  92%
                </strong>

                <span>
                  Present
                </span>

              </div>

            </div>

            {/* DETAILS */}

            <div className="attendance-details">

              <div className="attendance-item">

                <span className="dot present"></span>

                <div>

                  <p>
                    Present
                  </p>

                  <strong>
                    92%
                  </strong>

                </div>

              </div>

              <div className="attendance-item">

                <span className="dot absent"></span>

                <div>

                  <p>
                    Absent
                  </p>

                  <strong>
                    6%
                  </strong>

                </div>

              </div>

              <div className="attendance-item">

                <span className="dot leave"></span>

                <div>

                  <p>
                    Leave
                  </p>

                  <strong>
                    2%
                  </strong>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* =====================================================
            FEES
        ===================================================== */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <div>

              <h2>
                Fee Overview
              </h2>

              <p>
                Current academic session
              </p>

            </div>

            <button
              className="panel-btn"
              onClick={() => navigate("/fees")}
            >
              View Fees
            </button>

          </div>

          <div className="fee-chart-section">

            <div className="fee-pie-wrapper">

              <ResponsiveContainer
                width="100%"
                height={220}
              >

                <PieChart>

                  <Pie
                    data={feeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >

                    {feeData.map(
                      (entry, index) => (
                        <Cell
                          key={`fee-${index}`}
                          fill={
                            FEE_COLORS[index]
                          }
                        />
                      )
                    )}

                  </Pie>

                  <Tooltip
                    formatter={(value) =>
                      `₹${(
                        value / 100000
                      ).toFixed(2)}L`
                    }
                  />

                </PieChart>

              </ResponsiveContainer>

              <div className="fee-pie-center">

                <strong>
                  41%
                </strong>

                <span>
                  Collected
                </span>

              </div>

            </div>

            <div className="fee-chart-details">

              <div className="fee-chart-item">

                <div>

                  <span className="fee-dot collected"></span>

                  <span>
                    Collected
                  </span>

                </div>

                <strong>
                  ₹18.50L
                </strong>

              </div>

              <div className="fee-chart-item">

                <div>

                  <span className="fee-dot pending"></span>

                  <span>
                    Pending
                  </span>

                </div>

                <strong>
                  ₹26.50L
                </strong>

              </div>

              <div className="fee-chart-total">

                <span>
                  Total Fees
                </span>

                <strong>
                  ₹45.00L
                </strong>

              </div>

            </div>

          </div>

          <div className="fee-progress">

            <div
              className="fee-progress-bar"
              style={{
                width: "41%",
              }}
            ></div>

          </div>

          <p className="fee-percent">
            41% of total fees collected
          </p>

        </div>

      </div>

      {/* =====================================================
          RECENT STUDENTS + QUICK ACTIONS
      ===================================================== */}

      <div className="dashboard-grid">

        {/* =====================================================
            RECENT STUDENTS
        ===================================================== */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <div>

              <h2>
                Recent Students
              </h2>

              <p>
                Recently added students
              </p>

            </div>

            <button
              className="panel-btn"
              onClick={() => navigate("/students")}
            >
              View All
            </button>

          </div>

          <div className="recent-list">

            {loadingStudents ? (

              <div className="recent-item">

                <div className="student-info">

                  <strong>
                    Loading students...
                  </strong>

                  <span>
                    Please wait
                  </span>

                </div>

              </div>

            ) : recentStudents.length === 0 ? (

              <div className="recent-item">

                <div className="student-info">

                  <strong>
                    No students found
                  </strong>

                  <span>
                    Add students from Students section
                  </span>

                </div>

              </div>

            ) : (

              recentStudents.map((student) => {

                const studentName =
                  student.name || "Unknown Student";

                const initials =
                  studentName
                    .split(" ")
                    .filter(Boolean)
                    .slice(0, 2)
                    .map(
                      (word) =>
                        word.charAt(0).toUpperCase()
                    )
                    .join("");

                return (

                  <div
                    className="recent-item"
                    key={student.id}
                  >

                    <div className="avatar">
                      {initials || "ST"}
                    </div>

                    <div className="student-info">

                      <strong>
                        {studentName}
                      </strong>

                      <span>
                        Class {student.class || "-"}
                        {student.section
                          ? `-${student.section}`
                          : ""}
                        {" • "}
                        Roll {student.rollNo || "-"}
                      </span>

                    </div>

                    <small>
                      Active
                    </small>

                  </div>

                );

              })

            )}

          </div>

        </div>

        {/* =====================================================
            QUICK ACTIONS
        ===================================================== */}

        <div className="dashboard-panel">

          <div className="panel-header">

            <div>

              <h2>
                Quick Actions
              </h2>

              <p>
                Frequently used options
              </p>

            </div>

          </div>

          <div className="quick-actions">

            <button
              onClick={() => navigate("/students")}
            >

              <span>
                👨‍🎓
              </span>

              <div>

                <strong>
                  Add Student
                </strong>

                <small>
                  Register new student
                </small>

              </div>

            </button>

            <button
              onClick={() => navigate("/fees")}
            >

              <span>
                💰
              </span>

              <div>

                <strong>
                  Collect Fees
                </strong>

                <small>
                  Record fee payment
                </small>

              </div>

            </button>

            <button
              onClick={() => navigate("/attendance")}
            >

              <span>
                📅
              </span>

              <div>

                <strong>
                  Mark Attendance
                </strong>

                <small>
                  Update today's attendance
                </small>

              </div>

            </button>

            <button
              onClick={() => alert("Notice module will be added next.")}
            >

              <span>
                📢
              </span>

              <div>

                <strong>
                  Create Notice
                </strong>

                <small>
                  Publish school notice
                </small>

              </div>

            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Dashboard;