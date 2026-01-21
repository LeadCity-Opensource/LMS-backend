import cors from "cors";
import express from "express";
import fs from "fs";
import path from "path";
import swaggerUi from "swagger-ui-express";
import { fileURLToPath } from "url";
import YAML from "yamljs";
import { protect } from "./middleware/auth.js";
import { globalErrorHandler } from "./middleware/errorHandler.js";
import adminRoutes from "./routes/admin/route.js";
import authRoutes from "./routes/auth/route.js";
import bookRoutes from "./routes/books/route.js";
import fineRoutes from "./routes/fines/route.js";
import reportRoutes from "./routes/reports/route.js";
import AppError from "./utils/AppError.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const swaggerPath = path.resolve(__dirname, "swagger.yaml");

// Attempt to load Swagger safely before creating the app
let swaggerDocument;
try {
  if (fs.existsSync(swaggerPath)) {
    swaggerDocument = YAML.load(swaggerPath);
    console.log("✅ Swagger YAML loaded successfully.");
  } else {
    console.error("❌ Swagger file not found at:", swaggerPath);
  }
} catch (error) {
  console.error("❌ Error parsing swagger.yaml:", error.message);
  // We leave swaggerDocument as undefined so the app doesn't crash
}

const createApp = () => {
  const app = express();

  // 1. Enable CORS & JSON parsing first
  app.use(cors());
  app.use(express.json());

  // 2. Public Health Check
  app.get("/", (_req, res) => {
    res.send("Hello from LMS backend");
  });

  // 3. Swagger Route (Conditional)
  if (swaggerDocument) {
    app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  } else {
    app.get("/api-docs", (req, res) => {
      res.status(500).json({ 
        message: "Swagger documentation is currently unavailable due to a server-side file error." 
      });
    });
  }

  // 4. Auth Routes
  app.use("/api/auth", authRoutes);

  // 5. Protect all following routes
  app.use(protect);

  // 6. Protected Routes
  app.use("/api/admin", adminRoutes);
  app.use("/api/books", bookRoutes);
  app.use("/api/reports", reportRoutes);
  app.use("/api/fines", fineRoutes);

  // 7. Handle unhandled routes (404)
  app.all("*", (req, _res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });

  // 8. Global Error Handler (must be last)
  app.use(globalErrorHandler);

  return app;
};

export default createApp;
