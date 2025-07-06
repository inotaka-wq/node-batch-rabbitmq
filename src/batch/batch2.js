import amqp from "amqplib";

const queue = "next-batch";

const connectWithRetry = async (retries = 5, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const conn = await amqp.connect("amqp://localhost");
      return conn;
    } catch (err) {
      console.warn(
        `❌ RabbitMQ接続失敗: ${err.message} | リトライ ${i + 1}/${retries}`
      );
      if (i === retries - 1) throw err;
      await new Promise((res) => setTimeout(res, delay));
    }
  }
};

const start = async () => {
  try {
    const conn = await connectWithRetry();
    const ch = await conn.createChannel();

    await ch.assertQueue(queue);
    console.log("🚀 batch2 起動中...");

    ch.consume(queue, (msg) => {
      if (msg !== null) {
        const content = JSON.parse(msg.content.toString());
        console.log("📥 batch2 メッセージ受信:", content);
        ch.ack(msg);
      }
    });
  } catch (err) {
    console.error("❗ RabbitMQ 初期化失敗:", err);
    process.exit(1);
  }
};

start();
