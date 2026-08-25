import crypto from "node:crypto";
import argon2 from "argon2";
import { OAuth2Client } from "google-auth-library";
import { env } from "../config/env.js";
import { query, withTransaction } from "../db/pool.js";
import { badRequest, forbidden, notFound, unauthorized } from "../utils/httpError.js";

const googleClient = env.GOOGLE_CLIENT_ID ? new OAuth2Client(env.GOOGLE_CLIENT_ID) : null;

function normalizePhone(phone) {
  return phone.replace(/[^\d+]/g, "");
}

function publicUser(user) {
  return {
    id: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
    phone: user.phone,
    avatarUrl: user.avatar_url,
    phoneVerifiedAt: user.phone_verified_at,
    createdAt: user.created_at
  };
}

export const authService = {
  async register({ role, name, email, phone, password }) {
    const existing = await query("select id from users where lower(email) = lower($1)", [email]);

    if (existing.rowCount > 0) {
      throw badRequest("Email is already registered");
    }

    const passwordHash = password ? await argon2.hash(password) : null;
    const result = await query(
      `insert into users (role, name, email, phone, password_hash)
       values ($1, $2, lower($3), $4, $5)
       returning id, role, name, email, phone, avatar_url, phone_verified_at, created_at`,
      [role, name, email, normalizePhone(phone), passwordHash]
    );

    return publicUser(result.rows[0]);
  },

  async login({ email, password }) {
    const result = await query(
      `select id, role, name, email, phone, avatar_url, password_hash, phone_verified_at, active, created_at
       from users
       where lower(email) = lower($1)`,
      [email]
    );
    const user = result.rows[0];

    if (!user || !user.password_hash) {
      throw unauthorized("Invalid email or password");
    }

    if (!user.active) {
      throw forbidden("Account is suspended");
    }

    const valid = await argon2.verify(user.password_hash, password);

    if (!valid) {
      throw unauthorized("Invalid email or password");
    }

    return publicUser(user);
  },

  async googleAuth({ idToken, role }) {
    if (!googleClient) {
      throw badRequest("Google authentication is not configured");
    }

    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: env.GOOGLE_CLIENT_ID
    });
    const payload = ticket.getPayload();

    if (!payload?.email) {
      throw unauthorized("Google account email is required");
    }

    const result = await query(
      `insert into users (role, name, email, phone, google_subject, phone_verified_at)
       values ($1, $2, lower($3), $4, $5, null)
       on conflict (email)
       do update set google_subject = excluded.google_subject, updated_at = now()
       returning id, role, name, email, phone, avatar_url, phone_verified_at, created_at`,
      [role, payload.name ?? payload.email, payload.email, "", payload.sub]
    );

    return publicUser(result.rows[0]);
  },

  async findById(userId) {
    const result = await query(
      `select id, role, name, email, phone, avatar_url, phone_verified_at, created_at
       from users where id = $1`,
      [userId]
    );

    if (!result.rows[0]) {
      throw notFound("User not found");
    }

    return publicUser(result.rows[0]);
  },

  async createOtp(userId, purpose) {
    const userResult = await query("select phone from users where id = $1", [userId]);
    const phone = userResult.rows[0]?.phone;

    if (!phone) {
      throw notFound("User phone number not found");
    }

    const code = crypto.randomInt(100000, 999999).toString();
    const codeHash = await argon2.hash(code);
    const expiresAt = new Date(Date.now() + env.OTP_EXPIRES_MINUTES * 60 * 1000);

    await query(
      `insert into otp_challenges (user_id, phone, purpose, code_hash, expires_at)
       values ($1, $2, $3, $4, $5)`,
      [userId, phone, purpose, codeHash, expiresAt]
    );

    return {
      phone,
      expiresAt,
      demoCode: env.NODE_ENV === "production" ? undefined : code
    };
  },

  async verifyOtp(userId, purpose, code) {
    return withTransaction(async (client) => {
      const challengeResult = await client.query(
        `select id, code_hash
         from otp_challenges
         where user_id = $1
           and purpose = $2
           and used_at is null
           and expires_at > now()
         order by created_at desc
         limit 1
         for update`,
        [userId, purpose]
      );
      const challenge = challengeResult.rows[0];

      if (!challenge) {
        throw badRequest("OTP code has expired or was not requested");
      }

      const valid = await argon2.verify(challenge.code_hash, code);

      if (!valid) {
        throw unauthorized("Invalid OTP code");
      }

      await client.query("update otp_challenges set used_at = now() where id = $1", [challenge.id]);

      if (purpose === "phone_verification") {
        await client.query("update users set phone_verified_at = now(), updated_at = now() where id = $1", [userId]);
      }

      return true;
    });
  },

  async requestPasswordReset(email) {
    const result = await query("select id from users where lower(email) = lower($1)", [email]);

    if (!result.rows[0]) {
      return;
    }

    await this.createOtp(result.rows[0].id, "password_reset");
  }
};
