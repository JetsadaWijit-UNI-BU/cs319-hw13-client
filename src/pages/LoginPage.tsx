import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useMealStore } from '../stores/useMealStore';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('owen@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState('');
  const { user, login } = useMealStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/');
    } catch {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง');
    }
  };

  if (user) return <Link to="/" className="btn btn-primary">ไปหน้าแรก</Link>;

  return (
    <div className="max-w-md mx-auto my-12 card bg-base-100 p-8 shadow-md border border-base-300 space-y-4">
      <h2 className="text-xl font-bold">เข้าสู่ระบบ</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">อีเมล</span>
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">รหัสผ่าน</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>
        {error && <p className="text-xs text-error">{error}</p>}
        <button type="submit" className="btn btn-primary w-full">เข้าสู่ระบบ</button>
      </form>
      <p className="text-xs text-base-content/50 text-center">
        บัญชีตัวอย่าง: owen@example.com / password123
      </p>
      <Link to="/" className="link link-secondary text-sm">ยกเลิก</Link>
    </div>
  );
};
