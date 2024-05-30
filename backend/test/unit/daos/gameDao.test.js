import gameDao from "../../../src/daos/gameDao";
import Game from "../../../src/models/game";

jest.mock("../../../src/models/game");

describe("GameDao", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findInProgressGameByPlayerId", () => {
    test("should find an in-progress game by player ID", async () => {
      const gameData = { id: 1, playerId: 1, endTimestamp: null };
      Game.findOne.mockResolvedValue(gameData);

      const result = await gameDao.findInProgressGameByPlayerId(1);

      expect(Game.findOne).toHaveBeenCalledWith({
        where: {
          playerId: 1,
          endTimestamp: null,
        },
      });
      expect(result).toEqual(gameData);
    });

    test("should return null if no in-progress game is found", async () => {
      Game.findOne.mockResolvedValue(null);

      const result = await gameDao.findInProgressGameByPlayerId(1);

      expect(Game.findOne).toHaveBeenCalledWith({
        where: {
          playerId: 1,
          endTimestamp: null,
        },
      });
      expect(result).toBeNull();
    });

    test("should throw an error if findOne fails", async () => {
      const error = new Error("Find failed");
      Game.findOne.mockRejectedValue(error);

      await expect(gameDao.findInProgressGameByPlayerId(1)).rejects.toThrow(
        "Find failed"
      );
    });
  });
});
