import { z } from "zod";
import { adminService } from "../services/admin.service.js";

const moderationSchema = z.object({
  status: z.enum(["approved", "rejected", "suspended", "pending"]),
  reason: z.string().max(400).optional()
});

export const adminController = {
  async metrics(req, res) {
    const metrics = await adminService.metrics();
    res.json(metrics);
  },

  async users(req, res) {
    const users = await adminService.listUsers(req.query.role);
    res.json({ users });
  },

  async listings(req, res) {
    const listings = await adminService.listListings(req.query.status);
    res.json({ listings });
  },

  async moderateListing(req, res) {
    const payload = moderationSchema.parse(req.body);
    const listing = await adminService.moderateListing({
      listingId: req.params.id,
      status: payload.status,
      reason: payload.reason
    });
    res.json({ listing });
  }
};
