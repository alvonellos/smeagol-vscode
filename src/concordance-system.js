"use strict";

const vscode = require("vscode");
const path = require("path");
const fs = require("fs");

/**
 * Smeagol Concordance System
 * Manages .smeagol folder for project metadata, language tracking, and boilerplate
 */
class ConcordanceSystem {
  constructor(workspaceRoot) {
    this.workspaceRoot = workspaceRoot;
    this.smeagolDir = path.join(workspaceRoot, ".smeagol");
  }

  /**
   * Initialize the .smeagol project structure
   */
  async initialize() {
    try {
      if (!fs.existsSync(this.smeagolDir)) {
        fs.mkdirSync(this.smeagolDir, { recursive: true });
      }

      // Create default config
      const configPath = path.join(this.smeagolDir, "config.json");
      if (!fs.existsSync(configPath)) {
        const config = {
          version: "1.0.0",
          projectName: path.basename(this.workspaceRoot),
          created: new Date().toISOString(),
          description: "Smeagol project metadata and configuration",
          languages: [],
          tools: {
            concordance: true,
            sonarqube: false,
            aiDsl: false
          }
        };
        fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
      }

      // Create languages registry
      const languagesPath = path.join(this.smeagolDir, "languages.json");
      if (!fs.existsSync(languagesPath)) {
        const languages = {
          detected: [],
          registered: [],
          mappings: {
            js: { name: "JavaScript", extensions: [".js", ".jsx", ".mjs"], type: "scripting" },
            py: { name: "Python", extensions: [".py", ".pyw"], type: "scripting" },
            java: { name: "Java", extensions: [".java"], type: "compiled" },
            rs: { name: "Rust", extensions: [".rs"], type: "compiled" },
            ts: { name: "TypeScript", extensions: [".ts", ".tsx"], type: "scripting" },
            go: { name: "Go", extensions: [".go"], type: "compiled" },
            cpp: { name: "C++", extensions: [".cpp", ".cc", ".cxx", ".h"], type: "compiled" },
            cs: { name: "C#", extensions: [".cs"], type: "compiled" },
            rb: { name: "Ruby", extensions: [".rb"], type: "scripting" },
            php: { name: "PHP", extensions: [".php"], type: "scripting" },
            apl: { name: "APL", extensions: [".apl"], type: "functional" },
            sh: { name: "Shell", extensions: [".sh", ".bash"], type: "scripting" }
          }
        };
        fs.writeFileSync(languagesPath, JSON.stringify(languages, null, 2));
      }

      // Create sonarqube config template
      const sonarPath = path.join(this.smeagolDir, "sonarqube.json");
      if (!fs.existsSync(sonarPath)) {
        const sonarqube = {
          enabled: false,
          projectKey: path.basename(this.workspaceRoot),
          host: "http://localhost:9000",
          token: "",
          rules: {
            enabled: true,
            severity: "MAJOR",
            ignoreProjects: []
          }
        };
        fs.writeFileSync(sonarPath, JSON.stringify(sonarqube, null, 2));
      }

      // Create AI DSL rules template
      const aiDslPath = path.join(this.smeagolDir, "ai-dsl-rules.json");
      if (!fs.existsSync(aiDslPath)) {
        const aiDsl = {
          rules: [
            {
              name: "code-generation",
              enabled: true,
              actions: ["generate function", "generate class", "generate test"],
              languages: ["python", "javascript", "java", "rust"]
            },
            {
              name: "documentation",
              enabled: true,
              actions: ["generate docs", "generate docstring", "generate comments"],
              languages: "all"
            },
            {
              name: "refactoring",
              enabled: true,
              actions: ["extract method", "rename variable", "simplify logic"],
              languages: "all"
            },
            {
              name: "testing",
              enabled: true,
              actions: ["generate tests", "generate fixtures", "generate mocks"],
              languages: ["python", "javascript", "java", "rust", "go"]
            }
          ],
          defaultLanguage: "english",
          constraintValidation: true
        };
        fs.writeFileSync(aiDslPath, JSON.stringify(aiDsl, null, 2));
      }

      // Create concordance.json (word/pattern index)
      const concordancePath = path.join(this.smeagolDir, "concordance.json");
      if (!fs.existsSync(concordancePath)) {
        const concordance = {
          version: "1.0.0",
          generatedAt: new Date().toISOString(),
          statistics: {
            totalFiles: 0,
            totalLines: 0,
            totalFunctions: 0,
            totalClasses: 0
          },
          index: {},
          patterns: {},
          symbols: {}
        };
        fs.writeFileSync(concordancePath, JSON.stringify(concordance, null, 2));
      }

      vscode.window.showInformationMessage("✓ Smeagol project initialized in .smeagol/");
      return true;
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to initialize Smeagol project: ${error.message}`);
      return false;
    }
  }

  /**
   * Scan workspace and detect languages
   */
  async detectLanguages() {
    try {
      const files = await vscode.workspace.findFiles("**/*");
      const extensions = new Map();

      files.forEach(file => {
        const ext = path.extname(file.fsPath);
        if (ext) {
          extensions.set(ext, (extensions.get(ext) || 0) + 1);
        }
      });

      const languages = JSON.parse(
        fs.readFileSync(path.join(this.smeagolDir, "languages.json"), "utf8")
      );

      const detected = [];
      Object.entries(languages.mappings).forEach(([key, langDef]) => {
        langDef.extensions.forEach(ext => {
          if (extensions.has(ext)) {
            detected.push({
              code: key,
              name: langDef.name,
              type: langDef.type,
              fileCount: extensions.get(ext),
              extensions: langDef.extensions
            });
          }
        });
      });

      // Update languages.json
      languages.detected = detected;
      fs.writeFileSync(
        path.join(this.smeagolDir, "languages.json"),
        JSON.stringify(languages, null, 2)
      );

      return detected;
    } catch (error) {
      vscode.window.showErrorMessage(`Language detection failed: ${error.message}`);
      return [];
    }
  }

  /**
   * Generate concordance index from project
   */
  async generateConcordance() {
    try {
      const files = await vscode.workspace.findFiles("**/*", "**/node_modules/**");
      const concordance = {
        version: "1.0.0",
        generatedAt: new Date().toISOString(),
        statistics: {
          totalFiles: files.length,
          totalLines: 0,
          totalFunctions: 0,
          totalClasses: 0
        },
        index: {},
        patterns: {},
        symbols: {}
      };

      let totalLines = 0;
      let totalFunctions = 0;
      let totalClasses = 0;

      for (const file of files) {
        if (file.fsPath.includes("node_modules") || file.fsPath.includes(".git")) continue;

        try {
          const document = await vscode.workspace.openTextDocument(file);
          const text = document.getText();
          const lines = text.split("\n").length;

          totalLines += lines;

          // Count functions and classes
          const funcMatches = text.match(/\b(function|def|fn|func|method)\s+\w+\s*\(/g) || [];
          const classMatches = text.match(/\b(class|interface|struct)\s+\w+/g) || [];

          totalFunctions += funcMatches.length;
          totalClasses += classMatches.length;

          // Index file
          concordance.index[file.fsPath] = {
            lines: lines,
            functions: funcMatches.length,
            classes: classMatches.length,
            lastModified: new Date().toISOString()
          };
        } catch (e) {
          // Skip binary or unreadable files
        }
      }

      concordance.statistics = {
        totalFiles: files.length,
        totalLines,
        totalFunctions,
        totalClasses
      };

      fs.writeFileSync(
        path.join(this.smeagolDir, "concordance.json"),
        JSON.stringify(concordance, null, 2)
      );

      vscode.window.showInformationMessage(
        `✓ Concordance generated: ${files.length} files, ${totalLines} lines, ${totalFunctions} functions, ${totalClasses} classes`
      );

      return concordance;
    } catch (error) {
      vscode.window.showErrorMessage(`Concordance generation failed: ${error.message}`);
      return null;
    }
  }

  /**
   * Get project statistics
   */
  getStatistics() {
    try {
      const concordance = JSON.parse(
        fs.readFileSync(path.join(this.smeagolDir, "concordance.json"), "utf8")
      );
      return concordance.statistics;
    } catch (error) {
      return null;
    }
  }

  /**
   * Update config with custom settings
   */
  updateConfig(updates) {
    try {
      const configPath = path.join(this.smeagolDir, "config.json");
      const config = JSON.parse(fs.readFileSync(configPath, "utf8"));

      const updated = { ...config, ...updates, updated: new Date().toISOString() };
      fs.writeFileSync(configPath, JSON.stringify(updated, null, 2));

      return updated;
    } catch (error) {
      vscode.window.showErrorMessage(`Config update failed: ${error.message}`);
      return null;
    }
  }
}

module.exports = { ConcordanceSystem };
