import { z } from "zod";

export const paymentWebhookSchema = z.object({
  body: z.record(z.unknown())
});
