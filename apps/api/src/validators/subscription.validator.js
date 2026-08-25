import { z } from "zod";

export const checkoutSchema = z.object({
  body: z.object({
    planId: z.string().min(2),
    paymentMethod: z.enum(["mpesa", "card", "bank", "mobile_money"]),
    phone: z.string().min(9).max(40).optional(),
    returnUrl: z.string().url().optional()
  })
});
