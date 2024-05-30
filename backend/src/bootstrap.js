import express from "express";
import cors from "cors";
import sequelize from "./database/config.js";
import gameRouter from "./routers/gameRouter.js";
import playerRouter from "./routers/playerRouter.js";

const onDatabaseSyncSuccess = () => {
  console.log("Database synced");

  const app = express();
  const port = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());

  app.use("/api/v1/player", playerRouter.getRouter());
  app.use("/api/v1/game", gameRouter.getRouter());

  app.use((req, res) => {
    res.status(404).json({ error: "Not Found" });
  });

  return app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
};

const onDatabaseSyncError = (err) =>
  console.error("Error syncing database", err);

const bootstrap = async () => {
  try {
    await sequelize.sync();
    return onDatabaseSyncSuccess();
  } catch (error) {
    onDatabaseSyncError(error);
  }
};

export default bootstrap;
