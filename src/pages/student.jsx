import { useEffect, useState } from "react";
import "../style/students.css";

function Students() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const emptyForm = {
    name: "",
    father: "",
    mother: "",
    dob: "",
    gender: "",
    aadhaar: "",
    pan: "",
    admissionNo: "",
    admissionDate: "",
    className: "",
    section: "",
    roll: "",
    mobile: "",
    alternateMobile: "",
    address: "",
    status: "Active",
  };

  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");

  // =====================================================
  // FETCH STUDENTS
  // =====================================================

  useEffect(() => {
    fetch("http://localhost:5000/api/students")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch students");
        }

        return response.json();
      })
      .then((data) => {
        const formattedStudents = data.map((student) => ({
          id: student.id,
          name: student.name || "",
          father: student.father || "",
          mother: student.mother || "",
          dob: student.dob || "",
          gender: student.gender || "",
          aadhaar: student.aadhaar || "",
          pan: student.pan || "",
          admissionNo: student.admissionNo || "",
          admissionDate: student.admissionDate || "",
          className: student.class || "",
          section: student.section || "",
          roll: student.rollNo || "",
          mobile: student.mobile || "",
          alternateMobile: student.alternateMobile || "",
          address: student.address || "",
          status: student.status || "Active",
        }));

        setStudents(formattedStudents);
      })
      .catch((error) => {
        console.error("Error fetching students:", error);
        alert("Unable to load students from server.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // =====================================================
  // FORM HANDLING
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(true);
  };

  const openEditForm = (student) => {
    setForm({
      name: student.name || "",
      father: student.father || "",
      mother: student.mother || "",
      dob: student.dob || "",
      gender: student.gender || "",
      aadhaar: student.aadhaar || "",
      pan: student.pan || "",
      admissionNo: student.admissionNo || "",
      admissionDate: student.admissionDate || "",
      className: student.className || "",
      section: student.section || "",
      roll: student.roll || "",
      mobile: student.mobile || "",
      alternateMobile: student.alternateMobile || "",
      address: student.address || "",
      status: student.status || "Active",
    });

    setEditingId(student.id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm(emptyForm);
  };

  // =====================================================
  // ADD / EDIT STUDENT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.father.trim() ||
      !form.className ||
      !form.section ||
      !form.roll.trim() ||
      !form.mobile.trim()
    ) {
      alert("Please fill all required fields.");
      return;
    }

    const studentData = {
      name: form.name,
      father: form.father,
      mother: form.mother,
      dob: form.dob,
      gender: form.gender,

      aadhaar: form.aadhaar,
      pan: form.pan,

      admissionNo: form.admissionNo,
      admissionDate: form.admissionDate,

      class: form.className,
      section: form.section,
      rollNo: form.roll,

      mobile: form.mobile,
      alternateMobile: form.alternateMobile,

      address: form.address,
      status: form.status || "Active",
    };

    // =================================================
    // EDIT
    // =================================================

    if (editingId !== null) {
      try {
        const response = await fetch(
          `http://localhost:5000/api/students/${editingId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(studentData),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to update student"
          );
        }

        const updatedStudent = {
          id: data.student.id,
          name: data.student.name || "",
          father: data.student.father || "",
          mother: data.student.mother || "",
          dob: data.student.dob || "",
          gender: data.student.gender || "",
          aadhaar: data.student.aadhaar || "",
          pan: data.student.pan || "",
          admissionNo: data.student.admissionNo || "",
          admissionDate: data.student.admissionDate || "",
          className: data.student.class || "",
          section: data.student.section || "",
          roll: data.student.rollNo || "",
          mobile: data.student.mobile || "",
          alternateMobile:
            data.student.alternateMobile || "",
          address: data.student.address || "",
          status: data.student.status || "Active",
        };

        setStudents((previousStudents) =>
          previousStudents.map((student) =>
            student.id === editingId
              ? updatedStudent
              : student
          )
        );

        alert("Student updated successfully!");
        closeForm();
      } catch (error) {
        console.error("Update error:", error);
        alert(
          "Unable to update student. Please check backend server."
        );
      }

      return;
    }

    // =================================================
    // ADD
    // =================================================

    try {
      const response = await fetch(
        "http://localhost:5000/api/students",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(studentData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add student"
        );
      }

      const newStudent = {
        id: data.student.id,
        name: data.student.name || "",
        father: data.student.father || "",
        mother: data.student.mother || "",
        dob: data.student.dob || "",
        gender: data.student.gender || "",
        aadhaar: data.student.aadhaar || "",
        pan: data.student.pan || "",
        admissionNo: data.student.admissionNo || "",
        admissionDate: data.student.admissionDate || "",
        className: data.student.class || "",
        section: data.student.section || "",
        roll: data.student.rollNo || "",
        mobile: data.student.mobile || "",
        alternateMobile:
          data.student.alternateMobile || "",
        address: data.student.address || "",
        status: data.student.status || "Active",
      };

      setStudents((previousStudents) => [
        ...previousStudents,
        newStudent,
      ]);

      alert("Student added successfully!");
      closeForm();
    } catch (error) {
      console.error("Add error:", error);
      alert(
        "Unable to add student. Please check backend server."
      );
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const deleteStudent = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `http://localhost:5000/api/students/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete student"
        );
      }

      setStudents((previousStudents) =>
        previousStudents.filter(
          (student) => student.id !== id
        )
      );

      alert("Student deleted successfully!");
    } catch (error) {
      console.error("Delete error:", error);

      alert(
        "Unable to delete student. Please check backend server."
      );
    }
  };

  // =====================================================
  // SEARCH + FILTER
  // =====================================================

  const filteredStudents = students.filter((student) => {
    const searchText = search.trim().toLowerCase();

    const matchesSearch =
      searchText === "" ||
      student.name.toLowerCase().includes(searchText) ||
      student.father.toLowerCase().includes(searchText) ||
      student.mother.toLowerCase().includes(searchText) ||
      String(student.roll).includes(searchText) ||
      String(student.mobile).includes(searchText) ||
      String(student.admissionNo)
        .toLowerCase()
        .includes(searchText);

    const matchesClass =
      classFilter === "All" ||
      student.className === classFilter;

    return matchesSearch && matchesClass;
  });

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="students-page">

      {/* HEADER */}

      <div className="page-header">
        <div>
          <h1>Students</h1>

          <p>
            Manage all students of MPSA School
          </p>
        </div>

        <button
          className="add-btn"
          onClick={openAddForm}
        >
          + Add Student
        </button>
      </div>

      {/* STATS */}

      <div className="student-stats">

        <div className="student-stat-card">
          <span>👨‍🎓</span>

          <div>
            <p>Total Students</p>
            <h2>{students.length}</h2>
          </div>
        </div>

        <div className="student-stat-card">
          <span>🟢</span>

          <div>
            <p>Active Students</p>

            <h2>
              {
                students.filter(
                  (student) =>
                    student.status === "Active"
                ).length
              }
            </h2>
          </div>
        </div>

        <div className="student-stat-card">
          <span>🏫</span>

          <div>
            <p>Total Classes</p>
            <h2>
              {
                new Set(
                  students.map(
                    (student) => student.className
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
          placeholder="Search student, father, admission no, roll or mobile..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
        />

        <select
          value={classFilter}
          onChange={(e) =>
            setClassFilter(e.target.value)
          }
        >
          <option value="All">
            All Classes
          </option>

          <option value="12">Class 12</option>
          <option value="11">Class 11</option>
          <option value="10">Class 10</option>
          <option value="9">Class 9</option>
          <option value="8">Class 8</option>
          <option value="7">Class 7</option>
          <option value="6">Class 6</option>
        </select>
      </div>

      <div
        style={{
          marginBottom: "12px",
          color: "#6b7280",
          fontSize: "14px",
        }}
      >
        Showing {filteredStudents.length} of{" "}
        {students.length} students
      </div>

      {/* TABLE */}

      <div className="students-table">

        <div className="student-row table-heading">
          <span>Student</span>
          <span>Class</span>
          <span>Roll No.</span>
          <span>Parent Contact</span>
          <span>Status</span>
          <span>Action</span>
        </div>

        {loading ? (
          <div className="no-students">
            <h3>Loading Students...</h3>
            <p>Please wait...</p>
          </div>
        ) : filteredStudents.length === 0 ? (
          <div className="no-students">
            <h3>No Students Found</h3>
            <p>
              Try another search or class filter.
            </p>
          </div>
        ) : (
          filteredStudents.map((student) => (
            <div
              className="student-row"
              key={student.id}
            >
              <span>
                <strong>{student.name}</strong>

                <small>
                  Father: {student.father}
                </small>
              </span>

              <span>
                {student.className}-
                {student.section}
              </span>

              <span>{student.roll}</span>

              <span>{student.mobile}</span>

              <span>
                <span className="active">
                  {student.status}
                </span>
              </span>

              <span className="action-buttons">

                <button
                  type="button"
                  title="View Student"
                  onClick={() =>
                    setViewStudent(student)
                  }
                >
                  👁️
                </button>

                <button
                  type="button"
                  title="Edit Student"
                  onClick={() =>
                    openEditForm(student)
                  }
                >
                  ✏️
                </button>

                <button
                  type="button"
                  title="Delete Student"
                  onClick={() =>
                    deleteStudent(student.id)
                  }
                >
                  🗑️
                </button>

              </span>
            </div>
          ))
        )}
      </div>

      {/* ================================================= */}
      {/* ADD / EDIT MODAL */}
      {/* ================================================= */}

      {showForm && (
        <div className="modal-overlay">

          <div className="student-modal">

            <div className="modal-header">

              <div>
                <h2>
                  {editingId !== null
                    ? "Edit Student"
                    : "Add New Student"}
                </h2>

                <p>
                  {editingId !== null
                    ? "Update complete student information"
                    : "Enter complete student information"}
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

                {/* STUDENT NAME */}

                <div className="form-group">
                  <label>
                    Student Name *
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter student name"
                  />
                </div>

                {/* FATHER */}

                <div className="form-group">
                  <label>
                    Father Name *
                  </label>

                  <input
                    type="text"
                    name="father"
                    value={form.father}
                    onChange={handleChange}
                    placeholder="Enter father name"
                  />
                </div>

                {/* MOTHER */}

                <div className="form-group">
                  <label>
                    Mother Name
                  </label>

                  <input
                    type="text"
                    name="mother"
                    value={form.mother}
                    onChange={handleChange}
                    placeholder="Enter mother name"
                  />
                </div>

                {/* DOB */}

                <div className="form-group">
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

                <div className="form-group">
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

                {/* CLASS */}

                <div className="form-group">
                  <label>
                    Class *
                  </label>

                  <select
                    name="className"
                    value={form.className}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select Class
                    </option>

                    <option value="12">12</option>
                    <option value="11">11</option>
                    <option value="10">10</option>
                    <option value="9">9</option>
                    <option value="8">8</option>
                    <option value="7">7</option>
                    <option value="6">6</option>
                  </select>
                </div>

                {/* SECTION */}

                <div className="form-group">
                  <label>
                    Section *
                  </label>

                  <select
                    name="section"
                    value={form.section}
                    onChange={handleChange}
                  >
                    <option value="">
                      Select Section
                    </option>

                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>

                {/* ROLL */}

                <div className="form-group">
                  <label>
                    Roll Number *
                  </label>

                  <input
                    type="text"
                    name="roll"
                    value={form.roll}
                    onChange={handleChange}
                    placeholder="Enter roll number"
                  />
                </div>

                {/* ADMISSION NUMBER */}

                <div className="form-group">
                  <label>
                    Admission Number
                  </label>

                  <input
                    type="text"
                    name="admissionNo"
                    value={form.admissionNo}
                    onChange={handleChange}
                    placeholder="e.g. MPSA-2026-001"
                  />
                </div>

                {/* ADMISSION DATE */}

                <div className="form-group">
                  <label>
                    Admission Date
                  </label>

                  <input
                    type="date"
                    name="admissionDate"
                    value={form.admissionDate}
                    onChange={handleChange}
                  />
                </div>

                {/* MOBILE */}

                <div className="form-group">
                  <label>
                    Parent Mobile *
                  </label>

                  <input
                    type="tel"
                    name="mobile"
                    value={form.mobile}
                    onChange={handleChange}
                    placeholder="Enter mobile number"
                  />
                </div>

                {/* ALTERNATE MOBILE */}

                <div className="form-group">
                  <label>
                    Alternate Mobile
                  </label>

                  <input
                    type="tel"
                    name="alternateMobile"
                    value={form.alternateMobile}
                    onChange={handleChange}
                    placeholder="Enter alternate number"
                  />
                </div>

                {/* AADHAAR */}

                <div className="form-group">
                  <label>
                    Aadhaar Number
                  </label>

                  <input
                    type="text"
                    name="aadhaar"
                    value={form.aadhaar}
                    onChange={handleChange}
                    placeholder="Enter Aadhaar number"
                    maxLength="14"
                  />
                </div>

                {/* PAN */}

                <div className="form-group">
                  <label>
                    PAN Number
                  </label>

                  <input
                    type="text"
                    name="pan"
                    value={form.pan}
                    onChange={handleChange}
                    placeholder="Enter PAN number"
                    maxLength="10"
                  />
                </div>

                {/* ADDRESS */}

                <div className="form-group full-width">
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

              {/* ACTIONS */}

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
                    ? "Update Student"
                    : "Save Student"}
                </button>

              </div>

            </form>
          </div>
        </div>
      )}

      {/* ================================================= */}
      {/* STUDENT PROFILE */}
      {/* ================================================= */}

      {viewStudent && (
        <div
          className="modal-overlay"
          onClick={() => setViewStudent(null)}
        >

          <div
            className="student-profile-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* PROFILE HEADER */}

            <div className="profile-header">

              <button
                type="button"
                className="profile-close-btn"
                onClick={() =>
                  setViewStudent(null)
                }
              >
                ✕
              </button>

              <div className="profile-avatar">
                {viewStudent.name
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="profile-main-info">

                <h2>
                  {viewStudent.name}
                </h2>

                <p>
                  Class {viewStudent.className}{" "}
                  • Section {viewStudent.section}{" "}
                  • Roll No. {viewStudent.roll}
                </p>

                <span className="profile-status">
                  ● {viewStudent.status}
                </span>

              </div>
            </div>

            {/* PROFILE CONTENT */}

            <div className="profile-content">

              {/* PERSONAL */}

              <div className="profile-section">

                <div className="profile-section-title">
                  <span>👤</span>

                  <div>
                    <h3>
                      Personal Information
                    </h3>

                    <p>
                      Basic student details
                    </p>
                  </div>
                </div>

                <div className="profile-grid">

                  <div className="profile-item">
                    <label>Student Name</label>
                    <strong>
                      {viewStudent.name}
                    </strong>
                  </div>

                  <div className="profile-item">
                    <label>Father Name</label>
                    <strong>
                      {viewStudent.father ||
                        "Not provided"}
                    </strong>
                  </div>

                  <div className="profile-item">
                    <label>Mother Name</label>
                    <strong>
                      {viewStudent.mother ||
                        "Not provided"}
                    </strong>
                  </div>

                  <div className="profile-item">
                    <label>Date of Birth</label>
                    <strong>
                      {viewStudent.dob ||
                        "Not provided"}
                    </strong>
                  </div>

                  <div className="profile-item">
                    <label>Gender</label>
                    <strong>
                      {viewStudent.gender ||
                        "Not provided"}
                    </strong>
                  </div>

                </div>
              </div>

              {/* IDENTITY */}

              <div className="profile-section">

                <div className="profile-section-title">
                  <span>🪪</span>

                  <div>
                    <h3>
                      Identity Information
                    </h3>

                    <p>
                      Government identity details
                    </p>
                  </div>
                </div>

                <div className="profile-grid">

                  <div className="profile-item">
                    <label>
                      Aadhaar Number
                    </label>

                    <strong>
                      {viewStudent.aadhaar ||
                        "Not provided"}
                    </strong>
                  </div>

                  <div className="profile-item">
                    <label>
                      PAN Number
                    </label>

                    <strong>
                      {viewStudent.pan ||
                        "Not provided"}
                    </strong>
                  </div>

                </div>
              </div>

              {/* ADMISSION */}

              <div className="profile-section">

                <div className="profile-section-title">
                  <span>🎓</span>

                  <div>
                    <h3>
                      Admission Information
                    </h3>

                    <p>
                      School admission details
                    </p>
                  </div>
                </div>

                <div className="profile-grid">

                  <div className="profile-item">
                    <label>
                      Admission Number
                    </label>

                    <strong>
                      {viewStudent.admissionNo ||
                        "Not provided"}
                    </strong>
                  </div>

                  <div className="profile-item">
                    <label>
                      Admission Date
                    </label>

                    <strong>
                      {viewStudent.admissionDate ||
                        "Not provided"}
                    </strong>
                  </div>

                </div>
              </div>

              {/* ACADEMIC */}

              <div className="profile-section">

                <div className="profile-section-title">
                  <span>🏫</span>

                  <div>
                    <h3>
                      Academic Information
                    </h3>

                    <p>
                      Current academic details
                    </p>
                  </div>
                </div>

                <div className="profile-grid">

                  <div className="profile-item">
                    <label>Class</label>

                    <strong>
                      Class{" "}
                      {viewStudent.className}
                    </strong>
                  </div>

                  <div className="profile-item">
                    <label>Section</label>

                    <strong>
                      Section{" "}
                      {viewStudent.section}
                    </strong>
                  </div>

                  <div className="profile-item">
                    <label>Roll Number</label>

                    <strong>
                      {viewStudent.roll}
                    </strong>
                  </div>

                  <div className="profile-item">
                    <label>Status</label>

                    <span className="active">
                      {viewStudent.status}
                    </span>
                  </div>

                </div>
              </div>

              {/* CONTACT */}

              <div className="profile-section">

                <div className="profile-section-title">
                  <span>📱</span>

                  <div>
                    <h3>
                      Contact Information
                    </h3>

                    <p>
                      Parent contact details
                    </p>
                  </div>
                </div>

                <div className="profile-grid">

                  <div className="profile-item">
                    <label>
                      Parent Mobile
                    </label>

                    <strong>
                      {viewStudent.mobile ||
                        "Not provided"}
                    </strong>
                  </div>

                  <div className="profile-item">
                    <label>
                      Alternate Mobile
                    </label>

                    <strong>
                      {viewStudent.alternateMobile ||
                        "Not provided"}
                    </strong>
                  </div>

                  <div className="profile-item profile-full">
                    <label>
                      Address
                    </label>

                    <strong>
                      {viewStudent.address ||
                        "Not provided"}
                    </strong>
                  </div>

                </div>
              </div>

              {/* OVERVIEW */}

              <div className="profile-section">

                <div className="profile-section-title">
                  <span>📊</span>

                  <div>
                    <h3>
                      Student Overview
                    </h3>

                    <p>
                      Quick academic overview
                    </p>
                  </div>
                </div>

                <div className="overview-cards">

                  <div className="overview-card">
                    <span>📅</span>

                    <div>
                      <small>
                        Attendance
                      </small>

                      <strong>
                        92%
                      </strong>
                    </div>
                  </div>

                  <div className="overview-card">
                    <span>💰</span>

                    <div>
                      <small>
                        Fees Status
                      </small>

                      <strong>
                        Paid
                      </strong>
                    </div>
                  </div>

                  <div className="overview-card">
                    <span>📝</span>

                    <div>
                      <small>
                        Average Marks
                      </small>

                      <strong>
                        78%
                      </strong>
                    </div>
                  </div>

                  <div className="overview-card">
                    <span>🏆</span>

                    <div>
                      <small>
                        Performance
                      </small>

                      <strong>
                        Good
                      </strong>
                    </div>
                  </div>

                </div>
              </div>

            </div>

            {/* PROFILE ACTIONS */}

            <div className="profile-actions">

              <button
                type="button"
                className="cancel-btn"
                onClick={() =>
                  setViewStudent(null)
                }
              >
                Close
              </button>

              <button
                type="button"
                className="save-btn"
                onClick={() => {
                  const student = viewStudent;

                  setViewStudent(null);

                  openEditForm(student);
                }}
              >
                ✏️ Edit Student
              </button>

            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default Students;