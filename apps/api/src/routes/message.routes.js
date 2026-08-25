import { Router } from "express";
import { messageController } from "../controllers/message.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { createMessageSchema } from "../validators/message.validator.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const messageRoutes = Router();

messageRoutes.use(requireAuth);
messageRoutes.get("/", asyncHandler(messageController.list));
messageRoutes.post("/", validate(createMessageSchema), asyncHandler(messageController.create));
