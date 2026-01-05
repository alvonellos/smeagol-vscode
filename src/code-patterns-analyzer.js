/**
 * Code Patterns Analyzer
 * Detects code smells, anti-patterns, and suggests improvements
 * Uses heuristic analysis to identify problematic patterns
 */

class CodePatternsAnalyzer {
  constructor() {
    this.patterns = {
      longParameterList: {
        name: "Long Parameter List",
        severity: "medium",
        threshold: 5,
        pattern: "function|method with > 5 parameters"
      },
      deepNesting: {
        name: "Deep Nesting",
        severity: "high",
        threshold: 3,
        pattern: "nested blocks > 3 levels deep"
      },
      unusedVariables: {
        name: "Unused Variables",
        severity: "low",
        pattern: "variables declared but never used"
      },
      codeduplication: {
        name: "Code Duplication",
        severity: "medium",
        pattern: "similar code blocks repeated"
      },
      missingErrorHandling: {
        name: "Missing Error Handling",
        severity: "high",
        pattern: "async calls without try-catch"
      },
      veryLongFunction: {
        name: "Very Long Function",
        severity: "medium",
        threshold: 50,
        pattern: "function with > 50 lines"
      },
      tooManybranches: {
        name: "Too Many Branches",
        severity: "medium",
        threshold: 8,
        pattern: "function with > 8 branch paths"
      },
      magicNumbers: {
        name: "Magic Numbers",
        severity: "low",
        pattern: "hardcoded numeric values without explanation"
      }
    };
  }

  /**
   * Analyze code for patterns and anti-patterns
   * @param {string} code - Function/method code
   * @param {string} language - Programming language
   * @returns {Array} Array of detected patterns
   */
  analyzeCode(code, language = "javascript") {
    const findings = [];

    // Run all pattern detectors
    findings.push(...this.checkLongParameterList(code, language));
    findings.push(...this.checkDeepNesting(code, language));
    findings.push(...this.checkVeryLongFunction(code, language));
    findings.push(...this.checkMissingErrorHandling(code, language));
    findings.push(...this.checkCodeDuplication(code, language));
    findings.push(...this.checkMagicNumbers(code, language));

    // Sort by severity
    return this.sortBySeverity(findings);
  }

  /**
   * Check for long parameter lists
   */
  checkLongParameterList(code, language) {
    const findings = [];

    // Match function declarations with parameters
    let paramRegex;
    if (language === "python") {
      paramRegex = /def\s+\w+\s*\(([^)]*)\)/;
    } else if (language === "java") {
      paramRegex = /(public|private|protected)?\s+\w+\s+\w+\s*\(([^)]*)\)/;
    } else {
      // JavaScript, TypeScript, Rust, etc.
      paramRegex = /(function|async|fn|const)\s+\w+\s*\(([^)]*)\)/;
    }

    const match = code.match(paramRegex);
    if (match) {
      const paramString = match[match.length - 1];
      const params = paramString.split(",").filter(p => p.trim().length > 0);

      if (params.length > 5) {
        findings.push({
          pattern: "longParameterList",
          name: "Long Parameter List",
          severity: "medium",
          count: params.length,
          message: `Function has ${params.length} parameters (> 5 recommended)`,
          suggestion: "Consider using an object parameter or splitting the function",
          refactorOptions: [
            "Extract Parameter Object",
            "Create Configuration Object",
            "Use Builder Pattern"
          ]
        });
      }
    }

    return findings;
  }

  /**
   * Check for deep nesting
   */
  checkDeepNesting(code, language) {
    const findings = [];
    const lines = code.split("\n");
    let maxNesting = 0;
    let maxLine = 0;

    lines.forEach((line, index) => {
      // Count opening braces
      const openBraces = (line.match(/{/g) || []).length;
      const closeBraces = (line.match(/}/g) || []).length;
      const netBraces = openBraces - closeBraces;

      // Track nesting depth
      if (netBraces > 0 && line.trim().length > 0) {
        const currentNesting = line.search(/\S/) / 2; // Approximate nesting by indentation
        if (currentNesting > maxNesting) {
          maxNesting = currentNesting;
          maxLine = index + 1;
        }
      }
    });

    if (maxNesting > 3) {
      findings.push({
        pattern: "deepNesting",
        name: "Deep Nesting",
        severity: "high",
        nestingLevel: Math.ceil(maxNesting),
        message: `Code has nesting depth of ${Math.ceil(maxNesting)} levels (> 3 not recommended)`,
        suggestion: "Extract nested logic into separate functions to improve readability",
        refactorOptions: [
          "Extract Inner Function",
          "Use Early Return",
          "Apply Strategy Pattern"
        ]
      });
    }

    return findings;
  }

  /**
   * Check for very long functions
   */
  checkVeryLongFunction(code, language) {
    const findings = [];
    const lines = code.split("\n");

    if (lines.length > 50) {
      findings.push({
        pattern: "veryLongFunction",
        name: "Very Long Function",
        severity: "medium",
        lineCount: lines.length,
        message: `Function is ${lines.length} lines long (> 50 not recommended)`,
        suggestion: "Break function into smaller, focused functions with single responsibility",
        refactorOptions: [
          "Extract Functions",
          "Apply SRP (Single Responsibility)",
          "Create Helper Methods"
        ]
      });
    }

    return findings;
  }

  /**
   * Check for missing error handling in async code
   */
  checkMissingErrorHandling(code, language) {
    const findings = [];

    // Look for async/await or promise calls without error handling
    const asyncPatterns = [
      /await\s+\w+/g,
      /\.then\(/g,
      /fetch\(/g,
      /Promise\./g,
      /async\s+function/g
    ];

    let hasAsync = false;
    let hasTryCatch = false;

    asyncPatterns.forEach(pattern => {
      if (pattern.test(code)) {
        hasAsync = true;
      }
    });

    if (code.includes("try") && code.includes("catch")) {
      hasTryCatch = true;
    }

    if (hasAsync && !hasTryCatch) {
      findings.push({
        pattern: "missingErrorHandling",
        name: "Missing Error Handling",
        severity: "high",
        message: "Async code detected without error handling",
        suggestion: "Wrap async operations in try-catch blocks or add error handlers",
        refactorOptions: [
          "Add Try-Catch Block",
          "Add Promise Error Handler",
          "Use Error Boundary"
        ]
      });
    }

    return findings;
  }

  /**
   * Check for code duplication patterns
   */
  checkCodeDuplication(code, language) {
    const findings = [];

    // Look for repeated patterns (simplified heuristic)
    const lines = code.split("\n");
    const codeSegments = new Map();

    lines.forEach((line, index) => {
      const trimmed = line.trim();
      if (trimmed.length > 20) {
        // Only check significant lines
        codeSegments.set(trimmed, (codeSegments.get(trimmed) || 0) + 1);
      }
    });

    // Find duplicated lines
    let duplicateCount = 0;
    codeSegments.forEach((count, segment) => {
      if (count > 1) {
        duplicateCount += count - 1;
      }
    });

    if (duplicateCount > 3) {
      findings.push({
        pattern: "codeduplication",
        name: "Code Duplication",
        severity: "medium",
        duplicateLineCount: duplicateCount,
        message: `Found ${duplicateCount} duplicate or similar lines of code`,
        suggestion: "Extract common logic into a reusable function or utility",
        refactorOptions: [
          "Extract Function",
          "Create Utility Helper",
          "Use Mixin or Trait"
        ]
      });
    }

    return findings;
  }

  /**
   * Check for magic numbers
   */
  checkMagicNumbers(code, language) {
    const findings = [];

    // Look for hardcoded numbers without explanation
    const magicNumberPattern = /[^a-zA-Z0-9_](10|100|1000|255|256|2048|65535)\b/g;
    const matches = code.match(magicNumberPattern) || [];

    if (matches.length > 2) {
      findings.push({
        pattern: "magicNumbers",
        name: "Magic Numbers",
        severity: "low",
        count: matches.length,
        message: `Found ${matches.length} hardcoded magic numbers`,
        suggestion: "Extract magic numbers into named constants with descriptive names",
        refactorOptions: [
          "Create Named Constants",
          "Define Configuration Object",
          "Move to Config File"
        ]
      });
    }

    return findings;
  }

  /**
   * Sort findings by severity
   */
  sortBySeverity(findings) {
    const severityOrder = { high: 0, medium: 1, low: 2 };
    return findings.sort((a, b) => {
      const aScore = severityOrder[a.severity] ?? 3;
      const bScore = severityOrder[b.severity] ?? 3;
      return aScore - bScore;
    });
  }

  /**
   * Generate refactoring recommendation
   */
  getRefactoringRecommendation(pattern) {
    if (!pattern.refactorOptions || pattern.refactorOptions.length === 0) {
      return null;
    }

    return {
      primary: pattern.refactorOptions[0],
      alternatives: pattern.refactorOptions.slice(1),
      explanation: pattern.suggestion
    };
  }

  /**
   * Format findings for display
   */
  formatFindings(findings) {
    if (findings.length === 0) {
      return "✅ No significant code patterns detected. Code looks clean!";
    }

    let output = `📊 Found ${findings.length} code pattern(s):\n\n`;

    findings.forEach((finding, index) => {
      const severity = finding.severity === "high" ? "🔴" : 
                       finding.severity === "medium" ? "🟡" : "🟢";
      
      output += `${index + 1}. ${severity} ${finding.name}\n`;
      output += `   ${finding.message}\n`;
      output += `   💡 Suggestion: ${finding.suggestion}\n`;
      
      if (finding.refactorOptions) {
        output += `   🔧 Try: ${finding.refactorOptions[0]}\n`;
      }
      output += "\n";
    });

    return output;
  }
}

module.exports = { CodePatternsAnalyzer };
