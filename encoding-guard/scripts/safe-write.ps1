param(
    [Parameter(Mandatory = $true)]
    [string]$Path,

    [Parameter(Mandatory = $true)]
    [string]$Content,

    [switch]$WithBom
)

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$resolvedPath = $ExecutionContext.SessionState.Path.GetUnresolvedProviderPathFromPSPath($Path)
$directory = Split-Path -Parent $resolvedPath
if ($directory -and -not (Test-Path -LiteralPath $directory)) {
    New-Item -ItemType Directory -Path $directory -Force | Out-Null
}

$encoding = if ($WithBom) {
    New-Object System.Text.UTF8Encoding($true)
} else {
    New-Object System.Text.UTF8Encoding($false)
}

[System.IO.File]::WriteAllText($resolvedPath, $Content, $encoding)
Write-Output "WROTE_UTF8:$resolvedPath"
