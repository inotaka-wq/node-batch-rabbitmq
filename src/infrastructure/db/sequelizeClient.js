import { Sequelize } from "sequelize";
import dotenv from "dotenv";
dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: false, // trueにするとSQLログ出力
  }
);

// 初期接続チェック（任意）
export async function initSequelize() {
  try {
    await sequelize.authenticate();
    console.log("✅ DB接続成功");
  } catch (err) {
    console.error("❌ DB接続失敗:", err);
    process.exit(1);
  }
}
