import express from "express";
import { protect } from "./middleware/auth.js";
import adminRoutes from "./routes/admin/route.js";
import authRoutes from "./routes/auth/route.js";
import bookRoutes from "./routes/book/bookRoutes.js";

const createApp = () => {
  const app = express();
  app.use(express.json());

  app.get("/", (_req, res) => {
    res.send("Hello world");
  });

  app.use("/api/auth", authRoutes);

  /*
   * all routes before this middleware are unprotected
   * all routes after this middleware are protected
   */
  app.use(protect);

  app.use("/api/admin", adminRoutes);
  app.use("/api/books", bookRoutes);

  return app;
};

export default createApp;
