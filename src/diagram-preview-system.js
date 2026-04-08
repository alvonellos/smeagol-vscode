"use strict";

/**
 * Diagram Preview System - PlantUML & Mermaid Support
 * 
 * Provides live diagram preview in VS Code
 * - PlantUML syntax support with preview
 * - Mermaid diagram rendering
 * - Export capabilities
 */

const vscode = require("vscode");
const path = require("path");

class DiagramPreviewSystem {
  constructor() {
    this.previewPanels = new Map();
    this.diagramCache = new Map();
    this.supportedFormats = {
      puml: "plantuml",
      plantuml: "plantuml",
      pu: "plantuml",
      mmd: "mermaid",
      mermaid: "mermaid",
    };
  }

  /**
   * Create or update diagram preview panel
   * @param {vscode.TextEditor} editor - Active editor
   * @param {vscode.ExtensionContext} context - Extension context
   * @returns {void}
   */
  async createPreviewPanel(editor, context) {
    if (!editor || !editor.document) return;

    const documentPath = editor.document.uri.fsPath;
    const format = this._getFormat(documentPath);

    if (!format) return; // Not a diagram file

    // Check if panel exists for this document
    let panel = this.previewPanels.get(documentPath);

    if (!panel) {
      panel = vscode.window.createWebviewPanel(
        `diagram-preview-${Date.now()}`,
        `Preview: ${path.basename(documentPath)}`,
        vscode.ViewColumn.Beside,
        {
          enableScripts: format === "mermaid",
          retainContextWhenHidden: true,
          localResourceRoots: [vscode.Uri.file(path.dirname(documentPath))],
        }
      );

      panel.onDidDispose(() => {
        this.previewPanels.delete(documentPath);
      });

      this.previewPanels.set(documentPath, panel);
    }

    // Update content
    const source = editor.document.getText();
    const html = await this._generatePreviewHTML(source, format, context, panel.webview);
    panel.webview.html = html;
  }

  /**
   * Generate HTML for diagram preview
   * @param {string} source - Diagram source code
   * @param {string} format - Format (plantuml or mermaid)
   * @param {vscode.ExtensionContext} context - Extension context
   * @returns {Promise<string>} HTML content
   */
  async _generatePreviewHTML(source, format, context, webview) {
    if (format === "plantuml") {
      return this._generatePlantUMLPreview(source, webview);
    } else if (format === "mermaid") {
      return this._generateMermaidPreview(source, webview);
    }
    return `<html><body>Unknown format</body></html>`;
  }

  /**
   * Generate PlantUML preview HTML
   * @param {string} source - PlantUML source
   * @returns {string} HTML content
   */
  _generatePlantUMLPreview(source, webview) {
    // Encode source for PlantUML server
    const encoded = this._encodePlantUML(source);
    const imageUrl = `https://www.plantuml.com/plantuml/svg/${encoded}`;
    const csp = [
      "default-src 'none'",
      "img-src https://www.plantuml.com data:",
      "style-src 'unsafe-inline'"
    ].join("; ");

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="${csp}">
    <style>
        body {
            margin: 0;
            padding: 20px;
            background-color: #1e1e1e;
            color: #eeeeee;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }
        .container {
            display: flex;
            flex-direction: column;
            height: 100vh;
        }
        .header {
            padding: 10px 0;
            border-bottom: 1px solid #333;
            margin-bottom: 10px;
        }
        .content {
            flex: 1;
            overflow: auto;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            padding: 20px;
        }
        .diagram {
            max-width: 100%;
            background: white;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        .error {
            color: #ff6b6b;
            padding: 20px;
            background: #331111;
            border-radius: 4px;
            border-left: 4px solid #ff6b6b;
        }
        .loading {
            color: #aaaaaa;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <strong>PlantUML Preview</strong> (auto-updates on save)
        </div>
        <div class="content">
            <img src="${imageUrl}" alt="PlantUML Diagram" class="diagram">
        </div>
    </div>
</body>
</html>
    `;
  }

  /**
   * Generate Mermaid preview HTML
   * @param {string} source - Mermaid source
   * @returns {string} HTML content
   */
  _generateMermaidPreview(source, webview) {
    const nonce = this._createNonce();
    const csp = [
      "default-src 'none'",
      "img-src data: https:",
      "style-src 'unsafe-inline'",
      `script-src 'nonce-${nonce}' https://cdn.jsdelivr.net`
    ].join("; ");

    return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta http-equiv="Content-Security-Policy" content="${csp}">
    <style>
        body {
            margin: 0;
            padding: 20px;
            background-color: #1e1e1e;
            color: #eeeeee;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
        }
        .container {
            display: flex;
            flex-direction: column;
            height: 100vh;
        }
        .header {
            padding: 10px 0;
            border-bottom: 1px solid #333;
            margin-bottom: 10px;
        }
        .content {
            flex: 1;
            overflow: auto;
            display: flex;
            justify-content: center;
            align-items: flex-start;
            padding: 20px;
        }
        .mermaid {
            background: white;
            padding: 20px;
            border-radius: 4px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }
        .error {
            color: #ff6b6b;
            padding: 20px;
            background: #331111;
            border-radius: 4px;
            border-left: 4px solid #ff6b6b;
        }
    </style>
    <script nonce="${nonce}" src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"><\/script>
    <script nonce="${nonce}">
        mermaid.initialize({ startOnLoad: true, theme: 'light' });
    <\/script>
</head>
<body>
    <div class="container">
        <div class="header">
            <strong>Mermaid Preview</strong> (auto-updates on save)
        </div>
        <div class="content">
            <div class="mermaid">
${this._escapeMermaidSource(source)}
            </div>
        </div>
    </div>
    <script nonce="${nonce}">
        mermaid.contentLoaded();
    <\/script>
</body>
</html>
    `;
  }

  _createNonce() {
    return `${Date.now()}${Math.random().toString(16).slice(2)}`;
  }

  /**
   * Encode PlantUML source for URL
   * @param {string} source - PlantUML source
   * @returns {string} Encoded string
   */
  _encodePlantUML(source) {
    // Simple deflate-based encoding (production would use proper library)
    // For now, use base64 as fallback
    const encoded = Buffer.from(source).toString("base64");
    return encoded;
  }

  /**
   * Escape Mermaid source for HTML
   * @param {string} source - Source code
   * @returns {string} Escaped source
   */
  _escapeMermaidSource(source) {
    return source
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /**
   * Get file format from path
   * @param {string} filepath - File path
   * @returns {string|null} Format type or null
   */
  _getFormat(filepath) {
    const ext = path.extname(filepath).toLowerCase().substring(1);
    return this.supportedFormats[ext] || null;
  }

  /**
   * Export diagram as image
   * @param {string} source - Diagram source
   * @param {string} format - Source format (puml or mmd)
   * @param {string} outputPath - Output file path
   * @param {string} outputFormat - Output format (png, svg, etc.)
   * @returns {Promise<void>}
   */
  async exportDiagram(source, format, outputPath, outputFormat = "svg") {
    // Placeholder for actual export logic
    // Would integrate with PlantUML server or local renderer
    console.log(
      `Exporting ${format} diagram to ${outputPath} as ${outputFormat}`
    );
  }

  /**
   * Cleanup resources
   * @returns {void}
   */
  dispose() {
    for (const panel of this.previewPanels.values()) {
      panel.dispose();
    }
    this.previewPanels.clear();
    this.diagramCache.clear();
  }
}

module.exports = { DiagramPreviewSystem };
