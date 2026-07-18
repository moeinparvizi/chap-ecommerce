'use client';

import { useState } from 'react';
import { api } from '@/app/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await api.login(email, password);
      if (!user) {
        setError('ایمیل یا رمز عبور اشتباه است');
        setLoading(false);
        return;
      }

      localStorage.setItem('auth_token', 'auth-' + user.id);
      localStorage.setItem('user', JSON.stringify(user));

      const redirect = localStorage.getItem('redirectAfterLogin');
      localStorage.removeItem('redirectAfterLogin');
      window.location.href = redirect || (user.role === 'admin' ? '/admin' : '/account');
    } catch (e) {
      setError('خطا در اتصال به سرور');
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div style={{ width: '100%', maxWidth: '400px', padding: '40px', background: 'white', borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: 0 }}>ShopHub</h1>
          <p style={{ color: '#64748b', marginTop: '8px' }}>وارد حساب خود شوید</p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', color: '#dc2626', padding: '12px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>{error}</div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>ایمیل</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="ایمیل خود را وارد کنید" style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '16px', outline: 'none' }} />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>رمز عبور</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="رمز عبور" style={{ width: '100%', padding: '12px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '16px', outline: 'none' }} />
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '12px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: 600, cursor: loading ? 'wait' : 'pointer', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'در حال ورود...' : 'ورود'}
          </button>
        </form>

        <div style={{ marginTop: '24px', padding: '16px', background: '#f8fafc', borderRadius: '8px', fontSize: '13px', color: '#64748b' }}>
          <strong>حساب‌های demo:</strong><br />
          <strong>ادمین:</strong> admin@shop.com / admin123<br />
          <strong>کاربر:</strong> user@shop.com / user123
        </div>
      </div>
    </div>
  );
}
