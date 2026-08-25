import { Router } from "express";
import { z } from "zod";
import { reportController } from "../controllers/report.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const reportSchema = z.object({ body: z.object({ propertyId: z.string().uuid().optional(), landlordId: z.string().uuid().optional(), reason: z.string().min(3).max(160), body: z.string().max(3000).optional() }).refine((item) => item.propertyId || item.landlordId, "A property or landlord is required") });
export const reportRoutes = Router();
reportRoutes.post("/", requireAuth, validate(reportSchema), asyncHandler(reportController.create));
reportRoutes.get("/", requireAuth, requireRole("admin"), asyncHandler(reportController.list));
