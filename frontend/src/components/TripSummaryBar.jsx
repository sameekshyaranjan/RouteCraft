export default function TripSummaryBar({
  transportLabel,
  transportPrice,
  hotelLabel,
  hotelPricePerNight,
  nights,
  travelers,
  budgetUsd,
}) {
  const hotelTotal = hotelPricePerNight != null ? hotelPricePerNight * nights : null;
  const total =
    (transportPrice || 0) + (hotelTotal || 0);
  const hasAnySelection = transportPrice != null || hotelTotal != null;

  if (!hasAnySelection) return null;

  const overBudget = budgetUsd ? total > budgetUsd : false;

  return (
    <div className="sticky bottom-4 z-10 mx-auto max-w-2xl">
      <div className="bg-surface/90 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-4 shadow-2xl shadow-black/40 flex items-center justify-between gap-4 flex-wrap">
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-xs">
          {transportPrice != null && (
            <div>
              <p className="text-ink2">Your transport</p>
              <p className="text-white">{transportLabel} · ${transportPrice.toFixed(0)}</p>
            </div>
          )}
          {hotelTotal != null && (
            <div>
              <p className="text-ink2">Your hotel</p>
              <p className="text-white">
                {hotelLabel} · ${hotelTotal.toFixed(0)} ({nights}n)
              </p>
            </div>
          )}
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] text-ink2 uppercase tracking-wide font-mono">
            Your total{travelers > 1 ? ` (${travelers} travelers)` : ""}
          </p>
          <p className={`font-display text-xl ${overBudget ? "text-coral" : "text-amber"}`}>
            ${total.toFixed(0)}
          </p>
        </div>
      </div>
    </div>
  );
}
