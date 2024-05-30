import playerDao from "../daos/playerDao.js";

class PlayerService {
  async findPlayerByName(name) {
    try {
      return await playerDao.findPlayerByName(name);
    } catch (error) {
      throw new Error(`Error fetching player by name: ${error.message}`);
    }
  }

  async createPlayer(playerData) {
    try {
      return await playerDao.create(playerData);
    } catch (error) {
      throw new Error(`Error creating player: ${error.message}`);
    }
  }

  async getPlayerById(playerId) {
    try {
      return await playerDao.getById(playerId);
    } catch (error) {
      throw new Error(`Error fetching player: ${error.message}`);
    }
  }
}

export default new PlayerService();
