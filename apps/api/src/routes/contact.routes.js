import { Router } from "express";
import { z } from "zod";
import { contactController } from "../controllers/contact.controller.js";
import { authLimiter } from "../middleware/rateLimiter.js";
import { validate } from "../middleware/validate.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const contactRoutes = Router();
contactRoutes.post("/", authLimiter, validate(z.object({ body: z.object({ name: z.string().min(2).max(160), email: z.string().email().max(254), message: z.string().min(10).max(3000) }) })), asyncHandler(contactController.create));
