"use strict";

const vscode = require("vscode");

/**
 * Maven Completion Provider
 */
class MavenCompletionProvider {
  constructor() {
    this.completionItems = [];
    this.initialize();
  }

  initialize() {
    const completions = [
      // === GOALS ===
      { label: "clean", kind: vscode.CompletionItemKind.Function, detail: "mvn clean", doc: "Clean target directory." },
      { label: "compile", kind: vscode.CompletionItemKind.Function, detail: "mvn compile", doc: "Compile source code." },
      { label: "test", kind: vscode.CompletionItemKind.Function, detail: "mvn test", doc: "Run tests." },
      { label: "package", kind: vscode.CompletionItemKind.Function, detail: "mvn package", doc: "Package compiled code." },
      { label: "install", kind: vscode.CompletionItemKind.Function, detail: "mvn install", doc: "Install to local repository." },
      { label: "deploy", kind: vscode.CompletionItemKind.Function, detail: "mvn deploy", doc: "Deploy to remote repository." },
      { label: "verify", kind: vscode.CompletionItemKind.Function, detail: "mvn verify", doc: "Run integration tests." },
      { label: "site", kind: vscode.CompletionItemKind.Function, detail: "mvn site", doc: "Generate project site." },
      { label: "help:describe", kind: vscode.CompletionItemKind.Function, detail: "mvn help:describe", doc: "Describe goals." },
      { label: "help:active-profiles", kind: vscode.CompletionItemKind.Function, detail: "mvn help:active-profiles", doc: "Show active profiles." },
      { label: "dependency:tree", kind: vscode.CompletionItemKind.Function, detail: "mvn dependency:tree", doc: "Show dependency tree." },
      { label: "dependency:analyze", kind: vscode.CompletionItemKind.Function, detail: "mvn dependency:analyze", doc: "Analyze dependencies." },

      // === POM ELEMENTS ===
      { label: "<project>", kind: vscode.CompletionItemKind.Class, detail: "<project>...</project>", doc: "Root POM element." },
      { label: "<modelVersion>", kind: vscode.CompletionItemKind.Property, detail: "<modelVersion>4.0.0</modelVersion>", doc: "POM model version." },
      { label: "<groupId>", kind: vscode.CompletionItemKind.Property, detail: "<groupId>com.example</groupId>", doc: "Group ID." },
      { label: "<artifactId>", kind: vscode.CompletionItemKind.Property, detail: "<artifactId>my-app</artifactId>", doc: "Artifact ID." },
      { label: "<version>", kind: vscode.CompletionItemKind.Property, detail: "<version>1.0.0</version>", doc: "Project version." },
      { label: "<packaging>", kind: vscode.CompletionItemKind.Property, detail: "<packaging>jar</packaging>", doc: "Package type (jar|war|pom)." },
      { label: "<name>", kind: vscode.CompletionItemKind.Property, detail: "<name>My App</name>", doc: "Project name." },
      { label: "<description>", kind: vscode.CompletionItemKind.Property, detail: "<description>...</description>", doc: "Project description." },
      { label: "<url>", kind: vscode.CompletionItemKind.Property, detail: "<url>https://example.com</url>", doc: "Project URL." },
      { label: "<properties>", kind: vscode.CompletionItemKind.Property, detail: "<properties>...</properties>", doc: "Project properties." },
      { label: "<dependencies>", kind: vscode.CompletionItemKind.Property, detail: "<dependencies>...</dependencies>", doc: "Dependency list." },
      { label: "<dependency>", kind: vscode.CompletionItemKind.Property, detail: "<dependency>...</dependency>", doc: "Single dependency." },
      { label: "<scope>", kind: vscode.CompletionItemKind.Property, detail: "<scope>compile</scope>", doc: "Dependency scope (compile|test|provided|runtime)." },
      { label: "<build>", kind: vscode.CompletionItemKind.Property, detail: "<build>...</build>", doc: "Build configuration." },
      { label: "<plugins>", kind: vscode.CompletionItemKind.Property, detail: "<plugins>...</plugins>", doc: "Plugin list." },
      { label: "<plugin>", kind: vscode.CompletionItemKind.Property, detail: "<plugin>...</plugin>", doc: "Single plugin." },
      { label: "<repositories>", kind: vscode.CompletionItemKind.Property, detail: "<repositories>...</repositories>", doc: "Repository list." },
      { label: "<repository>", kind: vscode.CompletionItemKind.Property, detail: "<repository>...</repository>", doc: "Single repository." },
      { label: "<pluginRepositories>", kind: vscode.CompletionItemKind.Property, detail: "<pluginRepositories>...</pluginRepositories>", doc: "Plugin repositories." },
      { label: "<profiles>", kind: vscode.CompletionItemKind.Property, detail: "<profiles>...</profiles>", doc: "Build profiles." },
      { label: "<profile>", kind: vscode.CompletionItemKind.Property, detail: "<profile>...</profile>", doc: "Single profile." },
      { label: "<activation>", kind: vscode.CompletionItemKind.Property, detail: "<activation>...</activation>", doc: "Profile activation." },

      // === PLUGINS ===
      { label: "maven-compiler-plugin", kind: vscode.CompletionItemKind.Module, detail: "Compile Java source", doc: "Compiles Java source code." },
      { label: "maven-surefire-plugin", kind: vscode.CompletionItemKind.Module, detail: "Run unit tests", doc: "Runs unit tests." },
      { label: "maven-jar-plugin", kind: vscode.CompletionItemKind.Module, detail: "Build JAR", doc: "Builds JAR files." },
      { label: "maven-war-plugin", kind: vscode.CompletionItemKind.Module, detail: "Build WAR", doc: "Builds WAR files." },
      { label: "maven-shade-plugin", kind: vscode.CompletionItemKind.Module, detail: "Build fat JAR", doc: "Creates executable JAR with dependencies." },
      { label: "spring-boot-maven-plugin", kind: vscode.CompletionItemKind.Module, detail: "Spring Boot build", doc: "Builds Spring Boot application." },
      { label: "maven-assembly-plugin", kind: vscode.CompletionItemKind.Module, detail: "Assemble", doc: "Creates assemblies." },
      { label: "maven-resources-plugin", kind: vscode.CompletionItemKind.Module, detail: "Handle resources", doc: "Copies resources." },
      { label: "exec-maven-plugin", kind: vscode.CompletionItemKind.Module, detail: "Execute Java", doc: "Executes Java programs." },

      // === PROPERTIES ===
      { label: "${project.version}", kind: vscode.CompletionItemKind.Variable, detail: "${project.version}", doc: "Project version." },
      { label: "${project.groupId}", kind: vscode.CompletionItemKind.Variable, detail: "${project.groupId}", doc: "Group ID." },
      { label: "${project.artifactId}", kind: vscode.CompletionItemKind.Variable, detail: "${project.artifactId}", doc: "Artifact ID." },
      { label: "${project.basedir}", kind: vscode.CompletionItemKind.Variable, detail: "${project.basedir}", doc: "Base directory." },
      { label: "${maven.home}", kind: vscode.CompletionItemKind.Variable, detail: "${maven.home}", doc: "Maven home." },
      { label: "${project.build.outputDirectory}", kind: vscode.CompletionItemKind.Variable, detail: "${project.build.outputDirectory}", doc: "Build output dir." },
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
 * Groovy Completion Provider
 */
class GroovyCompletionProvider {
  constructor() {
    this.completionItems = [];
    this.initialize();
  }

  initialize() {
    const completions = [
      // === CORE ===
      { label: "def", kind: vscode.CompletionItemKind.Keyword, detail: "def variable or method", doc: "Define variable/method." },
      { label: "class", kind: vscode.CompletionItemKind.Keyword, detail: "class ClassName", doc: "Define class." },
      { label: "interface", kind: vscode.CompletionItemKind.Keyword, detail: "interface InterfaceName", doc: "Define interface." },
      { label: "enum", kind: vscode.CompletionItemKind.Keyword, detail: "enum EnumName", doc: "Define enum." },
      { label: "trait", kind: vscode.CompletionItemKind.Keyword, detail: "trait TraitName", doc: "Define trait (composition)." },
      { label: "closure", kind: vscode.CompletionItemKind.Keyword, detail: "{ -> ... }", doc: "Define closure." },
      { label: "assert", kind: vscode.CompletionItemKind.Keyword, detail: "assert condition", doc: "Assertion." },

      // === STRINGS ===
      { label: "\"GString\"", kind: vscode.CompletionItemKind.Snippet, detail: "\"Hello ${name}\"", doc: "Interpolated string." },
      { label: "/regex/", kind: vscode.CompletionItemKind.Snippet, detail: "/pattern/", doc: "Regex pattern." },
      { label: "\"\"\"multiline\"\"\"", kind: vscode.CompletionItemKind.Snippet, detail: "\"\"\"text\"\"\"", doc: "Multiline string." },

      // === COLLECTIONS ===
      { label: "[1,2,3]", kind: vscode.CompletionItemKind.Snippet, detail: "[item, ...]", doc: "List literal." },
      { label: "[key: value]", kind: vscode.CompletionItemKind.Snippet, detail: "[k: v, ...]", doc: "Map literal." },
      { label: "(1..10)", kind: vscode.CompletionItemKind.Snippet, detail: "(start..end)", doc: "Range." },

      // === OPERATORS ===
      { label: "?.safe", kind: vscode.CompletionItemKind.Operator, detail: "object?.property", doc: "Safe navigation operator." },
      { label: "*.collect", kind: vscode.CompletionItemKind.Operator, detail: "list*.method()", doc: "Spread operator." },
      { label: "<< append", kind: vscode.CompletionItemKind.Operator, detail: "list << item", doc: "Append to list." },
      { label: "=~", kind: vscode.CompletionItemKind.Operator, detail: "string =~ /regex/", doc: "Regex match." },
      { label: "==~", kind: vscode.CompletionItemKind.Operator, detail: "string ==~ /regex/", doc: "Regex match exact." },

      // === METHODS ===
      { label: "each", kind: vscode.CompletionItemKind.Function, detail: "collection.each { ... }", doc: "Iterate collection." },
      { label: "map", kind: vscode.CompletionItemKind.Function, detail: "collection.map { ... }", doc: "Transform items." },
      { label: "filter", kind: vscode.CompletionItemKind.Function, detail: "collection.filter { ... }", doc: "Filter items." },
      { label: "find", kind: vscode.CompletionItemKind.Function, detail: "collection.find { ... }", doc: "Find first match." },
      { label: "findAll", kind: vscode.CompletionItemKind.Function, detail: "collection.findAll { ... }", doc: "Find all matches." },
      { label: "any", kind: vscode.CompletionItemKind.Function, detail: "collection.any { ... }", doc: "Check if any match." },
      { label: "all", kind: vscode.CompletionItemKind.Function, detail: "collection.all { ... }", doc: "Check if all match." },
      { label: "collect", kind: vscode.CompletionItemKind.Function, detail: "collection.collect { ... }", doc: "Transform collection." },
      { label: "sort", kind: vscode.CompletionItemKind.Function, detail: "collection.sort()", doc: "Sort collection." },
      { label: "reverse", kind: vscode.CompletionItemKind.Function, detail: "collection.reverse()", doc: "Reverse collection." },
      { label: "join", kind: vscode.CompletionItemKind.Function, detail: "list.join(sep)", doc: "Join list items." },
      { label: "split", kind: vscode.CompletionItemKind.Function, detail: "string.split(sep)", doc: "Split string." },
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
 * Jenkins/Groovy Declarative Pipeline Completion Provider
 */
class JenkinsCompletionProvider {
  constructor() {
    this.completionItems = [];
    this.initialize();
  }

  initialize() {
    const completions = [
      // === PIPELINE STRUCTURE ===
      { label: "pipeline", kind: vscode.CompletionItemKind.Keyword, detail: "pipeline { ... }", doc: "Declarative pipeline block.\n\n```groovy\npipeline {\n  agent any\n  stages {\n    stage('Build') { ... }\n  }\n}\n```" },
      { label: "agent", kind: vscode.CompletionItemKind.Keyword, detail: "agent any|none|label", doc: "Specify execution agent (any|none|label|node)." },
      { label: "stages", kind: vscode.CompletionItemKind.Keyword, detail: "stages { ... }", doc: "Collection of stages." },
      { label: "stage", kind: vscode.CompletionItemKind.Keyword, detail: "stage('Name') { ... }", doc: "Single pipeline stage." },
      { label: "steps", kind: vscode.CompletionItemKind.Keyword, detail: "steps { ... }", doc: "Steps within stage." },
      { label: "post", kind: vscode.CompletionItemKind.Keyword, detail: "post { ... }", doc: "Post-stage actions." },

      // === POST CONDITIONS ===
      { label: "always", kind: vscode.CompletionItemKind.Keyword, detail: "always { ... }", doc: "Always run." },
      { label: "success", kind: vscode.CompletionItemKind.Keyword, detail: "success { ... }", doc: "Run if stage succeeds." },
      { label: "failure", kind: vscode.CompletionItemKind.Keyword, detail: "failure { ... }", doc: "Run if stage fails." },
      { label: "unstable", kind: vscode.CompletionItemKind.Keyword, detail: "unstable { ... }", doc: "Run if unstable." },
      { label: "cleanup", kind: vscode.CompletionItemKind.Keyword, detail: "cleanup { ... }", doc: "Cleanup after post." },

      // === STEPS ===
      { label: "sh", kind: vscode.CompletionItemKind.Function, detail: "sh 'command'", doc: "Execute shell command." },
      { label: "bat", kind: vscode.CompletionItemKind.Function, detail: "bat 'command'", doc: "Execute batch command (Windows)." },
      { label: "echo", kind: vscode.CompletionItemKind.Function, detail: "echo 'message'", doc: "Print message." },
      { label: "error", kind: vscode.CompletionItemKind.Function, detail: "error 'message'", doc: "Throw error." },
      { label: "timeout", kind: vscode.CompletionItemKind.Function, detail: "timeout(time: 10, unit: 'MINUTES')", doc: "Set timeout." },
      { label: "retry", kind: vscode.CompletionItemKind.Function, detail: "retry(3) { ... }", doc: "Retry block." },
      { label: "junit", kind: vscode.CompletionItemKind.Function, detail: "junit 'test-results/**/*.xml'", doc: "Publish test results." },
      { label: "archive", kind: vscode.CompletionItemKind.Function, detail: "archive 'artifacts/**'", doc: "Archive artifacts." },
      { label: "publishHTML", kind: vscode.CompletionItemKind.Function, detail: "publishHTML(...)", doc: "Publish HTML report." },

      // === CREDENTIALS ===
      { label: "credentials", kind: vscode.CompletionItemKind.Keyword, detail: "credentials('id')", doc: "Reference credential." },
      { label: "withCredentials", kind: vscode.CompletionItemKind.Function, detail: "withCredentials([...]) { ... }", doc: "Use credentials." },
      { label: "usernamePassword", kind: vscode.CompletionItemKind.Function, detail: "usernamePassword(...)", doc: "Username/password credential." },
      { label: "file", kind: vscode.CompletionItemKind.Function, detail: "file(...)", doc: "File credential." },
      { label: "string", kind: vscode.CompletionItemKind.Function, detail: "string(...)", doc: "Secret text credential." },

      // === ENVIRONMENT ===
      { label: "environment", kind: vscode.CompletionItemKind.Keyword, detail: "environment { ... }", doc: "Environment variables." },
      { label: "BUILD_ID", kind: vscode.CompletionItemKind.Variable, detail: "${BUILD_ID}", doc: "Build ID." },
      { label: "BUILD_NUMBER", kind: vscode.CompletionItemKind.Variable, detail: "${BUILD_NUMBER}", doc: "Build number." },
      { label: "BUILD_URL", kind: vscode.CompletionItemKind.Variable, detail: "${BUILD_URL}", doc: "Build URL." },
      { label: "GIT_BRANCH", kind: vscode.CompletionItemKind.Variable, detail: "${GIT_BRANCH}", doc: "Git branch." },
      { label: "GIT_COMMIT", kind: vscode.CompletionItemKind.Variable, detail: "${GIT_COMMIT}", doc: "Git commit hash." },

      // === PARAMETERS ===
      { label: "parameters", kind: vscode.CompletionItemKind.Keyword, detail: "parameters { ... }", doc: "Build parameters." },
      { label: "string", kind: vscode.CompletionItemKind.Function, detail: "string(name: 'param', ...)", doc: "String parameter." },
      { label: "choice", kind: vscode.CompletionItemKind.Function, detail: "choice(name: 'param', choices: [...])", doc: "Choice parameter." },
      { label: "booleanParam", kind: vscode.CompletionItemKind.Function, detail: "booleanParam(...)", doc: "Boolean parameter." },

      // === SCM ===
      { label: "checkout", kind: vscode.CompletionItemKind.Function, detail: "checkout(...)", doc: "Checkout SCM." },
      { label: "scm", kind: vscode.CompletionItemKind.Function, detail: "scm", doc: "SCM configuration." },
      { label: "git", kind: vscode.CompletionItemKind.Function, detail: "git url: '...'", doc: "Git checkout." },
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

module.exports = { MavenCompletionProvider, GroovyCompletionProvider, JenkinsCompletionProvider };
