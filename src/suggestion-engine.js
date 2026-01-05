/**
 * Suggestion Engine
 * Generates actionable refactoring suggestions and code improvement recommendations
 * Combines pattern analysis with best practices
 */

class SuggestionEngine {
  constructor() {
    this.suggestions = new Map();
    this.initializeSuggestions();
  }

  /**
   * Initialize suggestion library
   */
  initializeSuggestions() {
    // Map patterns to detailed suggestions
    this.suggestions.set("longParameterList", {
      title: "Simplify Parameter List",
      priority: 2,
      description: "Functions with many parameters are hard to understand and test",
      examples: {
        before: `function calculateOrder(customerId, date, quantity, price, 
                   taxRate, discount, shipping, insurance) {
  // complex logic
}`,
        after: `function calculateOrder(orderId, orderDetails) {
  const { customerId, date, quantity, price, taxRate, discount, shipping, insurance } = orderDetails;
  // complex logic
}`
      },
      tips: [
        "Group related parameters into objects",
        "Use destructuring for cleaner code",
        "Consider using Builder pattern for complex objects",
        "Keep function arity (number of params) below 3 when possible"
      ]
    });

    this.suggestions.set("deepNesting", {
      title: "Reduce Nesting Depth",
      priority: 1,
      description: "Deeply nested code is harder to understand and maintain",
      examples: {
        before: `if (user) {
  if (user.active) {
    if (user.permissions.includes('admin')) {
      if (user.verified) {
        // Do something
      }
    }
  }
}`,
        after: `if (!user?.active) return;
if (!user?.permissions.includes('admin')) return;
if (!user?.verified) return;
// Do something`
      },
      tips: [
        "Use early return to reduce nesting",
        "Extract conditions into separate functions",
        "Use optional chaining (?.) for null checks",
        "Apply Guard Clauses pattern",
        "Aim for maximum nesting of 2-3 levels"
      ]
    });

    this.suggestions.set("veryLongFunction", {
      title: "Break Down Large Functions",
      priority: 2,
      description: "Functions over 50 lines often violate Single Responsibility Principle",
      examples: {
        before: `function processOrder(order) {
  // 75 lines of logic:
  // - validate order
  // - calculate total
  // - apply discounts
  // - calculate tax
  // - process payment
  // - update inventory
  // - send confirmation
}`,
        after: `function processOrder(order) {
  validateOrder(order);
  const total = calculateTotal(order);
  applyDiscounts(total);
  const tax = calculateTax(total);
  processPayment(order, total);
  updateInventory(order);
  sendConfirmation(order);
}`
      },
      tips: [
        "Aim for functions under 20 lines",
        "Each function should have one clear responsibility",
        "Extract sub-tasks into separate functions",
        "Use descriptive function names that explain intent",
        "Consider using composition over inheritance"
      ]
    });

    this.suggestions.set("missingErrorHandling", {
      title: "Add Proper Error Handling",
      priority: 1,
      description: "Unhandled errors can crash applications and create poor UX",
      examples: {
        before: `async function fetchUserData(userId) {
  const response = await fetch(\`/api/users/\${userId}\`);
  const data = await response.json();
  return data;
}`,
        after: `async function fetchUserData(userId) {
  try {
    const response = await fetch(\`/api/users/\${userId}\`);
    if (!response.ok) throw new Error(\`HTTP \${response.status}\`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Unable to load user data');
  }
}`
      },
      tips: [
        "Always wrap async operations in try-catch",
        "Check HTTP response status codes",
        "Provide meaningful error messages",
        "Log errors for debugging",
        "Never silently fail - inform the user",
        "Consider retry logic for transient errors"
      ]
    });

    this.suggestions.set("codeduplication", {
      title: "Eliminate Code Duplication",
      priority: 2,
      description: "Duplicated code is a maintenance burden and introduces bugs",
      examples: {
        before: `function calculateTax(amount) { return amount * 0.08; }
function calculateState(amount) { return amount * 0.08; }
function calculateLocal(amount) { return amount * 0.03; }`,
        after: `function calculateTax(amount, rate = 0.08) { 
  return amount * rate; 
}

const TAX_RATE = 0.08;
const STATE_RATE = 0.08;
const LOCAL_RATE = 0.03;`
      },
      tips: [
        "DRY principle: Don't Repeat Yourself",
        "Extract common logic into utilities",
        "Use inheritance or composition for shared behavior",
        "Create reusable constants for magic values",
        "Write helper functions for repeated patterns"
      ]
    });

    this.suggestions.set("magicNumbers", {
      title: "Replace Magic Numbers with Constants",
      priority: 3,
      description: "Magic numbers make code hard to understand and maintain",
      examples: {
        before: `if (user.age >= 18) { // What does 18 mean?
  allowAccess();
}

if (buffer.length > 1024) { // What's special about 1024?
  flush();
}`,
        after: `const LEGAL_ADULT_AGE = 18;
const MAX_BUFFER_SIZE = 1024; // 1 KB

if (user.age >= LEGAL_ADULT_AGE) {
  allowAccess();
}

if (buffer.length > MAX_BUFFER_SIZE) {
  flush();
}`
      },
      tips: [
        "Use SCREAMING_SNAKE_CASE for constants",
        "Place constants near the top of files",
        "Document why the number matters",
        "Consider moving to configuration files",
        "Group related constants together"
      ]
    });
  }

  /**
   * Generate suggestions for a list of patterns
   * @param {Array} patterns - Array of detected patterns
   * @returns {Array} Array of detailed suggestions
   */
  generateSuggestions(patterns) {
    const suggestions = [];

    patterns.forEach(pattern => {
      const suggestion = this.suggestions.get(pattern.pattern);
      if (suggestion) {
        suggestions.push({
          ...suggestion,
          pattern: pattern.pattern,
          finding: pattern,
          priority: this.calculatePriority(pattern, suggestion)
        });
      }
    });

    // Sort by priority
    return suggestions.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Calculate priority score for suggestion
   */
  calculatePriority(pattern, suggestion) {
    // Base priority from suggestion
    let score = suggestion.priority * 10;

    // Adjust by severity
    const severityBoost = pattern.severity === "high" ? 0 : 
                          pattern.severity === "medium" ? 5 : 10;
    score -= severityBoost;

    // Adjust by impact (if count available)
    if (pattern.count || pattern.nestingLevel || pattern.lineCount) {
      const impact = pattern.count || pattern.nestingLevel || pattern.lineCount || 1;
      score -= Math.min(impact * 2, 10);
    }

    return Math.max(0, score);
  }

  /**
   * Get best suggestion for a pattern
   */
  getTopSuggestion(patterns) {
    const suggestions = this.generateSuggestions(patterns);
    return suggestions.length > 0 ? suggestions[0] : null;
  }

  /**
   * Format suggestion for display
   */
  formatSuggestion(suggestion) {
    let output = `\n📋 ${suggestion.title}\n`;
    output += `${'='.repeat(suggestion.title.length)}\n\n`;
    output += `${suggestion.description}\n\n`;

    output += "📝 Example:\n";
    output += "BEFORE:\n";
    output += `${suggestion.examples.before}\n\n`;
    output += "AFTER:\n";
    output += `${suggestion.examples.after}\n\n`;

    output += "💡 Tips:\n";
    suggestion.tips.forEach(tip => {
      output += `• ${tip}\n`;
    });

    return output;
  }

  /**
   * Format multiple suggestions
   */
  formatSuggestions(suggestions) {
    if (suggestions.length === 0) {
      return "✅ No refactoring suggestions at this time!";
    }

    let output = `🔧 Found ${suggestions.length} refactoring suggestion(s):\n\n`;

    suggestions.forEach((suggestion, index) => {
      const priority = suggestion.priority <= 5 ? "🔴 Critical" :
                       suggestion.priority <= 15 ? "🟡 Important" : "🟢 Nice to have";
      
      output += `${index + 1}. ${priority} - ${suggestion.title}\n`;
      output += `   ${suggestion.description}\n`;
      output += `   Primary fix: ${suggestion.examples.after.split('\n')[0].trim()}\n\n`;
    });

    return output;
  }
}

module.exports = { SuggestionEngine };
