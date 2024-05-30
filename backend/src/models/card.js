class Card {
  static #validSuits = ["H", "D", "C", "S"];
  static #validValues = [
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

  constructor(suit, value) {
    Card.#validateSuitAndValue(suit, value);
    this.suit = suit;
    this.value = value;
  }

  static getValidSuits() {
    return [...this.#validSuits];
  }

  static getValidValues() {
    return [...this.#validValues];
  }

  static validateCardsAndParseIfTheyHaveCardAttributes(cards) {
    if (!Array.isArray(cards)) {
      throw new Error("Cards should be an array");
    }
    try {
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        cards[i] = new Card(card.suit, card.value);
      }
    } catch (error) {
      throw new Error(`Invalid card: ${error.message}`);
    }
  }

  static #validateSuitAndValue(suit, value) {
    if (!Card.#validSuits.includes(suit)) {
      throw new Error(`Invalid suit: ${suit}`);
    }
    if (!Card.#validValues.includes(value)) {
      throw new Error(`Invalid value: ${value}`);
    }
  }
}

export default Card;
