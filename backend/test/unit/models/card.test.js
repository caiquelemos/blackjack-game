import Card from "../../../src/models/card";

describe("Card Class", () => {
  test("should create a valid card", () => {
    const card = new Card("H", "A");
    expect(card.suit).toBe("H");
    expect(card.value).toBe("A");
  });

  test("should throw an error for invalid suit", () => {
    expect(() => {
      new Card("X", "A");
    }).toThrow("Invalid suit: X");
  });

  test("should throw an error for invalid value", () => {
    expect(() => {
      new Card("H", "11");
    }).toThrow("Invalid value: 11");
  });

  test("should get valid suits", () => {
    const validSuits = Card.getValidSuits();
    expect(validSuits).toEqual(["H", "D", "C", "S"]);
  });

  test("should get valid values", () => {
    const validValues = Card.getValidValues();
    expect(validValues).toEqual([
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
    ]);
  });

  test("should validate cards array", () => {
    const cards = [new Card("H", "A"), new Card("D", "10")];
    expect(() => {
      Card.validateCardsAndParseIfTheyHaveCardAttributes(cards);
    }).not.toThrow();
  });

  test("should not throw an error for array that contains objects with Card attributes", () => {
    const cards = [
      new Card("H", "A"),
      { suit: "D", value: "10", discarded: "x" },
    ];
    expect(() => {
      Card.validateCardsAndParseIfTheyHaveCardAttributes(cards);
    }).not.toThrow();
  });

  test("should parse objects for array that contains objects with Card attributes", () => {
    const cards = [
      new Card("H", "A"),
      { suit: "D", value: "10", discarded: "x" },
    ];
    Card.validateCardsAndParseIfTheyHaveCardAttributes(cards);
    expect(cards[1] instanceof Card).toBe(true);
    expect(cards[1]).toEqual({ suit: "D", value: "10" });
  });

  test("should throw an error for invalid cards array", () => {
    const cards = [new Card("H", "A"), { suite: "D", value: "10" }];
    expect(() => {
      Card.validateCardsAndParseIfTheyHaveCardAttributes(cards);
    }).toThrow("Invalid card: Invalid suit: undefined");
  });

  test("should throw an error if cards is not an array", () => {
    expect(() => {
      Card.validateCardsAndParseIfTheyHaveCardAttributes("not an array");
    }).toThrow("Cards should be an array");
  });
});
