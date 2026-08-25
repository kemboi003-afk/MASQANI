import { query, withTransaction } from "../db/pool.js";
import { forbidden, notFound } from "../utils/httpError.js";

function propertySelect() {
  return `
    p.*,
    coalesce(json_agg(distinct pa.name) filter (where pa.name is not null), '[]') as amenities,
    coalesce(
      json_agg(distinct jsonb_build_object('url', pm.url, 'type', pm.media_type, 'caption', pm.caption, 'sortOrder', pm.sort_order))
        filter (where pm.id is not null),
      '[]'
    ) as media
  `;
}

export const propertyService = {
  async list(filters) {
    const where = ["p.deleted_at is null", "p.moderation_status = 'approved'"];
    const values = [];

    if (filters.location) {
      values.push(`%${filters.location}%`);
      where.push(`(p.city ilike $${values.length} or p.neighborhood ilike $${values.length})`);
    }

    if (filters.minPrice) {
      values.push(filters.minPrice);
      where.push(`p.monthly_rent >= $${values.length}`);
    }

    if (filters.maxPrice) {
      values.push(filters.maxPrice);
      where.push(`p.monthly_rent <= $${values.length}`);
    }

    if (filters.bedrooms !== undefined) {
      values.push(filters.bedrooms);
      where.push(`p.bedrooms >= $${values.length}`);
    }

    if (filters.bathrooms !== undefined) {
      values.push(filters.bathrooms);
      where.push(`p.bathrooms >= $${values.length}`);
    }

    if (filters.propertyType) {
      values.push(filters.propertyType);
      where.push(`p.property_type = $${values.length}`);
    }

    if (filters.availability) {
      values.push(filters.availability);
      where.push(`p.availability_status = $${values.length}`);
    }

    const offset = (filters.page - 1) * filters.limit;
    values.push(filters.limit, offset);

    const result = await query(
      `select ${propertySelect()}
       from properties p
       left join property_amenities pa on pa.property_id = p.id
       left join property_media pm on pm.property_id = p.id
       where ${where.join(" and ")}
       group by p.id
       order by p.created_at desc
       limit $${values.length - 1}
       offset $${values.length}`,
      values
    );

    return result.rows;
  },

  async findById(id) {
    const result = await query(
      `select ${propertySelect()}
       from properties p
       left join property_amenities pa on pa.property_id = p.id
       left join property_media pm on pm.property_id = p.id
       where p.id = $1 and p.deleted_at is null
       group by p.id`,
      [id]
    );

    if (!result.rows[0]) {
      throw notFound("Property not found");
    }

    await query("update properties set views_count = views_count + 1 where id = $1", [id]);
    return result.rows[0];
  },

  async listOwned(landlordId) {
    const result = await query(
      `select ${propertySelect()}
       from properties p
       left join property_amenities pa on pa.property_id = p.id
       left join property_media pm on pm.property_id = p.id
       where p.landlord_id = $1 and p.deleted_at is null
       group by p.id
       order by p.created_at desc`,
      [landlordId]
    );
    return result.rows;
  },

  async create(landlordId, payload) {
    return withTransaction(async (client) => {
      const propertyResult = await client.query(
        `insert into properties (
          landlord_id, title, apartment_name, description, monthly_rent, deposit_amount,
          bedrooms, bathrooms, square_feet, property_type, address_line, city,
          neighborhood, latitude, longitude, availability_status, available_from
        )
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
        returning *`,
        [
          landlordId,
          payload.title,
          payload.apartmentName,
          payload.description,
          payload.monthlyRent,
          payload.depositAmount,
          payload.bedrooms,
          payload.bathrooms,
          payload.squareFeet,
          payload.propertyType,
          payload.addressLine,
          payload.city,
          payload.neighborhood,
          payload.latitude,
          payload.longitude,
          payload.availabilityStatus,
          payload.availableFrom
        ]
      );
      const property = propertyResult.rows[0];

      for (const amenity of payload.amenities ?? []) {
        await client.query("insert into property_amenities (property_id, name) values ($1, $2)", [property.id, amenity]);
      }

      for (const item of payload.media ?? []) {
        await client.query(
          `insert into property_media (property_id, url, media_type, caption, sort_order)
           values ($1, $2, $3, $4, $5)`,
          [property.id, item.url, item.type, item.caption, item.sortOrder]
        );
      }

      return property;
    });
  },

  async update(landlordId, propertyId, payload) {
    const ownerResult = await query("select landlord_id from properties where id = $1 and deleted_at is null", [propertyId]);
    const ownerId = ownerResult.rows[0]?.landlord_id;

    if (!ownerId) {
      throw notFound("Property not found");
    }

    if (ownerId !== landlordId) {
      throw forbidden("Only the owning landlord can update this property");
    }

    const updates = [];
    const values = [];
    const fields = {
      title: "title",
      apartmentName: "apartment_name",
      description: "description",
      monthlyRent: "monthly_rent",
      depositAmount: "deposit_amount",
      bedrooms: "bedrooms",
      bathrooms: "bathrooms",
      squareFeet: "square_feet",
      propertyType: "property_type",
      addressLine: "address_line",
      city: "city",
      neighborhood: "neighborhood",
      latitude: "latitude",
      longitude: "longitude",
      availabilityStatus: "availability_status",
      availableFrom: "available_from"
    };

    for (const [inputKey, column] of Object.entries(fields)) {
      if (payload[inputKey] !== undefined) {
        values.push(payload[inputKey]);
        updates.push(`${column} = $${values.length}`);
      }
    }

    if (updates.length === 0) {
      return this.findById(propertyId);
    }

    values.push(propertyId);
    const result = await query(
      `update properties set ${updates.join(", ")}, updated_at = now() where id = $${values.length} returning *`,
      values
    );

    return result.rows[0];
  },

  async setStatus(landlordId, propertyId, status) {
    const result = await query(
      `update properties
       set availability_status = $3, updated_at = now()
       where id = $2 and landlord_id = $1 and deleted_at is null
       returning *`,
      [landlordId, propertyId, status]
    );

    if (!result.rows[0]) {
      throw notFound("Property not found");
    }

    return result.rows[0];
  },

  async softDelete(landlordId, propertyId) {
    const result = await query(
      `update properties
       set deleted_at = now(), updated_at = now()
       where id = $2 and landlord_id = $1 and deleted_at is null
       returning id`,
      [landlordId, propertyId]
    );

    if (!result.rows[0]) {
      throw notFound("Property not found");
    }
  }
};
