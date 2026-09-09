import { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import StatCard, { StatGrid } from "../components/ui/StatCard";
import DataTable from "../components/ui/DataTable";
import StatusBadge from "../components/ui/StatusBadge";
import ActionMenu from "../components/ui/ActionMenu";
import Modal from "../components/ui/Modal";
import "../Style/ui.css";

const INITIAL_HOMEWORK = [
  {
    id: "HW-101",
    title: "Algebra Quadratic Equations Ex 4.2",
    subject: "Mathematics",
    className: "10-A",
    teacher: "Ramesh Sharma",
    assignedDate: "2026-09-05",
    dueDate: "2026-09-10",
    submissions: "32/38",
    status: "Active"
  },
  {
    id: "HW-102",
    title: "Light & Optics Ray Diagram Worksheet",
    subject: "Physics",
    className: "12-A",
    teacher: "Sunita Verma",
    assignedDate: "2026-09-06",
    dueDate: "2026-09-12",
    submissions: "15/40",
    status: "Active"
  },
  {
    id: "HW-103",
    title: "Essay: Climate Change & Renewable Energy",
    subject: "English",
    className: "9-B",
    teacher: "Anil Kapoor",
    assignedDate: "2026-09-01",
    dueDate: "2026-09-06",
    submissions: "35/35",
    status: "Completed"
  }
];

export function Homework() {
  const [homeworkList, setHomeworkList] = useState(INITIAL_HOMEWORK);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subject: "Mathematics",
    className: "10-A",
    teacher: "Ramesh Sharma",
    dueDate: "",
    instructions: ""
  });

  const handleCreate = (e) => {
    e.preventDefault();
    const newHw = {
      id: `HW-${Math.floor(100 + Math.random() * 900)}`,
      title: formData.title,
      subject: formData.subject,
      className: formData.className,
      teacher: formData.teacher,
      assignedDate: new Date().toISOString().split("T")[0],
      dueDate: formData.dueDate || "2026-09-15",
      submissions: "0/35",
      status: "Active"
    };
    setHomeworkList([newHw, ...homeworkList]);
    setIsModalOpen(false);
    setFormData({ title: "", subject: "Mathematics", className: "10-A", teacher: "Ramesh Sharma", dueDate: "", instructions: "" });
  };

  const columns = [
    { header: "Homework Title", accessor: "title", render: (row) => <strong>{row.title}</strong> },
    { header: "Subject", accessor: "subject" },
    { header: "Class", accessor: "className" },
    { header: "Teacher", accessor: "teacher" },
    { header: "Assigned", accessor: "assignedDate" },
    { header: "Due Date", accessor: "dueDate" },
    { header: "Submissions", accessor: "submissions" },
    { header: "Status", accessor: "status", render: (row) => <StatusBadge status={row.status} /> },
    {
      header: "Actions",
      accessor: "actions",
      render: (row) => (
        <ActionMenu
          actions={[
            { label: "View Details", icon: "👁️", onClick: () => alert(`Viewing ${row.title}`) },
            { label: "Submission List", icon: "📥", onClick: () => alert(`Submissions for ${row.title}`) },
            { label: "Delete", icon: "🗑️", danger: true, onClick: () => setHomeworkList(homeworkList.filter((h) => h.id !== row.id)) }
          ]}
        />
      )
    }
  ];

  return (
    <div style={{ padding: "24px" }}>
      <PageHeader
        breadcrumb="Academic"
        title="Homework & Assignments"
        description="Assign, track, and evaluate student homework assignments."
        icon="📖"
        primaryAction={{
          label: "Assign Homework",
          icon: "+",
          onClick: () => setIsModalOpen(true)
        }}
      />

      <StatGrid>
        <StatCard title="Total Assignments" value={homeworkList.length} icon="📚" />
        <StatCard title="Active Assignments" value={homeworkList.filter((h) => h.status === "Active").length} icon="⏳" />
        <StatCard title="Completed" value={homeworkList.filter((h) => h.status === "Completed").length} icon="✅" />
        <StatCard title="Avg Submission Rate" value="88%" icon="📊" />
      </StatGrid>

      <DataTable
        columns={columns}
        data={homeworkList}
        searchPlaceholder="Search homework by title, subject..."
        filters={[
          { key: "subject", label: "Subject", options: [{ value: "Mathematics", label: "Mathematics" }, { value: "Physics", label: "Physics" }, { value: "English", label: "English" }] },
          { key: "status", label: "Status", options: [{ value: "Active", label: "Active" }, { value: "Completed", label: "Completed" }] }
        ]}
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Assign New Homework"
        footer={
          <>
            <button className="ui-btn ui-btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="ui-btn ui-btn-primary" onClick={handleCreate}>Create Assignment</button>
          </>
        }
      >
        <form onSubmit={handleCreate}>
          <div className="ui-form-group">
            <label>Assignment Title *</label>
            <input
              type="text"
              className="ui-form-control"
              placeholder="e.g. Chapter 4 Exercise Problems"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="ui-form-row">
            <div className="ui-form-group">
              <label>Class *</label>
              <select
                className="ui-form-control"
                value={formData.className}
                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
              >
                <option value="9-A">Class 9-A</option>
                <option value="9-B">Class 9-B</option>
                <option value="10-A">Class 10-A</option>
                <option value="12-A">Class 12-A</option>
              </select>
            </div>
            <div className="ui-form-group">
              <label>Subject *</label>
              <select
                className="ui-form-control"
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              >
                <option value="Mathematics">Mathematics</option>
                <option value="Physics">Physics</option>
                <option value="Chemistry">Chemistry</option>
                <option value="English">English</option>
              </select>
            </div>
          </div>

          <div className="ui-form-row">
            <div className="ui-form-group">
              <label>Due Date *</label>
              <input
                type="date"
                className="ui-form-control"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                required
              />
            </div>
            <div className="ui-form-group">
              <label>Assigning Teacher</label>
              <input
                type="text"
                className="ui-form-control"
                value={formData.teacher}
                onChange={(e) => setFormData({ ...formData, teacher: e.target.value })}
              />
            </div>
          </div>

          <div className="ui-form-group">
            <label>Instructions & Description</label>
            <textarea
              className="ui-form-control"
              rows={3}
              placeholder="Detail assignment instructions or reference page numbers..."
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default Homework;