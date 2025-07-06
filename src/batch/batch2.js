// amqplib ライブラリを使って RabbitMQ に接続するためのインポート
import amqp from "amqplib";

// 処理対象のキュー名
const queue = "next-batch";

// RabbitMQ に接続をリトライ付きで試みる関数
const connectWithRetry = async (retries = 5, delay = 2000) => {
  for (let i = 0; i < retries; i++) {
    try {
      // RabbitMQ に接続を試みる
      const conn = await amqp.connect("amqp://localhost");
      return conn;
    } catch (err) {
      console.warn(
        `❌ RabbitMQ接続失敗: ${err.message} | リトライ ${i + 1}/${retries}`
      );
      // 最後のリトライでも失敗した場合はエラーを投げる
      if (i === retries - 1) throw err;
      // 一定時間待ってから再試行
      await new Promise((res) => setTimeout(res, delay));
    }
  }
};

// メイン処理の開始関数
const start = async () => {
  try {
    // RabbitMQ 接続開始
    const conn = await connectWithRetry();
    // チャンネル作成
    const ch = await conn.createChannel();

    // 対象キューがなければ作成（あってもOK）
    await ch.assertQueue(queue);
    console.log("🚀 batch2 起動中...");

    // キューからメッセージを受信する設定
    ch.consume(queue, (msg) => {
      if (msg !== null) {
        // メッセージ本体を文字列として取得 → JSON に変換
        const content = JSON.parse(msg.content.toString());
        // メッセージ内容を表示（←ここが今の処理のすべて）
        console.log("📥 batch2 メッセージ受信:", content);
        // メッセージを正常処理したことを RabbitMQ に通知（ACK）
        ch.ack(msg);
      }
    });
  } catch (err) {
    // 初期処理でエラーがあった場合の処理
    console.error("❗ RabbitMQ 初期化失敗:", err);
    process.exit(1);
  }
};

// バッチ処理の実行開始
start();
