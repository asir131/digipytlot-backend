import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.js";
import usersRoutes from "./routes/users.js";
import permissionsRoutes from "./routes/permissions.js";
import leadsRoutes from "./routes/leads.js";
import tasksRoutes from "./routes/tasks.js";
import reportsRoutes from "./routes/reports.js";
import auditRoutes from "./routes/audit.js";
import settingsRoutes from "./routes/settings.js";
import customersRoutes from "./routes/customers.js";
import { errorHandler } from "./middleware/error.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: [
      "http://localhost:3000",
      "https://digitalpylot-frontend.vercel.app"
      
    ],
      credentials: true,
    })
  );
  app.use(cookieParser());
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  app.get("/health", (_req, res) => res.json({ status: "ok" }));

  app.use("/api/auth", authRoutes);
  app.use("/api/users", usersRoutes);
  app.use("/api/permissions", permissionsRoutes);
  app.use("/api/leads", leadsRoutes);
  app.use("/api/tasks", tasksRoutes);
  app.use("/api/reports", reportsRoutes);
  app.use("/api/audit-logs", auditRoutes);
  app.use("/api/settings", settingsRoutes);
  app.use("/api/customers", customersRoutes);

  app.use(errorHandler);

  return app;
}
