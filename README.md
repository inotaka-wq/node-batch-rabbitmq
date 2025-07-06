# node-batch-rabbitmq

Node.js + RabbitMQ + MySQL を使ったバッチ処理システムのサンプルです。

このプロジェクトでは以下の流れを実装します：

1. バッチ1が MySQL にデータを挿入
2. 処理完了後、RabbitMQ に通知メッセージを送信
3. バッチ2が RabbitMQ 経由で通知を受けて処理を開始

---

## 🧱 技術スタック

- Node.js（バッチ処理）
- MySQL（DB、Docker経由）
- RabbitMQ（キュー通知、Docker経由）
- Docker Compose（開発用コンテナ管理）
- dotenv（環境変数）

---

## 🛠 セットアップ手順

### 1. このリポジトリをクローン or 作成

```bash
git clone https://github.com/your-name/node-batch-rabbitmq.git
cd node-batch-rabbitmq
```
