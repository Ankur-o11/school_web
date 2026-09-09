import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  normalizePhoneNumber,
  generateWhatsAppLink,
  compileTemplate,
} from "../services/whatsappService";
import "../Style/whatsapp-modal.css";

const DEFAULT_TEMPLATES = {
  "Attendance Reminder": `Dear Parent/Guardian,

This is a reminder regarding the attendance of your ward {{studentName}}.

Current Attendance: {{attendancePercentage}}%
Class & Section: {{classSection}}
Total Working Days: {{totalWorkingDays}}
Present: {{presentDays}} | Absent: {{absentDays}}

Please ensure regular attendance.

Regards,
{{schoolName}}`,

  "Low Attendance Alert": `Dear Parent/Guardian,

⚠️ ATTENDANCE WARNING for {{studentName}} (Class {{classSection}}).

Current Attendance is LOW: {{attendancePercentage}}% (Required Minimum: 75%).
Total Working Days: {{totalWorkingDays}}
Present Days: {{presentDays}}
Absent Days: {{absentDays}}

Please contact the school administration immediately.

Regards,
{{schoolName}}`,

  "Fee Payment Reminder": `Dear Parent/Guardian,

This is a reminder that the school fee for {{studentName}}, Class {{classSection}}, is pending.

Pending Amount: ₹{{pendingAmount}}
Total Fee: ₹{{totalFee}}
Paid Amount: ₹{{paidAmount}}
Due Date: {{dueDate}}

Kindly clear the pending fee at the earliest.

Regards,
{{schoolName}}`,

  "Fee Overdue Notice": `Dear Parent/Guardian,

⚠️ OVERDUE FEE NOTICE for {{studentName}}, Class {{classSection}}.

Pending Amount: ₹{{pendingAmount}}
Due Date: {{dueDate}}
Overdue Days: {{overdueDays}} Days

Kindly make the payment immediately to avoid late fee charges.

Regards,
{{schoolName}}`,

  "Custom Message": `Dear Parent/Guardian,

Regarding {{studentName}} (Class {{classSection}}):

Please be informed about the upcoming school event.

Regards,
{{schoolName}}`,
};

function WhatsAppModal({ student, onClose }) {
  const { fetchWithAuth, user } = useAuth();

  const [recipientNumber, setRecipientNumber] = useState("");
  const [messageType, setMessageType] = useState("Fee Payment Reminder");
  const [messageText, setMessageText] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const [attendanceData, setAttendanceData] = useState(null);
  const [feeData, setFeeData] = useState(null);

  const studentId = student?.id || student?._id;

  // Determine available numbers
  const primaryMobile = student?.mobile || student?.phone || "";
  const altMobile = student?.alternateMobile || student?.parentPhone || "";

  useEffect(() => {
    if (primaryMobile) {
      setRecipientNumber(primaryMobile);
    } else if (altMobile) {
      setRecipientNumber(altMobile);
    }
  }, [primaryMobile, altMobile]);

  // Fetch Attendance and Fee data from Backend APIs
  useEffect(() => {
    async function loadData() {
      if (!studentId) {
        setLoadingData(false);
        return;
      }

      setLoadingData(true);
      try {
        // 1. Fetch Attendance Summary
        try {
          const attRes = await fetchWithAuth(`/student-attendance/student/${studentId}/summary`);
          if (attRes.ok) {
            const attJson = await attRes.json();
            if (attJson.success) setAttendanceData(attJson.summary);
          }
        } catch (e) {
          console.warn("Attendance summary fetch failed:", e);
        }

        // 2. Fetch Fee details
        try {
          const feeRes = await fetchWithAuth(`/fees/student/${studentId}`);
          if (feeRes.ok) {
            const feeJson = await feeRes.json();
            if (feeJson.success && feeJson.fee) {
              setFeeData(feeJson.fee);
            }
          }
        } catch (e) {
          console.warn("Fee details fetch failed:", e);
        }
      } finally {
        setLoadingData(false);
      }
    }

    loadData();
  }, [studentId]);

  // Update compiled message when messageType or data changes
  useEffect(() => {
    const rawTemplate = DEFAULT_TEMPLATES[messageType] || DEFAULT_TEMPLATES["Custom Message"];

    const totalWorkingDays = attendanceData?.totalDays || attendanceData?.workingDays || 30;
    const presentDays = attendanceData?.presentDays || 26;
    const absentDays = attendanceData?.absentDays || 4;
    const attendancePercentage = attendanceData?.percentage || (totalWorkingDays > 0 ? ((presentDays / totalWorkingDays) * 100).toFixed(1) : 85);

    const pendingAmount = feeData?.pendingAmount !== undefined ? feeData.pendingAmount : (feeData?.pending || 5000);
    const totalFee = feeData?.totalAmount || feeData?.totalFee || 15000;
    const paidAmount = feeData?.paidAmount || feeData?.paid || 10000;
    const dueDate = feeData?.dueDate || "10th September 2026";
    const overdueDays = feeData?.overdueDays || 5;

    const variables = {
      studentName: student?.name || "Student",
      parentName: student?.father || student?.mother || "Parent",
      classSection: `${student?.className || ""} ${student?.section || ""}`.trim() || "N/A",
      attendancePercentage,
      totalWorkingDays,
      presentDays,
      absentDays,
      pendingAmount,
      totalFee,
      paidAmount,
      dueDate,
      overdueDays,
      schoolName: "Maharana Pratap Science Academy Inter College",
    };

    const compiled = compileTemplate(rawTemplate, variables);
    setMessageText(compiled);
  }, [messageType, student, attendanceData, feeData]);

  const normalized = normalizePhoneNumber(recipientNumber);
  const isValidNumber = !!normalized;

  const handleSendWhatsApp = async () => {
    setError("");
    if (!isValidNumber) {
      setError("Please select or enter a valid 10-digit mobile number.");
      return;
    }

    if (!messageText.trim()) {
      setError("Message text cannot be empty.");
      return;
    }

    setSending(true);

    try {
      // 1. Generate Deep Link
      const whatsappUrl = generateWhatsAppLink(recipientNumber, messageText);

      // 2. Log Communication to Backend
      await fetchWithAuth("/communications/log", {
        method: "POST",
        body: JSON.stringify({
          studentId,
          studentName: student?.name,
          recipientNumber: normalized,
          recipientName: student?.father || student?.mother || "Parent",
          messageType,
          message: messageText,
          source: "whatsapp_click_to_chat",
        }),
      });

      // 3. Open WhatsApp link in new tab
      window.open(whatsappUrl, "_blank");

      onClose();
    } catch (err) {
      console.error("Send WhatsApp error:", err);
      setError("Failed to record communication log. Launching WhatsApp anyway...");
      const whatsappUrl = generateWhatsAppLink(recipientNumber, messageText);
      window.open(whatsappUrl, "_blank");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="wa-modal-overlay">
      <div className="wa-modal-card">
        {/* HEADER */}
        <div className="wa-modal-header">
          <div className="wa-modal-header-title">
            <span style={{ fontSize: "24px" }}>💬</span>
            <h3>Send WhatsApp Message</h3>
          </div>
          <button className="wa-modal-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* BODY */}
        <div className="wa-modal-body">
          {/* STUDENT INFO PILL */}
          <div className="wa-student-pill">
            <div className="wa-pill-item">
              <span className="wa-pill-label">Student Name</span>
              <span className="wa-pill-value">{student?.name || "N/A"}</span>
            </div>
            <div className="wa-pill-item">
              <span className="wa-pill-label">Class & Section</span>
              <span className="wa-pill-value">{student?.className} {student?.section}</span>
            </div>
            <div className="wa-pill-item">
              <span className="wa-pill-label">Parent / Guardian</span>
              <span className="wa-pill-value">{student?.father || student?.mother || "Parent"}</span>
            </div>
            <div className="wa-pill-item">
              <span className="wa-pill-label">WhatsApp Number</span>
              <span className="wa-pill-value" style={{ color: isValidNumber ? "#34d399" : "#f87171" }}>
                {isValidNumber ? `+${normalized}` : "Not Available"}
              </span>
            </div>
          </div>

          {error && (
            <div style={{ padding: "10px 14px", backgroundColor: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.3)", borderRadius: "8px", color: "#fca5a5", fontSize: "13px", marginBottom: "16px" }}>
              ⚠️ {error}
            </div>
          )}

          {/* RECIPIENT SELECTOR */}
          {(primaryMobile && altMobile) && (
            <div className="wa-form-group">
              <label className="wa-form-label">Select Target Number</label>
              <select
                className="wa-select"
                value={recipientNumber}
                onChange={(e) => setRecipientNumber(e.target.value)}
              >
                <option value={primaryMobile}>Primary Mobile: {primaryMobile}</option>
                <option value={altMobile}>Parent / Alternate: {altMobile}</option>
              </select>
            </div>
          )}

          {/* MESSAGE TYPE SELECTOR */}
          <div className="wa-form-group">
            <label className="wa-form-label">Message Type / Template</label>
            <select
              className="wa-select"
              value={messageType}
              onChange={(e) => setMessageType(e.target.value)}
            >
              <option value="Fee Payment Reminder">💰 Fee Payment Reminder</option>
              <option value="Fee Overdue Notice">⚠️ Fee Overdue Notice</option>
              <option value="Attendance Reminder">📅 Attendance Reminder</option>
              <option value="Low Attendance Alert">🚨 Low Attendance Alert (&lt;75%)</option>
              <option value="Custom Message">✍️ Custom Message</option>
            </select>
          </div>

          {/* EDITABLE MESSAGE OR PREVIEW */}
          {!isPreview ? (
            <div className="wa-form-group">
              <label className="wa-form-label">Message Content (Fully Editable)</label>
              <textarea
                className="wa-textarea"
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Write your custom message here..."
              />
              <div className="wa-meta-row">
                <span>Character Count: {messageText.length}</span>
                {loadingData && <span style={{ color: "#38bdf8" }}>Syncing live attendance/fees...</span>}
              </div>
            </div>
          ) : (
            <div className="wa-form-group">
              <label className="wa-form-label">WhatsApp Chat Preview</label>
              <div className="wa-preview-bubble">
                <div className="wa-bubble-content">
                  {messageText}
                  <div className="wa-bubble-time">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ✓✓</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        <div className="wa-modal-footer">
          <button className="wa-btn wa-btn-secondary" onClick={onClose}>
            Cancel
          </button>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              className="wa-btn wa-btn-preview"
              onClick={() => setIsPreview(!isPreview)}
            >
              {isPreview ? "✏️ Edit Message" : "👁️ Preview"}
            </button>

            <button
              className="wa-btn wa-btn-send"
              onClick={handleSendWhatsApp}
              disabled={!isValidNumber || sending}
            >
              🚀 {sending ? "Opening..." : "Send on WhatsApp"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WhatsAppModal;
