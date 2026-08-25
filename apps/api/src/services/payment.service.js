import crypto from "node:crypto";
import { env, isProduction } from "../config/env.js";
import { badRequest } from "../utils/httpError.js";

function mpesaBaseUrl() {
  return env.MPESA_ENV === "production"
    ? "https://api.safaricom.co.ke"
    : "https://sandbox.safaricom.co.ke";
}

function mpesaTimestamp() {
  return new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);
}

export const paymentService = {
  async initiate({ payment, plan, method, phone, returnUrl }) {
    if (method === "mpesa") {
      return this.initiateMpesa({ payment, plan, phone });
    }

    if (isProduction && method !== "mpesa") {
      throw badRequest(`${method} payments are not configured for production`);
    }

    if (method === "card") {
      return {
        provider: "card",
        reference: payment.reference,
        redirectUrl: `${returnUrl ?? "https://payments.example.test"}/card/${payment.reference}`,
        status: "pending"
      };
    }

    if (method === "bank") {
      return {
        provider: "bank",
        reference: payment.reference,
        accountName: "MASQANI Ltd",
        accountNumber: "HL-" + payment.reference,
        amount: payment.amount,
        currency: payment.currency,
        status: "pending"
      };
    }

    return {
      provider: "mobile_money",
      reference: payment.reference,
      prompt: "Mobile money checkout initiated",
      status: "pending"
    };
  },

  async initiateMpesa({ payment, phone }) {
    if (!phone) {
      throw badRequest("Phone number is required for M-Pesa payments");
    }

    const configured = env.MPESA_CONSUMER_KEY && env.MPESA_CONSUMER_SECRET && env.MPESA_PASSKEY && env.MPESA_SHORTCODE;

    if (!configured) {
      if (isProduction) throw badRequest("M-Pesa is not configured for production");
      return {
        provider: "mpesa",
        reference: payment.reference,
        checkoutRequestId: "demo-checkout",
        merchantRequestId: "demo-merchant",
        status: "pending",
        demo: true
      };
    }

    const tokenResponse = await fetch(`${mpesaBaseUrl()}/oauth/v1/generate?grant_type=client_credentials`, {
      headers: {
        Authorization: `Basic ${Buffer.from(`${env.MPESA_CONSUMER_KEY}:${env.MPESA_CONSUMER_SECRET}`).toString("base64")}`
      }
    });
    if (!tokenResponse.ok) throw badRequest("Unable to authenticate with M-Pesa");
    const tokenPayload = await tokenResponse.json();
    const timestamp = mpesaTimestamp();
    const password = Buffer.from(`${env.MPESA_SHORTCODE}${env.MPESA_PASSKEY}${timestamp}`).toString("base64");

    const stkResponse = await fetch(`${mpesaBaseUrl()}/mpesa/stkpush/v1/processrequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenPayload.access_token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        BusinessShortCode: env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(Number(payment.amount)),
        PartyA: phone.replace(/[^\d]/g, ""),
        PartyB: env.MPESA_SHORTCODE,
        PhoneNumber: phone.replace(/[^\d]/g, ""),
        CallBackURL: env.MPESA_CALLBACK_URL,
        AccountReference: payment.reference,
        TransactionDesc: "MASQANI landlord subscription"
      })
    });

    const payload = await stkResponse.json();
    if (!stkResponse.ok || !payload.CheckoutRequestID) throw badRequest(payload.errorMessage ?? "M-Pesa checkout could not be started");

    return {
      provider: "mpesa",
      reference: payment.reference,
      checkoutRequestId: payload.CheckoutRequestID,
      merchantRequestId: payload.MerchantRequestID,
      status: "pending"
    };
  },

  verifyHmacSignature(rawBody, signature, secret) {
    if (!secret || !signature) {
      return false;
    }

    const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
    const left = Buffer.from(expected);
    const right = Buffer.from(signature);

    return left.length === right.length && crypto.timingSafeEqual(left, right);
  }
};
