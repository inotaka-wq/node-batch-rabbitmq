// amqplib ライブラリを使って RabbitMQ と通信
import amqp from "amqplib";

// RabbitMQ のキュー名（受信側と一致する必要あり）
// const queue = "next-batch";
const queue = "user_insert";

// 一意な email を生成（同じユーザーが複数回送られた場合のDBエラー回避）
const randomEmail = `taro+${Date.now()}@example.com`;
const message = {
  name: "Taro",
  email: randomEmail,
};

// 非同期で RabbitMQ に接続し、メッセージを送信する関数
const send = async () => {
  // RabbitMQ に接続
  const conn = await amqp.connect("amqp://localhost");

  // チャンネル作成（通信の単位）
  const ch = await conn.createChannel();

  // キューを宣言（存在しない場合は作成される）
  await ch.assertQueue(queue, { durable: true });

  // メッセージを送信（JSON文字列化し、永続化オプション付き）
  ch.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });

  // 送信確認ログ
  console.log(`✅ Sent to "${queue}":`, message);

  // チャンネルと接続をクローズ
  await ch.close();
  await conn.close();
};

// 関数を実行
send();
