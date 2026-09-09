import { useEffect } from "react";
import StatusBadge from "../ui/StatusBadge";
import { formatAlbumDateAndDay } from "./AlbumCard";
import "../../Style/Gallery.css";

export function VideoViewerModal({
  video,
  albumName = "Gallery",
  onClose,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  onShareWhatsApp
}) {
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!video) return null;

  const { formattedDate, dayName } = formatAlbumDateAndDay(video.date);

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-content video-lightbox-content" onClick={(e) => e.stopPropagation()}>
        {/* Top Header */}
        <div className="lightbox-header">
          <div className="lightbox-title-group">
            <h3>🎥 {video.title || "Video Player"}</h3>
            <span className="lightbox-album-tag">📁 {albumName}</span>
          </div>

          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <StatusBadge status={video.visibility || "Everyone"} />

            <button
              className="ui-btn ui-btn-secondary ui-btn-sm"
              onClick={() => onShareWhatsApp(video)}
              title="Share Video via WhatsApp"
            >
              💬 Share Video
            </button>

            <button className="lightbox-close-btn" onClick={onClose} title="Close (Esc)">
              ✕
            </button>
          </div>
        </div>

        {/* Video Player Stage */}
        <div className="lightbox-image-stage video-stage">
          {hasPrev && (
            <button className="lightbox-nav-btn prev" onClick={onPrev} title="Previous Video">
              ❮
            </button>
          )}

          <div className="video-player-container">
            {video.url && (video.url.includes("youtube") || video.url.includes("embed")) ? (
              <iframe
                src={video.url}
                title={video.title}
                className="video-iframe-player"
                allowFullScreen
              />
            ) : video.url ? (
              <video src={video.url} controls autoPlay className="video-html5-player" />
            ) : (
              <div className="video-player-placeholder">
                <span>🎥</span>
                <p>Video Player Stream Ready</p>
              </div>
            )}
          </div>

          {hasNext && (
            <button className="lightbox-nav-btn next" onClick={onNext} title="Next Video">
              ❯
            </button>
          )}
        </div>

        {/* Footer Details */}
        <div className="lightbox-footer">
          <div>
            <p className="lightbox-caption">{video.description || video.title}</p>
            <div className="lightbox-date-info">
              <span>📅 Recorded: {formattedDate}</span>
              {dayName && <span className="album-day-tag">{dayName}</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoViewerModal;
