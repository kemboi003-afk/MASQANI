import { Router } from "express";
import { authController } from "../controllers/auth.controller.js";
import { requireAuth } from "../middleware/auth.js";
import { authLimiter, otpLimiter } from "../middleware/rateLimiter.js";
import { validate } from "../middleware/validate.js";
import {
  forgotPasswordSchema,
  googleAuthSchema,
  loginSchema,
  otpRequestSchema,
  otpVerifySchema,
  registerSchema
} from "../validators/auth.validator.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const authRoutes = Router();

authRoutes.post("/register", authLimiter, validate(registerSchema), asyncHandler(authController.register));
authRoutes.post("/login", authLimiter, validate(loginSchema), asyncHandler(authController.login));
authRoutes.post("/google", authLimiter, validate(googleAuthSchema), asyncHandler(authController.googleAuth));
authRoutes.post("/forgot-password", authLimiter, validate(forgotPasswordSchema), asyncHandler(authController.forgotPassword));
authRoutes.get("/me", requireAuth, asyncHandler(authController.me));
authRoutes.post("/otp/request", requireAuth, otpLimiter, validate(otpRequestSchema), asyncHandler(authController.requestOtp));
authRoutes.post("/otp/verify", requireAuth, otpLimiter, validate(otpVerifySchema), asyncHandler(authController.verifyOtp));
authRoutes.post("/logout", requireAuth, asyncHandler(authController.logout));
