import playerController from "../../../src/controllers/playerController";
import playerService from "../../../src/services/playerService";

jest.mock("../../../src/services/playerService");

describe("PlayerController", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("login", () => {
    test("should login an existing player", async () => {
      const req = {
        body: { name: "John Doe" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const player = { id: 1, name: "John Doe" };
      playerService.findPlayerByName.mockResolvedValue(player);

      await playerController.login(req, res);

      expect(playerService.findPlayerByName).toHaveBeenCalledWith("John Doe");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ playerId: player.id });
    });

    test("should create a new player if not found", async () => {
      const req = {
        body: { name: "John Doe" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const newPlayer = { id: 1, name: "John Doe" };
      playerService.findPlayerByName.mockResolvedValue(null);
      playerService.createPlayer.mockResolvedValue(newPlayer);

      await playerController.login(req, res);

      expect(playerService.findPlayerByName).toHaveBeenCalledWith("John Doe");
      expect(playerService.createPlayer).toHaveBeenCalledWith({
        name: "John Doe",
      });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ playerId: newPlayer.id });
    });

    test("should return a 500 error if an error occurs", async () => {
      const req = {
        body: { name: "John Doe" },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      const error = new Error("Something went wrong");
      playerService.findPlayerByName.mockRejectedValue(error);

      await playerController.login(req, res);

      expect(playerService.findPlayerByName).toHaveBeenCalledWith("John Doe");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: error.message });
    });
  });
});
