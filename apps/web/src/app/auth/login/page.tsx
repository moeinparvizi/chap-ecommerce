'use client';

import { useState, useEffect } from 'react';
import { api } from '@/app/lib/api';
import { Icons } from '@/app/components/Icons';
import { isAdminRole } from '@/app/lib/auth';
import { enterDemo, resetDemo } from '@/app/lib/demo';

export default function LoginPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        await api.register(email, name, password);
      }

      const user = await api.login(email, password);
      if (!user) {
        setError(mode === 'login' ? 'ایمیل یا رمز عبور اشتباه است' : 'خطا در ثبت نام');
        setLoading(false);
        return;
      }

      const { accessToken, ...profile } = user;
      localStorage.setItem('auth_token', accessToken || (process.env.NEXT_PUBLIC_DEMO_MODE === 'true' ? 'auth-' + user.id : ''));
      localStorage.setItem('user', JSON.stringify(profile));

      const redirect = localStorage.getItem('redirectAfterLogin');
      localStorage.removeItem('redirectAfterLogin');
      window.location.href = redirect || (isAdminRole(user.role) ? '/admin' : '/account');
    } catch (e) {
      setError('خطا در اتصال به سرور');
      setLoading(false);
    }
  };

  return (
    <div className="login-page" style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Left visual panel */}
      <div className="login-visual" style={{ flex: 1, background: 'linear-gradient(135deg, #0f172a 0%, #1e40af 50%, #3b82f6 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', padding: '60px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.1)', top: '-100px', right: '-100px' }} />
        <div style={{ position: 'absolute', width: '300px', height: '300px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.08)', bottom: '-80px', left: '-80px' }} />
        <div style={{ position: 'absolute', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', top: '40%', left: '20%' }} />
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white' }}>
          <div style={{ fontSize: '48px', fontWeight: 900, marginBottom: '8px', letterSpacing: '-1px' }}>Shop<span style={{ color: '#60a5fa' }}>Hub</span></div>
          <p style={{ fontSize: '16px', opacity: 0.7, marginBottom: '40px', lineHeight: 1.6 }}>فروشگاه آنلاین شما</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', maxWidth: '320px', margin: '0 auto' }}>
            {[{ icon: <Icons.Package size={28} />, val: '۱۰۰۰+', lbl: 'محصول' }, { icon: <Icons.Users size={28} />, val: '۵۰K+', lbl: 'کاربر' }, { icon: <Icons.Truck size={28} />, val: 'رایگان', lbl: 'ارسال' }, { icon: <Icons.Shield size={28} />, val: '۱۰۰٪', lbl: 'ضمانت' }].map((s, i) => (
              <div key={i} style={{ padding: '20px', borderRadius: '16px', background: 'rgba(255,255,255,0.08)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ color: '#60a5fa' }}>{s.icon}</div>
                <p style={{ fontSize: '24px', fontWeight: 800, margin: '8px 0 0' }}>{s.val}</p>
                <p style={{ fontSize: '12px', opacity: 0.7, margin: '2px 0 0' }}>{s.lbl}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="login-form" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px' }}>
        <div style={{ width: '100%', maxWidth: '420px' }}>
          <a href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '13px', marginBottom: '32px' }}><span style={{ display: 'inline-block', transform: 'rotate(90deg)' }}><Icons.ChevronDown size={16} /></span> بازگشت به خانه</a>

          <h1 style={{ fontSize: '28px', fontWeight: 800, color: 'var(--text)', margin: '0 0 4px' }}>{mode === 'login' ? 'خوش آمدید' : 'حساب جدید بسازید'}</h1>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', margin: '0 0 32px' }}>{mode === 'login' ? 'برای ادامه وارد حساب خود شوید' : 'برای شروع خرید ثبت نام کنید'}</p>

          {error && (
            <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(239,68,68,0.08)', color: '#ef4444', fontSize: '13px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px', border: '1px solid rgba(239,68,68,0.15)' }}><Icons.CheckCircle size={16} /> {error}</div>
          )}

          {mode === 'login' && (
            <div style={{ padding: '16px', marginBottom: '20px', border: '1px solid var(--border)', borderRadius: '12px', background: 'var(--input-bg)' }}>
              <p style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 700, color: 'var(--text)' }}>ورود با حساب نمایشی</p>
              <p style={{ margin: '0 0 12px', fontSize: '12px', color: 'var(--text-secondary)' }}>برای ورود به محیط نمایشی با اطلاعات ساختگی، یک حساب را انتخاب کنید.</p>
              <div style={{ display: 'grid', gap: '8px' }}>
                {[
                  { label: 'مدیر', email: 'admin@example.com', role: 'admin' as const },
                  { label: 'مشتری', email: 'customer@example.com', role: 'customer' as const },
                ].map(account => (
                  <button key={account.email} type="button" onClick={async () => { try { window.location.href = await enterDemo(account.role); } catch { resetDemo(); window.location.href = await enterDemo(account.role); } }} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px', padding: '10px 12px', border: '1px solid var(--border)', borderRadius: '8px', background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontSize: '13px' }}>
                    <span>حساب {account.label}</span>
                    <span dir="ltr" style={{ color: 'var(--text-secondary)' }}>{account.email}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            {mode === 'signup' && (
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>نام و نام خانوادگی</label>
                <div style={{ position: 'relative' }}>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="نام خود را وارد کنید" required style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none' }} />
                  <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><Icons.User size={16} /></span>
                </div>
              </div>
            )}

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>ایمیل</label>
              <div style={{ position: 'relative' }}>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="example@email.com" required style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none', direction: 'ltr', textAlign: 'left' }} />
                <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><Icons.Mail size={16} /></span>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 600, color: 'var(--text)' }}>رمز عبور</label>
              <div style={{ position: 'relative' }}>
                <input type="password" minLength={mode === 'signup' ? 12 : 1} maxLength={72} value={password} onChange={e => setPassword(e.target.value)} placeholder="رمز عبور" required style={{ width: '100%', padding: '12px 14px 12px 40px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none', direction: 'ltr', textAlign: 'left' }} />
                <span style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><Icons.Lock size={16} /></span>
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '13px', background: loading ? 'var(--text-muted)' : 'var(--primary)', color: 'white', border: 'none', borderRadius: '10px', fontSize: '15px', fontWeight: 700, cursor: loading ? 'wait' : 'pointer' }}>{loading ? 'در حال پردازش...' : mode === 'login' ? 'ورود' : 'ثبت نام'}</button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', margin: '24px 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{mode === 'login' ? 'حساب ندارید؟' : 'حساب دارید؟'}</span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
          </div>

          <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); }} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1.5px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>{mode === 'login' ? 'ساخت حساب جدید' : 'ورود به حساب'}</button>


        </div>
      </div>
    </div>
  );
}
