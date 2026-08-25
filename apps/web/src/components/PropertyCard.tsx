"use client";

import Image from "next/image";
import Link from "next/link";
import { Bath, BedDouble, Heart, MapPin, MessageCircle, Phone, Star } from "lucide-react";
import clsx from "clsx";
import type { Property } from "@/lib/data";
import { money } from "@/lib/format";
import { useApp } from "@/context/AppContext";

export function PropertyCard({ property, compact = false }: { property: Property; compact?: boolean }) {
  const { isSaved, toggleSavedProperty } = useApp();
  const saved = isSaved(property.id);

  return (
    <article className="overflow-hidden rounded-lg border border-[var(--app-line)] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft dark:bg-slate-900">
      <div className="relative">
        <Link href={`/properties/${property.id}`}>
          <Image
            src={property.images[0]}
            alt={property.title}
            width={760}
            height={520}
            className={clsx("w-full object-cover", compact ? "aspect-[4/3]" : "aspect-[16/11]")}
          />
        </Link>
        <div className="absolute left-3 top-3 flex flex-wrap gap-2">
          {property.featured && <span className="rounded-lg bg-accent-500 px-2 py-1 text-xs font-black text-white">Featured</span>}
          <span className="rounded-lg bg-white px-2 py-1 text-xs font-black text-primary-700 shadow-sm">{property.status}</span>
        </div>
        <button
          className={clsx(
            "absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-lg border border-white/60 bg-white/95 shadow-sm",
            saved ? "text-accent-600" : "text-slate-600"
          )}
          type="button"
          onClick={() => toggleSavedProperty(property.id)}
          aria-label={saved ? "Remove saved listing" : "Save listing"}
          title={saved ? "Remove saved listing" : "Save listing"}
        >
          <Heart size={19} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="grid gap-3 p-4">
        <div>
          <div className="mb-1 flex items-start justify-between gap-3">
            <Link href={`/properties/${property.id}`} className="text-base font-black text-slate-950 hover:text-primary-700 dark:text-white">
              {property.title}
            </Link>
            <strong className="shrink-0 text-sm text-primary-700 dark:text-primary-100">{money(property.rent)}</strong>
          </div>
          <p className="flex items-center gap-1 text-sm font-semibold text-slate-500 dark:text-slate-300">
            <MapPin size={15} />
            {property.location}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm font-bold text-slate-600 dark:text-slate-300">
          <span className="flex min-h-10 items-center justify-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-800">
            <BedDouble size={16} />
            {property.bedrooms === 0 ? "Bed" : property.bedrooms}
          </span>
          <span className="flex min-h-10 items-center justify-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-800">
            <Bath size={16} />
            {property.bathrooms}
          </span>
          <span className="flex min-h-10 items-center justify-center gap-1 rounded-lg bg-slate-100 dark:bg-slate-800">
            <Star size={16} />
            {property.landlord.rating}
          </span>
        </div>

        {!compact && <p className="line-clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{property.description}</p>}

        <div className="flex flex-wrap gap-2">
          {property.amenities.slice(0, compact ? 2 : 3).map((amenity) => (
            <span key={amenity} className="rounded-lg bg-primary-50 px-2 py-1 text-xs font-bold text-primary-700 dark:bg-slate-800 dark:text-primary-100">
              {amenity}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2">
          <a
            href={`tel:${property.landlord.phone}`}
            className="grid min-h-11 place-items-center rounded-lg border border-[var(--app-line)] text-slate-700 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800"
            title="Call landlord"
            aria-label="Call landlord"
          >
            <Phone size={18} />
          </a>
          <a
            href={property.landlord.whatsapp}
            className="grid min-h-11 place-items-center rounded-lg border border-[var(--app-line)] text-slate-700 hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-800"
            title="WhatsApp landlord"
            aria-label="WhatsApp landlord"
          >
            <MessageCircle size={18} />
          </a>
          <Link
            href={`/properties/${property.id}`}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary-600 px-3 text-sm font-black text-white hover:bg-primary-700"
          >
            View
          </Link>
        </div>
      </div>
    </article>
  );
}
