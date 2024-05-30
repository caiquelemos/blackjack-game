import request from "supertest";
import sequelize from "../../src/database/config";
import bootstrap from "../../src/bootstrap";

describe("API Integration Tests", () => {
  let server;

  beforeAll(async () => {
    process.env.NODE_ENV = "test";
    server = await bootstrap();
  });

  afterAll(async () => {
    await sequelize.close();
    server.close();
  });

  describe("Player Endpoints", () => {
    test("should create a new player and return the player id", async () => {
      const response = await request(server)
        .post("/api/v1/player/login")
        .send({ name: "John Doe" });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("playerId");
    });

    test("should login an existing player and return the player id", async () => {
      await request(server)
        .post("/api/v1/player/login")
        .send({ name: "John Doe" });

      const response = await request(server)
        .post("/api/v1/player/login")
        .send({ name: "John Doe" });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("playerId");
    });
  });

  describe("Game Endpoints", () => {
    let playerId;

    beforeAll(async () => {
      const response = await request(server)
        .post("/api/v1/player/login")
        .send({ name: "Jane Doe" });

      playerId = response.body.playerId;
    });

    test("should start a new game and return game data", async () => {
      const response = await request(server)
        .post("/api/v1/game/start")
        .send({ playerId });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("startTimestamp");
      expect(response.body).toHaveProperty("dealerExposedCards");
      expect(response.body).toHaveProperty("playerCards");
      expect(response.body).toHaveProperty("playerHandValue");
      expect(response.body).toHaveProperty("dealerExposedHandValue");
    });

    test("should return an existing in-progress game", async () => {
      await request(server).post("/api/v1/game/start").send({ playerId });

      const response = await request(server)
        .post("/api/v1/game/start")
        .send({ playerId });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("startTimestamp");
      expect(response.body).toHaveProperty("dealerExposedCards");
      expect(response.body).toHaveProperty("playerCards");
      expect(response.body).toHaveProperty("playerHandValue");
      expect(response.body).toHaveProperty("dealerExposedHandValue");
    });

    test("should hit and return the updated game state", async () => {
      const startResponse = await request(server)
        .post("/api/v1/game/start")
        .send({ playerId });

      const gameId = startResponse.body.id;

      const response = await request(server)
        .post("/api/v1/game/hit")
        .send({ gameId });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("startTimestamp");
      expect(response.body).toHaveProperty("dealerExposedCards");
      expect(response.body).toHaveProperty("playerCards");
      expect(response.body).toHaveProperty("playerHandValue");
      expect(response.body).toHaveProperty("dealerExposedHandValue");
    });

    test("should stand and return the final game state", async () => {
      const startResponse = await request(server)
        .post("/api/v1/game/start")
        .send({ playerId });

      const gameId = startResponse.body.id;

      const response = await request(server)
        .post("/api/v1/game/stand")
        .send({ gameId });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("startTimestamp");
      expect(response.body).toHaveProperty("result");
      expect(response.body).toHaveProperty("dealerExposedCards");
      expect(response.body).toHaveProperty("playerCards");
      expect(response.body).toHaveProperty("dealerExposedHandValue");
      expect(response.body).toHaveProperty("playerHandValue");
    });
  });
});
