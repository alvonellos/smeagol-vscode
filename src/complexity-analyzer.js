"use strict";

const vscode = require("vscode");
const { ConfigLoader } = require("./config-loader");
const { PerformanceProfiler } = require("./performance-profiler");

/**
 * Code Complexity Analyzer
 * Analyzes cyclomatic complexity, branch paths, and code metrics
 * OPTIMIZED with pre-compiled regex patterns and configurable thresholds
 * Includes performance metrics tracking
 */

// Pre-compiled regex patterns (compiled once at module load time, not on every call)
const PRECOMPILED_REGEX = {
  // Function definition patterns
  jsFunction: /^(\s*)(async\s+)?function\s+(\w+)\s*\(/gm,
  pythonFunction: /^(\s*)(async\s+)?def\s+(\w+)\s*\(/gm,
  rustFunction: /^(\s*)(pub\s+)?(async\s+)?fn\s+(\w+)/gm,
  javaFunction: /^(\s*)(public\s+|private\s+)?(static\s+)?(\w+\s+)?(\w+)\s*\(/gm,
  jsClassFunction: /^(\s*)(class|function|const)\s+(\w+)/gm,
  
  // Control flow patterns
  ifElse: /if\s*\([^)]+\)\s*{|else\s*if\s*\([^)]+\)\s*{|else\s*{/g,
  switchCase: /case\s+/g,
  ternary: /\?.*:/g,
  forLoop: /for\s*\(/g,
  whileLoop: /while\s*\(/g,
  catchBlock: /catch\s*\(/g,
  throwStatement: /throw\s+/g,
  
  // Structural patterns
  closingBrace: /^\s*}/gm,
  openingBrace: /\{/g,
};

class ComplexityAnalyzer {
  constructor(workspaceRoot = null) {
    this.diagnosticsCollection = vscode.languages.createDiagnosticCollection("smeagol-complexity");
    // Cache compiled regex patterns for specific keywords
    this.keywordRegexCache = new Map();
    
    // Performance profiler for metrics
    this.profiler = new PerformanceProfiler("complexity-analysis");
    
    // Load configuration
    this.configLoader = new ConfigLoader();
    if (workspaceRoot) {
      this.configLoader.loadConfig(workspaceRoot);
      // Watch for config changes
      this.configWatcher = this.configLoader.watchConfig(() => {
        // Config changed, analyzers will use updated thresholds on next run
      });
    }
  }

  /**
   * Analyze document for complexity metrics
   */
  analyzeDocument(editor) {
    // Start performance measurement
    this.profiler.startTimer();
    
    const document = editor.document;
    const text = document.getText();
    const diagnostics = [];

    // Get language-specific thresholds from config
    const languageId = document.languageId;
    const complexityWarning = this.configLoader.getComplexityThreshold(languageId, "warning");
    const complexityError = this.configLoader.getComplexityThreshold(languageId, "error");
    const branchThreshold = this.configLoader.getBranchThreshold(languageId);

    // Parse all functions/methods
    const functions = this.extractFunctions(text, document);

    functions.forEach(func => {
      const complexity = this.calculateCyclomaticComplexity(func.code);
      const branches = this.analyzeBranches(func.code);

      // Warn if complexity exceeds warning threshold
      if (complexity > complexityWarning) {
        const range = new vscode.Range(func.startLine, 0, func.endLine, 0);
        const severity = complexity > complexityError ? vscode.DiagnosticSeverity.Error : vscode.DiagnosticSeverity.Warning;
        const diagnostic = new vscode.Diagnostic(
          range,
          `High cyclomatic complexity: ${complexity} (threshold: ${complexityWarning}). Branch paths: ${branches.count}`,
          severity
        );
        diagnostic.source = "Smeagol Complexity";
        diagnostic.code = "complexity-high";
        diagnostics.push(diagnostic);
      }

      // Warn if too many branch paths
      if (branches.count > branchThreshold) {
        const range = new vscode.Range(func.startLine, 0, func.startLine, 100);
        const diagnostic = new vscode.Diagnostic(
          range,
          `${func.name}: ${branches.count} branch paths. Consider refactoring.`,
          vscode.DiagnosticSeverity.Information
        );
        diagnostic.source = "Smeagol Branches";
        diagnostics.push(diagnostic);
      }
    });

    this.diagnosticsCollection.set(document.uri, diagnostics);
    
    // Record performance metrics
    const elapsed = this.profiler.endTimer();
    this.profiler.recordMetric("diagnostics_count", diagnostics.length);
    this.profiler.recordMetric("functions_analyzed", functions.length);
    
    // Record cache metrics if available
    if (this.keywordRegexCache.size > 0) {
      this.profiler.recordMetric("keyword_cache_size", this.keywordRegexCache.size);
    }
  }

  /**
   * Extract all functions from code
   */
  extractFunctions(text, document) {
    const functions = [];
    const lines = text.split("\n");

    // Use pre-compiled patterns for better performance
    const patterns = [
      { regex: PRECOMPILED_REGEX.jsFunction, lang: "js" },
      { regex: PRECOMPILED_REGEX.pythonFunction, lang: "python" },
      { regex: PRECOMPILED_REGEX.rustFunction, lang: "rust" },
      { regex: PRECOMPILED_REGEX.javaFunction, lang: "java" },
      { regex: PRECOMPILED_REGEX.jsClassFunction, lang: "js" }
    ];

    let lineIndex = 0;
    for (const line of lines) {
      let matched = false;

      for (const pattern of patterns) {
        const match = pattern.regex.exec(line);
        if (match) {
          const funcName = match[match.length - 1] || "anonymous";
          const startLine = lineIndex;

          // Find end of function (closing brace)
          let braceCount = 0;
          let endLine = startLine;
          let inFunction = false;

          for (let i = startLine; i < Math.min(startLine + 500, lines.length); i++) {
            const funcLine = lines[i];
            for (const char of funcLine) {
              if (char === "{") {
                braceCount++;
                inFunction = true;
              } else if (char === "}") {
                braceCount--;
                if (inFunction && braceCount === 0) {
                  endLine = i;
                  break;
                }
              }
            }
            if (inFunction && braceCount === 0) break;
          }

          const funcCode = lines.slice(startLine, endLine + 1).join("\n");
          functions.push({
            name: funcName,
            code: funcCode,
            startLine: startLine,
            endLine: endLine,
            language: pattern.lang
          });

          matched = true;
          break;
        }
      }

      lineIndex++;
    }

    return functions;
  }

  /**
   * Calculate cyclomatic complexity
   */
  calculateCyclomaticComplexity(code) {
    let complexity = 1; // Base complexity

    // Count decision points
    const decisionKeywords = [
      { word: "if", weight: 1 },
      { word: "else if", weight: 1 },
      { word: "else", weight: 0 }, // else doesn't add complexity
      { word: "switch", weight: 1 },
      { word: "case", weight: 1 },
      { word: "for", weight: 1 },
      { word: "while", weight: 1 },
      { word: "do", weight: 1 },
      { word: "catch", weight: 1 },
      { word: "?", weight: 1 }, // ternary operator
      { word: "&&", weight: 1 },
      { word: "||", weight: 1 }
    ];

    for (const keyword of decisionKeywords) {
      // Use cached regex or create and cache new ones
      let regex = this.keywordRegexCache.get(keyword.word);
      if (!regex) {
        regex = new RegExp(`\\b${keyword.word}\\b`, "g");
        this.keywordRegexCache.set(keyword.word, regex);
      }
      
      const matches = code.match(regex) || [];
      complexity += matches.length * keyword.weight;
    }

    return Math.max(1, complexity);
  }

  /**
   * Analyze branch paths (all possible execution paths)
   */
  analyzeBranches(code) {
    const branches = {
      count: 1, // Start with 1 (base path)
      paths: []
    };

    // Use pre-compiled if/else regex
    let match;
    while ((match = PRECOMPILED_REGEX.ifElse.exec(code)) !== null) {
      if (match[0].includes("if")) {
        branches.count *= 2; // Each if doubles possible paths
      }
    }

    // Parse switch/case statements
    const switchRegex = /switch\s*\([^)]+\)\s*{([^}]*)}/;
    const switchMatch = code.match(switchRegex);
    if (switchMatch) {
      const cases = (switchMatch[1].match(PRECOMPILED_REGEX.switchCase) || []).length;
      branches.count *= Math.max(2, cases);
    }

    // Parse ternary operators
    const ternaryCount = (code.match(PRECOMPILED_REGEX.ternary) || []).length;
    branches.count *= Math.pow(2, ternaryCount);

    return branches;
  }

  /**
   * Show complexity report in sidebar
   */
  showReport(editor) {
    const document = editor.document;
    const text = document.getText();
    const functions = this.extractFunctions(text, document);

    let report = "# Code Complexity Report\n\n";
    let totalComplexity = 0;
    let totalBranches = 0;

    for (const func of functions) {
      const complexity = this.calculateCyclomaticComplexity(func.code);
      const branches = this.analyzeBranches(func.code);

      totalComplexity += complexity;
      totalBranches += branches.count;

      const icon = complexity > 10 ? "🔴" : complexity > 5 ? "🟡" : "🟢";
      report += `${icon} **${func.name}** (Line ${func.startLine + 1})\n`;
      report += `  - Cyclomatic Complexity: ${complexity}\n`;
      report += `  - Branch Paths: ${branches.count}\n`;
      report += `  - Language: ${func.language}\n\n`;
    }

    report += `## Summary\n`;
    report += `- Total Functions: ${functions.length}\n`;
    report += `- Average Complexity: ${(totalComplexity / functions.length).toFixed(2)}\n`;
    report += `- Total Branch Paths: ${totalBranches}\n`;

    vscode.window.showInformationMessage(
      `✓ Complexity Report: Avg complexity ${(totalComplexity / functions.length).toFixed(2)}, ${totalBranches} total branch paths`
    );
  }

  dispose() {
    this.diagnosticsCollection.dispose();
    if (this.configWatcher) {
      this.configWatcher();
    }
    this.configLoader.closeWatchers();
  }
}

module.exports = { ComplexityAnalyzer };
