"use strict";

const fs = require("fs");
const path = require("path");

/**
 * ConversationLogger
 * Automatically logs all interactions, conversations, incomplete tasks, and feature usage
 * Writes to docs/CONVERSATION.md with timestamped entries
 */
class ConversationLogger {
  constructor(workspacePath) {
    this.workspacePath = workspacePath;
    this.logPath = path.join(workspacePath, "docs", "CONVERSATION.md");
    this.sessionId = this._generateSessionId();
    this.taskStates = new Map(); // Track task status: id -> { title, status, timestamp }
    this.conversationLog = [];
    this.pendingTasks = [];
    this.commandLog = [];

    this._initializeLog();
  }

  /**
   * Initialize log file with header if it doesn't exist
   * @private
   */
  _initializeLog() {
    try {
      if (!fs.existsSync(this.logPath)) {
        const header = this._createHeader();
        fs.writeFileSync(this.logPath, header, "utf-8");
      }
    } catch (error) {
      console.error(`Failed to initialize conversation log: ${error.message}`);
    }
  }

  /**
   * Generate session ID
   * @private
   */
  _generateSessionId() {
    return `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Create markdown header
   * @private
   */
  _createHeader() {
    return `# 🗣️ SMEAGOL CONVERSATION LOG

**Purpose:** Auto-logged interactions, commands, tasks, and feature usage

**Updated:** ${new Date().toISOString()}

---

## 📊 LEGEND
- 🟢 **COMPLETED** - Task finished successfully
- 🟡 **IN-PROGRESS** - Task being worked on
- 🔴 **INCOMPLETE** - Task not started or blocked
- 💬 **CONVERSATION** - User interaction or question
- ⚙️ **COMMAND** - Feature execution (Ctrl+Shift+L, etc.)
- ❌ **ERROR** - Exception or failure
- ✅ **SUCCESS** - Operation completed successfully

---

## 📋 SESSIONS

`;
  }

  /**
   * Log a conversation/interaction
   * @param {string} message - Message or question from user
   * @param {string} context - Optional context (file, feature, etc.)
   * @param {string} response - Optional response or action taken
   */
  logConversation(message, context = "", response = "") {
    const entry = {
      type: "conversation",
      timestamp: new Date().toISOString(),
      message,
      context,
      response,
    };

    this.conversationLog.push(entry);
    this._appendLog(this._formatConversation(entry));
  }

  /**
   * Log a command execution
   * @param {string} command - Command ID (e.g., "smeagol.quokkaEvaluate")
   * @param {string} description - Human-readable description
   * @param {Object} params - Optional command parameters
   * @param {boolean} success - Whether command succeeded
   */
  logCommand(command, description = "", params = {}, success = true) {
    const entry = {
      type: "command",
      timestamp: new Date().toISOString(),
      command,
      description: description || command,
      params,
      success,
    };

    this.commandLog.push(entry);
    this._appendLog(this._formatCommand(entry));
  }

  /**
   * Log an error
   * @param {string} feature - Feature where error occurred
   * @param {Error|string} error - Error object or message
   * @param {string} context - Optional context
   */
  logError(feature, error, context = "") {
    const entry = {
      type: "error",
      timestamp: new Date().toISOString(),
      feature,
      message: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : "",
      context,
    };

    this._appendLog(this._formatError(entry));
  }

  /**
   * Add a task to track
   * @param {string} id - Unique task ID
   * @param {string} title - Task title
   * @param {string} status - "not-started" | "in-progress" | "completed"
   */
  addTask(id, title, status = "not-started") {
    this.taskStates.set(id, {
      id,
      title,
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    if (status !== "completed") {
      this.pendingTasks.push(id);
    }

    this._appendLog(this._formatTaskAdd(id, title, status));
  }

  /**
   * Update task status
   * @param {string} id - Task ID
   * @param {string} status - New status
   */
  updateTask(id, status) {
    const task = this.taskStates.get(id);
    if (task) {
      task.status = status;
      task.updatedAt = new Date().toISOString();

      // Update pending tasks
      if (status === "completed") {
        this.pendingTasks = this.pendingTasks.filter((t) => t !== id);
      } else if (!this.pendingTasks.includes(id)) {
        this.pendingTasks.push(id);
      }

      this._appendLog(this._formatTaskUpdate(id, status));
    }
  }

  /**
   * Log a feature usage
   * @param {string} feature - Feature name
   * @param {string} description - What was done
   * @param {Object} metadata - Additional metadata
   */
  logFeatureUsage(feature, description, metadata = {}) {
    const entry = {
      type: "feature",
      timestamp: new Date().toISOString(),
      feature,
      description,
      metadata,
    };

    this._appendLog(this._formatFeatureUsage(entry));
  }

  /**
   * Get summary of incomplete tasks
   * @returns {Array} Array of incomplete task objects
   */
  getIncompleteTasks() {
    const incomplete = [];
    this.taskStates.forEach((task) => {
      if (task.status !== "completed") {
        incomplete.push(task);
      }
    });
    return incomplete;
  }

  /**
   * Generate a session summary
   * @returns {string} Markdown formatted summary
   */
  generateSessionSummary() {
    const summary = {
      sessionId: this.sessionId,
      startTime: new Date().toISOString(),
      totalConversations: this.conversationLog.length,
      totalCommands: this.commandLog.length,
      successfulCommands: this.commandLog.filter((c) => c.success).length,
      incompleteTasks: this.getIncompleteTasks(),
      taskStats: this._getTaskStats(),
    };

    return summary;
  }

  /**
   * Append a formatted log entry to the file
   * @private
   */
  _appendLog(formattedEntry) {
    try {
      fs.appendFileSync(this.logPath, formattedEntry + "\n", "utf-8");
    } catch (error) {
      console.warn(`Failed to write to conversation log: ${error.message}`);
    }
  }

  /**
   * Format conversation entry
   * @private
   */
  _formatConversation(entry) {
    const indent = "  ";
    let formatted = `\n### 💬 ${entry.timestamp}\n`;
    formatted += `${indent}**Message:** ${entry.message}\n`;
    if (entry.context) formatted += `${indent}**Context:** ${entry.context}\n`;
    if (entry.response)
      formatted += `${indent}**Response:** ${entry.response}\n`;
    return formatted;
  }

  /**
   * Format command entry
   * @private
   */
  _formatCommand(entry) {
    const icon = entry.success ? "✅" : "❌";
    const indent = "  ";
    let formatted = `\n### ⚙️ ${icon} ${entry.timestamp}\n`;
    formatted += `${indent}**Command:** \`${entry.command}\`\n`;
    formatted += `${indent}**Description:** ${entry.description}\n`;
    if (Object.keys(entry.params).length > 0) {
      formatted += `${indent}**Parameters:** \`\`\`json\n`;
      formatted += JSON.stringify(entry.params, null, 2)
        .split("\n")
        .map((line) => indent + line)
        .join("\n");
      formatted += `\n${indent}\`\`\`\n`;
    }
    return formatted;
  }

  /**
   * Format error entry
   * @private
   */
  _formatError(entry) {
    const indent = "  ";
    let formatted = `\n### ❌ ${entry.timestamp}\n`;
    formatted += `${indent}**Feature:** ${entry.feature}\n`;
    formatted += `${indent}**Error:** ${entry.message}\n`;
    if (entry.context) formatted += `${indent}**Context:** ${entry.context}\n`;
    if (entry.stack) {
      formatted += `${indent}**Stack:**\n`;
      formatted += `\`\`\`\n${entry.stack}\n\`\`\`\n`;
    }
    return formatted;
  }

  /**
   * Format task add entry
   * @private
   */
  _formatTaskAdd(id, title, status) {
    const statusIcon =
      status === "completed"
        ? "🟢"
        : status === "in-progress"
          ? "🟡"
          : "🔴";
    return `\n### ${statusIcon} TASK: ${title}\n  **ID:** \`${id}\`\n  **Status:** ${status}\n  **Created:** ${new Date().toISOString()}\n`;
  }

  /**
   * Format task update entry
   * @private
   */
  _formatTaskUpdate(id, status) {
    const statusIcon =
      status === "completed"
        ? "🟢"
        : status === "in-progress"
          ? "🟡"
          : "🔴";
    return `\n### ${statusIcon} TASK UPDATE: ${id}\n  **New Status:** ${status}\n  **Updated:** ${new Date().toISOString()}\n`;
  }

  /**
   * Format feature usage entry
   * @private
   */
  _formatFeatureUsage(entry) {
    const indent = "  ";
    let formatted = `\n### 🎯 ${entry.timestamp}\n`;
    formatted += `${indent}**Feature:** ${entry.feature}\n`;
    formatted += `${indent}**Usage:** ${entry.description}\n`;
    if (Object.keys(entry.metadata).length > 0) {
      formatted += `${indent}**Metadata:** ${JSON.stringify(entry.metadata)}\n`;
    }
    return formatted;
  }

  /**
   * Get task statistics
   * @private
   */
  _getTaskStats() {
    const stats = {
      total: this.taskStates.size,
      completed: 0,
      inProgress: 0,
      notStarted: 0,
    };

    this.taskStates.forEach((task) => {
      if (task.status === "completed") stats.completed++;
      else if (task.status === "in-progress") stats.inProgress++;
      else stats.notStarted++;
    });

    return stats;
  }

  /**
   * Cleanup and generate final summary
   */
  dispose() {
    const summary = this.generateSessionSummary();
    const summaryMarkdown = `
---

## 📈 SESSION SUMMARY - ${summary.sessionId}

- **Total Conversations:** ${summary.totalConversations}
- **Total Commands:** ${summary.totalCommands}
- **Successful Commands:** ${summary.successfulCommands}
- **Incomplete Tasks:** ${summary.incompleteTasks.length}
- **Task Stats:** ${JSON.stringify(summary.taskStats)}

### 📌 Incomplete Tasks
${
  summary.incompleteTasks.length > 0
    ? summary.incompleteTasks
        .map((t) => `- **${t.title}** (\`${t.id}\`) - ${t.status}`)
        .join("\n")
    : "All tasks completed! 🎉"
}

**Session Ended:** ${new Date().toISOString()}

`;

    this._appendLog(summaryMarkdown);
  }
}

module.exports = { ConversationLogger };
