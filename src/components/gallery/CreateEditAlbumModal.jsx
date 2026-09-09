import { useState, useEffect } from "react";
import Modal from "../ui/Modal";
import { formatAlbumDateAndDay } from "./AlbumCard";
import "../../Style/Gallery.css";

export function CreateEditAlbumModal({
  isOpen,
  onClose,
  onSave,
  albumToEdit = null
}) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
    wallpaper: null,
    visibility: "Everyone",
    allowedRoles: ["Admin", "Teacher", "Parent", "Student"],
    coverIcon: "🖼️"
  });

  useEffect(() => {
    if (albumToEdit) {
      setFormData({
        title: albumToEdit.title || "",
        description: albumToEdit.description || "",
        date: albumToEdit.date || new Date().toISOString().split("T")[0],
        wallpaper: albumToEdit.wallpaper || null,
        visibility: albumToEdit.visibility || "Everyone",
        allowedRoles: albumToEdit.allowedRoles || ["Admin", "Teacher", "Parent", "Student"],
        coverIcon: albumToEdit.coverIcon || "🖼️"
      });
    } else {
      setFormData({
        title: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
        wallpaper: null,
        visibility: "Everyone",
        allowedRoles: ["Admin", "Teacher", "Parent", "Student"],
        coverIcon: "🖼️"
      });
    }
  }, [albumToEdit, isOpen]);

  const { dayName } = formatAlbumDateAndDay(formData.date);

  const handleWallpaperChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, wallpaper: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRoleToggle = (role) => {
    setFormData((prev) => {
      const roles = prev.allowedRoles.includes(role)
        ? prev.allowedRoles.filter((r) => r !== role)
        : [...prev.allowedRoles, role];
      return { ...prev, allowedRoles: roles };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    onSave({
      ...(albumToEdit ? albumToEdit : {}),
      title: formData.title,
      description: formData.description,
      date: formData.date,
      day: dayName,
      wallpaper: formData.wallpaper,
      visibility: formData.visibility,
      allowedRoles: formData.allowedRoles,
      coverIcon: formData.coverIcon
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={albumToEdit ? `Edit Album: ${albumToEdit.title}` : "Create New Media Album"}
      maxWidth="620px"
      footer={
        <>
          <button className="ui-btn ui-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="ui-btn ui-btn-primary" onClick={handleSubmit}>
            {albumToEdit ? "Update Album" : "Create Album"}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="ui-form-group">
          <label>Album Name *</label>
          <input
            type="text"
            className="ui-form-control"
            placeholder="e.g. Annual Sports Meet 2026"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="ui-form-row">
          <div className="ui-form-group">
            <label>Album Date *</label>
            <input
              type="date"
              className="ui-form-control"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>

          <div className="ui-form-group">
            <label>Day of Week (Auto-Derived)</label>
            <input
              type="text"
              className="ui-form-control"
              value={dayName ? `📅 ${dayName}` : "N/A"}
              disabled
              style={{ background: "#f1f5f9", fontWeight: "600", color: "#2563eb" }}
            />
          </div>
        </div>

        <div className="ui-form-group">
          <label>Description & Summary</label>
          <textarea
            className="ui-form-control"
            rows={3}
            placeholder="Brief overview of event photos and video highlights..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </div>

        {/* Wallpaper Cover Section */}
        <div className="ui-form-group">
          <label>Album Wallpaper / Cover Photo</label>
          <div className="wallpaper-upload-box">
            {formData.wallpaper ? (
              <div className="wallpaper-preview-wrapper">
                <img src={formData.wallpaper} alt="Album Cover Preview" className="wallpaper-preview-img" />
                <div className="wallpaper-actions-row">
                  <label className="ui-btn ui-btn-secondary ui-btn-sm" style={{ cursor: "pointer" }}>
                    🔄 Replace Wallpaper
                    <input type="file" accept="image/*" onChange={handleWallpaperChange} style={{ display: "none" }} />
                  </label>
                  <button
                    type="button"
                    className="ui-btn ui-btn-danger ui-btn-sm"
                    onClick={() => setFormData({ ...formData, wallpaper: null })}
                  >
                    🗑️ Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="wallpaper-drop-placeholder">
                <span>🖼️</span>
                <p>Upload Album Cover Wallpaper</p>
                <span className="wallpaper-hint">Recommended landscape 16:9 aspect ratio (JPG/PNG, max 5MB).</span>
                <label className="ui-btn ui-btn-secondary ui-btn-sm" style={{ marginTop: "10px", cursor: "pointer" }}>
                  📂 Browse Image
                  <input type="file" accept="image/*" onChange={handleWallpaperChange} style={{ display: "none" }} />
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Visibility & Permissions Section */}
        <div className="ui-form-group" style={{ marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #e2e8f0" }}>
          <label>Access Visibility & Restriction Policy</label>
          <div className="ui-form-row" style={{ marginBottom: "12px" }}>
            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <input
                type="radio"
                name="visibility"
                value="Everyone"
                checked={formData.visibility === "Everyone"}
                onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
              />
              <span>🌐 Public (Everyone Allowed)</span>
            </label>

            <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <input
                type="radio"
                name="visibility"
                value="Restricted"
                checked={formData.visibility === "Restricted"}
                onChange={(e) => setFormData({ ...formData, visibility: e.target.value })}
              />
              <span>🔒 Restricted (Role Gated)</span>
            </label>
          </div>

          {formData.visibility === "Restricted" && (
            <div style={{ background: "#f8fafc", padding: "12px 16px", borderRadius: "8px", border: "1px solid #cbd5e1" }}>
              <span style={{ fontSize: "13px", fontWeight: "600", display: "block", marginBottom: "8px" }}>
                Select Allowed Target Roles:
              </span>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                {["Admin", "Teacher", "Parent", "Student", "Staff"].map((role) => (
                  <label key={role} style={{ fontSize: "13px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={formData.allowedRoles.includes(role)}
                      onChange={() => handleRoleToggle(role)}
                    />
                    {role}
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
}

export default CreateEditAlbumModal;
