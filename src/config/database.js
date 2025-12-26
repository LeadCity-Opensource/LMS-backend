import { Sequelize } from "sequelize";
import { env } from "./env.js";

/**
 * Creates and exports the shared Sequelize database instance.
 * This defines how the app connects to the MySQL database.
 */

const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
  host: env.DB_HOST,
  port: env.DB_PORT,
  dialect: "mysql",
  logging: false,
});

export default sequelize;
