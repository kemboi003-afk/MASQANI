"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import { faqs } from "@/lib/data";

export function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="grid gap-3">
      {faqs.map((faq, index) => {
        const open = index === openIndex;
        return (
          <div key={faq.question} className="rounded-lg border border-[var(--app-line)] bg-white dark:bg-slate-900">
            <button
              className="flex min-h-14 w-full items-center justify-between gap-3 px-4 text-left font-black text-slate-950 dark:text-white"
              type="button"
              onClick={() => setOpenIndex(open ? -1 : index)}
            >
              {faq.question}
              <ChevronDown className={clsx("shrink-0 transition", open && "rotate-180")} size={18} />
            </button>
            {open && <p className="border-t border-[var(--app-line)] px-4 py-4 text-sm leading-6 text-slate-600 dark:text-slate-300">{faq.answer}</p>}
          </div>
        );
      })}
    </div>
  );
}
