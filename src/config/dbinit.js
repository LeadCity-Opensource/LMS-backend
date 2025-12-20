import { Sequelize } from "sequelize";

export const connectDB = async () => {
    const sequelize = new Sequelize({
        dialect: "sqlite",
        storage: "./database.sqlite" // this file will store your data
    });

    try {
        await sequelize.authenticate();
        console.log("Database connected (SQLite)");
        return sequelize;
    } catch (error) {
        console.error("Unable to connect to the database:", error);
    }
};
