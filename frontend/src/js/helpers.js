import { createCardElement, gameEndModal } from "./components.js";

function renderGame(data) {
  const dealerCardsContainer = document.getElementById("dealerCards");
  dealerCardsContainer.innerHTML = "";
  data.dealerExposedCards.forEach((card) => {
    dealerCardsContainer.appendChild(createCardElement(card.suit, card.value));
  });
  if (data.dealerHiddenCard) {
    dealerCardsContainer.appendChild(
      createCardElement(data.dealerHiddenCard.suit, data.dealerHiddenCard.value)
    );
  } else {
    dealerCardsContainer.appendChild(createCardElement("facedown", ""));
  }

  const playerCardsContainer = document.getElementById("playerCards");
  playerCardsContainer.innerHTML = "";
  data.playerCards.forEach((card) => {
    playerCardsContainer.appendChild(createCardElement(card.suit, card.value));
  });

  document.getElementById(
    "dealerPoints"
  ).textContent = `Dealer's Points: ${data.dealerExposedHandValue}`;
  document.getElementById(
    "playerPoints"
  ).textContent = `Your Points: ${data.playerHandValue}`;
}

function showAlert(type, message) {
  const alertContainer = document.getElementById("alerts");
  const alert = document.createElement("div");
  alert.className = `alert alert-${type}`;
  alert.textContent = message;
  alertContainer.appendChild(alert);
  setTimeout(() => alert.remove(), 3000);
}

function showGameEndModal(data) {
  document.getElementById("gameEndMessage").textContent = getEndMessage(
    data.result
  );
  document.getElementById("gameDuration").textContent =
    formatGameDurationToMinutesAndSeconds(
      data.endTimestamp,
      data.startTimestamp
    );
  gameEndModal.show();
}

function getEndMessage(result) {
  switch (result) {
    case "winner":
      return "Congratulations, you won! Play again!";
    case "loss":
      return "Sorry, you lost. Try again!";
    case "draw":
      return "It's a draw. Play again!";
    default:
      return "";
  }
}

function handleError(error, action) {
  if (error.message.includes("You already have a blackjack!")) {
    showAlert("danger", "You already have a blackjack! Please stand.");
  } else if (error.message.includes("The deck is out of cards!")) {
    showAlert("danger", "The deck is out of cards! Please stand.");
  } else {
    showAlert("danger", `Error performing ${action}. Please try again later.`);
  }
}

function toggleSpinner(button, show) {
  const spinner = button.querySelector(".spinner-border");
  if (show) {
    spinner.style.display = "inline-block";
    button.disabled = true;
  } else {
    spinner.style.display = "none";
    button.disabled = false;
  }
}

function formatGameDurationToMinutesAndSeconds(endTimestamp, startTimestamp) {
  const duration = new Date(endTimestamp) - new Date(startTimestamp);
  const minutes = Math.floor(duration / 60000);
  const seconds = Math.floor((duration % 60000) / 1000);
  const minutesText = minutes > 0 ? `${minutes} minute(s)` : "";
  const secondsText = seconds > 0 ? `${seconds} second(s)` : "";

  return `${minutesText} ${secondsText}`;
}

export {
  renderGame,
  showAlert,
  showGameEndModal,
  getEndMessage,
  handleError,
  toggleSpinner,
  formatGameDurationToMinutesAndSeconds,
};
