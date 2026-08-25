import { Router } from "express";
import { propertyController } from "../controllers/property.controller.js";
import { requireAuth, requireRole, requireVerifiedPhone } from "../middleware/auth.js";
import { requireActiveSubscription } from "../middleware/subscriptionGate.js";
import { validate } from "../middleware/validate.js";
import {
  createPropertySchema,
  listPropertiesSchema,
  propertyIdSchema,
  propertyStatusSchema,
  updatePropertySchema
} from "../validators/property.validator.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const propertyRoutes = Router();

propertyRoutes.get("/", validate(listPropertiesSchema), asyncHandler(propertyController.list));
propertyRoutes.get("/mine", requireAuth, requireRole("landlord"), asyncHandler(propertyController.mine));
propertyRoutes.get("/:id", validate(propertyIdSchema), asyncHandler(propertyController.get));
propertyRoutes.post(
  "/",
  requireAuth,
  requireRole("landlord"),
  requireVerifiedPhone,
  requireActiveSubscription,
  validate(createPropertySchema),
  asyncHandler(propertyController.create)
);
propertyRoutes.patch("/:id", requireAuth, requireRole("landlord"), validate(updatePropertySchema), asyncHandler(propertyController.update));
propertyRoutes.patch("/:id/status", requireAuth, requireRole("landlord"), validate(propertyStatusSchema), asyncHandler(propertyController.setStatus));
propertyRoutes.delete("/:id", requireAuth, requireRole("landlord"), validate(propertyIdSchema), asyncHandler(propertyController.remove));
