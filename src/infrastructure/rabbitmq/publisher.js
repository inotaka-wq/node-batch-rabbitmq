import amqp from "amqplib";
import dotenv from "dotenv";
dotenv.config();

let connection;
let channel;

/**
 * 初期化（1度だけ呼び出す）
 */
export async function initPublisher() {
  if (channel) return channel;

  connection = await amqp.connect(process.env.RABBITMQ_URL);
  channel = await connection.createChannel();
  return channel;
}

/**
 * 次のバッチを起動するためのメッセージ送信
 * @param {string} queueName - 送信先のキュー名
 * @param {object} message - 任意のJSONオブジェクト
 */
export async function publishToQueue(queueName, message) {
  const ch = await initPublisher();

  await ch.assertQueue(queueName, { durable: true });
  ch.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });

  console.log(`📤 [RabbitMQ] "${queueName}" に送信済み`, message);
}
