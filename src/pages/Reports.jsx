import "../Style/Reports.css";

function Reports() {
  return (
    <div className="reports-page">

      {/* HEADER */}

      <div className="reports-header">

        <div>
          <h1>📊 Reports</h1>

          <p>
            View and manage school reports and performance data.
          </p>
        </div>

        <button className="reports-export-btn">
          ⬇ Export Report
        </button>

      </div>


      {/* STATISTICS */}

      <div className="reports-stats">

        <div className="report-stat-card">
          <div className="report-stat-icon">
            👨‍🎓
          </div>

          <div>
            <span>Total Students</span>
            <strong>1,250</strong>
          </div>
        </div>


        <div className="report-stat-card">
          <div className="report-stat-icon">
            👨‍🏫
          </div>

          <div>
            <span>Total Teachers</span>
            <strong>68</strong>
          </div>
        </div>


        <div className="report-stat-card">
          <div className="report-stat-icon">
            📈
          </div>

          <div>
            <span>Average Result</span>
            <strong>82%</strong>
          </div>
        </div>


        <div className="report-stat-card">
          <div className="report-stat-icon">
            💰
          </div>

          <div>
            <span>Fee Collection</span>
            <strong>₹18.5L</strong>
          </div>
        </div>

      </div>


      {/* REPORT CARDS */}

      <div className="reports-grid">

        <div className="report-card">

          <div className="report-card-icon">
            👨‍🎓
          </div>

          <div className="report-card-content">

            <h2>Student Report</h2>

            <p>
              View student admission, attendance and academic information.
            </p>

            <button>
              View Report →
            </button>

          </div>

        </div>


        <div className="report-card">

          <div className="report-card-icon">
            👨‍🏫
          </div>

          <div className="report-card-content">

            <h2>Teacher Report</h2>

            <p>
              View teacher details, attendance and salary information.
            </p>

            <button>
              View Report →
            </button>

          </div>

        </div>


        <div className="report-card">

          <div className="report-card-icon">
            📅
          </div>

          <div className="report-card-content">

            <h2>Attendance Report</h2>

            <p>
              Check student and teacher attendance reports.
            </p>

            <button>
              View Report →
            </button>

          </div>

        </div>


        <div className="report-card">

          <div className="report-card-icon">
            💰
          </div>

          <div className="report-card-content">

            <h2>Fee Report</h2>

            <p>
              View collected fees, pending fees and payment history.
            </p>

            <button>
              View Report →
            </button>

          </div>

        </div>


        <div className="report-card">

          <div className="report-card-icon">
            📝
          </div>

          <div className="report-card-content">

            <h2>Result Report</h2>

            <p>
              Analyze examination results and student performance.
            </p>

            <button>
              View Report →
            </button>

          </div>

        </div>


        <div className="report-card">

          <div className="report-card-icon">
            🗓️
          </div>

          <div className="report-card-content">

            <h2>Timetable Report</h2>

            <p>
              View class-wise and teacher-wise timetable information.
            </p>

            <button>
              View Report →
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Reports;