import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API_BASE_URL from "../config/api";
import "../Style/ui.css";

export default function PublicAdmissionStatus() {
  const { id } = useParams();
  const [admission, setAdmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/admissions/public/${encodeURIComponent(id)}`);
      const data = await res.json();
      if (data.success) {
        setAdmission(data.data);
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

  const steps = [
    { label: "Submitted", status: "Submitted" },
    { label: "Documents & Fees", status: "Document Verification" },
    { label: "Under Review", status: "Under Review" },
    { label: "Confirmed", status: "Confirmed" },
  ];

  const getStepState = (stepStatus) => {
    if (!admission) return "pending";
    const current = admission.status;
    if (current === "Rejected") return stepStatus === "Submitted" ? "completed" : "rejected";
    
    const order = ["Submitted", "Pending", "Under Review", "Confirmed"];
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
          <p style={{ margin: "4px 0 0 0", opacity: 0.9, fontSize: "14px" }}>Admission Application Status</p>
        </div>

        <div style={{ padding: "24px 20px" }}>
          {loading && (
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
              <button
                onClick={fetchStatus}
                className="ui-btn ui-btn-primary"
                style={{ fontSize: "13px" }}
              >
                Retry
              </button>
            </div>
          )}

          {admission && !loading && (
            <>
              {/* Application Details Summary */}
              <div style={{
                backgroundColor: "#f8fafc",
                borderRadius: "12px",
                padding: "16px",
                border: "1px solid #e2e8f0",
                marginBottom: "24px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
                  <span style={{ fontSize: "13px", color: "#64748b" }}>Application ID</span>
                  <span style={{ fontWeight: "700", fontSize: "15px", color: "#1e293b" }}>{admission.id}</span>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "12px" }}>
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
                          margin: "0 auto 8px",
                          transition: "all 0.3s ease"
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

              {/* Pending Items Alert Box */}
              {admission.pendingItems && admission.pendingItems.length > 0 && (
                <div style={{
                  backgroundColor: "#fffbebf5",
                  border: "1px solid #fde68a",
                  borderRadius: "12px",
                  padding: "16px",
                  marginBottom: "24px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <span style={{ fontSize: "18px" }}>⚠️</span>
                    <h4 style={{ margin: 0, fontSize: "15px", color: "#92400e", fontWeight: "700" }}>
                      Pending Action Required ({admission.pendingItems.length} items missing)
                    </h4>
                  </div>
                  <p style={{ margin: "0 0 10px 0", fontSize: "13px", color: "#78350f" }}>
                    Please submit or pay the following pending verification requirements to complete admission:
                  </p>
                  <ul style={{ margin: 0, paddingLeft: "20px", fontSize: "13px", color: "#92400e" }}>
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
                      Student Reg No: {admission.createdStudentId}
                    </div>
                  )}
                </div>
              )}

              {/* Verification Checklist Detail */}
              <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", border: "1px solid #e2e8f0", padding: "16px" }}>
                <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "600", color: "#1e293b" }}>
                  Document & Fee Verification Status
                </h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {Object.entries(admission.checklist || {}).map(([key, val]) => {
                    const labelMap = {
                      birthCertificate: "Birth Certificate",
                      aadhaarCard: "Aadhaar Card",
                      photo: "Passport Size Photograph",
                      transferCertificate: "Transfer Certificate (TC)",
                      registrationFeePaid: "Registration Fee Payment"
                    };
                    const title = labelMap[key] || key;
                    const isDone = Boolean(val);

                    return (
                      <div key={key} style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "10px 12px",
                        borderRadius: "8px",
                        backgroundColor: isDone ? "#f0fdf4" : "#fef2f2",
                        border: `1px solid ${isDone ? "#dcfce7" : "#fecaca"}`
                      }}>
                        <span style={{ fontSize: "13px", fontWeight: "500", color: isDone ? "#166534" : "#991b1b" }}>
                          {title}
                        </span>
                        <span style={{
                          fontSize: "12px",
                          fontWeight: "700",
                          color: isDone ? "#15803d" : "#dc2626",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        }}>
                          {isDone ? "✓ Verified" : "⏳ Pending"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Footer Refresh */}
              <div style={{ marginTop: "24px", textAlign: "center" }}>
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
                  🔄 Refresh Status
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
