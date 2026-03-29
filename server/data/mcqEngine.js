/**
 * 1020 MCQs (102 per level × 10 levels) for NISM Series XV Research Analyst prep.
 * Question bank is built from curated syllabus concepts (server/data/concepts170.jsonl) — edit seeds,
 * then run: python scripts/build_sensible_mcq_bank.py → mcqBank1020.json
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const LEVEL_FOCUS = [
  /* 1 */ 'Ch.1–2: RA role, securities market structure, SEBI, depositories, market basics',
  /* 2 */ 'Ch.3: Equity/debt terminology, bonds, yields, duration, credit ratings',
  /* 3 */ 'Ch.4–5: Research methods, economics — GDP, inflation, policy, cycles',
  /* 4 */ 'Ch.6: Industry analysis — Porter, cyclicality, KPIs, regulation',
  /* 5 */ 'Ch.7–8: Business quality, governance, financial statements & ratios',
  /* 6 */ 'Ch.8–9: Advanced ratios, corporate actions, SEBI takeover/SAST context',
  /* 7 */ 'Ch.10: Valuation — DCF, multiples, WACC, margin of safety',
  /* 8 */ 'Ch.11–12: Commodities, risk/return, beta, diversification, behavioral biases',
  /* 9 */ 'Ch.13–14: Research report quality, RA regulations, conflicts, surveillance',
  /* 10 */ 'Ch.15 + synthesis: Technical analysis + integrated exam-style cases',
];

/** @typedef {{ id: string, level: number, question: string, options: string[], correctIndex: number, whyCorrect: string, whyOthers: string[] }} Mcq */

const BANK_PATH = path.join(__dirname, 'mcqBank1020.json');

function loadBank() {
  const raw = fs.readFileSync(BANK_PATH, 'utf8');
  /** @type {Array<{ chapter: number, question: string, options: string[], correctIndex: number, whyCorrect: string, whyOthers: string[] }>} */
  const bank = JSON.parse(raw);
  if (!Array.isArray(bank) || bank.length !== 1020) {
    throw new Error(`MCQ bank: expected 1020 items, got ${bank?.length}`);
  }
  const stems = new Set();
  for (let i = 0; i < bank.length; i++) {
    const row = bank[i];
    if (!row.question || typeof row.question !== 'string') {
      throw new Error(`MCQ bank item ${i}: missing question`);
    }
    if (!Array.isArray(row.options) || row.options.length !== 4) {
      throw new Error(`MCQ bank item ${i}: need 4 options`);
    }
    if (row.correctIndex < 0 || row.correctIndex > 3 || !Number.isInteger(row.correctIndex)) {
      throw new Error(`MCQ bank item ${i}: correctIndex must be 0–3`);
    }
    if (!row.whyCorrect || !Array.isArray(row.whyOthers) || row.whyOthers.length !== 3) {
      throw new Error(`MCQ bank item ${i}: explain fields invalid`);
    }
    if (row.options[row.correctIndex] === undefined) {
      throw new Error(`MCQ bank item ${i}: correct option missing`);
    }
    stems.add(row.question);
  }
  if (stems.size !== bank.length) {
    throw new Error('MCQ bank: duplicate question stems');
  }
  return bank;
}

const MCQ_BANK = loadBank();

function synthQuestion(level, seq) {
  const globalIdx = (level - 1) * 102 + seq;
  const row = MCQ_BANK[globalIdx];
  if (!row) {
    throw new Error(`MCQ: missing bank row for level ${level} seq ${seq} (index ${globalIdx})`);
  }

  const options = [...row.options];
  const correctIndex = row.correctIndex;
  const whyCorrect = row.whyCorrect;

  let w = 0;
  /** @type {string[]} */
  const optionDetail = [];
  for (let d = 0; d < 4; d++) {
    if (d === correctIndex) {
      optionDetail[d] = whyCorrect;
    } else {
      optionDetail[d] = row.whyOthers[w] ?? row.whyOthers[0];
      w += 1;
    }
  }

  const id = `L${level}-S${String(seq).padStart(4, '0')}`;

  return {
    id,
    level,
    chapter: row.chapter,
    question: row.question,
    options,
    correctIndex,
    whyCorrect,
    optionDetail,
    summaryWhenWrong: `The keyed correct answer: ${whyCorrect}`,
  };
}

let _all;

export function getAllQuestions() {
  if (_all) return _all;
  const out = [];
  for (let level = 1; level <= 10; level++) {
    for (let seq = 0; seq < 102; seq++) {
      out.push(synthQuestion(level, seq));
    }
  }
  const qSet = new Set(out.map((q) => q.question));
  if (qSet.size !== out.length) {
    throw new Error(`MCQ runtime: duplicate question text (${out.length - qSet.size} collisions)`);
  }
  _all = out;
  return _all;
}

export function getQuestionsByLevel(level) {
  return getAllQuestions().filter((q) => q.level === level);
}

export function getQuestionCounts() {
  const byLevel = {};
  for (let l = 1; l <= 10; l++) byLevel[l] = 102;
  return { total: 1020, perLevel: byLevel, levels: 10, focus: LEVEL_FOCUS };
}

export function getAllQuestionsMeta() {
  return { total: 1020, levels: LEVEL_FOCUS.map((f, i) => ({ level: i + 1, focus: f, count: 102 })) };
}
