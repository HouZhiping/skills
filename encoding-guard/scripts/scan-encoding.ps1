param(
    [string]$Root = ".",
    [string[]]$Extensions = @("md","txt","java","kt","xml","yml","yaml","json","sql","js","ts","vue","css","scss","html")
)

$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

$utf8Strict = New-Object System.Text.UTF8Encoding($false, $true)

function Get-EncodingStatus {
    param([byte[]]$Bytes)

    if ($Bytes.Length -ge 3 -and $Bytes[0] -eq 0xEF -and $Bytes[1] -eq 0xBB -and $Bytes[2] -eq 0xBF) {
        return "utf8-bom"
    }

    try {
        [void]$utf8Strict.GetString($Bytes)
        return "utf8"
    }
    catch {
        return "non-utf8-or-binary"
    }
}

$extSet = @{}
foreach ($ext in $Extensions) {
    $extSet[$ext.ToLowerInvariant()] = $true
}

Get-ChildItem -LiteralPath $Root -Recurse -File | ForEach-Object {
    $ext = $_.Extension.TrimStart(".").ToLowerInvariant()
    if (-not $extSet.ContainsKey($ext)) {
        return
    }

    $bytes = [System.IO.File]::ReadAllBytes($_.FullName)
    $status = Get-EncodingStatus -Bytes $bytes
    [PSCustomObject]@{
        Path = $_.FullName
        Status = $status
        Size = $bytes.Length
    }
} | Sort-Object Status, Path
