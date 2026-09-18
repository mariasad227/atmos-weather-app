export default function Sidebar({ history, favorites, onSelect, onClearHistory, onRemoveFavorite }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-header">
          <span className="eyebrow mono">FAVORITES</span>
        </div>
        {favorites.length === 0 ? (
          <p className="empty-note">Star a location to pin it here.</p>
        ) : (
          <ul className="place-list">
            {favorites.map((f) => (
              <li key={f.id}>
                <button
                  className="place-btn"
                  onClick={() => onSelect({ city: f.city, country: f.country, latitude: f.latitude, longitude: f.longitude })}
                >
                  <span>{f.city}</span>
                  <span className="place-region mono">{f.country || ""}</span>
                </button>
                <button
                  className="place-remove"
                  onClick={() => onRemoveFavorite(f.id)}
                  aria-label={`Remove ${f.city} from favorites`}
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="sidebar-section">
        <div className="sidebar-header">
          <span className="eyebrow mono">RECENT SEARCHES</span>
          {history.length > 0 && (
            <button className="text-btn mono" onClick={onClearHistory}>
              CLEAR
            </button>
          )}
        </div>
        {history.length === 0 ? (
          <p className="empty-note">Your searches will show up here.</p>
        ) : (
          <ul className="place-list">
            {history.map((h) => (
              <li key={h.id}>
                <button
                  className="place-btn"
                  onClick={() => onSelect({ city: h.city, country: h.country, latitude: h.latitude, longitude: h.longitude })}
                >
                  <span>{h.city}</span>
                  <span className="place-region mono">{h.country || ""}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
