import gameDao from "../daos/gameDao.js";
import playerService from "./playerService.js";
import cardService from "./cardService.js";

class GameService {
  static #MAX_POINTS = 21;

  // Dealer must stand on this limit and must draw below this limit
  static #DEALER_HIT_LIMIT_POINTS = 17;

  async createGame(playerId) {
    try {
      const player = await playerService.getPlayerById(playerId);

      const deck = cardService.getShuffledCards();

      if (!(deck?.length > 3)) {
        throw new Error("Only decks with a minimum of 4 cards are accepted");
      }

      const playerCards = [deck.pop(), deck.pop()];
      const dealerExposedCards = [deck.pop()];
      const dealerHiddenCard = deck.pop();
      const gameData = {
        playerId: player.id,
        playerCards,
        dealerExposedCards,
        dealerHiddenCard,
        deck,
      };

      const playerHandValue = cardService.getHandValue(playerCards);
      const dealerExposedHandValue =
        cardService.getHandValue(dealerExposedCards);

      const { id, startTimestamp } = await gameDao.create(gameData);

      return {
        id,
        startTimestamp,
        dealerExposedCards,
        playerCards,
        playerHandValue,
        dealerExposedHandValue,
      };
    } catch (error) {
      throw new Error(`Error creating game: ${error.message}`);
    }
  }

  async findInProgressGameByPlayerId(playerId) {
    try {
      const player = await playerService.getPlayerById(playerId);

      const inProgressGame = await gameDao.findInProgressGameByPlayerId(
        player.id
      );

      if (!inProgressGame) {
        return null;
      }

      const playerHandValue = cardService.getHandValue(
        inProgressGame.playerCards
      );
      const dealerExposedHandValue = cardService.getHandValue(
        inProgressGame.dealerExposedCards
      );

      const { id, startTimestamp, dealerExposedCards, playerCards } =
        inProgressGame;

      return {
        id,
        startTimestamp,
        dealerExposedCards,
        playerCards,
        playerHandValue,
        dealerExposedHandValue,
      };
    } catch (error) {
      throw new Error(
        `Error fetching in-progress games by player ID: ${error.message}`
      );
    }
  }

  async hit(gameId) {
    try {
      const game = await this.#getGameById(gameId);

      if (game.endTimestamp) {
        throw new Error("Game is already finished");
      }

      let playerHandValue = cardService.getHandValue(game.playerCards);

      if (playerHandValue === GameService.#MAX_POINTS) {
        throw new Error("You already have a blackjack! Please stand");
      }

      if (!game.deck?.length) {
        throw new Error("The deck is out of cards! Please stand");
      }

      game.playerCards.push(game.deck.pop());

      const { playerCards, deck } = game;

      const updatedGame = await this.#updateGame(game.id, {
        playerCards,
        deck,
      });

      playerHandValue = cardService.getHandValue(updatedGame.playerCards);

      if (playerHandValue > GameService.#MAX_POINTS) {
        return await this.stand(updatedGame.id);
      }

      const dealerExposedHandValue = cardService.getHandValue(
        game.dealerExposedCards
      );

      const gameDto = {
        id: updatedGame.id,
        startTimestamp: updatedGame.startTimestamp,
        dealerExposedCards: updatedGame.dealerExposedCards,
        playerCards: updatedGame.playerCards,
        dealerExposedHandValue,
        playerHandValue,
      };

      return gameDto;
    } catch (error) {
      throw new Error(`Error in player hit action: ${error.message}`);
    }
  }

  async stand(gameId) {
    try {
      const game = await this.#getGameById(gameId);

      if (game.endTimestamp) {
        throw new Error("Game is already finished");
      }

      const playerHandValue = cardService.getHandValue(game.playerCards);
      let dealerHandValue = cardService.getHandValue([
        ...game.dealerExposedCards,
        game.dealerHiddenCard,
      ]);

      while (
        dealerHandValue < GameService.#DEALER_HIT_LIMIT_POINTS &&
        game.deck?.length
      ) {
        game.dealerExposedCards.push(game.deck.pop());
        dealerHandValue = cardService.getHandValue([
          ...game.dealerExposedCards,
          game.dealerHiddenCard,
        ]);
      }

      game.result = this.#getWinner(playerHandValue, dealerHandValue);
      game.endTimestamp = new Date();
      const dealerExposedHandValue = dealerHandValue;

      const { dealerExposedCards, deck, result, endTimestamp } = game;

      const updatedGame = await this.#updateGame(game.id, {
        dealerExposedCards,
        deck,
        result,
        endTimestamp,
      });

      const gameDto = {
        id: updatedGame.id,
        startTimestamp: updatedGame.startTimestamp,
        dealerExposedCards: updatedGame.dealerExposedCards,
        playerCards: updatedGame.playerCards,
        dealerExposedHandValue,
        playerHandValue,
        result: updatedGame.result,
        endTimestamp: updatedGame.endTimestamp,
        dealerHiddenCard: updatedGame.dealerHiddenCard,
      };

      return gameDto;
    } catch (error) {
      throw new Error(`Error in player stand action: ${error.message}`);
    }
  }

  async #getGameById(gameId) {
    try {
      return await gameDao.getById(gameId);
    } catch (error) {
      throw new Error(`Error fetching game: ${error.message}`);
    }
  }

  async #updateGame(gameId, gameData) {
    try {
      return await gameDao.update(gameId, gameData);
    } catch (error) {
      throw new Error(`Error updating game: ${error.message}`);
    }
  }

  #getWinner(playerHandValue, dealerHandValue) {
    if (
      !Number.isInteger(playerHandValue) ||
      !Number.isInteger(dealerHandValue)
    ) {
      throw new Error(
        "Both playerHandValue and dealerHandValue must be integers"
      );
    }

    const playerBusts = playerHandValue > GameService.#MAX_POINTS;
    const dealerBusts = dealerHandValue > GameService.#MAX_POINTS;

    if (playerBusts && dealerBusts) {
      return "draw";
    } else if (playerBusts) {
      return "loss";
    } else if (dealerBusts) {
      return "winner";
    } else if (playerHandValue > dealerHandValue) {
      return "winner";
    } else if (playerHandValue < dealerHandValue) {
      return "loss";
    } else {
      return "draw";
    }
  }
}

export default new GameService();
