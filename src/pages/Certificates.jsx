import "../Style/Certificates.css";

function Certificates() {
  return (
    <div className="certificates-page">

      <div className="certificates-header">
        <div>
          <h1>📄 Certificates</h1>

          <p>
            Create, manage and issue student certificates.
          </p>
        </div>

        <button className="certificate-add-btn">
          + Create Certificate
        </button>
      </div>


      <div className="certificate-stats">

        <div className="certificate-stat-card">
          <div className="certificate-stat-icon">
            📄
          </div>

          <div>
            <span>Total Certificates</span>
            <strong>128</strong>
          </div>
        </div>


        <div className="certificate-stat-card">
          <div className="certificate-stat-icon">
            🎓
          </div>

          <div>
            <span>Issued</span>
            <strong>115</strong>
          </div>
        </div>


        <div className="certificate-stat-card">
          <div className="certificate-stat-icon">
            ⏳
          </div>

          <div>
            <span>Pending</span>
            <strong>13</strong>
          </div>
        </div>

      </div>


      <div className="certificates-card">

        <div className="certificates-card-header">
          <div>
            <h2>Certificate Records</h2>
            <p>Recently created certificates</p>
          </div>

          <input
            type="text"
            placeholder="Search certificate..."
            className="certificate-search"
          />
        </div>


        <div className="certificate-table-wrapper">

          <table className="certificate-table">

            <thead>
              <tr>
                <th>Student</th>
                <th>Class</th>
                <th>Certificate</th>
                <th>Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              <tr>
                <td>
                  <strong>Rahul Sharma</strong>
                </td>

                <td>10-A</td>

                <td>Transfer Certificate</td>

                <td>22 Aug 2026</td>

                <td>
                  <span className="certificate-status issued">
                    Issued
                  </span>
                </td>

                <td>
                  <button className="certificate-view-btn">
                    View
                  </button>
                </td>
              </tr>


              <tr>
                <td>
                  <strong>Priya Singh</strong>
                </td>

                <td>12-B</td>

                <td>Character Certificate</td>

                <td>21 Aug 2026</td>

                <td>
                  <span className="certificate-status issued">
                    Issued
                  </span>
                </td>

                <td>
                  <button className="certificate-view-btn">
                    View
                  </button>
                </td>
              </tr>


              <tr>
                <td>
                  <strong>Aman Verma</strong>
                </td>

                <td>8-A</td>

                <td>Bonafide Certificate</td>

                <td>20 Aug 2026</td>

                <td>
                  <span className="certificate-status pending">
                    Pending
                  </span>
                </td>

                <td>
                  <button className="certificate-view-btn">
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

export default Certificates;