"use strict";

const vscode = require("vscode");
const { BaseCompletionProvider } = require("./base-completion-provider");

class AdaCompletionProvider extends BaseCompletionProvider {
  constructor() {
    super(300, 5 * 60 * 1000);
    this.initialize();
  }

  getLanguageId() {
    return "ada";
  }

  getCompletions() {
    return [
      {
        label: "procedure",
        kind: vscode.CompletionItemKind.Snippet,
        detail: "procedure Name is ... end Name;",
        doc: "Create a procedure body.",
        insertText: new vscode.SnippetString(
          "procedure ${1:Name} is\nbegin\n   ${0:null;}\nend ${1:Name};"
        )
      },
      {
        label: "function",
        kind: vscode.CompletionItemKind.Snippet,
        detail: "function Name (...) return Type is",
        doc: "Create a function body with a return value.",
        insertText: new vscode.SnippetString(
          "function ${1:Name} (${2:Item : in ${3:Type}}) return ${4:Result_Type} is\nbegin\n   return ${0:Result};\nend ${1:Name};"
        )
      },
      {
        label: "package",
        kind: vscode.CompletionItemKind.Snippet,
        detail: "package Name is ... end Name;",
        doc: "Create an Ada package specification.",
        insertText: new vscode.SnippetString(
          "package ${1:Name} is\n   ${0}\nend ${1:Name};"
        )
      },
      {
        label: "package body",
        kind: vscode.CompletionItemKind.Snippet,
        detail: "package body Name is ... end Name;",
        doc: "Create an Ada package body.",
        insertText: new vscode.SnippetString(
          "package body ${1:Name} is\n   ${0}\nend ${1:Name};"
        )
      },
      {
        label: "record type",
        kind: vscode.CompletionItemKind.Snippet,
        detail: "type Name is record ... end record;",
        doc: "Define a record type.",
        insertText: new vscode.SnippetString(
          "type ${1:Name} is record\n   ${2:Field} : ${3:Type};\nend record;"
        )
      },
      {
        label: "enum type",
        kind: vscode.CompletionItemKind.Snippet,
        detail: "type Name is (...);",
        doc: "Define an enumeration type.",
        insertText: new vscode.SnippetString(
          "type ${1:Name} is (${2:First}, ${3:Second});"
        )
      },
      {
        label: "declare block",
        kind: vscode.CompletionItemKind.Snippet,
        detail: "declare ... begin ... end;",
        doc: "Create a local declaration block.",
        insertText: new vscode.SnippetString(
          "declare\n   ${1:Value} : ${2:Type};\nbegin\n   ${0:null;}\nend;"
        )
      },
      {
        label: "exception block",
        kind: vscode.CompletionItemKind.Snippet,
        detail: "exception when ... =>",
        doc: "Insert an exception handler block.",
        insertText: new vscode.SnippetString(
          "exception\n   when ${1:Constraint_Error} =>\n      ${0:null;}"
        )
      },
      {
        label: "case",
        kind: vscode.CompletionItemKind.Snippet,
        detail: "case Expr is when ... =>",
        doc: "Create a case statement.",
        insertText: new vscode.SnippetString(
          "case ${1:Expr} is\n   when ${2:Choice} =>\n      ${3:null;}\n   when others =>\n      ${0:null;}\nend case;"
        )
      },
      {
        label: "for loop",
        kind: vscode.CompletionItemKind.Snippet,
        detail: "for Item in Range loop",
        doc: "Create a counted loop.",
        insertText: new vscode.SnippetString(
          "for ${1:Index} in ${2:Range} loop\n   ${0:null;}\nend loop;"
        )
      },
      {
        label: "generic package",
        kind: vscode.CompletionItemKind.Snippet,
        detail: "generic ... package Name is",
        doc: "Create a generic package specification.",
        insertText: new vscode.SnippetString(
          "generic\n   type ${1:Element_Type} is private;\npackage ${2:Name} is\n   ${0}\nend ${2:Name};"
        )
      },
      {
        label: "task body",
        kind: vscode.CompletionItemKind.Snippet,
        detail: "task body Name is ... end Name;",
        doc: "Create a task body.",
        insertText: new vscode.SnippetString(
          "task body ${1:Name} is\nbegin\n   ${0:null;}\nend ${1:Name};"
        )
      },
      {
        label: "protected type",
        kind: vscode.CompletionItemKind.Snippet,
        detail: "protected type Name is",
        doc: "Create a protected type declaration.",
        insertText: new vscode.SnippetString(
          "protected type ${1:Name} is\n   procedure ${2:Update};\nprivate\n   ${0:null;}\nend ${1:Name};"
        )
      },
      {
        label: "pragma Assert",
        kind: vscode.CompletionItemKind.Snippet,
        detail: "pragma Assert (Condition);",
        doc: "Insert an assertion pragma.",
        insertText: new vscode.SnippetString(
          "pragma Assert (${1:Condition});"
        )
      },
      {
        label: "pragma Inline",
        kind: vscode.CompletionItemKind.Snippet,
        detail: "pragma Inline (Name);",
        doc: "Request inlining for a subprogram.",
        insertText: new vscode.SnippetString(
          "pragma Inline (${1:Subprogram_Name});"
        )
      },
      {
        label: "with",
        kind: vscode.CompletionItemKind.Keyword,
        detail: "with Ada.Text_IO;",
        doc: "Context clause for importing a package."
      },
      {
        label: "use",
        kind: vscode.CompletionItemKind.Keyword,
        detail: "use Ada.Text_IO;",
        doc: "Bring package contents directly into scope."
      },
      {
        label: "subtype",
        kind: vscode.CompletionItemKind.Keyword,
        detail: "subtype Name is Base range ...",
        doc: "Declare a constrained subtype."
      },
      {
        label: "renames",
        kind: vscode.CompletionItemKind.Keyword,
        detail: "Item renames Other_Item",
        doc: "Create an alias with Ada renaming."
      },
      {
        label: "Ada.Text_IO",
        kind: vscode.CompletionItemKind.Module,
        detail: "Standard text input/output",
        doc: "Common package for terminal and file text IO."
      },
      {
        label: "Ada.Integer_Text_IO",
        kind: vscode.CompletionItemKind.Module,
        detail: "Integer text input/output",
        doc: "Helpers for reading and writing integers."
      },
      {
        label: "Ada.Strings.Unbounded",
        kind: vscode.CompletionItemKind.Module,
        detail: "Unbounded string utilities",
        doc: "Provides `Unbounded_String`, `To_Unbounded_String`, and conversion helpers."
      },
      {
        label: "Ada.Containers.Vectors",
        kind: vscode.CompletionItemKind.Module,
        detail: "Generic vector container",
        doc: "Resizable sequence container from the Ada standard library."
      },
      {
        label: "Ada.Containers.Ordered_Maps",
        kind: vscode.CompletionItemKind.Module,
        detail: "Ordered map container",
        doc: "Tree-backed associative container."
      },
      {
        label: "Put_Line",
        kind: vscode.CompletionItemKind.Function,
        detail: "Put_Line (Item)",
        doc: "Write a line to the current Ada text output."
      },
      {
        label: "Get_Line",
        kind: vscode.CompletionItemKind.Function,
        detail: "Get_Line return String",
        doc: "Read a full line of text."
      },
      {
        label: "'Image",
        kind: vscode.CompletionItemKind.Property,
        detail: "Type'Image (Value)",
        doc: "Convert a value into its image string."
      },
      {
        label: "'Range",
        kind: vscode.CompletionItemKind.Property,
        detail: "Array'Range",
        doc: "Get the range of an index or subtype."
      },
      {
        label: "'First",
        kind: vscode.CompletionItemKind.Property,
        detail: "Type'First",
        doc: "Get the first value in a subtype range."
      },
      {
        label: "'Last",
        kind: vscode.CompletionItemKind.Property,
        detail: "Type'Last",
        doc: "Get the last value in a subtype range."
      },
      {
        label: "'Length",
        kind: vscode.CompletionItemKind.Property,
        detail: "Array'Length",
        doc: "Get the length of an array dimension."
      }
    ];
  }
}

module.exports = { AdaCompletionProvider };
