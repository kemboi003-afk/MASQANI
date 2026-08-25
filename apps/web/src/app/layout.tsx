import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppProvider } from "@/context/AppContext";
import { SiteShell } from "@/components/SiteShell";
import "./globals.css";

export const metadata: Metadata = {
  title: "MASQANI | Find your place.",
  description: "A safer, simpler Kenyan rental marketplace for tenants, landlords, and property teams.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000")
};

export default function RootLayout({
  children
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppProvider>
          <SiteShell>{children}</SiteShell>
        </AppProvider>
      </body>
    </html>
  );
}
