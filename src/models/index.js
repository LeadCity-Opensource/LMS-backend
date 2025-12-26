import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Sequelize from "sequelize";
import sequelize from "../config/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = {};

// Reads all model files in this (models) directory (except this index file)
const modelFiles = fs
  .readdirSync(__dirname)
  .filter((file) => file !== "index.js" && file.endsWith(".js"));

// Imports and initializes each model with sequelize
for (const file of modelFiles) {
  const { default: modelDefiner } = await import(path.join(__dirname, file));
  const model = modelDefiner(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

// Sets up model relationships (associations) after all models are loaded
for (const modelName of Object.keys(db)) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
}

// Exposes sequelize instances for use elsewhere in the app
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;