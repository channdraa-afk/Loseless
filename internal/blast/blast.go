package blast

import (
	"bufio"
	"fmt"
	"os"
	"path/filepath"
	"regexp"
	"strings"
	"sync"
	"time"
)

// Result holds the aggregate output of a blast-radius AST reference search.
type Result struct {
	Symbol       string
	TotalMatches int
	FilesScanned int
	MatchingFiles int
	ElapsedMs    float64
	Tier         string
	FileMatches  map[string]int
}

var supportedExts = map[string]bool{
	".go":   true,
	".py":   true,
	".js":   true,
	".jsx":  true,
	".ts":   true,
	".tsx":  true,
	".rs":   true,
	".java": true,
	".cpp":  true,
	".c":    true,
	".php":  true,
	".rb":   true,
	".cs":   true,
	".sql":  true,
}

var ignoredDirs = map[string]bool{
	".git":               true,
	"node_modules":       true,
	"vendor":             true,
	".temp-test-session": true,
	"__pycache__":        true,
	"dist":               true,
	"build":              true,
	".loseless":          true,
}

var tier2Patterns = []*regexp.Regexp{
	regexp.MustCompile(`(?i)(auth|token|session|jwt|password|secret|key|rls|cred)`),
	regexp.MustCompile(`(?i)(payment|billing|invoice|checkout|stripe|charge|transact)`),
	regexp.MustCompile(`(?i)(db|database|query|migration|sql|postgres|schema|table)`),
	regexp.MustCompile(`(?i)(concurrency|mutex|atomic|lock|race|goroutine|thread)`),
}

// ClassifyTier determines the safety risk tier according to Loseless Tiered Risk Matrix.
func ClassifyTier(symbol string, matchCount int) string {
	for _, re := range tier2Patterns {
		if re.MatchString(symbol) {
			return "Tier 2 (Critical Invariant / Auth / Data / Concurrency)"
		}
	}
	if matchCount > 5 {
		return "Tier 1 (High Caller Distribution)"
	}
	return "Tier 0 (Scoped Component / Aesthetic)"
}

// Scan traverses the directory tree concurrently using Goroutines to find all references to symbol.
func Scan(rootDir string, symbol string) (*Result, error) {
	startTime := time.Now()

	cleanSymbol := regexp.QuoteMeta(symbol)
	symbolRegex, err := regexp.Compile(`\b` + cleanSymbol + `\b`)
	if err != nil {
		symbolRegex = regexp.MustCompile(cleanSymbol)
	}

	var filesToScan []string
	err = filepath.Walk(rootDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return nil
		}
		if info.IsDir() {
			base := filepath.Base(path)
			if ignoredDirs[base] {
				return filepath.SkipDir
			}
			return nil
		}
		ext := strings.ToLower(filepath.Ext(path))
		if supportedExts[ext] {
			filesToScan = append(filesToScan, path)
		}
		return nil
	})
	if err != nil {
		return nil, err
	}

	result := &Result{
		Symbol:       symbol,
		FilesScanned: len(filesToScan),
		FileMatches:  make(map[string]int),
	}

	var mu sync.Mutex
	var wg sync.WaitGroup

	sem := make(chan struct{}, 16) // Worker pool limiter

	for _, file := range filesToScan {
		wg.Add(1)
		sem <- struct{}{}
		go func(f string) {
			defer wg.Done()
			defer func() { <-sem }()

			fileObj, err := os.Open(f)
			if err != nil {
				return
			}
			defer fileObj.Close()

			count := 0
			scanner := bufio.NewScanner(fileObj)
			for scanner.Scan() {
				line := scanner.Text()
				if symbolRegex.MatchString(line) {
					count++
				}
			}

			if count > 0 {
				mu.Lock()
				result.TotalMatches += count
				result.MatchingFiles++
				rel, err := filepath.Rel(rootDir, f)
				if err != nil {
					rel = f
				}
				result.FileMatches[rel] = count
				mu.Unlock()
			}
		}(file)
	}

	wg.Wait()
	result.ElapsedMs = time.Since(startTime).Seconds() * 1000
	result.Tier = ClassifyTier(symbol, result.TotalMatches)

	return result, nil
}

// FormatReport generates the clean 3-line aggregate report required by Loseless protocol.
func (r *Result) FormatReport() string {
	var sb strings.Builder
	sb.WriteString(fmt.Sprintf("[Loseless Blast-Radius Report: '%s']\n", r.Symbol))
	sb.WriteString(fmt.Sprintf("• Matches: %d references across %d/%d files (Scanned in %.2f ms)\n",
		r.TotalMatches, r.MatchingFiles, r.FilesScanned, r.ElapsedMs))
	sb.WriteString(fmt.Sprintf("• Classification: %s\n", r.Tier))
	if r.TotalMatches == 0 {
		sb.WriteString("• Downstream Callers: None detected (Clean isolation boundary)\n")
	} else {
		sb.WriteString(fmt.Sprintf("• Downstream Blast Radius: %d affected caller locations\n", r.MatchingFiles))
	}
	return sb.String()
}
