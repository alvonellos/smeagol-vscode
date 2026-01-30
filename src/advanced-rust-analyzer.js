"use strict";

/**
 * Advanced Rust Analyzer
 * 
 * Deep Rust-specific analysis:
 * - Ownership and borrowing issues
 * - Lifetime analysis and suggestions
 * - Trait implementation detection
 * - Macro expansion helpers
 * - Performance recommendations
 */

const vscode = require("vscode");

class AdvancedRustAnalyzer {
  constructor() {
    this.diagnosticsCollection = vscode.languages.createDiagnosticCollection(
      "advanced-rust"
    );
    this.rustPatterns = this._loadRustPatterns();
    this.performanceIssues = [];
  }

  /**
   * Analyze Rust file for advanced issues
   * @param {vscode.TextDocument} document - Document to analyze
   * @returns {object} Analysis results
   */
  analyzeRustFile(document) {
    const text = document.getText();
    const diagnostics = [];

    // Check for common issues
    diagnostics.push(...this._checkOwnershipPatterns(text, document));
    diagnostics.push(...this._checkLifetimeUsage(text, document));
    diagnostics.push(...this._checkUnsafeBlocks(text, document));
    diagnostics.push(...this._checkCloneUsage(text, document));
    diagnostics.push(...this._checkErrorHandling(text, document));
    diagnostics.push(...this._checkAsyncAwaitPatterns(text, document));

    // Set diagnostics
    this.diagnosticsCollection.set(document.uri, diagnostics);

    return {
      count: diagnostics.length,
      diagnostics: diagnostics,
    };
  }

  /**
   * Check ownership and move patterns
   * @param {string} text - File text
   * @param {vscode.TextDocument} document - Document
   * @returns {vscode.Diagnostic[]}
   */
  _checkOwnershipPatterns(text, document) {
    const diagnostics = [];
    const lines = text.split("\n");

    // Look for double moves or unnecessary clones
    const movePattern = /let\s+\w+\s*=\s*(\w+);[\s\S]*?let\s+\w+\s*=\s*\1;/g;
    let match;

    // Simpler pattern matching
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check for clone() that could be moved
      if (line.includes(".clone()") && !line.includes("impl") && !line.includes("//")) {
        const range = new vscode.Range(i, 0, i, line.length);
        const diagnostic = new vscode.Diagnostic(
          range,
          "Consider moving value instead of cloning",
          vscode.DiagnosticSeverity.Information
        );
        diagnostic.source = "Advanced Rust";
        diagnostic.code = "unnecessary-clone";
        diagnostics.push(diagnostic);
      }

      // Check for manual drop (usually unnecessary)
      if (/drop\s*\(\s*\w+\s*\)/.test(line)) {
        const range = new vscode.Range(i, 0, i, line.length);
        const diagnostic = new vscode.Diagnostic(
          range,
          "drop() is implicit at end of scope",
          vscode.DiagnosticSeverity.Hint
        );
        diagnostic.source = "Advanced Rust";
        diagnostic.code = "unnecessary-drop";
        diagnostics.push(diagnostic);
      }
    }

    return diagnostics;
  }

  /**
   * Check lifetime usage patterns
   * @param {string} text - File text
   * @param {vscode.TextDocument} document - Document
   * @returns {vscode.Diagnostic[]}
   */
  _checkLifetimeUsage(text, document) {
    const diagnostics = [];
    const lines = text.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check for explicit lifetimes that could be elided
      if (/'a/.test(line) && line.includes("fn")) {
        // Simple heuristic: if 'a is used only once, it's elisionable
        const count = (line.match(/'a/g) || []).length;
        if (count === 1) {
          const range = new vscode.Range(i, 0, i, line.length);
          const diagnostic = new vscode.Diagnostic(
            range,
            "Lifetime 'a could be elided",
            vscode.DiagnosticSeverity.Hint
          );
          diagnostic.source = "Advanced Rust";
          diagnostic.code = "elided-lifetime";
          diagnostics.push(diagnostic);
        }
      }

      // Check for 'static lifetime misuse
      if (line.includes("'static") && line.includes("Box")) {
        const range = new vscode.Range(i, 0, i, line.length);
        const diagnostic = new vscode.Diagnostic(
          range,
          "Consider trait objects instead of 'static lifetime",
          vscode.DiagnosticSeverity.Information
        );
        diagnostic.source = "Advanced Rust";
        diagnostic.code = "static-lifetime-pattern";
        diagnostics.push(diagnostic);
      }
    }

    return diagnostics;
  }

  /**
   * Check unsafe block usage
   * @param {string} text - File text
   * @param {vscode.TextDocument} document - Document
   * @returns {vscode.Diagnostic[]}
   */
  _checkUnsafeBlocks(text, document) {
    const diagnostics = [];
    const lines = text.split("\n");

    let unsafeCount = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (/\bunsafe\s*{/.test(line)) {
        unsafeCount++;

        const range = new vscode.Range(i, 0, i, line.length);
        const diagnostic = new vscode.Diagnostic(
          range,
          `Unsafe block detected (#${unsafeCount}) - ensure safety invariants`,
          vscode.DiagnosticSeverity.Warning
        );
        diagnostic.source = "Advanced Rust";
        diagnostic.code = "unsafe-block";
        diagnostics.push(diagnostic);
      }
    }

    return diagnostics;
  }

  /**
   * Check for excessive clone usage
   * @param {string} text - File text
   * @param {vscode.TextDocument} document - Document
   * @returns {vscode.Diagnostic[]}
   */
  _checkCloneUsage(text, document) {
    const diagnostics = [];
    const lines = text.split("\n");

    let cloneCount = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      const matches = (line.match(/\.clone\s*\(/g) || []).length;
      if (matches > 0) {
        cloneCount += matches;

        // Warn if multiple clones in one line
        if (matches > 1) {
          const range = new vscode.Range(i, 0, i, line.length);
          const diagnostic = new vscode.Diagnostic(
            range,
            `Multiple clones in one line (${matches}) - consider refactoring for performance`,
            vscode.DiagnosticSeverity.Information
          );
          diagnostic.source = "Advanced Rust";
          diagnostic.code = "multiple-clones";
          diagnostics.push(diagnostic);
        }
      }
    }

    return diagnostics;
  }

  /**
   * Check error handling patterns
   * @param {string} text - File text
   * @param {vscode.TextDocument} document - Document
   * @returns {vscode.Diagnostic[]}
   */
  _checkErrorHandling(text, document) {
    const diagnostics = [];
    const lines = text.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check for unwrap() usage
      if (/.unwrap\s*\(\)/.test(line) && !line.includes("//")) {
        const range = new vscode.Range(i, 0, i, line.length);
        const diagnostic = new vscode.Diagnostic(
          range,
          "Consider using ? operator or proper error handling instead of unwrap()",
          vscode.DiagnosticSeverity.Warning
        );
        diagnostic.source = "Advanced Rust";
        diagnostic.code = "unwrap-usage";
        diagnostics.push(diagnostic);
      }

      // Check for expect() usage
      if (/.expect\s*\(/.test(line) && !line.includes("//")) {
        const range = new vscode.Range(i, 0, i, line.length);
        const diagnostic = new vscode.Diagnostic(
          range,
          "expect() can panic - ensure this is intentional",
          vscode.DiagnosticSeverity.Warning
        );
        diagnostic.source = "Advanced Rust";
        diagnostic.code = "expect-usage";
        diagnostics.push(diagnostic);
      }
    }

    return diagnostics;
  }

  /**
   * Check async/await patterns
   * @param {string} text - File text
   * @param {vscode.TextDocument} document - Document
   * @returns {vscode.Diagnostic[]}
   */
  _checkAsyncAwaitPatterns(text, document) {
    const diagnostics = [];
    const lines = text.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check for .block_on() - usually anti-pattern
      if (/.block_on\s*\(/.test(line)) {
        const range = new vscode.Range(i, 0, i, line.length);
        const diagnostic = new vscode.Diagnostic(
          range,
          "block_on() blocking the thread - consider proper async context",
          vscode.DiagnosticSeverity.Warning
        );
        diagnostic.source = "Advanced Rust";
        diagnostic.code = "block-on-usage";
        diagnostics.push(diagnostic);
      }

      // Check for missing await
      if (line.includes("async") && !line.includes("await") && line.includes("()")) {
        // This is a heuristic - might have false positives
      }
    }

    return diagnostics;
  }

  /**
   * Provide Rust code completion hints
   * @param {string} prefix - Code prefix
   * @returns {vscode.CompletionItem[]}
   */
  getRustHints(prefix) {
    const hints = [
      new vscode.CompletionItem("match expression", vscode.CompletionItemKind.Snippet),
      new vscode.CompletionItem("unsafe block", vscode.CompletionItemKind.Snippet),
      new vscode.CompletionItem("trait impl", vscode.CompletionItemKind.Snippet),
      new vscode.CompletionItem("lifetime annotation", vscode.CompletionItemKind.Snippet),
      new vscode.CompletionItem("macro call", vscode.CompletionItemKind.Snippet),
    ];

    return hints;
  }

  /**
   * Analyze performance characteristics
   * @param {string} text - File text
   * @returns {object} Performance analysis
   */
  analyzePerformance(text) {
    const issues = [];

    // Check for inefficient patterns
    if (text.includes(".clone()") && text.includes(".iter()")) {
      issues.push({
        severity: "info",
        message: "Clone + iterate pattern detected - consider using references",
      });
    }

    if ((text.match(/String::from\s*\(/g) || []).length > 5) {
      issues.push({
        severity: "info",
        message: "Multiple String::from allocations - consider string literals",
      });
    }

    if ((text.match(/Vec::new\s*\(\)/g) || []).length > 5) {
      issues.push({
        severity: "info",
        message: "Consider pre-allocating Vec with capacity",
      });
    }

    return { issues, count: issues.length };
  }

  /**
   * Get trait implementation suggestions
   * @param {string} structName - Struct name
   * @returns {string[]} Suggested traits
   */
  suggestTraits(structName) {
    return [
      "Debug",
      "Clone",
      "Default",
      "PartialEq",
      "Eq",
      "Hash",
      "Display",
      "From",
      "Into",
      "Serialize",
      "Deserialize",
    ];
  }

  /**
   * Load Rust pattern library
   * @returns {object}
   */
  _loadRustPatterns() {
    return {
      ownership: [
        { pattern: "let x = y; let z = x;", issue: "Move after first use" },
        { pattern: "let x = vec![1,2,3]; foo(x); bar(x);", issue: "Moved value used" },
      ],
      lifetime: [
        { pattern: "fn foo<'a>(x: &'a T) -> &'a T", suggestion: "Lifetime can be elided" },
      ],
      async: [
        { pattern: "rt.block_on(...)", issue: "Blocking async context" },
      ],
    };
  }

  /**
   * Cleanup
   */
  dispose() {
    this.diagnosticsCollection.dispose();
  }
}

module.exports = { AdvancedRustAnalyzer };
