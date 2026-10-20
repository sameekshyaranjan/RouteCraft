export default function WeatherCard({ weather }) {
  if (!weather) {
    return (
      <div className="p-4 rounded-xl border border-border bg-ink text-xs text-ink2">
        Weather data unavailable for this destination.
      </div>
    );
  }
  return (
    <div className="p-4 rounded-xl border border-horizon/30 bg-horizon/[0.06] flex items-center gap-4">
      <div className="w-11 h-11 rounded-lg bg-surface-raised flex items-center justify-center text-lg shrink-0">
        ☁️
      </div>
      <div>
        <p className="text-sm text-white">
          <span className="text-horizon font-display text-lg">
            {weather.avg_low_c.toFixed(0)}°–{weather.avg_high_c.toFixed(0)}°C
          </span>
        </p>
        <p className="text-xs text-ink2 mt-0.5 capitalize">{weather.conditions}</p>
      </div>
    </div>
  );
}
