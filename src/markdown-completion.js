"use strict";

const vscode = require("vscode");
const { CompletionCache } = require("./completion-cache");

/**
 * Markdown Completion Provider
 * Smart completions for Markdown files including:
 * - Headings, lists, tables
 * - Code fences with language tags
 * - Links and references
 * - Common Markdown patterns
 * 
 * Optimized with caching for high performance
 */
class MarkdownCompletionProvider {
  constructor() {
    this.completionItems = [];
    this.cache = new CompletionCache(200, 5 * 60 * 1000); // 200 items, 5min TTL
    this.initialize();
  }

  /**
   * Initialize completion items
   */
  initialize() {
    const completions = [
      // === HEADINGS ===
      { label: "# Heading 1", kind: vscode.CompletionItemKind.Snippet, detail: "# ", doc: "Create H1 heading" },
      { label: "## Heading 2", kind: vscode.CompletionItemKind.Snippet, detail: "## ", doc: "Create H2 heading" },
      { label: "### Heading 3", kind: vscode.CompletionItemKind.Snippet, detail: "### ", doc: "Create H3 heading" },
      { label: "#### Heading 4", kind: vscode.CompletionItemKind.Snippet, detail: "#### ", doc: "Create H4 heading" },
      
      // === FORMATTING ===
      { label: "**bold**", kind: vscode.CompletionItemKind.Snippet, detail: "**text**", doc: "Bold text formatting" },
      { label: "*italic*", kind: vscode.CompletionItemKind.Snippet, detail: "*text*", doc: "Italic text formatting" },
      { label: "~~strikethrough~~", kind: vscode.CompletionItemKind.Snippet, detail: "~~text~~", doc: "Strikethrough formatting" },
      { label: "`code`", kind: vscode.CompletionItemKind.Snippet, detail: "`code`", doc: "Inline code" },
      
      // === CODE BLOCKS ===
      { 
        label: "``` javascript", 
        kind: vscode.CompletionItemKind.Snippet, 
        detail: "```javascript\n\n```", 
        doc: "JavaScript code block" 
      },
      { 
        label: "``` python", 
        kind: vscode.CompletionItemKind.Snippet, 
        detail: "```python\n\n```", 
        doc: "Python code block" 
      },
      { 
        label: "``` bash", 
        kind: vscode.CompletionItemKind.Snippet, 
        detail: "```bash\n\n```", 
        doc: "Bash code block" 
      },
      { 
        label: "``` json", 
        kind: vscode.CompletionItemKind.Snippet, 
        detail: "```json\n\n```", 
        doc: "JSON code block" 
      },
      { 
        label: "``` yaml", 
        kind: vscode.CompletionItemKind.Snippet, 
        detail: "```yaml\n\n```", 
        doc: "YAML code block" 
      },
      
      // === LISTS ===
      { label: "- List item", kind: vscode.CompletionItemKind.Snippet, detail: "- item", doc: "Unordered list item" },
      { label: "* List item", kind: vscode.CompletionItemKind.Snippet, detail: "* item", doc: "Alternative unordered list" },
      { label: "1. Ordered item", kind: vscode.CompletionItemKind.Snippet, detail: "1. item", doc: "Ordered list item" },
      { label: "- [ ] Checkbox", kind: vscode.CompletionItemKind.Snippet, detail: "- [ ] task", doc: "Unchecked task list" },
      { label: "- [x] Checkbox checked", kind: vscode.CompletionItemKind.Snippet, detail: "- [x] task", doc: "Checked task list" },
      
      // === TABLES ===
      { 
        label: "Table", 
        kind: vscode.CompletionItemKind.Snippet, 
        detail: "| Column | Column |\n|--------|--------|\n| Cell   | Cell   |", 
        doc: "Markdown table" 
      },
      
      // === LINKS & IMAGES ===
      { label: "[text](url)", kind: vscode.CompletionItemKind.Snippet, detail: "[text](url)", doc: "Hyperlink" },
      { label: "![alt](image.png)", kind: vscode.CompletionItemKind.Snippet, detail: "![alt](url)", doc: "Image" },
      { label: "[reference](id)", kind: vscode.CompletionItemKind.Snippet, detail: "[ref][id]", doc: "Reference link" },
      
      // === BLOCKQUOTES ===
      { label: "> Blockquote", kind: vscode.CompletionItemKind.Snippet, detail: "> quote", doc: "Blockquote" },
      { label: "> > Nested quote", kind: vscode.CompletionItemKind.Snippet, detail: "> > quote", doc: "Nested blockquote" },
      
      // === HORIZONTAL RULE ===
      { label: "---", kind: vscode.CompletionItemKind.Snippet, detail: "---", doc: "Horizontal rule" },
      { label: "***", kind: vscode.CompletionItemKind.Snippet, detail: "***", doc: "Alternative horizontal rule" },
      
      // === COMMON PATTERNS ===
      { label: "[TOC]", kind: vscode.CompletionItemKind.Keyword, detail: "[TOC]", doc: "Table of contents (with plugin)" },
      { label: "<!-- Comment -->", kind: vscode.CompletionItemKind.Snippet, detail: "<!-- comment -->", doc: "HTML comment" },
    ];

    completions.forEach(comp => {
      const item = new vscode.CompletionItem(comp.label, comp.kind);
      item.detail = comp.detail;
      if (comp.doc) {
        item.documentation = new vscode.MarkdownString(comp.doc);
      }
      this.completionItems.push(item);
    });
  }

  /**
   * Provide completion items for Markdown
   * @param {vscode.TextDocument} document - Current document
   * @param {vscode.Position} position - Cursor position
   * @param {vscode.CancellationToken} token - Cancellation token
   * @returns {vscode.CompletionItem[]} Completion items
   */
  provideCompletionItems(document, position, token) {
    try {
      // Check cache first
      const cacheKey = `markdown-${document.uri.toString()}-${position.line}`;
      const cached = this.cache.get(cacheKey);
      if (cached) {
        return cached;
      }

      // Get line context
      const line = document.lineAt(position.line).text;
      const linePrefix = line.substring(0, position.character);
      
      // Filter completions based on context
      let filtered = this.completionItems;
      
      // If in code block, only show language specifiers
      if (linePrefix.includes("```")) {
        filtered = this.completionItems.filter(item => 
          item.label.startsWith("```")
        );
      }
      
      // If starting heading, filter to headings
      if (linePrefix.endsWith("#")) {
        filtered = this.completionItems.filter(item => 
          item.label.includes("Heading")
        );
      }
      
      // Cache and return
      this.cache.set(cacheKey, filtered);
      return filtered;
    } catch (error) {
      console.warn(`Error in Markdown completion provider: ${error.message}`);
      return this.completionItems; // Fallback to all items
    }
  }

  /**
   * Resolve completion item with additional info
   * @param {vscode.CompletionItem} item - Item to resolve
   * @returns {vscode.CompletionItem} Resolved item
   */
  resolveCompletionItem(item) {
    // Can enrich item here if needed
    return item;
  }
}

module.exports = { MarkdownCompletionProvider };
