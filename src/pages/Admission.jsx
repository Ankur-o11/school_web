import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();
  const sourceQuery = searchParams.get("source");

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Modals
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [isChecklistModalOpen, setIsChecklistModalOpen] = useState(false);
  const [isCorrectionModalOpen, setIsCorrectionModalOpen] = useState(false);
  const [correctionNotesInput, setCorrectionNotesInput] = useState("");

  // Form for new application
  const [formData, setFormData] = useState({
    applicantName: "",
    gender: "Male",
    dob: "",
    appliedClass: "Class 1",
    parentName: "",
    parentPhone: "",
    prevSchool: "",
    email: "",
    address: "",
    source: "admin",
  });

  // Fetch admissions from backend
  const fetchAdmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchWithAuth(`${API_BASE_URL}/admissions`);
      const data = await res.json();
      if (data.success) {
        setApplications(data.data || data.admissions || []);
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
        const item = data.data || data.admission;
        setSuccessMessage(`Application created! Application ID: ${item.applicationId || item.applicationNo}`);
        setIsNewModalOpen(false);
        setFormData({
          applicantName: "",
          gender: "Male",
          dob: "",
          appliedClass: "Class 1",
          parentName: "",
          parentPhone: "",
          prevSchool: "",
          email: "",
          address: "",
          source: "admin",
        });
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
      [key]: {
        ...selectedApp.checklist?.[key],
        status: currentValue === "Verified" || currentValue === true ? "Pending" : "Verified",
      }
    };

    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/admissions/${selectedApp.id || selectedApp.applicationNo}/checklist`, {
        method: "PATCH",
        body: JSON.stringify({ checklist: updatedChecklist })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedApp(data.data || data.admission);
        fetchAdmissions();
      } else {
        alert(data.message || "Failed to update checklist.");
      }
    } catch (err) {
      console.error("Update checklist error:", err);
      alert("Error updating checklist.");
    }
  };

  // Request Correction
  const handleSendCorrectionRequest = async () => {
    if (!selectedApp || !correctionNotesInput) {
      alert("Please provide details for the correction request.");
      return;
    }

    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/admissions/${selectedApp.id || selectedApp.applicationNo}/request-correction`, {
        method: "PATCH",
        body: JSON.stringify({ notes: correctionNotesInput }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage("Correction request sent to parent!");
        setIsCorrectionModalOpen(false);
        setCorrectionNotesInput("");
        fetchAdmissions();
      } else {
        alert(data.message || "Failed to request correction.");
      }
    } catch (err) {
      console.error("Request correction error:", err);
      alert("Error requesting correction.");
    }
  };

  // Confirm Admission & Auto-Create Student
  const handleConfirmAdmission = async (app) => {
    const confirmText = `Are you sure you want to CONFIRM admission for ${app.applicantName}?\nThis will automatically create an active Student Record in the school database.`;
    if (!window.confirm(confirmText)) return;

    try {
      setError(null);
      const res = await fetchWithAuth(`${API_BASE_URL}/admissions/${app.id || app.applicationNo}/confirm`, {
        method: "POST"
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(
          `🎉 Admission Confirmed! Student record created successfully (ID: ${data.studentCreated?.admissionNo || data.student?.admissionNumber || "Created"})`
        );
        fetchAdmissions();
        if (selectedApp && (selectedApp.id === app.id || selectedApp.applicationNo === app.applicationNo)) {
          setSelectedApp(data.data || data.admission);
        }
      } else {
        alert(data.message || "Failed to confirm admission.");
      }
    } catch (err) {
      console.error("Confirm admission error:", err);
      alert("Error confirming admission.");
    }
  };

  // Status update
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

  // Generate WhatsApp Link
  const getWhatsAppLink = (app) => {
    const phoneClean = (app.parentPhone || "").replace(/\D/g, "");
    const formattedPhone = phoneClean.length === 10 ? `91${phoneClean}` : phoneClean;
    const trackingToken = app.trackingToken || app.applicationNo || app.id;
    const trackingUrl = `${window.location.origin}/admission-status/${trackingToken}`;

    let msg = `Dear ${app.parentName},\n\n`;
    msg += `Greetings from MPSA Public School!\n`;
    msg += `Regarding Admission Application ID: *${app.applicationId || app.applicationNo}* for *${app.applicantName}*.\n\n`;

    if (app.pendingItems && app.pendingItems.length > 0) {
      msg += `⚠️ *Pending Action Items Required:*\n`;
      app.pendingItems.forEach(item => {
        msg += `• ${item}\n`;
      });
      msg += `\nPlease complete these pending requirements to finalize admission.\n\n`;
    } else {
      msg += `All documents and fee requirements are verified!\n\n`;
    }

    msg += `📲 Track live status & details here:\n${trackingUrl}\n\n`;
    msg += `Thank you,\nMPSA School Admissions Office`;

    return `https://wa.me/${formattedPhone}?text=${encodeURIComponent(msg)}`;
  };

  const columns = [
    {
      header: "Application ID",
      accessor: "applicationNo",
      render: (row) => {
        const idVal = row.applicationId || row.applicationNo || row.id;
        const token = row.trackingToken || idVal;
        return (
          <div>
            <strong style={{ color: "#1e3a8a", fontFamily: "monospace", fontSize: "13px" }}>{idVal}</strong>
            <br />
            <a
              href={`/admission-status/${token}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: "11px", color: "#3b82f6", textDecoration: "none" }}
            >
              🔗 Tracking Link
            </a>
          </div>
        );
      }
    },
    {
      header: "Source",
      accessor: "source",
      render: (row) => {
        const s = (row.source || "admin").toLowerCase();
        let bg = "#e0f2fe", color = "#0369a1";
        if (s === "online") { bg = "#f3e8ff"; color = "#6b21a8"; }
        else if (s === "walk-in") { bg = "#dcfce7"; color = "#15803d"; }
        return (
          <span style={{ backgroundColor: bg, color: color, padding: "2px 8px", borderRadius: "10px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" }}>
            {s}
          </span>
        );
      }
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
            label: "Request Correction",
            icon: "✏️",
            onClick: () => {
              setSelectedApp(row);
              setCorrectionNotesInput(row.correctionNotes || "");
              setIsCorrectionModalOpen(true);
            }
          });

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
            onClick: () => handleUpdateStatus(row.id || row.applicationNo, "Rejected")
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
        description="Process walk-in, admin, & online self-service registrations with immutable Application IDs, parent WhatsApp tracking, and 1-click student creation."
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
          <button onClick={() => setSuccessMessage(null)} style={{ background: "none", border: "none", cursor: "pointer", fontWeight: "700", color: "#166534" }}>✕</button>
        </div>
      )}

      {error && (
        <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", padding: "12px 16px", borderRadius: "8px", marginBottom: "16px" }}>
          ⚠️ {error}
        </div>
      )}

      <StatGrid>
        <StatCard title="Total Applications" value={applications.length} icon="🎓" />
        <StatCard title="Online Self-Service" value={applications.filter((a) => (a.source || "").toLowerCase() === "online").length} icon="💻" />
        <StatCard title="Pending Verification" value={applications.filter((a) => a.pendingItems && a.pendingItems.length > 0 && a.status !== "Confirmed" && a.status !== "Approved").length} icon="⏳" />
        <StatCard title="Confirmed Admissions" value={applications.filter((a) => a.status === "Confirmed" || a.status === "Approved").length} icon="✅" />
      </StatGrid>

      {loading ? (
        <div style={{ textAlign: "center", padding: "40px 0", color: "#64748b" }}>
          Loading admissions...
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={applications}
          searchPlaceholder="Search applicant, parent name, ID, mobile..."
          initialFilterValues={sourceQuery ? { source: sourceQuery } : {}}
          filters={[
            {
              key: "source",
              label: "Source",
              options: [
                { value: "online", label: "Online Self-Service" },
                { value: "admin", label: "Admin Office" },
                { value: "walk-in", label: "Walk-in Desk" }
              ]
            },
            {
              key: "status",
              label: "Status",
              options: [
                { value: "Submitted", label: "Submitted" },
                { value: "Under Review", label: "Under Review" },
                { value: "Correction Required", label: "Correction Required" },
                { value: "Ready for Confirmation", label: "Ready for Confirmation" },
                { value: "Confirmed", label: "Confirmed" },
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
              <label>Admission Source *</label>
              <select
                className="ui-form-control"
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
              >
                <option value="admin">Admin Office</option>
                <option value="walk-in">Walk-in Registration</option>
                <option value="online">Online Entry</option>
              </select>
            </div>
            <div className="ui-form-group">
              <label>Applying for Class *</label>
              <select
                className="ui-form-control"
                value={formData.appliedClass}
                onChange={(e) => setFormData({ ...formData, appliedClass: e.target.value })}
              >
                <option value="PG">PG / Nursery</option>
                <option value="LKG">LKG</option>
                <option value="UKG">UKG</option>
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
              <label>Gender</label>
              <select
                className="ui-form-control"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
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

      {/* Itemized Checklist Verification Modal */}
      <Modal
        isOpen={isChecklistModalOpen && !!selectedApp}
        onClose={() => setIsChecklistModalOpen(false)}
        title={`Verification & Checklist: ${selectedApp?.applicationId || selectedApp?.applicationNo}`}
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
            <div style={{ backgroundColor: "#f8fafc", padding: "16px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "20px" }}>
              <p style={{ margin: "0 0 6px 0" }}>
                <strong>Application ID (Immutable): </strong>
                <span style={{ color: "#1e3a8a", fontWeight: "700" }}>{selectedApp.applicationId || selectedApp.applicationNo}</span>
              </p>
              <p style={{ margin: "0 0 6px 0" }}><strong>Applicant Name:</strong> {selectedApp.applicantName}</p>
              <p style={{ margin: "0 0 6px 0" }}><strong>Applied Class:</strong> {selectedApp.appliedClass}</p>
              <p style={{ margin: "0 0 6px 0" }}><strong>Parent:</strong> {selectedApp.parentName} ({selectedApp.parentPhone})</p>
              <p style={{ margin: "0 0 6px 0" }}><strong>Source:</strong> {selectedApp.source ? selectedApp.source.toUpperCase() : "ADMIN"}</p>
              <p style={{ margin: "0 0 0 0" }}>
                <strong>Public Tracking URL: </strong>
                <a href={`/admission-status/${selectedApp.trackingToken || selectedApp.applicationNo}`} target="_blank" rel="noopener noreferrer" style={{ color: "#3b82f6" }}>
                  {window.location.origin}/admission-status/{selectedApp.trackingToken || selectedApp.applicationNo}
                </a>
              </p>
            </div>

            <h4 style={{ margin: "0 0 12px 0", fontSize: "15px" }}>Itemized Verification Checklist</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {[
                { key: "birthCertificate", label: "Birth Certificate Submitted" },
                { key: "aadhaar", label: "Aadhaar Card Submitted" },
                { key: "photo", label: "Passport Size Photograph Submitted" },
                { key: "transferCertificate", label: "Transfer Certificate (TC) Submitted" },
                { key: "registrationFee", label: "Admission Registration Fee Paid" }
              ].map(({ key, label }) => {
                const itemObj = selectedApp.checklist?.[key];
                const isVerified = itemObj?.status === "Verified" || itemObj?.status === "Paid" || itemObj === true;
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
                      cursor: "pointer"
                    }}
                  >
                    <span style={{ fontSize: "14px", fontWeight: "500", color: isVerified ? "#166534" : "#991b1b" }}>
                      {label}
                    </span>
                    <input
                      type="checkbox"
                      checked={isVerified}
                      onChange={() => handleChecklistToggle(key, itemObj?.status || isVerified)}
                      style={{ width: "18px", height: "18px", cursor: "pointer" }}
                    />
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </Modal>

      {/* Correction Request Modal */}
      <Modal
        isOpen={isCorrectionModalOpen && !!selectedApp}
        onClose={() => setIsCorrectionModalOpen(false)}
        title={`Request Correction: ${selectedApp?.applicationId || selectedApp?.applicationNo}`}
        footer={
          <>
            <button className="ui-btn ui-btn-secondary" onClick={() => setIsCorrectionModalOpen(false)}>Cancel</button>
            <button className="ui-btn ui-btn-primary" style={{ backgroundColor: "#d97706" }} onClick={handleSendCorrectionRequest}>
              Send Correction Request
            </button>
          </>
        }
      >
        {selectedApp && (
          <div>
            <p style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#334155" }}>
              Specify notes for <strong>{selectedApp.applicantName}</strong>'s parent to review & resubmit application details:
            </p>
            <div className="ui-form-group">
              <label>Admin Instructions / Correction Notes *</label>
              <textarea
                className="ui-form-control"
                rows="4"
                placeholder="e.g. Please update parent phone number and upload correct date of birth."
                value={correctionNotesInput}
                onChange={(e) => setCorrectionNotesInput(e.target.value)}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default Admission;