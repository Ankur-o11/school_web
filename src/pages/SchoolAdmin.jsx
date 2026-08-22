import "../Style/school-admin.css";

function SchoolAdmin() {
  return (
    <div className="school-admin-page">

      {/* HEADER */}

      <div className="admin-header">

        <div>
          <p className="admin-small-title">
            ADMINISTRATION
          </p>

          <h1>School Admin</h1>

          <p className="admin-subtitle">
            Manage your entire school from one place.
          </p>
        </div>

        <div className="admin-header-right">
          <div className="admin-date">
            📅 Today
          </div>

          <div className="admin-user">
            <div className="admin-user-avatar">
              A
            </div>

            <div>
              <strong>School Admin</strong>
              <span>Administrator</span>
            </div>
          </div>
        </div>

      </div>


      {/* QUICK STATS */}

      <div className="admin-stats">

        <div className="admin-stat-card">
          <div className="stat-icon blue">
            👨‍🎓
          </div>

          <div>
            <span>Total Students</span>
            <h2>1,240</h2>
            <small>↑ 8% this month</small>
          </div>
        </div>


        <div className="admin-stat-card">
          <div className="stat-icon purple">
            👨‍🏫
          </div>

          <div>
            <span>Total Teachers</span>
            <h2>68</h2>
            <small>↑ 4% this month</small>
          </div>
        </div>


        <div className="admin-stat-card">
          <div className="stat-icon green">
            💰
          </div>

          <div>
            <span>Fees Collected</span>
            <h2>₹8.4L</h2>
            <small>82% collected</small>
          </div>
        </div>


        <div className="admin-stat-card">
          <div className="stat-icon orange">
            📅
          </div>

          <div>
            <span>Attendance</span>
            <h2>91.4%</h2>
            <small>↑ 2.3% this week</small>
          </div>
        </div>

      </div>


      {/* QUICK ACTIONS */}

      <div className="admin-section">

        <div className="section-heading">
          <div>
            <h2>Quick Actions</h2>
            <p>Frequently used school management tools</p>
          </div>
        </div>


        <div className="quick-actions">

          <div className="action-card">
            <div className="action-icon">
              👨‍🎓
            </div>

            <div>
              <h3>Students</h3>
              <p>Manage student records</p>
            </div>

            <span>→</span>
          </div>


          <div className="action-card">
            <div className="action-icon">
              👨‍🏫
            </div>

            <div>
              <h3>Teachers</h3>
              <p>Manage teaching staff</p>
            </div>

            <span>→</span>
          </div>


          <div className="action-card">
            <div className="action-icon">
              🎓
            </div>

            <div>
              <h3>Admissions</h3>
              <p>Manage new admissions</p>
            </div>

            <span>→</span>
          </div>


          <div className="action-card">
            <div className="action-icon">
              📝
            </div>

            <div>
              <h3>Results</h3>
              <p>Manage exam results</p>
            </div>

            <span>→</span>
          </div>


          <div className="action-card">
            <div className="action-icon">
              💰
            </div>

            <div>
              <h3>Fees</h3>
              <p>Track fee payments</p>
            </div>

            <span>→</span>
          </div>


          <div className="action-card">
            <div className="action-icon">
              📢
            </div>

            <div>
              <h3>Notices</h3>
              <p>Publish school notices</p>
            </div>

            <span>→</span>
          </div>

        </div>

      </div>


      {/* LOWER SECTION */}

      <div className="admin-grid">


        {/* RECENT ACTIVITY */}

        <div className="admin-panel">

          <div className="panel-header">
            <div>
              <h2>Recent Activity</h2>
              <p>Latest actions in the school</p>
            </div>

            <button>
              View All
            </button>
          </div>


          <div className="activity-list">

            <div className="activity-item">
              <div className="activity-avatar blue-bg">
                👨‍🎓
              </div>

              <div>
                <strong>New student admitted</strong>
                <span>Rahul Sharma joined Class 10-A</span>
              </div>

              <small>10 min ago</small>
            </div>


            <div className="activity-item">
              <div className="activity-avatar purple-bg">
                👨‍🏫
              </div>

              <div>
                <strong>Teacher added</strong>
                <span>Neha Singh added to Mathematics</span>
              </div>

              <small>35 min ago</small>
            </div>


            <div className="activity-item">
              <div className="activity-avatar green-bg">
                💰
              </div>

              <div>
                <strong>Fee payment received</strong>
                <span>₹12,500 received from Aman Kumar</span>
              </div>

              <small>1 hour ago</small>
            </div>


            <div className="activity-item">
              <div className="activity-avatar orange-bg">
                📢
              </div>

              <div>
                <strong>New notice published</strong>
                <span>Independence Day holiday notice</span>
              </div>

              <small>2 hours ago</small>
            </div>

          </div>

        </div>


        {/* SCHOOL OVERVIEW */}

        <div className="admin-panel">

          <div className="panel-header">
            <div>
              <h2>School Overview</h2>
              <p>Current academic session</p>
            </div>
          </div>


          <div className="overview-item">
            <span>Academic Session</span>
            <strong>2026 - 27</strong>
          </div>

          <div className="overview-item">
            <span>Total Classes</span>
            <strong>42</strong>
          </div>

          <div className="overview-item">
            <span>Total Subjects</span>
            <strong>38</strong>
          </div>

          <div className="overview-item">
            <span>School Strength</span>
            <strong>1,308</strong>
          </div>

          <div className="overview-item">
            <span>Staff Members</span>
            <strong>86</strong>
          </div>


          <div className="overview-progress">

            <div className="progress-heading">
              <span>Fee Collection</span>
              <strong>82%</strong>
            </div>

            <div className="progress-bar">
              <div></div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default SchoolAdmin;