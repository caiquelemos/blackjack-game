import Player from "../../../src/models/player";

describe("Player Model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should create a valid player instance", () => {
    const playerData = {
      name: "John Doe",
    };

    const player = Player.build(playerData);

    expect(player.name).toBe("John Doe");
  });

  test("should throw an error for empty name", async () => {
    const playerData = {
      name: "",
    };

    await expect(Player.build(playerData).validate()).rejects.toThrow(
      "Validation error: Player name cannot be empty"
    );
  });

  test("should throw an error for null name", async () => {
    const playerData = {
      name: null,
    };

    await expect(Player.build(playerData).validate()).rejects.toThrow(
      "notNull Violation: Player.name cannot be null"
    );
  });
});
