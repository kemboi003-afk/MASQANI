import { paymentService } from "../services/payment.service.js";
import { subscriptionService } from "../services/subscription.service.js";

export const subscriptionController = {
  async plans(req, res) {
    const plans = await subscriptionService.listPlans();
    res.json({ plans });
  },

  async dashboard(req, res) {
    const dashboard = await subscriptionService.getDashboard(req.user.id);
    res.json(dashboard);
  },

  async checkout(req, res) {
    const { planId, paymentMethod, phone, returnUrl } = req.validated.body;
    const checkout = await subscriptionService.createPendingCheckout({
      landlordId: req.user.id,
      planId,
      paymentMethod
    });
    const payment = await paymentService.initiate({
      payment: checkout.payment,
      plan: checkout.plan,
      method: paymentMethod,
      phone,
      returnUrl
    });
    if (payment.checkoutRequestId && !payment.demo) {
      await subscriptionService.rememberProviderReference(checkout.payment.reference, payment.checkoutRequestId);
    }

    res.status(201).json({
      subscription: checkout.subscription,
      plan: checkout.plan,
      payment
    });
  }
};
