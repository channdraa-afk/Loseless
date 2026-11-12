#!/usr/bin/env sh

# Universal 1-Click Installer for Loseless on Linux and macOS.
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/channdraa-afk/Loseless/main/install.sh | bash

set -e

printf "\033[36m=============================================================\033[0m\n"
printf "\033[36m             LOSELESS UNIVERSAL INSTALLER (UNIX)             \033[0m\n"
printf "\033[36m=============================================================\033[0m\n"

INSTALL_DIR="$HOME/.loseless/bin"
CORE_DIR="$HOME/.loseless/core"

printf "-> Target Installation Directory : %s\n" "$INSTALL_DIR"
mkdir -p "$INSTALL_DIR"
mkdir -p "$CORE_DIR"

printf "-> Synchronizing Loseless Core...\n"
if [ -d "./bin" ] && [ -f "./bin/loseless.js" ]; then
  printf "   Installing from local workspace...\n"
  cp -R ./* "$CORE_DIR/"
else
  if command -v git >/dev/null 2>&1; then
    printf "   Cloning from GitHub repository via git...\n"
    if [ -d "$CORE_DIR/.git" ]; then
      git -C "$CORE_DIR" pull --quiet
    else
      git clone --depth 1 --quiet https://github.com/channdraa-afk/Loseless.git "$CORE_DIR"
    fi
  else
    printf "   Downloading release archive via curl/tar...\n"
    curl -fsSL https://github.com/channdraa-afk/Loseless/archive/refs/heads/main.tar.gz | tar -xz -C "$CORE_DIR" --strip-components=1
  fi
fi

# 1. Create executable wrapper script
WRAPPER="$INSTALL_DIR/loseless"
cat << 'EOF' > "$WRAPPER"
#!/usr/bin/env sh
exec node "$HOME/.loseless/core/bin/loseless.js" "$@"
EOF

chmod +x "$WRAPPER"
printf "\033[32m   [OK] Created launcher shim : %s\033[0m\n" "$WRAPPER"

# 2. Idempotent PATH Configuration
SHELL_CONFIG=""
case "$SHELL" in
  */zsh)
    SHELL_CONFIG="$HOME/.zshrc"
    ;;
  */bash)
    if [ -f "$HOME/.bash_profile" ]; then
      SHELL_CONFIG="$HOME/.bash_profile"
    else
      SHELL_CONFIG="$HOME/.bashrc"
    fi
    ;;
  *)
    SHELL_CONFIG="$HOME/.profile"
    ;;
esac

PATH_STR='export PATH="$HOME/.loseless/bin:$PATH"'

if [ -n "$SHELL_CONFIG" ]; then
  if grep -qs "$INSTALL_DIR" "$SHELL_CONFIG" 2>/dev/null; then
    printf "   [OK] PATH already configured in %s\n" "$SHELL_CONFIG"
  else
    printf "\n# Loseless CLI\n%s\n" "$PATH_STR" >> "$SHELL_CONFIG"
    printf "\033[32m   [OK] Added to PATH in %s\033[0m\n" "$SHELL_CONFIG"
  fi
fi

printf "\n\033[36m=============================================================\033[0m\n"
printf "\033[32m         INSTALLATION COMPLETED SUCCESSFULLY!                \033[0m\n"
printf "\033[36m=============================================================\033[0m\n"
printf "To verify your installation, restart your terminal or run:\n"
printf "   \033[33mexport PATH=\"$INSTALL_DIR:\$PATH\"\033[0m\n"
printf "   \033[33mloseless status\033[0m\n"
printf "   \033[33mloseless help\033[0m\n\n"
