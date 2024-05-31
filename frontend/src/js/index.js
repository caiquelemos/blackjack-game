import { loginPlayer, startGame, hit, stand } from "./api.js";
import { welcomeModal, gameEndModal } from "./components.js";
import {
  renderGame,
  showAlert,
  showGameEndModal,
  handleError,
  toggleSpinner,
} from "./helpers.js";

document.addEventListener("DOMContentLoaded", () => {
  const playerId = sessionStorage.getItem("playerId");

  if (!playerId) {
    welcomeModal.show();
  }

  const playerNameInput = document.getElementById("playerName");
  const loginButton = document.getElementById("loginButton");
  const newGameButton = document.getElementById("newGameButton");
  const hitButton = document.getElementById("hitButton");
  const standButton = document.getElementById("standButton");

  playerNameInput.addEventListener("input", () => {
    loginButton.disabled = playerNameInput.value.trim() === "";
  });

  loginButton.addEventListener("click", async () => {
    const playerName = playerNameInput.value.trim();
    toggleSpinner(loginButton, true);
    try {
      const data = await loginPlayer(playerName);
      sessionStorage.setItem("playerId", data.playerId);
      await initializeGame();
      welcomeModal.hide();
    } catch (error) {
      showAlert("danger", "Error logging in. Please try again later.");
    } finally {
      toggleSpinner(loginButton, false);
    }
  });

  newGameButton.addEventListener("click", async () => {
    toggleSpinner(newGameButton, true);
    try {
      await initializeGame();
      gameEndModal.hide();
    } catch (error) {
      showAlert("danger", "Error logging in. Please try again later.");
    } finally {
      toggleSpinner(newGameButton, false);
    }
  });

  hitButton.addEventListener("click", async () => {
    toggleSpinner(hitButton, true);
    standButton.disabled = true;
    try {
      const gameId = sessionStorage.getItem("gameId");
      const data = await hit(gameId);
      renderGame(data);
      if (data.result) showGameEndModal(data);
    } catch (error) {
      handleError(error, "hit");
    } finally {
      toggleSpinner(hitButton, false);
      standButton.disabled = false;
    }
  });

  standButton.addEventListener("click", async () => {
    toggleSpinner(standButton, true);
    hitButton.disabled = true;
    try {
      const gameId = sessionStorage.getItem("gameId");
      const data = await stand(gameId);
      renderGame(data);
      if (data.result) showGameEndModal(data);
    } catch (error) {
      handleError(error, "stand");
    } finally {
      toggleSpinner(standButton, false);
      hitButton.disabled = false;
    }
  });

  async function initializeGame() {
    try {
      const playerId = sessionStorage.getItem("playerId");
      const data = await startGame(playerId);
      sessionStorage.setItem("gameId", data.id);
      renderGame(data);
      showAlert("success", "Good luck and have fun!");
    } catch (error) {
      showAlert("danger", "Error starting game. Please try again later.");
    }
  }

  loginButton.disabled = true;

  if (playerId) {
    initializeGame();
  }
});
