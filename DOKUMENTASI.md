# 🌸 SUB-KITAB OPERASIONAL (SSOT): LOSELESS

> *"Zero Context Drift, Anti-Sycophancy, and Ruthless Root-Cause Engineering."*

---

## 🛠️ PILAR 1: HOW-TO SETUP & DEVELOPMENT WORKFLOW

### 1.1. Prasyarat & Lingkungan
- **Node.js**: $\ge 18.0.0$ (opsional untuk menjalankan skrip pengujian integritas JSON & asserts).
- **Git**: Branch utama `main`.
- **Target Platform**: Antigravity IDE, Gemini CLI, Gemini Code Assist, dan coding agent modern.

### 1.2. Perintah Operasional
```bash
# Pengujian integritas assert mandiri (zero-dependency)
npm test

# Verifikasi struktur plugin manifest
node -e "JSON.parse(require('fs').readFileSync('plugin.json')); JSON.parse(require('fs').readFileSync('gemini-extension.json')); console.log('Manifest syntax valid.');"

# Sinkronisasi ke remote repository
git status
git push origin main
```

### 1.3. Struktur Direktori Repositori
```text
c:\My Project\Loseless\
├── .gitignore
├── package.json
├── plugin.json               # Manifest resmi Antigravity
├── gemini-extension.json     # Manifest integrasi resmi Gemini
├── README.md                 # Dokumentasi publik open-source
├── DOKUMENTASI.md            # Sub-Kitab SSOT Proyek (ADR-Lite)
├── rules\
│   └── AGENTS.md             # Always-on context rules (< 50 baris)
├── skills\
│   ├── loseless\SKILL.md     # Command /loseless [cold|warm|strict]
│   ├── loseless-debt\SKILL.md # Harvester tag "// lossless:"
│   ├── loseless-critique\SKILL.md # One-shot Devil's Advocate review
│   └── loseless-arise\SKILL.md # Two-phase execution gatekeeper
└── assets\
    └── logo.svg              # Logo visual minimalis
```

---

## 📦 PILAR 2: STACK & PLUGIN ECOSYSTEM

- **Plugin Type**: Antigravity Cross-Agent Bundle (`plugin.json` + `gemini-extension.json`).
- **Context Anchor**: `rules/AGENTS.md` (di-load otomatis oleh agent sebagai prompt sistem ringkas).
- **Skills Protocol**: Markdown with YAML Frontmatter (`SKILL.md`).
- **Zero Heavy Dependencies**: Pure standard library & platform-native runtime. Zero 3rd-party bloat.

---

## 📍 PILAR 3: STATE TRACKER (ADR-LITE)

- [x] Inisiasi Fondasi Loseless Plugin:
  - **Problem**: AI coding assistants sering menderita *eager vandalism* (merusak kode sebelum paham konteks utuh), *sycophancy* (menjadi Yes-Man bagi ide buruk), dan *context drift* di percakapan panjang.
  - **Solution / State**: Menginisialisasi repositori resmi `Loseless` di `https://github.com/channdraa-afk/Loseless.git` dengan struktur plugin resmi Antigravity & Gemini.
- [x] Manifest & Rules Engine v1:
  - **Problem**: Agen membutuhkan panduan prompt selalu-aktif (*always-on context*) dan manifest yang dikenali oleh Antigravity dan Gemini CLI.
  - **Solution / State**: Mengimplementasikan `plugin.json`, `gemini-extension.json`, dan `rules/AGENTS.md` (48 baris padat mencakup Arise, Devil's Advocate, Root-Cause, Runnable Assert, Debt Tagging, dan Fluff Purge).
- [x] Implementasi Bundel Skills:
  - **Problem**: Pengguna membutuhkan komando eksplisit untuk switching suhu kognitif, pemindaian utang teknis otomatis, review devil's advocate, dan penegakan gerbang protokol Arise.
  - **Solution / State**: Mengimplementasikan 4 spesifikasi skill berstandar Antigravity: `skills/loseless/`, `skills/loseless-debt/`, `skills/loseless-critique/`, dan `skills/loseless-arise/`.
- [x] Dokumentasi Publik & Visual Identity:
  - **Problem**: Repositori open-source membutuhkan representasi README publik berstandar tinggi, lisensi MIT resmi, logo vektor SVG mandiri, dan bebas kebocoran path lokal.
  - **Solution / State**: Mengimplementasikan `README.md`, `LICENSE` (MIT), dan `assets/logo.svg`.
- [x] Debt Scanner CLI, Semantic Entropy Router & Anti-Slop Engine:
  - **Problem**: Kebutuhan scanner utang teknis otomatis tanpa dependensi luar, router suhu kognitif dinamis (Cold vs Warm auto-sensing), dan pemusnah bahasa klise (AI slop).
  - **Solution / State**: Mengimplementasikan `scripts/debt-scanner.js` (`npm run debt`), memperbarui `rules/AGENTS.md` dengan 3 Hukum Rekayasa Bahasa (Hukum Metrik, Primitif, Realita) serta router semantik otomatis.
