import express from "express";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { protect } from "./middleware/auth.js";
import adminRoutes from "./routes/admin/route.js";
import authRoutes from "./routes/auth/route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerPath = path.resolve(__dirname, "swagger.yaml");

console.log("-----------------------------------------");
console.log("Searching for Swagger file at:", swaggerPath);

if (!fs.existsSync(swaggerPath)) {
  console.log("❌ CRITICAL ERROR: The file 'swagger.yaml' is NOT in the root folder!");
  console.log("Make sure it is inside: C:\\Users\\USER-PC\\Desktop\\lmsbackend\\LMS-backend\\");
  console.log("-----------------------------------------");
}

const swaggerDocument = YAML.load(swaggerPath);

const createApp = () => {
  const app = express();
  app.use(express.json());

  app.get("/", (_req, res) => {
    res.send("Hello world");
  });

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use("/api/auth", authRoutes);

  app.use(protect);
  app.use("/api/admin", adminRoutes);

  return app;
};

export default createApp;