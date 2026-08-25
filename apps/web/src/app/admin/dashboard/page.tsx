import { AlertTriangle, BarChart3, BellPlus, CheckCircle2, CreditCard, Megaphone, ShieldAlert, UserCog, XCircle, type LucideIcon } from "lucide-react";
import { DashboardStat } from "@/components/DashboardStat";
import { dashboardMetrics, properties, subscriptionPlans } from "@/lib/data";
import { money } from "@/lib/format";

export default function AdminDashboardPage() {
  return (
    <section className="py-8 md:py-12">
      <div className="app-container grid gap-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase text-accent-600">Admin dashboard</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white md:text-5xl">Moderation and revenue control</h1>
          </div>
          <button className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 font-black text-white" type="button">
            <Megaphone size={18} />
            Announcement
          </button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dashboardMetrics.admin.map((metric) => (
            <DashboardStat key={metric.label} label={metric.label} value={metric.value} />
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.1fr_.9fr]">
          <AdminPanel title="Listings moderation" icon={ShieldAlert}>
            <div className="grid gap-3">
              {properties.slice(0, 4).map((property) => (
                <div key={property.id} className="grid gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <p className="font-black text-slate-950 dark:text-white">{property.title}</p>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-300">{property.location} - {property.landlord.name}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <button className="grid h-10 w-10 place-items-center rounded-lg bg-green-600 text-white" type="button" title="Approve" aria-label="Approve">
                      <CheckCircle2 size={18} />
                    </button>
                    <button className="grid h-10 w-10 place-items-center rounded-lg bg-accent-500 text-white" type="button" title="Suspend" aria-label="Suspend">
                      <AlertTriangle size={18} />
                    </button>
                    <button className="grid h-10 w-10 place-items-center rounded-lg bg-red-600 text-white" type="button" title="Reject" aria-label="Reject">
                      <XCircle size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </AdminPanel>

          <AdminPanel title="Revenue reports" icon={CreditCard}>
            <div className="grid gap-3">
              {subscriptionPlans.map((plan) => (
                <div key={plan.id} className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-black text-slate-950 dark:text-white">{plan.name}</p>
                    <strong className="text-primary-700 dark:text-primary-100">{money(plan.price * (plan.id === "standard" ? 864 : plan.id === "premium" ? 312 : 1420))}</strong>
                  </div>
                  <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-300">{plan.maxProperties}</p>
                </div>
              ))}
            </div>
          </AdminPanel>
        </div>

        <div className="grid gap-5 xl:grid-cols-3">
          <AdminPanel title="Users" icon={UserCog}>
            <div className="grid gap-3">
              {[
                ["Tenants", "31,480", "Active searchers"],
                ["Landlords", "8,120", "Verified owners"],
                ["Admins", "14", "Operations team"]
              ].map(([label, value, note]) => (
                <div key={label} className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                  <strong className="block text-2xl font-black text-slate-950 dark:text-white">{value}</strong>
                  <span className="text-sm font-bold text-slate-500 dark:text-slate-300">{label} - {note}</span>
                </div>
              ))}
            </div>
          </AdminPanel>

          <AdminPanel title="Analytics" icon={BarChart3}>
            <div className="flex h-60 items-end gap-3">
              {[68, 52, 83, 77, 94, 66].map((value, index) => (
                <div key={index} className="grid flex-1 gap-2">
                  <div className="rounded-lg bg-accent-500" style={{ height: `${value}%` }} />
                  <span className="text-center text-xs font-bold text-slate-500">W{index + 1}</span>
                </div>
              ))}
            </div>
          </AdminPanel>

          <AdminPanel title="Reviews and reports" icon={AlertTriangle}>
            <div className="grid gap-3">
              {[
                ["Fake listing report", "Azure Court duplicate photos", "High"],
                ["Landlord review", "Late viewing response", "Medium"],
                ["Payment ticket", "M-Pesa callback mismatch", "High"]
              ].map(([title, body, priority]) => (
                <div key={title} className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                  <div className="flex items-center justify-between gap-3">
                    <p className="font-black text-slate-950 dark:text-white">{title}</p>
                    <span className="rounded-lg bg-red-50 px-2 py-1 text-xs font-black text-red-600 dark:bg-red-950">{priority}</span>
                  </div>
                  <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-300">{body}</p>
                </div>
              ))}
            </div>
          </AdminPanel>
        </div>

        <div className="rounded-lg border border-[var(--app-line)] bg-white p-5 shadow-sm dark:bg-slate-900">
          <div className="mb-5 flex items-center gap-2">
            <BellPlus className="text-primary-600" size={22} />
            <h2 className="text-xl font-black text-slate-950 dark:text-white">Notification channels</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-4">
            {["Push", "SMS", "Email", "In-app"].map((channel) => (
              <div key={channel} className="rounded-lg bg-slate-50 p-4 text-center text-sm font-black text-slate-700 dark:bg-slate-800 dark:text-slate-100">
                {channel}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AdminPanel({
  title,
  icon: Icon,
  children
}: {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-[var(--app-line)] bg-white p-5 shadow-sm dark:bg-slate-900">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-xl font-black text-slate-950 dark:text-white">{title}</h2>
        <Icon className="text-primary-600" size={23} />
      </div>
      {children}
    </div>
  );
}
