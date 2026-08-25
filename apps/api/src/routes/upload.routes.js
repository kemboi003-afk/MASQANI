import { Router } from "express";
import { uploadController } from "../controllers/upload.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const uploadRoutes = Router();

uploadRoutes.post("/signature", requireAuth, requireRole("landlord", "admin"), asyncHandler(uploadController.signature));
