import playerService from "../../../src/services/playerService";
import playerDao from "../../../src/daos/playerDao";

jest.mock("../../../src/daos/playerDao");

describe("PlayerService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("findPlayerByName", () => {
    test("should find a player by name", async () => {
      const playerData = { id: 1, name: "John Doe" };
      playerDao.findPlayerByName.mockResolvedValue(playerData);

      const result = await playerService.findPlayerByName("John Doe");

      expect(playerDao.findPlayerByName).toHaveBeenCalledWith("John Doe");
      expect(result).toEqual(playerData);
    });

    test("should throw an error if findPlayerByName fails", async () => {
      const error = new Error("Find failed");
      playerDao.findPlayerByName.mockRejectedValue(error);

      await expect(playerService.findPlayerByName("John Doe")).rejects.toThrow(
        "Error fetching player by name: Find failed"
      );
    });
  });

  describe("createPlayer", () => {
    test("should create a player", async () => {
      const playerData = { name: "John Doe" };
      const createdPlayer = { id: 1, ...playerData };
      playerDao.create.mockResolvedValue(createdPlayer);

      const result = await playerService.createPlayer(playerData);

      expect(playerDao.create).toHaveBeenCalledWith(playerData);
      expect(result).toEqual(createdPlayer);
    });

    test("should throw an error if create fails", async () => {
      const playerData = { name: "John Doe" };
      const error = new Error("Create failed");
      playerDao.create.mockRejectedValue(error);

      await expect(playerService.createPlayer(playerData)).rejects.toThrow(
        "Error creating player: Create failed"
      );
    });
  });

  describe("getPlayerById", () => {
    test("should get a player by ID", async () => {
      const playerData = { id: 1, name: "John Doe" };
      playerDao.getById.mockResolvedValue(playerData);

      const result = await playerService.getPlayerById(1);

      expect(playerDao.getById).toHaveBeenCalledWith(1);
      expect(result).toEqual(playerData);
    });

    test("should throw an error if getById fails", async () => {
      const error = new Error("Fetch failed");
      playerDao.getById.mockRejectedValue(error);

      await expect(playerService.getPlayerById(1)).rejects.toThrow(
        "Error fetching player: Fetch failed"
      );
    });
  });
});
