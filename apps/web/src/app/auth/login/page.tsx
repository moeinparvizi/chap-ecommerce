'use client';

import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Demo login
    if (email === 'admin@shop.com' && password === 'admin123') {
      // Store auth token
      localStorage.setItem('auth_token', 'demo-token-123');
      localStorage.setItem('user', JSON.stringify({
        id: '1',
        email: 'admin@shop.com',
        name: 'Admin User',
        role: 'admin'
      }));
      window.location.href = localStorage.getItem('redirectAfterLogin') || '/admin';
      localStorage.removeItem('redirectAfterLogin');
    } else if (email === 'user@shop.com' && password === 'user123') {
      localStorage.setItem('auth_token', 'demo-token-456');
      localStorage.setItem('user', JSON.stringify({
        id: '2',
        email: 'user@shop.com',
        name: 'John Doe',
        role: 'customer'
      }));
      window.location.href = localStorage.getItem('redirectAfterLogin') || '/account';
      localStorage.removeItem('redirectAfterLogin');
    } else {
      setError('ایمیل یا رمز عبور اشتباه است');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: '#f8fafc'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '40px',
        background: 'white',
        borderRadius: '12px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.1)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            ShopHub
          </h1>
          <p style={{ color: '#64748b', marginTop: '8px' }}>
            وارد حساب خود شوید
          </p>
        </div>

        {error && (
          <div style={{ 
            background: '#fef2f2', 
            color: '#dc2626', 
            padding: '12px', 
            borderRadius: '8px', 
            marginBottom: '16px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>
              ایمیل
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@shop.com"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>
              رمز عبور
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '16px',
                outline: 'none'
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            ورود
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
