"use strict";

const vscode = require("vscode");
const { CompletionCache } = require("./completion-cache");

/**
 * YAML Completion Provider
 * Smart completions for YAML configuration files including:
 * - Docker Compose syntax
 * - Kubernetes resources
 * - GitHub Actions workflow
 * - Common configuration patterns
 * 
 * Optimized with caching for high performance
 */
class YamlCompletionProvider {
  constructor() {
    this.completionItems = [];
    this.cache = new CompletionCache(250, 5 * 60 * 1000); // 250 items, 5min TTL
    this.initialize();
  }

  /**
   * Initialize YAML completion items
   */
  initialize() {
    const completions = [
      // === DOCKER COMPOSE ===
      { label: "version:", kind: vscode.CompletionItemKind.Keyword, detail: "version: '3'", doc: "Docker Compose version" },
      { label: "services:", kind: vscode.CompletionItemKind.Keyword, detail: "services:", doc: "Define services" },
      { label: "image:", kind: vscode.CompletionItemKind.Property, detail: "image: name:tag", doc: "Container image" },
      { label: "container_name:", kind: vscode.CompletionItemKind.Property, detail: "container_name: name", doc: "Container name" },
      { label: "ports:", kind: vscode.CompletionItemKind.Property, detail: "ports: ['3000:3000']", doc: "Port mapping" },
      { label: "environment:", kind: vscode.CompletionItemKind.Property, detail: "environment:", doc: "Environment variables" },
      { label: "volumes:", kind: vscode.CompletionItemKind.Property, detail: "volumes:", doc: "Volume mounts" },
      { label: "networks:", kind: vscode.CompletionItemKind.Property, detail: "networks:", doc: "Network connections" },
      { label: "depends_on:", kind: vscode.CompletionItemKind.Property, detail: "depends_on:", doc: "Service dependencies" },
      { label: "build:", kind: vscode.CompletionItemKind.Property, detail: "build: ./Dockerfile", doc: "Build configuration" },
      { label: "command:", kind: vscode.CompletionItemKind.Property, detail: "command: command", doc: "Override command" },
      
      // === KUBERNETES ===
      { label: "apiVersion:", kind: vscode.CompletionItemKind.Property, detail: "apiVersion: v1", doc: "Kubernetes API version" },
      { label: "kind:", kind: vscode.CompletionItemKind.Property, detail: "kind: Pod", doc: "Resource kind" },
      { label: "metadata:", kind: vscode.CompletionItemKind.Keyword, detail: "metadata:", doc: "Resource metadata" },
      { label: "name:", kind: vscode.CompletionItemKind.Property, detail: "name: resource-name", doc: "Resource name" },
      { label: "namespace:", kind: vscode.CompletionItemKind.Property, detail: "namespace: default", doc: "Namespace" },
      { label: "labels:", kind: vscode.CompletionItemKind.Property, detail: "labels:", doc: "Kubernetes labels" },
      { label: "spec:", kind: vscode.CompletionItemKind.Keyword, detail: "spec:", doc: "Resource specification" },
      { label: "replicas:", kind: vscode.CompletionItemKind.Property, detail: "replicas: 3", doc: "Number of replicas" },
      { label: "selector:", kind: vscode.CompletionItemKind.Property, detail: "selector:", doc: "Pod selector" },
      { label: "template:", kind: vscode.CompletionItemKind.Property, detail: "template:", doc: "Pod template" },
      { label: "containers:", kind: vscode.CompletionItemKind.Property, detail: "containers:", doc: "Container list" },
      { label: "image:", kind: vscode.CompletionItemKind.Property, detail: "image: image:tag", doc: "Container image" },
      { label: "ports:", kind: vscode.CompletionItemKind.Property, detail: "ports:", doc: "Container ports" },
      { label: "env:", kind: vscode.CompletionItemKind.Property, detail: "env:", doc: "Environment variables" },
      { label: "resources:", kind: vscode.CompletionItemKind.Property, detail: "resources:", doc: "Resource limits" },
      { label: "requests:", kind: vscode.CompletionItemKind.Property, detail: "requests:", doc: "Resource requests" },
      { label: "limits:", kind: vscode.CompletionItemKind.Property, detail: "limits:", doc: "Resource limits" },
      { label: "cpu:", kind: vscode.CompletionItemKind.Property, detail: "cpu: 100m", doc: "CPU limit" },
      { label: "memory:", kind: vscode.CompletionItemKind.Property, detail: "memory: 128Mi", doc: "Memory limit" },
      
      // === GITHUB ACTIONS ===
      { label: "name:", kind: vscode.CompletionItemKind.Property, detail: "name: Workflow name", doc: "Workflow name" },
      { label: "on:", kind: vscode.CompletionItemKind.Keyword, detail: "on: [push, pull_request]", doc: "Trigger events" },
      { label: "push:", kind: vscode.CompletionItemKind.Property, detail: "push:", doc: "Push event trigger" },
      { label: "pull_request:", kind: vscode.CompletionItemKind.Property, detail: "pull_request:", doc: "PR event trigger" },
      { label: "jobs:", kind: vscode.CompletionItemKind.Keyword, detail: "jobs:", doc: "Job definitions" },
      { label: "runs-on:", kind: vscode.CompletionItemKind.Property, detail: "runs-on: ubuntu-latest", doc: "Runner platform" },
      { label: "steps:", kind: vscode.CompletionItemKind.Property, detail: "steps:", doc: "Job steps" },
      { label: "uses:", kind: vscode.CompletionItemKind.Property, detail: "uses: actions/checkout@v2", doc: "Action to use" },
      { label: "run:", kind: vscode.CompletionItemKind.Property, detail: "run: command", doc: "Run command" },
      { label: "with:", kind: vscode.CompletionItemKind.Property, detail: "with:", doc: "Action parameters" },
      
      // === COMMON YAML ===
      { label: "# Comment", kind: vscode.CompletionItemKind.Comment, detail: "# comment", doc: "YAML comment" },
      { label: "---", kind: vscode.CompletionItemKind.Snippet, detail: "---", doc: "Document separator" },
      { label: "null", kind: vscode.CompletionItemKind.Constant, detail: "null", doc: "Null value" },
      { label: "true", kind: vscode.CompletionItemKind.Constant, detail: "true", doc: "Boolean true" },
      { label: "false", kind: vscode.CompletionItemKind.Constant, detail: "false", doc: "Boolean false" },
      
      // === COMMON VALUES ===
      { label: "'string value'", kind: vscode.CompletionItemKind.Value, detail: "'value'", doc: "Single-quoted string" },
      { label: '"string value"', kind: vscode.CompletionItemKind.Value, detail: '"value"', doc: "Double-quoted string" },
      { label: "- item1", kind: vscode.CompletionItemKind.Snippet, detail: "- item", doc: "List item" },
      { label: "key: value", kind: vscode.CompletionItemKind.Snippet, detail: "key: value", doc: "Key-value pair" },
      { label: "${var}", kind: vscode.CompletionItemKind.Variable, detail: "${VARIABLE}", doc: "Variable reference" },
      { label: "${{", kind: vscode.CompletionItemKind.Variable, detail: "${{ github.event }}", doc: "GitHub Actions context" },
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

  /**
   * Provide completion items for YAML
   * @param {vscode.TextDocument} document - Current document
   * @param {vscode.Position} position - Cursor position
   * @param {vscode.CancellationToken} token - Cancellation token
   * @returns {vscode.CompletionItem[]} Completion items
   */
  provideCompletionItems(document, position, token) {
    try {
      // Check cache first
      const cacheKey = `yaml-${document.uri.toString()}-${position.line}`;
      const cached = this.cache.get(cacheKey);
      if (cached) {
        return cached;
      }

      // Detect file context from filename
      const filename = document.fileName.toLowerCase();
      let filtered = this.completionItems;
      
      // Docker Compose files
      if (filename.includes("docker-compose")) {
        filtered = this.completionItems.filter(item => 
          item.label.includes("services") || 
          item.label.includes("image") ||
          item.label.includes("ports") ||
          item.label.includes("environment") ||
          item.label.includes("volumes") ||
          item.label.includes("networks") ||
          item.label.includes("depends") ||
          item.label.includes("build") ||
          item.label.includes("command") ||
          item.label.includes("version") ||
          item.label === "---" ||
          item.label === "# Comment"
        );
      }
      
      // Kubernetes manifests
      if (filename.includes("k8s") || document.getText().includes("apiVersion")) {
        filtered = this.completionItems.filter(item => 
          item.label.includes("apiVersion") ||
          item.label.includes("kind") ||
          item.label.includes("metadata") ||
          item.label.includes("spec") ||
          item.label.includes("containers") ||
          item.label.includes("replicas") ||
          item.label.includes("selector") ||
          item.label === "---" ||
          item.label === "# Comment"
        );
      }
      
      // GitHub Actions
      if (filename.includes(".github/workflows")) {
        filtered = this.completionItems.filter(item => 
          item.label.includes("name") ||
          item.label.includes("on:") ||
          item.label.includes("push") ||
          item.label.includes("pull_request") ||
          item.label.includes("jobs") ||
          item.label.includes("runs-on") ||
          item.label.includes("steps") ||
          item.label.includes("uses") ||
          item.label.includes("run") ||
          item.label.includes("with") ||
          item.label === "# Comment"
        );
      }
      
      // Cache and return
      this.cache.set(cacheKey, filtered);
      return filtered;
    } catch (error) {
      console.warn(`Error in YAML completion provider: ${error.message}`);
      return this.completionItems; // Fallback
    }
  }

  /**
   * Resolve completion item with additional info
   * @param {vscode.CompletionItem} item - Item to resolve
   * @returns {vscode.CompletionItem} Resolved item
   */
  resolveCompletionItem(item) {
    return item;
  }
}

module.exports = { YamlCompletionProvider };
