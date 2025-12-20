import { DataTypes } from "sequelize";
import { connectDB } from "../config/dbinit.js";

const sequelize = await connectDB();

export const Book = sequelize.define("Book", {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    author: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: true
});

await sequelize.sync(); // creates table if it doesn’t exist
