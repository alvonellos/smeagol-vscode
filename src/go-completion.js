"use strict";

const vscode = require("vscode");
const { CompletionCache } = require("./completion-cache");

/**
 * Go Completion Provider
 * Smart completions for Go programs including:
 * - Standard library packages (fmt, io, net, etc.)
 * - Concurrency patterns (goroutines, channels, sync)
 * - Error handling patterns
 * - Common Go idioms
 * 
 * Optimized with caching for high performance
 */
class GoCompletionProvider {
  constructor() {
    this.completionItems = [];
    this.cache = new CompletionCache(300, 5 * 60 * 1000); // 300 items, 5min TTL
    this.initialize();
  }

  /**
   * Initialize Go completion items
   */
  initialize() {
    const completions = [
      // === STDLIB PACKAGES ===
      { label: "import (", kind: vscode.CompletionItemKind.Keyword, detail: "import (...)", doc: "Import multiple packages" },
      { label: "fmt", kind: vscode.CompletionItemKind.Module, detail: "import \"fmt\"", doc: "Formatted I/O package" },
      { label: "io", kind: vscode.CompletionItemKind.Module, detail: "import \"io\"", doc: "I/O primitives" },
      { label: "net", kind: vscode.CompletionItemKind.Module, detail: "import \"net\"", doc: "Network operations" },
      { label: "net/http", kind: vscode.CompletionItemKind.Module, detail: "import \"net/http\"", doc: "HTTP client/server" },
      { label: "os", kind: vscode.CompletionItemKind.Module, detail: "import \"os\"", doc: "Operating system operations" },
      { label: "sync", kind: vscode.CompletionItemKind.Module, detail: "import \"sync\"", doc: "Synchronization primitives" },
      { label: "time", kind: vscode.CompletionItemKind.Module, detail: "import \"time\"", doc: "Time and duration" },
      { label: "encoding/json", kind: vscode.CompletionItemKind.Module, detail: "import \"encoding/json\"", doc: "JSON encoding/decoding" },
      { label: "errors", kind: vscode.CompletionItemKind.Module, detail: "import \"errors\"", doc: "Error handling" },
      { label: "context", kind: vscode.CompletionItemKind.Module, detail: "import \"context\"", doc: "Context for cancellation" },
      { label: "log", kind: vscode.CompletionItemKind.Module, detail: "import \"log\"", doc: "Logging" },
      { label: "strings", kind: vscode.CompletionItemKind.Module, detail: "import \"strings\"", doc: "String manipulation" },
      { label: "regexp", kind: vscode.CompletionItemKind.Module, detail: "import \"regexp\"", doc: "Regular expressions" },
      
      // === KEYWORDS ===
      { label: "func", kind: vscode.CompletionItemKind.Keyword, detail: "func name() { }", doc: "Function declaration" },
      { label: "package", kind: vscode.CompletionItemKind.Keyword, detail: "package main", doc: "Package declaration" },
      { label: "type", kind: vscode.CompletionItemKind.Keyword, detail: "type Name struct { }", doc: "Type definition" },
      { label: "interface", kind: vscode.CompletionItemKind.Keyword, detail: "type Name interface { }", doc: "Interface definition" },
      { label: "struct", kind: vscode.CompletionItemKind.Keyword, detail: "struct { }", doc: "Struct type" },
      { label: "defer", kind: vscode.CompletionItemKind.Keyword, detail: "defer fn()", doc: "Defer execution" },
      { label: "go", kind: vscode.CompletionItemKind.Keyword, detail: "go fn()", doc: "Launch goroutine" },
      { label: "select", kind: vscode.CompletionItemKind.Keyword, detail: "select { }", doc: "Channel selection" },
      { label: "case", kind: vscode.CompletionItemKind.Keyword, detail: "case val:", doc: "Case clause" },
      { label: "chan", kind: vscode.CompletionItemKind.Keyword, detail: "chan Type", doc: "Channel type" },
      
      // === CONCURRENCY PATTERNS ===
      { label: "go func() {}", kind: vscode.CompletionItemKind.Snippet, detail: "go func() { }()", doc: "Goroutine with anonymous function" },
      { label: "make(chan)", kind: vscode.CompletionItemKind.Snippet, detail: "make(chan Type)", doc: "Create buffered channel" },
      { label: "select {", kind: vscode.CompletionItemKind.Snippet, detail: "select { case ch: }", doc: "Channel selection" },
      { label: "sync.Mutex", kind: vscode.CompletionItemKind.Class, detail: "sync.Mutex", doc: "Mutual exclusion lock" },
      { label: "sync.RWMutex", kind: vscode.CompletionItemKind.Class, detail: "sync.RWMutex", doc: "Reader-writer mutex" },
      { label: "sync.WaitGroup", kind: vscode.CompletionItemKind.Class, detail: "sync.WaitGroup", doc: "Wait for goroutines" },
      
      // === ERROR HANDLING ===
      { label: "if err != nil {", kind: vscode.CompletionItemKind.Snippet, detail: "if err != nil { }", doc: "Error check" },
      { label: "errors.New()", kind: vscode.CompletionItemKind.Function, detail: "errors.New(\"message\")", doc: "Create error" },
      { label: "fmt.Errorf()", kind: vscode.CompletionItemKind.Function, detail: "fmt.Errorf(\"format\", args)", doc: "Formatted error" },
      { label: "panic()", kind: vscode.CompletionItemKind.Function, detail: "panic(\"message\")", doc: "Panic and recover" },
      { label: "recover()", kind: vscode.CompletionItemKind.Function, detail: "recover()", doc: "Recover from panic" },
      
      // === COMMON PATTERNS ===
      { label: "func main() {", kind: vscode.CompletionItemKind.Snippet, detail: "func main() { }", doc: "Main entry point" },
      { label: "func (r *Receiver)", kind: vscode.CompletionItemKind.Snippet, detail: "func (r *Receiver) Method() { }", doc: "Method definition" },
      { label: "func (r Receiver)", kind: vscode.CompletionItemKind.Snippet, detail: "func (r Receiver) Method() { }", doc: "Value receiver method" },
      { label: "var", kind: vscode.CompletionItemKind.Keyword, detail: "var name Type", doc: "Variable declaration" },
      { label: "const", kind: vscode.CompletionItemKind.Keyword, detail: "const name = value", doc: "Constant declaration" },
      { label: ":=", kind: vscode.CompletionItemKind.Operator, detail: "name := value", doc: "Short variable declaration" },
      
      // === STRUCT/INTERFACE ===
      { label: "type Reader interface {", kind: vscode.CompletionItemKind.Snippet, detail: "type Reader interface { Read([]byte) (int, error) }", doc: "Interface definition" },
      { label: "type Writer interface {", kind: vscode.CompletionItemKind.Snippet, detail: "type Writer interface { Write([]byte) (int, error) }", doc: "Writer interface" },
      { label: "json.Marshal()", kind: vscode.CompletionItemKind.Function, detail: "json.Marshal(v)", doc: "Marshal to JSON" },
      { label: "json.Unmarshal()", kind: vscode.CompletionItemKind.Function, detail: "json.Unmarshal([]byte, &v)", doc: "Unmarshal from JSON" },
      
      // === HTTP ===
      { label: "http.HandleFunc()", kind: vscode.CompletionItemKind.Function, detail: "http.HandleFunc(\"/path\", handler)", doc: "Register HTTP handler" },
      { label: "http.ListenAndServe()", kind: vscode.CompletionItemKind.Function, detail: "http.ListenAndServe(\":8080\", nil)", doc: "Start HTTP server" },
      { label: "http.Get()", kind: vscode.CompletionItemKind.Function, detail: "http.Get(url)", doc: "HTTP GET request" },
      { label: "http.Post()", kind: vscode.CompletionItemKind.Function, detail: "http.Post(url, type, body)", doc: "HTTP POST request" },
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
   * Provide completion items for Go
   * @param {vscode.TextDocument} document - Current document
   * @param {vscode.Position} position - Cursor position
   * @param {vscode.CancellationToken} token - Cancellation token
   * @returns {vscode.CompletionItem[]} Completion items
   */
  provideCompletionItems(document, position, token) {
    try {
      // Check cache first
      const cacheKey = `go-${document.uri.toString()}-${position.line}`;
      const cached = this.cache.get(cacheKey);
      if (cached) {
        return cached;
      }

      // Get line context
      const line = document.lineAt(position.line).text;
      const linePrefix = line.substring(0, position.character);
      
      // Filter based on context
      let filtered = this.completionItems;
      
      // In import section, show only packages
      if (linePrefix.includes("import")) {
        filtered = this.completionItems.filter(item => 
          item.kind === vscode.CompletionItemKind.Module
        );
      }
      
      // In function definition, filter accordingly
      if (linePrefix.includes("func")) {
        filtered = this.completionItems.filter(item => 
          item.kind === vscode.CompletionItemKind.Snippet ||
          item.kind === vscode.CompletionItemKind.Keyword
        );
      }
      
      // Cache and return
      this.cache.set(cacheKey, filtered);
      return filtered;
    } catch (error) {
      console.warn(`Error in Go completion provider: ${error.message}`);
      return this.completionItems; // Fallback
    }
  }

  /**
   * Resolve completion item with additional info
   * @param {vscode.CompletionItem} item - Item to resolve
   * @returns {vscode.CompletionItem} Resolved item
   */
  resolveCompletionItem(item) {
    return item;
  }
}

module.exports = { GoCompletionProvider };
