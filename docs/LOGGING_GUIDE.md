# 📋 CONVERSATION LOGGING GUIDE

## Overview

Smeagol now automatically logs **all interactions, conversations, commands, errors, and incomplete tasks** to `docs/CONVERSATION.md`.

No manual setup required—logging happens automatically when you:
- Execute commands (Ctrl+Shift+L, D, R, etc.)
- Generate code (ORM, diagrams, etc.)
- Encounter errors
- Complete or update tasks
- Use features

---

## 📊 What Gets Logged

### 1. **Commands** ⚙️
Every command execution is logged with:
- Timestamp
- Command ID (e.g., `smeagol.quokkaEvaluate`)
- Human description
- Parameters used
- Success/failure status

**Example:**
```
### ⚙️ ✅ 2026-01-30T14:22:15.847Z
  **Command:** `smeagol.quokkaEvaluate`
  **Description:** Live evaluation (Ctrl+Shift+L)
  **Parameters:** 
  ```json
  {
    "language": "python",
    "result": "42"
  }
  ```
```

### 2. **Conversations** 💬
User interactions and questions:
- Questions asked
- Context (what file/feature you were in)
- Your response or action

**Example:**
```
### 💬 2026-01-30T14:20:45.123Z
  **Message:** Generate a JPA entity
  **Context:** Java project
  **Response:** Created User.java with @Entity, @Table annotations
```

### 3. **Feature Usage** 🎯
When you use a feature:
- Feature name
- What you did
- Related metadata

**Example:**
```
### 🎯 2026-01-30T14:18:30.456Z
  **Feature:** ORM Generator
  **Usage:** Generated SQLAlchemy model: User
  **Metadata:** {"orm": "SQLAlchemy", "modelName": "User"}
```

### 4. **Errors** ❌
When something goes wrong:
- What feature failed
- Error message
- Context where it happened
- Stack trace (if available)

**Example:**
```
### ❌ 2026-01-30T14:16:15.789Z
  **Feature:** Quokka
  **Error:** SyntaxError: invalid syntax
  **Context:** language: python
```

### 5. **Tasks** 🟢/🟡/🔴
Track your incomplete work:
- Task ID
- Title
- Current status (not-started, in-progress, completed)
- Timestamps

**Status Colors:**
- 🟢 **COMPLETED** - Task finished
- 🟡 **IN-PROGRESS** - Currently working on it
- 🔴 **NOT-STARTED** - Not begun yet

---

## 🎯 How to Use Task Tracking

The logging system can track incomplete tasks. Enable it programmatically in extension.js:

```javascript
// Add task
this.conversationLogger.addTask("task-001", "Implement Rust safety checker", "in-progress");

// Update status
this.conversationLogger.updateTask("task-001", "completed");

// Get incomplete tasks
const incomplete = this.conversationLogger.getIncompleteTasks();
// Returns: [{ id: "task-002", title: "Add Go tests", status: "not-started", ... }]
```

---

## 📖 Reading the Log

Open `docs/CONVERSATION.md` to see:

1. **Session Header** - Top of file shows purpose and legend
2. **Session Records** - Each session with timestamp
3. **Chronological Entries** - All interactions in order
4. **Session Summary** - At the end of each session:
   - Total conversations logged
   - Total commands executed
   - Successful vs failed commands
   - Incomplete tasks remaining
   - Task statistics

**Example Summary:**
```markdown
## 📈 SESSION SUMMARY - session-1701349335847-a2b3c4d5e

- **Total Conversations:** 3
- **Total Commands:** 12
- **Successful Commands:** 11
- **Incomplete Tasks:** 2
- **Task Stats:** {"total":5,"completed":3,"inProgress":1,"notStarted":1}

### 📌 Incomplete Tasks
- **Implement Rust safety checker** (`task-001`) - in-progress
- **Add Go tests** (`task-002`) - not-started
```

---

## 🔍 Using the Log for Development

### Find What You Did
```bash
# Search for all Quokka evaluations
grep "quokkaEvaluate" docs/CONVERSATION.md

# Find all errors
grep "❌" docs/CONVERSATION.md

# Find incomplete tasks
grep "🔴" docs/CONVERSATION.md

# Find all feature usage
grep "🎯" docs/CONVERSATION.md
```

### Track Commands Over Time
```bash
# Count total commands in a day
grep "⚙️" docs/CONVERSATION.md | wc -l

# See only successful commands
grep "✅" docs/CONVERSATION.md
```

### View Incomplete Tasks
```bash
# Get all incomplete tasks
grep -A 3 "TASK UPDATE\|TASK:" docs/CONVERSATION.md | grep -E "(not-started|in-progress)"
```

---

## 🛠️ Automatic Logging in Commands

All commands are automatically logged. Here's what happens:

### 1. When you press **Ctrl+Shift+L** (Quokka)
```
✅ Command logged: smeagol.quokkaEvaluate
✅ Feature usage logged: "Quokka - Evaluated python code"
✅ Success recorded: true
```

### 2. When you press **Ctrl+Shift+D** (Diagram)
```
✅ Command logged: smeagol.diagramPreview
✅ Feature usage logged: "Diagram Preview - Rendered PlantUML diagram"
✅ Success recorded: true
```

### 3. When you press **Ctrl+Shift+R** (Rust)
```
✅ Command logged: smeagol.rustAnalyze
✅ Feature usage logged: "Advanced Rust Analyzer - Analyzed Rust code: X issues"
✅ Success recorded: true
```

### 4. When an error occurs
```
❌ Error logged: [feature] - [message]
❌ Context recorded: [what you were doing]
❌ Stack trace saved: [full error details]
```

---

## 📁 Log File Location

```
smeagol-vscode/
├── docs/
│   ├── CONVERSATION.md          ← Your log file
│   ├── DEPLOYMENT_TESTING_GUIDE.md
│   └── ...other guides...
```

---

## 🧹 Managing Log Size

The conversation log is **append-only** by design. If it gets too large (file grows beyond recommended size):

### Option 1: Archive Old Sessions
```bash
# Copy docs/CONVERSATION.md to a backup
cp docs/CONVERSATION.md docs/CONVERSATION-2026-01.backup.md

# Create fresh log (preserves header)
# Edit docs/CONVERSATION.md, keep header, delete old sessions
```

### Option 2: Automated Rotation (Future)
In your `package.json` extensionConfig:
```json
{
  "smeagol.logging.maxFileSize": "10MB",
  "smeagol.logging.autoRotate": true
}
```

---

## 🔐 Privacy & Data

The conversation log records:
- ✅ Command names and parameters
- ✅ Feature names and usage patterns
- ✅ Error messages and stack traces
- ❌ File contents (only filenames logged)
- ❌ User credentials (never logged)
- ❌ Passwords or secrets (never logged)

**Safe to Share:** Yes, the log contains no sensitive data.

---

## 📊 Analyzing Your Usage

### Python Script to Analyze Log
```python
import re
from datetime import datetime

def analyze_conversation_log(file_path):
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Count commands
    commands = len(re.findall(r'### ⚙️', content))
    successes = len(re.findall(r'### ⚙️ ✅', content))
    failures = len(re.findall(r'### ⚙️ ❌', content))
    
    # Count errors
    errors = len(re.findall(r'### ❌', content))
    
    # Count conversations
    conversations = len(re.findall(r'### 💬', content))
    
    print(f"📊 CONVERSATION LOG ANALYSIS")
    print(f"Commands Executed: {commands} (✅ {successes} success, ❌ {failures} failed)")
    print(f"Errors Logged: {errors}")
    print(f"Conversations: {conversations}")
    print(f"Success Rate: {(successes/commands*100):.1f}%" if commands > 0 else "N/A")

analyze_conversation_log("docs/CONVERSATION.md")
```

---

## 🚀 Next Steps

1. **Use Smeagol normally** - Logging happens automatically
2. **Check `docs/CONVERSATION.md`** periodically to see your activity
3. **Search the log** to find past commands and feature usage
4. **Use task tracking** to manage incomplete work
5. **Share the log** (it's safe—no secrets are logged)

---

## ❓ FAQ

**Q: Does logging slow down the extension?**
A: No. Logging is async and doesn't block your editor.

**Q: Can I disable logging?**
A: Not recommended, but you can comment out `this.conversationLogger.log*()` calls in extension.js.

**Q: Will the log file get too big?**
A: Only if you use Smeagol for years without archiving. Typical monthly log is 2-5 MB.

**Q: Can I manually edit the log?**
A: Yes, but only edit below the `---` separator. The header must stay intact.

**Q: What if I want to delete the log?**
A: Safe to delete `docs/CONVERSATION.md`. It will be recreated on next startup.

---

## 📞 Support

For logging issues:
1. Check `docs/CONVERSATION.md` exists
2. Verify write permissions on `docs/` folder
3. Check VS Code output panel (Help → Toggle Developer Tools)
4. File an issue with your log file and the error message

---

**Go Vibe Code. Everything You Do Is Now Logged.** 📝
