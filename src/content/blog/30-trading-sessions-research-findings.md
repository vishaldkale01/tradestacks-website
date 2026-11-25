---
title: "30 Trading Sessions, 75 Losing Trades: What We Learned Building TradeStack"
description: "A 30-session Bank Nifty paper-trading audit covering data integrity, after-cost performance, exit outcomes and the next research phase."
published: 2026-11-25
category: Research
tags: [Case Study, Paper Trading, Risk Management, Data Integrity, Trading Costs]
draft: false
---

A trading engine can execute signals automatically and still fail to establish a durable edge. The question for TradeStack is not whether a handful of trades made money, but whether the complete system produces reliable, reproducible, after-cost results.

This research note examines the latest 30 recorded trading dates with closed paper trades, from **October 1 to November 25, 2026 (IST)**. It is an internal ledger audit, not an independent market-data replay or a live-money performance statement.

## Methodology and sample

A read-only aggregation of the internal trade ledger selected closed paper trades, grouped by entry date in Asia/Kolkata, sorted by date descending and retained the latest 30 dates. Dates without closed paper trades are not included. Four records with non-positive entry prices were excluded from performance calculations, not deleted. One date contained only invalid trades, leaving 29 usable dates. Positive entry prices are a minimum screening condition, not proof of correct fills.

The audit uses stored absolute P&L, estimated transaction charges and net P&L in INR. A win is a trade with positive net P&L; a loss is a trade with negative net P&L. Profit factor is the sum of positive net outcomes divided by the absolute sum of negative net outcomes. No account identifiers, private logs or strategy thresholds are published.

## Results after data-quality screening

| Metric | Result |
| --- | ---: |
| Recorded trading dates | 30 |
| Usable dates | 29 |
| Recorded closed paper trades | 139 |
| Excluded trades | 4 |
| Retained trades | 135 |
| Winning trades | 60 |
| Losing trades | 75 |
| Win rate | 44.44% |
| Aggregate gross P&L | ₹21084.00 |
| Estimated transaction charges | ₹17901.62 |
| Sum of winning net outcomes | ₹76,655.01 |
| Sum of losing net outcomes | −₹73,472.64 |
| Adjusted net P&L | **₹3,182.38** |
| Profit factor | 1.04 |
| Average net outcome per trade | ₹23.57 |

Transaction charges absorbed 84.91% of aggregate gross P&L. The average winning outcome was ₹1,277.58, compared with an average losing outcome of −₹979.64. These are simulated outcomes, not actual earnings.

## A data-integrity failure changed the headline

Four zero-entry-price records created ₹53,391.86 of untrustworthy recorded net profit: one on November 9 (₹22,271.68) and three on November 23 (₹31,120.18). The unfiltered ledger total was ₹56,574.24. Excluding these records leaves ₹3,182.38. Their true results are unknown until original prices can be recovered and checked.

The appropriate fix is to validate prices before paper order creation, reject or quarantine invalid fills, and reconcile historical records against the original market recording. Excluding defective records here is not equivalent to repairing them.

## Daily results and cumulative ledger

All amounts in the following table are INR, after estimated costs. Cumulative P&L starts at zero; it is not an account equity curve. November 9 excludes one invalid trade and November 23 excludes all three. Values are rounded for presentation; aggregate totals use unrounded stored values.

| Date (2026) | Trades | Wins | Losses | Net P&L | Cumulative P&L |
| --- | ---: | ---: | ---: | ---: | ---: |
| Oct 01 | 1 | 1 | 0 | 1369.50 | 1369.50 |
| Oct 06 | 4 | 0 | 4 | -3412.92 | -2043.42 |
| Oct 07 | 4 | 2 | 2 | 220.99 | -1822.43 |
| Oct 08 | 2 | 1 | 1 | 618.96 | -1203.47 |
| Oct 09 | 5 | 2 | 3 | -2202.54 | -3406.01 |
| Oct 13 | 5 | 3 | 2 | 328.29 | -3077.72 |
| Oct 14 | 3 | 2 | 1 | 1719.81 | -1357.91 |
| Oct 16 | 4 | 1 | 3 | -2808.17 | -4166.08 |
| Oct 19 | 4 | 2 | 2 | -1072.32 | -5238.40 |
| Oct 21 | 4 | 2 | 2 | 319.47 | -4918.93 |
| Oct 22 | 4 | 2 | 2 | 237.11 | -4681.82 |
| Oct 23 | 7 | 2 | 5 | -2515.34 | -7197.16 |
| Oct 26 | 10 | 5 | 5 | -1198.00 | -8395.16 |
| Oct 27 | 6 | 2 | 4 | -4475.98 | -12871.14 |
| Oct 28 | 4 | 1 | 3 | -1554.22 | -14425.36 |
| Oct 29 | 7 | 4 | 3 | 1311.31 | -13114.05 |
| Oct 30 | 1 | 1 | 0 | 205.27 | -12908.78 |
| Nov 02 | 2 | 0 | 2 | -1643.37 | -14552.15 |
| Nov 04 | 2 | 0 | 2 | -1829.00 | -16381.15 |
| Nov 05 | 4 | 3 | 1 | 8237.49 | -8143.66 |
| Nov 06 | 7 | 3 | 4 | 59.97 | -8083.69 |
| Nov 09 | 4 | 2 | 2 | 1615.41 | -6468.28 |
| Nov 11 | 3 | 3 | 0 | 4720.78 | -1747.50 |
| Nov 12 | 6 | 0 | 6 | -5192.56 | -6940.06 |
| Nov 17 | 9 | 5 | 4 | 4383.02 | -2557.04 |
| Nov 18 | 7 | 2 | 5 | -2316.05 | -4873.09 |
| Nov 19 | 5 | 2 | 3 | 1027.18 | -3845.91 |
| Nov 20 | 9 | 6 | 3 | 6660.20 | 2814.29 |
| Nov 23 | 0 | 0 | 0 | Excluded | 2814.29 |
| Nov 25 | 2 | 1 | 1 | 368.09 | 3182.38 |

The approximate peak-to-trough decline in the session-end cumulative P&L series is ₹17750.65. This is not intraday drawdown or a percentage of allocated capital; neither was established by this audit.

## Where the losses occurred

| Recorded exit reason | Trades | Wins | Losses | Net P&L |
| --- | ---: | ---: | ---: | ---: |
| STOP_LOSS | 55 | 0 | 55 | −₹69,104.20 |
| BREAK_EVEN | 9 | 2 | 7 | −₹1,282.40 |
| PROFIT_LOCK | 18 | 14 | 4 | ₹4,676.47 |
| TRAILING_STOP_LOSS | 21 | 12 | 9 | ₹5,154.76 |
| TARGET_TRAIL_HIT | 32 | 32 | 0 | ₹63,737.75 |

Stop-loss exits accounted for about 94.1% of the sum of losing net outcomes. This identifies a research priority, not proof that stops are too tight or entries are poor. Exit labels describe realized outcomes and are not predictors known at entry. Removing losing trades retrospectively would create look-ahead bias and ignore changes in session state.

## Is recent performance improving?

| Metric | 30 recorded dates | Latest 7 recorded dates | Latest 3 usable dates |
| --- | ---: | ---: | ---: |
| Usable dates | 29 | 6 | 3 |
| Retained trades | 135 | 38 | 16 |
| Win rate | 44.44% | 42.11% | 56.25% |
| Profit factor | 1.04 | 1.22 | 1.96 |
| Net P&L | ₹3,182.38 | ₹4,929.88 | ₹8,055.47 |

These windows overlap. The final three usable dates are November 19, 20 and 25; November 20 alone contributes roughly 83% of that window's net gain. Recent improvement is descriptive, not statistically independent evidence of a durable edge.

## Engineering findings and open questions

- **Confirmed data defect:** four zero-price entries; historical fills need reconciliation.
- **Confirmed reporting anomaly:** 134 of 135 retained trades have a stored P&L percentage of zero despite nonzero net outcomes. The intended percentage formula and implementation need review.
- **Risk-control discrepancy:** several dates have more than two net losing trades, including six on November 12 and five on November 18. This conflicts with the intended two-loss session policy if it was active and counts net losses. Runtime configuration and event ordering must be checked before attributing a root cause.
- **Profit protection:** break-even exits were net negative in aggregate; profit-lock exits included four losses. Index-based triggers, option-price execution and costs require separate investigation.
- **Capital allocation:** position notional and applicable capital limits need to be reconciled with the configuration active at entry.

## The next research phase

The decision is to continue engineering research in paper mode, not to deploy real capital on the basis of these results.

First, correct and test price validation, P&L calculations and risk controls. Then join the 75 losing trades and the winning comparison cohort to their entry signals, market regime, completed candle features and recorded ticks. Measure maximum favorable and adverse excursion using data available in the appropriate time window.

Replay candidate changes against a frozen baseline with identical fee and fill assumptions, including realistic slippage sensitivity. Preserve a chronological holdout; avoid selecting filters after inspecting the holdout. Once the candidate is frozen, collect another 30 paper sessions and assess after-cost expectancy, drawdown, execution integrity and risk compliance. A profit factor of 1.5 is a proposed research hurdle, not a guarantee or a sufficient condition for deployment.

## Limitations

This is a small, non-random sample of recorded paper trades across selected dates. The audit did not independently verify every remaining price, fee estimate, strategy version, runtime configuration, signal, or tick recording. It does not include no-trade dates, open positions or live execution outcomes. Trade-level observations are not independent, and transaction-cost estimates may differ from actual broker charges. No causal claim about entry filters or stop settings is established.

See [our earlier controlled replay research](/blog/what-a-smaller-replay-loss-really-means/) for why improved historical outcomes alone do not establish an edge.

TradeStack is an engineering and research project. This article is not an investment recommendation, a return forecast or evidence of guaranteed profitability.
