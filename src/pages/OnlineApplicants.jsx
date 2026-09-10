import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageHeader from "../components/ui/PageHeader";
import StatCard, { StatGrid } from "../components/ui/StatCard";
import DataTable from "../components/ui/DataTable";
import StatusBadge from "../components/ui/StatusBadge";
import ActionMenu from "../components/ui/ActionMenu";
import Modal from "../components/ui/Modal";
import EmptyState from "../components/ui/EmptyState";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL from "../config/api";
import "../Style/ui.css";

export function OnlineApplicants() {
  const { fetchWithAuth, user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialStatusFilter = searchParams.get("status") || "All";

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Filters & Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState(initialStatusFilter);
  const [classFilter, setClassFilter] = useState("All");

  // Selected Application & Active Detail Tab
  const [selectedApp, setSelectedApp] = useState(null);
  const [activeTab, setActiveTab] = useState("info"); // info, docs, communication, audit

  // Modals
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [isReqDocsModalOpen, setIsReqDocsModalOpen] = useState(false);
  const [isConfirmAdmissionModalOpen, setIsConfirmAdmissionModalOpen] = useState(false);
  const [isAddDocModalOpen, setIsAddDocModalOpen] = useState(false);

  // Action Inputs
  const [rejectReasonPreset, setRejectReasonPreset] = useState("Incomplete documentation provided");
  const [customRejectReason, setCustomRejectReason] = useState("");
  const [reqDocsReason, setReqDocsReason] = useState("Please provide the required verification documents.");
  const [reqDocsList, setReqDocsList] = useState("Aadhaar Card, Birth Certificate, Passport Photo");
  const [newDocData, setNewDocData] = useState({ name: "", type: "Aadhaar Card", fileUrl: "", status: "Uploaded", adminRemark: "" });
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch Applications
  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchWithAuth(`${API_BASE_URL}/admissions?source=online`);
      const data = await res.json();
      if (data.success) {
        setApplications(data.data || data.admissions || []);
      } else {
        setError(data.message || "Failed to load online applications.");
      }
    } catch (err) {
      console.error("Fetch online applications error:", err);
      setError("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  // Update selected app reference when list changes
  useEffect(() => {
    if (selectedApp) {
      const refreshed = applications.find((a) => a.id === selectedApp.id || a.applicationNo === selectedApp.applicationNo);
      if (refreshed) setSelectedApp(refreshed);
    }
  }, [applications]);

  // Statistics calculation
  const totalApps = applications.length;
  const pendingApps = applications.filter((a) => a.status === "Submitted" || a.status === "Pending").length;
  const underReviewApps = applications.filter((a) => a.status === "Under Review").length;
  const docsReqApps = applications.filter((a) => a.status === "Documents Required" || a.status === "Correction Required").length;
  const approvedApps = applications.filter((a) => a.status === "Approved").length;
  const rejectedApps = applications.filter((a) => a.status === "Rejected").length;
  const admittedApps = applications.filter((a) => a.status === "Admitted" || a.status === "Confirmed").length;

  // Filtered List
  const filteredApps = applications.filter((app) => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (app.applicantName || "").toLowerCase().includes(q) ||
      (app.applicationNo || "").toLowerCase().includes(q) ||
      (app.parentPhone || "").toLowerCase().includes(q) ||
      (app.email || "").toLowerCase().includes(q) ||
      (app.parentName || "").toLowerCase().includes(q);

    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    const matchesClass = classFilter === "All" || app.appliedClass === classFilter;

    return matchesSearch && matchesStatus && matchesClass;
  });

  // Action Handlers
  const handleApprove = async () => {
    if (!selectedApp) return;
    try {
      setActionLoading(true);
      const res = await fetchWithAuth(`${API_BASE_URL}/admissions/${selectedApp.id}/approve`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(`Application for ${selectedApp.applicantName} APPROVED! Notification dispatched.`);
        setIsApproveModalOpen(false);
        fetchApplications();
      } else {
        alert(data.message || "Failed to approve application.");
      }
    } catch (err) {
      alert("Server error while approving application.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApp) return;
    const finalReason = rejectReasonPreset === "Other" ? customRejectReason : rejectReasonPreset;
    if (!finalReason || !finalReason.trim()) {
      alert("Please specify a reason for rejection.");
      return;
    }

    try {
      setActionLoading(true);
      const res = await fetchWithAuth(`${API_BASE_URL}/admissions/${selectedApp.id}/reject`, {
        method: "POST",
        body: JSON.stringify({ reason: finalReason }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(`Application for ${selectedApp.applicantName} set to REJECTED. Notification sent.`);
        setIsRejectModalOpen(false);
        fetchApplications();
      } else {
        alert(data.message || "Failed to reject application.");
      }
    } catch (err) {
      alert("Server error while rejecting application.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleRequestDocs = async () => {
    if (!selectedApp) return;
    try {
      setActionLoading(true);
      const res = await fetchWithAuth(`${API_BASE_URL}/admissions/${selectedApp.id}/request-documents`, {
        method: "POST",
        body: JSON.stringify({ reason: reqDocsReason, documentList: reqDocsList }),
      });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(`Document request and notification sent to ${selectedApp.parentName}.`);
        setIsReqDocsModalOpen(false);
        fetchApplications();
      } else {
        alert(data.message || "Failed to request documents.");
      }
    } catch (err) {
      alert("Server error while requesting documents.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmAdmission = async () => {
    if (!selectedApp) return;
    try {
      setActionLoading(true);
      const res = await fetchWithAuth(`${API_BASE_URL}/admissions/${selectedApp.id}/confirm`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setSuccessMessage(`🎉 Admission Confirmed! Generated Admission No: ${data.studentCreated?.admissionNo || data.createdAdmissionNo}. Student created in directory.`);
        setIsConfirmAdmissionModalOpen(false);
        fetchApplications();
      } else {
        alert(data.message || "Failed to confirm admission.");
      }
    } catch (err) {
      alert("Server error confirming admission.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleAddDocument = async (e) => {
    e.preventDefault();
    if (!selectedApp || !newDocData.name) return;
    try {
      setActionLoading(true);
      const res = await fetchWithAuth(`${API_BASE_URL}/admissions/${selectedApp.id}/documents`, {
        method: "POST",
        body: JSON.stringify(newDocData),
      });
      const data = await res.json();
      if (data.success) {
        setIsAddDocModalOpen(false);
        setNewDocData({ name: "", type: "Aadhaar Card", fileUrl: "", status: "Uploaded", adminRemark: "" });
        fetchApplications();
      } else {
        alert(data.message || "Failed to add document.");
      }
    } catch (err) {
      alert("Server error adding document.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateDocStatus = async (docId, status, adminRemark) => {
    if (!selectedApp) return;
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/admissions/${selectedApp.id}/documents/${docId}`, {
        method: "PATCH",
        body: JSON.stringify({ status, adminRemark }),
      });
      const data = await res.json();
      if (data.success) {
        fetchApplications();
      } else {
        alert(data.message || "Failed to update document status.");
      }
    } catch (err) {
      alert("Server error updating document status.");
    }
  };

  const handleDeleteDoc = async (docId) => {
    if (!selectedApp || !window.confirm("Are you sure you want to delete this document reference?")) return;
    try {
      const res = await fetchWithAuth(`${API_BASE_URL}/admissions/${selectedApp.id}/documents/${docId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchApplications();
      } else {
        alert(data.message || "Failed to delete document.");
      }
    } catch (err) {
      alert("Server error deleting document.");
    }
  };

  const handleResendNotification = async (type) => {
    if (!selectedApp) return;
    try {
      setActionLoading(true);
      const res = await fetchWithAuth(`${API_BASE_URL}/admissions/${selectedApp.id}/resend-notification`, {
        method: "POST",
        body: JSON.stringify({ triggerType: type }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Notification dispatched successfully!");
        fetchApplications();
      } else {
        alert(data.message || "Failed to resend notification.");
      }
    } catch (err) {
      alert("Server error resending notification.");
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      key: "applicationNo",
      title: "Application ID",
      render: (row) => (
        <div>
          <strong style={{ color: "var(--color-cyan-400)", fontFamily: "monospace" }}>
            {row.applicationNo || row.applicationId}
          </strong>
          <div style={{ fontSize: "11px", opacity: 0.7 }}>{row.appliedDate}</div>
        </div>
      ),
    },
    {
      key: "applicantName",
      title: "Student Name",
      render: (row) => (
        <div>
          <strong style={{ display: "block" }}>{row.applicantName}</strong>
          <span style={{ fontSize: "12px", opacity: 0.75 }}>Gender: {row.gender}</span>
        </div>
      ),
    },
    {
      key: "parentName",
      title: "Parent / Mobile",
      render: (row) => (
        <div>
          <div>{row.parentName}</div>
          <div style={{ fontSize: "12px", color: "#38bdf8" }}>📱 {row.parentPhone}</div>
        </div>
      ),
    },
    {
      key: "appliedClass",
      title: "Applied Class",
      render: (row) => <span className="ui-badge ui-badge-neutral">{row.appliedClass}</span>,
    },
    {
      key: "status",
      title: "Application Status",
      render: (row) => <StatusBadge status={row.status} />,
    },
    {
      key: "documents",
      title: "Documents",
      render: (row) => {
        const docs = row.documents || [];
        if (docs.length === 0) return <span style={{ fontSize: "12px", opacity: 0.6 }}>0 uploaded</span>;
        const verified = docs.filter((d) => d.status === "Verified").length;
        return (
          <span style={{ fontSize: "12px" }}>
            📄 {verified} / {docs.length} verified
          </span>
        );
      },
    },
    {
      key: "actions",
      title: "Actions",
      render: (row) => {
        const actions = [
          {
            label: "🌐 OPEN ONLINE FORM",
            onClick: () => {
              const url = `/admission-status/${row.trackingToken || row.applicationNo}`;
              window.open(url, "_blank");
            },
          },
          {
            label: "👁️ VIEW APPLICATION",
            onClick: () => {
              setSelectedApp(row);
              setActiveTab("info");
              setIsDetailModalOpen(true);
            },
          },
        ];

        if (row.status !== "Approved" && row.status !== "Admitted" && row.status !== "Confirmed") {
          actions.push({
            label: "✅ Approve Application",
            onClick: () => {
              setSelectedApp(row);
              setIsApproveModalOpen(true);
            },
          });
        }

        if (row.status !== "Rejected" && row.status !== "Admitted" && row.status !== "Confirmed") {
          actions.push({
            label: "❌ Reject Application",
            onClick: () => {
              setSelectedApp(row);
              setIsRejectModalOpen(true);
            },
          });
        }

        if (row.status !== "Admitted" && row.status !== "Confirmed") {
          actions.push({
            label: "📄 Request Documents",
            onClick: () => {
              setSelectedApp(row);
              setIsReqDocsModalOpen(true);
            },
          });
        }

        if (row.status === "Approved" || row.status === "Ready for Confirmation") {
          actions.push({
            label: "🎓 Confirm Admission",
            onClick: () => {
              setSelectedApp(row);
              setIsConfirmAdmissionModalOpen(true);
            },
          });
        }

        return <ActionMenu actions={actions} />;
      },
    },
  ];

  return (
    <div className="page-container">
      <PageHeader
        title="Online Applicants Management"
        subtitle="Process, verify documents, approve/reject, and confirm online self-registered admissions."
        actions={
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              className="ui-button ui-button-secondary"
              onClick={() => window.open("/online-admission", "_blank")}
            >
              🌐 Open Public Online Form
            </button>
            <button className="ui-button ui-button-primary" onClick={fetchApplications}>
              🔄 Refresh List
            </button>
          </div>
        }
      />

      {/* SUCCESS & ERROR NOTIFICATIONS */}
      {successMessage && (
        <div className="ui-alert ui-alert-success" style={{ marginBottom: "16px" }}>
          <span>{successMessage}</span>
          <button className="ui-alert-close" onClick={() => setSuccessMessage(null)}>
            ✕
          </button>
        </div>
      )}

      {error && (
        <div className="ui-alert ui-alert-danger" style={{ marginBottom: "16px" }}>
          <span>{error}</span>
          <button className="ui-alert-close" onClick={() => setError(null)}>
            ✕
          </button>
        </div>
      )}

      {/* DASHBOARD STATS CARDS */}
      <StatGrid style={{ marginBottom: "24px" }}>
        <StatCard title="Total Applications" value={totalApps} icon="📋" color="#3b82f6" />
        <StatCard title="Submitted / Pending" value={pendingApps} icon="⏳" color="#f59e0b" />
        <StatCard title="Under Review" value={underReviewApps} icon="🔍" color="#8b5cf6" />
        <StatCard title="Docs Required" value={docsReqApps} icon="📄" color="#ec4899" />
        <StatCard title="Approved" value={approvedApps} icon="✅" color="#10b981" />
        <StatCard title="Rejected" value={rejectedApps} icon="❌" color="#ef4444" />
        <StatCard title="Admitted" value={admittedApps} icon="🎓" color="#06b6d4" />
      </StatGrid>

      {/* SEARCH & FILTERS BAR */}
      <div
        className="ui-card"
        style={{
          marginBottom: "24px",
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ flex: "1 1 300px" }}>
          <input
            type="text"
            className="ui-input"
            placeholder="🔍 Search by Name, App ID, Phone, Email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <select className="ui-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="All">All Statuses</option>
            <option value="Submitted">Submitted (Pending)</option>
            <option value="Under Review">Under Review</option>
            <option value="Documents Required">Documents Required</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Admitted">Admitted</option>
          </select>

          <select className="ui-select" value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
            <option value="All">All Classes</option>
            <option value="Nursery">Nursery</option>
            <option value="KG">KG</option>
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
            <option value="Class 11">Class 11</option>
            <option value="Class 12">Class 12</option>
          </select>
        </div>
      </div>

      {/* APPLICANTS TABLE */}
      {loading ? (
        <div className="ui-card" style={{ textAlign: "center", padding: "40px" }}>
          <div className="ui-spinner" style={{ margin: "0 auto 12px" }}></div>
          <p>Loading online applications...</p>
        </div>
      ) : filteredApps.length === 0 ? (
        <EmptyState
          icon="💻"
          title="No Online Applications Found"
          description={searchTerm || statusFilter !== "All" ? "No applications match your filter criteria." : "There are currently no online self-registered student applications."}
        />
      ) : (
        <DataTable columns={columns} data={filteredApps} />
      )}

      {/* APPLICATION DETAIL MODAL */}
      {isDetailModalOpen && selectedApp && (
        <Modal
          title={`Application Details: ${selectedApp.applicationNo || selectedApp.applicationId}`}
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          width="850px"
        >
          {/* TAB NAVIGATION */}
          <div style={{ display: "flex", borderBottom: "1px solid var(--border-color)", marginBottom: "20px" }}>
            <button
              className={`ui-tab-btn ${activeTab === "info" ? "active" : ""}`}
              onClick={() => setActiveTab("info")}
              style={{ padding: "10px 16px", background: "none", border: "none", color: activeTab === "info" ? "var(--color-cyan-400)" : "#94a3b8", cursor: "pointer", fontWeight: "600", borderBottom: activeTab === "info" ? "2px solid var(--color-cyan-400)" : "none" }}
            >
              📋 Application & Student Details
            </button>
            <button
              className={`ui-tab-btn ${activeTab === "docs" ? "active" : ""}`}
              onClick={() => setActiveTab("docs")}
              style={{ padding: "10px 16px", background: "none", border: "none", color: activeTab === "docs" ? "var(--color-cyan-400)" : "#94a3b8", cursor: "pointer", fontWeight: "600", borderBottom: activeTab === "docs" ? "2px solid var(--color-cyan-400)" : "none" }}
            >
              📄 Document Manager ({(selectedApp.documents || []).length})
            </button>
            <button
              className={`ui-tab-btn ${activeTab === "communication" ? "active" : ""}`}
              onClick={() => setActiveTab("communication")}
              style={{ padding: "10px 16px", background: "none", border: "none", color: activeTab === "communication" ? "var(--color-cyan-400)" : "#94a3b8", cursor: "pointer", fontWeight: "600", borderBottom: activeTab === "communication" ? "2px solid var(--color-cyan-400)" : "none" }}
            >
              💬 Communication Logs ({(selectedApp.communicationHistory || []).length})
            </button>
          </div>

          {/* TAB 1: INFO */}
          {activeTab === "info" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div className="ui-card" style={{ background: "rgba(15, 23, 42, 0.6)" }}>
                <h4 style={{ color: "#38bdf8", marginBottom: "12px" }}>Student Profile</h4>
                <p><strong>Full Name:</strong> {selectedApp.applicantName}</p>
                <p><strong>Gender:</strong> {selectedApp.gender}</p>
                <p><strong>Date of Birth:</strong> {selectedApp.dob || "N/A"}</p>
                <p><strong>Applied Class:</strong> {selectedApp.appliedClass}</p>
                <p><strong>Academic Session:</strong> {selectedApp.academicSession}</p>
                <p><strong>Previous School:</strong> {selectedApp.prevSchool || "N/A"}</p>
              </div>

              <div className="ui-card" style={{ background: "rgba(15, 23, 42, 0.6)" }}>
                <h4 style={{ color: "#38bdf8", marginBottom: "12px" }}>Parent & Contact Details</h4>
                <p><strong>Parent/Guardian Name:</strong> {selectedApp.parentName}</p>
                <p><strong>Mobile / WhatsApp:</strong> {selectedApp.parentPhone}</p>
                <p><strong>Email Address:</strong> {selectedApp.email || "N/A"}</p>
                <p><strong>Address:</strong> {selectedApp.address || "N/A"}</p>
                <p><strong>City / State / Pincode:</strong> {[selectedApp.city, selectedApp.state, selectedApp.pincode].filter(Boolean).join(", ") || "N/A"}</p>
              </div>

              <div className="ui-card" style={{ gridColumn: "1 / -1", background: "rgba(15, 23, 42, 0.6)" }}>
                <h4 style={{ color: "#38bdf8", marginBottom: "12px" }}>Status & Admin Tracking</h4>
                <p><strong>Current Status:</strong> <StatusBadge status={selectedApp.status} /></p>
                {selectedApp.rejectionReason && (
                  <p style={{ color: "#ef4444" }}><strong>Rejection Reason:</strong> {selectedApp.rejectionReason}</p>
                )}
                {selectedApp.correctionNotes && (
                  <p style={{ color: "#f59e0b" }}><strong>Document / Correction Request Notes:</strong> {selectedApp.correctionNotes}</p>
                )}
                {selectedApp.createdAdmissionNo && (
                  <p style={{ color: "#10b981" }}><strong>Assigned Admission No:</strong> {selectedApp.createdAdmissionNo}</p>
                )}
                <p style={{ fontSize: "12px", opacity: 0.7, marginTop: "8px" }}>
                  Submitted: {selectedApp.submittedAt ? new Date(selectedApp.submittedAt).toLocaleString() : selectedApp.appliedDate} | Acted By: {selectedApp.actedBy || "System"}
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: DOCUMENTS MANAGER */}
          {activeTab === "docs" && (
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                <h4>Uploaded Document Records</h4>
                <button className="ui-button ui-button-primary" onClick={() => setIsAddDocModalOpen(true)}>
                  ➕ Add Document Reference
                </button>
              </div>

              {(selectedApp.documents || []).length === 0 ? (
                <EmptyState icon="📄" title="No Documents Uploaded" description="Applicant has not attached document references yet." />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {selectedApp.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="ui-card"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "rgba(15, 23, 42, 0.6)",
                        padding: "12px 16px",
                      }}
                    >
                      <div>
                        <strong>{doc.name}</strong> <span className="ui-badge ui-badge-neutral">{doc.type}</span>
                        <div style={{ fontSize: "12px", opacity: 0.7, marginTop: "4px" }}>
                          Status: <StatusBadge status={doc.status} /> {doc.adminRemark && `| Remark: ${doc.adminRemark}`}
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                        <select
                          className="ui-select"
                          style={{ padding: "4px 8px", fontSize: "12px" }}
                          value={doc.status}
                          onChange={(e) => handleUpdateDocStatus(doc.id, e.target.value, doc.adminRemark)}
                        >
                          <option value="Uploaded">Uploaded</option>
                          <option value="Verified">Verified</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Re-upload Required">Re-upload Required</option>
                        </select>

                        {doc.fileUrl && (
                          <a href={doc.fileUrl} target="_blank" rel="noreferrer" className="ui-button ui-button-secondary" style={{ padding: "4px 8px", fontSize: "12px" }}>
                            📥 Download
                          </a>
                        )}

                        <button className="ui-button ui-button-danger" style={{ padding: "4px 8px", fontSize: "12px" }} onClick={() => handleDeleteDoc(doc.id)}>
                          🗑️
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: COMMUNICATION HISTORY LOGS */}
          {activeTab === "communication" && (
            <div>
              <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
                <button className="ui-button ui-button-secondary" onClick={() => handleResendNotification("app_received")}>
                  📲 Resend Application Received
                </button>
                <button className="ui-button ui-button-secondary" onClick={() => handleResendNotification("docs_required")}>
                  📲 Resend Docs Request
                </button>
              </div>

              {(selectedApp.communicationHistory || []).length === 0 ? (
                <EmptyState icon="💬" title="No Communication Logs" description="No WhatsApp or Email dispatches recorded yet for this applicant." />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {selectedApp.communicationHistory.map((comm, idx) => (
                    <div key={comm.id || idx} className="ui-card" style={{ background: "rgba(15, 23, 42, 0.6)", padding: "12px" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span>
                          <strong>{comm.channel}</strong> ({comm.type}) ➔ {comm.recipient}
                        </span>
                        <StatusBadge status={comm.status} />
                      </div>
                      <p style={{ fontSize: "13px", opacity: 0.85, whiteSpace: "pre-wrap" }}>{comm.message}</p>
                      <div style={{ fontSize: "11px", opacity: 0.6, marginTop: "6px" }}>
                        Sent: {new Date(comm.timestamp).toLocaleString()} | By: {comm.sentBy || "System"}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </Modal>
      )}

      {/* APPROVE CONFIRMATION MODAL */}
      {isApproveModalOpen && selectedApp && (
        <Modal title="Confirm Application Approval" isOpen={isApproveModalOpen} onClose={() => setIsApproveModalOpen(false)}>
          <p>
            Are you sure you want to <strong>APPROVE</strong> the application for:
          </p>
          <div className="ui-card" style={{ margin: "16px 0", background: "rgba(16, 185, 129, 0.1)", border: "1px solid #10b981" }}>
            <h4>{selectedApp.applicantName}</h4>
            <p>Applied Class: {selectedApp.appliedClass} | Application ID: {selectedApp.applicationNo}</p>
          </div>
          <p style={{ fontSize: "13px", opacity: 0.8 }}>
            Approving will update the status to <strong>Approved</strong> and automatically dispatch WhatsApp & Email approval notifications to parent {selectedApp.parentName}.
          </p>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "20px" }}>
            <button className="ui-button ui-button-secondary" onClick={() => setIsApproveModalOpen(false)} disabled={actionLoading}>
              Cancel
            </button>
            <button className="ui-button ui-button-success" onClick={handleApprove} disabled={actionLoading}>
              {actionLoading ? "Approving..." : "✅ Confirm Approval"}
            </button>
          </div>
        </Modal>
      )}

      {/* REJECT CONFIRMATION MODAL */}
      {isRejectModalOpen && selectedApp && (
        <Modal title="Reject Application" isOpen={isRejectModalOpen} onClose={() => setIsRejectModalOpen(false)}>
          <p>Specify the rejection reason for <strong>{selectedApp.applicantName}</strong>:</p>
          <div style={{ margin: "16px 0" }}>
            <label className="ui-label">Preset Reason:</label>
            <select className="ui-select" value={rejectReasonPreset} onChange={(e) => setRejectReasonPreset(e.target.value)} style={{ width: "100%", marginBottom: "12px" }}>
              <option value="Incomplete documentation provided">Incomplete documentation provided</option>
              <option value="Class capacity full">Class capacity full</option>
              <option value="Age eligibility criteria not met">Age eligibility criteria not met</option>
              <option value="Did not meet admission evaluation criteria">Did not meet admission evaluation criteria</option>
              <option value="Other">Other (Custom reason below)</option>
            </select>

            {rejectReasonPreset === "Other" && (
              <textarea
                className="ui-input"
                rows="3"
                placeholder="Enter custom rejection reason..."
                value={customRejectReason}
                onChange={(e) => setCustomRejectReason(e.target.value)}
                style={{ width: "100%" }}
              />
            )}
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <button className="ui-button ui-button-secondary" onClick={() => setIsRejectModalOpen(false)} disabled={actionLoading}>
              Cancel
            </button>
            <button className="ui-button ui-button-danger" onClick={handleReject} disabled={actionLoading}>
              {actionLoading ? "Rejecting..." : "❌ Confirm Rejection"}
            </button>
          </div>
        </Modal>
      )}

      {/* REQUEST DOCUMENTS MODAL */}
      {isReqDocsModalOpen && selectedApp && (
        <Modal title="Request Documents / Info" isOpen={isReqDocsModalOpen} onClose={() => setIsReqDocsModalOpen(false)}>
          <p>Send document request to parent <strong>{selectedApp.parentName}</strong> ({selectedApp.parentPhone}):</p>
          <div style={{ margin: "16px 0" }}>
            <label className="ui-label">Required Document Names:</label>
            <input type="text" className="ui-input" value={reqDocsList} onChange={(e) => setReqDocsList(e.target.value)} style={{ width: "100%", marginBottom: "12px" }} />

            <label className="ui-label">Admin Instructions / Reason:</label>
            <textarea className="ui-input" rows="3" value={reqDocsReason} onChange={(e) => setReqDocsReason(e.target.value)} style={{ width: "100%" }} />
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <button className="ui-button ui-button-secondary" onClick={() => setIsReqDocsModalOpen(false)} disabled={actionLoading}>
              Cancel
            </button>
            <button className="ui-button ui-button-primary" onClick={handleRequestDocs} disabled={actionLoading}>
              {actionLoading ? "Sending Request..." : "📲 Send Document Request"}
            </button>
          </div>
        </Modal>
      )}

      {/* CONFIRM ADMISSION MODAL */}
      {isConfirmAdmissionModalOpen && selectedApp && (
        <Modal title="Confirm Official School Admission" isOpen={isConfirmAdmissionModalOpen} onClose={() => setIsConfirmAdmissionModalOpen(false)}>
          <p>You are about to officially enroll student <strong>{selectedApp.applicantName}</strong> into MPSA School!</p>
          <div className="ui-card" style={{ margin: "16px 0", background: "rgba(6, 182, 212, 0.1)", border: "1px solid #06b6d4" }}>
            <h4>Student: {selectedApp.applicantName}</h4>
            <p>Class: {selectedApp.appliedClass} | Parent: {selectedApp.parentName} ({selectedApp.parentPhone})</p>
            <p style={{ color: "#38bdf8", marginTop: "8px", fontSize: "13px" }}>
              ⚡ Next available unique admission number (e.g. MPSA-2026-00N) will be assigned atomically.
            </p>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <button className="ui-button ui-button-secondary" onClick={() => setIsConfirmAdmissionModalOpen(false)} disabled={actionLoading}>
              Cancel
            </button>
            <button className="ui-button ui-button-primary" onClick={handleConfirmAdmission} disabled={actionLoading}>
              {actionLoading ? "Admitting Student..." : "🎓 Confirm Admission & Create Student"}
            </button>
          </div>
        </Modal>
      )}

      {/* ADD DOCUMENT MODAL */}
      {isAddDocModalOpen && (
        <Modal title="Add Document Reference" isOpen={isAddDocModalOpen} onClose={() => setIsAddDocModalOpen(false)}>
          <form onSubmit={handleAddDocument}>
            <div style={{ marginBottom: "12px" }}>
              <label className="ui-label">Document Name:</label>
              <input type="text" className="ui-input" required placeholder="e.g. Student Aadhaar Card" value={newDocData.name} onChange={(e) => setNewDocData({ ...newDocData, name: e.target.value })} style={{ width: "100%" }} />
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label className="ui-label">Document Type:</label>
              <select className="ui-select" value={newDocData.type} onChange={(e) => setNewDocData({ ...newDocData, type: e.target.value })} style={{ width: "100%" }}>
                <option value="Aadhaar Card">Aadhaar Card</option>
                <option value="Birth Certificate">Birth Certificate</option>
                <option value="Passport Photo">Passport Photo</option>
                <option value="Transfer Certificate (TC)">Transfer Certificate (TC)</option>
                <option value="Previous Marksheet">Previous Marksheet</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div style={{ marginBottom: "12px" }}>
              <label className="ui-label">File / Image URL (Optional):</label>
              <input type="text" className="ui-input" placeholder="https://..." value={newDocData.fileUrl} onChange={(e) => setNewDocData({ ...newDocData, fileUrl: e.target.value })} style={{ width: "100%" }} />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "16px" }}>
              <button type="button" className="ui-button ui-button-secondary" onClick={() => setIsAddDocModalOpen(false)} disabled={actionLoading}>
                Cancel
              </button>
              <button type="submit" className="ui-button ui-button-primary" disabled={actionLoading}>
                {actionLoading ? "Saving..." : "Add Document"}
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}

export default OnlineApplicants;
