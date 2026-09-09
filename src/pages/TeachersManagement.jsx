import { useEffect, useState } from "react";
import "../Style/teachers-management.css";

function TeachersManagement() {
  const emptyForm = {
    name: "",
    father: "",
    dob: "",
    gender: "",
    qualification: "",
    subject: "",
    joiningDate: "",
    mobile: "",
    email: "",
    address: "",
    monthlySalary: "",
    status: "Active",
  };

  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  // ===============================
  // LOAD TEACHERS
  // ===============================

  const loadTeachers = async () => {
    try {
      const response = await fetch(
        "http:// https://school-web-hng4.onrender.com/api/teachers"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load teachers");
      }

      setTeachers(data);
    } catch (error) {
      console.error("Teacher loading error:", error);

      alert(
        "Unable to load teachers. Please check backend server."
      );
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  // ===============================
  // HANDLE INPUT
  // ===============================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ===============================
  // OPEN ADD FORM
  // ===============================

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  // ===============================
  // OPEN EDIT FORM
  // ===============================

  const openEditForm = (teacher) => {
    setForm({
      name: teacher.name || "",
      father: teacher.father || "",
      dob: teacher.dob || "",
      gender: teacher.gender || "",
      qualification: teacher.qualification || "",
      subject: teacher.subject || "",
      joiningDate: teacher.joiningDate || "",
      mobile: teacher.mobile || "",
      email: teacher.email || "",
      address: teacher.address || "",

      // IMPORTANT
      monthlySalary:
        teacher.monthlySalary !== undefined
          ? teacher.monthlySalary
          : "",

      status: teacher.status || "Active",
    });

    setEditingId(teacher.id);
    setShowForm(true);
  };

  // ===============================
  // CLOSE FORM
  // ===============================

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  // ===============================
  // SAVE / UPDATE TEACHER
  // ===============================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.subject.trim() ||
      !form.mobile.trim() ||
      form.monthlySalary === ""
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const teacherData = {
        name: form.name,
        father: form.father,
        dob: form.dob,
        gender: form.gender,
        qualification: form.qualification,
        subject: form.subject,
        joiningDate: form.joiningDate,
        mobile: form.mobile,
        email: form.email,
        address: form.address,

        // IMPORTANT
        monthlySalary: Number(form.monthlySalary),

        status: form.status,

        // Backend requires employeeId
        employeeId:
          editingId !== null
            ? teachers.find(
                (teacher) => teacher.id === editingId
              )?.employeeId || `MPSA-T-${editingId}`
            : `MPSA-T-${Date.now()}`,
      };

      const url =
        editingId !== null
          ? `http:// https://school-web-hng4.onrender.com/api/teachers/${editingId}`
          : "http:// https://school-web-hng4.onrender.com/api/teachers";

      const response = await fetch(url, {
        method: editingId !== null ? "PUT" : "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(teacherData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save teacher"
        );
      }

      alert(
        editingId !== null
          ? "Teacher updated successfully!"
          : "Teacher added successfully!"
      );

      closeForm();

      loadTeachers();
    } catch (error) {
      console.error("Teacher save error:", error);

      alert(
        error.message ||
          "Unable to save teacher. Please check backend server."
      );
    }
  };

  // ===============================
  // DELETE TEACHER
  // ===============================

  const deleteTeacher = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this teacher?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http:// https://school-web-hng4.onrender.com/api/teachers/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete teacher"
        );
      }

      alert("Teacher deleted successfully!");

      loadTeachers();
    } catch (error) {
      console.error("Teacher delete error:", error);

      alert(
        "Unable to delete teacher. Please check backend server."
      );
    }
  };

  // ===============================
  // SEARCH
  // ===============================

  const filteredTeachers = teachers.filter((teacher) => {
    const text = search.trim().toLowerCase();

    if (!text) return true;

    return (
      String(teacher.name || "")
        .toLowerCase()
        .includes(text) ||
      String(teacher.subject || "")
        .toLowerCase()
        .includes(text) ||
      String(teacher.mobile || "")
        .toLowerCase()
        .includes(text) ||
      String(teacher.qualification || "")
        .toLowerCase()
        .includes(text)
    );
  });

  // ===============================
  // STATS
  // ===============================

  const activeTeachers = teachers.filter(
    (teacher) => teacher.status === "Active"
  ).length;

  const totalSalary = teachers.reduce(
    (total, teacher) =>
      total + Number(teacher.monthlySalary || 0),
    0
  );

  return (
    <div className="teacher-attendance-page">

      {/* ================= HEADER ================= */}

      <div className="teacher-page-header">
        <div>
          <h1>Teachers</h1>

          <p>
            Manage all teachers of MPSA School
          </p>
        </div>

        <button
          className="teacher-add-btn"
          onClick={openAddForm}
        >
          + Add Teacher
        </button>
      </div>

      {/* ================= STATS ================= */}

      <div className="teacher-stats">

        <div className="teacher-stat-card">
          <span>👨‍🏫</span>

          <div>
            <p>Total Teachers</p>
            <h2>{teachers.length}</h2>
          </div>
        </div>

        <div className="teacher-stat-card">
          <span>🟢</span>

          <div>
            <p>Active Teachers</p>
            <h2>{activeTeachers}</h2>
          </div>
        </div>

        <div className="teacher-stat-card">
          <span>💰</span>

          <div>
            <p>Monthly Salary</p>

            <h2>
              ₹{totalSalary.toLocaleString("en-IN")}
            </h2>
          </div>
        </div>

      </div>

      {/* ================= SEARCH ================= */}

      <div className="teacher-search-box">

        <input
          type="text"
          placeholder="Search teacher, subject, qualification or mobile..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      {/* ================= TABLE ================= */}

      <div className="teachers-table">

        <div className="teacher-row teacher-table-heading">

          <span>Teacher</span>

          <span>Subject</span>

          <span>Qualification</span>

          <span>Mobile</span>

          <span>Salary</span>

          <span>Status</span>

          <span>Action</span>

        </div>

        {filteredTeachers.length === 0 ? (

          <div className="no-teachers">

            <div>👨‍🏫</div>

            <h3>No Teachers Found</h3>

            <p>
              Add your first teacher using the button above.
            </p>

          </div>

        ) : (

          filteredTeachers.map((teacher) => (

            <div
              className="teacher-row"
              key={teacher.id}
            >

              <span>

                <strong>
                  {teacher.name}
                </strong>

                <small>
                  ID: {teacher.employeeId || "Not provided"}
                </small>

                <small>
                  Joining:{" "}
                  {teacher.joiningDate || "Not provided"}
                </small>

              </span>

              <span>
                {teacher.subject || "Not provided"}
              </span>

              <span>
                {teacher.qualification || "Not provided"}
              </span>

              <span>
                {teacher.mobile || "Not provided"}
              </span>

              {/* ================= SALARY ================= */}

              <span>

                ₹
                {Number(
                  teacher.monthlySalary || 0
                ).toLocaleString("en-IN")}

              </span>

              {/* ================= STATUS ================= */}

              <span>

                <span
                  className={
                    teacher.status === "Active"
                      ? "teacher-active"
                      : "teacher-inactive"
                  }
                >
                  {teacher.status}
                </span>

              </span>

              {/* ================= ACTION ================= */}

              <span className="teacher-actions">

                <button
                  type="button"
                  title="Edit"
                  onClick={() =>
                    openEditForm(teacher)
                  }
                >
                  ✏️
                </button>

                <button
                  type="button"
                  title="Delete"
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

      {/* ================= ADD / EDIT MODAL ================= */}

      {showForm && (

        <div className="teacher-modal-overlay">

          <div className="teacher-form-modal">

            <div className="teacher-modal-header">

              <div>

                <h2>
                  {editingId !== null
                    ? "Edit Teacher"
                    : "Add New Teacher"}
                </h2>

                <p>
                  Enter teacher's complete information
                </p>

              </div>

              <button
                type="button"
                className="teacher-close-btn"
                onClick={closeForm}
              >
                ✕
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="teacher-form-grid">

                {/* NAME */}

                <div className="teacher-form-group">

                  <label>
                    Teacher Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter teacher name"
                  />

                </div>

                {/* FATHER */}

                <div className="teacher-form-group">

                  <label>
                    Father Name
                  </label>

                  <input
                    type="text"
                    name="father"
                    value={form.father}
                    onChange={handleChange}
                    placeholder="Enter father name"
                  />

                </div>

                {/* DOB */}

                <div className="teacher-form-group">

                  <label>
                    Date of Birth
                  </label>

                  <input
                    type="date"
                    name="dob"
                    value={form.dob}
                    onChange={handleChange}
                  />

                </div>

                {/* GENDER */}

                <div className="teacher-form-group">

                  <label>
                    Gender
                  </label>

                  <select
                    name="gender"
                    value={form.gender}
                    onChange={handleChange}
                  >

                    <option value="">
                      Select Gender
                    </option>

                    <option value="Male">
                      Male
                    </option>

                    <option value="Female">
                      Female
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>

                {/* QUALIFICATION */}

                <div className="teacher-form-group">

                  <label>
                    Qualification
                  </label>

                  <input
                    type="text"
                    name="qualification"
                    value={form.qualification}
                    onChange={handleChange}
                    placeholder="e.g. M.Sc, B.Ed"
                  />

                </div>

                {/* SUBJECT */}

                <div className="teacher-form-group">

                  <label>
                    Subject *
                  </label>

                  <input
                    type="text"
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    placeholder="e.g. Mathematics"
                  />

                </div>

                {/* JOINING DATE */}

                <div className="teacher-form-group">

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

                {/* MOBILE */}

                <div className="teacher-form-group">

                  <label>
                    Mobile *
                  </label>

                  <input
                    type="tel"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                  />

                </div>

                {/* EMAIL */}

                <div className="teacher-form-group">

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

                {/* ================= MONTHLY SALARY ================= */}

                <div className="teacher-form-group">

                  <label>
                    Monthly Salary *
                  </label>

                  <input
                    type="number"
                    name="monthlySalary"
                    value={form.monthlySalary}
                    onChange={handleChange}
                    placeholder="Enter monthly salary"
                    min="0"
                  />

                </div>

                {/* STATUS */}

                <div className="teacher-form-group">

                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >

                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>

                  </select>

                </div>

                {/* ADDRESS */}

                <div className="teacher-form-group teacher-full-width">

                  <label>
                    Address
                  </label>

                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    placeholder="Enter complete address"
                    rows="3"
                  />

                </div>

              </div>

              {/* ================= BUTTONS ================= */}

              <div className="teacher-form-actions">

                <button
                  type="button"
                  className="teacher-cancel-btn"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="teacher-save-btn"
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

    </div>
  );
}

export default TeachersManagement;