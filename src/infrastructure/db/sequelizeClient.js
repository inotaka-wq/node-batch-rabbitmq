import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config(); // .envファイルの環境変数を読み込む

// Sequelize インスタンス作成（DB接続設定）
export const sequelize = new Sequelize(
  process.env.DB_NAME, // データベース名
  process.env.DB_USER, // ユーザー
  process.env.DB_PASSWORD, // パスワード
  {
    host: process.env.DB_HOST, // ホスト（localhostなど）
    dialect: "mysql", // 使用DB（MySQL）
    logging: false, // SQLログ非表示（trueにすると表示される）
  }
);

// DB接続チェック（起動時に実行）
export async function initSequelize() {
  try {
    await sequelize.authenticate(); // 接続確認
    console.log("✅ DB接続成功");
  } catch (err) {
    console.error("❌ DB接続失敗:", err);
    process.exit(1); // 起動中止（接続できなければ続行不可）
  }
}
