import { query } from "../db/pool.js";

export const reviewController = {
  async create(req, res) {
    const result = await query(
      `insert into reviews (tenant_id, landlord_id, property_id, rating, comment)
       values ($1, $2, $3, $4, $5)
       returning *`,
      [
        req.user.id,
        req.validated.body.landlordId,
        req.validated.body.propertyId,
        req.validated.body.rating,
        req.validated.body.comment
      ]
    );

    res.status(201).json({ review: result.rows[0] });
  }
};
