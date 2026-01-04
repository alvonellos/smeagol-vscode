"use strict";

const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

/**
 * Smeagol Symbol Summoning System
 * Visualizes all symbols (APL, Python, Java) as a wordcloud
 * "My precious... all my symbols gathered in one place!"
 */
class SymbolSummoner {
  constructor() {
    this.panel = null;
  }

  /**
   * Summon all symbols from workspace and display as wordcloud
   */
  async summonSymbols() {
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!workspaceRoot) {
      vscode.window.showErrorMessage("No workspace folder open");
      return;
    }

    // Gather symbols
    const symbols = {
      apl: this.getAPLSymbols(),
      python: this.getPythonSymbols(),
      java: this.getJavaSymbols(),
      rust: this.getRustSymbols(),
      discovered: {}
    };

    // Scan workspace for actual symbols
    const files = await vscode.workspace.findFiles("**/*", "**/node_modules/**");
    for (const file of files.slice(0, 100)) {
      try {
        const doc = await vscode.workspace.openTextDocument(file);
        const ext = path.extname(file.fsPath);
        
        if (ext === ".apl") symbols.discovered.apl = await this.discoverSymbols(doc, "apl");
        else if (ext === ".py") symbols.discovered.python = await this.discoverSymbols(doc, "python");
        else if (ext === ".java") symbols.discovered.java = await this.discoverSymbols(doc, "java");
      } catch (e) {
        // Skip
      }
    }

    this.showWordCloud(symbols);
  }

  /**
   * Get all APL symbols
   */
  getAPLSymbols() {
    return {
      operators: ["⍴", "⌽", "⍒", "⍋", "⊖", ",", "↑", "↓", "⊂", "⊃", "∪", "∩", "⍳"],
      functions: ["⍕", "⍎", "/", "\\", ".", "@", "⍨", "¨"],
      monadic: ["¬", "-", "+", "×", "÷", "⌈", "⌊", "|", "⋆", "⍟", "○", "!"],
      system: ["⎕CR", "⎕NC", "⎕NL", "⎕WS", "⎕IO", "⎕TS"]
    };
  }

  /**
   * Get all Python symbols
   */
  getPythonSymbols() {
    return {
      builtins: ["print", "len", "range", "map", "filter", "lambda", "def", "class", "import"],
      decorators: ["@property", "@staticmethod", "@classmethod", "@decorator", "@cache"],
      async: ["async", "await", "asyncio", "concurrent"],
      types: ["int", "str", "list", "dict", "tuple", "set", "bool", "float"],
      keywords: ["if", "else", "for", "while", "try", "except", "finally", "with", "yield"]
    };
  }

  /**
   * Get all Java symbols
   */
  getJavaSymbols() {
    return {
      keywords: ["public", "private", "protected", "static", "final", "abstract", "class", "interface"],
      annotations: ["@Override", "@Deprecated", "@SuppressWarnings", "@FunctionalInterface", "@SafeVarargs"],
      types: ["String", "Integer", "List", "Map", "Set", "Optional", "Stream", "Function"],
      control: ["if", "else", "switch", "case", "for", "while", "do", "try", "catch"],
      collections: ["ArrayList", "HashMap", "HashSet", "LinkedList", "PriorityQueue"]
    };
  }

  /**
   * Get Rust symbols
   */
  getRustSymbols() {
    return {
      keywords: ["fn", "let", "mut", "const", "static", "struct", "enum", "trait", "impl"],
      types: ["i32", "u32", "i64", "u64", "f32", "f64", "String", "Vec", "Option", "Result"],
      macros: ["println!", "vec!", "format!", "panic!", "unwrap!", "expect!", "assert!"],
      traits: ["Iterator", "IntoIterator", "Clone", "Copy", "Debug", "Display", "Default"]
    };
  }

  /**
   * Discover actual symbols in file
   */
  async discoverSymbols(document, language) {
    const text = document.getText();
    const symbols = new Set();

    // Extract identifiers based on language
    if (language === "apl") {
      const matches = text.match(/[⍴⌽⍒⍋⊖,↑↓⊂⊃∪∩⍳⍕⍎/\\\.@⍨¨:]/g) || [];
      matches.forEach(m => symbols.add(m));
    } else if (language === "python") {
      const matches = text.match(/\b(def|class|import|from|async|await|lambda|@\w+)\b/g) || [];
      matches.forEach(m => symbols.add(m));
    } else if (language === "java") {
      const matches = text.match(/\b(class|interface|@\w+|public|private|protected|static|final)\b/g) || [];
      matches.forEach(m => symbols.add(m));
    }

    return Array.from(symbols);
  }

  /**
   * Display wordcloud in webview panel
   */
  showWordCloud(symbols) {
    if (this.panel) {
      this.panel.dispose();
    }

    this.panel = vscode.window.createWebviewPanel(
      "smeagolWordcloud",
      "Smeagol Symbol Summoning",
      vscode.ViewColumn.Beside,
      { enableScripts: true }
    );

    const html = this.generateWordCloudHTML(symbols);
    this.panel.webview.html = html;

    this.panel.onDidDispose(() => {
      this.panel = null;
    });
  }

  /**
   * Generate HTML for wordcloud visualization
   */
  generateWordCloudHTML(symbols) {
    // Combine all symbols with sizes
    const allSymbols = [];
    
    Object.entries(symbols.apl).forEach(([key, syms]) => {
      syms.forEach(s => allSymbols.push({ text: s, size: Math.random() * 40 + 20, color: "#ff00ff", lang: "APL" }));
    });

    Object.entries(symbols.python).forEach(([key, syms]) => {
      syms.forEach(s => allSymbols.push({ text: s, size: Math.random() * 35 + 15, color: "#3776ab", lang: "Python" }));
    });

    Object.entries(symbols.java).forEach(([key, syms]) => {
      syms.forEach(s => allSymbols.push({ text: s, size: Math.random() * 35 + 15, color: "#007396", lang: "Java" }));
    });

    Object.entries(symbols.rust).forEach(([key, syms]) => {
      syms.forEach(s => allSymbols.push({ text: s, size: Math.random() * 30 + 12, color: "#ce422b", lang: "Rust" }));
    });

    // Shuffle symbols
    allSymbols.sort(() => Math.random() - 0.5);

    const symbolsHTML = allSymbols
      .map((sym, i) => `
        <span class="symbol" style="font-size: ${sym.size}px; color: ${sym.color}; opacity: ${0.6 + Math.random() * 0.4}; animation-delay: ${i * 50}ms;">
          ${sym.text}
        </span>
      `)
      .join("");

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Smeagol Symbol Summoning</title>
        <style>
          * { margin: 0; padding: 0; }
          body {
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
            font-family: monospace;
            color: #fff;
            padding: 20px;
            overflow: hidden;
            height: 100vh;
          }
          
          .container {
            display: flex;
            flex-direction: column;
            height: 100%;
          }
          
          .header {
            text-align: center;
            margin-bottom: 20px;
            text-shadow: 0 0 20px #ff00ff;
          }
          
          .header h1 {
            font-size: 24px;
            color: #ff00ff;
            margin-bottom: 5px;
            text-transform: uppercase;
            letter-spacing: 2px;
          }
          
          .header p {
            color: #00ff00;
            font-style: italic;
            font-size: 12px;
          }
          
          .wordcloud {
            flex: 1;
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            align-content: flex-start;
            overflow-y: auto;
            justify-content: center;
            padding: 20px;
          }
          
          .symbol {
            display: inline-block;
            padding: 5px 10px;
            border-radius: 4px;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid;
            border-color: currentColor;
            cursor: pointer;
            transition: all 0.3s ease;
            animation: fadeInScale 0.6s ease-out forwards;
            user-select: none;
            font-weight: bold;
            letter-spacing: 1px;
          }
          
          .symbol:hover {
            transform: scale(1.3) rotate(5deg);
            background: rgba(255, 255, 255, 0.15);
            text-shadow: 0 0 10px currentColor;
            filter: brightness(1.3);
          }
          
          @keyframes fadeInScale {
            from {
              opacity: 0;
              transform: scale(0) rotate(-180deg);
            }
            to {
              opacity: 1;
              transform: scale(1) rotate(0deg);
            }
          }
          
          .legend {
            display: flex;
            gap: 20px;
            padding-top: 15px;
            border-top: 1px solid #333;
            font-size: 11px;
            justify-content: center;
          }
          
          .legend-item {
            display: flex;
            align-items: center;
            gap: 5px;
          }
          
          .legend-color {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 2px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>⟐ Smeagol's Symbol Summoning ⟐</h1>
            <p>"My precious... all my symbols gathered in one place!"</p>
          </div>
          
          <div class="wordcloud">
            ${symbolsHTML}
          </div>
          
          <div class="legend">
            <div class="legend-item">
              <div class="legend-color" style="background: #ff00ff;"></div>
              <span>APL</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background: #3776ab;"></div>
              <span>Python</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background: #007396;"></div>
              <span>Java</span>
            </div>
            <div class="legend-item">
              <div class="legend-color" style="background: #ce422b;"></div>
              <span>Rust</span>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  dispose() {
    if (this.panel) {
      this.panel.dispose();
    }
  }
}

module.exports = { SymbolSummoner };
