import { query } from "../db/pool.js";
import { notFound } from "../utils/httpError.js";

export const adminService = {
  async metrics() {
    const [users, listings, income, reports] = await Promise.all([
      query("select role, count(*)::int as total from users group by role"),
      query("select moderation_status, count(*)::int as total from properties where deleted_at is null group by moderation_status"),
      query("select coalesce(sum(amount), 0)::numeric as total from payments where status = 'completed'"),
      query("select status, count(*)::int as total from reports group by status")
    ]);

    return {
      users: users.rows,
      listings: listings.rows,
      income: income.rows[0]?.total ?? 0,
      reports: reports.rows
    };
  },

  async listUsers(role) {
    const values = [];
    const where = [];

    if (role) {
      values.push(role);
      where.push(`role = $${values.length}`);
    }

    const result = await query(
      `select id, role, name, email, phone, active, phone_verified_at, created_at
       from users
       ${where.length ? `where ${where.join(" and ")}` : ""}
       order by created_at desc
       limit 100`,
      values
    );

    return result.rows;
  },

  async listListings(status = "pending") {
    const result = await query(
      `select p.id, p.title, p.monthly_rent, p.city, p.neighborhood, p.moderation_status,
              p.created_at, u.name as landlord_name, u.email as landlord_email
       from properties p join users u on u.id = p.landlord_id
       where p.deleted_at is null and p.moderation_status = $1
       order by p.created_at asc
       limit 100`,
      [status]
    );
    return result.rows;
  },

  async moderateListing({ listingId, status, reason }) {
    const result = await query(
      `update properties
       set moderation_status = $2, moderation_reason = $3, updated_at = now()
       where id = $1 and deleted_at is null
       returning *`,
      [listingId, status, reason]
    );

    if (!result.rows[0]) {
      throw notFound("Listing not found");
    }

    return result.rows[0];
  }
};
