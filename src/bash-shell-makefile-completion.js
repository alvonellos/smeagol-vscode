"use strict";

/**
 * Bash/Shell/Makefile Completion Provider
 * 
 * High-quality completions for:
 * - Bash/Shell scripting
 * - Makefile targets and variables
 * - Common shell utilities
 * - Build automation
 */

const vscode = require("vscode");

class BashShellMakefileCompletion {
  constructor() {
    this.completionItems = [];
    this._initializeCompletions();
  }

  /**
   * Initialize completion items
   * @returns {void}
   */
  _initializeCompletions() {
    this.bashBuiltins = [
      // Control flow
      this._createCompletionItem("if", "if statement", "if [[ $var -eq 0 ]]; then\n\techo 'zero'\nfi"),
      this._createCompletionItem("for", "for loop", "for item in ${array[@]}; do\n\techo $item\ndone"),
      this._createCompletionItem("while", "while loop", "while [[ $count -lt 10 ]]; do\n\t((count++))\ndone"),
      this._createCompletionItem("case", "case statement", "case $var in\n\tpattern)\n\t\tcommand\n\t\t;;\nesac"),

      // String operations
      this._createCompletionItem("${var}", "variable expansion", "Use as ${var} or ${var:default}"),
      this._createCompletionItem("${#var}", "string length", "Returns length of variable"),
      this._createCompletionItem("${var:0:5}", "substring", "Extract substring (offset:length)"),
      this._createCompletionItem("${var//old/new}", "replace all", "Replace all occurrences"),

      // Arrays
      this._createCompletionItem("declare -a", "declare array", "declare -a myarray=( 'a' 'b' 'c' )"),
      this._createCompletionItem("${array[@]}", "all array elements", "Access all elements"),
      this._createCompletionItem("${#array[@]}", "array length", "Get array size"),

      // Functions
      this._createCompletionItem("function", "function definition", "function my_func() {\n\t# body\n}"),
      this._createCompletionItem("local", "local variable", "local var='value'"),
      this._createCompletionItem("return", "return from function", "return 0  # success"),

      // I/O redirection
      this._createCompletionItem(">", "redirect stdout", "command > file"),
      this._createCompletionItem(">>", "append stdout", "command >> file"),
      this._createCompletionItem("2>", "redirect stderr", "command 2> error.log"),
      this._createCompletionItem("2>&1", "redirect stderr to stdout", "command 2>&1"),
      this._createCompletionItem("<<<", "here string", "command <<< $var"),

      // Common utilities
      this._createCompletionItem("grep", "text search", "grep 'pattern' file.txt"),
      this._createCompletionItem("sed", "stream editor", "sed 's/old/new/g' file.txt"),
      this._createCompletionItem("awk", "text processing", "awk '{print $1}' file.txt"),
      this._createCompletionItem("find", "find files", "find . -name '*.txt' -type f"),
      this._createCompletionItem("xargs", "batch processing", "find . -name '*.tmp' | xargs rm"),

      // Process management
      this._createCompletionItem("&", "background process", "command &"),
      this._createCompletionItem("wait", "wait for processes", "wait $!"),
      this._createCompletionItem("trap", "signal handler", "trap 'cleanup' EXIT"),
      this._createCompletionItem("kill", "terminate process", "kill -9 $$"),

      // Conditionals
      this._createCompletionItem("-eq", "numeric equals", "[[ $a -eq $b ]]"),
      this._createCompletionItem("-lt", "numeric less than", "[[ $a -lt $b ]]"),
      this._createCompletionItem("-f", "file exists", "[[ -f filename ]]"),
      this._createCompletionItem("-d", "directory exists", "[[ -d dirname ]]"),
      this._createCompletionItem("-z", "string empty", "[[ -z $str ]]"),
      this._createCompletionItem("-n", "string not empty", "[[ -n $str ]]"),
    ];

    this.makefileItems = [
      this._createCompletionItem(".PHONY", "phony target", ".PHONY: all build clean\nall: build"),
      this._createCompletionItem(".DEFAULT", "default target", ".DEFAULT: help"),
      this._createCompletionItem("@", "silent execution", "@echo 'Building...'"),
      this._createCompletionItem("+", "execute always", "+cd dir && make"),
      this._createCompletionItem("-", "ignore errors", "-rm *.o || true"),

      this._createCompletionItem("ifdef", "conditional", "ifdef DEBUG\nFLAGS += -g\nendif"),
      this._createCompletionItem("ifeq", "string compare", "ifeq ($(OS),Linux)\nFLAGS += -fPIC\nendif"),

      this._createCompletionItem("$@", "target name", "Output: $@"),
      this._createCompletionItem("$<", "first dependency", "Source: $<"),
      this._createCompletionItem("$^", "all dependencies", "Deps: $^"),
      this._createCompletionItem("$%", "archive member", "Archive member: $%"),
      this._createCompletionItem("$*", "stem", "Stem: $*"),
      this._createCompletionItem("$?", "newer deps", "Updated: $?"),

      this._createCompletionItem("wildcard", "glob", "SOURCES := $(wildcard src/*.c)"),
      this._createCompletionItem("patsubst", "pattern substitution", "OBJS := $(patsubst %.c,%.o,$(SOURCES))"),
      this._createCompletionItem("addprefix", "add prefix", "INCLUDES := $(addprefix -I,$(INC_DIRS))"),
      this._createCompletionItem("shell", "shell command", "VERSION := $(shell git describe --tags)"),

      this._createCompletionItem("all", "build all", "all: target1 target2"),
      this._createCompletionItem("clean", "clean build", "clean:\n\trm -rf build/"),
      this._createCompletionItem("install", "install target", "install:\n\tcp output /usr/local/bin/"),
      this._createCompletionItem("help", "help target", "help:\n\t@echo 'Available targets'"),
      this._createCompletionItem("test", "test target", "test:\n\t./run_tests.sh"),
    ];
  }

  /**
   * Get completions for document
   * @param {vscode.TextDocument} document - Document
   * @param {vscode.Position} position - Cursor position
   * @returns {vscode.CompletionItem[]}
   */
  provideCompletionItems(document, position) {
    const fileName = document.fileName;
    const text = document.getText(new vscode.Range(position.line, 0, position.line, position.character));

    // Determine file type
    if (fileName.includes("Makefile")) {
      return this._getMakefileCompletions(text);
    } else if (
      fileName.endsWith(".sh") ||
      fileName.endsWith(".bash") ||
      document.languageId === "shellscript"
    ) {
      return this._getBashCompletions(text);
    }

    return [];
  }

  /**
   * Get Bash completions
   * @param {string} text - Current line text
   * @returns {vscode.CompletionItem[]}
   */
  _getBashCompletions(text) {
    let items = [...this.bashBuiltins];

    // Context-aware completions
    if (text.includes("if ")) {
      items.push(
        this._createCompletionItem("[[ ... ]]", "bash conditional", "[[ condition ]] && echo 'true' || echo 'false'")
      );
    }

    if (text.includes("for ")) {
      items.push(
        this._createCompletionItem("in", "in keyword", "for item in ${array[@]}; do")
      );
    }

    // Variable pattern completions
    if (text.includes("$")) {
      const commonVars = [
        "$@", "$#", "$?", "$$", "$!", "$0", "$1", "$*", "$PWD", "$HOME", "$USER",
      ];
      items.push(
        ...commonVars.map((v) =>
          this._createCompletionItem(v, "shell variable", `Variable: ${v}`)
        )
      );
    }

    return items;
  }

  /**
   * Get Makefile completions
   * @param {string} text - Current line text
   * @returns {vscode.CompletionItem[]}
   */
  _getMakefileCompletions(text) {
    let items = [...this.makefileItems];

    // Pattern rule completions
    if (text.includes("%.")) {
      items.push(
        this._createCompletionItem("%.o: %.c", "C object rule", "%.o: %.c\n\tgcc -c $< -o $@")
      );
    }

    // Function completions
    if (text.includes("$(")) {
      const functions = ["wildcard", "patsubst", "addprefix", "addsuffix", "shell", "sort", "dir"];
      items.push(
        ...functions.map((f) =>
          this._createCompletionItem(f, "makefile function", `$(${f} ...)`)
        )
      );
    }

    return items;
  }

  /**
   * Create completion item helper
   * @param {string} label - Label
   * @param {string} kind - Kind description
   * @param {string} detail - Detail/example
   * @returns {vscode.CompletionItem}
   */
  _createCompletionItem(label, kind, detail) {
    const item = new vscode.CompletionItem(label, vscode.CompletionItemKind.Keyword);
    item.detail = kind;
    item.documentation = new vscode.MarkdownString(`**${kind}**\n\n\`\`\`bash\n${detail}\n\`\`\``);
    return item;
  }

  /**
   * Resolve completion item with full documentation
   * @param {vscode.CompletionItem} item - Completion item
   * @returns {vscode.CompletionItem}
   */
  resolveCompletionItem(item) {
    return item;
  }
}

module.exports = { BashShellMakefileCompletion };
