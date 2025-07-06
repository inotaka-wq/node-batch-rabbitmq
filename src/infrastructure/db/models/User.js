import { DataTypes } from "sequelize";
import { sequelize } from "../sequelizeClient.js";

// ✅ User モデルを定義（テーブル名: users）
export const User = sequelize.define(
  "User", // モデル名（クラスとしての名前）
  {
    id: {
      type: DataTypes.INTEGER, // 整数型
      primaryKey: true, // 主キー
      autoIncrement: true, // 自動採番
    },
    name: {
      type: DataTypes.STRING, // 文字列
    },
    email: {
      type: DataTypes.STRING, // 文字列
      unique: true, // 重複禁止（ユニーク制約）
    },
  },
  {
    tableName: "users", // 実際のテーブル名を指定（省略時は自動的に複数形にされる）
    timestamps: true, // createdAt / updatedAt を自動追加
  }
);
