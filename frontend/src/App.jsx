import { useEffect, useState, useCallback } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext.jsx";
import LoginPage from "./components/LoginPage.jsx";
import Sidebar from "./components/Sidebar.jsx";
import TripForm from "./components/TripForm.jsx";
import AgentPipeline from "./components/AgentPipeline.jsx";
import ResultsView from "./components/ResultsView.jsx";
import AmbientBackground from "./components/AmbientBackground.jsx";
import { api } from "./api.js";

function Planner() {
  const { user, ready, logout } = useAuth();
  const [trips, setTrips] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [view, setView] = useState("form"); // "form" | "planning" | "result"
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const refreshTrips = useCallback(() => {
    api.listTrips().then(setTrips).catch(() => {});
  }, []);

  useEffect(() => {
    if (user) refreshTrips();
  }, [user, refreshTrips]);

  const startNew = () => {
    setActiveId(null);
    setResult(null);
    setError(null);
    setView("form");
    setSidebarOpen(false);
  };

  const openTrip = async (id) => {
    setSidebarOpen(false);
    setError(null);
    try {
      const detail = await api.getTrip(id);
      setActiveId(id);
      setResult(detail.result);
      setView("result");
    } catch (e) {
      setError(e.message);
    }
  };

  const deleteTrip = async (id) => {
    await api.deleteTrip(id);
    if (id === activeId) startNew();
    refreshTrips();
  };

  const planTrip = async (payload) => {
    setError(null);
    setView("planning");
    try {
      const res = await api.planTrip(payload);
      setResult(res);
      setActiveId(res.trip_id);
      setView("result");
      refreshTrips();
    } catch (e) {
      setError(e.message);
      setView("form");
    }
  };

  if (!ready) {
    return <div className="min-h-screen bg-ink" />;
  }

  if (!user) {
    return <LoginPage />;
  }

  return (
    <div className="h-screen flex bg-ink text-white overflow-hidden">
      <Sidebar
        trips={trips}
        activeId={activeId}
        onSelect={openTrip}
        onNew={startNew}
        onDelete={deleteTrip}
        open={sidebarOpen}
        user={user}
        onLogout={logout}
      />

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative">
        <AmbientBackground variant="subtle" />

        <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b border-border shrink-0 relative z-10">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-ink2 hover:text-white"
            aria-label="Open trip history"
          >
            ☰
          </button>
          <span className="font-display text-white">RouteCraft</span>
        </div>

        <div className="flex-1 px-4 sm:px-8 py-10 relative z-10">
          {error && (
            <p className="max-w-2xl mx-auto mb-6 text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg px-4 py-3">
              {error}
            </p>
          )}

          {view === "form" && (
            <TripForm onSubmit={planTrip} loading={false} />
          )}

          {view === "planning" && (
            <div className="max-w-md mx-auto">
              <AgentPipeline agentLog={[]} running={true} />
            </div>
          )}

          {view === "result" && result && (
            <div className="max-w-4xl mx-auto space-y-8">
              <div className="max-w-md mx-auto">
                <AgentPipeline agentLog={result.agent_log} running={false} />
              </div>
              <ResultsView result={result} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Planner />
    </AuthProvider>
  );
}
