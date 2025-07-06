// amqplib ライブラリを使用して RabbitMQ に接続
import amqp from "amqplib";

// バッチ処理（DB保存など）の本体ロジックをインポート
import { batch1Service } from "../../application/batch1Service.js";

// コンシューマーの開始関数（RabbitMQ からメッセージを受信）
export async function startConsumer() {
  // 環境変数から RabbitMQ 接続先URLを取得して接続
  const connection = await amqp.connect(process.env.RABBITMQ_URL);

  // チャンネル作成（メッセージ送受信用のセッション）
  const channel = await connection.createChannel();

  // 受信対象のキュー名（sendTestMessage.js から送られるキュー）
  const queue = "user_insert";

  // キューがなければ作成（あってもOK）
  await channel.assertQueue(queue);

  // キューからメッセージを購読（非同期で受信し続ける）
  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      // メッセージボディを JSON に変換
      const payload = JSON.parse(msg.content.toString());

      try {
        // 実際の処理を実行（DBへの保存など）
        await batch1Service(payload);

        // 正常に処理できたので ACK（RabbitMQ に「完了」を通知）
        channel.ack(msg);

        // 完了通知を次のバッチへ送信（"next-batch" キューに）
        await channel.sendToQueue(
          "next-batch",
          Buffer.from(JSON.stringify({ status: "done" }))
        );
      } catch (e) {
        // 処理中にエラー発生（バリデーション失敗やDBエラーなど）
        console.error("Batch1 failed:", e);

        // NACK（ネガティブACK）：このメッセージは再処理しないで捨てる
        channel.nack(msg, false, false);

        /*
          第2引数（false）→ バルク処理しない（このメッセージだけ）
          第3引数（false）→ メッセージを再キューしない（requeue=false）
          ※ 必要なら true にすればリトライできます
        */
      }
    }
  });
}
