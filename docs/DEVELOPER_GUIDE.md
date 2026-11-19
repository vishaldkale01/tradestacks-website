# TradeStack — Developer guide

**Status:** public architecture documentation for an independent, currently paper-only research system.  
**Reviewed:** 2026-11-19 against the connected engine/gateway repositories.  
**Not provided:** broker credentials, live order facilities, private repository content, real account data, recordings or guaranteed profits.

## Repositories and access

| Component | Repository | Visibility | Purpose |
| --- | --- | --- | --- |
| Marketing site | `vishaldkale01/tradestacks-website` | Public | Static Cloudflare Pages presentation |
| Trading engine | `vishaldkale01/algo-execution-service` | Private | Python 3.12 FastAPI, market analysis, risk, paper execution and historical replay |
| Gateway & dashboard | [`vishaldkale01/upstox_api_integration`](https://github.com/vishaldkale01/upstox_api_integration) | Public | Node.js 22+ Express, Upstox OAuth, paper-session controls, MongoDB history |

The Python repository has a **separate licensing/release process**; this website does not imply it is open source. Do not mirror or expose private sources without an audited release.

## Scope

### Trading engine

- `app/main.py`: authenticated control endpoints, Redis command publication, paper-mode configuration
- `app/services/trading_manager.py`: account-scoped UserTrader instances, runtime feed/session context
- `app/services/websocket_client.py`: Upstox V3 market-data intake
- `app/analyzer/`: candles, VWAP/EMA/ADX/RSI/ALMA etc., strategy classes, directional filters, score modifiers and decision state
- `app/services/risk_engine.py`: capital limits, daily drawdown locks, unresolved-price entry blocking
- `app/services/trade_lifecycle_manager.py`: target, break-even, trail, partial milestone and exit reasons
- `app/services/market_data_recorder.py` and `app/services/parquet_recorder.py`: market data capture/compaction
- `scripts/run_session_backtest.py`: replay entry point, preflight, clock and fill model

### Upstox gateway

- `routes/router.js`: HTTP routing after user/session and ownership guards
- `security/session.js`: HttpOnly session, CSRF validation, account ownership
- `controllers/trading/trading-with-python-backend.js`: engine control and fallback paper-session status
- `controllers/trading/paper-history.js`: account-scoped sessions, trades, signals and analytics from MongoDB
- `public/trading-dashboard.html`: six modules — Overview, Configuration, Past sessions, Trade history, Signals, Analytics

The current gateway explicitly **rejects direct live order placement/modification routes**. Do not label the site as a brokerage service.

## Developer quick start — local only

Python engine (requires access to its private repository):

```bash
python3.12 -m venv .venv
source .venv/bin/activate
python -m pip install -r requirements.txt
cp .env.example .env
# Configure MONGODB_URI, DATABASE_NAME, REDIS_URL, ENGINE_API_TOKEN
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

The engine's HTTP API, including health, requires `X-Engine-Token`. Never include that value in public browser code.

Node gateway (separate terminal and checkout):

```bash
git clone https://github.com/vishaldkale01/upstox_api_integration.git
cd upstox_api_integration
npm ci
cp .env.example .env
# Configure APP_ORIGIN, MONGO_DB, REDIS_URL, PYTHON_BACKEND_URL,
# SESSION_SECRET, ENGINE_API_TOKEN, Upstox OAuth credentials
# and ALLOWED_UPSTOX_USER_IDS.
npm start
```

The local OAuth redirect URI must match the Upstox application and `APP_ORIGIN`. Both services must select the same MongoDB database. Redis and MongoDB must be available before starting.

## Tests

```bash
# Engine
python -m pip install -r requirements-dev.txt
python -m pytest tests/ -v
python scripts/run_session_backtest.py --help
python scripts/run_session_backtest.py --list-dates

# Gateway
npm test
npx playwright install chromium
npm run test:browser
```

These do **not** certify live Upstox logins, recorded-session parity, broker settlement, profitability or production security. Synthetic unit tests are different from replaying a complete captured session.

## Security and release

- Keep engine, database and Redis ports private.
- Broker access token remains server-side in Redis-backed gateway sessions.
- Session cookie is HttpOnly, and changing requests require CSRF checks.
- Enforce account ownership for history and controls.
- Review Git history, references, branches, binary recordings and logs before any public Python release.
- Do not publish secrets, individual trade account IDs, raw orderbooks tied to private accounts, or sensitive audit logs.

See [architecture](ARCHITECTURE.md), [data/replay](DATA_AND_REPLAY.md), and [case study](RESEARCH_CASE_STUDY_OCT_16.md).

