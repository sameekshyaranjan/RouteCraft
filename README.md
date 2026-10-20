# RouteCraft — Agentic AI Travel Planner

Tell RouteCraft where you're headed. A LangGraph-orchestrated crew of AI agents
— Flight, Hotel, Weather, Budget, and Itinerary — works in parallel to find
real flights and hotels, check the weather, and write a day-by-day plan.

**Stack:** FastAPI + LangGraph + React/Vite/Tailwind, using **free** APIs
only:

| Purpose | Provider | Free tier |
|---|---|---|
| LLM (itinerary + hotel estimates) | [Groq](https://console.groq.com) | Generous free tier, no card |
| Flights | [Travelpayouts / Aviasales Data API](https://www.travelpayouts.com) | Free, instant, self-serve, no card |
| Hotels | Estimated by the LLM | Free (see note below) |
| Weather | [Open-Meteo](https://open-meteo.com) | 100% free, no signup/key at all |
| Auth | [Google Sign-In](https://console.cloud.google.com) | Free |

> **Why hotels are LLM-estimated, not a live API:** this project originally
> used Amadeus for both flights and hotels, but **Amadeus permanently shut
> down its free self-service API portal on July 17, 2026** — existing keys
> were disabled and new signups had already been paused. Its closest
> free alternative, Travelpayouts, provides real cached flight price data
> instantly and self-serve, but its live *hotel* search API requires
> submitting your project for manual approval (not guaranteed or instant).
> Rather than block the project on that, the Hotel Agent asks the LLM for
> realistic, destination-grounded price estimates — clearly a judgment
> call, and clearly labelled as estimates in the UI, not live availability.
> Swap in a live hotel API yourself in `app/services/hotel_estimator.py`
> if you get Travelpayouts hotel-search approval or use another provider.

## Architecture

```
                     ┌─────────────┐
                     │ Supervisor  │
                     └──────┬──────┘
        ┌──────────────┬────┴──────┬──────────────┐
        ▼               ▼           ▼              ▼
 ┌────────────┐  ┌────────────┐ ┌────────────┐ ┌──────────────────┐
 │Flight Agent│  │ Hotel Agent│ │Weather Agent│ │ Ground Transport  │  ← parallel
 └──────┬─────┘  └─────┬──────┘ └──────┬─────┘ │ Agent (India only) │
        └───────────────┼───────────────┴──────┴─────────┬─────────┘
                         ▼                                │
                 ┌──────────────┐ ◄────────────────────────┘
                 │ Budget Agent │
                 └──────┬───────┘
                         ▼
              ┌────────────────────┐
              │  Itinerary Agent   │  ← writes the day-by-day plan
              └────────────────────┘
```

Built with LangGraph's `StateGraph`: a real fan-out/fan-in graph, not a
simple chained prompt. Each agent owns its own slice of shared state, and
if any single agent fails (e.g. no flights found), the rest of the
pipeline still completes gracefully. The **Ground Transport Agent** is
conditional — it only does real work when both origin and destination are
in India, otherwise it reports "not applicable" and the section is hidden
in the UI. This demonstrates a graph where not every branch is always
active, without needing LangGraph's more complex conditional-routing API —
the condition is checked inside the node itself.

**Destinations aren't limited to a fixed list** — `GET /api/locations/search`
does fuzzy search over a curated ~150-location worldwide dataset (major
cities on every continent, plus deep coverage of Indian cities/rail hubs)
and powers live autocomplete in the trip form for both origin and
destination.

---

## 1. Get your free API keys

### Groq (LLM)
1. https://console.groq.com/keys → sign up → **Create API Key** → copy it.

### Travelpayouts (flights)
1. https://www.travelpayouts.com → sign up (free, no card — it's an
   affiliate account, but you don't need any traffic or a website to get
   an API token)
2. Once logged in, go to **Tools → API** (or directly:
   https://app.travelpayouts.com/profile/api-token)
3. Copy your **API token** — this is your `TRAVELPAYOUTS_TOKEN`

This gives you real cached flight price data (what other travelers have
actually found searching these routes recently) — not a live booking
search, but genuine market data, and completely free with no approval
wait.

### Google Sign-In
1. https://console.cloud.google.com → create a project (or use an existing
   one)
2. **APIs & Services → Credentials → Create Credentials → OAuth client ID**
3. Application type: **Web application**
4. Under **Authorized JavaScript origins**, add: `http://localhost:5173`
5. Create → copy the **Client ID** (looks like
   `xxxxx.apps.googleusercontent.com`)
6. You'll use this same Client ID in **both** `backend/.env` and
   `frontend/.env`

### JWT secret
Any long random string works. Generate one with:
```bash
python -c "import secrets; print(secrets.token_hex(32))"
```

---

## 2. Backend setup

```bash
cd backend
python3 -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt

cp .env.example .env
# open .env and fill in: GROQ_API_KEY, TRAVELPAYOUTS_TOKEN,
# GOOGLE_CLIENT_ID, JWT_SECRET

uvicorn app.main:app --reload --port 8000
```

A local `routecraft.db` SQLite file is created automatically, storing users
and their trip history.

## 3. Frontend setup

```bash
cd frontend
npm install

cp .env.example .env
# open .env and fill in: VITE_GOOGLE_CLIENT_ID (same value as backend's
# GOOGLE_CLIENT_ID)

npm run dev
```

Open `http://localhost:5173`. Vite proxies `/api/*` to the backend on port
8000 automatically — see `vite.config.js`.

---

## How a trip gets planned

1. Sign in with Google.
2. Fill in the trip form: origin/destination **airport codes** (IATA,
   e.g. `DEL`, `BKK`), dates, travelers, optional budget and preferences.
3. Hit **Dispatch the agents** — this calls `POST /api/trips/plan`, which
   runs the LangGraph pipeline server-side and returns once everything
   completes (flights, hotels, weather, budget, itinerary all together).
4. The agent pipeline visual shows which agents ran and what each one
   found. Results — flights, hotels, weather, budget breakdown, and the
   AI-written itinerary — are shown below and saved to your trip history.

## Choosing between options yourself

RouteCraft's agents surface *options*, not a single locked-in plan — you pick:

- **Domestic India trips** get a **Flight / Train / Bus** tab switcher above
  the transport section. Tap any card in any tab to select it; your pick
  is highlighted and drives the running total.
- **International trips** show flight options only (no rail/road between
  countries, obviously) — same tap-to-select behavior.
- **Hotels** are always tap-to-select, independent of the transport choice.
- A summary bar pinned near the bottom shows **your actual selected
  transport + hotel cost**, live-recalculated as you change your mind —
  separate from the Budget Agent's own estimate (which reflects the
  cheapest-of-everything scenario for comparison).

Nothing calls out to a real booking system — this is a planning aid, not a
checkout flow — but the numbers you see reflect exactly what you clicked.

## Project structure

```
backend/
  app/
    main.py                FastAPI app + CORS
    config.py               Settings from .env
    database.py              SQLAlchemy models (User, Trip)
    auth/
      google_oauth.py        Verifies Google ID tokens
      jwt_handler.py          Issues/decodes session JWTs
      dependencies.py         get_current_user() FastAPI dependency
    services/
      flight_data.py           Travelpayouts/Aviasales flight price data
      hotel_estimator.py        LLM-based realistic hotel price estimates
      weather.py                 Open-Meteo forecast/historical lookup
      locations.py                Worldwide city/airport search + India check
      ground_transport_estimator.py  LLM-based India train/bus estimates
      llm.py                     Shared Groq LLM instance
    agents/
      state.py                 Shared LangGraph state (TypedDict)
      supervisor.py            Validates & kicks off the plan
      flight_agent.py          Flight price search node
      hotel_agent.py           Hotel estimate node
      weather_agent.py         Weather lookup node
      ground_transport_agent.py  India train/bus node (conditional)
      budget_agent.py          Cost aggregation node
      itinerary_agent.py       LLM-written day-by-day plan node
      graph.py                 Wires the nodes into a StateGraph
    routes/
      auth.py                  /api/auth/google, /api/auth/me
      trips.py                 /api/trips/plan, /api/trips, /api/trips/{id}
      locations.py             /api/locations/search
frontend/
  src/
    App.jsx                  Layout, view state, orchestration
    context/AuthContext.jsx   Signed-in user + JWT session
    components/
      LoginPage.jsx
      Sidebar.jsx             Trip history
      TripForm.jsx            The planning form
      LocationAutocomplete.jsx  Worldwide destination/origin search
      AgentPipeline.jsx       The agent "journey map" visual
      ResultsView.jsx         Combines all result sections
      FlightCard / HotelCard / WeatherCard / BudgetCard / ItineraryView
      TrainCard / BusCard      India ground-transport options
      TripSummaryBar.jsx      Live total based on your actual selections
    utils.js                  Price-range parsing, night-count helpers
```

## Customizing

- **Change the LLM model:** set `GROQ_MODEL` in `backend/.env`.
- **Add more common cities to the form:** edit `COMMON_CITIES` in
  `frontend/src/components/TripForm.jsx`.
- **Add more agents** (e.g. a Visa/Documents agent, an Activities-booking
  agent): add a node file under `backend/app/agents/`, add it to the
  `TripState`, and wire it into `graph.py`.
- **Deploy:** backend is a standard FastAPI app (Render/Railway/Fly.io free
  tiers work well); frontend is a static Vite build (`npm run build` →
  deploy `dist/` to Vercel/Netlify). Remember to update `CORS_ORIGINS`,
  the Google OAuth **Authorized JavaScript origins**, and the frontend's
  API base URL for your deployed domain.

## Troubleshooting

- **"No cached flight prices found"** — Travelpayouts' data API only has
  prices for routes other travelers have actually searched recently. Try
  major routes (big city to big city) if a niche route/date returns
  nothing.
- **Hotel prices look off for a destination** — remember these are
  LLM-estimated, not live listings (see the note above). Treat them as a
  budgeting ballpark, not a quote.
- **Google Sign-In button doesn't appear / errors** — double check
  `VITE_GOOGLE_CLIENT_ID` in `frontend/.env` matches `GOOGLE_CLIENT_ID` in
  `backend/.env`, and that `http://localhost:5173` is listed under
  Authorized JavaScript origins in the Google Cloud Console.
- **401 errors after being signed in a while** — JWT sessions expire after
  7 days by default (see `jwt_expire_minutes` in `config.py`); just sign
  in again.
- **Weather/itinerary missing but flights worked (or vice versa)** — each
  agent fails independently and gracefully; check the agent pipeline
  visual and the backend terminal logs for the specific error.
