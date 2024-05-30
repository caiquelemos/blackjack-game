import { Sequelize } from "sequelize";

const sequelize = new Sequelize({
  dialect: process.env.NODE_ENV === "test" ? "sqlite" : "sqlite",
  storage:
    process.env.NODE_ENV === "test"
      ? ":memory:"
      : "./src/database/database.sqlite",
  logging: process.env.NODE_ENV === "test" ? false : true,
});

export default sequelize;
