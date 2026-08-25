import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { query } from "../db/pool.js";
import { forbidden, unauthorized } from "../utils/httpError.js";

export const cookieOptions = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/",
  domain: env.COOKIE_DOMAIN === "localhost" ? undefined : env.COOKIE_DOMAIN
};

export function signAccessToken(user) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
      email: user.email,
      phoneVerified: Boolean(user.phone_verified_at)
    },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN }
  );
}

export function requireAuth(req, res, next) {
  const authHeader = req.get("Authorization");
  const bearerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;
  const token = bearerToken ?? req.cookies?.access_token;

  if (!token) {
    throw unauthorized();
  }

  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    req.user = {
      id: payload.sub,
      role: payload.role,
      email: payload.email,
      phoneVerified: payload.phoneVerified
    };
    next();
  } catch {
    throw unauthorized("Invalid or expired session");
  }
}

export function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw forbidden("This role cannot perform that action");
    }

    next();
  };
}

export async function requireVerifiedPhone(req, res, next) {
  try {
    const result = await query("select phone_verified_at from users where id = $1", [req.user.id]);
    const verifiedAt = result.rows[0]?.phone_verified_at;

    if (!verifiedAt) {
      throw forbidden("Phone OTP verification is required");
    }

    next();
  } catch (error) {
    next(error);
  }
}
