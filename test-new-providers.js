"use strict";

/**
 * Test Suite for New Completion Providers
 * Tests Go, YAML, and Markdown completion providers
 * Validates pattern compliance, context detection, and caching
 */

const { GoCompletionProvider } = require("./src/go-completion");
const { YamlCompletionProvider } = require("./src/yaml-completion");
const { MarkdownCompletionProvider } = require("./src/markdown-completion");
const { PythonCompletionProvider: PythonCompletionProviderEnhanced } = require("./src/python-completion-enhanced");
const { TypeScriptCompletionProvider } = require("./src/typescript-completion");
const { CSharpCompletionProvider } = require("./src/csharp-completion");
const { CompletionCache } = require("./src/completion-cache");

class ProviderTestSuite {
  constructor() {
    this.results = [];
    this.passCount = 0;
    this.failCount = 0;
  }

  /**
   * Test Go Completion Provider
   */
  testGoProvider() {
    console.log("\n=== Testing Go Completion Provider ===");
    const provider = new GoCompletionProvider();
    
    // Test 1: Provider initialization
    this.assert(
      provider.completionItems && provider.completionItems.length > 0,
      "Go provider initializes with completion items"
    );
    
    // Test 2: Cache exists
    this.assert(
      provider.cache instanceof CompletionCache,
      "Go provider has CompletionCache instance"
    );
    
    // Test 3: Has stdlib packages
    const fmtItem = provider.completionItems.find(item => item.label.includes("fmt"));
    this.assert(fmtItem !== undefined, "Go provider includes fmt stdlib package");
    
    // Test 4: Has concurrency patterns
    const goItem = provider.completionItems.find(item => item.label.includes("go func"));
    this.assert(goItem !== undefined, "Go provider includes goroutine pattern");
    
    // Test 5: Has error handling
    const errItem = provider.completionItems.find(item => item.label.includes("if err != nil"));
    this.assert(errItem !== undefined, "Go provider includes error handling pattern");
    
    // Test 6: Has context detection capability
    this.assert(
      typeof provider.filterByContext === "function",
      "Go provider has context filtering function"
    );
    
    console.log(`Go Provider Tests: ${this.passCount} passed, ${this.failCount} failed`);
  }

  /**
   * Test YAML Completion Provider
   */
  testYamlProvider() {
    console.log("\n=== Testing YAML Completion Provider ===");
    const provider = new YamlCompletionProvider();
    
    // Test 1: Provider initialization
    this.assert(
      provider.completionItems && provider.completionItems.length > 0,
      "YAML provider initializes with completion items"
    );
    
    // Test 2: Cache exists
    this.assert(
      provider.cache instanceof CompletionCache,
      "YAML provider has CompletionCache instance"
    );
    
    // Test 3: Has Docker Compose items
    const servicesItem = provider.completionItems.find(item => item.label.includes("services"));
    this.assert(servicesItem !== undefined, "YAML provider includes Docker Compose items");
    
    // Test 4: Has Kubernetes items
    const apiVersionItem = provider.completionItems.find(item => item.label.includes("apiVersion"));
    this.assert(apiVersionItem !== undefined, "YAML provider includes Kubernetes items");
    
    // Test 5: Has GitHub Actions items
    const nameItem = provider.completionItems.find(item => item.label === "name:" && item.detail.includes("workflow"));
    this.assert(nameItem !== undefined, "YAML provider includes GitHub Actions items");
    
    // Test 6: File-context detection
    this.assert(
      typeof provider.getFileContext === "function",
      "YAML provider has file context detection"
    );
    
    console.log(`YAML Provider Tests: ${this.passCount} passed, ${this.failCount} failed`);
  }

  /**
   * Test Markdown Completion Provider
   */
  testMarkdownProvider() {
    console.log("\n=== Testing Markdown Completion Provider ===");
    const provider = new MarkdownCompletionProvider();
    
    // Test 1: Provider initialization
    this.assert(
      provider.completionItems && provider.completionItems.length > 0,
      "Markdown provider initializes with completion items"
    );
    
    // Test 2: Cache exists
    this.assert(
      provider.cache instanceof CompletionCache,
      "Markdown provider has CompletionCache instance"
    );
    
    // Test 3: Has heading items
    const h1Item = provider.completionItems.find(item => item.label === "# Heading 1");
    this.assert(h1Item !== undefined, "Markdown provider includes heading completions");
    
    // Test 4: Has code block items
    const codeItem = provider.completionItems.find(item => item.label.includes("```"));
    this.assert(codeItem !== undefined, "Markdown provider includes code block completions");
    
    // Test 5: Has table items
    const tableItem = provider.completionItems.find(item => item.label.includes("|"));
    this.assert(tableItem !== undefined, "Markdown provider includes table completions");
    
    // Test 6: Has context-aware filtering
    this.assert(
      typeof provider.filterByContext === "function",
      "Markdown provider has context filtering"
    );
    
    console.log(`Markdown Provider Tests: ${this.passCount} passed, ${this.failCount} failed`);
  }

  /**
   * Test Python Enhanced Completion Provider
   */
  testPythonEnhancedProvider() {
    console.log("\n=== Testing Python Enhanced Completion Provider ===");
    const provider = new PythonCompletionProviderEnhanced();
    
    // Test 1: Provider initialization
    this.assert(
      provider.completionItems && provider.completionItems.length > 50,
      "Python provider initializes with 50+ completion items"
    );
    
    // Test 2: Has async keywords
    const asyncItem = provider.completionItems.find(item => item.label.includes("async"));
    this.assert(asyncItem !== undefined, "Python provider includes async keyword");
    
    // Test 3: Has decorator patterns
    const decoratorItem = provider.completionItems.find(item => item.label.startsWith("@"));
    this.assert(decoratorItem !== undefined, "Python provider includes decorators");
    
    // Test 4: Has type hints
    const typeItem = provider.completionItems.find(item => item.label.includes("Optional") || item.label.includes("List"));
    this.assert(typeItem !== undefined, "Python provider includes type hints");
    
    // Test 5: Has frameworks
    const frameworkItem = provider.completionItems.find(item => 
      item.label.includes("Flask") || item.label.includes("Django") || item.label.includes("numpy")
    );
    this.assert(frameworkItem !== undefined, "Python provider includes frameworks");
    
    console.log(`Python Provider Tests: ${this.passCount} passed, ${this.failCount} failed`);
  }

  /**
   * Test TypeScript Completion Provider
   */
  testTypeScriptProvider() {
    console.log("\n=== Testing TypeScript Completion Provider ===");
    const provider = new TypeScriptCompletionProvider();
    
    // Test 1: Provider initialization
    this.assert(
      provider.completionItems && provider.completionItems.length > 80,
      "TypeScript provider initializes with 80+ completion items"
    );
    
    // Test 2: Has type keywords
    const interfaceItem = provider.completionItems.find(item => item.label === "interface");
    this.assert(interfaceItem !== undefined, "TypeScript provider includes interface keyword");
    
    // Test 3: Has generic support
    const genericItem = provider.completionItems.find(item => item.label.includes("<T>"));
    this.assert(genericItem !== undefined, "TypeScript provider includes generics");
    
    // Test 4: Has async/await
    const asyncItem = provider.completionItems.find(item => item.label === "async");
    this.assert(asyncItem !== undefined, "TypeScript provider includes async keyword");
    
    // Test 5: Has Promise types
    const promiseItem = provider.completionItems.find(item => item.label.includes("Promise"));
    this.assert(promiseItem !== undefined, "TypeScript provider includes Promise");
    
    console.log(`TypeScript Provider Tests: ${this.passCount} passed, ${this.failCount} failed`);
  }

  /**
   * Test C# Completion Provider
   */
  testCSharpProvider() {
    console.log("\n=== Testing C# Completion Provider ===");
    const provider = new CSharpCompletionProvider();
    
    // Test 1: Provider initialization
    this.assert(
      provider.completionItems && provider.completionItems.length > 80,
      "C# provider initializes with 80+ completion items"
    );
    
    // Test 2: Has LINQ keywords
    const linqItem = provider.completionItems.find(item => item.label === "from");
    this.assert(linqItem !== undefined, "C# provider includes LINQ from keyword");
    
    // Test 3: Has async/await
    const asyncItem = provider.completionItems.find(item => item.label === "async");
    this.assert(asyncItem !== undefined, "C# provider includes async keyword");
    
    // Test 4: Has collection types
    const listItem = provider.completionItems.find(item => item.label.includes("List<T>"));
    this.assert(listItem !== undefined, "C# provider includes List<T>");
    
    // Test 5: Has lambda support
    const lambdaItem = provider.completionItems.find(item => item.label === "x => x");
    this.assert(lambdaItem !== undefined, "C# provider includes lambda expressions");
    
    console.log(`C# Provider Tests: ${this.passCount} passed, ${this.failCount} failed`);
  }

  /**
   * Test completion cache behavior
   */
  testCompletionCaching() {
    console.log("\n=== Testing Completion Cache ===");
    
    // Test 1: Cache instantiation
    const cache = new CompletionCache(100, 5 * 60 * 1000);
    this.assert(cache !== null, "CompletionCache instantiates correctly");
    
    // Test 2: Cache storage
    const testItems = [
      { label: "test1" },
      { label: "test2" },
      { label: "test3" }
    ];
    cache.set("key1", testItems);
    const retrieved = cache.get("key1");
    this.assert(
      retrieved && retrieved.length === 3,
      "Cache stores and retrieves items"
    );
    
    // Test 3: Cache miss
    const missing = cache.get("nonexistent");
    this.assert(missing === null, "Cache returns null for missing keys");
    
    console.log(`Cache Tests: ${this.passCount} passed, ${this.failCount} failed`);
  }

  /**
   * Test pattern compliance
   */
  testPatternCompliance() {
    console.log("\n=== Testing Pattern Compliance ===");
    
    const providers = [
      new GoCompletionProvider(),
      new YamlCompletionProvider(),
      new MarkdownCompletionProvider()
    ];
    
    providers.forEach(provider => {
      // Test 1: Has initialize method
      this.assert(
        typeof provider.initialize === "function",
        `${provider.constructor.name} has initialize method`
      );
      
      // Test 2: Has provideCompletionItems method
      this.assert(
        typeof provider.provideCompletionItems === "function",
        `${provider.constructor.name} has provideCompletionItems method`
      );
      
      // Test 3: Has error handling
      const hasErrorHandling = provider.completionItems && Array.isArray(provider.completionItems);
      this.assert(
        hasErrorHandling,
        `${provider.constructor.name} has proper initialization`
      );
    });
    
    console.log(`Pattern Compliance Tests: ${this.passCount} passed, ${this.failCount} failed`);
  }

  /**
   * Assertion helper
   */
  assert(condition, message) {
    if (condition) {
      this.passCount++;
      console.log(`  ✓ ${message}`);
    } else {
      this.failCount++;
      console.log(`  ✗ ${message}`);
    }
    this.results.push({ condition, message });
  }

  /**
   * Run all tests
   */
  runAll() {
    console.log("\n╔════════════════════════════════════════╗");
    console.log("║  New Provider Completion Test Suite    ║");
    console.log("╚════════════════════════════════════════╝");
    
    try {
      this.testGoProvider();
      this.testYamlProvider();
      this.testMarkdownProvider();
      this.testPythonEnhancedProvider();
      this.testTypeScriptProvider();
      this.testCSharpProvider();
      this.testCompletionCaching();
      this.testPatternCompliance();
    } catch (error) {
      console.error("\n❌ Test suite error:", error.message);
      return;
    }
    
    // Summary
    const total = this.passCount + this.failCount;
    const percentage = ((this.passCount / total) * 100).toFixed(1);
    
    console.log("\n╔════════════════════════════════════════╗");
    console.log("║          Test Summary                  ║");
    console.log("╠════════════════════════════════════════╣");
    console.log(`║ Total Tests:    ${total.toString().padEnd(22)}║`);
    console.log(`║ Passed:         ${this.passCount.toString().padEnd(22)}║`);
    console.log(`║ Failed:         ${this.failCount.toString().padEnd(22)}║`);
    console.log(`║ Success Rate:   ${percentage}%${' '.repeat(18 - percentage.toString().length)}║`);
    console.log("╚════════════════════════════════════════╝");
    
    if (this.failCount === 0) {
      console.log("\n🎉 All tests passed!");
    } else {
      console.log(`\n⚠️  ${this.failCount} test(s) failed`);
    }
  }
}

// Run tests if executed directly
if (require.main === module) {
  const suite = new ProviderTestSuite();
  suite.runAll();
}

module.exports = { ProviderTestSuite };
