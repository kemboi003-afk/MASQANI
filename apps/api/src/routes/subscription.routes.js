import { Router } from "express";
import { subscriptionController } from "../controllers/subscription.controller.js";
import { requireAuth, requireRole, requireVerifiedPhone } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { checkoutSchema } from "../validators/subscription.validator.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const subscriptionRoutes = Router();

subscriptionRoutes.get("/plans", asyncHandler(subscriptionController.plans));
subscriptionRoutes.get("/dashboard", requireAuth, requireRole("landlord"), asyncHandler(subscriptionController.dashboard));
subscriptionRoutes.post(
  "/checkout",
  requireAuth,
  requireRole("landlord"),
  requireVerifiedPhone,
  validate(checkoutSchema),
  asyncHandler(subscriptionController.checkout)
);
