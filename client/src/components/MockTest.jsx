import { useEffect, useMemo, useState } from 'react';
import './MockTest.css';

const LABELS = ['A', 'B', 'C', 'D'];

function hashStr(s) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function MockTest() {
  const [level, setLevel] = useState(1);
  const [questions, setQuestions] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [qi, setQi] = useState(0);
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    fetch('/api/mock/meta')
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) setMeta(data);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setErr(null);
    setQi(0);
    setSelected(null);
    setRevealed(false);
    fetch(`/api/mock/levels/${level}`)
      .then((r) => {
        if (!r.ok) throw new Error('Failed to load questions');
        return r.json();
      })
      .then((data) => {
        if (!cancelled) {
          setQuestions(data.questions || []);
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
  }, [level]);

  const q = questions[qi];
  const total = questions.length;

  const animClass = useMemo(() => {
    if (!q) return 'anim-a';
    const h = hashStr(q.id);
    const pool = ['anim-a', 'anim-b', 'anim-c', 'anim-d', 'anim-e'];
    return pool[h % pool.length];
  }, [q]);

  const pick = (i) => {
    if (revealed) return;
    setSelected(i);
    setRevealed(true);
  };

  const next = () => {
    setSelected(null);
    setRevealed(false);
    setQi((i) => (i + 1) % total);
  };

  const prev = () => {
    setSelected(null);
    setRevealed(false);
    setQi((i) => (i - 1 + total) % total);
  };

  if (loading && !questions.length) {
    return (
      <div className="mock-loading">
        <div className="spinner" />
        <p className="mono">Loading mock test…</p>
      </div>
    );
  }

  if (err) {
    return <p className="mock-error">{err}</p>;
  }

  return (
    <div className="mock-root">
      <div className="mock-level-row">
        <label htmlFor="level-select" className="mono">
          Level (1–10)
        </label>
        <select
          id="level-select"
          value={level}
          onChange={(e) => setLevel(Number(e.target.value))}
        >
          {Array.from({ length: 10 }, (_, i) => i + 1).map((lv) => (
            <option key={lv} value={lv}>
              Level {lv}
              {meta?.focus?.[lv - 1] ? ` — ${meta.focus[lv - 1].split(':')[0]}` : ''}
            </option>
          ))}
        </select>
        <span className="mock-count mono">
          {total} questions in this level
        </span>
      </div>

      {meta?.focus?.[level - 1] && (
        <p className="mock-focus">{meta.focus[level - 1]}</p>
      )}

      {q && (
        <div key={q.id} className={`mock-question-card ${animClass}`}>
          <div className="mock-q-head">
            <span className="mono mock-q-id">{q.id}</span>
            <span className="mono mock-q-progress">
              {qi + 1} / {total}
            </span>
          </div>

          <p className="mock-stem">{q.question}</p>

          <div className="mock-options">
            {q.options.map((opt, i) => {
              let cls = 'mock-opt';
              if (revealed) {
                if (i === q.correctIndex) cls += ' is-correct';
                else if (i === selected) cls += ' is-wrong';
                else cls += ' is-dim';
              }
              return (
                <button
                  key={`${q.id}-o-${i}`}
                  type="button"
                  className={cls}
                  onClick={() => pick(i)}
                  disabled={revealed}
                >
                  <span className="mock-opt-label mono">{LABELS[i]}</span>
                  <span className="mock-opt-text">{opt}</span>
                </button>
              );
            })}
          </div>

          {revealed && (
            <div className="mock-explain">
              {selected === q.correctIndex ? (
                <div className="explain-block ok">
                  <h4>Correct — rationale</h4>
                  <p>{q.whyCorrect}</p>
                  <h4>Why the other options are incorrect</h4>
                  <ul>
                    {[0, 1, 2, 3]
                      .filter((i) => i !== q.correctIndex)
                      .map((i) => (
                        <li key={i}>
                          <strong className="mono">{LABELS[i]}.</strong> {q.optionDetail[i]}
                        </li>
                      ))}
                  </ul>
                </div>
              ) : (
                <div className="explain-block mix">
                  <div className="explain-wrong">
                    <h4>Your choice ({LABELS[selected]}) — why it does not fit</h4>
                    <p>{q.optionDetail[selected]}</p>
                  </div>
                  <div className="explain-right">
                    <h4>Correct answer ({LABELS[q.correctIndex]}) — why it is right</h4>
                    <p>{q.whyCorrect}</p>
                  </div>
                  <div className="explain-others">
                    <h4>Why the remaining incorrect options fail</h4>
                    <ul>
                      {[0, 1, 2, 3]
                        .filter((i) => i !== q.correctIndex && i !== selected)
                        .map((i) => (
                          <li key={i}>
                            <strong className="mono">{LABELS[i]}.</strong> {q.optionDetail[i]}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mock-nav">
            <button type="button" className="btn ghost" onClick={prev} disabled={total <= 1}>
              Previous
            </button>
            <button type="button" className="btn primary" onClick={next}>
              Next question
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
