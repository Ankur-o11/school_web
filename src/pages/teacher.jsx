import { useEffect, useMemo, useState } from "react";
import "../Style/teachers.css";
import { useAuth } from "../context/AuthContext";

function Teachers() {
  const { fetchWithAuth } = useAuth();
  // =====================================================
  // SUBJECTS / CLASSES
  // =====================================================

  const subjects = [
    "Mathematics",
    "Science",
    "English",
    "Hindi",
    "Computer",
    "Physics",
    "Chemistry",
    "Biology",
    "Social Science",
    "Sanskrit",
  ];

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
  // EMPTY FORM
  // =====================================================

  const emptyForm = {
    name: "",
    father: "",
    mother: "",
    dob: "",
    gender: "",
    bloodGroup: "",

    employeeId: "",
    subject: "",
    department: "",
    designation: "",
    qualification: "",
    experience: "",
    previousSchool: "",

    mobile: "",
    alternateMobile: "",
    email: "",
    address: "",

    joiningDate: "",
    resigningDate: "",
    employmentType: "Permanent",
    status: "Active",

    isClassTeacher: false,
    classTeacherClass: "",
    classTeacherSection: "",

    teachingClasses: "",
    teacherSubjects: "",

    aadhaar: "",
    pan: "",
  };

  // =====================================================
  // API LOAD TEACHERS
  // =====================================================

  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadTeachers = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth("/teachers");
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      const data = await response.json();
      setTeachers(data.data || data.teachers || []);
    } catch (error) {
      console.error("Error loading teachers from API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  // =====================================================
  // STATES
  // =====================================================

  const [form, setForm] = useState(emptyForm);

  const [search, setSearch] = useState("");

  const [subjectFilter, setSubjectFilter] = useState("All");

  const [statusFilter, setStatusFilter] = useState("All");

  const [classFilter, setClassFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);

  const [editingId, setEditingId] = useState(null);

  const [viewTeacher, setViewTeacher] = useState(null);

  const [activeProfileTab, setActiveProfileTab] =
    useState("overview");

  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // =====================================================
  // OPEN ADD
  // =====================================================

  const openAddForm = () => {
    setForm({ ...emptyForm });
    setEditingId(null);
    setShowForm(true);
  };

  // =====================================================
  // OPEN EDIT
  // =====================================================

  const openEditForm = (teacher) => {
    setForm({
      ...emptyForm,
      ...teacher,
    });

    setEditingId(teacher.id);
    setShowForm(true);
  };

  // =====================================================
  // CLOSE FORM
  // =====================================================

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setForm({ ...emptyForm });
  };

  // =====================================================
  // SUBMIT
  // =====================================================

  const handleSubmit = async (e) => {
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

    try {
      if (editingId !== null) {
        const response = await fetchWithAuth(`/teachers/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to update teacher");
        }

        alert("Teacher updated successfully!");
      } else {
        const response = await fetchWithAuth("/teachers", {
          method: "POST",
          body: JSON.stringify(form),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to add teacher");
        }

        alert("Teacher added successfully!");
      }

      await loadTeachers();
      closeForm();
    } catch (error) {
      console.error("Teacher submit error:", error);
      alert(error.message || "Operation failed.");
    }
  };

  // =====================================================
  // DELETE
  // =====================================================

  const deleteTeacher = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this teacher?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetchWithAuth(`/teachers/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete teacher");
      }

      alert("Teacher deleted successfully!");
      await loadTeachers();

      if (viewTeacher?.id === id) {
        setViewTeacher(null);
      }
    } catch (error) {
      console.error("Teacher delete error:", error);
      alert(error.message || "Delete operation failed.");
    }
  };

  // =====================================================
  // FILTER
  // =====================================================

  const filteredTeachers = useMemo(() => {
    const text = search.trim().toLowerCase();

    return teachers.filter((teacher) => {
      const searchable = [
        teacher.name,
        teacher.subject,
        teacher.qualification,
        teacher.mobile,
        teacher.email,
        teacher.employeeId,
        teacher.department,
        teacher.designation,
        teacher.previousSchool,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        text === "" || searchable.includes(text);

      const matchesSubject =
        subjectFilter === "All" ||
        teacher.subject === subjectFilter;

      const matchesStatus =
        statusFilter === "All" ||
        teacher.status === statusFilter;

      const matchesClass =
        classFilter === "All" ||
        teacher.classTeacherClass === classFilter;

      return (
        matchesSearch &&
        matchesSubject &&
        matchesStatus &&
        matchesClass
      );
    });
  }, [
    teachers,
    search,
    subjectFilter,
    statusFilter,
    classFilter,
  ]);

  // =====================================================
  // STATISTICS
  // =====================================================

  const totalTeachers = teachers.length;

  const maleTeachers = teachers.filter(
    (teacher) =>
      String(teacher.gender).toLowerCase() === "male"
  ).length;

  const femaleTeachers = teachers.filter(
    (teacher) =>
      String(teacher.gender).toLowerCase() === "female"
  ).length;

  const activeTeachers = teachers.filter(
    (teacher) => teacher.status === "Active"
  ).length;

  const inactiveTeachers = teachers.filter(
    (teacher) => teacher.status !== "Active"
  ).length;

  // =====================================================
  // FORMAT DATE
  // =====================================================

  const formatDate = (value) => {
    if (!value) return "Not Provided";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return date.toLocaleDateString("en-IN");
  };

  // =====================================================
  // NUMBER FORMAT
  // =====================================================

  const money = (value) =>
    `₹${Number(value || 0).toLocaleString("en-IN")}`;

  // =====================================================
  // ATTENDANCE %
  // LEAVE NOT COUNTED AS ABSENT
  // =====================================================

  const getAttendancePercentage = (teacher) => {
    const workingDays =
      Number(teacher.attendance?.workingDays || 0);

    const present =
      Number(teacher.attendance?.present || 0);

    if (workingDays <= 0) return 0;

    return ((present / workingDays) * 100).toFixed(2);
  };

  // =====================================================
  // CLASS ATTENDANCE %
  // =====================================================

  const getClassAttendancePercentage = (teacher) => {
    const total =
      Number(
        teacher.classAttendance?.totalStudents || 0
      );

    const present =
      Number(
        teacher.classAttendance?.present || 0
      );

    if (total <= 0) return 0;

    return ((present / total) * 100).toFixed(2);
  };

  // =====================================================
  // FEES
  // =====================================================

  const getPendingFees = (teacher) => {
    const total =
      Number(teacher.fees?.totalFees || 0);

    const discount =
      Number(teacher.fees?.discount || 0);

    const collected =
      Number(teacher.fees?.collected || 0);

    return Math.max(
      0,
      total - discount - collected
    );
  };

  const getFeePercentage = (teacher) => {
    const total =
      Number(teacher.fees?.totalFees || 0);

    const discount =
      Number(teacher.fees?.discount || 0);

    const collected =
      Number(teacher.fees?.collected || 0);

    const payable = Math.max(
      0,
      total - discount
    );

    if (payable <= 0) return 0;

    return ((collected / payable) * 100).toFixed(2);
  };

  // =====================================================
  // PRINT TEACHER
  // =====================================================

  const printTeacher = (teacher) => {
    if (!teacher) return;

    const printWindow = window.open(
      "",
      "_blank",
      "width=950,height=900"
    );

    if (!printWindow) {
      alert(
        "Please allow pop-ups to print teacher profile."
      );
      return;
    }

    const safe = (value) =>
      value || "Not Provided";

    const attendance =
      getAttendancePercentage(teacher);

    const classAttendance =
      getClassAttendancePercentage(teacher);

    const feePercentage =
      getFeePercentage(teacher);

    const pendingFees =
      getPendingFees(teacher);

    const timetableRows =
      teacher.timetable
        ?.map(
          (item) => `
          <tr>
            <td>${safe(item.day)}</td>
            <td>${safe(item.period)}</td>
            <td>${safe(item.time)}</td>
            <td>
              ${
                item.className
                  ? `Class ${item.className}-${item.section}`
                  : "—"
              }
            </td>
            <td>${safe(item.subject)}</td>
            <td>${safe(item.status)}</td>
          </tr>
        `
        )
        .join("") || "";

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Teacher Profile - ${safe(
          teacher.name
        )}</title>

        <style>
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            font-family: Arial, Helvetica, sans-serif;
            color: #172033;
            background: white;
          }

          .page {
            width: 210mm;
            min-height: 297mm;
            margin: auto;
            padding: 12mm;
          }

          .header {
            text-align: center;
            border-bottom: 2px solid #172033;
            padding-bottom: 12px;
            margin-bottom: 18px;
          }

          .header h1 {
            margin: 0;
            font-size: 24px;
          }

          .header p {
            margin: 5px 0;
            font-size: 13px;
          }

          .title {
            text-align: center;
            margin: 15px 0;
          }

          .title h2 {
            margin: 0;
          }

          .teacher-top {
            display: flex;
            justify-content: space-between;
            border: 1px solid #444;
            padding: 12px;
            margin-bottom: 15px;
          }

          .teacher-name {
            font-size: 20px;
            font-weight: bold;
          }

          .class-teacher {
            margin-top: 5px;
            font-weight: bold;
          }

          .section {
            margin-top: 16px;
          }

          .section-title {
            background: #eeeeee;
            border: 1px solid #444;
            padding: 7px 10px;
            font-weight: bold;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          td, th {
            border: 1px solid #555;
            padding: 7px;
            font-size: 11px;
            text-align: left;
          }

          td.label {
            width: 22%;
            font-weight: bold;
            background: #fafafa;
          }

          .stats {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
          }

          .stat {
            border: 1px solid #555;
            padding: 8px;
            text-align: center;
          }

          .stat strong {
            display: block;
            font-size: 16px;
          }

          .footer {
            margin-top: 35px;
            display: flex;
            justify-content: space-between;
            font-size: 11px;
          }

          @page {
            size: A4;
            margin: 0;
          }
        </style>
      </head>

      <body>
        <div class="page">

          <div class="header">
            <h1>
              Maharana Pratap Science Academy
              Inter College
            </h1>

            <p>
              Teacher Management System
            </p>
          </div>

          <div class="title">
            <h2>TEACHER PROFILE</h2>
          </div>

          <div class="teacher-top">
            <div>
              <div class="teacher-name">
                ${safe(teacher.name)}
              </div>

              <div>
                Employee ID:
                ${safe(teacher.employeeId)}
              </div>

              <div>
                ${safe(teacher.designation)}
                •
                ${safe(teacher.subject)}
              </div>

              <div class="class-teacher">
                ${
                  teacher.isClassTeacher
                    ? `Class Teacher: Class ${safe(
                        teacher.classTeacherClass
                      )}-${safe(
                        teacher.classTeacherSection
                      )}`
                    : "Class Teacher: Not Assigned"
                }
              </div>
            </div>

            <div>
              <strong>Status:</strong>
              ${safe(teacher.status)}
            </div>
          </div>

          <div class="section">
            <div class="section-title">
              Personal Information
            </div>

            <table>
              <tr>
                <td class="label">Teacher Name</td>
                <td>${safe(teacher.name)}</td>
                <td class="label">Gender</td>
                <td>${safe(teacher.gender)}</td>
              </tr>

              <tr>
                <td class="label">Father Name</td>
                <td>${safe(teacher.father)}</td>
                <td class="label">Mother Name</td>
                <td>${safe(teacher.mother)}</td>
              </tr>

              <tr>
                <td class="label">DOB</td>
                <td>${formatDate(teacher.dob)}</td>
                <td class="label">Blood Group</td>
                <td>${safe(teacher.bloodGroup)}</td>
              </tr>
            </table>
          </div>

          <div class="section">
            <div class="section-title">
              Professional Information
            </div>

            <table>
              <tr>
                <td class="label">Employee ID</td>
                <td>${safe(teacher.employeeId)}</td>
                <td class="label">Designation</td>
                <td>${safe(teacher.designation)}</td>
              </tr>

              <tr>
                <td class="label">Department</td>
                <td>${safe(teacher.department)}</td>
                <td class="label">Subject</td>
                <td>${safe(teacher.subject)}</td>
              </tr>

              <tr>
                <td class="label">Qualification</td>
                <td>${safe(teacher.qualification)}</td>
                <td class="label">Experience</td>
                <td>${safe(teacher.experience)}</td>
              </tr>

              <tr>
                <td class="label">Previous School</td>
                <td colspan="3">
                  ${safe(teacher.previousSchool)}
                </td>
              </tr>
            </table>
          </div>

          <div class="section">
            <div class="section-title">
              Joining Information
            </div>

            <table>
              <tr>
                <td class="label">Joining Date</td>
                <td>${formatDate(
                  teacher.joiningDate
                )}</td>

                <td class="label">Resigning Date</td>
                <td>${formatDate(
                  teacher.resigningDate
                )}</td>
              </tr>

              <tr>
                <td class="label">Employment Type</td>
                <td>${safe(
                  teacher.employmentType
                )}</td>

                <td class="label">Status</td>
                <td>${safe(teacher.status)}</td>
              </tr>
            </table>
          </div>

          <div class="section">
            <div class="section-title">
              Attendance Summary
            </div>

            <div class="stats">
              <div class="stat">
                Working Days
                <strong>
                  ${teacher.attendance?.workingDays || 0}
                </strong>
              </div>

              <div class="stat">
                Present
                <strong>
                  ${teacher.attendance?.present || 0}
                </strong>
              </div>

              <div class="stat">
                Absent
                <strong>
                  ${teacher.attendance?.absent || 0}
                </strong>
              </div>

              <div class="stat">
                Leave
                <strong>
                  ${teacher.attendance?.leave || 0}
                </strong>
              </div>
            </div>

            <p>
              Attendance Percentage:
              <strong>${attendance}%</strong>
            </p>
          </div>

          ${
            teacher.isClassTeacher
              ? `
                <div class="section">
                  <div class="section-title">
                    Class Teacher & Class Attendance
                  </div>

                  <table>
                    <tr>
                      <td class="label">Class</td>
                      <td>
                        Class ${safe(
                          teacher.classAttendance?.className
                        )}-${safe(
                          teacher.classAttendance?.section
                        )}
                      </td>

                      <td class="label">Students</td>
                      <td>
                        ${
                          teacher.classAttendance
                            ?.totalStudents || 0
                        }
                      </td>
                    </tr>

                    <tr>
                      <td class="label">Present</td>
                      <td>
                        ${
                          teacher.classAttendance?.present ||
                          0
                        }
                      </td>

                      <td class="label">Absent</td>
                      <td>
                        ${
                          teacher.classAttendance?.absent ||
                          0
                        }
                      </td>
                    </tr>

                    <tr>
                      <td class="label">
                        Class Attendance
                      </td>

                      <td colspan="3">
                        ${classAttendance}%
                      </td>
                    </tr>
                  </table>
                </div>
              `
              : ""
          }

          <div class="section">
            <div class="section-title">
              Fees Summary of Assigned Class
            </div>

            <table>
              <tr>
                <td class="label">Total Fees</td>
                <td>${money(
                  teacher.fees?.totalFees
                )}</td>

                <td class="label">Discount</td>
                <td>${money(
                  teacher.fees?.discount
                )}</td>
              </tr>

              <tr>
                <td class="label">Collected</td>
                <td>${money(
                  teacher.fees?.collected
                )}</td>

                <td class="label">Pending</td>
                <td>${money(pendingFees)}</td>
              </tr>

              <tr>
                <td class="label">
                  Collection Percentage
                </td>

                <td colspan="3">
                  ${feePercentage}%
                </td>
              </tr>
            </table>
          </div>

          <div class="section">
            <div class="section-title">
              Complete Timetable
            </div>

            <table>
              <tr>
                <th>Day</th>
                <th>Period</th>
                <th>Time</th>
                <th>Class</th>
                <th>Subject</th>
                <th>Status</th>
              </tr>

              ${timetableRows}
            </table>
          </div>

          <div class="footer">
            <span>
              Teacher Record
            </span>

            <span>
              Generated:
              ${new Date().toLocaleDateString("en-IN")}
            </span>
          </div>

        </div>
      </body>
      </html>
    `);

    printWindow.document.close();

    printWindow.onload = () => {
      printWindow.focus();
      printWindow.print();
    };
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="teachers-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="teachers-header">

        <div className="teachers-header-left">

          <div className="teachers-header-icon">
            👨‍🏫
          </div>

          <div>
            <div className="teachers-breadcrumb">
              School Management / Teachers
            </div>

            <h1>Teachers</h1>

            <p>
              Complete teacher records of
              Maharana Pratap Science Academy
              Inter College
            </p>
          </div>

        </div>

        <div className="teachers-header-right">

          <div className="header-record-box">
            <span>📚</span>

            <div>
              <small>Total Records</small>
              <strong>{totalTeachers}</strong>
            </div>
          </div>

          <button
            className="teacher-add-btn"
            onClick={openAddForm}
          >
            <span>＋</span>
            Add Teacher
          </button>

        </div>

      </div>

      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="teacher-stats">

        <div className="teacher-stat-card total">

          <div className="teacher-stat-icon">
            👨‍🏫
          </div>

          <div>
            <p>Total Teachers</p>
            <h2>{totalTeachers}</h2>
          </div>

        </div>

        <div className="teacher-stat-card male">

          <div className="teacher-stat-icon">
            👨
          </div>

          <div>
            <p>Male Teachers</p>
            <h2>{maleTeachers}</h2>
          </div>

        </div>

        <div className="teacher-stat-card female">

          <div className="teacher-stat-icon">
            👩
          </div>

          <div>
            <p>Female Teachers</p>
            <h2>{femaleTeachers}</h2>
          </div>

        </div>

        <div className="teacher-stat-card active">

          <div className="teacher-stat-icon">
            🟢
          </div>

          <div>
            <p>Active Teachers</p>
            <h2>{activeTeachers}</h2>
          </div>

        </div>

        <div className="teacher-stat-card inactive">

          <div className="teacher-stat-icon">
            ⚪
          </div>

          <div>
            <p>Inactive Teachers</p>
            <h2>{inactiveTeachers}</h2>
          </div>

        </div>

      </div>

      {/* =================================================
          FILTERS
      ================================================= */}

      <div className="teacher-filter-card">

        <div className="teacher-search">

          <span>🔎</span>

          <input
            type="text"
            placeholder="Search teacher, employee ID, subject, mobile..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

          {search && (
            <button
              onClick={() => setSearch("")}
              type="button"
            >
              ✕
            </button>
          )}

        </div>

        <div className="teacher-filter">

          <label>Subject</label>

          <select
            value={subjectFilter}
            onChange={(e) =>
              setSubjectFilter(e.target.value)
            }
          >
            <option value="All">
              All Subjects
            </option>

            {subjects.map((subject) => (
              <option
                key={subject}
                value={subject}
              >
                {subject}
              </option>
            ))}
          </select>

        </div>

        <div className="teacher-filter">

          <label>Status</label>

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="All">
              All Status
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>
          </select>

        </div>

        <div className="teacher-filter">

          <label>Class Teacher</label>

          <select
            value={classFilter}
            onChange={(e) =>
              setClassFilter(e.target.value)
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
                {className === "PG" ||
                className === "Nursery"
                  ? className
                  : `Class ${className}`}
              </option>
            ))}
          </select>

        </div>

      </div>

      {/* RESULT INFO */}

      <div className="teacher-result-info">

        Showing{" "}
        <strong>
          {filteredTeachers.length}
        </strong>{" "}
        of{" "}
        <strong>
          {teachers.length}
        </strong>{" "}
        teachers

      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="teachers-table">

        <div className="teacher-table-row teacher-table-heading">

          <span>Teacher</span>
          <span>Employee ID</span>
          <span>Subject</span>
          <span>Class Teacher</span>
          <span>Mobile</span>
          <span>Status</span>
          <span>Action</span>

        </div>

        {filteredTeachers.length === 0 ? (

          <div className="teacher-empty">

            <div>
              👨‍🏫
            </div>

            <h3>
              No Teachers Found
            </h3>

            <p>
              Try another search or filter.
            </p>

          </div>

        ) : (

          filteredTeachers.map((teacher) => (

            <div
              className="teacher-table-row"
              key={teacher.id}
            >

              <span className="teacher-name-cell">

                <div className="teacher-small-avatar">
                  {teacher.name
                    ?.charAt(0)
                    .toUpperCase()}
                </div>

                <div>
                  <strong>
                    {teacher.name}
                  </strong>

                  <small>
                    {teacher.designation ||
                      "Teacher"}
                  </small>
                </div>

              </span>

              <span>
                <strong className="employee-id">
                  {teacher.employeeId ||
                    "—"}
                </strong>
              </span>

              <span>

                <strong>
                  {teacher.subject ||
                    "—"}
                </strong>

                <small className="table-subtext">
                  {teacher.qualification ||
                    ""}
                </small>

              </span>

              <span>

                {teacher.isClassTeacher ? (

                  <span className="class-teacher-badge">
                    Class{" "}
                    {teacher.classTeacherClass}-
                    {teacher.classTeacherSection}
                  </span>

                ) : (

                  <span className="not-assigned">
                    Not Assigned
                  </span>

                )}

              </span>

              <span>
                {teacher.mobile || "—"}
              </span>

              <span>

                <span
                  className={
                    teacher.status === "Active"
                      ? "teacher-status active"
                      : "teacher-status inactive"
                  }
                >
                  ● {teacher.status}
                </span>

              </span>

              <span className="teacher-actions">

                <button
                  type="button"
                  title="View Teacher"
                  onClick={() => {
                    setActiveProfileTab(
                      "overview"
                    );
                    setViewTeacher(teacher);
                  }}
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
                  title="Print Teacher"
                  onClick={() =>
                    printTeacher(teacher)
                  }
                >
                  🖨️
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

      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {showForm && (

        <div
          className="teacher-modal-overlay"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget
            ) {
              closeForm();
            }
          }}
        >

          <div className="teacher-form-modal">

            <div className="teacher-form-header">

              <div>

                <div className="form-header-icon">
                  👨‍🏫
                </div>

                <div>
                  <h2>
                    {editingId !== null
                      ? "Edit Teacher"
                      : "Add New Teacher"}
                  </h2>

                  <p>
                    Enter complete teacher
                    information
                  </p>
                </div>

              </div>

              <button
                type="button"
                className="teacher-close-btn"
                onClick={closeForm}
              >
                ✕
              </button>

            </div>

            <form
              onSubmit={handleSubmit}
              className="teacher-form"
            >

              {/* PERSONAL */}

              <div className="form-section-title">
                <span>👤</span>

                <div>
                  <h3>
                    Personal Information
                  </h3>

                  <p>
                    Basic teacher details
                  </p>
                </div>
              </div>

              <div className="teacher-form-grid">

                <FormInput
                  label="Teacher Name *"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                />

                <FormInput
                  label="Father Name"
                  name="father"
                  value={form.father}
                  onChange={handleChange}
                  placeholder="Father name"
                />

                <FormInput
                  label="Mother Name"
                  name="mother"
                  value={form.mother}
                  onChange={handleChange}
                  placeholder="Mother name"
                />

                <FormInput
                  label="Date of Birth"
                  type="date"
                  name="dob"
                  value={form.dob}
                  onChange={handleChange}
                />

                <FormSelect
                  label="Gender"
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  options={[
                    "Male",
                    "Female",
                    "Other",
                  ]}
                />

                <FormInput
                  label="Blood Group"
                  name="bloodGroup"
                  value={form.bloodGroup}
                  onChange={handleChange}
                  placeholder="e.g. B+"
                />

              </div>

              {/* PROFESSIONAL */}

              <div className="form-section-title">
                <span>🎓</span>

                <div>
                  <h3>
                    Professional Information
                  </h3>

                  <p>
                    Qualification and teaching
                    details
                  </p>
                </div>
              </div>

              <div className="teacher-form-grid">

                <FormInput
                  label="Employee ID"
                  name="employeeId"
                  value={form.employeeId}
                  onChange={handleChange}
                  placeholder="e.g. MPSA-T004"
                />

                <FormSelect
                  label="Subject *"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  options={subjects}
                />

                <FormInput
                  label="Department"
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  placeholder="e.g. Mathematics"
                />

                <FormInput
                  label="Designation"
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                  placeholder="e.g. PGT / TGT / PRT"
                />

                <FormInput
                  label="Qualification *"
                  name="qualification"
                  value={form.qualification}
                  onChange={handleChange}
                  placeholder="e.g. M.Sc Mathematics"
                />

                <FormInput
                  label="Experience"
                  name="experience"
                  value={form.experience}
                  onChange={handleChange}
                  placeholder="e.g. 8 Years"
                />

                <FormInput
                  label="Previous School / College"
                  name="previousSchool"
                  value={form.previousSchool}
                  onChange={handleChange}
                  placeholder="Where did the teacher teach before?"
                  full
                />

              </div>

              {/* CONTACT */}

              <div className="form-section-title">
                <span>📱</span>

                <div>
                  <h3>
                    Contact Information
                  </h3>

                  <p>
                    Contact and address
                  </p>
                </div>
              </div>

              <div className="teacher-form-grid">

                <FormInput
                  label="Mobile *"
                  name="mobile"
                  value={form.mobile}
                  onChange={handleChange}
                  placeholder="10 digit mobile"
                />

                <FormInput
                  label="Alternate Mobile"
                  name="alternateMobile"
                  value={form.alternateMobile}
                  onChange={handleChange}
                  placeholder="Alternate number"
                />

                <FormInput
                  label="Email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="teacher@mpsa.edu.in"
                />

                <FormInput
                  label="Aadhaar"
                  name="aadhaar"
                  value={form.aadhaar}
                  onChange={handleChange}
                  placeholder="Aadhaar number"
                />

                <FormInput
                  label="PAN"
                  name="pan"
                  value={form.pan}
                  onChange={handleChange}
                  placeholder="PAN number"
                />

                <div className="form-group full">
                  <label>
                    Address
                  </label>

                  <textarea
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Complete address"
                  />
                </div>

              </div>

              {/* JOINING */}

              <div className="form-section-title">
                <span>📅</span>

                <div>
                  <h3>
                    Employment Information
                  </h3>

                  <p>
                    Joining, resignation and
                    employment status
                  </p>
                </div>
              </div>

              <div className="teacher-form-grid">

                <FormInput
                  label="Joining Date"
                  type="date"
                  name="joiningDate"
                  value={form.joiningDate}
                  onChange={handleChange}
                />

                <FormInput
                  label="Resigning Date"
                  type="date"
                  name="resigningDate"
                  value={form.resigningDate}
                  onChange={handleChange}
                />

                <FormSelect
                  label="Employment Type"
                  name="employmentType"
                  value={form.employmentType}
                  onChange={handleChange}
                  options={[
                    "Permanent",
                    "Temporary",
                    "Guest",
                    "Contract",
                  ]}
                />

                <FormSelect
                  label="Status"
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  options={[
                    "Active",
                    "Inactive",
                  ]}
                />

              </div>

              {/* CLASS TEACHER */}

              <div className="form-section-title">
                <span>🏫</span>

                <div>
                  <h3>
                    School Assignment
                  </h3>

                  <p>
                    Class teacher and teaching
                    assignment
                  </p>
                </div>
              </div>

              <div className="teacher-assignment-box">

                <label className="checkbox-row">

                  <input
                    type="checkbox"
                    name="isClassTeacher"
                    checked={
                      form.isClassTeacher
                    }
                    onChange={handleChange}
                  />

                  <span>
                    This teacher is a Class
                    Teacher
                  </span>

                </label>

                {form.isClassTeacher && (

                  <div className="teacher-form-grid">

                    <FormSelect
                      label="Class Teacher Class"
                      name="classTeacherClass"
                      value={
                        form.classTeacherClass
                      }
                      onChange={handleChange}
                      options={classes}
                    />

                    <FormInput
                      label="Section"
                      name="classTeacherSection"
                      value={
                        form.classTeacherSection
                      }
                      onChange={handleChange}
                      placeholder="A / B / C"
                    />

                  </div>

                )}

              </div>

              <div className="teacher-form-grid">

                <FormInput
                  label="Teaching Classes"
                  name="teachingClasses"
                  value={form.teachingClasses}
                  onChange={handleChange}
                  placeholder="e.g. 7, 8, 9, 10"
                  full
                />

                <FormInput
                  label="Teaching Subjects"
                  name="teacherSubjects"
                  value={form.teacherSubjects}
                  onChange={handleChange}
                  placeholder="e.g. Mathematics, Science"
                  full
                />

              </div>

              {/* ACTION */}

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
                    ? "✓ Update Teacher"
                    : "✓ Save Teacher"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =================================================
          VIEW PROFILE MODAL
      ================================================= */}

      {viewTeacher && (

        <div
          className="teacher-modal-overlay"
          onClick={() =>
            setViewTeacher(null)
          }
        >

          <div
            className="teacher-profile-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* PROFILE HEADER */}

            <div className="teacher-profile-header">

              <button
                type="button"
                className="profile-close"
                onClick={() =>
                  setViewTeacher(null)
                }
              >
                ✕
              </button>

              <div className="profile-avatar">
                {viewTeacher.name
                  ?.charAt(0)
                  .toUpperCase()}
              </div>

              <div className="profile-header-info">

                <div className="profile-role">
                  {viewTeacher.designation ||
                    "Teacher"}
                </div>

                <h2>
                  {viewTeacher.name}
                </h2>

                <p>
                  {viewTeacher.subject ||
                    "Subject Not Assigned"}
                  {" • "}
                  Employee ID:{" "}
                  {viewTeacher.employeeId ||
                    "—"}
                </p>

                <div className="profile-class-teacher">

                  {viewTeacher.isClassTeacher ? (
                    <>
                      🏫 Class Teacher:
                      <strong>
                        {" "}
                        Class{" "}
                        {
                          viewTeacher.classTeacherClass
                        }
                        -
                        {
                          viewTeacher.classTeacherSection
                        }
                      </strong>
                    </>
                  ) : (
                    <>
                      🏫 Class Teacher:
                      <strong>
                        {" "}
                        Not Assigned
                      </strong>
                    </>
                  )}

                </div>

                <span
                  className={
                    viewTeacher.status ===
                    "Active"
                      ? "profile-status active"
                      : "profile-status inactive"
                  }
                >
                  ● {viewTeacher.status}
                </span>

              </div>

            </div>

            {/* PROFILE TABS */}

            <div className="profile-tabs">

              <button
                className={
                  activeProfileTab ===
                  "overview"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveProfileTab(
                    "overview"
                  )
                }
              >
                👤 Overview
              </button>

              <button
                className={
                  activeProfileTab ===
                  "attendance"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveProfileTab(
                    "attendance"
                  )
                }
              >
                📊 Attendance
              </button>

              <button
                className={
                  activeProfileTab ===
                  "timetable"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveProfileTab(
                    "timetable"
                  )
                }
              >
                🕐 Timetable
              </button>

              <button
                className={
                  activeProfileTab ===
                  "urgent"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveProfileTab(
                    "urgent"
                  )
                }
              >
                🔄 Urgement
              </button>

              <button
                className={
                  activeProfileTab ===
                  "fees"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setActiveProfileTab(
                    "fees"
                  )
                }
              >
                💰 Fees
              </button>

            </div>

            {/* PROFILE CONTENT */}

            <div className="teacher-profile-content">

              {activeProfileTab ===
                "overview" && (

                <>
                  <ProfileSection
                    icon="👤"
                    title="Personal Information"
                    subtitle="Basic teacher details"
                  >
                    <ProfileGrid>

                      <ProfileItem
                        label="Teacher Name"
                        value={
                          viewTeacher.name
                        }
                      />

                      <ProfileItem
                        label="Father Name"
                        value={
                          viewTeacher.father
                        }
                      />

                      <ProfileItem
                        label="Mother Name"
                        value={
                          viewTeacher.mother
                        }
                      />

                      <ProfileItem
                        label="Date of Birth"
                        value={formatDate(
                          viewTeacher.dob
                        )}
                      />

                      <ProfileItem
                        label="Gender"
                        value={
                          viewTeacher.gender
                        }
                      />

                      <ProfileItem
                        label="Blood Group"
                        value={
                          viewTeacher.bloodGroup
                        }
                      />

                    </ProfileGrid>
                  </ProfileSection>

                  <ProfileSection
                    icon="🎓"
                    title="Professional Information"
                    subtitle="Qualification and teaching profile"
                  >
                    <ProfileGrid>

                      <ProfileItem
                        label="Employee ID"
                        value={
                          viewTeacher.employeeId
                        }
                      />

                      <ProfileItem
                        label="Designation"
                        value={
                          viewTeacher.designation
                        }
                      />

                      <ProfileItem
                        label="Department"
                        value={
                          viewTeacher.department
                        }
                      />

                      <ProfileItem
                        label="Subject"
                        value={
                          viewTeacher.subject
                        }
                      />

                      <ProfileItem
                        label="Qualification"
                        value={
                          viewTeacher.qualification
                        }
                      />

                      <ProfileItem
                        label="Experience"
                        value={
                          viewTeacher.experience
                        }
                      />

                      <ProfileItem
                        label="Previous School / College"
                        value={
                          viewTeacher.previousSchool
                        }
                        full
                      />

                    </ProfileGrid>
                  </ProfileSection>

                  <ProfileSection
                    icon="📅"
                    title="Employment Information"
                    subtitle="Joining and employment details"
                  >
                    <ProfileGrid>

                      <ProfileItem
                        label="Joining Date"
                        value={formatDate(
                          viewTeacher.joiningDate
                        )}
                      />

                      <ProfileItem
                        label="Resigning Date"
                        value={formatDate(
                          viewTeacher.resigningDate
                        )}
                      />

                      <ProfileItem
                        label="Employment Type"
                        value={
                          viewTeacher.employmentType
                        }
                      />

                      <ProfileItem
                        label="Status"
                        value={
                          viewTeacher.status
                        }
                      />

                    </ProfileGrid>
                  </ProfileSection>

                  <ProfileSection
                    icon="📱"
                    title="Contact Information"
                    subtitle="Teacher contact details"
                  >
                    <ProfileGrid>

                      <ProfileItem
                        label="Mobile"
                        value={
                          viewTeacher.mobile
                        }
                      />

                      <ProfileItem
                        label="Alternate Mobile"
                        value={
                          viewTeacher.alternateMobile
                        }
                      />

                      <ProfileItem
                        label="Email"
                        value={
                          viewTeacher.email
                        }
                      />

                      <ProfileItem
                        label="Address"
                        value={
                          viewTeacher.address
                        }
                        full
                      />

                    </ProfileGrid>
                  </ProfileSection>

                  <ProfileSection
                    icon="🏫"
                    title="School Assignment"
                    subtitle="Teaching and class teacher assignment"
                  >
                    <ProfileGrid>

                      <ProfileItem
                        label="Class Teacher"
                        value={
                          viewTeacher.isClassTeacher
                            ? `Class ${viewTeacher.classTeacherClass}-${viewTeacher.classTeacherSection}`
                            : "Not Assigned"
                        }
                      />

                      <ProfileItem
                        label="Teaching Classes"
                        value={
                          viewTeacher.teachingClasses
                        }
                      />

                      <ProfileItem
                        label="Teaching Subjects"
                        value={
                          viewTeacher.teacherSubjects
                        }
                        full
                      />

                    </ProfileGrid>
                  </ProfileSection>
                </>
              )}

              {/* ATTENDANCE */}

              {activeProfileTab ===
                "attendance" && (

                <>

                  <ProfileSection
                    icon="📊"
                    title="Teacher Attendance"
                    subtitle="Leave is kept separate and is not counted as absence"
                  >

                    <div className="attendance-summary-grid">

                      <SummaryCard
                        label="Working Days"
                        value={
                          viewTeacher.attendance
                            ?.workingDays || 0
                        }
                        icon="📅"
                      />

                      <SummaryCard
                        label="Present"
                        value={
                          viewTeacher.attendance
                            ?.present || 0
                        }
                        icon="✅"
                      />

                      <SummaryCard
                        label="Absent"
                        value={
                          viewTeacher.attendance
                            ?.absent || 0
                        }
                        icon="❌"
                      />

                      <SummaryCard
                        label="Leave"
                        value={
                          viewTeacher.attendance
                            ?.leave || 0
                        }
                        icon="🏖️"
                      />

                    </div>

                    <div className="percentage-card">

                      <div>
                        <span>
                          Teacher Attendance
                        </span>

                        <strong>
                          {getAttendancePercentage(
                            viewTeacher
                          )}
                          %
                        </strong>
                      </div>

                      <div className="progress">
                        <span
                          style={{
                            width: `${Math.min(
                              100,
                              getAttendancePercentage(
                                viewTeacher
                              )
                            )}%`,
                          }}
                        />
                      </div>

                    </div>

                  </ProfileSection>

                  {viewTeacher.isClassTeacher && (

                    <ProfileSection
                      icon="🏫"
                      title="Class Attendance"
                      subtitle="Attendance of the assigned class"
                    >

                      <div className="class-attendance-card">

                        <div>
                          <small>
                            Class Teacher
                          </small>

                          <h3>
                            Class{" "}
                            {
                              viewTeacher.classAttendance
                                ?.className
                            }
                            -
                            {
                              viewTeacher.classAttendance
                                ?.section
                            }
                          </h3>
                        </div>

                        <div className="class-attendance-stats">

                          <div>
                            <small>
                              Total Students
                            </small>
                            <strong>
                              {
                                viewTeacher
                                  .classAttendance
                                  ?.totalStudents ||
                                0
                              }
                            </strong>
                          </div>

                          <div>
                            <small>
                              Present
                            </small>
                            <strong>
                              {
                                viewTeacher
                                  .classAttendance
                                  ?.present ||
                                0
                              }
                            </strong>
                          </div>

                          <div>
                            <small>
                              Absent
                            </small>
                            <strong>
                              {
                                viewTeacher
                                  .classAttendance
                                  ?.absent ||
                                0
                              }
                            </strong>
                          </div>

                          <div>
                            <small>
                              Attendance
                            </small>
                            <strong>
                              {getClassAttendancePercentage(
                                viewTeacher
                              )}
                              %
                            </strong>
                          </div>

                        </div>

                        <div className="progress">
                          <span
                            style={{
                              width: `${Math.min(
                                100,
                                getClassAttendancePercentage(
                                  viewTeacher
                                )
                              )}%`,
                            }}
                          />
                        </div>

                      </div>

                    </ProfileSection>

                  )}

                </>
              )}

              {/* TIMETABLE */}

              {activeProfileTab ===
                "timetable" && (

                <ProfileSection
                  icon="🕐"
                  title="Complete Timetable"
                  subtitle="All assigned and free periods"
                >

                  {viewTeacher.timetable?.length ? (

                    <div className="timetable-wrapper">

                      <table className="teacher-timetable">

                        <thead>
                          <tr>
                            <th>Day</th>
                            <th>Period</th>
                            <th>Time</th>
                            <th>Class</th>
                            <th>Subject</th>
                            <th>Status</th>
                          </tr>
                        </thead>

                        <tbody>

                          {viewTeacher.timetable.map(
                            (item, index) => (

                              <tr key={index}>

                                <td>
                                  <strong>
                                    {item.day}
                                  </strong>
                                </td>

                                <td>
                                  {item.period}
                                </td>

                                <td>
                                  {item.time}
                                </td>

                                <td>
                                  {item.className ? (
                                    `Class ${item.className}-${item.section}`
                                  ) : (
                                    "—"
                                  )}
                                </td>

                                <td>
                                  {item.subject ||
                                    "—"}
                                </td>

                                <td>

                                  {item.status ===
                                  "Free" ? (

                                    <span className="free-badge">
                                      ● Free Period
                                    </span>

                                  ) : (

                                    <span className="assigned-badge">
                                      ● Assigned
                                    </span>

                                  )}

                                </td>

                              </tr>

                            )
                          )}

                        </tbody>

                      </table>

                    </div>

                  ) : (

                    <div className="profile-empty">
                      🕐
                      <h3>
                        No Timetable Assigned
                      </h3>
                      <p>
                        Timetable will appear here
                        after assignment.
                      </p>
                    </div>

                  )}

                </ProfileSection>
              )}

              {/* URGENT */}

              {activeProfileTab ===
                "urgent" && (

                <ProfileSection
                  icon="🔄"
                  title="Urgement / Substitute Duties"
                  subtitle="Periods where this teacher is covering another teacher"
                >

                  {viewTeacher.urgentDuties?.length ? (

                    <div className="urgent-table-wrapper">

                      <table className="urgent-table">

                        <thead>
                          <tr>
                            <th>Date</th>
                            <th>Period</th>
                            <th>Class</th>
                            <th>Subject</th>
                            <th>For Teacher</th>
                          </tr>
                        </thead>

                        <tbody>

                          {viewTeacher.urgentDuties.map(
                            (item, index) => (

                              <tr key={index}>

                                <td>
                                  {formatDate(
                                    item.date
                                  )}
                                </td>

                                <td>
                                  Period{" "}
                                  {item.period}
                                </td>

                                <td>
                                  Class{" "}
                                  {item.className}-
                                  {item.section}
                                </td>

                                <td>
                                  {item.subject}
                                </td>

                                <td>
                                  <strong>
                                    {
                                      item.originalTeacher
                                    }
                                  </strong>
                                </td>

                              </tr>

                            )
                          )}

                        </tbody>

                      </table>

                    </div>

                  ) : (

                    <div className="profile-empty">
                      🔄
                      <h3>
                        No Urgement Duties
                      </h3>
                      <p>
                        No substitute periods
                        assigned.
                      </p>
                    </div>

                  )}

                </ProfileSection>
              )}

              {/* FEES */}

              {activeProfileTab ===
                "fees" && (

                <ProfileSection
                  icon="💰"
                  title="Assigned Class Fees Summary"
                  subtitle="Overall fee collection of the assigned class"
                >

                  <div className="fees-summary-grid">

                    <SummaryCard
                      label="Total Fees"
                      value={money(
                        viewTeacher.fees
                          ?.totalFees
                      )}
                      icon="💰"
                    />

                    <SummaryCard
                      label="Discount"
                      value={money(
                        viewTeacher.fees
                          ?.discount
                      )}
                      icon="🏷️"
                    />

                    <SummaryCard
                      label="Collected"
                      value={money(
                        viewTeacher.fees
                          ?.collected
                      )}
                      icon="✅"
                    />

                    <SummaryCard
                      label="Pending"
                      value={money(
                        getPendingFees(
                          viewTeacher
                        )
                      )}
                      icon="⏳"
                    />

                  </div>

                  <div className="fee-percentage-box">

                    <div>
                      <span>
                        Overall Collection
                      </span>

                      <strong>
                        {getFeePercentage(
                          viewTeacher
                        )}
                        %
                      </strong>
                    </div>

                    <div className="progress">
                      <span
                        style={{
                          width: `${Math.min(
                            100,
                            getFeePercentage(
                              viewTeacher
                            )
                          )}%`,
                        }}
                      />
                    </div>

                  </div>

                </ProfileSection>
              )}

            </div>

            {/* PROFILE ACTIONS */}

            <div className="teacher-profile-actions">

              <button
                type="button"
                className="teacher-cancel-btn"
                onClick={() =>
                  setViewTeacher(null)
                }
              >
                Close
              </button>

              <button
                type="button"
                className="teacher-print-btn"
                onClick={() =>
                  printTeacher(viewTeacher)
                }
              >
                🖨️ Print Teacher
              </button>

              <button
                type="button"
                className="teacher-save-btn"
                onClick={() => {
                  const teacher =
                    viewTeacher;

                  setViewTeacher(null);

                  openEditForm(teacher);
                }}
              >
                ✏️ Edit Teacher
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

// =====================================================
// FORM INPUT
// =====================================================

function FormInput({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  full = false,
}) {
  return (
    <div
      className={`form-group ${
        full ? "full" : ""
      }`}
    >
      <label>{label}</label>

      <input
        type={type}
        name={name}
        value={value || ""}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  );
}

// =====================================================
// FORM SELECT
// =====================================================

function FormSelect({
  label,
  name,
  value,
  onChange,
  options = [],
}) {
  return (
    <div className="form-group">
      <label>{label}</label>

      <select
        name={name}
        value={value || ""}
        onChange={onChange}
      >
        <option value="">
          Select {label.replace(" *", "")}
        </option>

        {options.map((option) => (
          <option
            key={option}
            value={option}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

// =====================================================
// PROFILE SECTION
// =====================================================

function ProfileSection({
  icon,
  title,
  subtitle,
  children,
}) {
  return (
    <section className="profile-section">

      <div className="profile-section-title">

        <span className="profile-section-icon">
          {icon}
        </span>

        <div>
          <h3>{title}</h3>
          <p>{subtitle}</p>
        </div>

      </div>

      {children}

    </section>
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
        full ? "profile-full" : ""
      }`}
    >
      <label>{label}</label>

      <strong>
        {value || "Not Provided"}
      </strong>
    </div>
  );
}

// =====================================================
// SUMMARY CARD
// =====================================================

function SummaryCard({
  label,
  value,
  icon,
}) {
  return (
    <div className="summary-card">

      <div className="summary-icon">
        {icon}
      </div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>

    </div>
  );
}

export default Teachers;