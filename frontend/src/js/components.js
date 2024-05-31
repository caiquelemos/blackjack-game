import spade from "../assets/suit_spade.svg";
import heart from "../assets/suit_heart.svg";
import club from "../assets/suit_club.svg";
import diamond from "../assets/suit_diamond.svg";
import cardFacedown from "../assets/card_facedown.svg";

const suitImages = {
  s: spade,
  h: heart,
  c: club,
  d: diamond,
  facedown: cardFacedown,
};

const createCardElement = (suit, value) => {
  const card = document.createElement("div");
  card.className = `card suit-${suit}`;

  const suitImage = suitImages[suit.toLowerCase()];

  card.innerHTML = `
    <span class="card-value">${value}</span>
    <img src="${suitImage}" alt="${suit}" class="card-suit">
    <span class="card-value">${value}</span>
  `;

  return card;
};

const welcomeModal = new bootstrap.Modal(
  document.getElementById("welcomeModal"),
  {
    backdrop: "static",
    keyboard: false,
  }
);

const gameEndModal = new bootstrap.Modal(
  document.getElementById("gameEndModal"),
  {
    backdrop: "static",
    keyboard: false,
  }
);

export { createCardElement, welcomeModal, gameEndModal };
