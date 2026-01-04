/**
 * Shell Exemplars - Bash/Shell idioms
 */
const shellExemplars = [{
    framework: "bash",
    name: "Shell Patterns",
    code: `#!/bin/bash
# Use $(...) instead of backticks
result=$(ls -la)

# Proper quoting to prevent word splitting
if [ -f "$filename" ]; then
    data=$(cat "$filename")
fi

# Array handling
files=(*.txt)
for file in "\${files[@]}"; do
    process "$file"
done

# Test conditions
if [ $# -eq 0 ]; then
    echo "Usage: $0 <file>"
    exit 1
fi

# Proper error handling
set -euo pipefail
trap 'echo "Error at line $LINENO"' ERR
`}];

/**
 * PowerShell Exemplars
 */
const psExemplars = [{
    framework: "powershell",
    name: "PowerShell Patterns",
    code: `# Use cmdlets and pipeline
Get-ChildItem -Path C:\\ -Filter "*.txt" | ForEach-Object { $_.FullName }

# Parameter validation
function Process-File {
    [CmdletBinding()]
    param(
        [Parameter(Mandatory = $true)]
        [ValidateScript({ Test-Path $_ })]
        [string]$FilePath
    )
    Get-Content $FilePath
}

# Error handling
try {
    $data = Get-Content $file -ErrorAction Stop
} catch {
    Write-Error "Failed: $_"
}

# Pipeline with objects
Get-Process | Where-Object { $_.CPU -gt 50 } | Sort-Object CPU -Descending
`}];

/**
 * Groovy Exemplars
 */
const groovyExemplars = [{
    framework: "groovy",
    name: "Groovy Patterns",
    code: `// Closures for callbacks
def numbers = [1, 2, 3, 4, 5]
def doubled = numbers.collect { it * 2 }
def evens = numbers.findAll { it % 2 == 0 }

// GString interpolation
def name = "World"
def greeting = "Hello \${name}"

// List operations
def result = numbers
    .findAll { it > 2 }
    .collect { it * 2 }
    .inject(0) { acc, val -> acc + val }

// Method references
def process = { it.toUpperCase() }
def words = ['hello', 'world']
def upper = words.collect(process)
`}];

/**
 * AutoIt Exemplars
 */
const autoitExemplars = [{
    framework: "autoit",
    name: "AutoIt Patterns",
    code: `; WinAPI and automation
WinActivate("Notepad")
Sleep(500)

; Error handling
Local $hFile = FileOpen("data.txt", 0)
If @error Then
    MsgBox(0, "Error", "Cannot open file")
    Exit
EndIf

; Control interaction
ControlClick("Notepad", "", "[CLASS:Edit]", "left", 1, 100, 100)
Send("Hello World")

; Loop patterns
For $i = 1 To 10 Step 1
    MsgBox(0, "Count", $i)
Next
`}];

module.exports = {
    shellExemplars,
    psExemplars,
    groovyExemplars,
    autoitExemplars
};
