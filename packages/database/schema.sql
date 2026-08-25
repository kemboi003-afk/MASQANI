create extension if not exists pgcrypto;

do $$ begin
  create type user_role as enum ('tenant', 'landlord', 'admin');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type property_availability_status as enum ('available', 'reserved', 'occupied', 'paused', 'pending_approval');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type moderation_status as enum ('pending', 'approved', 'rejected', 'suspended');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type subscription_status as enum ('pending', 'active', 'expired', 'suspended', 'cancelled');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type payment_provider as enum ('mpesa', 'card', 'bank', 'mobile_money');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type payment_status as enum ('pending', 'completed', 'failed', 'refunded', 'cancelled');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type notification_channel as enum ('push', 'sms', 'email', 'in_app');
exception when duplicate_object then null;
end $$;

create table if not exists users (
  id uuid primary key default gen_random_uuid(),
  role user_role not null,
  name varchar(120) not null,
  email varchar(160) not null unique,
  phone varchar(40) not null default '',
  password_hash text,
  google_subject text,
  avatar_url text,
  phone_verified_at timestamptz,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists otp_challenges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  phone varchar(40) not null,
  purpose varchar(40) not null,
  code_hash text not null,
  expires_at timestamptz not null,
  used_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists plans (
  id varchar(40) primary key,
  name varchar(80) not null,
  price_amount numeric(12, 2) not null,
  currency varchar(8) not null default 'KES',
  duration_days int not null default 30,
  max_properties int,
  featured_listing boolean not null default false,
  priority_visibility boolean not null default false,
  features jsonb not null default '[]',
  active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists subscriptions (
  id uuid primary key default gen_random_uuid(),
  landlord_id uuid not null references users(id) on delete cascade,
  plan_id varchar(40) not null references plans(id),
  status subscription_status not null default 'pending',
  starts_at timestamptz not null,
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  subscription_id uuid references subscriptions(id) on delete set null,
  provider payment_provider not null,
  amount numeric(12, 2) not null,
  currency varchar(8) not null default 'KES',
  status payment_status not null default 'pending',
  reference varchar(80) not null unique,
  provider_reference varchar(140),
  encrypted_payload bytea,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists properties (
  id uuid primary key default gen_random_uuid(),
  landlord_id uuid not null references users(id) on delete cascade,
  title varchar(180) not null,
  apartment_name varchar(160) not null,
  description text not null,
  monthly_rent numeric(12, 2) not null,
  deposit_amount numeric(12, 2) not null default 0,
  bedrooms int not null default 0,
  bathrooms int not null default 1,
  square_feet int,
  property_type varchar(80) not null,
  address_line varchar(240),
  city varchar(80) not null,
  neighborhood varchar(120) not null,
  latitude numeric(10, 7),
  longitude numeric(10, 7),
  availability_status property_availability_status not null default 'pending_approval',
  moderation_status moderation_status not null default 'pending',
  moderation_reason text,
  available_from timestamptz,
  views_count int not null default 0,
  saved_count int not null default 0,
  leads_count int not null default 0,
  featured_until timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create table if not exists property_media (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references properties(id) on delete cascade,
  url text not null,
  media_type varchar(20) not null check (media_type in ('image', 'video')),
  caption varchar(160),
  sort_order int not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists property_amenities (
  property_id uuid not null references properties(id) on delete cascade,
  name varchar(80) not null,
  primary key (property_id, name)
);

create table if not exists saved_properties (
  tenant_id uuid not null references users(id) on delete cascade,
  property_id uuid not null references properties(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (tenant_id, property_id)
);

create table if not exists viewing_requests (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references users(id) on delete cascade,
  property_id uuid not null references properties(id) on delete cascade,
  scheduled_at timestamptz not null,
  status varchar(30) not null default 'pending',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists applications (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references users(id) on delete cascade,
  property_id uuid not null references properties(id) on delete cascade,
  status varchar(30) not null default 'submitted',
  message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  sender_id uuid not null references users(id) on delete cascade,
  receiver_id uuid not null references users(id) on delete cascade,
  property_id uuid references properties(id) on delete set null,
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  type varchar(80) not null,
  title varchar(180) not null,
  body text not null,
  channel notification_channel not null default 'in_app',
  metadata jsonb not null default '{}',
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references users(id) on delete cascade,
  landlord_id uuid not null references users(id) on delete cascade,
  property_id uuid references properties(id) on delete set null,
  rating int not null check (rating between 1 and 5),
  comment text,
  moderation_status moderation_status not null default 'approved',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references users(id) on delete set null,
  property_id uuid references properties(id) on delete set null,
  landlord_id uuid references users(id) on delete set null,
  reason varchar(160) not null,
  body text,
  status varchar(30) not null default 'open',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists support_messages (
  id uuid primary key default gen_random_uuid(),
  name varchar(160) not null,
  email varchar(254) not null,
  message text not null,
  status varchar(30) not null default 'open',
  created_at timestamptz not null default now()
);

create table if not exists search_alerts (
  id uuid primary key default gen_random_uuid(),
  tenant_id uuid not null references users(id) on delete cascade,
  name varchar(140) not null,
  filters jsonb not null default '{}',
  channel notification_channel not null default 'in_app',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists announcements (
  id uuid primary key default gen_random_uuid(),
  admin_id uuid references users(id) on delete set null,
  title varchar(180) not null,
  body text not null,
  audience user_role,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create or replace function touch_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create or replace function refresh_expired_subscriptions()
returns void as $$
begin
  update subscriptions
  set status = 'expired', updated_at = now()
  where status = 'active'
    and expires_at < now();
end;
$$ language plpgsql;

drop trigger if exists touch_users_updated_at on users;
create trigger touch_users_updated_at before update on users for each row execute procedure touch_updated_at();

drop trigger if exists touch_plans_updated_at on plans;
create trigger touch_plans_updated_at before update on plans for each row execute procedure touch_updated_at();

drop trigger if exists touch_subscriptions_updated_at on subscriptions;
create trigger touch_subscriptions_updated_at before update on subscriptions for each row execute procedure touch_updated_at();

drop trigger if exists touch_payments_updated_at on payments;
create trigger touch_payments_updated_at before update on payments for each row execute procedure touch_updated_at();

drop trigger if exists touch_properties_updated_at on properties;
create trigger touch_properties_updated_at before update on properties for each row execute procedure touch_updated_at();

create index if not exists idx_users_role on users(role);
create index if not exists idx_users_phone on users(phone);
create index if not exists idx_otp_lookup on otp_challenges(user_id, purpose, expires_at);
create index if not exists idx_subscriptions_landlord_status on subscriptions(landlord_id, status, expires_at);
create index if not exists idx_payments_user_status on payments(user_id, status);
create index if not exists idx_properties_search on properties(city, neighborhood, property_type, monthly_rent);
create index if not exists idx_properties_landlord on properties(landlord_id);
create index if not exists idx_properties_moderation on properties(moderation_status);
create unique index if not exists idx_property_media_unique on property_media(property_id, url);
create index if not exists idx_saved_properties_tenant on saved_properties(tenant_id, created_at desc);
create index if not exists idx_viewing_requests_tenant on viewing_requests(tenant_id, scheduled_at desc);
create index if not exists idx_messages_inbox on messages(receiver_id, created_at desc);
create index if not exists idx_notifications_user on notifications(user_id, read_at, created_at desc);
create index if not exists idx_reports_status on reports(status);
create index if not exists idx_support_messages_status on support_messages(status, created_at desc);
