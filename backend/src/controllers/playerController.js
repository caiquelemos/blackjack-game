import playerService from "../services/playerService.js";

class PlayerController {
  async login(req, res) {
    try {
      const { name } = req.body;
      let statusCode = 200;
      let player = await playerService.findPlayerByName(name);
      if (!player) {
        player = await playerService.createPlayer({ name });
        statusCode = 201;
      }
      res.status(statusCode).json({
        playerId: player.id,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new PlayerController();
