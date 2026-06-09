#!/usr/bin/env node
const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const DEFAULT_BROKER = "172.30.11.182:19092";
const DEFAULT_TOPICS = [
  { topic: "instance.dispatch", numPartitions: 12, replicationFactor: 1 },
  { topic: "event.report", numPartitions: 12, replicationFactor: 1 },
  { topic: "result.data", numPartitions: 12, replicationFactor: 1 },
  { topic: "resource.node.sync", numPartitions: 6, replicationFactor: 1 },
  { topic: "resource.account.sync", numPartitions: 6, replicationFactor: 1 },
  { topic: "resource.proxy.sync", numPartitions: 6, replicationFactor: 1 }
];

const parseArgs = argv => {
  const args = { command: argv[2] || "help", broker: DEFAULT_BROKER, topics: [] };
  for (let i = 3; i < argv.length; i += 1) {
    const value = argv[i];
    if (value === "--broker") {
      args.broker = argv[++i];
    } else if (value === "--topic") {
      args.topics.push(argv[++i]);
    }
  }
  return args;
};

const ensureKafkaJs = () => {
  try {
    return require("kafkajs");
  } catch {
    const knownModule = path.join(process.env.TEMP || process.env.TMP || __dirname, "kafka-topic-admin", "node_modules", "kafkajs");
    if (fs.existsSync(knownModule)) {
      return require(knownModule);
    }
    const moduleDir = path.join(process.env.TEMP || process.env.TMP || __dirname, "codex-kafka-ops-node");
    fs.mkdirSync(moduleDir, { recursive: true });
    if (!fs.existsSync(path.join(moduleDir, "package.json"))) {
      spawnSync(process.platform === "win32" ? "npm.cmd" : "npm", ["init", "-y"], { cwd: moduleDir, stdio: "ignore", shell: true });
    }
    const install = spawnSync(process.platform === "win32" ? "npm.cmd" : "npm", ["install", "kafkajs@2.2.4"], {
      cwd: moduleDir,
      stdio: "inherit",
      shell: true
    });
    if (install.status !== 0) {
      throw new Error(`Failed to install kafkajs: ${install.error?.message || `exit ${install.status}`}`);
    }
    return require(path.join(moduleDir, "node_modules", "kafkajs"));
  }
};

const print = value => console.log(JSON.stringify(value, null, 2));

const getAdmin = broker => {
  const { Kafka } = ensureKafkaJs();
  const kafka = new Kafka({
    clientId: "codex-kafka-ops",
    brokers: [broker],
    connectionTimeout: 5000,
    requestTimeout: 15000
  });
  return kafka.admin();
};

const list = async admin => {
  const topics = await admin.listTopics();
  print({ topics: topics.sort() });
};

const metadata = async (admin, topics) => {
  const data = await admin.fetchTopicMetadata(topics.length ? { topics } : undefined);
  print({
    brokers: data.brokers,
    topics: data.topics.map(topic => ({
      topic: topic.name,
      partitions: topic.partitions.length,
      partitionIds: topic.partitions.map(partition => partition.partitionId).sort((a, b) => a - b)
    }))
  });
};

const createDefaultTopics = async admin => {
  const existing = await admin.listTopics();
  const missing = DEFAULT_TOPICS.filter(item => !existing.includes(item.topic));
  let created = false;
  if (missing.length) {
    created = await admin.createTopics({ waitForLeaders: true, topics: missing });
  }
  const data = await admin.fetchTopicMetadata({ topics: DEFAULT_TOPICS.map(item => item.topic) });
  print({
    created,
    createdTopics: missing.map(item => item.topic),
    topics: data.topics.map(topic => ({
      topic: topic.name,
      partitions: topic.partitions.length,
      partitionIds: topic.partitions.map(partition => partition.partitionId).sort((a, b) => a - b)
    }))
  });
};

const main = async () => {
  const args = parseArgs(process.argv);
  if (args.command === "help" || args.command === "--help" || args.command === "-h") {
    print({
      usage: "node kafka-ops.js <metadata|list|describe|create-default-topics> [--broker host:port] [--topic name]",
      defaultBroker: DEFAULT_BROKER,
      defaultTopics: DEFAULT_TOPICS
    });
    return;
  }

  const admin = getAdmin(args.broker);
  await admin.connect();
  try {
    if (args.command === "list") {
      await list(admin);
    } else if (args.command === "metadata") {
      await metadata(admin, []);
    } else if (args.command === "describe") {
      await metadata(admin, args.topics);
    } else if (args.command === "create-default-topics") {
      await createDefaultTopics(admin);
    } else {
      throw new Error(`Unknown command: ${args.command}`);
    }
  } finally {
    await admin.disconnect();
  }
};

main().catch(error => {
  console.error(error);
  process.exit(1);
});
