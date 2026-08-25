import { Router } from "express";
import { adminController } from "../controllers/admin.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const adminRoutes = Router();

adminRoutes.use(requireAuth, requireRole("admin"));
adminRoutes.get("/metrics", asyncHandler(adminController.metrics));
adminRoutes.get("/users", asyncHandler(adminController.users));
adminRoutes.get("/listings", asyncHandler(adminController.listings));
adminRoutes.patch("/listings/:id/moderate", asyncHandler(adminController.moderateListing));
