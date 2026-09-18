import WeatherIcon from "./WeatherIcon";
import WindDial from "./WindDial";

export default function CurrentPanel({ data, isFavorite, onToggleFavorite }) {
  const { location, current } = data;
  const now = new Date();
  const dateStr = now.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <section className="current-panel">
      <div className="current-panel-top">
        <div>
          <div className="eyebrow mono">CURRENT CONDITIONS · {dateStr.toUpperCase()}</div>
          <h1 className="location-name">
            {location.city || "Unknown"}
            <span className="location-country">{location.country ? `, ${location.country}` : ""}</span>
          </h1>
          <div className="coords mono">
            {location.latitude.toFixed(2)}°, {location.longitude.toFixed(2)}°
          </div>
        </div>
        <button
          className={`favorite-btn ${isFavorite ? "is-favorite" : ""}`}
          onClick={onToggleFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          ★
        </button>
      </div>

      <div className="current-panel-main">
        <div className="temp-block">
          <WeatherIcon icon={current.weather.icon} isDay={current.is_day} size={40} />
          <div className="temp-display">
            <span className="temp-number">{Math.round(current.temperature)}</span>
            <span className="temp-unit">°C</span>
          </div>
          <div className="temp-meta">
            <div>{current.weather.label}</div>
            <div className="mono">Feels like {Math.round(current.apparent_temperature)}°</div>
          </div>
        </div>

        <WindDial direction={current.wind_direction} speed={current.wind_speed} />
      </div>

      <div className="readout-strip">
        <div className="readout">
          <span className="readout-label mono">HUMIDITY</span>
          <span className="readout-value mono">{current.humidity}%</span>
        </div>
        <div className="readout">
          <span className="readout-label mono">PRESSURE</span>
          <span className="readout-value mono">{Math.round(current.pressure)} hPa</span>
        </div>
        <div className="readout">
          <span className="readout-label mono">PRECIPITATION</span>
          <span className="readout-value mono">{current.precipitation} mm</span>
        </div>
      </div>
    </section>
  );
}
