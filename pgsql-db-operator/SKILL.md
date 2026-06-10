---
name: "pgsql-db-operator"
description: "操作 gather-system PostgreSQL 数据库时使用。连接信息和账号密码优先从当前项目 doc/server_psd.md 读取；文件没有、会话/记忆也没有时再询问用户。适用于查询表结构、排查数据、执行 SELECT/EXPLAIN 只读 SQL、生成或执行 PostgreSQL SQL。查询无需额外授权，但明细查询默认必须分页且最多返回 10 条，超过 10 条或无 LIMIT 的明细查询必须先询问用户；任何修改数据或表结构的 SQL（INSERT/UPDATE/DELETE/TRUNCATE/CREATE/ALTER/DROP/REINDEX/VACUUM FULL 等）必须先说明目的、影响范围、风险和回滚建议，并获得用户明确授权后才能执行。"
---

# PostgreSQL DB Operator

## Connection

For host, port, database, username, password, and other private connection fields:

1. First read `doc/server_psd.md` in the current workspace if it exists.
2. If the file is missing or does not contain the needed field, use only values explicitly available in the current conversation or stable memory.
3. If still missing, ask the user for the missing fields before connecting.

Never store passwords in this skill, commit credentials to Git, or echo passwords back in the final response.

Prefer `psql` when available. On Windows PowerShell, set the password only for the command scope:

```powershell
$env:PGPASSWORD = "<password>"
psql -h <host> -p <port> -U <user> -d <database> -c "SELECT 1;"
Remove-Item Env:PGPASSWORD
```

If `psql` is not installed, explain that the client is missing and provide the exact SQL for the user to run, or use an already available safe DB client only if present.

## Authorization Rules

Read-only operations do not require additional authorization:

- `SELECT`
- `WITH ... SELECT`
- `SHOW`
- `EXPLAIN` without `ANALYZE` for mutating statements
- catalog/schema inspection such as `\dt`, `\d table_name`, `information_schema`, `pg_catalog`

Read-only query size rules:

- Detail/list queries must use pagination or an explicit `LIMIT 10`.
- If the user asks to query data but does not specify a page size, default to `LIMIT 10`.
- Do not run unbounded detail/list queries such as `SELECT * FROM table_name` without `LIMIT`.
- Do not run detail/list queries with `LIMIT` greater than `10` unless the user explicitly approves the larger result size in the current conversation.
- Aggregate queries that return bounded summary rows, such as `COUNT(*)`, `MAX(...)`, `MIN(...)`, or grouped counts with `LIMIT 10`, can run without extra authorization.
- Schema/catalog inspection commands can run without `LIMIT` when they do not return table data rows, but prefer concise output.

Mutating operations require explicit user authorization before execution:

- Data changes: `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, `MERGE`, `COPY FROM`
- DDL/schema changes: `CREATE`, `ALTER`, `DROP`, `COMMENT`, `RENAME`
- Potentially disruptive maintenance: `REINDEX`, `VACUUM FULL`, `CLUSTER`, `ANALYZE` on large tables when it may impact service
- Transactional scripts that include any mutating statement

Before asking for authorization, state:

1. Purpose: why the change is needed.
2. Exact SQL or migration script to run.
3. Expected affected objects and approximate row scope, if knowable.
4. Risk: locks, data loss, constraint impact, service impact.
5. Rollback or verification SQL.

Do not execute the mutating SQL until the user explicitly approves it in the current conversation.

## Safety Workflow

For investigation:

1. Start with read-only queries.
2. Use `LIMIT 10` for detail/list queries by default.
3. For large tables, inspect counts or indexes before broad scans.
4. Use schema-qualified names if ambiguity exists.
5. Summarize findings in Chinese unless the user asks otherwise.

For modifications after approval:

1. Prefer wrapping changes in `BEGIN; ... COMMIT;` when appropriate.
2. Run a read-only pre-check first when possible.
3. Run a verification query after the change.
4. Report what changed and include any rows/counts returned.

## Useful Commands

List tables:

```powershell
$env:PGPASSWORD = "<password>"
psql -h <host> -p <port> -U <user> -d <database> -c "\dt"
Remove-Item Env:PGPASSWORD
```

Describe a table:

```powershell
$env:PGPASSWORD = "<password>"
psql -h <host> -p <port> -U <user> -d <database> -c "\d+ t_task_info"
Remove-Item Env:PGPASSWORD
```

Run a read-only query:

```powershell
$env:PGPASSWORD = "<password>"
psql -h <host> -p <port> -U <user> -d <database> -c "SELECT * FROM t_task_info ORDER BY id DESC LIMIT 10;"
Remove-Item Env:PGPASSWORD
```
