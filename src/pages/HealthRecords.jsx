import "../Style/HealthRecords.css";

function HealthRecords() {
  return (
    <div className="health-records-page">

      <div className="health-header">
        <div>
          <h1>🏥 Health Records</h1>
          <p>
            Manage student health records and medical information.
          </p>
        </div>

        <button className="health-add-btn">
          + Add Record
        </button>
      </div>


      <div className="health-stats">

        <div className="health-stat-card">
          <div className="health-stat-icon">
            👨‍🎓
          </div>

          <div>
            <span>Total Records</span>
            <strong>850</strong>
          </div>
        </div>


        <div className="health-stat-card">
          <div className="health-stat-icon">
            ❤️
          </div>

          <div>
            <span>Healthy Students</span>
            <strong>820</strong>
          </div>
        </div>


        <div className="health-stat-card">
          <div className="health-stat-icon">
            🩺
          </div>

          <div>
            <span>Medical Cases</span>
            <strong>30</strong>
          </div>
        </div>

      </div>


      <div className="health-card">

        <div className="health-card-header">
          <div>
            <h2>Student Health Records</h2>
            <p>
              Recently updated health information
            </p>
          </div>

          <input
            type="text"
            placeholder="Search student..."
            className="health-search"
          />
        </div>


        <div className="health-table-wrapper">

          <table className="health-table">

            <thead>
              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Blood Group</th>
                <th>Height</th>
                <th>Weight</th>
                <th>Health Status</th>
                <th>Action</th>
              </tr>
            </thead>


            <tbody>

              <tr>
                <td>
                  <strong>Rahul Sharma</strong>
                </td>

                <td>10-A</td>

                <td>B+</td>

                <td>165 cm</td>

                <td>55 kg</td>

                <td>
                  <span className="health-status healthy">
                    Healthy
                  </span>
                </td>

                <td>
                  <button className="health-view-btn">
                    View
                  </button>
                </td>
              </tr>


              <tr>
                <td>
                  <strong>Priya Singh</strong>
                </td>

                <td>12-B</td>

                <td>O+</td>

                <td>160 cm</td>

                <td>50 kg</td>

                <td>
                  <span className="health-status healthy">
                    Healthy
                  </span>
                </td>

                <td>
                  <button className="health-view-btn">
                    View
                  </button>
                </td>
              </tr>


              <tr>
                <td>
                  <strong>Aman Verma</strong>
                </td>

                <td>8-A</td>

                <td>A+</td>

                <td>145 cm</td>

                <td>42 kg</td>

                <td>
                  <span className="health-status attention">
                    Attention
                  </span>
                </td>

                <td>
                  <button className="health-view-btn">
                    View
                  </button>
                </td>
              </tr>


              <tr>
                <td>
                  <strong>Neha Gupta</strong>
                </td>

                <td>9-B</td>

                <td>AB+</td>

                <td>152 cm</td>

                <td>46 kg</td>

                <td>
                  <span className="health-status healthy">
                    Healthy
                  </span>
                </td>

                <td>
                  <button className="health-view-btn">
                    View
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

export default HealthRecords;