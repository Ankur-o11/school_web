import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";

/* =====================================================
   SUBJECTS + SYLLABUS MANAGEMENT
   ===================================================== */

function Subjects() {
  const { fetchWithAuth } = useAuth();
  const [loading, setLoading] = useState(true);
  /* =====================================================
     SUBJECT DATA
     ===================================================== */

  const [subjects, setSubjects] = useState([]);

  const loadSubjects = async () => {
    try {
      setLoading(true);
      const response = await fetchWithAuth("/subjects");
      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }
      const data = await response.json();
      setSubjects(data.subjects || data.data || []);
    } catch (error) {
      console.error("Error fetching subjects:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubjects();
  }, []);

  /* =====================================================
     SYLLABUS DATA

     Structure:

     subjectId
     className
     section
     lessons[]
     ===================================================== */

  const [syllabusData, setSyllabusData] = useState([
    {
      id: 101,
      subjectId: 11,
      className: "Class 5",
      section: "A",
      subjectName: "Hindi",
      teacher: "Mrs. Pooja Singh",
      academicSession: "2026-27",
      lessons: [
        {
          id: 1,
          number: 1,
          title: "राख की रस्सी",
          description:
            "लोककथा के माध्यम से बुद्धिमत्ता और समझदारी का अध्ययन।",
          topics: [
            "कहानी का परिचय",
            "मुख्य पात्र",
            "कहानी का सार",
            "कठिन शब्द",
            "प्रश्न एवं उत्तर",
          ],
          completed: true,
        },
        {
          id: 2,
          number: 2,
          title: "फसल",
          description:
            "फसल, किसान और प्रकृति के संबंध को समझना।",
          topics: [
            "फसल का महत्व",
            "किसान का जीवन",
            "प्रकृति और कृषि",
            "शब्दार्थ",
            "अभ्यास प्रश्न",
          ],
          completed: true,
        },
        {
          id: 3,
          number: 3,
          title: "खिलौनेवाला",
          description:
            "कविता के माध्यम से बच्चों की भावनाओं का अध्ययन।",
          topics: [
            "कविता परिचय",
            "कविता का भावार्थ",
            "मुख्य शब्द",
            "प्रश्न उत्तर",
          ],
          completed: false,
        },
        {
          id: 4,
          number: 4,
          title: "नन्हा मुन्ना राही हूँ",
          description:
            "देशभक्ति और जिम्मेदारी से संबंधित पाठ।",
          topics: [
            "देशभक्ति",
            "राष्ट्र के प्रति जिम्मेदारी",
            "कविता का अर्थ",
            "शब्दार्थ",
          ],
          completed: false,
        },
        {
          id: 5,
          number: 5,
          title: "जहाँ चाह वहाँ राह",
          description:
            "मेहनत और दृढ़ संकल्प के महत्व पर आधारित पाठ।",
          topics: [
            "मेहनत का महत्व",
            "दृढ़ संकल्प",
            "सफलता के लिए प्रयास",
            "अभ्यास",
          ],
          completed: false,
        },
        {
          id: 6,
          number: 6,
          title: "चिट्ठी का सफर",
          description:
            "पत्र लेखन और संचार के साधनों का अध्ययन।",
          topics: [
            "पत्र का परिचय",
            "पत्र के प्रकार",
            "अनौपचारिक पत्र",
            "पत्र लेखन अभ्यास",
          ],
          completed: false,
        },
        {
          id: 7,
          number: 7,
          title: "डाकिए की कहानी",
          description:
            "डाक व्यवस्था और संचार व्यवस्था का परिचय।",
          topics: [
            "डाकघर",
            "डाकिया",
            "पत्र वितरण",
            "संचार के साधन",
          ],
          completed: false,
        },
        {
          id: 8,
          number: 8,
          title: "वे दिन भी क्या दिन थे",
          description:
            "पुराने समय के जीवन और आधुनिक जीवन की तुलना।",
          topics: [
            "पुराना जीवन",
            "आधुनिक जीवन",
            "सुविधाओं में बदलाव",
            "तुलना",
          ],
          completed: false,
        },
        {
          id: 9,
          number: 9,
          title: "एक माँ की बेबसी",
          description:
            "माँ और बच्चे के भावनात्मक संबंध पर आधारित पाठ।",
          topics: [
            "माँ का प्रेम",
            "भावनात्मक पक्ष",
            "पाठ का संदेश",
            "प्रश्न उत्तर",
          ],
          completed: false,
        },
        {
          id: 10,
          number: 10,
          title: "बाघ आया उस रात",
          description:
            "रोचक कहानी के माध्यम से साहस और समझदारी का अध्ययन।",
          topics: [
            "कहानी परिचय",
            "मुख्य घटना",
            "पात्र परिचय",
            "कहानी का संदेश",
          ],
          completed: false,
        },
        {
          id: 11,
          number: 11,
          title: "बिशन की दिलेरी",
          description:
            "साहस और निडरता पर आधारित कहानी।",
          topics: [
            "साहस",
            "निडरता",
            "मुख्य पात्र",
            "कहानी का संदेश",
          ],
          completed: false,
        },
        {
          id: 12,
          number: 12,
          title: "पानी रे पानी",
          description:
            "जल के महत्व और संरक्षण का अध्ययन।",
          topics: [
            "जल का महत्व",
            "जल संरक्षण",
            "जल संकट",
            "पानी बचाने के उपाय",
          ],
          completed: false,
        },
        {
          id: 13,
          number: 13,
          title: "छोटी सी हमारी नदी",
          description:
            "नदियों और पर्यावरण के महत्व को समझना।",
          topics: [
            "नदी का महत्व",
            "पर्यावरण",
            "प्रदूषण",
            "नदी संरक्षण",
          ],
          completed: false,
        },
        {
          id: 14,
          number: 14,
          title: "बाघ और किसान",
          description:
            "मनुष्य और वन्यजीवों के संबंध पर आधारित पाठ।",
          topics: [
            "वन्यजीव",
            "किसान",
            "प्रकृति",
            "सह-अस्तित्व",
          ],
          completed: false,
        },
        {
          id: 15,
          number: 15,
          title: "हमारा देश",
          description:
            "भारत की विविधता और संस्कृति का परिचय।",
          topics: [
            "भारत का परिचय",
            "विविधता",
            "भाषाएँ",
            "संस्कृति",
            "राष्ट्रीय एकता",
          ],
          completed: false,
        },
      ],
    },

    {
      id: 102,
      subjectId: 12,
      className: "Class 5",
      section: "A",
      subjectName: "Mathematics",
      teacher: "Mr. Rahul Kumar",
      academicSession: "2026-27",
      lessons: [
        {
          id: 1,
          number: 1,
          title: "Numbers and Place Value",
          description:
            "Numbers और place value की मूल अवधारणाएँ।",
          topics: [
            "Large numbers",
            "Place value",
            "Face value",
            "Expanded form",
            "Comparison",
          ],
          completed: true,
        },
        {
          id: 2,
          number: 2,
          title: "Addition and Subtraction",
          description:
            "बड़ी संख्याओं का जोड़ और घटाव।",
          topics: [
            "Addition",
            "Subtraction",
            "Word problems",
            "Estimation",
          ],
          completed: false,
        },
        {
          id: 3,
          number: 3,
          title: "Multiplication",
          description:
            "Multiplication की विभिन्न विधियाँ।",
          topics: [
            "Multiplication",
            "Tables",
            "Long multiplication",
            "Word problems",
          ],
          completed: false,
        },
      ],
    },
  ]);

  /* =====================================================
     SUBJECT MODAL
     ===================================================== */

  const [showSubjectModal, setShowSubjectModal] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const emptyForm = {
    name: "",
    code: "",
    className: "",
    section: "A",
    type: "Compulsory",
    teacher: "",
    periods: "5",
  };

  const [form, setForm] =
    useState(emptyForm);

  /* =====================================================
     SYLLABUS VIEW
     ===================================================== */

  const [selectedSyllabus, setSelectedSyllabus] =
    useState(null);

  const [syllabusSearch, setSyllabusSearch] =
    useState("");

  /* =====================================================
     SYLLABUS LESSON MODAL
     ===================================================== */

  const [showLessonModal, setShowLessonModal] =
    useState(false);

  const [editingLessonId, setEditingLessonId] =
    useState(null);

  const emptyLesson = {
    title: "",
    description: "",
    topics: "",
    completed: false,
  };

  const [lessonForm, setLessonForm] =
    useState(emptyLesson);

  /* =====================================================
     SEARCH / FILTER
     ===================================================== */

  const [search, setSearch] =
    useState("");

  const [classFilter, setClassFilter] =
    useState("All");

  const [sectionFilter, setSectionFilter] =
    useState("All");

  /* =====================================================
     STATISTICS
     ===================================================== */

  const totalSubjects =
    subjects.length;

  const compulsorySubjects =
    subjects.filter(
      (item) =>
        item.type === "Compulsory"
    ).length;

  const optionalSubjects =
    subjects.filter(
      (item) =>
        item.type === "Optional"
    ).length;

  const activeSubjects =
    subjects.filter(
      (item) =>
        item.status === "Active"
    ).length;

  /* =====================================================
     FILTERED SUBJECTS
     ===================================================== */

  const filteredSubjects =
    useMemo(() => {
      return subjects.filter((item) => {
        const searchText =
          search.toLowerCase();

        const matchesSearch =
          item.name
            .toLowerCase()
            .includes(searchText) ||
          item.code
            .toLowerCase()
            .includes(searchText) ||
          item.teacher
            .toLowerCase()
            .includes(searchText);

        const matchesClass =
          classFilter === "All" ||
          item.className ===
            classFilter;

        const matchesSection =
          sectionFilter === "All" ||
          item.section ===
            sectionFilter;

        return (
          matchesSearch &&
          matchesClass &&
          matchesSection
        );
      });
    }, [
      subjects,
      search,
      classFilter,
      sectionFilter,
    ]);

  /* =====================================================
     ADD SUBJECT
     ===================================================== */

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowSubjectModal(true);
  };

  /* =====================================================
     EDIT SUBJECT
     ===================================================== */

  const openEditModal = (subject) => {
    setEditingId(subject.id);

    setForm({
      name: subject.name,
      code: subject.code,
      className: subject.className,
      section: subject.section || "A",
      type: subject.type,
      teacher: subject.teacher,
      periods: String(
        subject.periods
      ),
    });

    setShowSubjectModal(true);
  };

  /* =====================================================
     SAVE SUBJECT
     ===================================================== */

  /* =====================================================
     SAVE SUBJECT
     ===================================================== */

  const handleSubjectSubmit = async (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.code ||
      !form.className ||
      !form.teacher
    ) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      const payload = {
        name: form.name,
        code: form.code,
        className: form.className,
        class: form.className,
        section: form.section || "A",
        type: form.type || "Compulsory",
        teacher: form.teacher,
        periods: Number(form.periods) || 5,
        status: "Active",
      };

      if (editingId) {
        const response = await fetchWithAuth(`/subjects/${editingId}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to update subject");
        }

        alert("Subject updated successfully!");
      } else {
        const response = await fetchWithAuth("/subjects", {
          method: "POST",
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to create subject");
        }

        alert("Subject created successfully!");
      }

      await loadSubjects();
      setForm(emptyForm);
      setEditingId(null);
      setShowSubjectModal(false);
    } catch (error) {
      console.error("Subject submit error:", error);
      alert(error.message || "Failed to save subject.");
    }
  };

  /* =====================================================
     DELETE SUBJECT
     ===================================================== */

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this subject?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetchWithAuth(`/subjects/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete subject");
      }

      alert("Subject deleted successfully!");
      await loadSubjects();

      if (selectedSyllabus && selectedSyllabus.subjectId === id) {
        setSelectedSyllabus(null);
      }
    } catch (error) {
      console.error("Subject delete error:", error);
      alert(error.message || "Failed to delete subject.");
    }
  };

  /* =====================================================
     OPEN SYLLABUS
     ===================================================== */

  const openSyllabus = (subject) => {
    let syllabus =
      syllabusData.find(
        (item) =>
          item.subjectId ===
            subject.id &&
          item.className ===
            subject.className &&
          item.section ===
            subject.section
      );

    /* If syllabus doesn't exist,
       create empty syllabus */

    if (!syllabus) {
      syllabus = {
        id: Date.now(),
        subjectId:
          subject.id,
        className:
          subject.className,
        section:
          subject.section,
        subjectName:
          subject.name,
        teacher:
          subject.teacher,
        academicSession:
          "2026-27",
        lessons: [],
      };

      setSyllabusData(
        (prev) => [
          ...prev,
          syllabus,
        ]
      );
    }

    setSelectedSyllabus(
      syllabus
    );

    setSyllabusSearch("");
  };

  /* =====================================================
     GET CURRENT SYLLABUS
     ===================================================== */

  const currentSyllabus =
    selectedSyllabus
      ? syllabusData.find(
          (item) =>
            item.id ===
            selectedSyllabus.id
        ) ||
        selectedSyllabus
      : null;

  /* =====================================================
     SYLLABUS PROGRESS
     ===================================================== */

  const syllabusProgress =
    currentSyllabus
      ? currentSyllabus.lessons
          .length > 0
        ? Math.round(
            (currentSyllabus.lessons.filter(
              (lesson) =>
                lesson.completed
            ).length /
              currentSyllabus
                .lessons
                .length) *
              100
          )
        : 0
      : 0;

  /* =====================================================
     FILTER SYLLABUS LESSONS
     ===================================================== */

  const filteredLessons =
    currentSyllabus
      ? currentSyllabus.lessons.filter(
          (lesson) => {
            const text =
              syllabusSearch.toLowerCase();

            return (
              lesson.title
                .toLowerCase()
                .includes(text) ||
              lesson.description
                .toLowerCase()
                .includes(text) ||
              lesson.topics.some(
                (topic) =>
                  topic
                    .toLowerCase()
                    .includes(text)
              )
            );
          }
        )
      : [];

  /* =====================================================
     ADD LESSON
     ===================================================== */

  const openAddLesson = () => {
    setEditingLessonId(null);

    setLessonForm(
      emptyLesson
    );

    setShowLessonModal(true);
  };

  /* =====================================================
     EDIT LESSON
     ===================================================== */

  const openEditLesson = (
    lesson
  ) => {
    setEditingLessonId(
      lesson.id
    );

    setLessonForm({
      title:
        lesson.title,
      description:
        lesson.description,
      topics:
        lesson.topics.join(
          "\n"
        ),
      completed:
        lesson.completed,
    });

    setShowLessonModal(true);
  };

  /* =====================================================
     SAVE LESSON
     ===================================================== */

  const handleLessonSubmit =
    (e) => {
      e.preventDefault();

      if (
        !lessonForm.title.trim()
      ) {
        alert(
          "Please enter lesson title."
        );
        return;
      }

      if (!currentSyllabus)
        return;

      const topics =
        lessonForm.topics
          .split("\n")
          .map(
            (item) =>
              item.trim()
          )
          .filter(Boolean);

      if (editingLessonId) {
        setSyllabusData(
          (prev) =>
            prev.map(
              (syllabus) =>
                syllabus.id ===
                currentSyllabus.id
                  ? {
                      ...syllabus,
                      lessons:
                        syllabus.lessons.map(
                          (
                            lesson
                          ) =>
                            lesson.id ===
                            editingLessonId
                              ? {
                                  ...lesson,
                                  title:
                                    lessonForm.title,
                                  description:
                                    lessonForm.description,
                                  topics,
                                  completed:
                                    lessonForm.completed,
                                }
                              : lesson
                        ),
                    }
                  : syllabus
            )
        );
      } else {
        const newLesson = {
          id: Date.now(),
          number:
            currentSyllabus
              .lessons
              .length + 1,
          title:
            lessonForm.title,
          description:
            lessonForm.description,
          topics,
          completed:
            lessonForm.completed,
        };

        setSyllabusData(
          (prev) =>
            prev.map(
              (syllabus) =>
                syllabus.id ===
                currentSyllabus.id
                  ? {
                      ...syllabus,
                      lessons:
                        [
                          ...syllabus.lessons,
                          newLesson,
                        ],
                    }
                  : syllabus
            )
        );
      }

      setLessonForm(
        emptyLesson
      );

      setEditingLessonId(
        null
      );

      setShowLessonModal(false);
    };

  /* =====================================================
     DELETE LESSON
     ===================================================== */

  const deleteLesson = (
    lessonId
  ) => {
    const confirmDelete =
      window.confirm(
        "Delete this lesson?"
      );

    if (!confirmDelete) return;

    setSyllabusData(
      (prev) =>
        prev.map(
          (syllabus) =>
            syllabus.id ===
            currentSyllabus.id
              ? {
                  ...syllabus,
                  lessons:
                    syllabus.lessons
                      .filter(
                        (lesson) =>
                          lesson.id !==
                          lessonId
                      )
                      .map(
                        (
                          lesson,
                          index
                        ) => ({
                          ...lesson,
                          number:
                            index +
                            1,
                        })
                      ),
                }
              : syllabus
        )
    );
  };

  /* =====================================================
     TOGGLE LESSON COMPLETE
     ===================================================== */

  const toggleLesson = (
    lessonId
  ) => {
    setSyllabusData(
      (prev) =>
        prev.map(
          (syllabus) =>
            syllabus.id ===
            currentSyllabus.id
              ? {
                  ...syllabus,
                  lessons:
                    syllabus.lessons.map(
                      (
                        lesson
                      ) =>
                        lesson.id ===
                        lessonId
                          ? {
                              ...lesson,
                              completed:
                                !lesson.completed,
                            }
                          : lesson
                    ),
                }
              : syllabus
        )
    );
  };

  /* =====================================================
     SYLLABUS PAGE
     ===================================================== */

  if (currentSyllabus) {
    return (
      <div className="subjects-page">

        <style>{`
          * {
            box-sizing: border-box;
          }

          .subjects-page {
            min-height: 100vh;
            padding: 28px;
            background:
              linear-gradient(
                135deg,
                #f8fafc,
                #eef4ff
              );
            font-family:
              Inter,
              system-ui,
              -apple-system,
              BlinkMacSystemFont,
              "Segoe UI",
              sans-serif;
            color: #172033;
          }

          .syllabus-topbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 20px;
            margin-bottom: 22px;
          }

          .syllabus-back {
            border: 0;
            background: #ffffff;
            color: #334155;
            padding: 11px 17px;
            border-radius: 12px;
            cursor: pointer;
            font-weight: 700;
            box-shadow:
              0 6px 20px
              rgba(15,23,42,.08);
          }

          .syllabus-back:hover {
            transform: translateY(-1px);
          }

          .syllabus-actions {
            display: flex;
            gap: 10px;
          }

          .syllabus-action-btn {
            border: 0;
            padding: 11px 17px;
            border-radius: 11px;
            cursor: pointer;
            font-weight: 700;
          }

          .syllabus-add {
            background: #2563eb;
            color: white;
          }

          .syllabus-print {
            background: white;
            color: #334155;
          }

          .syllabus-header-card {
            background:
              linear-gradient(
                135deg,
                #172554,
                #2563eb
              );
            color: white;
            border-radius: 22px;
            padding: 28px;
            box-shadow:
              0 18px 45px
              rgba(37,99,235,.20);
            margin-bottom: 22px;
          }

          .syllabus-header-main {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 25px;
          }

          .syllabus-title-area {
            display: flex;
            align-items: center;
            gap: 18px;
          }

          .syllabus-book-icon {
            width: 64px;
            height: 64px;
            border-radius: 18px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: rgba(255,255,255,.15);
            font-size: 32px;
          }

          .syllabus-title-area h1 {
            margin: 0 0 5px;
            font-size: 30px;
          }

          .syllabus-title-area p {
            margin: 0;
            opacity: .86;
          }

          .teacher-badge {
            display: inline-flex;
            align-items: center;
            gap: 9px;
            margin-top: 12px;
            padding: 8px 13px;
            border-radius: 30px;
            background: rgba(255,255,255,.14);
            font-size: 14px;
          }

          .syllabus-progress-box {
            min-width: 230px;
            padding: 18px;
            border-radius: 17px;
            background: rgba(255,255,255,.12);
          }

          .progress-top {
            display: flex;
            justify-content: space-between;
            margin-bottom: 9px;
            font-size: 14px;
          }

          .progress-bar {
            height: 9px;
            border-radius: 20px;
            background: rgba(255,255,255,.2);
            overflow: hidden;
          }

          .progress-fill {
            height: 100%;
            border-radius: 20px;
            background: #ffffff;
          }

          .syllabus-info-grid {
            display: grid;
            grid-template-columns:
              repeat(4, 1fr);
            gap: 15px;
            margin-bottom: 22px;
          }

          .info-card {
            background: white;
            border-radius: 17px;
            padding: 18px;
            box-shadow:
              0 8px 25px
              rgba(15,23,42,.06);
          }

          .info-card span {
            display: block;
            color: #64748b;
            font-size: 13px;
            margin-bottom: 6px;
          }

          .info-card strong {
            font-size: 21px;
          }

          .syllabus-toolbar {
            background: white;
            padding: 17px;
            border-radius: 17px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 15px;
            margin-bottom: 20px;
            box-shadow:
              0 8px 25px
              rgba(15,23,42,.05);
          }

          .syllabus-search {
            flex: 1;
            max-width: 450px;
            display: flex;
            align-items: center;
            gap: 9px;
            border: 1px solid #e2e8f0;
            padding: 10px 14px;
            border-radius: 12px;
          }

          .syllabus-search input {
            width: 100%;
            border: 0;
            outline: 0;
            font-size: 14px;
          }

          .lesson-list {
            display: grid;
            gap: 16px;
          }

          .lesson-card {
            background: white;
            border-radius: 19px;
            padding: 21px;
            box-shadow:
              0 8px 25px
              rgba(15,23,42,.06);
            border: 1px solid #edf1f7;
          }

          .lesson-card.completed {
            border-left:
              4px solid #22c55e;
          }

          .lesson-card-top {
            display: flex;
            align-items: flex-start;
            gap: 15px;
          }

          .lesson-number {
            width: 43px;
            height: 43px;
            flex-shrink: 0;
            border-radius: 13px;
            background: #eff6ff;
            color: #2563eb;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
          }

          .lesson-main {
            flex: 1;
          }

          .lesson-main h3 {
            margin: 0 0 5px;
            font-size: 19px;
          }

          .lesson-main p {
            margin: 0;
            color: #64748b;
            line-height: 1.6;
          }

          .lesson-status {
            padding: 7px 11px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: 800;
            background: #fef3c7;
            color: #92400e;
          }

          .lesson-status.done {
            background: #dcfce7;
            color: #166534;
          }

          .lesson-topics {
            margin:
              18px 0 0 58px;
            display: flex;
            flex-wrap: wrap;
            gap: 9px;
          }

          .topic-chip {
            padding: 8px 12px;
            border-radius: 9px;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            color: #475569;
            font-size: 13px;
          }

          .lesson-actions {
            margin:
              17px 0 0 58px;
            display: flex;
            gap: 8px;
          }

          .lesson-btn {
            border: 0;
            cursor: pointer;
            border-radius: 9px;
            padding: 8px 12px;
            font-weight: 700;
          }

          .lesson-complete {
            background: #ecfdf5;
            color: #047857;
          }

          .lesson-edit {
            background: #eff6ff;
            color: #2563eb;
          }

          .lesson-delete {
            background: #fef2f2;
            color: #dc2626;
          }

          .empty-syllabus {
            background: white;
            padding: 60px 20px;
            text-align: center;
            border-radius: 20px;
          }

          .empty-syllabus-icon {
            font-size: 50px;
            margin-bottom: 12px;
          }

          .empty-syllabus h2 {
            margin: 0 0 7px;
          }

          .empty-syllabus p {
            color: #64748b;
          }

          /* MODAL */

          .modal-overlay {
            position: fixed;
            inset: 0;
            z-index: 9999;
            background: rgba(15,23,42,.58);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
          }

          .modal-box {
            width: min(760px, 100%);
            max-height: 92vh;
            overflow-y: auto;
            background: white;
            border-radius: 22px;
            box-shadow:
              0 25px 80px
              rgba(15,23,42,.28);
          }

          .modal-header {
            padding: 22px 24px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            border-bottom: 1px solid #eef2f7;
          }

          .modal-header h2 {
            margin: 0 0 4px;
          }

          .modal-header p {
            margin: 0;
            color: #64748b;
            font-size: 14px;
          }

          .modal-close {
            border: 0;
            background: #f1f5f9;
            width: 36px;
            height: 36px;
            border-radius: 10px;
            font-size: 22px;
            cursor: pointer;
          }

          .modal-body {
            padding: 24px;
          }

          .form-grid {
            display: grid;
            grid-template-columns:
              repeat(2, 1fr);
            gap: 17px;
          }

          .form-group {
            display: flex;
            flex-direction: column;
            gap: 7px;
          }

          .form-group.full {
            grid-column: 1 / -1;
          }

          .form-group label {
            font-size: 13px;
            font-weight: 800;
            color: #334155;
          }

          .form-group input,
          .form-group select,
          .form-group textarea {
            width: 100%;
            border: 1px solid #dbe3ed;
            border-radius: 11px;
            padding: 11px 13px;
            outline: 0;
            font-family: inherit;
            font-size: 14px;
          }

          .form-group textarea {
            min-height: 100px;
            resize: vertical;
          }

          .form-group input:focus,
          .form-group select:focus,
          .form-group textarea:focus {
            border-color: #2563eb;
            box-shadow:
              0 0 0 3px
              rgba(37,99,235,.1);
          }

          .modal-footer {
            padding: 17px 24px;
            border-top: 1px solid #eef2f7;
            display: flex;
            justify-content: flex-end;
            gap: 10px;
          }

          .modal-footer button {
            border: 0;
            padding: 11px 18px;
            border-radius: 10px;
            cursor: pointer;
            font-weight: 800;
          }

          .cancel-btn {
            background: #f1f5f9;
            color: #334155;
          }

          .save-btn {
            background: #2563eb;
            color: white;
          }

          .checkbox-line {
            display: flex;
            align-items: center;
            gap: 9px;
            font-size: 14px;
            font-weight: 700;
          }

          .checkbox-line input {
            width: 17px;
            height: 17px;
          }

          @media (max-width: 900px) {
            .syllabus-header-main {
              flex-direction: column;
              align-items: flex-start;
            }

            .syllabus-progress-box {
              width: 100%;
            }

            .syllabus-info-grid {
              grid-template-columns:
                repeat(2, 1fr);
            }
          }

          @media (max-width: 650px) {
            .subjects-page {
              padding: 15px;
            }

            .syllabus-info-grid,
            .form-grid {
              grid-template-columns: 1fr;
            }

            .syllabus-topbar,
            .syllabus-toolbar {
              flex-direction: column;
              align-items: stretch;
            }

            .syllabus-actions {
              width: 100%;
            }

            .syllabus-action-btn {
              flex: 1;
            }

            .lesson-topics,
            .lesson-actions {
              margin-left: 0;
            }
          }

          @media print {
            .syllabus-topbar,
            .syllabus-toolbar,
            .lesson-actions {
              display: none !important;
            }

            .subjects-page {
              background: white;
              padding: 0;
            }

            .syllabus-header-card {
              box-shadow: none;
            }

            .lesson-card {
              box-shadow: none;
              break-inside: avoid;
            }
          }
        `}</style>

        {/* =================================================
            TOP BAR
            ================================================= */}

        <div className="syllabus-topbar">

          <button
            className="syllabus-back"
            onClick={() =>
              setSelectedSyllabus(null)
            }
          >
            ← Back to Subjects
          </button>

          <div className="syllabus-actions">

            <button
              className="syllabus-action-btn syllabus-print"
              onClick={() =>
                window.print()
              }
            >
              🖨️ Print Syllabus
            </button>

            <button
              className="syllabus-action-btn syllabus-add"
              onClick={openAddLesson}
            >
              ＋ Add Lesson
            </button>

          </div>

        </div>

        {/* =================================================
            SYLLABUS HEADER
            ================================================= */}

        <div className="syllabus-header-card">

          <div className="syllabus-header-main">

            <div className="syllabus-title-area">

              <div className="syllabus-book-icon">
                📖
              </div>

              <div>

                <h1>
                  {currentSyllabus.subjectName}
                </h1>

                <p>
                  {currentSyllabus.className}
                  {" - "}
                  Section{" "}
                  {currentSyllabus.section}
                  {" • "}
                  Session{" "}
                  {currentSyllabus.academicSession}
                </p>

                <div className="teacher-badge">
                  👨‍🏫
                  Teacher:
                  <strong>
                    {currentSyllabus.teacher}
                  </strong>
                </div>

              </div>

            </div>

            <div className="syllabus-progress-box">

              <div className="progress-top">
                <span>
                  Syllabus Progress
                </span>

                <strong>
                  {syllabusProgress}%
                </strong>
              </div>

              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{
                    width:
                      `${syllabusProgress}%`,
                  }}
                />
              </div>

            </div>

          </div>

        </div>

        {/* =================================================
            INFO CARDS
            ================================================= */}

        <div className="syllabus-info-grid">

          <div className="info-card">
            <span>
              Total Lessons
            </span>

            <strong>
              {
                currentSyllabus.lessons
                  .length
              }
            </strong>
          </div>

          <div className="info-card">
            <span>
              Completed
            </span>

            <strong>
              {
                currentSyllabus.lessons.filter(
                  (lesson) =>
                    lesson.completed
                ).length
              }
            </strong>
          </div>

          <div className="info-card">
            <span>
              Remaining
            </span>

            <strong>
              {
                currentSyllabus.lessons.filter(
                  (lesson) =>
                    !lesson.completed
                ).length
              }
            </strong>
          </div>

          <div className="info-card">
            <span>
              Subject Teacher
            </span>

            <strong
              style={{
                fontSize: 16,
              }}
            >
              {currentSyllabus.teacher}
            </strong>
          </div>

        </div>

        {/* =================================================
            SEARCH
            ================================================= */}

        <div className="syllabus-toolbar">

          <div>

            <strong>
              Complete Syllabus
            </strong>

            <div
              style={{
                color: "#64748b",
                fontSize: 13,
                marginTop: 3,
              }}
            >
              All lessons and topics
            </div>

          </div>

          <div className="syllabus-search">

            🔍

            <input
              placeholder="Search lesson or topic..."
              value={syllabusSearch}
              onChange={(e) =>
                setSyllabusSearch(
                  e.target.value
                )
              }
            />

          </div>

        </div>

        {/* =================================================
            LESSONS
            ================================================= */}

        {filteredLessons.length >
        0 ? (
          <div className="lesson-list">

            {filteredLessons.map(
              (lesson) => (
                <div
                  key={lesson.id}
                  className={
                    `lesson-card ${
                      lesson.completed
                        ? "completed"
                        : ""
                    }`
                  }
                >

                  <div className="lesson-card-top">

                    <div className="lesson-number">
                      {String(
                        lesson.number
                      ).padStart(
                        2,
                        "0"
                      )}
                    </div>

                    <div className="lesson-main">

                      <h3>
                        Lesson{" "}
                        {lesson.number}
                        {" — "}
                        {lesson.title}
                      </h3>

                      <p>
                        {
                          lesson.description
                        }
                      </p>

                    </div>

                    <span
                      className={
                        `lesson-status ${
                          lesson.completed
                            ? "done"
                            : ""
                        }`
                      }
                    >
                      {lesson.completed
                        ? "✓ Completed"
                        : "Pending"}
                    </span>

                  </div>

                  <div className="lesson-topics">

                    {lesson.topics.map(
                      (
                        topic,
                        index
                      ) => (
                        <span
                          key={index}
                          className="topic-chip"
                        >
                          ✓ {topic}
                        </span>
                      )
                    )}

                  </div>

                  <div className="lesson-actions">

                    <button
                      className="lesson-btn lesson-complete"
                      onClick={() =>
                        toggleLesson(
                          lesson.id
                        )
                      }
                    >
                      {lesson.completed
                        ? "↩ Mark Pending"
                        : "✓ Mark Complete"}
                    </button>

                    <button
                      className="lesson-btn lesson-edit"
                      onClick={() =>
                        openEditLesson(
                          lesson
                        )
                      }
                    >
                      ✏️ Edit
                    </button>

                    <button
                      className="lesson-btn lesson-delete"
                      onClick={() =>
                        deleteLesson(
                          lesson.id
                        )
                      }
                    >
                      🗑️ Delete
                    </button>

                  </div>

                </div>
              )
            )}

          </div>
        ) : (

          <div className="empty-syllabus">

            <div className="empty-syllabus-icon">
              📚
            </div>

            <h2>
              No Lessons Found
            </h2>

            <p>
              Is syllabus me abhi koi
              lesson nahi mila.
            </p>

            <button
              className="syllabus-action-btn syllabus-add"
              onClick={openAddLesson}
            >
              ＋ Add First Lesson
            </button>

          </div>

        )}

        {/* =================================================
            LESSON MODAL
            ================================================= */}

        {showLessonModal && (
          <div
            className="modal-overlay"
            onClick={() =>
              setShowLessonModal(false)
            }
          >

            <div
              className="modal-box"
              onClick={(e) =>
                e.stopPropagation()
              }
            >

              <div className="modal-header">

                <div>

                  <h2>
                    {editingLessonId
                      ? "Edit Lesson"
                      : "Add New Lesson"}
                  </h2>

                  <p>
                    Add complete lesson
                    information and topics.
                  </p>

                </div>

                <button
                  className="modal-close"
                  onClick={() =>
                    setShowLessonModal(
                      false
                    )
                  }
                >
                  ×
                </button>

              </div>

              <form
                onSubmit={
                  handleLessonSubmit
                }
              >

                <div className="modal-body">

                  <div className="form-grid">

                    <div className="form-group full">

                      <label>
                        Lesson Title *
                      </label>

                      <input
                        type="text"
                        placeholder="e.g. हमारा देश"
                        value={
                          lessonForm.title
                        }
                        onChange={(e) =>
                          setLessonForm({
                            ...lessonForm,
                            title:
                              e.target.value,
                          })
                        }
                      />

                    </div>

                    <div className="form-group full">

                      <label>
                        Lesson Description
                      </label>

                      <textarea
                        placeholder="Explain what students will learn in this lesson..."
                        value={
                          lessonForm.description
                        }
                        onChange={(e) =>
                          setLessonForm({
                            ...lessonForm,
                            description:
                              e.target.value,
                          })
                        }
                      />

                    </div>

                    <div className="form-group full">

                      <label>
                        Topics / Sub-topics
                      </label>

                      <textarea
                        placeholder={
                          "Enter one topic per line\n\nExample:\nIntroduction\nMain characters\nSummary\nWord meanings\nQuestion answers"
                        }
                        value={
                          lessonForm.topics
                        }
                        onChange={(e) =>
                          setLessonForm({
                            ...lessonForm,
                            topics:
                              e.target.value,
                          })
                        }
                      />

                    </div>

                    <div className="form-group full">

                      <label className="checkbox-line">

                        <input
                          type="checkbox"
                          checked={
                            lessonForm.completed
                          }
                          onChange={(e) =>
                            setLessonForm({
                              ...lessonForm,
                              completed:
                                e.target.checked,
                            })
                          }
                        />

                        Lesson completed

                      </label>

                    </div>

                  </div>

                </div>

                <div className="modal-footer">

                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() =>
                      setShowLessonModal(
                        false
                      )
                    }
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="save-btn"
                  >
                    {editingLessonId
                      ? "Update Lesson"
                      : "Add Lesson"}
                  </button>

                </div>

              </form>

            </div>

          </div>
        )}

      </div>
    );
  }

  /* =====================================================
     SUBJECT PAGE
     ===================================================== */

  return (
    <div className="subjects-page">

      <style>{`

        * {
          box-sizing: border-box;
        }

        .subjects-page {
          min-height: 100vh;
          padding: 28px;
          background:
            linear-gradient(
              135deg,
              #f8fafc,
              #eef4ff
            );
          font-family:
            Inter,
            system-ui,
            -apple-system,
            BlinkMacSystemFont,
            "Segoe UI",
            sans-serif;
          color: #172033;
        }

        .subjects-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 25px;
        }

        .subjects-header h1 {
          margin: 0;
          font-size: 30px;
        }

        .subjects-header p {
          color: #64748b;
          margin: 6px 0 0;
        }

        .add-subject-btn {
          border: 0;
          background:
            linear-gradient(
              135deg,
              #2563eb,
              #1d4ed8
            );
          color: white;
          padding: 13px 18px;
          border-radius: 12px;
          font-weight: 800;
          cursor: pointer;
          box-shadow:
            0 9px 22px
            rgba(37,99,235,.2);
        }

        .subject-stats {
          display: grid;
          grid-template-columns:
            repeat(4, 1fr);
          gap: 16px;
          margin-bottom: 23px;
        }

        .subject-stat-card {
          background: white;
          border-radius: 17px;
          padding: 18px;
          display: flex;
          align-items: center;
          gap: 14px;
          box-shadow:
            0 8px 25px
            rgba(15,23,42,.06);
        }

        .subject-stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 22px;
        }

        .subject-stat-icon.blue {
          background: #eff6ff;
        }

        .subject-stat-icon.green {
          background: #ecfdf5;
        }

        .subject-stat-icon.orange {
          background: #fff7ed;
        }

        .subject-stat-icon.purple {
          background: #faf5ff;
        }

        .subject-stat-card span {
          display: block;
          color: #64748b;
          font-size: 13px;
          margin-bottom: 4px;
        }

        .subject-stat-card strong {
          font-size: 23px;
        }

        .subjects-table-card {
          background: white;
          border-radius: 19px;
          box-shadow:
            0 8px 30px
            rgba(15,23,42,.06);
          overflow: hidden;
        }

        .subjects-table-top {
          padding: 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          border-bottom: 1px solid #eef2f7;
        }

        .subjects-table-top h2 {
          margin: 0;
        }

        .subjects-table-top p {
          margin: 5px 0 0;
          color: #64748b;
          font-size: 13px;
        }

        .subject-controls {
          display: flex;
          gap: 10px;
        }

        .subject-search {
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid #e2e8f0;
          border-radius: 11px;
          padding: 9px 12px;
        }

        .subject-search input {
          border: 0;
          outline: 0;
          min-width: 190px;
        }

        .subject-controls select {
          border: 1px solid #e2e8f0;
          border-radius: 11px;
          padding: 9px 12px;
          background: white;
        }

        .subjects-table-wrapper {
          overflow-x: auto;
        }

        .subjects-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 1150px;
        }

        .subjects-table th {
          background: #f8fafc;
          color: #64748b;
          text-align: left;
          padding: 14px 16px;
          font-size: 12px;
          text-transform: uppercase;
          letter-spacing: .04em;
        }

        .subjects-table td {
          padding: 15px 16px;
          border-top: 1px solid #f1f5f9;
          font-size: 14px;
        }

        .subject-number {
          color: #94a3b8;
          font-weight: 800;
        }

        .subject-name-cell {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .subject-icon {
          width: 35px;
          height: 35px;
          border-radius: 9px;
          background: #eff6ff;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .subject-code {
          font-family: monospace;
          background: #f8fafc;
          padding: 5px 8px;
          border-radius: 7px;
        }

        .class-tag {
          background: #f1f5f9;
          padding: 6px 9px;
          border-radius: 7px;
          font-weight: 700;
        }

        .type-compulsory,
        .type-optional {
          padding: 6px 9px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 800;
        }

        .type-compulsory {
          color: #166534;
          background: #dcfce7;
        }

        .type-optional {
          color: #92400e;
          background: #fef3c7;
        }

        .subject-teacher {
          display: flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
        }

        .subject-teacher-avatar {
          width: 31px;
          height: 31px;
          border-radius: 50%;
          background: #dbeafe;
          color: #1d4ed8;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
        }

        .period-count {
          font-weight: 800;
        }

        .subject-status {
          color: #15803d;
          font-weight: 700;
        }

        .subject-actions {
          display: flex;
          gap: 6px;
        }

        .subject-actions button {
          border: 0;
          width: 34px;
          height: 34px;
          border-radius: 9px;
          cursor: pointer;
        }

        .subject-edit {
          background: #eff6ff;
        }

        .subject-delete {
          background: #fef2f2;
        }

        .subject-syllabus {
          width: auto !important;
          padding: 0 10px;
          background: #f5f3ff;
          color: #6d28d9;
          font-weight: 800;
        }

        .no-subjects {
          text-align: center;
          padding: 40px !important;
          color: #64748b;
        }

        /* MODAL */

        .modal-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          background: rgba(15,23,42,.58);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }

        .modal-box {
          width: min(760px, 100%);
          max-height: 92vh;
          overflow-y: auto;
          background: white;
          border-radius: 22px;
          box-shadow:
            0 25px 80px
            rgba(15,23,42,.28);
        }

        .modal-header {
          padding: 22px 24px;
          display: flex;
          justify-content: space-between;
          border-bottom: 1px solid #eef2f7;
        }

        .modal-header h2 {
          margin: 0 0 4px;
        }

        .modal-header p {
          margin: 0;
          color: #64748b;
          font-size: 14px;
        }

        .modal-close {
          border: 0;
          background: #f1f5f9;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          font-size: 22px;
          cursor: pointer;
        }

        .modal-body {
          padding: 24px;
        }

        .form-grid {
          display: grid;
          grid-template-columns:
            repeat(2, 1fr);
          gap: 17px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .form-group label {
          font-size: 13px;
          font-weight: 800;
          color: #334155;
        }

        .form-group input,
        .form-group select {
          border: 1px solid #dbe3ed;
          border-radius: 11px;
          padding: 11px 13px;
          outline: 0;
          font-size: 14px;
        }

        .form-group input:focus,
        .form-group select:focus {
          border-color: #2563eb;
          box-shadow:
            0 0 0 3px
            rgba(37,99,235,.1);
        }

        .modal-footer {
          padding: 17px 24px;
          border-top: 1px solid #eef2f7;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }

        .modal-footer button {
          border: 0;
          padding: 11px 18px;
          border-radius: 10px;
          cursor: pointer;
          font-weight: 800;
        }

        .cancel-btn {
          background: #f1f5f9;
        }

        .save-btn {
          background: #2563eb;
          color: white;
        }

        @media(max-width: 900px) {
          .subject-stats {
            grid-template-columns:
              repeat(2, 1fr);
          }

          .subjects-table-top {
            flex-direction: column;
            align-items: stretch;
          }
        }

        @media(max-width: 600px) {
          .subjects-page {
            padding: 15px;
          }

          .subjects-header {
            flex-direction: column;
            align-items: stretch;
          }

          .subject-stats,
          .form-grid {
            grid-template-columns: 1fr;
          }

          .subject-controls {
            flex-direction: column;
          }
        }

      `}</style>

      {/* =================================================
          HEADER
          ================================================= */}

      <div className="subjects-header">

        <div>

          <h1>
            Subjects
          </h1>

          <p>
            Manage subjects, teachers,
            periods and complete class-wise
            syllabus.
          </p>

        </div>

        <button
          className="add-subject-btn"
          onClick={openAddModal}
        >
          ＋ Add Subject
        </button>

      </div>

      {/* =================================================
          STATISTICS
          ================================================= */}

      <div className="subject-stats">

        <div className="subject-stat-card">

          <div className="subject-stat-icon blue">
            📚
          </div>

          <div>
            <span>
              Total Subjects
            </span>
            <strong>
              {totalSubjects}
            </strong>
          </div>

        </div>

        <div className="subject-stat-card">

          <div className="subject-stat-icon green">
            📖
          </div>

          <div>
            <span>
              Compulsory
            </span>
            <strong>
              {compulsorySubjects}
            </strong>
          </div>

        </div>

        <div className="subject-stat-card">

          <div className="subject-stat-icon orange">
            ⭐
          </div>

          <div>
            <span>
              Optional
            </span>
            <strong>
              {optionalSubjects}
            </strong>
          </div>

        </div>

        <div className="subject-stat-card">

          <div className="subject-stat-icon purple">
            ✅
          </div>

          <div>
            <span>
              Active Subjects
            </span>
            <strong>
              {activeSubjects}
            </strong>
          </div>

        </div>

      </div>

      {/* =================================================
          TABLE
          ================================================= */}

      <div className="subjects-table-card">

        <div className="subjects-table-top">

          <div>

            <h2>
              All Subjects
            </h2>

            <p>
              Manage subjects for all
              classes and sections.
            </p>

          </div>

          <div className="subject-controls">

            <div className="subject-search">

              🔍

              <input
                type="text"
                placeholder="Search subject..."
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
              />

            </div>

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

              <option value="Nursery">
                Nursery
              </option>

              <option value="LKG">
                LKG
              </option>

              <option value="UKG">
                UKG
              </option>

              {Array.from(
                {
                  length: 12,
                },
                (_, index) => (
                  <option
                    key={index}
                    value={
                      `Class ${
                        index + 1
                      }`
                    }
                  >
                    Class{" "}
                    {index + 1}
                  </option>
                )
              )}

            </select>

            <select
              value={sectionFilter}
              onChange={(e) =>
                setSectionFilter(
                  e.target.value
                )
              }
            >

              <option value="All">
                All Sections
              </option>

              <option value="A">
                Section A
              </option>

              <option value="B">
                Section B
              </option>

            </select>

          </div>

        </div>

        <div className="subjects-table-wrapper">

          <table className="subjects-table">

            <thead>

              <tr>

                <th>#</th>
                <th>Subject</th>
                <th>Code</th>
                <th>Class</th>
                <th>Section</th>
                <th>Type</th>
                <th>Teacher</th>
                <th>Periods / Week</th>
                <th>Status</th>
                <th>Action</th>

              </tr>

            </thead>

            <tbody>

              {filteredSubjects.length >
              0 ? (
                filteredSubjects.map(
                  (
                    item,
                    index
                  ) => (

                    <tr
                      key={item.id}
                    >

                      <td className="subject-number">
                        {String(
                          index + 1
                        ).padStart(
                          2,
                          "0"
                        )}
                      </td>

                      <td>

                        <div className="subject-name-cell">

                          <div className="subject-icon">
                            📘
                          </div>

                          <strong>
                            {item.name}
                          </strong>

                        </div>

                      </td>

                      <td>

                        <span className="subject-code">
                          {item.code}
                        </span>

                      </td>

                      <td>

                        <span className="class-tag">
                          {item.className}
                        </span>

                      </td>

                      <td>
                        <span className="class-tag">
                          {item.section}
                        </span>
                      </td>

                      <td>

                        <span
                          className={
                            item.type ===
                            "Compulsory"
                              ? "type-compulsory"
                              : "type-optional"
                          }
                        >
                          {item.type}
                        </span>

                      </td>

                      <td>

                        <div className="subject-teacher">

                          <div className="subject-teacher-avatar">
                            {item.teacher
                              .charAt(
                                0
                              )
                              .toUpperCase()}
                          </div>

                          <span>
                            {item.teacher}
                          </span>

                        </div>

                      </td>

                      <td>

                        <span className="period-count">
                          {item.periods}
                        </span>

                      </td>

                      <td>

                        <span className="subject-status">
                          ●{" "}
                          {item.status}
                        </span>

                      </td>

                      <td>

                        <div className="subject-actions">

                          <button
                            className="subject-syllabus"
                            title="View Syllabus"
                            onClick={() =>
                              openSyllabus(
                                item
                              )
                            }
                          >
                            📖 Syllabus
                          </button>

                          <button
                            className="subject-edit"
                            title="Edit Subject"
                            onClick={() =>
                              openEditModal(
                                item
                              )
                            }
                          >
                            ✏️
                          </button>

                          <button
                            className="subject-delete"
                            title="Delete Subject"
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
              ) : (

                <tr>

                  <td
                    colSpan="10"
                    className="no-subjects"
                  >
                    No subjects found.

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* =================================================
          ADD / EDIT SUBJECT MODAL
          ================================================= */}

      {showSubjectModal && (

        <div
          className="modal-overlay"
          onClick={() =>
            setShowSubjectModal(
              false
            )
          }
        >

          <div
            className="modal-box"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <h2>
                  {editingId
                    ? "Edit Subject"
                    : "Add New Subject"}
                </h2>

                <p>
                  Enter subject information
                  below.
                </p>

              </div>

              <button
                className="modal-close"
                onClick={() =>
                  setShowSubjectModal(
                    false
                  )
                }
              >
                ×
              </button>

            </div>

            <form
              onSubmit={
                handleSubjectSubmit
              }
            >

              <div className="modal-body">

                <div className="form-grid">

                  <div className="form-group">

                    <label>
                      Subject Name *
                    </label>

                    <input
                      type="text"
                      placeholder="Mathematics"
                      value={
                        form.name
                      }
                      onChange={(e) =>
                        setForm({
                          ...form,
                          name:
                            e.target.value,
                        })
                      }
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Subject Code *
                    </label>

                    <input
                      type="text"
                      placeholder="MAT501"
                      value={
                        form.code
                      }
                      onChange={(e) =>
                        setForm({
                          ...form,
                          code:
                            e.target.value.toUpperCase(),
                        })
                      }
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Class *
                    </label>

                    <select
                      value={
                        form.className
                      }
                      onChange={(e) =>
                        setForm({
                          ...form,
                          className:
                            e.target.value,
                        })
                      }
                    >

                      <option value="">
                        Select Class
                      </option>

                      <option value="Nursery">
                        Nursery
                      </option>

                      <option value="LKG">
                        LKG
                      </option>

                      <option value="UKG">
                        UKG
                      </option>

                      {Array.from(
                        {
                          length: 12,
                        },
                        (_, index) => (
                          <option
                            key={index}
                            value={
                              `Class ${
                                index + 1
                              }`
                            }
                          >
                            Class{" "}
                            {index + 1}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                  <div className="form-group">

                    <label>
                      Section
                    </label>

                    <select
                      value={
                        form.section
                      }
                      onChange={(e) =>
                        setForm({
                          ...form,
                          section:
                            e.target.value,
                        })
                      }
                    >

                      <option value="A">
                        Section A
                      </option>

                      <option value="B">
                        Section B
                      </option>

                    </select>

                  </div>

                  <div className="form-group">

                    <label>
                      Subject Type
                    </label>

                    <select
                      value={
                        form.type
                      }
                      onChange={(e) =>
                        setForm({
                          ...form,
                          type:
                            e.target.value,
                        })
                      }
                    >

                      <option value="Compulsory">
                        Compulsory
                      </option>

                      <option value="Optional">
                        Optional
                      </option>

                    </select>

                  </div>

                  <div className="form-group">

                    <label>
                      Teacher *
                    </label>

                    <input
                      type="text"
                      placeholder="Enter teacher name"
                      value={
                        form.teacher
                      }
                      onChange={(e) =>
                        setForm({
                          ...form,
                          teacher:
                            e.target.value,
                        })
                      }
                    />

                  </div>

                  <div className="form-group">

                    <label>
                      Periods Per Week
                    </label>

                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={
                        form.periods
                      }
                      onChange={(e) =>
                        setForm({
                          ...form,
                          periods:
                            e.target.value,
                        })
                      }
                    />

                  </div>

                </div>

              </div>

              <div className="modal-footer">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() =>
                    setShowSubjectModal(
                      false
                    )
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-btn"
                >
                  {editingId
                    ? "Update Subject"
                    : "Add Subject"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Subjects;