import { useState, useEffect } from "react";
import FlightCard from "./FlightCard.jsx";
import HotelCard from "./HotelCard.jsx";
import WeatherCard from "./WeatherCard.jsx";
import BudgetCard from "./BudgetCard.jsx";
import ItineraryView from "./ItineraryView.jsx";
import TrainCard from "./TrainCard.jsx";
import BusCard from "./BusCard.jsx";
import TripSummaryBar from "./TripSummaryBar.jsx";
import { parseApproxPrice, nightsBetween } from "../utils.js";

function SectionHeader({ title, icon }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-base">{icon}</span>
      <h2 className="font-display text-lg text-white">{title}</h2>
    </div>
  );
}

function ModeTab({ label, active, onClick, count }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`text-xs font-mono px-3 py-1.5 rounded-full border transition-colors ${
        active
          ? "bg-white/10 border-white/40 text-white"
          : "border-border text-ink2 hover:border-white/20 hover:text-white"
      }`}
    >
      {label} {count != null && <span className="opacity-60">({count})</span>}
    </button>
  );
}

export default function ResultsView({ result }) {
  const hasTrains = result.ground_transport?.trains?.length > 0;
  const hasBuses = result.ground_transport?.buses?.length > 0;
  const groundApplicable = result.ground_transport?.applicable && (hasTrains || hasBuses);

  const [transportMode, setTransportMode] = useState("flight");
  const [selectedFlightIdx, setSelectedFlightIdx] = useState(null);
  const [selectedTrainIdx, setSelectedTrainIdx] = useState(null);
  const [selectedBusIdx, setSelectedBusIdx] = useState(null);
  const [selectedHotelIdx, setSelectedHotelIdx] = useState(null);

  // Default to the cheapest flight/hotel preselected, so the summary bar
  // has something meaningful right away — the traveler can change it.
  useEffect(() => {
    if (result.flights?.length && selectedFlightIdx === null) {
      const cheapestIdx = result.flights.reduce(
        (best, f, i, arr) => (f.price_usd < arr[best].price_usd ? i : best),
        0
      );
      setSelectedFlightIdx(cheapestIdx);
    }
    if (result.hotels?.length && selectedHotelIdx === null) {
      const cheapestIdx = result.hotels.reduce(
        (best, h, i, arr) =>
          h.price_usd_per_night < arr[best].price_usd_per_night ? i : best,
        0
      );
      setSelectedHotelIdx(cheapestIdx);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  const cheapestFlight = result.flights?.length
    ? Math.min(...result.flights.map((f) => f.price_usd))
    : null;
  const cheapestHotel = result.hotels?.length
    ? Math.min(...result.hotels.map((h) => h.price_usd_per_night))
    : null;

  const nights = nightsBetween(result.start_date, result.end_date);
  const travelers = result.travelers || 1;

  let transportLabel = null;
  let transportPrice = null;
  if (transportMode === "flight" && selectedFlightIdx != null && result.flights?.[selectedFlightIdx]) {
    const f = result.flights[selectedFlightIdx];
    transportLabel = `✈️ ${f.airline}`;
    transportPrice = f.price_usd;
  } else if (transportMode === "train" && selectedTrainIdx != null && result.ground_transport?.trains?.[selectedTrainIdx]) {
    const t = result.ground_transport.trains[selectedTrainIdx];
    transportLabel = `🚆 ${t.train_type}`;
    transportPrice = parseApproxPrice(t.price_usd_range) * travelers;
  } else if (transportMode === "bus" && selectedBusIdx != null && result.ground_transport?.buses?.[selectedBusIdx]) {
    const b = result.ground_transport.buses[selectedBusIdx];
    transportLabel = `🚌 ${b.operator_type}`;
    transportPrice = parseApproxPrice(b.price_usd_range) * travelers;
  }

  const selectedHotel = selectedHotelIdx != null ? result.hotels?.[selectedHotelIdx] : null;

  return (
    <div className="space-y-8 animate-fade-up pb-4">
      <div className="text-center">
        <p className="text-[11px] uppercase tracking-wider text-ink2 font-mono">
          Your plan for
        </p>
        <h1 className="font-display text-2xl sm:text-3xl text-white mt-1">
          {result.destination_label}
        </h1>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center justify-between mb-3">
            <SectionHeader title="Transport" icon="🧭" />
          </div>

          {groundApplicable && (
            <div className="flex gap-2 mb-3">
              <ModeTab
                label="Flight"
                active={transportMode === "flight"}
                onClick={() => setTransportMode("flight")}
                count={result.flights?.length || 0}
              />
              {hasTrains && (
                <ModeTab
                  label="Train"
                  active={transportMode === "train"}
                  onClick={() => setTransportMode("train")}
                  count={result.ground_transport.trains.length}
                />
              )}
              {hasBuses && (
                <ModeTab
                  label="Bus"
                  active={transportMode === "bus"}
                  onClick={() => setTransportMode("bus")}
                  count={result.ground_transport.buses.length}
                />
              )}
            </div>
          )}

          <p className="text-[11px] text-ink2 mb-3 -mt-1">
            Tap an option to select it — your choice drives the total below.
          </p>

          {transportMode === "flight" && (
            result.flights?.length ? (
              <div className="space-y-2">
                {result.flights.map((f, i) => (
                  <FlightCard
                    key={i}
                    flight={f}
                    cheapest={f.price_usd === cheapestFlight}
                    selected={selectedFlightIdx === i}
                    onSelect={() => {
                      setTransportMode("flight");
                      setSelectedFlightIdx(i);
                    }}
                  />
                ))}
              </div>
            ) : (
              <p className="text-xs text-ink2 p-4 border border-border rounded-xl bg-ink">
                No flight offers found for this route/dates.
              </p>
            )
          )}

          {transportMode === "train" && (
            <div className="space-y-2">
              {result.ground_transport.trains.map((t, i) => (
                <TrainCard
                  key={i}
                  train={t}
                  selected={selectedTrainIdx === i}
                  onSelect={() => setSelectedTrainIdx(i)}
                />
              ))}
            </div>
          )}

          {transportMode === "bus" && (
            <div className="space-y-2">
              {result.ground_transport.buses.map((b, i) => (
                <BusCard
                  key={i}
                  bus={b}
                  selected={selectedBusIdx === i}
                  onSelect={() => setSelectedBusIdx(i)}
                />
              ))}
            </div>
          )}

          {result.ground_transport?.applicable && (
            <p className="text-[10px] text-ink2/70 mt-2 italic">
              Train/bus prices are estimated typical ranges, not live schedules or bookable tickets.
            </p>
          )}
        </div>

        <div>
          <SectionHeader title="Hotels" icon="🏨" />
          <p className="text-[11px] text-ink2 mb-3 -mt-1">
            Estimated price ranges for this destination, not live listings — tap to select.
          </p>
          {result.hotels?.length ? (
            <div className="space-y-2">
              {result.hotels.map((h, i) => (
                <HotelCard
                  key={i}
                  hotel={h}
                  destinationLabel={result.destination_label}
                  cheapest={h.price_usd_per_night === cheapestHotel}
                  selected={selectedHotelIdx === i}
                  onSelect={() => setSelectedHotelIdx(i)}
                />
              ))}
            </div>
          ) : (
            <p className="text-xs text-ink2 p-4 border border-border rounded-xl bg-ink">
              No hotel offers found for this destination/dates.
            </p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <SectionHeader title="Weather" icon="☁️" />
          <WeatherCard weather={result.weather} />
        </div>
        <div>
          <SectionHeader title="Budget (all options considered)" icon="💰" />
          <BudgetCard budget={result.budget} />
        </div>
      </div>

      <div>
        <SectionHeader title="Itinerary" icon="🗺️" />
        <div className="p-5 sm:p-6 rounded-xl border border-border bg-ink">
          <ItineraryView markdown={result.itinerary_markdown} />
        </div>
      </div>

      <TripSummaryBar
        transportLabel={transportLabel}
        transportPrice={transportPrice}
        hotelLabel={selectedHotel?.name}
        hotelPricePerNight={selectedHotel?.price_usd_per_night}
        nights={nights}
        travelers={travelers}
        budgetUsd={result.budget_usd}
      />
    </div>
  );
}
