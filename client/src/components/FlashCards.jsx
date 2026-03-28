import { useCallback, useEffect, useMemo, useState } from 'react';
import './FlashCards.css';

const API = '/api/flashcards';

export function FlashCards() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch(API)
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load flash cards');
        return r.json();
      })
      .then((data) => {
        if (!cancelled) {
          setCards(data.cards || []);
          setLoading(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setErr(e.message);
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const total = cards.length;
  const card = total ? cards[idx] : null;

  const go = useCallback(
    (delta) => {
      if (!total) return;
      setFlipped(false);
      setIdx((i) => (i + delta + total) % total);
    },
    [total],
  );

  const shuffle = useCallback(() => {
    if (!total) return;
    setFlipped(false);
    setIdx(Math.floor(Math.random() * total));
  }, [total]);

  const chapters = useMemo(() => {
    const m = new Map();
    cards.forEach((c, i) => {
      const key = c.chapterLabel || `Ch.${c.chapter || '?'}`;
      if (!m.has(key)) m.set(key, []);
      m.get(key).push(i);
    });
    return m;
  }, [cards]);

  const jumpChapter = (label) => {
    const list = chapters.get(label);
    if (list?.length) {
      setFlipped(false);
      setIdx(list[0]);
    }
  };

  if (loading) {
    return (
      <div className="flash-loading">
        <div className="spinner" />
        <p>Loading flash cards…</p>
      </div>
    );
  }

  if (err) {
    return <p className="flash-error">Could not load cards: {err}</p>;
  }

  return (
    <div className="flash-root">
      <div className="flash-toolbar">
        <div className="flash-stats mono">
          {total} cards · NISM Series XV (workbook themes)
        </div>
        <div className="flash-chapter-jump">
          <label htmlFor="ch-jump">Jump to chapter</label>
          <select
            id="ch-jump"
            onChange={(e) => jumpChapter(e.target.value)}
            defaultValue=""
          >
            <option value="" disabled>
              Select…
            </option>
            {[...chapters.keys()].sort().map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flash-progress">
        <div
          className="flash-progress-fill"
          style={{ width: `${((idx + 1) / total) * 100}%` }}
        />
      </div>

      <div className="flash-stage">
        <button type="button" className="flash-nav" onClick={() => go(-1)} aria-label="Previous card">
          ‹
        </button>

        <button
          type="button"
          className={`flash-card-wrap ${flipped ? 'is-flipped' : ''}`}
          onClick={() => setFlipped((f) => !f)}
        >
          <div className="flash-card">
            <div className="flash-face flash-front">
              <span className="flash-kicker">Front</span>
              <p className="flash-text">{card?.front}</p>
              <span className="flash-hint">Tap to flip</span>
            </div>
            <div className="flash-face flash-back">
              <span className="flash-kicker">Back</span>
              <p className="flash-text">{card?.back}</p>
              <span className="flash-meta mono">{card?.chapterLabel}</span>
            </div>
          </div>
        </button>

        <button type="button" className="flash-nav" onClick={() => go(1)} aria-label="Next card">
          ›
        </button>
      </div>

      <div className="flash-actions">
        <button type="button" className="btn ghost" onClick={shuffle}>
          Random card
        </button>
        <span className="flash-counter mono">
          {idx + 1} / {total}
        </span>
      </div>
    </div>
  );
}
