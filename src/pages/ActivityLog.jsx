import "../Style/ActivityLog.css";

function ActivityLog() {
  return (
    <div className="activity-log-page">

      <div className="activity-log-header">

        <div>
          <h1>📜 Activity Log</h1>

          <p>
            Track all important activities performed in the school ERP.
          </p>
        </div>

      </div>


      <div className="activity-log-card">

        <div className="activity-item">

          <div className="activity-icon">
            👨‍💼
          </div>

          <div className="activity-content">

            <h3>School Admin logged in</h3>

            <p>
              Administrator logged into the school management system.
            </p>

            <span>
              Today • 10:30 AM
            </span>

          </div>

        </div>


        <div className="activity-item">

          <div className="activity-icon">
            👨‍🎓
          </div>

          <div className="activity-content">

            <h3>Student added</h3>

            <p>
              A new student record was added to the student database.
            </p>

            <span>
              Today • 09:45 AM
            </span>

          </div>

        </div>


        <div className="activity-item">

          <div className="activity-icon">
            👨‍🏫
          </div>

          <div className="activity-content">

            <h3>Teacher information updated</h3>

            <p>
              Teacher information was updated by School Admin.
            </p>

            <span>
              Yesterday • 04:20 PM
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default ActivityLog;