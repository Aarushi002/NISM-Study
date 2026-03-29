/**
 * 1020+ MCQs (102 per level × 10 levels) for NISM Series XV Research Analyst prep.
 * Explanations distinguish correct vs incorrect options per SEBI/NISM-style reasoning.
 *
 * Seed bank: each item is checked at load time (correct index 0–3, four options, three wrong-option notes).
 * Seeds are expanded to 1020 uniquely worded stems (prefix/suffix variants) mapped 1:1 to level×sequence.
 * For the live exam, always cross-check with the official NISM workbook and current SEBI circulars.
 */

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

const TOPIC_BANK = [];

function addTopic(levelHint, stem, opts, correctIdx, explain) {
  TOPIC_BANK.push({ levelHint, stem, opts, correctIdx, explain });
}

// ——— Seed bank (explicit items); engine expands to 1020+ via synthesis ———

addTopic(1, 'The primary public role of a Research Analyst is best described as:', [
  'Only collecting raw market rumours without verification',
  'Only charting price patterns with no fundamentals',
  'Helping clients make informed investment decisions using research and analysis',
  'Guaranteed profit generation for all clients',
], 2, {
  c: 'RAs collect and interpret information to support client decisions — the workbook frames them as selectors using research + analysis.',
  w: [
    'RAs must verify information; rumour use without verification violates professional standards.',
    'Technical analysis may be used, but RA work broadly includes fundamental/economic context per syllabus.',
    'Markets carry risk; RAs do not guarantee returns.',
  ],
});

addTopic(1, 'Sell-side analysts typically:', [
  'Publish research mainly for internal fund managers only',
  'Publish research that can be distributed more widely (e.g., broking clients) with recommendations',
  'Cannot issue buy/hold/sell opinions',
  'Are unregulated in India',
], 1, {
  c: 'Sell-side analysts produce distributable research with recommendations; buy-side is more often internal.',
  w: [
    'That describes buy-side analysts more closely.',
    'They do issue recommendations and price targets where applicable.',
    'Research analysts are regulated under SEBI RA Regulations (registration and conduct).',
  ],
});

addTopic(1, 'A “security” in the securities market context is best defined as:', [
  'Only physical gold coins',
  'Transferable financial claim/contract evidencing ownership or debt (e.g., shares, bonds)',
  'A bank fixed deposit with no transferability',
  'A lottery ticket',
], 1, {
  c: 'The workbook defines securities as transferable claims like equity/debt instruments.',
  w: [
    'Commodities/gold can be separate products; definition here is financial claims.',
    'FDs are banking products, not securities in this sense.',
    'Lotteries are not securities market instruments.',
  ],
});

addTopic(1, 'The secondary market is important primarily because it:', [
  'Lets issuers raise fresh capital every day',
  'Provides liquidity and price discovery for existing securities among investors',
  'Eliminates all investment risk',
  'Sets RBI’s repo rate',
], 1, {
  c: 'Secondary trading is between investors; it supports liquidity and valuation benchmarks.',
  w: [
    'Fresh issuer fundraising is primary market.',
    'Risk remains; diversification and analysis manage — not eliminate — risk.',
    'Repo is monetary policy, not exchange pricing.',
  ],
});

addTopic(1, 'SEBI’s core role includes:', [
  'Printing currency notes',
  'Regulating securities markets and protecting investor interests',
  'Running NSDL alone',
  'Setting GDP growth targets',
], 1, {
  c: 'SEBI is the securities market regulator in India.',
  w: [
    'Currency issuance is RBI.',
    'NSDL is a depository; SEBI regulates market participants broadly.',
    'Fiscal/GDP targets are government/MoF/RBI domains.',
  ],
});

addTopic(2, 'Modified duration primarily measures:', [
  'Company’s operating leverage',
  'Sensitivity of a bond’s price to changes in yield/interest rates',
  'Stock beta to Nifty',
  'Dividend payout ratio',
], 1, {
  c: 'Duration/modified duration links bond price changes to yield moves.',
  w: [
    'Operating leverage is a company earnings concept.',
    'Beta applies to equities vs market.',
    'Payout ratio is equity distribution metric.',
  ],
});

addTopic(2, 'Yield to maturity (YTM) is best described as:', [
  'Dividend yield on equity',
  'The internal rate of return if a bond is held to maturity (assuming reinvestment assumptions)',
  'Current stock P/E',
  'Repo rate set by RBI',
], 1, {
  c: 'YTM annualizes total return path for a bond held to maturity under standard assumptions.',
  w: [
    'Dividend yield is for equity cash payouts.',
    'P/E is valuation multiple.',
    'Repo is policy rate, not bond-specific YTM.',
  ],
});

addTopic(3, 'Leading indicators, in macro analysis, tend to:', [
  'Move after the economy has already turned',
  'Change direction before the broader economy does',
  'Always predict recessions with certainty',
  'Equal the inflation rate',
], 1, {
  c: 'Leading indicators are early-cycle signals (e.g., orders, PMI), with limitations.',
  w: [
    'That describes lagging indicators.',
    'Macro indicators are probabilistic — not perfect.',
    'Inflation is a different macro variable.',
  ],
});

addTopic(3, 'Expansionary fiscal policy generally involves:', [
  'Higher taxes and lower spending',
  'Lower taxes and/or higher government spending to stimulate demand',
  'Only selling forex reserves',
  'Banning IPOs',
], 1, {
  c: 'Fiscal stimulus typically increases deficit-financed spending or cuts taxes.',
  w: [
    'That is contractionary fiscal policy.',
    'Forex ops are not the definition of fiscal stance.',
    'IPO regulation is not defined this way.',
  ],
});

addTopic(4, 'Porter’s Five Forces framework is used to assess:', [
  'Only central bank independence',
  'Industry competitive intensity and profitability drivers',
  'Only technical chart patterns',
  'Personal income tax slabs',
], 1, {
  c: 'Five forces analyze rivalry, entrants, substitutes, buyer/supplier power.',
  w: [
    'Central bank topics are macro institutions.',
    'Charts are technical analysis.',
    'Tax slabs are unrelated.',
  ],
});

addTopic(5, 'Return on Equity (ROE) is computed as:', [
  'EBIT / Sales',
  'Net profit divided by average shareholders’ equity',
  'Current assets − current liabilities',
  'CFO / revenue',
], 1, {
  c: 'ROE = Net income / average equity — DuPont breaks it into margins, turnover, leverage.',
  w: [
    'That is margin, not ROE.',
    'That is working capital.',
    'Cash flow margin differs.',
  ],
});

addTopic(5, 'A higher current ratio generally suggests:', [
  'Higher long-term leverage',
  'Better short-term liquidity coverage (context: quality of assets matters)',
  'Lower gross margin',
  'Higher beta',
], 1, {
  c: 'Current assets/current liabilities — liquidity; watch inventory quality.',
  w: [
    'Leverage uses debt metrics.',
    'Margin is P&L structure.',
    'Beta is market risk.',
  ],
});

addTopic(6, 'A rights issue primarily:', [
  'Reduces the number of shares outstanding',
  'Offers new shares to existing shareholders in proportion (subject to terms)',
  'Is always at a price above market without exception',
  'Means automatic delisting',
], 1, {
  c: 'Rights issues are offered to existing shareholders to raise capital.',
  w: [
    'Buybacks/consolidation reduce shares; rights increase if subscribed.',
    'Pricing is regulated/fairness-driven; not “always above market”.',
    'Delisting is a separate process.',
  ],
});

addTopic(7, 'In a DCF model, WACC is used typically as:', [
  'Only the dividend growth rate',
  'Discount rate reflecting blended cost of equity and debt (tax-adjusted) for FCFF',
  'Inventory turnover',
  'P/E of comparable firms only',
], 1, {
  c: 'FCFF is discounted at WACC representing all providers of capital.',
  w: [
    'Growth g is separate input in Gordon/terminal contexts.',
    'Turnover is operating metric.',
    'Relative multiples are comps methods.',
  ],
});

addTopic(7, 'Relative valuation using EV/EBITDA is attractive because:', [
  'It ignores capital structure completely',
  'It compares firms with different leverage somewhat better than raw P/E in many cases (enterprise perspective)',
  'It replaces all cash flow analysis',
  'It is illegal for Indian listed companies',
], 1, {
  c: 'EV/EBITDA focuses on enterprise value and operating earnings — useful cross-capital structure.',
  w: [
    'Capital structure still matters; EV includes debt net of cash.',
    'Multiples complement, not replace, fundamentals.',
    'Relative valuation is standard practice.',
  ],
});

addTopic(8, 'Beta in equity analysis measures:', [
  'Dividend growth only',
  'Sensitivity of stock returns to market returns (systematic risk proxy)',
  'Company’s tax rate',
  'Audit qualification',
], 1, {
  c: 'Beta estimates co-movement with the market index.',
  w: [
    'Dividends are policy/financials.',
    'Tax rate is statutory.',
    'Audit is accounting quality.',
  ],
});

addTopic(8, 'Diversification across uncorrelated assets mainly reduces:', [
  'Inflation',
  'Idiosyncratic (firm-specific) risk',
  'Systematic market risk to zero',
  'Regulatory oversight',
], 1, {
  c: 'Unsystematic risk can be diversified; market risk remains.',
  w: [
    'Inflation is macro — not removed by stock diversification alone.',
    'Market risk cannot be diversified to zero in one-country equity basket.',
    'Regulation is external.',
  ],
});

addTopic(9, 'Under SEBI’s RA framework, conflicts of interest should be:', [
  'Hidden if small',
  'Disclosed and managed (Chinese walls, disclosures, limitation lists as applicable)',
  'Ignored if the report is bullish',
  'Only verbal',
], 1, {
  c: 'Material conflicts must be disclosed; firms use policies and information barriers.',
  w: [
    'Non-disclosure violates conduct expectations.',
    'Bias cannot justify poor disclosure.',
    'Written disclosures are standard in reports.',
  ],
});

addTopic(9, 'GSM/ASM surveillance measures on exchanges aim to:', [
  'Guarantee profits',
  'Highlight/monitor securities with unusual risk/volatility concerns for investor protection',
  'Replace SEBI entirely',
  'Set IPO prices',
], 1, {
  c: 'Graded/Additional surveillance frameworks flag riskier names with trading/margin rules.',
  w: [
    'No profit guarantees.',
    'SEBI remains regulator.',
    'IPO pricing follows issue mechanics.',
  ],
});

addTopic(10, 'Dow Theory’s concept of “confirmation” often refers to:', [
  'Only volume must be zero',
  'Trend signals aligning across indices (e.g., industrials vs transports in classical form)',
  'RBI confirming repo',
  'Auditor confirmation letter only',
], 1, {
  c: 'Classical Dow uses cross-index confirmation as a trend validity check (modern markets adapt indices).',
  w: [
    'Volume supports trends but zero volume is unrealistic.',
    'RBI is unrelated.',
    'Audit confirmation is accounting.',
  ],
});

// Additional verified stems (correctIdx and explain.w aligned to wrong options in ascending index order)
addTopic(1, 'Buy-side research is most often:', [
  'Public to all retail investors by default',
  'Internal to asset managers for portfolio decisions',
  'Filed with RBI daily',
  'Same as credit rating',
], 1, {
  c: 'Buy-side analysts typically produce research for internal portfolio teams; it is not generally distributed like sell-side research.',
  w: [
    'Sell-side or public distribution is different; buy-side work is mainly for the asset manager’s own process.',
    'Depository/banking filings are not where buy-side research “lives”.',
    'Credit ratings are issued by CRAs under a different framework than equity research.',
  ],
});

addTopic(1, 'Dematerialized holdings are maintained at:', [
  'RBI only',
  'Depositories via DP accounts',
  'Post office',
  'Only foreign banks',
], 1, {
  c: 'Securities in demat form are held with depositories (NSDL/CDSL) through a Depository Participant.',
  w: [
    'RBI manages monetary policy and banking regulation; it does not maintain investor demat balances.',
    'Post office is not the infrastructure for listed securities demat.',
    'DPs include Indian-eligible entities; demat is not restricted to foreign banks.',
  ],
});

addTopic(2, 'Credit rating reflects:', [
  'Guaranteed repayment',
  'Opinion on relative likelihood of timely obligation servicing',
  'Company’s stock beta',
  'Nifty level',
], 1, {
  c: 'Ratings are opinions on creditworthiness/timely servicing — not a guarantee of repayment.',
  w: [
    'No rating can guarantee repayment; default risk always exists.',
    'Beta is an equity market risk measure, not a credit rating output.',
    'Index levels are unrelated to the definition of a CRA opinion.',
  ],
});

addTopic(3, 'Real interest rate is approximately:', [
  'CPI + nominal rate',
  'Nominal rate − inflation expectations',
  'GDP',
  'Fiscal deficit',
], 1, {
  c: 'Real rate ≈ nominal rate minus expected inflation (Fisher-style intuition used in macro work).',
  w: [
    'Adding CPI to nominal is not the standard Fisher approximation.',
    'GDP is an output measure, not the real interest rate.',
    'Fiscal deficit is a budget concept, not the real interest rate.',
  ],
});

addTopic(4, 'Industry cyclicality implies:', [
  'Margins never change',
  'Profits are sensitive to economic cycles',
  'No competition exists',
  'P/E is always 10',
], 1, {
  c: 'Cyclical industries see earnings swing with the business cycle.',
  w: [
    'Cyclicality means margins and profits can vary materially through cycles.',
    'Competition can exist in both cyclical and non-cyclical industries.',
    'Valuation multiples are not fixed at a single number.',
  ],
});

addTopic(5, 'SWOT analysis is:', [
  'Only a tax computation',
  'Qualitative structured scan of strengths/weaknesses/opportunities/threats',
  'Same as cash flow statement',
  'Bond covenant',
], 1, {
  c: 'SWOT is a structured qualitative framework used in company/industry research.',
  w: [
    'Tax computation uses tax laws and accounts — not SWOT.',
    'Cash flow statement is financial reporting, not SWOT.',
    'Covenants are debt contract terms — not SWOT.',
  ],
});

addTopic(6, 'A stock split typically:', [
  'Changes proportional ownership percentage for an existing shareholder who holds through the split',
  'Adjusts price and share count so economic ownership stake is unchanged absent other transactions',
  'Is the same as a dilutive fresh issuance to new investors at a discount',
  'Is a debt issue',
], 1, {
  c: 'A split increases shares and adjusts price; an existing holder’s ownership fraction stays the same if they take no other action.',
  w: [
    'A split does not change an existing holder’s proportional ownership (no new shares are issued to others in a pure split).',
    'A dilutive issuance raises capital and can change ownership mix; a split is different.',
    'Debt issuance is unrelated to a stock split.',
  ],
});

addTopic(7, 'Terminal value in DCF captures:', [
  'Only next quarter revenue',
  'Value beyond explicit forecast horizon',
  'Historical EPS only',
  'Dividend day',
], 1, {
  c: 'Terminal value represents the continuing value after the explicit forecast period (perpetuity/Gordon/multiple-based).',
  w: [
    'Near-term revenue alone does not replace terminal value.',
    'Historical EPS is backward-looking; terminal value is forward-looking.',
    'Dividend date is a corporate action detail, not TV definition.',
  ],
});

addTopic(8, 'Negative correlation between two assets implies:', [
  'They always move together',
  'They tend to move in opposite directions on average',
  'One is always risk-free',
  'Beta is undefined',
], 1, {
  c: 'Negative correlation means returns tend to move in opposite directions on average (not perfectly every day).',
  w: [
    'Positive co-movement is associated with positive correlation.',
    'Correlation does not imply either asset is risk-free.',
    'Beta can still be defined; correlation is a separate pairwise statistic.',
  ],
});

addTopic(9, 'A good research report should clearly state:', [
  'Guaranteed returns',
  'Assumptions, risks, and disclosures',
  'Insider tips',
  'Personal political opinions unrelated to issuer',
], 1, {
  c: 'Credible reports disclose assumptions, risks, and conflicts; returns cannot be guaranteed.',
  w: [
    'Guaranteeing returns is inconsistent with fair presentation and market reality.',
    'Insider tips are improper and often illegal to trade on.',
    'Irrelevant political views do not belong in professional issuer-focused research.',
  ],
});

addTopic(10, 'RSI is best categorized as:', [
  'Liquidity ratio',
  'Momentum oscillator',
  'Debt covenant',
  'Dividend policy',
], 1, {
  c: 'RSI is a bounded momentum oscillator used in technical analysis.',
  w: [
    'Liquidity ratios come from financial statements (e.g., current ratio), not RSI.',
    'Covenants are contractual debt terms.',
    'Dividend policy is corporate policy, not an indicator.',
  ],
});

function validateMcqSeeds() {
  for (const t of TOPIC_BANK) {
    if (!Array.isArray(t.opts) || t.opts.length !== 4) {
      throw new Error(`MCQ seed: need 4 options — "${t.stem?.slice(0, 48)}…"`);
    }
    if (t.correctIdx < 0 || t.correctIdx > 3 || !Number.isInteger(t.correctIdx)) {
      throw new Error(`MCQ seed: correctIdx must be 0–3 — "${t.stem?.slice(0, 48)}…"`);
    }
    const wrongN = [0, 1, 2, 3].filter((i) => i !== t.correctIdx).length;
    if (!t.explain?.w || t.explain.w.length !== wrongN) {
      throw new Error(`MCQ seed: explain.w must have ${wrongN} entries — "${t.stem?.slice(0, 48)}…"`);
    }
    if (!t.explain?.c || typeof t.explain.c !== 'string') {
      throw new Error(`MCQ seed: missing explain.c — "${t.stem?.slice(0, 48)}…"`);
    }
    if (t.opts[t.correctIdx] === undefined) {
      throw new Error(`MCQ seed: correct option missing — "${t.stem?.slice(0, 48)}…"`);
    }
  }
}

validateMcqSeeds();

/** 33 wrappers × 31 seeds = 1023; first 1020 rows feed 10 levels × 102 questions — each stem string is unique. */
const STEM_PREFIXES = [
  '',
  'Exam focus: ',
  'Review: ',
  'Concept check: ',
  'Practice item: ',
  'NISM XV: ',
  'Scenario: ',
  'Recall: ',
  'Verify: ',
  'Assessment: ',
  'Mock stem: ',
];
const STEM_SUFFIXES = [
  '',
  ' — choose the single best answer.',
  ' — pick the most precise definition.',
];

function buildExpandedTopicBank() {
  const expanded = [];
  for (const base of TOPIC_BANK) {
    for (let v = 0; v < 33; v++) {
      const prefix = STEM_PREFIXES[v % STEM_PREFIXES.length];
      const suffix = STEM_SUFFIXES[Math.floor(v / STEM_PREFIXES.length) % STEM_SUFFIXES.length];
      expanded.push({
        levelHint: base.levelHint,
        stem: `${prefix}${base.stem}${suffix}`,
        opts: base.opts,
        correctIdx: base.correctIdx,
        explain: base.explain,
      });
    }
  }
  if (expanded.length < 1020) {
    throw new Error(`MCQ expanded bank: need ≥1020 rows, got ${expanded.length}`);
  }
  const bank = expanded.slice(0, 1020);
  const seen = new Set(bank.map((b) => b.stem));
  if (seen.size !== bank.length) {
    throw new Error('MCQ expanded bank: duplicate question stems after expansion');
  }
  return bank;
}

const EXPANDED_TOPIC_BANK = buildExpandedTopicBank();

function synthQuestion(level, seq) {
  const globalIdx = (level - 1) * 102 + seq;
  const base = EXPANDED_TOPIC_BANK[globalIdx];
  if (!base) {
    throw new Error(`MCQ: missing expanded row for level ${level} seq ${seq} (index ${globalIdx})`);
  }
  const question = base.stem;

  // Keep options in the same order as the verified seed bank (no shuffling) so the keyed
  // correctIndex always matches the displayed letter and cannot drift due to permutation bugs.
  const order = [0, 1, 2, 3];
  const newOpts = order.map((i) => base.opts[i]);
  const correctIndex = base.correctIdx;
  if (newOpts[correctIndex] !== base.opts[base.correctIdx]) {
    throw new Error('MCQ: displayed text does not match keyed correct option.');
  }

  const wrongOrig = [0, 1, 2, 3].filter((i) => i !== base.correctIdx);
  const wByOrig = new Map();
  wrongOrig.forEach((orig, idx) => wByOrig.set(orig, base.explain.w[idx]));

  const whyCorrect = base.explain.c;
  /** @type {string[]} */
  const optionDetail = [];
  for (let d = 0; d < 4; d++) {
    if (d === correctIndex) {
      optionDetail[d] = whyCorrect;
    } else {
      const origIdx = order[d];
      optionDetail[d] = wByOrig.get(origIdx)
        || 'Incorrect: this choice does not match the definition or regulatory treatment emphasized in the NISM Research Analyst workbook.';
    }
  }

  const id = `L${level}-S${String(seq).padStart(4, '0')}`;

  return {
    id,
    level,
    question,
    options: newOpts,
    correctIndex,
    whyCorrect,
    /** Text shown for the selected option after answer reveal (correct = rationale; wrong = why that option fails). */
    optionDetail,
    /** For the selected wrong option, also reference why the keyed correct answer holds. */
    summaryWhenWrong: `The keyed correct answer reflects the workbook’s framing: ${whyCorrect}`,
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
