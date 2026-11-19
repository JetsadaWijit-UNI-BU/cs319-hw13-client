import { useQuery, useQueries } from '@tanstack/react-query';
import { api } from '../lib/api';

export interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strMealThumb: string;
  strYoutube?: string;
  [key: `strIngredient${number}`]: string | undefined;
  [key: `strMeasure${number}`]: string | undefined;
}

interface MealsResponse {
  meals: Meal[] | null;
}

export const useMeals = (searchQuery: string = '') => {
  return useQuery<MealsResponse>({
    queryKey: ['meals', searchQuery],
    queryFn: async () => {
      const res = await api.getMeals(searchQuery);
      return res.data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

export const useMealDetail = (id: string | undefined) => {
  return useQuery<Meal>({
    queryKey: ['meal', id],
    queryFn: async () => {
      const res = await api.getMeal(id!);
      if (!res.data.meals || res.data.meals.length === 0) throw new Error('ไม่พบข้อมูลเมนูนี้');
      return res.data.meals[0];
    },
    enabled: !!id,
    staleTime: 1000 * 60 * 10,
  });
};

export const useFavoriteMeals = (ids: string[]) => {
  return useQueries({
    queries: ids.map((id) => ({
      queryKey: ['meal', id],
      queryFn: async () => {
        const res = await api.getMeal(id);
        return res.data.meals?.[0] || null;
      },
      staleTime: 1000 * 60 * 5,
    })),
  });
};
