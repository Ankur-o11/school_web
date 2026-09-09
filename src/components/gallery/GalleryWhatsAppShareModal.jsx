import { useState } from "react";
import Modal from "../ui/Modal";
import { generateWhatsAppLink, normalizePhoneNumber } from "../../services/whatsappService";
import "../../Style/Gallery.css";

export function GalleryWhatsAppShareModal({
  isOpen,
  onClose,
  targetItem = null,
  itemType = "album", // "album" | "photo" | "video"
  isAdmin = true,
  onLogShare
}) {
  const [recipientCategory, setRecipientCategory] = useState("All Parents");
  const [customPhone, setCustomPhone] = useState("");
  const [customNote, setCustomNote] = useState("");

  if (!targetItem) return null;

  const itemTitle = targetItem.title || targetItem.name || targetItem.caption || "Gallery Media";
  const itemDate = targetItem.date || new Date().toISOString().split("T")[0];

  const shareText = `*MPSA Senior Secondary School — Gallery Update* 📸

Check out "${itemTitle}" from our school event (${itemDate})!

View in School ERP:
https://mpsa.edu.in/gallery

${customNote ? `Note: ${customNote}` : "Shared via MPSA School ERP."}`;

  const handleShare = () => {
    let targetNum = null;
    if (recipientCategory === "Custom Contact" && customPhone) {
      targetNum = customPhone;
    }

    const waUrl = generateWhatsAppLink(targetNum, shareText);

    if (onLogShare) {
      onLogShare({
        itemId: targetItem.id,
        itemType,
        recipientCategory,
        timestamp: new Date().toLocaleString()
      });
    }

    // Open WhatsApp in new tab
    window.open(waUrl, "_blank");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`💬 Share on WhatsApp: ${itemTitle}`}
      maxWidth="580px"
      footer={
        <>
          <button className="ui-btn ui-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="ui-btn ui-btn-primary" onClick={handleShare} style={{ background: "#25D366", borderColor: "#25D366" }}>
            🚀 Open WhatsApp Now
          </button>
        </>
      }
    >
      <div>
        <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "8px", border: "1px solid #e2e8f0", marginBottom: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "28px" }}>
              {itemType === "video" ? "🎥" : itemType === "photo" ? "📸" : "📁"}
            </span>
            <div>
              <strong style={{ fontSize: "15px", color: "var(--text-main)", display: "block" }}>
                {itemTitle}
              </strong>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>
                Type: {itemType.toUpperCase()} • Date: {itemDate}
              </span>
            </div>
          </div>
        </div>

        {/* RECIPIENT CONTROL */}
        <div className="ui-form-group">
          <label style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>Target Recipient Audience</span>
          </label>

          <select
            className="ui-form-control"
            value={recipientCategory}
            onChange={(e) => setRecipientCategory(e.target.value)}
          >
            <option value="All Parents">👨‍👩‍👧 All Parents (WhatsApp Broadcast)</option>
            <option value="Selected Class Parents">👨‍👩‍👧 Class Parents Group</option>
            <option value="Selected Students">👨‍🎓 Students Group</option>
            <option value="Selected Teachers">👨‍🏫 Teachers & Staff</option>
            <option value="Custom Contact">📱 Specific Phone Number</option>
          </select>
        </div>

        {recipientCategory === "Custom Contact" && (
          <div className="ui-form-group">
            <label>Recipient WhatsApp Mobile Number</label>
            <input
              type="text"
              className="ui-form-control"
              placeholder="e.g. +91 9876543210"
              value={customPhone}
              onChange={(e) => setCustomPhone(e.target.value)}
            />
          </div>
        )}

        <div className="ui-form-group">
          <label>Optional Note / Announcement Message</label>
          <input
            type="text"
            className="ui-form-control"
            placeholder="Add an optional custom note for parents..."
            value={customNote}
            onChange={(e) => setCustomNote(e.target.value)}
          />
        </div>

        <div className="ui-form-group">
          <label>WhatsApp Message Preview</label>
          <div style={{ background: "#dcf8c6", padding: "14px", borderRadius: "8px", fontSize: "13px", lineHeight: "1.6", color: "#111b21", whiteSpace: "pre-wrap" }}>
            {shareText}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default GalleryWhatsAppShareModal;
