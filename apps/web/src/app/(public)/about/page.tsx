'use client';

import { useRouter } from 'next/navigation';
import { Icons } from '../../components/Icons';

export default function AboutPage() {
  const router = useRouter();
  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', padding: '60px 20px', textAlign: 'center', color: 'white' }}>
        <Icons.Shield size={48} />
        <h1 style={{ fontSize: '30px', fontWeight: 800, margin: '16px 0 8px' }}>درباره ShopHub</h1>
        <p style={{ fontSize: '15px', opacity: 0.9, maxWidth: '500px', margin: '0 auto' }}>ما با هدف ارائه بهترین تجربه خرید آنلاین فعالیت می‌کنیم</p>
      </div>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        <div className="card" style={{ marginBottom: '24px', padding: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '10px' }}><Icons.Globe size={20} /> داستان ما</h2>
          <p style={{ fontSize: '14px', lineHeight: 1.8, color: 'var(--text-secondary)' }}>ShopHub در سال ۱۴۰۰ با هدف ایجاد بستری مطمئن و باکیفیت برای خرید آنلاین تأسیس شد. ما باور داریم که هرکسی حق دارد به بهترین محصولات با بهترین قیمت دسترسی داشته باشد.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
          {[{ icon: <Icons.Package size={24} />, value: '۱۰,۰۰۰+', label: 'محصول' }, { icon: <Icons.Users size={24} />, value: '۵۰,۰۰۰+', label: 'مشتری' }, { icon: <Icons.Truck size={24} />, value: '۱۰۰,۰۰۰+', label: 'ارسال موفق' }].map((s, i) => (
            <div key={i} className="card" style={{ textAlign: 'center', padding: '24px' }}><div style={{ color: 'var(--primary)', marginBottom: '8px' }}>{s.icon}</div><p style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 4px' }}>{s.value}</p><p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>{s.label}</p></div>
          ))}
        </div>
        <div className="card" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '10px' }}><Icons.Shield size={20} /> ارزش‌های ما</h2>
          {[{ icon: <Icons.Shield size={20} />, title: 'اعتماد', desc: 'امنیت و اعتماد در اولویت ماست' }, { icon: <Icons.Truck size={20} />, title: 'کیفیت', desc: 'فقط محصولات اصل و باکیفیت' }, { icon: <Icons.Mail size={20} />, title: 'رضایت', desc: 'رضایت شما مهم‌ترین هدف ماست' }].map((v, i) => (
            <div key={i} style={{ display: 'flex', gap: '16px', padding: '16px 0', borderBottom: i < 2 ? '1px solid var(--border-light)' : 'none' }}><div style={{ color: 'var(--primary)', flexShrink: 0 }}>{v.icon}</div><div><h3 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 4px' }}>{v.title}</h3><p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>{v.desc}</p></div></div>
          ))}
        </div>
      </div>
    </div>
  );
}
