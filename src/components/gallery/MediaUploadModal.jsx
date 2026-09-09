import { useState } from "react";
import Modal from "../ui/Modal";
import "../../Style/Gallery.css";

export function MediaUploadModal({
  isOpen,
  onClose,
  onUpload,
  albums = [],
  targetAlbumId = null,
  mediaType = "photo" // "photo" | "video"
}) {
  const [selectedAlbumId, setSelectedAlbumId] = useState(targetAlbumId || (albums[0]?.id || ""));
  const [mediaList, setMediaList] = useState([]);
  const [title, setTitle] = useState("");
  const [caption, setCaption] = useState("");
  const [isBest, setIsBest] = useState(false);
  const [visibility, setVisibility] = useState("Everyone");
  const [videoUrl, setVideoUrl] = useState("");

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    const readPromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            id: `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            preview: reader.result,
            file
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(readPromises).then((newItems) => {
      setMediaList((prev) => [...prev, ...newItems]);
    });
  };

  const handleRemoveMedia = (id) => {
    setMediaList(mediaList.filter((m) => m.id !== id));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const albId = targetAlbumId || selectedAlbumId || albums[0]?.id;

    if (mediaType === "photo") {
      if (mediaList.length === 0) return;
      const newPhotos = mediaList.map((item, idx) => ({
        id: `PH-${Date.now()}-${idx}-${Math.floor(Math.random() * 1000)}`,
        albumId: albId,
        title: title || item.name,
        caption: caption || title || "Photo upload",
        url: item.preview,
        date: new Date().toISOString().split("T")[0],
        isBest,
        visibility
      }));
      onUpload(newPhotos, "photo");
    } else {
      // Video upload
      const newVideo = {
        id: `VID-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        albumId: albId,
        title: title || "Video Recording",
        description: caption || "Uploaded video highlight",
        url: videoUrl || (mediaList[0] ? mediaList[0].preview : "https://www.youtube.com/embed/dQw4w9WgXcQ"),
        thumbnail: mediaList[0] ? mediaList[0].preview : null,
        date: new Date().toISOString().split("T")[0],
        duration: "02:30",
        visibility
      };
      onUpload([newVideo], "video");
    }

    setMediaList([]);
    setTitle("");
    setCaption("");
    setIsBest(false);
    setVideoUrl("");
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={mediaType === "photo" ? `📸 Upload Multiple Photos (${mediaList.length} Selected)` : "🎥 Add Video Recording"}
      maxWidth="680px"
      footer={
        <>
          <button className="ui-btn ui-btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button
            className="ui-btn ui-btn-primary"
            onClick={handleSubmit}
            disabled={mediaType === "photo" && mediaList.length === 0}
          >
            {mediaType === "photo" ? `Upload All ${mediaList.length} Photos` : "Save Video"}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        {/* Album Selector */}
        {!targetAlbumId && (
          <div className="ui-form-group">
            <label>Select Target Media Album *</label>
            <select
              className="ui-form-control"
              value={selectedAlbumId}
              onChange={(e) => setSelectedAlbumId(e.target.value)}
              required
            >
              {albums.map((alb) => (
                <option key={alb.id} value={alb.id}>
                  📁 {alb.title}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="ui-form-group">
          <label>{mediaType === "photo" ? "Photo Title / Caption Prefix" : "Video Title *"}</label>
          <input
            type="text"
            className="ui-form-control"
            placeholder={mediaType === "photo" ? "e.g. Sports Day Track Events" : "e.g. Annual Speech Highlights"}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required={mediaType === "video"}
          />
        </div>

        <div className="ui-form-group">
          <label>Caption / Description</label>
          <textarea
            className="ui-form-control"
            rows={2}
            placeholder="Add descriptive details or tags..."
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
          />
        </div>

        {mediaType === "photo" ? (
          <div className="ui-form-group">
            <label style={{ fontWeight: "700" }}>Select Photos (Select Multiple Files At Once)</label>
            <div className="media-select-dropzone">
              <label className="ui-btn ui-btn-primary" style={{ cursor: "pointer", display: "inline-flex", gap: "8px", alignItems: "center" }}>
                <span>📁 Select Multiple Photos</span>
                <input type="file" accept="image/*" multiple onChange={handleFileSelect} style={{ display: "none" }} />
              </label>
              <span className="dropzone-hint" style={{ marginTop: "6px", display: "block" }}>
                Hold Ctrl (Windows) or Cmd (Mac) to select multiple photos at once.
              </span>
            </div>

            {/* Thumbnail Queue Header & Grid */}
            {mediaList.length > 0 && (
              <div style={{ marginTop: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <span style={{ fontSize: "13px", fontWeight: "700", color: "var(--text-main)" }}>
                    Selected Photos Queue ({mediaList.length} photos ready)
                  </span>
                  <button
                    type="button"
                    className="ui-btn ui-btn-secondary ui-btn-sm"
                    onClick={() => setMediaList([])}
                  >
                    Clear Queue
                  </button>
                </div>

                <div className="upload-queue-grid">
                  {mediaList.map((item) => (
                    <div key={item.id} className="upload-queue-thumb">
                      <img src={item.preview} alt="Upload preview" />
                      <button
                        type="button"
                        className="queue-remove-btn"
                        onClick={() => handleRemoveMedia(item.id)}
                        title="Remove photo"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="ui-form-group">
              <label>Video Direct URL or Embed Link</label>
              <input
                type="text"
                className="ui-form-control"
                placeholder="https://youtube.com/watch?v=... or MP4 URL"
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
              />
            </div>
            <div className="ui-form-group">
              <label>Or Upload Video File / Cover Thumbnail</label>
              <input type="file" accept="video/*,image/*" onChange={handleFileSelect} className="ui-form-control" />
            </div>
          </div>
        )}

        <div className="ui-form-row" style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid #e2e8f0" }}>
          {mediaType === "photo" && (
            <div className="ui-form-group">
              <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={isBest}
                  onChange={(e) => setIsBest(e.target.checked)}
                />
                <span style={{ fontWeight: "700", color: "#d97706" }}>⭐ Mark Photos as Best Photo Highlights</span>
              </label>
            </div>
          )}

          <div className="ui-form-group">
            <label>Visibility Setting</label>
            <select
              className="ui-form-control"
              value={visibility}
              onChange={(e) => setVisibility(e.target.value)}
            >
              <option value="Everyone">Public (Everyone)</option>
              <option value="Restricted">Restricted (Role Gated)</option>
            </select>
          </div>
        </div>
      </form>
    </Modal>
  );
}

export default MediaUploadModal;
