"use client";

import { useMemo, useState } from "react";
import { Bath, BedDouble, Home, MapPin, Search, SlidersHorizontal } from "lucide-react";
import { properties } from "@/lib/data";
import { useDebouncedValue } from "@/hooks/useDebouncedValue";

export function HeroSearch() {
  const [location, setLocation] = useState("");
  const [price, setPrice] = useState("120000");
  const [bedrooms, setBedrooms] = useState("any");
  const [type, setType] = useState("any");
  const debouncedLocation = useDebouncedValue(location, 250);

  const resultCount = useMemo(() => {
    return properties.filter((property) => {
      const inLocation = property.location.toLowerCase().includes(debouncedLocation.toLowerCase());
      const inPrice = property.rent <= Number(price);
      const inBeds = bedrooms === "any" || property.bedrooms >= Number(bedrooms);
      const inType = type === "any" || property.propertyType === type;

      return inLocation && inPrice && inBeds && inType;
    }).length;
  }, [bedrooms, debouncedLocation, price, type]);

  return (
    <form
      className="grid gap-3 rounded-lg border border-white/20 bg-white/95 p-3 shadow-soft backdrop-blur dark:bg-slate-950/95 md:grid-cols-[1.4fr_.9fr_.8fr_.9fr_auto]"
      action="#featured"
    >
      <label className="grid gap-1 text-left text-xs font-black uppercase text-slate-500">
        <span className="flex items-center gap-1">
          <MapPin size={14} />
          Location
        </span>
        <input
          className="min-h-12 rounded-lg border border-line bg-white px-3 text-base font-semibold text-slate-900 outline-none focus:border-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          placeholder="Kilimani, Ruaka..."
          value={location}
          onChange={(event) => setLocation(event.target.value)}
        />
      </label>

      <label className="grid gap-1 text-left text-xs font-black uppercase text-slate-500">
        <span className="flex items-center gap-1">
          <SlidersHorizontal size={14} />
          Max rent
        </span>
        <select
          className="min-h-12 rounded-lg border border-line bg-white px-3 text-base font-semibold text-slate-900 outline-none focus:border-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          value={price}
          onChange={(event) => setPrice(event.target.value)}
        >
          <option value="30000">KES 30K</option>
          <option value="60000">KES 60K</option>
          <option value="90000">KES 90K</option>
          <option value="120000">KES 120K</option>
          <option value="180000">KES 180K</option>
        </select>
      </label>

      <label className="grid gap-1 text-left text-xs font-black uppercase text-slate-500">
        <span className="flex items-center gap-1">
          <BedDouble size={14} />
          Beds
        </span>
        <select
          className="min-h-12 rounded-lg border border-line bg-white px-3 text-base font-semibold text-slate-900 outline-none focus:border-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          value={bedrooms}
          onChange={(event) => setBedrooms(event.target.value)}
        >
          <option value="any">Any</option>
          <option value="1">1+</option>
          <option value="2">2+</option>
          <option value="3">3+</option>
        </select>
      </label>

      <label className="grid gap-1 text-left text-xs font-black uppercase text-slate-500">
        <span className="flex items-center gap-1">
          <Home size={14} />
          Type
        </span>
        <select
          className="min-h-12 rounded-lg border border-line bg-white px-3 text-base font-semibold text-slate-900 outline-none focus:border-primary-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          value={type}
          onChange={(event) => setType(event.target.value)}
        >
          <option value="any">Any</option>
          <option value="Apartment">Apartment</option>
          <option value="Studio">Studio</option>
          <option value="Maisonette">Maisonette</option>
          <option value="Bedsitter">Bedsitter</option>
        </select>
      </label>

      <button className="min-h-12 rounded-lg bg-accent-500 px-5 font-black text-white hover:bg-accent-600" type="submit">
        <span className="flex items-center justify-center gap-2">
          <Search size={18} />
          <span>{resultCount} matches</span>
        </span>
      </button>
    </form>
  );
}
