# Documentation Directive

## 📚 All Documentation Goes in `docs/`

### Rule
**All new documentation, guides, references, and project notes MUST be created in the `docs/` directory, not at the root level.**

### Structure

```
docs/
├── *.md files              # Active documentation
├── STRUCTURE.md            # Project layout guide
├── API.md                  # API reference
├── CONTRIBUTING.md         # Developer contribution guide
├── TROUBLESHOOTING.md      # Support and FAQ
├── SAMPLE_DATABASES.md     # Code examples
└── archive/                # Historical docs (40+ files)
```

### When Creating New Documentation

1. **Create in `docs/` directory**: `docs/NEW_GUIDE.md`
2. **Link from relevant places**:
   - Add to `docs/STRUCTURE.md` table if structural
   - Add to `README.md` if user-facing
   - Add to `docs/API.md` if technical
3. **Archive old docs**: Move outdated docs to `docs/archive/`

### Examples

✅ **DO**:
- `docs/API.md` - Technical reference
- `docs/CONTRIBUTING.md` - Developer guide
- `docs/CUSTOM_THEME_GUIDE.md` - New feature docs
- `docs/archive/OLD_RELEASE_NOTES.md` - Old references

❌ **DON'T**:
- `API.md` at root
- `README.md` replacements at root
- Session notes at root
- Multiple docs scattered at root level

### Temporary/Draft Files Convention

**All temporary, draft, or work-in-progress markdown files MUST use the `tmp.md` suffix pattern.**

#### Pattern: `tmp.{purpose}.md`

Examples:
- `tmp.analysis.md` - Temporary analysis or research
- `tmp.report.md` - Draft report being worked on
- `tmp.notes.md` - Session notes in progress
- `tmp.refactor-plan.md` - Planning document not finalized
- `tmp.investigation.md` - Investigation notes

#### Rules for Temporary Files

1. **Naming**: All temporary files follow pattern `tmp.*.md`
2. **Location**: Can be at root or in `docs/` (use `docs/` for documentation-related)
3. **Cleanup**: Delete or finalize before committing
4. **Purpose**: Clear intention that these are ephemeral
5. **Lifecycle**:
   - Create with `tmp.` prefix while working
   - Rename to permanent name when finalized (remove `tmp.` prefix)
   - Delete if no longer needed
   - Never commit temporary files

#### Examples

✅ **DO - Temporary Files (Delete Before Commit)**:
- `tmp.refactor-analysis.md` - Work in progress
- `docs/tmp.new-feature-plan.md` - Draft guide being developed
- `tmp.session-notes.md` - Session working notes

❌ **DON'T - Commit Without Finalizing**:
- `tmp.final-report.md` - Remove `tmp.` before commit
- `tmp.analysis.md` left in repo - Delete or finalize
- `docs/tmp.guide.md` in production - Rename to `docs/GUIDE.md`

### Root Level (Exception)

Only these permanent files at root:
- `README.md` - Main entry point (links to docs/)
- `COMPLETION_SUMMARY.md` - Session completion status
- `LICENSE` - License file
- `package.json` - Project metadata
- `.gitignore` - Git configuration
- `package-lock.json` - Dependency lock
- `icon.png` - Extension icon
- `smeagol-vscode.vsix` - Deployment package

---

## Quick Reference

| Need | Location |
|------|----------|
| **Project structure** | [docs/STRUCTURE.md](STRUCTURE.md) |
| **Add API docs** | [docs/API.md](API.md) |
| **Contribution guide** | [docs/CONTRIBUTING.md](CONTRIBUTING.md) |
| **Troubleshooting** | [docs/TROUBLESHOOTING.md](TROUBLESHOOTING.md) |
| **Code examples** | [docs/SAMPLE_DATABASES.md](SAMPLE_DATABASES.md) |
| **Old references** | [docs/archive/](archive/) |
| **Main entry** | [../README.md](../README.md) |

---

**Enforce this directive**: Keep root clean, keep docs organized, keep history preserved in archive.
