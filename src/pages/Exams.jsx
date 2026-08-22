import React, { useState } from "react";
import "../Style/Exams.css";

function Exams() {
  const [exams, setExams] = useState([
    {
      id: 1,
      name: "Unit Test 1",
      type: "Unit Test",
      session: "2026-27",
      classes: "Class 1 - 5",
      startDate: "2026-07-10",
      endDate: "2026-07-15",
      status: "Completed",
      description: "First unit assessment for primary classes.",
    },
    {
      id: 2,
      name: "Periodic Test 1",
      type: "Periodic Test",
      session: "2026-27",
      classes: "Class 6 - 8",
      startDate: "2026-07-20",
      endDate: "2026-07-25",
      status: "Completed",
      description: "Periodic assessment for middle classes.",
    },
    {
      id: 3,
      name: "Half Yearly Examination",
      type: "Half Yearly",
      session: "2026-27",
      classes: "Class 1 - 12",
      startDate: "2026-09-15",
      endDate: "2026-09-25",
      status: "Upcoming",
      description: "Half yearly examination for all classes.",
    },
    {
      id: 4,
      name: "Pre Board Examination",
      type: "Pre-Board",
      session: "2026-27",
      classes: "Class 10 - 12",
      startDate: "2027-01-10",
      endDate: "2027-01-20",
      status: "Upcoming",
      description: "Pre-board examination for senior classes.",
    },
    {
      id: 5,
      name: "Annual Examination",
      type: "Annual",
      session: "2026-27",
      classes: "Class 1 - 12",
      startDate: "2027-03-10",
      endDate: "2027-03-25",
      status: "Upcoming",
      description: "Final annual examination.",
    },
  ]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const [editingId, setEditingId] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);

  const emptyForm = {
    name: "",
    type: "Unit Test",
    session: "2026-27",
    classes: "Class 1 - 5",
    startDate: "",
    endDate: "",
    status: "Upcoming",
    description: "",
  };

  const [form, setForm] = useState(emptyForm);

  /* =========================
     STATISTICS
  ========================= */

  const totalExams = exams.length;

  const upcomingExams = exams.filter(
    (exam) => exam.status === "Upcoming"
  ).length;

  const ongoingExams = exams.filter(
    (exam) => exam.status === "Ongoing"
  ).length;

  const completedExams = exams.filter(
    (exam) => exam.status === "Completed"
  ).length;

  /* =========================
     FILTER
  ========================= */

  const filteredExams = exams.filter((exam) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      exam.name.toLowerCase().includes(searchText) ||
      exam.type.toLowerCase().includes(searchText) ||
      exam.session.toLowerCase().includes(searchText) ||
      exam.classes.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" ||
      exam.status === statusFilter;

    const matchesType =
      typeFilter === "All" ||
      exam.type === typeFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesType
    );
  });

  /* =========================
     ADD EXAM
  ========================= */

  const openAddModal = () => {
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  /* =========================
     EDIT EXAM
  ========================= */

  const openEditModal = (exam) => {
    setEditingId(exam.id);

    setForm({
      name: exam.name,
      type: exam.type,
      session: exam.session,
      classes: exam.classes,
      startDate: exam.startDate,
      endDate: exam.endDate,
      status: exam.status,
      description: exam.description,
    });

    setShowModal(true);
  };

  /* =========================
     VIEW EXAM
  ========================= */

  const openViewModal = (exam) => {
    setSelectedExam(exam);
    setShowViewModal(true);
  };

  /* =========================
     SAVE EXAM
  ========================= */

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.name ||
      !form.session ||
      !form.startDate ||
      !form.endDate
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (editingId) {
      setExams(
        exams.map((exam) =>
          exam.id === editingId
            ? {
                ...exam,
                ...form,
              }
            : exam
        )
      );
    } else {
      const newExam = {
        id: Date.now(),
        ...form,
      };

      setExams([...exams, newExam]);
    }

    setForm(emptyForm);
    setEditingId(null);
    setShowModal(false);
  };

  /* =========================
     DELETE EXAM
  ========================= */

  const deleteExam = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this exam?"
    );

    if (!confirmDelete) return;

    setExams(
      exams.filter((exam) => exam.id !== id)
    );
  };

  /* =========================
     STATUS CLASS
  ========================= */

  const getStatusClass = (status) => {
    if (status === "Completed") {
      return "exam-status completed";
    }

    if (status === "Ongoing") {
      return "exam-status ongoing";
    }

    if (status === "Cancelled") {
      return "exam-status cancelled";
    }

    return "exam-status upcoming";
  };

  return (
    <div className="exams-page">

      {/* =========================
          HEADER
      ========================= */}

      <div className="exams-header">

        <div>
          <h1>Exams</h1>

          <p>
            Manage examinations, schedules and academic assessments
          </p>
        </div>

        <button
          className="add-exam-btn"
          onClick={openAddModal}
        >
          <span>＋</span>
          Add Exam
        </button>

      </div>


      {/* =========================
          STATISTICS
      ========================= */}

      <div className="exam-stats">

        <div className="exam-stat-card">

          <div className="exam-stat-icon blue">
            📝
          </div>

          <div>
            <span>Total Exams</span>
            <strong>{totalExams}</strong>
          </div>

        </div>


        <div className="exam-stat-card">

          <div className="exam-stat-icon orange">
            🕐
          </div>

          <div>
            <span>Upcoming</span>
            <strong>{upcomingExams}</strong>
          </div>

        </div>


        <div className="exam-stat-card">

          <div className="exam-stat-icon purple">
            🔄
          </div>

          <div>
            <span>Ongoing</span>
            <strong>{ongoingExams}</strong>
          </div>

        </div>


        <div className="exam-stat-card">

          <div className="exam-stat-icon green">
            ✅
          </div>

          <div>
            <span>Completed</span>
            <strong>{completedExams}</strong>
          </div>

        </div>

      </div>


      {/* =========================
          EXAM TABLE
      ========================= */}

      <div className="exams-table-card">

        <div className="exams-table-top">

          <div>
            <h2>Examination List</h2>

            <p>
              View and manage all school examinations
            </p>
          </div>


          <div className="exam-controls">

            <div className="exam-search">
              🔍

              <input
                type="text"
                placeholder="Search exam..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
              />
            </div>


            <select
              value={typeFilter}
              onChange={(e) =>
                setTypeFilter(e.target.value)
              }
            >

              <option value="All">
                All Types
              </option>

              <option value="Unit Test">
                Unit Test
              </option>

              <option value="Periodic Test">
                Periodic Test
              </option>

              <option value="Half Yearly">
                Half Yearly
              </option>

              <option value="Pre-Board">
                Pre-Board
              </option>

              <option value="Annual">
                Annual
              </option>

              <option value="Practical">
                Practical
              </option>

            </select>


            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >

              <option value="All">
                All Status
              </option>

              <option value="Upcoming">
                Upcoming
              </option>

              <option value="Ongoing">
                Ongoing
              </option>

              <option value="Completed">
                Completed
              </option>

              <option value="Cancelled">
                Cancelled
              </option>

            </select>

          </div>

        </div>


        <div className="exams-table-wrapper">

          <table className="exams-table">

            <thead>

              <tr>

                <th>#</th>
                <th>Exam</th>
                <th>Type</th>
                <th>Session</th>
                <th>Classes</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th>Actions</th>

              </tr>

            </thead>


            <tbody>

              {filteredExams.length > 0 ? (

                filteredExams.map(
                  (exam, index) => (

                    <tr key={exam.id}>

                      <td className="exam-number">
                        {String(index + 1).padStart(2, "0")}
                      </td>


                      <td>

                        <div className="exam-name-cell">

                          <div className="exam-icon">
                            📝
                          </div>

                          <div>

                            <strong>
                              {exam.name}
                            </strong>

                            <small>
                              {exam.description ||
                                "School examination"}
                            </small>

                          </div>

                        </div>

                      </td>


                      <td>
                        <span className="exam-type">
                          {exam.type}
                        </span>
                      </td>


                      <td>
                        <span className="exam-session">
                          {exam.session}
                        </span>
                      </td>


                      <td>
                        <span className="exam-class">
                          {exam.classes}
                        </span>
                      </td>


                      <td>
                        {exam.startDate}
                      </td>


                      <td>
                        {exam.endDate}
                      </td>


                      <td>

                        <span
                          className={getStatusClass(
                            exam.status
                          )}
                        >
                          ● {exam.status}
                        </span>

                      </td>


                      <td>

                        <div className="exam-actions">

                          <button
                            className="exam-view"
                            title="View"
                            onClick={() =>
                              openViewModal(exam)
                            }
                          >
                            👁️
                          </button>


                          <button
                            className="exam-edit"
                            title="Edit"
                            onClick={() =>
                              openEditModal(exam)
                            }
                          >
                            ✏️
                          </button>


                          <button
                            className="exam-delete"
                            title="Delete"
                            onClick={() =>
                              deleteExam(exam.id)
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
                    className="no-exams"
                  >
                    No examinations found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* =========================
          ADD / EDIT MODAL
      ========================= */}

      {showModal && (

        <div
          className="exam-modal-overlay"
          onClick={() =>
            setShowModal(false)
          }
        >

          <div
            className="exam-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="exam-modal-header">

              <div>

                <h2>
                  {editingId
                    ? "Edit Examination"
                    : "Add New Examination"}
                </h2>

                <p>
                  Enter examination information below.
                </p>

              </div>


              <button
                className="exam-close"
                onClick={() =>
                  setShowModal(false)
                }
              >
                ×
              </button>

            </div>


            <form onSubmit={handleSubmit}>

              <div className="exam-form-grid">


                {/* EXAM NAME */}

                <div className="exam-form-group">

                  <label>
                    Exam Name *
                  </label>

                  <input
                    type="text"
                    placeholder="e.g. Half Yearly Examination"
                    value={form.name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name: e.target.value,
                      })
                    }
                  />

                </div>


                {/* EXAM TYPE */}

                <div className="exam-form-group">

                  <label>
                    Exam Type
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

                    <option value="Unit Test">
                      Unit Test
                    </option>

                    <option value="Periodic Test">
                      Periodic Test
                    </option>

                    <option value="Half Yearly">
                      Half Yearly
                    </option>

                    <option value="Pre-Board">
                      Pre-Board
                    </option>

                    <option value="Annual">
                      Annual
                    </option>

                    <option value="Practical">
                      Practical
                    </option>

                    <option value="Other">
                      Other
                    </option>

                  </select>

                </div>


                {/* SESSION */}

                <div className="exam-form-group">

                  <label>
                    Academic Session *
                  </label>

                  <select
                    value={form.session}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        session: e.target.value,
                      })
                    }
                  >

                    <option value="2026-27">
                      2026-27
                    </option>

                    <option value="2027-28">
                      2027-28
                    </option>

                    <option value="2025-26">
                      2025-26
                    </option>

                  </select>

                </div>


                {/* CLASSES */}

                <div className="exam-form-group">

                  <label>
                    Applicable Classes
                  </label>

                  <select
                    value={form.classes}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        classes: e.target.value,
                      })
                    }
                  >

                    <option value="Nursery - UKG">
                      Nursery - UKG
                    </option>

                    <option value="Class 1 - 5">
                      Class 1 - 5
                    </option>

                    <option value="Class 6 - 8">
                      Class 6 - 8
                    </option>

                    <option value="Class 9 - 10">
                      Class 9 - 10
                    </option>

                    <option value="Class 11 - 12">
                      Class 11 - 12
                    </option>

                    <option value="Class 1 - 12">
                      Class 1 - 12
                    </option>

                  </select>

                </div>


                {/* START DATE */}

                <div className="exam-form-group">

                  <label>
                    Start Date *
                  </label>

                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        startDate: e.target.value,
                      })
                    }
                  />

                </div>


                {/* END DATE */}

                <div className="exam-form-group">

                  <label>
                    End Date *
                  </label>

                  <input
                    type="date"
                    value={form.endDate}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        endDate: e.target.value,
                      })
                    }
                  />

                </div>


                {/* STATUS */}

                <div className="exam-form-group">

                  <label>
                    Status
                  </label>

                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value,
                      })
                    }
                  >

                    <option value="Upcoming">
                      Upcoming
                    </option>

                    <option value="Ongoing">
                      Ongoing
                    </option>

                    <option value="Completed">
                      Completed
                    </option>

                    <option value="Cancelled">
                      Cancelled
                    </option>

                  </select>

                </div>


                {/* DESCRIPTION */}

                <div className="exam-form-group full-width">

                  <label>
                    Description
                  </label>

                  <textarea
                    placeholder="Enter exam description..."
                    value={form.description}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        description: e.target.value,
                      })
                    }
                  />

                </div>

              </div>


              <div className="exam-modal-actions">

                <button
                  type="button"
                  className="exam-cancel"
                  onClick={() =>
                    setShowModal(false)
                  }
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="exam-save"
                >
                  {editingId
                    ? "Update Exam"
                    : "Add Exam"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}


      {/* =========================
          VIEW MODAL
      ========================= */}

      {showViewModal && selectedExam && (

        <div
          className="exam-modal-overlay"
          onClick={() =>
            setShowViewModal(false)
          }
        >

          <div
            className="exam-view-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="exam-modal-header">

              <div>

                <h2>
                  {selectedExam.name}
                </h2>

                <p>
                  Examination Details
                </p>

              </div>

              <button
                className="exam-close"
                onClick={() =>
                  setShowViewModal(false)
                }
              >
                ×
              </button>

            </div>


            <div className="exam-details">

              <div className="exam-detail-box">
                <span>Exam Type</span>
                <strong>
                  {selectedExam.type}
                </strong>
              </div>


              <div className="exam-detail-box">
                <span>Academic Session</span>
                <strong>
                  {selectedExam.session}
                </strong>
              </div>


              <div className="exam-detail-box">
                <span>Applicable Classes</span>
                <strong>
                  {selectedExam.classes}
                </strong>
              </div>


              <div className="exam-detail-box">
                <span>Start Date</span>
                <strong>
                  {selectedExam.startDate}
                </strong>
              </div>


              <div className="exam-detail-box">
                <span>End Date</span>
                <strong>
                  {selectedExam.endDate}
                </strong>
              </div>


              <div className="exam-detail-box">
                <span>Status</span>
                <strong>
                  {selectedExam.status}
                </strong>
              </div>

            </div>


            <div className="exam-description-box">

              <h3>
                Description
              </h3>

              <p>
                {selectedExam.description ||
                  "No description available."}
              </p>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default Exams;