param(
    [Parameter(Mandatory = $true)]
    [string]$Pattern,

    [string]$Root = ".",

    [string[]]$Extensions = @("md","txt","ps1","bat","cmd","java","kt","xml","properties","yml","yaml","json","sql","js","ts","vue","css","scss","html","csv")
)

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$extSet = @{}
foreach ($ext in $Extensions) {
    $extSet[$ext.ToLowerInvariant()] = $true
}

Get-ChildItem -LiteralPath $Root -Recurse -File | ForEach-Object {
    $ext = $_.Extension.TrimStart(".").ToLowerInvariant()
    if (-not $extSet.ContainsKey($ext)) {
        return
    }

    try {
        Select-String -LiteralPath $_.FullName -Pattern $Pattern -Encoding UTF8 | ForEach-Object {
            [PSCustomObject]@{
                Path = $_.Path
                LineNumber = $_.LineNumber
                Line = $_.Line
            }
        }
    }
    catch {
        # Skip files that fail UTF-8 text search; caller should use scan-encoding.ps1 first if needed.
    }
}
