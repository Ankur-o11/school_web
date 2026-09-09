import "../../Style/Gallery.css";

export function GallerySearchFilters({
  searchQuery,
  onSearchChange,
  selectedAlbumFilter,
  onAlbumFilterChange,
  selectedVisibilityFilter,
  onVisibilityFilterChange,
  albums = [],
  onResetFilters
}) {
  return (
    <div className="gallery-toolbar">
      <div className="gallery-search-box">
        <span style={{ fontSize: "16px", color: "var(--text-muted)" }}>🔍</span>
        <input
          type="text"
          placeholder="Search by title, caption, or album name..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      <div className="gallery-filter-group">
        <select
          className="ui-select"
          value={selectedAlbumFilter}
          onChange={(e) => onAlbumFilterChange(e.target.value)}
        >
          <option value="ALL">All Albums</option>
          {albums.map((alb) => (
            <option key={alb.id} value={alb.id}>
              {alb.title}
            </option>
          ))}
        </select>

        <select
          className="ui-select"
          value={selectedVisibilityFilter}
          onChange={(e) => onVisibilityFilterChange(e.target.value)}
        >
          <option value="ALL">All Access Levels</option>
          <option value="Everyone">Everyone (Public)</option>
          <option value="Restricted">Restricted (Roles/Groups)</option>
        </select>

        {(searchQuery || selectedAlbumFilter !== "ALL" || selectedVisibilityFilter !== "ALL") && (
          <button className="ui-btn ui-btn-secondary ui-btn-sm" onClick={onResetFilters}>
            ✕ Clear Filters
          </button>
        )}
      </div>
    </div>
  );
}

export default GallerySearchFilters;
