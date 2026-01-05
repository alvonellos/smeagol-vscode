/**
 * Test script for Code Patterns Analyzer and Suggestion Engine
 */

const fs = require('fs');
const { CodePatternsAnalyzer } = require('./src/code-patterns-analyzer');
const { SuggestionEngine } = require('./src/suggestion-engine');

// Load test file
const code = fs.readFileSync('./test-patterns.js', 'utf8');

// Analyze
const analyzer = new CodePatternsAnalyzer();
const patterns = analyzer.analyzeCode(code, 'javascript');

console.log('📊 PATTERN DETECTION RESULTS');
console.log('='.repeat(60));
console.log(`Found ${patterns.length} patterns:\n`);

patterns.forEach((pattern, index) => {
  console.log(`${index + 1}. ${pattern.pattern}`);
  console.log(`   Severity: ${pattern.severity} | Line: ${pattern.line}`);
  if (pattern.details) console.log(`   Details: ${pattern.details}`);
  console.log();
});

// Generate suggestions
console.log('\n🔧 REFACTORING SUGGESTIONS');
console.log('='.repeat(60));

const engine = new SuggestionEngine();
const suggestions = engine.generateSuggestions(patterns);

console.log(engine.formatSuggestions(suggestions));

// Show top suggestion details
if (suggestions.length > 0) {
  console.log('\n\n📝 TOP SUGGESTION DETAILS');
  console.log('='.repeat(60));
  console.log(engine.formatSuggestion(suggestions[0]));
}
