"use strict";

const vscode = require("vscode");

/**
 * AutoIt Highlighting
 * Highlights AutoIt-specific functions, macros, and keywords
 */
class AutoItHighlighter {
  constructor() {
    this.decorationTypes = {};
    this.macroColor = "#fff600"; // yellow for macros
    this.functionColor = "#ffc66d"; // orange for functions
    this.keywordColor = "#ff006f"; // magenta for keywords
    this.variableColor = "#00c7ff"; // cyan for variables
  }

  createDecorations() {
    if (Object.keys(this.decorationTypes).length > 0) {
      this.dispose();
    }

    this.decorationTypes = {
      macro: vscode.window.createTextEditorDecorationType({
        color: this.macroColor,
        fontWeight: "bold"
      }),
      function: vscode.window.createTextEditorDecorationType({
        color: this.functionColor
      }),
      keyword: vscode.window.createTextEditorDecorationType({
        color: this.keywordColor
      }),
      variable: vscode.window.createTextEditorDecorationType({
        color: this.variableColor,
        fontStyle: "italic"
      })
    };
  }

  dispose() {
    Object.values(this.decorationTypes).forEach(dec => dec.dispose());
    this.decorationTypes = {};
  }

  update(editor) {
    if (!editor || editor.document.languageId !== 'autoit') {
      return;
    }

    if (Object.keys(this.decorationTypes).length === 0) {
      this.createDecorations();
    }

    const doc = editor.document;
    const ranges = {
      macro: [],
      function: [],
      keyword: [],
      variable: []
    };

    const autoitFunctions = new Set([
      'MsgBox', 'InputBox', 'FileRead', 'FileWrite', 'DirCreate', 'FileDelete',
      'Run', 'ShellExecute', 'Send', 'MouseMove', 'MouseClick', 'PixelGetColor',
      'ImageSearch', 'Sleep', 'WinActivate', 'WinClose', 'WinWait', 'ControlClick',
      'ControlSend', 'IniRead', 'IniWrite', 'RegRead', 'RegWrite', 'StringLen',
      'StringInStr', 'StringReplace', 'ArrayCreate', 'ArrayAdd', 'ArrayDelete'
    ]);

    const autoitMacros = new Set([
      '@AppDataDir', '@AppDataCommonDir', '@AutoItVersion', '@ComSpec', '@DesktopDir',
      '@DesktopCommonDir', '@DocumentsCommonDir', '@error', '@extended', '@HomeDrive',
      '@HomePath', '@HomeShare', '@IPAddress1', '@IPAddress2', '@IPAddress3', '@IPAddress4',
      '@LF', '@LocalAppDataDir', '@LogonDomain', '@LogonName', '@OSBuild', '@OSLang',
      '@OSServicePack', '@OSType', '@OSVersion', '@ProgramFilesDir', '@ProgramW6432Dir',
      '@ScriptDir', '@ScriptFullPath', '@ScriptName', '@StartupDir', '@SystemDir',
      '@TempDir', '@UserProfileDir', '@WindowsDir', '@WorkingDir', '@CR', '@CRLF', '@TAB'
    ]);

    const autoitKeywords = /\b(If|Then|Else|ElseIf|EndIf|While|WEnd|Do|Until|For|To|Step|Next|Switch|Case|Default|EndSwitch|Func|Return|EndFunc|Local|Global|Dim|Static|Const|Exit|ContinueLoop|ExitLoop)\b/g;

    editor.visibleRanges.forEach(range => {
      for (let line = range.start.line; line <= range.end.line; line++) {
        const lineText = doc.lineAt(line).text;

        // AutoIt macros: @...
        let macroMatch;
        const macroRegex = /@[A-Za-z0-9]+/g;
        while ((macroMatch = macroRegex.exec(lineText)) !== null) {
          if (autoitMacros.has(macroMatch[0])) {
            const startPos = new vscode.Position(line, macroMatch.index);
            const endPos = new vscode.Position(line, macroMatch.index + macroMatch[0].length);
            ranges.macro.push(new vscode.Range(startPos, endPos));
          }
        }

        // Built-in functions
        for (const func of autoitFunctions) {
          const regex = new RegExp(`\\b${func}\\b`, 'g');
          let funcMatch;
          while ((funcMatch = regex.exec(lineText)) !== null) {
            const startPos = new vscode.Position(line, funcMatch.index);
            const endPos = new vscode.Position(line, funcMatch.index + funcMatch[0].length);
            ranges.function.push(new vscode.Range(startPos, endPos));
          }
        }

        // Keywords
        let keywordMatch;
        while ((keywordMatch = autoitKeywords.exec(lineText)) !== null) {
          const startPos = new vscode.Position(line, keywordMatch.index);
          const endPos = new vscode.Position(line, keywordMatch.index + keywordMatch[0].length);
          ranges.keyword.push(new vscode.Range(startPos, endPos));
        }

        // Variables: $var_name
        let variableMatch;
        const variableRegex = /\$[a-zA-Z_][a-zA-Z0-9_]*/g;
        while ((variableMatch = variableRegex.exec(lineText)) !== null) {
          const startPos = new vscode.Position(line, variableMatch.index);
          const endPos = new vscode.Position(line, variableMatch.index + variableMatch[0].length);
          ranges.variable.push(new vscode.Range(startPos, endPos));
        }
      }
    });

    // Apply decorations
    Object.keys(this.decorationTypes).forEach(key => {
      editor.setDecorations(this.decorationTypes[key], ranges[key]);
    });
  }

  clear(editor) {
    if (editor) {
      Object.values(this.decorationTypes).forEach(dec => {
        editor.setDecorations(dec, []);
      });
    }
  }

  clearAll(editors) {
    editors.forEach(editor => this.clear(editor));
  }

  reset() {
    this.dispose();
  }
}

module.exports = { AutoItHighlighter };
