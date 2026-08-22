import "../Style/Parents.css";

function Parents() {
  return (
    <div className="parents-page">

      <div className="parents-header">
        <div>
          <h1>👨‍👩‍👧 Parents</h1>
          <p>Manage student parents and guardians.</p>
        </div>

        <button className="parents-add-btn">
          + Add Parent
        </button>
      </div>


      <div className="parents-stats">

        <div className="parents-stat-card">
          <div className="parents-stat-icon">👨‍👩‍👧</div>
          <div>
            <span>Total Parents</span>
            <strong>850</strong>
          </div>
        </div>

        <div className="parents-stat-card">
          <div className="parents-stat-icon">👨</div>
          <div>
            <span>Fathers</span>
            <strong>520</strong>
          </div>
        </div>

        <div className="parents-stat-card">
          <div className="parents-stat-icon">👩</div>
          <div>
            <span>Mothers</span>
            <strong>310</strong>
          </div>
        </div>

        <div className="parents-stat-card">
          <div className="parents-stat-icon">👥</div>
          <div>
            <span>Guardians</span>
            <strong>20</strong>
          </div>
        </div>

      </div>


      <div className="parents-card">

        <div className="parents-card-header">

          <div>
            <h2>Parent Directory</h2>
            <p>View and manage registered parents.</p>
          </div>

          <input
            className="parents-search"
            type="text"
            placeholder="Search parent..."
          />

        </div>


        <div className="parents-table-wrapper">

          <table className="parents-table">

            <thead>
              <tr>
                <th>Parent</th>
                <th>Student</th>
                <th>Class</th>
                <th>Contact</th>
                <th>Relation</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              <tr>
                <td>
                  <div className="parent-person">
                    <div className="parent-avatar">R</div>
                    <strong>Rajesh Kumar</strong>
                  </div>
                </td>

                <td>Aarav Kumar</td>
                <td>10-A</td>
                <td>9876543210</td>
                <td>Father</td>

                <td>
                  <span className="parent-active">
                    Active
                  </span>
                </td>

                <td>
                  <button className="parent-view-btn">
                    View
                  </button>

                  <button className="parent-edit-btn">
                    Edit
                  </button>
                </td>
              </tr>


              <tr>
                <td>
                  <div className="parent-person">
                    <div className="parent-avatar">S</div>
                    <strong>Sunita Sharma</strong>
                  </div>
                </td>

                <td>Ananya Sharma</td>
                <td>9-B</td>
                <td>9876501234</td>
                <td>Mother</td>

                <td>
                  <span className="parent-active">
                    Active
                  </span>
                </td>

                <td>
                  <button className="parent-view-btn">
                    View
                  </button>

                  <button className="parent-edit-btn">
                    Edit
                  </button>
                </td>
              </tr>


              <tr>
                <td>
                  <div className="parent-person">
                    <div className="parent-avatar">A</div>
                    <strong>Amit Singh</strong>
                  </div>
                </td>

                <td>Rohan Singh</td>
                <td>8-A</td>
                <td>9812345678</td>
                <td>Father</td>

                <td>
                  <span className="parent-active">
                    Active
                  </span>
                </td>

                <td>
                  <button className="parent-view-btn">
                    View
                  </button>

                  <button className="parent-edit-btn">
                    Edit
                  </button>
                </td>
              </tr>


              <tr>
                <td>
                  <div className="parent-person">
                    <div className="parent-avatar">P</div>
                    <strong>Pooja Verma</strong>
                  </div>
                </td>

                <td>Priya Verma</td>
                <td>7-B</td>
                <td>9898765432</td>
                <td>Mother</td>

                <td>
                  <span className="parent-active">
                    Active
                  </span>
                </td>

                <td>
                  <button className="parent-view-btn">
                    View
                  </button>

                  <button className="parent-edit-btn">
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

export default Parents;