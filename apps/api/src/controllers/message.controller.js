import { query } from "../db/pool.js";
import { notificationService } from "../services/notification.service.js";

export const messageController = {
  async list(req, res) {
    const result = await query(
      `select *
       from messages
       where sender_id = $1 or receiver_id = $1
       order by created_at desc
       limit 100`,
      [req.user.id]
    );
    res.json({ messages: result.rows });
  },

  async create(req, res) {
    const result = await query(
      `insert into messages (sender_id, receiver_id, property_id, body)
       values ($1, $2, $3, $4)
       returning *`,
      [req.user.id, req.validated.body.receiverId, req.validated.body.propertyId, req.validated.body.body]
    );
    await notificationService.create({ userId: req.validated.body.receiverId, type: "message", title: "New message", body: "You received a new MASQANI message.", metadata: { messageId: result.rows[0].id } });
    res.status(201).json({ message: result.rows[0] });
  }
};
