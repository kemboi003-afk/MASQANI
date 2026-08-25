import Link from "next/link";
import { Bell, CalendarClock, ChevronDown, FileText, Heart, History, MapPin, MessageCircle, Search, SlidersHorizontal, type LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { DashboardStat } from "@/components/DashboardStat";
import { PropertyCard } from "@/components/PropertyCard";
import { dashboardMetrics, properties } from "@/lib/data";
import { money } from "@/lib/format";

const tenantSections = ["Overview", "Favorites", "Schedule", "Applications", "Messages", "Alerts"];

export default function TenantDashboardPage() {
  const saved = properties.slice(0, 3);

  return (
    <section className="py-8 md:py-12">
      <div className="app-container grid gap-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-black uppercase text-accent-600">Tenant dashboard</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white md:text-5xl">House search workspace</h1>
          </div>
          <label className="relative md:hidden">
            <select className="min-h-12 w-full appearance-none rounded-lg border border-[var(--app-line)] bg-white px-3 pr-10 font-black dark:bg-slate-900">
              {tenantSections.map((section) => (
                <option key={section}>{section}</option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" size={18} />
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {dashboardMetrics.tenant.map((metric) => (
            <DashboardStat key={metric.label} label={metric.label} value={metric.value} />
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-[280px_1fr]">
          <aside className="hidden rounded-lg border border-[var(--app-line)] bg-white p-3 dark:bg-slate-900 lg:block">
            <nav className="grid gap-1">
              {[
                { label: "Overview", icon: Search },
                { label: "Favorites", icon: Heart },
                { label: "Schedule", icon: CalendarClock },
                { label: "Applications", icon: FileText },
                { label: "Messages", icon: MessageCircle },
                { label: "Alerts", icon: Bell }
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <a key={item.label} href={`#${item.label.toLowerCase()}`} className="flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-black text-slate-600 hover:bg-primary-50 hover:text-primary-700 dark:text-slate-200 dark:hover:bg-slate-800">
                    <Icon size={18} />
                    {item.label}
                  </a>
                );
              })}
            </nav>
          </aside>

          <div className="grid gap-5">
            <div id="overview" className="rounded-lg border border-[var(--app-line)] bg-white p-5 shadow-sm dark:bg-slate-900">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-black text-slate-950 dark:text-white">Advanced filters</h2>
                  <p className="text-sm font-semibold text-slate-500 dark:text-slate-300">Location, budget, bedrooms, bathrooms, type, availability, and amenities</p>
                </div>
                <SlidersHorizontal className="text-primary-600" size={24} />
              </div>
              <form className="grid gap-3 md:grid-cols-4">
                <input className="min-h-12 rounded-lg border border-[var(--app-line)] bg-white px-3 dark:bg-slate-950" placeholder="Location" />
                <select className="min-h-12 rounded-lg border border-[var(--app-line)] bg-white px-3 dark:bg-slate-950">
                  <option>Any price</option>
                  <option>Under KES 50K</option>
                  <option>KES 50K - 100K</option>
                </select>
                <select className="min-h-12 rounded-lg border border-[var(--app-line)] bg-white px-3 dark:bg-slate-950">
                  <option>Bedrooms</option>
                  <option>Studio</option>
                  <option>1+</option>
                  <option>2+</option>
                </select>
                <button className="min-h-12 rounded-lg bg-primary-600 px-4 font-black text-white" type="button">
                  Search
                </button>
              </form>
            </div>

            <div id="favorites">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-xl font-black text-slate-950 dark:text-white">Favorites</h2>
                <Link href="/#featured" className="text-sm font-black text-primary-700 dark:text-primary-100">Browse more</Link>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {saved.map((property) => (
                  <PropertyCard key={property.id} property={property} compact />
                ))}
              </div>
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
              <DashboardPanel id="schedule" title="Viewing schedule" icon={CalendarClock}>
                {[
                  ["Today, 4:30 PM", "Azure Court, Kilimani", "Confirmed"],
                  ["Tue, 10:00 AM", "Palm Heights, Thindigua", "Pending"],
                  ["Fri, 2:15 PM", "Ridge Villas, Ruaka", "Confirmed"]
                ].map(([time, place, status]) => (
                  <div key={place} className="flex items-start justify-between gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                    <div>
                      <p className="font-black text-slate-950 dark:text-white">{place}</p>
                      <p className="text-sm font-semibold text-slate-500 dark:text-slate-300">{time}</p>
                    </div>
                    <span className="rounded-lg bg-primary-50 px-2 py-1 text-xs font-black text-primary-700 dark:bg-slate-900 dark:text-primary-100">{status}</span>
                  </div>
                ))}
              </DashboardPanel>

              <DashboardPanel id="applications" title="Application history" icon={History}>
                {[
                  ["Cedar Residences", money(115000), "Review"],
                  ["Sarit Grove", money(52000), "Shortlisted"],
                  ["Milele Flats", money(14000), "Submitted"]
                ].map(([place, rent, status]) => (
                  <div key={place} className="grid grid-cols-[1fr_auto] gap-2 rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                    <div>
                      <p className="font-black text-slate-950 dark:text-white">{place}</p>
                      <p className="text-sm font-semibold text-slate-500 dark:text-slate-300">{rent}</p>
                    </div>
                    <span className="self-start rounded-lg bg-accent-50 px-2 py-1 text-xs font-black text-accent-600">{status}</span>
                  </div>
                ))}
              </DashboardPanel>
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
              <DashboardPanel id="messages" title="Messages" icon={MessageCircle}>
                {[
                  ["Mercy Wanjiku", "Viewing confirmed for 4:30 PM."],
                  ["Hassan Ali", "The studio is reserved until tomorrow."],
                  ["MASQANI Support", "Your report was received."]
                ].map(([sender, body]) => (
                  <div key={sender} className="rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                    <p className="font-black text-slate-950 dark:text-white">{sender}</p>
                    <p className="text-sm leading-6 text-slate-600 dark:text-slate-300">{body}</p>
                  </div>
                ))}
              </DashboardPanel>

              <DashboardPanel id="alerts" title="Saved search alerts" icon={Bell}>
                {[
                  ["Kilimani 2BR under KES 90K", "4 new homes"],
                  ["Ruaka maisonettes", "1 new home"],
                  ["Bedsitter near Ngong stage", "2 new homes"]
                ].map(([search, count]) => (
                  <div key={search} className="flex items-center justify-between gap-3 rounded-lg bg-slate-50 p-3 dark:bg-slate-800">
                    <div>
                      <p className="font-black text-slate-950 dark:text-white">{search}</p>
                      <p className="flex items-center gap-1 text-sm font-semibold text-slate-500 dark:text-slate-300">
                        <MapPin size={15} />
                        {count}
                      </p>
                    </div>
                    <Bell size={18} className="text-primary-600" />
                  </div>
                ))}
              </DashboardPanel>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardPanel({
  id,
  title,
  icon: Icon,
  children
}: {
  id: string;
  title: string;
  icon: LucideIcon;
  children: ReactNode;
}) {
  return (
    <div id={id} className="rounded-lg border border-[var(--app-line)] bg-white p-5 shadow-sm dark:bg-slate-900">
      <div className="mb-4 flex items-center justify-between gap-3">
        <h2 className="text-xl font-black text-slate-950 dark:text-white">{title}</h2>
        <Icon className="text-primary-600" size={22} />
      </div>
      <div className="grid gap-3">{children}</div>
    </div>
  );
}
