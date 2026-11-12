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
├── commands\
│   ├── loseless.toml         # Antigravity slash command /loseless
│   ├── loseless-debt.toml    # Antigravity slash command /loseless-debt
│   ├── loseless-blast.toml   # Antigravity slash command /loseless-blast
│   ├── loseless-critique.toml # Antigravity slash command /loseless-critique
│   └── loseless-arise.toml   # Antigravity slash command /loseless-arise
├── hooks\
│   ├── loseless-activate.js      # SessionStart activation hook
│   ├── loseless-pretool.js       # PreToolUse physical write blocker (stdin/argv)
│   ├── loseless-mode-tracker.js  # UserPromptSubmit sentiment & auto-relock tracker
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
│   ├── manifests.test.js     # Test suite integritas manifest, hooks & skills
│   ├── hooks.test.js         # Test suite penegakan fisik runtime hooks & auto-relock
│   └── blast-radius.test.js  # Test suite pelacak radius ledakan lookaround
├── skills\
│   ├── loseless\SKILL.md     # Command /loseless [cold|warm|status]
│   ├── loseless-debt\SKILL.md # Harvester tag "// loseless:"
│   ├── loseless-critique\SKILL.md # One-shot Devil's Advocate review
│   ├── loseless-arise\SKILL.md # Two-phase execution gatekeeper
│   └── loseless-blast\SKILL.md # AST reference aggregator skill
└── assets\
    └── logo.svg              # Logo visual minimalis
```

---

## 📦 PILAR 2: STACK & PLUGIN ECOSYSTEM

- **Plugin Type**: Antigravity Cross-Agent Bundle (`plugin.json` + `gemini-extension.json` + `hooks/`).
- **Physical Enforcement**: Native Node.js Hooks (`PreToolUse`, `SessionStart`, `UserPromptSubmit`) dengan dukungan streaming JSON via `stdin` dan CLI arguments.
- **Context Anchor**: `rules/AGENTS.md` (di-load otomatis oleh agent sebagai prompt sistem ringkas, < 75 baris).
- **Sentiment Radar**: Zero-Token Local Pattern Bank di `hooks/sentiment-patterns.json`.
- **Lifecycle Policy**: Turn-Scoped Auto-Relock (mengunci kembali ke Fase 1 saat tugas baru dimulai untuk mencegah *stale unlock leaks*).
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
  - **Problem**: Ditemukan 6 kelemahan: friksi gerbang sepele, ilusi penegakan prompt-only, tabrakan sinyal router semantik, regex scanner rapuh pada multiline JSDoc, kelelahan peringatan, dan token bloat monorepo.
  - **Solution / State**: Mengimplementasikan Adaptive Gatekeeper, Physical Node.js Hooks Suite, Cascading Semantic Router, Resilient Multi-Syntax Debt Lexer, Tiered Risk Matrix, dan Blast-Radius CLI Offloader.
- [x] Pembersihan Bug Tipis & Refinement (Engine v1.1.1):
  - **Problem**: Terdeteksi 6 bug tipis: kegagalan membaca data stream `stdin` di Claude Code/Cursor, kegagalan regex word boundary pada simbol khusus (`$state`, `@Directive`), kebocoran status unlock yang tak pernah relock otomatis (*stale unlock leak*), ketiadaan skill `/loseless-blast`, serta fast-track yang berpotensi menyentuh file config sistem.
  - **Solution / State**: 
    1. *Stdin JSON Stream Parser*: Menambahkan pembaca `stdin` resilient non-blocking yang otomatis mem-parsing JSON payload hook di host CLI.
    2. *Universal Lookaround Regex*: Mengganti `\b...\b` dengan `(?<![a-zA-Z0-9_])${escaped}(?![a-zA-Z0-9_])` di `scripts/blast-radius.js` sehingga simbol `$state` dan `@Directive` terdeteksi 100% akurat.
    3. *Auto-Relock Turn Policy*: Menerapkan relock otomatis ke Fase 1 saat tugas baru tiba, mencegah kebocoran status unlock ke tugas berikutnya.
    4. *Skill loseless-blast*: Menambahkan `skills/loseless-blast/SKILL.md` dan menyinkronkan seluruh dokumentasi skill.
    5. *Benchmark Telemetry Expansion*: Menambahkan benchmark throughput `blast-radius` ke `scripts/benchmark.js`.
    6. *Critical Config Isolation*: Memastikan file konfigurasi sensitif (`package.json`, `.env`, dll.) dikecualikan dari fast-track micro-diffs.
- [x] Slash Commands UI Registry & Proactive Onboarding Directive (Engine v1.1.2):
  - **Problem**: UI Antigravity menampilkan `No matching results` saat user mengetik `/loseless` karena ketiadaan berkas `.toml` di `commands/`, serta agen pasif tidak proaktif bertanya setup Arise Protocol pada repositori baru tanpa dipancing user.
  - **Solution / State**:
    1. *Antigravity Slash Commands*: Menambahkan 5 berkas `.toml` di `commands/` (`loseless.toml`, `loseless-debt.toml`, `loseless-blast.toml`, `loseless-critique.toml`, `loseless-arise.toml`) dan mengaktifkan `"loseless": { "enabled": true }` di `config.json`.
    2. *Proactive Onboarding Directive*: `hooks/loseless-activate.js` kini otomatis menyuntikkan arahan darurat `PROACTIVE_ONBOARDING_REQUIRED` saat repositori belum memiliki `loseless.config.json`.
    3. *Zero-Turn Axiom*: Aturan `rules/AGENTS.md` mewajibkan agen menyapa dan mengonfirmasi preferensi Arise pengguna pada giliran pertama sebelum memproses instruksi teknis.
    4. *Calibration*: Menyimpan preferensi Chandra ke `loseless.config.json` (`ariseMode: "strict"`, `gateKeyword: "Arise"`).
- [x] Antigravity Native Discovery & Lifecycle Hooks Resolution (Engine v1.1.3):
  - **Problem**: UI chat Antigravity tetap menampilkan `No matching results` dan onboarding tidak terpanggil otomatis karena Windows NTFS Junction (`mklink /J`) diabaikan oleh directory walker Go bawaan Language Server (`Lstat()` skipping reparse points), serta ketiadaan `hooks.json` native di root repositori.
  - **Solution / State**:
    1. *Resmi Declaration (`plugins.json`)*: Menghapus junction Windows dan mendaftarkan path repositori secara legal via `~/.gemini/config/plugins.json` (`entries: [{"path": "c:/My Project/Loseless"}]`), diverifikasi langsung via gRPC `GetAllPlugins` (status: Loaded, 5 skills aktif).
    2. *Root Native `hooks.json`*: Menyediakan `hooks.json` resmi di root repositori yang memetakan event `SessionStart`, `PreInvocation`, dan `PreToolUse` ke scripts Node.js di `hooks/`.
    3. *Antigravity Stdout Contract*: Memperbarui `hooks/loseless-activate.js`, `hooks/loseless-mode-tracker.js`, dan `hooks/loseless-pretool.js` agar mendukung payload JSON standard Antigravity (`injectSteps`, `lastUserInput`, dan `{ decision: 'deny'/'allow' }`) secara mulus berdampingan dengan mode TTY.
- [x] The Parsimony Ladder & Civilized Conciseness (Engine v1.2.0):
  - **Problem**: Tabrakan arsitektur antara konsep Ponytail (minimalisasi kode namun sering malas membaca konteks dan berlagak sinis) dan Caveman (minimalisasi kata namun berbicara seperti manusia purba tanpa argumen arsitektural).
  - **Solution / State**:
    1. *The Parsimony Ladder (Code Domain)*: Menerapkan 5 anak tangga efisiensi kode di `rules/AGENTS.md` (Omission/YAGNI ➔ In-house reuse ➔ Platform native/stdlib ➔ Existing dependencies ➔ Surgical working diff).
    2. *Civilized Conciseness (Response Domain)*: Menegakkan komunikasi Action-First di baris 1-3, melarang basa-basi AI slop ("Certainly!"), namun tetap mempertahankan penjelasan teknis presisi berbasis primitif komputasi (bukan bahasa gua).
    3. *Clean Domain Separation*: Memisahkan logika kode, gaya komunikasi, gerbang fisik eksekusi (Arise), dan penghemat token (Blast-Radius) ke dalam satu kesatuan engine mandiri (*All-in-One Powerhouse*) berlisensi MIT.
