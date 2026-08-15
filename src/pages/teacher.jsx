import { useState } from "react";

function Teachers() {
  const emptyForm = {
    name: "",
    subject: "",
    qualification: "",
    mobile: "",
    email: "",
    joiningDate: "",
  };

  const [teachers, setTeachers] = useState([
    {
      id: 1,
      name: "Rajesh Kumar",
      subject: "Mathematics",
      qualification: "M.Sc Mathematics",
      mobile: "9876543210",
      email: "rajesh@mpsa.edu.in",
      joiningDate: "2022-04-10",
      status: "Active",
    },
    {
      id: 2,
      name: "Priya Sharma",
      subject: "Science",
      qualification: "M.Sc Physics",
      mobile: "9765432109",
      email: "priya@mpsa.edu.in",
      joiningDate: "2023-07-15",
      status: "Active",
    },
    {
      id: 3,
      name: "Amit Singh",
      subject: "English",
      qualification: "M.A English",
      mobile: "9654321078",
      email: "amit@mpsa.edu.in",
      joiningDate: "2021-06-20",
      status: "Active",
    },
  ]);

  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [viewTeacher, setViewTeacher] = useState(null);

  // INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ADD FORM
  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  // EDIT FORM
  const openEditForm = (teacher) => {
    setForm({
      name: teacher.name,
      subject: teacher.subject,
      qualification: teacher.qualification,
      mobile: teacher.mobile,
      email: teacher.email,
      joiningDate: teacher.joiningDate,
    });

    setEditingId(teacher.id);
    setShowForm(true);
  };

  // SAVE / UPDATE
  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.subject ||
      !form.qualification.trim() ||
      !form.mobile.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (editingId !== null) {
      setTeachers((previous) =>
        previous.map((teacher) =>
          teacher.id === editingId
            ? {
                ...teacher,
                ...form,
              }
            : teacher
        )
      );

      alert("Teacher updated successfully!");
    } else {
      const newTeacher = {
        id: Date.now(),
        ...form,
        status: "Active",
      };

      setTeachers((previous) => [
        ...previous,
        newTeacher,
      ]);

      alert("Teacher added successfully!");
    }

    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  // DELETE
  const deleteTeacher = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this teacher?"
    );

    if (!confirmDelete) return;

    setTeachers((previous) =>
      previous.filter(
        (teacher) => teacher.id !== id
      )
    );
  };

  // SEARCH + FILTER
  const filteredTeachers = teachers.filter(
    (teacher) => {
      const text = search.trim().toLowerCase();

      const matchesSearch =
        text === "" ||
        teacher.name.toLowerCase().includes(text) ||
        teacher.subject.toLowerCase().includes(text) ||
        teacher.qualification.toLowerCase().includes(text) ||
        teacher.mobile.includes(text);

      const matchesSubject =
        subjectFilter === "All" ||
        teacher.subject === subjectFilter;

      return matchesSearch && matchesSubject;
    }
  );

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  return (
    <div className="students-page">

      {/* HEADER */}

      <div className="page-header">

        <div>
          <h1>Teachers</h1>

          <p>
            Manage all teachers of MPSA School
          </p>
        </div>

        <button
          className="add-btn"
          onClick={openAddForm}
        >
          + Add Teacher
        </button>

      </div>

      {/* STATISTICS */}

      <div className="student-stats">

        <div className="student-stat-card">

          <span>👨‍🏫</span>

          <div>
            <p>Total Teachers</p>
            <h2>{teachers.length}</h2>
          </div>

        </div>

        <div className="student-stat-card">

          <span>🟢</span>

          <div>
            <p>Active Teachers</p>

            <h2>
              {
                teachers.filter(
                  (teacher) =>
                    teacher.status === "Active"
                ).length
              }
            </h2>
          </div>

        </div>

        <div className="student-stat-card">

          <span>📚</span>

          <div>
            <p>Subjects</p>

            <h2>
              {
                new Set(
                  teachers.map(
                    (teacher) =>
                      teacher.subject
                  )
                ).size
              }
            </h2>
          </div>

        </div>

      </div>

      {/* SEARCH */}

      <div className="student-tools">

        <input
          type="text"
          placeholder="Search teacher, subject or mobile..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={subjectFilter}
          onChange={(e) =>
            setSubjectFilter(e.target.value)
          }
        >

          <option value="All">
            All Subjects
          </option>

          <option value="Mathematics">
            Mathematics
          </option>

          <option value="Science">
            Science
          </option>

          <option value="English">
            English
          </option>

          <option value="Hindi">
            Hindi
          </option>

          <option value="Computer">
            Computer
          </option>

        </select>

      </div>

      <div
        style={{
          marginBottom: "12px",
          color: "#6b7280",
          fontSize: "14px",
        }}
      >
        Showing {filteredTeachers.length} of{" "}
        {teachers.length} teachers
      </div>

      {/* TABLE */}

      <div className="students-table">

        <div className="student-row table-heading">

          <span>Teacher</span>

          <span>Subject</span>

          <span>Qualification</span>

          <span>Mobile</span>

          <span>Status</span>

          <span>Action</span>

        </div>

        {filteredTeachers.length === 0 ? (

          <div className="no-students">

            <h3>No Teachers Found</h3>

            <p>
              Try another search or subject filter.
            </p>

          </div>

        ) : (

          filteredTeachers.map((teacher) => (

            <div
              className="student-row"
              key={teacher.id}
            >

              <span>

                <strong>
                  {teacher.name}
                </strong>

                <small>
                  {teacher.email || "No email"}
                </small>

              </span>

              <span>
                {teacher.subject}
              </span>

              <span>
                {teacher.qualification}
              </span>

              <span>
                {teacher.mobile}
              </span>

              <span>

                <span className="active">
                  {teacher.status}
                </span>

              </span>

              <span className="action-buttons">

                <button
                  type="button"
                  title="View Teacher"
                  onClick={() =>
                    setViewTeacher(teacher)
                  }
                >
                  👁️
                </button>

                <button
                  type="button"
                  title="Edit Teacher"
                  onClick={() =>
                    openEditForm(teacher)
                  }
                >
                  ✏️
                </button>

                <button
                  type="button"
                  title="Delete Teacher"
                  onClick={() =>
                    deleteTeacher(teacher.id)
                  }
                >
                  🗑️
                </button>

              </span>

            </div>

          ))

        )}

      </div>

      {/* ADD / EDIT MODAL */}

      {showForm && (

        <div className="modal-overlay">

          <div className="student-modal">

            <div className="modal-header">

              <div>

                <h2>
                  {editingId !== null
                    ? "Edit Teacher"
                    : "Add New Teacher"}
                </h2>

                <p>
                  Enter teacher information
                </p>

              </div>

              <button
                type="button"
                className="close-btn"
                onClick={closeForm}
              >
                ✕
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="form-grid">

                <div className="form-group">

                  <label>
                    Teacher Name *
                  </label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter teacher name"
                  />

                </div>

                <div className="form-group">

                  <label>
                    Subject *
                  </label>

                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                  >

                    <option value="">
                      Select Subject
                    </option>

                    <option value="Mathematics">
                      Mathematics
                    </option>

                    <option value="Science">
                      Science
                    </option>

                    <option value="English">
                      English
                    </option>

                    <option value="Hindi">
                      Hindi
                    </option>

                    <option value="Computer">
                      Computer
                    </option>

                  </select>

                </div>

                <div className="form-group">

                  <label>
                    Qualification *
                  </label>

                  <input
                    name="qualification"
                    value={form.qualification}
                    onChange={handleChange}
                    placeholder="e.g. M.Sc Mathematics"
                  />

                </div>

                <div className="form-group">

                  <label>
                    Mobile *
                  </label>

                  <input
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                  />

                </div>

                <div className="form-group">

                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                  />

                </div>

                <div className="form-group">

                  <label>
                    Joining Date
                  </label>

                  <input
                    type="date"
                    name="joiningDate"
                    value={form.joiningDate}
                    onChange={handleChange}
                  />

                </div>

              </div>

              <div className="form-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                >
                  {editingId !== null
                    ? "Update Teacher"
                    : "Save Teacher"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* VIEW MODAL */}

      {viewTeacher && (

        <div className="modal-overlay">

          <div className="student-modal">

            <div className="modal-header">

              <div>

                <h2>
                  Teacher Details
                </h2>

                <p>
                  Complete teacher information
                </p>

              </div>

              <button
                type="button"
                className="close-btn"
                onClick={() =>
                  setViewTeacher(null)
                }
              >
                ✕
              </button>

            </div>

            <div className="student-details">

              <div>
                <strong>Teacher Name</strong>
                <span>
                  {viewTeacher.name}
                </span>
              </div>

              <div>
                <strong>Subject</strong>
                <span>
                  {viewTeacher.subject}
                </span>
              </div>

              <div>
                <strong>Qualification</strong>
                <span>
                  {viewTeacher.qualification}
                </span>
              </div>

              <div>
                <strong>Mobile</strong>
                <span>
                  {viewTeacher.mobile}
                </span>
              </div>

              <div>
                <strong>Email</strong>
                <span>
                  {viewTeacher.email ||
                    "Not provided"}
                </span>
              </div>

              <div>
                <strong>Joining Date</strong>
                <span>
                  {viewTeacher.joiningDate ||
                    "Not provided"}
                </span>
              </div>

              <div>
                <strong>Status</strong>
                <span className="active">
                  {viewTeacher.status}
                </span>
              </div>

            </div>

            <div className="form-actions">

              <button
                type="button"
                className="cancel-btn"
                onClick={() =>
                  setViewTeacher(null)
                }
              >
                Close
              </button>

              <button
                type="button"
                className="save-btn"
                onClick={() => {
                  const teacher = viewTeacher;

                  setViewTeacher(null);

                  openEditForm(teacher);
                }}
              >
                Edit Teacher
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Teachers;