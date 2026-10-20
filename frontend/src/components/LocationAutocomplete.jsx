import { useState, useRef, useEffect } from "react";
import { api } from "../api.js";

export default function LocationAutocomplete({ label, placeholder, value, onSelect }) {
  const [query, setQuery] = useState(value?.label || "");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    setQuery(value?.label || "");
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const q = e.target.value;
    setQuery(q);
    onSelect(null); // clear selection until they pick a real match again

    clearTimeout(debounceRef.current);
    if (q.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.searchLocations(q);
        setResults(res);
        setOpen(true);
      } catch {
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
  };

  const pick = (loc) => {
    setQuery(loc.label);
    onSelect(loc);
    setOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <label className="text-[11px] uppercase tracking-wider text-ink2 font-mono">
        {label}
      </label>
      <input
        value={query}
        onChange={handleChange}
        onFocus={() => results.length > 0 && setOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        required
        className="w-full mt-1.5 bg-ink border border-border rounded-lg px-3 py-2.5 text-white placeholder:text-ink2/50 outline-none focus:border-coral/60"
      />

      {open && (
        <div className="absolute z-20 mt-1 w-full bg-surface-raised border border-border rounded-lg shadow-2xl shadow-black/40 max-h-56 overflow-y-auto">
          {loading && (
            <p className="px-3 py-2.5 text-xs text-ink2">Searching…</p>
          )}
          {!loading && results.length === 0 && (
            <p className="px-3 py-2.5 text-xs text-ink2">
              No matches — try a different spelling
            </p>
          )}
          {!loading &&
            results.map((loc) => (
              <button
                type="button"
                key={loc.code}
                onClick={() => pick(loc)}
                className="w-full text-left px-3 py-2.5 hover:bg-border/60 flex items-center justify-between gap-2 transition-colors"
              >
                <span className="text-sm text-white">{loc.label}</span>
                <span className="text-[10px] font-mono text-ink2 shrink-0">
                  {loc.code}
                </span>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
