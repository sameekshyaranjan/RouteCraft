export default function AmbientBackground({ variant = "full" }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Base gradient wash */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255,122,89,0.10), transparent 60%)," +
            "radial-gradient(ellipse 70% 50% at 90% 10%, rgba(111,195,223,0.10), transparent 55%)," +
            "radial-gradient(ellipse 60% 50% at 10% 90%, rgba(255,180,84,0.08), transparent 55%)",
        }}
      />

      {/* Soft moving color blobs */}
      <div className="absolute -top-32 -left-24 w-[420px] h-[420px] rounded-full bg-coral/20 blur-[110px] animate-blob-float" />
      <div className="absolute top-1/3 -right-32 w-[380px] h-[380px] rounded-full bg-horizon/20 blur-[110px] animate-blob-float [animation-delay:-4s]" />
      <div className="absolute -bottom-24 left-1/4 w-[360px] h-[360px] rounded-full bg-amber/15 blur-[110px] animate-blob-float [animation-delay:-8s]" />

      {/* Subtle world-map dot grid */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.07]"
        preserveAspectRatio="xMidYMid slice"
        viewBox="0 0 800 500"
      >
        <defs>
          <pattern id="dotgrid" width="16" height="16" patternUnits="userSpaceOnUse">
            <circle cx="1.5" cy="1.5" r="1.5" fill="#EDF3F6" />
          </pattern>
          <mask id="worldmask">
            <rect width="800" height="500" fill="black" />
            {/* Loose continent-ish blobs purely as decoration, not a real map */}
            <ellipse cx="160" cy="180" rx="120" ry="70" fill="white" />
            <ellipse cx="260" cy="260" rx="90" ry="60" fill="white" />
            <ellipse cx="420" cy="150" rx="140" ry="80" fill="white" />
            <ellipse cx="560" cy="260" rx="110" ry="90" fill="white" />
            <ellipse cx="680" cy="180" rx="90" ry="60" fill="white" />
            <ellipse cx="380" cy="340" rx="160" ry="70" fill="white" />
          </mask>
        </defs>
        <rect width="800" height="500" fill="url(#dotgrid)" mask="url(#worldmask)" />
      </svg>

      {/* Flight-path arcs */}
      {variant === "full" && (
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.18]"
          preserveAspectRatio="none"
          viewBox="0 0 1200 800"
        >
          <path
            d="M -50 620 Q 300 480 550 530 T 1250 330"
            stroke="#6FC3DF"
            strokeWidth="1.5"
            fill="none"
            className="dash-flow"
          />
          <path
            d="M -50 180 Q 350 280 600 190 T 1250 470"
            stroke="#FF7A59"
            strokeWidth="1.5"
            fill="none"
            className="dash-flow"
          />
          <path
            d="M 100 -20 Q 250 250 480 300 T 900 700"
            stroke="#FFB454"
            strokeWidth="1.5"
            fill="none"
            className="dash-flow"
            style={{ animationDelay: "-2s" }}
          />
        </svg>
      )}

      {/* Grain texture for depth */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.04] mix-blend-overlay">
        <filter id="grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      {/* Vignette to keep edges dark and center readable */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 40%, transparent 40%, rgba(14,26,36,0.55) 100%)",
        }}
      />
    </div>
  );
}
