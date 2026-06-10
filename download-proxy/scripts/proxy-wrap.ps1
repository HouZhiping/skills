param(
    [Parameter(Mandatory = $true, Position = 0)]
    [string] $Command,

    [string] $Proxy = "http://127.0.0.1:7892"
)

$escapedProxy = $Proxy.Replace('"', '\"')
Write-Output "`$env:HTTP_PROXY=`"$escapedProxy`"; `$env:HTTPS_PROXY=`"$escapedProxy`"; $Command"
