import amqp from "amqplib";

// const queue = "next-batch";
const queue = "user_insert";
const randomEmail = `taro+${Date.now()}@example.com`;
const message = {
  name: "Taro",
  email: `taro+${Date.now()}@example.com`,
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
