import { query } from "../db/pool.js";
import { Resend } from "resend";
import twilio from "twilio";
import { env } from "../config/env.js";

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;
const sms = env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN ? twilio(env.TWILIO_ACCOUNT_SID, env.TWILIO_AUTH_TOKEN) : null;

export const notificationService = {
  async create({ userId, type, title, body, channel = "in_app", metadata = {} }) {
    const result = await query(
      `insert into notifications (user_id, type, title, body, channel, metadata)
       values ($1, $2, $3, $4, $5, $6)
       returning *`,
      [userId, type, title, body, channel, metadata]
    );
    const notification = result.rows[0];
    if (channel === "email" || channel === "sms") {
      await this.deliver({ userId, channel, title, body });
    }
    return notification;
  },

  async deliver({ userId, channel, title, body }) {
    const user = await query("select email, phone from users where id = $1", [userId]);
    const recipient = user.rows[0];
    if (!recipient) return;
    if (channel === "email" && resend && env.EMAIL_FROM && recipient.email) {
      await resend.emails.send({ from: env.EMAIL_FROM, to: recipient.email, subject: title, text: body });
    }
    if (channel === "sms" && sms && env.TWILIO_FROM_NUMBER && recipient.phone) {
      await sms.messages.create({ from: env.TWILIO_FROM_NUMBER, to: recipient.phone, body: `${title}: ${body}` });
    }
  },

  async list(userId) {
    const result = await query(
      `select * from notifications
       where user_id = $1
       order by created_at desc
       limit 50`,
      [userId]
    );
    return result.rows;
  },

  async markRead(userId, notificationId) {
    const result = await query(
      `update notifications
       set read_at = now()
       where id = $2 and user_id = $1
       returning *`,
      [userId, notificationId]
    );
    return result.rows[0];
  }
};
