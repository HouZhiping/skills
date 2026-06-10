---
name: "mysql-db-operator"
description: "操作 gather-system MySQL 用户/菜单库时使用，尤其是 sys_menu、角色菜单权限、系统用户模块相关表。适用于查询 MySQL 表结构、排查菜单数据、执行 SELECT/SHOW/EXPLAIN、生成或执行 MySQL SQL。查询无需额外授权，但明细查询默认必须分页且最多返回 10 条，超过 10 条或无 LIMIT 的明细查询必须先询问用户；任何修改数据或表结构的 SQL（INSERT/UPDATE/DELETE/TRUNCATE/CREATE/ALTER/DROP 等）必须先说明目的、影响范围、风险和回滚建议，并获得用户明确授权后才能执行。"
---

# MySQL DB Operator

## Scope

Use this skill for gather-system MySQL work, especially the system user/menu database:

- Default schema when working from current project docs: `gts_system_user_dev`
- Common table: `sys_menu`
- The project PostgreSQL business database is not covered by this skill; use `pgsql-db-operator` for PostgreSQL.

If host, port, username, or password are not available in the current context, ask for the missing connection fields before connecting.

## Client Preference

Prefer MySQL CLI-compatible tools when available:

```powershell
mysql -h <host> -P <port> -u <user> -p<password> --default-character-set=utf8mb4 <database> -e "SELECT 1;"
```

If `mysql` is unavailable, use an already available safe client only when present, such as:

- `mariadb`
- `mysqlsh`
- a project-provided script/client
- JDBC from an existing Java runtime, only when it avoids installing new software and the SQL can be kept explicit

Do not silently install database clients.

## Read Rules

Read-only operations do not require additional authorization:

- `SELECT`
- `WITH ... SELECT`
- `SHOW`
- `DESCRIBE`
- `EXPLAIN`
- `information_schema` inspection

Read-only query size rules:

- Detail/list queries must use pagination or an explicit `LIMIT 10`.
- If the user does not specify page size, default to `LIMIT 10`.
- Do not run `SELECT * FROM table_name` without `LIMIT`.
- Do not run detail/list queries with `LIMIT` greater than `10` unless the user explicitly approves the larger result size in the current conversation.
- Aggregate queries returning bounded summary rows, such as `COUNT(*)`, may run without a detail `LIMIT`.

## Write Rules

Mutating operations require explicit user authorization before execution:

- Data changes: `INSERT`, `UPDATE`, `DELETE`, `TRUNCATE`, `REPLACE`, `LOAD DATA`
- DDL/schema changes: `CREATE`, `ALTER`, `DROP`, `RENAME`, `COMMENT`
- Transactional scripts that include any mutating statement

Before asking for authorization, state:

1. Purpose: why the change is needed.
2. Exact SQL to run.
3. Expected affected objects and row scope.
4. Risk: locks, data loss, constraint impact, service impact.
5. Rollback or verification SQL.

Do not execute mutating SQL until the user explicitly approves it in the current conversation.

## MySQL Safety Notes

- Use `utf8mb4` for Chinese menu data.
- Prefer idempotent MySQL SQL for menu changes:

```sql
INSERT INTO sys_menu (...) VALUES (...)
ON DUPLICATE KEY UPDATE ...;
```

- For updates to existing rows, run a read-only pre-check first.
- Prefer wrapping related writes in a transaction when the engine supports it:

```sql
START TRANSACTION;
-- changes
COMMIT;
```

- Verify after writing with a bounded query such as:

```sql
SELECT id, parent_id, menu_name, path, route_name, component, order_num
FROM sys_menu
WHERE parent_id = 30
ORDER BY order_num, id
LIMIT 10;
```

