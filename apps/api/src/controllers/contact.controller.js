import { query } from "../db/pool.js";

export const contactController = {
  async create(req, res) {
    const result = await query(
      `insert into support_messages (name, email, message) values ($1, $2, $3) returning id, status, created_at`,
      [req.validated.body.name, req.validated.body.email, req.validated.body.message]
    );
    res.status(201).json({ message: "Your support message has been received.", supportMessage: result.rows[0] });
  }
};
