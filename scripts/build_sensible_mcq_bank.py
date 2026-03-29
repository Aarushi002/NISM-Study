"""
Build mcqBank1020.json from curated concept seeds in server/data/concepts170.jsonl.

Each of 170 lines is one manually authored concept (NISM Series XV Research Analyst themes).
Six exam-style stem templates × 170 = 1020 questions with distinct wording and shuffled options.

Edit concepts170.jsonl to change syllabus coverage, then run:
  python scripts/build_sensible_mcq_bank.py
"""
from __future__ import annotations

import hashlib
import json
import random
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CONCEPTS_PATH = ROOT / "server" / "data" / "concepts170.jsonl"
OUT = ROOT / "server" / "data" / "mcqBank1020.json"

STEM_FORMS = [
    "NISM Series XV · Q{n}: {lead}",
    "Research Analyst certification ({n}/1020): {lead}",
    "Select the best answer — {lead}",
    "Exam-style MCQ: {lead}",
    "According to standard NISM RA syllabus framing, {lead}",
    "Which option is most accurate? {lead}",
]


def format_lead(lead: str) -> str:
    lead = lead.strip()
    if not lead:
        return lead
    return lead[0].upper() + lead[1:]


def stable_shuffle(opts: list[str], seed: int) -> tuple[list[str], int]:
    r = random.Random(seed)
    order = [0, 1, 2, 3]
    r.shuffle(order)
    shuffled = [opts[i] for i in order]
    ci = shuffled.index(opts[0])
    return shuffled, ci


def why_order(opts: list[str], w1: str, w2: str, w3: str, e1: str, e2: str, e3: str, ci: int) -> list[str]:
    wm = {w1: e1, w2: e2, w3: e3}
    out: list[str] = []
    for d in range(4):
        if d == ci:
            continue
        out.append(wm.get(opts[d], "This distractor does not match the best-fit answer for the stem."))
    return out


def load_concepts() -> list[tuple]:
    lines = [ln.strip() for ln in CONCEPTS_PATH.read_text(encoding="utf-8").splitlines() if ln.strip()]
    if len(lines) != 170:
        raise SystemExit(f"Expected 170 concept lines in {CONCEPTS_PATH}, got {len(lines)}")
    rows: list[tuple] = []
    leads: set[str] = set()
    for i, line in enumerate(lines):
        o = json.loads(line)
        ch = int(o["chapter"])
        lead = o["lead"]
        if lead in leads:
            raise SystemExit(f"Duplicate lead at line {i + 1}")
        leads.add(lead)
        c = o["correct"]
        w = o["wrong"]
        ew = o["ew"]
        if len(w) != 3 or len(ew) != 3:
            raise SystemExit(f"Line {i + 1}: need wrong[3] and ew[3]")
        rows.append((ch, lead, c, w[0], w[1], w[2], o["ec"], ew[0], ew[1], ew[2]))
    return rows


def expand(concepts: list) -> list[dict]:
    bank: list[dict] = []
    n = 0
    for row in concepts:
        ch = row[0]
        lead = row[1]
        c, w1, w2, w3 = row[2], row[3], row[4], row[5]
        ec = row[6]
        ew1, ew2, ew3 = row[7], row[8], row[9]
        base_opts = [c, w1, w2, w3]
        for form_idx, form in enumerate(STEM_FORMS):
            lf = format_lead(lead)
            stem = form.format(n=n + 1, lead=lf)
            seed = int(hashlib.sha256(f"{n}|{form_idx}|{lead}".encode()).hexdigest()[:12], 16)
            opts, ci = stable_shuffle(base_opts, seed)
            why_wrong = why_order(opts, w1, w2, w3, ew1, ew2, ew3, ci)
            bank.append(
                {
                    "chapter": ch,
                    "question": stem,
                    "options": opts,
                    "correctIndex": ci,
                    "whyCorrect": ec,
                    "whyOthers": why_wrong,
                }
            )
            n += 1
    return bank


def main() -> None:
    concepts = load_concepts()
    bank = expand(concepts)
    if len(bank) != 1020:
        raise SystemExit(f"Expected 1020 questions, got {len(bank)}")
    stems = [b["question"] for b in bank]
    if len(set(stems)) != len(stems):
        raise SystemExit("Duplicate question stems after expansion")
    OUT.write_text(json.dumps(bank, ensure_ascii=False, indent=0), encoding="utf-8")
    print(f"Wrote {len(bank)} questions to {OUT}")


if __name__ == "__main__":
    main()
