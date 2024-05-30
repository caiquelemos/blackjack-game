import Card from "../models/card.js";

class CardDao {
  getAll() {
    const cards = [];
    const validSuits = Card.getValidSuits();
    const validValues = Card.getValidValues();
    if (validSuits && validValues) {
      for (const suit of validSuits) {
        for (const value of validValues) {
          cards.push(new Card(suit, value));
        }
      }
    }
    return cards;
  }
}

export default new CardDao();
