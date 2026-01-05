import createApp from "./app.js";
import { connectDB } from "./config/dbinit.js";
import { env } from "./config/env.js";
import { initializeAdmin } from "./data/bootstrap.js";

const app = createApp();

async function startServer() {
  try {
    await connectDB();
    await initializeAdmin();

    const PORT = env.PORT || 5000;

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`[server]: API Service running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

startServer();

export default app;
