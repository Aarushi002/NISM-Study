/**
 * Decorative corner media — public-domain / Commons portraits + original SVG.
 * Portraits: Wikimedia Commons (U.S. government works). SEBI: stylized badge (not official logo).
 */
import './CornerFloats.css';

/* Commons file paths — U.S. federal portraits */
const SRC_POWELL =
  'https://upload.wikimedia.org/wikipedia/commons/7/7c/Jerome_Powell_official_%28cropped%29.jpg';
const SRC_TRUMP =
  'https://upload.wikimedia.org/wikipedia/commons/5/56/Donald_Trump_official_portrait.jpg';

function StockMarketSvg() {
  return (
    <svg
      className="corner-float__svg"
      viewBox="0 0 120 120"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="cf-chart" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#134e4a" />
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="16" fill="url(#cf-chart)" />
      <path
        d="M12 88 L28 72 L44 80 L60 52 L76 64 L92 40 L108 48"
        fill="none"
        stroke="#5eead4"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x="22" y="56" width="8" height="32" rx="2" fill="#22c55e" />
      <rect x="38" y="68" width="8" height="20" rx="2" fill="#ef4444" />
      <rect x="54" y="48" width="8" height="40" rx="2" fill="#22c55e" />
      <rect x="70" y="60" width="8" height="28" rx="2" fill="#ef4444" />
      <rect x="86" y="44" width="8" height="44" rx="2" fill="#22c55e" />
      <text x="60" y="22" textAnchor="middle" fill="#94a3b8" fontSize="11" fontFamily="system-ui,sans-serif">
        NIFTY
      </text>
    </svg>
  );
}

function SebiBadge() {
  return (
    <div className="corner-float__sebi" aria-hidden="true">
      <span className="corner-float__sebi-flag" />
      <span className="corner-float__sebi-text">SEBI</span>
      <span className="corner-float__sebi-sub">India</span>
    </div>
  );
}

function CornerImg({ src }) {
  return (
    <img
      className="corner-float__img"
      src={src}
      alt=""
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={(e) => {
        e.currentTarget.style.opacity = '0.25';
      }}
    />
  );
}

export function CornerFloats() {
  return (
    <div className="corner-floats" aria-hidden="true">
      <div className="corner-float corner-float--tl corner-float--anim-a" title="Markets">
        <StockMarketSvg />
      </div>
      <div className="corner-float corner-float--tr corner-float--anim-b" title="Fed policy context">
        <CornerImg src={SRC_POWELL} />
      </div>
      <div className="corner-float corner-float--bl corner-float--anim-c" title="Global policy headlines">
        <CornerImg src={SRC_TRUMP} />
      </div>
      <div className="corner-float corner-float--br corner-float--anim-d" title="SEBI — regulator">
        <SebiBadge />
      </div>
    </div>
  );
}
