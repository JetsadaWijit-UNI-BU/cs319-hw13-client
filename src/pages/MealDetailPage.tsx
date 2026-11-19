import React from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useMealDetail } from "../hooks/useMeals";
import { useMealStore } from "../stores/useMealStore";

export const MealDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: meal, isLoading, isError, error, refetch } = useMealDetail(id);
  const { user, favorites, addFavorite, removeFavorite, addShoppingItem } = useMealStore();

  if (isLoading) {
    return (
      <div className="card max-w-2xl mx-auto bg-base-100 shadow-xl border border-base-300 p-6 space-y-4 my-6">
        <div className="skeleton h-6 w-24 rounded" />
        <div className="skeleton h-8 w-3/4 rounded" />
        <div className="skeleton h-64 w-full rounded-lg" />
        <div className="skeleton h-24 w-full rounded" />
      </div>
    );
  }

  if (isError || !meal) {
    return (
      <div className="max-w-md mx-auto my-12 alert alert-error shadow-lg flex flex-col items-center gap-4 text-center">
        <div>
          <h3 className="font-bold text-lg">ไม่พบข้อมูลสูตรอาหาร</h3>
          {error && (
            <p className="text-xs opacity-80 mt-1">
              {(error as Error).message}
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <button onClick={() => refetch()} className="btn btn-sm btn-primary">
            ลองใหม่
          </button>
          <Link to="/" className="btn btn-sm btn-ghost">
            กลับหน้าแรก
          </Link>
        </div>
      </div>
    );
  }

  const isSaved = favorites.some((f) => f.idMeal === meal.idMeal);

  const ingredients: { name: string; measure: string }[] = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ing && ing.trim() !== "") {
      ingredients.push({
        name: ing.trim(),
        measure: measure ? measure.trim() : "",
      });
    }
  }

  const handleAddShopping = async () => {
    if (!user) {
      alert('กรุณาเข้าสู่ระบบก่อนเพิ่มในรายการซื้อของ');
      return;
    }
    await addShoppingItem(user.id, meal.idMeal);
    navigate("/shopping-list");
  };

  const youtubeEmbedUrl = meal.strYoutube?.replace("watch?v=", "embed/");

  return (
    <div className="max-w-3xl mx-auto space-y-6 my-6">
      <Link
        to="/"
        className="link link-primary inline-flex items-center gap-1 text-sm no-underline hover:underline"
      >
        ← ย้อนกลับไปหน้ารายการ
      </Link>

      <div className="card bg-base-100 shadow-xl border border-base-300 p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4 border-b border-base-200 pb-4">
          <div>
            <h1 className="text-2xl font-bold text-base-content">
              {meal.strMeal}
            </h1>
            <div className="flex gap-2 mt-2">
              {meal.strCategory && (
                <span className="badge badge-outline font-bold">
                  {meal.strCategory}
                </span>
              )}
              {meal.strArea && (
                <span className="badge badge-outline font-bold">
                  {meal.strArea}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => {
              if (!user) {
                alert('กรุณาเข้าสู่ระบบก่อนเพิ่มรายการโปรด');
                return;
              }
              if (isSaved) {
                removeFavorite(user.id, meal.idMeal);
              } else {
                addFavorite(user.id, meal);
              }
            }}
            className={`btn btn-sm ${isSaved ? "btn-warning" : "btn-outline"}`}
          >
            {isSaved ? "★ เพิ่มรายการโปรดแล้ว" : "☆ เพิ่มรายการโปรด"}
          </button>
        </div>

        <figure>
          <img
            src={meal.strMealThumb}
            alt={meal.strMeal}
            className="rounded-xl shadow-md max-h-80 w-full object-cover"
          />
        </figure>

        <div className="alert shadow-sm flex justify-end items-center">
          <button
            onClick={handleAddShopping}
            className="btn btn-sm btn-primary">
            เพิ่มในshopping list
          </button>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-3">
            วัตถุดิบที่ต้องใช้ ({ingredients.length} รายการ)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {ingredients.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between p-2.5 bg-base-200 rounded-lg text-sm"
              >
                <span className="font-medium">{item.name}</span>
                <span className="badge badge-ghost text-xs">
                  {item.measure || "ตามชอบ"}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-bold mb-3">ขั้นตอนการทำ</h2>
          <p className="text-sm text-base-content/80 text-left whitespace-pre-line leading-relaxed bg-base-200 p-4 rounded-xl">
            {meal.strInstructions}
          </p>
        </div>

        {youtubeEmbedUrl && (
          <div>
            <h2 className="text-lg font-bold mb-3">วิดีโอสาธิต</h2>
            <div className="aspect-video w-full rounded-xl overflow-hidden shadow">
              <iframe
                src={youtubeEmbedUrl}
                title={meal.strMeal}
                className="w-full h-full border-0"
                allowFullScreen
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
