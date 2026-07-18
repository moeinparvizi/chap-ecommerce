'use client';

import { useState } from 'react';
import { Icons } from '../../components/Icons';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <div>
      <div style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', padding: '50px 20px', textAlign: 'center', color: 'white' }}>
        <Icons.Mail size={40} />
        <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '12px 0 6px' }}>تماس با ما</h1>
        <p style={{ fontSize: '14px', opacity: 0.9 }}>ما آماده پاسخگویی هستیم</p>
      </div>
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
          <div className="card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 20px' }}>اطلاعات تماس</h2>
            {[{ icon: <Icons.Mail size={18} />, title: 'ایمیل', value: 'info@shophub.com' }, { icon: <Icons.Mail size={18} />, title: 'تلفن', value: '۰۲۱-۱۲۳۴۵۶۷۸' }, { icon: <Icons.Globe size={18} />, title: 'آدرس', value: 'تهران، خیابان ولیعصر' }].map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px 0', borderBottom: i < 2 ? '1px solid var(--border-light)' : 'none' }}><div style={{ color: 'var(--primary)', flexShrink: 0 }}>{c.icon}</div><div><p style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>{c.title}</p><p style={{ margin: '2px 0 0', fontSize: '13px' }}>{c.value}</p></div></div>
            ))}
          </div>
          <div className="card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 20px' }}>ارسال پیام</h2>
            {submitted ? <div style={{ textAlign: 'center', padding: '40px 0' }}><div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(22,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: '#22c55e' }}><Icons.Check size={32} /></div><h3 style={{ margin: '0 0 4px' }}>پیام شما ارسال شد!</h3><p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>به زودی با شما تماس می‌گیریم</p></div> : (
              <div style={{ display: 'grid', gap: '12px' }}><input type="text" placeholder="نام" className="input" /><input type="email" placeholder="ایمیل" className="input" /><input type="text" placeholder="موضوع" className="input" /><textarea placeholder="پیام شما..." className="input" rows={4} /><button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setSubmitted(true)}>ارسال پیام</button></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
