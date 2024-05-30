import cardDao from "../../../src/daos/cardDao";
import Card from "../../../src/models/card";

jest.mock("../../../src/models/card");

describe("CardDao", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getAll", () => {
    test("should get all cards with valid suits and values", () => {
      const validSuits = ["H", "D", "C", "S"];
      const validValues = [
        "A",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "10",
        "J",
        "Q",
        "K",
      ];
      const mockCards = validSuits.flatMap((suit) =>
        validValues.map((value) => new Card(suit, value))
      );

      Card.getValidSuits.mockReturnValue(validSuits);
      Card.getValidValues.mockReturnValue(validValues);

      const result = cardDao.getAll();

      expect(Card.getValidSuits).toHaveBeenCalled();
      expect(Card.getValidValues).toHaveBeenCalled();
      expect(result).toHaveLength(mockCards.length);
      expect(result).toEqual(mockCards);
    });

    test("should return an empty array if no valid suits or values", () => {
      Card.getValidSuits.mockReturnValue([]);
      Card.getValidValues.mockReturnValue([]);

      const result = cardDao.getAll();

      expect(Card.getValidSuits).toHaveBeenCalled();
      expect(Card.getValidValues).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });
});
