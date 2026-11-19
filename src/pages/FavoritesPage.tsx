import React from 'react';
import { Link } from 'react-router';
import { useMealStore } from '../stores/useMealStore';

export const FavoritesPage: React.FC = () => {
  const { user, favorites, login, loadFavorites, removeFavorite } = useMealStore();

  // Load favorites whenever the user changes (hooks always run unconditionally)
  React.useEffect(() => {
    if (user) {
      loadFavorites(user.id);
    }
  }, [user, loadFavorites]);

  if (!user) {
    return (
      <div className="max-w-md mx-auto my-12 text-center card bg-base-100 p-8 shadow-md border border-base-300 space-y-4">
        <h2 className="text-xl font-bold">รายการโปรดของคุณ</h2>
        <p className="text-sm text-base-content/70">กรุณาเข้าสู่ระบบเพื่อดูรายการโปรด</p>
        <button onClick={() => login('owen@example.com', 'password123')} className="btn btn-primary btn-sm mx-auto">
          เข้าสู่ระบบ (ตัวอย่าง)
        </button>
      </div>
    );
  }

  if (favorites.length === 0) {
    return (
      <div className="max-w-md mx-auto my-12 text-center card bg-base-100 p-8 shadow-md border border-base-300 space-y-4">
        <h2 className="text-xl font-bold">ยังไม่มีรายการโปรด</h2>
        <p className="text-sm text-base-content/70">ไม่มีรายการชื่นชอบ</p>
        <Link to="/" className="btn btn-primary btn-sm mx-auto">เลือกเมนูอาหาร</Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">รายการโปรดของคุณ ({favorites.length} รายการ)</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {favorites.map((meal) => (
          <div key={meal.idMeal} className="card bg-base-100 shadow-md border border-base-300 flex flex-col justify-between">
            <figure className="px-4 pt-4">
              <img src={meal.strMealThumb} alt={meal.strMeal} className="rounded-lg h-48 w-full object-cover" />
            </figure>
            <div className="card-body p-4 flex flex-col justify-between flex-1">
              <div>
                <h3 className="card-title text-base line-clamp-1">{meal.strMeal}</h3>
                <p className="text-xs text-base-content/70 mt-1">{meal.strCategory || 'General'}</p>
              </div>
              <div className="card-actions justify-between items-center mt-4 pt-2 border-t border-base-200">
                <button
                  onClick={() => removeFavorite(user.id, meal.idMeal)}
                  className="btn btn-sm btn-warning">
                  ★ ลบจากโปรด
                </button>
                <Link to={`/meal/${meal.idMeal}`} className="link link-primary text-sm font-medium no-underline hover:underline">
                  ดูสูตร →
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
