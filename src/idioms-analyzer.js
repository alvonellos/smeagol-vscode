"use strict";

const vscode = require("vscode");
const { IdiomExtractor } = require("./idiom-extractor");
const { pythonExemplars } = require("./_exemplars/python-exemplars");
const { rustExemplars } = require("./_exemplars/rust-exemplars");
const { javaExemplars } = require("./_exemplars/java-exemplars");
const { jsExemplars } = require("./_exemplars/javascript-exemplars");
const { goExemplars } = require("./_exemplars/go-exemplars");
const { aplExemplars } = require("./_exemplars/apl-exemplars");
const {
  shellExemplars,
  psExemplars,
  groovyExemplars,
  autoitExemplars
} = require("./_exemplars/scripting-exemplars");
const {
  kubernetesExemplars,
  mavenExemplars,
  jenkinsExemplars,
  springBootExemplars
} = require("./_exemplars/infrastructure-exemplars");

/**
 * Idioms Analyzer
 * Generates idiomatic code rules from exemplar libraries
 */
class IdiomsAnalyzer {
  constructor() {
    this.extractor = new IdiomExtractor();
    this.diagnosticsCollection = vscode.languages.createDiagnosticCollection("smeagol-idioms");
    this.allRules = new Map();
    this.initializeExemplars();
  }

  /**
   * Register all exemplars and generate rules
   */
  initializeExemplars() {
    // Python
    for (const exemplar of pythonExemplars) {
      this.extractor.registerExemplar("python", exemplar.framework, exemplar.code);
    }
    this.allRules.set("python", this.extractor.generateRules("python"));

    // Rust
    for (const exemplar of rustExemplars) {
      this.extractor.registerExemplar("rust", exemplar.framework, exemplar.code);
    }
    this.allRules.set("rust", this.extractor.generateRules("rust"));

    // Java
    for (const exemplar of javaExemplars) {
      this.extractor.registerExemplar("java", exemplar.framework, exemplar.code);
    }
    this.allRules.set("java", this.extractor.generateRules("java"));

    // JavaScript
    for (const exemplar of jsExemplars) {
      this.extractor.registerExemplar("javascript", exemplar.framework, exemplar.code);
    }
    this.allRules.set("javascript", this.extractor.generateRules("javascript"));

    // Go
    for (const exemplar of goExemplars) {
      this.extractor.registerExemplar("go", exemplar.framework, exemplar.code);
    }
    this.allRules.set("go", this.extractor.generateRules("go"));

    // APL
    for (const exemplar of aplExemplars) {
      this.extractor.registerExemplar("apl", exemplar.framework, exemplar.code);
    }
    this.allRules.set("apl", this.extractor.generateRules("apl"));

    // Shell
    for (const exemplar of shellExemplars) {
      this.extractor.registerExemplar("shell", exemplar.framework, exemplar.code);
    }
    this.allRules.set("shell", this.extractor.generateRules("shell"));

    // PowerShell
    for (const exemplar of psExemplars) {
      this.extractor.registerExemplar("powershell", exemplar.framework, exemplar.code);
    }
    this.allRules.set("powershell", this.extractor.generateRules("powershell"));

    // Groovy
    for (const exemplar of groovyExemplars) {
      this.extractor.registerExemplar("groovy", exemplar.framework, exemplar.code);
    }
    this.allRules.set("groovy", this.extractor.generateRules("groovy"));

    // AutoIt
    for (const exemplar of autoitExemplars) {
      this.extractor.registerExemplar("autoit", exemplar.framework, exemplar.code);
    }
    this.allRules.set("autoit", this.extractor.generateRules("autoit"));

    // Kubernetes
    for (const exemplar of kubernetesExemplars) {
      this.extractor.registerExemplar("yaml", exemplar.framework, exemplar.code);
    }

    // Maven
    for (const exemplar of mavenExemplars) {
      this.extractor.registerExemplar("xml", exemplar.framework, exemplar.code);
    }

    // Jenkins
    for (const exemplar of jenkinsExemplars) {
      this.extractor.registerExemplar("groovy-jenkins", exemplar.framework, exemplar.code);
    }
    this.allRules.set("groovy", this.extractor.generateRules("groovy-jenkins"));

    // Spring Boot
    for (const exemplar of springBootExemplars) {
      this.extractor.registerExemplar("java-spring", exemplar.framework, exemplar.code);
    }
    this.allRules.set("java", this.extractor.generateRules("java-spring"));
  }

  /**
   * Analyze document for idiom violations
   */
  analyzeDocument(editor) {
    const document = editor.document;
    const text = document.getText();
    const language = document.languageId;
    const diagnostics = [];

    const rules = this.allRules.get(language) || [];

    for (const rule of rules) {
      try {
        const matches = text.matchAll(new RegExp(rule.pattern, "gm"));
        
        for (const match of matches) {
          const startPos = document.positionAt(match.index);
          const endPos = document.positionAt(match.index + match[0].length);
          const range = new vscode.Range(startPos, endPos);

          const severity = this._getSeverity(rule.severity);
          const diagnostic = new vscode.Diagnostic(
            range,
            `${rule.name} (${rule.score}% idiomatic). Suggestion: ${rule.suggestion}`,
            severity
          );
          diagnostic.source = "Smeagol Idioms";
          diagnostic.code = rule.id;
          diagnostic.relatedInformation = [
            new vscode.DiagnosticRelatedInformation(
              new vscode.Location(document.uri, startPos),
              `Idiomatic pattern: ${rule.idiomatic}`
            )
          ];

          diagnostics.push(diagnostic);
        }
      } catch (e) {
        // Skip invalid regexes
      }
    }

    this.diagnosticsCollection.set(document.uri, diagnostics);
  }

  /**
   * Get severity from string
   */
  _getSeverity(severity) {
    switch (severity) {
      case "error":
        return vscode.DiagnosticSeverity.Error;
      case "warning":
        return vscode.DiagnosticSeverity.Warning;
      case "information":
        return vscode.DiagnosticSeverity.Information;
      default:
        return vscode.DiagnosticSeverity.Hint;
    }
  }

  /**
   * Get rules for language
   */
  getRules(language) {
    return this.allRules.get(language) || [];
  }

  /**
   * Get statistics about idiom coverage
   */
  getStatistics() {
    const stats = {
      totalLanguages: this.allRules.size,
      totalRules: 0,
      byLanguage: {}
    };

    for (const [lang, rules] of this.allRules) {
      stats.byLanguage[lang] = {
        count: rules.length,
        avgScore: rules.length > 0
          ? Math.round(rules.reduce((a, r) => a + r.score, 0) / rules.length)
          : 0
      };
      stats.totalRules += rules.length;
    }

    return stats;
  }

  dispose() {
    this.diagnosticsCollection.dispose();
  }
}

module.exports = { IdiomsAnalyzer };
