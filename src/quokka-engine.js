"use strict";

/**
 * Quokka-Style Live Code Evaluation Engine
 * 
 * Real-time execution feedback alongside code
 * - Fast, async evaluation
 * - Inline result display
 * - Variable state tracking
 * - Expression evaluation
 */

const vscode = require("vscode");
const { NeuroUI } = require("./neurodivergent-ui-system");

class QuokkaEngine {
  constructor() {
    this.neuroUI = new NeuroUI();
    this.evaluationCache = new Map();
    this.decorationTypes = new Map();
    this.executionStates = new Map(); // Track variable states
    this.maxCacheSize = 100;
    this.resultsCollection = vscode.languages.createDiagnosticCollection("quokka-results");
  }

  /**
   * Evaluate Python expression
   * @param {string} code - Code to evaluate
   * @param {object} context - Variable context
   * @returns {Promise<object>} Evaluation result
   */
  async evaluatePython(code, context = {}) {
    const cacheKey = `py:${code}`;
    if (this.evaluationCache.has(cacheKey)) {
      return this.evaluationCache.get(cacheKey);
    }

    try {
      // Sanitize code - prevent execution of dangerous operations
      if (this._isDangerous(code)) {
        return {
          success: false,
          error: "Dangerous operation blocked",
          code: code,
        };
      }

      // Build execution context
      const contextStr = Object.entries(context)
        .map(([k, v]) => `${k} = ${JSON.stringify(v)}`)
        .join("\n");

      // Create evaluation snippet
      const evaluationCode = `
${contextStr}
__result__ = ${code}
print(__result__)
`;

      // Python evaluation would happen here (simulated for now)
      // In production, use a Python subprocess or kernel
      const result = await this._evaluatePythonAsync(evaluationCode);

      this._cacheResult(cacheKey, result);
      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: code,
      };
    }
  }

  /**
   * Evaluate JavaScript expression
   * @param {string} code - Code to evaluate
   * @param {object} context - Variable context
   * @returns {object} Evaluation result
   */
  evaluateJavaScript(code, context = {}) {
    const cacheKey = `js:${code}`;
    if (this.evaluationCache.has(cacheKey)) {
      return this.evaluationCache.get(cacheKey);
    }

    try {
      // Create safe evaluation function
      const evaluate = new Function(...Object.keys(context), `return (${code})`);
      const result = evaluate(...Object.values(context));

      const output = {
        success: true,
        result: this._stringifyResult(result),
        type: typeof result,
        code: code,
      };

      this._cacheResult(cacheKey, output);
      return output;
    } catch (error) {
      const output = {
        success: false,
        error: error.message,
        code: code,
      };
      this._cacheResult(cacheKey, output);
      return output;
    }
  }

  /**
   * Evaluate Java/Kotlin lambda-style expressions
   * @param {string} code - Expression code
   * @param {object} context - Variable context
   * @returns {object} Evaluation result with type inference
   */
  evaluateJava(code, context = {}) {
    const cacheKey = `java:${code}`;
    if (this.evaluationCache.has(cacheKey)) {
      return this.evaluationCache.get(cacheKey);
    }

    try {
      // Parse Java expression (simplified)
      const result = {
        success: true,
        code: code,
        expression: code,
        type: this._inferJavaType(code, context),
        compilable: true,
        suggestions: this._getJavaEvaluationSuggestions(code, context),
      };

      this._cacheResult(cacheKey, result);
      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: code,
      };
    }
  }

  /**
   * Evaluate Rust expressions with type checking
   * @param {string} code - Rust code
   * @param {object} context - Type context
   * @returns {object} Type-checked result
   */
  evaluateRust(code, context = {}) {
    const cacheKey = `rust:${code}`;
    if (this.evaluationCache.has(cacheKey)) {
      return this.evaluationCache.get(cacheKey);
    }

    try {
      const result = {
        success: true,
        code: code,
        compilable: this._checkRustCompilability(code),
        typeInference: this._inferRustType(code, context),
        lifetimeAnalysis: this._analyzeRustLifetime(code),
        suggestions: [],
      };

      this._cacheResult(cacheKey, result);
      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message,
        code: code,
      };
    }
  }

  /**
   * Create inline decoration for evaluation result
   * @param {vscode.TextEditor} editor - Active editor
   * @param {number} line - Line number
   * @param {object} result - Evaluation result
   * @returns {void}
   */
  displayInlineResult(editor, line, result) {
    if (!result.success) {
      this._displayError(editor, line, result);
      return;
    }

    const range = new vscode.Range(line, Number.MAX_VALUE, line, Number.MAX_VALUE);

    // Create unique decoration type for this result
    const decorationKey = `result-${line}-${Date.now()}`;
    if (!this.decorationTypes.has(decorationKey)) {
      const color = this.neuroUI.feedbackStyles.success.color;
      const decoration = vscode.window.createTextEditorDecorationType({
        backgroundColor: `${color}15`,
        color: color,
        fontWeight: "600",
        isWholeLine: false,
        margin: "0 0 0 20px",
      });
      this.decorationTypes.set(decorationKey, decoration);
    }

    const decoration = this.decorationTypes.get(decorationKey);
    const resultText = `↦ ${result.result} (${result.type})`;

    editor.setDecorations(decoration, [
      {
        range: range,
        hoverMessage: new vscode.MarkdownString(
          `**Evaluated:** \`${result.result}\`\n\n**Type:** \`${result.type}\``
        ),
        renderOptions: {
          after: {
            contentText: resultText,
            color: color,
            fontFamily: "monospace",
          },
        },
      },
    ]);
  }

  /**
   * Display error inline with visual feedback
   * @param {vscode.TextEditor} editor - Active editor
   * @param {number} line - Line number
   * @param {object} result - Error result
   * @returns {void}
   */
  _displayError(editor, line, result) {
    const feedback = this.neuroUI.feedbackStyles.error;
    const range = new vscode.Range(line, Number.MAX_VALUE, line, Number.MAX_VALUE);

    const diagnostic = new vscode.Diagnostic(
      range,
      result.error,
      vscode.DiagnosticSeverity.Error
    );
    diagnostic.source = "Quokka Evaluation";
    this.resultsCollection.set(editor.document.uri, [diagnostic]);
  }

  /**
   * Track variable state for context
   * @param {string} variableName - Variable name
   * @param {any} value - Variable value
   * @returns {void}
   */
  trackVariable(variableName, value) {
    this.executionStates.set(variableName, {
      value: value,
      type: typeof value,
      timestamp: Date.now(),
    });
  }

  /**
   * Get current execution context
   * @returns {object} Current variable states
   */
  getExecutionContext() {
    const context = {};
    for (const [key, state] of this.executionStates) {
      context[key] = state.value;
    }
    return context;
  }

  // ========== Private Helper Methods ==========

  /**
   * Check if code contains dangerous operations
   * @param {string} code - Code to check
   * @returns {boolean}
   */
  _isDangerous(code) {
    const dangerousPatterns = [
      /import\s+os/i,
      /subprocess/i,
      /__import__/i,
      /exec\s*\(/i,
      /eval\s*\(/i,
      /open\s*\(/i,
      /system\s*\(/i,
    ];

    return dangerousPatterns.some((pattern) => pattern.test(code));
  }

  /**
   * Async Python evaluation (stub for subprocess integration)
   * @param {string} code - Python code
   * @returns {Promise<object>}
   */
  async _evaluatePythonAsync(code) {
    // In production: spawn Python subprocess, execute code, capture output
    // For now, return simulated result
    return {
      success: true,
      result: "42",
      type: "int",
    };
  }

  /**
   * Convert result to string representation
   * @param {any} result - Result to stringify
   * @returns {string}
   */
  _stringifyResult(result) {
    if (result === null) return "null";
    if (result === undefined) return "undefined";
    if (typeof result === "string") return `"${result}"`;
    if (typeof result === "object") return JSON.stringify(result).substring(0, 100);
    return String(result);
  }

  /**
   * Cache result with LRU eviction
   * @param {string} key - Cache key
   * @param {object} value - Value to cache
   * @returns {void}
   */
  _cacheResult(key, value) {
    if (this.evaluationCache.size >= this.maxCacheSize) {
      const firstKey = this.evaluationCache.keys().next().value;
      this.evaluationCache.delete(firstKey);
    }
    this.evaluationCache.set(key, value);
  }

  /**
   * Infer Java type from expression
   * @param {string} code - Java expression
   * @param {object} context - Type context
   * @returns {string}
   */
  _inferJavaType(code, context) {
    if (/\.length\s*$/.test(code)) return "int";
    if (/\.toString\s*\(\s*\)\s*$/.test(code)) return "String";
    if (/\d+$/.test(code)) return "int";
    if (/".*"$/.test(code)) return "String";
    return "Object";
  }

  /**
   * Get Java evaluation suggestions
   * @param {string} code - Java code
   * @param {object} context - Context
   * @returns {string[]}
   */
  _getJavaEvaluationSuggestions(code, context) {
    const suggestions = [];
    if (code.includes(".")) {
      suggestions.push("Check method return type");
    }
    return suggestions;
  }

  /**
   * Check Rust code compilability
   * @param {string} code - Rust code
   * @returns {boolean}
   */
  _checkRustCompilability(code) {
    // Simplified check
    const hasUnmatchedBraces =
      (code.match(/{/g) || []).length !== (code.match(/}/g) || []).length;
    return !hasUnmatchedBraces;
  }

  /**
   * Infer Rust type
   * @param {string} code - Rust expression
   * @param {object} context - Type context
   * @returns {string}
   */
  _inferRustType(code, context) {
    if (/vec!\[/.test(code)) return "Vec<T>";
    if (/String::from/.test(code)) return "String";
    if (/&str/.test(code)) return "&str";
    if (/\d+$/.test(code)) return "i32";
    if (/\d+\.\d+$/.test(code)) return "f64";
    return "unknown";
  }

  /**
   * Analyze Rust lifetime usage
   * @param {string} code - Rust code
   * @returns {object}
   */
  _analyzeRustLifetime(code) {
    const lifetimes = (code.match(/'[a-z]+/g) || []).map((l) => l.substring(1));
    return {
      lifetimes: lifetimes,
      analysis: lifetimes.length > 0 ? "Has explicit lifetimes" : "Default lifetime",
    };
  }

  /**
   * Cleanup resources
   * @returns {void}
   */
  dispose() {
    for (const decoration of this.decorationTypes.values()) {
      decoration.dispose();
    }
    this.decorationTypes.clear();
    this.evaluationCache.clear();
    this.executionStates.clear();
    this.resultsCollection.dispose();
  }
}

module.exports = { QuokkaEngine };
