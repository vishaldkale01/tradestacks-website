# TradeStack — Public Website

The official static marketing and research website for [tradestacks.dev](https://tradestacks.dev).

**Purpose:** Explain the TradeStack research platform, its paper-trading status, architecture, methodology and roadmap. The website **does not connect to the trading engine, broker, Redis, or MongoDB**. It intentionally displays no live-account or unverified profit claims.

## Stack

- Semantic HTML5 and responsive CSS
- Lightweight vanilla JavaScript (mobile navigation and copyright year)
- Cloudflare Pages via GitHub integration
- No Node build process, external dependencies, cookies or tracking scripts

## Run locally

Run from the repository root:

```bash
python3 -m http.server 8080
```

Open <http://localhost:8080>.

## Deploy

Production is connected to `main` in the Cloudflare Pages project `tradestacks-website`.

| Setting | Value |
| --- | --- |
| Framework preset | None |
| Production branch | `main` |
| Build command | Leave blank |
| Build output directory | `.` |
| Custom domain | `tradestacks.dev` |

Pull requests and other branches can generate preview deployments if enabled in Cloudflare.

## Editorial / security rules

- Paper trading and replay are not real-money performance. Always state execution mode.
- Do not publish P&L, strategy metrics or simulated outcomes until validated with trading costs, fill assumptions and data-quality checks.
- Do not publish API keys, tokens, account IDs, broker credentials, production URLs, or personal trading records.
- Only describe features as available if confirmed in the corresponding service; distinguish experimental, validated and planned.
- Never expose the local engine, Redis or MongoDB through the static website.

## Current site sections

Hero, platform, approach, research methodology, architecture, roadmap, FAQ and contact/GitHub.

## Design notes

The console illustration is a static conceptual mockup, **not actual market data**. The reported strategy/filter counts reflect the engine README's documented structure, and should be kept in sync as that code changes.

The website source is public. The engine and gateway have separate access and licensing.

## Project sources and public positioning

Website content was reviewed against the `algo-execution-service` Python project (private) and `upstox_api_integration` Node.js/Upstox gateway (public). The website does not expose private repository contents, trading credentials or customer information. Historical replay is implemented but not claimed fully validated. The restricted gateway explicitly disables public live orders.

## Public pages and contact links

- `index.html`: Landing page, services and roadmap
- `platform.html`: Feature breakdown of the Python engine and Node gateway
- `architecture.html`: Technical components, state and paper trade data flow
- `research.html`: Recording, replay, costs and investigation standards
- `contact.html`: LinkedIn, YouTube and GitHub community links

Official links supplied for this site:
- LinkedIn: https://www.linkedin.com/in/algodev01/
- YouTube: https://www.youtube.com/@tradeStack01
- GitHub website repository: https://github.com/vishaldkale01/tradestacks-website

These links are user-provided/owned project destinations; there is no public email address or subscription form.

## Product showcase phase: Engine & Dashboard

- `trading-engine.html`: Source-grounded market-to-journal flow, strategies, filter/score gates, session risk, trade lifecycle and Parquet replay. Based on the Python engine modules and configuration; not a claim of strategy profitability.
- `dashboard.html`: Keyboard-accessible static demonstration of the six documented workspace modules (Overview, Configuration, Past Sessions, Trade History, Signals and Analytics). All numerical values use placeholders, no broker credentials or API calls.
- `showcase.css`: Additional responsive styles for the visual walkthrough and explanatory components.

The interactive dashboard preview is **not a live screenshot or connected account**. Capture carefully sanitized real UI screenshots separately before claiming to demonstrate actual visuals. The production gateway remains restricted to configured accounts, and its direct live-order routes are disabled.

## Developer documentation and research case study (November 2026)

Source-grounded developer documentation is available on the website at `/developers.html` and in versioned Markdown:

- `docs/DEVELOPER_GUIDE.md` — architecture, setup and testing
- `docs/ARCHITECTURE.md` — service/market-data flow and risk boundaries
- `docs/DATA_AND_REPLAY.md` — account-scoped history, replay preflight and synthetic order-book VWAP test
- `docs/RESEARCH_CASE_STUDY_OCT_16.md` — documented October 16 controlled replay comparison, limitations and audit scope

`research-case-study.html` summarizes an internal report from the Python engine: two-trade partial-session replay; **baseline net loss ₹1,459.77 vs immediate-gate net loss ₹491.05**. These are **negative simulated results**, not trading returns. Math was checked, but original private recording was not independently rerun during website publication. Do not advertise this as a verified profitable strategy.

### Brand asset

`assets/tradestack-logo.webp` is an optimized 300px version of the owner-supplied TradeStack artwork (TS monogram / candlestick chart). It appears in navigation, footers and favicons. Do not modify or misrepresent the mark.

### Deployment / public safety

Changes on `design/premium-launch-redesign` are in PR #1 until approved and merged. Merge triggers Cloudflare Pages production deployment to `tradestacks.dev`. The website makes no requests to broker, Redis, MongoDB or the engine. No live-order credentials, account identifiers, recorded ticks or private repository data are shipped.

## Product roadmap: single account now, multi-user research later

- **Current:** one authorized Upstox research account, behind private gateway authentication, for paper trading and recording. No visitor access to session controls.
- **Validation:** reconcile trade accounting, exit attribution and replay fidelity before public performance reporting.
- **Next (planned, not deployed):** sanitized read-only public activity/research summaries from the one authorized account. No raw exchange feed redistribution, account identifiers, tokens, or internal logs.
- **Future (exploratory):** allow registered users to connect their own supported brokerage accounts for **independent paper simulations only**. Requirements include user/session/recording isolation, separate risk and capital limits, authentication, abuse controls, regulatory/licensing review and no shared access to the owner's account. This is a direction, **not** a release date or a live-order product commitment.

## Astro + Markdown engineering journal

This version adds a statically generated journal at `/blog/` using Astro 6 and Markdown content collections.

- All nine existing HTML routes remain byte-identical in Astro's output; `scripts/stage-legacy.mjs` copies an explicit allowlist of root files into `public/` before each build.
- Three source-grounded articles live in `src/content/blog/`.
- A shared Astro layout reuses the TradeStack logo, nav, footer and original stylesheet.
- Articles generate `/rss.xml` and are included in the build-generated sitemap.
- `npm run build` outputs `dist/` and runs static verification.

See [Blog Publishing and Cloudflare migration](docs/BLOG_PUBLISHING.md). **Merging code does not change Cloudflare's current build settings**: after review/merge, switch Pages to `npm run build`, output `dist`, Node 22.12+ and redeploy. The public site continues to be independent of the private trading engine.
