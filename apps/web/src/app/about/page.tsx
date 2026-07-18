'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '../components/Icons';

export default function AboutPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [lang, setLang] = useState<'fa' | 'en'>('fa');

  useEffect(() => {
    setTheme(localStorage.getItem('theme') as any || 'light');
    setLang(localStorage.getItem('lang') as any || 'fa');
    document.documentElement.setAttribute('data-theme', localStorage.getItem('theme') || 'light');
  }, []);

  const t = (fa: string, en: string) => lang === 'fa' ? fa : en;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Header */}
      <nav style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--border)', padding: '12px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)' }}><Icons.ArrowUp size={18} /></button>
          <div style={{ fontSize: '22px', fontWeight: 800, background: 'linear-gradient(135deg, #1e40af, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ShopHub</div>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => { const n = lang === 'fa' ? 'en' : 'fa'; setLang(n); localStorage.setItem('lang', n); document.documentElement.dir = n === 'fa' ? 'rtl' : 'ltr'; }} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--hover-bg)', color: 'var(--text)', cursor: 'pointer', fontSize: '12px' }}>{lang === 'fa' ? 'EN' : 'FA'}</button>
          <button onClick={() => { const n = theme === 'light' ? 'dark' : 'light'; setTheme(n); localStorage.setItem('theme', n); document.documentElement.setAttribute('data-theme', n); }} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--hover-bg)', color: 'var(--text)', cursor: 'pointer' }}>{theme === 'light' ? <Icons.Sun size={16} /> : <Icons.Moon size={16} />}</button>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', padding: '80px 20px', textAlign: 'center', color: 'white' }}>
        <Icons.Shield size={56} />
        <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '20px 0 12px' }}>{t('درباره ShopHub', 'About ShopHub')}</h1>
        <p style={{ fontSize: '16px', opacity: 0.9, maxWidth: '600px', margin: '0 auto' }}>{t('ما با هدف ارائه بهترین تجربه خرید آنلاین فعالیت می\u200cکنیم', 'We deliver the best online shopping experience')}</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        {/* Story */}
        <div className="card" style={{ marginBottom: '24px', padding: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '10px' }}><Icons.Globe size={20} /> {t('داستان ما', 'Our Story')}</h2>
          <p style={{ fontSize: '14px', lineHeight: 1.8, color: 'var(--text-secondary)' }}>
            {t('ShopHub در سال ۱۴۰۰ با هدف ایجاد بستری مطمئن و باکیفیت برای خرید آنلاین تأسیس شد. ما باور داریم که هرکسی حق دارد به بهترین محصولات با بهترین قیمت دسترسی داشته باشد. تیم ما شامل متخصصان حوزه تجارت الکترونیک و فناوری اطلاعات است که شبانه‌روز تلاش می\u200cکنند تا تجربه خریدی لذت\u200cبخش و امن برای شما فراهم کنند.', 'ShopHub was founded in 2021 with the mission of creating a trusted and high-quality online shopping platform. We believe everyone deserves access to the best products at the best prices.')}
          </p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[
            { icon: <Icons.Package size={24} />, value: '۱۰,۰۰۰+', label: t('محصول', 'Products') },
            { icon: <Icons.Users size={24} />, value: '۵۰,۰۰۰+', label: t('مشتری', 'Customers') },
            { icon: <Icons.Truck size={24} />, value: '۱۰۰,۰۰۰+', label: t('ارسال موفق', 'Deliveries') },
          ].map((s, i) => (
            <div key={i} className="card" style={{ textAlign: 'center', padding: '24px' }}>
              <div style={{ color: 'var(--primary)', marginBottom: '8px' }}>{s.icon}</div>
              <p style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 4px' }}>{s.value}</p>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="card" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '10px' }}><Icons.Shield size={20} /> {t('ارزش\u200cهای ما', 'Our Values')}</h2>
          {[
            { icon: <Icons.Shield size={20} />, title: t('اعتماد', 'Trust'), desc: t('امنیت و اعتماد در اولویت ماست', 'Security and trust are our priority') },
            { icon: <Icons.Truck size={20} />, title: t('کیفیت', 'Quality'), desc: t('فقط محصولات اصل و باکیفیت', 'Only genuine and quality products') },
            { icon: <Icons.Mail size={20} />, title: t('رضایت', 'Satisfaction'), desc: t('رضایت شما مهم\u200cترین هدف ماست', 'Your satisfaction is our top goal') },
          ].map((v, i) => (
            <div key={i} style={{ display: 'flex', gap: '16px', padding: '16px 0', borderBottom: i < 2 ? '1px solid var(--border-light)' : 'none' }}>
              <div style={{ color: 'var(--primary)', flexShrink: 0 }}>{v.icon}</div>
              <div><h3 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 4px' }}>{v.title}</h3><p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>{v.desc}</p></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
