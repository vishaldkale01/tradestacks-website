---
title: "Recording Market Sessions with DuckDB, Parquet and a Simulation Clock"
description: "How TradeStack approaches tick recording, reproducible session replay, depth-aware fill simulation and the limitations of backtesting fidelity."
published: 2026-11-19
category: Architecture
tags: [DuckDB, Parquet, Backtesting, Python]
draft: false
---

A historical replay is only as credible as the data and assumptions that produced it.

A basic backtest may use one-minute candles and assume an order fills at the last traded price. That can be convenient for prototyping, but it hides several things that matter to index-options scalping: quote spreads, market depth, timing, missing feed events and transaction costs.

TradeStack's research pipeline therefore aims to reproduce **what the engine could have known and done at each event time**, rather than giving its historical strategy access to the future.

## Capture without blocking decisions

The Python market-data service receives Upstox V3 market events and dispatches them to the trading session. In parallel, the recording architecture uses an asynchronous path for capturing diagnostic events and market data.

The research documentation describes a DuckDB-backed recording workflow that buffers observations and writes compressed Parquet datasets. Parquet stores tabular event data efficiently for scanning and analysis; it is not itself a trading decision engine.

The important architectural property is separation: disk writes and compaction should not block time-sensitive strategy analysis.

That claim must be measured under actual session conditions, not assumed merely because code is asynchronous.

## Preserve the session, not just the prices

A complete session needs more than OHLC or last traded price. The recorder/manifests are designed to preserve contextual artifacts such as:

- Session start and stop boundaries.
- Effective strategy configuration and version.
- Option-chain snapshots and freshness.
- Recorded decisions and selected execution outcomes.
- Metadata about event counts, dropped frames and writer integrity.
- Market timestamps and available order-book depth.

A replay that has prices but lacks the strategy's warmup state or the historical option-chain context may generate a plausible but incorrect trade sequence.

The implementation includes a preflight layer that can flag incomplete session artifacts. We should **exclude** incomplete recordings from claims about measured strategy expectancy.

## The simulation clock matters

An old bug class in backtesting occurs when a strategy uses today's wall clock while processing an event from last month.

For example, consider a five-minute post-stop cooldown:

1. A simulated stop happens at historical time **09:30**.
2. The engine receives a new historical tick at **09:31**.
3. The cooldown should still be active.
4. At **09:36**, it should have expired.

This should be calculated using recorded event time, not the computer's current clock.

TradeStack implements a clock abstraction that supports both a system clock for ongoing sessions and a simulation clock for replay. The repository has isolated tests covering timestamp conversion and event-time progression. Unit tests validate selected behavior; they do not prove all recorded sessions replay identically.

## Fill simulation is more than using LTP

The order-book simulator models a market order sweeping available bid/ask levels, scheduled latency and penalties when requested size exceeds the modeled depth.

A deliberately synthetic unit-test example in the code uses a buy order of **60 units** against:

| Ask level | Quantity | Price |
| --- | ---: | ---: |
| 1 | 20 | ₹100.00 |
| 2 | 30 | ₹101.00 |
| 3 | 10 used | ₹102.50 |

The expected average fill price is:


```
(20×100 + 30×101 + 10×102.5) / 60
= ₹100.9167
```


That is a check of an arithmetic model—not an actual Upstox fill.

The simulator also includes fee estimation. Fees and slippage should be compared against available broker evidence rather than treated as universally accurate assumptions.

## What a valid replay needs

Before using a replay result to change a strategy, our research checklist requires:

- A clearly bounded, sufficiently complete recorded session.
- Consistent event order and timestamps.
- No look-ahead in warmup, indicator formation or option selection.
- Relevant depth, spread and instrument information at the decision time.
- A documented latency and fill model.
- Correct treatment of gross and net P&L.
- Transparent differences between original paper trades and replayed trades.

The original engine's research documents explicitly say **complete-session replay fidelity remains under validation**. That limitation is not removed by the presence of working tests or a sophisticated simulator.

## The goal is reproducibility, not impressive charts

A powerful replay system can still produce unreliable trading claims if its recorded inputs are incomplete, fills are unrealistic or thresholds are selected on too few sessions.

For TradeStack, replay is useful when it helps answer a falsifiable question: *Would the decision and outcome have differed, given only the market information available at that time?*

Read the [replay and data guide](/developers.html), or see our [October replay case study](/research-case-study.html) for a concrete example of why these distinctions matter.
