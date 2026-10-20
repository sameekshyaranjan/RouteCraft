function bookingSearchUrl(hotelName, destinationLabel) {
  const query = `${hotelName} ${destinationLabel}`;
  return `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(query)}`;
}

export default function HotelCard({ hotel, destinationLabel, cheapest, selected, onSelect }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect()}
      className={`w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all cursor-pointer ${
        selected
          ? "border-amber bg-amber/[0.10] ring-1 ring-amber"
          : cheapest
          ? "border-amber/50 bg-amber/[0.06] hover:border-amber/70"
          : "border-border bg-ink hover:border-white/20"
      }`}
    >
      <div
        className="w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors"
        style={{ borderColor: selected ? "#FFB454" : "#24404F" }}
      >
        {selected && <div className="w-2.5 h-2.5 rounded-full bg-amber" />}
      </div>
      <div className="w-11 h-11 rounded-lg bg-surface-raised flex items-center justify-center text-lg shrink-0">
        🏨
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-sm font-medium text-white truncate">{hotel.name}</p>
          {cheapest && (
            <span className="text-[10px] font-mono uppercase tracking-wide text-amber bg-amber/10 border border-amber/30 rounded-full px-2 py-0.5 shrink-0">
              cheapest
            </span>
          )}
        </div>
        {hotel.rating && (
          <p className="text-xs text-ink2 mt-0.5">{"★".repeat(Math.round(hotel.rating))}</p>
        )}
        {hotel.address && (
          <p className="text-xs text-ink2 mt-0.5 truncate">{hotel.address}</p>
        )}
        <a
          href={bookingSearchUrl(hotel.name, destinationLabel)}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="inline-flex items-center gap-1 text-[11px] text-horizon hover:text-horizon-soft mt-1.5 underline underline-offset-2"
        >
          Search & book on Booking.com ↗
        </a>
      </div>
      <div className="text-right shrink-0">
        <p className="font-display text-lg text-amber">
          ${hotel.price_usd_per_night.toFixed(0)}
        </p>
        <p className="text-[10px] text-ink2">/ night</p>
      </div>
    </div>
  );
}
