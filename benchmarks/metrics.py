"""
Loseless Evaluation Metrics Engine
Computes statistical efficiency, token density, parsimony ratio, and safety compliance.
"""

from typing import List, Dict, Any
import statistics

def calculate_token_savings(baseline: int, observed: int) -> float:
    """Calculates percentage token reduction relative to baseline."""
    if baseline <= 0:
        return 0.0
    return round(((baseline - observed) / baseline) * 100, 2)

def calculate_parsimony_score(baseline_lines: int, observed_lines: int) -> float:
    """Calculates diff reduction efficiency score (higher is more parsimonious)."""
    if baseline_lines <= 0:
        return 100.0 if observed_lines == 0 else 0.0
    reduction = max(0, baseline_lines - observed_lines)
    return round((reduction / baseline_lines) * 100, 2)

def aggregate_evaluations(tasks: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Computes aggregate statistical scorecards across all benchmark tasks."""
    total_baseline_tokens = sum(t["baseline_prompt_tokens"] + t["baseline_completion_tokens"] for t in tasks)
    total_loseless_tokens = sum(t["loseless_prompt_tokens"] + t["loseless_completion_tokens"] for t in tasks)
    
    baseline_completion_tokens = sum(t["baseline_completion_tokens"] for t in tasks)
    loseless_completion_tokens = sum(t["loseless_completion_tokens"] for t in tasks)

    baseline_diff_lines = sum(t["baseline_diff_lines"] for t in tasks)
    loseless_diff_lines = sum(t["loseless_diff_lines"] for t in tasks)

    safety_violations_baseline = sum(1 for t in tasks if t["safety_violated_baseline"])
    safety_violations_loseless = sum(1 for t in tasks if t["safety_violated_loseless"])

    savings_per_task = [
        calculate_token_savings(
            t["baseline_prompt_tokens"] + t["baseline_completion_tokens"],
            t["loseless_prompt_tokens"] + t["loseless_completion_tokens"]
        )
        for t in tasks
    ]

    return {
        "task_count": len(tasks),
        "total_token_savings_pct": calculate_token_savings(total_baseline_tokens, total_loseless_tokens),
        "completion_token_savings_pct": calculate_token_savings(baseline_completion_tokens, loseless_completion_tokens),
        "diff_line_reduction_pct": calculate_parsimony_score(baseline_diff_lines, loseless_diff_lines),
        "mean_savings_per_task": round(statistics.mean(savings_per_task), 2),
        "median_savings_per_task": round(statistics.median(savings_per_task), 2),
        "safety_violation_rate_baseline": f"{(safety_violations_baseline / len(tasks)) * 100:.1f}%",
        "safety_violation_rate_loseless": f"{(safety_violations_loseless / len(tasks)) * 100:.1f}%",
        "total_baseline_tokens": total_baseline_tokens,
        "total_loseless_tokens": total_loseless_tokens,
        "total_baseline_lines": baseline_diff_lines,
        "total_loseless_lines": loseless_diff_lines
    }
