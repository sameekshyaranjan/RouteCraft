export default function BusCard({ bus, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all ${
        selected
          ? "border-emerald-400 bg-emerald-400/[0.12] ring-1 ring-emerald-400"
          : "border-emerald-400/25 bg-emerald-400/[0.05] hover:border-emerald-400/50"
      }`}
    >
      <div
        className="w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors"
        style={{ borderColor: selected ? "#34d399" : "#24404F" }}
      >
        {selected && <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />}
      </div>
      <div className="w-11 h-11 rounded-lg bg-surface-raised flex items-center justify-center text-lg shrink-0">
        🚌
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white">{bus.operator_type}</p>
        <p className="text-xs text-ink2 mt-0.5">{bus.duration}</p>
      </div>
      <p className="text-sm text-emerald-300 font-mono shrink-0 text-right">
        {bus.price_usd_range}
      </p>
    </button>
  );
}
