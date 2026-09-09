import { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import StatCard, { StatGrid } from "../components/ui/StatCard";
import DataTable from "../components/ui/DataTable";
import StatusBadge from "../components/ui/StatusBadge";
import ActionMenu from "../components/ui/ActionMenu";
import Modal from "../components/ui/Modal";
import "../Style/ui.css";

const INITIAL_APPLICATIONS = [
  {
    id: "ADM-2026-001",
    applicantName: "Kabir Mehra",
    appliedClass: "Class 1",
    parentName: "Vikram Mehra",
    parentPhone: "+91 9876501234",
    appliedDate: "2026-09-01",
    prevSchool: "St. Xavier Junior School",
    status: "Under Review"
  },
  {
    id: "ADM-2026-002",
    applicantName: "Diya Sengupta",
    appliedClass: "Class 9",
    parentName: "Amit Sengupta",
    parentPhone: "+91 9812304567",
    appliedDate: "2026-09-03",
    prevSchool: "Delhi Public School",
    status: "Pending"
  },
  {
    id: "ADM-2026-003",
    applicantName: "Arjun Nair",
    appliedClass: "Class 11 Science",
    parentName: "Rajesh Nair",
    parentPhone: "+91 9898901234",
    appliedDate: "2026-08-28",
    prevSchool: "Modern High School",
    status: "Approved"
  }
];

export function Admission() {
  const [applications, setApplications] = useState(INITIAL_APPLICATIONS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  const [formData, setFormData] = useState({
    applicantName: "",
    appliedClass: "Class 1",
    parentName: "",
    parentPhone: "",
    prevSchool: ""
  });

  const handleCreateApplication = (e) => {
    e.preventDefault();
    const newApp = {
      id: `ADM-2026-0${applications.length + 1}`,
      applicantName: formData.applicantName,
      appliedClass: formData.appliedClass,
      parentName: formData.parentName,
      parentPhone: formData.parentPhone,
      appliedDate: new Date().toISOString().split("T")[0],
      prevSchool: formData.prevSchool || "N/A",
      status: "Pending"
    };
    setApplications([newApp, ...applications]);
    setIsModalOpen(false);
    setFormData({ applicantName: "", appliedClass: "Class 1", parentName: "", parentPhone: "", prevSchool: "" });
  };

  const updateStatus = (id, status) => {
    setApplications(
      applications.map((a) => (a.id === id ? { ...a, status } : a))
    );
  };

  const columns = [
    { header: "Application ID", accessor: "id", render: (row) => <strong>{row.id}</strong> },
    { header: "Applicant Name", accessor: "applicantName" },
    { header: "Applied Class", accessor: "appliedClass" },
    { header: "Parent Name", accessor: "parentName" },
    { header: "Contact Phone", accessor: "parentPhone" },
    { header: "Applied Date", accessor: "appliedDate" },
    { header: "Status", accessor: "status", render: (row) => <StatusBadge status={row.status} /> },
    {
      header: "Actions",
      accessor: "actions",
      render: (row) => (
        <ActionMenu
          actions={[
            { label: "View Application", icon: "👁️", onClick: () => setSelectedApp(row) },
            { label: "Approve Admission", icon: "✅", onClick: () => updateStatus(row.id, "Approved") },
            { label: "Reject Application", icon: "❌", danger: true, onClick: () => updateStatus(row.id, "Rejected") }
          ]}
        />
      )
    }
  ];

  return (
    <div style={{ padding: "24px" }}>
      <PageHeader
        breadcrumb="Admissions"
        title="Student Admissions Portal"
        description="Process new student registration, view application statuses, approve or reject applications."
        icon="🎓"
        primaryAction={{
          label: "New Registration",
          icon: "+",
          onClick: () => setIsModalOpen(true)
        }}
      />

      <StatGrid>
        <StatCard title="Total Applications" value={applications.length} icon="🎓" />
        <StatCard title="Pending Review" value={applications.filter((a) => a.status === "Pending" || a.status === "Under Review").length} icon="⏳" />
        <StatCard title="Approved Admissions" value={applications.filter((a) => a.status === "Approved").length} icon="✅" />
        <StatCard title="Rejected / Ineligible" value={applications.filter((a) => a.status === "Rejected").length} icon="❌" />
      </StatGrid>

      <DataTable
        columns={columns}
        data={applications}
        searchPlaceholder="Search applicant, parent name, ID..."
        filters={[
          { key: "status", label: "Status", options: [{ value: "Pending", label: "Pending" }, { value: "Under Review", label: "Under Review" }, { value: "Approved", label: "Approved" }, { value: "Rejected", label: "Rejected" }] }
        ]}
      />

      {/* New Application Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="New Student Admission Application"
        footer={
          <>
            <button className="ui-btn ui-btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="ui-btn ui-btn-primary" onClick={handleCreateApplication}>Submit Application</button>
          </>
        }
      >
        <form onSubmit={handleCreateApplication}>
          <div className="ui-form-row">
            <div className="ui-form-group">
              <label>Applicant Full Name *</label>
              <input
                type="text"
                className="ui-form-control"
                placeholder="Student Name"
                value={formData.applicantName}
                onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                required
              />
            </div>
            <div className="ui-form-group">
              <label>Applying for Class *</label>
              <select
                className="ui-form-control"
                value={formData.appliedClass}
                onChange={(e) => setFormData({ ...formData, appliedClass: e.target.value })}
              >
                <option value="Nursery">Nursery / LKG</option>
                <option value="Class 1">Class 1</option>
                <option value="Class 5">Class 5</option>
                <option value="Class 9">Class 9</option>
                <option value="Class 11 Science">Class 11 Science</option>
                <option value="Class 11 Commerce">Class 11 Commerce</option>
              </select>
            </div>
          </div>

          <div className="ui-form-row">
            <div className="ui-form-group">
              <label>Parent / Guardian Name *</label>
              <input
                type="text"
                className="ui-form-control"
                placeholder="Parent Name"
                value={formData.parentName}
                onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                required
              />
            </div>
            <div className="ui-form-group">
              <label>Parent Phone Number *</label>
              <input
                type="text"
                className="ui-form-control"
                placeholder="+91 Mobile No"
                value={formData.parentPhone}
                onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="ui-form-group">
            <label>Previous School Attended</label>
            <input
              type="text"
              className="ui-form-control"
              placeholder="Previous School Name"
              value={formData.prevSchool}
              onChange={(e) => setFormData({ ...formData, prevSchool: e.target.value })}
            />
          </div>
        </form>
      </Modal>

      {/* Application Detail View Modal */}
      <Modal
        isOpen={!!selectedApp}
        onClose={() => setSelectedApp(null)}
        title={`Application: ${selectedApp?.id}`}
        footer={
          <button className="ui-btn ui-btn-secondary" onClick={() => setSelectedApp(null)}>Close</button>
        }
      >
        {selectedApp && (
          <div style={{ fontSize: "14px", lineHeight: "1.8" }}>
            <p><strong>Applicant Name:</strong> {selectedApp.applicantName}</p>
            <p><strong>Applied Class:</strong> {selectedApp.appliedClass}</p>
            <p><strong>Parent / Guardian:</strong> {selectedApp.parentName} ({selectedApp.parentPhone})</p>
            <p><strong>Previous Institution:</strong> {selectedApp.prevSchool}</p>
            <p><strong>Application Date:</strong> {selectedApp.appliedDate}</p>
            <p><strong>Current Status:</strong> <StatusBadge status={selectedApp.status} /></p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Admission;