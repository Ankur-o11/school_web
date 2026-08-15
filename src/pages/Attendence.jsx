import { useEffect, useState } from "react";
import "../Style/attendance.css";

function Attendance() {
  const API = "http://localhost:5000";

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [selectedClass, setSelectedClass] = useState("All");
  const [selectedSection, setSelectedSection] = useState("All");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ==============================
  // LOAD STUDENTS
  // ==============================

  const loadStudents = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${API}/api/students`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load students");
      }

      setStudents(data);
    } catch (error) {
      console.error(error);
      alert("Unable to load students.");
    } finally {
      setLoading(false);
    }
  };

  // ==============================
  // LOAD ATTENDANCE
  // ==============================

  const loadAttendance = async () => {
    try {
      const response = await fetch(
        `${API}/api/student-attendance/date/${selectedDate}`
      );

      if (!response.ok) {
        return;
      }

      const data = await response.json();

      const attendanceMap = {};

      data.forEach((item) => {
        attendanceMap[item.studentId] = item.status;
      });

      setAttendance(attendanceMap);
    } catch (error) {
      console.error("Attendance loading error:", error);
    }
  };

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    loadAttendance();
  }, [selectedDate]);

  // ==============================
  // CLASSES
  // ==============================

  const classes = [
    ...new Set(students.map((student) => student.class)),
  ];

  const sections = [
    ...new Set(
      students
        .filter(
          (student) =>
            selectedClass === "All" ||
            student.class === selectedClass
        )
        .map((student) => student.section)
    ),
  ];

  // ==============================
  // FILTER STUDENTS
  // ==============================

  const filteredStudents = students.filter((student) => {
    const classMatch =
      selectedClass === "All" ||
      student.class === selectedClass;

    const sectionMatch =
      selectedSection === "All" ||
      student.section === selectedSection;

    return classMatch && sectionMatch;
  });

  // ==============================
  // MARK ATTENDANCE
  // ==============================

  const markAttendance = (studentId, status) => {
    setAttendance((previous) => ({
      ...previous,
      [studentId]: status,
    }));
  };

  // ==============================
  // MARK ALL PRESENT
  // ==============================

  const markAllPresent = () => {
    const updated = {};

    filteredStudents.forEach((student) => {
      updated[student.id] = "Present";
    });

    setAttendance((previous) => ({
      ...previous,
      ...updated,
    }));
  };

  // ==============================
  // MARK ALL ABSENT
  // ==============================

  const markAllAbsent = () => {
    const updated = {};

    filteredStudents.forEach((student) => {
      updated[student.id] = "Absent";
    });

    setAttendance((previous) => ({
      ...previous,
      ...updated,
    }));
  };

  // ==============================
  // STATISTICS
  // ==============================

  const presentCount = filteredStudents.filter(
    (student) => attendance[student.id] === "Present"
  ).length;

  const absentCount = filteredStudents.filter(
    (student) => attendance[student.id] === "Absent"
  ).length;

  const leaveCount = filteredStudents.filter(
    (student) => attendance[student.id] === "Leave"
  ).length;

  const unmarkedCount =
    filteredStudents.length -
    presentCount -
    absentCount -
    leaveCount;

  // ==============================
  // SAVE ATTENDANCE
  // ==============================

  const saveAttendance = async () => {
    if (filteredStudents.length === 0) {
      alert("No students found.");
      return;
    }

    try {
      setSaving(true);

      const records = filteredStudents.map((student) => ({
        studentId: student.id,
        date: selectedDate,
        status: attendance[student.id] || "Absent",
      }));

      const response = await fetch(
        `${API}/api/student-attendance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            records,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to save attendance"
        );
      }

      alert("Student attendance saved successfully!");

      await loadAttendance();
    } catch (error) {
      console.error(error);
      alert(error.message || "Unable to save attendance.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="student-attendance-page">

      {/* HEADER */}

      <div className="attendance-header">
        <div>
          <h1>Student Attendance</h1>
          <p>
            Manage daily attendance of students
          </p>
        </div>
      </div>

      {/* FILTERS */}

      <div className="attendance-filter-card">

        <div className="attendance-filter">

          <div className="attendance-field">
            <label>Date</label>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) =>
                setSelectedDate(e.target.value)
              }
            />
          </div>

          <div className="attendance-field">
            <label>Class</label>

            <select
              value={selectedClass}
              onChange={(e) => {
                setSelectedClass(e.target.value);
                setSelectedSection("All");
              }}
            >
              <option value="All">
                All Classes
              </option>

              {classes.map((className) => (
                <option
                  key={className}
                  value={className}
                >
                  Class {className}
                </option>
              ))}
            </select>
          </div>

          <div className="attendance-field">
            <label>Section</label>

            <select
              value={selectedSection}
              onChange={(e) =>
                setSelectedSection(e.target.value)
              }
            >
              <option value="All">
                All Sections
              </option>

              {sections.map((section) => (
                <option
                  key={section}
                  value={section}
                >
                  Section {section}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* STATISTICS */}

      <div className="attendance-stats">

        <div className="attendance-stat">
          <div className="stat-icon">👨‍🎓</div>

          <div>
            <p>Total Students</p>
            <h2>{filteredStudents.length}</h2>
          </div>
        </div>

        <div className="attendance-stat">
          <div className="stat-icon green">✓</div>

          <div>
            <p>Present</p>
            <h2>{presentCount}</h2>
          </div>
        </div>

        <div className="attendance-stat">
          <div className="stat-icon red">✕</div>

          <div>
            <p>Absent</p>
            <h2>{absentCount}</h2>
          </div>
        </div>

        <div className="attendance-stat">
          <div className="stat-icon yellow">L</div>

          <div>
            <p>Leave</p>
            <h2>{leaveCount}</h2>
          </div>
        </div>

      </div>

      {/* ACTIONS */}

      <div className="attendance-actions">

        <button
          className="btn-present"
          onClick={markAllPresent}
        >
          ✓ Mark All Present
        </button>

        <button
          className="btn-absent"
          onClick={markAllAbsent}
        >
          ✕ Mark All Absent
        </button>

        <button
          className="btn-save"
          onClick={saveAttendance}
          disabled={saving}
        >
          {saving
            ? "Saving..."
            : "Save Attendance"}
        </button>

      </div>

      {/* TABLE */}

      <div className="attendance-table-card">

        <div className="attendance-table-title">
          <div>
            <h2>Students Attendance</h2>
            <p>
              {selectedDate}
            </p>
          </div>
        </div>

        {loading ? (

          <div className="attendance-empty">
            <div>⏳</div>
            <h3>Loading Students...</h3>
          </div>

        ) : filteredStudents.length === 0 ? (

          <div className="attendance-empty">
            <div>👨‍🎓</div>
            <h3>No Students Found</h3>
            <p>
              No students match the selected filters.
            </p>
          </div>

        ) : (

          <div className="attendance-table">

            <div className="attendance-row attendance-heading">

              <span>Student</span>
              <span>Class</span>
              <span>Roll No</span>
              <span>Parent Mobile</span>
              <span>Present</span>
              <span>Absent</span>
              <span>Leave</span>

            </div>

            {filteredStudents.map((student) => (

              <div
                className="attendance-row"
                key={student.id}
              >

                <span>
                  <strong>
                    {student.name}
                  </strong>

                  <small>
                    Father:{" "}
                    {student.father || "-"}
                  </small>
                </span>

                <span>
                  {student.class || "-"} -{" "}
                  {student.section || "-"}
                </span>

                <span>
                  {student.rollNo || "-"}
                </span>

                <span>
                  {student.mobile || "-"}
                </span>

                <span>
                  <button
                    className={
                      attendance[student.id] ===
                      "Present"
                        ? "attendance-btn present active"
                        : "attendance-btn present"
                    }
                    onClick={() =>
                      markAttendance(
                        student.id,
                        "Present"
                      )
                    }
                  >
                    ✓
                  </button>
                </span>

                <span>
                  <button
                    className={
                      attendance[student.id] ===
                      "Absent"
                        ? "attendance-btn absent active"
                        : "attendance-btn absent"
                    }
                    onClick={() =>
                      markAttendance(
                        student.id,
                        "Absent"
                      )
                    }
                  >
                    ✕
                  </button>
                </span>

                <span>
                  <button
                    className={
                      attendance[student.id] ===
                      "Leave"
                        ? "attendance-btn leave active"
                        : "attendance-btn leave"
                    }
                    onClick={() =>
                      markAttendance(
                        student.id,
                        "Leave"
                      )
                    }
                  >
                    L
                  </button>
                </span>

              </div>

            ))}

          </div>
        )}

      </div>

      {!loading &&
        filteredStudents.length > 0 && (
          <div className="unmarked-text">
            {unmarkedCount} student(s) not marked yet.
          </div>
        )}

    </div>
  );
}

export default Attendance;