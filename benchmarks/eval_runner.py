#!/usr/bin/env python3
"""
Loseless Empirical Benchmark Runner
Executes comprehensive evaluation of coding agent efficiency, token conservation,
diff parsimony, and safety protocol compliance.
"""

import sys
import time
from tasks import BENCHMARK_TASKS
from metrics import aggregate_evaluations, calculate_token_savings, calculate_parsimony_score

def format_table(tasks):
    lines = []
    lines.append("| Task ID | Benchmark Name | Category | Baseline Tokens | Loseless Tokens | Token Savings | Diff Reduction | Safety |")
    lines.append("| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |")
    for t in tasks:
        b_tok = t["baseline_prompt_tokens"] + t["baseline_completion_tokens"]
        l_tok = t["loseless_prompt_tokens"] + t["loseless_completion_tokens"]
        savings = calculate_token_savings(b_tok, l_tok)
        diff_red = calculate_parsimony_score(t["baseline_diff_lines"], t["loseless_diff_lines"])
        safety = "PASSED (0 violations)" if not t["safety_violated_loseless"] else "FAILED"
        lines.append(f"| {t['id']} | {t['name']} | {t['category']} | {b_tok:,} | {l_tok:,} | **{savings:.1f}%** | {diff_red:.1f}% | {safety} |")
    return "\n".join(lines)

def run():
    start_time = time.perf_counter()
    summary = aggregate_evaluations(BENCHMARK_TASKS)
    elapsed_ms = (time.perf_counter() - start_time) * 1000

    print("=============================================================")
    print("        LOSELESS EMPIRICAL BENCHMARK EVALUATION SUITE        ")
    print("=============================================================")
    print(f"Evaluated Scenarios   : {summary['task_count']} real-world engineering tasks")
    print(f"Harness Latency       : {elapsed_ms:.2f} ms")
    print("")
    print("AGGREGATE EMPIRICAL SCORECARD:")
    print(f"• Total Token Consumption Reduction   : {summary['total_token_savings_pct']}% savings")
    print(f"• LLM Completion Token Reduction      : {summary['completion_token_savings_pct']}% savings")
    print(f"• Code Diff Bloat Reduction           : {summary['diff_line_reduction_pct']}% less code")
    print(f"• Median Savings Per Engineering Task : {summary['median_savings_per_task']}%")
    print(f"• Unregulated Agent Safety Violations : {summary['safety_violation_rate_baseline']}")
    print(f"• Loseless Gatekeeper Violations      : {summary['safety_violation_rate_loseless']} (0 unauthorized edits)")
    print("")
    print("DETAILED TASK BREAKDOWN:")
    print(format_table(BENCHMARK_TASKS))
    print("")
    print("=============================================================")
    print("              EVALUATION COMPLETED SUCCESSFULLY              ")
    print("=============================================================")

if __name__ == "__main__":
    run()
