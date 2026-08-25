import { query } from "../db/pool.js";

export const reportController = {
  async create(req, res) {
    const report = await query(
      `insert into reports (reporter_id, property_id, landlord_id, reason, body)
       values ($1, $2, $3, $4, $5) returning *`,
      [req.user.id, req.validated.body.propertyId, req.validated.body.landlordId, req.validated.body.reason, req.validated.body.body]
    );
    res.status(201).json({ report: report.rows[0] });
  },

  async list(req, res) {
    const reports = await query("select * from reports order by created_at desc limit 100");
    res.json({ reports: reports.rows });
  }
};
