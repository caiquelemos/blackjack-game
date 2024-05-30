import express from "express";
import playerRouter from "../../../src/routers/playerRouter";
import playerController from "../../../src/controllers/playerController";

jest.mock("express", () => {
  const mRouter = {
    post: jest.fn(),
  };
  return {
    Router: jest.fn(() => mRouter),
  };
});

describe("PlayerRouter", () => {
  const router = playerRouter.getRouter();

  test("should define POST /login route", () => {
    expect(express.Router).toHaveBeenCalled();
    expect(router.post).toHaveBeenCalledWith("/login", playerController.login);
  });
});
