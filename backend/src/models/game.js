import { DataTypes } from "sequelize";
import sequelize from "../database/config.js";
import Player from "./player.js";
import Card from "./card.js";

const Game = sequelize.define(
  "Game",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    playerId: {
      type: DataTypes.INTEGER,
      references: {
        model: Player,
        key: "id",
      },
      allowNull: false,
    },
    startTimestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    endTimestamp: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    result: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isIn: {
          args: [["winner", "draw", "loss"]],
          msg: "Result must be one of: winner, draw, loss",
        },
      },
    },
    deck: {
      type: DataTypes.JSON,
      allowNull: false,
      validate: {
        isValidCardsArray(value) {
          Card.validateCardsAndParseIfTheyHaveCardAttributes(value);
        },
      },
    },
    dealerExposedCards: {
      type: DataTypes.JSON,
      allowNull: false,
      validate: {
        isValidCardsArray(value) {
          Card.validateCardsAndParseIfTheyHaveCardAttributes(value);
        },
      },
    },
    dealerHiddenCard: {
      type: DataTypes.JSON,
      allowNull: false,
      validate: {
        isValidCard(value) {
          Card.validateCardsAndParseIfTheyHaveCardAttributes([value]);
        },
      },
    },
    playerCards: {
      type: DataTypes.JSON,
      allowNull: false,
      validate: {
        isValidCardsArray(value) {
          Card.validateCardsAndParseIfTheyHaveCardAttributes(value);
        },
      },
    },
  },
  {
    timestamps: false,
  }
);

export default Game;
