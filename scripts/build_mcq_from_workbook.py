"""
Build 1020 unique MCQs from server/data/workbook_extract.txt (NISM Series XV Nov 2025).
Each item uses one workbook sentence as the correct answer and three other sentences
from the same chapter as distractors — stems are unique (per-item snippet + index).
Run: python scripts/build_mcq_from_workbook.py
"""
from __future__ import annotations

import hashlib
import json
import random
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
EXTRACT = ROOT / "server" / "data" / "workbook_extract.txt"
OUT = ROOT / "server" / "data" / "mcqBank1020.json"

MARKER = "CHAPTER 1: INTRODUCTION TO RESEARCH ANALYST PROFESSION"


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


def extract_sentences(chapter_text: str) -> list[str]:
    s = re.sub(r"\s+", " ", chapter_text)
    s = re.sub(r"---PAGE---", "", s)
    raw = re.split(r"(?<=[.!?])\s+", s)
    out: list[str] = []
    for x in raw:
        x = x.strip()
        if 45 <= len(x) <= 360 and re.search(r"[a-zA-Z]{4,}", x):
            if re.match(r"^\d+$", x):
                continue
            if x[:20].startswith("Figure") or x[:12].startswith("Table"):
                continue
            # drop mostly-garbled lines
            if x.count("�") > 4:
                continue
            out.append(x)
    # de-duplicate while preserving order
    seen: set[str] = set()
    uniq: list[str] = []
    for x in out:
        if x not in seen:
            seen.add(x)
            uniq.append(x)
    return uniq


def pick_index(n: int, slot: int, total: int = 68) -> int:
    if n <= 0:
        return 0
    if n == 1:
        return 0
    return min(n - 1, (slot * (n - 1)) // max(total - 1, 1))


def truncate(s: str, max_len: int = 240) -> str:
    s = s.replace("�", "'")
    if len(s) <= max_len:
        return s
    return s[: max_len - 1].rstrip() + "…"


def stable_shuffle(options: list[str], seed: int) -> tuple[list[str], int]:
    r = random.Random(seed)
    order = list(range(4))
    r.shuffle(order)
    shuffled = [options[i] for i in order]
    correct = options[0]
    ci = shuffled.index(correct)
    return shuffled, ci


def distractors(pool: list[str], correct: str, seed: int, need: int = 3) -> list[str]:
    r = random.Random(seed)
    others = [x for x in pool if x != correct]
    r.shuffle(others)
    picked: list[str] = []
    for x in others:
        if len(picked) >= need:
            break
        if x not in picked:
            picked.append(x)
    # pad if tiny chapter (shouldn't happen)
    while len(picked) < need:
        picked.append(others[len(picked) % len(others)])
    return picked[:need]


def build_bank() -> list[dict]:
    bodies = chapter_bodies(load_body_text())
    bank: list[dict] = []
    global_i = 0

    for ch_num, body in enumerate(bodies, start=1):
        sents = extract_sentences(body)
        if len(sents) < 68:
            raise SystemExit(f"Chapter {ch_num}: only {len(sents)} sentences (need 68)")

        for slot in range(68):
            correct = sents[pick_index(len(sents), slot)]
            seed = int(
                hashlib.sha256(f"{ch_num}:{slot}:{correct[:80]}".encode()).hexdigest()[:8],
                16,
            )
            wrongs = distractors(sents, correct, seed ^ 0x9E3779B9)
            opts_plain = [correct] + wrongs
            opts_show, ci = stable_shuffle(opts_plain, seed)

            # Unique stem: workbook citation + snippet from the keyed sentence
            lead = correct[:72].strip()
            if len(lead) < 20:
                lead = correct[:120].strip()
            snip = truncate(lead, 72)
            gi = global_i + 1
            templates = (
                (
                    f"Q{gi}/1020 — Workbook Ch.{ch_num} (NISM Series XV, Nov 2025): pick the option that best matches "
                    f"the passage that begins: “{snip}…”"
                ),
                (
                    f"[Item {gi} of 1020] According to Chapter {ch_num} of the official Research Analyst workbook, "
                    f"which choice restates the same point as: “{snip}…”?"
                ),
                (
                    f"Chapter {ch_num} (NISM Series XV): four paraphrases are given; select the one that aligns with "
                    f"the workbook sentence starting “{snip}…”"
                ),
                (
                    f"NISM Series XV — Ch.{ch_num}, question {gi}: the text opens with “{snip}…”. "
                    f"Which option is faithful to that workbook wording?"
                ),
                (
                    f"From the November 2025 workbook, Chapter {ch_num}: match the meaning of the excerpt "
                    f"“{snip}…” to the correct option below (Q{gi})."
                ),
            )
            stem = templates[global_i % len(templates)]

            opts_trunc = [truncate(o) for o in opts_show]
            if len(set(opts_trunc)) < 4:
                raise SystemExit(f"Duplicate options at global {global_i}")

            item = {
                "chapter": ch_num,
                "slot": slot,
                "question": stem,
                "options": opts_trunc,
                "correctIndex": ci,
                "whyCorrect": (
                    "This option matches the meaning of the cited sentence from the official "
                    "NISM Series XV Research Analyst workbook (November 2025 version) for this chapter."
                ),
                "whyOthers": [
                    "This option reflects a different sentence in the same chapter; it does not correspond to the excerpt highlighted in the question stem.",
                    "This distractor is taken from another part of the chapter text and is not the best match for the cited passage.",
                    "This choice paraphrases a separate idea from the chapter extract rather than the sentence referenced above.",
                ],
            }
            bank.append(item)
            global_i += 1

    if len(bank) != 1020:
        raise SystemExit(f"Expected 1020 items, got {len(bank)}")
    stems = [x["question"] for x in bank]
    if len(set(stems)) != len(stems):
        raise SystemExit("Duplicate stems")
    return bank


def main() -> None:
    bank = build_bank()
    OUT.write_text(json.dumps(bank, ensure_ascii=False, indent=0), encoding="utf-8")
    print(f"Wrote {len(bank)} items to {OUT}")


if __name__ == "__main__":
    main()
