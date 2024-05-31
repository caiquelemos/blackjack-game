const API_BASE_URL = process.env.API_BASE_URL;

async function loginPlayer(name) {
  try {
    const response = await fetch(`${API_BASE_URL}/player/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  } catch (error) {
    console.error("Error logging in player:", error);
    throw error;
  }
}

async function startGame(playerId) {
  try {
    const response = await fetch(`${API_BASE_URL}/game/start`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ playerId }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  } catch (error) {
    console.error("Error starting game:", error);
    throw error;
  }
}

async function hit(gameId) {
  try {
    const response = await fetch(`${API_BASE_URL}/game/hit`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  } catch (error) {
    console.error("Error hitting:", error);
    throw error;
  }
}

async function stand(gameId) {
  try {
    const response = await fetch(`${API_BASE_URL}/game/stand`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ gameId }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  } catch (error) {
    console.error("Error standing:", error);
    throw error;
  }
}
export { loginPlayer, startGame, hit, stand };
