package main

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/channdraa-afk/loseless/internal/blast"
)

const version = "1.4.0"

type SessionState struct {
	Phase         int    `json:"phase"`
	Bypassed      bool   `json:"bypassed"`
	BypassOffered bool   `json:"bypassOffered"`
	LastKeyword   string `json:"lastKeyword"`
	UpdatedAt     int64  `json:"updatedAt"`
}

type ConfigState struct {
	GateKeyword              string `json:"gateKeyword"`
	AriseMode                string `json:"ariseMode"`
	FastTrackMicroDiffs      bool   `json:"fastTrackMicroDiffs"`
	AutoInjectGatekeeperCard bool   `json:"autoInjectGatekeeperCard"`
	StrictMode               bool   `json:"strictMode"`
	CognitiveMode            string `json:"cognitiveMode"`
}

func getSessionPath() string {
	if custom := os.Getenv("LOSELESS_SESSION_DIR"); custom != "" {
		return filepath.Join(custom, "session.json")
	}
	cwd, _ := os.Getwd()
	localSession := filepath.Join(cwd, ".loseless", "session.json")
	if _, err := os.Stat(localSession); err == nil {
		return localSession
	}
	// Check parent directory if inside subfolder
	parentSession := filepath.Join(filepath.Dir(cwd), ".loseless", "session.json")
	if _, err := os.Stat(parentSession); err == nil {
		return parentSession
	}
	return localSession
}

func readSession() SessionState {
	path := getSessionPath()
	data, err := os.ReadFile(path)
	if err != nil {
		return SessionState{Phase: 1, Bypassed: false, UpdatedAt: time.Now().UnixMilli()}
	}
	var s SessionState
	if err := json.Unmarshal(data, &s); err != nil {
		return SessionState{Phase: 1, Bypassed: false, UpdatedAt: time.Now().UnixMilli()}
	}
	return s
}

func saveSession(s SessionState) error {
	path := getSessionPath()
	dir := filepath.Dir(path)
	if err := os.MkdirAll(dir, 0755); err != nil {
		return err
	}
	s.UpdatedAt = time.Now().UnixMilli()
	data, err := json.MarshalIndent(s, "", "  ")
	if err != nil {
		return err
	}
	return os.WriteFile(path, data, 0644)
}

func readConfig() ConfigState {
	defaultCfg := ConfigState{
		GateKeyword:              "Arise",
		AriseMode:                "adaptive",
		FastTrackMicroDiffs:      true,
		AutoInjectGatekeeperCard: true,
		StrictMode:               true,
		CognitiveMode:            "auto",
	}
	cwd, _ := os.Getwd()
	cfgPath := filepath.Join(cwd, "loseless.config.json")
	data, err := os.ReadFile(cfgPath)
	if err != nil {
		return defaultCfg
	}
	var cfg ConfigState
	if err := json.Unmarshal(data, &cfg); err != nil {
		return defaultCfg
	}
	return cfg
}

func printHelp() {
	fmt.Printf("Loseless Native Core CLI v%s\n", version)
	fmt.Println("High-speed, zero-dependency engine for coding agents and developer workflows.")
	fmt.Println("")
	fmt.Println("Usage: loseless <command> [arguments]")
	fmt.Println("")
	fmt.Println("Commands:")
	fmt.Println("  status             Display active Arise gatekeeper state and configuration")
	fmt.Println("  gate <subcommand>  Manage physical execution gate (unlock | relock | bypass)")
	fmt.Println("  blast <symbol>     Run concurrent AST reference and blast-radius scan")
	fmt.Println("  version            Print CLI version and exit")
	fmt.Println("  help               Show this help message")
}

func main() {
	if len(os.Args) < 2 {
		printHelp()
		return
	}

	cmd := strings.ToLower(os.Args[1])

	switch cmd {
	case "version", "-v", "--version":
		fmt.Printf("loseless v%s (go native core)\n", version)

	case "help", "-h", "--help":
		printHelp()

	case "status":
		startTime := time.Now()
		session := readSession()
		config := readConfig()
		elapsed := float64(time.Since(startTime).Microseconds()) / 1000.0

		phaseStr := "Phase 1 (Locked — Read-Only Planning)"
		if session.Phase == 2 {
			if session.Bypassed {
				phaseStr = "Phase 2 (Unlocked — Urgency/Manual Bypass)"
			} else {
				phaseStr = fmt.Sprintf("Phase 2 (Unlocked via token '%s')", session.LastKeyword)
			}
		}

		fmt.Println("=============================================================")
		fmt.Println("            LOSELESS NATIVE CORE: STATUS REPORT              ")
		fmt.Println("=============================================================")
		fmt.Printf("CLI Engine           : Go Native Core (v%s)\n", version)
		fmt.Printf("Execution Gate       : %s\n", phaseStr)
		fmt.Printf("Sacred Keyword       : '%s'\n", config.GateKeyword)
		fmt.Printf("Arise Mode           : %s\n", config.AriseMode)
		fmt.Printf("Micro-Diff FastTrack : %t\n", config.FastTrackMicroDiffs)
		fmt.Printf("Strict Turn Relock   : Active (Auto-relock on each new turn)\n")
		fmt.Printf("Session Location     : %s\n", getSessionPath())
		fmt.Printf("Inspection Latency   : %.3f ms\n", elapsed)
		fmt.Println("=============================================================")

	case "gate":
		if len(os.Args) < 3 {
			fmt.Println("Usage: loseless gate <unlock | relock | bypass>")
			os.Exit(1)
		}
		sub := strings.ToLower(os.Args[2])
		session := readSession()
		switch sub {
		case "unlock":
			session.Phase = 2
			session.Bypassed = false
			session.LastKeyword = "Arise"
			if err := saveSession(session); err != nil {
				fmt.Printf("Error updating gate state: %v\n", err)
				os.Exit(1)
			}
			fmt.Println("[Loseless Gate] Execution Gate Unlocked. Phase 2 active.")
		case "relock":
			session.Phase = 1
			session.Bypassed = false
			session.LastKeyword = ""
			if err := saveSession(session); err != nil {
				fmt.Printf("Error updating gate state: %v\n", err)
				os.Exit(1)
			}
			fmt.Println("[Loseless Gate] Execution Gate Relocked. Phase 1 active.")
		case "bypass":
			session.Phase = 2
			session.Bypassed = true
			if err := saveSession(session); err != nil {
				fmt.Printf("Error updating gate state: %v\n", err)
				os.Exit(1)
			}
			fmt.Println("[Loseless Gate] Emergency Bypass Activated. Phase 2 active.")
		default:
			fmt.Printf("Unknown gate action: '%s'. Expected 'unlock', 'relock', or 'bypass'.\n", sub)
			os.Exit(1)
		}

	case "blast":
		if len(os.Args) < 3 {
			fmt.Println("Usage: loseless blast <symbol>")
			os.Exit(1)
		}
		symbol := os.Args[2]
		cwd, err := os.Getwd()
		if err != nil {
			cwd = "."
		}
		result, err := blast.Scan(cwd, symbol)
		if err != nil {
			fmt.Printf("Blast scan error: %v\n", err)
			os.Exit(1)
		}
		fmt.Print(result.FormatReport())

	default:
		fmt.Printf("Unknown command: '%s'\n\n", os.Args[1])
		printHelp()
		os.Exit(1)
	}
}
