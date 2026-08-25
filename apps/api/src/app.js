import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { env } from "./config/env.js";
import { csrfProtection } from "./middleware/csrfProtection.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { globalLimiter } from "./middleware/rateLimiter.js";
import { routes } from "./routes/index.js";

export function createApp() {
  const app = express();

  app.set("trust proxy", 1);
  app.use(pinoHttp({ redact: ["req.headers.authorization", "req.headers.cookie", "res.headers.set-cookie"] }));
  app.use(helmet());
  app.use(
    cors({
      origin: env.CORS_ORIGIN.split(",").map((origin) => origin.trim()),
      credentials: true
    })
  );
  app.use(globalLimiter);
  app.use(express.json({ limit: "2mb" }));
  app.use(cookieParser());
  app.use(csrfProtection);
  app.use("/api", routes);
  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
