import { useCallback, useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import CurrentPanel from "./components/CurrentPanel";
import ForecastStrip from "./components/ForecastStrip";
import Sidebar from "./components/Sidebar";
import { api } from "./api";
import "./app.css";

const DEFAULT_PLACE = { city: "Algiers", country: "Algeria", latitude: 36.75, longitude: 3.06 };

export default function App() {
  const [place, setPlace] = useState(DEFAULT_PLACE);
  const [weather, setWeather] = useState(null);
  const [history, setHistory] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadWeather = useCallback(async (p) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.weather(p);
      setWeather(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshLists = useCallback(async () => {
    try {
      const [h, f] = await Promise.all([api.history(), api.favorites()]);
      setHistory(h);
      setFavorites(f);
    } catch {
      // Non-fatal: sidebar lists are supplementary
    }
  }, []);

  useEffect(() => {
    loadWeather(place);
  }, []);

  useEffect(() => {
    refreshLists();
  }, [weather]);

  function handleSelect(p) {
    setPlace(p);
    loadWeather(p);
  }

  async function handleClearHistory() {
    await api.clearHistory();
    refreshLists();
  }

  async function handleRemoveFavorite(id) {
    await api.removeFavorite(id);
    refreshLists();
  }

  const currentFav = favorites.find(
    (f) => weather && f.city === weather.location.city && f.country === weather.location.country
  );

  async function handleToggleFavorite() {
    if (!weather) return;
    if (currentFav) {
      await api.removeFavorite(currentFav.id);
    } else {
      await api.addFavorite({
        city: weather.location.city,
        country: weather.location.country,
        latitude: weather.location.latitude,
        longitude: weather.location.longitude,
      });
    }
    refreshLists();
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-name">Atmos</span>
        </div>
        <SearchBar onSelect={handleSelect} />
      </header>

      <main className="app-main">
        <div className="app-primary">
          {loading && <div className="state-note mono">Reading the instruments...</div>}
          {error && !loading && (
            <div className="state-note state-error mono">Couldn't reach the forecast: {error}</div>
          )}
          {weather && !loading && !error && (
            <>
              <CurrentPanel
                data={weather}
                isFavorite={Boolean(currentFav)}
                onToggleFavorite={handleToggleFavorite}
              />
              <ForecastStrip forecast={weather.forecast} />
            </>
          )}
        </div>

        <Sidebar
          history={history}
          favorites={favorites}
          onSelect={handleSelect}
          onClearHistory={handleClearHistory}
          onRemoveFavorite={handleRemoveFavorite}
        />
      </main>
    </div>
  );
}
