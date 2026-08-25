import { z } from "zod";

export const createMessageSchema = z.object({
  body: z.object({
    receiverId: z.string().uuid(),
    propertyId: z.string().uuid().optional(),
    body: z.string().min(1).max(3000)
  })
});

export const createViewingSchema = z.object({
  body: z.object({
    propertyId: z.string().uuid(),
    scheduledAt: z.string().datetime()
  })
});

export const createReviewSchema = z.object({
  body: z.object({
    landlordId: z.string().uuid(),
    propertyId: z.string().uuid().optional(),
    rating: z.number().int().min(1).max(5),
    comment: z.string().max(1200).optional()
  })
});
