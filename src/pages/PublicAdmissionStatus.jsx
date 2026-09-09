import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API_BASE_URL from "../config/api";
import "../Style/ui.css";

export default function PublicAdmissionStatus() {
  const { id } = useParams();
  const [admission, setAdmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updateMsg, setUpdateMsg] = useState(null);

  const [editForm, setEditForm] = useState({
    applicantName: "",
    parentName: "",
    parentPhone: "",
    email: "",
    address: "",
    prevSchool: "",
  });

  const fetchStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      let res = await fetch(`${API_BASE_URL}/admissions/track/${encodeURIComponent(id)}`);
      let data = await res.json();
      
      if (!data.success) {
        res = await fetch(`${API_BASE_URL}/admissions/public/${encodeURIComponent(id)}`);
        data = await res.json();
      }

      if (data.success) {
        const item = data.data || data.admission;
        setAdmission(item);
        setEditForm({
          applicantName: item.applicantName || "",
          parentName: item.parentName || "",
          parentPhone: item.parentPhone || "",
          email: item.email || "",
          address: item.address || "",
          prevSchool: item.prevSchool || "",
        });
      } else {
        setError(data.message || "Application record not found.");
      }
    } catch (err) {
      console.error("Fetch admission status error:", err);
      setError("Unable to connect to school servers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchStatus();
    }
  }, [id]);

  const handleCorrectionSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const token = admission.trackingToken || id;
      const res = await fetch(`${API_BASE_URL}/admissions/track/${encodeURIComponent(token)}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      });

      const data = await res.json();
      if (data.success) {
        setUpdateMsg("🎉 Application details updated successfully! Under review by administration.");
        setIsEditing(false);
        fetchStatus();
      } else {
        alert(data.message || "Failed to update details.");
      }
    } catch (err) {
      console.error("Correction submit error:", err);
      alert("Error updating application.");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: "Submitted", status: "Submitted" },
    { label: "Documents & Fees", status: "Under Review" },
    { label: "Review & Correction", status: "Correction Required" },
    { label: "Confirmed", status: "Confirmed" },
  ];

  const getStepState = (stepStatus) => {
    if (!admission) return "pending";
    const current = admission.status;
    if (current === "Rejected") return stepStatus === "Submitted" ? "completed" : "rejected";

    const order = ["Submitted", "Under Review", "Correction Required", "Ready for Confirmation", "Confirmed"];
    const normalizedCurrent = current === "Approved" ? "Confirmed" : current;

    if (normalizedCurrent === stepStatus) return "active";
    if (order.indexOf(normalizedCurrent) > order.indexOf(stepStatus)) return "completed";
    return "pending";
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f4f6f9",
      padding: "20px 16px",
      fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    }}>
      <div style={{
        maxWidth: "680px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
        overflow: "hidden"
      }}>
        {/* Header */}
        <div style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)",
          color: "#ffffff",
          padding: "24px 20px",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "36px", marginBottom: "8px" }}>🎓</div>
          <h1 style={{ margin: 0, fontSize: "22px", fontWeight: "700" }}>MPSA Public School</h1>
          <p style={{ margin: "4px 0 0 0", opacity: 0.9, fontSize: "14px" }}>Admission Application Status Tracker</p>
        </div>

        <div style={{ padding: "24px 20px" }}>
          {loading && !admission && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div className="spinner" style={{ margin: "0 auto 16px" }}></div>
              <p style={{ color: "#64748b" }}>Fetching application details...</p>
            </div>
          )}

          {error && !loading && (
            <div style={{
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              color: "#991b1b",
              padding: "16px",
              borderRadius: "10px",
              textAlign: "center"
            }}>
              <p style={{ margin: "0 0 12px 0", fontWeight: "600" }}>⚠️ {error}</p>
              <button onClick={fetchStatus} className="ui-btn ui-btn-primary" style={{ fontSize: "13px" }}>
                Retry
              </button>
            </div>
          )}

          {updateMsg && (
            <div style={{
              backgroundColor: "#f0fdf4",
              border: "1px solid #bbf7d0",
              color: "#166534",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "16px"
            }}>
              {updateMsg}
            </div>
          )}

          {admission && (
            <>
              {/* Application Summary Card */}
              <div style={{
                backgroundColor: "#f8fafc",
                borderRadius: "12px",
                padding: "16px",
                border: "1px solid #e2e8f0",
                marginBottom: "24px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
                  <div>
                    <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: "700" }}>Application ID (Immutable)</span>
                    <p style={{ margin: "2px 0 0 0", fontWeight: "800", fontSize: "16px", color: "#1e3a8a" }}>
                      {admission.applicationId || admission.applicationNo}
                    </p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", fontWeight: "700" }}>Source</span>
                    <p style={{ margin: "2px 0 0 0", fontWeight: "600", fontSize: "13px", color: "#475569" }}>
                      {admission.source ? admission.source.toUpperCase() : "ADMIN"}
                    </p>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))", gap: "12px" }}>
                  <div>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>Applicant Name</span>
                    <p style={{ margin: "2px 0 0 0", fontWeight: "600", color: "#0f172a" }}>{admission.applicantName}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>Applied Class</span>
                    <p style={{ margin: "2px 0 0 0", fontWeight: "600", color: "#0f172a" }}>{admission.appliedClass}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>Parent / Guardian</span>
                    <p style={{ margin: "2px 0 0 0", fontWeight: "600", color: "#0f172a" }}>{admission.parentName}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>Application Date</span>
                    <p style={{ margin: "2px 0 0 0", fontWeight: "600", color: "#0f172a" }}>{admission.appliedDate}</p>
                  </div>
                </div>
              </div>

              {/* Status Tracker */}
              <div style={{ marginBottom: "24px" }}>
                <h3 style={{ fontSize: "15px", fontWeight: "600", color: "#1e293b", marginBottom: "16px" }}>Application Progress</h3>
                <div style={{ display: "flex", justifyContent: "space-between", position: "relative" }}>
                  {steps.map((step, idx) => {
                    const st = getStepState(step.status);
                    let circleBg = "#e2e8f0";
                    let circleColor = "#64748b";
                    if (st === "completed") { circleBg = "#10b981"; circleColor = "#ffffff"; }
                    else if (st === "active") { circleBg = "#3b82f6"; circleColor = "#ffffff"; }
                    else if (st === "rejected") { circleBg = "#ef4444"; circleColor = "#ffffff"; }

                    return (
                      <div key={idx} style={{ flex: 1, textAlign: "center", position: "relative", zIndex: 1 }}>
                        <div style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "50%",
                          backgroundColor: circleBg,
                          color: circleColor,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: "700",
                          fontSize: "14px",
                          margin: "0 auto 8px"
                        }}>
                          {st === "completed" ? "✓" : idx + 1}
                        </div>
                        <span style={{ fontSize: "12px", fontWeight: st === "active" ? "700" : "500", color: st === "active" ? "#1e3a8a" : "#64748b" }}>
                          {step.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Correction Required Warning & Form */}
              {admission.correctionRequired && (
                <div style={{
                  backgroundColor: "#fffbebf5",
                  border: "1px solid #fde68a",
                  borderRadius: "12px",
                  padding: "16px",
                  marginBottom: "24px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "20px" }}>⚠️</span>
                    <h4 style={{ margin: 0, fontSize: "15px", color: "#92400e", fontWeight: "700" }}>
                      Correction Required by School Admin
                    </h4>
                  </div>
                  <p style={{ margin: "0 0 12px 0", fontSize: "13px", color: "#78350f", backgroundColor: "#fef3c7", padding: "10px", borderRadius: "6px" }}>
                    <strong>Admin Note:</strong> {admission.correctionNotes || "Please review and update application details."}
                  </p>

                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="ui-btn ui-btn-primary"
                      style={{ backgroundColor: "#d97706", fontSize: "13px" }}
                    >
                      ✏️ Edit & Resubmit Application
                    </button>
                  ) : (
                    <form onSubmit={handleCorrectionSubmit} style={{ marginTop: "12px" }}>
                      <div className="ui-form-row">
                        <div className="ui-form-group">
                          <label>Applicant Name</label>
                          <input
                            type="text"
                            className="ui-form-control"
                            value={editForm.applicantName}
                            onChange={(e) => setEditForm({ ...editForm, applicantName: e.target.value })}
                          />
                        </div>
                        <div className="ui-form-group">
                          <label>Parent Name</label>
                          <input
                            type="text"
                            className="ui-form-control"
                            value={editForm.parentName}
                            onChange={(e) => setEditForm({ ...editForm, parentName: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="ui-form-row">
                        <div className="ui-form-group">
                          <label>Parent Mobile</label>
                          <input
                            type="text"
                            className="ui-form-control"
                            value={editForm.parentPhone}
                            onChange={(e) => setEditForm({ ...editForm, parentPhone: e.target.value })}
                          />
                        </div>
                        <div className="ui-form-group">
                          <label>Email</label>
                          <input
                            type="email"
                            className="ui-form-control"
                            value={editForm.email}
                            onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          />
                        </div>
                      </div>
                      <div className="ui-form-group">
                        <label>Residential Address</label>
                        <input
                          type="text"
                          className="ui-form-control"
                          value={editForm.address}
                          onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                        />
                      </div>
                      <div style={{ display: "flex", gap: "8px", marginTop: "12px" }}>
                        <button type="submit" className="ui-btn ui-btn-primary">Submit Correction</button>
                        <button type="button" className="ui-btn ui-btn-secondary" onClick={() => setIsEditing(false)}>Cancel</button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* Pending Items Alert Box */}
              {admission.pendingItems && admission.pendingItems.length > 0 && !admission.correctionRequired && (
                <div style={{
                  backgroundColor: "#eff6ff",
                  border: "1px solid #bfdbfe",
                  borderRadius: "12px",
                  padding: "16px",
                  marginBottom: "24px"
                }}>
                  <h4 style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#1e40af", fontWeight: "700" }}>
                    📋 Document & Fee Requirements ({admission.pendingItems.length} pending)
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "13px", color: "#1e3a8a" }}>
                    {admission.pendingItems.map((item, idx) => (
                      <li key={idx} style={{ marginBottom: "4px", fontWeight: "600" }}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Status Confirmed Box */}
              {(admission.status === "Confirmed" || admission.status === "Approved") && (
                <div style={{
                  backgroundColor: "#f0fdf4",
                  border: "1px solid #bbf7d0",
                  borderRadius: "12px",
                  padding: "16px",
                  marginBottom: "24px",
                  textAlign: "center"
                }}>
                  <span style={{ fontSize: "28px" }}>🎉</span>
                  <h4 style={{ margin: "8px 0 4px 0", fontSize: "16px", color: "#166534", fontWeight: "700" }}>
                    Admission Confirmed!
                  </h4>
                  <p style={{ margin: 0, fontSize: "13px", color: "#15803d" }}>
                    Congratulations! Student record has been activated in MPSA School Database.
                  </p>
                  {admission.createdStudentId && (
                    <div style={{ marginTop: "8px", display: "inline-block", backgroundColor: "#dcfce7", color: "#14532d", padding: "4px 12px", borderRadius: "20px", fontWeight: "700", fontSize: "13px" }}>
                      Student Reg No: {admission.createdAdmissionNo || admission.createdStudentId}
                    </div>
                  )}
                </div>
              )}

              {/* Refresh Footer */}
              <div style={{ textAlign: "center", marginTop: "20px" }}>
                <button
                  onClick={fetchStatus}
                  style={{
                    background: "none",
                    border: "none",
                    color: "#3b82f6",
                    fontWeight: "600",
                    fontSize: "13px",
                    cursor: "pointer",
                    textDecoration: "underline"
                  }}
                >
                  🔄 Refresh Live Status
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
