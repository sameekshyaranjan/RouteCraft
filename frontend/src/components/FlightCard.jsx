function fmtTime(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function FlightCard({ flight, cheapest, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
        selected
          ? "border-coral bg-coral/[0.10] ring-1 ring-coral"
          : cheapest
          ? "border-coral/50 bg-coral/[0.06] hover:border-coral/70"
          : "border-border bg-ink hover:border-white/20"
      }`}
    >
      <div className="w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors"
        style={{ borderColor: selected ? "#FF7A59" : "#24404F" }}
      >
        {selected && <div className="w-2.5 h-2.5 rounded-full bg-coral" />}
      </div>
      <div className="w-11 h-11 rounded-lg bg-surface-raised flex items-center justify-center text-lg shrink-0">
        ✈️
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="text-sm font-medium text-white">{flight.airline}</p>
          {cheapest && (
            <span className="text-[10px] font-mono uppercase tracking-wide text-coral bg-coral/10 border border-coral/30 rounded-full px-2 py-0.5">
              cheapest
            </span>
          )}
        </div>
        <p className="text-xs text-ink2 mt-0.5 font-mono">
          {fmtTime(flight.departure)} → {fmtTime(flight.arrival)}
        </p>
        <p className="text-xs text-ink2 mt-0.5">
          {flight.duration} · {flight.stops === 0 ? "nonstop" : `${flight.stops} stop(s)`}
        </p>
        {flight.booking_hint && (
          <p className="text-[10px] text-ink2/70 mt-0.5 italic">{flight.booking_hint}</p>
        )}
      </div>
      <p className="font-display text-lg text-amber shrink-0">
        ${flight.price_usd.toFixed(0)}
      </p>
    </button>
  );
}
