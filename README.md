# Smeagol VS Code

Smeagol Dark theme plus self-contained rainbow visuals for identifiers, indentation, functions, and HTML tags.

Features
- Smeagol Dark theme
- Better Smeagoling: automatic multi-identifier highlights using a rainbow palette
- Rainbow Indent: colored indentation blocks and optional line shading
- Rainbow Functions: line or name highlighting for functions and classes
- Rainbow HTML: tag name and delimiter coloring for HTML/JSX and html`...` templates
- Rainbow Brackets: uses VS Code bracket pair colorization defaults

Usage
1. Open this folder in VS Code.
2. Press F5 to launch an Extension Development Host.
3. Set the color theme to "Smeagol Dark (Smeagol)".

Notes
- VS Code does not support per-tab colors on the stable API, so "Rainbow Tabs" is not included.
- All features are self-contained in this extension; no third-party extension dependencies are used.

Settings (common)
- `smeagol.highlights.*` controls automatic identifier highlighting.
- `smeagol.indent.*` controls indentation coloring.
- `smeagol.functions.*` controls function/class highlighting.
- `smeagol.html.*` controls HTML tag coloring.

Security
This extension uses only VS Code APIs and local document text. No network or child_process usage. See `SECURITY.md` for a quick audit checklist.
