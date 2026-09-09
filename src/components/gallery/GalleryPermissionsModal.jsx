import { useState } from "react";
import Modal from "../ui/Modal";
import "../../Style/Gallery.css";

export function GalleryPermissionsModal({
  isOpen,
  onClose,
  currentPermissions = {},
  onSavePermissions
}) {
  const [perms, setPerms] = useState({
    galleryAccess: currentPermissions.galleryAccess || "Everyone",
    albumDefaultAccess: currentPermissions.albumDefaultAccess || "Follow Gallery",
    photoDefaultAccess: currentPermissions.photoDefaultAccess || "Follow Album",
    videoDefaultAccess: currentPermissions.videoDefaultAccess || "Follow Album",
    allowedRoles: currentPermissions.allowedRoles || ["Admin", "Teacher", "Parent", "Student", "Staff"]
  });

  const handleRoleToggle = (role) => {
    setPerms((prev) => {
      const roles = prev.allowedRoles.includes(role)
        ? prev.allowedRoles.filter((r) => r !== role)
        : [...prev.allowedRoles, role];
      return { ...prev, allowedRoles: roles };
    });
  };

  const handleSave = () => {
    if (onSavePermissions) {
      onSavePermissions(perms);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="🔒 Gallery Access & Restriction Control (Admin)"
      maxWidth="600px"
      footer={
        <>
          <button className="ui-btn ui-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="ui-btn ui-btn-primary" onClick={handleSave}>
            Save Restrictions Policy
          </button>
        </>
      }
    >
      <div>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>
          Configure hierarchical visibility rules across Gallery → Album → Photo/Video media objects.
        </p>

        {/* Gallery Level */}
        <div className="ui-form-group">
          <label style={{ fontWeight: "700" }}>1. Gallery Root Access Level</label>
          <select
            className="ui-form-control"
            value={perms.galleryAccess}
            onChange={(e) => setPerms({ ...perms, galleryAccess: e.target.value })}
          >
            <option value="Everyone">🌐 Public (All School Users & Parents)</option>
            <option value="Selected Roles">🔒 Role Restricted (Selected Roles Only)</option>
            <option value="Admin Only">🔑 Admin Only Access</option>
          </select>
        </div>

        {/* Album Level */}
        <div className="ui-form-group">
          <label style={{ fontWeight: "700" }}>2. Album Default Visibility Policy</label>
          <select
            className="ui-form-control"
            value={perms.albumDefaultAccess}
            onChange={(e) => setPerms({ ...perms, albumDefaultAccess: e.target.value })}
          >
            <option value="Follow Gallery">Inherit Gallery Settings</option>
            <option value="Restricted">Restricted by Default</option>
          </select>
        </div>

        {/* Media Level */}
        <div className="ui-form-row">
          <div className="ui-form-group">
            <label style={{ fontWeight: "700" }}>3. Photo Visibility Policy</label>
            <select
              className="ui-form-control"
              value={perms.photoDefaultAccess}
              onChange={(e) => setPerms({ ...perms, photoDefaultAccess: e.target.value })}
            >
              <option value="Follow Album">Inherit Album Rules</option>
              <option value="Restricted">Restricted Item</option>
            </select>
          </div>

          <div className="ui-form-group">
            <label style={{ fontWeight: "700" }}>4. Video Visibility Policy</label>
            <select
              className="ui-form-control"
              value={perms.videoDefaultAccess}
              onChange={(e) => setPerms({ ...perms, videoDefaultAccess: e.target.value })}
            >
              <option value="Follow Album">Inherit Album Rules</option>
              <option value="Restricted">Restricted Item</option>
            </select>
          </div>
        </div>

        {/* Role Matrix */}
        <div style={{ background: "#f8fafc", padding: "14px", borderRadius: "8px", border: "1px solid #cbd5e1", marginTop: "16px" }}>
          <span style={{ fontSize: "13px", fontWeight: "700", display: "block", marginBottom: "8px" }}>
            Allowed Roles for Restricted Items:
          </span>
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {["Admin", "Teacher", "Parent", "Student", "Staff"].map((role) => (
              <label key={role} style={{ fontSize: "13px", display: "flex", alignItems: "center", gap: "6px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={perms.allowedRoles.includes(role)}
                  onChange={() => handleRoleToggle(role)}
                />
                {role}
              </label>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default GalleryPermissionsModal;
