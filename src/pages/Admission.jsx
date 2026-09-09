import React, { useEffect, useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import StatCard, { StatGrid } from "../components/ui/StatCard";
import DataTable from "../components/ui/DataTable";
import StatusBadge from "../components/ui/StatusBadge";
import ActionMenu from "../components/ui/ActionMenu";
import Modal from "../components/ui/Modal";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL from "../config/api";
import "../Style/ui.css";

export function Admission() {
  const { fetchWithAuth } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Modals
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);

  // Form for new application
  const [formData, setFormData] = useState({
    applicantName: "",
    appliedClass: "Class 1",
    parentName: "",
    parentPhone: "",
    prevSchool: "",
    email: ""
  });

  // Fetch admissions from backend
  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchWithAuth(`${API_BASE_URL}/admissions`);
      const data = await res.json();
      if (data.success) {
        setApplications(data.data || []);
      } else {
        setError(data.message || "Failed to load admissions.");
      }
    } catch (err) {
      console.error("Fetch admissions error:", err);
      setError("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmissions();
  }, []);

  // Handle new registration submit
  const handleCreateApplication = async (e) => {
    e.preventDefault();
    if (!formData.applicantName || !formData.parentName || !formData.parentPhone) {
      alert("Please fill all required fields.");
      return;
    }

    try {
      setError(null);
      const res = await fetchWithAuth(`${API_BASE_URL}/admissions`, {
        method: "POST",
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(`Application created successfully! Tracking ID: ${data.data.id}`);
        setIsNewModalOpen(false);
        setFormData({ applicantName: "", appliedClass: "Class 1", parentName: "", parentPhone: "", prevSchool: "", email: "" });
        fetchAdmissions();
      } else {
        alert(data.message || "Failed to create application");
      }
    } catch (err) {
      console.error("Create admission error:", err);
      alert("Error creating application.");
    }
  };

  // Update Checklist items for selected application
  const handleChecklistToggle = async (key, currentValue) => {
    if (!selectedApp) return;

    const updatedChecklist = {
      ...selectedApp.checklist,
      [key]: !currentValue
    };

    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/admissions/${selectedApp.id}/checklist`, {
        method: "PATCH",
        body: JSON.stringify({ checklist: updatedChecklist })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedApp(data.data);
        fetchAdmissions();
      } else {
        alert(data.message || "Failed to update checklist.");
      }
    } catch (err) {
      console.error("Update checklist error:", err);
      alert("Error updating checklist.");
    }
  };

  // Confirm Admission & Auto-Create Student
  const handleConfirmAdmission = async (app) => {
    const confirmText = `Are you sure you want to CONFIRM admission for ${app.applicantName}?\nThis will automatically create an active Student Record in the school database.`;
    if (!window.confirm(confirmText)) return;

    try {
      setError(null);
      const res = await fetchWithAuth(`${API_BASE_URL}/admissions/${app.id}/confirm`, {
        method: "POST"
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(
          `🎉 Admission Confirmed! Student record created successfully (ID: ${data.student?.admissionNumber || data.student?.id || "Created"})`
        );
        fetchAdmissions();
        if (selectedApp && selectedApp.id === app.id) {
          setSelectedApp(data.data);
        }
      } else {
        alert(data.message || "Failed to confirm admission.");
      }
    } catch (err) {
      console.error("Confirm admission error:", err);
      alert("Error confirming admission.");
    }
  };

  // Status update (Reject / Under Review)
  const handleUpdateStatus = async (id, status) => {
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/admissions/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(`Status updated to ${status}`);
        fetchAdmissions();
      } else {
        alert(data.message || "Failed to update status.");
      }
    } catch (err) {
      console.error("Status update error:", err);
      alert("Error updating status.");
    }
  };

  // Generate WhatsApp Reminder Link
  const getWhatsAppLink = (app) => {
    const phoneClean = (app.parentPhone || "").replace(/\D/g, "");
    const formattedPhone = phoneClean.length === 10 ? `91${phoneClean}` : phoneClean;
    const trackingUrl = `${window.location.origin}/admission-status/${app.id}`;
    
    let msg = `Dear ${app.parentName},\n\n`;
    msg += `Greetings from MPSA Public School!\n`;
    msg += `Regarding Admission Application ID: *${app.id}* for *${app.applicantName}*.\n\n`;

    if (app.pendingItems && app.pendingItems.length > 0) {
      msg += `⚠️ *Pending Action Items Required:*\n`;
      app.pendingItems.forEach(item => {
        msg += `• ${item}\n`;
      });
      msg += `\nPlease complete these pending requirements to finalize admission.\n\n`;
    } else {
      msg += `All documents and fee requirements are verified!\n\n`;
    }

    msg += `📲 Track live status & pending details here:\n${trackingUrl}\n\n`;
    msg += `Thank you,\nMPSA School Admissions Office`;

    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`;
  };

  const columns = [
    {
      header: "Application ID",
      accessor: "id",
      render: (row) => (
        <div>
          <strong style={{ color: "#1e3a8a" }}>{row.id}</strong>
          <br />
          <a
            href={`/admission-status/${row.id}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: "11px", color: "#3b82f6", textDecoration: "none" }}
          >
            🔗 Tracking Link
          </a>
        </div>
      )
    },
    { header: "Applicant Name", accessor: "applicantName", render: (row) => <strong>{row.applicantName}</strong> },
    { header: "Applied Class", accessor: "appliedClass" },
    {
      header: "Parent / Phone",
      accessor: "parentName",
      render: (row) => (
        <div>
          <div>{row.parentName}</div>
          <small style={{ color: "#64748b" }}>{row.parentPhone}</small>
        </div>
      )
    },
    {
      header: "Pending Items",
      accessor: "pendingItems",
      render: (row) => {
        const count = row.pendingItems?.length || 0;
        if (row.status === "Confirmed" || row.status === "Approved") {
          return <span style={{ color: "#10b981", fontWeight: "600", fontSize: "12px" }}>✓ All Verified</span>;
        }
        if (count === 0) {
          return <span style={{ color: "#10b981", fontWeight: "600", fontSize: "12px" }}>✓ Ready for Confirmation</span>;
        }
        return (
          <span style={{ backgroundColor: "#fef3c7", color: "#92400e", padding: "2px 8px", borderRadius: "12px", fontSize: "12px", fontWeight: "600" }}>
            ⚠️ {count} Pending
          </span>
        );
      }
    },
    {
      header: "Status",
      accessor: "status",
      render: (row) => <StatusBadge status={row.status === "Approved" ? "Confirmed" : row.status} />
    },
    {
      header: "Actions",
      accessor: "actions",
      render: (row) => {
        const actions = [
          {
            label: "View & Verify Checklist",
            icon: "📋",
            onClick: () => {
              setSelectedApp(row);
              setIsChecklistModalOpen(true);
            }
          },
          {
            label: "Send WhatsApp Reminder",
            icon: "💬",
            onClick: () => {
              window.open(getWhatsAppLink(row), "_blank");
            }
          }
        ];

        if (row.status !== "Confirmed" && row.status !== "Approved") {
          actions.push({
            label: "Confirm & Create Student",
            icon: "✅",
            onClick: () => handleConfirmAdmission(row)
          });
        }

        if (row.status !== "Rejected") {
          actions.push({
            label: "Reject Application",
            icon: "❌",
            danger: true,
            onClick: () => handleUpdateStatus(row.id, "Rejected")
          });
        }

        return <ActionMenu actions={actions} />;
      }
    }
  ];

  return (
    <div style={{ padding: "24px" }}>
      <PageHeader
        breadcrumb="Admissions"
        title="Student Admissions Portal"
        description="Manage new admissions, itemized document verification, parent WhatsApp updates, and 1-click automatic student creation."
        icon="🎓"
        primaryAction={{
          label: "New Registration",
          icon: "+",
          onClick: () => setIsNewModalOpen(true)
        }}
      />

      {successMessage && (
        <div style={{
          backgroundColor: "#f0fdf4",
          border: "1px solid #bbf7d0",
          color: "#166534",
          padding: "12px 16px",
          borderRadius: "8px",
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}>
          <span>{successMessage}</span>
          <button
            onClick={() => setSuccessMessage(null)}
            style={{ background: "none", border: "none", cursor: "pointer", fontWeight: "700", color: "#166534" }}
          >
            ✕
          </button>
        </div>
      )}

      {error && (
        <div style={{
          backgroundColor: "#fef2f2",
          border: "1px solid #fecaca",
          color: "#991b1b",
          padding: "12px 16px",
          borderRadius: "8px",
          marginBottom: "16px"
        }}>
          ⚠️ {error}
        </div>
      )}

      <StatGrid>
        <StatCard title="Total Applications" value={applications.length} icon="🎓" />
        <StatCard
          title="Pending Verification"
          value={applications.filter((a) => a.pendingItems && a.pendingItems.length > 0 && a.status !== "Confirmed" && a.status !== "Approved").length}
          icon="⏳"
        />
        <StatCard
          title="Ready for Confirmation"
          value={applications.filter((a) => (!a.pendingItems || a.pendingItems.length === 0) && a.status !== "Confirmed" && a.status !== "Approved" && a.status !== "Rejected").length}
          icon="📋"
        />
        <StatCard
          title="Confirmed Admissions"
          value={applications.filter((a) => a.status === "Confirmed" || a.status === "Approved").length}
          icon="✅"
        />
      </StatGrid>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#64748b" }}>
          Loading admissions...
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={applications}
          searchPlaceholder="Search applicant, parent name, ID..."
          filters={[
            {
              key: "status",
              label: "Status",
              options: [
                { value: "Pending", label: "Pending" },
                { value: "Under Review", label: "Under Review" },
                { value: "Confirmed", label: "Confirmed / Approved" },
                { value: "Rejected", label: "Rejected" }
              ]
            }
          ]}
        />
      )}

      {/* New Registration Modal */}
      <Modal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        title="New Student Admission Application"
        footer={
          <>
            <button className="ui-btn ui-btn-secondary" onClick={() => setIsNewModalOpen(false)}>Cancel</button>
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
                <option value="Class 2">Class 2</option>
                <option value="Class 3">Class 3</option>
                <option value="Class 4">Class 4</option>
                <option value="Class 5">Class 5</option>
                <option value="Class 6">Class 6</option>
                <option value="Class 7">Class 7</option>
                <option value="Class 8">Class 8</option>
                <option value="Class 9">Class 9</option>
                <option value="Class 10">Class 10</option>
                <option value="Class 11 Science">Class 11 Science</option>
                <option value="Class 11 Commerce">Class 11 Commerce</option>
                <option value="Class 12">Class 12</option>
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
              <label>Parent Mobile / WhatsApp No *</label>
              <input
                type="text"
                className="ui-form-control"
                placeholder="e.g. 9876543210"
                value={formData.parentPhone}
                onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="ui-form-row">
            <div className="ui-form-group">
              <label>Parent Email (Optional)</label>
              <input
                type="email"
                className="ui-form-control"
                placeholder="parent@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="ui-form-group">
              <label>Previous Institution</label>
              <input
                type="text"
                className="ui-form-control"
                placeholder="Previous School Name"
                value={formData.prevSchool}
                onChange={(e) => setFormData({ ...formData, prevSchool: e.target.value })}
              />
            </div>
          </div>
        </form>
      </Modal>

      {/* View & Itemized Checklist Modal */}
      <Modal
        isOpen={isChecklistModalOpen && !!selectedApp}
        onClose={() => setIsChecklistModalOpen(false)}
        title={`Verification & Checklist: ${selectedApp?.id}`}
        footer={
          <div style={{ display: "flex", justifyContent: "space-between", width: "100%", alignItems: "center" }}>
            <button
              className="ui-btn ui-btn-secondary"
              onClick={() => window.open(getWhatsAppLink(selectedApp), "_blank")}
              style={{ backgroundColor: "#25D366", color: "#ffffff", border: "none" }}
            >
              💬 Send WhatsApp Reminder
            </button>
            <div style={{ display: "flex", gap: "8px" }}>
              {selectedApp?.status !== "Confirmed" && selectedApp?.status !== "Approved" && (
                <button
                  className="ui-btn ui-btn-primary"
                  style={{ backgroundColor: "#10b981" }}
                  onClick={() => {
                    handleConfirmAdmission(selectedApp);
                    setIsChecklistModalOpen(false);
                  }}
                >
                  ✅ Confirm & Create Student
                </button>
              )}
              <button className="ui-btn ui-btn-secondary" onClick={() => setIsChecklistModalOpen(false)}>Close</button>
            </div>
          </div>
        }
      >
        {selectedApp && (
          <div>
            <div style={{
              backgroundColor: "#f8fafc",
              padding: "16px",
              borderRadius: "8px",
              border: "1px solid #e2e8f0",
              marginBottom: "20px"
            }}>
              <p style={{ margin: "0 0 6px 0" }}><strong>Applicant Name:</strong> {selectedApp.applicantName}</p>
              <p style={{ margin: "0 0 6px 0" }}><strong>Applied Class:</strong> {selectedApp.appliedClass}</p>
              <p style={{ margin: "0 0 6px 0" }}><strong>Parent:</strong> {selectedApp.parentName} ({selectedApp.parentPhone})</p>
              <p style={{ margin: "0 0 6px 0" }}><strong>Previous Institution:</strong> {selectedApp.prevSchool || "N/A"}</p>
              <p style={{ margin: "0 0 0 0" }}>
                <strong>Public Parent Status URL: </strong>
                <a
                  href={`/admission-status/${selectedApp.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: "#3b82f6" }}
                >
                  {window.location.origin}/admission-status/{selectedApp.id}
                </a>
              </p>
            </div>

            <h4 style={{ margin: "0 0 12px 0", fontSize: "15px" }}>Itemized Verification Checklist</h4>
            <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 16px 0" }}>
              Toggle items below to verify. Pending alert messages update automatically.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { key: "birthCertificate", label: "Birth Certificate Submitted" },
                { key: "aadhaarCard", label: "Aadhaar Card Submitted" },
                { key: "photo", label: "Passport Size Photograph Submitted" },
                { key: "transferCertificate", label: "Transfer Certificate (TC) Submitted" },
                { key: "registrationFeePaid", label: "Admission Registration Fee Paid" }
              ].map(({ key, label }) => {
                const isVerified = Boolean(selectedApp.checklist?.[key]);
                return (
                  <label
                    key={key}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "12px 14px",
                      borderRadius: "8px",
                      backgroundColor: isVerified ? "#f0fdf4" : "#fef2f2",
                      border: `1px solid ${isVerified ? "#bbf7d0" : "#fecaca"}`,
                      cursor: "pointer",
                      userSelect: "none"
                    }}
                  >
                    <span style={{ fontSize: "14px", fontWeight: "500", color: isVerified ? "#166534" : "#991b1b" }}>
                      {label}
                    </span>
                    <input
                      type="checkbox"
                      checked={isVerified}
                      onChange={() => handleChecklistToggle(key, isVerified)}
                      style={{ width: "18px", height: "18px", cursor: "pointer" }}
                    />
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Admission;