import { useState } from 'react';
import './App.css';
import { DecorScene } from './components/DecorScene.jsx';
import { FlashCards } from './components/FlashCards.jsx';
import { MockTest } from './components/MockTest.jsx';

export default function App() {
  const [tab, setTab] = useState('flash');

  return (
    <>
      <DecorScene mood={tab === 'mock' ? 'mock' : 'flash'} />
      <div className="app-shell">
        <header className="app-header">
          <div className="brand">
            <h1>NISM Series XV — Research Analyst Prep</h1>
            <p>
              Flash cards and 10-level mock tests aligned to the official workbook themes (research
              process, markets, financials, valuation, commodities, risk, regulations, and technicals).
            </p>
          </div>
          <nav className="tabs" aria-label="Primary">
            <button
              type="button"
              className={tab === 'flash' ? 'active' : ''}
              onClick={() => setTab('flash')}
            >
              Flash cards
            </button>
            <button
              type="button"
              className={tab === 'mock' ? 'active' : ''}
              onClick={() => setTab('mock')}
            >
              Mock tests
            </button>
          </nav>
        </header>

        <main className="panel">
          {tab === 'flash' ? <FlashCards /> : <MockTest />}
        </main>

        <p className="disclaimer">
          <strong>Disclaimer.</strong> This app is an independent study aid. It is not affiliated with
          NISM or SEBI. Certification candidates should rely on the official NISM workbook (November 2025
          version for exams on or after 20 Jan 2026) and current regulations. Market scenarios mentioning
          global policy or public figures are illustrative overlays for learning animations only.
        </p>
      </div>
    </>
  );
}
