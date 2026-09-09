import React, { useEffect, useMemo, useState } from "react";
import "../Style/Results.css";
import { SERVER_BASE_URL } from "../config/api";

const API_URL = SERVER_BASE_URL;
const EXAM_STORAGE_KEY = "mpsa_results_exams";
const SESSION = "2026-27";

const DEFAULT_EXAMS = [
  {
    id: "exam-1",
    name: "Exam 1",
    internalMax: 30,
    externalMax: 70,
  },
  {
    id: "exam-2",
    name: "Exam 2",
    internalMax: 30,
    externalMax: 70,
  },
  {
    id: "exam-3",
    name: "Exam 3",
    internalMax: 30,
    externalMax: 70,
  },
];

/* =========================================================
   HELPERS
========================================================= */

const naturalSort = (a, b) =>
  String(a).localeCompare(String(b), undefined, {
    numeric: true,
    sensitivity: "base",
  });

const getGrade = (percentage) => {
  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  if (percentage >= 40) return "D";
  return "F";
};

const getStudentId = (student) =>
  student?.id || student?._id || "";

const getStudentClass = (student) =>
  student?.class ||
  student?.className ||
  student?.standard ||
  "";

const getStudentSection = (student) =>
  student?.section || "";

const getStudentRoll = (student) =>
  student?.rollNo ||
  student?.rollNumber ||
  student?.roll ||
  "-";

const getFatherName = (student) =>
  student?.father ||
  student?.fatherName ||
  "-";

const getSubjectName = (subject) => {
  if (typeof subject === "string") return subject;

  return (
    subject?.name ||
    subject?.subjectName ||
    subject?.title ||
    subject?.subject ||
    ""
  );
};

const getSubjectClass = (subject) =>
  subject?.class ||
  subject?.className ||
  subject?.classId ||
  subject?.standard ||
  subject?.grade ||
  "";

const getSubjectSection = (subject) =>
  subject?.section ||
  subject?.sectionName ||
  "";

const getTeacherName = (subject) => {
  if (typeof subject === "string") return "";

  if (typeof subject?.teacher === "object") {
    return (
      subject.teacher?.name ||
      subject.teacher?.teacherName ||
      ""
    );
  }

  return (
    subject?.teacherName ||
    subject?.teacher ||
    subject?.assignedTeacher ||
    ""
  );
};

const parseListResponse = (data, key) => {
  if (Array.isArray(data)) return data;
  return data?.[key] || data?.data || [];
};

/* =========================================================
   MAIN RESULTS COMPONENT
========================================================= */

const Results = () => {
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [exams, setExams] = useState([]);

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");
  const [sectionFilter, setSectionFilter] = useState("All");

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedExam, setSelectedExam] = useState("");
  const [marks, setMarks] = useState({});

  const [loading, setLoading] = useState(true);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [showView, setShowView] = useState(false);
  const [viewResult, setViewResult] = useState(null);

  const [showExamModal, setShowExamModal] = useState(false);
  const [editingExam, setEditingExam] = useState(null);

  const [showReport, setShowReport] = useState(false);
  const [reportType, setReportType] = useState("class");
  const [reportClass, setReportClass] = useState("All");
  const [reportSection, setReportSection] = useState("All");
  const [reportLimit, setReportLimit] = useState("10");

  const [examForm, setExamForm] = useState({
    name: "",
    internalMax: 30,
    externalMax: 70,
  });

  /* =========================================================
     INITIAL LOAD
  ========================================================= */

  useEffect(() => {
    loadInitialData();
    loadExams();
  }, []);

  const loadInitialData = async () => {
    setLoading(true);
    setError("");

    try {
      const [studentsRes, resultsRes, subjectsRes] =
        await Promise.all([
          fetch(`${API_URL}/api/students`),
          fetch(`${API_URL}/api/results`),
          fetch(`${API_URL}/api/subjects`),
        ]);

      if (studentsRes.ok) {
        const data = await studentsRes.json();
        setStudents(parseListResponse(data, "students"));
      }

      if (resultsRes.ok) {
        const data = await resultsRes.json();
        setResults(parseListResponse(data, "results"));
      }

      if (subjectsRes.ok) {
        const data = await subjectsRes.json();
        setSubjects(parseListResponse(data, "subjects"));
      }
    } catch (err) {
      console.error(err);
      setError("Backend server se data load nahi ho pa raha.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================================================
     EXAMS
  ========================================================= */

  const loadExams = () => {
    try {
      const saved = localStorage.getItem(EXAM_STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed) && parsed.length) {
          setExams(parsed);
          setSelectedExam(parsed[0].name);
          return;
        }
      }
    } catch (err) {
      console.error(err);
    }

    localStorage.setItem(
      EXAM_STORAGE_KEY,
      JSON.stringify(DEFAULT_EXAMS)
    );

    setExams(DEFAULT_EXAMS);
    setSelectedExam(DEFAULT_EXAMS[0].name);
  };

  const saveExams = (newExams) => {
    setExams(newExams);
    localStorage.setItem(
      EXAM_STORAGE_KEY,
      JSON.stringify(newExams)
    );
  };

  const openAddExam = () => {
    setEditingExam(null);
    setExamForm({
      name: "",
      internalMax: 30,
      externalMax: 70,
    });
    setShowExamModal(true);
  };

  const openEditExam = (exam) => {
    setEditingExam(exam);

    setExamForm({
      name: exam.name,
      internalMax: exam.internalMax,
      externalMax: exam.externalMax,
    });

    setShowExamModal(true);
  };

  const saveExam = () => {
    const name = examForm.name.trim();
    const internalMax = Number(examForm.internalMax);
    const externalMax = Number(examForm.externalMax);

    if (!name) {
      setError("Exam name enter karo.");
      return;
    }

    if (internalMax < 0 || externalMax < 0) {
      setError("Marks 0 se kam nahi ho sakte.");
      return;
    }

    if (internalMax + externalMax <= 0) {
      setError("Total marks 0 nahi ho sakte.");
      return;
    }

    const duplicate = exams.some(
      (exam) =>
        exam.name.toLowerCase() === name.toLowerCase() &&
        (!editingExam || exam.id !== editingExam.id)
    );

    if (duplicate) {
      setError("Ye exam already added hai.");
      return;
    }

    let updated;

    if (editingExam) {
      updated = exams.map((exam) =>
        exam.id === editingExam.id
          ? {
              ...exam,
              name,
              internalMax,
              externalMax,
            }
          : exam
      );

      if (selectedExam === editingExam.name) {
        setSelectedExam(name);
      }

      setMessage("Exam updated successfully.");
    } else {
      const newExam = {
        id: `exam-${Date.now()}`,
        name,
        internalMax,
        externalMax,
      };

      updated = [...exams, newExam];
      setSelectedExam(name);
      setMessage("New exam added successfully.");
    }

    saveExams(updated);
    setShowExamModal(false);
    setError("");
  };

  const deleteExam = (exam) => {
    if (exams.length <= 1) {
      setError("Kam se kam ek exam hona chahiye.");
      return;
    }

    if (!window.confirm(`"${exam.name}" delete karna hai?`)) {
      return;
    }

    const updated = exams.filter(
      (item) => item.id !== exam.id
    );

    saveExams(updated);

    if (selectedExam === exam.name) {
      setSelectedExam(updated[0]?.name || "");
    }

    setMessage("Exam deleted successfully.");
  };

  const currentExam = useMemo(
    () =>
      exams.find((exam) => exam.name === selectedExam) || {
        name: selectedExam,
        internalMax: 30,
        externalMax: 70,
      },
    [exams, selectedExam]
  );

  /* =========================================================
     CLASS / SECTION FILTERS
  ========================================================= */

  const classList = useMemo(() => {
    const values = students
      .map(getStudentClass)
      .filter(Boolean);

    return [
      "All",
      ...Array.from(new Set(values)).sort(naturalSort),
    ];
  }, [students]);

  const sectionList = useMemo(() => {
    const filtered =
      reportClass === "All"
        ? students
        : students.filter(
            (student) =>
              String(getStudentClass(student)) ===
              String(reportClass)
          );

    const values = filtered
      .map(getStudentSection)
      .filter(Boolean);

    return [
      "All",
      ...Array.from(new Set(values)).sort(naturalSort),
    ];
  }, [students, reportClass]);

  const studentSectionList = useMemo(() => {
    const filtered =
      classFilter === "All"
        ? students
        : students.filter(
            (student) =>
              String(getStudentClass(student)) ===
              String(classFilter)
          );

    const values = filtered
      .map(getStudentSection)
      .filter(Boolean);

    return [
      "All",
      ...Array.from(new Set(values)).sort(naturalSort),
    ];
  }, [students, classFilter]);

  /* =========================================================
     STUDENT FILTER
  ========================================================= */

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...students]
      .filter((student) => {
        const name = String(student.name || "").toLowerCase();
        const roll = String(getStudentRoll(student)).toLowerCase();
        const admission = String(
          student.admissionNo || ""
        ).toLowerCase();

        const searchMatch =
          !query ||
          name.includes(query) ||
          roll.includes(query) ||
          admission.includes(query);

        const classMatch =
          classFilter === "All" ||
          String(getStudentClass(student)) ===
            String(classFilter);

        const sectionMatch =
          sectionFilter === "All" ||
          String(getStudentSection(student)) ===
            String(sectionFilter);

        return searchMatch && classMatch && sectionMatch;
      })
      .sort((a, b) =>
        naturalSort(a.name || "", b.name || "")
      );
  }, [
    students,
    search,
    classFilter,
    sectionFilter,
  ]);

  /* =========================================================
     SUBJECTS
  ========================================================= */

  const getSubjectsForStudent = async (student) => {
    setSubjectsLoading(true);

    try {
      let list = subjects;

      if (!list.length) {
        const response = await fetch(
          `${API_URL}/api/subjects`
        );

        if (response.ok) {
          const data = await response.json();
          list = parseListResponse(data, "subjects");
          setSubjects(list);
        }
      }

      const studentClass = String(
        getStudentClass(student)
      )
        .trim()
        .toLowerCase();

      const studentSection = String(
        getStudentSection(student)
      )
        .trim()
        .toLowerCase();

      const matching = list.filter((subject) => {
        const subjectClass = String(
          getSubjectClass(subject)
        )
          .trim()
          .toLowerCase();

        const subjectSection = String(
          getSubjectSection(subject)
        )
          .trim()
          .toLowerCase();

        if (!subjectClass) return true;

        const classMatch =
          subjectClass === studentClass ||
          subjectClass.includes(studentClass) ||
          studentClass.includes(subjectClass);

        if (subjectSection) {
          return (
            classMatch &&
            subjectSection === studentSection
          );
        }

        return classMatch;
      });

      const unique = [];

      matching.forEach((subject) => {
        const name = getSubjectName(subject);

        if (
          name &&
          !unique.some(
            (item) =>
              getSubjectName(item).toLowerCase() ===
              name.toLowerCase()
          )
        ) {
          unique.push(subject);
        }
      });

      return unique;
    } catch (err) {
      console.error(err);
      return [];
    } finally {
      setSubjectsLoading(false);
    }
  };

  const createEmptyMarks = (subjectList) => {
    const data = {};

    subjectList.forEach((subject) => {
      const name = getSubjectName(subject);

      if (!name) return;

      data[name] = {
        internal: "",
        external: "",
        teacher: getTeacherName(subject),
      };
    });

    return data;
  };

  const convertResultToMarks = (result, examName) => {
    const data = {};
    const examData = result?.exams?.[examName];

    if (!examData) return data;

    (examData.subjects || []).forEach((subject) => {
      data[subject.name] = {
        internal: subject.internal ?? "",
        external: subject.external ?? "",
        teacher: subject.teacher || "",
      };
    });

    return data;
  };

  /* =========================================================
     SELECT STUDENT
  ========================================================= */

  const selectStudent = async (student) => {
    setSelectedStudent(student);
    setShowView(false);
    setViewResult(null);
    setMessage("");
    setError("");

    const subjectList =
      await getSubjectsForStudent(student);

    let savedMarks = {};

    try {
      const response = await fetch(
        `${API_URL}/api/results/student/${getStudentId(student)}`
      );

      if (response.ok) {
        const data = await response.json();

        savedMarks = convertResultToMarks(
          data,
          selectedExam
        );
      }
    } catch (err) {
      console.error(err);
    }

    setMarks({
      ...createEmptyMarks(subjectList),
      ...savedMarks,
    });
  };

  /* =========================================================
     LOAD EXAM
  ========================================================= */

  const loadExam = async (examName) => {
    setSelectedExam(examName);
    setMessage("");
    setError("");

    if (!selectedStudent) return;

    try {
      const [resultResponse, subjectList] =
        await Promise.all([
          fetch(
            `${API_URL}/api/results/student/${getStudentId(
              selectedStudent
            )}`
          ),
          getSubjectsForStudent(selectedStudent),
        ]);

      let savedMarks = {};

      if (resultResponse.ok) {
        const data = await resultResponse.json();

        savedMarks = convertResultToMarks(
          data,
          examName
        );
      }

      setMarks({
        ...createEmptyMarks(subjectList),
        ...savedMarks,
      });
    } catch (err) {
      console.error(err);
      setMarks({});
    }
  };

  /* =========================================================
     MARKS
  ========================================================= */

  const handleMarksChange = (
    subject,
    type,
    value
  ) => {
    if (value !== "") {
      const number = Number(value);

      if (Number.isNaN(number)) return;

      const max =
        type === "internal"
          ? Number(currentExam.internalMax)
          : Number(currentExam.externalMax);

      value = Math.min(Math.max(number, 0), max);
    }

    setMarks((prev) => ({
      ...prev,
      [subject]: {
        ...(prev[subject] || {}),
        [type]: value,
      },
    }));
  };

  /* =========================================================
     SUMMARY
  ========================================================= */

  const currentSummary = useMemo(() => {
    const internalMax =
      Number(currentExam.internalMax) || 0;

    const externalMax =
      Number(currentExam.externalMax) || 0;

    const subjectCount = Object.keys(marks).length;

    const max =
      subjectCount *
      (internalMax + externalMax);

    const total = Object.values(marks).reduce(
      (sum, subject) =>
        sum +
        (Number(subject.internal) || 0) +
        (Number(subject.external) || 0),
      0
    );

    const percentage =
      max > 0 ? (total / max) * 100 : 0;

    return {
      total,
      max,
      percentage,
      grade: getGrade(percentage),
    };
  }, [marks, currentExam]);

  /* =========================================================
     SAVE RESULT
  ========================================================= */

  const saveResult = async () => {
    if (!selectedStudent) {
      setError("Student select karo.");
      return;
    }

    if (!selectedExam) {
      setError("Exam select karo.");
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    try {
      const subjectData = Object.entries(marks).map(
        ([name, value]) => ({
          name,
          teacher: value.teacher || "",
          internal: Number(value.internal) || 0,
          external: Number(value.external) || 0,
        })
      );

      const response = await fetch(
        `${API_URL}/api/results/exam`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId: getStudentId(selectedStudent),
            exam: selectedExam,
            session: SESSION,
            internalMax: Number(
              currentExam.internalMax
            ),
            externalMax: Number(
              currentExam.externalMax
            ),
            subjects: subjectData,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Result save failed."
        );
      }

      setMessage(
        `${selectedExam} saved successfully.`
      );

      await refreshResults();

      const resultResponse = await fetch(
        `${API_URL}/api/results/student/${getStudentId(
          selectedStudent
        )}`
      );

      if (resultResponse.ok) {
        const resultData =
          await resultResponse.json();

        setViewResult(resultData);
      }
    } catch (err) {
      console.error(err);
      setError(
        err.message || "Result save nahi ho paya."
      );
    } finally {
      setSaving(false);
    }
  };

  const refreshResults = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/results`
      );

      if (!response.ok) return;

      const data = await response.json();

      setResults(parseListResponse(data, "results"));
    } catch (err) {
      console.error(err);
    }
  };

  const getStudentResult = (studentId) =>
    results.find(
      (result) =>
        String(result.studentId) ===
        String(studentId)
    );

  /* =========================================================
     VIEW RESULT
  ========================================================= */

  const handleViewResult = async (student) => {
    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/results/student/${getStudentId(student)}`
      );

      if (!response.ok) {
        setError(
          "Is student ka result available nahi hai."
        );
        return;
      }

      const data = await response.json();

      setViewResult(data);
      setSelectedStudent(student);
      setShowView(true);
    } catch (err) {
      console.error(err);
      setError("Result load nahi ho pa raha.");
    }
  };

  /* =========================================================
     REPORT
  ========================================================= */

  const openReport = (type) => {
    setReportType(type);
    setReportClass(classFilter);
    setReportSection(sectionFilter);
    setReportLimit("10");
    setShowReport(true);
  };

  /* =========================================================
     FULL RESULT VIEW
  ========================================================= */

  if (showView && viewResult) {
    return (
      <ResultView
        result={viewResult}
        onBack={() => setShowView(false)}
        onEdit={() => {
          setShowView(false);

          if (viewResult.student) {
            selectStudent(viewResult.student);
          }
        }}
      />
    );
  }

  /* =========================================================
     REPORT VIEW
  ========================================================= */

  if (showReport) {
    return (
      <ResultReport
        students={students}
        results={results}
        subjects={subjects}
        selectedExam={selectedExam}
        reportType={reportType}
        reportClass={reportClass}
        reportSection={reportSection}
        reportLimit={reportLimit}
        setReportType={setReportType}
        setReportClass={setReportClass}
        setReportSection={setReportSection}
        setReportLimit={setReportLimit}
        classList={classList}
        sectionList={sectionList}
        onBack={() => setShowReport(false)}
      />
    );
  }

  return (
    <div className="results-page">
      <div className="results-container">

        {/* HEADER */}
        <div className="results-header">
          <div className="results-title-area">
            <div className="results-header-icon">
              📊
            </div>

            <div>
              <h1>Student Results</h1>
              <p>
                Manage examinations and student results
              </p>
            </div>
          </div>

          <button
            className="add-exam-btn"
            onClick={openAddExam}
          >
            ➕ Add Exam
          </button>
        </div>

        {message && (
          <div className="results-success">
            ✅ {message}
          </div>
        )}

        {error && (
          <div className="results-error">
            ❌ {error}
          </div>
        )}

        {/* EXAMS */}
        <div className="exam-management-card">
          <div className="section-heading-row">
            <div>
              <h2>📝 Examinations</h2>
              <p>
                Select an examination to enter marks.
              </p>
            </div>

            <button
              className="small-add-btn"
              onClick={openAddExam}
            >
              + Add Exam
            </button>
          </div>

          <div className="exam-list">
            {exams.map((exam) => (
              <div
                className={`exam-card ${
                  selectedExam === exam.name
                    ? "active"
                    : ""
                }`}
                key={exam.id}
              >
                <button
                  className="exam-select-area"
                  onClick={() => loadExam(exam.name)}
                >
                  <span className="exam-icon">
                    📝
                  </span>

                  <span>
                    <strong>{exam.name}</strong>

                    <small>
                      Internal {exam.internalMax} +
                      External {exam.externalMax} =
                      {Number(exam.internalMax) +
                        Number(exam.externalMax)}{" "}
                      Marks
                    </small>
                  </span>
                </button>

                <div className="exam-actions">
                  <button
                    onClick={() =>
                      openEditExam(exam)
                    }
                    title="Edit"
                  >
                    ✏️
                  </button>

                  <button
                    onClick={() =>
                      deleteExam(exam)
                    }
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* REPORT SHORTCUTS */}
        <div className="result-report-shortcuts">
          <div>
            <h2>📋 Result Reports</h2>
            <p>
              Class result, top students aur bottom
              students ki reports.
            </p>
          </div>

          <div className="report-shortcut-buttons">
            <button onClick={() => openReport("class")}>
              📑 Class Result
            </button>

            <button onClick={() => openReport("top")}>
              🏆 Top 10
            </button>

            <button
              onClick={() => openReport("bottom")}
            >
              📉 Bottom 10
            </button>
          </div>
        </div>

        {/* FILTER */}
        <div className="filters-card">
          <div className="filter-title">
            🔍 Search & Filter Students
          </div>

          <div className="filters-grid">
            <div className="filter-field search-field">
              <label>Search Student</label>

              <input
                value={search}
                placeholder="Name, roll number or admission number..."
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>

            <div className="filter-field">
              <label>Class</label>

              <select
                value={classFilter}
                onChange={(e) => {
                  setClassFilter(e.target.value);
                  setSectionFilter("All");
                }}
              >
                {classList.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-field">
              <label>Section</label>

              <select
                value={sectionFilter}
                onChange={(e) =>
                  setSectionFilter(e.target.value)
                }
              >
                {studentSectionList.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-result-count">
              <strong>
                {filteredStudents.length}
              </strong>
              <span>Students Found</span>
            </div>
          </div>
        </div>

        {/* STUDENTS */}
        <div className="students-card">
          <div className="section-heading-row">
            <div>
              <h2>👨‍🎓 Students</h2>
              <p>
                Enter or view examination results.
              </p>
            </div>

            <div className="student-report-buttons">
              <button
                onClick={() => openReport("class")}
              >
                🖨️ Class Result
              </button>

              <button
                onClick={() => openReport("top")}
              >
                🏆 Top 10
              </button>

              <button
                onClick={() => openReport("bottom")}
              >
                📉 Bottom 10
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-box">
              Loading students...
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="empty-box">
              <div>🔎</div>
              <strong>No students found</strong>
              <span>
                Search or filter change karo.
              </span>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="results-table">
                <thead>
                  <tr>
                    <th>S.No.</th>
                    <th>Student</th>
                    <th>Class</th>
                    <th>Roll No.</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.map(
                    (student, index) => {
                      const id =
                        getStudentId(student);

                      const studentResult =
                        getStudentResult(id);

                      return (
                        <tr key={id || index}>
                          <td>{index + 1}</td>

                          <td>
                            <div className="student-name-cell">
                              <div className="student-avatar">
                                {(
                                  student.name ||
                                  "S"
                                )
                                  .charAt(0)
                                  .toUpperCase()}
                              </div>

                              <div>
                                <strong>
                                  {student.name ||
                                    "Unknown"}
                                </strong>

                                <small>
                                  {getFatherName(
                                    student
                                  )}
                                </small>
                              </div>
                            </div>
                          </td>

                          <td>
                            <span className="class-badge">
                              {getStudentClass(
                                student
                              ) || "-"}
                              {getStudentSection(
                                student
                              )
                                ? `-${getStudentSection(
                                    student
                                  )}`
                                : ""}
                            </span>
                          </td>

                          <td>
                            {getStudentRoll(student)}
                          </td>

                          <td>
                            {studentResult ? (
                              <span className="status saved">
                                ✓ Saved
                              </span>
                            ) : (
                              <span className="status pending">
                                Not Added
                              </span>
                            )}
                          </td>

                          <td>
                            <div className="action-buttons">
                              <button
                                className="enter-result-btn"
                                onClick={() =>
                                  selectStudent(
                                    student
                                  )
                                }
                              >
                                ✏️ Enter
                              </button>

                              {studentResult && (
                                <button
                                  className="view-result-btn"
                                  onClick={() =>
                                    handleViewResult(
                                      student
                                    )
                                  }
                                >
                                  👁 View
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    }
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* RESULT FORM */}
        {selectedStudent && (
          <ResultEntry
            student={selectedStudent}
            exams={exams}
            selectedExam={selectedExam}
            currentExam={currentExam}
            marks={marks}
            subjectsLoading={subjectsLoading}
            saving={saving}
            summary={currentSummary}
            onExamChange={loadExam}
            onMarksChange={handleMarksChange}
            onSave={saveResult}
            onView={() =>
              handleViewResult(selectedStudent)
            }
            onClose={() => {
              setSelectedStudent(null);
              setMarks({});
            }}
            onEditExam={openEditExam}
            hasSavedResult={
              !!getStudentResult(
                getStudentId(selectedStudent)
              )
            }
          />
        )}
      </div>

      {/* EXAM MODAL */}
      {showExamModal && (
        <ExamModal
          editingExam={editingExam}
          examForm={examForm}
          setExamForm={setExamForm}
          onClose={() => setShowExamModal(false)}
          onSave={saveExam}
        />
      )}
    </div>
  );
};

/* =========================================================
   RESULT ENTRY
========================================================= */

const ResultEntry = ({
  student,
  exams,
  selectedExam,
  currentExam,
  marks,
  subjectsLoading,
  saving,
  summary,
  onExamChange,
  onMarksChange,
  onSave,
  onView,
  onClose,
  onEditExam,
  hasSavedResult,
}) => (
  <div className="result-form-card">
    <div className="form-header">
      <div>
        <span className="form-label-top">
          RESULT ENTRY
        </span>

        <h2>{student.name}</h2>

        <p>
          {getStudentClass(student)}
          {getStudentSection(student)
            ? `-${getStudentSection(student)}`
            : ""}{" "}
          • Roll No. {getStudentRoll(student)}
        </p>
      </div>

      <button
        className="close-btn"
        onClick={onClose}
      >
        ✕ Close
      </button>
    </div>

    <div className="student-info-grid">
      <InfoBox
        label="Father Name"
        value={getFatherName(student)}
      />

      <InfoBox
        label="Class"
        value={`${getStudentClass(student) || "-"}${
          getStudentSection(student)
            ? `-${getStudentSection(student)}`
            : ""
        }`}
      />

      <InfoBox
        label="Roll Number"
        value={getStudentRoll(student)}
      />

      <InfoBox
        label="Admission No."
        value={student.admissionNo || "-"}
      />
    </div>

    <div className="selected-exam-bar">
      <div>
        <label>Selected Examination</label>

        <select
          value={selectedExam}
          onChange={(e) =>
            onExamChange(e.target.value)
          }
        >
          {exams.map((exam) => (
            <option
              key={exam.id}
              value={exam.name}
            >
              {exam.name}
            </option>
          ))}
        </select>
      </div>

      <div className="marks-structure">
        <span>Internal</span>
        <strong>{currentExam.internalMax}</strong>

        <span>External</span>
        <strong>{currentExam.externalMax}</strong>

        <span>Total</span>
        <strong>
          {Number(currentExam.internalMax) +
            Number(currentExam.externalMax)}
        </strong>
      </div>

      <button
        className="edit-exam-inline"
        onClick={() => onEditExam(currentExam)}
      >
        ⚙ Edit Exam
      </button>
    </div>

    <div className="subjects-heading">
      <div>
        <h3>📚 Subjects</h3>
        <p>Student ke class ke subjects.</p>
      </div>

      <span>
        {Object.keys(marks).length} Subjects
      </span>
    </div>

    {subjectsLoading ? (
      <div className="subjects-loading">
        Loading subjects...
      </div>
    ) : Object.keys(marks).length === 0 ? (
      <div className="subjects-empty">
        <div>📚</div>
        <strong>Subjects nahi mile</strong>
        <p>
          Is class ke subjects available nahi hain.
        </p>
      </div>
    ) : (
      <div className="marks-table-wrapper">
        <table className="marks-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Teacher</th>

              <th>
                Internal
                <small>
                  / {currentExam.internalMax}
                </small>
              </th>

              <th>
                External
                <small>
                  / {currentExam.externalMax}
                </small>
              </th>

              <th>
                Total
                <small>
                  /{" "}
                  {Number(currentExam.internalMax) +
                    Number(currentExam.externalMax)}
                </small>
              </th>
            </tr>
          </thead>

          <tbody>
            {Object.entries(marks).map(
              ([subject, value]) => {
                const internal =
                  Number(value.internal) || 0;

                const external =
                  Number(value.external) || 0;

                return (
                  <tr key={subject}>
                    <td>
                      <div className="subject-name">
                        📘 <strong>{subject}</strong>
                      </div>
                    </td>

                    <td>
                      <span className="teacher-name">
                        {value.teacher ||
                          "Teacher not assigned"}
                      </span>
                    </td>

                    <td>
                      <input
                        className="mark-input"
                        type="number"
                        min="0"
                        max={currentExam.internalMax}
                        value={value.internal}
                        onChange={(e) =>
                          onMarksChange(
                            subject,
                            "internal",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      <input
                        className="mark-input"
                        type="number"
                        min="0"
                        max={currentExam.externalMax}
                        value={value.external}
                        onChange={(e) =>
                          onMarksChange(
                            subject,
                            "external",
                            e.target.value
                          )
                        }
                      />
                    </td>

                    <td>
                      <span className="subject-total">
                        {internal + external}
                      </span>
                    </td>
                  </tr>
                );
              }
            )}
          </tbody>
        </table>
      </div>
    )}

    <div className="result-summary">
      <SummaryBox
        icon="📊"
        title="Total Marks"
        value={`${summary.total} / ${summary.max}`}
      />

      <SummaryBox
        icon="📈"
        title="Percentage"
        value={`${summary.percentage.toFixed(2)}%`}
      />

      <SummaryBox
        icon="🏆"
        title="Grade"
        value={summary.grade}
      />
    </div>

    <div className="result-actions">
      <button
        className="save-result-btn"
        onClick={onSave}
        disabled={saving}
      >
        {saving
          ? "⏳ Saving..."
          : `💾 Save ${selectedExam}`}
      </button>

      {hasSavedResult && (
        <button
          className="view-large-btn"
          onClick={onView}
        >
          👁 View Result
        </button>
      )}
    </div>
  </div>
);

/* =========================================================
   EXAM MODAL
========================================================= */

const ExamModal = ({
  editingExam,
  examForm,
  setExamForm,
  onClose,
  onSave,
}) => (
  <div className="modal-overlay">
    <div className="exam-modal">
      <div className="modal-header">
        <div>
          <span>EXAMINATION</span>
          <h2>
            {editingExam
              ? "Edit Examination"
              : "Add New Examination"}
          </h2>
        </div>

        <button onClick={onClose}>✕</button>
      </div>

      <div className="exam-form">
        <div className="exam-form-field full">
          <label>Exam Name</label>

          <input
            type="text"
            placeholder="Example: Half Yearly Examination"
            value={examForm.name}
            onChange={(e) =>
              setExamForm({
                ...examForm,
                name: e.target.value,
              })
            }
          />
        </div>

        <div className="exam-form-field">
          <label>Internal Maximum Marks</label>

          <input
            type="number"
            min="0"
            value={examForm.internalMax}
            onChange={(e) =>
              setExamForm({
                ...examForm,
                internalMax: e.target.value,
              })
            }
          />
        </div>

        <div className="exam-form-field">
          <label>External Maximum Marks</label>

          <input
            type="number"
            min="0"
            value={examForm.externalMax}
            onChange={(e) =>
              setExamForm({
                ...examForm,
                externalMax: e.target.value,
              })
            }
          />
        </div>

        <div className="exam-total-preview">
          <span>Total Maximum Marks</span>

          <strong>
            {Number(examForm.internalMax || 0) +
              Number(examForm.externalMax || 0)}
          </strong>
        </div>
      </div>

      <div className="modal-actions">
        <button
          className="modal-cancel"
          onClick={onClose}
        >
          Cancel
        </button>

        <button
          className="modal-save"
          onClick={onSave}
        >
          💾{" "}
          {editingExam
            ? "Update Exam"
            : "Add Exam"}
        </button>
      </div>
    </div>
  </div>
);

/* =========================================================
   RESULT REPORT
========================================================= */

const ResultReport = ({
  students,
  results,
  subjects,
  selectedExam,
  reportType,
  reportClass,
  reportSection,
  reportLimit,
  setReportType,
  setReportClass,
  setReportSection,
  setReportLimit,
  classList,
  sectionList,
  onBack,
}) => {
  const currentExam = {
    internalMax: 30,
    externalMax: 70,
  };

  const getResult = (student) =>
    results.find(
      (result) =>
        String(result.studentId) ===
        String(getStudentId(student))
    );

  const getExamData = (student) =>
    getResult(student)?.exams?.[selectedExam] ||
    null;

  const getTotal = (student) =>
    Number(getExamData(student)?.totalMarks || 0);

  const getMax = (student) => {
    const examData = getExamData(student);

    if (examData) {
      return Number(examData.maxMarks || 0);
    }

    return (
      subjects.length *
      (currentExam.internalMax +
        currentExam.externalMax)
    );
  };

  const getPercentage = (student) => {
    const examData = getExamData(student);

    if (examData) {
      return Number(examData.percentage || 0);
    }

    const max = getMax(student);
    const total = getTotal(student);

    return max ? (total / max) * 100 : 0;
  };

  const getSubjectMark = (
    student,
    subjectName
  ) => {
    const subject =
      getExamData(student)?.subjects?.find(
        (item) =>
          String(item.name).toLowerCase() ===
          String(subjectName).toLowerCase()
      );

    if (!subject) return "-";

    return (
      subject.total ??
      Number(subject.internal || 0) +
        Number(subject.external || 0)
    );
  };

  const filteredStudents = useMemo(
    () =>
      students.filter((student) => {
        const classMatch =
          reportClass === "All" ||
          String(getStudentClass(student)) ===
            String(reportClass);

        const sectionMatch =
          reportSection === "All" ||
          String(getStudentSection(student)) ===
            String(reportSection);

        return classMatch && sectionMatch;
      }),
    [students, reportClass, reportSection]
  );

  const reportStudents = useMemo(() => {
    const list = [...filteredStudents];

    if (reportType === "top") {
      return list
        .sort(
          (a, b) =>
            getPercentage(b) -
            getPercentage(a)
        )
        .slice(0, Number(reportLimit));
    }

    if (reportType === "bottom") {
      return list
        .sort(
          (a, b) =>
            getPercentage(a) -
            getPercentage(b)
        )
        .slice(0, Number(reportLimit));
    }

    return list.sort((a, b) =>
      naturalSort(a.name || "", b.name || "")
    );
  }, [
    filteredStudents,
    reportType,
    reportLimit,
    results,
    selectedExam,
  ]);

  const reportSubjects = useMemo(() => {
    const names = [];

    reportStudents.forEach((student) => {
      getExamData(student)?.subjects?.forEach(
        (subject) => {
          if (
            subject.name &&
            !names.some(
              (name) =>
                name.toLowerCase() ===
                subject.name.toLowerCase()
            )
          ) {
            names.push(subject.name);
          }
        }
      );
    });

    if (!names.length) {
      subjects.forEach((subject) => {
        const name = getSubjectName(subject);

        if (
          name &&
          !names.some(
            (item) =>
              item.toLowerCase() ===
              name.toLowerCase()
          )
        ) {
          names.push(name);
        }
      });
    }

    return names;
  }, [reportStudents, subjects]);

  const title =
    reportType === "top"
      ? `TOP ${reportLimit} STUDENTS`
      : reportType === "bottom"
      ? `BOTTOM ${reportLimit} STUDENTS`
      : "CLASS WISE RESULT";

  return (
    <div className="result-report-page">
      <div className="report-controls no-print">
        <button
          className="back-report-btn"
          onClick={onBack}
        >
          ← Back
        </button>

        <div className="report-control-title">
          <h1>📊 Result Reports</h1>
          <p>
            Student result reports and rankings
          </p>
        </div>

        <div className="report-control-actions">
          <button
            className={
              reportType === "class"
                ? "active"
                : ""
            }
            onClick={() =>
              setReportType("class")
            }
          >
            📑 Class Result
          </button>

          <button
            className={
              reportType === "top"
                ? "active"
                : ""
            }
            onClick={() =>
              setReportType("top")
            }
          >
            🏆 Topper
          </button>

          <button
            className={
              reportType === "bottom"
                ? "active"
                : ""
            }
            onClick={() =>
              setReportType("bottom")
            }
          >
            📉 Bottomer
          </button>
        </div>

        <div className="report-filter-box">
          <div>
            <label>Examination</label>
            <input
              value={selectedExam}
              readOnly
            />
          </div>

          <div>
            <label>Class</label>

            <select
              value={reportClass}
              onChange={(e) =>
                setReportClass(e.target.value)
              }
            >
              {classList.map((item) => (
                <option key={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Section</label>

            <select
              value={reportSection}
              onChange={(e) =>
                setReportSection(e.target.value)
              }
            >
              {sectionList.map((item) => (
                <option key={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {reportType !== "class" && (
            <div>
              <label>Students</label>

              <select
                value={reportLimit}
                onChange={(e) =>
                  setReportLimit(e.target.value)
                }
              >
                <option value="5">
                  Top/Bottom 5
                </option>
                <option value="10">
                  Top/Bottom 10
                </option>
                <option value="15">
                  Top/Bottom 15
                </option>
                <option value="20">
                  Top/Bottom 20
                </option>
              </select>
            </div>
          )}

          <button
            className="report-print-btn"
            onClick={() => window.print()}
          >
            🖨️ Print
          </button>
        </div>
      </div>

      <div className="report-print-paper">
        <div className="school-report-header">
          <h1>
            MAHARANA PRATAP
            <br />
            SCIENCE ACADEMY
          </h1>

          <h3>INTER COLLEGE</h3>

          <div className="report-main-title">
            {title}
          </div>

          <div className="report-session">
            Academic Session {SESSION}
          </div>

          <div className="report-meta-row">
            <span>
              <strong>Examination:</strong>{" "}
              {selectedExam}
            </span>

            <span>
              <strong>Class:</strong>{" "}
              {reportClass === "All"
                ? "All Classes"
                : reportClass}
            </span>

            <span>
              <strong>Section:</strong>{" "}
              {reportSection === "All"
                ? "All Sections"
                : reportSection}
            </span>
          </div>
        </div>

        {reportType === "class" ? (
          <ClassResultTable
            students={reportStudents}
            subjects={reportSubjects}
            getSubjectMark={getSubjectMark}
            getTotal={getTotal}
            getMax={getMax}
            getPercentage={getPercentage}
          />
        ) : (
          <RankResultTable
            students={reportStudents}
            getTotal={getTotal}
            getMax={getMax}
            getPercentage={getPercentage}
          />
        )}

        <div className="report-footer">
          <div>Class Teacher Signature</div>
          <div>Principal</div>
          <div>School Seal</div>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   CLASS RESULT TABLE
========================================================= */

const ClassResultTable = ({
  students,
  subjects,
  getSubjectMark,
  getTotal,
  getMax,
  getPercentage,
}) => (
  <div className="complete-class-result-wrapper">
    <table className="complete-class-result">
      <thead>
        <tr>
          <th>S.No.</th>
          <th>Student Name</th>
          <th>Father Name</th>
          <th>Class</th>
          <th>Roll No.</th>

          {subjects.map((subject) => (
            <th key={subject}>{subject}</th>
          ))}

          <th>Total</th>
          <th>%</th>
          <th>Grade</th>
        </tr>
      </thead>

      <tbody>
        {students.length === 0 ? (
          <tr>
            <td
              colSpan={subjects.length + 8}
              className="no-report-data"
            >
              No result available.
            </td>
          </tr>
        ) : (
          students.map((student, index) => {
            const percentage =
              getPercentage(student);

            return (
              <tr
                key={
                  getStudentId(student) || index
                }
              >
                <td>{index + 1}</td>

                <td className="student-name-print">
                  {student.name || "-"}
                </td>

                <td>
                  {getFatherName(student)}
                </td>

                <td>
                  {getStudentClass(student)}
                  {getStudentSection(student)
                    ? `-${getStudentSection(
                        student
                      )}`
                    : ""}
                </td>

                <td>{getStudentRoll(student)}</td>

                {subjects.map((subject) => (
                  <td key={subject}>
                    {getSubjectMark(
                      student,
                      subject
                    )}
                  </td>
                ))}

                <td>
                  <strong>
                    {getTotal(student)}/
                    {getMax(student)}
                  </strong>
                </td>

                <td>
                  {percentage.toFixed(2)}%
                </td>

                <td>
                  {getGrade(percentage)}
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  </div>
);

/* =========================================================
   RANK TABLE
========================================================= */

const RankResultTable = ({
  students,
  getTotal,
  getMax,
  getPercentage,
}) => (
  <div className="rank-result-wrapper">
    <table className="rank-result-table">
      <thead>
        <tr>
          <th>Rank</th>
          <th>Student Name</th>
          <th>Father Name</th>
          <th>Class</th>
          <th>Section</th>
          <th>Roll No.</th>
          <th>Total</th>
          <th>Percentage</th>
          <th>Grade</th>
          <th>Result</th>
        </tr>
      </thead>

      <tbody>
        {students.length === 0 ? (
          <tr>
            <td colSpan="10" className="no-report-data">
              No result available.
            </td>
          </tr>
        ) : (
          students.map((student, index) => {
            const percentage =
              getPercentage(student);

            return (
              <tr
                key={
                  getStudentId(student) || index
                }
              >
                <td className="rank-number">
                  {index + 1}
                </td>

                <td className="rank-student-name">
                  {student.name || "-"}
                </td>

                <td>
                  {getFatherName(student)}
                </td>

                <td>
                  {getStudentClass(student)}
                </td>

                <td>
                  {getStudentSection(student) ||
                    "-"}
                </td>

                <td>
                  {getStudentRoll(student)}
                </td>

                <td>
                  <strong>
                    {getTotal(student)}/
                    {getMax(student)}
                  </strong>
                </td>

                <td>
                  <strong>
                    {percentage.toFixed(2)}%
                  </strong>
                </td>

                <td>
                  {getGrade(percentage)}
                </td>

                <td>
                  {percentage >= 33
                    ? "PASS"
                    : "FAIL"}
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  </div>
);

/* =========================================================
   RESULT VIEW
========================================================= */

const ResultView = ({
  result,
  onBack,
  onEdit,
}) => {
  const student = result.student || {};
  const resultExams = result.exams || {};
  const examList = Object.keys(resultExams);

  const overall = examList.reduce(
    (acc, exam) => {
      acc.total += Number(
        resultExams[exam]?.totalMarks || 0
      );

      acc.max += Number(
        resultExams[exam]?.maxMarks || 0
      );

      return acc;
    },
    { total: 0, max: 0 }
  );

  const percentage =
    overall.max > 0
      ? (overall.total / overall.max) * 100
      : 0;

  return (
    <div className="result-view-page">
      <div className="result-paper">
        <div className="report-header">
          <h1>
            MAHARANA PRATAP
            <br />
            SCIENCE ACADEMY
          </h1>

          <h3>INTER COLLEGE</h3>

          <div>STUDENT REPORT CARD</div>

          <small>
            Academic Session{" "}
            {result.session || SESSION}
          </small>
        </div>

        <div className="report-student-info">
          <InfoBox
            label="Student Name"
            value={student.name || "-"}
          />

          <InfoBox
            label="Father Name"
            value={getFatherName(student)}
          />

          <InfoBox
            label="Class"
            value={`${getStudentClass(student) || "-"}${
              getStudentSection(student)
                ? `-${getStudentSection(student)}`
                : ""
            }`}
          />

          <InfoBox
            label="Roll Number"
            value={getStudentRoll(student)}
          />

          <InfoBox
            label="Admission Number"
            value={student.admissionNo || "-"}
          />

          <InfoBox
            label="Date of Birth"
            value={student.dob || "-"}
          />
        </div>

        {examList.length === 0 ? (
          <div className="report-empty">
            No examination result available.
          </div>
        ) : (
          examList.map((exam) => {
            const data = resultExams[exam];

            return (
              <div className="report-exam" key={exam}>
                <h2>{exam}</h2>

                <div className="report-table-wrapper">
                  <table className="report-table">
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Teacher</th>
                        <th>Internal</th>
                        <th>External</th>
                        <th>Total</th>
                      </tr>
                    </thead>

                    <tbody>
                      {(data.subjects || []).map(
                        (subject) => (
                          <tr key={subject.name}>
                            <td>{subject.name}</td>
                            <td>
                              {subject.teacher ||
                                "-"}
                            </td>
                            <td>
                              {subject.internal ?? 0}
                            </td>
                            <td>
                              {subject.external ?? 0}
                            </td>
                            <td>
                              {subject.total ??
                                Number(
                                  subject.internal ||
                                    0
                                ) +
                                  Number(
                                    subject.external ||
                                      0
                                  )}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>

                    <tfoot>
                      <tr>
                        <td colSpan="4">
                          Total
                        </td>

                        <td>
                          {data.totalMarks || 0}
                          {" / "}
                          {data.maxMarks || 0}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                <div className="report-summary">
                  <SummaryBox
                    title="Percentage"
                    value={`${Number(
                      data.percentage || 0
                    ).toFixed(2)}%`}
                  />

                  <SummaryBox
                    title="Grade"
                    value={data.grade || "-"}
                  />

                  <SummaryBox
                    title="Result"
                    value={data.result || "-"}
                  />
                </div>
              </div>
            );
          })
        )}

        {examList.length > 0 && (
          <div className="overall-report">
            <h2>Overall Result</h2>

            <div className="overall-summary">
              <SummaryBox
                title="Total Marks"
                value={`${overall.total} / ${overall.max}`}
              />

              <SummaryBox
                title="Overall Percentage"
                value={`${percentage.toFixed(2)}%`}
              />

              <SummaryBox
                title="Overall Grade"
                value={getGrade(percentage)}
              />

              <SummaryBox
                title="Final Result"
                value={
                  examList.every(
                    (exam) =>
                      resultExams[exam]?.result ===
                      "PASS"
                  )
                    ? "PASS"
                    : "FAIL"
                }
              />
            </div>
          </div>
        )}

        <div className="report-buttons no-print">
          <button onClick={onBack}>
            ← Back
          </button>

          <button onClick={onEdit}>
            ✏️ Edit Result
          </button>

          <button onClick={() => window.print()}>
            🖨️ Print Result
          </button>
        </div>
      </div>
    </div>
  );
};

/* =========================================================
   SMALL COMPONENTS
========================================================= */

const InfoBox = ({ label, value }) => (
  <div className="info-box">
    <span>{label}</span>
    <strong>{value}</strong>
  </div>
);

const SummaryBox = ({
  icon,
  title,
  value,
}) => (
  <div className="summary-box">
    {icon && (
      <div className="summary-icon">
        {icon}
      </div>
    )}

    <span>{title}</span>
    <strong>{value}</strong>
  </div>
);

export default Results;