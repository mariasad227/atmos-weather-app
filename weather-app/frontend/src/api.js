const BASE = "/api";

async function req(path, options) {
  const res = await fetch(`${BASE}${path}`, options);
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.detail || `Request failed: ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  geocode: (q) => req(`/geocode?q=${encodeURIComponent(q)}`),
  weather: ({ latitude, longitude, city, country }) => {
    const params = new URLSearchParams({ latitude, longitude });
    if (city) params.set("city", city);
    if (country) params.set("country", country);
    return req(`/weather?${params.toString()}`);
  },
  history: () => req("/history"),
  clearHistory: () => req("/history", { method: "DELETE" }),
  favorites: () => req("/favorites"),
  addFavorite: (place) =>
    req("/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(place),
    }),
  removeFavorite: (id) => req(`/favorites/${id}`, { method: "DELETE" }),
};
