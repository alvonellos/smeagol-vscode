"use strict";

const vscode = require("vscode");
const { CompletionCache } = require("./completion-cache");

/**
 * Spring Boot Completion Provider
 * IntelliJ-like completions for Spring Boot framework
 * Optimized with caching for high performance
 */
class SpringBootCompletionProvider {
  constructor() {
    this.completionItems = [];
    this.cache = new CompletionCache(500, 5 * 60 * 1000); // 500 items, 5min TTL
    this.initialize();
  }

  initialize() {
    const completions = [
      // === ANNOTATIONS ===
      { label: "@SpringBootApplication", kind: vscode.CompletionItemKind.Class, detail: "@SpringBootApplication", doc: "Main Spring Boot app annotation.\n\n```java\n@SpringBootApplication\npublic class Application {\n  public static void main(String[] args) {\n    SpringApplication.run(Application.class, args);\n  }\n}\n```" },
      { label: "@RestController", kind: vscode.CompletionItemKind.Class, detail: "@RestController", doc: "REST controller annotation (@Controller + @ResponseBody)." },
      { label: "@Controller", kind: vscode.CompletionItemKind.Class, detail: "@Controller", doc: "Web controller annotation." },
      { label: "@Service", kind: vscode.CompletionItemKind.Class, detail: "@Service", doc: "Service layer annotation." },
      { label: "@Repository", kind: vscode.CompletionItemKind.Class, detail: "@Repository", doc: "Data access layer annotation." },
      { label: "@Component", kind: vscode.CompletionItemKind.Class, detail: "@Component", doc: "Generic component annotation." },
      { label: "@Configuration", kind: vscode.CompletionItemKind.Class, detail: "@Configuration", doc: "Configuration class annotation." },
      { label: "@Bean", kind: vscode.CompletionItemKind.Class, detail: "@Bean", doc: "Declare bean in configuration class." },
      { label: "@Autowired", kind: vscode.CompletionItemKind.Class, detail: "@Autowired", doc: "Auto-wire dependency injection." },
      { label: "@Qualifier", kind: vscode.CompletionItemKind.Class, detail: "@Qualifier(\"beanName\")", doc: "Specify bean by name." },
      { label: "@Value", kind: vscode.CompletionItemKind.Class, detail: "@Value(\"${property.name}\")", doc: "Inject property value." },
      { label: "@RequestMapping", kind: vscode.CompletionItemKind.Class, detail: "@RequestMapping(\"/path\")", doc: "Map HTTP requests to handler." },
      { label: "@GetMapping", kind: vscode.CompletionItemKind.Class, detail: "@GetMapping(\"/path\")", doc: "Map GET requests." },
      { label: "@PostMapping", kind: vscode.CompletionItemKind.Class, detail: "@PostMapping(\"/path\")", doc: "Map POST requests." },
      { label: "@PutMapping", kind: vscode.CompletionItemKind.Class, detail: "@PutMapping(\"/path\")", doc: "Map PUT requests." },
      { label: "@DeleteMapping", kind: vscode.CompletionItemKind.Class, detail: "@DeleteMapping(\"/path\")", doc: "Map DELETE requests." },
      { label: "@PathVariable", kind: vscode.CompletionItemKind.Class, detail: "@PathVariable String id", doc: "Extract path variable." },
      { label: "@RequestParam", kind: vscode.CompletionItemKind.Class, detail: "@RequestParam String name", doc: "Extract query parameter." },
      { label: "@RequestBody", kind: vscode.CompletionItemKind.Class, detail: "@RequestBody MyDto dto", doc: "Bind request body to parameter." },
      { label: "@ResponseStatus", kind: vscode.CompletionItemKind.Class, detail: "@ResponseStatus(HttpStatus.CREATED)", doc: "Set response HTTP status." },
      { label: "@ExceptionHandler", kind: vscode.CompletionItemKind.Class, detail: "@ExceptionHandler(Exception.class)", doc: "Handle specific exceptions." },
      { label: "@Transactional", kind: vscode.CompletionItemKind.Class, detail: "@Transactional", doc: "Mark method as transactional." },
      { label: "@Entity", kind: vscode.CompletionItemKind.Class, detail: "@Entity", doc: "JPA entity annotation." },
      { label: "@Table", kind: vscode.CompletionItemKind.Class, detail: "@Table(name=\"table_name\")", doc: "Map entity to database table." },
      { label: "@Id", kind: vscode.CompletionItemKind.Class, detail: "@Id", doc: "Mark field as primary key." },
      { label: "@GeneratedValue", kind: vscode.CompletionItemKind.Class, detail: "@GeneratedValue(strategy = GenerationType.AUTO)", doc: "Auto-generate ID." },
      { label: "@Column", kind: vscode.CompletionItemKind.Class, detail: "@Column(name=\"col_name\")", doc: "Map field to database column." },
      { label: "@OneToMany", kind: vscode.CompletionItemKind.Class, detail: "@OneToMany(mappedBy=\"field\")", doc: "One-to-many relationship." },
      { label: "@ManyToOne", kind: vscode.CompletionItemKind.Class, detail: "@ManyToOne", doc: "Many-to-one relationship." },
      { label: "@ManyToMany", kind: vscode.CompletionItemKind.Class, detail: "@ManyToMany", doc: "Many-to-many relationship." },
      { label: "@JoinColumn", kind: vscode.CompletionItemKind.Class, detail: "@JoinColumn(name=\"fk_name\")", doc: "Specify join column." },
      { label: "@Conditional", kind: vscode.CompletionItemKind.Class, detail: "@Conditional(MyCondition.class)", doc: "Conditional bean creation." },
      { label: "@ConditionalOnClass", kind: vscode.CompletionItemKind.Class, detail: "@ConditionalOnClass(SomeClass.class)", doc: "Bean if class on classpath." },
      { label: "@ConditionalOnProperty", kind: vscode.CompletionItemKind.Class, detail: "@ConditionalOnProperty(name=\"prop\")", doc: "Bean if property exists." },

      // === CONFIGURATION PROPERTIES ===
      { label: "server.port", kind: vscode.CompletionItemKind.Variable, detail: "server.port=8080", doc: "Server port (default: 8080)." },
      { label: "server.servlet.context-path", kind: vscode.CompletionItemKind.Variable, detail: "server.servlet.context-path=/api", doc: "Context path prefix." },
      { label: "spring.application.name", kind: vscode.CompletionItemKind.Variable, detail: "spring.application.name=myapp", doc: "Application name." },
      { label: "spring.datasource.url", kind: vscode.CompletionItemKind.Variable, detail: "spring.datasource.url=jdbc:mysql://...", doc: "Database connection URL." },
      { label: "spring.datasource.username", kind: vscode.CompletionItemKind.Variable, detail: "spring.datasource.username=root", doc: "Database username." },
      { label: "spring.datasource.password", kind: vscode.CompletionItemKind.Variable, detail: "spring.datasource.password=pass", doc: "Database password." },
      { label: "spring.jpa.hibernate.ddl-auto", kind: vscode.CompletionItemKind.Variable, detail: "spring.jpa.hibernate.ddl-auto=update", doc: "Hibernate DDL mode: validate|update|create|create-drop." },
      { label: "spring.jpa.show-sql", kind: vscode.CompletionItemKind.Variable, detail: "spring.jpa.show-sql=true", doc: "Show generated SQL." },
      { label: "spring.jpa.properties.hibernate.format_sql", kind: vscode.CompletionItemKind.Variable, detail: "spring.jpa.properties.hibernate.format_sql=true", doc: "Format SQL output." },
      { label: "logging.level.root", kind: vscode.CompletionItemKind.Variable, detail: "logging.level.root=INFO", doc: "Root log level." },
      { label: "logging.level.org.springframework", kind: vscode.CompletionItemKind.Variable, detail: "logging.level.org.springframework=DEBUG", doc: "Spring log level." },
      { label: "spring.profiles.active", kind: vscode.CompletionItemKind.Variable, detail: "spring.profiles.active=dev", doc: "Active Spring profiles." },
      { label: "spring.cache.type", kind: vscode.CompletionItemKind.Variable, detail: "spring.cache.type=redis", doc: "Cache type (none|simple|redis)." },
      { label: "spring.redis.host", kind: vscode.CompletionItemKind.Variable, detail: "spring.redis.host=localhost", doc: "Redis server host." },
      { label: "spring.security.user.name", kind: vscode.CompletionItemKind.Variable, detail: "spring.security.user.name=admin", doc: "Default security username." },
      { label: "spring.security.user.password", kind: vscode.CompletionItemKind.Variable, detail: "spring.security.user.password=pass", doc: "Default security password." },

      // === STARTERS (DEPENDENCIES) ===
      { label: "spring-boot-starter-web", kind: vscode.CompletionItemKind.Module, detail: "Web MVC starter", doc: "Spring Web MVC + embedded Tomcat." },
      { label: "spring-boot-starter-data-jpa", kind: vscode.CompletionItemKind.Module, detail: "Data JPA starter", doc: "Spring Data JPA + Hibernate." },
      { label: "spring-boot-starter-security", kind: vscode.CompletionItemKind.Module, detail: "Security starter", doc: "Spring Security framework." },
      { label: "spring-boot-starter-data-redis", kind: vscode.CompletionItemKind.Module, detail: "Redis starter", doc: "Spring Data Redis." },
      { label: "spring-boot-starter-actuator", kind: vscode.CompletionItemKind.Module, detail: "Actuator starter", doc: "Production-ready endpoints." },
      { label: "spring-boot-starter-logging", kind: vscode.CompletionItemKind.Module, detail: "Logging starter", doc: "Logback + SLF4J." },
      { label: "spring-boot-starter-test", kind: vscode.CompletionItemKind.Module, detail: "Test starter", doc: "JUnit + Mockito + Spring Test." },
      { label: "spring-boot-starter-validation", kind: vscode.CompletionItemKind.Module, detail: "Validation starter", doc: "Bean Validation." },
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
    const docKey = `${document.uri.fsPath}:${position.line}:${position.character}`;
    const cached = this.cache.get(docKey);
    if (cached) {
      return cached;
    }
    this.cache.set(docKey, this.completionItems);
    return this.completionItems;
  }

  resolveCompletionItem(item, token) {
    return item;
  }

  getCacheStats() {
    return this.cache.getStats();
  }
}

/**
 * Kubernetes Completion Provider
 * YAML completions for Kubernetes manifests
 * Optimized with caching for high performance
 */
class KubernetesCompletionProvider {
  constructor() {
    this.completionItems = [];
    this.cache = new CompletionCache(500, 5 * 60 * 1000); // 500 items, 5min TTL
    this.initialize();
  }

  initialize() {
    const completions = [
      // === RESOURCE TYPES ===
      { label: "Pod", kind: vscode.CompletionItemKind.Class, detail: "kind: Pod", doc: "Basic deployable unit.\n\n```yaml\napiVersion: v1\nkind: Pod\nmetadata:\n  name: my-pod\nspec:\n  containers:\n  - name: app\n    image: myimage:latest\n```" },
      { label: "Deployment", kind: vscode.CompletionItemKind.Class, detail: "kind: Deployment", doc: "Declarative updates for Pods and ReplicaSets." },
      { label: "Service", kind: vscode.CompletionItemKind.Class, detail: "kind: Service", doc: "Expose pods as network service." },
      { label: "ConfigMap", kind: vscode.CompletionItemKind.Class, detail: "kind: ConfigMap", doc: "Store configuration data." },
      { label: "Secret", kind: vscode.CompletionItemKind.Class, detail: "kind: Secret", doc: "Store sensitive data." },
      { label: "StatefulSet", kind: vscode.CompletionItemKind.Class, detail: "kind: StatefulSet", doc: "Manage stateful applications." },
      { label: "DaemonSet", kind: vscode.CompletionItemKind.Class, detail: "kind: DaemonSet", doc: "Run pod on every node." },
      { label: "Job", kind: vscode.CompletionItemKind.Class, detail: "kind: Job", doc: "Run to completion." },
      { label: "CronJob", kind: vscode.CompletionItemKind.Class, detail: "kind: CronJob", doc: "Run job on schedule." },
      { label: "Ingress", kind: vscode.CompletionItemKind.Class, detail: "kind: Ingress", doc: "Manage HTTP/HTTPS ingress." },
      { label: "PersistentVolume", kind: vscode.CompletionItemKind.Class, detail: "kind: PersistentVolume", doc: "Cluster storage resource." },
      { label: "PersistentVolumeClaim", kind: vscode.CompletionItemKind.Class, detail: "kind: PersistentVolumeClaim", doc: "Request for storage." },
      { label: "Namespace", kind: vscode.CompletionItemKind.Class, detail: "kind: Namespace", doc: "Virtual cluster subdivision." },
      { label: "NetworkPolicy", kind: vscode.CompletionItemKind.Class, detail: "kind: NetworkPolicy", doc: "Pod network access rules." },
      { label: "RBAC", kind: vscode.CompletionItemKind.Class, detail: "Role, RoleBinding, ClusterRole, ClusterRoleBinding", doc: "Access control." },

      // === COMMON FIELDS ===
      { label: "apiVersion", kind: vscode.CompletionItemKind.Property, detail: "apiVersion: v1", doc: "API version (v1, apps/v1, batch/v1)." },
      { label: "kind", kind: vscode.CompletionItemKind.Property, detail: "kind: Pod", doc: "Resource type." },
      { label: "metadata", kind: vscode.CompletionItemKind.Property, detail: "metadata:", doc: "Object metadata (name, namespace, labels)." },
      { label: "spec", kind: vscode.CompletionItemKind.Property, detail: "spec:", doc: "Object specification." },
      { label: "status", kind: vscode.CompletionItemKind.Property, detail: "status:", doc: "Current object status (read-only)." },
      { label: "name", kind: vscode.CompletionItemKind.Property, detail: "name: resource-name", doc: "Resource name." },
      { label: "namespace", kind: vscode.CompletionItemKind.Property, detail: "namespace: default", doc: "Resource namespace." },
      { label: "labels", kind: vscode.CompletionItemKind.Property, detail: "labels:", doc: "Key-value labels for selection." },
      { label: "annotations", kind: vscode.CompletionItemKind.Property, detail: "annotations:", doc: "Key-value metadata." },

      // === POD SPEC ===
      { label: "containers", kind: vscode.CompletionItemKind.Property, detail: "containers:", doc: "List of containers." },
      { label: "image", kind: vscode.CompletionItemKind.Property, detail: "image: nginx:latest", doc: "Container image." },
      { label: "imagePullPolicy", kind: vscode.CompletionItemKind.Property, detail: "imagePullPolicy: IfNotPresent", doc: "Image pull policy (Always|Never|IfNotPresent)." },
      { label: "ports", kind: vscode.CompletionItemKind.Property, detail: "ports:", doc: "Container ports." },
      { label: "containerPort", kind: vscode.CompletionItemKind.Property, detail: "containerPort: 8080", doc: "Port number." },
      { label: "protocol", kind: vscode.CompletionItemKind.Property, detail: "protocol: TCP", doc: "Transport protocol." },
      { label: "env", kind: vscode.CompletionItemKind.Property, detail: "env:", doc: "Environment variables." },
      { label: "name", kind: vscode.CompletionItemKind.Property, detail: "name: VAR_NAME", doc: "Variable name." },
      { label: "value", kind: vscode.CompletionItemKind.Property, detail: "value: \"value\"", doc: "Variable value." },
      { label: "volumeMounts", kind: vscode.CompletionItemKind.Property, detail: "volumeMounts:", doc: "Mount volumes." },
      { label: "mountPath", kind: vscode.CompletionItemKind.Property, detail: "mountPath: /data", doc: "Mount path in container." },
      { label: "volumes", kind: vscode.CompletionItemKind.Property, detail: "volumes:", doc: "Pod-level volumes." },
      { label: "emptyDir", kind: vscode.CompletionItemKind.Property, detail: "emptyDir: {}", doc: "Temporary directory." },
      { label: "configMap", kind: vscode.CompletionItemKind.Property, detail: "configMap:", doc: "ConfigMap volume." },
      { label: "secret", kind: vscode.CompletionItemKind.Property, detail: "secret:", doc: "Secret volume." },
      { label: "persistentVolumeClaim", kind: vscode.CompletionItemKind.Property, detail: "persistentVolumeClaim:", doc: "PVC volume." },
      { label: "claimName", kind: vscode.CompletionItemKind.Property, detail: "claimName: my-pvc", doc: "PVC claim name." },

      // === DEPLOYMENT SPEC ===
      { label: "replicas", kind: vscode.CompletionItemKind.Property, detail: "replicas: 3", doc: "Number of pod replicas." },
      { label: "selector", kind: vscode.CompletionItemKind.Property, detail: "selector:", doc: "Label selector." },
      { label: "matchLabels", kind: vscode.CompletionItemKind.Property, detail: "matchLabels:", doc: "Labels to match." },
      { label: "strategy", kind: vscode.CompletionItemKind.Property, detail: "strategy:", doc: "Deployment strategy (RollingUpdate|Recreate)." },
      { label: "rollingUpdate", kind: vscode.CompletionItemKind.Property, detail: "rollingUpdate:", doc: "Rolling update config." },
      { label: "maxSurge", kind: vscode.CompletionItemKind.Property, detail: "maxSurge: 1", doc: "Max extra pods during update." },
      { label: "maxUnavailable", kind: vscode.CompletionItemKind.Property, detail: "maxUnavailable: 1", doc: "Max unavailable pods during update." },

      // === SERVICE SPEC ===
      { label: "type", kind: vscode.CompletionItemKind.Property, detail: "type: ClusterIP", doc: "Service type (ClusterIP|NodePort|LoadBalancer|ExternalName)." },
      { label: "selector", kind: vscode.CompletionItemKind.Property, detail: "selector:", doc: "Pod selector." },
      { label: "ports", kind: vscode.CompletionItemKind.Property, detail: "ports:", doc: "Service ports." },
      { label: "port", kind: vscode.CompletionItemKind.Property, detail: "port: 80", doc: "Service port." },
      { label: "targetPort", kind: vscode.CompletionItemKind.Property, detail: "targetPort: 8080", doc: "Target container port." },
      { label: "nodePort", kind: vscode.CompletionItemKind.Property, detail: "nodePort: 30000", doc: "Node port (NodePort type)." },

      // === INGRESS ===
      { label: "host", kind: vscode.CompletionItemKind.Property, detail: "host: example.com", doc: "Host domain." },
      { label: "paths", kind: vscode.CompletionItemKind.Property, detail: "paths:", doc: "URL paths." },
      { label: "path", kind: vscode.CompletionItemKind.Property, detail: "path: /", doc: "URL path." },
      { label: "pathType", kind: vscode.CompletionItemKind.Property, detail: "pathType: Prefix", doc: "Path type (Exact|Prefix|ImplementationSpecific)." },
      { label: "backend", kind: vscode.CompletionItemKind.Property, detail: "backend:", doc: "Backend service." },
      { label: "service", kind: vscode.CompletionItemKind.Property, detail: "service:", doc: "Service reference." },
      { label: "serviceName", kind: vscode.CompletionItemKind.Property, detail: "serviceName: my-service", doc: "Service name." },
      { label: "servicePort", kind: vscode.CompletionItemKind.Property, detail: "servicePort: 80", doc: "Service port." },

      // === COMMON PATTERNS ===
      { label: "apiVersion: v1", kind: vscode.CompletionItemKind.Snippet, detail: "apiVersion: v1", doc: "API version v1 (Pods, Services)." },
      { label: "apiVersion: apps/v1", kind: vscode.CompletionItemKind.Snippet, detail: "apiVersion: apps/v1", doc: "Apps API version (Deployments, StatefulSets)." },
      { label: "apiVersion: batch/v1", kind: vscode.CompletionItemKind.Snippet, detail: "apiVersion: batch/v1", doc: "Batch API version (Jobs)." },
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
    const docKey = `${document.uri.fsPath}:${position.line}:${position.character}`;
    const cached = this.cache.get(docKey);
    if (cached) {
      return cached;
    }
    this.cache.set(docKey, this.completionItems);
    return this.completionItems;
  }

  resolveCompletionItem(item, token) {
    return item;
  }

  getCacheStats() {
    return this.cache.getStats();
  }
}

module.exports = { SpringBootCompletionProvider, KubernetesCompletionProvider };
