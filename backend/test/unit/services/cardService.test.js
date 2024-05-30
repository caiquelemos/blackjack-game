import cardService from "../../../src/services/cardService";
import cardDao from "../../../src/daos/cardDao";
import Card from "../../../src/models/card";

jest.mock("../../../src/daos/cardDao");

describe("CardService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getShuffledCards", () => {
    test("should return shuffled cards", () => {
      const cards = [
        new Card("H", "A"),
        new Card("D", "10"),
        new Card("C", "K"),
        new Card("S", "5"),
      ];
      cardDao.getAll.mockReturnValue(cards);

      const shuffledCards = cardService.getShuffledCards();

      expect(cardDao.getAll).toHaveBeenCalled();
      expect(shuffledCards).toHaveLength(cards.length);
      expect(shuffledCards).toEqual(expect.arrayContaining(cards));
    });
  });

  describe("getHandValue", () => {
    test("should calculate hand value correctly without aces", () => {
      const hand = [new Card("H", "10"), new Card("D", "9")];

      const handValue = cardService.getHandValue(hand);

      expect(handValue).toBe(19);
    });

    test("should calculate hand value correctly with aces as 11", () => {
      const hand = [new Card("H", "A"), new Card("D", "9")];

      const handValue = cardService.getHandValue(hand);

      expect(handValue).toBe(20);
    });

    test("should calculate hand value correctly with aces as 1", () => {
      const hand = [new Card("H", "A"), new Card("D", "9"), new Card("C", "A")];

      const handValue = cardService.getHandValue(hand);

      expect(handValue).toBe(21);
    });

    test("should calculate hand value correctly with face cards", () => {
      const hand = [new Card("H", "K"), new Card("D", "Q"), new Card("C", "J")];

      const handValue = cardService.getHandValue(hand);

      expect(handValue).toBe(30);
    });

    test("should calculate hand value correctly with mixed cards", () => {
      const hand = [new Card("H", "2"), new Card("D", "Q"), new Card("C", "5")];

      const handValue = cardService.getHandValue(hand);

      expect(handValue).toBe(17);
    });
  });
});
