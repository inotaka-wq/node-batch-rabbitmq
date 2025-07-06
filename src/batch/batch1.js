import { startConsumer } from "../infrastructure/rabbitmq/consumer.js";
import { initSequelize } from "../infrastructure/db/sequelizeClient.js";
import { sequelize } from "../infrastructure/db/sequelizeClient.js";

await sequelize.sync(); // 必要に応じて { force: true } や { alter: true }

(async () => {
  console.log("🔁 バッチ1 起動準備中...");

  await initSequelize();
  await startConsumer(); // RabbitMQからメッセージ受信して処理スタート

  console.log("🚀 バッチ1 コンシューマー起動中...");
})();
