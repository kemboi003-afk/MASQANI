import { Router } from "express";
import { paymentController } from "../controllers/payment.controller.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const paymentRoutes = Router();

paymentRoutes.post("/mpesa/callback", asyncHandler(paymentController.mpesaCallback));
paymentRoutes.post("/card/webhook", asyncHandler(paymentController.cardWebhook));
paymentRoutes.post("/bank/webhook", asyncHandler(paymentController.bankWebhook));
paymentRoutes.post("/mobile-money/webhook", asyncHandler(paymentController.mobileMoneyWebhook));
