import React, { useState } from "react";
import "../Style/Subjects.css";

function Subjects() {
  const [subjects, setSubjects] = useState([
    {
      id: 1,
      name: "English",
      code: "ENG101",
      className: "Class 1",
      type: "Compulsory",
      teacher: "Mrs. Neha Sharma",
      periods: 6,
      status: "Active",
    },
    {
      id: 2,
      name: "Hindi",
      code: "HIN101",
      className: "Class 1",
      type: "Compulsory",
      teacher: "Mrs. Pooja Singh",
      periods: 5,
      status: "Active",
    },
    {
      id: 3,
      name: "Mathematics",
      code: "MAT101",
      className: "Class 1",
      type: "Compulsory",
      teacher: "Mr. Rahul Kumar",
      periods: 7,
      status: "Active",
    },
    {
      id: 4,
      name: "EVS",
      code: "EVS101",
      className: "Class 2",
      type: "Compulsory",
      teacher: "Mrs. Anjali Gupta",
      periods: 5,
      status: "Active",
    },
    {
      id: 5,
      name: "Science",
      code: "SCI601",
      className: "Class 6",
      type: "Compulsory",
      teacher: "Mr. Amit Singh",
      periods: 6,
      status: "Active",
    },
    {
      id: 6,
      name: "Social Science",
      code: "SST601",
      className: "Class 6",
      type: "Compulsory",
      teacher: "Mrs. Kavita Sharma",
      periods: 5,
      status: "Active",
    },
    {
      id: 7,
      name: "Computer",
      code: "COM601",
      className: "Class 6",
      type: "Optional",
      teacher: "Mr. Sandeep Yadav",
      periods: 2,
      status: "Active",
    },
    {
      id: 8,
      name: "Physics",
      code: "PHY111",
      className: "Class 11",
      type: "Compulsory",
      teacher: "Mr. Rajesh Kumar",
      periods: 6,
      status: "Active",
    },
    {
      id: 9,
      name: "Chemistry",
      code: "CHE111",
      className: "Class 11",
      type: "Compulsory",
      teacher: "Mr. Sanjay Singh",
      periods: 6,
      status: "Active",
    },
    {
      id: 10,
      name: "Mathematics",
      code: "MAT111",
      className: "Class 11",
      type: "Compulsory",
      teacher: "Mr. Deepak Sharma",
      periods: 7,
      status: "Active",
    },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All");

  const emptyForm = {
    name: "",
    code: "",
    className: "",
    type: "Compulsory",
    teacher: "",
    periods: "5",
  };

  const [form, setForm] = useState(emptyForm);

  const totalSubjects = subjects.length;

  const compulsorySubjects = subjects.filter(
    (item) => item.type === "Compulsory"
  ).length;

  const optionalSubjects = subjects.filter(
    (item) => item.type === "Optional"
  ).length;

  const activeSubjects = subjects.filter(
    (item) => item.status === "Active"
  ).length;

  const filteredSubjects = subjects.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.code.toLowerCase().includes(search.toLowerCase()) ||
      item.teacher.toLowerCase().includes(search.toLowerCase());

    const matchesClass =
      classFilter === "All" ||
      item.className === classFilter;

    return matchesSearch && matchesClass;
  });

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (subject) => {
    setEditingId(subject.id);

    setForm({
      name: subject.name,
      code: subject.code,
      className: subject.className,
      type: subject.type,
      teacher: subject.teacher,
      periods: String(subject.periods),
    });

    setShowModal(true);
  };

  const handleSubmit = (e) => {
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

    if (editingId) {
      setSubjects(
        subjects.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: form.name,
                code: form.code,
                className: form.className,
                type: form.type,
                teacher: form.teacher,
                periods: Number(form.periods),
              }
            : item
        )
      );
    } else {
      const newSubject = {
        id: Date.now(),
        name: form.name,
        code: form.code,
        className: form.className,
        type: form.type,
        teacher: form.teacher,
        periods: Number(form.periods),
        status: "Active",
      };

      setSubjects([...subjects, newSubject]);
    }

    setForm(emptyForm);
    setEditingId(null);
    setShowModal(false);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this subject?"
    );

    if (!confirmDelete) return;

    setSubjects(
      subjects.filter((item) => item.id !== id)
    );
  };

  return (
    <div className="subjects-page">

      {/* HEADER */}

      <div className="subjects-header">

        <div>
          <h1>Subjects</h1>

          <p>
            Manage subjects, subject codes, teachers and academic periods
          </p>
        </div>

        <button
          className="add-subject-btn"
          onClick={openAddModal}
        >
          <span>＋</span>
          Add Subject
        </button>

      </div>


      {/* STATISTICS */}

      <div className="subject-stats">

        <div className="subject-stat-card">

          <div className="subject-stat-icon blue">
            📚
          </div>

          <div>
            <span>Total Subjects</span>
            <strong>{totalSubjects}</strong>
          </div>

        </div>


        <div className="subject-stat-card">

          <div className="subject-stat-icon green">
            📖
          </div>

          <div>
            <span>Compulsory</span>
            <strong>{compulsorySubjects}</strong>
          </div>

        </div>


        <div className="subject-stat-card">

          <div className="subject-stat-icon orange">
            ⭐
          </div>

          <div>
            <span>Optional</span>
            <strong>{optionalSubjects}</strong>
          </div>

        </div>


        <div className="subject-stat-card">

          <div className="subject-stat-icon purple">
            ✅
          </div>

          <div>
            <span>Active Subjects</span>
            <strong>{activeSubjects}</strong>
          </div>

        </div>

      </div>


      {/* TABLE */}

      <div className="subjects-table-card">

        <div className="subjects-table-top">

          <div>
            <h2>All Subjects</h2>

            <p>
              Manage subjects for all classes
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
                  setSearch(e.target.value)
                }
              />
            </div>


            <select
              value={classFilter}
              onChange={(e) =>
                setClassFilter(e.target.value)
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
                { length: 12 },
                (_, index) => (
                  <option
                    key={index}
                    value={`Class ${index + 1}`}
                  >
                    Class {index + 1}
                  </option>
                )
              )}
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
                <th>Type</th>
                <th>Teacher</th>
                <th>Periods / Week</th>
                <th>Status</th>
                <th>Action</th>
              </tr>

            </thead>


            <tbody>

              {filteredSubjects.length > 0 ? (

                filteredSubjects.map(
                  (item, index) => (

                    <tr key={item.id}>

                      <td className="subject-number">
                        {String(index + 1).padStart(2, "0")}
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

                        <span
                          className={
                            item.type === "Compulsory"
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
                              .charAt(0)
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
                          ● {item.status}
                        </span>

                      </td>


                      <td>

                        <div className="subject-actions">

                          <button
                            className="subject-edit"
                            title="Edit Subject"
                            onClick={() =>
                              openEditModal(item)
                            }
                          >
                            ✏️
                          </button>


                          <button
                            className="subject-delete"
                            title="Delete Subject"
                            onClick={() =>
                              handleDelete(item.id)
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
                    colSpan="9"
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


      {/* MODAL */}

      {showModal && (

        <div
          className="subject-modal-overlay"
          onClick={() => setShowModal(false)}
        >

          <div
            className="subject-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="subject-modal-header">

              <div>

                <h2>
                  {editingId
                    ? "Edit Subject"
                    : "Add New Subject"}
                </h2>

                <p>
                  Enter subject information below.
                </p>

              </div>


              <button
                className="subject-close"
                onClick={() =>
                  setShowModal(false)
                }
              >
                ×
              </button>

            </div>


            <form onSubmit={handleSubmit}>

              <div className="subject-form-grid">

                <div className="subject-form-group">

                  <label>
                    Subject Name *
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Mathematics"
                    value={form.name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name: e.target.value,
                      })
                    }
                  />

                </div>


                <div className="subject-form-group">

                  <label>
                    Subject Code *
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. MAT101"
                    value={form.code}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        code: e.target.value.toUpperCase(),
                      })
                    }
                  />

                </div>


                <div className="subject-form-group">

                  <label>
                    Class *
                  </label>

                  <select
                    value={form.className}
                    onChange={(e) =>
                      setForm({
                        ...form,
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

                    {Array.from(
                      { length: 12 },
                      (_, index) => (
                        <option
                          key={index}
                          value={`Class ${index + 1}`}
                        >
                          Class {index + 1}
                        </option>
                      )
                    )}

                  </select>

                </div>


                <div className="subject-form-group">

                  <label>
                    Subject Type
                  </label>

                  <select
                    value={form.type}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        type: e.target.value,
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


                <div className="subject-form-group">

                  <label>
                    Teacher *
                  </label>

                  <input
                    type="text"
                    placeholder="Enter teacher name"
                    value={form.teacher}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        teacher: e.target.value,
                      })
                    }
                  />

                </div>


                <div className="subject-form-group">

                  <label>
                    Periods Per Week
                  </label>

                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={form.periods}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        periods: e.target.value,
                      })
                    }
                  />

                </div>

              </div>


              <div className="subject-modal-actions">

                <button
                  type="button"
                  className="subject-cancel"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="subject-save"
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