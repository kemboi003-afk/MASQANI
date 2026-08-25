import crypto from "node:crypto";
import { isProduction } from "../config/env.js";
import { forbidden } from "../utils/httpError.js";

const safeMethods = new Set(["GET", "HEAD", "OPTIONS"]);
const webhookPaths = [
  "/api/payments/mpesa/callback",
  "/api/payments/card/webhook",
  "/api/payments/bank/webhook",
  "/api/payments/mobile-money/webhook"
];
const authBootstrapPaths = [
  "/api/auth/register",
  "/api/auth/login",
  "/api/auth/google",
  "/api/auth/forgot-password",
  "/api/contact"
];

function safeEqual(left, right) {
  const leftBuffer = Buffer.from(left ?? "");
  const rightBuffer = Buffer.from(right ?? "");

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(leftBuffer, rightBuffer);
}

export function issueCsrfToken(req, res) {
  const token = crypto.randomBytes(32).toString("hex");

  res.cookie("csrf_token", token, {
    httpOnly: false,
    secure: isProduction,
    sameSite: "lax",
    path: "/"
  });

  res.json({ csrfToken: token });
}

export function csrfProtection(req, res, next) {
  if (
    safeMethods.has(req.method) ||
    webhookPaths.includes(req.path) ||
    authBootstrapPaths.includes(req.path) ||
    req.get("Authorization")?.startsWith("Bearer ")
  ) {
    next();
    return;
  }

  const cookieToken = req.cookies?.csrf_token;
  const headerToken = req.get("x-csrf-token");

  if (!cookieToken || !headerToken || !safeEqual(cookieToken, headerToken)) {
    throw forbidden("Invalid CSRF token");
  }

  next();
}
