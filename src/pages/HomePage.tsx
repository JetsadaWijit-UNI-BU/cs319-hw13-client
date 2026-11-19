import React, { useState } from 'react';
import { Link } from 'react-router';
import { useMealStore } from '../stores/useMealStore';
import { useMeals, type Meal } from '../hooks/useMeals';

export const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { user, favorites, addFavorite, removeFavorite } = useMealStore();
  const { data, isLoading, isError, error, refetch } = useMeals(searchTerm);

  const meals = data?.meals || [];

  const handleToggle = (id: string) => {
    if (!user) {
      alert('กรุณาเข้าสู่ระบบก่อนเพิ่มรายการโปรด');
      return;
    }
    const meal = meals.find((m) => m.idMeal === id);
    if (!meal) return;
    if (favorites.some((f) => f.idMeal === id)) {
      removeFavorite(user.id, id);
    } else {
      addFavorite(user.id, meal);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4">
      <input
        type="text"
        placeholder="ค้นหาชื่อเมนูอาหาร..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="input input-bordered input-sm w-full"
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div key={idx} className="border border-base-200 rounded p-3 space-y-3">
              <div className="skeleton h-36 w-full rounded" />
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-3 w-1/2" />
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="max-w-md mx-auto my-8 p-4 border border-error/30 rounded text-center space-y-2">
          <p className="text-sm text-error">เกิดข้อผิดพลาด: {(error as Error).message}</p>
          <button onClick={() => refetch()} className="btn btn-xs btn-outline">ลองใหม่</button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {meals.map((meal: Meal) => {
            const isSaved = favorites.some((f) => f.idMeal === meal.idMeal);
            return (
              <div key={meal.idMeal} className="border border-base-200 rounded-lg p-3 bg-base-100 flex flex-col justify-between">
                <div>
                  <img src={meal.strMealThumb} alt={meal.strMeal} className="rounded h-36 w-full object-cover mb-2" />
                  <h3 className="font-semibold text-sm line-clamp-1">{meal.strMeal}</h3>
                  <p className="text-xs text-base-content/60 mt-0.5">{meal.strCategory || 'ทั่วไป'}</p>
                </div>
                <div className="flex justify-between items-center mt-3 pt-2 border-t border-base-200 text-xs">
                  <button
                    onClick={() => handleToggle(meal.idMeal)}
                    className={`btn btn-xs ${isSaved ? 'btn-warning' : 'btn-ghost'}`}
                  >
                    {isSaved ? '★ เพิ่มรายการโปรดแล้ว' : '☆ เพิ่มรายการโปรด'}
                  </button>
                  <Link to={`/meal/${meal.idMeal}`} className="text-primary hover:underline font-medium">
                    ดูสูตร →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
