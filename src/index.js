import createApp from "./app.js";
import { connectDB } from "./config/dbinit.js";
import { env } from "./config/env.js";
import { initializeAdmin } from "./data/bootstrap.js";

await connectDB();

await initializeAdmin();

const app = createApp();
const PORT = env.PORT || "5000";

app.listen(PORT, () => {
  console.log(`[server]: API Service running on port ${PORT}`);
});
