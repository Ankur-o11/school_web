import "../Style/Gallery.css";

function Gallery() {
  return (
    <div className="gallery-page">

      <div className="gallery-header">
        <div>
          <h1>🖼️ Gallery</h1>
          <p>Manage school photos, events and memories.</p>
        </div>

        <button className="gallery-add-btn">
          + Add Photo
        </button>
      </div>


      <div className="gallery-stats">

        <div className="gallery-stat-card">
          <div className="gallery-stat-icon">🖼️</div>

          <div>
            <span>Total Photos</span>
            <strong>156</strong>
          </div>
        </div>


        <div className="gallery-stat-card">
          <div className="gallery-stat-icon">🏆</div>

          <div>
            <span>Events</span>
            <strong>18</strong>
          </div>
        </div>


        <div className="gallery-stat-card">
          <div className="gallery-stat-icon">📅</div>

          <div>
            <span>This Month</span>
            <strong>24</strong>
          </div>
        </div>

      </div>


      <div className="gallery-card">

        <div className="gallery-card-header">
          <div>
            <h2>School Gallery</h2>
            <p>Photos from school events and activities</p>
          </div>

          <select className="gallery-filter">
            <option>All Categories</option>
            <option>Sports</option>
            <option>Events</option>
            <option>Science Exhibition</option>
            <option>Annual Function</option>
          </select>
        </div>


        <div className="gallery-grid">

          <div className="gallery-item">
            <div className="gallery-image">
              🏆
            </div>

            <div className="gallery-item-info">
              <strong>Annual Sports Day</strong>
              <span>Sports Event</span>
            </div>
          </div>


          <div className="gallery-item">
            <div className="gallery-image">
              🔬
            </div>

            <div className="gallery-item-info">
              <strong>Science Exhibition</strong>
              <span>Academic Event</span>
            </div>
          </div>


          <div className="gallery-item">
            <div className="gallery-image">
              🎭
            </div>

            <div className="gallery-item-info">
              <strong>Annual Function</strong>
              <span>Cultural Event</span>
            </div>
          </div>


          <div className="gallery-item">
            <div className="gallery-image">
              🇮🇳
            </div>

            <div className="gallery-item-info">
              <strong>Independence Day</strong>
              <span>School Event</span>
            </div>
          </div>


          <div className="gallery-item">
            <div className="gallery-image">
              👨‍🎓
            </div>

            <div className="gallery-item-info">
              <strong>Student Activities</strong>
              <span>Activities</span>
            </div>
          </div>


          <div className="gallery-item">
            <div className="gallery-image">
              👨‍🏫
            </div>

            <div className="gallery-item-info">
              <strong>Teacher's Day</strong>
              <span>Celebration</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}

export default Gallery;