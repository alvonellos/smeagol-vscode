"use strict";

const vscode = require("vscode");

/**
 * Rust Completion Provider
 * Provides IntelliJ-like code completion for Rust with comprehensive documentation
 * "We knows the precious Rust... all the crates and traits..."
 */
class RustCompletionProvider {
  constructor() {
    this.completionItems = [];
    this.initialize();
  }

  initialize() {
    const completions = [
      // === STANDARD LIBRARY TYPES ===
      {
        label: "Vec",
        kind: vscode.CompletionItemKind.Struct,
        detail: "Vec<T>",
        doc: "A contiguous growable array type, written as `Vec<T>`, short for 'vector'.\n\n**Example:**\n```rust\nlet mut v: Vec<i32> = vec![1, 2, 3];\nv.push(4);\n```"
      },
      {
        label: "String",
        kind: vscode.CompletionItemKind.Struct,
        detail: "String",
        doc: "A UTF-8 encoded, growable string. The most common way to work with strings in Rust.\n\n**Example:**\n```rust\nlet mut s = String::from(\"hello\");\ns.push_str(\" world\");\n```"
      },
      {
        label: "HashMap",
        kind: vscode.CompletionItemKind.Struct,
        detail: "HashMap<K, V>",
        doc: "A hash map implemented with quadratic probing and SIMD lookup.\n\n**Example:**\n```rust\nuse std::collections::HashMap;\nlet mut map = HashMap::new();\nmap.insert(\"key\", \"value\");\n```"
      },
      {
        label: "HashSet",
        kind: vscode.CompletionItemKind.Struct,
        detail: "HashSet<T>",
        doc: "A hash set implemented as a HashMap where the value is `()`.\n\n**Example:**\n```rust\nuse std::collections::HashSet;\nlet mut set = HashSet::new();\nset.insert(42);\n```"
      },
      {
        label: "Option",
        kind: vscode.CompletionItemKind.Enum,
        detail: "Option<T>",
        doc: "The `Option` type. Every `Option<T>` is either `Some(T)` or `None`.\n\n**Example:**\n```rust\nlet x: Option<i32> = Some(5);\nlet y: Option<i32> = None;\n```"
      },
      {
        label: "Result",
        kind: vscode.CompletionItemKind.Enum,
        detail: "Result<T, E>",
        doc: "A type that represents either success (`Ok(T)`) or failure (`Err(E)`).\n\n**Example:**\n```rust\nfn divide(a: f64, b: f64) -> Result<f64, String> {\n  if b == 0.0 {\n    Err(\"division by zero\".to_string())\n  } else {\n    Ok(a / b)\n  }\n}\n```"
      },
      {
        label: "BTreeMap",
        kind: vscode.CompletionItemKind.Struct,
        detail: "BTreeMap<K, V>",
        doc: "A sorted map implemented as a B-tree. Keys are kept in sorted order.\n\n**Example:**\n```rust\nuse std::collections::BTreeMap;\nlet mut map = BTreeMap::new();\nmap.insert(2, \"b\");\nmap.insert(1, \"a\");\n```"
      },
      {
        label: "VecDeque",
        kind: vscode.CompletionItemKind.Struct,
        detail: "VecDeque<T>",
        doc: "A double-ended queue implemented as a circular buffer.\n\n**Example:**\n```rust\nuse std::collections::VecDeque;\nlet mut v = VecDeque::new();\nv.push_back(1);\nv.push_front(0);\n```"
      },
      {
        label: "Arc",
        kind: vscode.CompletionItemKind.Struct,
        detail: "Arc<T>",
        doc: "An atomic reference counting pointer. Provides shared ownership across threads.\n\n**Example:**\n```rust\nuse std::sync::Arc;\nlet data = Arc::new(vec![1, 2, 3]);\nlet data2 = Arc::clone(&data);\n```"
      },
      {
        label: "Mutex",
        kind: vscode.CompletionItemKind.Struct,
        detail: "Mutex<T>",
        doc: "Mutual exclusion lock for protecting shared mutable state.\n\n**Example:**\n```rust\nuse std::sync::Mutex;\nlet m = Mutex::new(5);\n{\n  let mut num = m.lock().unwrap();\n  *num = 6;\n}\n```"
      },
      {
        label: "RwLock",
        kind: vscode.CompletionItemKind.Struct,
        detail: "RwLock<T>",
        doc: "A reader-writer lock. Allows multiple readers or one writer.\n\n**Example:**\n```rust\nuse std::sync::RwLock;\nlet lock = RwLock::new(5);\nlet r1 = lock.read().unwrap();\nlet r2 = lock.read().unwrap();\n```"
      },

      // === COMMON TRAITS ===
      {
        label: "Iterator",
        kind: vscode.CompletionItemKind.Interface,
        detail: "Iterator<Item = T>",
        doc: "An object that can be iterated over. Key methods: `next()`, `map()`, `filter()`, `collect()`.\n\n**Example:**\n```rust\nlet v = vec![1, 2, 3];\nlet iter = v.iter();\nfor item in iter {\n  println!(\"{}\", item);\n}\n```"
      },
      {
        label: "IntoIterator",
        kind: vscode.CompletionItemKind.Interface,
        detail: "IntoIterator",
        doc: "Conversion into an iterator. Implemented by types that can be converted into iterators.\n\n**Example:**\n```rust\nlet v = vec![1, 2, 3];\nfor item in v.into_iter() {\n  println!(\"{}\", item);\n}\n```"
      },
      {
        label: "Clone",
        kind: vscode.CompletionItemKind.Interface,
        detail: "Clone",
        doc: "A trait that allows explicit copying of values.\n\n**Example:**\n```rust\n#[derive(Clone)]\nstruct Point { x: i32, y: i32 }\nlet p1 = Point { x: 1, y: 2 };\nlet p2 = p1.clone();\n```"
      },
      {
        label: "Copy",
        kind: vscode.CompletionItemKind.Interface,
        detail: "Copy",
        doc: "Marker trait indicating that a type is safely bit-copyable. Marker for types that can be copied by just copying bits.\n\n**Example:**\n```rust\n#[derive(Copy, Clone)]\nstruct Point { x: i32, y: i32 }\n```"
      },
      {
        label: "Default",
        kind: vscode.CompletionItemKind.Interface,
        detail: "Default",
        doc: "Returns the default value for a type.\n\n**Example:**\n```rust\n#[derive(Default)]\nstruct Config { timeout: u32 }\nlet cfg = Config::default();\n```"
      },
      {
        label: "Display",
        kind: vscode.CompletionItemKind.Interface,
        detail: "Display",
        doc: "Formatting trait for pretty-printing values using `println!(\"{}\", value)`.\n\n**Example:**\n```rust\nimpl std::fmt::Display for Point {\n  fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {\n    write!(f, \"({}, {})\", self.x, self.y)\n  }\n}\n```"
      },
      {
        label: "Debug",
        kind: vscode.CompletionItemKind.Interface,
        detail: "Debug",
        doc: "Formatting trait for debug printing using `println!(\"{:?}\", value)` or `dbg!()`.\n\n**Example:**\n```rust\n#[derive(Debug)]\nstruct Point { x: i32, y: i32 }\ndbg!(point);\n```"
      },
      {
        label: "PartialEq",
        kind: vscode.CompletionItemKind.Interface,
        detail: "PartialEq",
        doc: "Trait for equality comparisons using `==` and `!=` operators.\n\n**Example:**\n```rust\n#[derive(PartialEq)]\nstruct Point { x: i32, y: i32 }\nassert_eq!(p1, p2);\n```"
      },
      {
        label: "Eq",
        kind: vscode.CompletionItemKind.Interface,
        detail: "Eq",
        doc: "Marker trait indicating that `PartialEq` has reflexivity (a == a).\n\n**Example:**\n```rust\n#[derive(Eq, PartialEq)]\nstruct Point { x: i32, y: i32 }\n```"
      },
      {
        label: "Ord",
        kind: vscode.CompletionItemKind.Interface,
        detail: "Ord",
        doc: "Trait for types that have a total ordering.\n\n**Example:**\n```rust\n#[derive(Ord, PartialOrd, Eq, PartialEq)]\nstruct Point { x: i32, y: i32 }\nlet mut v = vec![p2, p1];\nv.sort();\n```"
      },
      {
        label: "From",
        kind: vscode.CompletionItemKind.Interface,
        detail: "From<T>",
        doc: "Trait for fallible conversions. Also provides `into()`.\n\n**Example:**\n```rust\nlet num = i32::from(42u8);\nlet s: String = \"hello\".into();\n```"
      },
      {
        label: "Into",
        kind: vscode.CompletionItemKind.Interface,
        detail: "Into<T>",
        doc: "Trait for converting values into another type. Automatically implemented for types that implement `From`.\n\n**Example:**\n```rust\nfn process(s: String) { }\nprocess(\"hello\".into());\n```"
      },

      // === MACROS ===
      {
        label: "println!",
        kind: vscode.CompletionItemKind.Function,
        detail: "println!(format_string, args...)",
        doc: "Prints to stdout with a newline.\n\n**Example:**\n```rust\nprintln!(\"Hello, {}!\", \"world\");\n```"
      },
      {
        label: "dbg!",
        kind: vscode.CompletionItemKind.Function,
        detail: "dbg!(expr)",
        doc: "Prints the value of an expression and returns the value. Useful for debugging.\n\n**Example:**\n```rust\nlet x = dbg!(5 + 6);\n```"
      },
      {
        label: "vec!",
        kind: vscode.CompletionItemKind.Function,
        detail: "vec![element, ...]",
        doc: "Macro to create a vector with elements.\n\n**Example:**\n```rust\nlet v = vec![1, 2, 3];\nlet v2 = vec![0; 5]; // 5 zeros\n```"
      },
      {
        label: "panic!",
        kind: vscode.CompletionItemKind.Function,
        detail: "panic!(msg)",
        doc: "Panics with an error message. Unwinds the current thread.\n\n**Example:**\n```rust\npanic!(\"Something went wrong!\");\n```"
      },
      {
        label: "assert!",
        kind: vscode.CompletionItemKind.Function,
        detail: "assert!(condition, msg)",
        doc: "Asserts that a boolean condition is true.\n\n**Example:**\n```rust\nassert!(2 + 2 == 4);\nassert_eq!(2 + 2, 4);\n```"
      },
      {
        label: "unwrap!",
        kind: vscode.CompletionItemKind.Function,
        detail: "option.unwrap()",
        doc: "Extracts the value from an `Option<T>` or `Result<T, E>`. Panics if `None` or `Err`.\n\n**Example:**\n```rust\nlet x: Option<i32> = Some(5);\nlet val = x.unwrap(); // 5\n```"
      },
      {
        label: "derive",
        kind: vscode.CompletionItemKind.Function,
        detail: "#[derive(Trait, ...)]",
        doc: "Automatically derive trait implementations for structs and enums.\n\n**Example:**\n```rust\n#[derive(Clone, Debug, Default)]\nstruct Point { x: i32, y: i32 }\n```"
      },

      // === COMMON FUNCTIONS ===
      {
        label: "collect",
        kind: vscode.CompletionItemKind.Function,
        detail: "iterator.collect::<Collection>()",
        doc: "Transforms an iterator into a collection (Vec, HashMap, String, etc.).\n\n**Example:**\n```rust\nlet nums: Vec<i32> = (1..5).collect();\nlet evens: Vec<i32> = (1..10).filter(|x| x % 2 == 0).collect();\n```"
      },
      {
        label: "map",
        kind: vscode.CompletionItemKind.Function,
        detail: "iterator.map(|x| ...)",
        doc: "Creates an iterator that applies a closure to each element.\n\n**Example:**\n```rust\nlet nums = vec![1, 2, 3];\nlet doubled: Vec<_> = nums.iter().map(|x| x * 2).collect();\n```"
      },
      {
        label: "filter",
        kind: vscode.CompletionItemKind.Function,
        detail: "iterator.filter(|x| ...)",
        doc: "Creates an iterator that yields only elements for which the closure returns true.\n\n**Example:**\n```rust\nlet nums = vec![1, 2, 3, 4, 5];\nlet evens: Vec<_> = nums.into_iter().filter(|x| x % 2 == 0).collect();\n```"
      },
      {
        label: "unwrap_or",
        kind: vscode.CompletionItemKind.Function,
        detail: "option.unwrap_or(default)",
        doc: "Returns the contained value or a provided default.\n\n**Example:**\n```rust\nlet x: Option<String> = None;\nlet val = x.unwrap_or(\"default\".to_string());\n```"
      },
      {
        label: "expect",
        kind: vscode.CompletionItemKind.Function,
        detail: "option.expect(msg)",
        doc: "Unwraps an Option or panics with a custom message.\n\n**Example:**\n```rust\nlet x: Option<i32> = Some(5);\nlet val = x.expect(\"Should have a value\");\n```"
      },
      {
        label: "ok_or",
        kind: vscode.CompletionItemKind.Function,
        detail: "option.ok_or(err)",
        doc: "Converts an Option<T> to a Result<T, E>.\n\n**Example:**\n```rust\nlet x: Option<i32> = Some(5);\nlet res: Result<i32, &str> = x.ok_or(\"No value\");\n```"
      },
      {
        label: "and_then",
        kind: vscode.CompletionItemKind.Function,
        detail: "option.and_then(|x| ...)",
        doc: "Chains Option operations together.\n\n**Example:**\n```rust\nlet x: Option<i32> = Some(2);\nlet y = x.and_then(|a| Some(a * 2));\n```"
      },
      {
        label: "?",
        kind: vscode.CompletionItemKind.Operator,
        detail: "result? or option?",
        doc: "The try operator. Returns early with an error or None.\n\n**Example:**\n```rust\nfn may_fail() -> Result<i32, String> {\n  let x = some_result()?;\n  Ok(x)\n}\n```"
      },

      // === POPULAR CRATES ===
      {
        label: "tokio",
        kind: vscode.CompletionItemKind.Module,
        detail: "tokio",
        doc: "An asynchronous runtime for Rust.\n\n**Common:**\n- `#[tokio::main]` - Async main\n- `tokio::spawn()` - Spawn async task\n- `tokio::time::sleep()` - Async sleep\n\n**Add to Cargo.toml:**\n```\n[dependencies]\ntokio = { version = \"1\", features = [\"full\"] }\n```"
      },
      {
        label: "serde",
        kind: vscode.CompletionItemKind.Module,
        detail: "serde",
        doc: "Serialization and deserialization library.\n\n**Common:**\n- `#[derive(Serialize, Deserialize)]` - Enable (de)serialization\n- `serde_json::to_string()` - Serialize to JSON\n- `serde_json::from_str()` - Deserialize from JSON\n\n**Add to Cargo.toml:**\n```\n[dependencies]\nserde = { version = \"1\", features = [\"derive\"] }\nserde_json = \"1\"\n```"
      },
      {
        label: "anyhow",
        kind: vscode.CompletionItemKind.Module,
        detail: "anyhow",
        doc: "Flexible error handling with context.\n\n**Common:**\n- `anyhow::Result<T>` - Type alias for `Result<T, anyhow::Error>`\n- `anyhow::bail!(msg)` - Bail with error\n- `.context(msg)?` - Add context to errors\n\n**Add to Cargo.toml:**\n```\n[dependencies]\nanyhow = \"1\"\n```"
      },
      {
        label: "thiserror",
        kind: vscode.CompletionItemKind.Module,
        detail: "thiserror",
        doc: "Derive macros for error handling.\n\n**Common:**\n- `#[derive(thiserror::Error)]` - Derive Error trait\n- `#[error(\"{0}\")]` - Error message format\n\n**Add to Cargo.toml:**\n```\n[dependencies]\nthiserror = \"1\"\n```"
      },
      {
        label: "regex",
        kind: vscode.CompletionItemKind.Module,
        detail: "regex",
        doc: "Regular expressions.\n\n**Common:**\n- `Regex::new(pattern)` - Create regex\n- `re.is_match()` - Test match\n- `re.captures()` - Get captures\n\n**Add to Cargo.toml:**\n```\n[dependencies]\nregex = \"1\"\n```"
      },
      {
        label: "chrono",
        kind: vscode.CompletionItemKind.Module,
        detail: "chrono",
        doc: "Date and time library.\n\n**Common:**\n- `Utc::now()` - Current UTC time\n- `NaiveDate::from_ymd()` - Create date\n- `DateTime<Utc>` - Datetime type\n\n**Add to Cargo.toml:**\n```\n[dependencies]\nchrono = \"0.4\"\n```"
      },
      {
        label: "clap",
        kind: vscode.CompletionItemKind.Module,
        detail: "clap",
        doc: "Command line argument parser.\n\n**Common:**\n- `#[derive(Parser)]` - Derive CLI\n- `#[arg()]` - Define argument\n- `Parser::parse()` - Parse args\n\n**Add to Cargo.toml:**\n```\n[dependencies]\nclap = { version = \"4\", features = [\"derive\"] }\n```"
      },
      {
        label: "log",
        kind: vscode.CompletionItemKind.Module,
        detail: "log",
        doc: "Logging facade.\n\n**Common:**\n- `info!()`, `debug!()`, `warn!()`, `error!()`\n- `log::set_logger()` - Set logger\n\n**Add to Cargo.toml:**\n```\n[dependencies]\nlog = \"0.4\"\nenv_logger = \"0.10\"\n```"
      },
      {
        label: "lazy_static",
        kind: vscode.CompletionItemKind.Module,
        detail: "lazy_static",
        doc: "Lazy static initialization.\n\n**Example:**\n```rust\nlazy_static::lazy_static! {\n  static ref REGEX: Regex = Regex::new(r\"...\").unwrap();\n}\n```"
      },
    ];

    completions.forEach(comp => {
      const item = new vscode.CompletionItem(comp.label, comp.kind);
      item.detail = comp.detail;
      item.documentation = new vscode.MarkdownString(comp.doc);
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

module.exports = { RustCompletionProvider };
