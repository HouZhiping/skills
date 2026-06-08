---
name: "encoding-guard"
description: "在包含中文文档、中文注释或中文字符串的仓库中，安全读取、搜索和修改文本文件，避免 PowerShell 输出乱码或误把非 UTF-8 文件覆盖掉。遇到中文显示异常、需要批量检查编码、或修改 Markdown/Java/Vue/XML/YAML/SQL 等文本文件时使用。优先显式使用 UTF-8，先检测再覆盖，并尽量用脚本减少上下文占用。"
---

# Encoding Guard

按下面顺序执行，避免中文乱码并控制上下文体积。

1. 先判断：
- 终端显示乱码：优先怀疑 PowerShell 输出编码。
- 文件本身乱码：优先怀疑源文件不是 UTF-8，禁止直接覆盖。

2. 优先用脚本，不直接在对话里贴大段中文：
- 单文件读取：`scripts/safe-read.ps1`
- 关键字搜索：`scripts/safe-search.ps1`
- 批量扫描：`scripts/scan-encoding.ps1`
- 安全写回：`scripts/safe-write.ps1`

3. 修改前提：
- 默认把 `md`, `txt`, `ps1`, `bat`, `cmd`, `java`, `kt`, `xml`, `properties`, `yml`, `yaml`, `json`, `sql`, `js`, `ts`, `vue`, `css`, `scss`, `html`, `csv` 视为 UTF-8 文本。
- 文件能被 UTF-8 正常读取后再编辑。
- UTF-8 检测失败时先停，报告“疑似非 UTF-8 文件”。
- 做最小修改，不为统一编码重写无关文件。

4. 写回原则：
- 默认写成 UTF-8 无 BOM。
- 只有在明确需要兼容旧工具时才保留 BOM。

5. 验证：
- 改完后用 `scripts/safe-read.ps1` 抽样回读。
- 批量改动后再跑一次 `scripts/scan-encoding.ps1`。
