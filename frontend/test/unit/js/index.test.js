import { loginPlayer, startGame, hit, stand } from "../../../src/js/api";
import { welcomeModal, gameEndModal } from "../../../src/js/components";
import { renderGame, toggleSpinner } from "../../../src/js/helpers";
import { fireEvent } from "@testing-library/dom";

jest.mock("../../../src/js/api");
jest.mock("../../../src/js/components", () => ({
  welcomeModal: {
    show: jest.fn(),
    hide: jest.fn(),
  },
  gameEndModal: {
    show: jest.fn(),
    hide: jest.fn(),
  },
}));
jest.mock("../../../src/js/helpers");

describe("index.js", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <div id="welcomeModal" class="modal"></div>
      <div id="gameEndModal" class="modal"></div>
      <input id="playerName" />
      <button id="loginButton">Login</button>
      <button id="newGameButton">New Game</button>
      <button id="hitButton">Hit</button>
      <button id="standButton">Stand</button>
      <div id="alerts"></div>
      <div id="dealerCards"></div>
      <div id="playerCards"></div>
      <div id="dealerPoints"></div>
      <div id="playerPoints"></div>
    `;
    sessionStorage.clear();
    require("../../../src/js/index");
    const event = new Event("DOMContentLoaded");
    document.dispatchEvent(event);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should show welcome modal if no playerId in sessionStorage", () => {
    expect(welcomeModal.show).toHaveBeenCalled();
  });

  test("should not show welcome modal if playerId exists in sessionStorage", () => {
    jest.clearAllMocks();
    sessionStorage.setItem("playerId", "1");
    require("../../../src/js/index");
    const event = new Event("DOMContentLoaded");
    document.dispatchEvent(event);
    expect(welcomeModal.show).not.toHaveBeenCalled();
  });

  test("should disable login button if player name input is empty", () => {
    const playerNameInput = document.getElementById("playerName");
    const loginButton = document.getElementById("loginButton");

    fireEvent.input(playerNameInput, { target: { value: "" } });
    expect(loginButton).toBeDisabled();
  });

  test("should enable login button if player name input is not empty", () => {
    const playerNameInput = document.getElementById("playerName");
    const loginButton = document.getElementById("loginButton");

    fireEvent.input(playerNameInput, { target: { value: "John Doe" } });
    expect(loginButton).toBeEnabled();
  });

  test("should call loginPlayer and initializeGame on login", async () => {
    const mockPlayerData = { playerId: 1 };
    loginPlayer.mockResolvedValue(mockPlayerData);
    startGame.mockResolvedValue({
      id: 1,
      dealerExposedCards: [],
      playerCards: [],
    });

    const playerNameInput = document.getElementById("playerName");
    const loginButton = document.getElementById("loginButton");

    fireEvent.input(playerNameInput, { target: { value: "John Doe" } });
    fireEvent.click(loginButton);

    expect(toggleSpinner).toHaveBeenCalledWith(loginButton, true);
    expect(loginPlayer).toHaveBeenCalledWith("John Doe");
    await new Promise(process.nextTick);
    expect(sessionStorage.getItem("playerId")).toBe("1");
    expect(welcomeModal.hide).toHaveBeenCalled();
    expect(toggleSpinner).toHaveBeenCalledWith(loginButton, false);
  });

  it("should trigger login button click on Enter key press in playerName input", async () => {
    const mockPlayerData = { playerId: 1 };
    loginPlayer.mockResolvedValue(mockPlayerData);
    startGame.mockResolvedValue({
      id: 1,
      dealerExposedCards: [],
      playerCards: [],
    });

    const playerNameInput = document.getElementById("playerName");
    const loginButton = document.getElementById("loginButton");

    fireEvent.input(playerNameInput, { target: { value: "John Doe" } });
    fireEvent.keyDown(playerNameInput, { key: "Enter", code: "Enter" });

    expect(toggleSpinner).toHaveBeenCalledWith(loginButton, true);
    expect(loginPlayer).toHaveBeenCalledWith("John Doe");
    await new Promise(process.nextTick);
    expect(sessionStorage.getItem("playerId")).toBe("1");
    expect(welcomeModal.hide).toHaveBeenCalled();
    expect(toggleSpinner).toHaveBeenCalledWith(loginButton, false);
  });

  test("should call startGame and hide gameEndModal on new game", async () => {
    startGame.mockResolvedValue({
      id: 1,
      dealerExposedCards: [],
      playerCards: [],
    });

    const newGameButton = document.getElementById("newGameButton");

    fireEvent.click(newGameButton);

    expect(toggleSpinner).toHaveBeenCalledWith(newGameButton, true);
    await new Promise(process.nextTick);
    expect(gameEndModal.hide).toHaveBeenCalled();
    expect(toggleSpinner).toHaveBeenCalledWith(newGameButton, false);
  });

  test("should call hit and render game on hitButton click", async () => {
    const mockGameData = { dealerExposedCards: [], playerCards: [] };
    hit.mockResolvedValue(mockGameData);

    sessionStorage.setItem("gameId", "1");
    const hitButton = document.getElementById("hitButton");
    const standButton = document.getElementById("standButton");

    fireEvent.click(hitButton);

    expect(toggleSpinner).toHaveBeenCalledWith(hitButton, true);
    expect(standButton).toBeDisabled();
    await new Promise(process.nextTick);
    expect(hit).toHaveBeenCalledWith("1");
    expect(renderGame).toHaveBeenCalledWith(mockGameData);
    expect(toggleSpinner).toHaveBeenCalledWith(hitButton, false);
    expect(standButton).toBeEnabled();
  });

  test("should call stand and render game on standButton click", async () => {
    const mockGameData = { dealerExposedCards: [], playerCards: [] };
    stand.mockResolvedValue(mockGameData);

    sessionStorage.setItem("gameId", "1");
    const standButton = document.getElementById("standButton");
    const hitButton = document.getElementById("hitButton");

    fireEvent.click(standButton);

    expect(toggleSpinner).toHaveBeenCalledWith(standButton, true);
    expect(hitButton).toBeDisabled();
    await new Promise(process.nextTick);
    expect(stand).toHaveBeenCalledWith("1");
    expect(renderGame).toHaveBeenCalledWith(mockGameData);
    expect(toggleSpinner).toHaveBeenCalledWith(standButton, false);
    expect(hitButton).toBeEnabled();
  });
});
