import "../Style/Settings.css";

function Settings() {
  return (
    <div className="settings-page">

      {/* HEADER */}
      <div className="settings-header">
        <div>
          <h1>⚙️ Settings</h1>
          <p>
            Manage school system settings and preferences.
          </p>
        </div>
      </div>


      {/* SETTINGS GRID */}
      <div className="settings-grid">

        {/* SCHOOL SETTINGS */}
        <div className="settings-card">

          <div className="settings-card-icon">
            🏫
          </div>

          <div className="settings-card-content">
            <h2>School Information</h2>

            <p>
              Manage school name, address, contact details and other
              basic information.
            </p>

            <button>
              Manage Settings →
            </button>
          </div>

        </div>


        {/* ACADEMIC SETTINGS */}
        <div className="settings-card">

          <div className="settings-card-icon">
            📚
          </div>

          <div className="settings-card-content">
            <h2>Academic Settings</h2>

            <p>
              Manage academic session, classes, sections and grading
              configuration.
            </p>

            <button>
              Manage Settings →
            </button>
          </div>

        </div>


        {/* NOTIFICATION SETTINGS */}
        <div className="settings-card">

          <div className="settings-card-icon">
            🔔
          </div>

          <div className="settings-card-content">
            <h2>Notification Settings</h2>

            <p>
              Configure notifications, alerts and communication
              preferences.
            </p>

            <button>
              Manage Settings →
            </button>
          </div>

        </div>


        {/* USER SETTINGS */}
        <div className="settings-card">

          <div className="settings-card-icon">
            👤
          </div>

          <div className="settings-card-content">
            <h2>User Settings</h2>

            <p>
              Manage administrator accounts, passwords and user
              preferences.
            </p>

            <button>
              Manage Settings →
            </button>
          </div>

        </div>


        {/* SECURITY */}
        <div className="settings-card">

          <div className="settings-card-icon">
            🔐
          </div>

          <div className="settings-card-content">
            <h2>Security</h2>

            <p>
              Manage login security, permissions and account protection.
            </p>

            <button>
              Manage Settings →
            </button>
          </div>

        </div>


        {/* SYSTEM SETTINGS */}
        <div className="settings-card">

          <div className="settings-card-icon">
            🖥️
          </div>

          <div className="settings-card-content">
            <h2>System Settings</h2>

            <p>
              Manage system preferences, backup and application
              configuration.
            </p>

            <button>
              Manage Settings →
            </button>
          </div>

        </div>

      </div>


      {/* SCHOOL STATUS */}
      <div className="settings-status">

        <div>
          <h2>System Status</h2>

          <p>
            Your school management system is running normally.
          </p>
        </div>

        <span className="system-online">
          ● Online
        </span>

      </div>

    </div>
  );
}

export default Settings;