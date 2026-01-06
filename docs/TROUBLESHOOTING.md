# Troubleshooting Guide

Common issues and solutions.

## Installation Issues

### Extension Not Installing
**Problem**: VSIX installation fails
**Solution**:
1. Ensure VS Code is updated: `code --version`
2. Try command line: `code --install-extension smeagol-vscode.vsix`
3. Check file permissions: `icacls smeagol-vscode.vsix`
4. Restart VS Code completely

### Extension Not Activating
**Problem**: Extension installed but doesn't show up
**Solution**:
1. Check Extensions panel: `Ctrl+Shift+X`
2. Look for "Smeagol" in list
3. Reload window: `Ctrl+Shift+P` → "Developer: Reload Window"
4. Check output: `Ctrl+Shift+U` → Select "Smeagol"

## Analysis Issues

### No Complexity Warnings
**Problem**: Files analyzed but no warnings in Problems panel
**Solution**:
1. **Save the file first**: Analysis triggers on save (`Ctrl+S`)
2. Open Problems panel: `Ctrl+Shift+M`
3. Check if warnings appear
4. Verify file language: Bottom right corner of editor
5. Try simple file first: `test.py` with obvious complexity

### Wrong Thresholds
**Problem**: Warnings appear at wrong complexity levels
**Solution**:
1. Check `.smeagol/config.json`:
   ```bash
   cat .smeagol/config.json | jq .complexity
   ```
2. Verify JSON syntax: Use online JSON validator
3. Reload config: `Ctrl+Shift+P` → "Developer: Reload Window"
4. Check language override:
   ```json
   "languages": {
     "python": { "complexity": { "warning": 8 } }
   }
   ```

### Huge File Not Analyzed
**Problem**: Large files are skipped
**Solution**:
1. Check file size: Properties panel (right-click file)
2. Default limit is 10MB
3. Increase limit in config:
   ```json
   "performance": { "maxFileSize": 20971520 }
   ```

## Configuration Issues

### Config Not Loading
**Problem**: `.smeagol/config.json` is ignored
**Solution**:
1. Verify file location: Must be in **workspace root**
   ```
   my-project/
   ├── .smeagol/config.json  ✅ Correct
   └── src/
       └── .smeagol/config.json  ❌ Wrong
   ```
2. Check JSON validity:
   ```bash
   # Use jq or jsonlint
   jq . .smeagol/config.json
   ```
3. Reload: `Ctrl+Shift+P` → "Developer: Reload Window"

### Config Changes Not Applied
**Problem**: Edited config but changes don't apply
**Solution**:
1. **Just save the file** — hot reload is automatic
2. If not working:
   - Reload window: `Ctrl+Shift+P` → "Developer: Reload Window"
   - Restart VS Code entirely
3. Check syntax again (JSON must be valid)

## Completion Issues

### Completions Not Showing
**Problem**: No suggestions when typing
**Solution**:
1. Check language: Bottom-right of editor
2. Use trigger characters:
   - Python: `a-z`, `A-Z`, `@`, `.`
   - TypeScript: `a-z`, `A-Z`, `<`, `.`
   - Java: `a-z`, `A-Z`, `@`, `.`
3. Type slowly — cache builds over time
4. Trigger manually: `Ctrl+Space`
5. Reload: `Ctrl+Shift+P` → "Developer: Reload Window"

### Too Many Completions
**Problem**: Completion list is overwhelming
**Solution**:
1. Type more characters to narrow down
2. Disable other extensions (temporarily)
3. Adjust cache settings in config:
   ```json
   "performance": { "cacheEnabled": false }
   ```

## Performance Issues

### Extension Slow
**Problem**: VS Code feels sluggish
**Solution**:
1. Check file size (files >10MB are skipped by default)
2. Disable cache:
   ```json
   "performance": { "cacheEnabled": false }
   ```
3. Increase cache TTL:
   ```json
   "performance": { "cacheTtl": 600000 }
   ```
4. Check Extensions panel for slow extensions

### Analysis Takes Too Long
**Problem**: Complexity analysis is slow
**Solution**:
1. Check file size (very large files may timeout)
2. Exclude patterns in config:
   ```json
   "filePatterns": {
     "exclude": ["**/node_modules/**", "**/build/**"]
   }
   ```
3. Use enterprise mode:
   ```json
   "performance": { "maxFileSize": 5242880 }
   ```

## Integration Issues

### SonarQube Not Connecting
**Problem**: SonarQube integration fails
**Solution**:
1. Verify URL: `https://sonarqube.company.com` (HTTPS required)
2. Check token: Get from SonarQube → User Settings → Security
3. Verify network: Can you reach the server?
4. Check firewall: Open required ports

### VS Code Output
**Problem**: Can't see diagnostic messages
**Solution**:
1. Open output panel: `Ctrl+Shift+U`
2. Select "Smeagol" from dropdown
3. Check for errors/warnings
4. Report issues with this output

## Reporting Issues

When reporting bugs, include:
1. VS Code version: `code --version`
2. Smeagol version: Check Extensions panel
3. File type: Language of file being analyzed
4. `.smeagol/config.json`: Your configuration
5. Output messages: `Ctrl+Shift+U` → Smeagol

---

**Still having issues?** Open an issue on [GitHub](https://github.com/alvonellos/smeagol-vscode/issues).
