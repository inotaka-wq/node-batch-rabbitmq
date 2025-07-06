// RabbitMQのコンシューマー処理（メッセージ受信処理の本体）をインポート
import { startConsumer } from "../infrastructure/rabbitmq/consumer.js";

// Sequelize（MySQL ORM）初期化処理をインポート
import { initSequelize } from "../infrastructure/db/sequelizeClient.js";
import { sequelize } from "../infrastructure/db/sequelizeClient.js";

// 📦 DBのテーブル構造を自動作成・同期
//    - 初回： { force: true } → テーブル削除＆再作成（注意）
//    - 本番：なし or { alter: true } → 差分更新（安全）
await sequelize.sync(); // 必要に応じて { force: true } や { alter: true }

/**
 * 🏁 メイン処理を即時実行する非同期IIFE
 */
(async () => {
  console.log("🔁 バッチ1 起動準備中...");

  // DB接続を初期化（ログ出力や認証など含む可能性）
  await initSequelize();

  // RabbitMQ のコンシューマーを起動（consumer.js → DB保存処理）
  await startConsumer();

  console.log("🚀 バッチ1 コンシューマー起動中...");
})();
