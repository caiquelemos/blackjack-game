import express from "express";
import cors from "cors";
import sequelize from "../../src/database/config";
import gameRouter from "../../src/routers/gameRouter";
import playerRouter from "../../src/routers/playerRouter";
import bootstrap from "../../src/bootstrap";

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

describe("Bootstrap", () => {
  let consoleLogSpy;
  let consoleErrorSpy;

  beforeAll(() => {
    consoleLogSpy = jest.spyOn(console, "log").mockImplementation();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  test("should sync the database and start the server", async () => {
    sequelize.sync.mockResolvedValue();

    await bootstrap();

    expect(express).toHaveBeenCalled();
    const app = express();
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
    const port = process.env.PORT || 3000;
    expect(app.listen).toHaveBeenCalledWith(port, expect.any(Function));
  });

  test("should log database sync message on success", async () => {
    sequelize.sync.mockResolvedValue();

    await bootstrap();

    expect(consoleLogSpy).toHaveBeenCalledWith("Database synced");
  });

  test("should handle 404 errors", async () => {
    sequelize.sync.mockResolvedValue();

    await bootstrap();

    const app = express();
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

  test("should log error message if database sync fails", async () => {
    const error = new Error("Sync failed");
    sequelize.sync.mockRejectedValue(error);

    await bootstrap();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Error syncing database",
      error
    );
  });
});
