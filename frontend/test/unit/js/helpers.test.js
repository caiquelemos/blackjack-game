import {
  renderGame,
  showAlert,
  showGameEndModal,
  getEndMessage,
  handleError,
  toggleSpinner,
  formatGameDurationToMinutesAndSeconds,
} from "../../../src/js/helpers";
import { gameEndModal, createCardElement } from "../../../src/js/components";
import { getByText } from "@testing-library/dom";

jest.mock("../../../src/assets/suit_spade.svg", () => "spade.svg");
jest.mock("../../../src/assets/suit_heart.svg", () => "heart.svg");
jest.mock("../../../src/assets/suit_club.svg", () => "club.svg");
jest.mock("../../../src/assets/suit_diamond.svg", () => "diamond.svg");
jest.mock("../../../src/assets/card_facedown.svg", () => "card_facedown.svg");

const mockDocument = document;

jest.mock("../../../src/js/components", () => ({
  ...jest.requireActual("../../../src/js/components"),
  createCardElement: jest.fn((suit, value) => {
    const card = mockDocument.createElement("div");
    card.className = `card suit-${suit}`;
    card.dataset.suit = suit;
    card.dataset.value = value;
    return card;
  }),
  gameEndModal: {
    show: jest.fn(),
  },
}));

describe("renderGame", () => {
  beforeEach(() => {
    document.body.innerHTML = `
        <div id="dealerCards"></div>
        <div id="playerCards"></div>
        <div id="dealerPoints"></div>
        <div id="playerPoints"></div>
      `;
  });

  const mockData = {
    dealerExposedCards: [{ suit: "s", value: "A" }],
    dealerHiddenCard: { suit: "h", value: "10" },
    playerCards: [
      { suit: "c", value: "2" },
      { suit: "d", value: "3" },
    ],
    dealerExposedHandValue: 11,
    playerHandValue: 5,
  };

  test("renders dealer and player cards correctly", () => {
    renderGame(mockData);

    const dealerCardsContainer = document.getElementById("dealerCards");
    const playerCardsContainer = document.getElementById("playerCards");

    expect(dealerCardsContainer.childElementCount).toBe(2);
    expect(playerCardsContainer.childElementCount).toBe(2);

    expect(createCardElement).toHaveBeenCalledWith("s", "A");
    expect(createCardElement).toHaveBeenCalledWith("h", "10");
    expect(createCardElement).toHaveBeenCalledWith("c", "2");
    expect(createCardElement).toHaveBeenCalledWith("d", "3");
  });

  test("updates points correctly", () => {
    renderGame(mockData);

    const dealerPoints = document.getElementById("dealerPoints");
    const playerPoints = document.getElementById("playerPoints");

    expect(dealerPoints).toHaveTextContent("Dealer's Points: 11");
    expect(playerPoints).toHaveTextContent("Your Points: 5");
  });
});

describe("showAlert", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="alerts"></div>';
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("displays and removes alert", () => {
    showAlert("success", "Test message");

    const alertContainer = document.getElementById("alerts");
    const alert = getByText(alertContainer, "Test message");

    expect(alert).toBeInTheDocument();
    expect(alert).toHaveClass("alert alert-success");

    jest.runAllTimers();
    expect(alert).not.toBeInTheDocument();
  });
});

describe("showGameEndModal", () => {
  beforeEach(() => {
    document.body.innerHTML = `
        <div id="gameEndMessage"></div>
        <div id="gameDuration"></div>
      `;
  });

  test("displays the correct end message and duration", () => {
    const mockData = {
      result: "winner",
      endTimestamp: new Date().toISOString(),
      startTimestamp: new Date(Date.now() - 60001).toISOString(),
    };

    showGameEndModal(mockData);

    const gameEndMessage = document.getElementById("gameEndMessage");
    const gameDuration = document.getElementById("gameDuration");

    expect(gameEndMessage).toHaveTextContent(
      "Congratulations, you won! Play again!"
    );
    expect(gameDuration).toHaveTextContent("1 minute(s)");

    expect(gameEndModal.show).toHaveBeenCalled();
  });
});

describe("getEndMessage", () => {
  test("returns correct messages based on result", () => {
    expect(getEndMessage("winner")).toBe(
      "Congratulations, you won! Play again!"
    );
    expect(getEndMessage("loss")).toBe("Sorry, you lost. Try again!");
    expect(getEndMessage("draw")).toBe("It's a draw. Play again!");
    expect(getEndMessage("unknown")).toBe("");
  });
});

describe("handleError", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div id="alerts"></div>';
  });

  test("shows correct alert messages based on error", () => {
    handleError(new Error("You already have a blackjack!"), "hit");
    expect(
      getByText(
        document.getElementById("alerts"),
        "You already have a blackjack! Please stand."
      )
    ).toBeInTheDocument();

    handleError(new Error("The deck is out of cards!"), "hit");
    expect(
      getByText(
        document.getElementById("alerts"),
        "The deck is out of cards! Please stand."
      )
    ).toBeInTheDocument();

    handleError(new Error("Some other error"), "hit");
    expect(
      getByText(
        document.getElementById("alerts"),
        "Error performing hit. Please try again later."
      )
    ).toBeInTheDocument();
  });
});

describe("toggleSpinner", () => {
  test("toggles the spinner visibility and button state", () => {
    document.body.innerHTML = `
        <button id="testButton">
          <span class="spinner-border" style="display: none;"></span>
          Test Button
        </button>
      `;

    const button = document.getElementById("testButton");
    const spinner = button.querySelector(".spinner-border");

    toggleSpinner(button, true);
    expect(spinner).toBeVisible();
    expect(button).toBeDisabled();

    toggleSpinner(button, false);
    expect(spinner).not.toBeVisible();
    expect(button).toBeEnabled();
  });
});

describe("formatGameDurationToMinutesAndSeconds", () => {
  test("formats duration correctly", () => {
    const endTimestamp = new Date().toISOString();
    const startTimestamp = new Date(Date.now() - 90000).toISOString();

    const formattedDuration = formatGameDurationToMinutesAndSeconds(
      endTimestamp,
      startTimestamp
    );
    expect(formattedDuration).toBe("1 minute(s) 30 second(s)");
  });
});
