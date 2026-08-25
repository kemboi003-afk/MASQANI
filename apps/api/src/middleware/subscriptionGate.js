import { subscriptionService } from "../services/subscription.service.js";

export async function requireActiveSubscription(req, res, next) {
  try {
    const activeSubscription = await subscriptionService.assertCanPublish(req.user.id);
    req.subscription = activeSubscription;
    next();
  } catch (error) {
    next(error);
  }
}
