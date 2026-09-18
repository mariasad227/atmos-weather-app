export default function WindDial({ direction = 0, speed = 0, size = 132 }) {
  const ticks = Array.from({ length: 36 }, (_, i) => i * 10);

  return (
    <div className="wind-dial" style={{ width: size, height: size }}>
      <svg viewBox="0 0 132 132" width={size} height={size}>
        <circle cx="66" cy="66" r="60" className="dial-ring" />
        {ticks.map((deg) => {
          const major = deg % 90 === 0;
          const len = major ? 8 : 4;
          return (
            <line
              key={deg}
              x1="66"
              y1="8"
              x2="66"
              y2={8 + len}
              className={major ? "dial-tick-major" : "dial-tick"}
              transform={`rotate(${deg} 66 66)`}
            />
          );
        })}
        <text x="66" y="20" textAnchor="middle" className="dial-label">N</text>
        <text x="112" y="70" textAnchor="middle" className="dial-label">E</text>
        <text x="66" y="122" textAnchor="middle" className="dial-label">S</text>
        <text x="20" y="70" textAnchor="middle" className="dial-label">W</text>

        <g style={{ transform: `rotate(${direction}deg)`, transformOrigin: "66px 66px" }} className="dial-needle-group">
          <line x1="66" y1="66" x2="66" y2="24" className="dial-needle" />
          <polygon points="66,18 61,30 71,30" className="dial-needle-tip" />
          <circle cx="66" cy="66" r="4" className="dial-hub" />
        </g>
      </svg>
      <div className="dial-readout mono">
        <span>{Math.round(speed)} km/h</span>
        <span className="dial-readout-deg">{Math.round(direction)}°</span>
      </div>
    </div>
  );
}
