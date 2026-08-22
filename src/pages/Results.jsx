import React, { useEffect, useMemo, useState } from "react";

const API_URL = "http://localhost:5000";

const EXAMS = ["Exam 1", "Exam 2", "Exam 3"];

const Results = () => {
  const [students, setStudents] = useState([]);
  const [results, setResults] = useState([]);

  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [selectedStudent, setSelectedStudent] =
    useState(null);

  const [selectedExam, setSelectedExam] =
    useState("Exam 1");

  const [showView, setShowView] = useState(false);
  const [viewResult, setViewResult] = useState(null);

  const [marks, setMarks] = useState({});

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [studentsResponse, resultsResponse] =
        await Promise.all([
          fetch(`${API_URL}/api/students`),
          fetch(`${API_URL}/api/results`),
        ]);

      if (!studentsResponse.ok) {
        throw new Error("Students load failed");
      }

      const studentsData =
        await studentsResponse.json();

      const resultsData = resultsResponse.ok
        ? await resultsResponse.json()
        : [];

      setStudents(
        Array.isArray(studentsData)
          ? studentsData
          : studentsData.students || []
      );

      setResults(
        Array.isArray(resultsData)
          ? resultsData
          : []
      );
    } catch (err) {
      console.error(err);
      setError(
        "Students ya results load nahi ho pa rahe hain."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // SEARCH
  // =====================================================

  const filteredStudents = useMemo(() => {
    const value = search
      .trim()
      .toLowerCase();

    if (!value) {
      return students;
    }

    return students.filter((student) => {
      const name = String(
        student.name || ""
      ).toLowerCase();

      const roll = String(
        student.rollNo ||
          student.rollNumber ||
          student.roll ||
          ""
      ).toLowerCase();

      const admission = String(
        student.admissionNo || ""
      ).toLowerCase();

      return (
        name.includes(value) ||
        roll.includes(value) ||
        admission.includes(value)
      );
    });
  }, [students, search]);

  // =====================================================
  // SELECT STUDENT
  // =====================================================

  const selectStudent = async (student) => {
    setSelectedStudent(student);
    setSelectedExam("Exam 1");
    setShowView(false);
    setViewResult(null);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/results/student/${student.id}`
      );

      if (response.ok) {
        const data = await response.json();

        setMarks(
          convertResultToMarks(
            data,
            "Exam 1"
          )
        );
      } else {
        const subjects =
          await fetchSubjects(student.class);

        setMarks(
          createEmptyMarks(subjects)
        );
      }
    } catch (err) {
      console.error(err);

      const subjects =
        await fetchSubjects(student.class);

      setMarks(
        createEmptyMarks(subjects)
      );
    }
  };

  // =====================================================
  // FETCH SUBJECTS
  // =====================================================

  const fetchSubjects = async (studentClass) => {
    try {
      const response = await fetch(
        `${API_URL}/api/results/subjects/${studentClass}`
      );

      if (!response.ok) {
        return [];
      }

      const data = await response.json();

      return data.subjects || [];
    } catch {
      return [];
    }
  };

  // =====================================================
  // EMPTY MARKS
  // =====================================================

  const createEmptyMarks = (subjects) => {
    const object = {};

    subjects.forEach((subject) => {
      object[subject] = {
        internal: "",
        external: "",
      };
    });

    return object;
  };

  // =====================================================
  // CONVERT SAVED RESULT
  // =====================================================

  const convertResultToMarks = (
    result,
    exam
  ) => {
    const object = {};

    const examData =
      result?.exams?.[exam];

    if (!examData) {
      return object;
    }

    examData.subjects?.forEach(
      (subject) => {
        object[subject.name] = {
          internal:
            subject.internal ?? "",
          external:
            subject.external ?? "",
        };
      }
    );

    return object;
  };

  // =====================================================
  // LOAD EXAM
  // =====================================================

  const loadExam = async (exam) => {
    setSelectedExam(exam);
    setMessage("");
    setError("");

    if (!selectedStudent) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/results/student/${selectedStudent.id}`
      );

      if (response.ok) {
        const data = await response.json();

        const examMarks =
          convertResultToMarks(
            data,
            exam
          );

        if (
          Object.keys(examMarks).length > 0
        ) {
          setMarks(examMarks);
          return;
        }
      }

      const subjects =
        await fetchSubjects(
          selectedStudent.class
        );

      setMarks(
        createEmptyMarks(subjects)
      );
    } catch (err) {
      console.error(err);
    }
  };

  // =====================================================
  // MARK CHANGE
  // =====================================================

  const handleMarksChange = (
    subject,
    type,
    value
  ) => {
    let finalValue = value;

    if (value !== "") {
      const number = Number(value);

      if (type === "internal") {
        finalValue = Math.min(
          Math.max(number, 0),
          30
        );
      }

      if (type === "external") {
        finalValue = Math.min(
          Math.max(number, 0),
          70
        );
      }
    }

    setMarks((previous) => ({
      ...previous,
      [subject]: {
        ...(previous[subject] || {}),
        [type]: finalValue,
      },
    }));
  };

  // =====================================================
  // CURRENT TOTAL
  // =====================================================

  const currentSummary = useMemo(() => {
    let total = 0;
    let max = 0;

    Object.values(marks).forEach(
      (subject) => {
        const internal =
          Number(subject.internal) || 0;

        const external =
          Number(subject.external) || 0;

        total += internal + external;
        max += 100;
      }
    );

    const percentage =
      max > 0
        ? (total / max) * 100
        : 0;

    return {
      total,
      max,
      percentage,
      grade: getGrade(percentage),
    };
  }, [marks]);

  // =====================================================
  // SAVE RESULT
  // =====================================================

  const saveResult = async () => {
    if (!selectedStudent) {
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    try {
      const subjects = Object.entries(
        marks
      ).map(([name, value]) => ({
        name,
        internal:
          Number(value.internal) || 0,
        external:
          Number(value.external) || 0,
      }));

      const response = await fetch(
        `${API_URL}/api/results/exam`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            studentId:
              selectedStudent.id,

            exam: selectedExam,

            session: "2026-27",

            subjects,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Result save failed"
        );
      }

      setMessage(
        `${selectedExam} saved successfully!`
      );

      // Refresh results
      const resultsResponse =
        await fetch(
          `${API_URL}/api/results`
        );

      if (resultsResponse.ok) {
        const resultData =
          await resultsResponse.json();

        setResults(
          Array.isArray(resultData)
            ? resultData
            : []
        );
      }

      // Update view data
      const studentResultResponse =
        await fetch(
          `${API_URL}/api/results/student/${selectedStudent.id}`
        );

      if (
        studentResultResponse.ok
      ) {
        const studentResult =
          await studentResultResponse.json();

        setViewResult(studentResult);
      }
    } catch (err) {
      console.error(err);

      setError(
        err.message ||
          "Result save nahi ho paya."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // VIEW RESULT
  // =====================================================

  const handleViewResult = async (
    student
  ) => {
    try {
      setError("");
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/results/student/${student.id}`
      );

      if (!response.ok) {
        setError(
          "Is student ka result abhi save nahi hai."
        );
        return;
      }

      const data =
        await response.json();

      setViewResult(data);
      setSelectedStudent(student);
      setShowView(true);
    } catch (err) {
      console.error(err);

      setError(
        "Result load nahi ho pa raha."
      );
    }
  };

  // =====================================================
  // CHECK RESULT EXISTS
  // =====================================================

  const getStudentResult = (
    studentId
  ) => {
    return results.find(
      (result) =>
        result.studentId ===
        studentId
    );
  };

  // =====================================================
  // VIEW PAGE
  // =====================================================

  if (showView && viewResult) {
    return (
      <ResultView
        result={viewResult}
        onBack={() =>
          setShowView(false)
        }
        onEdit={() => {
          setShowView(false);
          selectStudent(
            viewResult.student
          );
        }}
      />
    );
  }

  // =====================================================
  // MAIN PAGE
  // =====================================================

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <div>
            <h1 style={titleStyle}>
              Student Results
            </h1>

            <p style={subtitleStyle}>
              Manage student examination
              results
            </p>
          </div>
        </div>

        {message && (
          <div style={successStyle}>
            ✅ {message}
          </div>
        )}

        {error && (
          <div style={errorStyle}>
            ❌ {error}
          </div>
        )}

        {/* SEARCH */}
        <div style={searchBoxStyle}>
          <div style={searchLabelStyle}>
            🔍 Search Student
          </div>

          <input
            type="text"
            placeholder="Search by student name, roll number or admission number..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            style={searchInputStyle}
          />
        </div>

        {/* STUDENT LIST */}
        <div style={cardStyle}>
          <h2 style={sectionTitleStyle}>
            Students
          </h2>

          {loading ? (
            <p>Loading students...</p>
          ) : filteredStudents.length ===
            0 ? (
            <div style={emptyStyle}>
              No students found.
            </div>
          ) : (
            <div
              style={{
                overflowX: "auto",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse:
                    "collapse",
                }}
              >
                <thead>
                  <tr style={tableHeaderStyle}>
                    <th style={thStyle}>
                      S.No.
                    </th>

                    <th style={thStyle}>
                      Student
                    </th>

                    <th style={thStyle}>
                      Class
                    </th>

                    <th style={thStyle}>
                      Roll No.
                    </th>

                    <th style={thStyle}>
                      Result
                    </th>

                    <th style={thStyle}>
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.map(
                    (student, index) => {
                      const studentResult =
                        getStudentResult(
                          student.id
                        );

                      return (
                        <tr
                          key={
                            student.id ||
                            index
                          }
                        >
                          <td style={tdStyle}>
                            {index + 1}
                          </td>

                          <td style={tdStyle}>
                            <strong>
                              {
                                student.name
                              }
                            </strong>

                            <div
                              style={{
                                fontSize:
                                  "12px",
                                color:
                                  "#64748b",
                                marginTop:
                                  "3px",
                              }}
                            >
                              {
                                student.father
                              }
                            </div>
                          </td>

                          <td style={tdStyle}>
                            {student.class}
                            -
                            {
                              student.section
                            }
                          </td>

                          <td style={tdStyle}>
                            {student.rollNo ||
                              "-"}
                          </td>

                          <td style={tdStyle}>
                            {studentResult ? (
                              <span
                                style={
                                  badgeGreen
                                }
                              >
                                Saved
                              </span>
                            ) : (
                              <span
                                style={
                                  badgeYellow
                                }
                              >
                                Not Added
                              </span>
                            )}
                          </td>

                          <td style={tdStyle}>
                            <button
                              onClick={() =>
                                selectStudent(
                                  student
                                )
                              }
                              style={
                                primaryButton
                              }
                            >
                              ✏️ Enter Result
                            </button>

                            {studentResult && (
                              <button
                                onClick={() =>
                                  handleViewResult(
                                    student
                                  )
                                }
                                style={
                                  viewButton
                                }
                              >
                                👁️ View Result
                              </button>
                            )}
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
          <div style={formCardStyle}>
            <div style={studentHeaderStyle}>
              <div>
                <h2
                  style={{
                    margin: 0,
                    color:
                      "#0f172a",
                  }}
                >
                  Enter Result
                </h2>

                <p
                  style={{
                    margin:
                      "6px 0 0",
                    color:
                      "#64748b",
                  }}
                >
                  {
                    selectedStudent.name
                  }
                </p>
              </div>

              <button
                onClick={() => {
                  setSelectedStudent(
                    null
                  );
                  setMarks({});
                }}
                style={cancelButton}
              >
                ✕ Close
              </button>
            </div>

            {/* STUDENT DETAILS */}
            <div
              style={
                studentDetailsGrid
              }
            >
              <Detail
                label="Father Name"
                value={
                  selectedStudent.father ||
                  "-"
                }
              />

              <Detail
                label="Class"
                value={
                  `${selectedStudent.class}-${selectedStudent.section || ""}`
                }
              />

              <Detail
                label="Roll Number"
                value={
                  selectedStudent.rollNo ||
                  "-"
                }
              />

              <Detail
                label="Admission No."
                value={
                  selectedStudent.admissionNo ||
                  "-"
                }
              />
            </div>

            {/* EXAM SELECT */}
            <div
              style={{
                marginTop:
                  "25px",
              }}
            >
              <label
                style={labelStyle}
              >
                Select Examination
              </label>

              <select
                value={selectedExam}
                onChange={(e) =>
                  loadExam(
                    e.target.value
                  )
                }
                style={
                  selectStyle
                }
              >
                {EXAMS.map(
                  (exam) => (
                    <option
                      key={exam}
                      value={exam}
                    >
                      {exam}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* MARKS TABLE */}
            <div
              style={{
                overflowX:
                  "auto",
                marginTop:
                  "25px",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse:
                    "collapse",
                }}
              >
                <thead>
                  <tr
                    style={
                      tableHeaderStyle
                    }
                  >
                    <th
                      style={
                        thStyle
                      }
                    >
                      Subject
                    </th>

                    <th
                      style={{
                        ...thStyle,
                        textAlign:
                          "center",
                      }}
                    >
                      Internal
                      <br />
                      <small>
                        / 30
                      </small>
                    </th>

                    <th
                      style={{
                        ...thStyle,
                        textAlign:
                          "center",
                      }}
                    >
                      External
                      <br />
                      <small>
                        / 70
                      </small>
                    </th>

                    <th
                      style={{
                        ...thStyle,
                        textAlign:
                          "center",
                      }}
                    >
                      Total
                      <br />
                      <small>
                        / 100
                      </small>
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {Object.keys(
                    marks
                  ).length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        style={{
                          padding:
                            "30px",
                          textAlign:
                            "center",
                        }}
                      >
                        Loading subjects...
                      </td>
                    </tr>
                  ) : (
                    Object.entries(
                      marks
                    ).map(
                      ([
                        subject,
                        value,
                      ]) => {
                        const internal =
                          Number(
                            value.internal
                          ) || 0;

                        const external =
                          Number(
                            value.external
                          ) || 0;

                        return (
                          <tr
                            key={
                              subject
                            }
                          >
                            <td
                              style={
                                tdStyle
                              }
                            >
                              <strong>
                                {
                                  subject
                                }
                              </strong>
                            </td>

                            <td
                              style={{
                                ...tdStyle,
                                textAlign:
                                  "center",
                              }}
                            >
                              <input
                                type="number"
                                min="0"
                                max="30"
                                value={
                                  value.internal
                                }
                                onChange={(
                                  e
                                ) =>
                                  handleMarksChange(
                                    subject,
                                    "internal",
                                    e
                                      .target
                                      .value
                                  )
                                }
                                style={
                                  markInputStyle
                                }
                              />
                            </td>

                            <td
                              style={{
                                ...tdStyle,
                                textAlign:
                                  "center",
                              }}
                            >
                              <input
                                type="number"
                                min="0"
                                max="70"
                                value={
                                  value.external
                                }
                                onChange={(
                                  e
                                ) =>
                                  handleMarksChange(
                                    subject,
                                    "external",
                                    e
                                      .target
                                      .value
                                  )
                                }
                                style={
                                  markInputStyle
                                }
                              />
                            </td>

                            <td
                              style={{
                                ...tdStyle,
                                textAlign:
                                  "center",
                                fontWeight:
                                  "700",
                                color:
                                  "#2563eb",
                              }}
                            >
                              {internal +
                                external}
                            </td>
                          </tr>
                        );
                      }
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* SUMMARY */}
            <div
              style={
                summaryGrid
              }
            >
              <SummaryBox
                title="Total Marks"
                value={`${currentSummary.total} / ${currentSummary.max}`}
              />

              <SummaryBox
                title="Percentage"
                value={`${currentSummary.percentage.toFixed(
                  2
                )}%`}
              />

              <SummaryBox
                title="Grade"
                value={
                  currentSummary.grade
                }
              />
            </div>

            {/* SAVE */}
            <div
              style={{
                marginTop:
                  "25px",
                display:
                  "flex",
                gap: "10px",
                flexWrap:
                  "wrap",
              }}
            >
              <button
                onClick={
                  saveResult
                }
                disabled={saving}
                style={
                  saveButton
                }
              >
                {saving
                  ? "Saving..."
                  : `💾 Save ${selectedExam}`}
              </button>

              {getStudentResult(
                selectedStudent.id
              ) && (
                <button
                  onClick={() =>
                    handleViewResult(
                      selectedStudent
                    )
                  }
                  style={
                    viewButtonLarge
                  }
                >
                  👁️ View Result
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// =====================================================
// RESULT VIEW COMPONENT
// =====================================================

const ResultView = ({
  result,
  onBack,
  onEdit,
}) => {
  const student =
    result.student;

  const exams =
    result.exams || {};

  const examList =
    EXAMS.filter(
      (exam) => exams[exam]
    );

  let overallTotal = 0;
  let overallMax = 0;

  examList.forEach(
    (exam) => {
      overallTotal +=
        Number(
          exams[exam].totalMarks ||
            0
        );

      overallMax +=
        Number(
          exams[exam].maxMarks ||
            0
        );
    }
  );

  const overallPercentage =
    overallMax > 0
      ? (overallTotal /
          overallMax) *
        100
      : 0;

  const overallGrade =
    getGrade(
      overallPercentage
    );

  const overallResult =
    examList.length === 0
      ? "NOT AVAILABLE"
      : examList.every(
          (exam) =>
            exams[exam].result ===
            "PASS"
        )
      ? "PASS"
      : "FAIL";

  return (
    <div
      style={{
        minHeight:
          "100vh",
        background:
          "#eef2f7",
        padding:
          "30px",
      }}
    >
      <div
        style={{
          maxWidth:
            "1100px",
          margin:
            "0 auto",
          background:
            "white",
          borderRadius:
            "14px",
          padding:
            "35px",
          boxShadow:
            "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        {/* HEADER */}
        <div
          style={{
            textAlign:
              "center",
            borderBottom:
              "2px solid #1e40af",
            paddingBottom:
              "20px",
          }}
        >
          <h1
            style={{
              margin:
                "0 0 5px",
              color:
                "#1e3a8a",
              fontSize:
                "28px",
            }}
          >
            MAHARANA PRATAP
            SCIENCE ACADEMY
          </h1>

          <h3
            style={{
              margin:
                "0 0 8px",
              color:
                "#475569",
            }}
          >
            INTER COLLEGE
          </h3>

          <div
            style={{
              fontWeight:
                "700",
              fontSize:
                "18px",
            }}
          >
            STUDENT REPORT CARD
          </div>

          <div
            style={{
              marginTop:
                "5px",
              color:
                "#64748b",
            }}
          >
            Academic Session{" "}
            {result.session ||
              "2026-27"}
          </div>
        </div>

        {/* STUDENT DETAILS */}
        <div
          style={{
            marginTop:
              "25px",
            padding:
              "20px",
            background:
              "#f8fafc",
            borderRadius:
              "10px",
            display:
              "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap:
              "15px",
          }}
        >
          <Detail
            label="Student Name"
            value={
              student?.name ||
              "-"
            }
          />

          <Detail
            label="Father Name"
            value={
              student?.father ||
              "-"
            }
          />

          <Detail
            label="Class"
            value={`${student?.class || "-"}-${
              student?.section || ""
            }`}
          />

          <Detail
            label="Roll Number"
            value={
              student?.rollNo ||
              "-"
            }
          />

          <Detail
            label="Admission Number"
            value={
              student?.admissionNo ||
              "-"
            }
          />

          <Detail
            label="Date of Birth"
            value={
              student?.dob ||
              "-"
            }
          />
        </div>

        {/* EXAMS */}
        {examList.length ===
        0 ? (
          <div
            style={{
              marginTop:
                "30px",
              padding:
                "30px",
              textAlign:
                "center",
              background:
                "#fef3c7",
              borderRadius:
                "10px",
            }}
          >
            No examination
            result has been
            saved yet.
          </div>
        ) : (
          examList.map(
            (exam) => {
              const data =
                exams[exam];

              return (
                <div
                  key={exam}
                  style={{
                    marginTop:
                      "30px",
                  }}
                >
                  <h2
                    style={{
                      marginBottom:
                        "12px",
                      color:
                        "#1e3a8a",
                    }}
                  >
                    {exam}
                  </h2>

                  <div
                    style={{
                      overflowX:
                        "auto",
                    }}
                  >
                    <table
                      style={{
                        width:
                          "100%",
                        borderCollapse:
                          "collapse",
                      }}
                    >
                      <thead>
                        <tr
                          style={
                            tableHeaderStyle
                          }
                        >
                          <th
                            style={
                              thStyle
                            }
                          >
                            Subject
                          </th>

                          <th
                            style={{
                              ...thStyle,
                              textAlign:
                                "center",
                            }}
                          >
                            Internal
                            <br />
                            /30
                          </th>

                          <th
                            style={{
                              ...thStyle,
                              textAlign:
                                "center",
                            }}
                          >
                            External
                            <br />
                            /70
                          </th>

                          <th
                            style={{
                              ...thStyle,
                              textAlign:
                                "center",
                            }}
                          >
                            Total
                            <br />
                            /100
                          </th>
                        </tr>
                      </thead>

                      <tbody>
                        {data.subjects?.map(
                          (
                            subject
                          ) => (
                            <tr
                              key={
                                subject.name
                              }
                            >
                              <td
                                style={
                                  tdStyle
                                }
                              >
                                {
                                  subject.name
                                }
                              </td>

                              <td
                                style={{
                                  ...tdStyle,
                                  textAlign:
                                    "center",
                                }}
                              >
                                {
                                  subject.internal
                                }
                                /30
                              </td>

                              <td
                                style={{
                                  ...tdStyle,
                                  textAlign:
                                    "center",
                                }}
                              >
                                {
                                  subject.external
                                }
                                /70
                              </td>

                              <td
                                style={{
                                  ...tdStyle,
                                  textAlign:
                                    "center",
                                  fontWeight:
                                    "700",
                                }}
                              >
                                {
                                  subject.total
                                }
                                /100
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>

                      <tfoot>
                        <tr
                          style={{
                            background:
                              "#f8fafc",
                          }}
                        >
                          <td
                            style={{
                              ...tdStyle,
                              fontWeight:
                                "700",
                            }}
                          >
                            Total
                          </td>

                          <td
                            style={{
                              ...tdStyle,
                              textAlign:
                                "center",
                            }}
                          >
                            -
                          </td>

                          <td
                            style={{
                              ...tdStyle,
                              textAlign:
                                "center",
                            }}
                          >
                            -
                          </td>

                          <td
                            style={{
                              ...tdStyle,
                              textAlign:
                                "center",
                              fontWeight:
                                "800",
                              color:
                                "#1e40af",
                            }}
                          >
                            {
                              data.totalMarks
                            }{" "}
                            /{" "}
                            {
                              data.maxMarks
                            }
                          </td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  <div
                    style={{
                      display:
                        "grid",
                      gridTemplateColumns:
                        "repeat(auto-fit, minmax(150px, 1fr))",
                      gap:
                        "12px",
                      marginTop:
                        "15px",
                    }}
                  >
                    <SummaryBox
                      title="Percentage"
                      value={`${data.percentage}%`}
                    />

                    <SummaryBox
                      title="Grade"
                      value={
                        data.grade
                      }
                    />

                    <SummaryBox
                      title="Result"
                      value={
                        data.result
                      }
                    />
                  </div>
                </div>
              );
            }
          )
        )}

        {/* OVERALL */}
        {examList.length >
          0 && (
          <div
            style={{
              marginTop:
                "35px",
              padding:
                "25px",
              background:
                "#eff6ff",
              border:
                "2px solid #bfdbfe",
              borderRadius:
                "12px",
            }}
          >
            <h2
              style={{
                marginTop:
                  0,
                color:
                  "#1e3a8a",
                textAlign:
                  "center",
              }}
            >
              Overall Result
            </h2>

            <div
              style={{
                display:
                  "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(180px, 1fr))",
                gap:
                  "15px",
                textAlign:
                  "center",
              }}
            >
              <SummaryBox
                title="Total Marks"
                value={`${overallTotal} / ${overallMax}`}
              />

              <SummaryBox
                title="Overall Percentage"
                value={`${overallPercentage.toFixed(
                  2
                )}%`}
              />

              <SummaryBox
                title="Overall Grade"
                value={
                  overallGrade
                }
              />

              <SummaryBox
                title="Final Result"
                value={
                  overallResult
                }
              />
            </div>
          </div>
        )}

        {/* BUTTONS */}
        <div
          style={{
            display:
              "flex",
            justifyContent:
              "center",
            gap:
              "12px",
            marginTop:
              "30px",
            flexWrap:
              "wrap",
          }}
        >
          <button
            onClick={
              onBack
            }
            style={
              cancelButton
            }
          >
            ← Back
          </button>

          <button
            onClick={
              onEdit
            }
            style={
              primaryButton
            }
          >
            ✏️ Edit Result
          </button>

          <button
            onClick={() =>
              window.print()
            }
            style={
              saveButton
            }
          >
            🖨️ Print Result
          </button>
        </div>
      </div>
    </div>
  );
};

// =====================================================
// SMALL COMPONENTS
// =====================================================

const Detail = ({
  label,
  value,
}) => {
  return (
    <div>
      <div
        style={{
          fontSize:
            "12px",
          color:
            "#64748b",
          marginBottom:
            "4px",
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontWeight:
            "700",
          color:
            "#1e293b",
        }}
      >
        {value}
      </div>
    </div>
  );
};

const SummaryBox = ({
  title,
  value,
}) => {
  return (
    <div
      style={{
        background:
          "white",
        padding:
          "15px",
        borderRadius:
          "8px",
        border:
          "1px solid #e2e8f0",
      }}
    >
      <div
        style={{
          fontSize:
            "12px",
          color:
            "#64748b",
          marginBottom:
            "5px",
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize:
            "20px",
          fontWeight:
            "800",
          color:
            "#1e293b",
        }}
      >
        {value}
      </div>
    </div>
  );
};

// =====================================================
// GRADE
// =====================================================

const getGrade = (
  percentage
) => {
  if (percentage >= 90)
    return "A+";

  if (percentage >= 80)
    return "A";

  if (percentage >= 70)
    return "B+";

  if (percentage >= 60)
    return "B";

  if (percentage >= 50)
    return "C";

  if (percentage >= 40)
    return "D";

  return "F";
};

// =====================================================
// STYLES
// =====================================================

const pageStyle = {
  minHeight: "100vh",
  backgroundColor:
    "#f1f5f9",
  padding: "30px",
};

const containerStyle = {
  maxWidth: "1250px",
  margin: "0 auto",
};

const headerStyle = {
  background:
    "linear-gradient(135deg, #1e3a8a, #2563eb)",
  padding: "28px",
  borderRadius: "14px",
  color: "white",
  marginBottom: "20px",
};

const titleStyle = {
  margin: 0,
  fontSize: "28px",
};

const subtitleStyle = {
  margin:
    "6px 0 0",
  opacity: 0.9,
};

const cardStyle = {
  background: "white",
  padding: "25px",
  borderRadius: "12px",
  boxShadow:
    "0 2px 10px rgba(0,0,0,0.06)",
  marginBottom: "20px",
};

const formCardStyle = {
  background: "white",
  padding: "25px",
  borderRadius: "12px",
  boxShadow:
    "0 2px 10px rgba(0,0,0,0.06)",
};

const searchBoxStyle = {
  background: "white",
  padding: "20px",
  borderRadius: "12px",
  marginBottom: "20px",
  boxShadow:
    "0 2px 10px rgba(0,0,0,0.06)",
};

const searchLabelStyle = {
  fontWeight: "700",
  marginBottom: "10px",
  color: "#334155",
};

const searchInputStyle = {
  width: "100%",
  padding: "13px 15px",
  border:
    "1px solid #cbd5e1",
  borderRadius: "8px",
  fontSize: "15px",
  boxSizing: "border-box",
  outline: "none",
};

const sectionTitleStyle = {
  marginTop: 0,
  color: "#1e293b",
};

const studentHeaderStyle = {
  display: "flex",
  justifyContent:
    "space-between",
  alignItems: "center",
  gap: "15px",
  flexWrap: "wrap",
};

const studentDetailsGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "15px",
  marginTop: "20px",
  padding: "18px",
  background: "#f8fafc",
  borderRadius: "10px",
};

const tableHeaderStyle = {
  backgroundColor:
    "#1e40af",
  color: "white",
};

const thStyle = {
  padding: "13px",
  textAlign: "left",
  borderBottom:
    "1px solid #e2e8f0",
};

const tdStyle = {
  padding: "13px",
  borderBottom:
    "1px solid #e2e8f0",
  color: "#334155",
};

const primaryButton = {
  backgroundColor:
    "#2563eb",
  color: "white",
  border: "none",
  padding:
    "9px 13px",
  borderRadius: "7px",
  cursor: "pointer",
  marginRight: "7px",
  marginBottom: "5px",
};

const viewButton = {
  backgroundColor:
    "#7c3aed",
  color: "white",
  border: "none",
  padding:
    "9px 13px",
  borderRadius: "7px",
  cursor: "pointer",
  marginBottom: "5px",
};

const viewButtonLarge = {
  ...viewButton,
  padding:
    "11px 18px",
};

const saveButton = {
  backgroundColor:
    "#16a34a",
  color: "white",
  border: "none",
  padding:
    "11px 20px",
  borderRadius: "7px",
  cursor: "pointer",
  fontWeight: "600",
};

const cancelButton = {
  backgroundColor:
    "#64748b",
  color: "white",
  border: "none",
  padding:
    "10px 18px",
  borderRadius: "7px",
  cursor: "pointer",
};

const markInputStyle = {
  width: "90px",
  padding: "9px",
  border:
    "1px solid #cbd5e1",
  borderRadius: "6px",
  textAlign: "center",
  fontSize: "14px",
  boxSizing: "border-box",
};

const selectStyle = {
  padding: "11px 14px",
  border:
    "1px solid #cbd5e1",
  borderRadius: "7px",
  fontSize: "15px",
  minWidth: "220px",
};

const labelStyle = {
  display: "block",
  marginBottom: "7px",
  fontWeight: "700",
  color: "#334155",
};

const summaryGrid = {
  display: "grid",
  gridTemplateColumns:
    "repeat(auto-fit, minmax(180px, 1fr))",
  gap: "15px",
  marginTop: "25px",
  padding: "18px",
  background: "#f8fafc",
  borderRadius: "10px",
};

const successStyle = {
  padding: "13px",
  background: "#dcfce7",
  color: "#166534",
  borderRadius: "8px",
  marginBottom: "15px",
};

const errorStyle = {
  padding: "13px",
  background: "#fee2e2",
  color: "#991b1b",
  borderRadius: "8px",
  marginBottom: "15px",
};

const emptyStyle = {
  padding: "30px",
  textAlign: "center",
  color: "#64748b",
};

const badgeGreen = {
  background: "#dcfce7",
  color: "#166534",
  padding: "5px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "700",
};

const badgeYellow = {
  background: "#fef3c7",
  color: "#92400e",
  padding: "5px 10px",
  borderRadius: "20px",
  fontSize: "12px",
  fontWeight: "700",
};

export default Results;