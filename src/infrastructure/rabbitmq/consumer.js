import amqp from "amqplib";
import { batch1Service } from "../../application/batch1Service.js";

export async function startConsumer() {
  const connection = await amqp.connect(process.env.RABBITMQ_URL);
  const channel = await connection.createChannel();
  const queue = "user_insert";

  await channel.assertQueue(queue);

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      const payload = JSON.parse(msg.content.toString());
      try {
        await batch1Service(payload); // ApplicationService呼び出し
        channel.ack(msg);

        // 正常終了したら次バッチをキューに
        await channel.sendToQueue(
          "next-batch",
          Buffer.from(JSON.stringify({ status: "done" }))
        );
      } catch (e) {
        console.error("Batch1 failed:", e);
        channel.nack(msg, false, false); // 処理失敗で捨てる（またはretry）
      }
    }
  });
}
