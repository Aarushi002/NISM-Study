import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import { getFlashcards } from './data/flashcardsEngine.js';
import { getQuestionsByLevel, getQuestionCounts, getAllQuestionsMeta } from './data/mcqEngine.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, workbook: 'NISM Series XV Research Analyst (workbook-aligned)' });
});

app.get('/api/flashcards', (_req, res) => {
  res.json({ count: getFlashcards().length, cards: getFlashcards() });
});

app.get('/api/mock/meta', (_req, res) => {
  res.json(getQuestionCounts());
});

app.get('/api/mock/levels/:level', (req, res) => {
  const level = Math.min(10, Math.max(1, parseInt(req.params.level, 10) || 1));
  const qs = getQuestionsByLevel(level);
  res.json({ level, count: qs.length, questions: qs });
});

app.get('/api/mock/all-meta', (_req, res) => {
  res.json(getAllQuestionsMeta());
});

const clientDist = path.join(__dirname, '..', 'client', 'dist');
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(clientDist, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`NISM prep API http://localhost:${PORT}`);
});
