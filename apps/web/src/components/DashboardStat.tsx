export function DashboardStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--app-line)] bg-white p-4 shadow-sm dark:bg-slate-900">
      <strong className="block text-2xl font-black text-slate-950 dark:text-white">{value}</strong>
      <span className="text-sm font-bold text-slate-500 dark:text-slate-300">{label}</span>
    </div>
  );
}
