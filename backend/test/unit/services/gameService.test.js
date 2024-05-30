import gameService from "../../../src/services/gameService";
import gameDao from "../../../src/daos/gameDao";
import playerService from "../../../src/services/playerService";
import cardService from "../../../src/services/cardService";

jest.mock("../../../src/daos/gameDao");
jest.mock("../../../src/services/playerService");
jest.mock("../../../src/services/cardService");

describe("GameService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createGame", () => {
    test("should create a game successfully", async () => {
      const player = { id: 1, name: "John Doe" };
      playerService.getPlayerById.mockResolvedValue(player);

      const deck = [
        { suit: "H", value: "A" },
        { suit: "H", value: "2" },
        { suit: "H", value: "3" },
        { suit: "H", value: "4" },
      ];
      cardService.getShuffledCards.mockReturnValue(deck);

      const gameData = {
        playerId: player.id,
        playerCards: [deck[3], deck[2]],
        dealerExposedCards: [deck[1]],
        dealerHiddenCard: deck[0],
        deck: [],
      };

      gameDao.create.mockResolvedValue({
        id: 1,
        startTimestamp: new Date(),
        ...gameData,
      });

      const result = await gameService.createGame(player.id);

      expect(playerService.getPlayerById).toHaveBeenCalledWith(player.id);
      expect(cardService.getShuffledCards).toHaveBeenCalled();
      expect(gameDao.create).toHaveBeenCalledWith(gameData);
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("startTimestamp");
      expect(result).toHaveProperty("dealerExposedCards");
      expect(result).toHaveProperty("playerCards");
      expect(result).toHaveProperty("playerHandValue");
      expect(result).toHaveProperty("dealerExposedHandValue");
    });

    test("should throw an error if deck has less than 4 cards", async () => {
      const player = { id: 1, name: "John Doe" };
      playerService.getPlayerById.mockResolvedValue(player);

      const deck = [
        { suit: "H", value: "A" },
        { suit: "H", value: "2" },
      ];
      cardService.getShuffledCards.mockReturnValue(deck);

      await expect(gameService.createGame(player.id)).rejects.toThrow(
        "Only decks with a minimum of 4 cards are accepted"
      );
    });
  });

  describe("findInProgressGameByPlayerId", () => {
    test("should find an in-progress game by player ID", async () => {
      const player = { id: 1, name: "John Doe" };
      const inProgressGame = {
        id: 1,
        playerId: player.id,
        playerCards: [{ suit: "H", value: "A" }],
        dealerExposedCards: [{ suit: "D", value: "10" }],
        dealerHiddenCard: { suit: "C", value: "5" },
        deck: [],
        endTimestamp: null,
      };

      playerService.getPlayerById.mockResolvedValue(player);
      gameDao.findInProgressGameByPlayerId.mockResolvedValue(inProgressGame);
      cardService.getHandValue.mockReturnValueOnce(11).mockReturnValueOnce(10);

      const result = await gameService.findInProgressGameByPlayerId(player.id);

      expect(playerService.getPlayerById).toHaveBeenCalledWith(player.id);
      expect(gameDao.findInProgressGameByPlayerId).toHaveBeenCalledWith(
        player.id
      );
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("startTimestamp");
      expect(result).toHaveProperty("dealerExposedCards");
      expect(result).toHaveProperty("playerCards");
      expect(result).toHaveProperty("playerHandValue");
      expect(result).toHaveProperty("dealerExposedHandValue");
    });

    test("should return null if no in-progress game is found", async () => {
      const player = { id: 1, name: "John Doe" };

      playerService.getPlayerById.mockResolvedValue(player);
      gameDao.findInProgressGameByPlayerId.mockResolvedValue(null);

      const result = await gameService.findInProgressGameByPlayerId(player.id);

      expect(playerService.getPlayerById).toHaveBeenCalledWith(player.id);
      expect(gameDao.findInProgressGameByPlayerId).toHaveBeenCalledWith(
        player.id
      );
      expect(result).toBeNull();
    });
  });

  describe("hit", () => {
    test("should add a card to the player's hand and return the updated game state", async () => {
      const game = {
        id: 1,
        playerId: 1,
        playerCards: [
          { suit: "H", value: "5" },
          { suit: "H", value: "7" },
        ],
        dealerExposedCards: [{ suit: "D", value: "10" }],
        dealerHiddenCard: { suit: "C", value: "5" },
        deck: [{ suit: "H", value: "6" }],
        endTimestamp: null,
      };

      gameDao.getById.mockResolvedValue(game);
      cardService.getHandValue
        .mockReturnValueOnce(12)
        .mockReturnValueOnce(18)
        .mockReturnValueOnce(10);
      gameDao.update.mockResolvedValue({
        ...game,
        playerCards: [...game.playerCards, game.deck[0]],
        deck: [],
      });

      const result = await gameService.hit(game.id);

      expect(gameDao.getById).toHaveBeenCalledWith(game.id);
      expect(cardService.getHandValue).toHaveBeenCalledTimes(3);
      expect(gameDao.update).toHaveBeenCalledWith(game.id, {
        playerCards: [...game.playerCards, game.deck[0]],
        deck: [],
      });
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("startTimestamp");
      expect(result).toHaveProperty("dealerExposedCards");
      expect(result).toHaveProperty("playerCards");
      expect(result).toHaveProperty("dealerExposedHandValue");
      expect(result).toHaveProperty("playerHandValue");
    });

    test("should throw an error if the game is already finished", async () => {
      const game = {
        id: 1,
        playerId: 1,
        endTimestamp: new Date(),
      };

      gameDao.getById.mockResolvedValue(game);

      await expect(gameService.hit(game.id)).rejects.toThrow(
        "Game is already finished"
      );
    });

    test("should throw an error if the player already has a blackjack", async () => {
      const game = {
        id: 1,
        playerId: 1,
        playerCards: [
          { suit: "H", value: "A" },
          { suit: "H", value: "K" },
        ],
        endTimestamp: null,
      };

      gameDao.getById.mockResolvedValue(game);
      cardService.getHandValue.mockReturnValue(21);

      await expect(gameService.hit(game.id)).rejects.toThrow(
        "You already have a blackjack! Please stand"
      );
    });

    test("should throw an error if the deck is out of cards", async () => {
      const game = {
        id: 1,
        playerId: 1,
        playerCards: [
          { suit: "H", value: "5" },
          { suit: "H", value: "7" },
        ],
        deck: [],
        endTimestamp: null,
      };

      gameDao.getById.mockResolvedValue(game);
      cardService.getHandValue.mockReturnValue(12);

      await expect(gameService.hit(game.id)).rejects.toThrow(
        "The deck is out of cards! Please stand"
      );
    });

    test("should call stand if player's hand value exceeds 21", async () => {
      const game = {
        id: 1,
        playerId: 1,
        playerCards: [
          { suit: "H", value: "10" },
          { suit: "H", value: "7" },
        ],
        deck: [{ suit: "H", value: "6" }],
        endTimestamp: null,
      };

      gameDao.getById.mockResolvedValue(game);
      cardService.getHandValue.mockReturnValueOnce(17).mockReturnValueOnce(23);

      const gameServiceStandSpy = jest
        .spyOn(gameService, "stand")
        .mockImplementation();

      await gameService.hit(game.id);

      expect(gameServiceStandSpy).toHaveBeenCalledWith(game.id);

      gameServiceStandSpy.mockRestore();
    });
  });

  describe("stand", () => {
    test("should finish the game and return the final game state", async () => {
      const game = {
        id: 1,
        playerId: 1,
        playerCards: [
          { suit: "H", value: "10" },
          { suit: "H", value: "7" },
        ],
        dealerExposedCards: [{ suit: "D", value: "10" }],
        dealerHiddenCard: { suit: "C", value: "5" },
        deck: [{ suit: "H", value: "10" }],
        endTimestamp: null,
      };

      gameDao.getById.mockResolvedValue(game);
      cardService.getHandValue
        .mockReturnValueOnce(17)
        .mockReturnValueOnce(15)
        .mockReturnValueOnce(25);
      gameDao.update.mockResolvedValue({
        ...game,
        dealerExposedCards: [
          ...game.dealerExposedCards,
          { suit: "H", value: "10" },
        ],
        endTimestamp: new Date(),
        result: "winner",
      });

      const result = await gameService.stand(game.id);

      expect(gameDao.getById).toHaveBeenCalledWith(game.id);
      expect(cardService.getHandValue).toHaveBeenCalledTimes(3);
      expect(gameDao.update).toHaveBeenCalled();
      expect(result).toHaveProperty("id");
      expect(result).toHaveProperty("startTimestamp");
      expect(result).toHaveProperty("result");
      expect(result).toHaveProperty("dealerExposedCards");
      expect(result).toHaveProperty("playerCards");
      expect(result).toHaveProperty("dealerExposedHandValue");
      expect(result).toHaveProperty("playerHandValue");
    });

    test("should throw an error if the game is already finished", async () => {
      const game = {
        id: 1,
        playerId: 1,
        endTimestamp: new Date(),
      };

      gameDao.getById.mockResolvedValue(game);

      await expect(gameService.stand(game.id)).rejects.toThrow(
        "Game is already finished"
      );
    });
  });
});
