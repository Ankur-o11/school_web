import { useState } from "react";
import "../Style/Notices.css";

function Notices() {
  const [notices, setNotices] = useState([
    {
      id: 1,
      title: "Annual Examination 2026",
      category: "Examination",
      date: "25 August 2026",
      description:
        "Annual examination schedule will be available from the school office.",
      priority: "High",
    },
    {
      id: 2,
      title: "Independence Day Celebration",
      category: "Event",
      date: "15 August 2026",
      description:
        "Students are requested to participate in the Independence Day celebration.",
      priority: "Medium",
    },
    {
      id: 3,
      title: "Parent Teacher Meeting",
      category: "Meeting",
      date: "30 August 2026",
      description:
        "Parent Teacher Meeting will be conducted in the school campus.",
      priority: "Normal",
    },
  ]);

  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    category: "General",
    date: "",
    description: "",
    priority: "Normal",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addNotice = (e) => {
    e.preventDefault();

    if (!formData.title || !formData.date || !formData.description) {
      alert("Please fill all required fields.");
      return;
    }

    const newNotice = {
      id: Date.now(),
      ...formData,
    };

    setNotices([newNotice, ...notices]);

    setFormData({
      title: "",
      category: "General",
      date: "",
      description: "",
      priority: "Normal",
    });

    setShowForm(false);
  };

  const deleteNotice = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this notice?"
    );

    if (confirmDelete) {
      setNotices(notices.filter((notice) => notice.id !== id));
    }
  };

  return (
    <div className="notices-page">

      {/* HEADER */}

      <div className="notices-header">

        <div className="notices-title">

          <div className="notices-icon">
            📢
          </div>

          <div>
            <h1>Notices</h1>

            <p>
              Create and manage important school notices.
            </p>
          </div>

        </div>


        <button
          className="add-notice-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "✕ Close" : "+ Add Notice"}
        </button>

      </div>


      {/* STATISTICS */}

      <div className="notice-stats">

        <div className="notice-stat-card">
          <div className="stat-icon blue">
            📢
          </div>

          <div>
            <span>Total Notices</span>
            <strong>{notices.length}</strong>
          </div>
        </div>


        <div className="notice-stat-card">
          <div className="stat-icon orange">
            ⚠️
          </div>

          <div>
            <span>High Priority</span>

            <strong>
              {
                notices.filter(
                  (notice) => notice.priority === "High"
                ).length
              }
            </strong>
          </div>
        </div>


        <div className="notice-stat-card">
          <div className="stat-icon green">
            📅
          </div>

          <div>
            <span>Upcoming</span>

            <strong>
              {
                notices.filter(
                  (notice) => notice.date
                ).length
              }
            </strong>
          </div>
        </div>

      </div>


      {/* ADD NOTICE FORM */}

      {showForm && (
        <div className="notice-form-card">

          <h2>
            Create New Notice
          </h2>

          <form onSubmit={addNotice}>

            <div className="form-grid">

              <div className="form-group">
                <label>
                  Notice Title *
                </label>

                <input
                  type="text"
                  name="title"
                  placeholder="Enter notice title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </div>


              <div className="form-group">
                <label>
                  Category
                </label>

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  <option>General</option>
                  <option>Examination</option>
                  <option>Event</option>
                  <option>Meeting</option>
                  <option>Holiday</option>
                  <option>Important</option>
                </select>
              </div>


              <div className="form-group">
                <label>
                  Date *
                </label>

                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>


              <div className="form-group">
                <label>
                  Priority
                </label>

                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                >
                  <option>Normal</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>

            </div>


            <div className="form-group">
              <label>
                Description *
              </label>

              <textarea
                name="description"
                placeholder="Write notice details..."
                value={formData.description}
                onChange={handleChange}
                rows="4"
              />
            </div>


            <div className="form-actions">

              <button
                type="button"
                className="cancel-btn"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button
                type="submit"
                className="save-notice-btn"
              >
                Save Notice
              </button>

            </div>

          </form>

        </div>
      )}


      {/* NOTICE LIST */}

      <div className="notice-list-card">

        <div className="list-header">

          <div>
            <h2>
              All Notices
            </h2>

            <p>
              {notices.length} notices available
            </p>
          </div>

        </div>


        <div className="notice-list">

          {notices.length === 0 ? (

            <div className="empty-notices">
              <span>📭</span>
              <h3>No Notices Found</h3>
              <p>
                Create your first school notice.
              </p>
            </div>

          ) : (

            notices.map((notice) => (

              <div
                className="notice-item"
                key={notice.id}
              >

                <div className="notice-main">

                  <div className="notice-item-icon">
                    📢
                  </div>


                  <div className="notice-content">

                    <div className="notice-item-top">

                      <h3>
                        {notice.title}
                      </h3>

                      <span
                        className={`priority-badge ${notice.priority.toLowerCase()}`}
                      >
                        {notice.priority}
                      </span>

                    </div>


                    <div className="notice-meta">

                      <span>
                        📁 {notice.category}
                      </span>

                      <span>
                        📅 {notice.date}
                      </span>

                    </div>


                    <p>
                      {notice.description}
                    </p>

                  </div>

                </div>


                <button
                  className="delete-notice-btn"
                  onClick={() => deleteNotice(notice.id)}
                  title="Delete Notice"
                >
                  🗑️
                </button>

              </div>

            ))

          )}

        </div>

      </div>

    </div>
  );
}

export default Notices;