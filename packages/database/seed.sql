insert into plans (
  id,
  name,
  price_amount,
  currency,
  duration_days,
  max_properties,
  featured_listing,
  priority_visibility,
  features,
  sort_order
) values
(
  'basic',
  'Basic',
  1200,
  'KES',
  30,
  5,
  false,
  false,
  '["Up to 5 properties", "Listing analytics", "In-app inquiries", "SMS expiry reminders"]',
  1
),
(
  'standard',
  'Standard',
  3200,
  'KES',
  30,
  20,
  true,
  false,
  '["Up to 20 properties", "Featured listings", "Lead tracking", "Priority approval queue"]',
  2
),
(
  'premium',
  'Premium',
  6900,
  'KES',
  30,
  null,
  true,
  true,
  '["Unlimited listings", "Featured badge", "Priority visibility", "Portfolio analytics"]',
  3
)
on conflict (id) do update set
  name = excluded.name,
  price_amount = excluded.price_amount,
  currency = excluded.currency,
  duration_days = excluded.duration_days,
  max_properties = excluded.max_properties,
  featured_listing = excluded.featured_listing,
  priority_visibility = excluded.priority_visibility,
  features = excluded.features,
  sort_order = excluded.sort_order,
  updated_at = now();
