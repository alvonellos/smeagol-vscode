"use strict";

/**
 * GoCtl Generator - Go Code Generation from API Specs
 * 
 * Generates:
 * - API models from protobuf/OpenAPI
 * - gRPC service definitions
 * - Database models for Go
 * - Middleware templates
 */

class GoctlGenerator {
  constructor() {
    this.templates = {};
  }

  /**
   * Generate Go API model from OpenAPI schema
   * @param {string} modelName - Model name
   * @param {object[]} fields - Field definitions
   * @param {object} options - Generation options
   * @returns {string} Generated Go code
   */
  generateGoModel(modelName, fields, options = {}) {
    const {
      includeJSON = true,
      includeValidation = true,
      includeDBTags = true,
    } = options;

    let code = [
      `package models`,
      ``,
      `import (`,
      `    "time"`,
      `    "github.com/lib/pq"`,
      `)`,
      ``,
      `// ${modelName} represents a ${modelName} entity`,
      `type ${modelName} struct {`,
    ];

    // Generate fields with tags
    for (const field of fields) {
      const { name, type, omitempty = false, db_column, validation } = field;

      const goType = this._getGoType(type);
      const comments = [];

      if (validation) {
        comments.push(` // ${validation}`);
      }

      const tags = [];
      if (includeJSON) {
        const jsonName = this._toCamelCase(name);
        const omit = omitempty ? ",omitempty" : "";
        tags.push(`json:"${jsonName}${omit}"`);
      }

      if (includeDBTags) {
        const dbName = this._toSnakeCase(name);
        tags.push(`db:"${dbName}"`);
      }

      const tagStr = tags.length > 0 ? ` \`${tags.join(" ")}\`` : "";
      code.push(`    ${name} ${goType}${tagStr}${comments.join("")}`);
    }

    code.push(`}`);
    code.push(``);

    // Add methods
    code.push(`// TableName sets the table name for gorm`);
    code.push(`func (${modelName}) TableName() string {`);
    code.push(`    return "${this._toSnakeCase(modelName)}s"`);
    code.push(`}`);

    return code.join("\n");
  }

  /**
   * Generate gRPC service definition
   * @param {string} serviceName - Service name
   * @param {object[]} methods - Method definitions
   * @returns {string} Generated proto file content
   */
  generateGrpcService(serviceName, methods) {
    let proto = [
      `syntax = "proto3";`,
      ``,
      `package api;`,
      ``,
      `option go_package = "github.com/yourorg/yourproject/api";`,
      ``,
      `service ${serviceName} {`,
    ];

    // Generate RPC methods
    for (const method of methods) {
      const { name, inputType, outputType, isStream = false } = method;

      const input = isStream ? `stream ${inputType}` : inputType;
      proto.push(
        `    rpc ${name}(${input}) returns (${outputType}) {}`
      );
    }

    proto.push(`}`);

    return proto.join("\n");
  }

  /**
   * Generate Go gRPC client
   * @param {string} serviceName - Service name
   * @param {object[]} methods - RPC methods
   * @returns {string} Generated client code
   */
  generateGrpcClient(serviceName, methods) {
    let code = [
      `package client`,
      ``,
      `import (`,
      `    "context"`,
      `    "github.com/yourorg/yourproject/api"`,
      `    "google.golang.org/grpc"`,
      `)`,
      ``,
      `type ${serviceName}Client struct {`,
      `    conn *grpc.ClientConn`,
      `    client api.${serviceName}Client`,
      `}`,
      ``,
      `func New${serviceName}Client(addr string) (*${serviceName}Client, error) {`,
      `    conn, err := grpc.Dial(addr, grpc.WithInsecure())`,
      `    if err != nil {`,
      `        return nil, err`,
      `    }`,
      `    return &${serviceName}Client{`,
      `        conn: conn,`,
      `        client: api.New${serviceName}Client(conn),`,
      `    }, nil`,
      `}`,
      ``,
    ];

    // Generate client methods
    for (const method of methods) {
      const { name, inputType, outputType } = method;
      const methodName = this._capitalize(name);

      code.push(`func (c *${serviceName}Client) ${methodName}(ctx context.Context, req *api.${inputType}) (*api.${outputType}, error) {`);
      code.push(`    return c.client.${methodName}(ctx, req)`);
      code.push(`}`);
      code.push(``);
    }

    code.push(`func (c *${serviceName}Client) Close() error {`);
    code.push(`    return c.conn.Close()`);
    code.push(`}`);

    return code.join("\n");
  }

  /**
   * Generate Go API handler
   * @param {string} handlerName - Handler name
   * @param {object[]} endpoints - Endpoint definitions
   * @returns {string} Generated handler code
   */
  generateRestHandler(handlerName, endpoints) {
    let code = [
      `package handler`,
      ``,
      `import (`,
      `    "encoding/json"`,
      `    "net/http"`,
      `    "github.com/gorilla/mux"`,
      `)`,
      ``,
      `type ${handlerName} struct {`,
      `    // Add your dependencies here`,
      `}`,
      ``,
      `func New${handlerName}() *${handlerName} {`,
      `    return &${handlerName}{}`,
      `}`,
      ``,
      `func (h *${handlerName}) Register(r *mux.Router) {`,
    ];

    // Register endpoints
    for (const endpoint of endpoints) {
      const { method, path, handler } = endpoint;
      code.push(
        `    r.HandleFunc("${path}", h.${handler}).Methods("${method}")`
      );
    }

    code.push(`}`);
    code.push(``);

    // Generate handler methods
    for (const endpoint of endpoints) {
      const { handler, name } = endpoint;
      code.push(`// ${name} handles the request`);
      code.push(`func (h *${handlerName}) ${handler}(w http.ResponseWriter, r *http.Request) {`);
      code.push(`    w.Header().Set("Content-Type", "application/json")`);
      code.push(`    // TODO: Implement handler logic`);
      code.push(`    json.NewEncoder(w).Encode(map[string]string{"message": "TODO"})`);
      code.push(`}`);
      code.push(``);
    }

    return code.join("\n");
  }

  /**
   * Generate Go middleware template
   * @param {string} middlewareName - Middleware name
   * @param {string[]} features - Features (auth, logging, cors, etc.)
   * @returns {string} Generated middleware code
   */
  generateMiddleware(middlewareName, features = []) {
    let code = [
      `package middleware`,
      ``,
      `import (`,
      `    "fmt"`,
      `    "log"`,
      `    "net/http"`,
      `    "time"`,
      `)`,
      ``,
      `type ${middlewareName} struct {`,
      `    next http.Handler`,
      `}`,
      ``,
      `func New${middlewareName}(next http.Handler) *${middlewareName} {`,
      `    return &${middlewareName}{next: next}`,
      `}`,
      ``,
      `func (m *${middlewareName}) ServeHTTP(w http.ResponseWriter, r *http.Request) {`,
    ];

    if (features.includes("logging")) {
      code.push(`    start := time.Now()`);
      code.push(`    log.Printf("%s %s %s", r.Method, r.RequestURI, r.RemoteAddr)`);
    }

    if (features.includes("auth")) {
      code.push(`    token := r.Header.Get("Authorization")`);
      code.push(`    if token == "" {`);
      code.push(`        http.Error(w, "Unauthorized", http.StatusUnauthorized)`);
      code.push(`        return`);
      code.push(`    }`);
    }

    if (features.includes("cors")) {
      code.push(`    w.Header().Set("Access-Control-Allow-Origin", "*")`);
      code.push(`    w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")`);
    }

    code.push(`    m.next.ServeHTTP(w, r)`);

    if (features.includes("logging")) {
      code.push(`    log.Printf("Completed in %v", time.Since(start))`);
    }

    code.push(`}`);

    return code.join("\n");
  }

  /**
   * Generate database migration
   * @param {string} version - Version (e.g., "001")
   * @param {string} name - Migration name
   * @param {string} upSQL - SQL for up migration
   * @param {string} downSQL - SQL for down migration
   * @returns {object} Migration files
   */
  generateMigration(version, name, upSQL, downSQL) {
    const timestamp = new Date().toISOString().replace(/\D/g, "").substring(0, 14);
    const basename = `${timestamp}_${name}`;

    return {
      upFile: {
        name: `${basename}.up.sql`,
        content: upSQL,
      },
      downFile: {
        name: `${basename}.down.sql`,
        content: downSQL,
      },
    };
  }

  /**
   * Generate Go main.go template
   * @param {string} appName - Application name
   * @param {object} config - Configuration
   * @returns {string} Generated main.go
   */
  generateMainGo(appName, config = {}) {
    const { port = 8080, hasDB = false, hasGrpc = false } = config;

    let code = [
      `package main`,
      ``,
      `import (`,
      `    "fmt"`,
      `    "log"`,
      `    "net/http"`,
    ];

    if (hasDB) {
      code.push(`    "database/sql"`);
      code.push(`    _ "github.com/lib/pq"`);
    }

    if (hasGrpc) {
      code.push(`    "google.golang.org/grpc"`);
      code.push(`    "google.golang.org/grpc/reflection"`);
    }

    code.push(`)`);
    code.push(``);

    code.push(`func main() {`);
    code.push(`    log.Printf("Starting ${appName} on port ${port}")`);

    if (hasDB) {
      code.push(`    `);
      code.push(`    db, err := sql.Open("postgres", "user=postgres password=password dbname=${appName} sslmode=disable")`);
      code.push(`    if err != nil {`);
      code.push(`        log.Fatal(err)`);
      code.push(`    }`);
      code.push(`    defer db.Close()`);
    }

    code.push(`    `);
    code.push(`    http.HandleFunc("/health", healthHandler)`);
    code.push(`    log.Fatal(http.ListenAndServe(":${port}", nil))`);
    code.push(`}`);
    code.push(``);
    code.push(`func healthHandler(w http.ResponseWriter, r *http.Request) {`);
    code.push(`    w.Header().Set("Content-Type", "application/json")`);
    code.push(`    fmt.Fprintf(w, \`{"status":"ok"}\`)`);
    code.push(`}`);

    return code.join("\n");
  }

  // ========== Private Helper Methods ==========

  /**
   * Get Go type from generic type
   */
  _getGoType(type) {
    const mapping = {
      int: "int64",
      integer: "int64",
      string: "string",
      boolean: "bool",
      float: "float64",
      double: "float64",
      date: "time.Time",
      datetime: "time.Time",
      timestamp: "time.Time",
      json: "json.RawMessage",
      array: "[]interface{}",
      object: "map[string]interface{}",
      uuid: "string",
    };
    return mapping[type.toLowerCase()] || "interface{}";
  }

  /**
   * Convert to snake_case
   */
  _toSnakeCase(str) {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`).toLowerCase();
  }

  /**
   * Convert to camelCase
   */
  _toCamelCase(str) {
    return str.replace(/_([a-z])/g, (group) => group[1].toUpperCase());
  }

  /**
   * Capitalize first letter
   */
  _capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

module.exports = { GoctlGenerator };
