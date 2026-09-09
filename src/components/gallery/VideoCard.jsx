import ActionMenu from "../ui/ActionMenu";
import StatusBadge from "../ui/StatusBadge";
import { formatAlbumDateAndDay } from "./AlbumCard";
import "../../Style/Gallery.css";

export function VideoCard({
  video,
  albumName = "General",
  onOpenViewer,
  onDeleteVideo,
  onShareWhatsApp,
  onShareAgain,
  isAdmin = true
}) {
  if (!video) return null;
  const { formattedDate, dayName } = formatAlbumDateAndDay(video.date);

  const actions = [
    { label: "Play Video", icon: "▶️", onClick: () => onOpenViewer && onOpenViewer(video) },
    { label: "Share via WhatsApp", icon: "💬", onClick: () => onShareWhatsApp && onShareWhatsApp(video) },
    { label: "Share Again", icon: "🔄", onClick: () => onShareAgain && onShareAgain(video) }
  ];

  if (isAdmin) {
    actions.push(
      { label: "Delete Video", icon: "🗑️", danger: true, onClick: () => onDeleteVideo && onDeleteVideo(video) }
    );
  }

  return (
    <div className="media-card video-card">
      <div className="media-thumbnail-container video-thumbnail" onClick={() => onOpenViewer && onOpenViewer(video)}>
        {video.thumbnail ? (
          <img src={video.thumbnail} alt={video.title || "Video Thumbnail"} className="media-thumbnail-img" />
        ) : (
          <div className="media-thumbnail-placeholder video-placeholder">
            <span>🎥</span>
          </div>
        )}

        <div className="video-play-overlay">
          <span className="video-play-btn-circle">▶</span>
        </div>

        <span className="video-duration-badge">{video.duration || "VIDEO"}</span>

        <div className="media-badge-top-right">
          <StatusBadge status={video.visibility || "Everyone"} />
        </div>
      </div>

      <div className="media-card-body">
        <div className="media-title-row">
          <h4 className="media-title" onClick={() => onOpenViewer && onOpenViewer(video)}>
            {video.title || "Untitled Video Recording"}
          </h4>
          <ActionMenu actions={actions} />
        </div>

        <p className="video-description-preview">{video.description || "Video recording from school event."}</p>

        <div className="media-meta-row">
          <span className="media-album-tag">📁 {albumName}</span>
        </div>

        <div className="media-date-row">
          <span>📅 {formattedDate}</span>
          {dayName && <span className="album-day-tag">{dayName}</span>}
        </div>

        <div className="media-actions-row">
          <button className="ui-btn ui-btn-primary ui-btn-sm" onClick={() => onOpenViewer && onOpenViewer(video)}>
            ▶ Play Video
          </button>

          <button
            className="ui-btn ui-btn-secondary ui-btn-sm"
            onClick={() => onShareWhatsApp && onShareWhatsApp(video)}
            title="Share on WhatsApp"
          >
            💬 Share
          </button>
        </div>
      </div>
    </div>
  );
}

export function VideoGrid({
  videos = [],
  albumsMap = {},
  onOpenViewer,
  onDeleteVideo,
  onShareWhatsApp,
  onShareAgain,
  isAdmin
}) {
  const safeVideos = Array.isArray(videos) ? videos.filter(Boolean) : [];
  return (
    <div className="media-grid">
      {safeVideos.map((video) => (
        <VideoCard
          key={video.id || Math.random()}
          video={video}
          albumName={albumsMap[video.albumId]?.title || video.albumName || "School Video Archives"}
          onOpenViewer={onOpenViewer}
          onDeleteVideo={onDeleteVideo}
          onShareWhatsApp={onShareWhatsApp}
          onShareAgain={onShareAgain}
          isAdmin={isAdmin}
        />
      ))}
    </div>
  );
}

export default VideoCard;
