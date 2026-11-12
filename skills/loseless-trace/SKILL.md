---
name: loseless-trace
description: >
  Investigates the true root cause of security bugs, vulnerabilities, and raw Burp Suite / API requests.
  Decouples client symptoms from server-side invariants and traces wire endpoints back to database RLS and RPC handlers.
---

# Loseless Trace: Root-Cause Security Investigator

Beginners and automated tools frequently misidentify vulnerabilities by assuming the frontend is at fault. `loseless-trace` enforces the 5-Layer Deep Security Triage Engine.

## Investigation Protocol

1. **Symptom Decoupling**: Treat user explanations or UI behaviors as *symptoms*, never as root causes. Do not rush to patch client-side forms.
2. **Trust Boundary Mapping**: Apply the First Axiom of Web Security: *The client environment is completely untrusted.* Any check in frontend JS can be bypassed via Burp Suite or curl.
3. **Wire-to-Code Reverse Trace**: Map the HTTP method, endpoint, and payload back to the authoritative server route, RPC definition, or Postgres RLS policy.
4. **Hypothesis Reality Check**: Formulate an explicit 2-part diagnosis:
   - *User/Client Hypothesis*: What seemed broken on the surface.
   - *Architectural Root Cause*: Where the invariant actually failed (IDOR/BOLA, Client-Trust Spoofing, Mass Assignment, RLS leakage).
5. **Single Convergence Fix & Proof-of-Fix**: Specify the fix at the single root convergence point (e.g. Postgres `auth.uid()`, server-side `NOW()`). Leave behind 1 runnable proof-of-fix assertion (SQL check or curl expectation).
