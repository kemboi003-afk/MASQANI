import { subscriptionService } from "../services/subscription.service.js";

function mpesaResultCode(payload) {
  return payload?.Body?.stkCallback?.ResultCode;
}

function mpesaCheckoutRequestId(payload) {
  return payload?.Body?.stkCallback?.CheckoutRequestID;
}

function mpesaReceipt(payload) {
  const metadata = payload?.Body?.stkCallback?.CallbackMetadata?.Item ?? [];
  return metadata.find((item) => item.Name === "MpesaReceiptNumber")?.Value;
}

export const paymentController = {
  async mpesaCallback(req, res) {
    if (mpesaResultCode(req.body) === 0) {
      const checkoutRequestId = mpesaCheckoutRequestId(req.body);
      const receipt = mpesaReceipt(req.body);

      if (checkoutRequestId) {
        await subscriptionService.activateMpesaCheckout(checkoutRequestId, receipt);
      }
    }

    res.json({ ResultCode: 0, ResultDesc: "Accepted" });
  },

  async cardWebhook(req, res) {
    res.json({ received: true });
  },

  async bankWebhook(req, res) {
    res.json({ received: true });
  },

  async mobileMoneyWebhook(req, res) {
    res.json({ received: true });
  }
};
