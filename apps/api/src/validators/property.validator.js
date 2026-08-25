import { z } from "zod";

const propertyStatus = z.enum(["available", "reserved", "occupied", "paused", "pending_approval"]);

export const listPropertiesSchema = z.object({
  query: z.object({
    location: z.string().optional(),
    minPrice: z.coerce.number().nonnegative().optional(),
    maxPrice: z.coerce.number().nonnegative().optional(),
    bedrooms: z.coerce.number().int().min(0).optional(),
    bathrooms: z.coerce.number().int().min(1).optional(),
    propertyType: z.string().optional(),
    availability: z.string().optional(),
    amenities: z.string().optional(),
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(50).default(20)
  })
});

export const propertyIdSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  })
});

export const createPropertySchema = z.object({
  body: z.object({
    title: z.string().min(5).max(180),
    apartmentName: z.string().min(2).max(160),
    description: z.string().min(20).max(4000),
    monthlyRent: z.coerce.number().positive(),
    depositAmount: z.coerce.number().nonnegative(),
    bedrooms: z.coerce.number().int().min(0),
    bathrooms: z.coerce.number().int().min(1),
    squareFeet: z.coerce.number().int().positive().optional(),
    propertyType: z.string().min(2).max(80),
    amenities: z.array(z.string().min(2).max(80)).default([]),
    media: z.array(
      z.object({
        url: z.string().url(),
        type: z.enum(["image", "video"]),
        caption: z.string().max(160).optional(),
        sortOrder: z.number().int().min(0).default(0)
      })
    ).default([]),
    addressLine: z.string().max(240).optional(),
    city: z.string().min(2).max(80),
    neighborhood: z.string().min(2).max(120),
    latitude: z.number().min(-90).max(90).optional(),
    longitude: z.number().min(-180).max(180).optional(),
    availabilityStatus: propertyStatus.default("pending_approval"),
    availableFrom: z.string().datetime().optional()
  })
});

export const updatePropertySchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: createPropertySchema.shape.body.partial()
});

export const propertyStatusSchema = z.object({
  params: z.object({
    id: z.string().uuid()
  }),
  body: z.object({
    status: propertyStatus
  })
});
