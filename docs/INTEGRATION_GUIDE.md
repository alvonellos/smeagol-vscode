/**
 * INTEGRATION SUMMARY FOR extension.js
 * 
 * This file shows the exact changes needed to integrate all 9 new modules
 * into the SmeagolController class.
 * 
 * Copy the imports and initialization code below into extension.js
 */

// ========== ADD TO TOP OF extension.js ==========

const { NeuroUI } = require("./neurodivergent-ui-system");
const { QuokkaEngine } = require("./quokka-engine");
const { ORMGenerator } = require("./orm-generator");
const { DiagramPreviewSystem } = require("./diagram-preview-system");
const { MavenHelper } = require("./maven-helper");
const { GoctlGenerator } = require("./goctl-generator");
const { AdvancedRustAnalyzer } = require("./advanced-rust-analyzer");
const { BashShellMakefileCompletion } = require("./bash-shell-makefile-completion");
const { EnhancedAutoItConfigAnalyzer } = require("./enhanced-autoit-config-analyzer");

// ========== ADD TO SmeagolController CONSTRUCTOR ==========

this.neuroUI = new NeuroUI();
this.quokkaEngine = new QuokkaEngine();
this.ormGenerator = new ORMGenerator();
this.diagramPreview = new DiagramPreviewSystem();
this.mavenHelper = new MavenHelper();
this.goctlGenerator = new GoctlGenerator();
this.rustAnalyzer = new AdvancedRustAnalyzer();
this.bashCompletion = new BashShellMakefileCompletion();
this.autoitAnalyzer = new EnhancedAutoItConfigAnalyzer();

// ========== ADD EVENT HANDLER REGISTRATION ==========

// Quokka live evaluation on file change
vscode.workspace.onDidChangeTextDocument((event) => {
  // Optional: Auto-evaluate expressions as user types
  // Would need debouncing to prevent excessive evaluation
});

// Rust analysis on Rust files
vscode.workspace.onDidOpenTextDocument((document) => {
  if (document.languageId === "rust") {
    this.rustAnalyzer.analyzeRustFile(document);
  }
  if (document.languageId === "autoit") {
    this.autoitAnalyzer.analyzeAutoIt(document);
  }
  if (document.fileName.endsWith("pom.xml")) {
    this.mavenHelper.analyzePom(document.fileName).catch(e => {
      console.log("Maven analysis error:", e.message);
    });
  }
  if (document.fileName.includes("Makefile") || document.fileName.endsWith(".sh")) {
    // Bash completion ready
  }
});

// Diagram preview on editor change
vscode.window.onDidChangeActiveTextEditor((editor) => {
  if (editor && editor.document) {
    const fileName = editor.document.fileName;
    if (fileName.endsWith(".puml") || fileName.endsWith(".plantuml") || 
        fileName.endsWith(".mmd") || fileName.endsWith(".mermaid")) {
      this.diagramPreview.createPreviewPanel(editor, this.context).catch(e => {
        console.log("Diagram preview error:", e.message);
      });
    }
  }
});

// ========== COMMAND REGISTRATION ==========

// Quokka: Evaluate selected expression
context.subscriptions.push(
  vscode.commands.registerCommand("smeagol.quokkaEvaluate", async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage("No active editor");
      return;
    }

    const selection = editor.selection;
    const text = editor.document.getText(selection);
    if (!text.trim()) {
      vscode.window.showWarningMessage("Select code to evaluate");
      return;
    }

    // Determine language
    const langId = editor.document.languageId;
    let result;

    switch (langId) {
      case "javascript":
      case "typescript":
        result = this.quokkaEngine.evaluateJavaScript(text, {});
        break;
      case "python":
        result = await this.quokkaEngine.evaluatePython(text, {});
        break;
      case "java":
        result = this.quokkaEngine.evaluateJava(text, {});
        break;
      case "rust":
        result = this.quokkaEngine.evaluateRust(text, {});
        break;
      default:
        result = { success: false, error: "Language not supported for evaluation" };
    }

    if (result.success) {
      this.quokkaEngine.displayInlineResult(editor, selection.active.line, result);
      vscode.window.showInformationMessage(`✓ ${result.result} (${result.type})`);
    } else {
      vscode.window.showErrorMessage(`✕ Evaluation error: ${result.error}`);
    }
  })
);

// ORM: Generate JPA Entity
context.subscriptions.push(
  vscode.commands.registerCommand("smeagol.generateJPAEntity", async () => {
    const name = await vscode.window.showInputBox({
      prompt: "Entity class name (e.g., User)",
      placeHolder: "User"
    });
    
    if (!name) return;

    const entity = this.ormGenerator.generateJPAEntity(name, [
      { name: "id", type: "int", primary_key: true },
      { name: "name", type: "string", nullable: false },
      { name: "email", type: "string", unique: true },
    ], { generateLombok: true });

    // Create new file
    const doc = await vscode.workspace.openTextDocument({
      language: "java",
      content: entity
    });
    await vscode.window.showTextDocument(doc);
  })
);

// ORM: Generate SQLAlchemy Model
context.subscriptions.push(
  vscode.commands.registerCommand("smeagol.generateSQLAlchemyModel", async () => {
    const name = await vscode.window.showInputBox({
      prompt: "Model class name (e.g., User)",
      placeHolder: "User"
    });
    
    if (!name) return;

    const model = this.ormGenerator.generateSQLAlchemyModel(name, [
      { name: "id", type: "int", primary_key: true },
      { name: "email", type: "string", unique: true },
    ]);

    const doc = await vscode.workspace.openTextDocument({
      language: "python",
      content: model
    });
    await vscode.window.showTextDocument(doc);
  })
);

// Diagram: Open preview
context.subscriptions.push(
  vscode.commands.registerCommand("smeagol.diagramPreview", async () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage("No active editor");
      return;
    }
    await this.diagramPreview.createPreviewPanel(editor, context);
  })
);

// Maven: Analyze pom.xml
context.subscriptions.push(
  vscode.commands.registerCommand("smeagol.mavenAnalyze", async () => {
    const pomUri = await vscode.window.showOpenDialog({
      filters: { "Maven": ["xml"] },
      canSelectMany: false
    });

    if (!pomUri || pomUri.length === 0) return;

    const summary = await this.mavenHelper.getPomSummary(pomUri[0].fsPath);
    const doc = await vscode.workspace.openTextDocument({
      language: "markdown",
      content: summary
    });
    await vscode.window.showTextDocument(doc);
  })
);

// Go: Generate GORM Model
context.subscriptions.push(
  vscode.commands.registerCommand("smeagol.generateGORMModel", async () => {
    const name = await vscode.window.showInputBox({
      prompt: "Model struct name (e.g., User)",
      placeHolder: "User"
    });
    
    if (!name) return;

    const model = this.goctlGenerator.generateGoModel(name, [
      { name: "ID", type: "int" },
      { name: "Email", type: "string" },
      { name: "CreatedAt", type: "datetime" }
    ]);

    const doc = await vscode.workspace.openTextDocument({
      language: "go",
      content: model
    });
    await vscode.window.showTextDocument(doc);
  })
);

// Rust: Analyze file
context.subscriptions.push(
  vscode.commands.registerCommand("smeagol.rustAnalyze", () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showWarningMessage("No active editor");
      return;
    }

    const analysis = this.rustAnalyzer.analyzeRustFile(editor.document);
    vscode.window.showInformationMessage(
      `Rust analysis: ${analysis.count} issues detected`
    );
  })
);

// Bash: Show completions
context.subscriptions.push(
  vscode.commands.registerCommand("smeagol.bashCompletions", () => {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    // Trigger completion
    vscode.commands.executeCommand("editor.action.triggerSuggest");
  })
);

// ========== COMPLETION PROVIDER REGISTRATION ==========

// Register Bash/Makefile completion provider
context.subscriptions.push(
  vscode.languages.registerCompletionItemProvider(
    ["shellscript", "shell-script", "bash"],
    {
      provideCompletionItems: (document, position) => {
        const text = document.getText(
          new vscode.Range(position.line, 0, position.line, position.character)
        );
        return this.bashCompletion.provideCompletionItems(document, position);
      }
    },
    "$", ".", "-", "("
  )
);

context.subscriptions.push(
  vscode.languages.registerCompletionItemProvider(
    { pattern: "**/Makefile" },
    {
      provideCompletionItems: (document, position) => {
        return this.bashCompletion.provideCompletionItems(document, position);
      }
    },
    "$", ".", "@", "-"
  )
);

// ========== CLEANUP IN DISPOSE METHOD ==========

dispose() {
  // ... existing dispose code ...
  
  // Dispose new modules
  if (this.quokkaEngine) this.quokkaEngine.dispose();
  if (this.ormGenerator) this.ormGenerator.dispose();
  if (this.diagramPreview) this.diagramPreview.dispose();
  if (this.mavenHelper) this.mavenHelper.dispose();
  if (this.rustAnalyzer) this.rustAnalyzer.dispose();
  if (this.autoitAnalyzer) this.autoitAnalyzer.dispose();
}

// ========== CONTRIBUTION POINTS TO ADD TO package.json ==========

/*
"commands": [
  {
    "command": "smeagol.quokkaEvaluate",
    "title": "Smeagol: Quokka Evaluate (Ctrl+Shift+L)",
    "when": "editorTextFocus"
  },
  {
    "command": "smeagol.generateJPAEntity",
    "title": "Smeagol: Generate JPA Entity",
    "when": "editorLangId == java"
  },
  {
    "command": "smeagol.generateSQLAlchemyModel",
    "title": "Smeagol: Generate SQLAlchemy Model",
    "when": "editorLangId == python"
  },
  {
    "command": "smeagol.generateGORMModel",
    "title": "Smeagol: Generate GORM Model",
    "when": "editorLangId == go"
  },
  {
    "command": "smeagol.diagramPreview",
    "title": "Smeagol: Diagram Preview",
    "when": "resourceExtname =~ /\\.(puml|mmd|plantuml|mermaid)$/"
  },
  {
    "command": "smeagol.mavenAnalyze",
    "title": "Smeagol: Analyze Maven Project",
    "when": "resourceFilename == pom.xml"
  },
  {
    "command": "smeagol.rustAnalyze",
    "title": "Smeagol: Analyze Rust File",
    "when": "editorLangId == rust"
  },
  {
    "command": "smeagol.bashCompletions",
    "title": "Smeagol: Bash Completions",
    "when": "editorLangId == shellscript"
  }
]

"keybindings": [
  {
    "command": "smeagol.quokkaEvaluate",
    "key": "ctrl+shift+l",
    "when": "editorTextFocus"
  },
  {
    "command": "smeagol.diagramPreview",
    "key": "ctrl+shift+d"
  },
  {
    "command": "smeagol.rustAnalyze",
    "key": "ctrl+shift+r",
    "when": "editorLangId == rust"
  }
]
*/

// ========== TEST THE INTEGRATION ==========

/*
1. Open a .py file and select "2 + 2"
   Press Ctrl+Shift+L → Should show ↦ 4 (int)

2. Open a Makefile and type "all:"
   Should get completions for common targets

3. Open a .puml file
   Should automatically show diagram preview on right panel

4. Open pom.xml
   Should analyze and show dependency issues

5. Open a .rs file
   Should detect ownership issues and show diagnostics

6. Run command "Generate JPA Entity"
   Should create new User entity with Lombok annotations
*/
