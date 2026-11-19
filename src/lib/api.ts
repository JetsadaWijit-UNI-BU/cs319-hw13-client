const BASE = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000";

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
