# ⚡ QUICK START - CONVERSATION LOGGING

## TL;DR - What You Need to Know

✅ **All your interactions are automatically logged to `docs/CONVERSATION.md`**

No setup needed. Just use Smeagol normally.

---

## 🎯 What Gets Logged

**Every time you:**
- Press Ctrl+Shift+L (Quokka evaluation) → Logged ✅
- Press Ctrl+Shift+D (Diagram preview) → Logged ✅
- Press Ctrl+Shift+R (Rust analysis) → Logged ✅
- Generate ORM code → Logged ✅
- Analyze Maven POM → Logged ✅
- Get an error → Logged with details ✅
- Complete/update a task → Logged ✅

---

## 👀 View Your Log

```bash
# Open in VS Code
code docs/CONVERSATION.md

# Or read it
cat docs/CONVERSATION.md

# Search in terminal
grep "quokkaEvaluate" docs/CONVERSATION.md
grep "❌" docs/CONVERSATION.md           # errors
grep "🎯" docs/CONVERSATION.md           # features
```

---

## 📊 See Your Activity

### Find All Commands You Ran
```bash
grep "### ⚙️" docs/CONVERSATION.md
```

### Check Success Rate
```bash
echo "Total: $(grep -c '### ⚙️' docs/CONVERSATION.md)"
echo "Success: $(grep -c '✅' docs/CONVERSATION.md)"
echo "Failed: $(grep -c '❌' docs/CONVERSATION.md)"
```

### Find Incomplete Tasks
```bash
grep "in-progress\|not-started" docs/CONVERSATION.md
```

### View Latest Session Summary
```bash
tail -30 docs/CONVERSATION.md
```

---

## 📝 Log Entry Examples

### Command Entry
```
### ⚙️ ✅ 2026-01-30T14:22:15.847Z
  **Command:** `smeagol.quokkaEvaluate`
  **Description:** Live evaluation (Ctrl+Shift+L)
  **Parameters:** {"language":"python","result":"42"}
```

### Error Entry
```
### ❌ 2026-01-30T14:16:15.789Z
  **Feature:** Quokka
  **Error:** SyntaxError: invalid syntax
  **Context:** language: python
```

### Session Summary
```
## 📈 SESSION SUMMARY - session-[ID]
- **Total Commands:** 12
- **Successful:** 11
- **Incomplete Tasks:** 2
```

---

## 🚀 Usage

1. **Use Smeagol** - Execute commands like normal
2. **Check log** - `code docs/CONVERSATION.md`
3. **Search** - Find specific commands or features
4. **Analyze** - Understand your usage patterns
5. **Track tasks** - See what's incomplete

---

## 📖 Full Docs

- **Complete Guide:** [docs/LOGGING_GUIDE.md](docs/LOGGING_GUIDE.md)
- **Search Tips:** [docs/CONVERSATION_ACCESS_GUIDE.md](docs/CONVERSATION_ACCESS_GUIDE.md)
- **Technical Details:** [docs/LOGGING_IMPLEMENTATION_SUMMARY.md](docs/LOGGING_IMPLEMENTATION_SUMMARY.md)

---

## 🎯 Common Commands

```bash
# See what features you used most
grep "**Feature:**" docs/CONVERSATION.md | sort | uniq -c | sort -rn

# Find all Quokka evaluations
grep "Quokka" docs/CONVERSATION.md

# Find all ORM generation
grep "ORM Generator" docs/CONVERSATION.md

# Count errors by feature
grep "**Feature:**" docs/CONVERSATION.md | sort | uniq -c

# See today's activity (Mac/Linux)
grep "2026-01-30" docs/CONVERSATION.md

# Find incomplete work
grep "🔴" docs/CONVERSATION.md
```

---

## 💡 Tips

- **Scroll to end** - Latest activity is at bottom
- **Use Ctrl+F** - Search within the file in VS Code
- **Plain text** - Use any text editor to view
- **Backup it** - Safe to share (no secrets logged)
- **Archive old sessions** - Keep only recent ones when file gets large

---

## ❓ FAQ

**Q: Does it slow down the editor?**
A: No. Logging is async and non-blocking.

**Q: Is my code logged?**
A: Only code metrics/results, not the full file contents.

**Q: Can I disable it?**
A: Not recommended, but you can comment out logging calls in extension.js.

**Q: What if the file gets too big?**
A: Archive old sessions or delete and restart fresh.

---

**Your activity is being logged. Go vibe code! 🎨**
