import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Bath, BedDouble, CalendarPlus, Flag, Heart, MapPinned, MessageCircle, Phone, Play, ShieldCheck, Star } from "lucide-react";
import { properties } from "@/lib/data";
import { money } from "@/lib/format";

export function generateStaticParams() {
  return properties.map((property) => ({ id: property.id }));
}

export default async function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const property = properties.find((item) => item.id === id);

  if (!property) {
    notFound();
  }

  return (
    <section className="py-8 md:py-12">
      <div className="app-container grid gap-6">
        <div className="grid gap-4 lg:grid-cols-[1.25fr_.75fr]">
          <div className="grid gap-3">
            <div className="relative overflow-hidden rounded-lg">
              <Image src={property.images[0]} alt={property.title} width={1200} height={780} priority className="aspect-[16/10] w-full object-cover" />
              <div className="absolute left-3 top-3 flex gap-2">
                <span className="rounded-lg bg-accent-500 px-3 py-2 text-sm font-black text-white">{property.status}</span>
                {property.landlord.verified && <span className="rounded-lg bg-white px-3 py-2 text-sm font-black text-primary-700">Verified</span>}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {property.images.slice(1).map((image) => (
                <Image key={image} src={image} alt={property.title} width={420} height={300} className="aspect-[4/3] rounded-lg object-cover" />
              ))}
              <div className="relative overflow-hidden rounded-lg">
                <Image src={property.videoTour} alt={`${property.title} video tour`} width={420} height={300} className="aspect-[4/3] object-cover" />
                <div className="absolute inset-0 grid place-items-center bg-slate-950/35 text-white">
                  <span className="grid h-12 w-12 place-items-center rounded-lg bg-white/20 backdrop-blur">
                    <Play size={22} fill="currentColor" />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <aside className="grid gap-4">
            <div className="rounded-lg border border-[var(--app-line)] bg-white p-5 shadow-sm dark:bg-slate-900">
              <p className="text-sm font-black uppercase text-accent-600">{property.apartmentName}</p>
              <h1 className="mt-2 text-3xl font-black text-slate-950 dark:text-white">{property.title}</h1>
              <p className="mt-2 flex items-center gap-1 text-sm font-bold text-slate-500 dark:text-slate-300">
                <MapPinned size={17} />
                {property.location}
              </p>
              <strong className="mt-5 block text-3xl font-black text-primary-700 dark:text-primary-100">{money(property.rent)} / month</strong>
              <p className="mt-1 text-sm font-bold text-slate-500 dark:text-slate-300">Deposit {money(property.deposit)}</p>

              <div className="mt-5 grid grid-cols-3 gap-2">
                <span className="grid min-h-16 place-items-center rounded-lg bg-slate-100 text-sm font-black dark:bg-slate-800">
                  <BedDouble size={19} />
                  {property.bedrooms || "Bed"}
                </span>
                <span className="grid min-h-16 place-items-center rounded-lg bg-slate-100 text-sm font-black dark:bg-slate-800">
                  <Bath size={19} />
                  {property.bathrooms}
                </span>
                <span className="grid min-h-16 place-items-center rounded-lg bg-slate-100 text-sm font-black dark:bg-slate-800">
                  <Star size={19} />
                  {property.landlord.rating}
                </span>
              </div>

              <div className="mt-5 grid gap-2">
                <a href={`tel:${property.landlord.phone}`} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg bg-primary-600 px-4 font-black text-white hover:bg-primary-700">
                  <Phone size={18} />
                  Call landlord
                </a>
                <a href={property.landlord.whatsapp} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[var(--app-line)] px-4 font-black text-slate-700 dark:text-slate-100">
                  <MessageCircle size={18} />
                  WhatsApp
                </a>
                <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[var(--app-line)] px-4 font-black text-slate-700 dark:text-slate-100" type="button">
                  <CalendarPlus size={18} />
                  Schedule viewing
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-[var(--app-line)] bg-white p-5 dark:bg-slate-900">
              <h2 className="text-lg font-black text-slate-950 dark:text-white">Landlord</h2>
              <div className="mt-3 flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-lg bg-primary-50 text-primary-700 dark:bg-slate-800 dark:text-primary-100">
                  {property.landlord.name.slice(0, 1)}
                </span>
                <div>
                  <p className="font-black text-slate-950 dark:text-white">{property.landlord.name}</p>
                  <p className="flex items-center gap-1 text-sm font-bold text-slate-500 dark:text-slate-300">
                    <ShieldCheck size={16} />
                    Verified - {property.landlord.rating} rating
                  </p>
                </div>
              </div>
            </div>
          </aside>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
          <div className="rounded-lg border border-[var(--app-line)] bg-white p-5 dark:bg-slate-900">
            <h2 className="text-xl font-black text-slate-950 dark:text-white">Details</h2>
            <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">{property.description}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {property.amenities.map((amenity) => (
                <span key={amenity} className="rounded-lg bg-primary-50 px-3 py-2 text-sm font-bold text-primary-700 dark:bg-slate-800 dark:text-primary-100">
                  {amenity}
                </span>
              ))}
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-[var(--app-line)] px-4 font-black" type="button">
                <Heart size={18} />
                Save listing
              </button>
              <button className="inline-flex min-h-12 items-center justify-center gap-2 rounded-lg border border-red-200 px-4 font-black text-red-600 dark:border-red-900" type="button">
                <Flag size={18} />
                Report listing
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-[var(--app-line)] bg-white dark:bg-slate-900">
            <div className="relative aspect-[4/3] bg-slate-200 dark:bg-slate-800">
              <Image src="https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=1000&q=85" alt="Map location" fill className="object-cover opacity-90" />
              <div className="absolute inset-0 grid place-items-center">
                <span className="rounded-lg bg-white px-4 py-3 text-sm font-black text-primary-700 shadow-soft">
                  {property.coordinates.lat}, {property.coordinates.lng}
                </span>
              </div>
            </div>
            <div className="p-5">
              <h2 className="font-black text-slate-950 dark:text-white">Map location</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">Exact location is shared after the landlord confirms the viewing request.</p>
            </div>
          </div>
        </div>

        <Link href="/#featured" className="w-fit rounded-lg border border-[var(--app-line)] bg-white px-4 py-3 text-sm font-black text-primary-700 dark:bg-slate-900 dark:text-primary-100">
          Back to properties
        </Link>
      </div>
    </section>
  );
}
