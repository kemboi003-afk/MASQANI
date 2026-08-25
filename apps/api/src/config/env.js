import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  APP_URL: z.string().url().default("http://localhost:4173"),
  PORT: z.coerce.number().default(4000),
  DATABASE_DRIVER: z.enum(["pglite", "postgres"]).default("pglite"),
  LOCAL_DATABASE_PATH: z.string().default(".masqani-data"),
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default("7d"),
  CORS_ORIGIN: z.string().min(1).default("http://localhost:3000"),
  COOKIE_DOMAIN: z.string().optional(),
  GOOGLE_CLIENT_ID: z.string().optional(),
  OTP_EXPIRES_MINUTES: z.coerce.number().default(10),
  SMS_PROVIDER: z.string().default("demo"),
  SMS_API_KEY: z.string().optional(),
  SMS_SENDER_ID: z.string().default("MASQANI"),
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  CLOUDINARY_UPLOAD_FOLDER: z.string().default("masqani"),
  MPESA_ENV: z.enum(["sandbox", "production"]).default("sandbox"),
  MPESA_CONSUMER_KEY: z.string().optional(),
  MPESA_CONSUMER_SECRET: z.string().optional(),
  MPESA_PASSKEY: z.string().optional(),
  MPESA_SHORTCODE: z.string().optional(),
  MPESA_CALLBACK_URL: z.string().url().optional(),
  PAYMENT_PROVIDER_SECRET: z.string().optional(),
  BANK_PAYMENT_WEBHOOK_SECRET: z.string().optional(),
  MOBILE_MONEY_WEBHOOK_SECRET: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_FROM_NUMBER: z.string().optional()
}).superRefine((config, context) => {
  if (config.NODE_ENV !== "production") return;
  if (config.DATABASE_DRIVER !== "postgres") context.addIssue({ code: z.ZodIssueCode.custom, path: ["DATABASE_DRIVER"], message: "Production requires DATABASE_DRIVER=postgres" });
  if (config.JWT_SECRET.length < 64 || config.JWT_SECRET.includes("replace-with")) context.addIssue({ code: z.ZodIssueCode.custom, path: ["JWT_SECRET"], message: "Production JWT_SECRET must be a unique 64+ character secret" });
  if (config.CORS_ORIGIN.split(",").some((origin) => !origin.trim().startsWith("https://"))) context.addIssue({ code: z.ZodIssueCode.custom, path: ["CORS_ORIGIN"], message: "Production CORS origins must use HTTPS" });
  if (!config.COOKIE_DOMAIN || config.COOKIE_DOMAIN === "localhost") context.addIssue({ code: z.ZodIssueCode.custom, path: ["COOKIE_DOMAIN"], message: "Production COOKIE_DOMAIN is required" });
  if (config.MPESA_ENV === "production" && (!config.MPESA_CONSUMER_KEY || !config.MPESA_CONSUMER_SECRET || !config.MPESA_PASSKEY || !config.MPESA_SHORTCODE || !config.MPESA_CALLBACK_URL?.startsWith("https://"))) context.addIssue({ code: z.ZodIssueCode.custom, path: ["MPESA_CALLBACK_URL"], message: "Production M-Pesa requires live credentials and an HTTPS callback URL" });
});

export const env = envSchema.parse(process.env);

export const isProduction = env.NODE_ENV === "production";
