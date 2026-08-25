import { Router } from "express";
import { viewingController } from "../controllers/viewing.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createViewingSchema } from "../validators/message.validator.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const viewingRoutes = Router();

viewingRoutes.get("/", requireAuth, asyncHandler(viewingController.list));
viewingRoutes.post("/", requireAuth, requireRole("tenant"), validate(createViewingSchema), asyncHandler(viewingController.create));
