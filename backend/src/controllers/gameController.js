import gameService from "../services/gameService.js";

class GameController {
  async start(req, res) {
    try {
      const { playerId } = req.body;
      let statusCode = 200;
      let game = await gameService.findInProgressGameByPlayerId(playerId);
      if (!game) {
        game = await gameService.createGame(playerId);
        statusCode = 201;
      }
      res.status(statusCode).json(game);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async hit(req, res) {
    try {
      const gameDto = await gameService.hit(req.body.gameId);
      res.status(200).json(gameDto);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async stand(req, res) {
    try {
      const gameDto = await gameService.stand(req.body.gameId);
      res.status(200).json(gameDto);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

export default new GameController();
