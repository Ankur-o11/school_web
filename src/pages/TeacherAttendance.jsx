import { useEffect, useState } from "react";
import "../Style/teacher-attendance.css";

function TeacherAttendance() {
  const [teachers, setTeachers] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // =====================================================
  // FETCH TEACHERS
  // =====================================================

  useEffect(() => {
    fetchTeachers();
  }, []);

  // =====================================================
  // FETCH ATTENDANCE WHEN DATE CHANGES
  // =====================================================

  useEffect(() => {
    if (teachers.length > 0) {
      fetchAttendance(selectedDate);
    }
  }, [selectedDate, teachers]);

  // =====================================================
  // GET TEACHERS
  // =====================================================

  const fetchTeachers = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/teachers"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch teachers");
      }

      const data = await response.json();

      setTeachers(data);
    } catch (error) {
      console.error("Teacher fetch error:", error);

      alert(
        "Unable to load teachers. Please check backend server."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // GET ATTENDANCE BY DATE
  // =====================================================

  const fetchAttendance = async (date) => {
    try {
      const month = date.substring(0, 7);

      const response = await fetch(
        `http://localhost:5000/api/teacher-attendance/month/${month}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch attendance");
      }

      const records = await response.json();

      const selectedDateRecords = records.filter(
        (record) => record.date === date
      );

      const attendanceMap = {};

      selectedDateRecords.forEach((record) => {
        attendanceMap[record.teacherId] = {
          status: record.status,
          leaveType: record.leaveType || "Unpaid",
          remark: record.remark || "",
          id: record.id,
        };
      });

      // Default status for teachers without attendance
      teachers.forEach((teacher) => {
        if (!attendanceMap[teacher.id]) {
          attendanceMap[teacher.id] = {
            status: "Present",
            leaveType: "Unpaid",
            remark: "",
            id: null,
          };
        }
      });

      setAttendance(attendanceMap);
    } catch (error) {
      console.error(
        "Attendance fetch error:",
        error
      );

      // If no records exist, make everyone Present
      const defaultAttendance = {};

      teachers.forEach((teacher) => {
        defaultAttendance[teacher.id] = {
          status: "Present",
          leaveType: "Unpaid",
          remark: "",
          id: null,
        };
      });

      setAttendance(defaultAttendance);
    }
  };

  // =====================================================
  // CHANGE STATUS
  // =====================================================

  const changeStatus = (teacherId, status) => {
    setAttendance((previous) => ({
      ...previous,

      [teacherId]: {
        ...previous[teacherId],

        status,

        leaveType:
          status === "Leave"
            ? previous[teacherId]?.leaveType || "Unpaid"
            : "",

        remark:
          previous[teacherId]?.remark || "",
      },
    }));
  };

  // =====================================================
  // CHANGE LEAVE TYPE
  // =====================================================

  const changeLeaveType = (
    teacherId,
    leaveType
  ) => {
    setAttendance((previous) => ({
      ...previous,

      [teacherId]: {
        ...previous[teacherId],
        leaveType,
      },
    }));
  };

  // =====================================================
  // CHANGE REMARK
  // =====================================================

  const changeRemark = (
    teacherId,
    remark
  ) => {
    setAttendance((previous) => ({
      ...previous,

      [teacherId]: {
        ...previous[teacherId],
        remark,
      },
    }));
  };

  // =====================================================
  // SAVE ATTENDANCE
  // =====================================================

  const saveAttendance = async () => {
    if (teachers.length === 0) {
      alert("No teachers available.");
      return;
    }

    setSaving(true);

    try {
      for (const teacher of teachers) {
        const record = attendance[teacher.id];

        if (!record) {
          continue;
        }

        const response = await fetch(
          "http://localhost:5000/api/teacher-attendance",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
            },

            body: JSON.stringify({
              teacherId: teacher.id,
              date: selectedDate,
              status: record.status,
              leaveType:
                record.status === "Leave"
                  ? record.leaveType
                  : "",
              remark: record.remark || "",
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to save attendance"
          );
        }
      }

      alert(
        "Teacher attendance saved successfully!"
      );

      await fetchAttendance(selectedDate);
    } catch (error) {
      console.error(
        "Save attendance error:",
        error
      );

      alert(
        "Unable to save attendance. Please check backend server."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // STATS
  // =====================================================

  const totalTeachers = teachers.length;

  const presentCount = teachers.filter(
    (teacher) =>
      attendance[teacher.id]?.status ===
      "Present"
  ).length;

  const absentCount = teachers.filter(
    (teacher) =>
      attendance[teacher.id]?.status ===
      "Absent"
  ).length;

  const leaveCount = teachers.filter(
    (teacher) =>
      attendance[teacher.id]?.status ===
      "Leave"
  ).length;

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="teacher-attendance-page">

      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <div className="teacher-attendance-header">

        <div>
          <h1>Teacher Attendance</h1>

          <p>
            Manage daily teacher attendance
          </p>
        </div>

        <div className="attendance-date-box">

          <label>
            Attendance Date
          </label>

          <input
            type="date"
            value={selectedDate}
            onChange={(e) =>
              setSelectedDate(
                e.target.value
              )
            }
          />

        </div>

      </div>

      {/* ================================================= */}
      {/* STATS */}
      {/* ================================================= */}

      <div className="teacher-attendance-stats">

        <div className="teacher-attendance-card">

          <div className="card-icon">
            👨‍🏫
          </div>

          <div>
            <p>Total Teachers</p>
            <h2>{totalTeachers}</h2>
          </div>

        </div>

        <div className="teacher-attendance-card">

          <div className="card-icon">
            🟢
          </div>

          <div>
            <p>Present</p>
            <h2>{presentCount}</h2>
          </div>

        </div>

        <div className="teacher-attendance-card">

          <div className="card-icon">
            🔴
          </div>

          <div>
            <p>Absent</p>
            <h2>{absentCount}</h2>
          </div>

        </div>

        <div className="teacher-attendance-card">

          <div className="card-icon">
            🟡
          </div>

          <div>
            <p>Leave</p>
            <h2>{leaveCount}</h2>
          </div>

        </div>

      </div>

      {/* ================================================= */}
      {/* TABLE */}
      {/* ================================================= */}

      <div className="teacher-attendance-table">

        <div className="teacher-attendance-row teacher-attendance-heading">

          <span>Teacher</span>

          <span>Subject</span>

          <span>Status</span>

          <span>Leave Type</span>

          <span>Action</span>

        </div>

        {loading ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            Loading teachers...
          </div>
        ) : teachers.length === 0 ? (
          <div
            style={{
              padding: "40px",
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            No teachers found.
          </div>
        ) : (
          teachers.map((teacher) => {

            const record =
              attendance[teacher.id] || {
                status: "Present",
                leaveType: "Unpaid",
                remark: "",
              };

            return (
              <div
                className="teacher-attendance-row"
                key={teacher.id}
              >

                {/* TEACHER */}

                <div className="teacher-name">

                  <div className="teacher-avatar">
                    {teacher.name
                      ?.charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <strong>
                      {teacher.name}
                    </strong>

                    <small>
                      {teacher.employeeId}
                    </small>
                  </div>

                </div>

                {/* SUBJECT */}

                <span>
                  {teacher.subject || "—"}
                </span>

                {/* STATUS */}

                <span>

                  <span
                    className={`attendance-status ${
                      record.status ===
                      "Present"
                        ? "status-present"
                        : record.status ===
                          "Absent"
                        ? "status-absent"
                        : "status-leave"
                    }`}
                  >
                    {record.status}
                  </span>

                </span>

                {/* LEAVE TYPE */}

                <span>

                  {record.status ===
                  "Leave" ? (
                    <select
                      value={
                        record.leaveType ||
                        "Unpaid"
                      }
                      onChange={(e) =>
                        changeLeaveType(
                          teacher.id,
                          e.target.value
                        )
                      }
                      style={{
                        padding: "7px",
                        border:
                          "1px solid #d9dee8",
                        borderRadius: "7px",
                        outline: "none",
                      }}
                    >
                      <option value="Paid">
                        Paid
                      </option>

                      <option value="Unpaid">
                        Unpaid
                      </option>
                    </select>
                  ) : (
                    <span
                      style={{
                        color: "#9ca3af",
                      }}
                    >
                      —
                    </span>
                  )}

                </span>

                {/* ACTION */}

                <div className="attendance-actions">

                  <button
                    type="button"
                    className="attendance-btn present-btn"
                    onClick={() =>
                      changeStatus(
                        teacher.id,
                        "Present"
                      )
                    }
                  >
                    Present
                  </button>

                  <button
                    type="button"
                    className="attendance-btn absent-btn"
                    onClick={() =>
                      changeStatus(
                        teacher.id,
                        "Absent"
                      )
                    }
                  >
                    Absent
                  </button>

                  <button
                    type="button"
                    className="attendance-btn leave-btn"
                    onClick={() =>
                      changeStatus(
                        teacher.id,
                        "Leave"
                      )
                    }
                  >
                    Leave
                  </button>

                </div>

              </div>
            );
          })
        )}

      </div>

      {/* ================================================= */}
      {/* REMARKS */}
      {/* ================================================= */}

      {teachers.length > 0 && (
        <div
          style={{
            marginTop: "20px",
            background: "white",
            border: "1px solid #e5e7eb",
            borderRadius: "12px",
            padding: "20px",
          }}
        >

          <h3
            style={{
              marginTop: 0,
              marginBottom: "15px",
              color: "#172033",
            }}
          >
            Attendance Remarks
          </h3>

          {teachers.map((teacher) => {

            const record =
              attendance[teacher.id] || {
                remark: "",
              };

            return (
              <div
                key={teacher.id}
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "180px 1fr",
                  gap: "15px",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >

                <strong
                  style={{
                    fontSize: "13px",
                    color: "#374151",
                  }}
                >
                  {teacher.name}
                </strong>

                <input
                  type="text"
                  value={
                    record.remark || ""
                  }
                  placeholder="Optional remark..."
                  onChange={(e) =>
                    changeRemark(
                      teacher.id,
                      e.target.value
                    )
                  }
                  style={{
                    width: "100%",
                    padding: "10px 12px",
                    border:
                      "1px solid #d9dee8",
                    borderRadius: "7px",
                    outline: "none",
                  }}
                />

              </div>
            );
          })}

        </div>
      )}

      {/* ================================================= */}
      {/* SAVE */}
      {/* ================================================= */}

      {teachers.length > 0 && (
        <button
          type="button"
          className="save-attendance-btn"
          onClick={saveAttendance}
          disabled={saving}
        >
          {saving
            ? "Saving Attendance..."
            : "💾 Save Attendance"}
        </button>
      )}

    </div>
  );
}

export default TeacherAttendance;