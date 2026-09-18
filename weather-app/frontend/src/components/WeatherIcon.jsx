export default function WeatherIcon({ icon, isDay = true, size = 28, color }) {
  const stroke = color || "currentColor";
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke,
    strokeWidth: 1.4,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  };

  switch (icon) {
    case "clear":
      return isDay ? (
        <svg {...common}>
          <circle cx="12" cy="12" r="4.2" />
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line
              key={deg}
              x1="12"
              y1="2.4"
              x2="12"
              y2="4.4"
              transform={`rotate(${deg} 12 12)`}
            />
          ))}
        </svg>
      ) : (
        <svg {...common}>
          <path d="M20 14.5A7.5 7.5 0 0 1 9.5 4a7.5 7.5 0 1 0 10.5 10.5Z" />
        </svg>
      );
    case "cloudy":
      return (
        <svg {...common}>
          <path d="M7 17.5h10.5a3.5 3.5 0 0 0 .3-6.98 5 5 0 0 0-9.6-1.7A4 4 0 0 0 7 17.5Z" />
        </svg>
      );
    case "fog":
      return (
        <svg {...common}>
          <path d="M6.5 10.5h9a3 3 0 1 0-2.9-3.7" />
          <line x1="3.5" y1="14.5" x2="20.5" y2="14.5" />
          <line x1="5.5" y1="18" x2="18.5" y2="18" />
        </svg>
      );
    case "drizzle":
      return (
        <svg {...common}>
          <path d="M7 12.5h10.5a3.5 3.5 0 0 0 .3-6.98 5 5 0 0 0-9.6-1.7A4 4 0 0 0 7 12.5Z" />
          <line x1="9" y1="16" x2="8" y2="19" />
          <line x1="13" y1="16" x2="12" y2="19" />
          <line x1="17" y1="16" x2="16" y2="19" />
        </svg>
      );
    case "rain":
      return (
        <svg {...common}>
          <path d="M7 11.5h10.5a3.5 3.5 0 0 0 .3-6.98 5 5 0 0 0-9.6-1.7A4 4 0 0 0 7 11.5Z" />
          <line x1="8.5" y1="15" x2="7" y2="20" />
          <line x1="12.5" y1="15" x2="11" y2="20" />
          <line x1="16.5" y1="15" x2="15" y2="20" />
        </svg>
      );
    case "snow":
      return (
        <svg {...common}>
          <path d="M7 11.5h10.5a3.5 3.5 0 0 0 .3-6.98 5 5 0 0 0-9.6-1.7A4 4 0 0 0 7 11.5Z" />
          <g strokeWidth="1.2">
            <line x1="8" y1="15.5" x2="8" y2="20" />
            <line x1="6" y1="17.75" x2="10" y2="17.75" />
            <line x1="16" y1="15.5" x2="16" y2="20" />
            <line x1="14" y1="17.75" x2="18" y2="17.75" />
          </g>
        </svg>
      );
    case "storm":
      return (
        <svg {...common}>
          <path d="M7 11.5h10.5a3.5 3.5 0 0 0 .3-6.98 5 5 0 0 0-9.6-1.7A4 4 0 0 0 7 11.5Z" />
          <path d="M13 14.5 10 19h3l-1.5 3.5" strokeWidth="1.5" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" />
        </svg>
      );
  }
}
