import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../lib/api';

export interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strMealThumb: string;
  strYoutube?: string;
}

export interface ShoppingItem {
  itemId: string;
  mealId: string;
  ingredientName: string;
  measure: string;
  checked: boolean;
}

interface MealState {
  user: { id: string; email: string; name?: string | null } | null;
  favorites: Meal[];
  shoppingList: ShoppingItem[];

  login: (email: string, password: string) => Promise<void>;
  logout: () => void;

  loadFavorites: (userId: string) => Promise<void>;
  addFavorite: (userId: string, meal: Meal) => Promise<void>;
  removeFavorite: (userId: string, mealId: string) => Promise<void>;

  loadShoppingList: (userId: string) => Promise<void>;
  addShoppingItem: (userId: string, mealId: string) => Promise<void>;
  toggleShoppingItem: (userId: string, itemId: string, checked: boolean) => Promise<void>;
  removeShoppingItem: (userId: string, itemId: string) => Promise<void>;
  clearShoppingList: (userId: string) => Promise<void>;

  isFavorite: (mealId: string) => boolean;
}

export const useMealStore = create<MealState>()(
  persist(
    (set, get) => ({
      user: null,
      favorites: [],
      shoppingList: [],

      login: async (email, password) => {
        const data = await api.login({ email, password });
        const user = data.data ?? data;
        if (!user || (!user.id && !user.userId)) {
          throw new Error('เข้าสู่ระบบไม่สำเร็จ: เซิร์ฟเวอร์ไม่ส่งรหัสผู้ใช้กลับมา');
        }
        set({ user });
      },

      logout: () => set({ user: null, favorites: [], shoppingList: [] }),

      loadFavorites: async (userId) => {
        const data = await api.getFavorites(userId);
        set({ favorites: data.data.meals });
      },

      addFavorite: async (userId, meal) => {
        await api.addFavorite(userId, meal.idMeal);
        set((state) => ({
          favorites: state.favorites.find((f) => f.idMeal === meal.idMeal)
            ? state.favorites
            : [...state.favorites, meal],
        }));
      },

      removeFavorite: async (userId, mealId) => {
        await api.removeFavorite(userId, mealId);
        set((state) => ({ favorites: state.favorites.filter((f) => f.idMeal !== mealId) }));
      },

      loadShoppingList: async (userId) => {
        const data = await api.getShoppingList(userId);
        set({ shoppingList: data.data.ingredients });
      },

      addShoppingItem: async (userId: string, mealId: string) => {
        const data = await api.addShoppingItem(userId, mealId);
        const incoming: ShoppingItem[] = data.data.ingredients ?? [];
        set((state) => ({
          shoppingList: [
            ...state.shoppingList,
            ...incoming.filter(
              (item) => !state.shoppingList.some((saved) => saved.itemId === item.itemId),
            ),
          ],
        }));
      },

      toggleShoppingItem: async (userId, itemId, checked) => {
        await api.toggleShoppingItem(userId, itemId, checked);
        set((state) => ({
          shoppingList: state.shoppingList.map((s) =>
            s.itemId === itemId ? { ...s, checked } : s
          ),
        }));
      },

      removeShoppingItem: async (userId, itemId) => {
        await api.removeShoppingItem(userId, itemId);
        set((state) => ({ shoppingList: state.shoppingList.filter((s) => s.itemId !== itemId) }));
      },

      clearShoppingList: async (userId: string) => {
        await api.clearShoppingList(userId);
        set({ shoppingList: [] });
      },

      isFavorite: (mealId) => get().favorites.some((f) => f.idMeal === mealId),
    }),
    { name: 'meal-storage' }
  )
);
