import { Sequelize } from "sequelize";
import { config } from "../config.js";

const sequelize = new Sequelize(config.databaseUrl, {
  dialect: "postgres",
  logging: false, 
});

export default sequelize;
