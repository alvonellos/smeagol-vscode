"use strict";

const vscode = require("vscode");

/**
 * AutoIt Highlighting - The Precious Knows All
 * Highlights AutoIt-specific functions, macros, keywords, strings, comments, and operators
 * "My precious... we must highlight every syntax, yesss..."
 */
class AutoItHighlighter {
  constructor() {
    this.decorationTypes = {};
    // Smeagol's color palette - each token type gets its own precious hue
    this.macroColor = "#facd45";        // gold for macros (properties/constants)
    this.functionColor = "#ffc66d";     // light orange for functions (matches theme)
    this.keywordColor = "#ff006f";      // magenta for keywords (matches theme)
    this.variableColor = "#00c7ff";     // cyan for variables (matches theme)
    this.commentColor = "#888888";      // gray for comments (matches theme)
    this.stringColor = "#00e71c";       // green for strings (matches theme)
    this.operatorColor = "#ff006f";     // magenta for operators (matches theme)
    this.directiveColor = "#bb00ff";    // purple for directives (preprocessor)
    this.numberColor = "#00c7ff";       // cyan for numbers (matches theme)
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
        color: this.functionColor,
        fontWeight: "600"
      }),
      keyword: vscode.window.createTextEditorDecorationType({
        color: this.keywordColor,
        fontWeight: "bold"
      }),
      variable: vscode.window.createTextEditorDecorationType({
        color: this.variableColor,
        fontStyle: "italic"
      }),
      comment: vscode.window.createTextEditorDecorationType({
        color: this.commentColor,
        fontStyle: "italic"
      }),
      string: vscode.window.createTextEditorDecorationType({
        color: this.stringColor
      }),
      operator: vscode.window.createTextEditorDecorationType({
        color: this.operatorColor,
        fontWeight: "600"
      }),
      directive: vscode.window.createTextEditorDecorationType({
        color: this.directiveColor,
        fontWeight: "bold"
      }),
      number: vscode.window.createTextEditorDecorationType({
        color: this.numberColor
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
      variable: [],
      comment: [],
      string: [],
      operator: [],
      directive: [],
      number: []
    };

    // COMPREHENSIVE AutoIt Functions - The precious catalog of knowledge
    const autoitFunctions = new Set([
      // Window/GUI functions
      'MsgBox', 'InputBox', 'SplashTextOn', 'SplashOff', 'ToolTip', 'TrayTip',
      'WinActivate', 'WinClose', 'WinExists', 'WinGetHandle', 'WinGetPos', 'WinGetText',
      'WinGetTitle', 'WinKill', 'WinList', 'WinMove', 'WinSetOnTop', 'WinSetState',
      'WinSetTitle', 'WinWait', 'WinWaitActive', 'WinWaitNotActive',
      'ControlClick', 'ControlCommand', 'ControlDisable', 'ControlEnable', 'ControlFocus',
      'ControlGetFocus', 'ControlGetHandle', 'ControlGetPos', 'ControlGetText', 'ControlSend',
      'ControlSetText', 'GUICreate', 'GUICtrlCreateButton', 'GUICtrlCreateCheckbox',
      'GUICtrlCreateCombo', 'GUICtrlCreateDate', 'GUICtrlCreateDummy', 'GUICtrlCreateEdit',
      'GUICtrlCreateGraphic', 'GUICtrlCreateGroup', 'GUICtrlCreateIcon', 'GUICtrlCreateInput',
      'GUICtrlCreateLabel', 'GUICtrlCreateList', 'GUICtrlCreateListView', 'GUICtrlCreateListViewItem',
      'GUICtrlCreateMenu', 'GUICtrlCreateMenuItem', 'GUICtrlCreatePic', 'GUICtrlCreateProgress',
      'GUICtrlCreateRadio', 'GUICtrlCreateSlider', 'GUICtrlCreateTab', 'GUICtrlCreateTabItem',
      'GUICtrlCreateTreeView', 'GUICtrlCreateTreeViewItem', 'GUICtrlCreateUpdown',
      'GUICtrlDelete', 'GUICtrlGetState', 'GUICtrlGetHandle', 'GUICtrlRead', 'GUICtrlSendMsg',
      'GUICtrlSetColor', 'GUICtrlSetCursor', 'GUICtrlSetData', 'GUICtrlSetDefColor',
      'GUICtrlSetFont', 'GUICtrlSetImage', 'GUICtrlSetLimit', 'GUICtrlSetOnEvent',
      'GUICtrlSetPos', 'GUICtrlSetResizing', 'GUICtrlSetState', 'GUICtrlSetStyle',
      'GUICtrlSetTip', 'GUIDelete', 'GUIGetCursorInfo', 'GUIGetMsg', 'GUISetBkColor',
      'GUISetCoord', 'GUISetCursor', 'GUISetFont', 'GUISetOnEvent', 'GUISetState',
      'GUISetStyle', 'GUIStartGroup', 'GUISwitch',

      // File/Directory functions
      'FileChangeDir', 'FileCopy', 'FileCreateNFolders', 'FileCreateShortcut', 'FileDelete',
      'FileExists', 'FileFindFirstFile', 'FileFindNextFile', 'FileGetAttrib', 'FileGetLongName',
      'FileGetShortcut', 'FileGetSize', 'FileGetTime', 'FileGetVersion', 'FileInstall',
      'FileMove', 'FileOpen', 'FileRead', 'FileReadLine', 'FileReadToArray', 'FileRecycle',
      'FileRecycleEmpty', 'FileSelectFolder', 'FileSelectFile', 'FileSetAttrib', 'FileSetTime',
      'FileWrite', 'FileWriteLine', 'DirCopy', 'DirCreate', 'DirGetSize', 'DirMove',
      'DirRemove', 'DriveGetDrive', 'DriveGetFileSystem', 'DriveGetLabel', 'DriveGetSerial',
      'DriveGetStatus', 'DriveMapAdd', 'DriveMapDel', 'DriveMapGet', 'DriveSetLabel',
      'DriveSpaceFree', 'DriveSpaceTotal',

      // Process/Execute functions
      'Run', 'RunAs', 'RunAsWait', 'RunWait', 'ShellExecute', 'ShellExecuteWait',
      'ProcessClose', 'ProcessExists', 'ProcessGetStats', 'ProcessList', 'ProcessSetPriority',
      'ProcessWait', 'ProcessWaitDelay', 'Shutdown', 'Sleep',

      // Input/Output functions
      'Send', 'SendKeepActive', 'MouseClick', 'MouseClickDrag', 'MouseDown', 'MouseGetCursor',
      'MouseGetPos', 'MouseMove', 'MouseUp', 'MouseWheel', 'PixelChecksum', 'PixelGetColor',
      'PixelSearch', 'ImageSearch', 'ImageSearchArea',

      // String functions
      'StringAddCR', 'StringCompare', 'StringFormat', 'StringFromASCIIArray', 'StringInStr',
      'StringIsAlNum', 'StringIsAlpha', 'StringIsASCII', 'StringIsDigit', 'StringIsFloat',
      'StringIsInt', 'StringIsLower', 'StringIsSpace', 'StringIsUpper', 'StringIsXDigit',
      'StringLeft', 'StringLen', 'StringLower', 'StringMid', 'StringRegExp',
      'StringRegExpReplace', 'StringReplace', 'StringRight', 'StringSplit', 'StringStripCR',
      'StringStripWS', 'StringToBinary', 'StringToASCIIArray', 'StringUpper', 'StringTrimLeft',
      'StringTrimRight',

      // Array functions
      'ArrayAdd', 'ArrayBinarySearch', 'ArrayCombinations', 'ArrayConcat', 'ArrayDelete',
      'ArrayDisplay', 'ArrayFindAll', 'ArrayInsert', 'ArrayPop', 'ArrayPush', 'ArrayReverse',
      'ArraySort', 'ArraySwap', 'ArrayToString', 'ArrayUnique',

      // Registry/INI functions
      'RegDelete', 'RegEnumKey', 'RegEnumVal', 'RegRead', 'RegWrite', 'RegGetSubKeyNames',
      'IniDelete', 'IniRead', 'IniReadSection', 'IniReadSectionNames', 'IniRenameSection',
      'IniWrite', 'IniWriteSection',

      // Math functions
      'Abs', 'ACos', 'ASin', 'ATan', 'Ceiling', 'Cos', 'Exp', 'Floor', 'Log', 'Mod',
      'Number', 'Random', 'Round', 'Sin', 'Sqrt', 'Tan',

      // Type check functions
      'IsArray', 'IsBinary', 'IsBool', 'IsFloat', 'IsInt', 'IsKeyword', 'IsNumber',
      'IsObject', 'IsPtr', 'IsString',

      // Date/Time functions
      'Date', 'DateAdd', 'DateDiff', 'DateFormat', 'DateToDayOfWeek', 'Day', 'Hour',
      'Minute', 'Month', 'Second', 'TimerInit', 'TimerDiff', 'Week', 'Year',

      // Misc functions
      'Binary', 'Beep', 'Call', 'ClipGet', 'ClipPut', 'Cos', 'EnvGet', 'EnvSet',
      'EnvDelete', 'Eval', 'Execute', 'Exp', 'HotKeySet', 'Int', 'IsAdmin', 'ObjCreate',
      'ObjEvent', 'ObjName', 'OnAutoItStartRegister', 'Opt', 'Ping', 'Round', 'Sin',
      'Sqrt', 'Tan', 'TCPAccept', 'TCPCloseSocket', 'TCPConnect', 'TCPListen', 'TCPNameToIP',
      'TCPRecv', 'TCPSend', 'TCPStartup', 'TCPShutdown', 'TimerInit', 'TimerDiff',
      'UBound', 'VarGetType'
    ]);

    // COMPREHENSIVE AutoIt Macros - The secret whispers of the system
    const autoitMacros = new Set([
      '@AppDataDir', '@AppDataCommonDir', '@AutoItPID', '@AutoItVersion', '@AutoItX64',
      '@AutoItUnicode', '@CRLF', '@CR', '@ComSpec', '@CommonFilesDir', '@DesktopDir',
      '@DesktopCommonDir', '@DocumentsCommonDir', '@error', '@extended', '@HomeDrive',
      '@HomePath', '@HomeShare', '@IPAddress1', '@IPAddress2', '@IPAddress3', '@IPAddress4',
      '@LF', '@LocalAppDataDir', '@LogonDomain', '@LogonName', '@OSARCH', '@OSBuild',
      '@OSLang', '@OSServicePack', '@OSType', '@OSVersion', '@ProgramFilesDir', '@ProgramW6432Dir',
      '@ScriptDir', '@ScriptFullPath', '@ScriptLineNumber', '@ScriptName', '@StartupDir',
      '@SystemDir', '@TAB', '@TempDir', '@UserProfileDir', '@UserName', '@WindowsDir',
      '@WorkingDir', '@ArchiveRead', '@ArchiveWrite', '@Day', '@Debug', '@DetailPrint',
      '@HotKeyPressed', '@ItemsChecked', '@ListBoxIndex', '@MOD', '@NUMPARAMS', '@SEC',
      '@TRAY_ID', '@WinGetClientSize', '@Year', '@Mon', '@Mday', '@Hour', '@Min', '@Sec'
    ]);

    // Expanded Keywords - The laws of the land
    const autoitKeywords = /\b(If|Then|Else|ElseIf|EndIf|While|WEnd|Do|Until|For|To|Step|In|Next|Switch|Case|Default|EndSwitch|Func|Return|EndFunc|Local|Global|Dim|Static|Const|Enum|EndEnum|Exit|ContinueLoop|ExitLoop|ByRef|ByVal|As|EndWith|With|Select|EndSelect)\b/g;

    // Preprocessor Directives - Compilation incantations
    const directiveRegex = /#\b(include|include-once|require|require-once|region|endregion|forcedef|notdef|definerequests|noexpandvars|pragma|undef|cs|ce)\b/gi;

    // Operators - Mathematical bonds and logical chains
    const operatorRegex = /([+\-*\/^&|=!<>]=?|\.\.|\(|\)|,|\[|\]|{|}|:|;)/g;

    // Strings - The precious quotes that contain meaning
    const stringRegex = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g;

    // Numbers - Counting precious things
    const numberRegex = /\b(0[xX][0-9A-Fa-f]+|[0-9]+\.[0-9]+|[0-9]+)\b/g;

    // Single-line comments - Whispered wisdom
    const singleLineCommentRegex = /;.*$/gm;

    // Block comments - Lengthy musings
    const blockCommentRegex = /#cs[\s\S]*?#ce/gi;

    editor.visibleRanges.forEach(range => {
      for (let line = range.start.line; line <= range.end.line; line++) {
        const lineText = doc.lineAt(line).text;

        // Skip comments when highlighting other tokens (Precious whispers, leave them be!)
        let commentStart = lineText.indexOf(';');
        let blockCommentRegion = false;
        let processUpTo = lineText.length;

        // Handle single-line comments
        if (commentStart !== -1) {
          processUpTo = commentStart;
          const singleCommentMatch = lineText.substring(commentStart);
          const startPos = new vscode.Position(line, commentStart);
          const endPos = new vscode.Position(line, lineText.length);
          ranges.comment.push(new vscode.Range(startPos, endPos));
        }

        // Handle block comments
        let blockMatch;
        while ((blockMatch = blockCommentRegex.exec(lineText)) !== null) {
          const startPos = new vscode.Position(line, blockMatch.index);
          const endPos = new vscode.Position(line, blockMatch.index + blockMatch[0].length);
          ranges.comment.push(new vscode.Range(startPos, endPos));
          blockCommentRegion = true;
        }

        // Only process the line up to comment start
        const processText = lineText.substring(0, processUpTo);

        // Preprocessor directives - Must come early!
        let directiveMatch;
        while ((directiveMatch = directiveRegex.exec(processText)) !== null) {
          const startPos = new vscode.Position(line, directiveMatch.index);
          const endPos = new vscode.Position(line, directiveMatch.index + directiveMatch[0].length);
          ranges.directive.push(new vscode.Range(startPos, endPos));
        }

        // Strings (Before other regex so they don't get caught)
        let stringMatch;
        const stringRegexLocal = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')/g;
        while ((stringMatch = stringRegexLocal.exec(processText)) !== null) {
          const startPos = new vscode.Position(line, stringMatch.index);
          const endPos = new vscode.Position(line, stringMatch.index + stringMatch[0].length);
          ranges.string.push(new vscode.Range(startPos, endPos));
        }

        // Numbers
        let numberMatch;
        const numberRegexLocal = /\b(0[xX][0-9A-Fa-f]+|[0-9]+\.[0-9]+|[0-9]+)\b/g;
        while ((numberMatch = numberRegexLocal.exec(processText)) !== null) {
          const startPos = new vscode.Position(line, numberMatch.index);
          const endPos = new vscode.Position(line, numberMatch.index + numberMatch[0].length);
          ranges.number.push(new vscode.Range(startPos, endPos));
        }

        // AutoIt macros: @...
        let macroMatch;
        const macroRegex = /@[A-Za-z0-9]+/g;
        while ((macroMatch = macroRegex.exec(processText)) !== null) {
          if (autoitMacros.has(macroMatch[0])) {
            const startPos = new vscode.Position(line, macroMatch.index);
            const endPos = new vscode.Position(line, macroMatch.index + macroMatch[0].length);
            ranges.macro.push(new vscode.Range(startPos, endPos));
          }
        }

        // Built-in functions
        for (const func of autoitFunctions) {
          const regex = new RegExp(`\\b${func}\\b`, 'gi');
          let funcMatch;
          while ((funcMatch = regex.exec(processText)) !== null) {
            const startPos = new vscode.Position(line, funcMatch.index);
            const endPos = new vscode.Position(line, funcMatch.index + funcMatch[0].length);
            ranges.function.push(new vscode.Range(startPos, endPos));
          }
        }

        // Keywords
        let keywordMatch;
        const keywordRegexLocal = /\b(If|Then|Else|ElseIf|EndIf|While|WEnd|Do|Until|For|To|Step|In|Next|Switch|Case|Default|EndSwitch|Func|Return|EndFunc|Local|Global|Dim|Static|Const|Enum|EndEnum|Exit|ContinueLoop|ExitLoop|ByRef|ByVal|As|EndWith|With|Select|EndSelect)\b/gi;
        while ((keywordMatch = keywordRegexLocal.exec(processText)) !== null) {
          const startPos = new vscode.Position(line, keywordMatch.index);
          const endPos = new vscode.Position(line, keywordMatch.index + keywordMatch[0].length);
          ranges.keyword.push(new vscode.Range(startPos, endPos));
        }

        // Variables: $var_name (Precious data containers!)
        let variableMatch;
        const variableRegex = /\$[a-zA-Z_][a-zA-Z0-9_]*/g;
        while ((variableMatch = variableRegex.exec(processText)) !== null) {
          const startPos = new vscode.Position(line, variableMatch.index);
          const endPos = new vscode.Position(line, variableMatch.index + variableMatch[0].length);
          ranges.variable.push(new vscode.Range(startPos, endPos));
        }

        // Operators - Logical bonds
        let operatorMatch;
        const operatorRegexLocal = /([+\-*/%^&|=!<>]=?|\.\.|\(|\)|,|\[|\]|{|}|:|;)/g;
        while ((operatorMatch = operatorRegexLocal.exec(processText)) !== null) {
          const startPos = new vscode.Position(line, operatorMatch.index);
          const endPos = new vscode.Position(line, operatorMatch.index + operatorMatch[0].length);
          ranges.operator.push(new vscode.Range(startPos, endPos));
        }
      }
    });

    // Apply decorations - Make the precious visible!
    Object.keys(this.decorationTypes).forEach(key => {
      editor.setDecorations(this.decorationTypes[key], ranges[key]);
    });
  }

  /**
   * Get comprehensive completion items for AutoIt
   * "We have all the knowledge... all precious functions listed..."
   */
  getCompletionItems() {
    const items = [];

    // Function completions
    const functions = [
      'MsgBox', 'InputBox', 'SplashTextOn', 'SplashOff', 'ToolTip', 'TrayTip',
      'WinActivate', 'WinClose', 'WinExists', 'WinGetHandle', 'WinGetPos', 'WinGetText',
      'WinGetTitle', 'WinKill', 'WinList', 'WinMove', 'WinSetOnTop', 'WinSetState',
      'ControlClick', 'ControlCommand', 'ControlFocus', 'ControlGetFocus',
      'GUICreate', 'GUICtrlCreateButton', 'GUICtrlCreateCheckbox', 'GUICtrlCreateEdit',
      'GUICtrlCreateInput', 'GUICtrlCreateLabel', 'GUICtrlCreateList', 'GUICtrlDelete',
      'FileRead', 'FileWrite', 'FileDelete', 'FileExists', 'DirCreate', 'DirRemove',
      'FileCopy', 'FileMove', 'Run', 'RunWait', 'ShellExecute', 'ProcessClose',
      'Send', 'MouseClick', 'MouseMove', 'PixelGetColor', 'ImageSearch', 'Sleep',
      'StringLen', 'StringInStr', 'StringReplace', 'StringUpper', 'StringLower',
      'StringSplit', 'StringFormat', 'IniRead', 'IniWrite', 'RegRead', 'RegWrite',
      'ArrayAdd', 'ArrayDelete', 'ArraySort', 'ArrayBinarySearch', 'ArrayDisplay',
      'Abs', 'Round', 'Random', 'Sqrt', 'Sin', 'Cos', 'Tan',
      'IsArray', 'IsString', 'IsNumber', 'IsInt', 'IsFloat',
      'Date', 'DateAdd', 'Day', 'Month', 'Year', 'Hour', 'Minute', 'Second',
      'ClipGet', 'ClipPut', 'EnvGet', 'EnvSet', 'Call', 'Execute',
      'HotKeySet', 'OnAutoItStartRegister', 'Opt', 'TCPConnect', 'TCPSend', 'TCPRecv'
    ];

    functions.forEach(func => {
      items.push(new vscode.CompletionItem(func, vscode.CompletionItemKind.Function));
    });

    // Keyword completions
    const keywords = [
      'If', 'Then', 'Else', 'ElseIf', 'EndIf', 'While', 'WEnd', 'Do', 'Until', 'For', 'Next',
      'Switch', 'Case', 'Default', 'EndSwitch', 'Func', 'Return', 'EndFunc',
      'Local', 'Global', 'Dim', 'Static', 'Const', 'ByRef', 'ByVal', 'As',
      'Exit', 'ContinueLoop', 'ExitLoop'
    ];

    keywords.forEach(kw => {
      items.push(new vscode.CompletionItem(kw, vscode.CompletionItemKind.Keyword));
    });

    // Macro completions
    const macros = [
      '@AppDataDir', '@DesktopDir', '@DocumentsCommonDir', '@error', '@extended',
      '@OSVersion', '@ScriptDir', '@ScriptFullPath', '@ScriptName', '@TempDir',
      '@WindowsDir', '@WorkingDir', '@UserName', '@ComSpec', '@AutoItVersion',
      '@SystemDir', '@CRLF', '@CR', '@LF', '@TAB'
    ];

    macros.forEach(macro => {
      items.push(new vscode.CompletionItem(macro, vscode.CompletionItemKind.Constant));
    });

    return items;
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
