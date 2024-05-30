import express from "express";
import cors from "cors";
import sequelize from "../../src/database/config";
import gameRouter from "../../src/routers/gameRouter";
import playerRouter from "../../src/routers/playerRouter";

jest.mock("express", () => {
  const mApp = {
    use: jest.fn(),
    listen: jest.fn((port, callback) => callback()),
  };
  const mExpress = jest.fn(() => mApp);
  mExpress.Router = jest.fn(() => ({
    get: jest.fn(),
    post: jest.fn(),
  }));
  mExpress.json = jest.fn();
  return mExpress;
});

jest.mock("cors", () => jest.fn());
jest.mock("../../src/database/config");
jest.mock("../../src/routers/gameRouter");
jest.mock("../../src/routers/playerRouter");

describe("App", () => {
  let app, consoleLogSpy, consoleErrorSpy;

  beforeAll(async () => {
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
    sequelize.sync.mockResolvedValue();
    await import("../../src/app");
    app = express();
  });

  test("should configure express app correctly", async () => {
    expect(express).toHaveBeenCalled();
    expect(app.use).toHaveBeenCalledWith(cors());
    expect(app.use).toHaveBeenCalledWith(express.json());
    expect(app.use).toHaveBeenCalledWith(
      "/api/v1/player",
      playerRouter.getRouter()
    );
    expect(app.use).toHaveBeenCalledWith(
      "/api/v1/game",
      gameRouter.getRouter()
    );
  });

  test("should handle 404 errors", async () => {
    const notFoundHandler =
      app.use.mock.calls[app.use.mock.calls.length - 1][0];
    const req = {};
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    notFoundHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Not Found" });
  });

  test("should start the server on the correct port", () => {
    const port = process.env.PORT || 3000;
    expect(app.listen).toHaveBeenCalledWith(port, expect.any(Function));
  });

  test("should log database sync message", async () => {
    expect(consoleLogSpy).toHaveBeenCalledWith("Database synced");
  });
});
