"use strict";

const vscode = require("vscode");
const { CompletionCache } = require("./completion-cache");
const { Debouncer } = require("./debouncer");

/**
 * Base Completion Provider - Consolidates common patterns across all language providers
 * 
 * Usage:
 * ```javascript
 * class MyLanguageCompletionProvider extends BaseCompletionProvider {
 *   getCompletions() {
 *     return [
 *       { label: "example", kind: vscode.CompletionItemKind.Keyword, detail: "...", doc: "..." },
 *       // ...
 *     ];
 *   }
 * 
 *   getLanguageId() {
 *     return "mylanguage";
 *   }
 * }
 * ```
 */
class BaseCompletionProvider {
  constructor(cacheSize = 500, cacheTTL = 5 * 60 * 1000) {
    this.completionItems = [];
    this.cache = new CompletionCache(cacheSize, cacheTTL);
    this.debouncer = new Debouncer(() => this.completionItems, 300);
    this._setupCache();
  }

  /**
   * Override in subclass to return raw completion data
   * @returns {Array} Array of completion objects { label, kind, detail, doc }
   */
  getCompletions() {
    return [];
  }

  /**
   * Override in subclass to return target language ID
   * @returns {string} VSCode language identifier (e.g., 'python', 'rust')
   */
  getLanguageId() {
    throw new Error("getLanguageId() must be implemented by subclass");
  }

  /**
   * Initialize completions from raw data
   * @protected
   */
  initialize() {
    const rawCompletions = this.getCompletions();
    this.completionItems = rawCompletions.map(item => {
      const completion = new vscode.CompletionItem(item.label, item.kind || vscode.CompletionItemKind.Text);
      completion.detail = item.detail || "";
      completion.documentation = new vscode.MarkdownString(item.doc || "");
      if (item.insertText) completion.insertText = item.insertText;
      if (item.range) completion.range = item.range;
      return completion;
    });
  }

  /**
   * Provide completions for editor
   * @param {vscode.TextDocument} document
   * @param {vscode.Position} position
   * @param {vscode.CancellationToken} token
   * @returns {vscode.CompletionItem[]}
   */
  provideCompletionItems(document, position, token) {
    if (this.completionItems.length === 0) {
      this.initialize();
    }
    return this.completionItems;
  }

  /**
   * Resolve additional details for completion item
   * @param {vscode.CompletionItem} item
   * @param {vscode.CancellationToken} token
   * @returns {vscode.CompletionItem}
   */
  resolveCompletionItem(item, token) {
    return item;
  }

  /**
   * Clear internal cache and reset state
   * @protected
   */
  _setupCache() {
    // Hook for subclasses to customize cache behavior
  }

  /**
   * Get completion items with cache support
   * @protected
   * @returns {vscode.CompletionItem[]}
   */
  _getCachedCompletions() {
    const cached = this.cache.get("completions");
    if (cached) return cached;

    if (this.completionItems.length === 0) {
      this.initialize();
    }

    this.cache.set("completions", this.completionItems);
    return this.completionItems;
  }

  /**
   * Clear cache when configuration changes
   * @public
   */
  reset() {
    this.cache.clear();
    this.completionItems = [];
  }

  /**
   * Dispose resources
   * @public
   */
  dispose() {
    this.reset();
  }
}

module.exports = { BaseCompletionProvider };
