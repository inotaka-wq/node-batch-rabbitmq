# node-batch-rabbitmq

RabbitMQ をトリガーに Node.js + Sequelize (MySQL) でバッチ処理を実行し、処理完了後に次のバッチを RabbitMQ 経由で起動する構成。DDD + オニオンアーキテクチャで設計。

---

## 📦 技術スタック

- Node.js
- MySQL（Sequelize ORM）
- RabbitMQ
- Domain-Driven Design (DDD)
- オニオンアーキテクチャ

---

## 🗂 ディレクトリ構成

```
src/
├── application/ # アプリケーションサービス（ユースケース呼び出し）
├── batch/ # バッチエントリーポイント
├── domain/ # エンティティ・リポジトリインターフェース
├── infrastructure/
│ ├── db/ # Sequelize接続・モデル定義
│ ├── rabbitmq/ # publisher/consumer定義
│ └── repository/ # リポジトリ実装
├── usecase/ # ユースケース（ドメインサービス）
```

---

## ⚙️ セットアップ手順

### 1. `.env` を作成

```env
DB_HOST=localhost
DB_NAME=mydb
DB_USER=root
DB_PASSWORD=password
RABBITMQ_URL=amqp://localhost
```

2. 依存関係インストール

```bash
   npm install
```

3. Sequelize モデル同期（必要ならマイグレーション用意）

```js
await sequelize.sync({ force: false });
```

▶️ バッチ起動

```bash
node src/batch/batch1.js
```

📨 メッセージ送信（手動テスト例）

```json
// RabbitMQ の "user_insert" キューに送信
{
  "name": "Taro",
  "email": "taro@example.com"
}
```

送信成功後、自動的に next-batch キューに正常終了通知が送られます。

🧩 今後追加予定（例）

- 複数バッチ連携（バッチ2, バッチ3...）
- メッセージリトライ戦略
- Dead Letter Queue (DLQ)
- テストコード（ユースケース/リポジトリ）

👤 作者

- sプロジェクト名: node-batch-rabbitmq

---
