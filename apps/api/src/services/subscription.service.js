import { query, withTransaction } from "../db/pool.js";
import { forbidden, notFound, paymentRequired } from "../utils/httpError.js";

async function expireOldSubscriptions(landlordId) {
  await query(
    `update subscriptions
     set status = 'expired', updated_at = now()
     where landlord_id = $1
       and status = 'active'
       and expires_at < now()`,
    [landlordId]
  );
}

export const subscriptionService = {
  async listPlans() {
    const result = await query(
      `select id, name, price_amount, currency, duration_days, max_properties, features, featured_listing, priority_visibility
       from plans
       where active = true
       order by sort_order asc`
    );
    return result.rows;
  },

  async getDashboard(landlordId) {
    await expireOldSubscriptions(landlordId);

    const [subscriptionResult, paymentsResult, countResult] = await Promise.all([
      query(
        `select s.*, p.name as plan_name, p.max_properties, p.featured_listing, p.priority_visibility
         from subscriptions s
         join plans p on p.id = s.plan_id
         where s.landlord_id = $1
         order by s.created_at desc
         limit 5`,
        [landlordId]
      ),
      query(
        `select id, provider, amount, currency, status, reference, created_at
         from payments
         where user_id = $1
         order by created_at desc
         limit 20`,
        [landlordId]
      ),
      query("select count(*)::int as total from properties where landlord_id = $1 and deleted_at is null", [landlordId])
    ]);

    return {
      subscriptions: subscriptionResult.rows,
      payments: paymentsResult.rows,
      propertyCount: countResult.rows[0]?.total ?? 0
    };
  },

  async getActiveSubscription(landlordId) {
    await expireOldSubscriptions(landlordId);

    const result = await query(
      `select s.*, p.name as plan_name, p.max_properties, p.featured_listing, p.priority_visibility
       from subscriptions s
       join plans p on p.id = s.plan_id
       where s.landlord_id = $1
         and s.status = 'active'
         and s.expires_at >= now()
       order by s.expires_at desc
       limit 1`,
      [landlordId]
    );

    return result.rows[0] ?? null;
  },

  async assertCanPublish(landlordId) {
    const subscription = await this.getActiveSubscription(landlordId);

    if (!subscription) {
      throw paymentRequired("Landlords must purchase an active subscription before publishing properties");
    }

    if (subscription.max_properties !== null) {
      const countResult = await query(
        "select count(*)::int as total from properties where landlord_id = $1 and deleted_at is null",
        [landlordId]
      );

      if ((countResult.rows[0]?.total ?? 0) >= subscription.max_properties) {
        throw forbidden("Subscription property limit reached");
      }
    }

    return subscription;
  },

  async createPendingCheckout({ landlordId, planId, paymentMethod }) {
    const planResult = await query("select * from plans where id = $1 and active = true", [planId]);
    const plan = planResult.rows[0];

    if (!plan) {
      throw notFound("Subscription plan not found");
    }

    return withTransaction(async (client) => {
      const subscriptionResult = await client.query(
        `insert into subscriptions (landlord_id, plan_id, status, starts_at, expires_at)
         values ($1, $2, 'pending', now(), now() + ($3::text || ' days')::interval)
         returning *`,
        [landlordId, planId, plan.duration_days]
      );

      const paymentResult = await client.query(
        `insert into payments (user_id, subscription_id, provider, amount, currency, status, reference)
         values ($1, $2, $3, $4, $5, 'pending', 'HL-' || upper(substr(gen_random_uuid()::text, 1, 10)))
         returning *`,
        [landlordId, subscriptionResult.rows[0].id, paymentMethod, plan.price_amount, plan.currency]
      );

      return {
        plan,
        subscription: subscriptionResult.rows[0],
        payment: paymentResult.rows[0]
      };
    });
  },

  async rememberProviderReference(paymentReference, providerReference) {
    await query("update payments set provider_reference = $2, updated_at = now() where reference = $1", [paymentReference, providerReference]);
  },

  async activateMpesaCheckout(checkoutRequestId, receipt) {
    const payment = await query("select reference from payments where provider = 'mpesa' and provider_reference = $1", [checkoutRequestId]);
    if (!payment.rows[0]) throw notFound("Unknown M-Pesa checkout request");
    return this.activateSubscriptionFromPayment(payment.rows[0].reference, receipt ?? checkoutRequestId);
  },

  async activateSubscriptionFromPayment(paymentReference, providerReference) {
    return withTransaction(async (client) => {
      const paymentResult = await client.query(
        `update payments
         set status = 'completed', provider_reference = $2, paid_at = now(), updated_at = now()
         where reference = $1
         returning *`,
        [paymentReference, providerReference]
      );
      const payment = paymentResult.rows[0];

      if (!payment) {
        throw notFound("Payment reference not found");
      }

      const subscriptionResult = await client.query(
        `update subscriptions
         set status = 'active', updated_at = now()
         where id = $1
         returning *`,
        [payment.subscription_id]
      );

      return subscriptionResult.rows[0];
    });
  }
};
