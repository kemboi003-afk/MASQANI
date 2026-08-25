import { Router } from "express";
import { query } from "../db/pool.js";
import { issueCsrfToken } from "../middleware/csrfProtection.js";
import { adminRoutes } from "./admin.routes.js";
import { authRoutes } from "./auth.routes.js";
import { contactRoutes } from "./contact.routes.js";
import { messageRoutes } from "./message.routes.js";
import { notificationRoutes } from "./notification.routes.js";
import { paymentRoutes } from "./payment.routes.js";
import { propertyRoutes } from "./property.routes.js";
import { reviewRoutes } from "./review.routes.js";
import { reportRoutes } from "./report.routes.js";
import { savedPropertyRoutes } from "./saved-property.routes.js";
import { subscriptionRoutes } from "./subscription.routes.js";
import { uploadRoutes } from "./upload.routes.js";
import { viewingRoutes } from "./viewing.routes.js";

export const routes = Router();

routes.get("/health", async (req, res, next) => {
  try {
    await query("select 1");
    res.json({
    status: "ok",
    service: "masqani-api",
    timestamp: new Date().toISOString()
    });
  } catch (error) { next(error); }
});

routes.get("/csrf-token", issueCsrfToken);
routes.use("/auth", authRoutes);
routes.use("/contact", contactRoutes);
routes.use("/properties", propertyRoutes);
routes.use("/subscriptions", subscriptionRoutes);
routes.use("/payments", paymentRoutes);
routes.use("/admin", adminRoutes);
routes.use("/messages", messageRoutes);
routes.use("/notifications", notificationRoutes);
routes.use("/reviews", reviewRoutes);
routes.use("/reports", reportRoutes);
routes.use("/saved-properties", savedPropertyRoutes);
routes.use("/uploads", uploadRoutes);
routes.use("/viewings", viewingRoutes);
