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
const { AutoItCompletionProvider } = require("./autoit-completion");
const { RustCompletionProvider } = require("./rust-completion");
const { LombokCompletionProvider } = require("./lombok-completion");
const { PythonCompletionProvider } = require("./python-completion");
const { SpringBootCompletionProvider, KubernetesCompletionProvider } = require("./spring-kubernetes-completion");
const { ShellCompletionProvider, PowerShellCompletionProvider } = require("./shell-powershell-completion");
const { MavenCompletionProvider, GroovyCompletionProvider, JenkinsCompletionProvider } = require("./maven-groovy-jenkins-completion");
const { AiHelpersModule } = require("./ai-helpers");

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
    this.autoitCompletionProvider = new AutoItCompletionProvider();
    this.rustCompletionProvider = new RustCompletionProvider();
    this.lombokCompletionProvider = new LombokCompletionProvider();
    this.pythonCompletionProvider = new PythonCompletionProvider();
    this.springBootCompletionProvider = new SpringBootCompletionProvider();
    this.kubernetesCompletionProvider = new KubernetesCompletionProvider();
    this.shellCompletionProvider = new ShellCompletionProvider();
    this.powershellCompletionProvider = new PowerShellCompletionProvider();
    this.mavenCompletionProvider = new MavenCompletionProvider();
    this.groovyCompletionProvider = new GroovyCompletionProvider();
    this.jenkinsCompletionProvider = new JenkinsCompletionProvider();
    this.aiHelpersModule = new AiHelpersModule(context);
    this.updateTimer = null;
    this.updateId = 0;
  }

  start() {
    const schedule = () => this.scheduleUpdate();
    this.context.subscriptions.push(
      vscode.window.onDidChangeActiveTextEditor(schedule),
      vscode.window.onDidChangeVisibleTextEditors(schedule),
      vscode.window.onDidChangeTextEditorVisibleRanges(schedule),
      vscode.workspace.onDidChangeTextDocument(schedule),
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
        schedule();
      }),
      // Register AutoIt completion provider - We provides ALL the precious words!
      vscode.languages.registerCompletionItemProvider(
        { language: 'autoit', scheme: 'file' },
        this.autoitCompletionProvider,
        // Trigger on common characters
        '$', '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
        'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
        'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
      ),
      // Register Rust completion provider - We knows the precious Rust traits and crates!
      vscode.languages.registerCompletionItemProvider(
        { language: 'rust', scheme: 'file' },
        this.rustCompletionProvider,
        'V', 'S', 'H', 'M', 'A', 'I', 'O', 'R', 'B', 'F', 'E', 'T', 'C', 'D', 'P', 'L', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
      ),
      // Register Lombok completion provider - We knows the precious Lombok annotations!
      vscode.languages.registerCompletionItemProvider(
        { language: 'java', scheme: 'file' },
        this.lombokCompletionProvider,
        '@', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
        'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
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
      )
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
      Promise.resolve(editors.forEach(editor => this.autoitHighlighter.update(editor)))
    ]);
  }

  dispose() {
    this.cppHighlighter.dispose();
    this.autoitHighlighter.dispose();
    this.highlightManager.dispose();
    this.indentManager.dispose();
    this.functionManager.dispose();
    this.htmlManager.dispose();
    this.bracketGuidesManager.dispose();
    this.rustHighlighter.dispose();
    this.javaHighlighter.dispose();
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
