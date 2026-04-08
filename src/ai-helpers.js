"use strict";

const vscode = require("vscode");

/**
 * AI Helper Tools for Smeagol Extension
 * Provides AI-assisted development features:
 * - Code generation and boilerplate
 * - Code refactoring suggestions
 * - Documentation generation
 * - Test generation
 * - Code explanation
 */
class AiHelpersModule {
  constructor(context) {
    this.context = context;
    this.initialize();
  }

  initialize() {
    // Register commands for AI helpers
    this.context.subscriptions.push(
      vscode.commands.registerCommand("smeagol.generateBoilerplate", () =>
        this.generateBoilerplate()
      ),
      vscode.commands.registerCommand("smeagol.refactorCode", () =>
        this.refactorCode()
      ),
      vscode.commands.registerCommand("smeagol.generateDocs", () =>
        this.generateDocumentation()
      ),
      vscode.commands.registerCommand("smeagol.generateTests", () =>
        this.generateTests()
      ),
      vscode.commands.registerCommand("smeagol.explainCode", () =>
        this.explainCode()
      ),
      vscode.commands.registerCommand("smeagol.optimizeCode", () =>
        this.optimizeCode()
      )
    );
  }

  /**
   * Generate boilerplate code for selected language
   */
  async generateBoilerplate() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage("No editor active");
      return;
    }

    const language = editor.document.languageId;
    const templates = {
      python: this.getPythonBoilerplate(),
      java: this.getJavaBoilerplate(),
      groovy: this.getGroovyBoilerplate(),
      rust: this.getRustBoilerplate(),
      javascript: this.getJavaScriptBoilerplate(),
      typescript: this.getTypeScriptBoilerplate(),
    };

    if (!templates[language]) {
      vscode.window.showWarningMessage(
        `No boilerplate template for ${language}`
      );
      return;
    }

    const selection = editor.selection;
    await editor.edit((editBuilder) => {
      editBuilder.insert(selection.active, templates[language]);
    });

    vscode.window.showInformationMessage(
      `Generated boilerplate for ${language}`
    );
  }

  getPythonBoilerplate() {
    return `#!/usr/bin/env python3
"""Module docstring describing purpose."""

import logging
from pathlib import Path
from typing import Optional, List

logger = logging.getLogger(__name__)


class MyClass:
    """Class documentation."""

    def __init__(self, param: str) -> None:
        """Initialize the class."""
        self.param = param
        logger.info(f"Initialized with {param}")

    def method(self) -> str:
        """Method documentation."""
        return self.param


def main() -> None:
    """Main entry point."""
    logging.basicConfig(level=logging.INFO)
    instance = MyClass("example")
    logger.info(f"Result: {instance.method()}")


if __name__ == "__main__":
    main()
`;
  }

  getJavaBoilerplate() {
    return `package com.example;

import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Service class for business logic.
 */
@Slf4j
@Service
@Data
@RequiredArgsConstructor
public class MyService {
    
    private final MyRepository repository;
    
    /**
     * Process data.
     *
     * @param input the input data
     * @return the processed result
     */
    public String process(String input) {
        log.info("Processing: {}", input);
        return input.toUpperCase();
    }
}
`;
  }

  getGroovyBoilerplate() {
    return `package com.example

/**
 * Groovy class example.
 */
class MyGroovy {
    
    String name
    Integer age
    
    MyGroovy(String name, Integer age) {
        this.name = name
        this.age = age
    }
    
    def greet() {
        "Hello, I'm \${name} and I'm \${age} years old"
    }
    
    static void main(String[] args) {
        def obj = new MyGroovy("Alice", 30)
        println obj.greet()
    }
}
`;
  }

  getRustBoilerplate() {
    return `use std::fmt;

/// A sample Rust structure.
#[derive(Debug, Clone)]
struct MyStruct {
    name: String,
    value: i32,
}

impl fmt::Display for MyStruct {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "Name: {}, Value: {}", self.name, self.value)
    }
}

fn main() {
    let my_struct = MyStruct {
        name: String::from("example"),
        value: 42,
    };
    println!("{}", my_struct);
}
`;
  }

  getJavaScriptBoilerplate() {
    return `/**
 * JavaScript module template
 */

class MyClass {
  /**
   * Constructor
   * @param {string} name - The name
   */
  constructor(name) {
    this.name = name;
  }

  /**
   * Process method
   * @param {string} input - Input data
   * @returns {string} Processed result
   */
  process(input) {
    return input.toUpperCase();
  }
}

// Export for module usage
module.exports = { MyClass };
`;
  }

  getTypeScriptBoilerplate() {
    return `/**
 * TypeScript module template
 */

interface IConfig {
  name: string;
  timeout: number;
}

class MyClass {
  private config: IConfig;

  constructor(config: IConfig) {
    this.config = config;
  }

  process(input: string): string {
    return input.toUpperCase();
  }
}

export { MyClass, IConfig };
`;
  }

  /**
   * Suggest code refactoring
   */
  async refactorCode() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage("No editor active");
      return;
    }

    const selection = editor.selection;
    const code = editor.document.getText(selection);

    if (!code) {
      vscode.window.showWarningMessage("Select code to refactor");
      return;
    }

    const suggestions = [
      "✨ Extract method: Move this logic into a reusable function",
      "🔄 Reduce complexity: Consider breaking this into smaller pieces",
      "📦 Remove duplication: This code appears similar to another section",
      "🎯 Simplify logic: Consider using a more direct approach",
      "⚡ Optimize performance: Consider caching or lazy evaluation",
    ];

    const choice = await vscode.window.showQuickPick(suggestions);
    if (choice) {
      vscode.window.showInformationMessage(`Refactoring tip: ${choice}`);
    }
  }

  /**
   * Generate documentation
   */
  async generateDocumentation() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage("No editor active");
      return;
    }

    const language = editor.document.languageId;
    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);

    if (!selectedText) {
      vscode.window.showWarningMessage(
        "Select code to generate documentation for"
      );
      return;
    }

    let docTemplate = "";

    switch (language) {
      case "python":
        docTemplate = `"""
        Summary of functionality.
        
        This function/class does X, Y, and Z.
        
        Args:
            param1 (type): Description
            param2 (type): Description
            
        Returns:
            type: Description
            
        Raises:
            Exception: When something happens
            
        Example:
            >>> result = function(args)
            >>> print(result)
        """`;
        break;

      case "java":
        docTemplate = `/**
         * Brief description of method/class.
         * 
         * Detailed explanation of what this does,
         * including important notes and behaviors.
         *
         * @param param1 description of param1
         * @param param2 description of param2
         * @return description of return value
         * @throws Exception when something goes wrong
         * @see RelatedClass#method()
         */`;
        break;

      case "rust":
        docTemplate = `/// Brief one-line description.
        ///
        /// Detailed explanation here. Can include examples
        /// of how to use this function or struct.
        ///
        /// # Arguments
        ///
        /// * \`param1\` - Description
        /// * \`param2\` - Description
        ///
        /// # Returns
        ///
        /// Description of return value
        ///
        /// # Example
        ///
        /// \`\`\`
        /// let result = function(args);
        /// \`\`\``;
        break;

      case "javascript":
      case "typescript":
        docTemplate = `/**
         * Brief description of function/class.
         * 
         * @param {type} param1 - Description
         * @param {type} param2 - Description
         * @returns {type} Description of return
         * @throws {Error} When error occurs
         * @example
         * const result = myFunction(arg1, arg2);
         */`;
        break;

      default:
        vscode.window.showWarningMessage(
          `Documentation generation not supported for ${language}`
        );
        return;
    }

    const position = selection.start;
    await editor.edit((editBuilder) => {
      editBuilder.insert(position, docTemplate + "\n");
    });

    vscode.window.showInformationMessage(
      "Documentation template inserted. Please fill in the details."
    );
  }

  /**
   * Generate test stubs
   */
  async generateTests() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage("No editor active");
      return;
    }

    const language = editor.document.languageId;
    const selection = editor.selection;
    const selectedText = editor.document.getText(selection);

    if (!selectedText) {
      vscode.window.showWarningMessage("Select code to generate tests for");
      return;
    }

    // Extract function name (simple heuristic)
    const functionMatch = selectedText.match(
      /(?:def|function|fn|public\s+\w+|async\s+\w+)\s+(\w+)/
    );
    const functionName = functionMatch ? functionMatch[1] : "myFunction";

    let testTemplate = "";

    switch (language) {
      case "python":
        testTemplate = `
import unittest
from your_module import ${functionName}

class Test${functionName.charAt(0).toUpperCase() + functionName.slice(1)}(unittest.TestCase):
    """Test cases for ${functionName}."""
    
    def setUp(self):
        """Set up test fixtures."""
        pass
    
    def test_basic_functionality(self):
        """Test basic functionality."""
        result = ${functionName}("input")
        self.assertIsNotNone(result)
    
    def test_edge_cases(self):
        """Test edge cases."""
        pass
    
    def test_error_handling(self):
        """Test error handling."""
        pass

if __name__ == '__main__':
    unittest.main()
`;
        break;

      case "java":
        testTemplate = `
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import static org.junit.jupiter.api.Assertions.*;

public class ${functionName}Test {
    
    private ${functionName} instance;
    
    @BeforeEach
    void setUp() {
        instance = new ${functionName}();
    }
    
    @Test
    void testBasicFunctionality() {
        assertNotNull(instance.method("input"));
    }
    
    @Test
    void testEdgeCases() {
        // Test edge cases
    }
    
    @Test
    void testErrorHandling() {
        assertThrows(Exception.class, () -> {
            instance.method(null);
        });
    }
}
`;
        break;

      case "rust":
        testTemplate = `
#[cfg(test)]
mod tests {
    use super::*;
    
    #[test]
    fn test_basic_functionality() {
        let result = ${functionName}("input");
        assert!(result.is_ok());
    }
    
    #[test]
    fn test_edge_cases() {
        // Edge case tests
    }
    
    #[test]
    #[should_panic]
    fn test_panic() {
        // Test panic scenarios
    }
}
`;
        break;

      default:
        vscode.window.showWarningMessage(
          `Test generation not supported for ${language}`
        );
        return;
    }

    const position = editor.document.lineCount;
    await editor.edit((editBuilder) => {
      editBuilder.insert(
        new vscode.Position(position, 0),
        "\n\n" + testTemplate
      );
    });

    vscode.window.showInformationMessage("Test template generated");
  }

  /**
   * Explain selected code
   */
  async explainCode() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage("No editor active");
      return;
    }

    const selection = editor.selection;
    const code = editor.document.getText(selection);

    if (!code) {
      vscode.window.showWarningMessage("Select code to explain");
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      "codeExplanation",
      "Code Explanation",
      vscode.ViewColumn.Beside,
      {}
    );

    panel.webview.html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: sans-serif; padding: 20px; }
          code { background: #f0f0f0; padding: 2px 6px; border-radius: 3px; }
          pre { background: #f0f0f0; padding: 10px; border-radius: 5px; overflow-x: auto; }
          .section { margin: 15px 0; }
          h3 { color: #0078d4; }
        </style>
      </head>
      <body>
        <div class="section">
          <h3>Code Explanation</h3>
          <p>This feature provides AI-assisted code analysis.</p>
        </div>
        <div class="section">
          <h3>Selected Code</h3>
          <pre><code>${escapeHtml(code)}</code></pre>
        </div>
        <div class="section">
          <h3>Analysis</h3>
          <ul>
            <li><strong>Purpose:</strong> Analyze what the code does</li>
            <li><strong>Complexity:</strong> Evaluate complexity</li>
            <li><strong>Best Practices:</strong> Check adherence to standards</li>
            <li><strong>Improvements:</strong> Suggest optimizations</li>
          </ul>
        </div>
      </body>
      </html>
    `;
  }

  /**
   * Optimize selected code
   */
  async optimizeCode() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage("No editor active");
      return;
    }

    const selection = editor.selection;
    const code = editor.document.getText(selection);

    if (!code) {
      vscode.window.showWarningMessage("Select code to optimize");
      return;
    }

    const optimizations = [
      {
        name: "Cache results",
        description: "Add memoization for repeated computations",
      },
      {
        name: "Parallel processing",
        description: "Use threading/async for independent operations",
      },
      {
        name: "Algorithm optimization",
        description: "Consider more efficient algorithms",
      },
      {
        name: "Memory optimization",
        description: "Reduce unnecessary object allocations",
      },
      {
        name: "Database optimization",
        description: "Optimize queries and indexing",
      },
    ];

    const choice = await vscode.window.showQuickPick(optimizations, {
      placeHolder: "Select optimization strategy",
      matchOnDescription: true,
    });

    if (choice) {
      vscode.window.showInformationMessage(
        `Optimization: ${choice.name} - ${choice.description}`
      );
    }
  }
}

function escapeHtml(text) {
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

module.exports = { AiHelpersModule };
