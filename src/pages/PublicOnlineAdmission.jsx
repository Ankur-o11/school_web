import React, { useState } from "react";
import { Link } from "react-router-dom";
import API_BASE_URL from "../config/api";
import "../Style/ui.css";

export default function PublicOnlineAdmission() {
  const [submittedApp, setSubmittedApp] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    applicantName: "",
    gender: "Male",
    dob: "",
    appliedClass: "Class 1",
    academicSession: `${new Date().getFullYear()}-${new Date().getFullYear() + 1}`,
    parentName: "",
    parentPhone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    prevSchool: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.applicantName || !formData.parentName || !formData.parentPhone) {
      alert("Please fill in all required fields marked with *.");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/admissions/online`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedApp({
          ...data.data,
          trackingLink: data.trackingLink || `${window.location.origin}/admission-status/${data.data.trackingToken}`,
        });
      } else {
        setError(data.message || "Failed to submit online application.");
      }
    } catch (err) {
      console.error("Online admission error:", err);
      setError("Unable to connect to school server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f4f6f9",
      padding: "24px 16px",
      fontFamily: "Inter, system-ui, -apple-system, sans-serif"
    }}>
      <div style={{
        maxWidth: "760px",
        margin: "0 auto",
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        overflow: "hidden"
      }}>
        {/* Branding Header */}
        <div style={{
          background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%)",
          color: "#ffffff",
          padding: "28px 24px",
          textAlign: "center"
        }}>
          <div style={{ fontSize: "40px", marginBottom: "8px" }}>🎓</div>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "700" }}>MPSA Public School</h1>
          <p style={{ margin: "6px 0 0 0", opacity: 0.9, fontSize: "14px" }}>
            Online Student Admission Portal (Academic Session {new Date().getFullYear()}-{new Date().getFullYear() + 1})
          </p>
        </div>

        <div style={{ padding: "28px 24px" }}>
          {submittedApp ? (
            /* Confirmation Screen */
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>🎉</div>
              <h2 style={{ color: "#166534", margin: "0 0 8px 0", fontSize: "22px", fontWeight: "700" }}>
                Application Submitted Successfully!
              </h2>
              <p style={{ color: "#475569", fontSize: "14px", margin: "0 0 24px 0" }}>
                Thank you for applying to MPSA Public School. Please save your immutable Application ID and tracking link.
              </p>

              <div style={{
                backgroundColor: "#f8fafc",
                borderRadius: "12px",
                padding: "20px",
                border: "1px solid #e2e8f0",
                marginBottom: "24px",
                textAlign: "left"
              }}>
                <div style={{ marginBottom: "12px" }}>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>Application ID (Immutable)</span>
                  <p style={{ margin: "2px 0 0 0", fontWeight: "800", fontSize: "18px", color: "#1e3a8a" }}>
                    {submittedApp.applicationId || submittedApp.applicationNo}
                  </p>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "12px", marginBottom: "16px" }}>
                  <div>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>Applicant Name</span>
                    <p style={{ margin: "2px 0 0 0", fontWeight: "600", color: "#0f172a" }}>{submittedApp.applicantName}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>Applying Class</span>
                    <p style={{ margin: "2px 0 0 0", fontWeight: "600", color: "#0f172a" }}>{submittedApp.appliedClass}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>Parent / Guardian</span>
                    <p style={{ margin: "2px 0 0 0", fontWeight: "600", color: "#0f172a" }}>{submittedApp.parentName}</p>
                  </div>
                  <div>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>Status</span>
                    <p style={{ margin: "2px 0 0 0", fontWeight: "700", color: "#2563eb" }}>{submittedApp.status}</p>
                  </div>
                </div>

                <div style={{ borderTop: "1px dashed #cbd5e1", paddingTop: "12px" }}>
                  <span style={{ fontSize: "12px", color: "#64748b" }}>Secure Tracking Link</span>
                  <p style={{ margin: "4px 0 0 0" }}>
                    <a
                      href={submittedApp.trackingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "#2563eb", fontWeight: "600", wordBreak: "break-all", fontSize: "13px" }}
                    >
                      {submittedApp.trackingLink}
                    </a>
                  </p>
                </div>
              </div>

              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                <a
                  href={submittedApp.trackingLink}
                  className="ui-btn ui-btn-primary"
                  style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px" }}
                >
                  🔗 Open Tracking Portal
                </a>
                <button
                  onClick={() => setSubmittedApp(null)}
                  className="ui-btn ui-btn-secondary"
                >
                  Submit Another Application
                </button>
              </div>
            </div>
          ) : (
            /* Online Registration Form */
            <form onSubmit={handleSubmit}>
              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", margin: "0 0 16px 0" }}>
                Student & Academic Information
              </h3>

              {error && (
                <div style={{
                  backgroundColor: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#991b1b",
                  padding: "12px 16px",
                  borderRadius: "8px",
                  marginBottom: "20px"
                }}>
                  ⚠️ {error}
                </div>
              )}

              <div className="ui-form-row">
                <div className="ui-form-group">
                  <label>Student Full Name *</label>
                  <input
                    type="text"
                    className="ui-form-control"
                    placeholder="Enter applicant's full name"
                    value={formData.applicantName}
                    onChange={(e) => setFormData({ ...formData, applicantName: e.target.value })}
                    required
                  />
                </div>
                <div className="ui-form-group">
                  <label>Gender *</label>
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
                  <label>Date of Birth *</label>
                  <input
                    type="date"
                    className="ui-form-control"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
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

              <div className="ui-form-group">
                <label>Previous Institution / School Attended</label>
                <input
                  type="text"
                  className="ui-form-control"
                  placeholder="Previous school name (Leave blank if Nursery/PG)"
                  value={formData.prevSchool}
                  onChange={(e) => setFormData({ ...formData, prevSchool: e.target.value })}
                />
              </div>

              <hr style={{ border: "none", borderTop: "1px solid #e2e8f0", margin: "24px 0" }} />

              <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", margin: "0 0 16px 0" }}>
                Parent & Contact Details
              </h3>

              <div className="ui-form-row">
                <div className="ui-form-group">
                  <label>Parent / Guardian Full Name *</label>
                  <input
                    type="text"
                    className="ui-form-control"
                    placeholder="Father / Mother / Guardian Name"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    required
                  />
                </div>
                <div className="ui-form-group">
                  <label>Parent WhatsApp / Mobile No *</label>
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
                  <label>Email Address</label>
                  <input
                    type="email"
                    className="ui-form-control"
                    placeholder="parent@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
                <div className="ui-form-group">
                  <label>Residential Address *</label>
                  <input
                    type="text"
                    className="ui-form-control"
                    placeholder="House / Street / Colony"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="ui-form-row">
                <div className="ui-form-group">
                  <label>City</label>
                  <input
                    type="text"
                    className="ui-form-control"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="ui-form-group">
                  <label>State</label>
                  <input
                    type="text"
                    className="ui-form-control"
                    placeholder="State"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ marginTop: "28px" }}>
                <button
                  type="submit"
                  disabled={loading}
                  className="ui-btn ui-btn-primary"
                  style={{ width: "100%", padding: "12px", fontSize: "15px", fontWeight: "700" }}
                >
                  {loading ? "Submitting Application..." : "Submit Online Application"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
