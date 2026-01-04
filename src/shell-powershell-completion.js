"use strict";

const vscode = require("vscode");

/**
 * Shell/Bash Completion Provider
 */
class ShellCompletionProvider {
  constructor() {
    this.completionItems = [];
    this.initialize();
  }

  initialize() {
    const completions = [
      // === COMMON COMMANDS ===
      { label: "echo", kind: vscode.CompletionItemKind.Function, detail: "echo [text]", doc: "Print text to stdout." },
      { label: "cd", kind: vscode.CompletionItemKind.Function, detail: "cd [directory]", doc: "Change directory." },
      { label: "ls", kind: vscode.CompletionItemKind.Function, detail: "ls [options] [path]", doc: "List directory contents." },
      { label: "pwd", kind: vscode.CompletionItemKind.Function, detail: "pwd", doc: "Print working directory." },
      { label: "cp", kind: vscode.CompletionItemKind.Function, detail: "cp [options] source dest", doc: "Copy files/directories." },
      { label: "mv", kind: vscode.CompletionItemKind.Function, detail: "mv [options] source dest", doc: "Move/rename files." },
      { label: "rm", kind: vscode.CompletionItemKind.Function, detail: "rm [options] file", doc: "Remove files." },
      { label: "mkdir", kind: vscode.CompletionItemKind.Function, detail: "mkdir [options] dir", doc: "Create directory." },
      { label: "rmdir", kind: vscode.CompletionItemKind.Function, detail: "rmdir dir", doc: "Remove empty directory." },
      { label: "cat", kind: vscode.CompletionItemKind.Function, detail: "cat [files]", doc: "Display file contents." },
      { label: "grep", kind: vscode.CompletionItemKind.Function, detail: "grep [options] pattern [files]", doc: "Search text patterns." },
      { label: "find", kind: vscode.CompletionItemKind.Function, detail: "find [path] [options]", doc: "Find files recursively." },
      { label: "sed", kind: vscode.CompletionItemKind.Function, detail: "sed [options] script [files]", doc: "Stream editor." },
      { label: "awk", kind: vscode.CompletionItemKind.Function, detail: "awk [options] program [files]", doc: "Text processing." },
      { label: "cut", kind: vscode.CompletionItemKind.Function, detail: "cut [options] [files]", doc: "Extract columns." },
      { label: "sort", kind: vscode.CompletionItemKind.Function, detail: "sort [options] [files]", doc: "Sort lines." },
      { label: "uniq", kind: vscode.CompletionItemKind.Function, detail: "uniq [options] [files]", doc: "Remove duplicate lines." },
      { label: "head", kind: vscode.CompletionItemKind.Function, detail: "head [options] [files]", doc: "Print first lines." },
      { label: "tail", kind: vscode.CompletionItemKind.Function, detail: "tail [options] [files]", doc: "Print last lines." },
      { label: "wc", kind: vscode.CompletionItemKind.Function, detail: "wc [options] [files]", doc: "Count words/lines." },
      { label: "xargs", kind: vscode.CompletionItemKind.Function, detail: "xargs [command]", doc: "Execute command with stdin." },
      { label: "tar", kind: vscode.CompletionItemKind.Function, detail: "tar [options] [files]", doc: "Archive files." },
      { label: "zip", kind: vscode.CompletionItemKind.Function, detail: "zip [options] file [files]", doc: "Create zip archive." },
      { label: "unzip", kind: vscode.CompletionItemKind.Function, detail: "unzip [options] file", doc: "Extract zip archive." },

      // === PROCESS COMMANDS ===
      { label: "ps", kind: vscode.CompletionItemKind.Function, detail: "ps [options]", doc: "List processes." },
      { label: "kill", kind: vscode.CompletionItemKind.Function, detail: "kill [signal] pid", doc: "Terminate process." },
      { label: "killall", kind: vscode.CompletionItemKind.Function, detail: "killall [signal] name", doc: "Terminate all matching processes." },
      { label: "bg", kind: vscode.CompletionItemKind.Function, detail: "bg [job]", doc: "Run job in background." },
      { label: "fg", kind: vscode.CompletionItemKind.Function, detail: "fg [job]", doc: "Bring job to foreground." },
      { label: "nohup", kind: vscode.CompletionItemKind.Function, detail: "nohup command", doc: "Run command immune to hangup." },
      { label: "top", kind: vscode.CompletionItemKind.Function, detail: "top", doc: "Display process info." },
      { label: "systemctl", kind: vscode.CompletionItemKind.Function, detail: "systemctl [command] service", doc: "Manage systemd services." },

      // === NETWORK COMMANDS ===
      { label: "ping", kind: vscode.CompletionItemKind.Function, detail: "ping [host]", doc: "Test connectivity." },
      { label: "curl", kind: vscode.CompletionItemKind.Function, detail: "curl [options] URL", doc: "Transfer data from URL." },
      { label: "wget", kind: vscode.CompletionItemKind.Function, detail: "wget [options] URL", doc: "Download files." },
      { label: "netstat", kind: vscode.CompletionItemKind.Function, detail: "netstat [options]", doc: "Network statistics." },
      { label: "ss", kind: vscode.CompletionItemKind.Function, detail: "ss [options]", doc: "Socket statistics." },
      { label: "ifconfig", kind: vscode.CompletionItemKind.Function, detail: "ifconfig [interface]", doc: "Configure network interfaces." },
      { label: "ip", kind: vscode.CompletionItemKind.Function, detail: "ip [object] [command]", doc: "Show/configure routing." },
      { label: "ssh", kind: vscode.CompletionItemKind.Function, detail: "ssh [options] user@host", doc: "Secure shell." },
      { label: "scp", kind: vscode.CompletionItemKind.Function, detail: "scp [options] source dest", doc: "Secure copy." },

      // === SHELL KEYWORDS ===
      { label: "if", kind: vscode.CompletionItemKind.Keyword, detail: "if [condition]; then ... fi", doc: "Conditional statement." },
      { label: "elif", kind: vscode.CompletionItemKind.Keyword, detail: "elif [condition]; then", doc: "Else-if branch." },
      { label: "else", kind: vscode.CompletionItemKind.Keyword, detail: "else", doc: "Else branch." },
      { label: "fi", kind: vscode.CompletionItemKind.Keyword, detail: "fi", doc: "End if statement." },
      { label: "for", kind: vscode.CompletionItemKind.Keyword, detail: "for var in list; do ... done", doc: "For loop." },
      { label: "while", kind: vscode.CompletionItemKind.Keyword, detail: "while [condition]; do ... done", doc: "While loop." },
      { label: "do", kind: vscode.CompletionItemKind.Keyword, detail: "do", doc: "Loop body." },
      { label: "done", kind: vscode.CompletionItemKind.Keyword, detail: "done", doc: "End loop." },
      { label: "case", kind: vscode.CompletionItemKind.Keyword, detail: "case $var in ... esac", doc: "Case statement." },
      { label: "esac", kind: vscode.CompletionItemKind.Keyword, detail: "esac", doc: "End case statement." },
      { label: "function", kind: vscode.CompletionItemKind.Keyword, detail: "function name() { ... }", doc: "Define function." },
      { label: "return", kind: vscode.CompletionItemKind.Keyword, detail: "return [value]", doc: "Return from function." },
      { label: "break", kind: vscode.CompletionItemKind.Keyword, detail: "break", doc: "Break loop." },
      { label: "continue", kind: vscode.CompletionItemKind.Keyword, detail: "continue", doc: "Continue loop." },

      // === VARIABLES/OPERATORS ===
      { label: "$var", kind: vscode.CompletionItemKind.Variable, detail: "$variable", doc: "Variable reference." },
      { label: "${var}", kind: vscode.CompletionItemKind.Variable, detail: "${variable}", doc: "Variable with braces." },
      { label: "$@", kind: vscode.CompletionItemKind.Variable, detail: "$@", doc: "All arguments." },
      { label: "$#", kind: vscode.CompletionItemKind.Variable, detail: "$#", doc: "Number of arguments." },
      { label: "$?", kind: vscode.CompletionItemKind.Variable, detail: "$?", doc: "Last exit code." },
      { label: "&&", kind: vscode.CompletionItemKind.Operator, detail: "&&", doc: "Logical AND." },
      { label: "||", kind: vscode.CompletionItemKind.Operator, detail: "||", doc: "Logical OR." },
      { label: "|", kind: vscode.CompletionItemKind.Operator, detail: "|", doc: "Pipe." },
      { label: ">", kind: vscode.CompletionItemKind.Operator, detail: ">", doc: "Redirect stdout." },
      { label: ">>", kind: vscode.CompletionItemKind.Operator, detail: ">>", doc: "Append to stdout." },
      { label: "<", kind: vscode.CompletionItemKind.Operator, detail: "<", doc: "Redirect stdin." },
      { label: "2>", kind: vscode.CompletionItemKind.Operator, detail: "2>", doc: "Redirect stderr." },
    ];

    completions.forEach(comp => {
      const item = new vscode.CompletionItem(comp.label, comp.kind);
      item.detail = comp.detail;
      if (comp.doc) {
        item.documentation = new vscode.MarkdownString(comp.doc);
      }
      this.completionItems.push(item);
    });
  }

  provideCompletionItems(document, position, token, context) {
    return this.completionItems;
  }

  resolveCompletionItem(item, token) {
    return item;
  }
}

/**
 * PowerShell Completion Provider
 */
class PowerShellCompletionProvider {
  constructor() {
    this.completionItems = [];
    this.initialize();
  }

  initialize() {
    const completions = [
      // === CMDLETS ===
      { label: "Get-ChildItem", kind: vscode.CompletionItemKind.Function, detail: "Get-ChildItem [-Path] [...]", doc: "Get files and folders (ls)." },
      { label: "Get-Item", kind: vscode.CompletionItemKind.Function, detail: "Get-Item [-Path] [...]", doc: "Get item." },
      { label: "Copy-Item", kind: vscode.CompletionItemKind.Function, detail: "Copy-Item [-Path] [-Destination]", doc: "Copy file/folder (cp)." },
      { label: "Move-Item", kind: vscode.CompletionItemKind.Function, detail: "Move-Item [-Path] [-Destination]", doc: "Move file/folder (mv)." },
      { label: "Remove-Item", kind: vscode.CompletionItemKind.Function, detail: "Remove-Item [-Path]", doc: "Delete file/folder (rm)." },
      { label: "New-Item", kind: vscode.CompletionItemKind.Function, detail: "New-Item [-Path] [-ItemType]", doc: "Create file/folder (mkdir)." },
      { label: "Get-Process", kind: vscode.CompletionItemKind.Function, detail: "Get-Process [[-Name]]", doc: "List processes (ps)." },
      { label: "Stop-Process", kind: vscode.CompletionItemKind.Function, detail: "Stop-Process [-Id] [-Force]", doc: "Kill process." },
      { label: "Start-Process", kind: vscode.CompletionItemKind.Function, detail: "Start-Process [-FilePath]", doc: "Start process." },
      { label: "Get-Service", kind: vscode.CompletionItemKind.Function, detail: "Get-Service [[-Name]]", doc: "List services." },
      { label: "Start-Service", kind: vscode.CompletionItemKind.Function, detail: "Start-Service [-Name]", doc: "Start service." },
      { label: "Stop-Service", kind: vscode.CompletionItemKind.Function, detail: "Stop-Service [-Name]", doc: "Stop service." },
      { label: "Get-Content", kind: vscode.CompletionItemKind.Function, detail: "Get-Content [-Path]", doc: "Read file (cat)." },
      { label: "Set-Content", kind: vscode.CompletionItemKind.Function, detail: "Set-Content [-Path] [-Value]", doc: "Write to file." },
      { label: "Add-Content", kind: vscode.CompletionItemKind.Function, detail: "Add-Content [-Path] [-Value]", doc: "Append to file." },
      { label: "Select-Object", kind: vscode.CompletionItemKind.Function, detail: "Select-Object [-Property]", doc: "Select properties." },
      { label: "Where-Object", kind: vscode.CompletionItemKind.Function, detail: "Where-Object { condition }", doc: "Filter objects (grep)." },
      { label: "ForEach-Object", kind: vscode.CompletionItemKind.Function, detail: "ForEach-Object { ... }", doc: "Iterate objects." },
      { label: "Sort-Object", kind: vscode.CompletionItemKind.Function, detail: "Sort-Object [-Property]", doc: "Sort objects (sort)." },
      { label: "Group-Object", kind: vscode.CompletionItemKind.Function, detail: "Group-Object [-Property]", doc: "Group objects." },
      { label: "Measure-Object", kind: vscode.CompletionItemKind.Function, detail: "Measure-Object [-Property]", doc: "Calculate statistics." },
      { label: "Test-Path", kind: vscode.CompletionItemKind.Function, detail: "Test-Path [-Path]", doc: "Check path exists." },
      { label: "Invoke-Command", kind: vscode.CompletionItemKind.Function, detail: "Invoke-Command [-ScriptBlock]", doc: "Execute command." },
      { label: "Invoke-WebRequest", kind: vscode.CompletionItemKind.Function, detail: "Invoke-WebRequest [-Uri]", doc: "HTTP request (curl/wget)." },
      { label: "Write-Host", kind: vscode.CompletionItemKind.Function, detail: "Write-Host [Object]", doc: "Write to console." },
      { label: "Write-Error", kind: vscode.CompletionItemKind.Function, detail: "Write-Error [Object]", doc: "Write error." },
      { label: "Write-Warning", kind: vscode.CompletionItemKind.Function, detail: "Write-Warning [Object]", doc: "Write warning." },
      { label: "Write-Verbose", kind: vscode.CompletionItemKind.Function, detail: "Write-Verbose [Object]", doc: "Write verbose message." },

      // === VARIABLES ===
      { label: "$PSScriptRoot", kind: vscode.CompletionItemKind.Variable, detail: "$PSScriptRoot", doc: "Directory of current script." },
      { label: "$PSCommandPath", kind: vscode.CompletionItemKind.Variable, detail: "$PSCommandPath", doc: "Path of current command." },
      { label: "$error", kind: vscode.CompletionItemKind.Variable, detail: "$error", doc: "Error array." },
      { label: "$env:PATH", kind: vscode.CompletionItemKind.Variable, detail: "$env:VARIABLE", doc: "Environment variable." },
      { label: "$null", kind: vscode.CompletionItemKind.Variable, detail: "$null", doc: "Null value." },
      { label: "$true", kind: vscode.CompletionItemKind.Variable, detail: "$true", doc: "Boolean true." },
      { label: "$false", kind: vscode.CompletionItemKind.Variable, detail: "$false", doc: "Boolean false." },
      { label: "$_", kind: vscode.CompletionItemKind.Variable, detail: "$_", doc: "Current pipeline object." },

      // === KEYWORDS ===
      { label: "if", kind: vscode.CompletionItemKind.Keyword, detail: "if (...) { ... }", doc: "Conditional." },
      { label: "elseif", kind: vscode.CompletionItemKind.Keyword, detail: "elseif (...) { ... }", doc: "Else-if branch." },
      { label: "else", kind: vscode.CompletionItemKind.Keyword, detail: "else { ... }", doc: "Else branch." },
      { label: "foreach", kind: vscode.CompletionItemKind.Keyword, detail: "foreach ($item in $items) { ... }", doc: "For-each loop." },
      { label: "while", kind: vscode.CompletionItemKind.Keyword, detail: "while (...) { ... }", doc: "While loop." },
      { label: "for", kind: vscode.CompletionItemKind.Keyword, detail: "for ($i=0; $i -lt 10; $i++) { ... }", doc: "For loop." },
      { label: "do", kind: vscode.CompletionItemKind.Keyword, detail: "do { ... } while (...)", doc: "Do-while loop." },
      { label: "switch", kind: vscode.CompletionItemKind.Keyword, detail: "switch ($var) { ... }", doc: "Switch statement." },
      { label: "function", kind: vscode.CompletionItemKind.Keyword, detail: "function name { ... }", doc: "Function definition." },
      { label: "param", kind: vscode.CompletionItemKind.Keyword, detail: "param([type] $param)", doc: "Function parameters." },
      { label: "return", kind: vscode.CompletionItemKind.Keyword, detail: "return $value", doc: "Return value." },
      { label: "break", kind: vscode.CompletionItemKind.Keyword, detail: "break", doc: "Break loop." },
      { label: "continue", kind: vscode.CompletionItemKind.Keyword, detail: "continue", doc: "Continue loop." },
    ];

    completions.forEach(comp => {
      const item = new vscode.CompletionItem(comp.label, comp.kind);
      item.detail = comp.detail;
      if (comp.doc) {
        item.documentation = new vscode.MarkdownString(comp.doc);
      }
      this.completionItems.push(item);
    });
  }

  provideCompletionItems(document, position, token, context) {
    return this.completionItems;
  }

  resolveCompletionItem(item, token) {
    return item;
  }
}

module.exports = { ShellCompletionProvider, PowerShellCompletionProvider };
