import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Building2, CalendarClock, MapPinned, ShieldCheck, Sparkles } from "lucide-react";
import { FAQAccordion } from "@/components/FAQAccordion";
import { HeroSearch } from "@/components/HeroSearch";
import { MotionSection } from "@/components/MotionSection";
import { PlanCard } from "@/components/PlanCard";
import { PropertyCard } from "@/components/PropertyCard";
import { RecentlyAdded } from "@/components/RecentlyAdded";
import { TestimonialsCarousel } from "@/components/TestimonialsCarousel";
import { popularLocations, properties, subscriptionPlans } from "@/lib/data";
import { compactNumber } from "@/lib/format";

export default function HomePage() {
  const featured = properties.filter((property) => property.featured);

  return (
    <>
      <section className="relative isolate min-h-[calc(100svh-64px)] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1800&q=85"
          alt="Modern apartment living room"
          fill
          priority
          className="-z-20 object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-slate-950/58" />

        <div className="app-container grid min-h-[calc(100svh-64px)] content-end gap-8 pb-10 pt-16 md:content-center md:pb-16">
          <div className="max-w-3xl text-white">
            <div className="mb-4 inline-flex items-center gap-2 rounded-lg bg-white/12 px-3 py-2 text-sm font-black backdrop-blur">
              <ShieldCheck size={18} />
              Verified rentals across Nairobi and satellite towns
            </div>
            <h1 className="text-balance text-5xl font-black leading-[1.02] md:text-7xl">MASQANI</h1>
            <p className="mt-4 max-w-2xl text-lg font-medium leading-8 text-white/88 md:text-xl">
              Find real vacancies, contact verified landlords, schedule viewings, and manage applications from your phone.
            </p>
          </div>

          <HeroSearch />

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ["8.4K", "approved listings"],
              ["42K", "tenant accounts"],
              ["KES 12M", "landlord revenue tracked"]
            ].map(([value, label]) => (
              <div key={label} className="rounded-lg border border-white/18 bg-white/12 p-4 text-white backdrop-blur">
                <strong className="block text-2xl font-black">{value}</strong>
                <span className="text-sm font-bold text-white/78">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <MotionSection className="py-12">
        <div className="app-container grid gap-5 md:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Verified landlords", body: "Phone OTP, admin moderation, landlord ratings, and fake-listing reports." },
            { icon: CalendarClock, title: "Viewing workflow", body: "Requests, reminders, tenant applications, and landlord lead tracking." },
            { icon: Sparkles, title: "Subscription quality", body: "Landlords publish only after an active plan is confirmed." }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="rounded-lg border border-[var(--app-line)] bg-white p-5 shadow-sm dark:bg-slate-900">
                <span className="mb-4 grid h-11 w-11 place-items-center rounded-lg bg-primary-50 text-primary-700 dark:bg-slate-800 dark:text-primary-100">
                  <Icon size={21} />
                </span>
                <h2 className="text-lg font-black text-slate-950 dark:text-white">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{item.body}</p>
              </div>
            );
          })}
        </div>
      </MotionSection>

      <MotionSection className="bg-white py-14 dark:bg-slate-950" id="featured">
        <div className="app-container">
          <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase text-accent-600">Featured properties</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950 dark:text-white md:text-4xl">Premium rentals ready for viewing</h2>
            </div>
            <Link href="/tenant/dashboard" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary-600 px-4 font-black text-white hover:bg-primary-700">
              Tenant dashboard
              <ArrowRight size={18} />
            </Link>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {featured.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        </div>
      </MotionSection>

      <MotionSection className="py-14">
        <div className="app-container grid gap-6">
          <div>
            <p className="text-sm font-black uppercase text-accent-600">Recently added</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950 dark:text-white md:text-4xl">Fresh vacancies</h2>
          </div>
          <RecentlyAdded properties={[...properties].sort((a, b) => b.datePosted.localeCompare(a.datePosted))} />
        </div>
      </MotionSection>

      <MotionSection className="bg-white py-14 dark:bg-slate-950">
        <div className="app-container">
          <div className="mb-6">
            <p className="text-sm font-black uppercase text-accent-600">Popular locations</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950 dark:text-white md:text-4xl">City cards</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-4">
            {popularLocations.map((location) => (
              <Link key={location.name} href={`/#featured`} className="group overflow-hidden rounded-lg border border-[var(--app-line)] bg-white dark:bg-slate-900">
                <div className="relative aspect-[4/3]">
                  <Image src={location.image} alt={location.name} fill className="object-cover transition group-hover:scale-105" />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-black text-slate-950 dark:text-white">{location.name}</h3>
                  <p className="mt-1 text-sm font-bold text-slate-500 dark:text-slate-300">{compactNumber(location.count)} listings</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </MotionSection>

      <MotionSection className="py-14" id="pricing">
        <div className="app-container">
          <div className="mb-6 flex flex-col justify-between gap-3 md:flex-row md:items-end">
            <div>
              <p className="text-sm font-black uppercase text-accent-600">Landlord subscriptions</p>
              <h2 className="mt-2 text-3xl font-black text-slate-950 dark:text-white md:text-4xl">Plans that unlock publishing</h2>
            </div>
            <Link href="/landlord/dashboard" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-[var(--app-line)] bg-white px-4 font-black text-primary-700 dark:bg-slate-900 dark:text-primary-100">
              Landlord workspace
              <Building2 size={18} />
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {subscriptionPlans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} />
            ))}
          </div>
        </div>
      </MotionSection>

      <MotionSection className="bg-white py-14 dark:bg-slate-950">
        <div className="app-container grid gap-6 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-sm font-black uppercase text-accent-600">Trust signals</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950 dark:text-white md:text-4xl">What users say</h2>
          </div>
          <TestimonialsCarousel />
        </div>
      </MotionSection>

      <MotionSection className="py-14">
        <div className="app-container grid gap-6 lg:grid-cols-[.85fr_1.15fr]">
          <div>
            <p className="text-sm font-black uppercase text-accent-600">FAQ</p>
            <h2 className="mt-2 text-3xl font-black text-slate-950 dark:text-white md:text-4xl">Common questions</h2>
          </div>
          <FAQAccordion />
        </div>
      </MotionSection>
    </>
  );
}
