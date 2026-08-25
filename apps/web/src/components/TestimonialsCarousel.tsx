"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { testimonials } from "@/lib/data";

export function TestimonialsCarousel() {
  const [index, setIndex] = useState(0);
  const testimonial = testimonials[index];

  return (
    <div className="rounded-lg border border-[var(--app-line)] bg-white p-5 shadow-sm dark:bg-slate-900">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex gap-1 text-accent-500">
          {Array.from({ length: testimonial.rating }).map((_, itemIndex) => (
            <Star key={itemIndex} size={18} fill="currentColor" />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--app-line)]"
            type="button"
            aria-label="Previous testimonial"
            title="Previous testimonial"
            onClick={() => setIndex((value) => (value === 0 ? testimonials.length - 1 : value - 1))}
          >
            <ChevronLeft size={18} />
          </button>
          <button
            className="grid h-10 w-10 place-items-center rounded-lg border border-[var(--app-line)]"
            type="button"
            aria-label="Next testimonial"
            title="Next testimonial"
            onClick={() => setIndex((value) => (value + 1) % testimonials.length)}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
      <blockquote className="text-xl font-black leading-8 text-slate-950 dark:text-white">"{testimonial.quote}"</blockquote>
      <p className="mt-4 text-sm font-bold text-slate-500 dark:text-slate-300">
        {testimonial.name} - {testimonial.role}
      </p>
    </div>
  );
}
