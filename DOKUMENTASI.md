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
