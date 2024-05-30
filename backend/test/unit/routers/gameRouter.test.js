import express from "express";
import gameRouter from "../../../src/routers/gameRouter";
import gameController from "../../../src/controllers/gameController";

jest.mock("express", () => {
  const mRouter = {
    post: jest.fn(),
  };
  return {
    Router: jest.fn(() => mRouter),
  };
});

describe("GameRouter", () => {
  const router = gameRouter.getRouter();

  test("should define POST /start route", () => {
    expect(express.Router).toHaveBeenCalled();
    expect(router.post).toHaveBeenCalledWith("/start", gameController.start);
  });

  test("should define POST /hit route", () => {
    expect(express.Router).toHaveBeenCalled();
    expect(router.post).toHaveBeenCalledWith("/hit", gameController.hit);
  });

  test("should define POST /stand route", () => {
    expect(express.Router).toHaveBeenCalled();
    expect(router.post).toHaveBeenCalledWith("/stand", gameController.stand);
  });
});
