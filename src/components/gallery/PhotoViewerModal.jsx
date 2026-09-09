import { useEffect } from "react";
import StatusBadge from "../ui/StatusBadge";
import { formatAlbumDateAndDay } from "./AlbumCard";
import "../../Style/Gallery.css";

export function PhotoViewerModal({
  photo,
  albumName = "Gallery",
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  onToggleBest,
  onShareWhatsApp,
  isAdmin = true
}) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev && onPrev) onPrev();
      if (e.key === "ArrowRight" && hasNext && onNext) onNext();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onPrev, onNext, hasPrev, hasNext]);

  if (!photo) return null;

  const { formattedDate, dayName } = formatAlbumDateAndDay(photo.date);

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        {/* Top Controls Bar */}
        <div className="lightbox-header">
          <div className="lightbox-title-group">
            <h3>{photo.title || photo.caption || "Photo Viewer"}</h3>
            <span className="lightbox-album-tag">📁 {albumName}</span>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <StatusBadge status={photo.visibility || "Everyone"} />

            <button
              className="ui-btn ui-btn-secondary ui-btn-sm"
              onClick={() => onShareWhatsApp(photo)}
              title="Share Photo via WhatsApp"
            >
              💬 Share
            </button>

            {isAdmin && (
              <button
                className={`ui-btn ${photo.isBest ? "ui-btn-primary" : "ui-btn-secondary"} ui-btn-sm`}
                onClick={() => onToggleBest(photo)}
              >
                {photo.isBest ? "⭐ Best Photo" : "☆ Mark Best"}
              </button>
            )}

            <button className="lightbox-close-btn" onClick={onClose} title="Close (Esc)">
              ✕
            </button>
          </div>
        </div>

        {/* Main Image Display */}
        <div className="lightbox-image-stage">
          {hasPrev && (
            <button className="lightbox-nav-btn prev" onClick={onPrev} title="Previous Photo (←)">
              ❮
            </button>
          )}

          <div className="lightbox-img-wrapper">
            {photo.url ? (
              <img src={photo.url} alt={photo.title || "Photo"} className="lightbox-main-img" />
            ) : (
              <div className="lightbox-placeholder">🖼️</div>
            )}
          </div>

          {hasNext && (
            <button className="lightbox-nav-btn next" onClick={onNext} title="Next Photo (→)">
              ❯
            </button>
          )}
        </div>

        {/* Footer Info */}
        <div className="lightbox-footer">
          <div>
            <p className="lightbox-caption">{photo.caption || photo.title}</p>
            <div className="lightbox-date-info">
              <span>📅 Date: {formattedDate}</span>
              {dayName && <span className="album-day-tag">{dayName}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PhotoViewerModal;
