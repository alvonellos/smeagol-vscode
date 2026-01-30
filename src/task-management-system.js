"use strict";

const vscode = require("vscode");
const { v4: uuidv4 } = require("uuid");
const { TaskDatabase } = require("./task-database");

/**
 * Task Management System - Manages user tasks with VS Code panel integration
 * Provides UI for viewing, creating, updating, and deleting tasks
 */
class TaskManagementSystem {
  constructor(context) {
    this.context = context;
    this.taskDb = null;
    this.taskPanel = null;
    this.taskProvider = null;
    this.currentSession = uuidv4();
  }

  /**
   * Initialize task management system
   * @returns {Promise<void>}
   */
  async initialize() {
    try {
      // Initialize database
      this.taskDb = new TaskDatabase(this.context.globalStorageUri.fsPath);
      await this.taskDb.initialize();

      // Create task tree provider
      this.taskProvider = new TaskTreeProvider(this.taskDb);
      const treeView = vscode.window.createTreeView("smeagolTasks", {
        treeDataProvider: this.taskProvider
      });

      this.context.subscriptions.push(treeView);

      // Register commands
      this._registerCommands();

      // Setup auto-save for session state
      this._setupSessionTracking();

      console.log("[Smeagol] Task Management System initialized");
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to initialize Task Management: ${error.message}`);
      console.error("[Smeagol] Task Management initialization error:", error);
    }
  }

  /**
   * Register VS Code commands for task management
   * @protected
   */
  _registerCommands() {
    const commands = [
      {
        id: "smeagol.tasks.create",
        callback: () => this.createTaskInteractive()
      },
      {
        id: "smeagol.tasks.toggleStatus",
        callback: (item) => this.toggleTaskStatus(item.taskId)
      },
      {
        id: "smeagol.tasks.edit",
        callback: (item) => this.editTaskInteractive(item.taskId)
      },
      {
        id: "smeagol.tasks.delete",
        callback: (item) => this.deleteTaskInteractive(item.taskId)
      },
      {
        id: "smeagol.tasks.refresh",
        callback: () => this.refreshTaskList()
      },
      {
        id: "smeagol.tasks.showStats",
        callback: () => this.showStatistics()
      }
    ];

    for (const cmd of commands) {
      this.context.subscriptions.push(
        vscode.commands.registerCommand(cmd.id, cmd.callback.bind(this))
      );
    }
  }

  /**
   * Create task interactively through VS Code UI
   * @returns {Promise<void>}
   */
  async createTaskInteractive() {
    try {
      // Get description
      const description = await vscode.window.showInputBox({
        prompt: "Enter task description",
        placeHolder: "e.g., Fix bug in parser, Review PR",
        validateInput: (value) => value.trim().length === 0 ? "Description cannot be empty" : null
      });

      if (!description) return;

      // Get priority
      const priority = await vscode.window.showQuickPick(
        ["low", "normal", "high"],
        { placeHolder: "Select priority", canPickMany: false }
      ) || "normal";

      // Create task
      const taskId = uuidv4();
      await this.taskDb.createTask(taskId, description, "pending", priority);

      vscode.window.showInformationMessage(`✓ Task created: ${description}`);
      this.refreshTaskList();
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to create task: ${error.message}`);
    }
  }

  /**
   * Toggle task status (pending → in-progress → completed → pending)
   * @param {string} taskId
   * @returns {Promise<void>}
   */
  async toggleTaskStatus(taskId) {
    try {
      const task = await this.taskDb.readTask(taskId);
      if (!task) {
        vscode.window.showErrorMessage("Task not found");
        return;
      }

      const statusCycle = { pending: "in-progress", "in-progress": "completed", completed: "pending" };
      const newStatus = statusCycle[task.status];

      await this.taskDb.updateTask(taskId, {
        status: newStatus,
        completed_at: newStatus === "completed" ? new Date().toISOString() : null
      });

      vscode.window.showInformationMessage(`✓ Task status: ${newStatus}`);
      this.refreshTaskList();
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to update task: ${error.message}`);
    }
  }

  /**
   * Edit task interactively
   * @param {string} taskId
   * @returns {Promise<void>}
   */
  async editTaskInteractive(taskId) {
    try {
      const task = await this.taskDb.readTask(taskId);
      if (!task) {
        vscode.window.showErrorMessage("Task not found");
        return;
      }

      // Edit description
      const newDescription = await vscode.window.showInputBox({
        prompt: "Edit task description",
        value: task.description,
        validateInput: (value) => value.trim().length === 0 ? "Description cannot be empty" : null
      });

      if (newDescription === undefined) return;

      // Edit priority
      const newPriority = await vscode.window.showQuickPick(
        ["low", "normal", "high"],
        { placeHolder: "Select priority", canPickMany: false }
      ) || task.priority;

      // Edit notes
      const newNotes = await vscode.window.showInputBox({
        prompt: "Edit task notes (optional)",
        value: task.notes || "",
      }) || "";

      await this.taskDb.updateTask(taskId, {
        description: newDescription,
        priority: newPriority,
        notes: newNotes
      });

      vscode.window.showInformationMessage("✓ Task updated");
      this.refreshTaskList();
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to edit task: ${error.message}`);
    }
  }

  /**
   * Delete task with confirmation
   * @param {string} taskId
   * @returns {Promise<void>}
   */
  async deleteTaskInteractive(taskId) {
    try {
      const task = await this.taskDb.readTask(taskId);
      if (!task) {
        vscode.window.showErrorMessage("Task not found");
        return;
      }

      const confirm = await vscode.window.showWarningMessage(
        `Delete task: "${task.description}"?`,
        { modal: true },
        "Delete"
      );

      if (confirm === "Delete") {
        await this.taskDb.deleteTask(taskId);
        vscode.window.showInformationMessage("✓ Task deleted");
        this.refreshTaskList();
      }
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to delete task: ${error.message}`);
    }
  }

  /**
   * Refresh task list in tree view
   * @public
   */
  refreshTaskList() {
    if (this.taskProvider) {
      this.taskProvider.refresh();
    }
  }

  /**
   * Show task statistics
   * @returns {Promise<void>}
   */
  async showStatistics() {
    try {
      const stats = await this.taskDb.getStatistics();
      const message = `Task Statistics:\n• Total: ${stats.total}\n• Pending: ${stats.pending}\n• In Progress: ${stats.inProgress}\n• Completed: ${stats.completed}`;
      vscode.window.showInformationMessage(message);
    } catch (error) {
      vscode.window.showErrorMessage(`Failed to get statistics: ${error.message}`);
    }
  }

  /**
   * Setup automatic session state tracking
   * @protected
   */
  _setupSessionTracking() {
    // Track active editor changes
    vscode.window.onDidChangeActiveTextEditor(async (editor) => {
      if (!editor) return;

      try {
        const filePath = editor.document.uri.fsPath;
        const line = editor.selection.active.line;
        const char = editor.selection.active.character;

        await this.taskDb.saveSessionState(
          this.currentSession,
          filePath,
          line,
          char,
          editor.visibleRanges[0]?.start.line || 0
        );
      } catch (error) {
        console.warn("[Smeagol] Failed to save session state:", error.message);
      }
    });
  }

  /**
   * Get task database instance
   * @returns {TaskDatabase}
   */
  getDatabase() {
    return this.taskDb;
  }

  /**
   * Dispose resources
   * @public
   */
  async dispose() {
    if (this.taskDb) {
      await this.taskDb.close();
    }
  }
}

/**
 * Tree Data Provider for task list display in VS Code
 */
class TaskTreeProvider {
  constructor(taskDb) {
    this.taskDb = taskDb;
    this._onDidChangeTreeData = new vscode.EventEmitter();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
    this.tasks = [];
  }

  /**
   * Get tree item for task
   * @param {Object} element
   * @returns {vscode.TreeItem}
   */
  getTreeItem(element) {
    const item = new vscode.TreeItem(element.label);

    item.description = element.description;
    item.tooltip = element.tooltip;
    item.collapsibleState = vscode.TreeItemCollapsibleState.None;
    item.iconPath = element.iconPath;
    item.contextValue = element.contextValue;

    return item;
  }

  /**
   * Get children for tree item
   * @param {Object} element
   * @returns {Promise<Array>}
   */
  async getChildren(element) {
    if (!element) {
      return this._getRootItems();
    }
    return [];
  }

  /**
   * Get root task items grouped by status
   * @protected
   * @returns {Promise<Array>}
   */
  async _getRootItems() {
    try {
      const allTasks = await this.taskDb.readAllTasks();

      const items = [];
      const statusGroups = {
        "pending": { icon: "$(circle-outline)", color: "#ffc107", tasks: [] },
        "in-progress": { icon: "$(sync~spin)", color: "#2196f3", tasks: [] },
        "completed": { icon: "$(check-circle)", color: "#4caf50", tasks: [] }
      };

      // Group tasks by status
      for (const task of allTasks) {
        if (statusGroups[task.status]) {
          statusGroups[task.status].tasks.push(task);
        }
      }

      // Create tree items
      for (const [status, group] of Object.entries(statusGroups)) {
        for (const task of group.tasks) {
          const item = new vscode.TreeItem(task.description);
          item.contextValue = "task";
          item.taskId = task.id;
          item.description = `[${task.priority}] ${task.status}`;
          item.tooltip = task.notes ? `Notes: ${task.notes}` : "No notes";
          item.iconPath = new vscode.ThemeIcon("circle-outline", new vscode.ThemeColor("editorInfo.foreground"));
          item.command = {
            title: "Toggle Task Status",
            command: "smeagol.tasks.toggleStatus",
            arguments: [item]
          };

          items.push(item);
        }
      }

      this.tasks = items;
      return items;
    } catch (error) {
      console.error("[Smeagol] Failed to get tree items:", error);
      return [];
    }
  }

  /**
   * Refresh tree view
   * @public
   */
  refresh() {
    this._onDidChangeTreeData.fire(undefined);
  }
}

module.exports = { TaskManagementSystem, TaskTreeProvider };
