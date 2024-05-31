import fs from "fs";
import path from "path";
import {
  fireEvent,
  getByText,
  getByPlaceholderText,
  waitFor,
} from "@testing-library/dom";

jest.mock("../../src/assets/suit_spade.svg", () => "spade.svg");
jest.mock("../../src/assets/suit_heart.svg", () => "heart.svg");
jest.mock("../../src/assets/suit_club.svg", () => "club.svg");
jest.mock("../../src/assets/suit_diamond.svg", () => "diamond.svg");
jest.mock("../../src/assets/card_facedown.svg", () => "card_facedown.svg");

const html = fs.readFileSync(
  path.resolve(__dirname, "../../src/index.html"),
  "utf8"
);

beforeEach(() => {
  fetch.resetMocks();
});

describe("Blackjack Game Integration Test", () => {
  beforeEach(() => {
    document.documentElement.innerHTML = html;
    sessionStorage.clear();
    require("../../src/js/index");
  });

  afterEach(() => {
    document.documentElement.innerHTML = "";
  });

  const triggerDOMContentLoaded = () => {
    const event = new Event("DOMContentLoaded");
    document.dispatchEvent(event);
  };

  test("should show welcome modal if no playerId in sessionStorage", () => {
    triggerDOMContentLoaded();
    const welcomeModal = document.getElementById("welcomeModal");
    expect(welcomeModal).toBeInTheDocument();
  });

  test("should enable login button if player name input is not empty", async () => {
    triggerDOMContentLoaded();
    const playerNameInput = getByPlaceholderText(
      document.body,
      "Enter your name"
    );
    const loginButton = getByText(document.body, "Login");

    expect(loginButton).toBeDisabled();
    fireEvent.input(playerNameInput, { target: { value: "John Doe" } });
    expect(loginButton).toBeEnabled();
  });

  test("should call loginPlayer and initializeGame on login", async () => {
    fetch.mockResponseOnce(JSON.stringify({ playerId: 1 }));
    fetch.mockResponseOnce(
      JSON.stringify({
        id: 1,
        startTimestamp: new Date().toISOString(),
        dealerExposedCards: [],
        playerCards: [],
        playerHandValue: 0,
        dealerExposedHandValue: 0,
      })
    );

    triggerDOMContentLoaded();
    const playerNameInput = getByPlaceholderText(
      document.body,
      "Enter your name"
    );
    const loginButton = getByText(document.body, "Login");

    fireEvent.input(playerNameInput, { target: { value: "John Doe" } });
    fireEvent.click(loginButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/player/login"),
        expect.any(Object)
      );
      expect(sessionStorage.getItem("playerId")).toBe("1");
    });
  });

  test("should call startGame and hide gameEndModal on new game", async () => {
    sessionStorage.setItem("playerId", "1");
    fetch.mockResponseOnce(
      JSON.stringify({
        id: 1,
        startTimestamp: new Date().toISOString(),
        dealerExposedCards: [],
        playerCards: [],
        playerHandValue: 0,
        dealerExposedHandValue: 0,
      })
    );

    triggerDOMContentLoaded();
    const newGameButton = getByText(document.body, "New Game");

    fireEvent.click(newGameButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/game/start"),
        expect.any(Object)
      );
      expect(sessionStorage.getItem("gameId")).toBe("1");
    });
  });

  test("should call hit and render game on hitButton click", async () => {
    sessionStorage.setItem("playerId", "1");
    sessionStorage.setItem("gameId", "1");
    fetch.mockResponseOnce(
      JSON.stringify({
        id: 1,
        startTimestamp: new Date().toISOString(),
        dealerExposedCards: [],
        playerCards: [{ suit: "hearts", value: "2" }],
        playerHandValue: 2,
        dealerExposedHandValue: 0,
      })
    );

    triggerDOMContentLoaded();
    const hitButton = getByText(document.body, "Hit");

    fireEvent.click(hitButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/game/hit"),
        expect.any(Object)
      );
      expect(getByText(document.body, "Your Points: 2")).toBeInTheDocument();
    });
  });

  test("should call stand and render game on standButton click", async () => {
    sessionStorage.setItem("playerId", "1");
    sessionStorage.setItem("gameId", "1");
    fetch.mockResponseOnce(
      JSON.stringify({
        id: 1,
        startTimestamp: new Date().toISOString(),
        dealerExposedCards: [],
        playerCards: [],
        playerHandValue: 2,
        dealerExposedHandValue: 0,
        result: "winner",
        endTimestamp: new Date().toISOString(),
      })
    );

    triggerDOMContentLoaded();
    const standButton = getByText(document.body, "Stand");

    fireEvent.click(standButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("/game/stand"),
        expect.any(Object)
      );
      expect(getByText(document.body, "Your Points: 2")).toBeInTheDocument();
    });
  });
});
