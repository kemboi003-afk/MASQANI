import { env } from "../config/env.js";

export function notFoundHandler(req, res) {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`
  });
}

export function errorHandler(error, req, res, next) {
  const status = error.status ?? 500;
  req.log?.error({ err: error, status, requestId: req.id }, "Request failed");

  res.status(status).json({
    message: error.message ?? "Internal server error",
    details: error.details,
    stack: env.NODE_ENV === "development" ? error.stack : undefined
  });
}
