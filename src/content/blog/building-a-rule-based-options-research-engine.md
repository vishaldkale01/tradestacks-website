---
title: "Inside TradeStack: Engineering a Rule-Based Options Research Engine"
description: "How TradeStack moves from Upstox market data to strategy decisions, risk checks, simulated positions and auditable research without making profitability promises."
published: 2026-11-19
category: Engineering
tags: [Python, Signals, Risk Management, Paper Trading]
draft: false
---

A candidate signal is not a completed trade. That distinction shapes how we design TradeStack, an independent research system for Indian index-options trading.

Our Python service is built for **paper-mode investigation**. It ingests market data, calculates context, evaluates rule-based strategies, applies independent risk checks, simulates execution and stores a trail that can be reviewed later. The system is not presented here as a proven profitable strategy or an open public brokerage service.

## The pipeline begins with market context

The Python engine consumes an Upstox V3 WebSocket market feed. A user-scoped runtime session processes incoming index and option-market events, builds one-minute candles and maintains the information needed to evaluate setups.

The analyzer considers multiple types of context:

- **Direction:** Dow-style swing structure, VWAP location and moving-average alignment.
- **Trend strength:** ADX and higher-timeframe trend checks.
- **Momentum and condition:** RSI, MACD, stochastic values and Supertrend.
- **Overextension:** ALMA/ATR distance and related filters.
- **Execution quality:** available option quotes, spread width and order-book depth.

These inputs have different roles. A setup may detect an opportunity, while a separate rule determines that it is too extended, too illiquid or inconsistent with the larger trend.

## Strategy classes propose hypotheses

The engine README documents **11 strategy classes** with a larger set of named setups. The code follows a Strategy Pattern: each implementation evaluates a market context and can propose a CALL, a PUT, or no actionable signal.

Examples include trend pullback/continuation, impulse scalping, VWAP bounce, EMA retest, reversal and breakout patterns.

One example is a VWAP reaction. It is not enough for price to touch VWAP. The strategy also considers candle structure and higher-timeframe alignment. A proposed direction can be rejected if the five- or fifteen-minute trend contradicts it.

The architecture is deliberately different from allowing any single indicator to trigger an order.

## Filters and scores are not probabilities

After candidate generation, additional checks evaluate timing, trend, volatility, exhaustion and other configured conditions. The documented strategy configuration uses a minimum signal score of **7**.

That value is a rule-based threshold—not a statistically calibrated 70% probability of profit. The score is only meaningful inside its configured rule set and the market sample used to evaluate it.

We distinguish the following concepts:

1. A **candidate** exists when a pattern or strategy condition is met.
2. A **validated signal** survives the configured decision gates.
3. An **eligible paper order** passes the separate capital, quote and execution constraints.
4. A **closed trade** has recorded fills, lifecycle events, charges and an outcome that can be audited.

There may be many evaluated candidates for every recorded trade. Our research tools should explain those rejected decisions as well as completed positions.

## Risk is enforced outside the strategy idea

A positive strategy score does not grant permission to trade.

The Redis-backed risk engine maintains account-scoped trading state and checks capital drawdown. Documented default controls include a per-trade risk ceiling and a daily loss boundary. The implementation also includes an entry block when an exit price could not be reconciled.

That is useful engineering, but it is not proof that risk protections always operate correctly. Guard behavior still needs runtime and session-level validation, especially under retries, errors or stale prices.

Trade management is also stateful. The position lifecycle module tracks protective stop levels, break-even, trailing behavior, profit-lock milestones and exit reasons. An exit label such as **BREAK_EVEN** or **PROFIT_LOCK** must never be treated as evidence of positive net P&L without inspecting actual option fills and charges.

## Why the research journal matters

Trades and signals are persisted in MongoDB, while market events can be recorded separately to Parquet with session metadata. We use those records to ask questions after the session:

- Did the entry occur at the expected market timestamp?
- Which rule allowed or rejected the setup?
- Was the option quote fresh and its spread acceptable?
- Did the risk guard change a later decision?
- Was the exit reason consistent with the recorded prices?
- Did estimated brokerage turn a small gross profit into a net loss?

Those questions are often more useful than adding another indicator.

## What is implemented, and what is not

The Python engine, protected Node.js gateway, rule-based strategies, paper execution, risk components and recording/replay code are **implemented software components**. Their presence is not an independent certification of end-to-end correctness or profitability.

The current public TradeStack site cannot accept visitor trading sessions. Our [roadmap](/#roadmap) proposes a separate, isolated paper-simulation workspace for users much later.

For a code-oriented explanation, see [Trading Engine](/trading-engine.html) and the [Developer Documentation](/developers.html).

> TradeStack's purpose is to turn trading decisions into testable engineering questions. That requires keeping failed hypotheses visible, not hiding them.
