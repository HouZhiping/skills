param(
    [Parameter(Mandatory = $true)]
    [string]$Path
)

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

try {
    $resolvedPath = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($Path)
}
catch {
    throw "File not found: $Path"
}

$content = Get-Content -LiteralPath $resolvedPath -Raw -Encoding UTF8
Write-Output $content
