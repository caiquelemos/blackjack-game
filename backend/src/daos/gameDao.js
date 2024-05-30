import BaseDao from "./baseDao.js";
import Game from "../models/game.js";

class GameDao extends BaseDao {
  constructor() {
    super(Game);
  }

  async findInProgressGameByPlayerId(playerId) {
    try {
      const game = await this.model.findOne({
        where: {
          playerId,
          endTimestamp: null,
        },
      });
      return game;
    } catch (error) {
      throw error;
    }
  }
}

export default new GameDao();
