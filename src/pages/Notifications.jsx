import "../Style/Notifications.css";

function Notifications() {
  return (
    <div className="notifications-page">

      <div className="notifications-header">
        <div>
          <h1>🔔 Notifications</h1>
          <p>
            Manage school notifications and important updates.
          </p>
        </div>

        <button className="notifications-add-btn">
          + New Notification
        </button>
      </div>


      <div className="notifications-stats">

        <div className="notification-stat-card">
          <div className="notification-stat-icon">
            🔔
          </div>

          <div>
            <span>Total Notifications</span>
            <strong>48</strong>
          </div>
        </div>


        <div className="notification-stat-card">
          <div className="notification-stat-icon">
            📢
          </div>

          <div>
            <span>Announcements</span>
            <strong>18</strong>
          </div>
        </div>


        <div className="notification-stat-card">
          <div className="notification-stat-icon">
            👨‍🎓
          </div>

          <div>
            <span>Student Updates</span>
            <strong>16</strong>
          </div>
        </div>


        <div className="notification-stat-card">
          <div className="notification-stat-icon">
            👨‍🏫
          </div>

          <div>
            <span>Staff Updates</span>
            <strong>14</strong>
          </div>
        </div>

      </div>


      <div className="notifications-card">

        <div className="notifications-card-header">

          <div>
            <h2>Recent Notifications</h2>
            <p>
              Latest notifications sent by school administration.
            </p>
          </div>

          <input
            type="text"
            placeholder="Search notifications..."
            className="notifications-search"
          />

        </div>


        <div className="notifications-list">

          <div className="notification-item">

            <div className="notification-icon">
              📢
            </div>

            <div className="notification-content">

              <h3>Parent-Teacher Meeting</h3>

              <p>
                Parent-teacher meeting will be held on Saturday.
              </p>

              <span>
                22 Aug 2026 • 10:30 AM
              </span>

            </div>

            <button className="notification-view-btn">
              View
            </button>

          </div>


          <div className="notification-item">

            <div className="notification-icon">
              📅
            </div>

            <div className="notification-content">

              <h3>Exam Schedule Released</h3>

              <p>
                The upcoming examination schedule has been published.
              </p>

              <span>
                21 Aug 2026 • 02:15 PM
              </span>

            </div>

            <button className="notification-view-btn">
              View
            </button>

          </div>


          <div className="notification-item">

            <div className="notification-icon">
              🏆
            </div>

            <div className="notification-content">

              <h3>Annual Sports Day</h3>

              <p>
                Students are requested to register for sports activities.
              </p>

              <span>
                20 Aug 2026 • 11:00 AM
              </span>

            </div>

            <button className="notification-view-btn">
              View
            </button>

          </div>


          <div className="notification-item">

            <div className="notification-icon">
              💰
            </div>

            <div className="notification-content">

              <h3>Fee Payment Reminder</h3>

              <p>
                Parents are requested to clear pending school fees.
              </p>

              <span>
                19 Aug 2026 • 09:20 AM
              </span>

            </div>

            <button className="notification-view-btn">
              View
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Notifications;