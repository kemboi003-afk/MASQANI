import Link from "next/link";
import type { Route } from "next";
import { ArrowRight, KeyRound, Mail, Phone, ShieldCheck, UserPlus } from "lucide-react";

export default function AuthPage() {
  return (
    <section className="py-10 md:py-16">
      <div className="app-container grid gap-6 lg:grid-cols-[.9fr_1.1fr] lg:items-start">
        <div className="rounded-lg border border-[var(--app-line)] bg-white p-5 shadow-sm dark:bg-slate-900 md:p-8">
          <span className="mb-5 grid h-12 w-12 place-items-center rounded-lg bg-primary-50 text-primary-700 dark:bg-slate-800 dark:text-primary-100">
            <ShieldCheck size={23} />
          </span>
          <h1 className="text-3xl font-black text-slate-950 dark:text-white md:text-5xl">Secure access for tenants, landlords, and admins</h1>
          <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">
            Email login, phone OTP verification, Google authentication, and JWT-backed sessions are supported by the API.
          </p>
          <div className="mt-6 grid gap-3">
            {[
              "Landlord publishing stays locked until OTP and subscription payment are complete.",
              "Tenant accounts manage saved homes, viewings, applications, and alerts.",
              "Admin access is role-gated for moderation and revenue controls."
            ].map((item) => (
              <div key={item} className="flex gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                <ShieldCheck className="shrink-0 text-primary-600" size={18} />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-5">
          <AuthPanel role="Tenant" href="/tenant/dashboard" />
          <AuthPanel role="Landlord" href="/landlord/dashboard" landlord />
        </div>
      </div>
    </section>
  );
}

function AuthPanel({ role, href, landlord = false }: { role: string; href: Route; landlord?: boolean }) {
  return (
    <div className="rounded-lg border border-[var(--app-line)] bg-white p-5 shadow-sm dark:bg-slate-900">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black uppercase text-accent-600">{role}</p>
          <h2 className="text-2xl font-black text-slate-950 dark:text-white">{landlord ? "Register, verify, subscribe" : "Register or sign in"}</h2>
        </div>
        <span className="grid h-11 w-11 place-items-center rounded-lg bg-primary-600 text-white">
          <UserPlus size={20} />
        </span>
      </div>

      <form className="grid gap-3">
        <label className="grid gap-1 text-sm font-bold text-slate-600 dark:text-slate-300">
          Email
          <span className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input className="min-h-12 w-full rounded-lg border border-[var(--app-line)] bg-white pl-10 pr-3 outline-none focus:border-primary-500 dark:bg-slate-950" placeholder="name@example.com" />
          </span>
        </label>
        <label className="grid gap-1 text-sm font-bold text-slate-600 dark:text-slate-300">
          Phone
          <span className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input className="min-h-12 w-full rounded-lg border border-[var(--app-line)] bg-white pl-10 pr-3 outline-none focus:border-primary-500 dark:bg-slate-950" placeholder="+254..." />
          </span>
        </label>
        <label className="grid gap-1 text-sm font-bold text-slate-600 dark:text-slate-300">
          Password
          <span className="relative">
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input className="min-h-12 w-full rounded-lg border border-[var(--app-line)] bg-white pl-10 pr-3 outline-none focus:border-primary-500 dark:bg-slate-950" type="password" placeholder="Password" />
          </span>
        </label>
        {landlord && (
          <label className="grid gap-1 text-sm font-bold text-slate-600 dark:text-slate-300">
            OTP code
            <input className="min-h-12 w-full rounded-lg border border-[var(--app-line)] bg-white px-3 text-center text-xl font-black outline-none focus:border-primary-500 dark:bg-slate-950" placeholder="123456" maxLength={6} />
          </label>
        )}
        <div className="grid gap-2 sm:grid-cols-2">
          <Link href={href} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 font-black text-white hover:bg-primary-700">
            Continue
            <ArrowRight size={18} />
          </Link>
          <button className="min-h-12 rounded-lg border border-[var(--app-line)] px-4 font-black text-slate-700 dark:text-slate-100" type="button">
            Google
          </button>
        </div>
      </form>
    </div>
  );
}
