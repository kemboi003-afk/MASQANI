import { query } from "../db/pool.js";
import { notificationService } from "../services/notification.service.js";

export const viewingController = {
  async list(req, res) {
    const tenantRequest = req.user.role === "tenant";
    const result = await query(
      `select v.*, p.title, p.neighborhood, p.city
       from viewing_requests v
       join properties p on p.id = v.property_id and p.deleted_at is null
       where ${tenantRequest ? "v.tenant_id" : "p.landlord_id"} = $1
       order by v.scheduled_at desc`,
      [req.user.id]
    );
    res.json({ viewings: result.rows });
  },

  async create(req, res) {
    const result = await query(
      `insert into viewing_requests (tenant_id, property_id, scheduled_at, status)
       values ($1, $2, $3, 'pending')
       returning *`,
      [req.user.id, req.validated.body.propertyId, req.validated.body.scheduledAt]
    );

    const landlord = await query("select landlord_id, title from properties where id = $1", [req.validated.body.propertyId]);
    if (landlord.rows[0]) {
      await notificationService.create({ userId: landlord.rows[0].landlord_id, type: "viewing_request", title: "New viewing request", body: `A tenant requested a viewing for ${landlord.rows[0].title}.` });
    }
    res.status(201).json({ viewing: result.rows[0] });
  }
};
