---
name: kafka-ops
description: Operate Kafka safely from Codex for development and troubleshooting. Use when checking whether a host is Kafka, inspecting advertised broker metadata, listing or describing topics, creating development topics, validating partitions, or diagnosing Kafka bootstrap/listener/topic issues. Default development broker is 172.30.11.182:19092.
---

# Kafka Ops

Use this skill for Kafka inspection and small admin tasks. Prefer read-only checks first, then perform explicit creation only when the user asks.

## Defaults

- Development bootstrap server: `172.30.11.182:19092`
- Default replication factor: `1`
- Default topics for Gather Hub development:
  - `instance.dispatch` with 12 partitions
  - `event.report` with 12 partitions
  - `result.data` with 12 partitions
  - `resource.node.sync` with 6 partitions
  - `resource.account.sync` with 6 partitions
  - `resource.proxy.sync` with 6 partitions

## Workflow

1. Confirm broker connectivity and advertised metadata before creating topics.
2. Use `scripts/kafka-ops.js metadata` to verify the broker advertises an address reachable by the current client.
3. Use `scripts/kafka-ops.js list` or `describe` to check existing topics.
4. Use `scripts/kafka-ops.js create-default-topics` only after the user asks to create the Gather Hub development topics.
5. Report the actual advertised broker host, topic names, partition counts, and any mismatch clearly.

## Commands

Run commands from the skill folder or pass the script path directly.

```powershell
node C:\Users\user\.codex\skills\kafka-ops\scripts\kafka-ops.js metadata
node C:\Users\user\.codex\skills\kafka-ops\scripts\kafka-ops.js list
node C:\Users\user\.codex\skills\kafka-ops\scripts\kafka-ops.js describe
node C:\Users\user\.codex\skills\kafka-ops\scripts\kafka-ops.js create-default-topics
```

Override broker:

```powershell
node C:\Users\user\.codex\skills\kafka-ops\scripts\kafka-ops.js metadata --broker 127.0.0.1:9092
```

## Safety Rules

- Do not delete topics unless the user explicitly asks and confirms the exact topic names.
- Do not increase partitions without warning that Kafka partitions cannot be reduced normally.
- Do not assume `Test-NetConnection` proves Kafka correctness; always check Kafka metadata.
- If metadata advertises a different host than the bootstrap host, warn that clients may reconnect to the advertised host.
- Treat production brokers as high risk; ask before creating or modifying topics outside the development broker.
