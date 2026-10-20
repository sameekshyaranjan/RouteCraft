const BASE = "/api";

function getToken() {
  return localStorage.getItem("routecraft_token");
}

async function handle(res) {
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const body = await res.json();
      detail = body.detail || detail;
    } catch (_) {
      /* ignore */
    }
    throw new Error(detail);
  }
  return res.json();
}

function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  googleLogin: (credential) =>
    fetch(`${BASE}/auth/google`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ credential }),
    }).then(handle),

  me: () => fetch(`${BASE}/auth/me`, { headers: authHeaders() }).then(handle),

  planTrip: (payload) =>
    fetch(`${BASE}/trips/plan`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify(payload),
    }).then(handle),

  listTrips: () => fetch(`${BASE}/trips`, { headers: authHeaders() }).then(handle),

  getTrip: (id) => fetch(`${BASE}/trips/${id}`, { headers: authHeaders() }).then(handle),

  deleteTrip: (id) =>
    fetch(`${BASE}/trips/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }).then(handle),

  searchLocations: (q) =>
    fetch(`${BASE}/locations/search?q=${encodeURIComponent(q)}`, {
      headers: authHeaders(),
    }).then(handle),
};
