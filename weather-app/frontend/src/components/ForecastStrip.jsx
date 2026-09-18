import WeatherIcon from "./WeatherIcon";

export default function ForecastStrip({ forecast }) {
  return (
    <section className="forecast-strip">
      <div className="eyebrow mono">6-DAY OUTLOOK</div>
      <div className="forecast-cards">
        {forecast.map((day, i) => {
          const date = new Date(day.date + "T00:00:00");
          const label = i === 0 ? "Today" : date.toLocaleDateString(undefined, { weekday: "short" });
          return (
            <div className="forecast-card" key={day.date}>
              <div className="forecast-day">{label}</div>
              <WeatherIcon icon={day.weather.icon} size={24} />
              <div className="forecast-temps">
                <span>{Math.round(day.temp_max)}°</span>
                <span className="forecast-temp-min">{Math.round(day.temp_min)}°</span>
              </div>
              <div className="forecast-precip mono">{day.precipitation_probability}%</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
