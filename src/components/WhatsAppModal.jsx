import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import API_BASE_URL from "../config/api";
import {
  normalizePhoneNumber,
  generateWhatsAppLink,
} from "../services/whatsappService";
import "../Style/whatsapp-modal.css";

export default function WhatsAppModal({ student, onClose }) {
  const { fetchWithAuth } = useAuth();

  const [messageType, setMessageType] = useState("Fee Details");
  const [customNoticeText, setCustomNoticeText] = useState("");
  const [loading, setLoading] = useState(false);
  const [compiledData, setCompiledData] = useState(null);
  const [error, setError] = useState("");

  const studentId = student?.id || student?._id;

  const parentPhone =
    student?.parentPhone ||
    student?.fatherMobile ||
    student?.motherMobile ||
    student?.phone ||
    student?.contact ||
    student?.mobile ||
    student?.alternateMobile ||
    "";

  const parentName =
    student?.father ||
    student?.fatherName ||
    student?.parentName ||
    student?.mother ||
    student?.motherName ||
    "Parent/Guardian";

  const normalizedPhone = normalizePhoneNumber(parentPhone);
  const isValidPhone = Boolean(normalizedPhone);

  const fetchCompiledMessage = async (type, noticeText) => {
    if (!studentId) return;
    try {
      setLoading(true);
      setError("");
      const res = await fetchWithAuth(`${API_BASE_URL}/communications/compile-student`, {
        method: "POST",
        body: JSON.stringify({
          studentId,
          type,
          customMessage: noticeText,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCompiledData(data.data);
      } else {
        setError(data.message || "Failed to compile message.");
      }
    } catch (err) {
      console.error("Compile student WhatsApp message error:", err);
      setError("Error connecting to server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompiledMessage(messageType, customNoticeText);
  }, [studentId, messageType]);

  const handleSendWhatsApp = async () => {
    if (!compiledData || !compiledData.whatsappUrl) {
      alert("Unable to generate WhatsApp link. Please check parent phone number.");
      return;
    }

    // Open WhatsApp Web deep link
    window.open(compiledData.whatsappUrl, "_blank");

    // Log communication to MongoDB
    try {
      await fetchWithAuth(`${API_BASE_URL}/communications/log`, {
        method: "POST",
        body: JSON.stringify({
          studentId,
          studentName: student?.name,
          recipientNumber: normalizedPhone || parentPhone,
          recipientName: parentName,
          messageType,
          message: compiledData.message,
          status: "Opened",
        }),
      });
    } catch (err) {
      console.error("Log communication error:", err);
    }

    if (onClose) onClose();
  };

  return (
    <div className="whatsapp-modal-overlay" onClick={onClose}>
      <div className="whatsapp-modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: "560px", padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h3 style={{ margin: 0, fontSize: "18px", color: "#1e293b", fontWeight: "700" }}>
            💬 Parent Communication
          </h3>
          <button onClick={onClose} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer" }}>✕</button>
        </div>

        {/* Student & Parent Info Card */}
        <div style={{ backgroundColor: "#f8fafc", padding: "14px", borderRadius: "10px", border: "1px solid #e2e8f0", marginBottom: "16px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px", fontSize: "13px" }}>
            <div>
              <span style={{ color: "#64748b" }}>Student Name</span>
              <p style={{ margin: "2px 0 0 0", fontWeight: "700", color: "#0f172a" }}>{student?.name || "Student"}</p>
            </div>
            <div>
              <span style={{ color: "#64748b" }}>Class & Section</span>
              <p style={{ margin: "2px 0 0 0", fontWeight: "700", color: "#0f172a" }}>
                {student?.className || student?.class || "N/A"} {student?.section ? `(${student.section})` : ""}
              </p>
            </div>
            <div>
              <span style={{ color: "#64748b" }}>Parent / Guardian</span>
              <p style={{ margin: "2px 0 0 0", fontWeight: "700", color: "#0f172a" }}>{parentName}</p>
            </div>
            <div>
              <span style={{ color: "#64748b" }}>Parent WhatsApp</span>
              <p style={{ margin: "2px 0 0 0", fontWeight: "700" }}>
                {isValidPhone ? (
                  <span style={{ color: "#15803d" }}>+{normalizedPhone}</span>
                ) : (
                  <span style={{ color: "#dc2626" }}>⚠️ Invalid / Missing ({parentPhone || "None"})</span>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Message Type Selection */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "13px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "8px" }}>
            Select Communication Type:
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            {[
              { id: "Fee Details", label: "💰 Fee Details" },
              { id: "Attendance Report", label: "📅 Attendance Report" },
              { id: "Report Card", label: "📝 Academic Report Card" },
              { id: "General Notice", label: "📢 General Notice" }
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setMessageType(item.id)}
                style={{
                  padding: "10px",
                  borderRadius: "8px",
                  fontSize: "13px",
                  fontWeight: "600",
                  border: messageType === item.id ? "2px solid #25D366" : "1px solid #cbd5e1",
                  backgroundColor: messageType === item.id ? "#f0fdf4" : "#ffffff",
                  color: messageType === item.id ? "#166534" : "#475569",
                  cursor: "pointer",
                  textAlign: "left"
                }}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {messageType === "General Notice" && (
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontSize: "13px", fontWeight: "600", color: "#334155", display: "block", marginBottom: "4px" }}>
              Notice Content
            </label>
            <textarea
              className="ui-form-control"
              rows="3"
              placeholder="Type custom message to parent..."
              value={customNoticeText}
              onChange={(e) => setCustomNoticeText(e.target.value)}
              onBlur={() => fetchCompiledMessage(messageType, customNoticeText)}
            />
          </div>
        )}

        {/* Compiled Message Preview */}
        <div style={{ marginBottom: "20px" }}>
          <label style={{ fontSize: "13px", fontWeight: "700", color: "#334155", display: "block", marginBottom: "6px" }}>
            Compiled WhatsApp Message Preview (Real DB Data):
          </label>
          {loading ? (
            <div style={{ padding: "20px", textAlign: "center", color: "#64748b", fontSize: "13px" }}>
              Compiling message...
            </div>
          ) : error ? (
            <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fecaca", color: "#991b1b", padding: "10px", borderRadius: "6px", fontSize: "13px" }}>
              ⚠️ {error}
            </div>
          ) : (
            <pre style={{
              whiteSpace: "pre-wrap",
              fontSize: "12px",
              backgroundColor: "#ffffff",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #cbd5e1",
              maxHeight: "180px",
              overflowY: "auto",
              color: "#0f172a",
              fontFamily: "monospace"
            }}>
              {compiledData?.message || "No preview available."}
            </pre>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
          <button
            type="button"
            className="ui-btn ui-btn-secondary"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="ui-btn ui-btn-primary"
            style={{ backgroundColor: "#25D366", borderColor: "#25D366" }}
            disabled={!isValidPhone || loading || !compiledData}
            onClick={handleSendWhatsApp}
          >
            🟢 Open WhatsApp & Send
          </button>
        </div>
      </div>
    </div>
  );
}
