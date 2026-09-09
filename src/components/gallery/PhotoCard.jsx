import ActionMenu from "../ui/ActionMenu";
import StatusBadge from "../ui/StatusBadge";
import { formatAlbumDateAndDay } from "./AlbumCard";
import "../../Style/Gallery.css";

export function PhotoCard({
  photo,
  albumName = "General",
  onOpenViewer,
  onToggleBest,
  onDeletePhoto,
  onShareWhatsApp,
  onShareAgain,
  isAdmin = true
}) {
  if (!photo) return null;
  const { formattedDate, dayName } = formatAlbumDateAndDay(photo.date);

  const actions = [
    { label: "View Lightbox", icon: "👁️", onClick: () => onOpenViewer && onOpenViewer(photo) },
    { label: "Share via WhatsApp", icon: "💬", onClick: () => onShareWhatsApp && onShareWhatsApp(photo) },
    { label: "Share Again", icon: "🔄", onClick: () => onShareAgain && onShareAgain(photo) }
  ];

  if (isAdmin) {
    actions.push(
      {
        label: photo.isBest ? "Unmark Best Photo" : "⭐ Mark as Best Photo",
        icon: "⭐",
        onClick: () => onToggleBest && onToggleBest(photo)
      },
      { label: "Delete Photo", icon: "🗑️", danger: true, onClick: () => onDeletePhoto && onDeletePhoto(photo) }
    );
  }

  return (
    <div className="media-card photo-card">
      <div className="media-thumbnail-container" onClick={() => onOpenViewer && onOpenViewer(photo)}>
        {photo.url ? (
          <img src={photo.url} alt={photo.title || photo.caption || "Photo"} className="media-thumbnail-img" />
        ) : (
          <div className="media-thumbnail-placeholder">
            <span>🖼️</span>
          </div>
        )}

        <div className="media-hover-overlay">
          <span className="media-hover-play-btn">👁️ View Fullscreen</span>
        </div>

        {photo.isBest && <span className="media-best-badge">⭐ Best Photo</span>}

        <div className="media-badge-top-right">
          <StatusBadge status={photo.visibility || "Everyone"} />
        </div>
      </div>

      <div className="media-card-body">
        <div className="media-title-row">
          <h4 className="media-title" onClick={() => onOpenViewer && onOpenViewer(photo)}>
            {photo.title || photo.caption || "Untitled Photo"}
          </h4>
          <ActionMenu actions={actions} />
        </div>

        <div className="media-meta-row">
          <span className="media-album-tag">📁 {albumName}</span>
        </div>

        <div className="media-date-row">
          <span>📅 {formattedDate}</span>
          {dayName && <span className="album-day-tag">{dayName}</span>}
        </div>

        <div className="media-actions-row">
          <button className="ui-btn ui-btn-secondary ui-btn-sm" onClick={() => onOpenViewer && onOpenViewer(photo)}>
            View
          </button>

          <button
            className={`ui-btn ${photo.isBest ? "ui-btn-primary" : "ui-btn-secondary"} ui-btn-sm`}
            onClick={() => onToggleBest && onToggleBest(photo)}
            title="Toggle Best Photo"
          >
            {photo.isBest ? "⭐ Best" : "☆ Best"}
          </button>

          <button
            className="ui-btn ui-btn-secondary ui-btn-sm"
            onClick={() => onShareWhatsApp && onShareWhatsApp(photo)}
            title="Share on WhatsApp"
          >
            💬 Share
          </button>

          {isAdmin && (
            <button
              className="ui-btn ui-btn-danger ui-btn-sm"
              onClick={() => onDeletePhoto && onDeletePhoto(photo)}
              title="Delete Photo"
              style={{ padding: "6px 10px" }}
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export function PhotoGrid({
  photos = [],
  albumsMap = {},
  onOpenViewer,
  onToggleBest,
  onDeletePhoto,
  onShareWhatsApp,
  onShareAgain,
  isAdmin
}) {
  const safePhotos = Array.isArray(photos) ? photos.filter(Boolean) : [];
  return (
    <div className="media-grid">
      {safePhotos.map((photo) => (
        <PhotoCard
          key={photo.id || Math.random()}
          photo={photo}
          albumName={albumsMap[photo.albumId]?.title || photo.albumName || "School Gallery"}
          onOpenViewer={onOpenViewer}
          onToggleBest={onToggleBest}
          onDeletePhoto={onDeletePhoto}
          onShareWhatsApp={onShareWhatsApp}
          onShareAgain={onShareAgain}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
}

export default PhotoCard;
