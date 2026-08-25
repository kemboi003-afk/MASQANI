import { query, withTransaction } from "../db/pool.js";
import { notFound } from "../utils/httpError.js";

export const savedPropertyController = {
  async list(req, res) {
    const result = await query(
      `select p.*, coalesce(json_agg(distinct pm.url) filter (where pm.id is not null), '[]') as images
       from saved_properties s
       join properties p on p.id = s.property_id and p.deleted_at is null
       left join property_media pm on pm.property_id = p.id and pm.media_type = 'image'
       where s.tenant_id = $1
       group by p.id, s.created_at
       order by s.created_at desc`,
      [req.user.id]
    );
    res.json({ properties: result.rows });
  },

  async create(req, res) {
    const saved = await withTransaction(async (client) => {
      const property = await client.query("select id from properties where id = $1 and deleted_at is null", [req.validated.body.propertyId]);
      if (!property.rows[0]) throw notFound("Property not found");
      const result = await client.query(
        `insert into saved_properties (tenant_id, property_id) values ($1, $2)
         on conflict (tenant_id, property_id) do nothing returning *`,
        [req.user.id, req.validated.body.propertyId]
      );
      if (result.rows[0]) await client.query("update properties set saved_count = saved_count + 1 where id = $1", [req.validated.body.propertyId]);
      return result.rows[0] ?? { tenant_id: req.user.id, property_id: req.validated.body.propertyId, existing: true };
    });
    res.status(201).json({ saved });
  },

  async remove(req, res) {
    const removed = await withTransaction(async (client) => {
      const result = await client.query("delete from saved_properties where tenant_id = $1 and property_id = $2 returning *", [req.user.id, req.params.propertyId]);
      if (result.rows[0]) await client.query("update properties set saved_count = greatest(saved_count - 1, 0) where id = $1", [req.params.propertyId]);
      return result.rows[0];
    });
    res.json({ removed: Boolean(removed) });
  }
};
