import "../Style/dashboard.css";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

function Dashboard() {

  // =========================
  // FEES DATA
  // =========================

  const feeData = [
    { name: "Collected", value: 1850000 },
    { name: "Pending", value: 2650000 },
  ];

  const FEE_COLORS = ["#22c55e", "#e5e7eb"];


  // =========================
  // ATTENDANCE DATA
  // =========================

  const attendanceData = [
    { name: "Present", value: 92 },
    { name: "Absent", value: 6 },
    { name: "Leave", value: 2 },
  ];

  const ATTENDANCE_COLORS = [
    "#22c55e",
    "#ef4444",
    "#f59e0b",
  ];


  return (
    <div className="dashboard-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="dashboard-header">

        <div>

          <span className="dashboard-label">
            SCHOOL ADMINISTRATION
          </span>

          <h1>
            Good Morning, Admin 👋
          </h1>

          <p>
            MPSA School Management System
          </p>

        </div>


        <div className="dashboard-date">

          <span>📅</span>

          <div>

            <small>Today</small>

            <strong>
              14 August 2026
            </strong>

          </div>

        </div>

      </div>


      {/* =========================
          STAT CARDS
      ========================= */}

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
              100
            </h2>

            <small className="positive">
              ↗ +8 this month
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
              18
            </h2>

            <small className="positive">
              ↗ 2 new teachers
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
              ↗ +12% this month
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


      {/* =========================
          ATTENDANCE + FEES
      ========================= */}

      <div className="dashboard-grid">


        {/* =========================
            ATTENDANCE
        ========================= */}

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


            <button className="panel-btn">
              View Details
            </button>

          </div>


          <div className="attendance-box">


            {/* ATTENDANCE CHART */}

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
                      `${value} students`
                    }
                  />

                </PieChart>

              </ResponsiveContainer>


              {/* CENTER TEXT */}

              <div className="attendance-chart-center">

                <strong>
                  92%
                </strong>

                <span>
                  Present
                </span>

              </div>

            </div>


            {/* ATTENDANCE DETAILS */}

            <div className="attendance-details">


              {/* PRESENT */}

              <div className="attendance-item">

                <span className="dot present"></span>

                <div>

                  <p>
                    Present
                  </p>

                  <strong>
                    92
                  </strong>

                </div>

              </div>


              {/* ABSENT */}

              <div className="attendance-item">

                <span className="dot absent"></span>

                <div>

                  <p>
                    Absent
                  </p>

                  <strong>
                    6
                  </strong>

                </div>

              </div>


              {/* LEAVE */}

              <div className="attendance-item">

                <span className="dot leave"></span>

                <div>

                  <p>
                    Leave
                  </p>

                  <strong>
                    2
                  </strong>

                </div>

              </div>


            </div>

          </div>

        </div>


        {/* =========================
            FEES
        ========================= */}

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


            <button className="panel-btn">
              View Fees
            </button>

          </div>


          <div className="fee-chart-section">


            {/* PIE CHART */}

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


              {/* CENTER TEXT */}

              <div className="fee-pie-center">

                <strong>
                  41%
                </strong>

                <span>
                  Collected
                </span>

              </div>

            </div>


            {/* FEE DETAILS */}

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


          {/* PROGRESS */}

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


      {/* =========================
          RECENT STUDENTS + QUICK ACTIONS
      ========================= */}

      <div className="dashboard-grid">


        {/* RECENT STUDENTS */}

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


            <button className="panel-btn">
              View All
            </button>

          </div>


          <div className="recent-list">


            <div className="recent-item">

              <div className="avatar">
                RS
              </div>

              <div className="student-info">

                <strong>
                  Rahul Sharma
                </strong>

                <span>
                  Class 10-A • Roll 21
                </span>

              </div>

              <small>
                Today
              </small>

            </div>


            <div className="recent-item">

              <div className="avatar">
                AS
              </div>

              <div className="student-info">

                <strong>
                  Aman Singh
                </strong>

                <span>
                  Class 10-A • Roll 22
                </span>

              </div>

              <small>
                Yesterday
              </small>

            </div>


            <div className="recent-item">

              <div className="avatar">
                RK
              </div>

              <div className="student-info">

                <strong>
                  Rohit Kumar
                </strong>

                <span>
                  Class 9-B • Roll 14
                </span>

              </div>

              <small>
                12 Aug
              </small>

            </div>


          </div>

        </div>


        {/* QUICK ACTIONS */}

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


            <button>

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


            <button>

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


            <button>

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


            <button>

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