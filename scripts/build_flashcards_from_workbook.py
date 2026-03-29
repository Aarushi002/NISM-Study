"""
Build 330 unique flashcards from server/data/workbook_extract.txt (NISM Series XV Nov 2025).
22 cards per chapter × 15 chapters — each back is a distinct workbook sentence plus exam notes.

Run: python scripts/build_flashcards_from_workbook.py
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXTRACT = ROOT / "server" / "data" / "workbook_extract.txt"
OUT = ROOT / "server" / "data" / "flashcardsBank.json"

MARKER = "CHAPTER 1: INTRODUCTION TO RESEARCH ANALYST PROFESSION"
CARDS_PER_CHAPTER = 22

# Mirrors server flashcardsEngine CHAPTER_NOTE (exam weighting awareness)
CHAPTER_NOTE = {
    1: "Light weight on exam — but basics on RA role/ethics appear often.",
    2: "Market plumbing: know roles of SEBI, exchange, depository, clearing.",
    3: "Terminology: bond math (YTM, duration) and equity vs debt features.",
    4: "Research methods: fundamental vs technical; process of research.",
    5: "Macro: GDP, inflation, rates, fiscal vs monetary — links to sectors.",
    6: "Industry tools: Porter, cyclicality, KPIs — frequently applied in scenarios.",
    7: "Governance + business quality: SWOT, ESG, management — qualitative section.",
    8: "Heavy weight: statements, ratios, cash conversion — expect numerical reasoning.",
    9: "Corporate actions: dates, impact on price/EPS — detail matters.",
    10: "Heavy weight: DCF, multiples, WACC, TV — core valuation.",
    11: "Commodities: curves, hedging, currency link — concept MCQs.",
    12: "Risk/return: beta, diversification, ratios — quantitative.",
    13: "Research report structure, disclosures, fairness.",
    14: "Heavy weight: SEBI RA conduct, conflicts, surveillance, cyber.",
    15: "Heavy weight: technical patterns, indicators, Dow theory ideas.",
}

MCQ_HINTS = [
    "Match MCQ stems to workbook definitions; distractors often swap one keyword or regulator.",
    "Separate SEBI (securities markets) from RBI (banking/monetary) when roles are tested.",
    "If two options look similar, prefer the wording that matches the workbook’s standard term.",
    "For ratio questions, verify numerator/denominator and whether the stem uses equity vs enterprise view.",
    "For corporate actions, distinguish record date, ex-date, and economic effect on price per share.",
    "For valuation, check FCFF vs FCFE and whether WACC or cost of equity applies.",
    "For technical tools, remember indicators describe probabilities, not guaranteed outcomes.",
]


def load_body_text() -> str:
    text = EXTRACT.read_text(encoding="utf-8", errors="replace")
    first = text.find(MARKER)
    second = text.find(MARKER, first + 20)
    if second < 0:
        raise SystemExit("Could not find workbook body start (second CHAPTER 1 marker)")
    return text[second:]


def chapter_bodies(body: str) -> list[str]:
    parts = re.split(r"\n(?=CHAPTER \d+:)", body)
    if len(parts) != 15:
        raise SystemExit(f"Expected 15 chapter chunks, got {len(parts)}")
    return parts


def chapter_heading(chunk: str) -> tuple[int, str]:
    first = chunk.strip().split("\n", 1)[0].strip()
    m = re.match(r"CHAPTER\s+(\d+):\s*(.+)", first)
    if not m:
        raise SystemExit(f"Bad chapter header: {first[:80]}")
    num = int(m.group(1))
    title = re.sub(r"\s+", " ", m.group(2)).strip()
    title = title.split("1.1")[0].split("2.1")[0].strip()
    if title.isupper():
        title = title.title()
    label = f"Ch.{num} {title[:72]}"
    return num, label


def chunk_body_only(chunk: str) -> str:
    """Skip the 'CHAPTER N: TITLE' banner so sentences are real body text."""
    lines = chunk.split("\n")
    i = 0
    while i < len(lines):
        ln = lines[i].strip()
        if ln.startswith("CHAPTER ") and ":" in ln:
            i += 1
            continue
        if not ln:
            i += 1
            continue
        break
    body = "\n".join(lines[i:])
    # Drop subsection headings like "1.1 Primary Role of a Research Analyst" (not a sentence)
    out_lines: list[str] = []
    for ln in body.split("\n"):
        if re.match(r"^\s*\d+\.\d+\s+[A-Za-z]", ln.strip()):
            continue
        out_lines.append(ln)
    return "\n".join(out_lines)


def extract_sentences(chapter_text: str) -> list[str]:
    s = re.sub(r"\s+", " ", chapter_text)
    s = re.sub(r"---PAGE---", "", s)
    raw = re.split(r"(?<=[.!?])\s+", s)
    out: list[str] = []
    for x in raw:
        x = x.strip()
        if 45 <= len(x) <= 380 and re.search(r"[a-zA-Z]{4,}", x):
            if re.match(r"^\d+$", x):
                continue
            if x[:20].startswith("Figure") or x[:12].startswith("Table"):
                continue
            if x.count("�") > 4:
                continue
            xl = x.lower()
            if xl.startswith("chapter ") and "introduction" in xl[:80]:
                continue
            if "http://" in x or "https://" in x:
                continue
            if x.startswith("Source:"):
                continue
            if "LEARNING OBJECTIVES" in x:
                continue
            if re.match(r"^\d+[A-Za-z]", x):
                continue
            out.append(x)
    seen: set[str] = set()
    uniq: list[str] = []
    for x in out:
        if x not in seen:
            seen.add(x)
            uniq.append(x)
    return uniq


def pick_index(n: int, slot: int, total: int) -> int:
    if n <= 0:
        return 0
    if n == 1:
        return 0
    return min(n - 1, (slot * (n - 1)) // max(total - 1, 1))


def clean(s: str) -> str:
    return s.replace("�", "'")


def make_front(sentence: str, ch: int, slot: int, used: set[str]) -> str:
    words = clean(sentence).split()
    base = " ".join(words[:11])
    if len(base) > 78:
        base = base[:78].rsplit(" ", 1)[0] + "…"
    candidate = f"Ch.{ch} · {base}"
    if candidate not in used:
        used.add(candidate)
        return candidate
    alt = f"Ch.{ch} · ({slot + 1}/{CARDS_PER_CHAPTER}) {base[:56]}…"
    if alt not in used:
        used.add(alt)
        return alt
    extra = f"Ch.{ch} · Card {slot + 1}: {base[:50]}…"
    used.add(extra)
    return extra


def build_back(
    sentence: str,
    ch: int,
    idx: int,
    total: int,
) -> str:
    note = CHAPTER_NOTE.get(ch, CHAPTER_NOTE[1])
    hint = MCQ_HINTS[idx % len(MCQ_HINTS)]
    body = clean(sentence)
    return "\n".join(
        [
            "Definition",
            "",
            body,
            "",
            "Why this matters on the exam",
            f"• {note}",
            "",
            "How to use this in MCQs",
            f"• {hint}",
            "",
            "30-second recall",
            f"Close the card and restate this idea in one sentence (card {idx + 1} of {total}).",
            "",
            "Authoritative sources",
            "Excerpt from the NISM Series XV Research Analyst Workbook (November 2025). Verify phrasing against your official PDF before the exam.",
        ]
    )


def main() -> None:
    bodies = chapter_bodies(load_body_text())
    deck: list[dict] = []
    used_fronts: set[str] = set()
    idx = 0

    for chunk in bodies:
        ch_num, ch_label = chapter_heading(chunk)
        sents = extract_sentences(chunk_body_only(chunk))
        if len(sents) < CARDS_PER_CHAPTER:
            raise SystemExit(f"Chapter {ch_num}: need ≥{CARDS_PER_CHAPTER} sentences, got {len(sents)}")

        for slot in range(CARDS_PER_CHAPTER):
            sent = sents[pick_index(len(sents), slot, CARDS_PER_CHAPTER)]
            front = make_front(sent, ch_num, slot, used_fronts)
            total = 15 * CARDS_PER_CHAPTER
            back = build_back(sent, ch_num, idx, total)
            deck.append(
                {
                    "id": f"fc-{idx}",
                    "chapter": ch_num,
                    "chapterLabel": ch_label,
                    "front": front,
                    "back": back,
                    "tags": ["nism-xv", f"ch{ch_num}", "workbook-pdf"],
                }
            )
            idx += 1

    if len(deck) != total:
        raise SystemExit(f"Expected {total} cards, got {len(deck)}")
    fronts = {c["front"] for c in deck}
    backs = {c["back"] for c in deck}
    if len(fronts) != len(deck):
        raise SystemExit(f"Duplicate fronts: {len(deck) - len(fronts)}")
    if len(backs) != len(deck):
        raise SystemExit(f"Duplicate backs: {len(deck) - len(backs)}")

    OUT.write_text(json.dumps(deck, ensure_ascii=False, indent=0), encoding="utf-8")
    print(f"Wrote {len(deck)} flashcards to {OUT}")


if __name__ == "__main__":
    main()
