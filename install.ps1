<#
.SYNOPSIS
    Universal 1-Click Installer for Loseless on Windows PowerShell.
.DESCRIPTION
    Installs Loseless CLI shims and local core into the user home directory.
    Usage:
        irm https://raw.githubusercontent.com/channdraa-afk/Loseless/main/install.ps1 | iex
#>

$ErrorActionPreference = "Stop"

Write-Host "=============================================================" -ForegroundColor Cyan
Write-Host "             LOSELESS UNIVERSAL INSTALLER (WINDOWS)          " -ForegroundColor Cyan
Write-Host "=============================================================" -ForegroundColor Cyan

$InstallDir = Join-Path $env:USERPROFILE ".loseless\bin"
$CoreDir    = Join-Path $env:USERPROFILE ".loseless\core"

Write-Host "-> Target Installation Directory : $InstallDir" -ForegroundColor Gray

if (-not (Test-Path $InstallDir)) {
    New-Item -ItemType Directory -Path $InstallDir -Force | Out-Null
}

if (-not (Test-Path $CoreDir)) {
    New-Item -ItemType Directory -Path $CoreDir -Force | Out-Null
}

# Sync Core files
Write-Host "-> Synchronizing Loseless Core..." -ForegroundColor Gray
$LocalScriptDir = $PSScriptRoot
if ($LocalScriptDir -and (Test-Path (Join-Path $LocalScriptDir "bin\loseless.js"))) {
    Write-Host "   Installing from local workspace..." -ForegroundColor Gray
    Copy-Item -Path "$LocalScriptDir\*" -Destination $CoreDir -Recurse -Force
} else {
    if (Get-Command git -ErrorAction SilentlyContinue) {
        Write-Host "   Cloning from GitHub repository via git..." -ForegroundColor Gray
        if (Test-Path (Join-Path $CoreDir ".git")) {
            git -C $CoreDir pull --quiet
        } else {
            git clone --depth 1 --quiet https://github.com/channdraa-afk/Loseless.git $CoreDir
        }
    } else {
        Write-Host "   Downloading release archive from GitHub..." -ForegroundColor Gray
        $ZipUrl = "https://github.com/channdraa-afk/Loseless/archive/refs/heads/main.zip"
        $ZipFile = Join-Path $env:TEMP "loseless-main.zip"
        $ExtractPath = Join-Path $env:TEMP "loseless-extract"
        Invoke-WebRequest -Uri $ZipUrl -OutFile $ZipFile -UseBasicParsing
        Expand-Archive -Path $ZipFile -DestinationPath $ExtractPath -Force
        Copy-Item -Path "$ExtractPath\Loseless-main\*" -Destination $CoreDir -Recurse -Force
        Remove-Item -Path $ZipFile -Force -ErrorAction SilentlyContinue
        Remove-Item -Path $ExtractPath -Recurse -Force -ErrorAction SilentlyContinue
    }
}

# 1. Create CMD Batch Wrapper
$CmdPath = Join-Path $InstallDir "loseless.cmd"
$CmdContent = @"
@echo off
setlocal
node "%USERPROFILE%\.loseless\core\bin\loseless.js" %*
"@
Set-Content -Path $CmdPath -Value $CmdContent -Force
Write-Host "   [OK] Created launcher shim : loseless.cmd" -ForegroundColor Green

# 2. Create PowerShell Wrapper
$PsPath = Join-Path $InstallDir "loseless.ps1"
$PsContent = @"
& node "`$env:USERPROFILE\.loseless\core\bin\loseless.js" @args
"@
Set-Content -Path $PsPath -Value $PsContent -Force
Write-Host "   [OK] Created launcher shim : loseless.ps1" -ForegroundColor Green

# 3. Idempotent User PATH Configuration
$UserPath = [Environment]::GetEnvironmentVariable("Path", [EnvironmentVariableTarget]::User)
if ($UserPath -notlike "*$InstallDir*") {
    $NewPath = "$UserPath;$InstallDir"
    [Environment]::SetEnvironmentVariable("Path", $NewPath, [EnvironmentVariableTarget]::User)
    $env:Path = "$env:Path;$InstallDir"
    Write-Host "   [OK] Added to User PATH    : $InstallDir" -ForegroundColor Green
} else {
    Write-Host "   [OK] User PATH already configured" -ForegroundColor Gray
}

Write-Host "`n=============================================================" -ForegroundColor Cyan
Write-Host "         INSTALLATION COMPLETED SUCCESSFULLY!                " -ForegroundColor Green
Write-Host "=============================================================" -ForegroundColor Cyan
Write-Host "To verify your installation, open a new terminal and run:"
Write-Host "   loseless status" -ForegroundColor Yellow
Write-Host "   loseless help" -ForegroundColor Yellow
Write-Host ""
