import cardDao from "../daos/cardDao.js";

class CardService {
  getShuffledCards() {
    const cards = cardDao.getAll();
    this.#shuffle(cards);
    return cards;
  }

  getHandValue(hand) {
    let value = 0;
    let aceCount = 0;

    for (const card of hand) {
      if (card.value === "A") {
        aceCount++;
        value += 11;
      } else if (["K", "Q", "J"].includes(card.value)) {
        value += 10;
      } else {
        value += parseInt(card.value, 10);
      }
    }

    while (value > 21 && aceCount > 0) {
      value -= 10;
      aceCount--;
    }

    return value;
  }

  #shuffle(cards) {
    for (let i = cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
  }
}

export default new CardService();
