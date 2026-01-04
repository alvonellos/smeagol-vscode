"use strict";

const vscode = require("vscode");
const path = require("path");
const fs = require("fs");

/**
 * SonarQube Integration for Smeagol
 * Connects VS Code to SonarQube for code quality metrics
 */
class SonarQubeConnector {
  constructor() {
    this.config = {};
    this.isConnected = false;
  }

  /**
   * Initialize SonarQube connector from .smeagol/sonarqube.json
   */
  async initialize(workspaceRoot) {
    try {
      const configPath = path.join(workspaceRoot, ".smeagol", "sonarqube.json");

      if (fs.existsSync(configPath)) {
        this.config = JSON.parse(fs.readFileSync(configPath, "utf8"));
      } else {
        // Create default config if doesn't exist
        this.config = {
          enabled: false,
          projectKey: path.basename(workspaceRoot),
          host: "http://localhost:9000",
          token: "",
          rules: {
            enabled: true,
            severity: "MAJOR"
          }
        };

        const smeagolDir = path.join(workspaceRoot, ".smeagol");
        if (!fs.existsSync(smeagolDir)) {
          fs.mkdirSync(smeagolDir, { recursive: true });
        }

        fs.writeFileSync(configPath, JSON.stringify(this.config, null, 2));
      }

      return true;
    } catch (error) {
      console.error("SonarQube initialization failed:", error);
      return false;
    }
  }

  /**
   * Test connection to SonarQube server
   */
  async testConnection() {
    if (!this.config.enabled) {
      vscode.window.showWarningMessage("SonarQube integration is disabled in .smeagol/sonarqube.json");
      return false;
    }

    try {
      const response = await fetch(`${this.config.host}/api/system/status`, {
        headers: {
          Authorization: `Bearer ${this.config.token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        vscode.window.showInformationMessage(`✓ Connected to SonarQube ${data.version}`);
        this.isConnected = true;
        return true;
      } else {
        vscode.window.showErrorMessage("Failed to connect to SonarQube server");
        return false;
      }
    } catch (error) {
      vscode.window.showErrorMessage(`SonarQube connection error: ${error.message}`);
      return false;
    }
  }

  /**
   * Fetch issues for current project
   */
  async fetchIssues() {
    if (!this.isConnected) {
      const connected = await this.testConnection();
      if (!connected) return [];
    }

    try {
      const response = await fetch(
        `${this.config.host}/api/issues/search?componentKeys=${this.config.projectKey}&severity=${this.config.rules.severity}`,
        {
          headers: {
            Authorization: `Bearer ${this.config.token}`
          }
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.issues || [];
      }
      return [];
    } catch (error) {
      console.error("Failed to fetch issues:", error);
      return [];
    }
  }

  /**
   * Display issues in VS Code diagnostics
   */
  async displayIssuesAsDiagnostics(diagnosticsCollection) {
    try {
      const issues = await this.fetchIssues();
      const diagnosticMap = new Map();

      issues.forEach(issue => {
        const filePath = vscode.Uri.file(
          path.join(vscode.workspace.workspaceFolders?.[0]?.uri.fsPath || "", issue.component)
        );

        if (!diagnosticMap.has(filePath)) {
          diagnosticMap.set(filePath, []);
        }

        const severity = this.mapSeverity(issue.severity);
        const range = new vscode.Range(
          new vscode.Position((issue.line || 1) - 1, 0),
          new vscode.Position((issue.line || 1) - 1, 100)
        );

        const diagnostic = new vscode.Diagnostic(range, issue.message, severity);
        diagnostic.source = "SonarQube";
        diagnostic.code = issue.key;

        diagnosticMap.get(filePath).push(diagnostic);
      });

      // Apply diagnostics to all files
      diagnosticMap.forEach((diags, filePath) => {
        diagnosticsCollection.set(filePath, diags);
      });

      vscode.window.showInformationMessage(`✓ SonarQube: ${issues.length} issues found`);
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to display issues: ${error.message}`);
    }
  }

  /**
   * Map SonarQube severity to VS Code severity
   */
  mapSeverity(sonarSeverity) {
    const severityMap = {
      BLOCKER: vscode.DiagnosticSeverity.Error,
      CRITICAL: vscode.DiagnosticSeverity.Error,
      MAJOR: vscode.DiagnosticSeverity.Warning,
      MINOR: vscode.DiagnosticSeverity.Information,
      INFO: vscode.DiagnosticSeverity.Hint
    };
    return severityMap[sonarSeverity] || vscode.DiagnosticSeverity.Information;
  }

  /**
   * Get quality metrics for project
   */
  async getMetrics() {
    if (!this.isConnected) {
      const connected = await this.testConnection();
      if (!connected) return null;
    }

    try {
      const metricKeys = ["bugs", "vulnerabilities", "code_smells", "coverage", "duplication"];
      const response = await fetch(
        `${this.config.host}/api/measures/component?component=${this.config.projectKey}&metricKeys=${metricKeys.join(",")}`,
        {
          headers: {
            Authorization: `Bearer ${this.config.token}`
          }
        }
      );

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error("Failed to fetch metrics:", error);
      return null;
    }
  }

  /**
   * Show quality metrics in terminal
   */
  async showMetrics() {
    const metrics = await this.getMetrics();

    if (!metrics) {
      vscode.window.showErrorMessage("Failed to fetch quality metrics");
      return;
    }

    const terminalName = "SonarQube Metrics";
    let terminal = vscode.window.terminals.find(t => t.name === terminalName);

    if (!terminal) {
      terminal = vscode.window.createTerminal(terminalName);
    }

    terminal.show();

    const output = `
=== SonarQube Quality Metrics ===
Project: ${this.config.projectKey}
Host: ${this.config.host}

Metrics:
${
  metrics.component.measures
    ?.map(m => `  ${m.metric}: ${m.value}`)
    .join("\n") || "No metrics available"
}

Generated: ${new Date().toISOString()}
    `;

    terminal.sendText(output);
  }

  /**
   * Configure SonarQube settings
   */
  async configure() {
    const token = await vscode.window.showInputBox({
      prompt: "Enter SonarQube authentication token",
      placeHolder: "Your SonarQube token",
      password: true
    });

    if (!token) return;

    const host = await vscode.window.showInputBox({
      prompt: "Enter SonarQube server URL",
      placeHolder: "http://localhost:9000",
      value: this.config.host
    });

    if (!host) return;

    this.config.token = token;
    this.config.host = host;
    this.config.enabled = true;

    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (workspaceRoot) {
      const configPath = path.join(workspaceRoot, ".smeagol", "sonarqube.json");
      fs.writeFileSync(configPath, JSON.stringify(this.config, null, 2));
    }

    vscode.window.showInformationMessage("✓ SonarQube configuration saved");
  }

  /**
   * Register SonarQube commands
   */
  register(context) {
    context.subscriptions.push(
      vscode.commands.registerCommand("smeagol.sonarqube.test", () => this.testConnection()),
      vscode.commands.registerCommand("smeagol.sonarqube.configure", () => this.configure()),
      vscode.commands.registerCommand("smeagol.sonarqube.metrics", () => this.showMetrics())
    );
  }
}

module.exports = { SonarQubeConnector };
