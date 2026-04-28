"use strict";

const vscode = require("vscode");
const { getConfig } = require("./config");
const { HighlightManager } = require("./highlights");
const { IndentManager } = require("./indent");
const { FunctionManager } = require("./functions");
const { HtmlManager } = require("./html");
const { BracketGuidesManager } = require("./brackets");
const { RustHighlighter } = require("./rust-highlighter");
const { JavaHighlighter } = require("./java-highlighter");
const { CppHighlighter } = require("./cpp-highlighter");
const { AutoItHighlighter } = require("./autoit-highlighter");
const { AplHighlighter } = require("./apl-highlighter");
const { AdaHighlighter } = require("./ada-highlighter");
const { AutoItCompletionProvider } = require("./autoit-completion");
const { RustCompletionProvider } = require("./rust-completion");
const { AdaCompletionProvider } = require("./ada-completion");
const { LombokCompletionProvider } = require("./lombok-completion");
const { PythonCompletionProvider } = require("./python-completion");
const { PythonCompletionProvider: PythonCompletionProviderEnhanced } = require("./python-completion-enhanced");
const { SpringBootCompletionProvider, KubernetesCompletionProvider } = require("./spring-kubernetes-completion");
const { ShellCompletionProvider, PowerShellCompletionProvider } = require("./shell-powershell-completion");
const { MavenCompletionProvider, GroovyCompletionProvider, JenkinsCompletionProvider } = require("./maven-groovy-jenkins-completion");
const { AplCompletionProvider } = require("./apl-completion");
const { GoCompletionProvider } = require("./go-completion");
const { YamlCompletionProvider } = require("./yaml-completion");
const { KotlinCompletionProvider } = require("./kotlin-completion");
const { TypeScriptCompletionProvider } = require("./typescript-completion");
const { CSharpCompletionProvider } = require("./csharp-completion");
const { AiHelpersModule } = require("./ai-helpers");
const { ConcordanceSystem } = require("./concordance-system");
const { SmeagolTools } = require("./smeagol-tools");
const { Debouncer } = require("./debouncer");
const { SonarQubeConnector } = require("./sonarqube-connector");
const { AiDslCompiler } = require("./ai-dsl-compiler");
const { ComplexityAnalyzer } = require("./complexity-analyzer");
const { SymbolSummoner } = require("./symbol-summoner");
const { IdiomsAnalyzer } = require("./idioms-analyzer");
const { CodePatternsAnalyzer } = require("./code-patterns-analyzer");
const { SuggestionEngine } = require("./suggestion-engine");
const { NeuroUI } = require("./neurodivergent-ui-system");
const { QuokkaEngine } = require("./quokka-engine");
const { ORMGenerator } = require("./orm-generator");
const { DiagramPreviewSystem } = require("./diagram-preview-system");
const { MavenHelper } = require("./maven-helper");
const { GoctlGenerator } = require("./goctl-generator");
const { AdvancedRustAnalyzer } = require("./advanced-rust-analyzer");
const { BashShellMakefileCompletion } = require("./bash-shell-makefile-completion");
const { EnhancedAutoItConfigAnalyzer } = require("./enhanced-autoit-config-analyzer");
const { ConversationLogger } = require("./conversation-logger");
const { ADA_DOCUMENT_SELECTORS } = require("./ada-support");

class SmeagolController {
  constructor(context) {
    this.context = context;
    this.highlightManager = new HighlightManager();
    this.indentManager = new IndentManager();
    this.functionManager = new FunctionManager();
    this.htmlManager = new HtmlManager();
    this.bracketGuidesManager = new BracketGuidesManager();
    this.rustHighlighter = new RustHighlighter();
    this.javaHighlighter = new JavaHighlighter();
    this.cppHighlighter = new CppHighlighter();
    this.autoitHighlighter = new AutoItHighlighter();
    this.aplHighlighter = new AplHighlighter();
    this.adaHighlighter = new AdaHighlighter();
    this.autoitCompletionProvider = new AutoItCompletionProvider();
    this.rustCompletionProvider = new RustCompletionProvider();
    this.adaCompletionProvider = new AdaCompletionProvider();
    this.lombokCompletionProvider = new LombokCompletionProvider();
    this.pythonCompletionProvider = new PythonCompletionProvider();
    this.springBootCompletionProvider = new SpringBootCompletionProvider();
    this.kubernetesCompletionProvider = new KubernetesCompletionProvider();
    this.shellCompletionProvider = new ShellCompletionProvider();
    this.powershellCompletionProvider = new PowerShellCompletionProvider();
    this.mavenCompletionProvider = new MavenCompletionProvider();
    this.groovyCompletionProvider = new GroovyCompletionProvider();
    this.jenkinsCompletionProvider = new JenkinsCompletionProvider();
    this.aplCompletionProvider = new AplCompletionProvider();
    this.goCompletionProvider = new GoCompletionProvider();
    this.yamlCompletionProvider = new YamlCompletionProvider();
    this.kotlinCompletionProvider = new KotlinCompletionProvider();
    this.pythonCompletionProviderEnhanced = new PythonCompletionProviderEnhanced();
    this.typeScriptCompletionProvider = new TypeScriptCompletionProvider();
    this.csharpCompletionProvider = new CSharpCompletionProvider();
    this.aiHelpersModule = new AiHelpersModule(context);
    this.smeagolTools = new SmeagolTools();
    this.sonarQubeConnector = new SonarQubeConnector();
    this.aiDslCompiler = new AiDslCompiler();
    this.complexityAnalyzer = new ComplexityAnalyzer();
    this.symbolSummoner = new SymbolSummoner();
    this.idiomsAnalyzer = new IdiomsAnalyzer();
    this.codePatterns = new CodePatternsAnalyzer();
    this.suggestionEngine = new SuggestionEngine();
    this.neuroUI = new NeuroUI();
    this.quokkaEngine = new QuokkaEngine();
    this.ormGenerator = new ORMGenerator();
    this.diagramPreview = new DiagramPreviewSystem();
    this.mavenHelper = new MavenHelper();
    this.goctlGenerator = new GoctlGenerator();
    this.rustAnalyzer = new AdvancedRustAnalyzer();
    this.bashCompletion = new BashShellMakefileCompletion();
    this.autoitAnalyzer = new EnhancedAutoItConfigAnalyzer();
    this.conversationLogger = new ConversationLogger(context.extensionPath);
    this.updateTimer = null;
    this.updateId = 0;
  }

  start() {
    const schedule = () => this.scheduleUpdate();
    
    // Optional diagnostics pass. Commands still run analysis on demand.
    const autoAnalyzeComplexity = (editor) => {
      const cfg = vscode.workspace.getConfiguration("smeagol");
      if (cfg.get("analysis.autoAnalyze", false) && editor && editor.document && !editor.document.isUntitled) {
        this.complexityAnalyzer.analyzeDocument(editor);
        this.idiomsAnalyzer.analyzeDocument(editor);
      }
    };
    
    this.context.subscriptions.push(
      vscode.window.onDidChangeActiveTextEditor((editor) => {
        schedule();
        autoAnalyzeComplexity(editor);
      }),
      vscode.window.onDidChangeVisibleTextEditors(schedule),
      vscode.window.onDidChangeTextEditorVisibleRanges(schedule),
      vscode.workspace.onDidChangeTextDocument((event) => {
        schedule();
        const editor = vscode.window.activeTextEditor;
        if (editor && editor.document === event.document) {
          autoAnalyzeComplexity(editor);
        }
      }),
      vscode.window.onDidChangeTextEditorOptions(schedule),
      vscode.workspace.onDidChangeConfiguration(() => {
        this.highlightManager.reset();
        this.indentManager.reset();
        this.functionManager.reset();
        this.htmlManager.reset();
        this.bracketGuidesManager.reset();
        this.rustHighlighter.reset();
        this.javaHighlighter.reset();
        this.cppHighlighter.reset();
        this.autoitHighlighter.reset();
        this.aplHighlighter.reset();
        this.adaHighlighter.reset();
        schedule();
      }),
      // Register AutoIt completion provider.
      vscode.languages.registerCompletionItemProvider(
        { language: 'autoit', scheme: 'file' },
        this.autoitCompletionProvider,
        // Trigger on common characters
        '$', '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
        'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
        'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
      ),
      // Register Rust completion provider.
      vscode.languages.registerCompletionItemProvider(
        { language: 'rust', scheme: 'file' },
        this.rustCompletionProvider,
        'V', 'S', 'H', 'M', 'A', 'I', 'O', 'R', 'B', 'F', 'E', 'T', 'C', 'D', 'P', 'L', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
      ),
      // Register Ada completion provider - packages, pragmas, attributes, and declarations.
      vscode.languages.registerCompletionItemProvider(
        ADA_DOCUMENT_SELECTORS,
        this.adaCompletionProvider,
        '\'', '.', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
        'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
        'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
      ),
      // Register Lombok completion provider.
      vscode.languages.registerCompletionItemProvider(
        { language: 'java', scheme: 'file' },
        this.lombokCompletionProvider,
        '@'
      ),
      // Python completions
      vscode.languages.registerCompletionItemProvider(
        { language: 'python', scheme: 'file' },
        this.pythonCompletionProvider,
        'p', 'i', 'a', 'n', 'l', 'd', 's', 't', 'r', 'f', 'b', 'g', 'm', 'e', '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
      ),
      // Spring Boot completions
      vscode.languages.registerCompletionItemProvider(
        { language: 'java', scheme: 'file' },
        this.springBootCompletionProvider,
        '@', 's', 'S', 'l', 'o', 'r', 'c', 'm'
      ),
      // Kubernetes YAML completions
      vscode.languages.registerCompletionItemProvider(
        { language: 'yaml', scheme: 'file' },
        this.kubernetesCompletionProvider,
        'k', 'a', 's', 'P', 'D', 'C', 'J', 'S', 'I', 'N', 'R', 'm', 'c', 'l', 'v', 'p'
      ),
      // Shell/Bash completions
      vscode.languages.registerCompletionItemProvider(
        { language: 'shell', scheme: 'file' },
        this.shellCompletionProvider,
        'e', 'c', 'l', 'p', 'd', 'm', 'r', 'k', 'f', 'g', 's', 'a', 'w', 't', 'n', 'x', 'i', 'o'
      ),
      // PowerShell completions
      vscode.languages.registerCompletionItemProvider(
        { language: 'powershell', scheme: 'file' },
        this.powershellCompletionProvider,
        'G', 'S', 'C', 'M', 'R', 'N', 'g', 's', 'c', 'm', 'r', 'n', 'T', 'I', 'A', 'W', 'a', 'w'
      ),
      // Maven completions
      vscode.languages.registerCompletionItemProvider(
        { language: 'xml', scheme: 'file' },
        this.mavenCompletionProvider,
        'm', 'c', 'd', 'p', 'g', 'a', 'v', 'b', 's'
      ),
      // Groovy completions
      vscode.languages.registerCompletionItemProvider(
        { language: 'groovy', scheme: 'file' },
        this.groovyCompletionProvider,
        'd', 'c', 'i', 'e', 't', 'a', '[', '/', '"', 'f', 'm', 's', 'j'
      ),
      // Jenkins declarative pipeline completions
      vscode.languages.registerCompletionItemProvider(
        { language: 'groovy', scheme: 'file' },
        this.jenkinsCompletionProvider,
        'p', 'a', 's', 't', 's', 'p', 'a', 'a', 'e', 'w', 'j', 'b', 's', 'r', 'u', 'c', 'f', 'g'
      ),
      // APL completions.
      vscode.languages.registerCompletionItemProvider(
        { language: 'apl', scheme: 'file' },
        this.aplCompletionProvider,
        '⍴', '⌽', '⍒', '⍋', '⊖', ',', '↑', '↓', '⊂', '⊃', '∪', '∩', '⍳', '⍕', '⍎',
        '/', '\\', '.', '∘', '@', '⍨', '¨', ':', '←', '→', '⎕',
        '¬', '-', '+', '×', '÷', '⌈', '⌊', '|', '⋆', '⍟', '○', '!', '?',
        '=', '≠', '<', '>', '≤', '≥',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
      ),
      // Go completions.
      vscode.languages.registerCompletionItemProvider(
        { language: 'go', scheme: 'file' },
        this.goCompletionProvider,
        'f', 'i', 'n', 's', 'c', 'h', 'e', 't', 'b', 'm', 'o', 'r', 'j', 'p', 'u', 'd', 'g', 'k', 'l', 'v', 'w', 'x', 'y', 'z',
        'F', 'I', 'N', 'S', 'C', 'H', 'E', 'T', 'B', 'M', 'O', 'R', 'J', 'P', 'U', 'D', 'G', 'K', 'L', 'V', 'W', 'X', 'Y', 'Z'
      ),
      // YAML completions.
      vscode.languages.registerCompletionItemProvider(
        { language: 'yaml', scheme: 'file' },
        this.yamlCompletionProvider,
        'v', 's', 'd', 'i', 'n', 'c', 'e', 't', 'p', 'r', 'a', 'm', 'l', 'j', 'o', 'w',
        'V', 'S', 'D', 'I', 'N', 'C', 'E', 'T', 'P', 'R', 'A', 'M', 'L', 'J', 'O', 'W'
      ),
      // Kotlin completions - Coroutines, stdlib, Android, extension functions!
      vscode.languages.registerCompletionItemProvider(
        { language: 'kotlin', scheme: 'file' },
        this.kotlinCompletionProvider,
        'f', 'c', 'l', 'd', 'e', 'w', 'r', 'v', 's', 'i', 'n', 'p', 't', 'b', 'o', 'a', 'm', 'k', 'g', 'u', 'x', 'y', 'z',
        'F', 'C', 'L', 'D', 'E', 'W', 'R', 'V', 'S', 'I', 'N', 'P', 'T', 'B', 'O', 'A', 'M', 'K', 'G', 'U', 'X', 'Y', 'Z'
      ),
      // Python Enhanced completions - 100+ items, stdlib, async, decorators, frameworks!
      vscode.languages.registerCompletionItemProvider(
        { language: 'python', scheme: 'file' },
        this.pythonCompletionProviderEnhanced,
        'i', 'f', 'c', 'd', 'a', 'l', 'r', 'w', 'e', 'b', 's', 't', 'o', 'm', 'n', 'p', 'k', 'g', 'v', 'x', 'y', 'z',
        'I', 'F', 'C', 'D', 'A', 'L', 'R', 'W', 'E', 'B', 'S', 'T', 'O', 'M', 'N', 'P', 'K', 'G', 'V', 'X', 'Y', 'Z',
        '@', '.'
      ),
      // TypeScript completions - Types, generics, async, decorators, stdlib!
      vscode.languages.registerCompletionItemProvider(
        { language: 'typescript', scheme: 'file' },
        this.typeScriptCompletionProvider,
        'i', 't', 'e', 'n', 'c', 'a', 's', 'p', 'r', 'd', 'l', 'g', 'f', 'v', 'b', 'o', 'w', 'k', 'm', 'x', 'y', 'z',
        'I', 'T', 'E', 'N', 'C', 'A', 'S', 'P', 'R', 'D', 'L', 'G', 'F', 'V', 'B', 'O', 'W', 'K', 'M', 'X', 'Y', 'Z',
        '<', '.'
      ),
      // C# completions - LINQ, async/await, attributes, .NET stdlib!
      vscode.languages.registerCompletionItemProvider(
        { language: 'csharp', scheme: 'file' },
        this.csharpCompletionProvider,
        'c', 's', 'i', 'e', 'n', 'a', 't', 'd', 'f', 'p', 'r', 'o', 'l', 'g', 'b', 'w', 'k', 'm', 'v', 'u', 'x', 'y', 'z',
        'C', 'S', 'I', 'E', 'N', 'A', 'T', 'D', 'F', 'P', 'R', 'O', 'L', 'G', 'B', 'W', 'K', 'M', 'V', 'U', 'X', 'Y', 'Z',
        '<', '.', '['
      )
    );

    // Register Smeagol Tools
    this.smeagolTools.register(this.context);

    // Register SonarQube connector
    this.sonarQubeConnector.register(this.context);

    // Register AI DSL Compiler
    this.aiDslCompiler.register(this.context);

    // ========== NEW FEATURE INTEGRATIONS ==========
    
    // Register Quokka live evaluation command
    this.context.subscriptions.push(
      vscode.commands.registerCommand("smeagol.quokkaEvaluate", async () => {
        try {
          const editor = vscode.window.activeTextEditor;
          if (!editor) {
            vscode.window.showWarningMessage("No active editor");
            this.conversationLogger.logCommand("smeagol.quokkaEvaluate", "Live evaluation (Ctrl+Shift+L)", { noEditor: true }, false);
            return;
          }

          const selection = editor.selection;
          const text = editor.document.getText(selection);
          if (!text.trim()) {
            vscode.window.showWarningMessage("Select code to evaluate");
            this.conversationLogger.logCommand("smeagol.quokkaEvaluate", "Live evaluation", { noSelection: true }, false);
            return;
          }

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
            this.conversationLogger.logCommand("smeagol.quokkaEvaluate", "Live evaluation", { language: langId, result: result.result }, true);
            this.conversationLogger.logFeatureUsage("Quokka", `Evaluated ${langId} code: ${text.slice(0, 50)}...`, { resultType: result.type });
          } else {
            vscode.window.showErrorMessage(`✕ Evaluation error: ${result.error}`);
            this.conversationLogger.logError("Quokka", result.error, `language: ${langId}`);
          }
        } catch (error) {
          this.conversationLogger.logError("Quokka", error, "Exception in quokkaEvaluate command");
          vscode.window.showErrorMessage(`Quokka error: ${error.message}`);
        }
      })
    );

    // Register ORM generator commands
    this.context.subscriptions.push(
      vscode.commands.registerCommand("smeagol.generateJPAEntity", async () => {
        try {
          const name = await vscode.window.showInputBox({
            prompt: "Entity class name (e.g., User)",
            placeHolder: "User"
          });
          
          if (!name) {
            this.conversationLogger.logConversation("JPA Entity generation cancelled", "User input dialog", "Cancelled by user");
            return;
          }

          const entity = this.ormGenerator.generateJPAEntity(name, [
            { name: "id", type: "int", primary_key: true },
            { name: "name", type: "string", nullable: false },
            { name: "email", type: "string", unique: true },
          ], { generateLombok: true });

          const doc = await vscode.workspace.openTextDocument({
            language: "java",
            content: entity
          });
          await vscode.window.showTextDocument(doc);
          
          this.conversationLogger.logCommand("smeagol.generateJPAEntity", "Generate JPA/Hibernate entity", { entityName: name, fieldsCount: 3 }, true);
          this.conversationLogger.logFeatureUsage("ORM Generator", `Generated JPA entity: ${name}`, { orm: "JPA/Hibernate", entityName: name });
        } catch (error) {
          this.conversationLogger.logError("ORM Generator", error, "Failed to generate JPA entity");
          vscode.window.showErrorMessage(`Error generating JPA entity: ${error.message}`);
        }
      }),

      vscode.commands.registerCommand("smeagol.generateSQLAlchemyModel", async () => {
        try {
          const name = await vscode.window.showInputBox({
            prompt: "Model class name (e.g., User)",
            placeHolder: "User"
          });
          
          if (!name) {
            this.conversationLogger.logConversation("SQLAlchemy model generation cancelled", "User input dialog", "Cancelled by user");
            return;
          }

          const model = this.ormGenerator.generateSQLAlchemyModel(name, [
            { name: "id", type: "int", primary_key: true },
            { name: "email", type: "string", unique: true },
          ]);

          const doc = await vscode.workspace.openTextDocument({
            language: "python",
            content: model
          });
          await vscode.window.showTextDocument(doc);
          
          this.conversationLogger.logCommand("smeagol.generateSQLAlchemyModel", "Generate SQLAlchemy model", { modelName: name, fieldsCount: 2 }, true);
          this.conversationLogger.logFeatureUsage("ORM Generator", `Generated SQLAlchemy model: ${name}`, { orm: "SQLAlchemy", modelName: name });
        } catch (error) {
          this.conversationLogger.logError("ORM Generator", error, "Failed to generate SQLAlchemy model");
          vscode.window.showErrorMessage(`Error generating SQLAlchemy model: ${error.message}`);
        }
      }),

      vscode.commands.registerCommand("smeagol.generateGORMModel", async () => {
        try {
          const name = await vscode.window.showInputBox({
            prompt: "Model struct name (e.g., User)",
            placeHolder: "User"
          });
          
          if (!name) {
            this.conversationLogger.logConversation("GORM model generation cancelled", "User input dialog", "Cancelled by user");
            return;
          }

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
          
          this.conversationLogger.logCommand("smeagol.generateGORMModel", "Generate GORM model", { modelName: name, fieldsCount: 3 }, true);
          this.conversationLogger.logFeatureUsage("ORM Generator", `Generated GORM model: ${name}`, { orm: "GORM", modelName: name });
        } catch (error) {
          this.conversationLogger.logError("ORM Generator", error, "Failed to generate GORM model");
          vscode.window.showErrorMessage(`Error generating GORM model: ${error.message}`);
        }
      })
    );

    // Register Diagram preview command
    this.context.subscriptions.push(
      vscode.commands.registerCommand("smeagol.diagramPreview", async () => {
        try {
          const editor = vscode.window.activeTextEditor;
          if (!editor) {
            vscode.window.showWarningMessage("No active editor");
            this.conversationLogger.logCommand("smeagol.diagramPreview", "Diagram preview (Ctrl+Shift+D)", { noEditor: true }, false);
            return;
          }

          const fileName = editor.document.fileName;
          const ext = fileName.substring(fileName.lastIndexOf('.')).toLowerCase();
          const diagramType = ['.puml', '.plantuml'].includes(ext) ? 'PlantUML' : ['.mmd', '.mermaid'].includes(ext) ? 'Mermaid' : 'Unknown';
          
          await this.diagramPreview.createPreviewPanel(editor, this.context);
          
          this.conversationLogger.logCommand("smeagol.diagramPreview", "Diagram preview", { diagramType, fileName: editor.document.fileName }, true);
          this.conversationLogger.logFeatureUsage("Diagram Preview", `Rendered ${diagramType} diagram`, { diagramType, fileName });
        } catch (error) {
          this.conversationLogger.logError("Diagram Preview", error, "Failed to create preview panel");
          vscode.window.showErrorMessage(`Error creating diagram preview: ${error.message}`);
        }
      })
    );

    // Register Maven analysis command
    this.context.subscriptions.push(
      vscode.commands.registerCommand("smeagol.mavenAnalyze", async () => {
        try {
          const pomUri = await vscode.window.showOpenDialog({
            filters: { "Maven": ["xml"] },
            canSelectMany: false
          });

          if (!pomUri || pomUri.length === 0) {
            this.conversationLogger.logConversation("Maven analysis cancelled", "File dialog", "No file selected");
            return;
          }

          const summary = await this.mavenHelper.getPomSummary(pomUri[0].fsPath);
          const doc = await vscode.workspace.openTextDocument({
            language: "markdown",
            content: summary
          });
          await vscode.window.showTextDocument(doc);
          
          this.conversationLogger.logCommand("smeagol.mavenAnalyze", "Maven POM analysis", { pomFile: pomUri[0].fsPath }, true);
          this.conversationLogger.logFeatureUsage("Maven Helper", "Analyzed POM dependencies", { pomFile: pomUri[0].fsPath });
        } catch (error) {
          this.conversationLogger.logError("Maven Helper", error, "Failed to analyze Maven POM");
          vscode.window.showErrorMessage(`Error analyzing Maven POM: ${error.message}`);
        }
      })
    );

    // Register Rust analysis command
    this.context.subscriptions.push(
      vscode.commands.registerCommand("smeagol.rustAnalyze", () => {
        try {
          const editor = vscode.window.activeTextEditor;
          if (!editor) {
            vscode.window.showWarningMessage("No active editor");
            this.conversationLogger.logCommand("smeagol.rustAnalyze", "Rust analysis (Ctrl+Shift+R)", { noEditor: true }, false);
            return;
          }

          const analysis = this.rustAnalyzer.analyzeRustFile(editor.document);
          vscode.window.showInformationMessage(
            `Rust analysis: ${analysis.count} issues detected`
          );
          
          this.conversationLogger.logCommand("smeagol.rustAnalyze", "Rust analysis", { fileName: editor.document.fileName, issuesCount: analysis.count }, true);
          this.conversationLogger.logFeatureUsage("Advanced Rust Analyzer", `Analyzed Rust code: ${analysis.count} issues`, { fileName: editor.document.fileName });
        } catch (error) {
          this.conversationLogger.logError("Rust Analyzer", error, "Failed to analyze Rust file");
          vscode.window.showErrorMessage(`Error analyzing Rust file: ${error.message}`);
        }
      })
    );

    // Register Bash completion trigger
    this.context.subscriptions.push(
      vscode.commands.registerCommand("smeagol.bashCompletions", () => {
        try {
          const editor = vscode.window.activeTextEditor;
          if (!editor) {
            this.conversationLogger.logCommand("smeagol.bashCompletions", "Bash completions trigger", { noEditor: true }, false);
            return;
          }

          vscode.commands.executeCommand("editor.action.triggerSuggest");
          this.conversationLogger.logCommand("smeagol.bashCompletions", "Bash completions trigger", { fileName: editor.document.fileName }, true);
        } catch (error) {
          this.conversationLogger.logError("Bash Completion", error, "Failed to trigger completions");
        }
      })
    );

    // Register Bash/Makefile completion providers
    this.context.subscriptions.push(
      vscode.languages.registerCompletionItemProvider(
        ["shellscript", "shell-script", "bash"],
        {
          provideCompletionItems: (document, position) => {
            return this.bashCompletion.provideCompletionItems(document, position);
          }
        },
        "$", ".", "-", "("
      ),

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

    // Auto-trigger Rust analysis on Rust file open
    this.context.subscriptions.push(
      vscode.workspace.onDidOpenTextDocument((document) => {
        if (document.languageId === "rust") {
          // Analyze but don't show popup - user can see in Problems panel
          const editor = vscode.window.visibleTextEditors.find(e => e.document === document);
          if (editor) {
            this.rustAnalyzer.analyzeRustFile(document);
          }
        }
        if (document.languageId === "autoit") {
          const editor = vscode.window.visibleTextEditors.find(e => e.document === document);
          if (editor) {
            this.autoitAnalyzer.analyzeAutoIt(document);
          }
        }
        if (document.fileName.endsWith("pom.xml")) {
          this.mavenHelper.analyzePom(document.fileName).catch(e => {
            console.log("Maven analysis error:", e.message);
          });
        }
      })
    );

    // Auto-show diagram preview on diagram file open
    this.context.subscriptions.push(
      vscode.window.onDidChangeActiveTextEditor((editor) => {
        if (!editor || !editor.document) return;
        
        const fileName = editor.document.fileName;
        if (fileName.endsWith(".puml") || fileName.endsWith(".plantuml") || 
            fileName.endsWith(".mmd") || fileName.endsWith(".mermaid")) {
          this.diagramPreview.createPreviewPanel(editor, this.context).catch(e => {
            console.log("Diagram preview error:", e.message);
          });
        }
      })
    );

    // Register project initialization command
    this.context.subscriptions.push(
      vscode.commands.registerCommand("smeagol.initializeProject", async () => {
        const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
        if (!workspaceRoot) {
          vscode.window.showErrorMessage("No workspace folder open");
          return;
        }
        const concordance = new ConcordanceSystem(workspaceRoot);
        const initialized = await concordance.initialize();
        if (initialized) {
          vscode.window.showInformationMessage("✓ Smeagol project initialized");
        }
      }),
      // Complexity analysis command
      vscode.commands.registerCommand("smeagol.analyzeComplexity", () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          vscode.window.showErrorMessage("No file open");
          return;
        }
        this.complexityAnalyzer.analyzeDocument(editor);
        this.complexityAnalyzer.showReport(editor);
      }),
      // Symbol summoning command
      vscode.commands.registerCommand("smeagol.summonSymbols", async () => {
        await this.symbolSummoner.summonSymbols();
      }),
      // Idioms analysis command
      vscode.commands.registerCommand("smeagol.analyzeIdioms", () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          vscode.window.showErrorMessage("No file open");
          return;
        }
        this.idiomsAnalyzer.analyzeDocument(editor);
        const stats = this.idiomsAnalyzer.getStatistics();
        vscode.window.showInformationMessage(
          `✓ Idioms Analysis: ${stats.totalRules} rules across ${stats.totalLanguages} languages`
        );
      }),
      // AI Code Suggestions command
      vscode.commands.registerCommand("smeagol.getAISuggestions", () => {
        const editor = vscode.window.activeTextEditor;
        if (!editor) {
          vscode.window.showErrorMessage("No file open");
          return;
        }

        const document = editor.document;
        const code = document.getText();
        const language = document.languageId;

        // Analyze patterns
        const patterns = this.codePatterns.analyzeCode(code, language);
        
        if (patterns.length === 0) {
          vscode.window.showInformationMessage("✅ No refactoring suggestions needed!");
          return;
        }

        // Generate suggestions
        const suggestions = this.suggestionEngine.generateSuggestions(patterns);
        
        // Create output channel and display suggestions
        const outputChannel = vscode.window.createOutputChannel("Smeagol: AI Suggestions");
        outputChannel.clear();
        
        outputChannel.append(this.suggestionEngine.formatSuggestions(suggestions));
        outputChannel.append("\n\n");
        
        // Show detailed suggestions for top 3
        suggestions.slice(0, 3).forEach((suggestion, index) => {
          outputChannel.append(`\n\n${'='.repeat(60)}\n`);
          outputChannel.append(`Suggestion ${index + 1}: ${suggestion.title}\n`);
          outputChannel.append(this.suggestionEngine.formatSuggestion(suggestion));
        });

        outputChannel.show();
        vscode.window.showInformationMessage(
          `✓ Found ${patterns.length} pattern(s) to refactor. Check Smeagol: AI Suggestions panel.`
        );
      })
    );

    schedule();
  }

  scheduleUpdate() {
    if (this.updateTimer) {
      clearTimeout(this.updateTimer);
    }
    const delay = getConfig().performance.refreshDelayMs;
    this.updateTimer = setTimeout(() => {
      this.updateAll();
    }, delay);
  }

  async updateAll() {
    this.updateTimer = null;
    const config = getConfig();
    const editors = vscode.window.visibleTextEditors;

    if (!config.enabled) {
      this.highlightManager.clearAll(editors);
      this.indentManager.clearAll(editors);
      this.functionManager.clearAll(editors);
      this.htmlManager.clearAll(editors);
      this.bracketGuidesManager.clearAll(editors);
      this.rustHighlighter.clearAll(editors);
      this.javaHighlighter.clearAll(editors);
      this.cppHighlighter.clearAll(editors);
      this.autoitHighlighter.clearAll(editors);
      this.aplHighlighter.clearAll(editors);
      this.adaHighlighter.clearAll(editors);
      return;
    }

    const updateToken = ++this.updateId;
    
    // Update all highlighting managers in parallel
    await Promise.all([
      this.highlightManager.update(editors, config),
      this.indentManager.update(editors, config),
      this.functionManager.update(editors, config, updateToken),
      this.htmlManager.update(editors, config, updateToken),
      this.bracketGuidesManager.update(editors, config),
      Promise.resolve(editors.forEach(editor => this.rustHighlighter.update(editor))),
      Promise.resolve(editors.forEach(editor => this.javaHighlighter.update(editor))),
      Promise.resolve(editors.forEach(editor => this.cppHighlighter.update(editor))),
      Promise.resolve(editors.forEach(editor => this.autoitHighlighter.update(editor))),
      Promise.resolve(editors.forEach(editor => this.aplHighlighter.update(editor))),
      Promise.resolve(
        config.ada && config.ada.enabled
          ? editors.forEach(editor => this.adaHighlighter.update(editor))
          : this.adaHighlighter.clearAll(editors)
      )
    ]);
  }

  dispose() {
    // Finalize conversation logger (generates summary)
    if (this.conversationLogger) {
      this.conversationLogger.dispose();
    }
    
    this.cppHighlighter.dispose();
    this.autoitHighlighter.dispose();
    this.aplHighlighter.dispose();
    this.adaHighlighter.dispose();
    this.highlightManager.dispose();
    this.indentManager.dispose();
    this.functionManager.dispose();
    this.htmlManager.dispose();
    this.bracketGuidesManager.dispose();
    this.rustHighlighter.dispose();
    this.javaHighlighter.dispose();
    this.smeagolTools.dispose();
    this.complexityAnalyzer.dispose();
    this.symbolSummoner.dispose();
    this.idiomsAnalyzer.dispose();
    // Dispose new features
    if (this.neuroUI) this.neuroUI.dispose();
    if (this.quokkaEngine) this.quokkaEngine.dispose();
    if (this.ormGenerator) this.ormGenerator.dispose();
    if (this.diagramPreview) this.diagramPreview.dispose();
    if (this.mavenHelper) this.mavenHelper.dispose();
    if (this.rustAnalyzer) this.rustAnalyzer.dispose();
    if (this.autoitAnalyzer) this.autoitAnalyzer.dispose();
  }
}

function activate(context) {
  const controller = new SmeagolController(context);
  controller.start();
  context.subscriptions.push(controller);
}

function deactivate() {}

exports.activate = activate;
exports.deactivate = deactivate;
