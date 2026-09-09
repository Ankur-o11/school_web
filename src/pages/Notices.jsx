import { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import StatCard, { StatGrid } from "../components/ui/StatCard";
import DataTable from "../components/ui/DataTable";
import StatusBadge from "../components/ui/StatusBadge";
import ActionMenu from "../components/ui/ActionMenu";
import Modal from "../components/ui/Modal";
import "../Style/ui.css";

const INITIAL_NOTICES = [
  {
    id: "NTC-001",
    title: "Mid-Term Examination Schedule Announced",
    content: "The official datesheet for Mid-Term Examinations has been published. All students are advised to check their respective class notice boards.",
    audience: "All",
    publishDate: "2026-09-01",
    expiryDate: "2026-09-30",
    status: "Published"
  },
  {
    id: "NTC-002",
    title: "Staff Meeting for Annual Sports Planning",
    content: "All academic and sports staff members are requested to assemble in the conference room at 3:30 PM today.",
    audience: "Teachers",
    publishDate: "2026-09-08",
    expiryDate: "2026-09-09",
    status: "Published"
  },
  {
    id: "NTC-003",
    title: "Independence Day Holiday Announcement",
    content: "The school will remain closed on 15th August on account of Independence Day celebrations.",
    audience: "All",
    publishDate: "2026-08-10",
    expiryDate: "2026-08-16",
    status: "Expired"
  }
];

export function Notices() {
  const [notices, setNotices] = useState(INITIAL_NOTICES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewNotice, setPreviewNotice] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    audience: "All",
    expiryDate: ""
  });

  const handleCreateNotice = (e) => {
    e.preventDefault();
    const newNotice = {
      id: `NTC-${Math.floor(100 + Math.random() * 900)}`,
      title: formData.title,
      content: formData.content,
      audience: formData.audience,
      publishDate: new Date().toISOString().split("T")[0],
      expiryDate: formData.expiryDate || "2026-10-01",
      status: "Published"
    };
    setNotices([newNotice, ...notices]);
    setIsModalOpen(false);
    setFormData({ title: "", content: "", audience: "All", expiryDate: "" });
  };

  const columns = [
    { header: "Notice Title", accessor: "title", render: (row) => <strong>{row.title}</strong> },
    { header: "Audience", accessor: "audience", render: (row) => <span className="ui-badge ui-badge-purple">{row.audience}</span> },
    { header: "Publish Date", accessor: "publishDate" },
    { header: "Expiry Date", accessor: "expiryDate" },
    { header: "Status", accessor: "status", render: (row) => <StatusBadge status={row.status} /> },
    {
      header: "Actions",
      accessor: "actions",
      render: (row) => (
        <ActionMenu
          actions={[
            { label: "View Notice", icon: "👁️", onClick: () => setPreviewNotice(row) },
            { label: "Delete", icon: "🗑️", danger: true, onClick: () => setNotices(notices.filter((n) => n.id !== row.id)) }
          ]}
        />
      )
    }
  ];

  return (
    <div style={{ padding: "24px" }}>
      <PageHeader
        breadcrumb="Communication"
        title="School Notice Board"
        description="Create, publish, and manage official notices for students, teachers, and parents."
        icon="📢"
        primaryAction={{
          label: "Publish New Notice",
          icon: "+",
          onClick: () => setIsModalOpen(true)
        }}
      />

      <StatGrid>
        <StatCard title="Total Notices" value={notices.length} icon="📢" />
        <StatCard title="Active Published" value={notices.filter((n) => n.status === "Published").length} icon="✅" />
        <StatCard title="Targeted to Staff" value={notices.filter((n) => n.audience === "Teachers").length} icon="👨‍🏫" />
        <StatCard title="Expired Notices" value={notices.filter((n) => n.status === "Expired").length} icon="⌛" />
      </StatGrid>

      <DataTable
        columns={columns}
        data={notices}
        searchPlaceholder="Search notices by title or content..."
        filters={[
          { key: "audience", label: "Audience", options: [{ value: "All", label: "All" }, { value: "Teachers", label: "Teachers" }, { value: "Students", label: "Students" }] },
          { key: "status", label: "Status", options: [{ value: "Published", label: "Published" }, { value: "Expired", label: "Expired" }] }
        ]}
      />

      {/* Create Notice Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Publish Official Notice"
        footer={
          <>
            <button className="ui-btn ui-btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button className="ui-btn ui-btn-primary" onClick={handleCreateNotice}>Publish Notice</button>
          </>
        }
      >
        <form onSubmit={handleCreateNotice}>
          <div className="ui-form-group">
            <label>Notice Heading / Title *</label>
            <input
              type="text"
              className="ui-form-control"
              placeholder="e.g. Science Exhibition Registration"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="ui-form-row">
            <div className="ui-form-group">
              <label>Target Audience *</label>
              <select
                className="ui-form-control"
                value={formData.audience}
                onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
              >
                <option value="All">All (School-wide)</option>
                <option value="Students">Students Only</option>
                <option value="Teachers">Teachers & Staff Only</option>
                <option value="Parents">Parents Only</option>
              </select>
            </div>
            <div className="ui-form-group">
              <label>Expiry Date *</label>
              <input
                type="date"
                className="ui-form-control"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="ui-form-group">
            <label>Notice Content *</label>
            <textarea
              className="ui-form-control"
              rows={4}
              placeholder="Write the full notice details here..."
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              required
            />
          </div>
        </form>
      </Modal>

      {/* View Notice Preview Modal */}
      <Modal
        isOpen={!!previewNotice}
        onClose={() => setPreviewNotice(null)}
        title={`Notice: ${previewNotice?.title}`}
        footer={
          <button className="ui-btn ui-btn-secondary" onClick={() => setPreviewNotice(null)}>Close</button>
        }
      >
        {previewNotice && (
          <div>
            <div style={{ display: "flex", gap: "10px", marginBottom: "12px", alignItems: "center" }}>
              <span className="ui-badge ui-badge-purple">{previewNotice.audience}</span>
              <StatusBadge status={previewNotice.status} />
              <span style={{ fontSize: "12px", color: "var(--text-muted)", marginLeft: "auto" }}>
                Published: {previewNotice.publishDate}
              </span>
            </div>
            <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0", fontSize: "14px", lineHeight: "1.6" }}>
              {previewNotice.content}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Notices;