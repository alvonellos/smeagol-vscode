"use strict";

const vscode = require("vscode");

/**
 * Smeagol AI DSL Compiler
 * Translates between HUMAN ↔ AIDSL ↔ AI
 * DSL Syntax:
 *   ai-instruction { action, context, language, constraints, output }
 *   ai-task { name, description, steps, validation }
 *   ai-rule { trigger, condition, action }
 */
class AiDslCompiler {
  constructor() {
    this.version = "1.0.0";
    this.ast = null;
    this.errors = [];
  }

  /**
   * Tokenize DSL input (Lexer)
   */
  tokenize(input) {
    const tokens = [];
    const tokenRegex = /(\{|\}|,|:|"[^"]*"|[a-zA-Z_]\w*|\[.*?\])/g;
    let match;

    while ((match = tokenRegex.exec(input)) !== null) {
      tokens.push({
        value: match[0],
        type: this.getTokenType(match[0])
      });
    }

    return tokens;
  }

  /**
   * Determine token type
   */
  getTokenType(token) {
    if (token === "{") return "LBRACE";
    if (token === "}") return "RBRACE";
    if (token === ",") return "COMMA";
    if (token === ":") return "COLON";
    if (token.startsWith('"') && token.endsWith('"')) return "STRING";
    if (token.startsWith("[") && token.endsWith("]")) return "ARRAY";
    if (["ai-instruction", "ai-task", "ai-rule"].includes(token)) return "KEYWORD";
    return "IDENTIFIER";
  }

  /**
   * Parse tokens into AST (Parser)
   */
  parse(tokens) {
    const ast = {
      type: "Program",
      statements: []
    };

    let i = 0;
    while (i < tokens.length) {
      if (tokens[i].type === "KEYWORD") {
        const stmt = this.parseStatement(tokens, i);
        if (stmt) {
          ast.statements.push(stmt);
          i = stmt.endIndex;
        }
      }
      i++;
    }

    return ast;
  }

  /**
   * Parse a single DSL statement
   */
  parseStatement(tokens, startIndex) {
    const keyword = tokens[startIndex].value;
    const statement = {
      type: keyword,
      properties: {},
      endIndex: startIndex + 1
    };

    // Skip to opening brace
    while (startIndex < tokens.length && tokens[startIndex].value !== "{") startIndex++;
    startIndex++;

    // Parse properties
    while (startIndex < tokens.length && tokens[startIndex].value !== "}") {
      if (tokens[startIndex].type === "IDENTIFIER") {
        const key = tokens[startIndex].value;
        startIndex++;

        if (tokens[startIndex]?.value === ":") {
          startIndex++;
          const value = tokens[startIndex]?.value;
          statement.properties[key] = this.parseValue(value);
          statement.endIndex = startIndex + 1;
          startIndex++;
        }
      }
      startIndex++;
    }

    return statement;
  }

  /**
   * Parse property value
   */
  parseValue(value) {
    if (value?.startsWith('"') && value.endsWith('"')) {
      return value.slice(1, -1);
    }
    if (value?.startsWith("[") && value.endsWith("]")) {
      return value.slice(1, -1).split(",").map(v => v.trim());
    }
    return value;
  }

  /**
   * Compile DSL to JSON instruction (Codegen)
   */
  compile(dslInput) {
    this.errors = [];
    const tokens = this.tokenize(dslInput);
    this.ast = this.parse(tokens);

    const instructions = [];

    this.ast.statements.forEach(stmt => {
      if (stmt.type === "ai-instruction") {
        instructions.push(this.compileInstruction(stmt));
      } else if (stmt.type === "ai-task") {
        instructions.push(this.compileTask(stmt));
      } else if (stmt.type === "ai-rule") {
        instructions.push(this.compileRule(stmt));
      }
    });

    return {
      version: this.version,
      timestamp: new Date().toISOString(),
      instructions: instructions,
      errors: this.errors
    };
  }

  /**
   * Compile ai-instruction to JSON
   */
  compileInstruction(stmt) {
    return {
      type: "instruction",
      action: stmt.properties.action || "",
      context: stmt.properties.context || "",
      language: stmt.properties.language || "auto",
      constraints: stmt.properties.constraints || [],
      outputFormat: stmt.properties.output || "code",
      humanPrompt: this.generateHumanPrompt(stmt),
      machinePrompt: this.generateMachinePrompt(stmt)
    };
  }

  /**
   * Compile ai-task to JSON
   */
  compileTask(stmt) {
    return {
      type: "task",
      name: stmt.properties.name || "",
      description: stmt.properties.description || "",
      steps: stmt.properties.steps || [],
      validation: stmt.properties.validation || [],
      humanPrompt: this.generateTaskPrompt(stmt),
      machinePrompt: JSON.stringify({
        type: "task",
        name: stmt.properties.name,
        steps: stmt.properties.steps
      }, null, 2)
    };
  }

  /**
   * Compile ai-rule to JSON
   */
  compileRule(stmt) {
    return {
      type: "rule",
      trigger: stmt.properties.trigger || "",
      condition: stmt.properties.condition || "",
      action: stmt.properties.action || "",
      priority: stmt.properties.priority || "normal",
      humanPrompt: this.generateRulePrompt(stmt),
      machinePrompt: JSON.stringify({
        type: "rule",
        trigger: stmt.properties.trigger,
        condition: stmt.properties.condition,
        action: stmt.properties.action
      }, null, 2)
    };
  }

  /**
   * Generate human-readable prompt from instruction
   */
  generateHumanPrompt(stmt) {
    const props = stmt.properties;
    return `
I need you to ${props.action || "help me"}.

Context: ${props.context || "General programming"}
Language: ${props.language || "Auto-detect"}
Output Format: ${props.output || "Code"}

${props.constraints ? `Constraints:\n${Array.isArray(props.constraints) ? props.constraints.map(c => `- ${c}`).join("\n") : `- ${props.constraints}`}` : ""}

Please provide the ${props.output || "code"} with clear comments and explanations.
    `.trim();
  }

  /**
   * Generate machine-readable prompt from instruction
   */
  generateMachinePrompt(stmt) {
    return JSON.stringify(
      {
        version: "1.0.0",
        type: "instruction",
        action: stmt.properties.action,
        context: stmt.properties.context,
        language: stmt.properties.language,
        constraints: stmt.properties.constraints,
        outputFormat: stmt.properties.output,
        metadata: {
          timestamp: new Date().toISOString(),
          source: "smeagol-dsl"
        }
      },
      null,
      2
    );
  }

  /**
   * Generate task prompt
   */
  generateTaskPrompt(stmt) {
    const props = stmt.properties;
    return `
Task: ${props.name || "Untitled"}

${props.description || ""}

Steps:
${Array.isArray(props.steps) ? props.steps.map((s, i) => `${i + 1}. ${s}`).join("\n") : props.steps}

Validation:
${Array.isArray(props.validation) ? props.validation.map(v => `✓ ${v}`).join("\n") : props.validation}
    `.trim();
  }

  /**
   * Generate rule prompt
   */
  generateRulePrompt(stmt) {
    const props = stmt.properties;
    return `
Rule: ${props.trigger || "Untitled"}

When: ${props.condition || "Always"}
Then: ${props.action || "Do something"}
Priority: ${props.priority || "Normal"}
    `.trim();
  }

  /**
   * Register DSL commands in VS Code
   */
  register(context) {
    // Compile DSL file
    context.subscriptions.push(
      vscode.commands.registerCommand("smeagol.dsl.compile", async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          vscode.window.showErrorMessage("No file open");
          return;
        }

        const dslInput = editor.document.getText();
        const compiled = this.compile(dslInput);

        // Show compiled output in a new tab
        const outputDoc = await vscode.workspace.openTextDocument({
          language: "json",
          content: JSON.stringify(compiled, null, 2)
        });

        await vscode.window.showTextDocument(outputDoc);
        vscode.window.showInformationMessage(`✓ DSL compiled successfully (${compiled.instructions.length} instructions)`);
      })
    );

    // Generate human prompt from DSL
    context.subscriptions.push(
      vscode.commands.registerCommand("smeagol.dsl.toHuman", async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          vscode.window.showErrorMessage("No file open");
          return;
        }

        const dslInput = editor.document.getText();
        const compiled = this.compile(dslInput);

        const humanPrompts = compiled.instructions
          .map(instr => instr.humanPrompt || "")
          .join("\n\n---\n\n");

        const outputDoc = await vscode.workspace.openTextDocument({
          language: "markdown",
          content: `# Generated Human Prompts\n\n${humanPrompts}`
        });

        await vscode.window.showTextDocument(outputDoc);
      })
    );

    // Generate machine prompt from DSL
    context.subscriptions.push(
      vscode.commands.registerCommand("smeagol.dsl.toMachine", async () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          vscode.window.showErrorMessage("No file open");
          return;
        }

        const dslInput = editor.document.getText();
        const compiled = this.compile(dslInput);

        const machinePrompts = compiled.instructions
          .map(instr => instr.machinePrompt || "")
          .join("\n\n");

        const outputDoc = await vscode.workspace.openTextDocument({
          language: "json",
          content: machinePrompts
        });

        await vscode.window.showTextDocument(outputDoc);
      })
    );
  }
}

module.exports = { AiDslCompiler };
