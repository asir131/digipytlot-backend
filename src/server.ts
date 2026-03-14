import { createApp } from "./app.js";
import { connectDb } from "./config/db.js";
import { env } from "./config/env.js";
import { logger } from "./utils/logger.js";

async function start() {
  try {
    await connectDb();
    const app = createApp();
    app.listen(env.port, () => logger.info(`API running on port ${env.port}`));
  } catch (error) {
    logger.error("Failed to start server", error);
    process.exit(1);
  }
}

start();
