"use strict";

const vscode = require("vscode");

/**
 * Python Completion Provider
 * IntelliJ-like completions for Python with full standard library and popular packages
 */
class PythonCompletionProvider {
  constructor() {
    this.completionItems = [];
    this.initialize();
  }

  initialize() {
    const completions = [
      // === BUILTINS ===
      { label: "print", kind: vscode.CompletionItemKind.Function, detail: "print(*args, sep=' ', end='\\n', file=sys.stdout)", doc: "Print arguments to stdout." },
      { label: "len", kind: vscode.CompletionItemKind.Function, detail: "len(object)", doc: "Return length of object." },
      { label: "range", kind: vscode.CompletionItemKind.Function, detail: "range(start, stop[, step])", doc: "Return sequence of numbers from start to stop." },
      { label: "enumerate", kind: vscode.CompletionItemKind.Function, detail: "enumerate(iterable, start=0)", doc: "Return enumerate object with index and value pairs." },
      { label: "zip", kind: vscode.CompletionItemKind.Function, detail: "zip(*iterables)", doc: "Combine iterables into tuples." },
      { label: "map", kind: vscode.CompletionItemKind.Function, detail: "map(function, iterable)", doc: "Apply function to iterable items." },
      { label: "filter", kind: vscode.CompletionItemKind.Function, detail: "filter(function, iterable)", doc: "Filter iterable with function." },
      { label: "sorted", kind: vscode.CompletionItemKind.Function, detail: "sorted(iterable, key=None, reverse=False)", doc: "Return sorted list from iterable." },
      { label: "isinstance", kind: vscode.CompletionItemKind.Function, detail: "isinstance(object, classinfo)", doc: "Check if object is instance of class." },
      { label: "hasattr", kind: vscode.CompletionItemKind.Function, detail: "hasattr(object, name)", doc: "Check if object has attribute." },
      { label: "getattr", kind: vscode.CompletionItemKind.Function, detail: "getattr(object, name[, default])", doc: "Get attribute from object." },
      { label: "setattr", kind: vscode.CompletionItemKind.Function, detail: "setattr(object, name, value)", doc: "Set attribute on object." },
      { label: "dict", kind: vscode.CompletionItemKind.Class, detail: "dict(**kwargs)", doc: "Dictionary type." },
      { label: "list", kind: vscode.CompletionItemKind.Class, detail: "list([iterable])", doc: "List type." },
      { label: "set", kind: vscode.CompletionItemKind.Class, detail: "set([iterable])", doc: "Set type (unordered unique elements)." },
      { label: "tuple", kind: vscode.CompletionItemKind.Class, detail: "tuple([iterable])", doc: "Tuple type (immutable sequence)." },
      { label: "str", kind: vscode.CompletionItemKind.Class, detail: "str(object)", doc: "String type." },
      { label: "int", kind: vscode.CompletionItemKind.Class, detail: "int(x, base=10)", doc: "Integer type." },
      { label: "float", kind: vscode.CompletionItemKind.Class, detail: "float(x)", doc: "Float type." },
      { label: "bool", kind: vscode.CompletionItemKind.Class, detail: "bool([x])", doc: "Boolean type." },
      { label: "abs", kind: vscode.CompletionItemKind.Function, detail: "abs(x)", doc: "Return absolute value." },
      { label: "sum", kind: vscode.CompletionItemKind.Function, detail: "sum(iterable, start=0)", doc: "Sum elements in iterable." },
      { label: "min", kind: vscode.CompletionItemKind.Function, detail: "min(iterable, key=None)", doc: "Return minimum value." },
      { label: "max", kind: vscode.CompletionItemKind.Function, detail: "max(iterable, key=None)", doc: "Return maximum value." },
      { label: "all", kind: vscode.CompletionItemKind.Function, detail: "all(iterable)", doc: "Check if all elements are true." },
      { label: "any", kind: vscode.CompletionItemKind.Function, detail: "any(iterable)", doc: "Check if any element is true." },

      // === DECORATORS ===
      { label: "@property", kind: vscode.CompletionItemKind.Keyword, detail: "@property", doc: "Turn method into read-only property.\n\n```python\nclass Point:\n  @property\n  def x(self):\n    return self._x\n```" },
      { label: "@staticmethod", kind: vscode.CompletionItemKind.Keyword, detail: "@staticmethod", doc: "Mark method as static (no self)." },
      { label: "@classmethod", kind: vscode.CompletionItemKind.Keyword, detail: "@classmethod", doc: "Mark method as class method (receives cls)." },
      { label: "@abstractmethod", kind: vscode.CompletionItemKind.Keyword, detail: "@abstractmethod", doc: "Mark method as abstract (from abc module)." },
      { label: "@contextmanager", kind: vscode.CompletionItemKind.Keyword, detail: "@contextmanager", doc: "Create context manager from generator." },

      // === ASYNC/AWAIT ===
      { label: "async def", kind: vscode.CompletionItemKind.Keyword, detail: "async def function():", doc: "Define async coroutine function." },
      { label: "await", kind: vscode.CompletionItemKind.Keyword, detail: "await coroutine", doc: "Wait for coroutine to complete." },
      { label: "asyncio.run", kind: vscode.CompletionItemKind.Function, detail: "asyncio.run(coro)", doc: "Run async function." },
      { label: "asyncio.gather", kind: vscode.CompletionItemKind.Function, detail: "asyncio.gather(*coros)", doc: "Run multiple coroutines concurrently." },
      { label: "asyncio.create_task", kind: vscode.CompletionItemKind.Function, detail: "asyncio.create_task(coro)", doc: "Create task from coroutine." },

      // === POPULAR PACKAGES ===
      { label: "numpy", kind: vscode.CompletionItemKind.Module, detail: "import numpy as np", doc: "Numerical computing library.\n\n**Common:**\n- `np.array()` - Create array\n- `np.zeros(), np.ones()` - Create matrices\n- `np.arange()` - Create range" },
      { label: "pandas", kind: vscode.CompletionItemKind.Module, detail: "import pandas as pd", doc: "Data manipulation library.\n\n**Common:**\n- `pd.DataFrame()` - Create dataframe\n- `pd.read_csv()` - Read CSV\n- `df.groupby()` - Group operations" },
      { label: "matplotlib", kind: vscode.CompletionItemKind.Module, detail: "import matplotlib.pyplot as plt", doc: "Plotting library.\n\n**Common:**\n- `plt.plot()` - Line plot\n- `plt.show()` - Display plot" },
      { label: "requests", kind: vscode.CompletionItemKind.Module, detail: "import requests", doc: "HTTP library.\n\n**Common:**\n- `requests.get(url)` - GET request\n- `requests.post(url, data=...)` - POST request" },
      { label: "flask", kind: vscode.CompletionItemKind.Module, detail: "from flask import Flask", doc: "Web framework.\n\n**Common:**\n- `app = Flask(__name__)` - Create app\n- `@app.route('/path')` - Define route" },
      { label: "django", kind: vscode.CompletionItemKind.Module, detail: "import django", doc: "Full-featured web framework." },
      { label: "pytest", kind: vscode.CompletionItemKind.Module, detail: "import pytest", doc: "Testing framework.\n\n**Common:**\n- `def test_something():` - Test function" },
      { label: "sqlalchemy", kind: vscode.CompletionItemKind.Module, detail: "from sqlalchemy import create_engine", doc: "ORM and SQL toolkit." },
      { label: "pydantic", kind: vscode.CompletionItemKind.Module, detail: "from pydantic import BaseModel", doc: "Data validation using type hints." },
      { label: "pathlib", kind: vscode.CompletionItemKind.Module, detail: "from pathlib import Path", doc: "Object-oriented file paths.\n\n**Common:**\n- `Path('/path/to/file')` - Create path\n- `path.exists()` - Check existence" },
      { label: "typing", kind: vscode.CompletionItemKind.Module, detail: "from typing import List, Dict, Optional", doc: "Type hints.\n\n**Common:**\n- `List[int]` - List of ints\n- `Optional[str]` - Optional string\n- `Dict[str, int]` - Dictionary" },
      { label: "logging", kind: vscode.CompletionItemKind.Module, detail: "import logging", doc: "Logging module.\n\n**Common:**\n- `logging.info()` - Info log\n- `logging.getLogger()` - Get logger" },
      { label: "json", kind: vscode.CompletionItemKind.Module, detail: "import json", doc: "JSON encoding/decoding.\n\n**Common:**\n- `json.dumps()` - Serialize to JSON\n- `json.loads()` - Parse JSON" },
      { label: "os", kind: vscode.CompletionItemKind.Module, detail: "import os", doc: "OS operations.\n\n**Common:**\n- `os.path.exists()` - Check path\n- `os.environ` - Environment variables" },
      { label: "sys", kind: vscode.CompletionItemKind.Module, detail: "import sys", doc: "System operations.\n\n**Common:**\n- `sys.argv` - Command line args\n- `sys.exit()` - Exit program" },

      // === COMMON PATTERNS ===
      { label: "if __name__ == '__main__':", kind: vscode.CompletionItemKind.Snippet, detail: "if __name__ == '__main__':", doc: "Entry point check." },
      { label: "with open() as f:", kind: vscode.CompletionItemKind.Snippet, detail: "with open(file) as f:", doc: "File context manager." },
      { label: "try/except", kind: vscode.CompletionItemKind.Snippet, detail: "try:\n  ...\nexcept Exception as e:", doc: "Exception handling." },
      { label: "class MyClass:", kind: vscode.CompletionItemKind.Snippet, detail: "class MyClass:\n  def __init__(self):", doc: "Class definition." },
      { label: "def function():", kind: vscode.CompletionItemKind.Snippet, detail: "def function(args):", doc: "Function definition." },
      { label: "lambda x: x * 2", kind: vscode.CompletionItemKind.Snippet, detail: "lambda args: expr", doc: "Anonymous function." },
      { label: "[x for x in iterable]", kind: vscode.CompletionItemKind.Snippet, detail: "[expr for item in iterable]", doc: "List comprehension." },
      { label: "{k: v for k, v in ...}", kind: vscode.CompletionItemKind.Snippet, detail: "{k: v for k, v in items}", doc: "Dict comprehension." },
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

module.exports = { PythonCompletionProvider };
