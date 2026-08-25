import { Router } from "express";
import { notificationController } from "../controllers/notification.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const notificationRoutes = Router();

notificationRoutes.use(requireAuth);
notificationRoutes.get("/", asyncHandler(notificationController.list));
notificationRoutes.patch("/:id/read", asyncHandler(notificationController.markRead));
