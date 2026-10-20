function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between text-sm py-1.5">
      <span className="text-ink2">{label}</span>
      <span className="text-white font-mono">${value.toFixed(0)}</span>
    </div>
  );
}

export default function BudgetCard({ budget }) {
  if (!budget) return null;

  const badge =
    budget.within_budget === true
      ? { text: "Under budget", cls: "text-horizon bg-horizon/10 border-horizon/30" }
      : budget.within_budget === false
      ? { text: "Over budget", cls: "text-coral bg-coral/10 border-coral/30" }
      : null;

  return (
    <div className="p-5 rounded-xl border border-border bg-ink">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-medium text-white">Estimated cost</p>
        {badge && (
          <span
            className={`text-[10px] font-mono uppercase tracking-wide border rounded-full px-2 py-0.5 ${badge.cls}`}
          >
            {badge.text}
          </span>
        )}
      </div>

      <div className="divide-y divide-border/60">
        <Row label="Flights (all travelers)" value={budget.flights_total} />
        <Row label="Hotel (full stay)" value={budget.hotel_total} />
        <Row label="Estimated food + transit + activities" value={budget.estimated_extras} />
      </div>

      <div className="flex items-center justify-between pt-3 mt-1 border-t border-border">
        <span className="text-sm font-medium text-white">Total</span>
        <span className="font-display text-xl text-amber">
          ${budget.grand_total.toFixed(0)}
        </span>
      </div>

      {budget.notes && (
        <p className="text-xs text-ink2 mt-3 leading-relaxed">{budget.notes}</p>
      )}
    </div>
  );
}
