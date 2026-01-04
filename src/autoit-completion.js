"use strict";

const vscode = require("vscode");

/**
 * AutoIt Completion Provider
 * Provides intelligent code completion for AutoIt scripts
 * "We knows all the precious words and functions... they whisper to us..."
 */
class AutoItCompletionProvider {
  constructor() {
    this.completionItems = [];
    this.initialize();
  }

  initialize() {
    // Comprehensive AutoIt function signatures and documentation
    const functionDocs = [
      // Window Management
      { label: 'MsgBox', kind: vscode.CompletionItemKind.Function, detail: 'MsgBox(flag, "title", "text")', doc: 'Display a message box dialog' },
      { label: 'InputBox', kind: vscode.CompletionItemKind.Function, detail: 'InputBox("prompt", "title")', doc: 'Display an input dialog' },
      { label: 'WinActivate', kind: vscode.CompletionItemKind.Function, detail: 'WinActivate("title")', doc: 'Activate a window by title' },
      { label: 'WinClose', kind: vscode.CompletionItemKind.Function, detail: 'WinClose("title")', doc: 'Close a window by title' },
      { label: 'WinGetPos', kind: vscode.CompletionItemKind.Function, detail: 'WinGetPos("title")', doc: 'Get window position [x,y,w,h]' },
      { label: 'WinGetText', kind: vscode.CompletionItemKind.Function, detail: 'WinGetText("title")', doc: 'Get text from a window' },
      { label: 'WinWait', kind: vscode.CompletionItemKind.Function, detail: 'WinWait("title", timeout)', doc: 'Wait for window to exist' },
      { label: 'ControlClick', kind: vscode.CompletionItemKind.Function, detail: 'ControlClick("title", "", "classname")', doc: 'Click a control' },
      { label: 'ControlSend', kind: vscode.CompletionItemKind.Function, detail: 'ControlSend("title", "", "classname", text)', doc: 'Send text to control' },

      // File Operations
      { label: 'FileRead', kind: vscode.CompletionItemKind.Function, detail: 'FileRead("filepath")', doc: 'Read entire file content' },
      { label: 'FileWrite', kind: vscode.CompletionItemKind.Function, detail: 'FileWrite("filepath", "text")', doc: 'Write text to file' },
      { label: 'FileDelete', kind: vscode.CompletionItemKind.Function, detail: 'FileDelete("filepath")', doc: 'Delete a file' },
      { label: 'FileExists', kind: vscode.CompletionItemKind.Function, detail: 'FileExists("filepath")', doc: 'Check if file exists' },
      { label: 'FileGetSize', kind: vscode.CompletionItemKind.Function, detail: 'FileGetSize("filepath")', doc: 'Get file size in bytes' },
      { label: 'FileCopy', kind: vscode.CompletionItemKind.Function, detail: 'FileCopy("source", "dest")', doc: 'Copy file from source to destination' },
      { label: 'FileMove', kind: vscode.CompletionItemKind.Function, detail: 'FileMove("source", "dest")', doc: 'Move file from source to destination' },
      { label: 'DirCreate', kind: vscode.CompletionItemKind.Function, detail: 'DirCreate("path")', doc: 'Create a directory' },
      { label: 'DirRemove', kind: vscode.CompletionItemKind.Function, detail: 'DirRemove("path")', doc: 'Remove a directory' },

      // Process Management
      { label: 'Run', kind: vscode.CompletionItemKind.Function, detail: 'Run("program", "workdir")', doc: 'Execute a program' },
      { label: 'RunWait', kind: vscode.CompletionItemKind.Function, detail: 'RunWait("program")', doc: 'Execute and wait for program' },
      { label: 'RunAs', kind: vscode.CompletionItemKind.Function, detail: 'RunAs("user", "domain", "password", flags, "program")', doc: 'Run as another user' },
      { label: 'ShellExecute', kind: vscode.CompletionItemKind.Function, detail: 'ShellExecute("file", "args")', doc: 'Execute with shell' },
      { label: 'ProcessClose', kind: vscode.CompletionItemKind.Function, detail: 'ProcessClose("process")', doc: 'Close a process by name' },
      { label: 'ProcessExists', kind: vscode.CompletionItemKind.Function, detail: 'ProcessExists("process")', doc: 'Check if process exists' },
      { label: 'Sleep', kind: vscode.CompletionItemKind.Function, detail: 'Sleep(milliseconds)', doc: 'Sleep for specified milliseconds' },

      // Input/Output
      { label: 'Send', kind: vscode.CompletionItemKind.Function, detail: 'Send("keys")', doc: 'Send keystrokes to active window' },
      { label: 'MouseMove', kind: vscode.CompletionItemKind.Function, detail: 'MouseMove(x, y, speed)', doc: 'Move mouse to coordinates' },
      { label: 'MouseClick', kind: vscode.CompletionItemKind.Function, detail: 'MouseClick("button", x, y)', doc: 'Click mouse button' },
      { label: 'MouseGetPos', kind: vscode.CompletionItemKind.Function, detail: 'MouseGetPos()', doc: 'Get current mouse position' },
      { label: 'PixelGetColor', kind: vscode.CompletionItemKind.Function, detail: 'PixelGetColor(x, y)', doc: 'Get pixel color at coordinates' },
      { label: 'ImageSearch', kind: vscode.CompletionItemKind.Function, detail: 'ImageSearch(left, top, right, bottom, "image")', doc: 'Search for image on screen' },

      // String Operations - Precious text manipulation!
      { label: 'StringLen', kind: vscode.CompletionItemKind.Function, detail: 'StringLen("string")', doc: 'Get string length' },
      { label: 'StringInStr', kind: vscode.CompletionItemKind.Function, detail: 'StringInStr("string", "substring")', doc: 'Find substring position' },
      { label: 'StringReplace', kind: vscode.CompletionItemKind.Function, detail: 'StringReplace("string", "old", "new")', doc: 'Replace text in string' },
      { label: 'StringUpper', kind: vscode.CompletionItemKind.Function, detail: 'StringUpper("string")', doc: 'Convert string to uppercase' },
      { label: 'StringLower', kind: vscode.CompletionItemKind.Function, detail: 'StringLower("string")', doc: 'Convert string to lowercase' },
      { label: 'StringMid', kind: vscode.CompletionItemKind.Function, detail: 'StringMid("string", start, count)', doc: 'Extract substring' },
      { label: 'StringSplit', kind: vscode.CompletionItemKind.Function, detail: 'StringSplit("string", "delimiter")', doc: 'Split string into array' },
      { label: 'StringFormat', kind: vscode.CompletionItemKind.Function, detail: 'StringFormat("format", ...)', doc: 'Format string like printf' },

      // Array Operations
      { label: 'ArrayAdd', kind: vscode.CompletionItemKind.Function, detail: 'ArrayAdd($array, "value")', doc: 'Add element to array' },
      { label: 'ArrayDelete', kind: vscode.CompletionItemKind.Function, detail: 'ArrayDelete($array, index)', doc: 'Delete element from array' },
      { label: 'ArraySort', kind: vscode.CompletionItemKind.Function, detail: 'ArraySort($array)', doc: 'Sort array' },
      { label: 'ArrayBinarySearch', kind: vscode.CompletionItemKind.Function, detail: 'ArrayBinarySearch($array, "value")', doc: 'Binary search in array' },
      { label: 'ArrayDisplay', kind: vscode.CompletionItemKind.Function, detail: 'ArrayDisplay($array)', doc: 'Display array in GUI' },
      { label: 'UBound', kind: vscode.CompletionItemKind.Function, detail: 'UBound($array)', doc: 'Get upper bound (size) of array' },

      // Registry/INI
      { label: 'IniRead', kind: vscode.CompletionItemKind.Function, detail: 'IniRead("file", "section", "key")', doc: 'Read INI file entry' },
      { label: 'IniWrite', kind: vscode.CompletionItemKind.Function, detail: 'IniWrite("file", "section", "key", "value")', doc: 'Write to INI file' },
      { label: 'RegRead', kind: vscode.CompletionItemKind.Function, detail: 'RegRead("key", "value")', doc: 'Read registry entry' },
      { label: 'RegWrite', kind: vscode.CompletionItemKind.Function, detail: 'RegWrite("key", "value", "type", "data")', doc: 'Write to registry' },

      // Math Functions
      { label: 'Abs', kind: vscode.CompletionItemKind.Function, detail: 'Abs(number)', doc: 'Absolute value' },
      { label: 'Round', kind: vscode.CompletionItemKind.Function, detail: 'Round(number, decimals)', doc: 'Round to decimals' },
      { label: 'Sqrt', kind: vscode.CompletionItemKind.Function, detail: 'Sqrt(number)', doc: 'Square root' },
      { label: 'Sin', kind: vscode.CompletionItemKind.Function, detail: 'Sin(number)', doc: 'Sine function' },
      { label: 'Cos', kind: vscode.CompletionItemKind.Function, detail: 'Cos(number)', doc: 'Cosine function' },
      { label: 'Tan', kind: vscode.CompletionItemKind.Function, detail: 'Tan(number)', doc: 'Tangent function' },
      { label: 'Random', kind: vscode.CompletionItemKind.Function, detail: 'Random(min, max)', doc: 'Random number between min and max' },
      { label: 'Mod', kind: vscode.CompletionItemKind.Function, detail: 'Mod(number, divisor)', doc: 'Modulo operation' },

      // Type Functions
      { label: 'IsArray', kind: vscode.CompletionItemKind.Function, detail: 'IsArray($var)', doc: 'Check if variable is array' },
      { label: 'IsString', kind: vscode.CompletionItemKind.Function, detail: 'IsString($var)', doc: 'Check if variable is string' },
      { label: 'IsNumber', kind: vscode.CompletionItemKind.Function, detail: 'IsNumber($var)', doc: 'Check if variable is number' },
      { label: 'IsInt', kind: vscode.CompletionItemKind.Function, detail: 'IsInt($var)', doc: 'Check if variable is integer' },
      { label: 'IsFloat', kind: vscode.CompletionItemKind.Function, detail: 'IsFloat($var)', doc: 'Check if variable is float' },

      // Date/Time
      { label: 'Date', kind: vscode.CompletionItemKind.Function, detail: 'Date()', doc: 'Get current date (YYYYMMDD)' },
      { label: 'Day', kind: vscode.CompletionItemKind.Function, detail: 'Day(date)', doc: 'Get day from date' },
      { label: 'Month', kind: vscode.CompletionItemKind.Function, detail: 'Month(date)', doc: 'Get month from date' },
      { label: 'Year', kind: vscode.CompletionItemKind.Function, detail: 'Year(date)', doc: 'Get year from date' },
      { label: 'Hour', kind: vscode.CompletionItemKind.Function, detail: 'Hour(time)', doc: 'Get hour from time' },
      { label: 'Minute', kind: vscode.CompletionItemKind.Function, detail: 'Minute(time)', doc: 'Get minute from time' },
      { label: 'Second', kind: vscode.CompletionItemKind.Function, detail: 'Second(time)', doc: 'Get second from time' },
      { label: 'TimerInit', kind: vscode.CompletionItemKind.Function, detail: 'TimerInit()', doc: 'Initialize timer' },
      { label: 'TimerDiff', kind: vscode.CompletionItemKind.Function, detail: 'TimerDiff($timer)', doc: 'Get milliseconds elapsed' },

      // Misc Utilities
      { label: 'ClipGet', kind: vscode.CompletionItemKind.Function, detail: 'ClipGet()', doc: 'Get clipboard content' },
      { label: 'ClipPut', kind: vscode.CompletionItemKind.Function, detail: 'ClipPut("text")', doc: 'Set clipboard content' },
      { label: 'EnvGet', kind: vscode.CompletionItemKind.Function, detail: 'EnvGet("variable")', doc: 'Get environment variable' },
      { label: 'EnvSet', kind: vscode.CompletionItemKind.Function, detail: 'EnvSet("variable", "value")', doc: 'Set environment variable' },
      { label: 'Beep', kind: vscode.CompletionItemKind.Function, detail: 'Beep(frequency, duration)', doc: 'Play a beep sound' },
      { label: 'HotKeySet', kind: vscode.CompletionItemKind.Function, detail: 'HotKeySet("key", "function")', doc: 'Register hotkey' },
      { label: 'IsAdmin', kind: vscode.CompletionItemKind.Function, detail: 'IsAdmin()', doc: 'Check if running as admin' },
      { label: 'Call', kind: vscode.CompletionItemKind.Function, detail: 'Call("function", ...)', doc: 'Call function by name' },
      { label: 'Execute', kind: vscode.CompletionItemKind.Function, detail: 'Execute("code")', doc: 'Execute code string' },
    ];

    // Keyword completions
    const keywordDocs = [
      { label: 'If', kind: vscode.CompletionItemKind.Keyword, detail: 'If condition Then', doc: 'Conditional statement' },
      { label: 'Then', kind: vscode.CompletionItemKind.Keyword, detail: 'If condition Then', doc: 'Then keyword' },
      { label: 'Else', kind: vscode.CompletionItemKind.Keyword, detail: 'Else', doc: 'Else branch' },
      { label: 'ElseIf', kind: vscode.CompletionItemKind.Keyword, detail: 'ElseIf condition Then', doc: 'Else if branch' },
      { label: 'EndIf', kind: vscode.CompletionItemKind.Keyword, detail: 'EndIf', doc: 'End if statement' },
      { label: 'While', kind: vscode.CompletionItemKind.Keyword, detail: 'While condition', doc: 'While loop' },
      { label: 'WEnd', kind: vscode.CompletionItemKind.Keyword, detail: 'WEnd', doc: 'End while loop' },
      { label: 'Do', kind: vscode.CompletionItemKind.Keyword, detail: 'Do...Until', doc: 'Do-until loop' },
      { label: 'Until', kind: vscode.CompletionItemKind.Keyword, detail: 'Until condition', doc: 'Until condition' },
      { label: 'For', kind: vscode.CompletionItemKind.Keyword, detail: 'For $i = 1 To 10', doc: 'For loop' },
      { label: 'To', kind: vscode.CompletionItemKind.Keyword, detail: 'To', doc: 'To keyword in for loop' },
      { label: 'Step', kind: vscode.CompletionItemKind.Keyword, detail: 'Step', doc: 'Step in for loop' },
      { label: 'Next', kind: vscode.CompletionItemKind.Keyword, detail: 'Next', doc: 'End for loop' },
      { label: 'Switch', kind: vscode.CompletionItemKind.Keyword, detail: 'Switch $var', doc: 'Switch statement' },
      { label: 'Case', kind: vscode.CompletionItemKind.Keyword, detail: 'Case value', doc: 'Case in switch' },
      { label: 'Default', kind: vscode.CompletionItemKind.Keyword, detail: 'Default', doc: 'Default case' },
      { label: 'EndSwitch', kind: vscode.CompletionItemKind.Keyword, detail: 'EndSwitch', doc: 'End switch statement' },
      { label: 'Func', kind: vscode.CompletionItemKind.Keyword, detail: 'Func FunctionName()', doc: 'Function definition' },
      { label: 'Return', kind: vscode.CompletionItemKind.Keyword, detail: 'Return value', doc: 'Return from function' },
      { label: 'EndFunc', kind: vscode.CompletionItemKind.Keyword, detail: 'EndFunc', doc: 'End function' },
      { label: 'Local', kind: vscode.CompletionItemKind.Keyword, detail: 'Local $var', doc: 'Local variable' },
      { label: 'Global', kind: vscode.CompletionItemKind.Keyword, detail: 'Global $var', doc: 'Global variable' },
      { label: 'Dim', kind: vscode.CompletionItemKind.Keyword, detail: 'Dim $var', doc: 'Declare variable' },
      { label: 'Static', kind: vscode.CompletionItemKind.Keyword, detail: 'Static $var', doc: 'Static variable' },
      { label: 'Const', kind: vscode.CompletionItemKind.Keyword, detail: 'Const $var = value', doc: 'Constant variable' },
      { label: 'ByRef', kind: vscode.CompletionItemKind.Keyword, detail: 'ByRef $var', doc: 'Pass by reference' },
      { label: 'ByVal', kind: vscode.CompletionItemKind.Keyword, detail: 'ByVal $var', doc: 'Pass by value' },
      { label: 'As', kind: vscode.CompletionItemKind.Keyword, detail: 'As', doc: 'Type declaration' },
      { label: 'Exit', kind: vscode.CompletionItemKind.Keyword, detail: 'Exit', doc: 'Exit program' },
      { label: 'ContinueLoop', kind: vscode.CompletionItemKind.Keyword, detail: 'ContinueLoop', doc: 'Continue to next loop' },
      { label: 'ExitLoop', kind: vscode.CompletionItemKind.Keyword, detail: 'ExitLoop', doc: 'Exit loop' },
    ];

    // Macro completions - System variables
    const macroDocs = [
      { label: '@AppDataDir', kind: vscode.CompletionItemKind.Constant, doc: 'User application data directory' },
      { label: '@DesktopDir', kind: vscode.CompletionItemKind.Constant, doc: 'User desktop directory' },
      { label: '@DocumentsCommonDir', kind: vscode.CompletionItemKind.Constant, doc: 'Common documents directory' },
      { label: '@SystemDir', kind: vscode.CompletionItemKind.Constant, doc: 'Windows system directory' },
      { label: '@WindowsDir', kind: vscode.CompletionItemKind.Constant, doc: 'Windows directory' },
      { label: '@WorkingDir', kind: vscode.CompletionItemKind.Constant, doc: 'Current working directory' },
      { label: '@ScriptDir', kind: vscode.CompletionItemKind.Constant, doc: 'Directory of running script' },
      { label: '@ScriptFullPath', kind: vscode.CompletionItemKind.Constant, doc: 'Full path of running script' },
      { label: '@ScriptName', kind: vscode.CompletionItemKind.Constant, doc: 'Name of running script' },
      { label: '@TempDir', kind: vscode.CompletionItemKind.Constant, doc: 'Temporary directory' },
      { label: '@ComSpec', kind: vscode.CompletionItemKind.Constant, doc: 'Command interpreter path' },
      { label: '@AutoItVersion', kind: vscode.CompletionItemKind.Constant, doc: 'AutoIt version' },
      { label: '@OSVersion', kind: vscode.CompletionItemKind.Constant, doc: 'Operating system version' },
      { label: '@OSBuild', kind: vscode.CompletionItemKind.Constant, doc: 'Operating system build number' },
      { label: '@OSType', kind: vscode.CompletionItemKind.Constant, doc: 'Operating system type' },
      { label: '@UserName', kind: vscode.CompletionItemKind.Constant, doc: 'Current username' },
      { label: '@LogonDomain', kind: vscode.CompletionItemKind.Constant, doc: 'Logon domain' },
      { label: '@LogonName', kind: vscode.CompletionItemKind.Constant, doc: 'Logon user name' },
      { label: '@CRLF', kind: vscode.CompletionItemKind.Constant, doc: 'Carriage return + line feed' },
      { label: '@CR', kind: vscode.CompletionItemKind.Constant, doc: 'Carriage return' },
      { label: '@LF', kind: vscode.CompletionItemKind.Constant, doc: 'Line feed' },
      { label: '@TAB', kind: vscode.CompletionItemKind.Constant, doc: 'Tab character' },
      { label: '@error', kind: vscode.CompletionItemKind.Constant, doc: 'Last function error code' },
      { label: '@extended', kind: vscode.CompletionItemKind.Constant, doc: 'Extended error information' },
    ];

    // Add directive completions
    const directiveDocs = [
      { label: '#include', kind: vscode.CompletionItemKind.Snippet, detail: '#include "file.au3"', doc: 'Include another AutoIt file' },
      { label: '#include-once', kind: vscode.CompletionItemKind.Snippet, detail: '#include-once', doc: 'Include file only once' },
      { label: '#require', kind: vscode.CompletionItemKind.Snippet, detail: '#require "version"', doc: 'Require minimum version' },
      { label: '#region', kind: vscode.CompletionItemKind.Snippet, detail: '#region Comment', doc: 'Start code region' },
      { label: '#endregion', kind: vscode.CompletionItemKind.Snippet, detail: '#endregion', doc: 'End code region' },
      { label: '#pragma', kind: vscode.CompletionItemKind.Snippet, detail: '#pragma', doc: 'Pragma directive' },
      { label: '#cs', kind: vscode.CompletionItemKind.Snippet, detail: '#cs...#ce', doc: 'Block comment' },
    ];

    // Build completion items
    [...functionDocs, ...keywordDocs, ...macroDocs, ...directiveDocs].forEach(docItem => {
      const item = new vscode.CompletionItem(docItem.label, docItem.kind);
      if (docItem.detail) item.detail = docItem.detail;
      if (docItem.doc) {
        item.documentation = new vscode.MarkdownString(`${docItem.doc}`);
      }
      this.completionItems.push(item);
    });
  }

  /**
   * Provide completions
   * Called when user triggers autocomplete
   */
  provideCompletionItems(document, position, token, context) {
    // Return all completion items - VSCode filters based on current word
    return this.completionItems;
  }

  /**
   * Resolve completion item
   * Called when user selects a completion item
   */
  resolveCompletionItem(item, token) {
    return item;
  }
}

module.exports = { AutoItCompletionProvider };
