# Research case study 001: a smaller loss is not a proven edge

**Underlying date:** 2026-10-16, 09:15–11:40 IST.  
**Execution mode:** historical controlled replay with simulated option fills.  
**Strategy version:** `strategy-v2026.10.15` (frozen in the research process).  
**Source:** private engine repository `reports/research/immediate_1m_gate/FINDINGS.md`.  
**Evidence grade:** inspected repository report + code/test architecture + independently checked arithmetic. **Not** an independently rerun market recording or audited brokerage statement.

## Question

Would a new entry-quality gate improve the outcome of the existing rule-based strategy while using only candles available at decision time?

## Comparison

- Baseline: existing strategy without the experimental gate.
- Immediate 1-minute gate: reject on adverse EMA5/MACD histogram slope or a two-candle exhaustion/rejection pattern using completed 1-minute data.
- Completed 5-minute alignment: require latest completed 5-minute candle direction and EMA21 alignment.

The study held the same recorded session window and fee model for all variants, with 57,579 callback events, 380 analyzer evaluations, depth-based fills, 100 ms scheduled latency and 0.5% depth-exhaustion impact. Each variant had two closed trades.

| Replay variant | Closed trades | Win rate | Gross P&L | Net P&L after costs | Profit factor |
| --- | ---: | ---: | ---: | ---: | ---: |
| Baseline | 2 | 0% | -₹1,240.50 | -₹1,459.77 | 0.00 |
| Immediate 1m quality | 2 | 50% | -₹273.00 | -₹491.05 | 0.51 |
| Completed 5m alignment | 2 | 0% | -₹1,240.50 | -₹1,459.77 | 0.00 |

Calculations from the report:

- Baseline implied charges = `(-1240.50) - (-1459.77) = ₹219.27`.
- Immediate gate implied charges = `(-273.00) - (-491.05) = ₹218.05`.
- Difference in net replay result = `(-491.05) - (-1459.77) = +₹968.72`.

**Both the baseline and immediate filter are losing variants.** These are not actual live-account returns.

## Why this is a path-dependent comparison

The immediate gate rejected recorded candidates at 09:33, 09:58 and 10:56. The altered state generated later entries at 09:46 and 11:07. Cooldowns, active positions, sizing and drawdown state depend on preceding decisions. Removing three losing historical trades from an accounting table would not reproduce this result.

The 5-minute filter did not prevent the earliest losing positions; its net result matched the baseline for the window.

## Limitations acknowledged in the source

1. Two usable **partial** sessions and only two closed trades in the main comparison; too few for meaningful performance confidence.
2. Paper trades and replay trades were not fully identical in this date window.
3. Recorded replay trade setups were labeled `UNKNOWN`; setup-level profitability cannot be inferred.
4. Local fee model and broker fee estimates were mismatched, so absolute net amounts retain uncertainty.
5. The October 9 recording lacked warmup and yielded no reconstructable trades; it was excluded.
6. October 14 partial results could not establish benefit.

## Verification performed for publication

- Read the source findings and related strategy/replay/test files.
- Independently checked the reported net-versus-gross cost differences and between-variant net delta.
- Confirmed the source repository contains replay preflight, simulated clock, 5-level order-book fill tests, and session validation code.
- Confirmed the current GitHub engine test workflow reported success on 2026-11-07. That is **not** a reproduction of these historical trading results.
- Did **not** run the original Oct 16 recording from scratch; raw recordings were not available for this website publishing step.

## Research decision

Follow the report: do **not** change the frozen strategy on this evidence. Continue collecting complete replay-valid paper sessions, keep the quality gate in shadow mode and re-test net expectancy, drawdown, false rejections, setup/regime stability and transaction-cost accuracy before promotion.

The purpose of publishing this case study is to show how TradeStack tests, limits and rejects strategy ideas—not to present profitability claims.
