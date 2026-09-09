import { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import StatCard, { StatGrid } from "../components/ui/StatCard";
import DataTable from "../components/ui/DataTable";
import StatusBadge from "../components/ui/StatusBadge";
import ActionMenu from "../components/ui/ActionMenu";
import Modal from "../components/ui/Modal";
import "../Style/ui.css";

const INITIAL_HEALTH_RECORDS = [
  {
    id: "HLT-101",
    studentName: "Aarav Sharma",
    rollNo: "1001",
    className: "10-A",
    bloodGroup: "O+",
    emergencyContact: "+91 9876543210",
    conditions: "Mild Dust Allergy",
    lastCheckup: "2026-08-10",
    status: "Active"
  },
  {
    id: "HLT-102",
    studentName: "Ananya Patel",
    rollNo: "1004",
    className: "10-A",
    bloodGroup: "B+",
    emergencyContact: "+91 9812345678",
    conditions: "Asthma (Carries Inhaler)",
    lastCheckup: "2026-08-12",
    status: "Requires Attention"
  },
  {
    id: "HLT-103",
    studentName: "Rohan Verma",
    rollNo: "1208",
    className: "12-A",
    bloodGroup: "AB+",
    emergencyContact: "+91 9898989898",
    conditions: "None / Normal",
    lastCheckup: "2026-07-25",
    status: "Active"
  }
];

export function HealthRecords() {
  const [records, setRecords] = useState(INITIAL_HEALTH_RECORDS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const [formData, setFormData] = useState({
    studentName: "",
    rollNo: "",
    className: "10-A",
    bloodGroup: "O+",
    emergencyContact: "",
    conditions: ""
  });

  const handleAddRecord = (e) => {
    e.preventDefault();
    const newRec = {
      id: `HLT-${Math.floor(100 + Math.random() * 900)}`,
      studentName: formData.studentName,
      rollNo: formData.rollNo || "1005",
      className: formData.className,
      bloodGroup: formData.bloodGroup,
      emergencyContact: formData.emergencyContact,
      conditions: formData.conditions || "None / Normal",
      lastCheckup: new Date().toISOString().split("T")[0],
      status: "Active"
    };
    setRecords([newRec, ...records]);
    setIsModalOpen(false);
    setFormData({ studentName: "", rollNo: "", className: "10-A", bloodGroup: "O+", emergencyContact: "", conditions: "" });
  };

  const columns = [
    { header: "Student Name", accessor: "studentName", render: (row) => <strong>{row.studentName}</strong> },
    { header: "Roll No.", accessor: "rollNo" },
    { header: "Class", accessor: "className" },
    { header: "Blood Group", accessor: "bloodGroup", render: (row) => <span className="ui-badge ui-badge-danger">{row.bloodGroup}</span> },
    { header: "Emergency Phone", accessor: "emergencyContact" },
    { header: "Medical Conditions", accessor: "conditions" },
    { header: "Last Checkup", accessor: "lastCheckup" },
    { header: "Health Status", accessor: "status", render: (row) => <StatusBadge status={row.status} /> },
    {
      header: "Actions",
      accessor: "actions",
      render: (row) => (
        <ActionMenu
          actions={[
            { label: "View Health File", icon: "🏥", onClick: () => setSelectedStudent(row) },
            { label: "Delete Record", icon: "🗑️", danger: true, onClick: () => setRecords(records.filter((r) => r.id !== row.id)) }
          ]}
        />
      )
    }
  ];

  return (
    <div style={{ padding: "24px" }}>
      <PageHeader
        breadcrumb="Student Welfare"
        title="Student Health Records"
        description="Confidential student medical profiles, emergency contacts, blood group database, and checkups."
        icon="🏥"
        primaryAction={{
          label: "Log Health Record",
          icon: "+",
          onClick: () => setIsModalOpen(true)
        }}
      />

      <StatGrid>
        <StatCard title="Medical Files Logged" value={records.length} icon="🏥" />
        <StatCard title="Blood Group Catalogued" value={`${records.length} Students`} icon="🩸" />
        <StatCard title="Special Conditions Alert" value={records.filter((r) => r.status !== "Active").length} icon="⚠️" />
        <StatCard title="Annual Checkup Complete" value="96%" icon="✅" />
      </StatGrid>

      <DataTable
        columns={columns}
        data={records}
        searchPlaceholder="Search by student name, roll no, blood group..."
        filters={[
          { key: "bloodGroup", label: "Blood Group", options: [{ value: "O+", label: "O+" }, { value: "B+", label: "B+" }, { value: "AB+", label: "AB+" }, { value: "A+", label: "A+" }] }
        ]}
      />

      {/* Add Record Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Student Medical Profile"
        footer={
          <>
            <button className="ui-btn ui-btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="ui-btn ui-btn-primary" onClick={handleAddRecord}>Save Health Profile</button>
          </>
        }
      >
        <form onSubmit={handleAddRecord}>
          <div className="ui-form-row">
            <div className="ui-form-group">
              <label>Student Full Name *</label>
              <input
                type="text"
                className="ui-form-control"
                placeholder="Student Name"
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                required
              />
            </div>
            <div className="ui-form-group">
              <label>Roll Number *</label>
              <input
                type="text"
                className="ui-form-control"
                placeholder="Roll No"
                value={formData.rollNo}
                onChange={(e) => setFormData({ ...formData, rollNo: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="ui-form-row">
            <div className="ui-form-group">
              <label>Class & Section</label>
              <select
                className="ui-form-control"
                value={formData.className}
                onChange={(e) => setFormData({ ...formData, className: e.target.value })}
              >
                <option value="10-A">Class 10-A</option>
                <option value="10-B">Class 10-B</option>
                <option value="12-A">Class 12-A</option>
                <option value="9-A">Class 9-A</option>
              </select>
            </div>
            <div className="ui-form-group">
              <label>Blood Group</label>
              <select
                className="ui-form-control"
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              >
                <option value="A+">A+</option>
                <option value="B+">B+</option>
                <option value="O+">O+</option>
                <option value="AB+">AB+</option>
                <option value="O-">O-</option>
              </select>
            </div>
          </div>

          <div className="ui-form-group">
            <label>Emergency Parent Contact *</label>
            <input
              type="text"
              className="ui-form-control"
              placeholder="+91 Phone Number"
              value={formData.emergencyContact}
              onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
              required
            />
          </div>

          <div className="ui-form-group">
            <label>Medical Conditions / Allergies / Notes</label>
            <textarea
              className="ui-form-control"
              rows={3}
              placeholder="Detail allergies, chronic conditions, or medications..."
              value={formData.conditions}
              onChange={(e) => setFormData({ ...formData, conditions: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      {/* View Health Profile Modal */}
      <Modal
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        title={`Medical Record: ${selectedStudent?.studentName}`}
        footer={
          <button className="ui-btn ui-btn-secondary" onClick={() => setSelectedStudent(null)}>Close</button>
        }
      >
        {selectedStudent && (
          <div style={{ fontSize: "14px", lineHeight: "1.8" }}>
            <p><strong>Student Name:</strong> {selectedStudent.studentName}</p>
            <p><strong>Class & Roll No:</strong> Class {selectedStudent.className} (Roll No. {selectedStudent.rollNo})</p>
            <p><strong>Blood Group:</strong> <span className="ui-badge ui-badge-danger">{selectedStudent.bloodGroup}</span></p>
            <p><strong>Emergency Contact:</strong> {selectedStudent.emergencyContact}</p>
            <p><strong>Known Medical Conditions:</strong> {selectedStudent.conditions}</p>
            <p><strong>Last Medical Examination:</strong> {selectedStudent.lastCheckup}</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default HealthRecords;