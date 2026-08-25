"use client";

import Link from "next/link";
import type { Route } from "next";
import { usePathname } from "next/navigation";
import {
  Bell,
  Building2,
  Heart,
  Home,
  LayoutDashboard,
  Menu,
  MessageCircle,
  Moon,
  Search,
  ShieldCheck,
  Sun,
  UserRound,
  X
} from "lucide-react";
import clsx from "clsx";
import { useState, type ReactNode } from "react";
import { useApp } from "@/context/AppContext";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/#featured", label: "Properties" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/tenant/dashboard", label: "Tenant" },
  { href: "/landlord/dashboard", label: "Landlord" },
  { href: "/admin/dashboard", label: "Admin" }
];

const mobileNav = [
  { href: "/", label: "Home", icon: Home },
  { href: "/#featured", label: "Search", icon: Search },
  { href: "/tenant/dashboard", label: "Saved", icon: Heart },
  { href: "/tenant/dashboard#messages", label: "Chat", icon: MessageCircle },
  { href: "/auth", label: "Account", icon: UserRound }
];

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const { darkMode, toggleDarkMode } = useApp();

  return (
    <div className="min-h-screen bg-[var(--app-bg)] text-[var(--app-text)]">
      <header className="sticky top-0 z-50 border-b border-[var(--app-line)] bg-white/92 backdrop-blur dark:bg-slate-950/92">
        <div className="app-container flex h-16 items-center justify-between gap-3">
          <Link href="/" className="flex items-center gap-2 font-black text-primary-700 dark:text-white">
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary-600 text-white shadow-soft">
              <Building2 size={22} />
            </span>
            <span className="text-lg">MASQANI</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href as Route}
                className={clsx(
                  "rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-primary-50 hover:text-primary-700 dark:text-slate-200 dark:hover:bg-slate-800",
                  pathname === link.href && "bg-primary-50 text-primary-700 dark:bg-slate-800 dark:text-white"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <button
              className="focus-ring grid h-10 w-10 place-items-center rounded-lg border border-[var(--app-line)] bg-white text-slate-700 dark:bg-slate-900 dark:text-slate-100"
              onClick={toggleDarkMode}
              type="button"
              aria-label="Toggle dark mode"
              title="Toggle dark mode"
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <Link
              href="/auth"
              className="hidden min-h-10 items-center gap-2 rounded-lg bg-accent-500 px-4 py-2 text-sm font-black text-white shadow-soft transition hover:bg-accent-600 md:inline-flex"
            >
              <ShieldCheck size={17} />
              Sign in
            </Link>
            <button
              className="focus-ring grid h-10 w-10 place-items-center rounded-lg border border-[var(--app-line)] bg-white text-slate-800 dark:bg-slate-900 dark:text-white md:hidden"
              type="button"
              aria-label="Open menu"
              title="Open menu"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        <div
          className={clsx(
            "border-t border-[var(--app-line)] bg-white px-4 py-3 shadow-soft dark:bg-slate-950 md:hidden",
            open ? "block" : "hidden"
          )}
        >
          <div className="grid gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href as Route}
                className="rounded-lg px-3 py-3 text-sm font-bold text-slate-700 hover:bg-primary-50 dark:text-slate-100 dark:hover:bg-slate-800"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <main className="safe-bottom">{children}</main>

      <footer className="border-t border-[var(--app-line)] bg-white py-10 dark:bg-slate-950">
        <div className="app-container grid gap-8 md:grid-cols-[1.3fr_.7fr_.7fr_.7fr]">
          <div>
            <div className="mb-3 flex items-center gap-2 font-black text-primary-700 dark:text-white">
              <Building2 size={24} />
              MASQANI
            </div>
            <p className="max-w-sm text-sm leading-6 text-slate-600 dark:text-slate-300">
              Find your place with verified rentals, clear property details, and safer viewing requests.
            </p>
          </div>
          <FooterList title="Company" items={["About", "Contact", "Careers"]} />
          <FooterList title="Legal" items={["Terms", "Privacy", "Trust"]} />
          <FooterList title="Socials" items={["X", "Instagram", "LinkedIn"]} />
        </div>
      </footer>

      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[var(--app-line)] bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] pt-1 backdrop-blur dark:bg-slate-950/95 md:hidden">
        <div className="grid grid-cols-5">
          {mobileNav.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href as Route}
                className="flex min-h-14 flex-col items-center justify-center gap-1 rounded-lg text-[11px] font-bold text-slate-500 hover:bg-primary-50 hover:text-primary-700 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      <button
        className="fixed bottom-24 right-4 z-40 grid h-11 w-11 place-items-center rounded-lg bg-primary-600 text-white shadow-soft md:hidden"
        type="button"
        title="Notifications"
        aria-label="Notifications"
      >
        <Bell size={19} />
      </button>
    </div>
  );
}

function FooterList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h2 className="mb-3 text-sm font-black text-slate-900 dark:text-white">{title}</h2>
      <div className="grid gap-2">
        {items.map((item) => (
          <a key={item} href="#" className="text-sm font-semibold text-slate-500 hover:text-primary-700 dark:text-slate-300">
            {item}
          </a>
        ))}
      </div>
    </div>
  );
}
