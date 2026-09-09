
import React, { useEffect, useMemo, useState } from "react";
import "../Style/Classes.css";
import { useAuth } from "../context/AuthContext";

// =========================================================
// DEFAULT SUBJECTS
// =========================================================

const defaultSubjects = [
  { name: "English", average: 0 },
  { name: "Hindi", average: 0 },
  { name: "Mathematics", average: 0 },
  { name: "Science", average: 0 },
  { name: "Social Science", average: 0 },
];

// =========================================================
// OPTIONS
// =========================================================

const classOptions = [
  "PG",
  "Nursery",
  "LKG",
  "UKG",
  "Class 1",
  "Class 2",
  "Class 3",
  "Class 4",
  "Class 5",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
];

const sectionOptions = ["A", "B", "C", "D", "E"];

// =========================================================
// HELPER
// =========================================================

function normalizeClass(item) {
  return {
    id: item?.id || item?._id || null,

    className: item?.className || "",
    section: item?.section || "",

    classTeacher: item?.classTeacher || "",

    classRepresentative:
      item?.classRepresentative || "Not Assigned",

    students: Number(item?.students || 0),

    attendance: Number(item?.attendance || 0),

    totalFees: Number(item?.totalFees || 0),
    collectedFees: Number(item?.collectedFees || 0),
    discountFees: Number(item?.discountFees || 0),

    averageMarks: Number(item?.averageMarks || 0),
    passPercentage: Number(item?.passPercentage || 0),

    topStudent:
      item?.topStudent || "Not Available",

    lowestStudent:
      item?.lowestStudent || "Not Available",

    overallSubjects:
      Array.isArray(item?.overallSubjects)
        ? item.overallSubjects
        : [],

    overallAverage: Number(
      item?.overallAverage || 0
    ),

    status: item?.status || "Active",

    createdAt: item?.createdAt || null,
    updatedAt: item?.updatedAt || null,
  };
}

// =========================================================
// COMPONENT
// =========================================================

function Classes() {
  const { fetchWithAuth } = useAuth();

  // =======================================================
  // STATES
  // =======================================================

  const [classes, setClasses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [showModal, setShowModal] =
    useState(false);

  const [showViewModal, setShowViewModal] =
    useState(false);

  const [showRankingModal, setShowRankingModal] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const [viewClass, setViewClass] =
    useState(null);

  const [search, setSearch] = useState("");

  const [performanceFilter, setPerformanceFilter] =
    useState("All");

  const [newClass, setNewClass] = useState({
    className: "",
    section: "A",
    classTeacher: "",
    classRepresentative: "",
  });

  // =======================================================
  // LOAD CLASSES
  // =======================================================

  const loadClasses = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetchWithAuth("/classes");

      if (!response.ok) {
        throw new Error(
          `Server error: ${response.status}`
        );
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(
          data.message ||
            "Unable to load classes"
        );
      }

      const loadedClasses =
        Array.isArray(data.classes)
          ? data.classes.map(normalizeClass)
          : [];

      setClasses(loadedClasses);
    } catch (err) {
      console.error(
        "Load classes error:",
        err
      );

      setError(
        err.message ||
          "Unable to connect to backend server."
      );
    } finally {
      setLoading(false);
    }
  };

  // =======================================================
  // INITIAL LOAD
  // =======================================================

  useEffect(() => {
    loadClasses();
  }, []);

  // =======================================================
  // STATISTICS
  // =======================================================

  const totalStudents = classes.reduce(
    (total, item) =>
      total + Number(item.students || 0),
    0
  );

  const totalSections = classes.length;

  const activeClasses = classes.filter(
    (item) => item.status === "Active"
  ).length;

  const averageSchoolMarks =
    classes.length > 0
      ? (
          classes.reduce(
            (total, item) =>
              total +
              Number(
                item.averageMarks || 0
              ),
            0
          ) / classes.length
        ).toFixed(1)
      : "0.0";

  const schoolAttendance =
    classes.length > 0
      ? (
          classes.reduce(
            (total, item) =>
              total +
              Number(
                item.attendance || 0
              ),
            0
          ) / classes.length
        ).toFixed(1)
      : "0.0";

  // =======================================================
  // TOP / LOWEST CLASS
  // =======================================================

  const topClass =
    classes.length > 0
      ? [...classes].sort(
          (a, b) =>
            Number(b.averageMarks || 0) -
            Number(a.averageMarks || 0)
        )[0]
      : null;

  const lowestClass =
    classes.length > 0
      ? [...classes].sort(
          (a, b) =>
            Number(a.averageMarks || 0) -
            Number(b.averageMarks || 0)
        )[0]
      : null;

  // =======================================================
  // SEARCH / FILTER
  // =======================================================

  const filteredClasses = useMemo(() => {
    const text = search
      .trim()
      .toLowerCase();

    return classes.filter((item) => {
      const searchableText = [
        item.className,
        item.section,
        item.classTeacher,
        item.classRepresentative,
      ]
        .join(" ")
        .toLowerCase();

      const matchesSearch =
        text === "" ||
        searchableText.includes(text);

      let matchesPerformance = true;

      if (performanceFilter === "Top") {
        matchesPerformance =
          Number(item.averageMarks) >= 85;
      }

      if (
        performanceFilter ===
        "Average"
      ) {
        matchesPerformance =
          Number(item.averageMarks) >= 70 &&
          Number(item.averageMarks) < 85;
      }

      if (performanceFilter === "Low") {
        matchesPerformance =
          Number(item.averageMarks) < 70;
      }

      return (
        matchesSearch &&
        matchesPerformance
      );
    });
  }, [
    classes,
    search,
    performanceFilter,
  ]);

  // =======================================================
  // ADD CLASS
  // =======================================================

  const openAddClass = () => {
    setEditingId(null);

    setNewClass({
      className: "",
      section: "A",
      classTeacher: "",
      classRepresentative: "",
    });

    setError("");
    setShowModal(true);
  };

  // =======================================================
  // EDIT CLASS
  // =======================================================

  const openEditClass = (item) => {
    setEditingId(item.id);

    setNewClass({
      className: item.className || "",
      section: item.section || "A",
      classTeacher:
        item.classTeacher || "",
      classRepresentative:
        item.classRepresentative ===
        "Not Assigned"
          ? ""
          : item.classRepresentative ||
            "",
    });

    setError("");
    setShowModal(true);
  };

  // =======================================================
  // CLOSE ADD/EDIT MODAL
  // =======================================================

  const closeModal = () => {
    if (saving) return;

    setShowModal(false);
    setEditingId(null);

    setNewClass({
      className: "",
      section: "A",
      classTeacher: "",
      classRepresentative: "",
    });

    setError("");
  };

  // =======================================================
  // ADD / UPDATE CLASS
  // =======================================================

  const handleAddClass = async (e) => {
    e.preventDefault();

    const className =
      newClass.className.trim();

    const section =
      newClass.section.trim();

    const classTeacher =
      newClass.classTeacher.trim();

    const classRepresentative =
      newClass.classRepresentative.trim();

    if (
      !className ||
      !section ||
      !classTeacher
    ) {
      alert(
        "Please fill Class, Section and Class Teacher."
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      // =================================================
      // UPDATE
      // =================================================

      if (editingId) {
        const response = await fetchWithAuth(
          `/classes/${editingId}`,
          {
            method: "PUT",
            body: JSON.stringify({
              className,
              section,
              classTeacher,
              classRepresentative,
            }),
          }
        );

        const data =
          await response.json();

        if (!response.ok || !data.success) {
          throw new Error(
            data.message ||
              "Unable to update class"
          );
        }

        const updatedClass =
          normalizeClass(data.class);

        setClasses((previous) =>
          previous.map((item) =>
            item.id === editingId
              ? updatedClass
              : item
          )
        );

        setViewClass((previous) =>
          previous?.id === editingId
            ? updatedClass
            : previous
        );

        closeModal();
        return;
      }

      // =================================================
      // CREATE
      // =================================================

      const response = await fetchWithAuth(
        "/classes",
        {
          method: "POST",
          body: JSON.stringify({
            className,
            section,
            classTeacher,
            classRepresentative,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to create class"
        );
      }

      const createdClass =
        normalizeClass(data.class);

      setClasses((previous) => [
        ...previous,
        createdClass,
      ]);

      closeModal();
    } catch (err) {
      console.error(
        "Save class error:",
        err
      );

      setError(
        err.message ||
          "Unable to save class."
      );
    } finally {
      setSaving(false);
    }
  };

  // =======================================================
  // DELETE CLASS
  // =======================================================

  const handleDelete = async (id) => {
    const item = classes.find(
      (classItem) =>
        classItem.id === id
    );

    if (!item) return;

    const confirmDelete =
      window.confirm(
        `Are you sure you want to delete ${item.className}-${item.section}?`
      );

    if (!confirmDelete) return;

    try {
      setError("");

      const response = await fetchWithAuth(
        `/classes/${id}`,
        {
          method: "DELETE",
        }
      );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to delete class"
        );
      }

      setClasses((previous) =>
        previous.filter(
          (classItem) =>
            classItem.id !== id
        )
      );

      if (viewClass?.id === id) {
        setViewClass(null);
        setShowViewModal(false);
      }
    } catch (err) {
      console.error(
        "Delete class error:",
        err
      );

      setError(
        err.message ||
          "Unable to delete class."
      );
    }
  };

  // =======================================================
  // VIEW CLASS
  // =======================================================

  const openViewClass = async (item) => {
    try {
      setError("");

      const response = await fetchWithAuth(
        `/classes/${item.id}`
      );

      const data =
        await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ||
            "Unable to load class"
        );
      }

      const classData =
        normalizeClass(data.class);

      setViewClass(classData);
      setShowViewModal(true);
    } catch (err) {
      console.error(
        "View class error:",
        err
      );

      // Fallback to already-loaded data
      setViewClass(item);
      setShowViewModal(true);
    }
  };

  // =======================================================
  // CLOSE VIEW
  // =======================================================

  const closeViewClass = () => {
    setViewClass(null);
    setShowViewModal(false);
  };

  // =======================================================
  // PRINT
  // =======================================================

  const printClassReport = (item) => {
    if (!item) return;

    const printWindow =
      window.open(
        "",
        "_blank",
        "width=1000,height=900"
      );

    if (!printWindow) {
      alert(
        "Please allow pop-ups to print."
      );
      return;
    }

    const safe = (value) =>
      value === undefined ||
      value === null ||
      value === ""
        ? "Not Available"
        : value;

    const subjectsHTML = (
      item.overallSubjects || []
    )
      .map(
        (subject, index) => `
          <tr>
            <td>${index + 1}</td>
            <td>${safe(
              subject.name
            )}</td>
            <td>${safe(
              subject.average
            )}%</td>
          </tr>
        `
      )
      .join("");

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>
          ${safe(
            item.className
          )}-${safe(
            item.section
          )} Class Report
        </title>

        <style>
          * {
            box-sizing: border-box;
          }

          body {
            margin: 0;
            padding: 30px;
            font-family: Arial, sans-serif;
            color: #111827;
          }

          .header {
            text-align: center;
            border-bottom: 2px solid #111827;
            padding-bottom: 15px;
            margin-bottom: 20px;
          }

          .header h1 {
            margin: 0;
            font-size: 25px;
          }

          .header p {
            margin: 7px 0 0;
          }

          .title {
            text-align: center;
            margin: 25px 0;
          }

          .title h2 {
            margin: 0;
          }

          .cards {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 12px;
          }

          .card {
            border: 1px solid #444;
            padding: 15px;
            text-align: center;
          }

          .card strong {
            display: block;
            margin-top: 7px;
            font-size: 20px;
          }

          .section {
            margin-top: 25px;
          }

          .section h3 {
            margin: 0;
            padding: 10px;
            background: #eeeeee;
            border: 1px solid #333;
          }

          table {
            width: 100%;
            border-collapse: collapse;
          }

          th,
          td {
            border: 1px solid #555;
            padding: 9px;
            text-align: left;
          }

          th {
            background: #f3f4f6;
          }

          .footer {
            margin-top: 35px;
            display: flex;
            justify-content: space-between;
          }

          @page {
            size: A4;
            margin: 12mm;
          }
        </style>
      </head>

      <body>

        <div class="header">
          <h1>
            Maharana Pratap Science Academy
            Inter College
          </h1>

          <p>
            Class Academic Management Report
          </p>
        </div>

        <div class="title">
          <h2>
            ${safe(
              item.className
            )} -
            Section ${safe(
              item.section
            )}
          </h2>
        </div>

        <div class="cards">

          <div class="card">
            Students
            <strong>
              ${safe(item.students)}
            </strong>
          </div>

          <div class="card">
            Attendance
            <strong>
              ${safe(
                item.attendance
              )}%
            </strong>
          </div>

          <div class="card">
            Overall Average
            <strong>
              ${safe(
                item.overallAverage
              )}%
            </strong>
          </div>

          <div class="card">
            Pass Percentage
            <strong>
              ${safe(
                item.passPercentage
              )}%
            </strong>
          </div>

        </div>

        <div class="section">
          <h3>
            Class Information
          </h3>

          <table>
            <tr>
              <td>Class</td>
              <td>
                ${safe(
                  item.className
                )}
              </td>
            </tr>

            <tr>
              <td>Section</td>
              <td>
                ${safe(
                  item.section
                )}
              </td>
            </tr>

            <tr>
              <td>Class Teacher</td>
              <td>
                ${safe(
                  item.classTeacher
                )}
              </td>
            </tr>

            <tr>
              <td>Class Representative</td>
              <td>
                ${safe(
                  item.classRepresentative
                )}
              </td>
            </tr>
          </table>
        </div>

        <div class="section">
          <h3>
            Overall Subjects
          </h3>

          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Subject</th>
                <th>Average</th>
              </tr>
            </thead>

            <tbody>
              ${subjectsHTML}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h3>
            Result Summary
          </h3>

          <table>

            <tr>
              <td>Overall Class Average</td>
              <td>
                ${safe(
                  item.overallAverage
                )}%
              </td>
            </tr>

            <tr>
              <td>Pass Percentage</td>
              <td>
                ${safe(
                  item.passPercentage
                )}%
              </td>
            </tr>

            <tr>
              <td>Top Student</td>
              <td>
                ${safe(
                  item.topStudent
                )}
              </td>
            </tr>

            <tr>
              <td>Lowest Student</td>
              <td>
                ${safe(
                  item.lowestStudent
                )}
              </td>
            </tr>

          </table>
        </div>

        <div class="section">
          <h3>
            Fees Summary
          </h3>

          <table>

            <tr>
              <td>Total Fees</td>
              <td>
                ₹${Number(
                  item.totalFees || 0
                ).toLocaleString(
                  "en-IN"
                )}
              </td>
            </tr>

            <tr>
              <td>Collected Fees</td>
              <td>
                ₹${Number(
                  item.collectedFees || 0
                ).toLocaleString(
                  "en-IN"
                )}
              </td>
            </tr>

            <tr>
              <td>Discount</td>
              <td>
                ₹${Number(
                  item.discountFees || 0
                ).toLocaleString(
                  "en-IN"
                )}
              </td>
            </tr>

            <tr>
              <td>Due Fees</td>
              <td>
                ₹${Math.max(
                  0,
                  Number(
                    item.totalFees || 0
                  ) -
                    Number(
                      item.collectedFees ||
                        0
                    )
                ).toLocaleString(
                  "en-IN"
                )}
              </td>
            </tr>

          </table>
        </div>

        <div class="footer">
          <span>
            MPSA School
          </span>

          <span>
            Generated:
            ${new Date().toLocaleDateString(
              "en-IN"
            )}
          </span>
        </div>

        <script>
          window.onload = function() {
            window.print();

            window.onafterprint =
              function() {
                window.close();
              };
          };
        </script>

      </body>
      </html>
    `);

    printWindow.document.close();
  };

  // =======================================================
  // RANKING
  // =======================================================

  const rankedClasses = [...classes]
    .sort(
      (a, b) =>
        Number(
          b.overallAverage || 0
        ) -
        Number(
          a.overallAverage || 0
        )
    )
    .map((item, index) => ({
      ...item,
      rank: index + 1,
    }));

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div className="classes-page">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="classes-header">

        <div className="classes-header-content">

          <div className="classes-header-icon">
            🏫
          </div>

          <div>
            <h1>
              Classes & Sections
            </h1>

            <p>
              Manage classes, sections,
              teachers, representatives,
              students and academic performance
            </p>
          </div>

        </div>

        <button
          className="add-class-btn"
          onClick={openAddClass}
          disabled={loading}
        >
          <span>＋</span>
          Add Class
        </button>

      </div>

      {/* =================================================
          ERROR
      ================================================= */}

      {error && (
        <div
          style={{
            margin: "15px 0",
            padding: "12px 16px",
            borderRadius: "8px",
            background: "#fee2e2",
            color: "#991b1b",
            border: "1px solid #fecaca",
          }}
        >
          <strong>
            Error:
          </strong>{" "}
          {error}

          <button
            type="button"
            onClick={loadClasses}
            style={{
              marginLeft: "12px",
              padding: "6px 12px",
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* =================================================
          STAT CARDS
      ================================================= */}

      <div className="class-stats">

        <div className="class-stat-card">

          <div className="stat-icon blue">
            🏫
          </div>

          <div>
            <span>
              Total Sections
            </span>

            <strong>
              {loading
                ? "..."
                : totalSections}
            </strong>
          </div>

        </div>

        <div className="class-stat-card">

          <div className="stat-icon purple">
            👨‍🎓
          </div>

          <div>
            <span>
              Total Students
            </span>

            <strong>
              {loading
                ? "..."
                : totalStudents}
            </strong>
          </div>

        </div>

        <div className="class-stat-card">

          <div className="stat-icon green">
            📊
          </div>

          <div>
            <span>
              School Average
            </span>

            <strong>
              {loading
                ? "..."
                : `${averageSchoolMarks}%`}
            </strong>
          </div>

        </div>

        <div className="class-stat-card">

          <div className="stat-icon orange">
            📅
          </div>

          <div>
            <span>
              Attendance
            </span>

            <strong>
              {loading
                ? "..."
                : `${schoolAttendance}%`}
            </strong>
          </div>

        </div>

      </div>

      {/* =================================================
          TOP / LOWEST
      ================================================= */}

      <div className="performance-cards">

        <div className="performance-card top-performance">

          <div className="performance-icon">
            🏆
          </div>

          <div>
            <span>
              Top Performing Class
            </span>

            <h3>
              {topClass
                ? `${topClass.className}-${topClass.section}`
                : "—"}
            </h3>

            <p>
              Average:{" "}
              {topClass
                ? `${topClass.averageMarks}%`
                : "—"}
            </p>
          </div>

        </div>

        <div className="performance-card low-performance">

          <div className="performance-icon">
            📉
          </div>

          <div>
            <span>
              Lowest Performing Class
            </span>

            <h3>
              {lowestClass
                ? `${lowestClass.className}-${lowestClass.section}`
                : "—"}
            </h3>

            <p>
              Average:{" "}
              {lowestClass
                ? `${lowestClass.averageMarks}%`
                : "—"}
            </p>
          </div>

        </div>

        <button
          className="ranking-btn"
          onClick={() =>
            setShowRankingModal(true)
          }
        >
          🏆 View Class Ranking
        </button>

      </div>

      {/* =================================================
          SEARCH
      ================================================= */}

      <div className="classes-tools">

        <div className="classes-search">

          <span>🔍</span>

          <input
            type="text"
            placeholder="Search class, section, teacher or representative..."
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

        <select
          value={performanceFilter}
          onChange={(e) =>
            setPerformanceFilter(
              e.target.value
            )
          }
        >
          <option value="All">
            All Performance
          </option>

          <option value="Top">
            Top Performing
          </option>

          <option value="Average">
            Average
          </option>

          <option value="Low">
            Low Performing
          </option>
        </select>

      </div>

      <div className="result-info">

        Showing{" "}
        <strong>
          {filteredClasses.length}
        </strong>{" "}
        of{" "}
        <strong>
          {classes.length}
        </strong>{" "}
        class sections

      </div>

      {/* =================================================
          TABLE
      ================================================= */}

      <div className="classes-table-card">

        <div className="table-top">

          <div>
            <h2>
              All Classes & Sections
            </h2>

            <p>
              Academic Session 2026-27
            </p>
          </div>

          <button
            type="button"
            onClick={loadClasses}
            disabled={loading}
            style={{
              padding:
                "8px 14px",
              cursor:
                loading
                  ? "not-allowed"
                  : "pointer",
            }}
          >
            {loading
              ? "Loading..."
              : "↻ Refresh"}
          </button>

        </div>

        <div className="table-wrapper">

          <table className="class-table">

            <thead>

              <tr>

                <th>#</th>

                <th>
                  Class
                </th>

                <th>
                  Class Teacher
                </th>

                <th>
                  Class Representative
                </th>

                <th>
                  Students
                </th>

                <th>
                  Attendance
                </th>

                <th>
                  Overall Average
                </th>

                <th>
                  Status
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {loading ? (

                <tr>
                  <td
                    colSpan="9"
                    className="empty-table"
                  >
                    <h3>
                      Loading Classes...
                    </h3>

                    <p>
                      Fetching class data
                      from MongoDB.
                    </p>
                  </td>
                </tr>

              ) : filteredClasses.length ===
                0 ? (

                <tr>

                  <td
                    colSpan="9"
                    className="empty-table"
                  >

                    <h3>
                      No Classes Found
                    </h3>

                    <p>
                      {classes.length === 0
                        ? "No classes are saved in MongoDB yet. Click Add Class to create one."
                        : "Try another search or filter."}
                    </p>

                  </td>

                </tr>

              ) : (

                filteredClasses.map(
                  (item, index) => (

                    <tr key={item.id}>

                      <td className="serial">
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </td>

                      <td>

                        <div className="class-name-cell">

                          <div className="small-class-icon">
                            🏫
                          </div>

                          <div>

                            <strong>
                              {item.className}
                            </strong>

                            <small>
                              Section{" "}
                              {item.section}
                            </small>

                          </div>

                        </div>

                      </td>

                      <td>

                        <div className="teacher-cell">

                          <div className="teacher-avatar">
                            {item.classTeacher
                              ?.charAt(
                                0
                              )
                              .toUpperCase()}
                          </div>

                          <span>
                            {item.classTeacher}
                          </span>

                        </div>

                      </td>

                      <td>

                        <div className="cr-cell">

                          <span className="cr-badge">
                            CR
                          </span>

                          <span>
                            {item.classRepresentative ||
                              "Not Assigned"}
                          </span>

                        </div>

                      </td>

                      <td>

                        <strong className="student-count">
                          {item.students}
                        </strong>

                      </td>

                      <td>

                        <div className="percentage-cell">

                          <strong>
                            {item.attendance}%
                          </strong>

                          <div className="progress-bar">

                            <span
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.max(
                                    0,
                                    item.attendance
                                  )
                                )}%`,
                              }}
                            />

                          </div>

                        </div>

                      </td>

                      <td>

                        <div className="average-cell">

                          <strong>
                            {item.overallAverage}%
                          </strong>

                          <small>
                            Pass{" "}
                            {item.passPercentage}%
                          </small>

                        </div>

                      </td>

                      <td>

                        <span className="status-active">
                          ● {item.status}
                        </span>

                      </td>

                      <td>

                        <div className="action-buttons">

                          <button
                            type="button"
                            title="View Class"
                            onClick={() =>
                              openViewClass(
                                item
                              )
                            }
                          >
                            👁️
                          </button>

                          <button
                            type="button"
                            title="Edit Class"
                            className="edit-btn"
                            onClick={() =>
                              openEditClass(
                                item
                              )
                            }
                          >
                            ✏️
                          </button>

                          <button
                            type="button"
                            title="Delete Class"
                            className="delete-btn"
                            onClick={() =>
                              handleDelete(
                                item.id
                              )
                            }
                          >
                            🗑️
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {showModal && (

        <div
          className="modal-overlay"
          onClick={closeModal}
        >

          <div
            className="class-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <h2>
                  {editingId
                    ? "Edit Class"
                    : "Add New Class"}
                </h2>

                <p>
                  Manage class, section,
                  teacher and representative
                </p>

              </div>

              <button
                type="button"
                className="close-modal"
                onClick={closeModal}
                disabled={saving}
              >
                ×
              </button>

            </div>

            {error && (
              <div
                style={{
                  margin:
                    "10px 0",
                  padding:
                    "10px",
                  borderRadius:
                    "7px",
                  background:
                    "#fee2e2",
                  color:
                    "#991b1b",
                }}
              >
                {error}
              </div>
            )}

            <form
              onSubmit={
                handleAddClass
              }
            >

              <div className="form-grid">

                <div className="form-group">

                  <label>
                    Class Name *
                  </label>

                  <select
                    value={
                      newClass.className
                    }
                    onChange={(e) =>
                      setNewClass({
                        ...newClass,
                        className:
                          e.target.value,
                      })
                    }
                    disabled={saving}
                  >

                    <option value="">
                      Select Class
                    </option>

                    {classOptions.map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          {item}
                        </option>
                      )
                    )}

                  </select>

                </div>

                <div className="form-group">

                  <label>
                    Section *
                  </label>

                  <select
                    value={
                      newClass.section
                    }
                    onChange={(e) =>
                      setNewClass({
                        ...newClass,
                        section:
                          e.target.value,
                      })
                    }
                    disabled={saving}
                  >

                    {sectionOptions.map(
                      (item) => (
                        <option
                          key={item}
                          value={item}
                        >
                          Section {item}
                        </option>
                      )
                    )}

                  </select>

                </div>

                <div className="form-group">

                  <label>
                    Class Teacher *
                  </label>

                  <input
                    type="text"
                    placeholder="Enter class teacher"
                    value={
                      newClass.classTeacher
                    }
                    onChange={(e) =>
                      setNewClass({
                        ...newClass,
                        classTeacher:
                          e.target.value,
                      })
                    }
                    disabled={saving}
                  />

                </div>

                <div className="form-group">

                  <label>
                    Class Representative
                  </label>

                  <input
                    type="text"
                    placeholder="Select student later"
                    value={
                      newClass.classRepresentative
                    }
                    onChange={(e) =>
                      setNewClass({
                        ...newClass,
                        classRepresentative:
                          e.target.value,
                      })
                    }
                    disabled={saving}
                  />

                  <small>
                    Later this can be
                    connected automatically
                    with the student/result
                    system.
                  </small>

                </div>

              </div>

              <div className="class-preview">

                <span>
                  Class Preview
                </span>

                <strong>
                  {newClass.className ||
                    "Class"}
                  -
                  {newClass.section ||
                    "A"}
                </strong>

              </div>

              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeModal}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-class-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Class"
                    : "Add Class"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

      {/* =================================================
          VIEW CLASS MODAL
      ================================================= */}

      {showViewModal &&
        viewClass && (

          <div
            className="modal-overlay"
            onClick={
              closeViewClass
            }
          >

            <div
              className="class-view-modal"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="class-view-header">

                <button
                  type="button"
                  className="close-modal"
                  onClick={
                    closeViewClass
                  }
                >
                  ×
                </button>

                <div className="view-class-icon">
                  🏫
                </div>

                <div>

                  <h2>
                    {viewClass.className} -
                    {viewClass.section}
                  </h2>

                  <p>
                    Complete Class Academic
                    Overview
                  </p>

                  <span className="status-active">
                    ● {viewClass.status}
                  </span>

                </div>

              </div>

              <div className="view-class-content">

                {/* CLASS INFORMATION */}

                <div className="view-section">

                  <div className="view-section-title">

                    <span>
                      🏫
                    </span>

                    <div>

                      <h3>
                        Class Information
                      </h3>

                      <p>
                        Basic class details
                      </p>

                    </div>

                  </div>

                  <div className="view-grid">

                    <div>
                      <label>
                        Class
                      </label>

                      <strong>
                        {viewClass.className}
                      </strong>
                    </div>

                    <div>
                      <label>
                        Section
                      </label>

                      <strong>
                        {viewClass.section}
                      </strong>
                    </div>

                    <div>
                      <label>
                        Class Teacher
                      </label>

                      <strong>
                        {viewClass.classTeacher}
                      </strong>
                    </div>

                    <div>
                      <label>
                        Class Representative
                      </label>

                      <strong>
                        {viewClass.classRepresentative ||
                          "Not Assigned"}
                      </strong>
                    </div>

                  </div>

                </div>

                {/* PERFORMANCE */}

                <div className="view-section">

                  <div className="view-section-title">

                    <span>
                      📊
                    </span>

                    <div>

                      <h3>
                        Class Performance
                      </h3>

                      <p>
                        Overall academic
                        performance
                      </p>

                    </div>

                  </div>

                  <div className="view-stat-grid">

                    <div className="view-stat">

                      <span>
                        👨‍🎓
                      </span>

                      <div>

                        <label>
                          Students
                        </label>

                        <strong>
                          {viewClass.students}
                        </strong>

                      </div>

                    </div>

                    <div className="view-stat">

                      <span>
                        📅
                      </span>

                      <div>

                        <label>
                          Attendance
                        </label>

                        <strong>
                          {viewClass.attendance}%
                        </strong>

                      </div>

                    </div>

                    <div className="view-stat">

                      <span>
                        📈
                      </span>

                      <div>

                        <label>
                          Overall Average
                        </label>

                        <strong>
                          {viewClass.overallAverage}%
                        </strong>

                      </div>

                    </div>

                    <div className="view-stat">

                      <span>
                        ✅
                      </span>

                      <div>

                        <label>
                          Pass %
                        </label>

                        <strong>
                          {viewClass.passPercentage}%
                        </strong>

                      </div>

                    </div>

                  </div>

                </div>

                {/* SUBJECTS */}

                <div className="view-section">

                  <div className="view-section-title">

                    <span>
                      📚
                    </span>

                    <div>

                      <h3>
                        Overall Subjects
                      </h3>

                      <p>
                        Subject-wise average
                      </p>

                    </div>

                  </div>

                  <div className="subjects-average-grid">

                    {(
                      viewClass.overallSubjects ||
                      defaultSubjects
                    ).map(
                      (
                        subject,
                        index
                      ) => (

                        <div
                          className="subject-average-card"
                          key={`${subject.name}-${index}`}
                        >

                          <div className="subject-number">
                            {index + 1}
                          </div>

                          <div className="subject-average-info">

                            <strong>
                              {subject.name}
                            </strong>

                            <span>
                              Subject Average
                            </span>

                          </div>

                          <div className="subject-average-value">
                            {Number(
                              subject.average ||
                                0
                            )}
                            %
                          </div>

                        </div>

                      )
                    )}

                  </div>

                  <div className="overall-class-average">

                    <div>

                      <span>
                        Overall Class Average
                      </span>

                      <small>
                        All subjects combined
                      </small>

                    </div>

                    <strong>
                      {viewClass.overallAverage ||
                        0}
                      %
                    </strong>

                  </div>

                </div>

                {/* RESULT */}

                <div className="view-section">

                  <div className="view-section-title">

                    <span>
                      🏆
                    </span>

                    <div>

                      <h3>
                        Result Summary
                      </h3>

                      <p>
                        Class result
                        performance
                      </p>

                    </div>

                  </div>

                  <div className="result-highlight-grid">

                    <div className="rank-box first">

                      <span>
                        🥇
                      </span>

                      <label>
                        Top Student
                      </label>

                      <strong>
                        {viewClass.topStudent}
                      </strong>

                    </div>

                    <div className="rank-box">

                      <span>
                        📉
                      </span>

                      <label>
                        Lowest Student
                      </label>

                      <strong>
                        {viewClass.lowestStudent}
                      </strong>

                    </div>

                  </div>

                </div>

                {/* FEES */}

                <div className="view-section">

                  <div className="view-section-title">

                    <span>
                      💰
                    </span>

                    <div>

                      <h3>
                        Fees Summary
                      </h3>

                      <p>
                        Class fee collection
                      </p>

                    </div>

                  </div>

                  <div className="fees-summary-grid">

                    <div>

                      <label>
                        Total Fees
                      </label>

                      <strong>
                        ₹
                        {Number(
                          viewClass.totalFees ||
                            0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                    </div>

                    <div>

                      <label>
                        Collected
                      </label>

                      <strong>
                        ₹
                        {Number(
                          viewClass.collectedFees ||
                            0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                    </div>

                    <div>

                      <label>
                        Discount
                      </label>

                      <strong>
                        ₹
                        {Number(
                          viewClass.discountFees ||
                            0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                    </div>

                    <div>

                      <label>
                        Due
                      </label>

                      <strong>
                        ₹
                        {Math.max(
                          0,
                          Number(
                            viewClass.totalFees ||
                              0
                          ) -
                            Number(
                              viewClass.collectedFees ||
                                0
                            )
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </strong>

                    </div>

                  </div>

                </div>

              </div>

              {/* VIEW ACTIONS */}

              <div className="view-modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={
                    closeViewClass
                  }
                >
                  Close
                </button>

                <button
                  type="button"
                  className="print-class-btn"
                  onClick={() =>
                    printClassReport(
                      viewClass
                    )
                  }
                >
                  🖨️ Print Class Report
                </button>

                <button
                  type="button"
                  className="save-class-btn"
                  onClick={() => {

                    const item =
                      viewClass;

                    closeViewClass();

                    openEditClass(
                      item
                    );

                  }}
                >
                  ✏️ Edit Class
                </button>

              </div>

            </div>

          </div>

        )}

      {/* =================================================
          RANKING MODAL
      ================================================= */}

      {showRankingModal && (

        <div
          className="modal-overlay"
          onClick={() =>
            setShowRankingModal(
              false
            )
          }
        >

          <div
            className="ranking-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <h2>
                  🏆 Class Performance Ranking
                </h2>

                <p>
                  Classes ranked according
                  to overall average
                </p>

              </div>

              <button
                type="button"
                className="close-modal"
                onClick={() =>
                  setShowRankingModal(
                    false
                  )
                }
              >
                ×
              </button>

            </div>

            <div className="ranking-list">

              {rankedClasses.length ===
              0 ? (

                <div
                  style={{
                    padding:
                      "30px",
                    textAlign:
                      "center",
                  }}
                >
                  No classes available
                  for ranking.
                </div>

              ) : (

                rankedClasses.map(
                  (item) => (

                    <div
                      className={`ranking-item ${
                        item.rank <= 3
                          ? "top-rank"
                          : ""
                      }`}
                      key={item.id}
                    >

                      <div className="rank-number">

                        {item.rank ===
                        1
                          ? "🥇"
                          : item.rank ===
                            2
                          ? "🥈"
                          : item.rank ===
                            3
                          ? "🥉"
                          : `#${item.rank}`}

                      </div>

                      <div className="ranking-class">

                        <strong>
                          {item.className}-
                          {item.section}
                        </strong>

                        <small>
                          Teacher:{" "}
                          {item.classTeacher}
                        </small>

                      </div>

                      <div className="ranking-average">

                        <strong>
                          {item.overallAverage}%
                        </strong>

                        <small>
                          Average
                        </small>

                      </div>

                      <div className="ranking-pass">

                        <strong>
                          {item.passPercentage}%
                        </strong>

                        <small>
                          Pass
                        </small>

                      </div>

                      <div className="ranking-attendance">

                        <strong>
                          {item.attendance}%
                        </strong>

                        <small>
                          Attendance
                        </small>

                      </div>

                    </div>

                  )
                )

              )}

            </div>

            <div className="ranking-footer">

              <button
                type="button"
                className="cancel-btn"
                onClick={() =>
                  setShowRankingModal(
                    false
                  )
                }
              >
                Close
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Classes;

