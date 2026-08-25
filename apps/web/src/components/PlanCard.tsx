import { Check, Crown } from "lucide-react";
import clsx from "clsx";
import { money } from "@/lib/format";

type Plan = {
  id: string;
  name: string;
  price: number;
  period: string;
  maxProperties: string;
  features: string[];
  highlighted?: boolean;
};

export function PlanCard({ plan }: { plan: Plan }) {
  return (
    <article
      className={clsx(
        "grid gap-5 rounded-lg border bg-white p-5 shadow-sm dark:bg-slate-900",
        plan.highlighted ? "border-accent-500 ring-2 ring-accent-100 dark:ring-accent-500/30" : "border-[var(--app-line)]"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-xl font-black text-slate-950 dark:text-white">{plan.name}</h3>
          <p className="text-sm font-bold text-slate-500 dark:text-slate-300">{plan.maxProperties}</p>
        </div>
        {plan.highlighted && (
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent-500 text-white" title="Recommended">
            <Crown size={19} />
          </span>
        )}
      </div>

      <div>
        <strong className="text-3xl font-black text-primary-700 dark:text-primary-100">{money(plan.price)}</strong>
        <span className="ml-2 text-sm font-bold text-slate-500 dark:text-slate-300">{plan.period}</span>
      </div>

      <ul className="grid gap-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex gap-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <Check className="mt-0.5 shrink-0 text-primary-600" size={16} />
            {feature}
          </li>
        ))}
      </ul>

      <button className="min-h-11 rounded-lg bg-primary-600 px-4 font-black text-white hover:bg-primary-700" type="button">
        Choose {plan.name}
      </button>
    </article>
  );
}
