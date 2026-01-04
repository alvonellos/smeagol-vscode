# Security and Audit

This extension is self-contained and does not use network access or spawn external processes.
It only reads open editor documents and applies decorations.

Quick local audit
- `rg -n "child_process|spawn\\(|exec\\(|net\\.|https?\\.|fetch\\(" src`

If you need malware scanning, run your preferred antivirus or EDR tooling against this folder.
