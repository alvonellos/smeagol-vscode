"use strict";

const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

/**
 * Task Database Manager - SQLite local storage for tasks and session tracking
 * Provides CRUD operations for task management
 */
class TaskDatabase {
  constructor(storagePath) {
    this.dbPath = path.join(storagePath, "smeagol-tasks.db");
    this.db = null;
    this.initialized = false;
  }

  /**
   * Initialize database connection and schema
   * @returns {Promise<void>}
   */
  async initialize() {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database(this.dbPath, async (err) => {
        if (err) {
          reject(new Error(`Failed to open database: ${err.message}`));
          return;
        }

        try {
          await this._createSchema();
          this.initialized = true;
          resolve();
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  /**
   * Create database tables if they don't exist
   * @protected
   * @returns {Promise<void>}
   */
  async _createSchema() {
    return new Promise((resolve, reject) => {
      this.db.serialize(() => {
        // Tasks table
        this.db.run(
          `CREATE TABLE IF NOT EXISTS tasks (
            id TEXT PRIMARY KEY,
            description TEXT NOT NULL,
            status TEXT NOT NULL,
            priority TEXT DEFAULT 'normal',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            completed_at DATETIME,
            notes TEXT
          )`,
          (err) => {
            if (err) reject(new Error(`Failed to create tasks table: ${err.message}`));
          }
        );

        // Session states table
        this.db.run(
          `CREATE TABLE IF NOT EXISTS session_states (
            id TEXT PRIMARY KEY,
            file_path TEXT,
            position_line INTEGER,
            position_char INTEGER,
            scroll_offset INTEGER,
            last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP
          )`,
          (err) => {
            if (err) reject(new Error(`Failed to create session_states table: ${err.message}`));
          }
        );

        // Task history (audit log)
        this.db.run(
          `CREATE TABLE IF NOT EXISTS task_history (
            id TEXT PRIMARY KEY,
            task_id TEXT NOT NULL,
            action TEXT NOT NULL,
            prev_status TEXT,
            new_status TEXT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (task_id) REFERENCES tasks(id)
          )`,
          (err) => {
            if (err) reject(new Error(`Failed to create task_history table: ${err.message}`));
            else resolve();
          }
        );
      });
    });
  }

  /**
   * Create a new task
   * @param {string} id - Unique task ID
   * @param {string} description - Task description
   * @param {string} status - Task status (pending, in-progress, completed)
   * @param {string} priority - Priority level (low, normal, high)
   * @param {string} notes - Optional notes
   * @returns {Promise<Object>} Created task
   */
  async createTask(id, description, status = "pending", priority = "normal", notes = "") {
    if (!this.initialized) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const stmt = this.db.prepare(
        `INSERT INTO tasks (id, description, status, priority, notes)
         VALUES (?, ?, ?, ?, ?)`
      );

      stmt.run(id, description, status, priority, notes, function (err) {
        if (err) {
          reject(new Error(`Failed to create task: ${err.message}`));
          return;
        }

        // Log to history
        const historyId = `${id}-create-${Date.now()}`;
        this.db.run(
          `INSERT INTO task_history (id, task_id, action, new_status)
           VALUES (?, ?, ?, ?)`,
          [historyId, id, "created", status],
          (histErr) => {
            if (histErr) console.warn("Failed to log task creation:", histErr.message);
          }
        );

        resolve({
          id,
          description,
          status,
          priority,
          notes,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      });

      stmt.finalize();
    });
  }

  /**
   * Read a task by ID
   * @param {string} id - Task ID
   * @returns {Promise<Object>} Task object
   */
  async readTask(id) {
    if (!this.initialized) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      this.db.get(
        `SELECT * FROM tasks WHERE id = ?`,
        [id],
        (err, row) => {
          if (err) {
            reject(new Error(`Failed to read task: ${err.message}`));
          } else {
            resolve(row || null);
          }
        }
      );
    });
  }

  /**
   * Read all tasks with optional filtering
   * @param {string} status - Optional: filter by status
   * @param {string} priority - Optional: filter by priority
   * @returns {Promise<Array>} Array of task objects
   */
  async readAllTasks(status = null, priority = null) {
    if (!this.initialized) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      let query = "SELECT * FROM tasks WHERE 1=1";
      const params = [];

      if (status) {
        query += " AND status = ?";
        params.push(status);
      }

      if (priority) {
        query += " AND priority = ?";
        params.push(priority);
      }

      query += " ORDER BY created_at DESC";

      this.db.all(query, params, (err, rows) => {
        if (err) {
          reject(new Error(`Failed to read tasks: ${err.message}`));
        } else {
          resolve(rows || []);
        }
      });
    });
  }

  /**
   * Update a task
   * @param {string} id - Task ID
   * @param {Object} updates - Fields to update { status, priority, description, notes }
   * @returns {Promise<Object>} Updated task
   */
  async updateTask(id, updates) {
    if (!this.initialized) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      const allowedFields = ["status", "priority", "description", "notes"];
      const fields = [];
      const values = [];

      for (const [key, value] of Object.entries(updates)) {
        if (allowedFields.includes(key)) {
          fields.push(`${key} = ?`);
          values.push(value);
        }
      }

      if (fields.length === 0) {
        reject(new Error("No valid fields to update"));
        return;
      }

      fields.push("updated_at = CURRENT_TIMESTAMP");
      values.push(id);

      const query = `UPDATE tasks SET ${fields.join(", ")} WHERE id = ?`;

      this.db.run(query, values, function (err) {
        if (err) {
          reject(new Error(`Failed to update task: ${err.message}`));
          return;
        }

        // Log status change to history
        if (updates.status) {
          const historyId = `${id}-update-${Date.now()}`;
          this.db.run(
            `INSERT INTO task_history (id, task_id, action, new_status)
             VALUES (?, ?, ?, ?)`,
            [historyId, id, "updated", updates.status],
            (histErr) => {
              if (histErr) console.warn("Failed to log task update:", histErr.message);
            }
          );
        }

        resolve({ id, ...updates });
      });
    });
  }

  /**
   * Delete a task
   * @param {string} id - Task ID
   * @returns {Promise<boolean>} True if task was deleted
   */
  async deleteTask(id) {
    if (!this.initialized) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      this.db.run(
        `DELETE FROM tasks WHERE id = ?`,
        [id],
        function (err) {
          if (err) {
            reject(new Error(`Failed to delete task: ${err.message}`));
          } else {
            resolve(this.changes > 0);
          }
        }
      );
    });
  }

  /**
   * Save session state
   * @param {string} id - Session ID
   * @param {string} filePath - Current file path
   * @param {number} positionLine - Cursor line
   * @param {number} positionChar - Cursor character
   * @param {number} scrollOffset - Scroll position
   * @returns {Promise<void>}
   */
  async saveSessionState(id, filePath, positionLine, positionChar, scrollOffset = 0) {
    if (!this.initialized) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      this.db.run(
        `INSERT OR REPLACE INTO session_states 
         (id, file_path, position_line, position_char, scroll_offset)
         VALUES (?, ?, ?, ?, ?)`,
        [id, filePath, positionLine, positionChar, scrollOffset],
        (err) => {
          if (err) {
            reject(new Error(`Failed to save session state: ${err.message}`));
          } else {
            resolve();
          }
        }
      );
    });
  }

  /**
   * Get task history
   * @param {string} taskId - Task ID
   * @returns {Promise<Array>} Array of history entries
   */
  async getTaskHistory(taskId) {
    if (!this.initialized) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM task_history WHERE task_id = ? ORDER BY timestamp DESC`,
        [taskId],
        (err, rows) => {
          if (err) {
            reject(new Error(`Failed to read task history: ${err.message}`));
          } else {
            resolve(rows || []);
          }
        }
      );
    });
  }

  /**
   * Get database statistics
   * @returns {Promise<Object>} Stats { total, pending, inProgress, completed }
   */
  async getStatistics() {
    if (!this.initialized) throw new Error("Database not initialized");

    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT status, COUNT(*) as count FROM tasks GROUP BY status`,
        [],
        (err, rows) => {
          if (err) {
            reject(new Error(`Failed to get statistics: ${err.message}`));
            return;
          }

          const stats = {
            total: 0,
            pending: 0,
            inProgress: 0,
            completed: 0
          };

          for (const row of rows || []) {
            stats.total += row.count;
            if (row.status === "pending") stats.pending = row.count;
            if (row.status === "in-progress") stats.inProgress = row.count;
            if (row.status === "completed") stats.completed = row.count;
          }

          resolve(stats);
        }
      );
    });
  }

  /**
   * Close database connection
   * @returns {Promise<void>}
   */
  async close() {
    return new Promise((resolve, reject) => {
      if (this.db) {
        this.db.close((err) => {
          if (err) reject(new Error(`Failed to close database: ${err.message}`));
          else resolve();
        });
      } else {
        resolve();
      }
    });
  }
}

module.exports = { TaskDatabase };
