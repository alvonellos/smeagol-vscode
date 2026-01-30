# SQLite Database Schema - Technical Reference

**Version**: 1.0  
**Last Updated**: January 30, 2026  
**Database File**: `smeagol-tasks.db`  

---

## Overview

The Smeagol task management system uses SQLite 3 to persist tasks, session states, and audit history. This document provides detailed schema documentation for developers.

---

## Database Location

**Development**:
```
~/.vscode/extensions/alexa.smeagol-vscode-*/globalStorage/smeagol-tasks.db
```

**Format**: SQLite 3 binary database file  
**Size**: Typically < 1MB (can grow with many tasks)  
**Encoding**: UTF-8  

---

## Schema: tasks

### Purpose
Stores user-created tasks with metadata.

### SQL Definition

```sql
CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  description TEXT NOT NULL,
  status TEXT NOT NULL,
  priority TEXT DEFAULT 'normal',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME,
  notes TEXT
);
```

### Column Reference

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| `id` | TEXT | PRIMARY KEY | Unique task identifier (UUID v4) |
| `description` | TEXT | NOT NULL | Task description (1-500 chars) |
| `status` | TEXT | NOT NULL | Task state: 'pending', 'in-progress', 'completed' |
| `priority` | TEXT | DEFAULT 'normal' | Priority level: 'low', 'normal', 'high' |
| `created_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Creation timestamp (auto-set) |
| `updated_at` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Last update timestamp (auto-updated) |
| `completed_at` | DATETIME | NULL | Completion timestamp (set when status='completed') |
| `notes` | TEXT | NULL | Optional user notes (max 2000 chars) |

### Valid Values

**status**:
- `'pending'` - Not started
- `'in-progress'` - Currently working on
- `'completed'` - Finished

**priority**:
- `'low'` - Nice to have
- `'normal'` - Important (default)
- `'high'` - Critical/blocking

### Indexes

```sql
-- Recommended for performance
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);
```

### Query Examples

**Get all pending tasks**:
```sql
SELECT id, description, priority, created_at 
FROM tasks 
WHERE status = 'pending' 
ORDER BY priority DESC, created_at ASC;
```

**Get high-priority tasks**:
```sql
SELECT * FROM tasks 
WHERE priority = 'high' 
ORDER BY created_at DESC;
```

**Get tasks created in last 7 days**:
```sql
SELECT * FROM tasks 
WHERE created_at >= datetime('now', '-7 days')
ORDER BY created_at DESC;
```

**Get completion statistics**:
```sql
SELECT 
  COUNT(*) as total,
  SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
  SUM(CASE WHEN status = 'in-progress' THEN 1 ELSE 0 END) as in_progress,
  SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
FROM tasks;
```

---

## Schema: session_states

### Purpose
Tracks editor session state for restoration and activity analysis.

### SQL Definition

```sql
CREATE TABLE session_states (
  id TEXT PRIMARY KEY,
  file_path TEXT,
  position_line INTEGER,
  position_char INTEGER,
  scroll_offset INTEGER,
  last_accessed DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Column Reference

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| `id` | TEXT | PRIMARY KEY | Session identifier (UUID or fixed) |
| `file_path` | TEXT | NULL | Absolute path to edited file |
| `position_line` | INTEGER | NULL | Cursor line number (0-indexed) |
| `position_char` | INTEGER | NULL | Cursor character position (0-indexed) |
| `scroll_offset` | INTEGER | DEFAULT 0 | First visible line in editor |
| `last_accessed` | DATETIME | DEFAULT CURRENT_TIMESTAMP | Last access timestamp |

### Usage

**Save editor state**:
```sql
INSERT OR REPLACE INTO session_states 
  (id, file_path, position_line, position_char, scroll_offset)
VALUES 
  ('session-1', '/home/user/project/main.js', 42, 15, 30);
```

**Restore editor state**:
```sql
SELECT * FROM session_states WHERE id = 'session-1';
```

**Get most recently edited file**:
```sql
SELECT file_path, last_accessed 
FROM session_states 
ORDER BY last_accessed DESC 
LIMIT 1;
```

**Get time spent per file** (requires multiple snapshots):
```sql
SELECT 
  file_path,
  COUNT(*) as snapshots,
  MIN(last_accessed) as first_access,
  MAX(last_accessed) as last_access
FROM session_states
GROUP BY file_path
ORDER BY COUNT(*) DESC;
```

---

## Schema: task_history

### Purpose
Audit log for all task changes. Enables tracking history and compliance.

### SQL Definition

```sql
CREATE TABLE task_history (
  id TEXT PRIMARY KEY,
  task_id TEXT NOT NULL,
  action TEXT NOT NULL,
  prev_status TEXT,
  new_status TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (task_id) REFERENCES tasks(id)
);
```

### Column Reference

| Column | Type | Constraints | Description |
|--------|------|-----------|-------------|
| `id` | TEXT | PRIMARY KEY | History entry ID (unique) |
| `task_id` | TEXT | NOT NULL, FK | Reference to tasks(id) |
| `action` | TEXT | NOT NULL | Type of change: 'created', 'updated', 'deleted', 'status_changed' |
| `prev_status` | TEXT | NULL | Previous status (before change) |
| `new_status` | TEXT | NULL | New status (after change) |
| `timestamp` | DATETIME | DEFAULT CURRENT_TIMESTAMP | When change occurred |

### Valid Actions

| Action | Meaning | prev_status | new_status |
|--------|---------|-----------|-----------|
| `'created'` | Task created | NULL | initial status |
| `'updated'` | Task updated (fields changed) | NULL | NULL (check other tables for what changed) |
| `'status_changed'` | Status transitioned | old value | new value |
| `'deleted'` | Task deleted | - | - |
| `'priority_changed'` | Priority changed | NULL | NULL (track in separate column if needed) |

### Indexes

```sql
-- Recommended for performance
CREATE INDEX IF NOT EXISTS idx_history_task_id ON task_history(task_id);
CREATE INDEX IF NOT EXISTS idx_history_timestamp ON task_history(timestamp);
```

### Query Examples

**Get full history for a task**:
```sql
SELECT * FROM task_history 
WHERE task_id = '12345' 
ORDER BY timestamp ASC;
```

**Get tasks that were completed today**:
```sql
SELECT DISTINCT task_id 
FROM task_history 
WHERE action = 'status_changed' 
  AND new_status = 'completed'
  AND DATE(timestamp) = DATE('now');
```

**Get task created/updated/completed timeline**:
```sql
SELECT 
  task_id,
  action,
  new_status,
  timestamp
FROM task_history
WHERE task_id = '12345'
ORDER BY timestamp ASC;
```

**Find most frequently updated tasks**:
```sql
SELECT 
  task_id,
  COUNT(*) as change_count
FROM task_history
GROUP BY task_id
ORDER BY change_count DESC
LIMIT 10;
```

**Audit: Who/what made changes** (if user tracking added):
```sql
SELECT 
  timestamp,
  action,
  prev_status,
  new_status
FROM task_history
WHERE task_id = '12345'
ORDER BY timestamp DESC;
```

---

## Relationships

### Diagram

```
┌─────────────┐
│   tasks     │
├─────────────┤
│ id (PK)     │
│ description │
│ status      │
│ priority    │
│ created_at  │
│ updated_at  │
│ completed_at│
│ notes       │
└─────────────┘
      ↑
      │ (1:N)
      │
┌─────────────────┐
│ task_history    │
├─────────────────┤
│ id (PK)         │
│ task_id (FK)    │──→ tasks.id
│ action          │
│ prev_status     │
│ new_status      │
│ timestamp       │
└─────────────────┘

┌──────────────────┐
│ session_states   │
├──────────────────┤
│ id (PK)          │
│ file_path        │
│ position_line    │
│ position_char    │
│ scroll_offset    │
│ last_accessed    │
└──────────────────┘
```

### Foreign Keys

**task_history.task_id → tasks.id**
- Cascade delete: ON DELETE CASCADE (deleting task also removes history)
- No update: Should not update task IDs

---

## Data Types

### TEXT
- Used for: IDs, descriptions, status, file paths
- Max length: Practical ~1MB per column (SQLite)
- Encoding: UTF-8

### DATETIME
- Format: `'YYYY-MM-DD HH:MM:SS'` (ISO 8601)
- Timezone: Always UTC (recommended)
- Auto-fill: Use `CURRENT_TIMESTAMP`
- Query: Use `datetime()` function

### INTEGER
- Used for: Line numbers, character positions
- Range: -9,223,372,036,854,775,808 to 9,223,372,036,854,775,807
- Suitable for: Line/char positions (millions)

---

## Constraints

### Primary Keys

All tables use TEXT primary keys:
- `tasks.id` - UUID v4 format
- `session_states.id` - Fixed session ID or UUID
- `task_history.id` - Unique history entry ID

**Why TEXT?** Allows UUIDs without casting to BLOB.

### Foreign Keys

**task_history.task_id** references **tasks.id**
- Enforced: `FOREIGN KEY (task_id) REFERENCES tasks(id)`
- Cascade: ON DELETE CASCADE (recommended)
- Unique: Not enforced (multiple history entries per task)

### Check Constraints (Optional, Recommended)

```sql
-- Add validation constraints
ALTER TABLE tasks ADD CONSTRAINT check_status 
  CHECK (status IN ('pending', 'in-progress', 'completed'));

ALTER TABLE tasks ADD CONSTRAINT check_priority 
  CHECK (priority IN ('low', 'normal', 'high'));

ALTER TABLE task_history ADD CONSTRAINT check_action 
  CHECK (action IN ('created', 'updated', 'deleted', 'status_changed'));
```

---

## Performance Considerations

### Indexes to Create

For optimal query performance with large datasets:

```sql
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_priority ON tasks(priority);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
CREATE INDEX idx_tasks_updated_at ON tasks(updated_at DESC);
CREATE INDEX idx_history_task_id ON task_history(task_id);
CREATE INDEX idx_history_timestamp ON task_history(timestamp DESC);
```

### Expected Performance

| Operation | Dataset Size | Time |
|-----------|---------|------|
| Create task | N/A | ~5ms |
| Read single task | 10K tasks | ~1ms (indexed) |
| Read all by status | 10K tasks | ~10ms (indexed) |
| Get statistics | 10K tasks | ~20ms |
| Get task history | 10K history | ~5ms (indexed) |
| Delete task | N/A | ~2ms |

### Optimization Tips

1. **Index frequently queried columns**: status, priority, created_at
2. **Use LIMIT for large result sets**: `LIMIT 100` for pagination
3. **Archive old completed tasks**: Move to archive table when > 5K
4. **Vacuum database monthly**: `VACUUM;` to reclaim space
5. **Use transactions for batch ops**: Better performance than individual inserts

---

## Maintenance

### Database Size

**Typical**:
- Empty: 20 KB
- 100 tasks: 50 KB
- 1000 tasks: 200 KB
- 10000 tasks: 1.5 MB
- 100K tasks: 12 MB

**Limit**: SQLite can handle 140 TB theoretical, practically unlimited for this use case.

### Cleanup Operations

**Delete completed tasks older than 30 days**:
```sql
DELETE FROM tasks 
WHERE status = 'completed' 
  AND completed_at < datetime('now', '-30 days');

DELETE FROM task_history 
WHERE task_id NOT IN (SELECT id FROM tasks);
```

**Archive to separate DB**:
```sql
-- In archive database
INSERT INTO tasks_archive 
SELECT * FROM main.tasks 
WHERE status = 'completed' 
  AND completed_at < datetime('now', '-90 days');

-- Back in main database
DELETE FROM tasks 
WHERE id IN (SELECT id FROM tasks_archive);
```

**Reclaim space**:
```sql
VACUUM;
```

### Backup

**Manual backup**:
```bash
cp ~/.vscode/extensions/alexa.smeagol-vscode*/globalStorage/smeagol-tasks.db \
   ~/backup/smeagol-tasks-$(date +%Y%m%d).db
```

**Programmatic backup**:
```javascript
const fs = require('fs');
const dbPath = path.join(storagePath, 'smeagol-tasks.db');
const backupPath = path.join(backupDir, `smeagol-tasks-${Date.now()}.db`);
fs.copyFileSync(dbPath, backupPath);
```

---

## Integration Examples

### Node.js (Smeagol Extension)

```javascript
const sqlite3 = require('sqlite3').verbose();

// Open database
const db = new sqlite3.Database('smeagol-tasks.db', (err) => {
  if (err) console.error(err);
});

// Query tasks
db.all('SELECT * FROM tasks WHERE status = ?', ['pending'], (err, rows) => {
  if (err) console.error(err);
  console.log(rows);
});

// Insert task
db.run(
  'INSERT INTO tasks (id, description, status) VALUES (?, ?, ?)',
  [uuid(), 'New task', 'pending'],
  function(err) {
    if (err) console.error(err);
    console.log('Inserted:', this.lastID);
  }
);

// Close database
db.close();
```

### Python (External Tools)

```python
import sqlite3

conn = sqlite3.connect('smeagol-tasks.db')
cursor = conn.cursor()

# Query
cursor.execute('SELECT * FROM tasks WHERE status = ?', ('completed',))
tasks = cursor.fetchall()

# Update
cursor.execute('UPDATE tasks SET status = ? WHERE id = ?', 
               ('in-progress', 'task-123'))
conn.commit()

conn.close()
```

### CLI (Manual Inspection)

```bash
# Open database
sqlite3 smeagol-tasks.db

# Show schema
.schema

# List all tables
.tables

# Count tasks
SELECT COUNT(*) FROM tasks;

# Export to CSV
.mode csv
.output tasks.csv
SELECT * FROM tasks;
.quit

# Query from shell
sqlite3 smeagol-tasks.db "SELECT COUNT(*) FROM tasks;"
```

---

## Troubleshooting

### Database Locked Error

**Cause**: Multiple processes accessing database simultaneously  
**Solution**: 
1. Close all VS Code instances
2. Restart once
3. If persistent, check for hanging processes

### Corruption

**Signs**: Cannot open database, SQL errors  
**Recovery**:
```bash
# Attempt to repair
sqlite3 smeagol-tasks.db "PRAGMA integrity_check;"

# If failed, backup and delete
mv smeagol-tasks.db smeagol-tasks.db.corrupt
# Restart VS Code - new database created
```

### Performance Degradation

**Cause**: Large dataset without indexes  
**Solution**:
```sql
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_created_at ON tasks(created_at DESC);
VACUUM;
```

### Storage Full

**Check disk**: `df -h` (Linux/Mac) or `dir` (Windows)  
**Solution**: Delete archived/old tasks

---

## Advanced Queries

### Task Completion Rate

```sql
SELECT 
  DATE(created_at) as date,
  COUNT(*) as total_created,
  SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
  ROUND(100.0 * SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) / COUNT(*), 2) as completion_rate
FROM tasks
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### Average Time to Completion

```sql
SELECT 
  priority,
  AVG(JULIANDAY(completed_at) - JULIANDAY(created_at)) as avg_days_to_complete,
  MIN(JULIANDAY(completed_at) - JULIANDAY(created_at)) as min_days,
  MAX(JULIANDAY(completed_at) - JULIANDAY(created_at)) as max_days
FROM tasks
WHERE status = 'completed'
GROUP BY priority;
```

### Overdue Tasks (created > 30 days ago, still pending)

```sql
SELECT 
  description,
  priority,
  created_at,
  JULIANDAY('now') - JULIANDAY(created_at) as days_pending
FROM tasks
WHERE status = 'pending'
  AND JULIANDAY('now') - JULIANDAY(created_at) > 30
ORDER BY days_pending DESC;
```

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-01-30 | Initial schema |

---

**Document Version**: 1.0  
**Last Updated**: January 30, 2026  
**Status**: ✓ COMPLETE
