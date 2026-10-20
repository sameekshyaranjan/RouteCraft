import { useState } from "react";
import LocationAutocomplete from "./LocationAutocomplete.jsx";

function todayPlus(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export default function TripForm({ onSubmit, loading }) {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [startDate, setStartDate] = useState(todayPlus(21));
  const [endDate, setEndDate] = useState(todayPlus(26));
  const [travelers, setTravelers] = useState(2);
  const [budget, setBudget] = useState("");
  const [preferences, setPreferences] = useState("");
  const [touched, setTouched] = useState(false);

  const submit = (e) => {
    e.preventDefault();
    setTouched(true);
    if (!origin || !destination || !startDate || !endDate) return;
    onSubmit({
      origin: origin.code,
      origin_label: origin.label,
      destination: destination.code,
      destination_label: destination.label,
      start_date: startDate,
      end_date: endDate,
      travelers: Number(travelers),
      budget_usd: budget ? Number(budget) : null,
      preferences,
    });
  };

  return (
    <form
      onSubmit={submit}
      className="bg-surface/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden max-w-2xl mx-auto animate-fade-up shadow-2xl shadow-black/30"
    >
      <div className="bg-surface-raised/60 px-6 py-4 border-b border-dashed border-white/10 flex items-center justify-between">
        <div>
          <p className="font-display text-lg text-white">Plan your trip</p>
          <p className="text-xs text-ink2 mt-0.5">
            Five agents will handle the details
          </p>
        </div>
        <div className="text-2xl">✈️</div>
      </div>

      <div className="p-6 space-y-5">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <LocationAutocomplete
              label="From"
              placeholder="Search any city worldwide…"
              value={origin}
              onSelect={setOrigin}
            />
            {touched && !origin && (
              <p className="text-[11px] text-coral mt-1">Pick a location from the list</p>
            )}
          </div>
          <div>
            <LocationAutocomplete
              label="To"
              placeholder="Search any city worldwide…"
              value={destination}
              onSelect={setDestination}
            />
            {touched && !destination && (
              <p className="text-[11px] text-coral mt-1">Pick a location from the list</p>
            )}
          </div>
        </div>
        <p className="text-[11px] text-ink2 -mt-2">
          🌍 Any city, any country — start typing to search. Domestic India
          trips also unlock train + bus options.
        </p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] uppercase tracking-wider text-ink2 font-mono">
              Departing
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full mt-1.5 bg-ink border border-border rounded-lg px-3 py-2.5 text-white outline-none focus:border-coral/60 [color-scheme:dark]"
            />
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-wider text-ink2 font-mono">
              Returning
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="w-full mt-1.5 bg-ink border border-border rounded-lg px-3 py-2.5 text-white outline-none focus:border-coral/60 [color-scheme:dark]"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="text-[11px] uppercase tracking-wider text-ink2 font-mono">
              Travelers
            </label>
            <input
              type="number"
              min={1}
              max={9}
              value={travelers}
              onChange={(e) => setTravelers(e.target.value)}
              className="w-full mt-1.5 bg-ink border border-border rounded-lg px-3 py-2.5 text-white outline-none focus:border-coral/60"
            />
          </div>
          <div>
            <label className="text-[11px] uppercase tracking-wider text-ink2 font-mono">
              Budget (USD, optional)
            </label>
            <input
              type="number"
              min={0}
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="1500"
              className="w-full mt-1.5 bg-ink border border-border rounded-lg px-3 py-2.5 text-white placeholder:text-ink2/50 outline-none focus:border-coral/60"
            />
          </div>
        </div>

        <div>
          <label className="text-[11px] uppercase tracking-wider text-ink2 font-mono">
            Preferences (optional)
          </label>
          <textarea
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            placeholder="street food, museums, avoid long walks, budget-friendly..."
            rows={2}
            className="w-full mt-1.5 bg-ink border border-border rounded-lg px-3 py-2.5 text-white placeholder:text-ink2/50 outline-none focus:border-coral/60 resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-coral to-amber disabled:opacity-50 text-ink font-semibold rounded-lg py-3 hover:brightness-105 transition-all"
        >
          {loading ? "Agents are working…" : "Dispatch the agents"}
        </button>
      </div>
    </form>
  );
}
