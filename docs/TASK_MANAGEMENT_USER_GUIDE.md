# Task Management System - User Guide

**Version**: 1.0  
**Last Updated**: January 30, 2026  
**Status**: Ready for Use  

---

## Quick Start (2 Minutes)

### 1. Access Task Panel

In VS Code sidebar, click **Smeagol Tasks** (📋 icon) in the Activity Bar.

### 2. Create Your First Task

Click **+ Create Task** and fill in:
- **Description**: What you want to do (required)
- **Priority**: low / normal / high
- **Notes**: Additional details (optional)

### 3. Manage Tasks

- **Toggle Status**: Click task to cycle status
  - pending → in-progress → completed → pending
- **Edit**: Right-click → Edit task details
- **Delete**: Right-click → Delete (confirmation required)
- **View Stats**: Click stats icon to see task summary

---

## Features Overview

### Task Panel (Tree View)

**Location**: Left sidebar → Smeagol Tasks (📋)

**Displays**:
- All tasks grouped by status
- Status icons: ○ (pending), ⟳ (in-progress), ✓ (completed)
- Priority badges: [low], [normal], [high]
- Task count: Total at top

**Example**:
```
📋 Smeagol Tasks
  ○ Fix parser bug [high]
  ⟳ Refactor completion system [normal]
  ✓ Update documentation [low]
```

### Create Task

**Command**: `Ctrl+Shift+P` → "Create Task"

**Dialog**:
1. Enter task description
2. Select priority (low/normal/high)
3. Optional: Add notes

**Example**:
```
Description: Review pull request #42
Priority: high
Notes: Check TypeScript migration completeness
```

### Update Status

**Method 1 - Click in Panel**:
1. Open Smeagol Tasks panel
2. Click task name
3. Status cycles automatically

**Cycle**: pending → in-progress → completed → pending

**Method 2 - Command Palette**:
1. `Ctrl+Shift+P` → "Toggle Task Status"
2. Select task from dropdown
3. Status updates

### Edit Task

**Method**:
1. Right-click task in panel
2. Click "Edit Task"
3. Update: description, priority, notes
4. Changes saved automatically

**Editable Fields**:
- Description
- Priority (low/normal/high)
- Notes (free text)

### Delete Task

**Warning**: Deletion is permanent (but history is preserved)

**Method**:
1. Right-click task in panel
2. Click "Delete Task"
3. Confirm deletion
4. Task removed from panel

### View Statistics

**Command**: `Ctrl+Shift+P` → "Show Task Statistics"

**Shows**:
- Total tasks: All tasks in database
- Pending: Not started
- In Progress: Currently working on
- Completed: Finished tasks

**Example Output**:
```
Task Statistics:
• Total: 15
• Pending: 8
• In Progress: 3
• Completed: 4
```

### Refresh Panel

**Method**:
- Automatic: Panel refreshes when task changes
- Manual: Click refresh icon in panel header
- Shortcut: `Ctrl+Shift+P` → "Refresh Tasks"

---

## Database & Storage

### Where Tasks Are Stored

**Location**: `~/.vscode/extensions/alexa.smeagol-vscode/globalStorage/smeagol-tasks.db`

**Database**:
- SQLite 3 database file
- Persistent across VS Code sessions
- Backed up with VS Code's sync feature

### Database Schema

**Three tables**:

#### Tasks Table
```
id              : Unique identifier
description     : Task text
status          : pending | in-progress | completed
priority        : low | normal | high
created_at      : Creation timestamp
updated_at      : Last modification
completed_at    : Completion timestamp (if completed)
notes           : Optional notes
```

#### Session States Table
```
id              : Session identifier
file_path       : Current editing file
position_line   : Cursor line number
position_char   : Cursor character position
scroll_offset   : Scroll position
last_accessed   : Last access time
```

#### Task History Table (Audit Log)
```
id              : History entry ID
task_id         : Associated task ID
action          : created | updated | completed
prev_status     : Previous status (for audits)
new_status      : New status
timestamp       : When change occurred
```

### Auto-Saved Data

**Session State** (auto-saved as you work):
- Current file you're editing
- Your cursor position
- Scroll location
- Timestamp

**Purpose**:
- Restore session on reload
- Track time per file
- Generate activity reports

### Backup & Restore

**Backup Strategy**:
1. Database stored in global storage (synced by VS Code)
2. Committed to version control if in workspace folder
3. Manual backup: Copy `.../globalStorage/smeagol-tasks.db`

**Restore**:
- Close VS Code
- Replace smeagol-tasks.db with backup
- Reopen VS Code

---

## Workflow Examples

### Example 1: Code Review Checklist

**Create tasks for each review item**:

```
1. Create: "Review API endpoints" [high]
   → Work on it (update to in-progress)
   → Complete (mark completed)

2. Create: "Check error handling" [normal]
   → Work on it
   → Complete

3. Create: "Verify tests pass" [high]
   → Complete
```

**Status**: View stats to see progress

### Example 2: Feature Development

```
Timeline:
9:00 AM - Create: "Design database schema" [high]
        - Update to in-progress
10:30 AM - Complete, create: "Implement models" [high]
         - Update to in-progress
12:00 PM - Complete, create: "Write unit tests" [normal]
         - In progress
1:00 PM - Create: "Documentation" [low]
2:00 PM - Complete all tasks
```

**View History**: Audit log shows all changes

### Example 3: Bug Tracking

```
Create: "Parser crashes on empty input" [high]
       - Notes: "GitHub issue #123"
       → in-progress
       → Fix implemented
       → Verify fix
       → completed

Create: "Memory leak in cache" [high]
       - Notes: "Reported by user, use valgrind"
       → pending (waiting for more info)
       → completed
```

---

## Tips & Best Practices

### ✓ DO

**Clear Descriptions**
- "Fix null pointer exception in parser" ✓
- "Fix NPE" ✗ (too vague)

**Set Appropriate Priority**
- Critical/blocking: high
- Important/planned: normal
- Nice-to-have: low

**Use Notes for Context**
- Link to GitHub issue: "#123"
- Reference related tasks
- Add hints for future self

**Regular Updates**
- Update status as you work
- Prevents stale task lists
- Helps track progress

### ✗ DON'T

**Avoid Duplicate Tasks**
- Use search before creating
- Consolidate related work

**Don't Leave Tasks Pending Too Long**
- Archive completed tasks
- Delete obsolete tasks
- Keep list actionable

**Avoid Generic Descriptions**
- "Fix stuff" ✗
- "Do work" ✗
- Be specific

---

## Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Create Task | `Ctrl+Shift+P` → "Create Task" |
| Show Stats | `Ctrl+Shift+P` → "Show Task Statistics" |
| Refresh | `Ctrl+Shift+P` → "Refresh Tasks" |
| Toggle Status | Click task in panel |

**Note**: Custom keybindings can be added in VS Code settings.

---

## Troubleshooting

### Problem: Tasks don't appear in panel

**Solution**:
1. Check: Smeagol Tasks view is visible (left sidebar)
2. Click refresh icon
3. Reload VS Code (`Ctrl+R`)
4. Check console: `View > Output > Smeagol`

### Problem: Task creation fails with error

**Solution**:
1. Check file permissions: `~/.vscode/extensions/alexa.smeagol-vscode/globalStorage/`
2. Ensure not in read-only mode
3. Restart VS Code
4. Check console for error details

### Problem: Database is corrupted

**Recovery**:
1. Close VS Code
2. Delete: `~/.vscode/extensions/alexa.smeagol-vscode/globalStorage/smeagol-tasks.db`
3. Restart VS Code (new database created)
4. Recreate tasks if needed

### Problem: Tasks disappear after restart

**Cause**: Database not initialized properly

**Solution**:
1. Fully restart VS Code (exit all windows)
2. Wait 5 seconds before reopen
3. Check internet: Ensure VS Code Sync isn't disabled
4. Check: `File > Preferences > Settings > Sync`

### Problem: Slow performance with 1000+ tasks

**Solution**:
1. Archive old/completed tasks
2. Delete obsolete tasks
3. Create filter/search feature (coming soon)

---

## FAQ

**Q: Can I export tasks to a file?**  
A: Currently no, but you can query the SQLite database directly:
```bash
sqlite3 ~/.vscode/extensions/alexa.smeagol-vscode/globalStorage/smeagol-tasks.db
> .mode csv
> .output tasks.csv
> SELECT * FROM tasks;
```

**Q: Do tasks sync across VS Code instances?**  
A: Yes! If you have VS Code Settings Sync enabled, tasks are synced.

**Q: Can I see task history?**  
A: Yes! Query the task_history table:
```bash
sqlite3 smeagol-tasks.db
> SELECT * FROM task_history WHERE task_id='<id>';
```

**Q: Is there a way to batch update tasks?**  
A: Not in UI yet, but can use SQL:
```sql
UPDATE tasks SET status='completed' WHERE priority='low';
```

**Q: Can I import tasks from elsewhere?**  
A: Not built-in, but you can insert into SQLite directly via CLI.

**Q: Are tasks local to machine?**  
A: Yes, stored in `globalStorage`. Synced only if Settings Sync enabled.

---

## Advanced Usage

### Querying the Database

**Direct SQL access**:

```bash
# List all pending tasks
sqlite3 smeagol-tasks.db
> SELECT description, priority FROM tasks WHERE status='pending';

# Get statistics
> SELECT status, COUNT(*) FROM tasks GROUP BY status;

# Export to CSV
> .mode csv
> .output tasks.csv
> SELECT * FROM tasks;
```

### Scripting Tasks

**Node.js example** (for extension development):

```javascript
const { TaskDatabase } = require("./task-database");

async function logTasks() {
  const db = new TaskDatabase("path/to/storage");
  await db.initialize();
  
  const stats = await db.getStatistics();
  console.log(stats);
  
  await db.close();
}

logTasks();
```

### Integration with CI/CD

**Example**: Create task when build fails:

```javascript
// In CI pipeline
if (buildFailed) {
  const taskDb = new TaskDatabase(storagePath);
  await taskDb.initialize();
  await taskDb.createTask(
    uuidv4(),
    `Fix failed build: ${buildErrorMessage}`,
    "pending",
    "high",
    `Build log: ${logUrl}`
  );
}
```

---

## Reporting Issues

If you encounter problems:

1. Check console output: `View > Output > Smeagol`
2. Enable debug logging in settings:
   ```json
   "smeagol.debug": true
   ```
3. Reproduce the issue
4. Report with:
   - Steps to reproduce
   - Error message from output panel
   - Your environment (OS, VS Code version)

---

## Keyboard Shortcuts Reference

### Creating & Editing

| Action | Shortcut |
|--------|----------|
| New Task | Palette: "Create Task" |
| Edit Task | Right-click in panel |
| Delete Task | Right-click in panel |

### Navigation

| Action | Shortcut |
|--------|----------|
| Toggle Status | Click task name |
| Refresh Panel | Click 🔄 in panel |
| Show Stats | Palette: "Show Statistics" |

### Panel

| Action | Shortcut |
|--------|----------|
| Focus Panel | Palette: "Focus Tasks" |
| Clear Search | Escape (if filtering) |

---

**Document Version**: 1.0  
**Last Updated**: January 30, 2026  
**Status**: ✓ COMPLETE
