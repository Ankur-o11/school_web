import "../Style/Transport.css";

function Transport() {
  return (
    <div className="transport-page">

      {/* HEADER */}
      <div className="transport-header">
        <div>
          <h1>🚌 Transport</h1>
          <p>
            Manage school buses, routes, drivers and transport services.
          </p>
        </div>

        <button className="add-vehicle-btn">
          + Add Vehicle
        </button>
      </div>


      {/* SUMMARY */}
      <div className="transport-summary">

        <div className="transport-stat-card">
          <div className="transport-stat-icon">
            🚌
          </div>

          <div>
            <span>Total Buses</span>
            <strong>12</strong>
          </div>
        </div>


        <div className="transport-stat-card">
          <div className="transport-stat-icon">
            🛣️
          </div>

          <div>
            <span>Active Routes</span>
            <strong>10</strong>
          </div>
        </div>


        <div className="transport-stat-card">
          <div className="transport-stat-icon">
            👨‍✈️
          </div>

          <div>
            <span>Drivers</span>
            <strong>12</strong>
          </div>
        </div>


        <div className="transport-stat-card">
          <div className="transport-stat-icon">
            👨‍🎓
          </div>

          <div>
            <span>Students Using Transport</span>
            <strong>386</strong>
          </div>
        </div>

      </div>


      {/* VEHICLES */}
      <div className="transport-card">

        <div className="transport-card-header">

          <div>
            <h2>School Vehicles</h2>
            <p>
              Manage all school transport vehicles.
            </p>
          </div>

          <input
            type="text"
            placeholder="Search vehicle..."
            className="transport-search"
          />

        </div>


        <div className="transport-table-wrapper">

          <table className="transport-table">

            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Vehicle No.</th>
                <th>Driver</th>
                <th>Route</th>
                <th>Students</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>


            <tbody>

              <tr>
                <td>
                  <strong>School Bus 01</strong>
                  <small>Bus</small>
                </td>

                <td>UP14 AB 1021</td>

                <td>Rajesh Kumar</td>

                <td>Route 01</td>

                <td>42</td>

                <td>
                  <span className="transport-active">
                    Active
                  </span>
                </td>

                <td>
                  <button className="transport-edit-btn">
                    Edit
                  </button>
                </td>
              </tr>


              <tr>
                <td>
                  <strong>School Bus 02</strong>
                  <small>Bus</small>
                </td>

                <td>UP14 AB 1022</td>

                <td>Sunil Sharma</td>

                <td>Route 02</td>

                <td>38</td>

                <td>
                  <span className="transport-active">
                    Active
                  </span>
                </td>

                <td>
                  <button className="transport-edit-btn">
                    Edit
                  </button>
                </td>
              </tr>


              <tr>
                <td>
                  <strong>School Bus 03</strong>
                  <small>Bus</small>
                </td>

                <td>UP14 AB 1023</td>

                <td>Amit Singh</td>

                <td>Route 03</td>

                <td>35</td>

                <td>
                  <span className="transport-active">
                    Active
                  </span>
                </td>

                <td>
                  <button className="transport-edit-btn">
                    Edit
                  </button>
                </td>
              </tr>


              <tr>
                <td>
                  <strong>School Bus 04</strong>
                  <small>Bus</small>
                </td>

                <td>UP14 AB 1024</td>

                <td>Vijay Yadav</td>

                <td>Route 04</td>

                <td>41</td>

                <td>
                  <span className="transport-maintenance">
                    Maintenance
                  </span>
                </td>

                <td>
                  <button className="transport-edit-btn">
                    Edit
                  </button>
                </td>
              </tr>


              <tr>
                <td>
                  <strong>School Bus 05</strong>
                  <small>Bus</small>
                </td>

                <td>UP14 AB 1025</td>

                <td>Rakesh Verma</td>

                <td>Route 05</td>

                <td>36</td>

                <td>
                  <span className="transport-active">
                    Active
                  </span>
                </td>

                <td>
                  <button className="transport-edit-btn">
                    Edit
                  </button>
                </td>
              </tr>

            </tbody>

          </table>

        </div>

      </div>


      {/* ROUTES */}

      <div className="transport-routes">

        <div className="route-card">
          <div className="route-icon">🛣️</div>

          <div>
            <h3>Route 01</h3>
            <p>Delhi Gate → MPSA School</p>
            <span>42 Students</span>
          </div>
        </div>


        <div className="route-card">
          <div className="route-icon">🛣️</div>

          <div>
            <h3>Route 02</h3>
            <p>Shastri Nagar → MPSA School</p>
            <span>38 Students</span>
          </div>
        </div>


        <div className="route-card">
          <div className="route-icon">🛣️</div>

          <div>
            <h3>Route 03</h3>
            <p>Raj Nagar → MPSA School</p>
            <span>35 Students</span>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Transport;