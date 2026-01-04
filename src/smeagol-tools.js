"use strict";

const vscode = require("vscode");
const path = require("path");
const fs = require("fs");

/**
 * Smeagol Tools Module
 * Utility commands for project analysis, documentation, and metrics
 */
class SmeagolTools {
  constructor() {
    this.commands = [];
  }

  /**
   * Register all Smeagol tools as commands
   */
  register(context) {
    // Tool 1: Create Concordance
    this.commands.push(
      vscode.commands.registerCommand("smeagol.createConcordance", async () => {
        await this.createConcordance();
      })
    );

    // Tool 2: Detect Languages
    this.commands.push(
      vscode.commands.registerCommand("smeagol.detectLanguages", async () => {
        await this.detectLanguages();
      })
    );

    // Tool 3: Analyze Metrics
    this.commands.push(
      vscode.commands.registerCommand("smeagol.analyzeMetrics", async () => {
        await this.analyzeMetrics();
      })
    );

    // Tool 4: Search Symbols
    this.commands.push(
      vscode.commands.registerCommand("smeagol.searchSymbols", async () => {
        await this.searchSymbols();
      })
    );

    // Tool 5: Generate Documentation
    this.commands.push(
      vscode.commands.registerCommand("smeagol.documentWorkspace", async () => {
        await this.documentWorkspace();
      })
    );

    // Tool 6: Project Health Report
    this.commands.push(
      vscode.commands.registerCommand("smeagol.projectHealthReport", async () => {
        await this.projectHealthReport();
      })
    );

    context.subscriptions.push(...this.commands);
  }

  /**
   * Create project concordance (index of all symbols and patterns)
   */
  async createConcordance() {
    try {
      const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
      if (!workspaceRoot) {
        vscode.window.showErrorMessage("No workspace folder open");
        return;
      }

      const files = await vscode.workspace.findFiles("**/*", "**/node_modules/**");
      const concordance = {
        symbols: {},
        patterns: {},
        files: [],
        statistics: {
          totalFiles: files.length,
          totalSymbols: 0,
          languages: {}
        }
      };

      for (const file of files.slice(0, 100)) { // Limit to first 100 files for performance
        try {
          const document = await vscode.workspace.openTextDocument(file);
          const text = document.getText();
          const ext = path.extname(file.fsPath);

          // Track language
          if (!concordance.statistics.languages[ext]) {
            concordance.statistics.languages[ext] = 0;
          }
          concordance.statistics.languages[ext]++;

          // Extract symbols (functions, classes, variables)
          const symbols = this.extractSymbols(text, document.languageId);
          symbols.forEach(sym => {
            if (!concordance.symbols[sym.name]) {
              concordance.symbols[sym.name] = [];
            }
            concordance.symbols[sym.name].push({
              file: file.fsPath.replace(workspaceRoot, ""),
              line: sym.line,
              type: sym.type
            });
            concordance.statistics.totalSymbols++;
          });

          concordance.files.push({
            path: file.fsPath.replace(workspaceRoot, ""),
            language: document.languageId,
            symbols: symbols.length
          });
        } catch (e) {
          // Skip unreadable files
        }
      }

      const message = `Concordance created: ${concordance.statistics.totalSymbols} symbols, ${concordance.files.length} files`;
      vscode.window.showInformationMessage(`✓ ${message}`);
    } catch (error) {
      vscode.window.showErrorMessage(`Concordance creation failed: ${error.message}`);
    }
  }

  /**
   * Extract symbols from code text
   */
  extractSymbols(text, language) {
    const symbols = [];
    const lines = text.split("\n");

    const patterns = {
      function: [
        /\bfunction\s+(\w+)/g,
        /\bdef\s+(\w+)/g,
        /\bfn\s+(\w+)/g,
        /\bfunc\s+(\w+)/g
      ],
      class: [
        /\bclass\s+(\w+)/g,
        /\binterface\s+(\w+)/g,
        /\bstruct\s+(\w+)/g
      ]
    };

    lines.forEach((line, index) => {
      Object.entries(patterns).forEach(([type, patternList]) => {
        patternList.forEach(pattern => {
          let match;
          while ((match = pattern.exec(line)) !== null) {
            symbols.push({
              name: match[1],
              type: type,
              line: index + 1
            });
          }
        });
      });
    });

    return symbols;
  }

  /**
   * Detect languages in workspace
   */
  async detectLanguages() {
    try {
      const files = await vscode.workspace.findFiles("**/*", "**/node_modules/**");
      const languages = {};

      files.forEach(file => {
        const ext = path.extname(file.fsPath);
        if (ext) {
          languages[ext] = (languages[ext] || 0) + 1;
        }
      });

      const langList = Object.entries(languages)
        .map(([ext, count]) => `${ext}: ${count} files`)
        .join("\n");

      vscode.window.showInformationMessage(`✓ Languages detected:\n${langList}`);
    } catch (error) {
      vscode.window.showErrorMessage(`Language detection failed: ${error.message}`);
    }
  }

  /**
   * Analyze project metrics
   */
  async analyzeMetrics() {
    try {
      const files = await vscode.workspace.findFiles("**/*", "**/node_modules/**");
      let totalLines = 0;
      let totalFunctions = 0;
      let totalClasses = 0;
      let totalComments = 0;

      for (const file of files.slice(0, 200)) {
        try {
          const document = await vscode.workspace.openTextDocument(file);
          const text = document.getText();

          totalLines += text.split("\n").length;
          totalFunctions += (text.match(/\bfunction\b|\bdef\b|\bfn\b|\bfunc\b/g) || []).length;
          totalClasses += (text.match(/\bclass\b|\binterface\b|\bstruct\b/g) || []).length;
          totalComments += (text.match(/\/\/|#|\/\*/g) || []).length;
        } catch (e) {
          // Skip
        }
      }

      const metrics = `
✓ Project Metrics:
  Files: ${files.length}
  Lines of Code: ${totalLines}
  Functions: ${totalFunctions}
  Classes: ${totalClasses}
  Comments: ${totalComments}
  Avg Lines/File: ${Math.round(totalLines / files.length)}
  Doc Ratio: ${((totalComments / totalLines) * 100).toFixed(1)}%
      `;

      vscode.window.showInformationMessage(metrics.trim());
    } catch (error) {
      vscode.window.showErrorMessage(`Metrics analysis failed: ${error.message}`);
    }
  }

  /**
   * Search for symbols across workspace
   */
  async searchSymbols() {
    const query = await vscode.window.showInputBox({
      prompt: "Enter symbol name to search",
      placeHolder: "e.g., handleClick, processData"
    });

    if (!query) return;

    try {
      const results = await vscode.workspace.findFiles("**/*", "**/node_modules/**");
      const matches = [];

      for (const file of results.slice(0, 100)) {
        try {
          const document = await vscode.workspace.openTextDocument(file);
          const text = document.getText();
          const lines = text.split("\n");

          lines.forEach((line, index) => {
            if (line.includes(query)) {
              matches.push({
                file: file.fsPath,
                line: index + 1,
                content: line.trim()
              });
            }
          });
        } catch (e) {
          // Skip
        }
      }

      if (matches.length > 0) {
        const message = matches
          .slice(0, 10)
          .map(m => `${m.file}:${m.line}: ${m.content}`)
          .join("\n");
        vscode.window.showInformationMessage(`✓ Found ${matches.length} matches:\n${message}`);
      } else {
        vscode.window.showInformationMessage(`✗ No matches found for "${query}"`);
      }
    } catch (error) {
      vscode.window.showErrorMessage(`Symbol search failed: ${error.message}`);
    }
  }

  /**
   * Generate workspace documentation
   */
  async documentWorkspace() {
    try {
      const files = await vscode.workspace.findFiles("**/*", "**/node_modules/**");
      const doc = {
        title: path.basename(vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || "Project"),
        generated: new Date().toISOString(),
        files: [],
        structure: {}
      };

      for (const file of files.slice(0, 50)) {
        try {
          const document = await vscode.workspace.openTextDocument(file);
          const symbols = this.extractSymbols(document.getText(), document.languageId);

          doc.files.push({
            path: file.fsPath,
            language: document.languageId,
            symbols: symbols
          });
        } catch (e) {
          // Skip
        }
      }

      vscode.window.showInformationMessage(
        `✓ Documentation generated for ${doc.files.length} files\n` +
        `${doc.files.reduce((sum, f) => sum + f.symbols.length, 0)} total symbols`
      );
    } catch (error) {
      vscode.window.showErrorMessage(`Documentation generation failed: ${error.message}`);
    }
  }

  /**
   * Generate project health report
   */
  async projectHealthReport() {
    try {
      const files = await vscode.workspace.findFiles("**/*", "**/node_modules/**");
      const report = {
        timestamp: new Date().toISOString(),
        health: "GOOD",
        score: 85,
        issues: [],
        recommendations: []
      };

      // Check for common issues
      let hasTests = false;
      let hasReadme = false;
      let hasGitIgnore = false;
      let hasDocs = false;

      files.forEach(file => {
        const name = path.basename(file.fsPath);
        if (name.includes("test") || name.includes("spec")) hasTests = true;
        if (name === "README.md") hasReadme = true;
        if (name === ".gitignore") hasGitIgnore = true;
        if (name.includes("doc") || name.includes("guide")) hasDocs = true;
      });

      if (!hasTests) {
        report.issues.push("No test files detected");
        report.score -= 15;
      }
      if (!hasReadme) {
        report.issues.push("No README.md found");
        report.score -= 10;
      }
      if (!hasGitIgnore) {
        report.issues.push("No .gitignore found");
        report.score -= 5;
      }
      if (!hasDocs) {
        report.recommendations.push("Add documentation files");
      }

      report.health = report.score >= 80 ? "GOOD" : report.score >= 60 ? "FAIR" : "POOR";

      const message = `
Health Report: ${report.health} (${report.score}/100)
Issues: ${report.issues.length > 0 ? report.issues.join(", ") : "None"}
Recommendations: ${report.recommendations.length > 0 ? report.recommendations.join(", ") : "None"}
      `;

      vscode.window.showInformationMessage(message.trim());
    } catch (error) {
      vscode.window.showErrorMessage(`Health report failed: ${error.message}`);
    }
  }

  /**
   * Dispose all commands
   */
  dispose() {
    this.commands.forEach(cmd => cmd.dispose());
  }
}

module.exports = { SmeagolTools };
