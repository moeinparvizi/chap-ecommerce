'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '../components/Icons';

export default function ContactPage() {
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [lang, setLang] = useState<'fa' | 'en'>('fa');
  const [submitted, setSubmitted] = useState(false);

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
      <div style={{ background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', padding: '60px 20px', textAlign: 'center', color: 'white' }}>
        <Icons.Mail size={48} />
        <h1 style={{ fontSize: '30px', fontWeight: 800, margin: '16px 0 8px' }}>{t('تماس با ما', 'Contact Us')}</h1>
        <p style={{ fontSize: '15px', opacity: 0.9 }}>{t('ما آماده پاسخگویی به شما هستیم', 'We are here to help you')}</p>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '32px' }}>
          {/* Contact Info */}
          <div className="card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 20px' }}>{t('اطلاعات تماس', 'Contact Info')}</h2>
            {[
              { icon: <Icons.Mail size={20} />, title: t('ایمیل', 'Email'), value: 'info@shophub.com', sub: t('پاسخ ظرف ۲۴ ساعت', 'Reply within 24h') },
              { icon: <Icons.Mail size={20} />, title: t('تلفن', 'Phone'), value: '۰۲۱-۱۲۳۴۵۶۷۸', sub: t('شنبه تا پنجشنبه ۹ الی ۱۸', 'Sat-Thu 9-18') },
              { icon: <Icons.Globe size={20} />, title: t('آدرس', 'Address'), value: t('تهران، خیابان ولیعصر', 'Tehran, Valiasr St.'), sub: t('دفتر مرکزی', 'Head Office') },
            ].map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px 0', borderBottom: i < 2 ? '1px solid var(--border-light)' : 'none' }}>
                <div style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }}>{c.icon}</div>
                <div><p style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>{c.title}</p><p style={{ margin: '2px 0', fontSize: '13px' }}>{c.value}</p><p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>{c.sub}</p></div>
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="card" style={{ padding: '32px' }}>
            <h2 style={{ fontSize: '18px', fontWeight: 700, margin: '0 0 20px' }}>{t('ارسال پیام', 'Send Message')}</h2>
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(22,197,94,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: '#22c55e' }}><Icons.Check size={32} /></div>
                <h3 style={{ margin: '0 0 4px', fontSize: '16px' }}>{t('پیام شما ارسال شد!', 'Message Sent!')}</h3>
                <p style={{ margin: 0, fontSize: '13px', color: 'var(--text-secondary)' }}>{t('به زودی با شما تماس می\u200cگیریم', 'We will contact you soon')}</p>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '12px' }}>
                <input type="text" placeholder={t('نام', 'Name')} className="input" />
                <input type="email" placeholder={t('ایمیل', 'Email')} className="input" />
                <input type="text" placeholder={t('موضوع', 'Subject')} className="input" />
                <textarea placeholder={t('پیام شما...', 'Your message...')} className="input" rows={4} />
                <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setSubmitted(true)}>{t('ارسال پیام', 'Send Message')}</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
