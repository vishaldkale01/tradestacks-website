# TradeStack — Data, replay and research validation

## Data contracts (selected fields)

### Trades

`trade_id`, `user_id`, `session_id`, `strategy_version`, `symbol`, `trade_type`, `mode`, `status`, `entry`, `exit`, `risk_params`, `pnl`, `created_at`.

- `entry.signal_id` can be stored as a **string**, while `signals._id` is an ObjectId. Normalize types when joining.
- `pnl` may include `net_pnl`, `absolute`, or a brokerage/charge estimate. Verify actual schema and missing fields by session.
- Index-based risk/stop levels and option premium entry/exit prices use different units. Do not subtract them interchangeably.

### Signals

`signal_id`, `session_id`, `timestamp`, `strategy_version`, `signal_data`, `analysis`, `indicators`, `status`, `rejection_reason` and optional linked trade context.

Use audit records to explain rejected signals. A missing trade need not mean the strategy generated no candidate; execution gates can reject after a signal was created.

### Recorded market sessions

Date-partitioned market recordings and manifests may include:

- `session_start`, `session_stop`
- `effective_config_snapshot`
- `option_chain_snapshot`
- `decision` and `execution_outcome`
- Recorder metadata including completeness, dropped events and write failures

Before replay, check timestamps, session boundaries, recorded warmup, valid option depth, original configuration and fee assumptions.

## Replay preflight

The Python `scripts/run_session_backtest.py` checks session artifacts and reads selected manifest types. The companion `scripts/validate_paper_session.py` checks `COMPLETED_CLEAN`, no dropped events, session start/stop events and decision identities.

A study should **exclude incomplete or unvalidated sessions** from performance comparisons. Stale option-chain context or missing historical warmup must be labeled.

## Price, latency and fees

`OrderBookFillSimulator` models order-book depth, scheduled latency and impact penalties, with a fee engine for Indian derivatives. Unit tests cover synthetic examples; their passing status does not establish real broker-fill equivalence.

For every reported backtest:

1. Distinguish gross from net P&L after cost estimates.
2. Show execution mode (`PAPER`, replay, or live only when independently confirmed).
3. Record instrument, session date/window, number of trades, data completeness and strategy version.
4. Check signal-to-trade links, exit reason and option fills.
5. Compare paper and replay time alignment; disclose discrepancies.
6. Include sensitivity to spread, queue, slippage and fees where possible.

## Reporting method

The read-only post-session research workflow can derive:

- trade counts, gross/net amounts and charges;
- win/loss counts and win rate;
- setups, directions, exit-reason distributions;
- observations and hypotheses for further tests.

Hypotheses are not verified root causes. Session reports must not mutate strategy configuration or trading history.

## Example unit-test arithmetic (synthetic)

The engine's fill-simulator test specifies a MARKET BUY for 60 option units against synthetic asks:
- 20 @ ₹100.00
- 30 @ ₹101.00
- 10 @ ₹102.50

Expected weighted-average fill price:
`(20×100 + 30×101 + 10×102.5)/60 = ₹100.9166667`.

This is a **unit-test fixture**, not a broker trade or market replay return. It verifies the math of a depth sweep assumption, not execution realism in all conditions.

## Research status

See [the 16 October 2026 replay case study](RESEARCH_CASE_STUDY_OCT_16.md). The original recording was not rerun for publication; reported P&L must be attributed to the private repository findings. CI success on source code and correct arithmetic do not certify that data set.
