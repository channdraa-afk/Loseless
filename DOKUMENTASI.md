# 🌸 SUB-KITAB OPERASIONAL (SSOT): LOSELESS

> *"Zero Context Drift, Anti-Sycophancy, and Ruthless Root-Cause Engineering."*

---

## 🛠️ PILAR 1: HOW-TO SETUP & DEVELOPMENT WORKFLOW

### 1.1. Prasyarat & Lingkungan
- **Node.js**: $\ge 18.0.0$.
- **Git**: Branch utama `main`.
- **Target Platform**: Antigravity IDE, Claude Code, Cursor, Codex CLI, Windsurf, Cline, dan Gemini Extension.

### 1.2. Perintah Operasional
```bash
# Pengujian integritas komprehensif (Scanner, Manifest, Hooks, Blast-Radius)
npm test

# Pemindaian utang teknis multi-sintaks (JSDoc, inline, block comments)
npm run debt

# Pemindaian radius ledakan simbol (hemat token monorepo)
npm run blast-radius -- <symbol>

# Benchmark latensi dan footprint token
npm run benchmark

# Sinkronisasi ke remote repository
git status
git push origin main
```

### 1.3. Struktur Direktori Repositori
```text
c:\My Project\Loseless\
├── .gitignore
├── package.json
├── plugin.json               # Manifest resmi Antigravity & Claude Code Hooks
├── gemini-extension.json     # Manifest integrasi resmi Gemini
├── loseless.config.json      # Konfigurasi runtime (ariseMode, gateKeyword)
├── README.md                 # Dokumentasi publik open-source
├── DOKUMENTASI.md            # Sub-Kitab SSOT Proyek (ADR-Lite)
├── hooks\
│   ├── loseless-activate.js      # SessionStart activation hook
│   ├── loseless-pretool.js       # PreToolUse physical write blocker
│   ├── loseless-mode-tracker.js  # UserPromptSubmit sentiment & gate tracker
│   ├── sentiment-patterns.json   # Kamus lokal ekspresi friksi/marah (0 token)
│   ├── claude-codex-hooks.json   # Manifest hook Claude Code & Codex
│   └── cursor-hooks.json         # Manifest hook Cursor IDE
├── rules\
│   └── AGENTS.md             # Always-on context rules (< 75 baris)
├── scripts\
│   ├── debt-scanner.js       # CLI scanner utang teknis
│   ├── blast-radius.js       # CLI offloader kalkulasi radius ledakan
│   └── benchmark.js          # Benchmark throughput dan token
├── tests\
│   ├── scanner.test.js       # Test suite scanner multi-sintaks
│   ├── manifests.test.js     # Test suite integritas manifest & adapters
│   ├── hooks.test.js         # Test suite penegakan fisik runtime hooks
│   └── blast-radius.test.js  # Test suite pelacak radius ledakan
├── skills\
│   ├── loseless\SKILL.md     # Command /loseless [cold|warm|strict]
│   ├── loseless-debt\SKILL.md # Harvester tag "// loseless:"
│   ├── loseless-critique\SKILL.md # One-shot Devil's Advocate review
│   └── loseless-arise\SKILL.md # Two-phase execution gatekeeper
└── assets\
    └── logo.svg              # Logo visual minimalis
```

---

## 📦 PILAR 2: STACK & PLUGIN ECOSYSTEM

- **Plugin Type**: Antigravity Cross-Agent Bundle (`plugin.json` + `gemini-extension.json` + `hooks/`).
- **Physical Enforcement**: Native Node.js Hooks (`PreToolUse`, `SessionStart`, `UserPromptSubmit`) setara level Ponytail.
- **Context Anchor**: `rules/AGENTS.md` (di-load otomatis oleh agent sebagai prompt sistem ringkas, < 75 baris).
- **Sentiment Radar**: Zero-Token Local Pattern Bank di `hooks/sentiment-patterns.json`.
- **Dependency Strategy**: Resilient architecture via `picocolors` dengan zero-crash graceful fallback ke standard library.

---

## 📍 PILAR 3: STATE TRACKER (ADR-LITE)

- [x] Inisiasi Fondasi Loseless Plugin:
  - **Problem**: AI coding assistants sering menderita *eager vandalism*, *sycophancy*, dan *context drift*.
  - **Solution / State**: Menginisialisasi repositori resmi `Loseless` di `https://github.com/channdraa-afk/Loseless.git`.
- [x] Manifest & Rules Engine v1:
  - **Problem**: Agen membutuhkan panduan prompt selalu-aktif dan manifest resmi.
  - **Solution / State**: Mengimplementasikan `plugin.json`, `gemini-extension.json`, dan `rules/AGENTS.md`.
- [x] Implementasi Bundel Skills:
  - **Problem**: Pengguna membutuhkan komando eksplisit untuk switching suhu kognitif, pemindaian utang teknis, review kritik, dan gerbang Arise.
  - **Solution / State**: Mengimplementasikan 4 spesifikasi skill berstandar Antigravity: `skills/loseless/`, `skills/loseless-debt/`, `skills/loseless-critique/`, dan `skills/loseless-arise/`.
- [x] Dokumentasi Publik & Visual Identity:
  - **Problem**: Repositori open-source membutuhkan representasi README publik berstandar tinggi, lisensi MIT, dan logo SVG mandiri.
  - **Solution / State**: Mengimplementasikan `README.md`, `LICENSE` (MIT), dan `assets/logo.svg`.
- [x] Debt Scanner CLI, Semantic Entropy Router & Anti-Slop Engine:
  - **Problem**: Kebutuhan scanner utang teknis otomatis, router suhu kognitif dinamis, dan pemusnah bahasa klise (AI slop).
  - **Solution / State**: Mengimplementasikan `scripts/debt-scanner.js` (`npm run debt`), memperbarui `rules/AGENTS.md` dengan 3 Hukum Rekayasa Bahasa (Hukum Metrik, Primitif, Realita) serta router semantik otomatis.
- [x] Multi-Platform Ecosystem & Empirical Benchmark:
  - **Problem**: Repositori belum mendukung platform di luar Gemini/Antigravity (Cursor, Claude Code, Windsurf, Cline) serta belum memiliki pengujian unit dan data benchmark empiris terukur.
  - **Solution / State**: Mengimplementasikan `.cursorrules`, `CLAUDE.md`, `.windsurfrules`, `.clinerules`, root `AGENTS.md`, test suite `tests/`, dan benchmark suite `scripts/benchmark.js`.
- [x] Blast-Radius Protocol & Anti-Gaslighting Engine:
  - **Problem**: AI sering menciptakan regresi berantai dan melakukan gaslighting dengan klaim manis palsu.
  - **Solution / State**: Mengintegrasikan protokol pelacak radius ledakan, kewajiban Atomic Refactoring, pelarangan mutlak klaim kepastian palsu, serta kewajiban mencantumkan daftar Residual Risks.
- [x] Configurable Arise Keyword & Gatekeeper Card Injection:
  - **Problem**: Kebutuhan kustomisasi kata kunci otorisasi per-tim serta kewajiban menyisipkan kartu penjaga gerbang otomatis ber-branding Loseless.
  - **Solution / State**: Mengimplementasikan `loseless.config.json` dan klausul kartu gerbang otomatis di `rules/AGENTS.md`.
- [x] Penyempurnaan 6 Kelemahan Struktural (Engine v1.1.0):
  - **Problem**: Ditemukan 6 flaws: friksi gerbang sepele, ilusi penegakan prompt-only, tabrakan sinyal router semantik, regex scanner rapuh pada multiline JSDoc, kelelahan peringatan (warning fatigue), dan token bloat pada monorepo besar.
  - **Solution / State**: 
    1. *Adaptive Friction Radar*: Kamus lokal `hooks/sentiment-patterns.json` mencegat friksi pengguna di runtime Node.js (<1ms, 0 token overhead LLM) dan menawarkan bypass sementara secara ergonomis.
    2. *Physical Hooks Suite*: Menghadirkan skrip runtime fisik `hooks/loseless-pretool.js` (PreToolUse write blocker), `loseless-activate.js`, dan `loseless-mode-tracker.js` yang setara level Ponytail.
    3. *Hierarchical State Cascade*: Menetapkan prioritas deterministik: Cold Bug Triage $\rightarrow$ Warm Ideation $\rightarrow$ Strict Minimal Diff.
    4. *Resilient Multi-Syntax Lexer*: Mendukung JSDoc `@loseless`, block comment `/* */`, case-insensitivity, dan panah fleksibel (`->`, `=>`, `-->`, `➔`).
    5. *Tiered Risk Matrix*: Matriks 3 tingkat (Tier 0 hening pada diff sepele, Tier 1 lokal, Tier 2 wajib SPOF/Rollback) mengeliminasi alert fatigue.
    6. *Blast-Radius CLI Offloader*: Script `scripts/blast-radius.js` meringkas 100+ baris pemanggil menjadi 3 baris agregat di chat (*95% token savings*) dengan gaya komunikasi anggun dan padat sinyal rekayasa.
