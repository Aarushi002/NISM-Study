import './DecorScene.css';

const TICKERS = [
  'NIFTY ▲',
  'SEBI RA Regs',
  'DCF • WACC',
  'ASM/GSM',
  'Beta • Corr',
  'Fed dots plot',
  'INR/USD',
  'Commod MCX',
  'Porter 5',
  'RBI policy',
  'ESG lens',
  'Insider PIT',
];

export function DecorScene({ mood = 'default' }) {
  const line = [...TICKERS, ...TICKERS].join('   •   ');
  return (
    <div className={`decor-scene mood-${mood}`} aria-hidden="true">
      <div className="decor-grid" />
      <div className="ticker-wrap">
        <div className="ticker">{line}</div>
      </div>
      <div className="floating-tags">
        <span className="tag tag-sebi">SEBI</span>
        <span className="tag tag-fed">Fed watch</span>
        <span className="tag tag-in">NISM XV</span>
        <span className="tag tag-pol">Tariffs & flows</span>
      </div>
      <div className="candles">
        <span className="candle up" />
        <span className="candle down" />
        <span className="candle up tall" />
        <span className="candle down" />
        <span className="candle up" />
      </div>
      <div className="orb orb-a" />
      <div className="orb orb-b" />
    </div>
  );
}
