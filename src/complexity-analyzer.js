"use strict";

const vscode = require("vscode");

/**
 * Code Complexity Analyzer
 * Analyzes cyclomatic complexity, branch paths, and code metrics
 */
class ComplexityAnalyzer {
  constructor() {
    this.diagnosticsCollection = vscode.languages.createDiagnosticCollection("smeagol-complexity");
  }

  /**
   * Analyze document for complexity metrics
   */
  analyzeDocument(editor) {
    const document = editor.document;
    const text = document.getText();
    const diagnostics = [];

    // Parse all functions/methods
    const functions = this.extractFunctions(text, document);

    functions.forEach(func => {
      const complexity = this.calculateCyclomaticComplexity(func.code);
      const branches = this.analyzeBranches(func.code);

      // Warn if complexity is high
      if (complexity > 10) {
        const range = new vscode.Range(func.startLine, 0, func.endLine, 0);
        const severity = complexity > 20 ? vscode.DiagnosticSeverity.Error : vscode.DiagnosticSeverity.Warning;
        const diagnostic = new vscode.Diagnostic(
          range,
          `High cyclomatic complexity: ${complexity} (> 10 recommended). Branch paths: ${branches.count}`,
          severity
        );
        diagnostic.source = "Smeagol Complexity";
        diagnostic.code = "complexity-high";
        diagnostics.push(diagnostic);
      }

      // Warn if too many branch paths
      if (branches.count > 8) {
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
  }

  /**
   * Extract all functions from code
   */
  extractFunctions(text, document) {
    const functions = [];
    const lines = text.split("\n");

    // Match various function definitions
    const patterns = [
      { regex: /^(\s*)(async\s+)?function\s+(\w+)\s*\(/gm, lang: "js" },
      { regex: /^(\s*)(async\s+)?def\s+(\w+)\s*\(/gm, lang: "python" },
      { regex: /^(\s*)(pub\s+)?(async\s+)?fn\s+(\w+)/gm, lang: "rust" },
      { regex: /^(\s*)(public\s+|private\s+)?(static\s+)?(\w+\s+)?(\w+)\s*\(/gm, lang: "java" },
      { regex: /^(\s*)(class|function|const)\s+(\w+)/gm, lang: "js" }
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
      const regex = new RegExp(`\\b${keyword.word}\\b`, "g");
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

    // Parse if/else chains
    const ifElseRegex = /if\s*\([^)]+\)\s*{|else\s*if\s*\([^)]+\)\s*{|else\s*{/g;
    let match;
    while ((match = ifElseRegex.exec(code)) !== null) {
      if (match[0].includes("if")) {
        branches.count *= 2; // Each if doubles possible paths
      }
    }

    // Parse switch/case statements
    const switchRegex = /switch\s*\([^)]+\)\s*{([^}]*)}/;
    const switchMatch = code.match(switchRegex);
    if (switchMatch) {
      const cases = (switchMatch[1].match(/case\s+/g) || []).length;
      branches.count *= Math.max(2, cases);
    }

    // Parse ternary operators
    const ternaryCount = (code.match(/\?.*:/g) || []).length;
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
  }
}

module.exports = { ComplexityAnalyzer };
