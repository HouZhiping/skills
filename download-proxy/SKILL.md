---
name: download-proxy
description: Use the local development HTTP proxy http://127.0.0.1:7892 when running command-line download, dependency installation, GitHub fetch, curl/wget, npm/pnpm/yarn, pip, Maven, Gradle, Git, or other network commands from PowerShell or CMD on this Windows machine. Use to speed up or stabilize downloads without committing proxy settings into project files.
metadata:
  short-description: Run CLI downloads through local proxy
---

# Download Proxy

Use this skill when a terminal command downloads from the internet or package registries and may benefit from the local proxy:

```text
http://127.0.0.1:7892
```

## Rules

- Prefer temporary per-command environment variables over editing project config.
- Do not commit proxy URLs into repo files such as `.npmrc`, `pom.xml`, `gradle.properties`, `pip.conf`, or app config unless the user explicitly asks.
- If a command only reaches LAN/internal hosts, do not add the proxy.
- If a tool already has a working project-specific mirror or private registry, keep it unless download failures suggest otherwise.

## PowerShell

For one command:

```powershell
$env:HTTP_PROXY="http://127.0.0.1:7892"; $env:HTTPS_PROXY="http://127.0.0.1:7892"; <command>
```

For several commands in the same session:

```powershell
$env:HTTP_PROXY="http://127.0.0.1:7892"
$env:HTTPS_PROXY="http://127.0.0.1:7892"
```

Clear afterward when needed:

```powershell
Remove-Item Env:HTTP_PROXY, Env:HTTPS_PROXY -ErrorAction SilentlyContinue
```

## CMD

For one command:

```cmd
set HTTP_PROXY=http://127.0.0.1:7892 && set HTTPS_PROXY=http://127.0.0.1:7892 && <command>
```

For several commands:

```cmd
set HTTP_PROXY=http://127.0.0.1:7892
set HTTPS_PROXY=http://127.0.0.1:7892
```

## Common Examples

```powershell
$env:HTTP_PROXY="http://127.0.0.1:7892"; $env:HTTPS_PROXY="http://127.0.0.1:7892"; npm install
$env:HTTP_PROXY="http://127.0.0.1:7892"; $env:HTTPS_PROXY="http://127.0.0.1:7892"; git clone https://github.com/owner/repo.git
$env:HTTP_PROXY="http://127.0.0.1:7892"; $env:HTTPS_PROXY="http://127.0.0.1:7892"; curl.exe -L https://example.com/file.zip -o file.zip
```

## Helper Script

Use `scripts/proxy-wrap.ps1` to print a wrapped command:

```powershell
& "$env:USERPROFILE\.codex\skills\download-proxy\scripts\proxy-wrap.ps1" "npm install"
```
