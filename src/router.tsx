import { createBrowserRouter, Outlet, Link, NavLink } from 'react-router';
import { HomePage } from './pages/HomePage';
import { MealDetailPage } from './pages/MealDetailPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ShoppingListPage } from './pages/ShoppingListPage';
import { AboutPage } from './pages/AboutPage';
import { LoginPage } from './pages/LoginPage';
import { AuthHeader } from './components/AuthHeader';

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <div className="min-h-screen bg-base-100 text-base-content flex flex-col justify-between">
        <div>
          <header className="border-b mt-1 border-base-200 bg-base-100 px-6 py-3 flex flex-col sm:flex-row justify-between items-center gap-4">
            <Link to="/" className="text-xl font-bold tracking-tight text-primary">
              Gusto
            </Link>
            <nav className="flex gap-4 text-sm font-medium">
              <NavLink to="/" className={({ isActive }) => isActive ? 'text-primary font-semibold' : 'text-base-content/70 hover:text-base-content'}>
                หน้าแรก
              </NavLink>
              <NavLink to="/favorites" className={({ isActive }) => isActive ? 'text-primary font-semibold' : 'text-base-content/70 hover:text-base-content'}>
                รายการโปรด
              </NavLink>
              <NavLink to="/shopping-list" className={({ isActive }) => isActive ? 'text-primary font-semibold' : 'text-base-content/70 hover:text-base-content'}>
                รายการซื้อของ
              </NavLink>
              <NavLink to="/about" className={({ isActive }) => isActive ? 'text-primary font-semibold' : 'text-base-content/70 hover:text-base-content'}>
                เกี่ยวกับ
              </NavLink>
            </nav>
            <AuthHeader />
          </header>

          <main className="container mx-auto px-4 py-6">
            <Outlet />
          </main>
        </div>

        <footer className="border-t border-base-200 py-4 text-center text-xs text-base-content/50">
          Gusto · CS319 Internet Programming I
        </footer>
      </div>
    ),
    children: [
      { index: true, element: <HomePage /> },
      { path: 'meal/:id', element: <MealDetailPage /> },
      { path: 'favorites', element: <FavoritesPage /> },
      { path: 'shopping-list', element: <ShoppingListPage /> },
      { path: 'about', element: <AboutPage /> },
      { path: 'login', element: <LoginPage /> },
    ],
  },
]);
