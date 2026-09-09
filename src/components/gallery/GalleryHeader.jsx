import { useState } from "react";
import Modal from "../ui/Modal";
import "../../Style/Gallery.css";

export function GalleryHeader({ schoolLogo, onLogoChange, isAdmin = true }) {
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false);
  const [previewLogo, setPreviewLogo] = useState(schoolLogo || null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewLogo(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveLogo = () => {
    if (onLogoChange) {
      onLogoChange(previewLogo);
    }
    setIsLogoModalOpen(false);
  };

  const handleRemoveLogo = () => {
    setPreviewLogo(null);
  };

  return (
    <div className="gallery-header-container">
      <div className="gallery-header-brand">
        <div className="gallery-logo-wrapper">
          {schoolLogo ? (
            <img src={schoolLogo} alt="MPSA Logo" className="gallery-logo-img" />
          ) : (
            <div className="gallery-logo-placeholder">M</div>
          )}
          {isAdmin && (
            <button
              className="gallery-change-logo-btn"
              onClick={() => setIsLogoModalOpen(true)}
              title="Change School Logo"
            >
              📷
            </button>
          )}
        </div>

        <div className="gallery-header-titles">
          <span className="gallery-school-name">Maharana Pratap Science Academy Inter College</span>
          <h1 className="gallery-page-title">School Photo & Video Gallery</h1>
          <p className="gallery-subtitle">
            Explore event highlights, album collections, video recordings, and best moments.
          </p>
        </div>
      </div>

      {/* Change Logo Modal */}
      <Modal
        isOpen={isLogoModalOpen}
        onClose={() => setIsLogoModalOpen(false)}
        title="Change School Logo (Frontend Preview)"
        footer={
          <>
            <button className="ui-btn ui-btn-secondary" onClick={() => setIsLogoModalOpen(false)}>
              Cancel
            </button>
            {previewLogo && (
              <button className="ui-btn ui-btn-danger" onClick={handleRemoveLogo}>
                Remove Logo
              </button>
            )}
            <button className="ui-btn ui-btn-primary" onClick={handleSaveLogo}>
              Save Logo
            </button>
          </>
        }
      >
        <div style={{ textAlign: "center", padding: "12px" }}>
          <div
            style={{
              width: "100px",
              height: "100px",
              margin: "0 auto 16px auto",
              borderRadius: "50%",
              border: "2px dashed #cbd5e1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              overflow: "hidden",
              background: "#f8fafc"
            }}
          >
            {previewLogo ? (
              <img src={previewLogo} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <span style={{ fontSize: "36px", color: "#94a3b8" }}>📷</span>
            )}
          </div>

          <div className="ui-form-group">
            <label style={{ cursor: "pointer", display: "inline-block" }} className="ui-btn ui-btn-secondary">
              📂 Select Image File
              <input type="file" accept="image/*" onChange={handleFileSelect} style={{ display: "none" }} />
            </label>
            <p style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "8px" }}>
              Recommended: PNG or JPG, Square 1:1 aspect ratio (max 2MB).
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}

export default GalleryHeader;
