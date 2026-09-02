import { useEffect, useMemo, useState } from "react";
import "../Style/students.css";

function Students() {
  // =====================================================
  // STATES
  // =====================================================

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [viewStudent, setViewStudent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");

  // =====================================================
  // EMPTY FORM
  // =====================================================

  const emptyForm = {
    name: "",
    father: "",
    mother: "",
    dob: "",
    gender: "",
    bloodGroup: "",

    aadhaar: "",
    pan: "",
    penNo: "",

    admissionNo: "",
    admissionDate: "",
    admissionType: "New",
    session: "",

    className: "",
    section: "",
    roll: "",

    mobile: "",
    alternateMobile: "",
    email: "",
    address: "",

    previousSchool: "",
    receiptNo: "",

    status: "Active",
  };

  const [form, setForm] = useState(emptyForm);

  // =====================================================
  // CLASS LIST
  // =====================================================

  const classes = [
    "PG",
    "Nursery",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12",
  ];

  // =====================================================
  // FORMAT STUDENT
  // =====================================================

  const formatStudent = (student) => {
    return {
      id: student.id || student._id || "",

      name: student.name || "",
      father: student.father || "",
      mother: student.mother || "",

      dob: student.dob || "",
      gender: student.gender || "",
      bloodGroup: student.bloodGroup || "",

      aadhaar: student.aadhaar || "",
      pan: student.pan || "",
      penNo: student.penNo || "",

      admissionNo: student.admissionNo || "",
      admissionDate: student.admissionDate || "",
      admissionType: student.admissionType || "New",
      session: student.session || "",

      className: student.className || student.class || "",
      section: student.section || "",

      roll: student.roll || student.rollNo || "",

      mobile: student.mobile || "",
      alternateMobile: student.alternateMobile || "",

      email: student.email || "",
      address: student.address || "",

      previousSchool: student.previousSchool || "",
      receiptNo: student.receiptNo || "",

      status: student.status || "Active",

      createdAt: student.createdAt || "",
      updatedAt: student.updatedAt || "",
    };
  };

  // =====================================================
  // LOAD STUDENTS
  // =====================================================

  const loadStudents = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        "http://localhost:5000/api/students"
      );

      if (!response.ok) {
        throw new Error(
          `Server returned ${response.status}`
        );
      }

      const data = await response.json();

      console.log("Students API Response:", data);

      const studentsArray = Array.isArray(data)
        ? data
        : Array.isArray(data.students)
        ? data.students
        : [];

      setStudents(
        studentsArray.map(formatStudent)
      );
    } catch (error) {
      console.error(
        "Error fetching students:",
        error
      );

      setStudents([]);

      alert(
        "Unable to load students from server. Please check backend server."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD ON PAGE OPEN
  // =====================================================

  useEffect(() => {
    loadStudents();
  }, []);

  // =====================================================
  // HANDLE FORM CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));
  };

  // =====================================================
  // OPEN EDIT FORM
  // =====================================================

  const openEditForm = (student) => {
    if (!student) return;

    setForm({
      name: student.name || "",
      father: student.father || "",
      mother: student.mother || "",

      dob: student.dob || "",
      gender: student.gender || "",
      bloodGroup: student.bloodGroup || "",

      aadhaar: student.aadhaar || "",
      pan: student.pan || "",
      penNo: student.penNo || "",

      admissionNo: student.admissionNo || "",
      admissionDate: student.admissionDate || "",
      admissionType: student.admissionType || "New",
      session: student.session || "",

      className: student.className || "",
      section: student.section || "",
      roll: student.roll || "",

      mobile: student.mobile || "",
      alternateMobile: student.alternateMobile || "",

      email: student.email || "",
      address: student.address || "",

      previousSchool:
        student.previousSchool || "",

      receiptNo: student.receiptNo || "",

      status: student.status || "Active",
    });

    setEditingId(student.id);
    setShowForm(true);
  };

  // =====================================================
  // CLOSE EDIT FORM
  // =====================================================

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ ...emptyForm });
  };

  // =====================================================
  // UPDATE STUDENT
  // =====================================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Student name is required.");
      return;
    }

    if (!editingId) {
      alert(
        "Students can be added from Admission Form."
      );
      return;
    }

    const studentData = {
      name: form.name.trim(),
      father: form.father.trim(),
      mother: form.mother.trim(),

      dob: form.dob,
      gender: form.gender,
      bloodGroup: form.bloodGroup,

      aadhaar: form.aadhaar.trim(),
      pan: form.pan.trim(),
      penNo: form.penNo.trim(),

      admissionNo: form.admissionNo.trim(),
      admissionDate: form.admissionDate,
      admissionType: form.admissionType,
      session: form.session,

      class: form.className,
      className: form.className,

      section: form.section,

      rollNo: form.roll.trim(),
      roll: form.roll.trim(),

      mobile: form.mobile.trim(),
      alternateMobile:
        form.alternateMobile.trim(),

      email: form.email.trim(),
      address: form.address.trim(),

      previousSchool:
        form.previousSchool.trim(),

      receiptNo: form.receiptNo.trim(),

      status: form.status || "Active",
    };

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
          data.message ||
            "Failed to update student"
        );
      }

      const updatedStudent = formatStudent(
        data.student || data
      );

      setStudents(
        (previousStudents) =>
          previousStudents.map((student) =>
            student.id === editingId
              ? updatedStudent
              : student
          )
      );

      if (
        viewStudent &&
        viewStudent.id === editingId
      ) {
        setViewStudent(updatedStudent);
      }

      alert(
        "Student updated successfully!"
      );

      closeForm();
    } catch (error) {
      console.error(
        "Update error:",
        error
      );

      alert(
        "Unable to update student. Please check backend server."
      );
    }
  };

  // =====================================================
  // DELETE STUDENT
  // =====================================================

  const deleteStudent = async (id) => {
    if (!id) {
      alert("Student ID is missing.");
      return;
    }

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
          data.message ||
            "Failed to delete student"
        );
      }

      setStudents(
        (previousStudents) =>
          previousStudents.filter(
            (student) =>
              student.id !== id
          )
      );

      setViewStudent(null);

      alert(
        "Student deleted successfully!"
      );
    } catch (error) {
      console.error(
        "Delete error:",
        error
      );

      alert(
        "Unable to delete student. Please check backend server."
      );
    }
  };

  // =====================================================
  // FILTERED STUDENTS
  // =====================================================

  const filteredStudents = useMemo(() => {
    const searchText =
      search.trim().toLowerCase();

    return students.filter((student) => {
      const searchableText = [
        student.name,
        student.father,
        student.mother,

        student.admissionNo,
        student.roll,

        student.mobile,
        student.alternateMobile,

        student.email,

        student.aadhaar,
        student.pan,
        student.penNo,

        student.address,

        student.previousSchool,

        student.className,
        student.section,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        searchText === "" ||
        searchableText.includes(searchText);

      const matchesClass =
        classFilter === "All" ||
        student.className === classFilter;

      return (
        matchesSearch &&
        matchesClass
      );
    });
  }, [
    students,
    search,
    classFilter,
  ]);

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalStudents =
    filteredStudents.length;

  const newStudents =
    filteredStudents.filter(
      (student) =>
        String(
          student.admissionType
        ).toLowerCase() === "new"
    ).length;

  const oldStudents =
    filteredStudents.filter(
      (student) =>
        String(
          student.admissionType
        ).toLowerCase() === "old"
    ).length;

  const totalBoys =
    filteredStudents.filter(
      (student) =>
        String(
          student.gender
        ).toLowerCase() === "male"
    ).length;

  const totalGirls =
    filteredStudents.filter(
      (student) =>
        String(
          student.gender
        ).toLowerCase() === "female"
    ).length;

  // =====================================================
  // PRINT STUDENT
  // =====================================================

  const printStudent = (student) => {
    if (!student) return;

    const printWindow = window.open(
      "",
      "_blank",
      "width=900,height=900"
    );

    if (!printWindow) {
      alert(
        "Please allow pop-ups to print student details."
      );
      return;
    }

    const safe = (value) => {
      if (
        value === null ||
        value === undefined ||
        value === ""
      ) {
        return "Not Provided";
      }

      return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    };

    printWindow.document.write(`
      <!DOCTYPE html>

      <html>

      <head>

        <meta charset="UTF-8" />

        <title>
          Student Profile - ${safe(student.name)}
        </title>

        <style>

          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 0;
            font-family:
              Arial,
              Helvetica,
              sans-serif;

            color: #111827;
            background: #ffffff;
          }

          .page {
            width: 210mm;
            min-height: 297mm;
            margin: auto;
            padding: 14mm;
          }

          .school-header {
            text-align: center;
            border-bottom:
              2px solid #111827;

            padding-bottom: 12px;
            margin-bottom: 18px;
          }

          .school-header h1 {
            margin: 0;
            font-size: 24px;
            text-transform: uppercase;
          }

          .school-header p {
            margin: 5px 0 0;
            font-size: 13px;
          }

          .title {
            text-align: center;
            margin: 15px 0;
          }

          .title h2 {
            margin: 0;
            font-size: 20px;
          }

          .student-top {
            display: flex;
            justify-content: space-between;

            border: 1px solid #333;

            padding: 12px;
            margin-bottom: 15px;
          }

          .student-name {
            font-size: 19px;
            font-weight: bold;
          }

          .status {
            font-weight: bold;
          }

          .section {
            margin-top: 15px;
          }

          .section-title {
            background: #eeeeee;

            border:
              1px solid #333;

            padding: 7px 10px;

            font-weight: bold;
            font-size: 14px;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          td {
            border:
              1px solid #555;

            padding: 7px 8px;

            font-size: 12px;
            vertical-align: top;
          }

          td.label {
            width: 25%;

            font-weight: bold;

            background: #fafafa;
          }

          .footer {
            margin-top: 35px;

            display: flex;
            justify-content: space-between;

            font-size: 12px;
          }

          @page {
            size: A4;
            margin: 0;
          }

          @media print {

            body {
              background: white;
            }

            .page {
              margin: 0;
            }

          }

        </style>

      </head>

      <body>

        <div class="page">

          <div class="school-header">

            <h1>
              Maharana Pratap Science Academy
              Inter College
            </h1>

            <p>
              Student Management System
            </p>

          </div>

          <div class="title">

            <h2>
              STUDENT PROFILE
            </h2>

          </div>

          <div class="student-top">

            <div>

              <div class="student-name">
                ${safe(student.name)}
              </div>

              <div>
                Class:
                ${safe(student.className)}

                -

                ${safe(student.section)}

                &nbsp;&nbsp; | &nbsp;&nbsp;

                Roll No:
                ${safe(student.roll)}
              </div>

            </div>

            <div class="status">

              Status:
              ${safe(student.status)}

            </div>

          </div>

          <!-- PERSONAL -->

          <div class="section">

            <div class="section-title">
              Personal Information
            </div>

            <table>

              <tr>

                <td class="label">
                  Student Name
                </td>

                <td>
                  ${safe(student.name)}
                </td>

                <td class="label">
                  Gender
                </td>

                <td>
                  ${safe(student.gender)}
                </td>

              </tr>

              <tr>

                <td class="label">
                  Father Name
                </td>

                <td>
                  ${safe(student.father)}
                </td>

                <td class="label">
                  Mother Name
                </td>

                <td>
                  ${safe(student.mother)}
                </td>

              </tr>

              <tr>

                <td class="label">
                  Date of Birth
                </td>

                <td>
                  ${safe(student.dob)}
                </td>

                <td class="label">
                  Blood Group
                </td>

                <td>
                  ${safe(student.bloodGroup)}
                </td>

              </tr>

            </table>

          </div>

          <!-- ADMISSION -->

          <div class="section">

            <div class="section-title">
              Admission Information
            </div>

            <table>

              <tr>

                <td class="label">
                  Admission Number
                </td>

                <td>
                  ${safe(student.admissionNo)}
                </td>

                <td class="label">
                  Admission Type
                </td>

                <td>
                  ${safe(student.admissionType)}
                </td>

              </tr>

              <tr>

                <td class="label">
                  Admission Date
                </td>

                <td>
                  ${safe(student.admissionDate)}
                </td>

                <td class="label">
                  Session
                </td>

                <td>
                  ${safe(student.session)}
                </td>

              </tr>

              <tr>

                <td class="label">
                  Previous School
                </td>

                <td>
                  ${safe(student.previousSchool)}
                </td>

                <td class="label">
                  Receipt No.
                </td>

                <td>
                  ${safe(student.receiptNo)}
                </td>

              </tr>

            </table>

          </div>

          <!-- ACADEMIC -->

          <div class="section">

            <div class="section-title">
              Academic Information
            </div>

            <table>

              <tr>

                <td class="label">
                  Class
                </td>

                <td>
                  ${safe(student.className)}
                </td>

                <td class="label">
                  Section
                </td>

                <td>
                  ${safe(student.section)}
                </td>

              </tr>

              <tr>

                <td class="label">
                  Roll Number
                </td>

                <td>
                  ${safe(student.roll)}
                </td>

                <td class="label">
                  Status
                </td>

                <td>
                  ${safe(student.status)}
                </td>

              </tr>

            </table>

          </div>

          <!-- IDENTITY -->

          <div class="section">

            <div class="section-title">
              Identity Information
            </div>

            <table>

              <tr>

                <td class="label">
                  Aadhaar Number
                </td>

                <td>
                  ${safe(student.aadhaar)}
                </td>

                <td class="label">
                  PAN Number
                </td>

                <td>
                  ${safe(student.pan)}
                </td>

              </tr>

              <tr>

                <td class="label">
                  PEN Number
                </td>

                <td colspan="3">
                  ${safe(student.penNo)}
                </td>

              </tr>

            </table>

          </div>

          <!-- CONTACT -->

          <div class="section">

            <div class="section-title">
              Contact Information
            </div>

            <table>

              <tr>

                <td class="label">
                  Parent Mobile
                </td>

                <td>
                  ${safe(student.mobile)}
                </td>

                <td class="label">
                  Alternate Mobile
                </td>

                <td>
                  ${safe(student.alternateMobile)}
                </td>

              </tr>

              <tr>

                <td class="label">
                  Email
                </td>

                <td colspan="3">
                  ${safe(student.email)}
                </td>

              </tr>

              <tr>

                <td class="label">
                  Address
                </td>

                <td colspan="3">
                  ${safe(student.address)}
                </td>

              </tr>

            </table>

          </div>

          <div class="footer">

            <span>
              Student Record
            </span>

            <span>
              Generated:
              ${new Date().toLocaleDateString("en-IN")}
            </span>

          </div>

        </div>

        <script>

          window.onload = function () {

            window.print();

            window.onafterprint = function () {
              window.close();
            };

          };

        </script>

      </body>

      </html>
    `);

    printWindow.document.close();
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (date) => {
    if (!date) {
      return "Not Provided";
    }

    const d = new Date(date);

    if (Number.isNaN(d.getTime())) {
      return date;
    }

    return d.toLocaleDateString("en-IN");
  };

  // =====================================================
  // FORMAT DATE TIME
  // =====================================================

  const formatDateTime = (value) => {
    if (!value) {
      return "Not Provided";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleString("en-IN");
  };

  // =====================================================
  // CLASS DISPLAY NAME
  // =====================================================

  const getClassDisplayName = (className) => {
    if (!className) {
      return "All Classes";
    }

    if (
      className === "PG" ||
      className === "Nursery"
    ) {
      return className;
    }

    return `Class ${className}`;
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="students-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="students-main-header">

        <div className="students-header-left">

          <div className="students-header-icon">
            👨‍🎓
          </div>

          <div>

            <h1>
              Students
            </h1>

            <p>
              Complete student records of
              Maharana Pratap Science Academy
              Inter College
            </p>

          </div>

        </div>

        <div className="student-header-info">

          <span>
            📚 Student Management
          </span>

          <span>
            🗃️ {students.length} Records
          </span>

        </div>

      </div>

      {/* =================================================
          CLASS FILTER
      ================================================= */}

      <div className="student-filter-card">

        <div className="filter-left">

          <label>
            Select Class
          </label>

          <select
            value={classFilter}
            onChange={(e) =>
              setClassFilter(
                e.target.value
              )
            }
          >

            <option value="All">
              All Classes
            </option>

            {classes.map((className) => (
              <option
                key={className}
                value={className}
              >
                {getClassDisplayName(
                  className
                )}
              </option>
            ))}

          </select>

        </div>

        <div className="filter-selected">

          {classFilter === "All"
            ? "Showing All Classes"
            : `Showing ${getClassDisplayName(
                classFilter
              )}`}

        </div>

      </div>

      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="student-stats">

        <div className="student-stat-card">

          <div className="stat-icon">
            👨‍🎓
          </div>

          <div>

            <p>
              Total Students
            </p>

            <h2>
              {totalStudents}
            </h2>

          </div>

        </div>

        <div className="student-stat-card">

          <div className="stat-icon">
            🆕
          </div>

          <div>

            <p>
              New Students
            </p>

            <h2>
              {newStudents}
            </h2>

          </div>

        </div>

        <div className="student-stat-card">

          <div className="stat-icon">
            🔄
          </div>

          <div>

            <p>
              Old Students
            </p>

            <h2>
              {oldStudents}
            </h2>

          </div>

        </div>

        <div className="student-stat-card">

          <div className="stat-icon">
            👦
          </div>

          <div>

            <p>
              Total Boys
            </p>

            <h2>
              {totalBoys}
            </h2>

          </div>

        </div>

        <div className="student-stat-card">

          <div className="stat-icon">
            👧
          </div>

          <div>

            <p>
              Total Girls
            </p>

            <h2>
              {totalGirls}
            </h2>

          </div>

        </div>

      </div>

      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="student-tools">

        <div className="search-box">

          <span>
            🔎
          </span>

          <input
            type="text"
            placeholder="Search by name, father, admission no, roll, mobile, Aadhaar..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

          {search && (
            <button
              type="button"
              onClick={() =>
                setSearch("")
              }
            >
              ✕
            </button>
          )}

        </div>

      </div>

      {/* =================================================
          RESULT INFO
      ================================================= */}

      <div className="student-result-info">

        Showing{" "}

        <strong>
          {filteredStudents.length}
        </strong>

        {" "}of{" "}

        <strong>
          {students.length}
        </strong>

        {" "}students

        {classFilter !== "All" && (
          <>
            {" "}•{" "}

            <strong>
              {getClassDisplayName(
                classFilter
              )}
            </strong>
          </>
        )}

      </div>

      {/* =================================================
          STUDENTS TABLE
      ================================================= */}

      <div className="students-table">

        <div className="student-row table-heading">

          <span>
            Student
          </span>

          <span>
            Class
          </span>

          <span>
            Roll No.
          </span>

          <span>
            Parent Contact
          </span>

          <span>
            Status
          </span>

          <span>
            Action
          </span>

        </div>

        {/* LOADING */}

        {loading ? (
          <div className="no-students">

            <h3>
              Loading Students...
            </h3>

            <p>
              Loading data from MongoDB...
            </p>

          </div>
        ) : filteredStudents.length === 0 ? (

          /* NO DATA */

          <div className="no-students">

            <h3>
              No Students Found
            </h3>

            <p>
              Try another search or
              select another class.
            </p>

          </div>

        ) : (

          /* DATA */

          filteredStudents.map(
            (student) => (
              <div
                className="student-row"
                key={student.id}
              >

                <span className="student-name-cell">

                  <strong>
                    {student.name}
                  </strong>

                  <small>
                    Father:{" "}
                    {student.father ||
                      "Not Provided"}
                  </small>

                </span>

                <span>
                  {student.className ||
                    "—"}

                  {student.section
                    ? `-${student.section}`
                    : ""}
                </span>

                <span>
                  {student.roll ||
                    "—"}
                </span>

                <span>
                  {student.mobile ||
                    "—"}
                </span>

                <span>

                  <span
                    className={
                      student.status ===
                      "Active"
                        ? "active"
                        : "inactive"
                    }
                  >
                    {student.status ||
                      "Inactive"}
                  </span>

                </span>

                <span className="action-buttons">

                  {/* VIEW */}

                  <button
                    type="button"
                    title="View Student"
                    onClick={() =>
                      setViewStudent(
                        student
                      )
                    }
                  >
                    👁️
                  </button>

                  {/* EDIT */}

                  <button
                    type="button"
                    title="Edit Student"
                    onClick={() =>
                      openEditForm(
                        student
                      )
                    }
                  >
                    ✏️
                  </button>

                  {/* DELETE */}

                  <button
                    type="button"
                    title="Delete Student"
                    onClick={() =>
                      deleteStudent(
                        student.id
                      )
                    }
                  >
                    🗑️
                  </button>

                </span>

              </div>
            )
          )

        )}

      </div>

      {/* =================================================
          EDIT MODAL
      ================================================= */}

      {showForm && (
        <div
          className="modal-overlay"
          onClick={closeForm}
        >

          <div
            className="student-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* MODAL HEADER */}

            <div className="modal-header">

              <div>

                <h2>
                  Edit Student
                </h2>

                <p>
                  Update complete student
                  information
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

            {/* FORM */}

            <form
              onSubmit={
                handleSubmit
              }
            >

              <div className="form-grid">

                {/* NAME */}

                <div className="form-group">

                  <label>
                    Student Name *
                  </label>

                  <input
                    name="name"
                    value={form.name}
                    onChange={
                      handleChange
                    }
                    required
                  />

                </div>

                {/* FATHER */}

                <div className="form-group">

                  <label>
                    Father Name
                  </label>

                  <input
                    name="father"
                    value={
                      form.father
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

                {/* MOTHER */}

                <div className="form-group">

                  <label>
                    Mother Name
                  </label>

                  <input
                    name="mother"
                    value={
                      form.mother
                    }
                    onChange={
                      handleChange
                    }
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
                    value={
                      form.dob
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

                {/* GENDER */}

                <div className="form-group">

                  <label>
                    Gender
                  </label>

                  <select
                    name="gender"
                    value={
                      form.gender
                    }
                    onChange={
                      handleChange
                    }
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

                {/* BLOOD */}

                <div className="form-group">

                  <label>
                    Blood Group
                  </label>

                  <input
                    name="bloodGroup"
                    value={
                      form.bloodGroup
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

                {/* ADMISSION NUMBER */}

                <div className="form-group">

                  <label>
                    Admission Number
                  </label>

                  <input
                    name="admissionNo"
                    value={
                      form.admissionNo
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

                {/* ADMISSION TYPE */}

                <div className="form-group">

                  <label>
                    Admission Type
                  </label>

                  <select
                    name="admissionType"
                    value={
                      form.admissionType
                    }
                    onChange={
                      handleChange
                    }
                  >

                    <option value="New">
                      New
                    </option>

                    <option value="Old">
                      Old
                    </option>

                  </select>

                </div>

                {/* ADMISSION DATE */}

                <div className="form-group">

                  <label>
                    Admission Date
                  </label>

                  <input
                    type="date"
                    name="admissionDate"
                    value={
                      form.admissionDate
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

                {/* SESSION */}

                <div className="form-group">

                  <label>
                    Session
                  </label>

                  <input
                    name="session"
                    value={
                      form.session
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

                {/* CLASS */}

                <div className="form-group">

                  <label>
                    Class
                  </label>

                  <select
                    name="className"
                    value={
                      form.className
                    }
                    onChange={
                      handleChange
                    }
                  >

                    <option value="">
                      Select Class
                    </option>

                    {classes.map(
                      (className) => (
                        <option
                          key={
                            className
                          }
                          value={
                            className
                          }
                        >
                          {className}
                        </option>
                      )
                    )}

                  </select>

                </div>

                {/* SECTION */}

                <div className="form-group">

                  <label>
                    Section
                  </label>

                  <input
                    name="section"
                    value={
                      form.section
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

                {/* ROLL */}

                <div className="form-group">

                  <label>
                    Roll Number
                  </label>

                  <input
                    name="roll"
                    value={
                      form.roll
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

                {/* MOBILE */}

                <div className="form-group">

                  <label>
                    Parent Mobile
                  </label>

                  <input
                    name="mobile"
                    value={
                      form.mobile
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

                {/* ALTERNATE MOBILE */}

                <div className="form-group">

                  <label>
                    Alternate Mobile
                  </label>

                  <input
                    name="alternateMobile"
                    value={
                      form.alternateMobile
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

                {/* EMAIL */}

                <div className="form-group">

                  <label>
                    Email
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={
                      form.email
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

                {/* AADHAAR */}

                <div className="form-group">

                  <label>
                    Aadhaar
                  </label>

                  <input
                    name="aadhaar"
                    value={
                      form.aadhaar
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

                {/* PAN */}

                <div className="form-group">

                  <label>
                    PAN
                  </label>

                  <input
                    name="pan"
                    value={
                      form.pan
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

                {/* PEN */}

                <div className="form-group">

                  <label>
                    PEN Number
                  </label>

                  <input
                    name="penNo"
                    value={
                      form.penNo
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

                {/* PREVIOUS SCHOOL */}

                <div className="form-group">

                  <label>
                    Previous School
                  </label>

                  <input
                    name="previousSchool"
                    value={
                      form.previousSchool
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

                {/* RECEIPT */}

                <div className="form-group">

                  <label>
                    Receipt Number
                  </label>

                  <input
                    name="receiptNo"
                    value={
                      form.receiptNo
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

                {/* STATUS */}

                <div className="form-group">

                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={
                      form.status
                    }
                    onChange={
                      handleChange
                    }
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

                <div className="form-group full-width">

                  <label>
                    Address
                  </label>

                  <textarea
                    name="address"
                    value={
                      form.address
                    }
                    onChange={
                      handleChange
                    }
                    rows="3"
                  />

                </div>

              </div>

              {/* FORM ACTIONS */}

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
                  Update Student
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

      {/* =================================================
          VIEW STUDENT PROFILE
      ================================================= */}

      {viewStudent && (
        <div
          className="modal-overlay"
          onClick={() =>
            setViewStudent(null)
          }
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
                  ? viewStudent.name
                      .charAt(0)
                      .toUpperCase()
                  : "S"}

              </div>

              <div className="profile-main-info">

                <h2>
                  {viewStudent.name ||
                    "Student"}
                </h2>

                <p>
                  Class{" "}
                  {viewStudent.className ||
                    "—"}

                  {" • "}

                  Section{" "}
                  {viewStudent.section ||
                    "—"}

                  {" • "}

                  Roll No.{" "}
                  {viewStudent.roll ||
                    "—"}
                </p>

                <span className="profile-status">

                  ●{" "}

                  {viewStudent.status ||
                    "Active"}

                </span>

              </div>

            </div>

            {/* PROFILE CONTENT */}

            <div className="profile-content">

              {/* PERSONAL */}

              <ProfileSection
                icon="👤"
                title="Personal Information"
                subtitle="Basic student details"
              >

                <ProfileGrid>

                  <ProfileItem
                    label="Student Name"
                    value={
                      viewStudent.name
                    }
                  />

                  <ProfileItem
                    label="Father Name"
                    value={
                      viewStudent.father
                    }
                  />

                  <ProfileItem
                    label="Mother Name"
                    value={
                      viewStudent.mother
                    }
                  />

                  <ProfileItem
                    label="Date of Birth"
                    value={formatDate(
                      viewStudent.dob
                    )}
                  />

                  <ProfileItem
                    label="Gender"
                    value={
                      viewStudent.gender
                    }
                  />

                  <ProfileItem
                    label="Blood Group"
                    value={
                      viewStudent.bloodGroup
                    }
                  />

                </ProfileGrid>

              </ProfileSection>

              {/* ADMISSION */}

              <ProfileSection
                icon="🎓"
                title="Admission Information"
                subtitle="School admission details"
              >

                <ProfileGrid>

                  <ProfileItem
                    label="Admission Number"
                    value={
                      viewStudent.admissionNo
                    }
                  />

                  <ProfileItem
                    label="Admission Type"
                    value={
                      viewStudent.admissionType
                    }
                  />

                  <ProfileItem
                    label="Admission Date"
                    value={formatDate(
                      viewStudent.admissionDate
                    )}
                  />

                  <ProfileItem
                    label="Session"
                    value={
                      viewStudent.session
                    }
                  />

                  <ProfileItem
                    label="Previous School"
                    value={
                      viewStudent.previousSchool
                    }
                  />

                  <ProfileItem
                    label="Receipt Number"
                    value={
                      viewStudent.receiptNo
                    }
                  />

                </ProfileGrid>

              </ProfileSection>

              {/* ACADEMIC */}

              <ProfileSection
                icon="🏫"
                title="Academic Information"
                subtitle="Current academic details"
              >

                <ProfileGrid>

                  <ProfileItem
                    label="Class"
                    value={
                      viewStudent.className
                    }
                  />

                  <ProfileItem
                    label="Section"
                    value={
                      viewStudent.section
                    }
                  />

                  <ProfileItem
                    label="Roll Number"
                    value={
                      viewStudent.roll
                    }
                  />

                  <ProfileItem
                    label="Status"
                    value={
                      viewStudent.status
                    }
                  />

                </ProfileGrid>

              </ProfileSection>

              {/* IDENTITY */}

              <ProfileSection
                icon="🪪"
                title="Identity Information"
                subtitle="Government identity details"
              >

                <ProfileGrid>

                  <ProfileItem
                    label="Aadhaar Number"
                    value={
                      viewStudent.aadhaar
                    }
                  />

                  <ProfileItem
                    label="PAN Number"
                    value={
                      viewStudent.pan
                    }
                  />

                  <ProfileItem
                    label="PEN Number"
                    value={
                      viewStudent.penNo
                    }
                  />

                </ProfileGrid>

              </ProfileSection>

              {/* CONTACT */}

              <ProfileSection
                icon="📱"
                title="Contact Information"
                subtitle="Parent and student contact details"
              >

                <ProfileGrid>

                  <ProfileItem
                    label="Parent Mobile"
                    value={
                      viewStudent.mobile
                    }
                  />

                  <ProfileItem
                    label="Alternate Mobile"
                    value={
                      viewStudent.alternateMobile
                    }
                  />

                  <ProfileItem
                    label="Email"
                    value={
                      viewStudent.email
                    }
                  />

                  <ProfileItem
                    label="Address"
                    value={
                      viewStudent.address
                    }
                    full
                  />

                </ProfileGrid>

              </ProfileSection>

              {/* RECORD */}

              <ProfileSection
                icon="⚙️"
                title="Record Information"
                subtitle="Student record details"
              >

                <ProfileGrid>

                  <ProfileItem
                    label="Student ID"
                    value={
                      viewStudent.id
                    }
                  />

                  <ProfileItem
                    label="Created At"
                    value={formatDateTime(
                      viewStudent.createdAt
                    )}
                  />

                  <ProfileItem
                    label="Updated At"
                    value={formatDateTime(
                      viewStudent.updatedAt
                    )}
                  />

                </ProfileGrid>

              </ProfileSection>

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
                className="print-student-btn"
                onClick={() =>
                  printStudent(
                    viewStudent
                  )
                }
              >
                🖨️ Print Student
              </button>

              <button
                type="button"
                className="save-btn"
                onClick={() => {
                  const student =
                    viewStudent;

                  setViewStudent(null);

                  openEditForm(
                    student
                  );
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

// =====================================================
// PROFILE SECTION COMPONENT
// =====================================================

function ProfileSection({
  icon,
  title,
  subtitle,
  children,
}) {
  return (
    <div className="profile-section">

      <div className="profile-section-title">

        <span>
          {icon}
        </span>

        <div>

          <h3>
            {title}
          </h3>

          <p>
            {subtitle}
          </p>

        </div>

      </div>

      {children}

    </div>
  );
}

// =====================================================
// PROFILE GRID
// =====================================================

function ProfileGrid({ children }) {
  return (
    <div className="profile-grid">
      {children}
    </div>
  );
}

// =====================================================
// PROFILE ITEM
// =====================================================

function ProfileItem({
  label,
  value,
  full = false,
}) {
  return (
    <div
      className={`profile-item ${
        full
          ? "profile-full"
          : ""
      }`}
    >

      <label>
        {label}
      </label>

      <strong>
        {value ||
          "Not Provided"}
      </strong>

    </div>
  );
}

export default Students;