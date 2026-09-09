import ActionMenu from "../ui/ActionMenu";
import StatusBadge from "../ui/StatusBadge";
import "../../Style/Gallery.css";

export function formatAlbumDateAndDay(dateStr) {
  if (!dateStr) return { formattedDate: "N/A", dayName: "" };
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return { formattedDate: dateStr, dayName: "" };
  const dayName = d.toLocaleDateString("en-US", { weekday: "long" });
  const formattedDate = d.toLocaleDateString("en-US", { day: "2-digit", month: "long", year: "numeric" });
  return { formattedDate, dayName };
}

export function AlbumCard({
  album,
  onOpenAlbum,
  onEditAlbum,
  onDeleteAlbum,
  onShareWhatsApp,
  isAdmin = true
}) {
  if (!album) return null;
  const { formattedDate, dayName } = formatAlbumDateAndDay(album.date);

  const actions = [
    { label: "View Album", icon: "👁️", onClick: () => onOpenAlbum && onOpenAlbum(album) },
    { label: "Share via WhatsApp", icon: "💬", onClick: () => onShareWhatsApp && onShareWhatsApp(album) },
  ];

  if (isAdmin) {
    actions.push(
      { label: "Edit Album", icon: "✏️", onClick: () => onEditAlbum && onEditAlbum(album) },
      { label: "Delete Album", icon: "🗑️", danger: true, onClick: () => onDeleteAlbum && onDeleteAlbum(album) }
    );
  }

  return (
    <div className="album-card">
      {/* Cover Wallpaper */}
      <div className="album-cover-container" onClick={() => onOpenAlbum && onOpenAlbum(album)}>
        {album.wallpaper ? (
          <img src={album.wallpaper} alt={album.title || "Album Cover"} className="album-cover-img" />
        ) : (
          <div className="album-cover-placeholder">
            <span>{album.coverIcon || "🖼️"}</span>
          </div>
        )}
        <div className="album-cover-overlay">
          <span className="album-hover-view-btn">View Album →</span>
        </div>
        <div className="album-badge-row">
          <StatusBadge status={album.visibility || "Everyone"} />
        </div>
      </div>

      {/* Details */}
      <div className="album-card-body">
        <div className="album-title-header">
          <h3 className="album-title" onClick={() => onOpenAlbum && onOpenAlbum(album)}>
            {album.title || "Untitled Album"}
          </h3>
          <ActionMenu actions={actions} />
        </div>

        <p className="album-description">{album.description || "No description provided."}</p>

        <div className="album-meta-counts">
          <span>📸 {album.photoCount || 0} Photos</span>
          <span>•</span>
          <span>🎥 {album.videoCount || 0} Videos</span>
        </div>

        <div className="album-date-row">
          <span>📅 {formattedDate}</span>
          {dayName && <span className="album-day-tag">{dayName}</span>}
        </div>

        {/* Footer Actions */}
        <div className="album-card-footer">
          <button className="ui-btn ui-btn-primary ui-btn-sm" onClick={() => onOpenAlbum && onOpenAlbum(album)}>
            View Album
          </button>
          <button
            className="ui-btn ui-btn-secondary ui-btn-sm"
            onClick={() => onShareWhatsApp && onShareWhatsApp(album)}
            title="Share Album on WhatsApp"
          >
            💬 Share
          </button>
        </div>
      </div>
    </div>
  );
}

export function AlbumGrid({ albums = [], onOpenAlbum, onEditAlbum, onDeleteAlbum, onShareWhatsApp, isAdmin }) {
  const safeAlbums = Array.isArray(albums) ? albums.filter(Boolean) : [];
  return (
    <div className="album-grid">
      {safeAlbums.map((album) => (
        <AlbumCard
          key={album.id || Math.random()}
          album={album}
          onOpenAlbum={onOpenAlbum}
          onEditAlbum={onEditAlbum}
          onDeleteAlbum={onDeleteAlbum}
          onShareWhatsApp={onShareWhatsApp}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
}

export default AlbumCard;
