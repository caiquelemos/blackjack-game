import { loginPlayer, startGame, hit, stand } from "../../../src/js/api";

beforeEach(() => {
  fetch.resetMocks();
});

describe("API functions", () => {
  const API_BASE_URL = process.env.API_BASE_URL;

  describe("loginPlayer", () => {
    test("should return player data when login is successful", async () => {
      const mockResponse = { playerId: 1 };
      fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

      const result = await loginPlayer("John Doe");
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/player/login`,
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "John Doe" }),
        })
      );
    });

    test("should throw an error when login fails", async () => {
      const mockError = { error: "Error logging in" };
      fetch.mockResponseOnce(JSON.stringify(mockError), { status: 500 });

      await expect(loginPlayer("John Doe")).rejects.toThrow("Error logging in");
      expect(fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/player/login`,
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: "John Doe" }),
        })
      );
    });
  });

  describe("startGame", () => {
    test("should return game data when start is successful", async () => {
      const mockResponse = { id: 1, startTimestamp: "2024-01-01T00:00:00Z" };
      fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

      const result = await startGame(1);
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/game/start`,
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerId: 1 }),
        })
      );
    });

    test("should throw an error when start fails", async () => {
      const mockError = { error: "Error starting game" };
      fetch.mockResponseOnce(JSON.stringify(mockError), { status: 500 });

      await expect(startGame(1)).rejects.toThrow("Error starting game");
      expect(fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/game/start`,
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playerId: 1 }),
        })
      );
    });
  });

  describe("hit", () => {
    test("should return game data when hit is successful", async () => {
      const mockResponse = { id: 1, playerCards: [], dealerCards: [] };
      fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

      const result = await hit(1);
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/game/hit`,
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gameId: 1 }),
        })
      );
    });

    test("should throw an error when hit fails", async () => {
      const mockError = { error: "Error hitting" };
      fetch.mockResponseOnce(JSON.stringify(mockError), { status: 500 });

      await expect(hit(1)).rejects.toThrow("Error hitting");
      expect(fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/game/hit`,
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gameId: 1 }),
        })
      );
    });
  });

  describe("stand", () => {
    test("should return game data when stand is successful", async () => {
      const mockResponse = { id: 1, result: "win" };
      fetch.mockResponseOnce(JSON.stringify(mockResponse), { status: 200 });

      const result = await stand(1);
      expect(result).toEqual(mockResponse);
      expect(fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/game/stand`,
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gameId: 1 }),
        })
      );
    });

    test("should throw an error when stand fails", async () => {
      const mockError = { error: "Error standing" };
      fetch.mockResponseOnce(JSON.stringify(mockError), { status: 500 });

      await expect(stand(1)).rejects.toThrow("Error standing");
      expect(fetch).toHaveBeenCalledWith(
        `${API_BASE_URL}/game/stand`,
        expect.objectContaining({
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ gameId: 1 }),
        })
      );
    });
  });
});
