import { AlertCircle, BarChart3, Bell, Check, Crown, Home, Lock, Pencil, Plus, Power, Trash2, UploadCloud } from "lucide-react";
import { DashboardStat } from "@/components/DashboardStat";
import { PlanCard } from "@/components/PlanCard";
import { dashboardMetrics, properties, subscriptionPlans } from "@/lib/data";
import { money } from "@/lib/format";

const onboardingSteps = ["Register", "Verify phone", "Choose plan", "Pay", "Dashboard", "Add properties"];

export default function LandlordDashboardPage() {
  const landlordProperties = properties.slice(0, 4);

  return (
    <section className="py-8 md:py-12">
      <div className="app-container grid gap-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase text-accent-600">Landlord dashboard</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white md:text-5xl">Subscription-backed publishing</h1>
          </div>
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm font-black text-green-700 dark:border-green-900 dark:bg-green-950 dark:text-green-200">
            Active until 2026-07-14
          </div>
        </div>

        <div className="overflow-x-auto rounded-lg border border-[var(--app-line)] bg-white p-3 dark:bg-slate-900">
          <div className="flex min-w-max items-center gap-2">
            {onboardingSteps.map((step, index) => (
              <div key={step} className="flex items-center gap-2">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-600 text-sm font-black text-white">
                  {index < 4 ? <Check size={18} /> : index + 1}
                </span>
                <span className="text-sm font-black text-slate-700 dark:text-slate-200">{step}</span>
                {index < onboardingSteps.length - 1 && <span className="h-px w-8 bg-[var(--app-line)]" />}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dashboardMetrics.landlord.map((metric) => (
            <DashboardStat key={metric.label} label={metric.label} value={metric.value} />
          ))}
        </div>

        <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
          <div className="rounded-lg border border-[var(--app-line)] bg-white p-5 shadow-sm dark:bg-slate-900">
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-black text-slate-950 dark:text-white">Add property</h2>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-300">The API blocks this action when the subscription is expired or over limit.</p>
              </div>
              <Plus className="text-primary-600" size={23} />
            </div>
            <form className="grid gap-3 md:grid-cols-2">
              <input className="min-h-12 rounded-lg border border-[var(--app-line)] bg-white px-3 dark:bg-slate-950" placeholder="Property title" />
              <input className="min-h-12 rounded-lg border border-[var(--app-line)] bg-white px-3 dark:bg-slate-950" placeholder="Apartment name" />
              <input className="min-h-12 rounded-lg border border-[var(--app-line)] bg-white px-3 dark:bg-slate-950" placeholder="Monthly rent" />
              <input className="min-h-12 rounded-lg border border-[var(--app-line)] bg-white px-3 dark:bg-slate-950" placeholder="Deposit amount" />
              <select className="min-h-12 rounded-lg border border-[var(--app-line)] bg-white px-3 dark:bg-slate-950">
                <option>Apartment</option>
                <option>Studio</option>
                <option>Maisonette</option>
                <option>Bedsitter</option>
              </select>
              <select className="min-h-12 rounded-lg border border-[var(--app-line)] bg-white px-3 dark:bg-slate-950">
                <option>Available</option>
                <option>Reserved</option>
                <option>Occupied</option>
              </select>
              <textarea className="min-h-28 rounded-lg border border-[var(--app-line)] bg-white px-3 py-3 dark:bg-slate-950 md:col-span-2" placeholder="Description" />
              <div className="grid min-h-32 place-items-center rounded-lg border border-dashed border-primary-300 bg-primary-50 p-4 text-center text-primary-700 dark:border-slate-700 dark:bg-slate-950 dark:text-primary-100 md:col-span-2">
                <UploadCloud size={26} />
                <span className="mt-2 text-sm font-black">Images, videos, amenities, and map location</span>
              </div>
              <button className="min-h-12 rounded-lg bg-primary-600 px-4 font-black text-white md:col-span-2" type="button">
                Publish property
              </button>
            </form>
          </div>

          <div className="grid gap-5">
            <div className="rounded-lg border border-accent-200 bg-accent-50 p-5 dark:border-accent-500/30 dark:bg-slate-900">
              <div className="mb-3 flex items-center gap-2 text-accent-600">
                <Crown size={22} />
                <h2 className="text-xl font-black">Standard plan</h2>
              </div>
              <p className="text-sm leading-6 text-slate-700 dark:text-slate-300">13 of 20 listing slots used. Featured listings and lead analytics are active.</p>
              <button className="mt-4 min-h-11 rounded-lg bg-accent-500 px-4 font-black text-white" type="button">
                Renew plan
              </button>
            </div>

            <div className="rounded-lg border border-red-200 bg-white p-5 dark:border-red-900 dark:bg-slate-900">
              <div className="mb-3 flex items-center gap-2 text-red-600">
                <Lock size={22} />
                <h2 className="text-xl font-black">Expired state</h2>
              </div>
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">When expiry passes, property creation is blocked, renewal reminders are sent, and payment history remains available.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.15fr_.85fr]">
          <div className="rounded-lg border border-[var(--app-line)] bg-white p-5 shadow-sm dark:bg-slate-900">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-xl font-black text-slate-950 dark:text-white">Property management</h2>
              <Home className="text-primary-600" size={23} />
            </div>
            <div className="grid gap-3">
              {landlordProperties.map((property) => (
                <div key={property.id} className="grid gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800 md:grid-cols-[1fr_auto] md:items-center">
                  <div>
                    <p className="font-black text-slate-950 dark:text-white">{property.title}</p>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-300">{property.location} - {money(property.rent)} - {property.status}</p>
                  </div>
                  <div className="grid grid-cols-4 gap-2">
                    {[Pencil, Power, BarChart3, Trash2].map((Icon, index) => (
                      <button key={index} className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--app-line)] bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-100" type="button">
                        <Icon size={17} />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-[var(--app-line)] bg-white p-5 shadow-sm dark:bg-slate-900">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-xl font-black text-slate-950 dark:text-white">Listing performance</h2>
              <BarChart3 className="text-primary-600" size={23} />
            </div>
            <div className="flex h-64 items-end gap-3">
              {[42, 70, 58, 86, 62, 94, 78].map((value, index) => (
                <div key={index} className="grid flex-1 gap-2">
                  <div className="rounded-lg bg-primary-600" style={{ height: `${value}%` }} />
                  <span className="text-center text-xs font-bold text-slate-500">D{index + 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {subscriptionPlans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>

        <div className="rounded-lg border border-[var(--app-line)] bg-white p-5 shadow-sm dark:bg-slate-900">
          <div className="mb-4 flex items-center gap-2">
            <Bell className="text-primary-600" size={22} />
            <h2 className="text-xl font-black text-slate-950 dark:text-white">Notifications</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              ["New inquiry", "Azure Court has 6 tenant leads today."],
              ["Subscription expiry", "Standard plan renews in 30 days."],
              ["Property approval", "Cedar Residences was approved."]
            ].map(([title, body]) => (
              <div key={title} className="rounded-lg bg-slate-50 p-4 dark:bg-slate-800">
                <div className="mb-2 flex items-center gap-2 font-black text-slate-950 dark:text-white">
                  <AlertCircle size={18} className="text-accent-500" />
                  {title}
                </div>
                <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
