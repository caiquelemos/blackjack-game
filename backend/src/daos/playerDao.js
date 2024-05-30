import BaseDao from "./baseDao.js";
import Player from "../models/player.js";

class PlayerDao extends BaseDao {
  constructor() {
    super(Player);
  }

  async findPlayerByName(name) {
    try {
      const player = await this.model.findOne({
        where: { name },
      });
      return player;
    } catch (error) {
      throw error;
    }
  }
}

export default new PlayerDao();
