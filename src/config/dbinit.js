import db from "../models/index.js";
import { env } from "./env.js";

export const connectDB = async () => {
  try {
    await db.sequelize.authenticate();
    console.log(" db connection established");

    /*
     * In development only:
     * This tells Sequelize to automatically update the database tables
     * to match our model definitions when the app starts.
     */
    if (env.NODE_ENV === "development") {
      await db.sequelize.sync({ alter: true });
      console.log("Database models synced.");
    }
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    process.exit(1);
  }
};
