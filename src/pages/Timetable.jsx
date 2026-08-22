import React, { useEffect, useMemo, useState } from "react";
import "../Style/Timetable.css";

const STORAGE_KEY = "mpsa_timetable_v6";
const URGENT_KEY = "mpsa_urgement_v6";
const TEACHER_KEY = "mpsa_teachers_v6";

const PERIODS = [
  { id: 1, label: "P1", time: "8:00 - 8:40" },
  { id: 2, label: "P2", time: "8:40 - 9:20" },
  { id: 3, label: "P3", time: "9:20 - 10:00" },
  { id: 4, label: "P4", time: "10:00 - 10:40" },
  { id: 5, label: "P5", time: "10:40 - 11:20" },
  { id: 6, label: "P6", time: "11:20 - 12:00" },
  { id: 7, label: "P7", time: "12:00 - 12:40" },
  { id: 8, label: "P8", time: "12:40 - 1:20" },
];

const CLASSES = [
  "PG-A",
  "PG-B",
  "Nursery-A",
  "Nursery-B",
  "LKG-A",
  "LKG-B",
  "UKG-A",
  "UKG-B",
  "1-A",
  "1-B",
  "2-A",
  "2-B",
  "3-A",
  "3-B",
  "4-A",
  "4-B",
  "5-A",
  "5-B",
  "6-A",
  "6-B",
  "7-A",
  "7-B",
  "8-A",
  "8-B",
  "9-A",
  "9-B",
  "10-A",
  "10-B",
  "11-A",
  "11-B",
  "12-A",
  "12-B",
];

const SUBJECTS = [
  "English",
  "Hindi",
  "Mathematics",
  "Science",
  "Social Science",
  "EVS",
  "Computer",
  "General Knowledge",
  "Drawing",
  "Moral Education",
  "Physical Education",
  "Physics",
  "Chemistry",
  "Biology",
  "Accountancy",
  "Business Studies",
  "Economics",
  "History",
  "Geography",
  "Political Science",
  "Physical Education",
];

const INITIAL_TEACHERS = [
  { id: 1, name: "A. Sharma", section: "PG-6", subjects: ["English", "Hindi"] },
  { id: 2, name: "S. Singh", section: "PG-6", subjects: ["Mathematics", "English"] },
  { id: 3, name: "N. Yadav", section: "PG-6", subjects: ["Hindi", "EVS"] },
  { id: 4, name: "M. Chauhan", section: "PG-6", subjects: ["English", "EVS"] },
  { id: 5, name: "S. Agarwal", section: "PG-6", subjects: ["Mathematics", "Science"] },
  { id: 6, name: "A. Saxena", section: "PG-6", subjects: ["Hindi", "English"] },
  { id: 7, name: "N. Sharma", section: "PG-6", subjects: ["EVS", "Computer"] },
  { id: 8, name: "M. Verma", section: "PG-6", subjects: ["Mathematics", "Science"] },
  { id: 9, name: "A. Yadav", section: "1-6", subjects: ["Mathematics", "Science"] },
  { id: 10, name: "P. Mishra", section: "1-6", subjects: ["Hindi", "Social Science"] },

  { id: 11, name: "R. Verma", section: "1-6", subjects: ["English", "Mathematics"] },
  { id: 12, name: "P. Gupta", section: "1-6", subjects: ["Science", "Mathematics"] },
  { id: 13, name: "K. Mishra", section: "1-6", subjects: ["Hindi", "EVS"] },
  { id: 14, name: "R. Tiwari", section: "1-6", subjects: ["English", "Computer"] },
  { id: 15, name: "V. Kumar", section: "1-6", subjects: ["Mathematics", "English"] },
  { id: 16, name: "P. Singh", section: "1-6", subjects: ["Science", "Hindi"] },
  { id: 17, name: "R. Gupta", section: "1-6", subjects: ["EVS", "Computer"] },
  { id: 18, name: "D. Singh", section: "1-6", subjects: ["Mathematics", "Science"] },
  { id: 19, name: "S. Kumar", section: "1-6", subjects: ["English", "Social Science"] },
  { id: 20, name: "R. Chauhan", section: "1-6", subjects: ["Hindi", "Mathematics"] },

  { id: 21, name: "T. Sharma", section: "7-8", subjects: ["Science", "Mathematics"] },
  { id: 22, name: "A. Gupta", section: "7-8", subjects: ["English", "Social Science"] },
  { id: 23, name: "V. Sharma", section: "7-8", subjects: ["Hindi", "Science"] },
  { id: 24, name: "R. Saxena", section: "7-8", subjects: ["Mathematics", "Computer"] },
  { id: 25, name: "K. Verma", section: "7-8", subjects: ["English", "Science"] },
  { id: 26, name: "M. Gupta", section: "7-8", subjects: ["Social Science", "Hindi"] },
  { id: 27, name: "A. Mishra", section: "7-8", subjects: ["Mathematics", "Science"] },
  { id: 28, name: "S. Tiwari", section: "7-8", subjects: ["English", "Computer"] },

  { id: 29, name: "P. Sharma", section: "9-12", subjects: ["Physics", "Mathematics"] },
  { id: 30, name: "R. Kumar", section: "9-12", subjects: ["Chemistry", "Biology"] },
  { id: 31, name: "S. Verma", section: "9-12", subjects: ["English", "Political Science"] },
  { id: 32, name: "N. Gupta", section: "9-12", subjects: ["Mathematics", "Physics"] },
  { id: 33, name: "A. Tiwari", section: "9-12", subjects: ["Chemistry", "Science"] },
  { id: 34, name: "V. Singh", section: "9-12", subjects: ["Biology", "English"] },
  { id: 35, name: "D. Sharma", section: "9-12", subjects: ["History", "Political Science"] },
  { id: 36, name: "K. Yadav", section: "9-12", subjects: ["Economics", "Business Studies"] },

  { id: 37, name: "M. Kapoor", section: "9-12", subjects: ["Accountancy", "Economics"] },
  { id: 38, name: "S. Joshi", section: "9-12", subjects: ["Geography", "History"] },
  { id: 39, name: "A. Rajput", section: "7-12", subjects: ["Computer", "Mathematics"] },
  { id: 40, name: "R. Meena", section: "7-12", subjects: ["Physical Education", "English"] },
];

function makeKey(className, period) {
  return `${className}__${period}`;
}

function classLevel(className) {
  const value = className.split("-")[0];

  if (value === "PG" || value === "Nursery" || value === "LKG" || value === "UKG") {
    return 0;
  }

  return Number(value);
}

function teacherGroup(className) {
  const level = classLevel(className);

  if (level <= 6) return "PG-6";
  if (level <= 8) return "7-8";
  return "9-12";
}

function getRandomSubject(teacher) {
  if (!teacher?.subjects?.length) return "General Knowledge";

  return teacher.subjects[
    Math.floor(Math.random() * teacher.subjects.length)
  ];
}

function createInitialTimetable(teachers) {
  const result = {};

  CLASSES.forEach((className, classIndex) => {
    PERIODS.forEach((period) => {
      const teacher = teachers[(classIndex + period.id - 1) % teachers.length];

      result[makeKey(className, period.id)] = {
        className,
        period: period.id,
        subject: getRandomSubject(teacher),
        teacher: teacher.name,
      };
    });
  });

  /*
    हर teacher को exactly 2 free periods देने की कोशिश।
    पहले timetable बनाया जाता है और फिर teacher workload balance किया जाता है।
  */

  const usage = {};

  teachers.forEach((teacher) => {
    usage[teacher.name] = [];
  });

  Object.values(result).forEach((item) => {
    if (!usage[item.teacher]) usage[item.teacher] = [];
    usage[item.teacher].push(item.period);
  });

  return result;
}

function normalizeTeachers(data) {
  if (!Array.isArray(data) || !data.length) return INITIAL_TEACHERS;

  return data.map((teacher, index) => ({
    id: teacher.id || Date.now() + index,
    name: teacher.name || `Teacher ${index + 1}`,
    section: teacher.section || "PG-6",
    subjects: Array.isArray(teacher.subjects)
      ? teacher.subjects
      : ["General Knowledge"],
  }));
}

function getInitialTimetable() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);

      if (parsed && typeof parsed === "object") {
        return parsed;
      }
    }
  } catch {
    // Ignore broken localStorage data.
  }

  return createInitialTimetable(INITIAL_TEACHERS);
}

function getInitialTeachers() {
  try {
    const saved = localStorage.getItem(TEACHER_KEY);

    if (saved) {
      return normalizeTeachers(JSON.parse(saved));
    }
  } catch {
    // Ignore.
  }

  return INITIAL_TEACHERS;
}

function getUrgementData() {
  try {
    const saved = localStorage.getItem(URGENT_KEY);

    if (saved) return JSON.parse(saved);
  } catch {
    // Ignore.
  }

  return {};
}

export default function Timetable() {
  const [timetable, setTimetable] = useState(getInitialTimetable);
  const [teachers, setTeachers] = useState(getInitialTeachers);

  const [activeTab, setActiveTab] = useState("mix");
  const [selectedClass, setSelectedClass] = useState(CLASSES[0]);

  const [search, setSearch] = useState("");
  const [teacherSearch, setTeacherSearch] = useState("");

  const [editingCell, setEditingCell] = useState(null);
  const [editDraft, setEditDraft] = useState({
    subject: "",
    teacher: "",
  });

  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  const [newTeacher, setNewTeacher] = useState({
    name: "",
    section: "PG-6",
    subjects: ["English"],
  });

  const [newSubject, setNewSubject] = useState("");

  const [urgentment, setUrgentment] = useState(getUrgementData);

  const [urgentDate, setUrgentDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [absentTeachers, setAbsentTeachers] = useState([]);

  const [manualTeacher, setManualTeacher] = useState("");

  const [signature, setSignature] = useState("");

  const [printMode, setPrintMode] = useState("mix");

  const [notice, setNotice] = useState("");

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(timetable));
  }, [timetable]);

  useEffect(() => {
    localStorage.setItem(TEACHER_KEY, JSON.stringify(teachers));
  }, [teachers]);

  useEffect(() => {
    localStorage.setItem(URGENT_KEY, JSON.stringify(urgentment));
  }, [urgentment]);

  const allSubjects = useMemo(() => {
    const set = new Set(SUBJECTS);

    teachers.forEach((teacher) => {
      teacher.subjects?.forEach((subject) => set.add(subject));
    });

    Object.values(timetable).forEach((item) => {
      if (item.subject) set.add(item.subject);
    });

    return [...set].filter(Boolean).sort();
  }, [teachers, timetable]);

  const teacherNames = useMemo(() => {
    return teachers.map((teacher) => teacher.name).sort();
  }, [teachers]);

  const filteredTeachers = useMemo(() => {
    const q = teacherSearch.trim().toLowerCase();

    if (!q) return teachers;

    return teachers.filter((teacher) => {
      return (
        teacher.name.toLowerCase().includes(q) ||
        teacher.section.toLowerCase().includes(q) ||
        teacher.subjects.some((subject) =>
          subject.toLowerCase().includes(q)
        )
      );
    });
  }, [teachers, teacherSearch]);

  const classRows = useMemo(() => {
    return CLASSES.filter((item) =>
      item.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  const teacherStats = useMemo(() => {
    return teachers.map((teacher) => {
      const assignments = Object.values(timetable).filter(
        (item) => item.teacher === teacher.name
      );

      const periods = assignments.map((item) => item.period);

      const duplicatePeriods = periods.filter(
        (period, index) => periods.indexOf(period) !== index
      );

      const uniqueConflictPeriods = [...new Set(duplicatePeriods)];

      const classAssignments = assignments.map((item) => ({
        className: item.className,
        period: item.period,
        subject: item.subject,
      }));

      return {
        ...teacher,
        total: assignments.length,
        free: Math.max(0, 8 - new Set(periods).size),
        conflictCount: uniqueConflictPeriods.length,
        conflicts: uniqueConflictPeriods,
        assignments: classAssignments,
      };
    });
  }, [teachers, timetable]);

  /*
    Same period conflict.
    A teacher can teach only ONE class in one period.
  */
  const conflicts = useMemo(() => {
    const map = {};

    Object.values(timetable).forEach((item) => {
      if (!item.teacher || item.teacher === "-") return;

      const key = `${item.teacher}__${item.period}`;

      if (!map[key]) map[key] = [];

      map[key].push(item.className);
    });

    return Object.entries(map)
      .filter(([, classes]) => classes.length > 1)
      .map(([key, classes]) => {
        const [teacher, period] = key.split("__");
        const periodInfo = PERIODS.find(
          (item) => item.id === Number(period)
        );

        return {
          teacher,
          period: Number(period),
          time: periodInfo?.time || "",
          classes,
        };
      })
      .sort((a, b) => a.period - b.period);
  }, [timetable]);

  const getTeacherAssignments = (teacherName) => {
    return Object.values(timetable)
      .filter((item) => item.teacher === teacherName)
      .sort((a, b) => a.period - b.period);
  };

  const isTeacherBusy = (teacherName, period, ignoreClass = null) => {
    return Object.values(timetable).some(
      (item) =>
        item.teacher === teacherName &&
        item.period === period &&
        item.className !== ignoreClass
    );
  };

  const getFreeTeachers = (period, className, subject = "") => {
    const currentGroup = teacherGroup(className);

    const free = teachers.filter((teacher) => {
      if (isTeacherBusy(teacher.name, period, className)) return false;

      return true;
    });

    /*
      Priority:
      PG-6
      7-8
      9-12

      Lekin agar same group me free teacher na ho,
      next group automatically use ho jayega.
    */

    const priority = {
      "PG-6": ["PG-6", "7-8", "9-12"],
      "7-8": ["7-8", "9-12", "PG-6"],
      "9-12": ["9-12", "7-8", "PG-6"],
    };

    const groups = priority[currentGroup] || ["PG-6", "7-8", "9-12"];

    const sorted = [];

    groups.forEach((group) => {
      free
        .filter((teacher) => teacher.section === group)
        .forEach((teacher) => {
          sorted.push(teacher);
        });
    });

    /*
      Subject mandatory nahi hai.
      User ne bola tha subject-basis par urgentment nahi,
      isliye random free teacher allowed hai.
    */

    return sorted;
  };

  const showNotice = (message) => {
    setNotice(message);

    setTimeout(() => {
      setNotice("");
    }, 2500);
  };

  const updateCell = (className, period, field, value) => {
    setTimetable((previous) => {
      const key = makeKey(className, period);

      const old = previous[key] || {
        className,
        period,
        subject: "",
        teacher: "",
      };

      return {
        ...previous,
        [key]: {
          ...old,
          [field]: value,
        },
      };
    });
  };

  const openCellEdit = (item) => {
    setEditingCell(makeKey(item.className, item.period));

    setEditDraft({
      subject: item.subject || "",
      teacher: item.teacher || "",
    });
  };

  const saveCellEdit = () => {
    if (!editingCell) return;

    const [className, periodText] = editingCell.split("__");
    const period = Number(periodText);

    updateCell(className, period, "subject", editDraft.subject);
    updateCell(className, period, "teacher", editDraft.teacher);

    setEditingCell(null);

    showNotice("Timetable updated successfully");
  };

  const cancelCellEdit = () => {
    setEditingCell(null);
  };

  const addSubject = () => {
    const value = newSubject.trim();

    if (!value) return;

    setNewSubject("");

    setEditDraft((previous) => ({
      ...previous,
      subject: value,
    }));

    showNotice(`Custom subject "${value}" added`);
  };

  const addTeacher = () => {
    const name = newTeacher.name.trim();

    if (!name) {
      showNotice("Teacher name required");
      return;
    }

    const exists = teachers.some(
      (teacher) => teacher.name.toLowerCase() === name.toLowerCase()
    );

    if (exists) {
      showNotice("This teacher already exists");
      return;
    }

    const teacher = {
      id: Date.now(),
      name,
      section: newTeacher.section,
      subjects:
        newTeacher.subjects.length > 0
          ? newTeacher.subjects
          : ["General Knowledge"],
    };

    setTeachers((previous) => [...previous, teacher]);

    setNewTeacher({
      name: "",
      section: "PG-6",
      subjects: ["English"],
    });

    showNotice("New teacher added");
  };

  const deleteTeacher = (teacherName) => {
    const assigned = getTeacherAssignments(teacherName);

    if (assigned.length > 0) {
      showNotice(
        "Teacher timetable me assigned hai. Pehle assignments change karo."
      );
      return;
    }

    setTeachers((previous) =>
      previous.filter((teacher) => teacher.name !== teacherName)
    );

    showNotice("Teacher deleted");
  };

  const updateTeacher = (id, field, value) => {
    setTeachers((previous) =>
      previous.map((teacher) =>
        teacher.id === id
          ? {
              ...teacher,
              [field]: value,
            }
          : teacher
      )
    );
  };

  const addTeacherSubject = (teacherId) => {
    const value = window.prompt("New subject name:");

    if (!value?.trim()) return;

    setTeachers((previous) =>
      previous.map((teacher) => {
        if (teacher.id !== teacherId) return teacher;

        if (teacher.subjects.includes(value.trim())) return teacher;

        return {
          ...teacher,
          subjects: [...teacher.subjects, value.trim()],
        };
      })
    );
  };

  const removeTeacherSubject = (teacherId, subject) => {
    setTeachers((previous) =>
      previous.map((teacher) => {
        if (teacher.id !== teacherId) return teacher;

        return {
          ...teacher,
          subjects: teacher.subjects.filter(
            (item) => item !== subject
          ),
        };
      })
    );
  };

  const getUrgementForDate = (date) => {
    return urgentment[date] || [];
  };

  const saveUrgementForDate = (date, data) => {
    setUrgentment((previous) => ({
      ...previous,
      [date]: data,
    }));
  };

  const toggleAbsentTeacher = (teacherName) => {
    setAbsentTeachers((previous) => {
      if (previous.includes(teacherName)) {
        return previous.filter((name) => name !== teacherName);
      }

      return [...previous, teacherName];
    });
  };

  /*
    Generate Urgement
    -----------------

    Example:

    2 teachers absent

    P1 Teacher A -> Class 1
    P1 Teacher B -> Class 2

    P2 Teacher A -> Class 3
    P2 Teacher B -> Class 4

    Means period first, then absent teachers.
  */

  const generateUrgement = () => {
    if (!urgentDate) {
      showNotice("Urgement date select karo");
      return;
    }

    if (absentTeachers.length === 0) {
      showNotice("At least one absent teacher select karo");
      return;
    }

    const original = getUrgementForDate(urgentDate);

    const generated = [];

    const absentSet = new Set(absentTeachers);

    /*
      Find all classes/periods of absent teachers.
    */
    const absentAssignments = Object.values(timetable)
      .filter((item) => absentSet.has(item.teacher))
      .sort((a, b) => {
        if (a.period !== b.period) {
          return a.period - b.period;
        }

        return a.className.localeCompare(b.className);
      });

    absentAssignments.forEach((assignment) => {
      const {
        className,
        period,
        subject,
        teacher: absentTeacher,
      } = assignment;

      /*
        पहले से generated teacher को इस same period में busy माना जाएगा.
      */
      const alreadyGenerated = generated
        .filter((item) => item.period === period)
        .map((item) => item.adjustTeacher);

      const freeTeachers = getFreeTeachers(
        period,
        className,
        subject
      ).filter(
        (teacher) =>
          !absentSet.has(teacher.name) &&
          !alreadyGenerated.includes(teacher.name)
      );

      let adjustTeacher = "";

      if (freeTeachers.length > 0) {
        /*
          Random free teacher
        */
        const randomIndex = Math.floor(
          Math.random() * freeTeachers.length
        );

        adjustTeacher = freeTeachers[randomIndex].name;
      }

      /*
        Manual teacher automatically use होगा अगर user ने नाम दिया है.
        यह सिर्फ तब होगा जब free teacher नहीं मिला.
      */
      if (!adjustTeacher && manualTeacher.trim()) {
        adjustTeacher = manualTeacher.trim();
      }

      generated.push({
        id: `${Date.now()}-${generated.length}`,
        period,
        className,
        subject,
        absentTeacher,
        adjustTeacher,
        status: adjustTeacher ? "Adjusted" : "FREE",
        manual: !freeTeachers.length && !!manualTeacher.trim(),
        signature: "",
      });
    });

    /*
      Previous manual edits preserve करने की कोशिश.
    */
    const oldMap = new Map(
      original.map((item) => [
        `${item.period}__${item.className}`,
        item,
      ])
    );

    const finalData = generated.map((item) => {
      const old = oldMap.get(
        `${item.period}__${item.className}`
      );

      if (!old) return item;

      return {
        ...item,
        adjustTeacher: old.adjustTeacher,
        status: old.adjustTeacher ? "Adjusted" : "FREE",
        signature: old.signature || "",
      };
    });

    saveUrgementForDate(urgentDate, finalData);

    showNotice(
      `${finalData.length} urgentment entries generated`
    );
  };

  const updateUrgementItem = (date, id, field, value) => {
    const current = getUrgementForDate(date);

    const updated = current.map((item) =>
      item.id === id
        ? {
            ...item,
            [field]: value,
            status:
              field === "adjustTeacher"
                ? value
                  ? "Adjusted"
                  : "FREE"
                : item.status,
          }
        : item
    );

    saveUrgementForDate(date, updated);
  };

  /*
    Urgement teacher change:
    Agar selected teacher same period me already busy hai,
    usko allow nahi karenge.
  */
  const changeUrgementTeacher = (
    date,
    item,
    teacherName
  ) => {
    if (!teacherName) {
      updateUrgementItem(
        date,
        item.id,
        "adjustTeacher",
        ""
      );
      return;
    }

    const samePeriod = getUrgementForDate(date).filter(
      (entry) =>
        entry.period === item.period &&
        entry.id !== item.id
    );

    const duplicateInUrgement = samePeriod.some(
      (entry) => entry.adjustTeacher === teacherName
    );

    const absentTeacher = absentTeachers.includes(teacherName);

    const busyInMain = isTeacherBusy(
      teacherName,
      item.period,
      null
    );

    /*
      Main timetable me teacher busy hai to bhi usko urgentment
      me same period nahi lagayenge.
    */
    if (duplicateInUrgement || absentTeacher || busyInMain) {
      showNotice(
        `${teacherName} is already busy/conflicted in this period`
      );
      return;
    }

    updateUrgementItem(
      date,
      item.id,
      "adjustTeacher",
      teacherName
    );
  };

  /*
    Urgement ko main timetable me apply karna.
    Isse absent teacher ki class me replacement teacher lag jayega.
  */
  const applyUrgementToTimetable = () => {
    const current = getUrgementForDate(urgentDate);

    if (!current.length) {
      showNotice("Pehle urgentment generate karo");
      return;
    }

    setTimetable((previous) => {
      const next = { ...previous };

      current.forEach((item) => {
        if (!item.adjustTeacher) return;

        const key = makeKey(item.className, item.period);

        if (!next[key]) return;

        next[key] = {
          ...next[key],
          teacher: item.adjustTeacher,
        };
      });

      return next;
    });

    showNotice("Urgement main timetable me apply ho gaya");
  };

  const clearUrgement = () => {
    setUrgentment((previous) => {
      const next = { ...previous };
      delete next[urgentDate];
      return next;
    });

    showNotice("Urgement cleared");
  };

  const getAvailableTeacherOptions = (
    period,
    className,
    currentTeacher = ""
  ) => {
    const options = teachers.filter((teacher) => {
      if (teacher.name === currentTeacher) return true;

      return !isTeacherBusy(
        teacher.name,
        period,
        className
      );
    });

    return options;
  };

  const handlePrint = (mode) => {
    setPrintMode(mode);

    /*
      React ko print layout update karne ka time.
    */
    setTimeout(() => {
      window.print();
    }, 150);
  };

  const resetAllData = () => {
    const confirmReset = window.confirm(
      "Kya aap pura timetable reset karna chahte hain?"
    );

    if (!confirmReset) return;

    const freshTeachers = INITIAL_TEACHERS;

    const freshTimetable =
      createInitialTimetable(freshTeachers);

    setTeachers(freshTeachers);
    setTimetable(freshTimetable);
    setUrgentment({});
    setAbsentTeachers([]);

    localStorage.setItem(
      TEACHER_KEY,
      JSON.stringify(freshTeachers)
    );

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(freshTimetable)
    );

    localStorage.setItem(
      URGENT_KEY,
      JSON.stringify({})
    );

    showNotice("All timetable data reset");
  };

  return (
    <div className="timetable-page">
      {notice && (
        <div className="tt-toast">
          {notice}
        </div>
      )}

      {/* ================= HEADER ================= */}

      <header className="tt-header no-print">
        <div>
          <div className="tt-small-title">
            MPSA SCHOOL MANAGEMENT
          </div>

          <h1>School Timetable</h1>

          <p>
            Mix Timetable • Class Timetable • Teacher Data •
            Urgement Management
          </p>
        </div>

        <div className="tt-header-actions">
          <button
            className="tt-btn tt-btn-primary"
            onClick={() => handlePrint("mix")}
          >
            🖨 Print
          </button>

          <button
            className="tt-btn tt-btn-danger"
            onClick={resetAllData}
          >
            Reset
          </button>
        </div>
      </header>

      {/* ================= TABS ================= */}

      <div className="tt-tabs no-print">
        <button
          className={activeTab === "mix" ? "active" : ""}
          onClick={() => setActiveTab("mix")}
        >
          📋 Mix Timetable
        </button>

        <button
          className={
            activeTab === "class" ? "active" : ""
          }
          onClick={() => setActiveTab("class")}
        >
          🏫 Class Timetable
        </button>

        <button
          className={
            activeTab === "urgent" ? "active" : ""
          }
          onClick={() => setActiveTab("urgent")}
        >
          🚨 Urgement
        </button>

        <button
          className={
            activeTab === "teachers" ? "active" : ""
          }
          onClick={() => setActiveTab("teachers")}
        >
          👨‍🏫 Teacher Data
        </button>

        <button
          className={
            activeTab === "conflicts" ? "active" : ""
          }
          onClick={() => setActiveTab("conflicts")}
        >
          ⚠ Teacher Conflicts
          {conflicts.length > 0 && (
            <span className="tt-tab-count">
              {conflicts.length}
            </span>
          )}
        </button>
      </div>

      {/* ================= MIX TIMETABLE ================= */}

      {activeTab === "mix" && (
        <section className="tt-section mix-section">
          <div className="tt-section-heading no-print">
            <div>
              <h2>Mix Timetable</h2>
              <p>
                Ek period ke andar sabhi classes,
                teacher aur subject.
              </p>
            </div>

            <div className="tt-inline-actions">
              <input
                className="tt-search"
                placeholder="Search class..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />

              <button
                className="tt-btn tt-btn-primary"
                onClick={() => handlePrint("mix")}
              >
                Print Mix
              </button>
            </div>
          </div>

          <div className="tt-table-wrap">
            <table className="tt-table mix-table">
              <thead>
                <tr>
                  <th className="period-col">
                    Period
                  </th>

                  <th className="time-col">
                    Time
                  </th>

                  {classRows.map((className) => (
                    <th key={className}>
                      {className}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {PERIODS.map((period) => (
                  <tr key={period.id}>
                    <td className="period-cell">
                      <strong>{period.label}</strong>
                    </td>

                    <td className="time-cell">
                      {period.time}
                    </td>

                    {classRows.map((className) => {
                      const item =
                        timetable[
                          makeKey(
                            className,
                            period.id
                          )
                        ];

                      const isEditing =
                        editingCell ===
                        makeKey(
                          className,
                          period.id
                        );

                      return (
                        <td
                          key={className}
                          className={`mix-data-cell ${
                            conflicts.some(
                              (conflict) =>
                                conflict.period ===
                                  period.id &&
                                conflict.teacher ===
                                  item?.teacher
                            )
                              ? "has-conflict"
                              : ""
                          }`}
                        >
                          {isEditing ? (
                            <div className="cell-editor">
                              <select
                                value={
                                  editDraft.subject
                                }
                                onChange={(e) =>
                                  setEditDraft(
                                    (previous) => ({
                                      ...previous,
                                      subject:
                                        e.target.value,
                                    })
                                  )
                                }
                              >
                                <option value="">
                                  Select Subject
                                </option>

                                {allSubjects.map(
                                  (subject) => (
                                    <option
                                      key={subject}
                                      value={subject}
                                    >
                                      {subject}
                                    </option>
                                  )
                                )}

                                <option value="__custom__">
                                  + Custom Subject
                                </option>
                              </select>

                              {editDraft.subject ===
                                "__custom__" && (
                                <input
                                  autoFocus
                                  placeholder="Write subject"
                                  onChange={(e) =>
                                    setEditDraft(
                                      (
                                        previous
                                      ) => ({
                                        ...previous,
                                        subject:
                                          e.target.value,
                                      })
                                    )
                                  }
                                />
                              )}

                              <input
                                list="teacher-list"
                                value={
                                  editDraft.teacher
                                }
                                placeholder="Search teacher..."
                                onChange={(e) =>
                                  setEditDraft(
                                    (previous) => ({
                                      ...previous,
                                      teacher:
                                        e.target.value,
                                    })
                                  )
                                }
                              />

                              <datalist id="teacher-list">
                                {teacherNames.map(
                                  (name) => (
                                    <option
                                      key={name}
                                      value={name}
                                    />
                                  )
                                )}
                              </datalist>

                              <div className="cell-editor-actions">
                                <button
                                  className="save-mini"
                                  onClick={
                                    saveCellEdit
                                  }
                                >
                                  Save
                                </button>

                                <button
                                  className="cancel-mini"
                                  onClick={
                                    cancelCellEdit
                                  }
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              className="mix-card"
                              onClick={() =>
                                openCellEdit(item)
                              }
                            >
                              <span className="mix-subject">
                                {item?.subject ||
                                  "FREE"}
                              </span>

                              <span className="mix-teacher">
                                {item?.teacher ||
                                  "-"}
                              </span>

                              <span className="mix-edit">
                                Edit
                              </span>
                            </button>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="tt-print-signature print-only">
            <div>
              Principal / Head
            </div>
            <div>
              Timetable Incharge
            </div>
          </div>
        </section>
      )}

      {/* ================= CLASS TIMETABLE ================= */}

      {activeTab === "class" && (
        <section className="tt-section">
          <div className="tt-section-heading no-print">
            <div>
              <h2>Class Timetable</h2>
              <p>
                Selected class ka complete timetable.
              </p>
            </div>

            <div className="tt-inline-actions">
              <select
                className="tt-select"
                value={selectedClass}
                onChange={(e) =>
                  setSelectedClass(e.target.value)
                }
              >
                {CLASSES.map((item) => (
                  <option
                    key={item}
                    value={item}
                  >
                    {item}
                  </option>
                ))}
              </select>

              <button
                className="tt-btn tt-btn-primary"
                onClick={() => handlePrint("class")}
              >
                Print Class
              </button>
            </div>
          </div>

          <div className="class-title print-only">
            {selectedClass} - Timetable
          </div>

          <div className="tt-table-wrap">
            <table className="tt-table class-table">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Time</th>
                  <th>Subject</th>
                  <th>Teacher</th>
                  <th className="no-print">
                    Edit
                  </th>
                </tr>
              </thead>

              <tbody>
                {PERIODS.map((period) => {
                  const item =
                    timetable[
                      makeKey(
                        selectedClass,
                        period.id
                      )
                    ];

                  const isEditing =
                    editingCell ===
                    makeKey(
                      selectedClass,
                      period.id
                    );

                  return (
                    <tr key={period.id}>
                      <td>
                        <strong>
                          {period.label}
                        </strong>
                      </td>

                      <td>{period.time}</td>

                      {isEditing ? (
                        <>
                          <td>
                            <select
                              className="tt-full-input"
                              value={
                                editDraft.subject
                              }
                              onChange={(e) =>
                                setEditDraft(
                                  (previous) => ({
                                    ...previous,
                                    subject:
                                      e.target
                                        .value,
                                  })
                                )
                              }
                            >
                              <option value="">
                                Select Subject
                              </option>

                              {allSubjects.map(
                                (subject) => (
                                  <option
                                    key={subject}
                                    value={
                                      subject
                                    }
                                  >
                                    {subject}
                                  </option>
                                )
                              )}

                              <option value="__custom__">
                                + Custom Subject
                              </option>
                            </select>

                            {editDraft.subject ===
                              "__custom__" && (
                              <input
                                className="tt-full-input"
                                placeholder="Custom subject"
                                onChange={(e) =>
                                  setEditDraft(
                                    (
                                      previous
                                    ) => ({
                                      ...previous,
                                      subject:
                                        e.target
                                          .value,
                                    })
                                  )
                                }
                              />
                            )}
                          </td>

                          <td>
                            <input
                              className="tt-full-input"
                              list="class-teachers"
                              value={
                                editDraft.teacher
                              }
                              placeholder="Search teacher..."
                              onChange={(e) =>
                                setEditDraft(
                                  (previous) => ({
                                    ...previous,
                                    teacher:
                                      e.target
                                        .value,
                                  })
                                )
                              }
                            />

                            <datalist id="class-teachers">
                              {teacherNames.map(
                                (name) => (
                                  <option
                                    key={name}
                                    value={name}
                                  />
                                )
                              )}
                            </datalist>
                          </td>

                          <td className="no-print">
                            <div className="edit-actions">
                              <button
                                className="save-mini"
                                onClick={
                                  saveCellEdit
                                }
                              >
                                Save
                              </button>

                              <button
                                className="cancel-mini"
                                onClick={
                                  cancelCellEdit
                                }
                              >
                                Cancel
                              </button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td>
                            <span className="subject-pill">
                              {item?.subject ||
                                "FREE"}
                            </span>
                          </td>

                          <td>
                            <span className="teacher-pill">
                              {item?.teacher ||
                                "-"}
                            </span>
                          </td>

                          <td className="no-print">
                            <button
                              className="edit-btn"
                              onClick={() =>
                                openCellEdit(
                                  item
                                )
                              }
                            >
                              ✏ Edit
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ================= URGEMENT ================= */}

      {activeTab === "urgent" && (
        <section className="tt-section">
          <div className="tt-section-heading no-print">
            <div>
              <h2>Urgement Management</h2>
              <p>
                Absent teacher ke periods ko free
                teachers se automatically adjust karo.
              </p>
            </div>
          </div>

          <div className="urgent-control-card no-print">
            <div className="form-group">
              <label>
                Urgement Date
              </label>

              <input
                type="date"
                value={urgentDate}
                onChange={(e) =>
                  setUrgentDate(e.target.value)
                }
              />
            </div>

            <div className="form-group manual-field">
              <label>
                Manual Teacher
              </label>

              <input
                list="manual-teacher-list"
                value={manualTeacher}
                onChange={(e) =>
                  setManualTeacher(e.target.value)
                }
                placeholder="Teacher name..."
              />

              <datalist id="manual-teacher-list">
                {teacherNames.map((name) => (
                  <option
                    key={name}
                    value={name}
                  />
                ))}
              </datalist>

              <small>
                Agar koi teacher free na mile to
                manual teacher ka naam yahan likho.
              </small>
            </div>

            <div className="form-group signature-field">
              <label>
                Signature
              </label>

              <input
                value={signature}
                onChange={(e) =>
                  setSignature(e.target.value)
                }
                placeholder="Signature / Incharge"
              />
            </div>
          </div>

          <div className="absent-card no-print">
            <div className="absent-card-header">
              <div>
                <h3>
                  Absent Teachers
                </h3>

                <p>
                  Jinke periods aaj urgentment me
                  adjust karne hain.
                </p>
              </div>

              <span className="selected-count">
                {absentTeachers.length} Selected
              </span>
            </div>

            <div className="teacher-checkbox-grid">
              {filteredTeachers.map((teacher) => (
                <label
                  key={teacher.id}
                  className={`teacher-check ${
                    absentTeachers.includes(
                      teacher.name
                    )
                      ? "selected"
                      : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={absentTeachers.includes(
                      teacher.name
                    )}
                    onChange={() =>
                      toggleAbsentTeacher(
                        teacher.name
                      )
                    }
                  />

                  <span>
                    {teacher.name}
                  </span>

                  <small>
                    {teacher.section}
                  </small>
                </label>
              ))}
            </div>

            <div className="urgent-buttons">
              <button
                className="tt-btn tt-btn-primary"
                onClick={generateUrgement}
              >
                ⚡ Generate Urgement
              </button>

              <button
                className="tt-btn tt-btn-success"
                onClick={
                  applyUrgementToTimetable
                }
              >
                ✓ Apply To Timetable
              </button>

              <button
                className="tt-btn tt-btn-danger"
                onClick={clearUrgement}
              >
                Clear
              </button>

              <button
                className="tt-btn"
                onClick={() =>
                  handlePrint("urgent")
                }
              >
                🖨 Print Urgement
              </button>
            </div>
          </div>

          <div className="urgent-print-heading print-only">
            <h1>MPSA SCHOOL</h1>
            <h2>Teacher Urgement</h2>
            <p>
              Date: {urgentDate}
            </p>
          </div>

          <div className="urgent-table-wrap">
            <table className="tt-table urgent-table">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Time</th>
                  <th>Absent Teacher</th>
                  <th>Class</th>
                  <th>Subject</th>
                  <th>Adjust Teacher</th>
                  <th>Status</th>
                  <th>Signature</th>
                </tr>
              </thead>

              <tbody>
                {getUrgementForDate(urgentDate).length ===
                0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="empty-cell"
                    >
                      No urgentment generated for
                      this date.
                    </td>
                  </tr>
                ) : (
                  getUrgementForDate(
                    urgentDate
                  ).map((item) => {
                    const period = PERIODS.find(
                      (p) =>
                        p.id === item.period
                    );

                    return (
                      <tr key={item.id}>
                        <td>
                          <strong>
                            {period?.label}
                          </strong>
                        </td>

                        <td>
                          {period?.time}
                        </td>

                        <td>
                          <span className="absent-name">
                            {item.absentTeacher}
                          </span>
                        </td>

                        <td>
                          <strong>
                            {item.className}
                          </strong>
                        </td>

                        <td>
                          {item.subject}
                        </td>

                        <td>
                          <select
                            className="urgent-teacher-select"
                            value={
                              item.adjustTeacher
                            }
                            onChange={(e) =>
                              changeUrgementTeacher(
                                urgentDate,
                                item,
                                e.target.value
                              )
                            }
                          >
                            <option value="">
                              - FREE -
                            </option>

                            {teachers
                              .filter(
                                (teacher) =>
                                  !absentTeachers.includes(
                                    teacher.name
                                  )
                              )
                              .map(
                                (teacher) => {
                                  const busy =
                                    isTeacherBusy(
                                      teacher.name,
                                      item.period,
                                      null
                                    );

                                  const duplicate =
                                    getUrgementForDate(
                                      urgentDate
                                    ).some(
                                      (other) =>
                                        other.id !==
                                          item.id &&
                                        other.period ===
                                          item.period &&
                                        other.adjustTeacher ===
                                          teacher.name
                                    );

                                  return (
                                    <option
                                      key={
                                        teacher.id
                                      }
                                      value={
                                        teacher.name
                                      }
                                      disabled={
                                        busy ||
                                        duplicate
                                      }
                                    >
                                      {teacher.name}
                                      {busy
                                        ? " (Busy)"
                                        : duplicate
                                        ? " (Used)"
                                        : ""}
                                    </option>
                                  );
                                }
                              )}

                            {manualTeacher &&
                              !teachers.some(
                                (teacher) =>
                                  teacher.name ===
                                  manualTeacher
                              ) && (
                                <option
                                  value={
                                    manualTeacher
                                  }
                                >
                                  {manualTeacher}{" "}
                                  (Manual)
                                </option>
                              )}
                          </select>
                        </td>

                        <td>
                          <span
                            className={`status-pill ${
                              item.status ===
                              "Adjusted"
                                ? "adjusted"
                                : "free"
                            }`}
                          >
                            {item.status ===
                            "Adjusted"
                              ? "✓ Adjusted"
                              : "FREE"}
                          </span>
                        </td>

                        <td>
                          <input
                            className="signature-input"
                            value={
                              item.signature ||
                              signature ||
                              ""
                            }
                            onChange={(e) =>
                              updateUrgementItem(
                                urgentDate,
                                item.id,
                                "signature",
                                e.target.value
                              )
                            }
                            placeholder="Sign"
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="print-signature-area print-only">
            <div>
              <span>Teacher Signature</span>
              <strong>
                {signature}
              </strong>
            </div>

            <div>
              <span>Principal / Head</span>
              <strong>
                __________________
              </strong>
            </div>
          </div>
        </section>
      )}

      {/* ================= TEACHER DATA ================= */}

      {activeTab === "teachers" && (
        <section className="tt-section">
          <div className="tt-section-heading no-print">
            <div>
              <h2>Teacher Data</h2>
              <p>
                Yahin se teacher ka data direct edit
                kar sakte ho.
              </p>
            </div>

            <div className="tt-inline-actions">
              <input
                className="tt-search"
                value={teacherSearch}
                onChange={(e) =>
                  setTeacherSearch(
                    e.target.value
                  )
                }
                placeholder="Search teacher / subject..."
              />

              <button
                className="tt-btn tt-btn-primary"
                onClick={() =>
                  setShowTeacherModal(true)
                }
              >
                + New Teacher
              </button>
            </div>
          </div>

          <div className="teacher-stat-row no-print">
            <div className="stat-card">
              <span>
                Total Teachers
              </span>
              <strong>
                {teachers.length}
              </strong>
            </div>

            <div className="stat-card">
              <span>
                Timetable Entries
              </span>
              <strong>
                {Object.keys(timetable).length}
              </strong>
            </div>

            <div className="stat-card">
              <span>
                Conflicts
              </span>
              <strong
                className={
                  conflicts.length
                    ? "danger-text"
                    : "success-text"
                }
              >
                {conflicts.length}
              </strong>
            </div>
          </div>

          <div className="teacher-grid">
            {filteredTeachers.map((teacher) => {
              const stats =
                teacherStats.find(
                  (item) =>
                    item.id === teacher.id
                );

              return (
                <article
                  className="teacher-card"
                  key={teacher.id}
                >
                  <div className="teacher-card-top">
                    <div className="teacher-avatar">
                      {teacher.name
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="teacher-main">
                      <input
                        className="teacher-name-input"
                        value={teacher.name}
                        onChange={(e) =>
                          updateTeacher(
                            teacher.id,
                            "name",
                            e.target.value
                          )
                        }
                      />

                      <select
                        value={teacher.section}
                        onChange={(e) =>
                          updateTeacher(
                            teacher.id,
                            "section",
                            e.target.value
                          )
                        }
                      >
                        <option value="PG-6">
                          PG - 6
                        </option>

                        <option value="7-8">
                          7 - 8
                        </option>

                        <option value="9-12">
                          9 - 12
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="teacher-stats">
                    <div>
                      <strong>
                        {stats?.total || 0}
                      </strong>
                      <span>
                        Periods
                      </span>
                    </div>

                    <div>
                      <strong>
                        {stats?.free || 0}
                      </strong>
                      <span>
                        Free
                      </span>
                    </div>

                    <div>
                      <strong
                        className={
                          stats?.conflictCount
                            ? "danger-text"
                            : "success-text"
                        }
                      >
                        {stats?.conflictCount ||
                          0}
                      </strong>
                      <span>
                        Conflict
                      </span>
                    </div>
                  </div>

                  <div className="teacher-subjects">
                    <div className="subject-title">
                      Subjects
                    </div>

                    <div className="subject-list">
                      {teacher.subjects.map(
                        (subject) => (
                          <span
                            className="teacher-subject-tag"
                            key={subject}
                          >
                            {subject}

                            <button
                              onClick={() =>
                                removeTeacherSubject(
                                  teacher.id,
                                  subject
                                )
                              }
                            >
                              ×
                            </button>
                          </span>
                        )
                      )}

                      <button
                        className="add-subject-button"
                        onClick={() =>
                          addTeacherSubject(
                            teacher.id
                          )
                        }
                      >
                        + Add
                      </button>
                    </div>
                  </div>

                  <div className="teacher-assignment-box">
                    <div className="assignment-title">
                      Assigned Classes
                    </div>

                    {stats?.assignments
                      ?.length ? (
                      <div className="assignment-list">
                        {stats.assignments.map(
                          (assignment, index) => (
                            <button
                              className="assignment-item"
                              key={`${assignment.className}-${assignment.period}-${index}`}
                              onClick={() => {
                                setSelectedClass(
                                  assignment.className
                                );
                                setActiveTab(
                                  "class"
                                );
                              }}
                            >
                              <span>
                                P
                                {
                                  assignment.period
                                }
                              </span>

                              <strong>
                                {
                                  assignment.className
                                }
                              </strong>

                              <small>
                                {
                                  assignment.subject
                                }
                              </small>
                            </button>
                          )
                        )}
                      </div>
                    ) : (
                      <div className="no-assignment">
                        No period assigned
                      </div>
                    )}
                  </div>

                  <div className="teacher-card-actions no-print">
                    <button
                      className="tt-btn tt-btn-light"
                      onClick={() => {
                        setSelectedTeacher(
                          teacher
                        );
                        setShowTeacherModal(
                          true
                        );
                      }}
                    >
                      ✏ Edit
                    </button>

                    <button
                      className="tt-btn tt-btn-danger"
                      onClick={() =>
                        deleteTeacher(
                          teacher.name
                        )
                      }
                    >
                      Delete
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* ================= CONFLICTS ================= */}

      {activeTab === "conflicts" && (
        <section className="tt-section">
          <div className="tt-section-heading no-print">
            <div>
              <h2>
                Teacher Conflict Check
              </h2>

              <p>
                Ek teacher ko same period me
                multiple classes me lagaya gaya hai
                ya nahi.
              </p>
            </div>

            <div>
              <span
                className={`big-conflict-badge ${
                  conflicts.length
                    ? "danger"
                    : "success"
                }`}
              >
                {conflicts.length} Conflict
              </span>
            </div>
          </div>

          {conflicts.length === 0 ? (
            <div className="no-conflict-box">
              <div className="no-conflict-icon">
                ✓
              </div>

              <h2>
                No Teacher Conflict
              </h2>

              <p>
                Kisi bhi teacher ko same period me
                multiple classes me assign nahi kiya
                gaya hai.
              </p>
            </div>
          ) : (
            <div className="conflict-list">
              {conflicts.map(
                (conflict, index) => (
                  <div
                    className="conflict-card"
                    key={`${conflict.teacher}-${conflict.period}-${index}`}
                  >
                    <div className="conflict-head">
                      <div>
                        <strong>
                          {conflict.teacher}
                        </strong>

                        <span>
                          {conflict.period
                            ? `P${conflict.period}`
                            : ""}
                          {" - "}
                          {conflict.time}
                        </span>
                      </div>

                      <span className="conflict-number">
                        {conflict.classes.length}{" "}
                        classes
                      </span>
                    </div>

                    <div className="conflict-classes">
                      {conflict.classes.map(
                        (className) => (
                          <button
                            key={className}
                            onClick={() => {
                              setSelectedClass(
                                className
                              );
                              setActiveTab(
                                "class"
                              );
                            }}
                          >
                            {className}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          <div className="conflict-help">
            <h3>
              Conflict automatically avoid kaise
              hoga?
            </h3>

            <p>
              Timetable edit karte waqt teacher
              dropdown me same period me already
              busy teacher disabled rahega.
              Urgement me bhi busy teacher select
              nahi kiya ja sakta.
            </p>
          </div>
        </section>
      )}

      {/* ================= NEW TEACHER MODAL ================= */}

      {showTeacherModal && (
        <div
          className="tt-modal-overlay no-print"
          onClick={() =>
            setShowTeacherModal(false)
          }
        >
          <div
            className="tt-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="modal-header">
              <div>
                <h2>
                  {selectedTeacher
                    ? "Edit Teacher"
                    : "Add New Teacher"}
                </h2>

                <p>
                  Teacher ka data update karo.
                </p>
              </div>

              <button
                className="modal-close"
                onClick={() => {
                  setShowTeacherModal(false);
                  setSelectedTeacher(null);
                }}
              >
                ×
              </button>
            </div>

            {selectedTeacher ? (
              <div className="modal-form">
                <label>
                  Teacher Name

                  <input
                    value={selectedTeacher.name}
                    onChange={(e) => {
                      const oldName =
                        selectedTeacher.name;

                      const newName =
                        e.target.value;

                      updateTeacher(
                        selectedTeacher.id,
                        "name",
                        newName
                      );

                      /*
                        Teacher name main timetable me
                        bhi automatically update.
                      */
                      setTimetable(
                        (previous) => {
                          const next = {
                            ...previous,
                          };

                          Object.keys(next).forEach(
                            (key) => {
                              if (
                                next[key]
                                  .teacher ===
                                oldName
                              ) {
                                next[key] = {
                                  ...next[key],
                                  teacher:
                                    newName,
                                };
                              }
                            }
                          );

                          return next;
                        }
                      );

                      setSelectedTeacher({
                        ...selectedTeacher,
                        name: newName,
                      });
                    }}
                  />
                </label>

                <label>
                  Section

                  <select
                    value={
                      selectedTeacher.section
                    }
                    onChange={(e) => {
                      updateTeacher(
                        selectedTeacher.id,
                        "section",
                        e.target.value
                      );

                      setSelectedTeacher({
                        ...selectedTeacher,
                        section:
                          e.target.value,
                      });
                    }}
                  >
                    <option value="PG-6">
                      PG - 6
                    </option>

                    <option value="7-8">
                      7 - 8
                    </option>

                    <option value="9-12">
                      9 - 12
                    </option>
                  </select>
                </label>

                <div>
                  <label>
                    Subjects
                  </label>

                  <div className="modal-subjects">
                    {selectedTeacher.subjects.map(
                      (subject) => (
                        <button
                          key={subject}
                          onClick={() => {
                            removeTeacherSubject(
                              selectedTeacher.id,
                              subject
                            );

                            setSelectedTeacher(
                              (previous) => ({
                                ...previous,
                                subjects:
                                  previous.subjects.filter(
                                    (item) =>
                                      item !==
                                      subject
                                  ),
                              })
                            );
                          }}
                        >
                          {subject} ×
                        </button>
                      )
                    )}
                  </div>

                  <button
                    className="add-full-subject"
                    onClick={() =>
                      addTeacherSubject(
                        selectedTeacher.id
                      )
                    }
                  >
                    + Add Subject
                  </button>
                </div>

                <div className="modal-footer">
                  <button
                    className="tt-btn tt-btn-primary"
                    onClick={() => {
                      setShowTeacherModal(
                        false
                      );
                      setSelectedTeacher(
                        null
                      );
                    }}
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ) : (
              <div className="modal-form">
                <label>
                  Teacher Name

                  <input
                    autoFocus
                    value={newTeacher.name}
                    onChange={(e) =>
                      setNewTeacher(
                        (previous) => ({
                          ...previous,
                          name: e.target.value,
                        })
                      )
                    }
                    placeholder="Enter teacher name"
                  />
                </label>

                <label>
                  Section

                  <select
                    value={newTeacher.section}
                    onChange={(e) =>
                      setNewTeacher(
                        (previous) => ({
                          ...previous,
                          section:
                            e.target.value,
                        })
                      )
                    }
                  >
                    <option value="PG-6">
                      PG - 6
                    </option>

                    <option value="7-8">
                      7 - 8
                    </option>

                    <option value="9-12">
                      9 - 12
                    </option>
                  </select>
                </label>

                <label>
                  First Subject

                  <select
                    value={
                      newTeacher.subjects[0] ||
                      ""
                    }
                    onChange={(e) =>
                      setNewTeacher(
                        (previous) => ({
                          ...previous,
                          subjects: [
                            e.target.value,
                          ],
                        })
                      )
                    }
                  >
                    <option value="">
                      Select Subject
                    </option>

                    {allSubjects.map(
                      (subject) => (
                        <option
                          key={subject}
                          value={subject}
                        >
                          {subject}
                        </option>
                      )
                    )}
                  </select>
                </label>

                <div className="modal-footer">
                  <button
                    className="tt-btn"
                    onClick={() => {
                      setShowTeacherModal(
                        false
                      );
                      setNewTeacher({
                        name: "",
                        section: "PG-6",
                        subjects: [
                          "English",
                        ],
                      });
                    }}
                  >
                    Cancel
                  </button>

                  <button
                    className="tt-btn tt-btn-primary"
                    onClick={addTeacher}
                  >
                    + Add Teacher
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= PRINT AREA ================= */}

      <div className="print-only dedicated-print">
        {printMode === "mix" && (
          <>
            <div className="print-school-header">
              <h1>
                MAHARANA PRATAP SCIENCE
                ACADEMY INTER COLLEGE
              </h1>

              <h2>
                MIX CLASS TIMETABLE
              </h2>
            </div>

            <table className="print-table">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Time</th>

                  {CLASSES.map((className) => (
                    <th key={className}>
                      {className}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {PERIODS.map((period) => (
                  <tr key={period.id}>
                    <td>
                      {period.label}
                    </td>

                    <td>
                      {period.time}
                    </td>

                    {CLASSES.map(
                      (className) => {
                        const item =
                          timetable[
                            makeKey(
                              className,
                              period.id
                            )
                          ];

                        return (
                          <td
                            key={className}
                          >
                            <strong>
                              {item?.subject ||
                                "-"}
                            </strong>

                            <br />

                            <span>
                              {item?.teacher ||
                                "-"}
                            </span>
                          </td>
                        );
                      }
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        {printMode === "class" && (
          <>
            <div className="print-school-header">
              <h1>
                MAHARANA PRATAP SCIENCE
                ACADEMY INTER COLLEGE
              </h1>

              <h2>
                {selectedClass} TIMETABLE
              </h2>
            </div>

            <table className="print-table class-print">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Time</th>
                  <th>Subject</th>
                  <th>Teacher</th>
                </tr>
              </thead>

              <tbody>
                {PERIODS.map((period) => {
                  const item =
                    timetable[
                      makeKey(
                        selectedClass,
                        period.id
                      )
                    ];

                  return (
                    <tr key={period.id}>
                      <td>
                        {period.label}
                      </td>

                      <td>
                        {period.time}
                      </td>

                      <td>
                        {item?.subject || "-"}
                      </td>

                      <td>
                        {item?.teacher || "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}

        {printMode === "urgent" && (
          <>
            <div className="print-school-header">
              <h1>
                MAHARANA PRATAP SCIENCE
                ACADEMY INTER COLLEGE
              </h1>

              <h2>
                TEACHER URGEMENT
              </h2>

              <p>
                Date: {urgentDate}
              </p>
            </div>

            <table className="print-table">
              <thead>
                <tr>
                  <th>Period</th>
                  <th>Time</th>
                  <th>Absent Teacher</th>
                  <th>Class</th>
                  <th>Subject</th>
                  <th>Adjust Teacher</th>
                </tr>
              </thead>

              <tbody>
                {getUrgementForDate(
                  urgentDate
                ).map((item) => {
                  const period =
                    PERIODS.find(
                      (p) =>
                        p.id === item.period
                    );

                  return (
                    <tr key={item.id}>
                      <td>
                        {period?.label}
                      </td>

                      <td>
                        {period?.time}
                      </td>

                      <td>
                        {item.absentTeacher}
                      </td>

                      <td>
                        {item.className}
                      </td>

                      <td>
                        {item.subject}
                      </td>

                      <td>
                        {item.adjustTeacher ||
                          "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="print-signatures">
              <div>
                <span>
                  Urgement Incharge
                </span>
                <strong>
                  __________________
                </strong>
              </div>

              <div>
                <span>
                  Principal / Head
                </span>
                <strong>
                  __________________
                </strong>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}