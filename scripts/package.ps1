param(
  [string]$OutFile = "smeagol-vscode.vsix"
)

$ErrorActionPreference = "Stop"

$root = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $root

$outPath = Join-Path $root $OutFile

$vsceCmd = Get-Command vsce -ErrorAction SilentlyContinue
if ($vsceCmd) {
  & $vsceCmd.Source package -o $outPath
  exit $LASTEXITCODE
}

$npxCmd = Get-Command npx -ErrorAction SilentlyContinue
if ($npxCmd) {
  & $npxCmd.Source @("@vscode/vsce", "package", "-o", $outPath)
  exit $LASTEXITCODE
}

Write-Error "vsce or npx not found. Install Node.js and @vscode/vsce to package."
