import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url"; // 1. Added pathToFileURL
import Sequelize from "sequelize";
import sequelize from "../config/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = {};

const modelFiles = fs
  .readdirSync(__dirname)
  .filter((file) => file !== "index.js" && file.endsWith(".js"));

for (const file of modelFiles) {
  // 2. Build the absolute path
  const filePath = path.join(__dirname, file);
  
  // 3. THE FIX: Convert the path to a file:// URL string
  const fileUrl = pathToFileURL(filePath).href;

  // 4. Use the URL instead of the raw path string
  const { default: modelDefiner } = await import(fileUrl);
  
  const model = modelDefiner(sequelize, Sequelize.DataTypes);
  db[model.name] = model;
}

for (const modelName of Object.keys(db)) {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
}

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;