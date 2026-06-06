$ErrorActionPreference = "Stop"

$repoRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$outDir = Join-Path $repoRoot "release"
$zipPath = Join-Path $outDir "thumbnail-generator-docs.zip"
$items = @(
  (Join-Path $repoRoot "README.md"),
  (Join-Path $repoRoot "AGENTS.md"),
  (Join-Path $repoRoot "SKILL.md"),
  (Join-Path $repoRoot "TODO.md"),
  (Join-Path $repoRoot "docs")
)

New-Item -ItemType Directory -Path $outDir -Force | Out-Null
if (Test-Path $zipPath) {
  Remove-Item -LiteralPath $zipPath -Force
}

Compress-Archive -Path $items -DestinationPath $zipPath -CompressionLevel Optimal
Write-Output $zipPath
