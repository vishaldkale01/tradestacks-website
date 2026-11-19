---
title: "A Smaller Replay Loss Is Not Proof of a Profitable Strategy"
description: "TradeStack's October 16 controlled replay compared two entry-quality filters with a baseline. Here is what the reported numbers mean—and what they cannot establish."
published: 2026-11-19
category: Research
tags: [Case Study, Trading Costs, Experiment Design, Replay]
draft: false
---

A common mistake in systematic trading research is to find an improvement in a backtest and immediately call it an edge.

Our October 16, 2026 research experiment is a useful counterexample. An additional entry-quality filter improved the *reported* after-cost replay outcome. But the test was a partial session with only two closed trades per variant—and **every variant remained net negative**.

This article summarizes a private TradeStack research report, not a fresh independent rerun of the market recording.

## What we tested

The report compared the frozen \`strategy-v2026.10.15\` pipeline with two optional checks:

- **Immediate one-minute quality:** at the decision time, reject a directional candidate when completed one-minute data indicates adverse EMA5/MACD-histogram slope or a two-candle exhaustion/rejection pattern.
- **Completed five-minute alignment:** require the last completed five-minute candle to agree with the intended trade direction and EMA21 relationship.

Both variants used only information available at the original decision timestamp. The experiment patched the research process temporarily; it did not permanently change live or paper strategy configuration.

## What the repository report recorded

The controlled comparison covered **09:15–11:40 IST on October 16**, with **57,579 callback events**, **380 analyzer evaluations**, depth-based fill assumptions, a **100 ms** modeled latency and consistent fee assumptions across variants.

| Variant | Closed trades | Win rate | Gross P&L | Net P&L after costs |
| --- | ---: | ---: | ---: | ---: |
| Existing baseline | 2 | 0% | −₹1,240.50 | **−₹1,459.77** |
| Immediate one-minute quality | 2 | 50% | −₹273.00 | **−₹491.05** |
| Completed five-minute alignment | 2 | 0% | −₹1,240.50 | **−₹1,459.77** |

The improvement in reported net P&L from baseline to the immediate filter is:

\[
(-491.05)-(-1459.77)=+₹968.72
\]

The **₹968.72 difference is not profit**. It is a reduction in the magnitude of a simulated loss.

The arithmetic behind the reported gross/net differences can also be checked: baseline implied costs were ₹219.27, while the one-minute variant implied costs were ₹218.05. Absolute fees remain uncertain because the study noted a mismatch between local and broker estimates.

## Why we cannot simply remove losing trades

A filtered signal changes the rest of a trading session.

The research report says the immediate filter rejected replay opportunities around **09:33, 09:58 and 10:56**. Later entries at **09:46 and 11:07** then differed because session state had changed.

That state includes active positions, post-stop cooldowns, capital availability and drawdown boundaries. Deleting the rejected trades from a spreadsheet would not re-create the counterfactual session.

This is why the study used an in-process replay variant rather than subtracting historical losses from the trade ledger.

## What the five-minute filter taught us

The completed five-minute alignment requirement did not improve reported after-cost results in the main window. Early losing trades still occurred.

More confirmation is not automatically better. The extra time needed to form a completed candle may leave poor entries unchanged while introducing delay to other opportunities.

The report did **not** recommend promoting this filter.

## Limitations are part of the result

The study documented several reasons not to convert the observed improvement into a production rule:

1. Only **two partial sessions** were usable for cross-session consideration; the main comparison had just **two closed trades per variant**.
2. Paper and replay execution did **not** fully match for October 16.
3. The replay trade setup field was labeled \`UNKNOWN\`, limiting setup-level attribution.
4. Local transaction fees did not fully agree with broker estimates.
5. An October 9 recording lacked the necessary warmup data and was excluded.
6. An October 14 partial-session comparison did not establish a reliable improvement.

Those are not footnotes. They define how much the experiment can teach us.

## The research decision

The source report concluded that \`strategy-v2026.10.15\` should remain unchanged. The one-minute filter should be monitored in **shadow mode** across a larger cohort of complete, replay-valid sessions.

Before promotion, the system would need to show stable, cost-aware net expectancy, acceptable drawdown, limited rejection of profitable opportunities, meaningful setup/regime coverage and no dependence on a threshold selected to fit this single date.

That is the practice we want the TradeStack Journal to reflect: **publish the hypothesis, show the evidence, disclose the uncertainty, and keep testing.**

For the detailed figures, methodology and verification scope, read the [October 16 research case study](/research-case-study.html). For the mechanisms behind replay, see our [developer documentation](/developers.html).

> Evidence of a smaller loss is evidence that one replay path differed. It is not yet evidence that a trading system has an edge.
