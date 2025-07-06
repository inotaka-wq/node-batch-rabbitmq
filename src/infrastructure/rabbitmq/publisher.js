// amqplib ライブラリを使って RabbitMQ と通信
import amqp from "amqplib";

// .env ファイルから環境変数を読み込む
import dotenv from "dotenv";
dotenv.config();

// RabbitMQ の接続オブジェクトとチャンネルを保持（再利用するため）
let connection;
let channel;

/**
 * 📦 RabbitMQ チャンネル初期化関数（初回だけ接続＆作成）
 *
 * 呼び出し元は sendToQueue の直前で使う。すでにチャンネルがあれば再利用。
 *
 * @returns {Channel} RabbitMQ チャンネル
 */
export async function initPublisher() {
  // すでに初期化されている場合は再利用（毎回接続しない）
  if (channel) return channel;

  // 環境変数から RabbitMQ に接続
  connection = await amqp.connect(process.env.RABBITMQ_URL);

  // チャンネルを作成して保持
  channel = await connection.createChannel();

  return channel;
}

/**
 * 🚀 指定したキューにメッセージを送信する共通関数
 *
 * 主に次のバッチ処理に「完了通知」「開始指示」などを伝える目的で使用。
 *
 * @param {string} queueName - 送信先キュー名（例: "next-batch"）
 * @param {object} message - 任意のJSONオブジェクト（自動で文字列化される）
 */
export async function publishToQueue(queueName, message) {
  // チャンネルの初期化（または再利用）
  const ch = await initPublisher();

  // キューが存在しない場合に備えて assert（durable: true で永続化）
  await ch.assertQueue(queueName, { durable: true });

  // メッセージをバッファ化して送信（persistent: true で永続化）
  ch.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });

  // ログ出力（送信確認用）
  console.log(`📤 [RabbitMQ] "${queueName}" に送信済み`, message);
}
