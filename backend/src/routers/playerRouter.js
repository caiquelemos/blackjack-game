import express from "express";
import playerController from "../controllers/playerController.js";

class PlayerRouter {
  #router;

  constructor() {
    this.#router = express.Router();
    this.#router.post("/login", playerController.login);
  }

  getRouter() {
    return this.#router;
  }
}

export default new PlayerRouter();
