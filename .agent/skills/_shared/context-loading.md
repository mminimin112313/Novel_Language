# Context Loading

- First load minimal context: current episode pack + latest compile diagnostics.
- Expand context only when blocked (AQL queries, previous attempts, lint report).
- Prefer deterministic artifacts (`logs/plot-validation/*`) over free-form summaries.
