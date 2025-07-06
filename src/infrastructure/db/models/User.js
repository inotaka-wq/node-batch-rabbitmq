import { DataTypes } from "sequelize";
import { sequelize } from "../sequelizeClient.js";

export const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  {
    tableName: "users",
    timestamps: true,
  }
);
