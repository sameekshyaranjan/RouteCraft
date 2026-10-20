import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext.jsx";
import AmbientBackground from "./AmbientBackground.jsx";

export default function LoginPage() {
  const { loginWithGoogle } = useAuth();

  return (
    <div className="min-h-screen bg-ink flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <AmbientBackground variant="full" />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full">
        <div className="flex items-center gap-2.5 mb-8">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-coral to-amber flex items-center justify-center text-ink font-display font-bold text-lg shadow-lg shadow-coral/20">
            R
          </div>
          <span className="font-display text-2xl text-white tracking-tight">
            RouteCraft
          </span>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl text-white text-center leading-tight mb-3 drop-shadow-sm">
          Five agents.
          <br />
          One perfect trip.
        </h1>
        <p className="text-ink2 text-sm text-center max-w-sm mb-10 leading-relaxed">
          Tell RouteCraft where you're headed. A crew of specialist AI agents
          finds real flights, real hotels, checks the weather, and builds a
          day-by-day plan — coordinated, not copy-pasted.
        </p>

        <div className="bg-surface/70 backdrop-blur-xl border border-white/10 rounded-2xl p-6 w-full shadow-2xl shadow-black/40">
          <p className="text-xs uppercase tracking-wider text-ink2 font-mono mb-4 text-center">
            Sign in to start planning
          </p>
          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={(cred) => loginWithGoogle(cred.credential)}
              onError={() => console.error("Google sign-in failed")}
              theme="filled_black"
              shape="pill"
            />
          </div>
        </div>

        <div className="flex items-center gap-6 mt-10 text-[11px] text-ink2 font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-coral shadow-[0_0_8px] shadow-coral/60" /> Flight
            Agent
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-amber shadow-[0_0_8px] shadow-amber/60" /> Hotel
            Agent
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-horizon shadow-[0_0_8px] shadow-horizon/60" /> Weather
            Agent
          </span>
        </div>
      </div>
    </div>
  );
}
