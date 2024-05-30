import { DataTypes } from "sequelize";
import sequelize from "../database/config.js";

const Player = sequelize.define(
  "Player",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Player name cannot be empty",
        },
      },
    },
  },
  {
    timestamps: false,
  }
);

export default Player;
