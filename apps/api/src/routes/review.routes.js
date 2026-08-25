import { Router } from "express";
import { reviewController } from "../controllers/review.controller.js";
import { requireAuth, requireRole } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createReviewSchema } from "../validators/message.validator.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const reviewRoutes = Router();

reviewRoutes.post("/", requireAuth, requireRole("tenant"), validate(createReviewSchema), asyncHandler(reviewController.create));
