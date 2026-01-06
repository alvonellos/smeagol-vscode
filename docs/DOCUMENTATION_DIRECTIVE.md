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

### Root Level (Exception)

Only these files at root:
- `README.md` - Main entry point (links to docs/)
- `COMPLETION_SUMMARY.md` - Session completion status
- `LICENSE` - License file
- `package.json` - Project metadata
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
