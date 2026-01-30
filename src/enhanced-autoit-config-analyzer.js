"use strict";

/**
 * Enhanced AutoIt & Config Analyzer
 * 
 * Advanced analysis for:
 * - AutoIt script quality and patterns
 * - Configuration file validation (YAML, TOML, INI, JSON)
 * - Best practices detection
 * - Performance analysis
 */

const vscode = require("vscode");

class EnhancedAutoItConfigAnalyzer {
  constructor() {
    this.diagnosticsCollection = vscode.languages.createDiagnosticCollection(
      "autoit-config-analyzer"
    );
    this.autoitPatterns = this._loadAutoItPatterns();
  }

  /**
   * Analyze AutoIt script
   * @param {vscode.TextDocument} document - Document to analyze
   * @returns {void}
   */
  analyzeAutoIt(document) {
    const text = document.getText();
    const diagnostics = [];

    diagnostics.push(...this._checkAutoItPatterns(text, document));
    diagnostics.push(...this._checkAutoItPerformance(text, document));
    diagnostics.push(...this._checkAutoItSecurity(text, document));

    this.diagnosticsCollection.set(document.uri, diagnostics);
  }

  /**
   * Check AutoIt code patterns
   * @param {string} text - Script text
   * @param {vscode.TextDocument} document - Document
   * @returns {vscode.Diagnostic[]}
   */
  _checkAutoItPatterns(text, document) {
    const diagnostics = [];
    const lines = text.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check for deprecated functions
      if (/\b(Run|RunWait)\s*\(\s*"cmd\.exe/i.test(line)) {
        const range = new vscode.Range(i, 0, i, line.length);
        const diagnostic = new vscode.Diagnostic(
          range,
          "Consider using ShellExecute or modern API instead of cmd.exe",
          vscode.DiagnosticSeverity.Information
        );
        diagnostic.source = "AutoIt Analyzer";
        diagnostics.push(diagnostic);
      }

      // Check for missing error checking
      if (/\b(MouseClick|WinActivate|Send)\s*\(/.test(line) && !text.includes("@error")) {
        const range = new vscode.Range(i, 0, i, line.length);
        const diagnostic = new vscode.Diagnostic(
          range,
          "Consider checking @error after UI operations",
          vscode.DiagnosticSeverity.Hint
        );
        diagnostic.source = "AutoIt Analyzer";
        diagnostics.push(diagnostic);
      }

      // Check for Sleep usage (could cause hangs)
      if (/\bSleep\s*\(\s*\d+\s*\)/.test(line)) {
        const match = line.match(/Sleep\s*\(\s*(\d+)\s*\)/);
        if (match && parseInt(match[1]) > 1000) {
          const range = new vscode.Range(i, 0, i, line.length);
          const diagnostic = new vscode.Diagnostic(
            range,
            `Long sleep time ${match[1]}ms - may cause unresponsiveness`,
            vscode.DiagnosticSeverity.Information
          );
          diagnostic.source = "AutoIt Analyzer";
          diagnostics.push(diagnostic);
        }
      }

      // Check for global variable usage
      if (/^\s*Global\s+/.test(line)) {
        const range = new vscode.Range(i, 0, i, line.length);
        const diagnostic = new vscode.Diagnostic(
          range,
          "Global variables can cause maintainability issues - consider Local scope",
          vscode.DiagnosticSeverity.Hint
        );
        diagnostic.source = "AutoIt Analyzer";
        diagnostics.push(diagnostic);
      }

      // Check for string concatenation in loops
      if (line.includes("&=") || line.includes("= $") && line.includes("&")) {
        // Likely string concat
        if (text.includes("For ") || text.includes("While ")) {
          // May be in loop
          const range = new vscode.Range(i, 0, i, line.length);
          const diagnostic = new vscode.Diagnostic(
            range,
            "String concatenation in loops is inefficient - consider array-based approach",
            vscode.DiagnosticSeverity.Information
          );
          diagnostic.source = "AutoIt Analyzer";
          diagnostics.push(diagnostic);
        }
      }
    }

    return diagnostics;
  }

  /**
   * Check AutoIt performance issues
   * @param {string} text - Script text
   * @param {vscode.TextDocument} document - Document
   * @returns {vscode.Diagnostic[]}
   */
  _checkAutoItPerformance(text, document) {
    const diagnostics = [];
    const lines = text.split("\n");

    let inLoop = false;
    let loopDepth = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Track loop context
      if (/\b(For|While|Do)\s*/.test(line)) {
        inLoop = true;
        loopDepth++;
      }

      if (/\bWEnd\b|\bUntil\b|\bNext\b/.test(line) && loopDepth > 0) {
        loopDepth--;
      }

      // Check for expensive operations in loops
      if (inLoop && loopDepth > 0) {
        if (/\b(FileRead|FileWrite|DirGetSize|ProcessList)\s*\(/.test(line)) {
          const range = new vscode.Range(i, 0, i, line.length);
          const diagnostic = new vscode.Diagnostic(
            range,
            "Expensive operation in loop - consider moving outside loop",
            vscode.DiagnosticSeverity.Warning
          );
          diagnostic.source = "AutoIt Analyzer";
          diagnostics.push(diagnostic);
        }

        // Check for regex in loops
        if (/\b(StringRegExp|StringRegExpReplace)\s*\(/.test(line)) {
          const range = new vscode.Range(i, 0, i, line.length);
          const diagnostic = new vscode.Diagnostic(
            range,
            "Regex operations in loop - consider compiling pattern once",
            vscode.DiagnosticSeverity.Information
          );
          diagnostic.source = "AutoIt Analyzer";
          diagnostics.push(diagnostic);
        }
      }
    }

    return diagnostics;
  }

  /**
   * Check AutoIt security issues
   * @param {string} text - Script text
   * @param {vscode.TextDocument} document - Document
   * @returns {vscode.Diagnostic[]}
   */
  _checkAutoItSecurity(text, document) {
    const diagnostics = [];
    const lines = text.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check for hardcoded credentials
      if (/password\s*=|pwd\s*=|api[_-]?key\s*=/i.test(line)) {
        const range = new vscode.Range(i, 0, i, line.length);
        const diagnostic = new vscode.Diagnostic(
          range,
          "Hardcoded credentials detected - move to secure storage",
          vscode.DiagnosticSeverity.Warning
        );
        diagnostic.source = "AutoIt Security";
        diagnostics.push(diagnostic);
      }

      // Check for eval-like functions
      if (/\b(Execute|Eval)\s*\(/.test(line)) {
        const range = new vscode.Range(i, 0, i, line.length);
        const diagnostic = new vscode.Diagnostic(
          range,
          "Dynamic code execution - ensure input is properly validated",
          vscode.DiagnosticSeverity.Warning
        );
        diagnostic.source = "AutoIt Security";
        diagnostics.push(diagnostic);
      }
    }

    return diagnostics;
  }

  /**
   * Analyze configuration file (YAML, TOML, INI, JSON)
   * @param {vscode.TextDocument} document - Document to analyze
   * @returns {void}
   */
  analyzeConfig(document) {
    const text = document.getText();
    const fileName = document.fileName;
    const diagnostics = [];

    if (fileName.endsWith(".yaml") || fileName.endsWith(".yml")) {
      diagnostics.push(...this._validateYAML(text, document));
    } else if (fileName.endsWith(".toml")) {
      diagnostics.push(...this._validateTOML(text, document));
    } else if (fileName.endsWith(".ini")) {
      diagnostics.push(...this._validateINI(text, document));
    } else if (fileName.endsWith(".json")) {
      diagnostics.push(...this._validateJSON(text, document));
    }

    this.diagnosticsCollection.set(document.uri, diagnostics);
  }

  /**
   * Validate YAML configuration
   * @param {string} text - YAML text
   * @param {vscode.TextDocument} document - Document
   * @returns {vscode.Diagnostic[]}
   */
  _validateYAML(text, document) {
    const diagnostics = [];
    const lines = text.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const indent = line.match(/^\s*/)[0].length;

      // Check for tab indentation (YAML should use spaces)
      if (line.includes("\t")) {
        const range = new vscode.Range(i, 0, i, line.length);
        const diagnostic = new vscode.Diagnostic(
          range,
          "YAML should use spaces for indentation, not tabs",
          vscode.DiagnosticSeverity.Warning
        );
        diagnostic.source = "YAML Validator";
        diagnostics.push(diagnostic);
      }

      // Check for suspicious patterns
      if (/:\s*$/.test(line.trimEnd())) {
        // Looks like a key without value
        const range = new vscode.Range(i, 0, i, line.length);
        const diagnostic = new vscode.Diagnostic(
          range,
          "Key without value - next line must be indented",
          vscode.DiagnosticSeverity.Information
        );
        diagnostic.source = "YAML Validator";
        diagnostics.push(diagnostic);
      }
    }

    return diagnostics;
  }

  /**
   * Validate TOML configuration
   * @param {string} text - TOML text
   * @param {vscode.TextDocument} document - Document
   * @returns {vscode.Diagnostic[]}
   */
  _validateTOML(text, document) {
    const diagnostics = [];
    const lines = text.split("\n");

    let bracketStack = [];

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check for mismatched brackets
      for (const char of line) {
        if (char === "[") bracketStack.push("[");
        if (char === "]" && bracketStack.length > 0) bracketStack.pop();
      }

      // Check for quoted keys/values
      if (/=\s*"[^"]*$/.test(line)) {
        const range = new vscode.Range(i, 0, i, line.length);
        const diagnostic = new vscode.Diagnostic(
          range,
          "Unclosed quoted string",
          vscode.DiagnosticSeverity.Error
        );
        diagnostic.source = "TOML Validator";
        diagnostics.push(diagnostic);
      }
    }

    if (bracketStack.length > 0) {
      const diagnostic = new vscode.Diagnostic(
        new vscode.Range(lines.length - 1, 0, lines.length - 1, 100),
        "Unclosed section header",
        vscode.DiagnosticSeverity.Error
      );
      diagnostic.source = "TOML Validator";
      diagnostics.push(diagnostic);
    }

    return diagnostics;
  }

  /**
   * Validate INI configuration
   * @param {string} text - INI text
   * @param {vscode.TextDocument} document - Document
   * @returns {vscode.Diagnostic[]}
   */
  _validateINI(text, document) {
    const diagnostics = [];
    const lines = text.split("\n");

    let hasSection = false;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Check for section headers
      if (/^\[.*\]$/.test(line)) {
        hasSection = true;
      }

      // Check for key=value outside section
      if (/^\w+\s*=/.test(line) && !hasSection && !line.trim().startsWith(";")) {
        const range = new vscode.Range(i, 0, i, line.length);
        const diagnostic = new vscode.Diagnostic(
          range,
          "Key-value pair before first section",
          vscode.DiagnosticSeverity.Warning
        );
        diagnostic.source = "INI Validator";
        diagnostics.push(diagnostic);
      }
    }

    return diagnostics;
  }

  /**
   * Validate JSON configuration
   * @param {string} text - JSON text
   * @param {vscode.TextDocument} document - Document
   * @returns {vscode.Diagnostic[]}
   */
  _validateJSON(text, document) {
    const diagnostics = [];

    try {
      JSON.parse(text);
    } catch (error) {
      const match = error.message.match(/position (\d+)/);
      if (match) {
        const pos = parseInt(match[1]);
        let line = 0;
        let col = 0;

        for (let i = 0; i < Math.min(pos, text.length); i++) {
          if (text[i] === "\n") {
            line++;
            col = 0;
          } else {
            col++;
          }
        }

        const range = new vscode.Range(line, col, line, col + 10);
        const diagnostic = new vscode.Diagnostic(
          range,
          `JSON syntax error: ${error.message}`,
          vscode.DiagnosticSeverity.Error
        );
        diagnostic.source = "JSON Validator";
        diagnostics.push(diagnostic);
      }
    }

    return diagnostics;
  }

  /**
   * Load AutoIt pattern library
   * @returns {object}
   */
  _loadAutoItPatterns() {
    return {
      deprecated: [
        "Run",
        "RunWait",
        "DirCreate",
      ],
      asyncSafe: [
        "Sleep",
        "Send",
        "MouseClick",
      ],
      expensive: [
        "FileRead",
        "FileWrite",
        "ProcessList",
      ],
    };
  }

  /**
   * Get AutoIt best practices
   * @returns {string[]}
   */
  getAutoItBestPractices() {
    return [
      "Use Local scope for function variables",
      "Always check @error after system operations",
      "Use ShellExecute instead of Run for better control",
      "Avoid global variables - use function parameters",
      "Cache regex patterns instead of recompiling",
      "Use early returns to reduce nesting",
      "Add error handling and logging",
      "Document complex logic with comments",
    ];
  }

  /**
   * Cleanup
   */
  dispose() {
    this.diagnosticsCollection.dispose();
  }
}

module.exports = { EnhancedAutoItConfigAnalyzer };
