import React, { useState } from "react";
import "../Style/Classes.css";

function Classes() {
  const [classes, setClasses] = useState([
    {
      id: 1,
      className: "Nursery",
      sections: ["A"],
      classTeacher: "Mrs. Priya Sharma",
      students: 28,
      status: "Active",
    },
    {
      id: 2,
      className: "LKG",
      sections: ["A", "B"],
      classTeacher: "Mrs. Neha Verma",
      students: 42,
      status: "Active",
    },
    {
      id: 3,
      className: "UKG",
      sections: ["A", "B"],
      classTeacher: "Mrs. Pooja Singh",
      students: 45,
      status: "Active",
    },
    {
      id: 4,
      className: "Class 1",
      sections: ["A", "B"],
      classTeacher: "Mr. Rahul Kumar",
      students: 51,
      status: "Active",
    },
    {
      id: 5,
      className: "Class 2",
      sections: ["A", "B"],
      classTeacher: "Mrs. Anjali Gupta",
      students: 54,
      status: "Active",
    },
    {
      id: 6,
      className: "Class 3",
      sections: ["A", "B"],
      classTeacher: "Mr. Amit Singh",
      students: 57,
      status: "Active",
    },
    {
      id: 7,
      className: "Class 4",
      sections: ["A", "B"],
      classTeacher: "Mrs. Kavita Sharma",
      students: 59,
      status: "Active",
    },
    {
      id: 8,
      className: "Class 5",
      sections: ["A", "B"],
      classTeacher: "Mr. Sandeep Yadav",
      students: 61,
      status: "Active",
    },
    {
      id: 9,
      className: "Class 6",
      sections: ["A", "B"],
      classTeacher: "Mr. Manoj Kumar",
      students: 64,
      status: "Active",
    },
    {
      id: 10,
      className: "Class 7",
      sections: ["A", "B"],
      classTeacher: "Mrs. Ritu Singh",
      students: 66,
      status: "Active",
    },
    {
      id: 11,
      className: "Class 8",
      sections: ["A", "B"],
      classTeacher: "Mr. Deepak Sharma",
      students: 68,
      status: "Active",
    },
    {
      id: 12,
      className: "Class 9",
      sections: ["A", "B"],
      classTeacher: "Mr. Vikash Singh",
      students: 70,
      status: "Active",
    },
    {
      id: 13,
      className: "Class 10",
      sections: ["A", "B"],
      classTeacher: "Mrs. Shalini Gupta",
      students: 72,
      status: "Active",
    },
    {
      id: 14,
      className: "Class 11",
      sections: ["A", "B"],
      classTeacher: "Mr. Rajesh Kumar",
      students: 65,
      status: "Active",
    },
    {
      id: 15,
      className: "Class 12",
      sections: ["A", "B"],
      classTeacher: "Mr. Sanjay Singh",
      students: 62,
      status: "Active",
    },
  ]);

  const [showModal, setShowModal] = useState(false);

  const [newClass, setNewClass] = useState({
    className: "",
    section: "A",
    classTeacher: "",
  });

  const totalStudents = classes.reduce(
    (total, item) => total + item.students,
    0
  );

  const totalSections = classes.reduce(
    (total, item) => total + item.sections.length,
    0
  );

  const handleAddClass = (e) => {
    e.preventDefault();

    if (!newClass.className || !newClass.classTeacher) {
      alert("Please fill all required fields.");
      return;
    }

    const newItem = {
      id: Date.now(),
      className: newClass.className,
      sections: [newClass.section],
      classTeacher: newClass.classTeacher,
      students: 0,
      status: "Active",
    };

    setClasses([...classes, newItem]);

    setNewClass({
      className: "",
      section: "A",
      classTeacher: "",
    });

    setShowModal(false);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this class?"
    );

    if (confirmDelete) {
      setClasses(classes.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="classes-page">

      {/* TOP HEADER */}

      <div className="classes-header">

        <div>
          <h1>Classes & Sections</h1>

          <p>
            Manage school classes, sections and class teachers
          </p>
        </div>

        <button
          className="add-class-btn"
          onClick={() => setShowModal(true)}
        >
          <span>＋</span>
          Add Class
        </button>

      </div>


      {/* STAT CARDS */}

      <div className="class-stats">

        <div className="class-stat-card">
          <div className="stat-icon blue">
            🏫
          </div>

          <div>
            <span>Total Classes</span>
            <strong>{classes.length}</strong>
          </div>
        </div>


        <div className="class-stat-card">
          <div className="stat-icon purple">
            📚
          </div>

          <div>
            <span>Total Sections</span>
            <strong>{totalSections}</strong>
          </div>
        </div>


        <div className="class-stat-card">
          <div className="stat-icon green">
            👨‍🎓
          </div>

          <div>
            <span>Total Students</span>
            <strong>{totalStudents}</strong>
          </div>
        </div>


        <div className="class-stat-card">
          <div className="stat-icon orange">
            ✅
          </div>

          <div>
            <span>Active Classes</span>
            <strong>
              {classes.filter(
                (item) => item.status === "Active"
              ).length}
            </strong>
          </div>
        </div>

      </div>


      {/* TABLE */}

      <div className="classes-table-card">

        <div className="table-top">

          <div>
            <h2>All Classes</h2>
            <p>Academic session 2026-27</p>
          </div>

          <div className="table-search">
            🔍
            <input
              type="text"
              placeholder="Search class..."
              onChange={(e) => {
                const value = e.target.value.toLowerCase();

                const rows =
                  document.querySelectorAll(
                    ".class-table tbody tr"
                  );

                rows.forEach((row) => {
                  row.style.display = row.innerText
                    .toLowerCase()
                    .includes(value)
                    ? ""
                    : "none";
                });
              }}
            />
          </div>

        </div>


        <div className="table-wrapper">

          <table className="class-table">

            <thead>
              <tr>
                <th>#</th>
                <th>Class</th>
                <th>Sections</th>
                <th>Class Teacher</th>
                <th>Students</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>


            <tbody>

              {classes.map((item, index) => (

                <tr key={item.id}>

                  <td className="serial">
                    {String(index + 1).padStart(2, "0")}
                  </td>


                  <td>
                    <div className="class-name-cell">

                      <div className="small-class-icon">
                        🏫
                      </div>

                      <strong>
                        {item.className}
                      </strong>

                    </div>
                  </td>


                  <td>

                    <div className="section-list">

                      {item.sections.map(
                        (section, sectionIndex) => (

                          <span
                            className="section-badge"
                            key={sectionIndex}
                          >
                            {section}
                          </span>

                        )
                      )}

                    </div>

                  </td>


                  <td>

                    <div className="teacher-cell">

                      <div className="teacher-avatar">
                        {item.classTeacher
                          .charAt(0)
                          .toUpperCase()}
                      </div>

                      <span>
                        {item.classTeacher}
                      </span>

                    </div>

                  </td>


                  <td>
                    <strong className="student-count">
                      {item.students}
                    </strong>
                  </td>


                  <td>
                    <span className="status-active">
                      ● {item.status}
                    </span>
                  </td>


                  <td>

                    <div className="action-buttons">

                      <button
                        className="edit-btn"
                        title="Edit"
                        onClick={() =>
                          alert(
                            `${item.className} edit option`
                          )
                        }
                      >
                        ✏️
                      </button>


                      <button
                        className="delete-btn"
                        title="Delete"
                        onClick={() =>
                          handleDelete(item.id)
                        }
                      >
                        🗑️
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>


      {/* ADD CLASS MODAL */}

      {showModal && (

        <div
          className="modal-overlay"
          onClick={() => setShowModal(false)}
        >

          <div
            className="class-modal"
            onClick={(e) => e.stopPropagation()}
          >

            <div className="modal-header">

              <div>
                <h2>Add New Class</h2>

                <p>
                  Create a new class and assign a teacher.
                </p>
              </div>

              <button
                className="close-modal"
                onClick={() => setShowModal(false)}
              >
                ×
              </button>

            </div>


            <form onSubmit={handleAddClass}>

              <div className="form-group">

                <label>
                  Class Name
                </label>

                <select
                  value={newClass.className}
                  onChange={(e) =>
                    setNewClass({
                      ...newClass,
                      className: e.target.value,
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

                  <option value="Class 1">
                    Class 1
                  </option>

                  <option value="Class 2">
                    Class 2
                  </option>

                  <option value="Class 3">
                    Class 3
                  </option>

                  <option value="Class 4">
                    Class 4
                  </option>

                  <option value="Class 5">
                    Class 5
                  </option>

                  <option value="Class 6">
                    Class 6
                  </option>

                  <option value="Class 7">
                    Class 7
                  </option>

                  <option value="Class 8">
                    Class 8
                  </option>

                  <option value="Class 9">
                    Class 9
                  </option>

                  <option value="Class 10">
                    Class 10
                  </option>

                  <option value="Class 11">
                    Class 11
                  </option>

                  <option value="Class 12">
                    Class 12
                  </option>

                </select>

              </div>


              <div className="form-group">

                <label>
                  Section
                </label>

                <select
                  value={newClass.section}
                  onChange={(e) =>
                    setNewClass({
                      ...newClass,
                      section: e.target.value,
                    })
                  }
                >

                  <option value="A">Section A</option>
                  <option value="B">Section B</option>
                  <option value="C">Section C</option>
                  <option value="D">Section D</option>

                </select>

              </div>


              <div className="form-group">

                <label>
                  Class Teacher
                </label>

                <input
                  type="text"
                  placeholder="Enter teacher name"
                  value={newClass.classTeacher}
                  onChange={(e) =>
                    setNewClass({
                      ...newClass,
                      classTeacher: e.target.value,
                    })
                  }
                />

              </div>


              <div className="modal-actions">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save-class-btn"
                >
                  Add Class
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default Classes;