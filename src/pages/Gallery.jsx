import { useState, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import GalleryHeader from "../components/gallery/GalleryHeader";
import GalleryTabs from "../components/gallery/GalleryTabs";
import GallerySearchFilters from "../components/gallery/GallerySearchFilters";
import { AlbumGrid } from "../components/gallery/AlbumCard";
import AlbumDetail from "../components/gallery/AlbumDetail";
import { PhotoGrid } from "../components/gallery/PhotoCard";
import { VideoGrid } from "../components/gallery/VideoCard";
import BestPhotos from "../components/gallery/BestPhotos";
import CreateEditAlbumModal from "../components/gallery/CreateEditAlbumModal";
import MediaUploadModal from "../components/gallery/MediaUploadModal";
import PhotoViewerModal from "../components/gallery/PhotoViewerModal";
import VideoViewerModal from "../components/gallery/VideoViewerModal";
import GalleryWhatsAppShareModal from "../components/gallery/GalleryWhatsAppShareModal";
import GalleryPermissionsModal from "../components/gallery/GalleryPermissionsModal";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import EmptyState from "../components/ui/EmptyState";
import "../Style/Gallery.css";

// Sample Initial Gallery Media
const INITIAL_ALBUMS = [
  {
    id: "ALB-01",
    title: "Annual Sports Meet 2026",
    description: "Athletic track events, march past, relay races, and trophy award ceremony highlights.",
    date: "2026-08-26",
    day: "Wednesday",
    wallpaper: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80",
    photoCount: 4,
    videoCount: 2,
    visibility: "Everyone",
    allowedRoles: ["Admin", "Teacher", "Parent", "Student"],
    coverIcon: "🏃"
  },
  {
    id: "ALB-02",
    title: "Science & Robotics Exhibition",
    description: "Innovative STEM projects, working models, electronic circuits, and student demonstrations.",
    date: "2026-08-30",
    day: "Sunday",
    wallpaper: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80",
    photoCount: 3,
    videoCount: 1,
    visibility: "Everyone",
    allowedRoles: ["Admin", "Teacher", "Parent", "Student"],
    coverIcon: "🔬"
  },
  {
    id: "ALB-03",
    title: "78th Independence Day Celebration",
    description: "Flag hoisting ceremony, patriotic group dances, parade, and school band performances.",
    date: "2026-08-15",
    day: "Saturday",
    wallpaper: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=800&q=80",
    photoCount: 3,
    videoCount: 1,
    visibility: "Restricted",
    allowedRoles: ["Admin", "Teacher"],
    coverIcon: "🇮🇳"
  }
];

const INITIAL_PHOTOS = [
  {
    id: "PH-101",
    albumId: "ALB-01",
    title: "100m Athletics Final Sprint",
    caption: "Senior boys 100m sprint finals at the main athletic ground.",
    url: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80",
    date: "2026-08-26",
    isBest: true,
    visibility: "Everyone"
  },
  {
    id: "PH-102",
    albumId: "ALB-01",
    title: "Overall Championship Trophy",
    caption: "Tagore House winning the overall Sports Meet 2026 Championship Trophy.",
    url: "https://images.unsplash.com/photo-1578269174936-2709b6aeb913?auto=format&fit=crop&w=800&q=80",
    date: "2026-08-26",
    isBest: true,
    visibility: "Everyone"
  },
  {
    id: "PH-103",
    albumId: "ALB-01",
    title: "High Jump Competition",
    caption: "Class 10 students clearing the 1.6m high jump bar.",
    url: "https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=800&q=80",
    date: "2026-08-26",
    isBest: false,
    visibility: "Everyone"
  },
  {
    id: "PH-104",
    albumId: "ALB-01",
    title: "March Past Parade",
    caption: "School houses marching past the main podium.",
    url: "https://images.unsplash.com/photo-1511988617509-a57c8a288659?auto=format&fit=crop&w=800&q=80",
    date: "2026-08-26",
    isBest: false,
    visibility: "Everyone"
  },
  {
    id: "PH-201",
    albumId: "ALB-02",
    title: "Autonomous Robotics Model",
    caption: "Class 11 Science students showcasing obstacle avoiding robot.",
    url: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80",
    date: "2026-08-30",
    isBest: true,
    visibility: "Everyone"
  },
  {
    id: "PH-202",
    albumId: "ALB-02",
    title: "Solar Energy Project Model",
    caption: "Renewable energy demonstration by Junior Science Club.",
    url: "https://images.unsplash.com/photo-1509391365360-2e959784a276?auto=format&fit=crop&w=800&q=80",
    date: "2026-08-30",
    isBest: false,
    visibility: "Everyone"
  },
  {
    id: "PH-203",
    albumId: "ALB-02",
    title: "Chemistry Volumetric Analysis",
    caption: "Titration experiment demonstration in Chemistry Lab.",
    url: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=800&q=80",
    date: "2026-08-30",
    isBest: false,
    visibility: "Everyone"
  },
  {
    id: "PH-301",
    albumId: "ALB-03",
    title: "Flag Hoisting Ceremony",
    caption: "Principal and Chief Guest hoisting the National Flag.",
    url: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=800&q=80",
    date: "2026-08-15",
    isBest: true,
    visibility: "Restricted"
  },
  {
    id: "PH-302",
    albumId: "ALB-03",
    title: "Patriotic Dance Performance",
    caption: "Cultural dance team performing on Vande Mataram.",
    url: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
    date: "2026-08-15",
    isBest: false,
    visibility: "Restricted"
  },
  {
    id: "PH-303",
    albumId: "ALB-03",
    title: "School Choir Performance",
    caption: "School choir singing patriotic anthems.",
    url: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80",
    date: "2026-08-15",
    isBest: false,
    visibility: "Restricted"
  }
];

const INITIAL_VIDEOS = [
  {
    id: "VID-101",
    albumId: "ALB-01",
    title: "Sports Day Opening Ceremony & March Past",
    description: "Complete video recording of the March Past and Principal's opening address.",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=800&q=80",
    date: "2026-08-26",
    duration: "12:45",
    visibility: "Everyone"
  },
  {
    id: "VID-102",
    albumId: "ALB-01",
    title: "4x100m Relay Final Highlights",
    description: "Thrilling final lap of the 4x100m inter-house relay race.",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=800&q=80",
    date: "2026-08-26",
    duration: "04:15",
    visibility: "Everyone"
  },
  {
    id: "VID-201",
    albumId: "ALB-02",
    title: "Robotics Competition Final Demonstration",
    description: "Line follower and maze solver robot live test run.",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=800&q=80",
    date: "2026-08-30",
    duration: "08:20",
    visibility: "Everyone"
  },
  {
    id: "VID-301",
    albumId: "ALB-03",
    title: "Independence Day Cultural Program Video",
    description: "Complete video highlights of 78th Independence Day celebrations.",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    thumbnail: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?auto=format&fit=crop&w=800&q=80",
    date: "2026-08-15",
    duration: "18:10",
    visibility: "Restricted"
  }
];

export function Gallery() {
  const { user, hasPermission } = useAuth();
  const isAdmin = user?.role === "Admin" || hasPermission("gallery.create") || hasPermission("gallery.permissions");

  // State Management
  const [schoolLogo, setSchoolLogo] = useState(null);
  const [albums, setAlbums] = useState(INITIAL_ALBUMS);
  const [photos, setPhotos] = useState(INITIAL_PHOTOS);
  const [videos, setVideos] = useState(INITIAL_VIDEOS);

  const [activeTab, setActiveTab] = useState("albums"); // "all" | "photos" | "videos" | "albums" | "best"
  const [selectedAlbum, setSelectedAlbum] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAlbumFilter, setSelectedAlbumFilter] = useState("ALL");
  const [selectedVisibilityFilter, setSelectedVisibilityFilter] = useState("ALL");

  // Modals & Viewers
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [albumToEdit, setAlbumToEdit] = useState(null);

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadTargetAlbumId, setUploadTargetAlbumId] = useState(null);
  const [uploadMediaType, setUploadMediaType] = useState("photo");

  const [activePhotoViewer, setActivePhotoViewer] = useState(null);
  const [activeVideoViewer, setActiveVideoViewer] = useState(null);

  const [whatsAppShareTarget, setWhatsAppShareTarget] = useState(null); // { item, type }
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState(false);
  const [galleryPermissions, setGalleryPermissions] = useState({
    galleryAccess: "Everyone",
    albumDefaultAccess: "Follow Gallery",
    photoDefaultAccess: "Follow Album",
    videoDefaultAccess: "Follow Album",
    allowedRoles: ["Admin", "Teacher", "Parent", "Student", "Staff"]
  });

  const [deleteConfirmTarget, setDeleteConfirmTarget] = useState(null); // { item, type }

  // Map albums by ID
  const albumsMap = useMemo(() => {
    return albums.reduce((acc, alb) => {
      acc[alb.id] = alb;
      return acc;
    }, {});
  }, [albums]);

  // Counts
  const bestPhotosList = useMemo(() => photos.filter((p) => p.isBest), [photos]);
  const counts = {
    all: photos.length + videos.length,
    photos: photos.length,
    videos: videos.length,
    albums: albums.length,
    best: bestPhotosList.length
  };

  // Filtered Datasets
  const filteredAlbums = useMemo(() => {
    return albums.filter((alb) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const match = alb.title.toLowerCase().includes(q) || (alb.description || "").toLowerCase().includes(q);
        if (!match) return false;
      }
      if (selectedVisibilityFilter !== "ALL" && alb.visibility !== selectedVisibilityFilter) {
        return false;
      }
      return true;
    });
  }, [albums, searchQuery, selectedVisibilityFilter]);

  const filteredPhotos = useMemo(() => {
    return photos.filter((p) => {
      if (selectedAlbumFilter !== "ALL" && p.albumId !== selectedAlbumFilter) return false;
      if (selectedVisibilityFilter !== "ALL" && p.visibility !== selectedVisibilityFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const albTitle = (albumsMap[p.albumId]?.title || "").toLowerCase();
        const match = (p.title || "").toLowerCase().includes(q) || (p.caption || "").toLowerCase().includes(q) || albTitle.includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [photos, selectedAlbumFilter, selectedVisibilityFilter, searchQuery, albumsMap]);

  const filteredVideos = useMemo(() => {
    return videos.filter((v) => {
      if (selectedAlbumFilter !== "ALL" && v.albumId !== selectedAlbumFilter) return false;
      if (selectedVisibilityFilter !== "ALL" && v.visibility !== selectedVisibilityFilter) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const albTitle = (albumsMap[v.albumId]?.title || "").toLowerCase();
        const match = (v.title || "").toLowerCase().includes(q) || (v.description || "").toLowerCase().includes(q) || albTitle.includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [videos, selectedAlbumFilter, selectedVisibilityFilter, searchQuery, albumsMap]);

  // Handlers for Albums
  const handleSaveAlbum = (albumData) => {
    if (albumData.id) {
      // Edit
      setAlbums((prev) => prev.map((a) => (a.id === albumData.id ? { ...a, ...albumData } : a)));
      if (selectedAlbum?.id === albumData.id) {
        setSelectedAlbum((prev) => (prev ? { ...prev, ...albumData } : null));
      }
    } else {
      // Create
      const newAlbum = {
        id: `ALB-${Date.now()}`,
        photoCount: 0,
        videoCount: 0,
        ...albumData
      };
      setAlbums((prev) => [newAlbum, ...prev]);
      setActiveTab("albums");
      setSelectedAlbum(null);
    }
    setAlbumToEdit(null);
  };

  const handleDeleteAlbumConfirmed = () => {
    if (deleteConfirmTarget?.item) {
      const albId = deleteConfirmTarget.item.id;
      setAlbums((prev) => prev.filter((a) => a.id !== albId));
      setPhotos((prev) => prev.filter((p) => p.albumId !== albId));
      setVideos((prev) => prev.filter((v) => v.albumId !== albId));
      if (selectedAlbum?.id === albId) setSelectedAlbum(null);
    }
    setDeleteConfirmTarget(null);
  };

  // Handlers for Media
  const handleUploadMedia = (newItems, type) => {
    if (!newItems || !newItems.length) return;

    if (type === "photo") {
      setPhotos((prev) => [...newItems, ...prev]);
      // Update album photo count
      const countsByAlb = {};
      newItems.forEach((p) => {
        if (p.albumId) {
          countsByAlb[p.albumId] = (countsByAlb[p.albumId] || 0) + 1;
        }
      });
      setAlbums((prev) =>
        prev.map((a) => (countsByAlb[a.id] ? { ...a, photoCount: (a.photoCount || 0) + countsByAlb[a.id] } : a))
      );
    } else {
      setVideos((prev) => [...newItems, ...prev]);
      const countsByAlb = {};
      newItems.forEach((v) => {
        if (v.albumId) {
          countsByAlb[v.albumId] = (countsByAlb[v.albumId] || 0) + 1;
        }
      });
      setAlbums((prev) =>
        prev.map((a) => (countsByAlb[a.id] ? { ...a, videoCount: (a.videoCount || 0) + countsByAlb[a.id] } : a))
      );
    }
  };

  const handleToggleBestPhoto = (photo) => {
    setPhotos(
      photos.map((p) => (p.id === photo.id ? { ...p, isBest: !p.isBest } : p))
    );
  };

  const handleDeleteMediaConfirmed = () => {
    if (!deleteConfirmTarget?.item) return;
    const { item, type } = deleteConfirmTarget;

    if (type === "photo") {
      setPhotos(photos.filter((p) => p.id !== item.id));
      if (item.albumId) {
        setAlbums(
          albums.map((a) => (a.id === item.albumId ? { ...a, photoCount: Math.max(0, a.photoCount - 1) } : a))
        );
      }
    } else if (type === "video") {
      setVideos(videos.filter((v) => v.id !== item.id));
      if (item.albumId) {
        setAlbums(
          albums.map((a) => (a.id === item.albumId ? { ...a, videoCount: Math.max(0, a.videoCount - 1) } : a))
        );
      }
    }
    setDeleteConfirmTarget(null);
  };

  // Lightbox Navigation
  const currentViewerPhotoIndex = activePhotoViewer ? filteredPhotos.findIndex((p) => p.id === activePhotoViewer.id) : -1;
  const currentViewerVideoIndex = activeVideoViewer ? filteredVideos.findIndex((v) => v.id === activeVideoViewer.id) : -1;

  return (
    <div className="gallery-page">
      {/* 1. BRANDING HEADER */}
      <GalleryHeader
        schoolLogo={schoolLogo}
        onLogoChange={(newLogo) => setSchoolLogo(newLogo)}
        isAdmin={isAdmin}
      />

      {/* ADMIN ACTION BAR */}
      {isAdmin && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "20px", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              className="ui-btn ui-btn-primary"
              onClick={() => {
                setAlbumToEdit(null);
                setIsAlbumModalOpen(true);
              }}
            >
              + Create Album
            </button>
            <button
              className="ui-btn ui-btn-secondary"
              onClick={() => {
                setUploadTargetAlbumId(selectedAlbum?.id || albums[0]?.id || null);
                setUploadMediaType("photo");
                setIsUploadModalOpen(true);
              }}
            >
              📸 Upload Photos
            </button>
            <button
              className="ui-btn ui-btn-secondary"
              onClick={() => {
                setUploadTargetAlbumId(selectedAlbum?.id || albums[0]?.id || null);
                setUploadMediaType("video");
                setIsUploadModalOpen(true);
              }}
            >
              🎥 Add Video
            </button>
          </div>

          <button
            className="ui-btn ui-btn-secondary"
            onClick={() => setIsPermissionsModalOpen(true)}
            title="Configure Gallery Restrictions Policy"
          >
            🔒 Access Policy & Restrictions
          </button>
        </div>
      )}

      {/* IF IN ALBUM DETAIL VIEW */}
      {selectedAlbum ? (
        <AlbumDetail
          album={selectedAlbum}
          photos={photos}
          videos={videos}
          onBackToAlbums={() => setSelectedAlbum(null)}
          onEditAlbum={(alb) => {
            setAlbumToEdit(alb);
            setIsAlbumModalOpen(true);
          }}
          onDeleteAlbum={(alb) => setDeleteConfirmTarget({ item: alb, type: "album" })}
          onShareWhatsApp={(alb) => setWhatsAppShareTarget({ item: alb, type: "album" })}
          onAddPhotos={(alb) => {
            setUploadTargetAlbumId(alb.id);
            setUploadMediaType("photo");
            setIsUploadModalOpen(true);
          }}
          onAddVideos={(alb) => {
            setUploadTargetAlbumId(alb.id);
            setUploadMediaType("video");
            setIsUploadModalOpen(true);
          }}
          onOpenPhotoViewer={(ph) => setActivePhotoViewer(ph)}
          onOpenVideoViewer={(vid) => setActiveVideoViewer(vid)}
          onToggleBestPhoto={handleToggleBestPhoto}
          onDeletePhoto={(ph) => setDeleteConfirmTarget({ item: ph, type: "photo" })}
          onDeleteVideo={(vid) => setDeleteConfirmTarget({ item: vid, type: "video" })}
          onShareAgain={(item) => setWhatsAppShareTarget({ item, type: item.url ? (item.duration ? "video" : "photo") : "album" })}
          isAdmin={isAdmin}
        />
      ) : (
        <>
          {/* 2. NAVIGATION TABS */}
          <GalleryTabs
            activeTab={activeTab}
            onTabChange={(tabId) => setActiveTab(tabId)}
            counts={counts}
          />

          {/* 3. SEARCH & FILTERS TOOLBAR */}
          <GallerySearchFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedAlbumFilter={selectedAlbumFilter}
            onAlbumFilterChange={setSelectedAlbumFilter}
            selectedVisibilityFilter={selectedVisibilityFilter}
            onVisibilityFilterChange={setSelectedVisibilityFilter}
            albums={albums}
            onResetFilters={() => {
              setSearchQuery("");
              setSelectedAlbumFilter("ALL");
              setSelectedVisibilityFilter("ALL");
            }}
          />

          {/* 4. MAIN TAB VIEWS */}
          {activeTab === "albums" && (
            <div>
              {filteredAlbums.length === 0 ? (
                <EmptyState
                  icon="📁"
                  title="No Albums Found"
                  description="No albums match your search filters or no albums have been created yet."
                  action={isAdmin ? { label: "+ Create New Album", onClick: () => setIsAlbumModalOpen(true) } : null}
                />
              ) : (
                <AlbumGrid
                  albums={filteredAlbums}
                  onOpenAlbum={(alb) => setSelectedAlbum(alb)}
                  onEditAlbum={(alb) => {
                    setAlbumToEdit(alb);
                    setIsAlbumModalOpen(true);
                  }}
                  onDeleteAlbum={(alb) => setDeleteConfirmTarget({ item: alb, type: "album" })}
                  onShareWhatsApp={(alb) => setWhatsAppShareTarget({ item: alb, type: "album" })}
                  isAdmin={isAdmin}
                />
              )}
            </div>
          )}

          {activeTab === "photos" && (
            <div>
              {filteredPhotos.length === 0 ? (
                <EmptyState
                  icon="📸"
                  title="No Photos Available"
                  description="Try clearing your search query or upload new photos to the gallery."
                />
              ) : (
                <PhotoGrid
                  photos={filteredPhotos}
                  albumsMap={albumsMap}
                  onOpenViewer={(ph) => setActivePhotoViewer(ph)}
                  onToggleBest={handleToggleBestPhoto}
                  onDeletePhoto={(ph) => setDeleteConfirmTarget({ item: ph, type: "photo" })}
                  onShareWhatsApp={(ph) => setWhatsAppShareTarget({ item: ph, type: "photo" })}
                  onShareAgain={(ph) => setWhatsAppShareTarget({ item: ph, type: "photo" })}
                  isAdmin={isAdmin}
                />
              )}
            </div>
          )}

          {activeTab === "videos" && (
            <div>
              {filteredVideos.length === 0 ? (
                <EmptyState
                  icon="🎥"
                  title="No Videos Available"
                  description="No video recordings match your filter criteria."
                />
              ) : (
                <VideoGrid
                  videos={filteredVideos}
                  albumsMap={albumsMap}
                  onOpenViewer={(vid) => setActiveVideoViewer(vid)}
                  onDeleteVideo={(vid) => setDeleteConfirmTarget({ item: vid, type: "video" })}
                  onShareWhatsApp={(vid) => setWhatsAppShareTarget({ item: vid, type: "video" })}
                  onShareAgain={(vid) => setWhatsAppShareTarget({ item: vid, type: "video" })}
                  isAdmin={isAdmin}
                />
              )}
            </div>
          )}

          {activeTab === "all" && (
            <div>
              <div style={{ marginBottom: "32px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "16px", color: "var(--text-main)" }}>
                  📸 Photos ({filteredPhotos.length})
                </h3>
                {filteredPhotos.length === 0 ? (
                  <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No matching photos.</p>
                ) : (
                  <PhotoGrid
                    photos={filteredPhotos}
                    albumsMap={albumsMap}
                    onOpenViewer={(ph) => setActivePhotoViewer(ph)}
                    onToggleBest={handleToggleBestPhoto}
                    onDeletePhoto={(ph) => setDeleteConfirmTarget({ item: ph, type: "photo" })}
                    onShareWhatsApp={(ph) => setWhatsAppShareTarget({ item: ph, type: "photo" })}
                    onShareAgain={(ph) => setWhatsAppShareTarget({ item: ph, type: "photo" })}
                    isAdmin={isAdmin}
                  />
                )}
              </div>

              <div>
                <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "16px", color: "var(--text-main)" }}>
                  🎥 Videos ({filteredVideos.length})
                </h3>
                {filteredVideos.length === 0 ? (
                  <p style={{ color: "var(--text-muted)", fontSize: "13px" }}>No matching videos.</p>
                ) : (
                  <VideoGrid
                    videos={filteredVideos}
                    albumsMap={albumsMap}
                    onOpenViewer={(vid) => setActiveVideoViewer(vid)}
                    onDeleteVideo={(vid) => setDeleteConfirmTarget({ item: vid, type: "video" })}
                    onShareWhatsApp={(vid) => setWhatsAppShareTarget({ item: vid, type: "video" })}
                    onShareAgain={(vid) => setWhatsAppShareTarget({ item: vid, type: "video" })}
                    isAdmin={isAdmin}
                  />
                )}
              </div>
            </div>
          )}

          {activeTab === "best" && (
            <BestPhotos
              bestPhotos={bestPhotosList}
              albumsMap={albumsMap}
              onOpenViewer={(ph) => setActivePhotoViewer(ph)}
              onToggleBest={handleToggleBestPhoto}
              onDeletePhoto={(ph) => setDeleteConfirmTarget({ item: ph, type: "photo" })}
              onShareWhatsApp={(ph) => setWhatsAppShareTarget({ item: ph, type: "photo" })}
              onShareAgain={(ph) => setWhatsAppShareTarget({ item: ph, type: "photo" })}
              onOpenAlbum={(alb) => setSelectedAlbum(alb)}
              isAdmin={isAdmin}
            />
          )}
        </>
      )}

      {/* CREATE / EDIT ALBUM MODAL */}
      <CreateEditAlbumModal
        isOpen={isAlbumModalOpen}
        onClose={() => {
          setIsAlbumModalOpen(false);
          setAlbumToEdit(null);
        }}
        onSave={handleSaveAlbum}
        albumToEdit={albumToEdit}
      />

      {/* MEDIA UPLOAD MODAL */}
      <MediaUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUpload={handleUploadMedia}
        albums={albums}
        targetAlbumId={uploadTargetAlbumId}
        mediaType={uploadMediaType}
      />

      {/* FULLSCREEN PHOTO LIGHTBOX VIEWER */}
      <PhotoViewerModal
        photo={activePhotoViewer}
        albumName={albumsMap[activePhotoViewer?.albumId]?.title}
        onClose={() => setActivePhotoViewer(null)}
        onPrev={() => currentViewerPhotoIndex > 0 && setActivePhotoViewer(filteredPhotos[currentViewerPhotoIndex - 1])}
        onNext={() => currentViewerPhotoIndex < filteredPhotos.length - 1 && setActivePhotoViewer(filteredPhotos[currentViewerPhotoIndex + 1])}
        hasPrev={currentViewerPhotoIndex > 0}
        hasNext={currentViewerPhotoIndex < filteredPhotos.length - 1}
        onToggleBest={handleToggleBestPhoto}
        onShareWhatsApp={(ph) => setWhatsAppShareTarget({ item: ph, type: "photo" })}
        isAdmin={isAdmin}
      />

      {/* VIDEO VIEWER MODAL */}
      <VideoViewerModal
        video={activeVideoViewer}
        albumName={albumsMap[activeVideoViewer?.albumId]?.title}
        onClose={() => setActiveVideoViewer(null)}
        onPrev={() => currentViewerVideoIndex > 0 && setActiveVideoViewer(filteredVideos[currentViewerVideoIndex - 1])}
        onNext={() => currentViewerVideoIndex < filteredVideos.length - 1 && setActiveVideoViewer(filteredVideos[currentViewerVideoIndex + 1])}
        hasPrev={currentViewerVideoIndex > 0}
        hasNext={currentViewerVideoIndex < filteredVideos.length - 1}
        onShareWhatsApp={(vid) => setWhatsAppShareTarget({ item: vid, type: "video" })}
      />

      {/* WHATSAPP SHARE & SHARE AGAIN MODAL */}
      <GalleryWhatsAppShareModal
        isOpen={!!whatsAppShareTarget}
        onClose={() => setWhatsAppShareTarget(null)}
        targetItem={whatsAppShareTarget?.item}
        itemType={whatsAppShareTarget?.type}
        isAdmin={isAdmin}
      />

      {/* ADMIN PERMISSIONS MODAL */}
      <GalleryPermissionsModal
        isOpen={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
        currentPermissions={galleryPermissions}
        onSavePermissions={(newPerms) => setGalleryPermissions(newPerms)}
      />

      {/* DELETE CONFIRMATION DIALOG */}
      <ConfirmDialog
        isOpen={!!deleteConfirmTarget}
        onClose={() => setDeleteConfirmTarget(null)}
        onConfirm={deleteConfirmTarget?.type === "album" ? handleDeleteAlbumConfirmed : handleDeleteMediaConfirmed}
        title={`Delete ${deleteConfirmTarget?.type?.toUpperCase() || "Item"}?`}
        message={`Are you sure you want to remove this ${deleteConfirmTarget?.type || "item"}? It will be removed from the gallery view.`}
        confirmText="Delete Now"
        confirmVariant="danger"
      />
    </div>
  );
}

export default Gallery;