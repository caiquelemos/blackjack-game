import gameController from "../../../src/controllers/gameController";
import gameService from "../../../src/services/gameService";

jest.mock("../../../src/services/gameService");

describe("GameController", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("start", () => {
    test("should start a new game if no in-progress game is found", async () => {
      const req = {
        body: { playerId: 1 },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const newGame = { id: 1, playerId: 1 };
      gameService.findInProgressGameByPlayerId.mockResolvedValue(null);
      gameService.createGame.mockResolvedValue(newGame);

      await gameController.start(req, res);

      expect(gameService.findInProgressGameByPlayerId).toHaveBeenCalledWith(1);
      expect(gameService.createGame).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newGame);
    });

    test("should return an existing in-progress game", async () => {
      const req = {
        body: { playerId: 1 },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const existingGame = { id: 1, playerId: 1 };
      gameService.findInProgressGameByPlayerId.mockResolvedValue(existingGame);

      await gameController.start(req, res);

      expect(gameService.findInProgressGameByPlayerId).toHaveBeenCalledWith(1);
      expect(gameService.createGame).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(existingGame);
    });

    test("should return a 500 error if an error occurs", async () => {
      const req = {
        body: { playerId: 1 },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const error = new Error("Something went wrong");
      gameService.findInProgressGameByPlayerId.mockRejectedValue(error);

      await gameController.start(req, res);

      expect(gameService.findInProgressGameByPlayerId).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe("hit", () => {
    test("should return the updated game state after hit", async () => {
      const req = {
        body: { gameId: 1 },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const gameDto = { id: 1, playerId: 1 };
      gameService.hit.mockResolvedValue(gameDto);

      await gameController.hit(req, res);

      expect(gameService.hit).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(gameDto);
    });

    test("should return a 500 error if an error occurs", async () => {
      const req = {
        body: { gameId: 1 },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const error = new Error("Something went wrong");
      gameService.hit.mockRejectedValue(error);

      await gameController.hit(req, res);

      expect(gameService.hit).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe("stand", () => {
    test("should return the final game state after stand", async () => {
      const req = {
        body: { gameId: 1 },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const gameDto = { id: 1, playerId: 1 };
      gameService.stand.mockResolvedValue(gameDto);

      await gameController.stand(req, res);

      expect(gameService.stand).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(gameDto);
    });

    test("should return a 500 error if an error occurs", async () => {
      const req = {
        body: { gameId: 1 },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const error = new Error("Something went wrong");
      gameService.stand.mockRejectedValue(error);

      await gameController.stand(req, res);

      expect(gameService.stand).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
});
