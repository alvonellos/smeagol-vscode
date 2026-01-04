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
