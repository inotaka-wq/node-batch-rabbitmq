import amqp from "amqplib";

const queue = "next-batch";
const message = {
  name: "Taro",
  email: "taro@example.com",
};

const send = async () => {
  const conn = await amqp.connect("amqp://localhost");
  const ch = await conn.createChannel();

  await ch.assertQueue(queue, { durable: true });
  ch.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
    persistent: true,
  });

  console.log(`✅ Sent to "${queue}":`, message);
  await ch.close();
  await conn.close();
};

send();
