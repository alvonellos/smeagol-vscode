"use strict";

const vscode = require("vscode");

/**
 * Lombok Completion Provider
 * Provides IntelliJ-like code completion for Lombok annotations
 * Lombok reduces boilerplate in Java through annotation processing
 */
class LombokCompletionProvider {
  constructor() {
    this.completionItems = [];
    this.initialize();
  }

  initialize() {
    const lombokAnnotations = [
      // === CLASS/RECORD ANNOTATIONS ===
      {
        label: "@Data",
        kind: vscode.CompletionItemKind.Class,
        detail: "@lombok.Data",
        doc: "**Generates:** `@Getter`, `@Setter`, `@ToString`, `@EqualsAndHashCode`, `@RequiredArgsConstructor`\n\nThe most popular Lombok annotation. Combines commonly used annotations into one.\n\n**Example:**\n```java\n@Data\npublic class User {\n  private Long id;\n  private String name;\n  private String email;\n}\n// Generates: getters, setters, toString, equals, hashCode, constructor\n```"
      },
      {
        label: "@Getter",
        kind: vscode.CompletionItemKind.Class,
        detail: "@lombok.Getter",
        doc: "**Generates:** Getter methods for all fields.\n\n**Parameters:**\n- `AccessLevel` - Specify getter visibility (PUBLIC, PROTECTED, PACKAGE, PRIVATE)\n\n**Example:**\n```java\n@Getter\npublic class Point {\n  private int x;\n  private int y;\n}\n// Generates: getX(), getY()\n```"
      },
      {
        label: "@Setter",
        kind: vscode.CompletionItemKind.Class,
        detail: "@lombok.Setter",
        doc: "**Generates:** Setter methods for all fields.\n\n**Parameters:**\n- `AccessLevel` - Specify setter visibility\n\n**Example:**\n```java\n@Setter\npublic class Point {\n  private int x;\n  private int y;\n}\n// Generates: setX(int), setY(int)\n```"
      },
      {
        label: "@ToString",
        kind: vscode.CompletionItemKind.Class,
        detail: "@lombok.ToString",
        doc: "**Generates:** `toString()` method.\n\n**Parameters:**\n- `includeFieldNames` - Include field names in output\n- `exclude` - Exclude specific fields\n- `callSuper` - Call super.toString()\n\n**Example:**\n```java\n@ToString\npublic class User {\n  private String name;\n  private int age;\n}\n// Result: User(name=John, age=30)\n```"
      },
      {
        label: "@EqualsAndHashCode",
        kind: vscode.CompletionItemKind.Class,
        detail: "@lombok.EqualsAndHashCode",
        doc: "**Generates:** `equals()` and `hashCode()` methods.\n\n**Parameters:**\n- `exclude` - Exclude specific fields\n- `callSuper` - Call super methods\n\n**Example:**\n```java\n@EqualsAndHashCode\npublic class User {\n  private Long id;\n  private String name;\n}\n// Generates proper equals and hashCode\n```"
      },
      {
        label: "@RequiredArgsConstructor",
        kind: vscode.CompletionItemKind.Class,
        detail: "@lombok.RequiredArgsConstructor",
        doc: "**Generates:** Constructor for required (final or @NonNull) fields.\n\n**Example:**\n```java\n@RequiredArgsConstructor\npublic class User {\n  private final Long id;\n  private final String name;\n  private String email; // optional\n}\n// Generates: User(Long id, String name)\n```"
      },
      {
        label: "@AllArgsConstructor",
        kind: vscode.CompletionItemKind.Class,
        detail: "@lombok.AllArgsConstructor",
        doc: "**Generates:** Constructor with all fields as parameters.\n\n**Example:**\n```java\n@AllArgsConstructor\npublic class User {\n  private Long id;\n  private String name;\n  private String email;\n}\n// Generates: User(Long id, String name, String email)\n```"
      },
      {
        label: "@NoArgsConstructor",
        kind: vscode.CompletionItemKind.Class,
        detail: "@lombok.NoArgsConstructor",
        doc: "**Generates:** No-argument constructor.\n\n**Parameters:**\n- `force` - Force generation (initializes final fields to defaults)\n- `access` - Constructor visibility\n\n**Example:**\n```java\n@NoArgsConstructor\n@AllArgsConstructor\npublic class User {\n  private Long id;\n  private String name;\n}\n// Generates both no-arg and all-arg constructors\n```"
      },
      {
        label: "@Builder",
        kind: vscode.CompletionItemKind.Class,
        detail: "@lombok.Builder",
        doc: "**Generates:** Builder pattern implementation.\n\nAutomatic builder generation following the Builder pattern for fluent object construction.\n\n**Example:**\n```java\n@Builder\npublic class User {\n  private Long id;\n  private String name;\n  private String email;\n}\n\n// Usage:\nUser user = User.builder()\n  .id(1L)\n  .name(\"John\")\n  .email(\"john@example.com\")\n  .build();\n```"
      },
      {
        label: "@Value",
        kind: vscode.CompletionItemKind.Class,
        detail: "@lombok.Value",
        doc: "**Generates:** Immutable value object.\n\nEquivalent to `@Data` but for immutable objects. All fields are final, no setters.\n\n**Example:**\n```java\n@Value\npublic class Point {\n  int x;\n  int y;\n}\n// All fields are final, only getters generated\n```"
      },
      {
        label: "@NonNull",
        kind: vscode.CompletionItemKind.Class,
        detail: "@lombok.NonNull",
        doc: "**Generates:** Null-check in constructor and setter.\n\nAdds `if (param == null) throw NullPointerException()` to constructor/setter.\n\n**Example:**\n```java\n@RequiredArgsConstructor\npublic class User {\n  @NonNull private final String name;\n}\n// Throws NPE if null name is passed\n```"
      },

      // === FUNCTIONAL ANNOTATIONS ===
      {
        label: "@Slf4j",
        kind: vscode.CompletionItemKind.Class,
        detail: "@lombok.extern.slf4j.Slf4j",
        doc: "**Generates:** `static final Logger log = LoggerFactory.getLogger(...)` field.\n\n**Usage:**\n```java\n@Slf4j\npublic class Service {\n  public void doWork() {\n    log.info(\"Working...\");\n    log.error(\"Error!\", exception);\n  }\n}\n```"
      },
      {
        label: "@Log",
        kind: vscode.CompletionItemKind.Class,
        detail: "@lombok.extern.java.Log",
        doc: "**Generates:** `java.util.logging.Logger` field.\n\n**Usage:**\n```java\n@Log\npublic class Service {\n  public void work() {\n    log.info(\"Working...\");\n  }\n}\n```"
      },
      {
        label: "@Log4j",
        kind: vscode.CompletionItemKind.Class,
        detail: "@lombok.extern.log4j.Log4j",
        doc: "**Generates:** `org.apache.logging.log4j.Logger` field.\n\n**Usage:**\n```java\n@Log4j\npublic class Service {\n  public void work() {\n    logger.info(\"Working...\");\n  }\n}\n```"
      },
      {
        label: "@Log4j2",
        kind: vscode.CompletionItemKind.Class,
        detail: "@lombok.extern.log4j.Log4j2",
        doc: "**Generates:** `org.apache.logging.log4j.Logger` field (Log4j 2).\n\n**Usage:**\n```java\n@Log4j2\npublic class Service {\n  public void work() {\n    log.info(\"Working...\");\n  }\n}\n```"
      },
      {
        label: "@Synchronized",
        kind: vscode.CompletionItemKind.Class,
        detail: "@lombok.Synchronized",
        doc: "**Generates:** Thread-safe synchronization with private lock objects.\n\n**Example:**\n```java\npublic class ThreadSafe {\n  @Synchronized\n  public void work() {\n    // Synchronized with private lock\n  }\n}\n```"
      },
      {
        label: "@SneakyThrows",
        kind: vscode.CompletionItemKind.Class,
        detail: "@lombok.SneakyThrows",
        doc: "**Generates:** Hidden exception throwing (sneaky throws).\n\nAllows you to throw checked exceptions without declaring them.\n\n**Example:**\n```java\npublic class Utils {\n  @SneakyThrows\n  public static void sleep(long ms) {\n    Thread.sleep(ms); // No need to declare InterruptedException\n  }\n}\n```"
      },

      // === UTILITY ANNOTATIONS ===
      {
        label: "@Cleanup",
        kind: vscode.CompletionItemKind.Class,
        detail: "@lombok.Cleanup",
        doc: "**Generates:** Automatic resource management (like try-with-resources).\n\nAutomatically calls `close()` on exit.\n\n**Example:**\n```java\npublic void process() throws IOException {\n  @Cleanup InputStream in = new FileInputStream(\"file.txt\");\n  // in.close() is called automatically\n}\n```"
      },
      {
        label: "@With",
        kind: vscode.CompletionItemKind.Class,
        detail: "@lombok.With",
        doc: "**Generates:** Wither methods (copy with modified field).\n\nCreates a copy of the object with one field changed.\n\n**Example:**\n```java\n@Value\n@With\npublic class User {\n  private String name;\n  private int age;\n}\n\n// Usage:\nUser john = new User(\"John\", 30);\nUser jane = john.withName(\"Jane\"); // New User with name=\"Jane\"\n```"
      },
      {
        label: "@Delegate",
        kind: vscode.CompletionItemKind.Class,
        detail: "@lombok.experimental.Delegate",
        doc: "**Generates:** Delegation methods.\n\nAutomatically generates delegation methods to a field.\n\n**Example:**\n```java\npublic class MyList<T> {\n  @Delegate\n  private final List<T> list = new ArrayList<>();\n}\n// Generates: add(), remove(), size(), etc.\n```"
      },
      {
        label: "@AccessLevel",
        kind: vscode.CompletionItemKind.Class,
        detail: "@lombok.AccessLevel",
        doc: "**Usage:** Control visibility of generated methods.\n\n**Values:** PUBLIC, PROTECTED, PACKAGE, PRIVATE, MODULE\n\n**Example:**\n```java\n@Getter(AccessLevel.PROTECTED)\npublic class User {\n  private String email;\n  // getEmail() is protected, not public\n}\n```"
      },
      {
        label: "@UtilityClass",
        kind: vscode.CompletionItemKind.Class,
        detail: "@lombok.experimental.UtilityClass",
        doc: "**Generates:** Private constructor and final class for utility classes.\n\nPrevents instantiation of utility classes.\n\n**Example:**\n```java\n@UtilityClass\npublic class MathUtils {\n  public static int add(int a, int b) {\n    return a + b;\n  }\n}\n// Can't do: new MathUtils()\n```"
      },

      // === CONFIGURATION ANNOTATIONS ===
      {
        label: "@Singular",
        kind: vscode.CompletionItemKind.Class,
        detail: "@lombok.Singular",
        doc: "**Usage:** With @Builder to create singular collection builder methods.\n\n**Example:**\n```java\n@Builder\npublic class Team {\n  @Singular\n  private List<String> members;\n}\n\n// Usage:\nTeam team = Team.builder()\n  .member(\"Alice\")\n  .member(\"Bob\")\n  .build();\n```"
      },
      {
        label: "@ToString.Exclude",
        kind: vscode.CompletionItemKind.Class,
        detail: "@lombok.ToString.Exclude",
        doc: "**Usage:** Exclude field from generated toString().\n\n**Example:**\n```java\n@Data\npublic class User {\n  private String name;\n  @ToString.Exclude\n  private String password; // Won't appear in toString()\n}\n```"
      },
      {
        label: "@EqualsAndHashCode.Exclude",
        kind: vscode.CompletionItemKind.Class,
        detail: "@lombok.EqualsAndHashCode.Exclude",
        doc: "**Usage:** Exclude field from equals() and hashCode().\n\n**Example:**\n```java\n@Data\npublic class User {\n  private Long id;\n  @EqualsAndHashCode.Exclude\n  private LocalDateTime createdAt; // Won't affect equality\n}\n```"
      },
      {
        label: "@EqualsAndHashCode.Include",
        kind: vscode.CompletionItemKind.Class,
        detail: "@lombok.EqualsAndHashCode.Include",
        doc: "**Usage:** Force include field in equals() and hashCode().\n\nUseful with callSuper=true to include parent fields.\n\n**Example:**\n```java\n@EqualsAndHashCode(callSuper = true)\npublic class Child extends Parent {\n  @EqualsAndHashCode.Include\n  private String childField;\n}\n```"
      },
    ];

    lombokAnnotations.forEach(anno => {
      const item = new vscode.CompletionItem(anno.label, anno.kind);
      item.detail = anno.detail;
      item.documentation = new vscode.MarkdownString(anno.doc);
      // Add common Lombok imports to filter
      item.insertText = anno.label;
      this.completionItems.push(item);
    });
  }

  provideCompletionItems(document, position, token, context) {
    // Only show Lombok completions if @ is typed or in Java files
    return this.completionItems;
  }

  resolveCompletionItem(item, token) {
    return item;
  }
}

module.exports = { LombokCompletionProvider };
