const BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

// Strip trailing slash so image paths can be appended without double slashes.
const API_BASE = BASE.replace(/\/+$/, "");

// Local-network origins that may have leaked into API responses
// (http://localhost:<port>/... or http://127.0.0.1:<port>/...) must be
// rewritten to the configured API base URL instead of being fetched from the
// browser over an insecure local-network request.
const LOCAL_ORIGIN_RE = /^https?:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?\/?/i;

/**
 * Resolve a meal image path/URL returned by the API into a fully-qualified URL
 * the browser can fetch from the configured API base URL (VITE_API_BASE_URL),
 * the exact same variable used for all API requests.
 *
 * - External https:// URLs are preserved as-is.
 * - Accidental http://localhost / http://127.0.0.1 prefixes are rewritten to
 *   the configured API base URL.
 * - Relative paths (/images/x.jpg or images/x.jpg) are appended without
 *   double slashes.
 */
export function resolveImageUrl(imagePath: string): string {
  if (!imagePath) return "";
  if (imagePath.startsWith("https://")) return imagePath;
  const path = imagePath.replace(LOCAL_ORIGIN_RE, "/");
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE}${normalized}`;
}

async function request(path: string, opts: RequestInit = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...opts.headers },
    ...opts,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export const api = {
  getMeals: (q = "") => request(`/api/meals?q=${encodeURIComponent(q)}`),
  getMeal: (id: string) => request(`/api/meals/${id}`),
  createMeal: (body: unknown) => request("/api/meals", { method: "POST", body: JSON.stringify(body) }),
  updateMeal: (id: string, body: unknown) => request(`/api/meals/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteMeal: (id: string) => request(`/api/meals/${id}`, { method: "DELETE" }),
  login: (body: unknown) => request("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
  getFavorites: (userId: string) => request(`/api/users/${userId}/favorites`),
  addFavorite: (userId: string, mealId: string) =>
    request(`/api/users/${userId}/favorites`, { method: "POST", body: JSON.stringify({ mealId }) }),
  removeFavorite: (userId: string, mealId: string) =>
    request(`/api/users/${userId}/favorites/${mealId}`, { method: "DELETE" }),
  getShoppingList: (userId: string) => request(`/api/users/${userId}/shopping-list`),
  addShoppingItem: (userId: string, mealId: string) =>
    request(`/api/users/${userId}/shopping-list`, { method: "POST", body: JSON.stringify({ mealId }) }),
  toggleShoppingItem: (userId: string, itemId: string, checked: boolean) =>
    request(`/api/users/${userId}/shopping-list/${itemId}`, {
      method: "PATCH",
      body: JSON.stringify({ checked }),
    }),
  removeShoppingItem: (userId: string, itemId: string) =>
    request(`/api/users/${userId}/shopping-list/${itemId}`, { method: "DELETE" }),
  clearShoppingList: (userId: string) =>
    request(`/api/users/${userId}/shopping-list`, { method: "DELETE" }),
};
