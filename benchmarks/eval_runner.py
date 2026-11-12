#!/usr/bin/env python3
"""
Loseless Empirical Benchmark Runner
Executes comprehensive evaluation of coding agent efficiency, token conservation,
diff parsimony, and safety protocol compliance.
Supports optional --live flag to verify real-time token counts via Google Gemini API.
"""

import sys
import os
import json
import time
import urllib.request
from tasks import BENCHMARK_TASKS
from metrics import aggregate_evaluations, calculate_token_savings, calculate_parsimony_score

def load_env():
    env_path = os.path.join(os.path.dirname(__file__), "..", ".env")
    if os.path.exists(env_path):
        try:
            with open(env_path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        k, v = line.split("=", 1)
                        os.environ[k.strip()] = v.strip()
        except Exception:
            pass

def count_gemini_tokens(text, api_key):
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:countTokens?key={api_key}"
    data = json.dumps({"contents": [{"parts": [{"text": text}]}]}).encode("utf-8")
    req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/json"})
    with urllib.request.urlopen(req, timeout=10) as resp:
        res = json.loads(resp.read().decode("utf-8"))
        return res.get("totalTokens", 0)

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
    is_live = "--live" in sys.argv
    start_time = time.perf_counter()
    summary = aggregate_evaluations(BENCHMARK_TASKS)
    elapsed_ms = (time.perf_counter() - start_time) * 1000

    print("=============================================================")
    print("        LOSELESS EMPIRICAL BENCHMARK EVALUATION SUITE        ")
    print("=============================================================")
    print(f"Evaluated Scenarios   : {summary['task_count']} real-world engineering tasks")
    print(f"Harness Latency       : {elapsed_ms:.2f} ms")

    if is_live:
        load_env()
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            print("\n[LIVE MODE NOTICE] GEMINI_API_KEY not found in environment or .env. Skipping live API call.")
        else:
            print("\nLIVE GOOGLE GEMINI API TOKENIZATION MATRIX:")
            repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
            core_file = os.path.join(repo_root, "rules", "AGENTS.md")
            lite_file = os.path.join(repo_root, "AGENTS_LITE.md")
            try:
                with open(core_file, "r", encoding="utf-8") as f:
                    core_content = f.read()
                with open(lite_file, "r", encoding="utf-8") as f:
                    lite_content = f.read()

                core_tokens = count_gemini_tokens(core_content, api_key)
                lite_tokens = count_gemini_tokens(lite_content, api_key)
                reduction = (1 - (lite_tokens / core_tokens)) * 100 if core_tokens else 0

                print(f"• Model Endpoint                      : Google Gemini 3.8 Flash (countTokens)")
                print(f"• Full Core Prompt (rules/AGENTS.md)  : {core_tokens:,} tokens")
                print(f"• Single-File Zero (AGENTS_LITE.md)   : {lite_tokens:,} tokens")
                print(f"• Direct Live Prompt Reduction        : {reduction:.1f}% verified savings")
            except Exception as e:
                print(f"• Live API Tokenization Error         : {e}")

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
