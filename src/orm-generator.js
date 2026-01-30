"use strict";

/**
 * ORM Generator - Cross-platform Entity/Model Generation
 * 
 * Supports:
 * - JPA/Hibernate (Java)
 * - SQLAlchemy (Python)
 * - Diesel/SQLx (Rust)
 * - GORM (Go)
 */

const vscode = require("vscode");

class ORMGenerator {
  constructor() {
    this.templates = this._loadTemplates();
    this.diagnosticsCollection = vscode.languages.createDiagnosticCollection(
      "orm-generator"
    );
  }

  /**
   * Generate JPA/Hibernate entity from database schema or class definition
   * @param {string} className - Entity class name
   * @param {object[]} fields - Field definitions
   * @param {object} options - Generation options
   * @returns {string} Generated Java code
   */
  generateJPAEntity(className, fields, options = {}) {
    const {
      useRecords = false,
      generateLombok = true,
      includeValidation = true,
      tableName = this._toSnakeCase(className),
    } = options;

    let code = [];

    // Lombok annotations
    if (generateLombok) {
      code.push("@Data");
      code.push("@NoArgsConstructor");
      code.push("@AllArgsConstructor");
      code.push("@Builder");
    }

    // JPA annotations
    code.push(`@Entity`);
    code.push(`@Table(name = "${tableName}")`);

    // Class declaration
    if (useRecords) {
      code.push(`public record ${className}(`);
    } else {
      code.push(`public class ${className} {`);
    }

    // Generate fields
    for (const field of fields) {
      const { name, type, nullable = false, unique = false, indexed = false } = field;

      const annotations = [];
      annotations.push(`@Column(name = "${this._toSnakeCase(name)}"`);

      if (!nullable) {
        annotations.push(`, nullable = false`);
      }
      if (unique) {
        annotations.push(`, unique = true`);
      }
      if (indexed) {
        annotations.push(`, index = true`);
      }

      if (includeValidation && !nullable) {
        code.push(`    @NotNull`);
      }

      code.push(`    @Column${annotations.join("")})`);
      code.push(`    private ${this._javaType(type)} ${name};`);
      code.push("");
    }

    if (!useRecords) {
      code.push("}");
    }

    return code.join("\n");
  }

  /**
   * Generate Hibernate configuration
   * @param {object} config - Database configuration
   * @returns {string} hibernate.cfg.xml or persistence.xml
   */
  generateHibernateConfig(config) {
    const { dbUrl, dbUser, dbPassword, dialect = "org.hibernate.dialect.MySQL8Dialect" } =
      config;

    return `<?xml version="1.0" encoding="UTF-8"?>
<persistence xmlns="http://xmlns.jcp.org/xml/ns/persistence" version="2.2">
    <persistence-unit name="default">
        <class>your.package.entity.YourEntity</class>
        
        <properties>
            <property name="javax.persistence.jdbc.url" value="${dbUrl}"/>
            <property name="javax.persistence.jdbc.user" value="${dbUser}"/>
            <property name="javax.persistence.jdbc.password" value="${dbPassword}"/>
            <property name="javax.persistence.jdbc.driver" value="com.mysql.cj.jdbc.Driver"/>
            
            <property name="hibernate.dialect" value="${dialect}"/>
            <property name="hibernate.hbm2ddl.auto" value="update"/>
            <property name="hibernate.show_sql" value="true"/>
            <property name="hibernate.format_sql" value="true"/>
            <property name="hibernate.use_sql_comments" value="true"/>
            <property name="hibernate.jdbc.batch_size" value="20"/>
            <property name="hibernate.order_inserts" value="true"/>
            <property name="hibernate.order_updates" value="true"/>
        </properties>
    </persistence-unit>
</persistence>`;
  }

  /**
   * Generate SQLAlchemy model (Python)
   * @param {string} className - Model class name
   * @param {object[]} fields - Field definitions
   * @param {object} options - Generation options
   * @returns {string} Generated Python code
   */
  generateSQLAlchemyModel(className, fields, options = {}) {
    const {
      includeValidation = true,
      tableName = this._toSnakeCase(className),
    } = options;

    let code = [
      `from sqlalchemy import Column, String, Integer, DateTime, Boolean, Float`,
      `from sqlalchemy.ext.declarative import declarative_base`,
      `from datetime import datetime`,
      ``,
      `Base = declarative_base()`,
      ``,
      `class ${className}(Base):`,
      `    __tablename__ = '${tableName}'`,
      ``,
    ];

    // Generate fields
    for (const field of fields) {
      const { name, type, primary_key = false, nullable = false, default: defaultVal } =
        field;

      const columnArgs = [];
      const pyType = this._pythonSQLAlchemyType(type);

      if (primary_key) {
        columnArgs.push("primary_key=True");
      }
      if (!nullable && !primary_key) {
        columnArgs.push("nullable=False");
      }
      if (defaultVal) {
        columnArgs.push(`default=${JSON.stringify(defaultVal)}`);
      }

      const annotation = includeValidation ? ` # type: ${type}` : "";
      code.push(
        `    ${name} = Column(${pyType}(${columnArgs.join(", ")}))${annotation}`
      );
    }

    code.push(`    `);
    code.push(`    def __repr__(self):`);
    code.push(`        return f"<${className}(id={self.id})>"`);

    return code.join("\n");
  }

  /**
   * Generate Rust Diesel model
   * @param {string} structName - Struct name
   * @param {object[]} fields - Field definitions
   * @param {object} options - Options
   * @returns {string} Generated Rust code
   */
  generateDieselModel(structName, fields, options = {}) {
    const { tableName = this._toSnakeCase(structName) } = options;

    let code = [
      `use diesel::prelude::*;`,
      `use chrono::NaiveDateTime;`,
      ``,
      `#[derive(Queryable, Selectable, Insertable, AsChangeset)]`,
      `#[diesel(table_name = ${tableName})]`,
      `#[diesel(check_for_backend(diesel::mysql::Mysql))]`,
      `pub struct ${structName} {`,
    ];

    // Generate fields with Rust types
    for (const field of fields) {
      const { name, type, nullable = false } = field;
      const rustType = this._rustType(type, nullable);
      code.push(`    pub ${name}: ${rustType},`);
    }

    code.push(`}`);
    code.push(``);

    // Insertable struct
    code.push(`#[derive(Insertable)]`);
    code.push(`#[diesel(table_name = ${tableName})]`);
    code.push(`pub struct New${structName} {`);

    for (const field of fields) {
      if (!field.primary_key) {
        const { name, type, nullable = false } = field;
        const rustType = this._rustType(type, nullable);
        code.push(`    pub ${name}: ${rustType},`);
      }
    }

    code.push(`}`);

    return code.join("\n");
  }

  /**
   * Generate Go GORM model
   * @param {string} structName - Struct name
   * @param {object[]} fields - Field definitions
   * @returns {string} Generated Go code
   */
  generateGORMModel(structName, fields) {
    let code = [
      `package models`,
      ``,
      `import "gorm.io/gorm"`,
      ``,
      `type ${structName} struct {`,
    ];

    for (const field of fields) {
      const { name, type, db_column, primary_key = false, nullable = false } = field;

      const goType = this._goType(type);
      const tags = [];

      if (db_column) {
        tags.push(`gorm:"column:${db_column}"`);
      }
      if (primary_key) {
        tags.push(`gorm:"primaryKey"`);
      }
      if (!nullable) {
        tags.push(`gorm:"not null"`);
      }

      const tag = tags.length > 0 ? ` \`${tags.join(";\n")}\`` : "";
      code.push(`    ${name} ${goType}${tag}`);
    }

    code.push(`}`);
    code.push(``);

    // Table name method
    code.push(`func (${structName}) TableName() string {`);
    code.push(`    return "${this._toSnakeCase(structName)}"`);
    code.push(`}`);

    return code.join("\n");
  }

  /**
   * Generate migration file (Flyway/Liquibase format)
   * @param {string} migrationName - Migration name
   * @param {object[]} tables - Table definitions
   * @returns {string} SQL migration
   */
  generateMigration(migrationName, tables) {
    const timestamp = new Date().toISOString().replace(/\D/g, "").substring(0, 14);
    const fileName = `V${timestamp}__${migrationName}.sql`;

    let sql = ["-- Flyway migration generated by Smeagol", `-- File: ${fileName}`, ""];

    for (const table of tables) {
      const { name, fields, primaryKey } = table;

      sql.push(`CREATE TABLE ${name} (`);

      const fieldDefs = fields.map((field) => {
        const { name, type, nullable = true, autoincrement = false, default: def } = field;
        let definition = `    ${name} ${this._sqlType(type)}`;

        if (autoincrement) {
          definition += " AUTO_INCREMENT";
        }
        if (!nullable) {
          definition += " NOT NULL";
        }
        if (def) {
          definition += ` DEFAULT ${def}`;
        }

        return definition;
      });

      sql.push(fieldDefs.join(",\n"));

      if (primaryKey) {
        sql.push(`,    PRIMARY KEY (${primaryKey})`);
      }

      sql.push(`);`);
      sql.push("");
    }

    return {
      filename: fileName,
      content: sql.join("\n"),
    };
  }

  // ========== Private Type Mapping Methods ==========

  /**
   * Map generic types to Java types
   */
  _javaType(type) {
    const mapping = {
      int: "Integer",
      integer: "Integer",
      long: "Long",
      string: "String",
      text: "String",
      boolean: "Boolean",
      float: "Float",
      double: "Double",
      date: "LocalDate",
      datetime: "LocalDateTime",
      timestamp: "LocalDateTime",
      uuid: "UUID",
      json: "String",
    };
    return mapping[type.toLowerCase()] || "Object";
  }

  /**
   * Map types to Python SQLAlchemy types
   */
  _pythonSQLAlchemyType(type) {
    const mapping = {
      int: "Integer",
      integer: "Integer",
      long: "BigInteger",
      string: "String",
      text: "Text",
      boolean: "Boolean",
      float: "Float",
      double: "Float",
      date: "Date",
      datetime: "DateTime",
      timestamp: "DateTime",
      uuid: "CHAR(36)",
      json: "JSON",
    };
    return mapping[type.toLowerCase()] || "String";
  }

  /**
   * Map types to Rust types
   */
  _rustType(type, nullable = false) {
    const baseMapping = {
      int: "i32",
      integer: "i32",
      long: "i64",
      string: "String",
      text: "String",
      boolean: "bool",
      float: "f32",
      double: "f64",
      date: "NaiveDate",
      datetime: "NaiveDateTime",
      timestamp: "NaiveDateTime",
      uuid: "Uuid",
      json: "serde_json::Value",
    };

    const baseType = baseMapping[type.toLowerCase()] || "String";
    return nullable ? `Option<${baseType}>` : baseType;
  }

  /**
   * Map types to Go types
   */
  _goType(type) {
    const mapping = {
      int: "int",
      integer: "int",
      long: "int64",
      string: "string",
      text: "string",
      boolean: "bool",
      float: "float32",
      double: "float64",
      date: "time.Time",
      datetime: "time.Time",
      timestamp: "time.Time",
      uuid: "string",
      json: "datatypes.JSONType",
    };
    return mapping[type.toLowerCase()] || "interface{}";
  }

  /**
   * Map types to SQL types
   */
  _sqlType(type) {
    const mapping = {
      int: "INT",
      integer: "INT",
      long: "BIGINT",
      string: "VARCHAR(255)",
      text: "TEXT",
      boolean: "BOOLEAN",
      float: "FLOAT",
      double: "DOUBLE",
      date: "DATE",
      datetime: "DATETIME",
      timestamp: "TIMESTAMP DEFAULT CURRENT_TIMESTAMP",
      uuid: "CHAR(36)",
      json: "JSON",
    };
    return mapping[type.toLowerCase()] || "VARCHAR(255)";
  }

  /**
   * Convert camelCase to snake_case
   */
  _toSnakeCase(str) {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`).toLowerCase();
  }

  /**
   * Load built-in templates
   */
  _loadTemplates() {
    return {
      jpa: this.generateJPAEntity,
      sqlalchemy: this.generateSQLAlchemyModel,
      diesel: this.generateDieselModel,
      gorm: this.generateGORMModel,
    };
  }

  /**
   * Cleanup
   */
  dispose() {
    this.diagnosticsCollection.dispose();
  }
}

module.exports = { ORMGenerator };
