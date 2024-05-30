import Game from "../../../src/models/game";
import Card from "../../../src/models/card";

jest.mock("../../../src/models/card");

describe("Game Model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should create a valid game instance", () => {
    const gameData = {
      playerId: 1,
      deck: [{ suit: "H", value: "A" }],
      dealerExposedCards: [{ suit: "D", value: "10" }],
      dealerHiddenCard: { suit: "C", value: "5" },
      playerCards: [{ suit: "S", value: "K" }],
    };

    const game = Game.build(gameData);

    expect(game.playerId).toBe(1);
    expect(game.deck).toEqual([{ suit: "H", value: "A" }]);
    expect(game.dealerExposedCards).toEqual([{ suit: "D", value: "10" }]);
    expect(game.dealerHiddenCard).toEqual({ suit: "C", value: "5" });
    expect(game.playerCards).toEqual([{ suit: "S", value: "K" }]);
  });

  test("should throw an error for invalid result", async () => {
    const gameData = {
      playerId: 1,
      result: "invalid",
      deck: [{ suit: "H", value: "A" }],
      dealerExposedCards: [{ suit: "D", value: "10" }],
      dealerHiddenCard: { suit: "C", value: "5" },
      playerCards: [{ suit: "S", value: "K" }],
    };

    await expect(Game.build(gameData).validate()).rejects.toThrow(
      "Validation error: Result must be one of: winner, draw, loss"
    );
  });

  test("should throw an error for invalid deck", async () => {
    const gameData = {
      playerId: 1,
      deck: [{ suit: "X", value: "A" }],
      dealerExposedCards: [{ suit: "D", value: "10" }],
      dealerHiddenCard: { suit: "C", value: "5" },
      playerCards: [{ suit: "S", value: "K" }],
    };

    Card.validateCardsAndParseIfTheyHaveCardAttributes.mockImplementation(
      () => {
        throw new Error("Invalid suit: X");
      }
    );

    await expect(Game.build(gameData).validate()).rejects.toThrow(
      "Invalid suit: X"
    );
  });

  test("should throw an error for invalid dealer exposed cards", async () => {
    const gameData = {
      playerId: 1,
      deck: [{ suit: "H", value: "A" }],
      dealerExposedCards: [{ suit: "X", value: "10" }],
      dealerHiddenCard: { suit: "C", value: "5" },
      playerCards: [{ suit: "S", value: "K" }],
    };

    Card.validateCardsAndParseIfTheyHaveCardAttributes.mockImplementation(
      () => {
        throw new Error("Invalid suit: X");
      }
    );

    await expect(Game.build(gameData).validate()).rejects.toThrow(
      "Invalid suit: X"
    );
  });

  test("should throw an error for invalid dealer hidden card", async () => {
    const gameData = {
      playerId: 1,
      deck: [{ suit: "H", value: "A" }],
      dealerExposedCards: [{ suit: "D", value: "10" }],
      dealerHiddenCard: { suit: "X", value: "5" },
      playerCards: [{ suit: "S", value: "K" }],
    };

    Card.validateCardsAndParseIfTheyHaveCardAttributes.mockImplementation(
      () => {
        throw new Error("Invalid suit: X");
      }
    );

    await expect(Game.build(gameData).validate()).rejects.toThrow(
      "Invalid suit: X"
    );
  });

  test("should throw an error for invalid player cards", async () => {
    const gameData = {
      playerId: 1,
      deck: [{ suit: "H", value: "A" }],
      dealerExposedCards: [{ suit: "D", value: "10" }],
      dealerHiddenCard: { suit: "C", value: "5" },
      playerCards: [{ suit: "X", value: "K" }],
    };

    Card.validateCardsAndParseIfTheyHaveCardAttributes.mockImplementation(
      () => {
        throw new Error("Invalid suit: X");
      }
    );

    await expect(Game.build(gameData).validate()).rejects.toThrow(
      "Invalid suit: X"
    );
  });
});
