import { Link } from 'react-router';
import { useMealStore } from '../stores/useMealStore';

export function AuthHeader() {
  const { user, logout } = useMealStore();
  return user ? (
    <div className="flex items-center gap-2">
      <span className="text-xs text-base-content/70">สวัสดี, {user.name}</span>
      <button onClick={logout} className="btn btn-xs btn-ghost">ออกจากระบบ</button>
    </div>
  ) : (
    <Link to="/login" className="btn btn-xs btn-primary">เข้าสู่ระบบ</Link>
  );
}
