import express from "express";
import gameController from "../controllers/gameController.js";

class GameRouter {
  #router;

  constructor() {
    this.#router = express.Router();
    this.#router.post("/start", gameController.start);
    this.#router.post("/hit", gameController.hit);
    this.#router.post("/stand", gameController.stand);
  }

  getRouter() {
    return this.#router;
  }
}

export default new GameRouter();
