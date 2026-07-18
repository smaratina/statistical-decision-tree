# Statistical Decision Tree — MVP specification

## Product promise

An evidence-aware statistical advisor that converts a research question and structured study description into a justified, auditable analysis plan.

## Competition scope

The MVP demonstrates one complete path: research question → adaptive interview → planned-analysis audit → primary/alternative recommendation → assumptions → SPSS, Jamovi, and R instructions.

## Design principles

1. A deterministic TypeScript rules engine owns the statistical recommendation.
2. GPT-5.6 classifies natural-language questions and explains an engine result; it does not invent the final method.
3. Every recommendation exposes its reasons, conditions, and alternatives.
4. Unknown information stays visible as an unresolved check—never as false certainty.
5. The MVP does not collect participant-level data.

## Supported MVP families

- Group differences: independent/paired t-test, Mann–Whitney, Wilcoxon, ANOVA, Welch ANOVA, Kruskal–Wallis, ANCOVA.
- Association: Pearson, Spearman, chi-square/Fisher.
- Prediction: linear, logistic, and count regression.
- Conditional processes: bootstrap mediation (PROCESS 4) and moderation (PROCESS 1).

## Planned API boundary

`POST /api/interpret-question` sends a research question to GPT-5.6 and returns a strict structured classification. The frontend must then ask the user to confirm that classification before it reaches the deterministic engine.

## Safety language

The product provides educational decision support and does not replace disciplinary judgment or consultation with a qualified statistician.
