# TradeStack — Service architecture

**Evidence basis:** Python engine `README.md`, `SETUP.md`, `app/main.py`, `app/analyzer/*`, `app/services/risk_engine.py`, `trade_lifecycle_manager.py`; Node gateway `README.md`, `routes/router.js`, `security/session.js`, `controllers/trading/*`.

## Three distinct execution boundaries

1. **Public marketing website**: standalone static HTML/CSS/JavaScript deployed via Cloudflare Pages. No engine/database API calls, no login, no broker connections.
2. **Authenticated gateway**: Node.js/Express private application with Upstox OAuth, Redis-backed server-side session, HttpOnly cookie, CSRF and account ownership checks. It controls paper sessions and reads MongoDB history.
3. **Python engine**: FastAPI control service and runtime market processing; Upstox V3 feed, candle/indicator construction, strategy evaluation, risk gating, simulated execution, recording/replay.

## Logical data flow

```text
                    Authenticated operator
                            |
                Node.js/Express gateway
                  |                |
              Upstox OAuth      MongoDB history
                  |
           Authenticated session
                  |
       Python engine via shared secret
                  |
   Upstox V3 WebSocket market-data ticks
                  |
       UserTrader + candle construction
                  |
     Indicators and strategy evaluation
                  |
       Setup selection + filter/score
                  |
       Capital, session, strike/depth
                  |
           Paper trade simulation
                  |
      Trade lifecycle and P&L records
                  |               |
                MongoDB         Redis state
                  |
           Research audit/journal

Parallel capture:
  incoming market events -> recorder/manifest -> Parquet
      -> preflight -> simulation clock -> depth-aware fill simulator
```

## Signal lifecycle

Signal candidates can be `BUY_CALL`, `BUY_PUT`, or `NEUTRAL`. Not every candidate reaches the order stage:

- Time-window and feature-flag gates
- Directional/higher-timeframe trend checks and counter-trend protection
- ADX, VWAP, RSI, exhaustion and overextension checks
- Score threshold (documented default minimum 7)
- Redis-backed session limits and account capital constraints
- Option strike, spread and market-depth checks

There are **11 documented strategy classes** and multiple named setups. Strategy existence does not imply any measured profitability. Settings may differ by configuration and version.

## Risk / lifecycle

The engine includes an account-scoped `RiskEngine` with Redis-based P&L, drawdown and kill-switch state. Documented defaults include up to 2% per-trade risk and 5% daily drawdown limits, constrained by request validation. A separate unresolved-exit block prevents new trades when exit pricing cannot be reconciled.

`ActiveTradeContext` tracks index-based protective levels, target state, break-even and trailing behavior, and records exit reasons. **A PROFIT_LOCK or BREAK_EVEN label alone does not establish a positive net P&L.** Use the actual option entry/exit prices and cost records.

The engine's documented session boundaries include no new entries after 15:15 IST and forced exit at 15:20 IST (config/strategy may evolve). These are implemented time-control mechanisms, not a risk guarantee.

## Session API boundary

`/health`, `/start-trading`, `/stop-trading`, and control-panel configuration belong to the private engine and require gateway authentication. The public marketing site does not invoke them.

The Node gateway includes authenticated paper session, status, market snapshot, trade, signal and analytics routes. Its live placement/modification routes return explicit disabled responses.

## Persistence

- Redis: transient command transport, session/risk locks, cached state.
- MongoDB: durable trades/signals/session history, plus research and audit records.
- Parquet + manifests: recorded market events and session metadata for deterministic replay.

These have different sources-of-truth semantics; do not treat Redis counters as authoritative historical analytics.

## Limitations

A private code review is not an independent security audit. The replay implementation and paper execution can diverge under missing data, stale quotes, differing fill assumptions or incomplete manifests. Do not expose private engine URLs or broker tokens in an otherwise public website.
