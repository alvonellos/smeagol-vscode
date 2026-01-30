"use strict";

/**
 * Maven Helper Analyzer
 * 
 * Analyzes Maven projects for:
 * - Dependency optimization
 * - Plugin configuration
 * - Build optimization
 * - Conflict detection
 */

const fs = require("fs");
const path = require("path");
const xml2js = require("xml2js");

class MavenHelper {
  constructor() {
    this.parser = new xml2js.Parser();
    this.diagnosticsCollection = null;
  }

  /**
   * Analyze pom.xml file
   * @param {string} pomPath - Path to pom.xml
   * @returns {Promise<object>} Analysis results
   */
  async analyzePom(pomPath) {
    try {
      const pomContent = fs.readFileSync(pomPath, "utf-8");
      const pom = await this.parser.parseStringPromise(pomContent);

      const analysis = {
        projectInfo: this._extractProjectInfo(pom),
        dependencies: await this._analyzeDependencies(pom),
        plugins: this._analyzePlugins(pom),
        issues: [],
        optimizations: [],
      };

      // Run checks
      this._checkDependencyConflicts(analysis);
      this._checkPluginVersions(analysis);
      this._checkBuildOptimizations(analysis);

      return analysis;
    } catch (error) {
      return {
        error: error.message,
        success: false,
      };
    }
  }

  /**
   * Extract project information
   * @param {object} pom - Parsed POM
   * @returns {object} Project info
   */
  _extractProjectInfo(pom) {
    const project = pom.project || {};
    return {
      groupId: project.groupId?.[0] || "unknown",
      artifactId: project.artifactId?.[0] || "unknown",
      version: project.version?.[0] || "unknown",
      name: project.name?.[0] || "",
      description: project.description?.[0] || "",
    };
  }

  /**
   * Analyze project dependencies
   * @param {object} pom - Parsed POM
   * @returns {Promise<object>} Dependency analysis
   */
  async _analyzeDependencies(pom) {
    const deps = pom.project?.dependencies?.[0]?.dependency || [];
    const depMap = new Map();

    // Build dependency map
    for (const dep of deps) {
      const key = `${dep.groupId?.[0]}:${dep.artifactId?.[0]}`;
      depMap.set(key, {
        groupId: dep.groupId?.[0],
        artifactId: dep.artifactId?.[0],
        version: dep.version?.[0],
        scope: dep.scope?.[0] || "compile",
        optional: dep.optional?.[0] === "true",
      });
    }

    return {
      count: deps.length,
      byScope: this._groupByScope(deps),
      tree: await this._buildDependencyTree(depMap),
    };
  }

  /**
   * Analyze Maven plugins
   * @param {object} pom - Parsed POM
   * @returns {object} Plugin analysis
   */
  _analyzePlugins(pom) {
    const plugins = pom.project?.build?.[0]?.plugins?.[0]?.plugin || [];

    return {
      count: plugins.length,
      list: plugins.map((p) => ({
        groupId: p.groupId?.[0] || "org.apache.maven.plugins",
        artifactId: p.artifactId?.[0],
        version: p.version?.[0] || "default",
        goals: p.executions?.[0]?.execution?.map((e) => e.goals?.[0]?.goal) || [],
      })),
    };
  }

  /**
   * Check for dependency conflicts
   * @param {object} analysis - Analysis object
   * @returns {void}
   */
  _checkDependencyConflicts(analysis) {
    const issues = [];

    // Check for duplicate dependencies with different versions
    const versionMap = new Map();

    for (const [key, dep] of Object.entries(analysis.dependencies)) {
      if (Array.isArray(dep)) {
        for (const d of dep) {
          const artifact = `${d.groupId}:${d.artifactId}`;
          if (versionMap.has(artifact)) {
            const existing = versionMap.get(artifact);
            if (existing.version !== d.version) {
              issues.push({
                severity: "warning",
                message: `Dependency ${artifact} has conflicting versions: ${existing.version} vs ${d.version}`,
                type: "version-conflict",
              });
            }
          } else {
            versionMap.set(artifact, d);
          }
        }
      }
    }

    analysis.issues.push(...issues);
  }

  /**
   * Check plugin versions
   * @param {object} analysis - Analysis object
   * @returns {void}
   */
  _checkPluginVersions(analysis) {
    const issues = [];

    // Check for outdated or missing plugin versions
    const knownVersions = {
      "maven-compiler-plugin": "3.11.0",
      "maven-surefire-plugin": "3.1.0",
      "maven-jar-plugin": "3.3.0",
    };

    for (const plugin of analysis.plugins.list) {
      if (plugin.version === "default" || !plugin.version) {
        issues.push({
          severity: "info",
          message: `Plugin ${plugin.artifactId} should have explicit version`,
          type: "missing-version",
          suggestion: knownVersions[plugin.artifactId] || "Check Maven Central",
        });
      }
    }

    analysis.issues.push(...issues);
  }

  /**
   * Check build optimizations
   * @param {object} analysis - Analysis object
   * @returns {void}
   */
  _checkBuildOptimizations(analysis) {
    const optimizations = [];

    // Suggest parallel builds
    optimizations.push({
      type: "parallel-build",
      description: "Enable parallel builds with -T1C flag",
      benefit: "Faster builds on multi-core systems",
      config: `-T1C`,
    });

    // Suggest offline mode
    optimizations.push({
      type: "offline-mode",
      description: "Use offline mode for CI/CD pipelines",
      benefit: "Faster builds without network calls",
      config: `-o`,
    });

    // Suggest skip tests in certain conditions
    optimizations.push({
      type: "skip-tests",
      description: "Skip tests in non-test builds",
      benefit: "Faster development builds",
      config: `-DskipTests`,
    });

    analysis.optimizations = optimizations;
  }

  /**
   * Group dependencies by scope
   * @param {object[]} deps - Dependencies array
   * @returns {object} Grouped by scope
   */
  _groupByScope(deps) {
    const grouped = {
      compile: [],
      test: [],
      provided: [],
      runtime: [],
      system: [],
    };

    for (const dep of deps) {
      const scope = dep.scope?.[0] || "compile";
      if (grouped[scope]) {
        grouped[scope].push(`${dep.groupId?.[0]}:${dep.artifactId?.[0]}`);
      }
    }

    return grouped;
  }

  /**
   * Build dependency tree
   * @param {Map} depMap - Dependency map
   * @returns {Promise<object>} Dependency tree
   */
  async _buildDependencyTree(depMap) {
    // Simplified tree structure
    return {
      direct: Array.from(depMap.entries()).map(([key, value]) => ({
        artifact: key,
        version: value.version,
        scope: value.scope,
      })),
      transitive: [],
    };
  }

  /**
   * Generate Maven build command with optimizations
   * @param {string} target - Build target (clean, install, test, etc.)
   * @param {object} options - Build options
   * @returns {string} Maven command
   */
  generateMavenCommand(target = "clean install", options = {}) {
    const {
      skipTests = false,
      parallel = true,
      offline = false,
      debug = false,
    } = options;

    let cmd = "mvn";

    if (debug) cmd += " -X";
    if (offline) cmd += " -o";
    if (skipTests) cmd += " -DskipTests";
    if (parallel) cmd += " -T1C";

    cmd += ` ${target}`;

    return cmd;
  }

  /**
   * Provide Maven quick fixes
   * @param {object} issue - Issue object
   * @returns {object} Quick fix action
   */
  getQuickFix(issue) {
    const fixes = {
      "version-conflict": {
        action: "Resolve to latest compatible",
        command: "maven.resolveConflict",
      },
      "missing-version": {
        action: "Add explicit version",
        command: "maven.addVersion",
      },
      "outdated-plugin": {
        action: "Update plugin",
        command: "maven.updatePlugin",
      },
    };

    return fixes[issue.type] || { action: "Check issue", command: "maven.inspect" };
  }

  /**
   * Get POM structure summary
   * @param {string} pomPath - Path to pom.xml
   * @returns {Promise<string>} Summary markdown
   */
  async getPomSummary(pomPath) {
    try {
      const analysis = await this.analyzePom(pomPath);

      let summary = `# Maven Project Summary\n\n`;
      summary += `## Project Info\n`;
      summary += `- **Group ID**: ${analysis.projectInfo.groupId}\n`;
      summary += `- **Artifact ID**: ${analysis.projectInfo.artifactId}\n`;
      summary += `- **Version**: ${analysis.projectInfo.version}\n\n`;

      summary += `## Dependencies\n`;
      summary += `- **Total**: ${analysis.dependencies.count}\n`;
      summary += `- **Compile**: ${analysis.dependencies.byScope.compile?.length || 0}\n`;
      summary += `- **Test**: ${analysis.dependencies.byScope.test?.length || 0}\n`;
      summary += `- **Provided**: ${analysis.dependencies.byScope.provided?.length || 0}\n\n`;

      summary += `## Plugins\n`;
      summary += `- **Total**: ${analysis.plugins.count}\n\n`;

      if (analysis.issues.length > 0) {
        summary += `## Issues Found\n`;
        for (const issue of analysis.issues) {
          summary += `- **${issue.severity.toUpperCase()}**: ${issue.message}\n`;
        }
      }

      return summary;
    } catch (error) {
      return `Error analyzing pom: ${error.message}`;
    }
  }

  /**
   * Cleanup
   */
  dispose() {
    if (this.diagnosticsCollection) {
      this.diagnosticsCollection.dispose();
    }
  }
}

module.exports = { MavenHelper };
