
import { useEffect, useMemo, useState } from "react";
import "../Style/attendance.css";
import { useAuth } from "../context/AuthContext";

function Attendance() {
  const { fetchWithAuth } = useAuth();
  // =====================================================
  // STATE
  // =====================================================

  const today = new Date().toISOString().split("T")[0];
  const currentMonth = today.slice(0, 7);

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [holidays, setHolidays] = useState([]);

  const [selectedClass, setSelectedClass] = useState("All");
  const [selectedSection, setSelectedSection] = useState("All");
  const [selectedDate, setSelectedDate] = useState(today);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [reportLoading, setReportLoading] = useState(false);
  const [holidayLoading, setHolidayLoading] = useState(false);

  const [error, setError] = useState("");

  const [showStudentReport, setShowStudentReport] = useState(false);
  const [showClassReport, setShowClassReport] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [showHolidays, setShowHolidays] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState(null);

  const [reportMonth, setReportMonth] = useState(currentMonth);
  const [reportDays, setReportDays] = useState(31);

  const [newHolidayDate, setNewHolidayDate] = useState("");
  const [newHolidayReason, setNewHolidayReason] = useState("");

  // =====================================================
  // HELPERS
  // =====================================================

  const getStudentId = (student) =>
    String(student?.id || student?._id || "");

  const getClass = (student) =>
    String(student?.class || student?.className || "");

  const getSection = (student) =>
    String(student?.section || "");

  const getRoll = (student) =>
    student?.rollNo || student?.roll || "-";

  const getFather = (student) =>
    student?.father ||
    student?.fatherName ||
    "-";

  const getMobile = (student) =>
    student?.mobile ||
    student?.phone ||
    student?.parentMobile ||
    "-";

  const getStudentName = (student) =>
    student?.name ||
    student?.studentName ||
    "-";

  // =====================================================
  // DATE HELPERS
  // =====================================================

  const formatDate = (date) => {
    if (!date) return "-";

    const parsed = new Date(`${date}T00:00:00`);

    if (Number.isNaN(parsed.getTime())) {
      return date;
    }

    return parsed.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getDayName = (date) => {
    const parsed = new Date(`${date}T00:00:00`);

    return parsed.toLocaleDateString("en-IN", {
      weekday: "long",
    });
  };

  const getDaysInMonth = (month) => {
    if (!month) return 0;

    const year = Number(month.slice(0, 4));
    const monthNumber = Number(month.slice(5, 7));

    return new Date(year, monthNumber, 0).getDate();
  };

  const makeDate = (month, day) =>
    `${month}-${String(day).padStart(2, "0")}`;

  // =====================================================
  // HOLIDAY HELPERS
  // =====================================================

  const isHoliday = (date) =>
    holidays.some(
      (holiday) => String(holiday.date) === String(date)
    );

  const getHoliday = (date) =>
    holidays.find(
      (holiday) => String(holiday.date) === String(date)
    );

  // =====================================================
  // API RESPONSE HELPER
  // =====================================================

  const extractArray = (data, keys = []) => {
    if (Array.isArray(data)) {
      return data;
    }

    for (const key of keys) {
      if (Array.isArray(data?.[key])) {
        return data[key];
      }
    }

    return [];
  };

  // =====================================================
  // LOAD STUDENTS
  // =====================================================

  const loadStudents = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetchWithAuth("/students");

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to load students"
        );
      }

      const list = extractArray(data, [
        "students",
        "data",
        "records",
      ]);

      setStudents(list);
    } catch (error) {
      console.error("Students loading error:", error);

      setStudents([]);

      setError(
        "Unable to load students from server. Please check backend server."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD HOLIDAYS
  // =====================================================

  const loadHolidays = async () => {
    try {
      const response = await fetchWithAuth(
        "/student-attendance/holidays"
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message || "Failed to load holidays"
        );
      }

      const list = extractArray(data, [
        "holidays",
        "data",
        "records",
      ]);

      setHolidays(list);
    } catch (error) {
      console.error("Holiday loading error:", error);
    }
  };

  // =====================================================
  // LOAD ATTENDANCE BY DATE
  // =====================================================

  const loadAttendanceByDate = async (date) => {
    if (!date || isHoliday(date)) {
      return;
    }

    try {
      const response = await fetchWithAuth(
        `/student-attendance/date/${date}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to load date attendance"
        );
      }

      const records = extractArray(data, [
        "attendance",
        "records",
        "data",
      ]);

      const map = {};

      records.forEach((item) => {
        const id = String(
          item?.studentId ||
            item?.student ||
            item?.studentID ||
            ""
        );

        if (id) {
          map[id] = item?.status || "";
        }
      });

      setAttendance((previous) => ({
        ...previous,
        [date]: map,
      }));
    } catch (error) {
      console.error(
        "Date attendance loading error:",
        error
      );
    }
  };

  // =====================================================
  // LOAD ATTENDANCE BY MONTH
  // =====================================================

  const loadAttendanceByMonth = async (month) => {
    if (!month) return {};

    try {
      setReportLoading(true);

      const response = await fetchWithAuth(
        `/student-attendance/month/${month}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Monthly attendance loading failed"
        );
      }

      const records = extractArray(data, [
        "attendance",
        "records",
        "data",
      ]);

      const monthlyMap = {};

      records.forEach((item) => {
        const studentId = String(
          item?.studentId ||
            item?.student ||
            item?.studentID ||
            ""
        );

        const date = item?.date
          ? String(item.date).slice(0, 10)
          : "";

        if (!studentId || !date) return;

        if (!monthlyMap[date]) {
          monthlyMap[date] = {};
        }

        monthlyMap[date][studentId] =
          item?.status || "";
      });

      setAttendance((previous) => ({
        ...previous,
        ...monthlyMap,
      }));

      return monthlyMap;
    } catch (error) {
      console.error(
        "Monthly attendance loading error:",
        error
      );

      return {};
    } finally {
      setReportLoading(false);
    }
  };

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadStudents();
    loadHolidays();
  }, []);

  // =====================================================
  // LOAD SELECTED DATE
  // =====================================================

  useEffect(() => {
    if (selectedDate) {
      loadAttendanceByDate(selectedDate);
    }
  }, [selectedDate, holidays]);

  // =====================================================
  // CLASSES
  // =====================================================

  const classes = useMemo(() => {
    return [
      ...new Set(
        students
          .map(getClass)
          .filter(Boolean)
      ),
    ].sort((a, b) =>
      String(a).localeCompare(
        String(b),
        undefined,
        {
          numeric: true,
        }
      )
    );
  }, [students]);

  // =====================================================
  // SECTIONS
  // =====================================================

  const sections = useMemo(() => {
    return [
      ...new Set(
        students
          .filter(
            (student) =>
              selectedClass === "All" ||
              getClass(student) === selectedClass
          )
          .map(getSection)
          .filter(Boolean)
      ),
    ].sort();
  }, [students, selectedClass]);

  // =====================================================
  // FILTER STUDENTS
  // =====================================================

  const filteredStudents = useMemo(() => {
    const value = search.trim().toLowerCase();

    return students.filter((student) => {
      const classMatch =
        selectedClass === "All" ||
        getClass(student) === selectedClass;

      const sectionMatch =
        selectedSection === "All" ||
        getSection(student) === selectedSection;

      const searchableText = [
        getStudentName(student),
        getFather(student),
        getClass(student),
        getSection(student),
        getRoll(student),
        getMobile(student),
        student?.admissionNo,
      ]
        .join(" ")
        .toLowerCase();

      const searchMatch =
        !value ||
        searchableText.includes(value);

      return (
        classMatch &&
        sectionMatch &&
        searchMatch
      );
    });
  }, [
    students,
    search,
    selectedClass,
    selectedSection,
  ]);

  // =====================================================
  // GET STATUS
  // =====================================================

  const getStatus = (
    studentId,
    date = selectedDate
  ) => {
    return (
      attendance?.[date]?.[
        String(studentId)
      ] || ""
    );
  };

  // =====================================================
  // DAILY STATISTICS
  // =====================================================

  const todayAttendance =
    attendance?.[selectedDate] || {};

  const presentCount =
    filteredStudents.filter(
      (student) =>
        todayAttendance[
          getStudentId(student)
        ] === "Present"
    ).length;

  const absentCount =
    filteredStudents.filter(
      (student) =>
        todayAttendance[
          getStudentId(student)
        ] === "Absent"
    ).length;

  const leaveCount =
    filteredStudents.filter(
      (student) =>
        todayAttendance[
          getStudentId(student)
        ] === "Leave"
    ).length;

  const unmarkedCount =
    filteredStudents.length -
    presentCount -
    absentCount -
    leaveCount;

  // =====================================================
  // MARK SINGLE ATTENDANCE
  // =====================================================

  const markAttendance = (
    studentId,
    status
  ) => {
    if (isHoliday(selectedDate)) {
      alert(
        "This date is marked as a holiday."
      );
      return;
    }

    setAttendance((previous) => ({
      ...previous,

      [selectedDate]: {
        ...(previous[selectedDate] || {}),
        [String(studentId)]: status,
      },
    }));
  };

  // =====================================================
  // MARK ALL PRESENT
  // =====================================================

  const markAllPresent = () => {
    if (isHoliday(selectedDate)) {
      alert(
        "This date is marked as a holiday."
      );
      return;
    }

    const updated = {};

    filteredStudents.forEach((student) => {
      updated[getStudentId(student)] =
        "Present";
    });

    setAttendance((previous) => ({
      ...previous,

      [selectedDate]: {
        ...(previous[selectedDate] || {}),
        ...updated,
      },
    }));
  };

  // =====================================================
  // MARK ALL ABSENT
  // =====================================================

  const markAllAbsent = () => {
    if (isHoliday(selectedDate)) {
      alert(
        "This date is marked as a holiday."
      );
      return;
    }

    const updated = {};

    filteredStudents.forEach((student) => {
      updated[getStudentId(student)] =
        "Absent";
    });

    setAttendance((previous) => ({
      ...previous,

      [selectedDate]: {
        ...(previous[selectedDate] || {}),
        ...updated,
      },
    }));
  };

  // =====================================================
  // SAVE ATTENDANCE
  // =====================================================

  const saveAttendance = async () => {
    if (isHoliday(selectedDate)) {
      alert(
        "Holiday attendance cannot be saved."
      );
      return;
    }

    if (filteredStudents.length === 0) {
      alert("No students found.");
      return;
    }

    try {
      setSaving(true);

      const records = filteredStudents.map(
        (student) => ({
          studentId: getStudentId(student),
          date: selectedDate,
          status:
            getStatus(
              getStudentId(student),
              selectedDate
            ) || "Absent",
        })
      );

      const response = await fetchWithAuth(
        "/student-attendance",
        {
          method: "POST",
          body: JSON.stringify({
            records,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to save attendance"
        );
      }

      const returnedRecords =
        extractArray(data, [
          "attendance",
          "records",
          "data",
        ]);

      if (returnedRecords.length > 0) {
        setAttendance((previous) => {
          const updated = {
            ...(previous[selectedDate] || {}),
          };

          returnedRecords.forEach(
            (record) => {
              const id = String(
                record?.studentId ||
                  record?.student ||
                  ""
              );

              if (id) {
                updated[id] =
                  record?.status || "";
              }
            }
          );

          return {
            ...previous,
            [selectedDate]: updated,
          };
        });
      }

      alert(
        "Student attendance saved successfully!"
      );

      // Verify from MongoDB
      await loadAttendanceByDate(
        selectedDate
      );
    } catch (error) {
      console.error(
        "Attendance save error:",
        error
      );

      alert(
        error?.message ||
          "Unable to save attendance."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // OPEN STUDENT REPORT
  // =====================================================

  const openStudentReport = async (
    student
  ) => {
    setSelectedStudent(student);

    const month =
      reportMonth ||
      selectedDate.slice(0, 7);

    setReportMonth(month);
    setShowStudentReport(true);

    await loadAttendanceByMonth(month);
  };

  // =====================================================
  // STUDENT MONTHLY REPORT
  // =====================================================

  const getStudentMonthlyReport = (
    student
  ) => {
    const daysInMonth =
      getDaysInMonth(reportMonth);

    let present = 0;
    let absent = 0;
    let leave = 0;
    let holiday = 0;
    let notMarked = 0;

    const rows = [];

    for (
      let day = 1;
      day <= daysInMonth;
      day++
    ) {
      const date = makeDate(
        reportMonth,
        day
      );

      if (isHoliday(date)) {
        holiday++;

        rows.push({
          date,
          status: "Holiday",
        });

        continue;
      }

      const status = getStatus(
        getStudentId(student),
        date
      );

      if (status === "Present") {
        present++;
      } else if (status === "Absent") {
        absent++;
      } else if (status === "Leave") {
        leave++;
      } else {
        notMarked++;
      }

      rows.push({
        date,
        status: status || "Not Marked",
      });
    }

    const workingDays =
      daysInMonth - holiday;

    const markedDays =
      present +
      absent +
      leave;

    const average =
      markedDays > 0
        ? (
            (present / markedDays) *
            100
          ).toFixed(1)
        : "0.0";

    return {
      rows,
      present,
      absent,
      leave,
      holiday,
      workingDays,
      markedDays,
      notMarked,
      average,
    };
  };

  // =====================================================
  // REPORT STUDENTS
  // =====================================================

  const reportStudents = students.filter(
    (student) =>
      (selectedClass === "All" ||
        getClass(student) ===
          selectedClass) &&
      (selectedSection === "All" ||
        getSection(student) ===
          selectedSection)
  );

  // =====================================================
  // REPORT DATES
  // =====================================================

  const getReportDates = () => {
    const totalDays =
      getDaysInMonth(reportMonth);

    const requested =
      Number(reportDays);

    const count =
      requested > 0
        ? Math.min(
            requested,
            totalDays
          )
        : totalDays;

    return Array.from(
      {
        length: count,
      },
      (_, index) =>
        makeDate(
          reportMonth,
          index + 1
        )
    );
  };

  const classReportDates =
    getReportDates();

  // =====================================================
  // CLASS REPORT STATS
  // =====================================================

  const getClassReportStats = () => {
    let present = 0;
    let absent = 0;
    let leave = 0;
    let holidays = 0;
    let notMarked = 0;

    classReportDates.forEach(
      (date) => {
        if (isHoliday(date)) {
          holidays++;
          return;
        }

        reportStudents.forEach(
          (student) => {
            const status =
              getStatus(
                getStudentId(student),
                date
              );

            if (
              status === "Present"
            ) {
              present++;
            } else if (
              status === "Absent"
            ) {
              absent++;
            } else if (
              status === "Leave"
            ) {
              leave++;
            } else {
              notMarked++;
            }
          }
        );
      }
    );

    const workingDays =
      classReportDates.filter(
        (date) => !isHoliday(date)
      ).length;

    const totalMarked =
      present +
      absent +
      leave;

    const average =
      totalMarked > 0
        ? (
            (present /
              totalMarked) *
            100
          ).toFixed(1)
        : "0.0";

    return {
      present,
      absent,
      leave,
      holidays,
      notMarked,
      workingDays,
      totalMarked,
      average,
    };
  };

  // =====================================================
  // OPEN CLASS REPORT
  // =====================================================

  const openClassReport = async () => {
    setShowClassReport(true);

    await loadAttendanceByMonth(
      reportMonth
    );
  };

  // =====================================================
  // ADD HOLIDAY
  // =====================================================

  const addHoliday = async () => {
    if (!newHolidayDate) {
      alert(
        "Please select holiday date."
      );
      return;
    }

    if (isHoliday(newHolidayDate)) {
      alert(
        "This date is already marked as holiday."
      );
      return;
    }

    try {
      setHolidayLoading(true);

      const holiday = {
        date: newHolidayDate,
        reason:
          newHolidayReason.trim() ||
          "School Holiday",
      };

      const response = await fetchWithAuth(
        "/student-attendance/holiday",
        {
          method: "POST",
          body: JSON.stringify(holiday),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            "Failed to create holiday"
        );
      }

      const createdHoliday =
        data?.holiday ||
        data?.data ||
        holiday;

      setHolidays((previous) =>
        [
          ...previous.filter(
            (item) =>
              item.date !==
              newHolidayDate
          ),
          createdHoliday,
        ].sort((a, b) =>
          String(a.date).localeCompare(
            String(b.date)
          )
        )
      );

      // Remove frontend attendance
      // for holiday date
      setAttendance((previous) => {
        const updated = {
          ...previous,
        };

        delete updated[
          newHolidayDate
        ];

        return updated;
      });

      setNewHolidayDate("");
      setNewHolidayReason("");

      alert(
        "Holiday added successfully."
      );
    } catch (error) {
      console.error(
        "Holiday create error:",
        error
      );

      alert(
        error?.message ||
          "Unable to add holiday."
      );
    } finally {
      setHolidayLoading(false);
    }
  };

  // =====================================================
  // DELETE HOLIDAY
  // =====================================================

  const removeHoliday = async (
    date,
    holidayId
  ) => {
    const confirmed =
      window.confirm(
        "Delete this holiday?"
      );

    if (!confirmed) return;

    try {
      setHolidayLoading(true);

      if (holidayId) {
        const response = await fetchWithAuth(
          `/student-attendance/holiday/${holidayId}`,
          {
            method: "DELETE",
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data?.message ||
              "Failed to delete holiday"
          );
        }
      }

      setHolidays((previous) =>
        previous.filter(
          (holiday) =>
            holiday.date !== date
        )
      );

      alert(
        "Holiday deleted successfully."
      );
    } catch (error) {
      console.error(
        "Holiday delete error:",
        error
      );

      alert(
        error?.message ||
          "Unable to delete holiday."
      );
    } finally {
      setHolidayLoading(false);
    }
  };

  // =====================================================
  // SCHOOL DAY INFORMATION
  // =====================================================

  const getSchoolDaysSummary = (
    month
  ) => {
    const totalDays =
      getDaysInMonth(month);

    let holidayCount = 0;

    const holidayList = [];

    for (
      let day = 1;
      day <= totalDays;
      day++
    ) {
      const date = makeDate(
        month,
        day
      );

      if (isHoliday(date)) {
        holidayCount++;

        const holiday =
          getHoliday(date);

        if (holiday) {
          holidayList.push(
            holiday
          );
        }
      }
    }

    return {
      totalDays,
      holidayCount,
      workingDays:
        totalDays -
        holidayCount,
      holidayList,
    };
  };

  // =====================================================
  // PRINT
  // =====================================================

  const printPage = () => {
    window.print();
  };

  // =====================================================
  // MONTH REPORT LOAD
  // =====================================================

  useEffect(() => {
    if (
      showClassReport ||
      showStudentReport
    ) {
      loadAttendanceByMonth(
        reportMonth
      );
    }
  }, [
    reportMonth,
    showClassReport,
    showStudentReport,
  ]);

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="student-attendance-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="attendance-header">

        <div className="attendance-header-left">

          <div className="attendance-header-icon">
            ✓
          </div>

          <div>
            <h1>
              Student Attendance
            </h1>

            <p>
              Manage daily attendance,
              monthly reports and
              student attendance records
            </p>
          </div>

        </div>

        <div className="header-actions">

          <button
            className="header-report-btn"
            onClick={() =>
              setShowSummary(true)
            }
          >
            📊 Summary
          </button>

          <button
            className="header-report-btn"
            onClick={
              openClassReport
            }
          >
            📅 Class Report
          </button>

          <button
            className="header-report-btn"
            onClick={() =>
              setShowHolidays(true)
            }
          >
            🏖 Holidays
          </button>

        </div>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div className="attendance-error">
          ⚠️ {error}
        </div>
      )}

      {/* =================================================
          FILTERS
      ================================================= */}

      <div className="attendance-filter-card">

        <div className="attendance-field">

          <label>Date</label>

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

        <div className="attendance-field">

          <label>Class</label>

          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(
                e.target.value
              );

              setSelectedSection(
                "All"
              );
            }}
          >

            <option value="All">
              All Classes
            </option>

            {classes.map(
              (className) => (
                <option
                  key={className}
                  value={className}
                >
                  Class {className}
                </option>
              )
            )}

          </select>

        </div>

        <div className="attendance-field">

          <label>Section</label>

          <select
            value={selectedSection}
            onChange={(e) =>
              setSelectedSection(
                e.target.value
              )
            }
          >

            <option value="All">
              All Sections
            </option>

            {sections.map(
              (section) => (
                <option
                  key={section}
                  value={section}
                >
                  Section {section}
                </option>
              )
            )}

          </select>

        </div>

        <div className="attendance-field search-field">

          <label>
            Search Student
          </label>

          <input
            type="text"
            placeholder="Name, father, class, roll..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>

      </div>

      {/* =================================================
          HOLIDAY WARNING
      ================================================= */}

      {isHoliday(selectedDate) && (
        <div className="holiday-banner">

          <div className="holiday-banner-icon">
            🏖️
          </div>

          <div>

            <strong>
              School Holiday
            </strong>

            <p>
              {getHoliday(
                selectedDate
              )?.reason ||
                "School Holiday"}
            </p>

          </div>

        </div>
      )}

      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="attendance-stats">

        <div className="attendance-stat">

          <div className="stat-icon">
            👨‍🎓
          </div>

          <div>
            <p>Total Students</p>

            <h2>
              {filteredStudents.length}
            </h2>
          </div>

        </div>

        <div className="attendance-stat">

          <div className="stat-icon green">
            ✓
          </div>

          <div>
            <p>Present</p>

            <h2>
              {presentCount}
            </h2>
          </div>

        </div>

        <div className="attendance-stat">

          <div className="stat-icon red">
            ✕
          </div>

          <div>
            <p>Absent</p>

            <h2>
              {absentCount}
            </h2>
          </div>

        </div>

        <div className="attendance-stat">

          <div className="stat-icon yellow">
            L
          </div>

          <div>
            <p>Leave</p>

            <h2>
              {leaveCount}
            </h2>
          </div>

        </div>

      </div>

      {/* =================================================
          ACTIONS
      ================================================= */}

      <div className="attendance-actions">

        <button
          className="btn-present"
          onClick={
            markAllPresent
          }
          disabled={
            isHoliday(selectedDate)
          }
        >
          ✓ Mark All Present
        </button>

        <button
          className="btn-absent"
          onClick={
            markAllAbsent
          }
          disabled={
            isHoliday(selectedDate)
          }
        >
          ✕ Mark All Absent
        </button>

        <button
          className="btn-save"
          onClick={
            saveAttendance
          }
          disabled={
            saving ||
            isHoliday(selectedDate)
          }
        >
          {saving
            ? "Saving..."
            : "💾 Save Attendance"}
        </button>

        <button
          className="btn-print"
          onClick={
            printPage
          }
        >
          🖨 Print
        </button>

      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="attendance-table-card">

        <div className="attendance-table-title">

          <div>

            <h2>
              Students Attendance
            </h2>

            <p>
              {formatDate(
                selectedDate
              )}
            </p>

          </div>

          <div className="table-count">
            {filteredStudents.length} Students
          </div>

        </div>

        {loading ? (

          <div className="attendance-empty">

            <div>⏳</div>

            <h3>
              Loading Students...
            </h3>

          </div>

        ) : filteredStudents.length === 0 ? (

          <div className="attendance-empty">

            <div>👨‍🎓</div>

            <h3>
              No Students Found
            </h3>

            <p>
              Try changing class,
              section or search.
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

            {filteredStudents.map(
              (student) => {

                const id =
                  getStudentId(
                    student
                  );

                const status =
                  getStatus(id);

                return (
                  <div
                    className="attendance-row clickable-row"
                    key={id}
                    onClick={() =>
                      openStudentReport(
                        student
                      )
                    }
                  >

                    <span className="student-name-cell">

                      <strong>
                        {getStudentName(
                          student
                        )}
                      </strong>

                      <small>
                        Father:{" "}
                        {getFather(
                          student
                        )}
                      </small>

                    </span>

                    <span>
                      {getClass(
                        student
                      ) || "-"}{" "}
                      -{" "}
                      {getSection(
                        student
                      ) || "-"}
                    </span>

                    <span>
                      {getRoll(
                        student
                      )}
                    </span>

                    <span>
                      {getMobile(
                        student
                      )}
                    </span>

                    <span>

                      <button
                        className={
                          status ===
                          "Present"
                            ? "attendance-btn present active"
                            : "attendance-btn present"
                        }
                        disabled={
                          isHoliday(
                            selectedDate
                          )
                        }
                        onClick={(e) => {

                          e.stopPropagation();

                          markAttendance(
                            id,
                            "Present"
                          );

                        }}
                      >
                        ✓
                      </button>

                    </span>

                    <span>

                      <button
                        className={
                          status ===
                          "Absent"
                            ? "attendance-btn absent active"
                            : "attendance-btn absent"
                        }
                        disabled={
                          isHoliday(
                            selectedDate
                          )
                        }
                        onClick={(e) => {

                          e.stopPropagation();

                          markAttendance(
                            id,
                            "Absent"
                          );

                        }}
                      >
                        ✕
                      </button>

                    </span>

                    <span>

                      <button
                        className={
                          status ===
                          "Leave"
                            ? "attendance-btn leave active"
                            : "attendance-btn leave"
                        }
                        disabled={
                          isHoliday(
                            selectedDate
                          )
                        }
                        onClick={(e) => {

                          e.stopPropagation();

                          markAttendance(
                            id,
                            "Leave"
                          );

                        }}
                      >
                        L
                      </button>

                    </span>

                  </div>
                );
              }
            )}

          </div>
        )}

      </div>

      {!loading &&
        filteredStudents.length > 0 && (
          <div className="unmarked-text">
            {unmarkedCount} student(s)
            not marked yet. Click a
            student to view monthly
            attendance.
          </div>
        )}

      {/* =================================================
          STUDENT REPORT
      ================================================= */}

      {showStudentReport &&
        selectedStudent && (
          <div className="attendance-modal-overlay">

            <div className="attendance-modal student-report-modal">

              <div className="report-header">

                <div>

                  <h2>
                    {getStudentName(
                      selectedStudent
                    )}
                  </h2>

                  <p>
                    Class{" "}
                    {getClass(
                      selectedStudent
                    )}
                    {" - "}
                    Section{" "}
                    {getSection(
                      selectedStudent
                    )}
                    {" | Roll "}
                    {getRoll(
                      selectedStudent
                    )}
                  </p>

                </div>

                <button
                  className="modal-close"
                  onClick={() =>
                    setShowStudentReport(
                      false
                    )
                  }
                >
                  ✕
                </button>

              </div>

              <div className="report-controls">

                <div>

                  <label>
                    Month
                  </label>

                  <input
                    type="month"
                    value={reportMonth}
                    onChange={(e) =>
                      setReportMonth(
                        e.target.value
                      )
                    }
                  />

                </div>

                <button
                  className="btn-print"
                  onClick={
                    printPage
                  }
                >
                  🖨 Print Report
                </button>

              </div>

              {reportLoading ? (

                <div className="attendance-empty small">

                  <div>⏳</div>

                  <h3>
                    Loading Attendance...
                  </h3>

                </div>

              ) : (

                (() => {

                  const report =
                    getStudentMonthlyReport(
                      selectedStudent
                    );

                  return (
                    <>

                      <div className="student-info-grid">

                        <div>
                          <span>
                            Father
                          </span>

                          <strong>
                            {getFather(
                              selectedStudent
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Class
                          </span>

                          <strong>
                            {getClass(
                              selectedStudent
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Roll No
                          </span>

                          <strong>
                            {getRoll(
                              selectedStudent
                            )}
                          </strong>
                        </div>

                        <div>
                          <span>
                            Working Days
                          </span>

                          <strong>
                            {report.workingDays}
                          </strong>
                        </div>

                      </div>

                      <div className="monthly-summary">

                        <div className="summary-box present-box">
                          <span>
                            Present
                          </span>

                          <strong>
                            {report.present}
                          </strong>
                        </div>

                        <div className="summary-box absent-box">
                          <span>
                            Absent
                          </span>

                          <strong>
                            {report.absent}
                          </strong>
                        </div>

                        <div className="summary-box leave-box">
                          <span>
                            Leave
                          </span>

                          <strong>
                            {report.leave}
                          </strong>
                        </div>

                        <div className="summary-box holiday-box">
                          <span>
                            Holiday
                          </span>

                          <strong>
                            {report.holiday}
                          </strong>
                        </div>

                        <div className="summary-box average-box">
                          <span>
                            Attendance
                          </span>

                          <strong>
                            {report.average}%
                          </strong>
                        </div>

                      </div>

                      <div className="student-report-table">

                        <div className="student-report-row report-heading">

                          <span>
                            Date
                          </span>

                          <span>
                            Day
                          </span>

                          <span>
                            Status
                          </span>

                        </div>

                        {report.rows.map(
                          (row) => (
                            <div
                              className="student-report-row"
                              key={
                                row.date
                              }
                            >

                              <span>
                                {formatDate(
                                  row.date
                                )}
                              </span>

                              <span>
                                {getDayName(
                                  row.date
                                )}
                              </span>

                              <span
                                className={
                                  `status-text ${
                                    row.status
                                      .toLowerCase()
                                      .replace(
                                        /\s+/g,
                                        "-"
                                      )
                                  }`
                                }
                              >
                                {row.status}
                              </span>

                            </div>
                          )
                        )}

                      </div>

                    </>
                  );

                })()

              )}

            </div>

          </div>
        )}

      {/* =================================================
          CLASS REPORT
      ================================================= */}

      {showClassReport && (
        <div className="attendance-modal-overlay">

          <div className="attendance-modal class-report-modal">

            <div className="report-header">

              <div>

                <h2>
                  Class Attendance Report
                </h2>

                <p>
                  Monthly student-wise
                  attendance
                </p>

              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setShowClassReport(
                    false
                  )
                }
              >
                ✕
              </button>

            </div>

            <div className="class-report-controls">

              <div>

                <label>
                  Class
                </label>

                <select
                  value={
                    selectedClass
                  }
                  onChange={(e) => {

                    setSelectedClass(
                      e.target.value
                    );

                    setSelectedSection(
                      "All"
                    );

                  }}
                >

                  <option value="All">
                    All Classes
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
                        Class{" "}
                        {className}
                      </option>
                    )
                  )}

                </select>

              </div>

              <div>

                <label>
                  Section
                </label>

                <select
                  value={
                    selectedSection
                  }
                  onChange={(e) =>
                    setSelectedSection(
                      e.target.value
                    )
                  }
                >

                  <option value="All">
                    All Sections
                  </option>

                  {sections.map(
                    (section) => (
                      <option
                        key={section}
                        value={section}
                      >
                        Section{" "}
                        {section}
                      </option>
                    )
                  )}

                </select>

              </div>

              <div>

                <label>
                  Month
                </label>

                <input
                  type="month"
                  value={
                    reportMonth
                  }
                  onChange={(e) =>
                    setReportMonth(
                      e.target.value
                    )
                  }
                />

              </div>

              <div>

                <label>
                  Days
                </label>

                <input
                  type="number"
                  min="1"
                  max="31"
                  value={
                    reportDays
                  }
                  onChange={(e) => {

                    const value =
                      Number(
                        e.target.value
                      );

                    if (
                      !value ||
                      value < 1
                    ) {
                      setReportDays(
                        1
                      );
                      return;
                    }

                    setReportDays(
                      Math.min(
                        31,
                        value
                      )
                    );

                  }}
                />

              </div>

              <button
                className="btn-print"
                onClick={
                  printPage
                }
              >
                🖨 Print
              </button>

            </div>

            <div className="class-report-title">

              <strong>

                {selectedClass ===
                "All"
                  ? "All Classes"
                  : `Class ${selectedClass}`}

                {" "}

                {selectedSection !==
                  "All" &&
                  `- Section ${selectedSection}`}

              </strong>

              <span>

                {classReportDates.length >
                0
                  ? formatDate(
                      classReportDates[0]
                    )
                  : "-"}

                {" → "}

                {classReportDates.length >
                0
                  ? formatDate(
                      classReportDates[
                        classReportDates.length -
                          1
                      ]
                    )
                  : "-"}

              </span>

            </div>

            <div className="class-report-table">

              <div
                className="class-report-row class-report-heading"
                style={{
                  gridTemplateColumns:
                    `220px repeat(${classReportDates.length}, 75px) 100px`,
                }}
              >

                <span>
                  Student
                </span>

                {classReportDates.map(
                  (date) => (
                    <span
                      key={date}
                    >
                      {new Date(
                        `${date}T00:00:00`
                      ).getDate()}
                    </span>
                  )
                )}

                <span>
                  Average
                </span>

              </div>

              {reportStudents.map(
                (student) => {

                  const id =
                    getStudentId(
                      student
                    );

                  let present = 0;
                  let working = 0;

                  return (
                    <div
                      className="class-report-row"
                      key={id}
                      style={{
                        gridTemplateColumns:
                          `220px repeat(${classReportDates.length}, 75px) 100px`,
                      }}
                    >

                      <span className="report-student-name">

                        <strong>
                          {getStudentName(
                            student
                          )}
                        </strong>

                        <small>
                          Roll:{" "}
                          {getRoll(
                            student
                          )}
                        </small>

                      </span>

                      {classReportDates.map(
                        (date) => {

                          const holiday =
                            isHoliday(
                              date
                            );

                          const status =
                            getStatus(
                              id,
                              date
                            );

                          if (
                            !holiday
                          ) {
                            working++;

                            if (
                              status ===
                              "Present"
                            ) {
                              present++;
                            }
                          }

                          return (
                            <span
                              key={
                                date
                              }
                              className={
                                holiday
                                  ? "report-day holiday"
                                  : status ===
                                    "Present"
                                  ? "report-day present"
                                  : status ===
                                    "Absent"
                                  ? "report-day absent"
                                  : status ===
                                    "Leave"
                                  ? "report-day leave"
                                  : "report-day"
                              }
                            >

                              {holiday
                                ? "H"
                                : status ===
                                  "Present"
                                ? "P"
                                : status ===
                                  "Absent"
                                ? "A"
                                : status ===
                                  "Leave"
                                ? "L"
                                : "-"}

                            </span>
                          );
                        }
                      )}

                      <span className="report-average">

                        {working > 0
                          ? (
                              (present /
                                working) *
                              100
                            ).toFixed(
                              1
                            )
                          : "0.0"}

                        %

                      </span>

                    </div>
                  );
                }
              )}

            </div>

            {(() => {

              const stats =
                getClassReportStats();

              return (
                <div className="class-overall-summary">

                  <div>
                    <span>
                      Present
                    </span>

                    <strong>
                      {stats.present}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Absent
                    </span>

                    <strong>
                      {stats.absent}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Leave
                    </span>

                    <strong>
                      {stats.leave}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Holidays
                    </span>

                    <strong>
                      {stats.holidays}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Overall Average
                    </span>

                    <strong>
                      {stats.average}%
                    </strong>
                  </div>

                </div>
              );

            })()}

          </div>

        </div>
      )}

      {/* =================================================
          DAILY SUMMARY
      ================================================= */}

      {showSummary && (
        <div className="attendance-modal-overlay">

          <div className="attendance-modal summary-modal">

            <div className="report-header">

              <div>

                <h2>
                  Attendance Summary
                </h2>

                <p>
                  Daily attendance
                  overview
                </p>

              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setShowSummary(
                    false
                  )
                }
              >
                ✕
              </button>

            </div>

            <div className="summary-date-control">

              <label>
                Date
              </label>

              <input
                type="date"
                value={
                  selectedDate
                }
                onChange={(e) =>
                  setSelectedDate(
                    e.target.value
                  )
                }
              />

              <button
                className="btn-print"
                onClick={
                  printPage
                }
              >
                🖨 Print
              </button>

            </div>

            <div className="big-summary-grid">

              <div className="big-summary present">

                <span>✓</span>

                <p>
                  Present
                </p>

                <strong>
                  {presentCount}
                </strong>

              </div>

              <div className="big-summary absent">

                <span>✕</span>

                <p>
                  Absent
                </p>

                <strong>
                  {absentCount}
                </strong>

              </div>

              <div className="big-summary leave">

                <span>L</span>

                <p>
                  Leave
                </p>

                <strong>
                  {leaveCount}
                </strong>

              </div>

              <div className="big-summary total">

                <span>👨‍🎓</span>

                <p>
                  Total
                </p>

                <strong>
                  {filteredStudents.length}
                </strong>

              </div>

            </div>

            <div className="summary-list">

              {filteredStudents.map(
                (student) => {

                  const status =
                    getStatus(
                      getStudentId(
                        student
                      )
                    ) ||
                    "Not Marked";

                  return (
                    <div
                      className="summary-list-row"
                      key={
                        getStudentId(
                          student
                        )
                      }
                    >

                      <div>

                        <strong>
                          {getStudentName(
                            student
                          )}
                        </strong>

                        <small>
                          Class{" "}
                          {getClass(
                            student
                          )}
                          {" - "}
                          {getSection(
                            student
                          )}
                        </small>

                      </div>

                      <span
                        className={
                          `status-pill ${
                            status
                              .toLowerCase()
                              .replace(
                                /\s+/g,
                                "-"
                              )
                          }`
                        }
                      >
                        {status}
                      </span>

                    </div>
                  );
                }
              )}

            </div>

          </div>

        </div>
      )}

      {/* =================================================
          HOLIDAY MANAGEMENT
      ================================================= */}

      {showHolidays && (
        <div className="attendance-modal-overlay">

          <div className="attendance-modal holiday-modal">

            <div className="report-header">

              <div>

                <h2>
                  School Holidays
                </h2>

                <p>
                  Manage school working
                  days and holidays
                </p>

              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setShowHolidays(
                    false
                  )
                }
              >
                ✕
              </button>

            </div>

            <div className="holiday-form">

              <div>

                <label>
                  Date
                </label>

                <input
                  type="date"
                  value={
                    newHolidayDate
                  }
                  onChange={(e) =>
                    setNewHolidayDate(
                      e.target.value
                    )
                  }
                />

              </div>

              <div>

                <label>
                  Reason
                </label>

                <input
                  type="text"
                  placeholder="e.g. Independence Day"
                  value={
                    newHolidayReason
                  }
                  onChange={(e) =>
                    setNewHolidayReason(
                      e.target.value
                    )
                  }
                />

              </div>

              <button
                className="btn-save"
                onClick={
                  addHoliday
                }
                disabled={
                  holidayLoading
                }
              >
                {holidayLoading
                  ? "Saving..."
                  : "+ Add Holiday"}
              </button>

            </div>

            {(() => {

              const schoolSummary =
                getSchoolDaysSummary(
                  reportMonth
                );

              return (
                <div className="school-days-summary">

                  <div>

                    <span>
                      Total Days
                    </span>

                    <strong>
                      {
                        schoolSummary.totalDays
                      }
                    </strong>

                  </div>

                  <div>

                    <span>
                      Working Days
                    </span>

                    <strong>
                      {
                        schoolSummary.workingDays
                      }
                    </strong>

                  </div>

                  <div>

                    <span>
                      Holidays
                    </span>

                    <strong>
                      {
                        schoolSummary.holidayCount
                      }
                    </strong>

                  </div>

                </div>
              );

            })()}

            <div className="holiday-list-header">

              <div>

                <h3>
                  Holiday List
                </h3>

                <p>
                  {reportMonth}
                </p>

              </div>

              <button
                className="btn-print"
                onClick={
                  printPage
                }
              >
                🖨 Print List
              </button>

            </div>

            {holidays.length === 0 ? (

              <div className="attendance-empty small">

                <div>
                  🏖️
                </div>

                <h3>
                  No Holidays Added
                </h3>

                <p>
                  Add school holidays
                  above.
                </p>

              </div>

            ) : (

              <div className="holiday-list">

                {holidays
                  .filter((holiday) =>
                    String(
                      holiday.date
                    ).startsWith(
                      reportMonth
                    )
                  )
                  .map((holiday) => (

                    <div
                      className="holiday-list-row"
                      key={
                        holiday._id ||
                        holiday.id ||
                        holiday.date
                      }
                    >

                      <div>

                        <strong>
                          {formatDate(
                            holiday.date
                          )}
                        </strong>

                        <span>
                          {holiday.reason ||
                            "School Holiday"}
                        </span>

                      </div>

                      <button
                        className="holiday-delete"
                        disabled={
                          holidayLoading
                        }
                        onClick={() =>
                          removeHoliday(
                            holiday.date,
                            holiday._id ||
                              holiday.id
                          )
                        }
                      >
                        Delete
                      </button>

                    </div>

                  ))}

              </div>

            )}

          </div>

        </div>
      )}

    </div>
  );
}

export default Attendance;

