import { notificationService } from "../services/notification.service.js";

export const notificationController = {
  async list(req, res) {
    const notifications = await notificationService.list(req.user.id);
    res.json({ notifications });
  },

  async markRead(req, res) {
    const notification = await notificationService.markRead(req.user.id, req.params.id);
    res.json({ notification });
  }
};
