import "../../Style/Gallery.css";

export function GalleryTabs({ activeTab, onTabChange, counts = {} }) {
  const tabs = [
    { id: "all", label: "All Media", icon: "🌌", count: counts.all || 0 },
    { id: "photos", label: "Photos", icon: "📸", count: counts.photos || 0 },
    { id: "videos", label: "Videos", icon: "🎥", count: counts.videos || 0 },
    { id: "albums", label: "Albums", icon: "📁", count: counts.albums || 0 },
    { id: "best", label: "⭐ Best Photos", icon: "⭐", count: counts.best || 0 }
  ];

  return (
    <div className="gallery-tabs-container">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            className={`gallery-tab-btn ${isActive ? "active" : ""}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="gallery-tab-icon">{tab.icon}</span>
            <span className="gallery-tab-label">{tab.label}</span>
            <span className={`gallery-tab-count ${isActive ? "active-count" : ""}`}>
              {tab.count}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export default GalleryTabs;
