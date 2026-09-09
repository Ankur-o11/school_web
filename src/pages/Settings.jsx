import { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import "../Style/ui.css";

export function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaved, setIsSaved] = useState(false);

  const [settings, setSettings] = useState({
    schoolName: "MPSA Senior Secondary School",
    affiliationNo: "CBSE-40912",
    contactEmail: "admin@mpsa.edu.in",
    contactPhone: "+91 11 2345 6789",
    address: "Plot 12, Education Hub, New Delhi, India",
    currentSession: "2026-2027",
    minAttendancePct: 75,
    feeReceiptPrefix: "MPSA-REC",
    lateFeePerDay: 50,
    enableWhatsAppAlerts: true,
    maintenanceMode: false
  });

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div style={{ padding: "24px" }}>
      <PageHeader
        breadcrumb="System"
        title="School ERP Settings"
        description="Configure school profile, academic sessions, fee receipt defaults, and system preferences."
        icon="⚙️"
        primaryAction={{
          label: "Save Settings",
          icon: "💾",
          onClick: handleSave
        }}
      />

      {isSaved && (
        <div style={{ padding: "12px 16px", background: "#dcfce7", color: "#15803d", borderRadius: "8px", marginBottom: "20px", fontWeight: "600" }}>
          ✓ Settings saved successfully!
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: "flex", gap: "10px", borderBottom: "1px solid #e2e8f0", marginBottom: "24px" }}>
        {[
          { id: "profile", label: "School Profile", icon: "🏫" },
          { id: "academic", label: "Academic Session", icon: "📅" },
          { id: "attendance", label: "Attendance Rules", icon: "📊" },
          { id: "fees", label: "Fee & Receipt Config", icon: "💰" },
          { id: "system", label: "System & Security", icon: "🔒" }
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
    </div>
  );
}

export default Settings;