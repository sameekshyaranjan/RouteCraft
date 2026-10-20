const AGENT_META = {
  Supervisor: { icon: "🧭", color: "text-white", ring: "ring-white/30" },
  "Flight Agent": { icon: "✈️", color: "text-coral", ring: "ring-coral/40" },
  "Hotel Agent": { icon: "🏨", color: "text-amber", ring: "ring-amber/40" },
  "Weather Agent": { icon: "☁️", color: "text-horizon", ring: "ring-horizon/40" },
  "Ground Transport Agent": {
    icon: "🚆",
    color: "text-emerald-400",
    ring: "ring-emerald-400/40",
  },
  "Budget Agent": { icon: "💰", color: "text-white", ring: "ring-white/30" },
  "Itinerary Agent": { icon: "🗺️", color: "text-white", ring: "ring-white/30" },
};

function Node({ name, step, active }) {
  const meta = AGENT_META[name];
  const status = step?.status ?? (active ? "running" : "pending");

  const ringClass =
    status === "error"
      ? "ring-2 ring-red-400/60"
      : status === "skipped"
      ? "ring-1 ring-border opacity-50"
      : status === "done"
      ? `ring-2 ${meta.ring}`
      : status === "running"
      ? `ring-2 ${meta.ring} node-pulse`
      : "ring-1 ring-border";

  return (
    <div className="flex flex-col items-center gap-2 w-28">
      <div
        className={`w-14 h-14 rounded-full bg-surface flex items-center justify-center text-xl ${ringClass} transition-all`}
      >
        {status === "pending" || status === "skipped" ? (
          <span className="opacity-30">{meta.icon}</span>
        ) : (
          meta.icon
        )}
      </div>
      <p className={`text-xs font-medium text-center leading-tight ${status === "skipped" ? "text-ink2" : meta.color}`}>
        {name}
      </p>
      {step?.summary && (
        <p className="text-[10px] text-ink2 text-center leading-snug line-clamp-2">
          {step.summary}
        </p>
      )}
      {status === "running" && !step && (
        <p className="text-[10px] text-ink2 text-center">working…</p>
      )}
    </div>
  );
}

function VLine({ active }) {
  return (
    <div className="flex justify-center h-6">
      <div
        className={`w-px h-full ${
          active ? "border-l border-dashed border-coral/60 dash-flow" : "border-l border-dashed border-border"
        }`}
      />
    </div>
  );
}

export default function AgentPipeline({ agentLog, running }) {
  const byName = Object.fromEntries((agentLog || []).map((s) => [s.agent, s]));
  const hasAny = (agentLog || []).length > 0;

  return (
    <div className="bg-surface/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6 sm:p-8 animate-fade-up shadow-2xl shadow-black/30">
      <p className="text-[11px] uppercase tracking-wider text-ink2 font-mono mb-6 text-center">
        {running ? "Agents in flight" : "Mission log"}
      </p>

      <div className="flex flex-col items-center">
        <Node name="Supervisor" step={byName["Supervisor"]} active={running} />

        <VLine active={running && !byName["Supervisor"]} />

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
          <Node name="Flight Agent" step={byName["Flight Agent"]} active={running} />
          <Node name="Hotel Agent" step={byName["Hotel Agent"]} active={running} />
          <Node name="Weather Agent" step={byName["Weather Agent"]} active={running} />
          <Node
            name="Ground Transport Agent"
            step={byName["Ground Transport Agent"]}
            active={running}
          />
        </div>

        <VLine
          active={
            running &&
            !!byName["Supervisor"] &&
            !byName["Budget Agent"]
          }
        />

        <Node name="Budget Agent" step={byName["Budget Agent"]} active={running} />

        <VLine active={running && !!byName["Budget Agent"] && !byName["Itinerary Agent"]} />

        <Node name="Itinerary Agent" step={byName["Itinerary Agent"]} active={running} />
      </div>

      {!hasAny && running && (
        <p className="text-center text-xs text-ink2 mt-6">
          Dispatching the crew — flights, hotels, and weather are being
          checked in parallel…
        </p>
      )}
    </div>
  );
}
