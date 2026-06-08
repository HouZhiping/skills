---
name: "code-hard-rules"
description: "强制后端代码硬规则：Java、Spring Boot、MyBatis-Plus、接口实现、后端重构、代码审查、Controller/Service/Mapper 架构、Job/调度/回调入口、状态/类型/category/kind 字段都要触发。写入或修改后端代码时必须遵守：禁止 Controller/Job/非当前实体 Service 直接注入 Mapper；外部 Service 禁止调用其他 Service 的 MyBatis-Plus 原生方法；状态和类型必须使用枚举。"
---

# Code Hard Rules

Apply these rules before writing backend code, while editing backend code, and before reporting completion. If existing code violates the rules in the touched area, refactor it instead of extending the violation.

## Mandatory Rules

1. Do not expose Mapper directly.

`Mapper` interfaces must not be injected into `Controller`, `Job`, scheduler entrypoints, callback entrypoints, or any non-current-entity business `Service`.

Use the entity's own business `Service` to wrap Mapper access. External callers must depend on explicit business methods such as `findUserById`, `listActiveUsers`, `createExecutionInstance`, or `markRecordClosed`.

2. Do not call MyBatis-Plus native IService methods from external Services.

When one Service injects another Service, do not call inherited MyBatis-Plus methods such as `getById`, `list`, `save`, `updateById`, `removeById`, `lambdaQuery`, or `page`.

Expose explicit business methods on the called Service and call those methods instead. This keeps data-access boundaries clear and allows later cache, permission, tenant, audit, and validation hooks.

3. Use enums for status and type fields.

For finite-set fields such as `status`, `type`, `category`, `kind`, `sourceType`, `resourceType`, `action`, `step`, `visibility`, and similar concepts, do not hardcode magic strings or numbers such as `"pending"`, `"active"`, `"manual"`, `"node"`, `1`, or `0`.

Define or reuse an enum in a common module and assign/compare through enum instances or `enum.getCode()`.

## Implementation Workflow

Before editing:

- Identify whether the touched code is Controller, Job, Service, Mapper, enum, or entity code.
- Locate existing entity-specific Services and enums before adding new ones.
- If a required enum does not exist, add it to the common module before using new status/type values.

While editing:

- Keep Controllers thin: validate/request-map only, then call Service methods.
- Keep Jobs and internal callback/scheduler entrypoints thin: call Services rather than Mappers.
- Keep cross-entity logic behind explicit Service methods; avoid leaking Mapper or raw IService APIs across boundaries.
- Prefer meaningful business method names over persistence names.

Before finishing:

- Search touched backend code for direct Mapper usage in Controllers and Jobs.
- Search touched backend code for external Service calls to raw MyBatis-Plus methods.
- Search touched backend code for hardcoded status/type/category/kind values.
- Run the relevant compile/test command when feasible.

## Useful Checks

Use these searches as a baseline and adjust paths to the current project:

```powershell
rg -n "Mapper\b|mapper\b" code-backend -g "*Controller.java" -g "*Job.java" -g "!**/target/**"
rg -n "\.getById\(|\.list\(|\.save\(|\.updateById\(|\.removeById\(|\.lambdaQuery\(|\.page\(" code-backend -g "*Service.java" -g "!**/target/**"
rg -n "setStatus\(\"|eq\(\"status\",\s*\"|set.*Type\(\"|eq\(\".*type\",\s*\"" code-backend -g "*.java" -g "!**/target/**"
```

Treat search results as prompts for review, not automatic failures. Enum definitions, route paths, DTO field names, messages, and map keys may legitimately contain these words.
