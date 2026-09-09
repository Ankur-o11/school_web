import { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import StatCard, { StatGrid } from "../components/ui/StatCard";
import DataTable from "../components/ui/DataTable";
import StatusBadge from "../components/ui/StatusBadge";
import ActionMenu from "../components/ui/ActionMenu";
import Modal from "../components/ui/Modal";
import "../Style/ui.css";

const INITIAL_CERTIFICATES = [
  {
    id: "CERT-2026-01",
    studentName: "Aarav Sharma",
    rollNo: "1001",
    className: "10-A",
    type: "Transfer Certificate",
    issueDate: "2026-09-02",
    issuedBy: "Principal",
    status: "Issued"
  },
  {
    id: "CERT-2026-02",
    studentName: "Ananya Patel",
    rollNo: "1004",
    className: "10-A",
    type: "Bonafide Certificate",
    issueDate: "2026-09-04",
    issuedBy: "Admin Office",
    status: "Issued"
  },
  {
    id: "CERT-2026-03",
    studentName: "Rohan Verma",
    rollNo: "1208",
    className: "12-A",
    type: "Character Certificate",
    issueDate: "2026-09-07",
    issuedBy: "Principal",
    status: "Issued"
  }
];

export function Certificates() {
  const [certificates, setCertificates] = useState(INITIAL_CERTIFICATES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewCert, setPreviewCert] = useState(null);

  const [formData, setFormData] = useState({
    studentName: "",
    rollNo: "",
    className: "10-A",
    type: "Transfer Certificate",
    reason: "Parent Transfer",
    conduct: "Good"
  });

  const handleGenerate = (e) => {
    e.preventDefault();
    const newCert = {
      id: `CERT-2026-${Math.floor(10 + Math.random() * 90)}`,
      studentName: formData.studentName,
      rollNo: formData.rollNo || "1010",
      className: formData.className,
      type: formData.type,
      issueDate: new Date().toISOString().split("T")[0],
      issuedBy: "Principal",
      status: "Issued"
    };
    setCertificates([newCert, ...certificates]);
    setIsModalOpen(false);
    setPreviewCert(newCert);
  };

  const columns = [
    { header: "Certificate No.", accessor: "id", render: (row) => <strong>{row.id}</strong> },
    { header: "Student Name", accessor: "studentName" },
    { header: "Roll No.", accessor: "rollNo" },
    { header: "Class", accessor: "className" },
    { header: "Certificate Type", accessor: "type", render: (row) => <span className="ui-badge ui-badge-info">{row.type}</span> },
    { header: "Issue Date", accessor: "issueDate" },
    { header: "Status", accessor: "status", render: (row) => <StatusBadge status={row.status} /> },
    {
      header: "Actions",
      accessor: "actions",
      render: (row) => (
        <ActionMenu
          actions={[
            { label: "View & Print A4", icon: "🖨️", onClick: () => setPreviewCert(row) },
            { label: "Delete Record", icon: "🗑️", danger: true, onClick: () => setCertificates(certificates.filter((c) => c.id !== row.id)) }
          ]}
        />
      )
    }
  ];

  return (
    <div style={{ padding: "24px" }}>
      <PageHeader
        breadcrumb="Academic"
        title="Student Certificates"
        description="Generate, preview, and print Transfer, Bonafide, and Character Certificates."
        icon="📄"
        primaryAction={{
          label: "Generate Certificate",
          icon: "+",
          onClick: () => setIsModalOpen(true)
        }}
      />

      <StatGrid>
        <StatCard title="Total Certificates Issued" value={certificates.length} icon="📄" />
        <StatCard title="Transfer Certificates" value={certificates.filter((c) => c.type === "Transfer Certificate").length} icon="🎓" />
        <StatCard title="Bonafide Certificates" value={certificates.filter((c) => c.type === "Bonafide Certificate").length} icon="📜" />
        <StatCard title="Character Certificates" value={certificates.filter((c) => c.type === "Character Certificate").length} icon="🏆" />
      </StatGrid>

      <DataTable
        columns={columns}
        data={certificates}
        searchPlaceholder="Search certificates by student name or roll no..."
        filters={[
          { key: "type", label: "Type", options: [{ value: "Transfer Certificate", label: "Transfer Certificate" }, { value: "Bonafide Certificate", label: "Bonafide Certificate" }, { value: "Character Certificate", label: "Character Certificate" }] }
        ]}
      />

      {/* Generate Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Generate Official Student Certificate"
        footer={
          <>
            <button className="ui-btn ui-btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="ui-btn ui-btn-primary" onClick={handleGenerate}>Generate & Preview</button>
          </>
        }
      >
        <form onSubmit={handleGenerate}>
          <div className="ui-form-group">
            <label>Certificate Type *</label>
            <select
              className="ui-form-control"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="Transfer Certificate">Transfer Certificate (TC)</option>
              <option value="Bonafide Certificate">Bonafide Student Certificate</option>
              <option value="Character Certificate">Character & Conduct Certificate</option>
              <option value="Achievement Certificate">Merit & Sports Certificate</option>
            </select>
          </div>

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
              <label>Roll / Admission No. *</label>
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
              <label>Student Conduct</label>
              <select
                className="ui-form-control"
                value={formData.conduct}
                onChange={(e) => setFormData({ ...formData, conduct: e.target.value })}
              >
                <option value="Excellent">Excellent</option>
                <option value="Good">Good</option>
                <option value="Satisfactory">Satisfactory</option>
              </select>
            </div>
          </div>
        </form>
      </Modal>

      {/* A4 Preview & Print Modal */}
      <Modal
        isOpen={!!previewCert}
        onClose={() => setPreviewCert(null)}
        title="Official A4 Certificate Preview"
        maxWidth="680px"
        footer={
          <>
            <button className="ui-btn ui-btn-secondary" onClick={() => setPreviewCert(null)}>Close</button>
            <button className="ui-btn ui-btn-primary" onClick={() => window.print()}>🖨️ Print Certificate</button>
          </>
        }
      >
        {previewCert && (
          <div
            style={{
              padding: "32px",
              border: "4px double #1e3a8a",
              borderRadius: "8px",
              textAlign: "center",
              background: "#fafafa"
            }}
          >
            <h2 style={{ margin: "0 0 4px 0", color: "#1e3a8a", textTransform: "uppercase", letterSpacing: "1px" }}>
              MPSA SENIOR SECONDARY SCHOOL
            </h2>
            <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
              Affiliated to CBSE • School Code: 40912 • New Delhi
            </p>
            <div style={{ margin: "24px 0", borderBottom: "2px solid #1e3a8a" }} />

            <h3 style={{ textTransform: "uppercase", color: "#0f172a", letterSpacing: "2px", margin: "0 0 20px 0" }}>
              {previewCert.type}
            </h3>

            <p style={{ fontSize: "15px", lineHeight: "1.8", color: "#334155", textAlign: "justify" }}>
              This is to certify that <strong>{previewCert.studentName}</strong>, Roll No.{" "}
              <strong>{previewCert.rollNo}</strong>, has been a bonafide student of Class{" "}
              <strong>{previewCert.className}</strong> at MPSA Senior Secondary School. During their tenure at the
              institution, their conduct and moral character have been <strong>GOOD</strong>.
            </p>

            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "40px", fontSize: "13px" }}>
              <div>
                <p>Date: {previewCert.issueDate}</p>
                <p>Cert No: {previewCert.id}</p>
              </div>
              <div style={{ textAlign: "right" }}>
                <br />
                <p style={{ fontWeight: "700", borderTop: "1px solid #94a3b8", paddingTop: "6px", display: "inline-block" }}>
                  Principal Signature
                </p>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Certificates;