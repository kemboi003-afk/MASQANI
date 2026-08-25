import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    role: z.enum(["tenant", "landlord"]),
    name: z.string().min(2).max(120),
    email: z.string().email().max(160),
    phone: z.string().min(9).max(40),
    password: z.string().min(8).max(100)
  })
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email(),
    password: z.string().min(8)
  })
});

export const otpRequestSchema = z.object({
  body: z.object({
    purpose: z.enum(["phone_verification", "password_reset"]).default("phone_verification")
  })
});

export const otpVerifySchema = z.object({
  body: z.object({
    code: z.string().regex(/^\d{6}$/),
    purpose: z.enum(["phone_verification", "password_reset"]).default("phone_verification")
  })
});

export const googleAuthSchema = z.object({
  body: z.object({
    idToken: z.string().min(20),
    role: z.enum(["tenant", "landlord"]).default("tenant")
  })
});

export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email()
  })
});
