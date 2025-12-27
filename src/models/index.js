// models/index.js
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import pkg from "sequelize";
const { Sequelize, DataTypes } = pkg;
import sequelize from "../config/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = {};

// Read all model files in the current directory (excluding index.js)
const modelFiles = fs
  .readdirSync(__dirname)
  .filter((file) => file !== "index.js" && file.endsWith(".js"));

// Import and initialize each model
for (const file of modelFiles) {
  // Use relative import to avoid Windows file:// issues
  const { default: modelDefiner } = await import(`./${file}`);
  const model = modelDefiner(sequelize, DataTypes);
  db[model.name] = model;
}

// Set up associations if defined
for (const modelName of Object.keys(db)) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
}

// Expose sequelize instances for use elsewhere
db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;