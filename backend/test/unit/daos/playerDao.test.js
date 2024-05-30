import playerDao from "../../../src/daos/playerDao";
import Player from "../../../src/models/player";

jest.mock("../../../src/models/player");

describe("PlayerDao", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findPlayerByName", () => {
    test("should find a player by name", async () => {
      const playerData = { id: 1, name: "John Doe" };
      Player.findOne.mockResolvedValue(playerData);

      const result = await playerDao.findPlayerByName("John Doe");

      expect(Player.findOne).toHaveBeenCalledWith({
        where: { name: "John Doe" },
      });
      expect(result).toEqual(playerData);
    });

    test("should return null if no player is found", async () => {
      Player.findOne.mockResolvedValue(null);

      const result = await playerDao.findPlayerByName("Unknown");

      expect(Player.findOne).toHaveBeenCalledWith({
        where: { name: "Unknown" },
      });
      expect(result).toBeNull();
    });

    test("should throw an error if findOne fails", async () => {
      const error = new Error("Find failed");
      Player.findOne.mockRejectedValue(error);

      await expect(playerDao.findPlayerByName("John Doe")).rejects.toThrow(
        "Find failed"
      );
    });
  });
});
