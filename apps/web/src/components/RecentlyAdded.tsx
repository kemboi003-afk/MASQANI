"use client";

import { useEffect, useRef, useState } from "react";
import type { Property } from "@/lib/data";
import { PropertyCard } from "@/components/PropertyCard";

export function RecentlyAdded({ properties }: { properties: Property[] }) {
  const [visible, setVisible] = useState(3);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sentinelRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) {
        setVisible((count) => Math.min(count + 3, properties.length));
      }
    });

    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [properties.length]);

  return (
    <div className="grid gap-5">
      <div className="grid gap-4 md:grid-cols-3">
        {properties.slice(0, visible).map((property) => (
          <PropertyCard key={property.id} property={property} compact />
        ))}
      </div>

      <div ref={sentinelRef} className="grid place-items-center">
        {visible < properties.length ? (
          <button
            type="button"
            className="min-h-11 rounded-lg border border-[var(--app-line)] bg-white px-4 text-sm font-black text-primary-700 dark:bg-slate-900 dark:text-primary-100"
            onClick={() => setVisible((count) => Math.min(count + 3, properties.length))}
          >
            Load more homes
          </button>
        ) : (
          <span className="text-sm font-bold text-slate-500 dark:text-slate-300">All recent homes loaded</span>
        )}
      </div>
    </div>
  );
}
