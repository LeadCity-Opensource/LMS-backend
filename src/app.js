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

console.log("-----------------------------------------");
console.log("Searching for Swagger file at:", swaggerPath);

if (!fs.existsSync(swaggerPath)) {
  console.log(
    "CRITICAL ERROR: The file 'swagger.yaml' is NOT in the root folder!"
  );
  console.log(
    "Make sure it is inside: C:\\Users\\USER-PC\\Desktop\\lmsbackend\\LMS-backend\\"
  );
  console.log("-----------------------------------------");
}

const swaggerDocument = YAML.load(swaggerPath);

const createApp = () => {
  const app = express();
  app.use(express.json());

  app.get("/", (_req, res) => {
    res.send("Hello from LMS backend");
  });

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use("/api/auth", authRoutes);

  app.use(protect);
<<<<<<< HEAD
=======

  // RBAC Protected Routes
>>>>>>> upstream/main
  app.use("/api/admin", adminRoutes);
  app.use("/api/books", bookRoutes);
  app.use("/api/reports", reportRoutes);
  app.use("/api/fines", fineRoutes);

  // Handle unhandled routes (404)
  app.all("/*splat", (req, _res, next) => {
    next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
  });

  // Global Error Handler (must be last)
  app.use(globalErrorHandler);

  return app;
};

export default createApp;
