import { PhotoGrid } from "./PhotoCard";
import EmptyState from "../ui/EmptyState";
import "../../Style/Gallery.css";

export function BestPhotos({
  bestPhotos = [],
  albumsMap = {},
  onOpenViewer,
  onToggleBest,
  onDeletePhoto,
  onShareWhatsApp,
  onShareAgain,
  onOpenAlbum,
  isAdmin
}) {
  if (bestPhotos.length === 0) {
    return (
      <EmptyState
        icon="⭐"
        title="No Best Photos Selected Yet"
        description="Mark any photo with the '⭐ Best Photo' badge to highlight it in this showcase."
      />
    );
  }

  return (
    <div className="best-photos-container">
      <div className="best-photos-header">
        <div>
          <h2>⭐ School Highlight Showcase (Best Photos)</h2>
          <p>Curated showcase of memorable photos selected across all school albums.</p>
        </div>
      </div>

      <PhotoGrid
        photos={bestPhotos}
        albumsMap={albumsMap}
        onOpenViewer={onOpenViewer}
        onToggleBest={onToggleBest}
        onDeletePhoto={onDeletePhoto}
        onShareWhatsApp={onShareWhatsApp}
        onShareAgain={onShareAgain}
        isAdmin={isAdmin}
      />
    </div>
  );
}

export default BestPhotos;
