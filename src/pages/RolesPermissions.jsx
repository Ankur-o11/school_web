import "../Style/RolesPermissions.css";

function RolesPermissions() {
  return (
    <div className="roles-page">

      {/* HEADER */}
      <div className="roles-header">
        <div>
          <h1>🔐 Roles & Permissions</h1>
          <p>
            Manage user roles and control access to different school modules.
          </p>
        </div>

        <button className="add-role-btn">
          + Add New Role
        </button>
      </div>


      {/* SUMMARY */}
      <div className="roles-summary">

        <div className="role-summary-card">
          <div className="role-summary-icon">👥</div>
          <div>
            <span>Total Users</span>
            <strong>86</strong>
          </div>
        </div>

        <div className="role-summary-card">
          <div className="role-summary-icon">🔐</div>
          <div>
            <span>Total Roles</span>
            <strong>6</strong>
          </div>
        </div>

        <div className="role-summary-card">
          <div className="role-summary-icon">👨‍💼</div>
          <div>
            <span>Administrators</span>
            <strong>4</strong>
          </div>
        </div>

        <div className="role-summary-card">
          <div className="role-summary-icon">👨‍🏫</div>
          <div>
            <span>Teachers</span>
            <strong>68</strong>
          </div>
        </div>

      </div>


      {/* ROLES TABLE */}
      <div className="roles-card">

        <div className="roles-card-header">
          <div>
            <h2>System Roles</h2>
            <p>
              Manage permissions assigned to each role.
            </p>
          </div>

          <input
            type="text"
            placeholder="Search role..."
            className="role-search"
          />
        </div>


        <div className="roles-table-wrapper">

          <table className="roles-table">

            <thead>
              <tr>
                <th>Role</th>
                <th>Users</th>
                <th>Permissions</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              <tr>
                <td>
                  <strong>School Admin</strong>
                  <small>Full system access</small>
                </td>

                <td>4</td>

                <td>
                  <span className="permission-badge">
                    All Permissions
                  </span>
                </td>

                <td>
                  <span className="status-active">
                    Active
                  </span>
                </td>

                <td>
                  <button className="edit-role-btn">
                    Edit
                  </button>
                </td>
              </tr>


              <tr>
                <td>
                  <strong>Teacher</strong>
                  <small>Academic management</small>
                </td>

                <td>68</td>

                <td>
                  <span className="permission-badge">
                    18 Permissions
                  </span>
                </td>

                <td>
                  <span className="status-active">
                    Active
                  </span>
                </td>

                <td>
                  <button className="edit-role-btn">
                    Edit
                  </button>
                </td>
              </tr>


              <tr>
                <td>
                  <strong>Accountant</strong>
                  <small>Fees and finance</small>
                </td>

                <td>3</td>

                <td>
                  <span className="permission-badge">
                    12 Permissions
                  </span>
                </td>

                <td>
                  <span className="status-active">
                    Active
                  </span>
                </td>

                <td>
                  <button className="edit-role-btn">
                    Edit
                  </button>
                </td>
              </tr>


              <tr>
                <td>
                  <strong>Librarian</strong>
                  <small>Library management</small>
                </td>

                <td>2</td>

                <td>
                  <span className="permission-badge">
                    8 Permissions
                  </span>
                </td>

                <td>
                  <span className="status-active">
                    Active
                  </span>
                </td>

                <td>
                  <button className="edit-role-btn">
                    Edit
                  </button>
                </td>
              </tr>


              <tr>
                <td>
                  <strong>Receptionist</strong>
                  <small>Front office management</small>
                </td>

                <td>5</td>

                <td>
                  <span className="permission-badge">
                    10 Permissions
                  </span>
                </td>

                <td>
                  <span className="status-active">
                    Active
                  </span>
                </td>

                <td>
                  <button className="edit-role-btn">
                    Edit
                  </button>
                </td>
              </tr>


              <tr>
                <td>
                  <strong>Student</strong>
                  <small>Student portal access</small>
                </td>

                <td>4</td>

                <td>
                  <span className="permission-badge">
                    6 Permissions
                  </span>
                </td>

                <td>
                  <span className="status-active">
                    Active
                  </span>
                </td>

                <td>
                  <button className="edit-role-btn">
                    Edit
                  </button>
                </td>
              </tr>

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default RolesPermissions;