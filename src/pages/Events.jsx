import "../Style/Events.css";

function Events() {
  return (
    <div className="events-page">

      <div className="events-header">
        <div>
          <h1>🏆 Events & Activities</h1>
          <p>
            Manage school events, activities and upcoming programs.
          </p>
        </div>

        <button className="event-add-btn">
          + Add Event
        </button>
      </div>


      <div className="event-stats">

        <div className="event-stat-card">
          <div className="event-stat-icon">🏆</div>
          <div>
            <span>Total Events</span>
            <strong>24</strong>
          </div>
        </div>

        <div className="event-stat-card">
          <div className="event-stat-icon">📅</div>
          <div>
            <span>Upcoming</span>
            <strong>8</strong>
          </div>
        </div>

        <div className="event-stat-card">
          <div className="event-stat-icon">✅</div>
          <div>
            <span>Completed</span>
            <strong>16</strong>
          </div>
        </div>

      </div>


      <div className="events-card">

        <div className="events-card-header">
          <div>
            <h2>School Events</h2>
            <p>Upcoming and recent school activities</p>
          </div>

          <input
            type="text"
            placeholder="Search event..."
            className="event-search"
          />
        </div>


        <div className="event-list">

          <div className="event-item">

            <div className="event-date">
              <strong>25</strong>
              <span>AUG</span>
            </div>

            <div className="event-details">
              <h3>Annual Sports Day</h3>
              <p>
                Annual sports competition for all classes.
              </p>
              <span>📍 School Ground • 9:00 AM</span>
            </div>

            <span className="event-status upcoming">
              Upcoming
            </span>

          </div>


          <div className="event-item">

            <div className="event-date">
              <strong>30</strong>
              <span>AUG</span>
            </div>

            <div className="event-details">
              <h3>Science Exhibition</h3>
              <p>
                Students will present their science projects.
              </p>
              <span>📍 Science Block • 10:00 AM</span>
            </div>

            <span className="event-status upcoming">
              Upcoming
            </span>

          </div>


          <div className="event-item">

            <div className="event-date">
              <strong>15</strong>
              <span>AUG</span>
            </div>

            <div className="event-details">
              <h3>Independence Day Celebration</h3>
              <p>
                Cultural programs and flag hoisting ceremony.
              </p>
              <span>📍 School Auditorium • 8:00 AM</span>
            </div>

            <span className="event-status completed">
              Completed
            </span>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Events;