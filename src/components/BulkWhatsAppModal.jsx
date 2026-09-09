import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  normalizePhoneNumber,
  generateWhatsAppLink,
  compileTemplate,
} from "../services/whatsappService";
import "../Style/whatsapp-modal.css";

const BULK_TEMPLATES = {
  "Fee Payment Reminder": `Dear Parent/Guardian,

This is a reminder regarding the pending school fee for {{studentName}} (Class {{classSection}}).

Kindly clear the pending fee at the earliest.

Regards,
Maharana Pratap Science Academy Inter College`,

  "Attendance Reminder": `Dear Parent/Guardian,

This is a reminder regarding the regular attendance of your ward {{studentName}} (Class {{classSection}}).

Please ensure your ward attends classes regularly.

Regards,
Maharana Pratap Science Academy Inter College`,

  "General Announcement": `Dear Parent/Guardian,

Important announcement for {{studentName}} (Class {{classSection}}):

Please check the school portal / notice board for recent updates.

Regards,
Maharana Pratap Science Academy Inter College`,
};

function BulkWhatsAppModal({ selectedStudents = [], onClose }) {
  const { fetchWithAuth } = useAuth();
  const [messageType, setMessageType] = useState("Fee Payment Reminder");
  const [templateText, setTemplateText] = useState(BULK_TEMPLATES["Fee Payment Reminder"]);
  const [openedStatus, setOpenedStatus] = useState({});

  const handleSendSingle = async (student) => {
    const studentId = student.id || student._id;
    const phone = student.mobile || student.alternateMobile || student.phone;
    const normalized = normalizePhoneNumber(phone);
    if (!normalized) return;

    const classSection = `${student.className || ""} ${student.section || ""}`.trim();
    const compiledMsg = compileTemplate(templateText, {
      studentName: student.name || "Student",
      classSection: classSection || "N/A",
      parentName: student.father || student.mother || "Parent",
    });

    const link = generateWhatsAppLink(normalized, compiledMsg);

    try {
      await fetchWithAuth("/communications/log", {
        method: "POST",
        body: JSON.stringify({
          studentId,
          studentName: student.name,
          recipientNumber: normalized,
          messageType,
          message: compiledMsg,
          source: "bulk_whatsapp_click_to_chat",
        }),
      });
    } catch (e) {
      console.warn("Log error:", e);
    }

    setOpenedStatus((prev) => ({ ...prev, [studentId]: true }));
    window.open(link, "_blank");
  };

  return (
    <div className="wa-modal-overlay">
      <div className="wa-modal-card" style={{ maxWidth: "680px" }}>
        {/* HEADER */}
        <div className="wa-modal-header">
          <div className="wa-modal-header-title">
            <span style={{ fontSize: "24px" }}>📢</span>
            <h3>Bulk WhatsApp Dispatch ({selectedStudents.length} Students)</h3>
          </div>
          <button className="wa-modal-close-btn" onClick={onClose}>✕</button>
        </div>

        {/* BODY */}
        <div className="wa-modal-body">
          <div style={{ backgroundColor: "rgba(59, 130, 246, 0.15)", border: "1px solid rgba(59, 130, 246, 0.3)", borderRadius: "10px", padding: "12px 16px", color: "#93c5fd", fontSize: "13px", marginBottom: "20px" }}>
            ℹ️ <strong>Click-to-Chat Notice:</strong> Web browsers require user confirmation to launch WhatsApp per recipient. Click "Open WhatsApp" for each student below.
          </div>

          <div className="wa-form-group">
            <label className="wa-form-label">Message Type / Template</label>
            <select
              className="wa-select"
              value={messageType}
              onChange={(e) => {
                const val = e.target.value;
                setMessageType(val);
                setTemplateText(BULK_TEMPLATES[val] || BULK_TEMPLATES["General Announcement"]);
              }}
            >
              <option value="Fee Payment Reminder">💰 Fee Payment Reminder</option>
              <option value="Attendance Reminder">📅 Attendance Reminder</option>
              <option value="General Announcement">📢 General Announcement</option>
            </select>
          </div>

          <div className="wa-form-group">
            <label className="wa-form-label">Message Template</label>
            <textarea
              className="wa-textarea"
              style={{ minHeight: "110px" }}
              value={templateText}
              onChange={(e) => setTemplateText(e.target.value)}
            />
          </div>

          {/* RECIPIENTS TABLE */}
          <div className="wa-form-group">
            <label className="wa-form-label">Selected Recipients ({selectedStudents.length})</label>
            <div style={{ maxHeight: "220px", overflowY: "auto", border: "1px solid #334155", borderRadius: "10px", backgroundColor: "#0f172a" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid #334155", color: "#94a3b8", textAlign: "left" }}>
                    <th style={{ padding: "10px 14px" }}>Student</th>
                    <th style={{ padding: "10px 14px" }}>Class</th>
                    <th style={{ padding: "10px 14px" }}>WhatsApp Number</th>
                    <th style={{ padding: "10px 14px", textAlign: "right" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedStudents.map((st) => {
                    const stId = st.id || st._id;
                    const phone = st.mobile || st.alternateMobile || st.phone;
                    const normalized = normalizePhoneNumber(phone);
                    const isValid = !!normalized;
                    const isOpened = !!openedStatus[stId];

                    return (
                      <tr key={stId} style={{ borderBottom: "1px solid #1e293b" }}>
                        <td style={{ padding: "10px 14px", fontWeight: "600" }}>{st.name}</td>
                        <td style={{ padding: "10px 14px", color: "#cbd5e1" }}>{st.className} {st.section}</td>
                        <td style={{ padding: "10px 14px", color: isValid ? "#34d399" : "#f87171" }}>
                          {isValid ? `+${normalized}` : "Invalid / Missing"}
                        </td>
                        <td style={{ padding: "10px 14px", textAlign: "right" }}>
                          <button
                            className="btn-whatsapp-action"
                            style={{
                              padding: "4px 10px",
                              fontSize: "12px",
                              backgroundColor: isOpened ? "#475569" : "#10b981",
                            }}
                            disabled={!isValid}
                            onClick={() => handleSendSingle(st)}
                          >
                            {isOpened ? "✓ Opened" : "💬 Open WhatsApp"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="wa-modal-footer" style={{ justifyContent: "flex-end" }}>
          <button className="wa-btn wa-btn-secondary" onClick={onClose}>
            Close Bulk Dispatch
          </button>
        </div>
      </div>
    </div>
  );
}

export default BulkWhatsAppModal;
