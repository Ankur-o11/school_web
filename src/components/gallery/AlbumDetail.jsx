import { formatAlbumDateAndDay } from "./AlbumCard";
import StatusBadge from "../ui/StatusBadge";
import { PhotoGrid } from "./PhotoCard";
import { VideoGrid } from "./VideoCard";
import EmptyState from "../ui/EmptyState";
import "../../Style/Gallery.css";

export function AlbumDetail({
  album,
  photos = [],
  videos = [],
  onBackToAlbums,
  onEditAlbum,
  onDeleteAlbum,
  onShareWhatsApp,
  onAddPhotos,
  onAddVideos,
  onOpenPhotoViewer,
  onOpenVideoViewer,
  onToggleBestPhoto,
  onDeletePhoto,
  onDeleteVideo,
  onShareAgain,
  isAdmin = true
}) {
  if (!album) return null;

  const { formattedDate, dayName } = formatAlbumDateAndDay(album.date);
  const albumPhotos = photos.filter((p) => p.albumId === album.id);
  const albumVideos = videos.filter((v) => v.albumId === album.id);

  return (
    <div className="album-detail-view">
      {/* Back Button Bar */}
      <div className="album-detail-top-nav">
        <button className="ui-btn ui-btn-secondary ui-btn-sm" onClick={onBackToAlbums}>
          ← Back to All Albums
        </button>

        <div style={{ display: "flex", gap: "8px" }}>
          {isAdmin && (
            <>
              <button className="ui-btn ui-btn-secondary ui-btn-sm" onClick={() => onEditAlbum(album)}>
                ✏️ Edit Album
              </button>
              <button className="ui-btn ui-btn-danger ui-btn-sm" onClick={() => onDeleteAlbum(album)}>
                🗑️ Delete
              </button>
            </>
          )}
          <button className="ui-btn ui-btn-primary ui-btn-sm" onClick={() => onShareWhatsApp(album)}>
            💬 Share Album on WhatsApp
          </button>
        </div>
      </div>

      {/* Album Cover Banner Header */}
      <div className="album-banner-header">
        <div className="album-banner-cover">
          {album.wallpaper ? (
            <img src={album.wallpaper} alt={album.title} className="album-banner-img" />
          ) : (
            <div className="album-banner-placeholder">
              <span>{album.coverIcon || "🖼️"}</span>
            </div>
          )}
          <div className="album-banner-badge">
            <StatusBadge status={album.visibility || "Everyone"} />
          </div>
        </div>

        <div className="album-banner-info">
          <div className="album-banner-date-tag">
            <span>📅 {formattedDate}</span>
            {dayName && <span className="album-day-tag">{dayName}</span>}
          </div>

          <h2 className="album-banner-title">{album.title}</h2>
          <p className="album-banner-desc">{album.description}</p>

          <div className="album-banner-stats">
            <div className="album-stat-pill">
              <span className="stat-num">{albumPhotos.length}</span>
              <span className="stat-lbl">Photos</span>
            </div>
            <div className="album-stat-pill">
              <span className="stat-num">{albumVideos.length}</span>
              <span className="stat-lbl">Videos</span>
            </div>
          </div>
        </div>
      </div>

      {/* AREA 1: PHOTO COLLECTION */}
      <div className="album-media-section">
        <div className="album-section-header">
          <div>
            <h3>📸 PHOTO COLLECTION ({albumPhotos.length})</h3>
            <p>Pictures captured during {album.title}</p>
          </div>
          {isAdmin && (
            <button className="ui-btn ui-btn-primary ui-btn-sm" onClick={() => onAddPhotos(album)}>
              + Add Photos
            </button>
          )}
        </div>

        {albumPhotos.length === 0 ? (
          <EmptyState
            icon="📸"
            title="No Photos in this Album"
            description="Add photos to build this album's picture collection."
            action={isAdmin ? { label: "+ Add Photos", onClick: () => onAddPhotos(album) } : null}
          />
        ) : (
          <PhotoGrid
            photos={albumPhotos}
            albumsMap={{ [album.id]: album }}
            onOpenViewer={onOpenPhotoViewer}
            onToggleBest={onToggleBestPhoto}
            onDeletePhoto={onDeletePhoto}
            onShareWhatsApp={onShareWhatsApp}
            onShareAgain={onShareAgain}
            isAdmin={isAdmin}
          />
        )}
      </div>

      {/* AREA 2: VIDEO COLLECTION */}
      <div className="album-media-section" style={{ marginTop: "40px" }}>
        <div className="album-section-header">
          <div>
            <h3>🎥 VIDEO COLLECTION ({albumVideos.length})</h3>
            <p>Video recordings and highlights for {album.title}</p>
          </div>
          {isAdmin && (
            <button className="ui-btn ui-btn-primary ui-btn-sm" onClick={() => onAddVideos(album)}>
              + Add Videos
            </button>
          )}
        </div>

        {albumVideos.length === 0 ? (
          <EmptyState
            icon="🎥"
            title="No Videos in this Album"
            description="Upload or add video recordings to this album."
            action={isAdmin ? { label: "+ Add Videos", onClick: () => onAddVideos(album) } : null}
          />
        ) : (
          <VideoGrid
            videos={albumVideos}
            albumsMap={{ [album.id]: album }}
            onOpenViewer={onOpenVideoViewer}
            onDeleteVideo={onDeleteVideo}
            onShareWhatsApp={onShareWhatsApp}
            onShareAgain={onShareAgain}
            isAdmin={isAdmin}
          />
        )}
      </div>
    </div>
  );
}

export default AlbumDetail;
