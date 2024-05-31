import {
  createCardElement,
  welcomeModal,
  gameEndModal,
} from "../../../src/js/components";
import { getByAltText, getAllByText } from "@testing-library/dom";

jest.mock("../../../src/assets/suit_spade.svg", () => "spade.svg");
jest.mock("../../../src/assets/suit_heart.svg", () => "heart.svg");
jest.mock("../../../src/assets/suit_club.svg", () => "club.svg");
jest.mock("../../../src/assets/suit_diamond.svg", () => "diamond.svg");
jest.mock("../../../src/assets/card_facedown.svg", () => "card_facedown.svg");

document.body.innerHTML = `
      <div id="welcomeModal" class="modal"></div>
      <div id="gameEndModal" class="modal"></div>
    `;

describe("createCardElement", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  test("should create a card element with the correct suit and value", () => {
    const card = createCardElement("s", "A");
    document.body.appendChild(card);
    expect(card).toHaveClass("card suit-s");
    const elements = getAllByText(card, "A");
    elements.forEach((element) => expect(element).toBeInTheDocument());
    expect(getByAltText(card, "s")).toHaveAttribute("src", "spade.svg");
  });

  test("should create a facedown card element when suit is facedown", () => {
    const card = createCardElement("facedown", "");
    document.body.appendChild(card);
    expect(card).toHaveClass("card suit-facedown");
    expect(getByAltText(card, "facedown")).toHaveAttribute(
      "src",
      "card_facedown.svg"
    );
  });
});

describe("Modals", () => {
  test("should initialize welcomeModal correctly", () => {
    welcomeModal;
    expect(welcomeModal._element).toBe(document.getElementById("welcomeModal"));
    expect(welcomeModal._config.backdrop).toBe("static");
    expect(welcomeModal._config.keyboard).toBe(false);
  });

  test("should initialize gameEndModal correctly", () => {
    expect(gameEndModal._element).toBe(document.getElementById("gameEndModal"));
    expect(gameEndModal._config.backdrop).toBe("static");
    expect(gameEndModal._config.keyboard).toBe(false);
  });
});
