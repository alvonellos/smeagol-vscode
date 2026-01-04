"use strict";

const vscode = require("vscode");

/**
 * APL (A Programming Language) Completion Provider
 * Array programming language with symbolic notation
 */
class AplCompletionProvider {
  constructor() {
    this.completionItems = [];
    this.initialize();
  }

  initialize() {
    const completions = [
      // === OPERATORS (MONADIC) ===
      { label: "⊢", kind: vscode.CompletionItemKind.Operator, detail: "Right (identity)", doc: "Returns right argument unchanged." },
      { label: "⊣", kind: vscode.CompletionItemKind.Operator, detail: "Left", doc: "Returns left argument." },
      { label: "~", kind: vscode.CompletionItemKind.Operator, detail: "Without (or Not)", doc: "Logical NOT or set difference." },
      { label: "-", kind: vscode.CompletionItemKind.Operator, detail: "Negate", doc: "Arithmetic negation." },
      { label: "+", kind: vscode.CompletionItemKind.Operator, detail: "Conjugate", doc: "Complex conjugate." },
      { label: "×", kind: vscode.CompletionItemKind.Operator, detail: "Sign", doc: "Returns -1, 0, or 1." },
      { label: "÷", kind: vscode.CompletionItemKind.Operator, detail: "Reciprocal", doc: "1 divided by argument." },
      { label: "⌈", kind: vscode.CompletionItemKind.Operator, detail: "Ceiling", doc: "Rounds up." },
      { label: "⌊", kind: vscode.CompletionItemKind.Operator, detail: "Floor", doc: "Rounds down." },
      { label: "|", kind: vscode.CompletionItemKind.Operator, detail: "Absolute value", doc: "Magnitude." },
      { label: "⋆", kind: vscode.CompletionItemKind.Operator, detail: "Exponential", doc: "e to the power of." },
      { label: "⍟", kind: vscode.CompletionItemKind.Operator, detail: "Logarithm", doc: "Natural logarithm." },
      { label: "○", kind: vscode.CompletionItemKind.Operator, detail: "Trigonometric", doc: "Circular/hyperbolic functions." },
      { label: "!", kind: vscode.CompletionItemKind.Operator, detail: "Factorial", doc: "Factorial or binomial." },
      { label: "?", kind: vscode.CompletionItemKind.Operator, detail: "Roll/Deal", doc: "Random number generation." },

      // === OPERATORS (DYADIC) ===
      { label: "+", kind: vscode.CompletionItemKind.Operator, detail: "Add", doc: "Arithmetic addition." },
      { label: "-", kind: vscode.CompletionItemKind.Operator, detail: "Subtract", doc: "Arithmetic subtraction." },
      { label: "×", kind: vscode.CompletionItemKind.Operator, detail: "Multiply", doc: "Arithmetic multiplication." },
      { label: "÷", kind: vscode.CompletionItemKind.Operator, detail: "Divide", doc: "Arithmetic division." },
      { label: "⌈", kind: vscode.CompletionItemKind.Operator, detail: "Maximum", doc: "Greatest of two values." },
      { label: "⌊", kind: vscode.CompletionItemKind.Operator, detail: "Minimum", doc: "Least of two values." },
      { label: "|", kind: vscode.CompletionItemKind.Operator, detail: "Remainder", doc: "Modulo operation." },
      { label: "⋆", kind: vscode.CompletionItemKind.Operator, detail: "Power", doc: "Raise to power." },
      { label: "⍟", kind: vscode.CompletionItemKind.Operator, detail: "Logarithm", doc: "Log base x." },
      { label: "○", kind: vscode.CompletionItemKind.Operator, detail: "Circular", doc: "Trigonometric functions." },
      { label: "!", kind: vscode.CompletionItemKind.Operator, detail: "Binomial/GCD", doc: "Combinations or GCD." },
      { label: "=", kind: vscode.CompletionItemKind.Operator, detail: "Equal", doc: "Comparison." },
      { label: "≠", kind: vscode.CompletionItemKind.Operator, detail: "Not Equal", doc: "Inequality test." },
      { label: "<", kind: vscode.CompletionItemKind.Operator, detail: "Less", doc: "Less than comparison." },
      { label: "≤", kind: vscode.CompletionItemKind.Operator, detail: "Less or Equal", doc: "LE comparison." },
      { label: ">", kind: vscode.CompletionItemKind.Operator, detail: "Greater", doc: "Greater than comparison." },
      { label: "≥", kind: vscode.CompletionItemKind.Operator, detail: "Greater or Equal", doc: "GE comparison." },

      // === STRUCTURAL FUNCTIONS ===
      { label: "⍴", kind: vscode.CompletionItemKind.Function, detail: "Shape", doc: "Dimensions of array." },
      { label: "⌽", kind: vscode.CompletionItemKind.Function, detail: "Reverse", doc: "Reverse array elements." },
      { label: "⍒", kind: vscode.CompletionItemKind.Function, detail: "Grade Down", doc: "Indices in descending order." },
      { label: "⍋", kind: vscode.CompletionItemKind.Function, detail: "Grade Up", doc: "Indices in ascending order." },
      { label: "⊖", kind: vscode.CompletionItemKind.Function, detail: "Rotate", doc: "Circular rotation." },
      { label: ",", kind: vscode.CompletionItemKind.Function, detail: "Ravel/Catenate", doc: "Flatten/concatenate arrays." },
      { label: "↑", kind: vscode.CompletionItemKind.Function, detail: "Take", doc: "Take first N elements." },
      { label: "↓", kind: vscode.CompletionItemKind.Function, detail: "Drop", doc: "Drop first N elements." },
      { label: "⊂", kind: vscode.CompletionItemKind.Function, detail: "Enclose/Partition", doc: "Create nested structure." },
      { label: "⊃", kind: vscode.CompletionItemKind.Function, detail: "Disclose", doc: "Extract from nested array." },
      { label: "∪", kind: vscode.CompletionItemKind.Function, detail: "Union", doc: "Unique elements." },
      { label: "∩", kind: vscode.CompletionItemKind.Function, detail: "Intersection", doc: "Common elements." },
      { label: "⍳", kind: vscode.CompletionItemKind.Function, detail: "Iota", doc: "Integer vector from 0 to N-1." },
      { label: "⍕", kind: vscode.CompletionItemKind.Function, detail: "Format", doc: "Convert to character." },
      { label: "⍎", kind: vscode.CompletionItemKind.Function, detail: "Execute", doc: "Evaluate APL expression." },

      // === HIGHER-ORDER OPERATORS ===
      { label: "/", kind: vscode.CompletionItemKind.Operator, detail: "Reduce", doc: "Reduce along axis with function." },
      { label: "\\", kind: vscode.CompletionItemKind.Operator, detail: "Scan", doc: "Scan (cumulative reduce)." },
      { label: ".", kind: vscode.CompletionItemKind.Operator, detail: "Inner Product", doc: "Matrix multiplication." },
      { label: "∘.", kind: vscode.CompletionItemKind.Operator, detail: "Outer Product", doc: "All pairwise combinations." },
      { label: "@", kind: vscode.CompletionItemKind.Operator, detail: "At", doc: "Function composition." },
      { label: "⍨", kind: vscode.CompletionItemKind.Operator, detail: "Commute", doc: "Swap arguments." },
      { label: "¨", kind: vscode.CompletionItemKind.Operator, detail: "Each", doc: "Apply element-wise." },

      // === ASSIGNMENT & CONTROL ===
      { label: "←", kind: vscode.CompletionItemKind.Keyword, detail: "Assign", doc: "Variable assignment." },
      { label: "→", kind: vscode.CompletionItemKind.Keyword, detail: "Go To", doc: "Branch/goto label." },
      { label: ":If", kind: vscode.CompletionItemKind.Keyword, detail: "If", doc: "Conditional execution." },
      { label: ":Else", kind: vscode.CompletionItemKind.Keyword, detail: "Else", doc: "Else branch." },
      { label: ":EndIf", kind: vscode.CompletionItemKind.Keyword, detail: "EndIf", doc: "End if block." },
      { label: ":While", kind: vscode.CompletionItemKind.Keyword, detail: "While", doc: "While loop." },
      { label: ":EndWhile", kind: vscode.CompletionItemKind.Keyword, detail: "EndWhile", doc: "End while block." },
      { label: ":For", kind: vscode.CompletionItemKind.Keyword, detail: "For", doc: "For loop." },
      { label: ":EndFor", kind: vscode.CompletionItemKind.Keyword, detail: "EndFor", doc: "End for block." },
      { label: ":Repeat", kind: vscode.CompletionItemKind.Keyword, detail: "Repeat", doc: "Repeat loop." },
      { label: ":Until", kind: vscode.CompletionItemKind.Keyword, detail: "Until", doc: "Until condition." },

      // === SYSTEM FUNCTIONS ===
      { label: "⎕CR", kind: vscode.CompletionItemKind.Function, detail: "Canonical Representation", doc: "Get function definition." },
      { label: "⎕NC", kind: vscode.CompletionItemKind.Function, detail: "Name Class", doc: "Get variable type." },
      { label: "⎕NL", kind: vscode.CompletionItemKind.Function, detail: "Name List", doc: "List variables/functions." },
      { label: "⎕WS", kind: vscode.CompletionItemKind.Function, detail: "Workspace Size", doc: "Get workspace info." },
      { label: "⎕IO", kind: vscode.CompletionItemKind.Function, detail: "Index Origin", doc: "Set 0-based or 1-based indexing." },
      { label: "⎕TS", kind: vscode.CompletionItemKind.Function, detail: "Time Stamp", doc: "Current timestamp." },
      { label: "⎕RL", kind: vscode.CompletionItemKind.Function, detail: "Random Link", doc: "Random number seed." },
      { label: "⎕PP", kind: vscode.CompletionItemKind.Function, detail: "Print Precision", doc: "Decimal precision." },
      { label: "⎕PW", kind: vscode.CompletionItemKind.Function, detail: "Print Width", doc: "Output line width." },

      // === COMMON EXAMPLES ===
      { label: "⍞", kind: vscode.CompletionItemKind.Variable, detail: "Input/Output", doc: "Console input/output." },
      { label: "∆", kind: vscode.CompletionItemKind.Variable, detail: "Workspace Variable", doc: "Special variable." },
      { label: "⍵", kind: vscode.CompletionItemKind.Variable, detail: "Right Argument", doc: "Function right argument." },
      { label: "⍺", kind: vscode.CompletionItemKind.Variable, detail: "Left Argument", doc: "Function left argument." },
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

module.exports = { AplCompletionProvider };
