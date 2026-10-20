function statusDot(status) {
  if (status === "complete") return "bg-horizon";
  if (status === "complete_with_errors") return "bg-amber";
  return "bg-ink2";
}

export default function Sidebar({
  trips,
  activeId,
  onSelect,
  onNew,
  onDelete,
  open,
  user,
  onLogout,
}) {
  return (
    <aside
      className={`${
        open ? "translate-x-0" : "-translate-x-full"
      } md:translate-x-0 fixed md:static z-30 top-0 left-0 h-full w-72 bg-surface/85 backdrop-blur-xl border-r border-white/10 flex flex-col transition-transform duration-200`}
    >
      <div className="px-5 pt-6 pb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-coral to-amber flex items-center justify-center text-ink font-display font-bold text-sm">
            R
          </div>
          <span className="font-display text-lg text-white tracking-tight">
            RouteCraft
          </span>
        </div>
      </div>

      <div className="px-4">
        <button
          onClick={onNew}
          className="w-full flex items-center justify-center gap-2 text-sm font-medium bg-surface-raised hover:bg-border text-white border border-border rounded-lg py-2.5 transition-colors"
        >
          <span className="text-coral text-base leading-none">+</span>
          Plan a new trip
        </button>
      </div>

      <div className="mt-6 px-5 text-[11px] uppercase tracking-wider text-ink2 font-mono">
        Your trips
      </div>

      <div className="flex-1 overflow-y-auto px-3 mt-2 space-y-0.5 pb-4">
        {trips.length === 0 && (
          <p className="text-xs text-ink2 px-2 py-3 leading-relaxed">
            Your planned trips will show up here.
          </p>
        )}
        {trips.map((t) => (
          <div
            key={t.id}
            onClick={() => onSelect(t.id)}
            className={`group flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer text-sm transition-colors ${
              activeId === t.id
                ? "bg-surface-raised text-white"
                : "text-ink2 hover:bg-surface-raised/60 hover:text-white"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot(t.status)}`} />
            <div className="min-w-0 flex-1">
              <p className="truncate">{t.destination_label}</p>
              <p className="text-[10px] font-mono text-ink2/80 truncate">
                {t.start_date} → {t.end_date}
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(t.id);
              }}
              className="opacity-0 group-hover:opacity-100 text-ink2 hover:text-coral text-xs shrink-0 transition-opacity"
              aria-label="Delete trip"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {user && (
        <div className="px-4 py-4 border-t border-border flex items-center gap-2.5">
          {user.picture ? (
            <img
              src={user.picture}
              alt=""
              className="w-8 h-8 rounded-full border border-border"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-surface-raised flex items-center justify-center text-xs text-white">
              {user.name?.[0]?.toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-xs text-white truncate">{user.name}</p>
            <p className="text-[10px] text-ink2 truncate">{user.email}</p>
          </div>
          <button
            onClick={onLogout}
            className="text-[11px] text-ink2 hover:text-coral shrink-0"
          >
            Sign out
          </button>
        </div>
      )}
    </aside>
  );
}
