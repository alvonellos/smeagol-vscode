# Temporary Files Convention

## 🎯 Quick Rule

**All temporary, draft, or work-in-progress markdown files MUST use the `tmp.md` suffix pattern.**

```
tmp.{purpose}.md
```

---

## 📋 Pattern Examples

| Use Case | File Name | Location | Status |
|----------|-----------|----------|--------|
| Analysis in progress | `tmp.analysis.md` | Root or `docs/` | DELETE before commit |
| Draft report | `tmp.report.md` | `docs/` | DELETE or rename |
| Session notes | `tmp.notes.md` | Root | DELETE before commit |
| Feature planning | `tmp.feature-plan.md` | `docs/` | Finalize or delete |
| Investigation | `tmp.bug-investigation.md` | Root | DELETE when resolved |
| Refactoring notes | `tmp.refactor-analysis.md` | Root | Convert to guide or delete |

---

## ✅ DO

```
✅ Create temp files with tmp. prefix
✅ Use clear purpose in name: tmp.analysis.md
✅ Delete or rename before committing
✅ Use docs/tmp.* for documentation work-in-progress
✅ Keep tmp.* files in .gitignore
```

**Example Workflow:**
```
1. Create: tmp.new-feature-analysis.md (work in progress)
2. Work: Add notes, plans, research
3. Decide:
   - Finalize → Rename to docs/NEW_FEATURE_ANALYSIS.md
   - Not needed → Delete the file
4. Commit: Only permanent files, no tmp.* files
```

---

## ❌ DON'T

```
❌ Commit temporary files to repo
❌ Name files ambiguously: tmp.md or draft.md
❌ Leave tmp.* files hanging after session
❌ Mix permanent and temporary content in same file
❌ Push tmp.* files to remote branches
```

**Bad Examples:**
```
❌ tmp.md                    (too vague)
❌ docs/draft.md             (wrong prefix)
❌ ANALYSIS_TEMP.md          (missing convention)
❌ tmp.final-report.md       (tmp. = not final!)
```

---

## 🔄 File Lifecycle

### For Deliverable Content

```
tmp.guide.md
    ↓ (develop content)
    ↓ (review & finalize)
    ↓
docs/GUIDE.md  (rename, remove tmp.)
    ↓ (commit & push)
    ↓
Permanent file in repo
```

### For Non-Deliverable Content

```
tmp.analysis.md
    ↓ (work, take notes)
    ↓ (extract insights if needed)
    ↓
Delete or Archive  (don't commit)
```

---

## 📂 File Organization

```
smeagol-vscode/
│
├── tmp.session-notes.md           ← Root temporary files
├── tmp.refactor-plan.md
├── tmp.investigation.md
│
├── docs/
│   ├── tmp.new-guide.md           ← Docs in progress
│   ├── tmp.feature-plan.md
│   ├── GUIDE.md                   ← Permanent docs
│   ├── FEATURE.md
│   └── archive/                   ← Completed work
│
└── .gitignore                    ← Ignores tmp*.md
```

---

## 🚀 Git Integration

### Prevent Accidents

The `.gitignore` file includes:
```
tmp*.md
docs/tmp*.md
```

This automatically prevents committing temporary files.

### Check Before Committing

```bash
# See what would be committed
git status

# If you see tmp.* files, they'll be ignored:
# (nothing to commit if only tmp files changed)

# Clean up before committing
rm tmp*.md
```

---

## 💡 Use Cases

### Development Notes
```
tmp.development.md
- Implementation notes
- Code snippets under review
- Design decisions being considered
→ DELETE or archive when done
```

### Investigation/Debugging
```
tmp.bug-investigation.md
- Steps to reproduce
- Stack traces
- Test findings
→ DELETE when bug is resolved
```

### Planning
```
tmp.feature-plan.md
- Requirements draft
- Architecture notes
- Implementation steps
→ Rename to FEATURE_PLAN.md if final, else DELETE
```

### Analysis/Research
```
tmp.market-analysis.md
- Technology comparison
- Performance metrics
- Recommendations
→ Finalize to docs/ or DELETE
```

---

## 🎓 For Developers

**Rule of Thumb:**
- If you wouldn't want it in the main repo, prefix it with `tmp.`
- When done: either finalize (remove `tmp.`) or delete
- The `.gitignore` has your back—temporary files won't accidentally commit

**Checklist Before Committing:**
```
□ No tmp.* files in git status
□ All work-in-progress docs finalized or deleted
□ Only permanent content being committed
□ Verified with: git diff --cached
```

---

## 📝 Examples

### Good Temporary File
```markdown
# tmp.refactor-analysis.md

## Current Issues
- [notes about refactoring targets]

## Proposed Changes
- [implementation ideas]

## Decision
→ Ready to convert to docs/REFACTORING_GUIDE.md
```

After review: rename to permanent file or delete.

### Bad Temporary File
```markdown
# tmp.md

[unclear content]
[no purpose]
[left behind]
```

Why bad:
- Not descriptive
- Unclear if needed
- Will confuse future developers

---

## ✨ Summary

| Aspect | Requirement |
|--------|------------|
| **Naming** | `tmp.{purpose}.md` |
| **Location** | Root or `docs/` |
| **Lifetime** | Single session/task |
| **Before Commit** | Finalize or delete |
| **Git Protection** | Ignored by `.gitignore` |
| **Documentation** | See DOCUMENTATION_DIRECTIVE.md |

**Start working:** Just prefix temporary files with `tmp.` and everything stays clean! 🎯

