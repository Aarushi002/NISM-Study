/**
 * Flashcards loaded from server/data/flashcardsBank.json — built from the official NISM Series XV
 * workbook text (see scripts/build_flashcards_from_workbook.py and workbook_extract.txt).
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const BANK_PATH = path.join(__dirname, 'flashcardsBank.json');

function loadBank() {
  const raw = fs.readFileSync(BANK_PATH, 'utf8');
  const deck = JSON.parse(raw);
  if (!Array.isArray(deck) || deck.length < 300) {
    throw new Error(`Flashcard bank: expected ≥300 cards, got ${deck?.length}`);
  }
  const fronts = new Set();
  const backs = new Set();
  for (let i = 0; i < deck.length; i++) {
    const c = deck[i];
    if (!c.front?.trim() || !c.back?.trim()) {
      throw new Error(`Flashcard ${i}: empty front or back`);
    }
    fronts.add(c.front);
    backs.add(c.back);
  }
  if (fronts.size !== deck.length) {
    throw new Error('Flashcard bank: duplicate fronts');
  }
  if (backs.size !== deck.length) {
    throw new Error('Flashcard bank: duplicate backs');
  }
  return deck;
}

let _cache;

export function getFlashcards() {
  if (!_cache) _cache = loadBank();
  return _cache;
}
