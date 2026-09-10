import { useState, useEffect } from "react";
import PageHeader from "../components/ui/PageHeader";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL from "../config/api";
import "../Style/ui.css";

export function Settings() {
  const { fetchWithAuth } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaved, setIsSaved] = useState(false);

  // General Settings
  const [settings, setSettings] = useState({
    schoolName: "MPSA Inter College",
    affiliationNo: "CBSE-40912",
    contactEmail: "admissions@mpsa.com",
    contactPhone: "+91 90265 90221",
    address: "MPSA School Campus, Uttar Pradesh, India",
    currentSession: "2026-2027",
    minAttendancePct: 75,
    feeReceiptPrefix: "MPSA-REC",
    lateFeePerDay: 50,
    enableWhatsAppAlerts: true,
    maintenanceMode: false,
  });

  // Notification Templates State
  const [templates, setTemplates] = useState([]);
  const [selectedTemplateKey, setSelectedTemplateKey] = useState("app_received_whatsapp");
  const [templateForm, setTemplateForm] = useState({ subject: "", body: "" });
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [saveTemplateLoading, setSaveTemplateLoading] = useState(false);
  const [templateSuccess, setTemplateSuccess] = useState(null);

  // Fetch Templates
  const fetchTemplates = async () => {
    try {
      setLoadingTemplates(true);
      const res = await fetchWithAuth(`${API_BASE_URL}/communication-templates`);
      const data = await res.json();
      if (data.success) {
        setTemplates(data.templates || []);
        const current = (data.templates || []).find((t) => t.key === selectedTemplateKey);
        if (current) {
          setTemplateForm({ subject: current.subject || "", body: current.body || "" });
        }
      }
    } catch (err) {
      console.error("Fetch templates error:", err);
    } finally {
      setLoadingTemplates(false);
    }
  };

  useEffect(() => {
    if (activeTab === "templates") {
      fetchTemplates();
    }
  }, [activeTab]);

  const handleSelectTemplate = (key) => {
    setSelectedTemplateKey(key);
    const tpl = templates.find((t) => t.key === key);
    if (tpl) {
      setTemplateForm({ subject: tpl.subject || "", body: tpl.body || "" });
    }
  };

  const handleSaveTemplate = async (e) => {
    e.preventDefault();
    try {
      setSaveTemplateLoading(true);
      const res = await fetchWithAuth(`${API_BASE_URL}/communication-templates/${selectedTemplateKey}`, {
        method: "PUT",
        body: JSON.stringify(templateForm),
      });
      const data = await res.json();
      if (data.success) {
        setTemplateSuccess("Template saved and updated successfully!");
        setTimeout(() => setTemplateSuccess(null), 3000);
        fetchTemplates();
      } else {
        alert(data.message || "Failed to save template.");
      }
    } catch (err) {
      alert("Error saving template.");
    } finally {
      setSaveTemplateLoading(false);
    }
  };

  const handleResetTemplate = async () => {
    if (!window.confirm("Are you sure you want to reset this template to default wording?")) return;
    try {
      setSaveTemplateLoading(true);
      const res = await fetchWithAuth(`${API_BASE_URL}/communication-templates/${selectedTemplateKey}/reset`, {
        method: "POST",
      });
      const data = await res.json();
      if (data.success) {
        setTemplateSuccess("Template reset to default.");
        setTimeout(() => setTemplateSuccess(null), 3000);
        fetchTemplates();
      }
    } catch (err) {
      alert("Error resetting template.");
    } finally {
      setSaveTemplateLoading(false);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const activeTemplateObj = templates.find((t) => t.key === selectedTemplateKey);

  return (
    <div style={{ padding: "24px" }}>
      <PageHeader
        breadcrumb="System"
        title="School ERP Settings"
        description="Configure school profile, academic sessions, fee receipt defaults, and notification templates."
        icon="⚙️"
        primaryAction={{
          label: "Save Settings",
          icon: "💾",
          onClick: handleSave,
        }}
      />

      {isSaved && (
        <div style={{ padding: "12px 16px", background: "#dcfce7", color: "#15803d", borderRadius: "8px", marginBottom: "20px", fontWeight: "600" }}>
          ✓ Settings saved successfully!
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: "10px", borderBottom: "1px solid #e2e8f0", marginBottom: "24px", flexWrap: "wrap" }}>
        {[
          { id: "profile", label: "School Profile", icon: "🏫" },
          { id: "templates", label: "Notification Templates (WhatsApp / Email)", icon: "💬" },
          { id: "academic", label: "Academic Session", icon: "📅" },
          { id: "attendance", label: "Attendance Rules", icon: "📊" },
          { id: "fees", label: "Fee & Receipt Config", icon: "💰" },
          { id: "system", label: "System & Security", icon: "🔒" },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={`ui-btn ${activeTab === tab.id ? "ui-btn-primary" : "ui-btn-secondary"}`}
            style={{ borderRadius: "8px 8px 0 0", borderBottom: activeTab === tab.id ? "2px solid #2563eb" : "none" }}
            onClick={() => setActiveTab(tab.id)}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB: NOTIFICATION TEMPLATES */}
      {activeTab === "templates" ? (
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "24px" }}>
          {/* Template List */}
          <div style={{ background: "#ffffff", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            <h4 style={{ margin: "0 0 12px 0", fontSize: "14px", color: "#475569" }}>10 Standard System Templates</h4>
            {loadingTemplates ? (
              <p>Loading templates...</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                {templates.map((tpl) => (
                  <button
                    key={tpl.key}
                    type="button"
                    onClick={() => handleSelectTemplate(tpl.key)}
                    style={{
                      textAlign: "left",
                      padding: "10px 12px",
                      borderRadius: "8px",
                      border: "1px solid",
                      borderColor: selectedTemplateKey === tpl.key ? "#2563eb" : "#e2e8f0",
                      backgroundColor: selectedTemplateKey === tpl.key ? "#eff6ff" : "#f8fafc",
                      color: selectedTemplateKey === tpl.key ? "#1e40af" : "#1e293b",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: selectedTemplateKey === tpl.key ? "600" : "normal",
                    }}
                  >
                    <div>{tpl.channel === "WhatsApp" ? "📱" : "📧"} {tpl.name}</div>
                    {tpl.isCustomized && <span style={{ fontSize: "10px", color: "#059669", marginTop: "2px", display: "block" }}>Customized</span>}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Template Editor */}
          <div style={{ background: "#ffffff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
            {templateSuccess && (
              <div style={{ padding: "10px 14px", background: "#dcfce7", color: "#15803d", borderRadius: "6px", marginBottom: "16px", fontSize: "13px" }}>
                {templateSuccess}
              </div>
            )}

            {activeTemplateObj && (
              <form onSubmit={handleSaveTemplate}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <div>
                    <h3 style={{ margin: 0, color: "#0f172a" }}>{activeTemplateObj.name}</h3>
                    <span style={{ fontSize: "12px", color: "#64748b" }}>
                      Trigger: {activeTemplateObj.trigger} | Channel: {activeTemplateObj.channel}
                    </span>
                  </div>

                  <button type="button" onClick={handleResetTemplate} className="ui-btn ui-btn-secondary" style={{ fontSize: "12px" }}>
                    🔄 Reset to Default
                  </button>
                </div>

                {activeTemplateObj.channel === "Email" && (
                  <div className="ui-form-group" style={{ marginBottom: "16px" }}>
                    <label>Email Subject Line *</label>
                    <input
                      type="text"
                      className="ui-form-control"
                      value={templateForm.subject}
                      onChange={(e) => setTemplateForm({ ...templateForm, subject: e.target.value })}
                      required
                    />
                  </div>
                )}

                <div className="ui-form-group" style={{ marginBottom: "16px" }}>
                  <label>Message Content Body *</label>
                  <textarea
                    className="ui-form-control"
                    rows="8"
                    value={templateForm.body}
                    onChange={(e) => setTemplateForm({ ...templateForm, body: e.target.value })}
                    required
                  />
                </div>

                {/* Available Variables Guide */}
                <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "20px" }}>
                  <strong style={{ fontSize: "12px", color: "#475569", display: "block", marginBottom: "6px" }}>
                    💡 Supported Variable Placeholders:
                  </strong>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", fontSize: "11px" }}>
                    {["{{studentName}}", "{{parentName}}", "{{applicationId}}", "{{admissionNo}}", "{{className}}", "{{section}}", "{{schoolName}}", "{{submissionDate}}", "{{approvalDate}}", "{{reason}}", "{{documentList}}", "{{remarks}}", "{{applicationLink}}", "{{schoolPhone}}", "{{schoolEmail}}"].map((v) => (
                      <code key={v} style={{ background: "#e2e8f0", padding: "2px 6px", borderRadius: "4px", color: "#0f172a" }}>{v}</code>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                  <button type="submit" disabled={saveTemplateLoading} className="ui-btn ui-btn-primary">
                    {saveTemplateLoading ? "Saving Template..." : "💾 Save Template"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : (
        /* GENERAL SETTINGS FORMS */
        <div style={{ background: "#ffffff", padding: "24px", borderRadius: "12px", border: "1px solid #e2e8f0", maxWidth: "800px" }}>
          <form onSubmit={handleSave}>
            {activeTab === "profile" && (
              <div>
                <h3 style={{ margin: "0 0 16px 0", color: "var(--text-main)" }}>School Profile Information</h3>
                <div className="ui-form-group">
                  <label>Official School Name *</label>
                  <input
                    type="text"
                    className="ui-form-control"
                    value={settings.schoolName}
                    onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })}
                    required
                  />
                </div>

                <div className="ui-form-row">
                  <div className="ui-form-group">
                    <label>CBSE / State Affiliation Number</label>
                    <input
                      type="text"
                      className="ui-form-control"
                      value={settings.affiliationNo}
                      onChange={(e) => setSettings({ ...settings, affiliationNo: e.target.value })}
                    />
                  </div>
                  <div className="ui-form-group">
                    <label>Admin Contact Email *</label>
                    <input
                      type="email"
                      className="ui-form-control"
                      value={settings.contactEmail}
                      onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="ui-form-row">
                  <div className="ui-form-group">
                    <label>Contact Phone Number</label>
                    <input
                      type="text"
                      className="ui-form-control"
                      value={settings.contactPhone}
                      onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                    />
                  </div>
                  <div className="ui-form-group">
                    <label>School Campus Address</label>
                    <input
                      type="text"
                      className="ui-form-control"
                      value={settings.address}
                      onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "academic" && (
              <div>
                <h3 style={{ margin: "0 0 16px 0", color: "var(--text-main)" }}>Academic Session & Term Configurations</h3>
                <div className="ui-form-row">
                  <div className="ui-form-group">
                    <label>Current Active Academic Session</label>
                    <select
                      className="ui-form-control"
                      value={settings.currentSession}
                      onChange={(e) => setSettings({ ...settings, currentSession: e.target.value })}
                    >
                      <option value="2025-2026">2025 - 2026</option>
                      <option value="2026-2027">2026 - 2027 (Active)</option>
                      <option value="2027-2028">2027 - 2028</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "attendance" && (
              <div>
                <h3 style={{ margin: "0 0 16px 0", color: "var(--text-main)" }}>Attendance Policies</h3>
                <div className="ui-form-group">
                  <label>Minimum Required Attendance Percentage (%)</label>
                  <input
                    type="number"
                    className="ui-form-control"
                    value={settings.minAttendancePct}
                    onChange={(e) => setSettings({ ...settings, minAttendancePct: e.target.value })}
                  />
                </div>
              </div>
            )}

            {activeTab === "fees" && (
              <div>
                <h3 style={{ margin: "0 0 16px 0", color: "var(--text-main)" }}>Fee Receipt Defaults & Fines</h3>
                <div className="ui-form-row">
                  <div className="ui-form-group">
                    <label>Fee Receipt Number Prefix</label>
                    <input
                      type="text"
                      className="ui-form-control"
                      value={settings.feeReceiptPrefix}
                      onChange={(e) => setSettings({ ...settings, feeReceiptPrefix: e.target.value })}
                    />
                  </div>
                  <div className="ui-form-group">
                    <label>Overdue Daily Fine (₹)</label>
                    <input
                      type="number"
                      className="ui-form-control"
                      value={settings.lateFeePerDay}
                      onChange={(e) => setSettings({ ...settings, lateFeePerDay: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === "system" && (
              <div>
                <h3 style={{ margin: "0 0 16px 0", color: "var(--text-main)" }}>System & Automation Preferences</h3>
                <div className="ui-form-group">
                  <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={settings.enableWhatsAppAlerts}
                      onChange={(e) => setSettings({ ...settings, enableWhatsAppAlerts: e.target.checked })}
                    />
                    <span>Enable Automatic WhatsApp Attendance & Fee Alerts</span>
                  </label>
                </div>
              </div>
            )}

            <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid #e2e8f0", display: "flex", justifyContent: "flex-end" }}>
              <button className="ui-btn ui-btn-primary" type="submit">
                Save Settings
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default Settings;