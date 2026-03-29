import { useCallback, useEffect, useMemo, useState } from 'react';
import './FlashCards.css';

const API = '/api/flashcards';

export function FlashCards() {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [idx, setIdx] = useState(0);

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
      setIdx((i) => (i + delta + total) % total);
    },
    [total],
  );

  const shuffle = useCallback(() => {
    if (!total) return;
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
    if (list?.length) setIdx(list[0]);
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
      <p className="flash-intro">
        Each card pairs a <strong>short cue</strong> with <strong>notes</strong> built from sentences in the official NISM Series XV
        Research Analyst workbook (November 2025 PDF). Work through all {total} cards — every definition line is a distinct
        excerpt; cross-check wording against your PDF before the exam.
      </p>

      <div className="flash-toolbar">
        <div className="flash-stats mono">{total} cards · workbook-sourced excerpts</div>
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

        <article className="flash-card-panel" aria-live="polite">
          <header className="flash-card-head">
            <span className="flash-badge mono">{card?.chapterLabel}</span>
            <h2 className="flash-title">{card?.front}</h2>
          </header>
          <div className="flash-body">
            {card?.back?.split('\n').map((line, i) => {
              const trimmed = line.trim();
              if (!trimmed) return <br key={`br-${i}`} />;
              const isHeading =
                [
                  'Definition',
                  'Why this matters on the exam',
                  'How to use this in MCQs',
                  '30-second recall',
                  'Authoritative sources',
                ].includes(trimmed);
              if (isHeading) {
                return (
                  <h3 key={i} className="flash-section-title">
                    {trimmed}
                  </h3>
                );
              }
              return (
                <p key={i} className="flash-line">
                  {line}
                </p>
              );
            })}
          </div>
        </article>

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
