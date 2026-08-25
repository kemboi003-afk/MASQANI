import { Router } from "express";
import { z } from "zod";
import { savedPropertyController } from "../controllers/saved-property.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const savedPropertyRoutes = Router();
savedPropertyRoutes.use(requireAuth, requireRole("tenant"));
savedPropertyRoutes.get("/", asyncHandler(savedPropertyController.list));
savedPropertyRoutes.post("/", validate(z.object({ body: z.object({ propertyId: z.string().uuid() }) })), asyncHandler(savedPropertyController.create));
savedPropertyRoutes.delete("/:propertyId", validate(z.object({ params: z.object({ propertyId: z.string().uuid() }) })), asyncHandler(savedPropertyController.remove));
