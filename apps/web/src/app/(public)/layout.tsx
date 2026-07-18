'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Icons } from '@/app/components/Icons';
import { api } from '@/app/lib/api';

interface Category { id: string; name: string; slug: string; description: string; image: string | null; parentId: string | null; status: string; }

function PublicLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [lang, setLang] = useState<'fa' | 'en'>('fa');
  const [scrolled, setScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    const savedLang = localStorage.getItem('lang') as 'fa' | 'en' || 'fa';
    setTheme(savedTheme); setLang(savedLang);
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.documentElement.dir = savedLang === 'fa' ? 'rtl' : 'ltr';
    api.getCategories().then((d: any) => setCategories(d)).catch(() => {});
  }, []);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  useEffect(() => { setMegaMenuOpen(false); setMobileMenuOpen(false); }, [pathname]);

  const t = (fa: string, en: string) => lang === 'fa' ? fa : en;

  // Dynamic categories from API
  const categoryIcons: Record<string, any> = { 'موبایل': <Icons.Package size={28} />, 'لپتاپ': <Icons.Tag size={28} />, 'پوشاک': <Icons.Users size={28} />, 'لوازم خانگی': <Icons.Image size={28} />, 'کفش': <Icons.Tag size={28} />, 'هدفون': <Icons.Package size={28} />, 'تبلت': <Icons.Package size={28} />, 'دوربین': <Icons.Image size={28} />, 'خانه': <Icons.Image size={28} />, 'گیمینگ': <Icons.Settings size={28} />, default: <Icons.Package size={28} /> };
  const categoryColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#22c55e', '#ef4444', '#06b6d4', '#6b7280'];
  const navCategories = categories.slice(0, 5).map((c, i) => ({ ...c, icon: categoryIcons[c.name] || categoryIcons.default, color: categoryColors[i % categoryColors.length] }));

  // Dynamic mega menu from API (group into 4 columns)
  const megaMenuItems = categories.reduce<{ name: string; icon: any; items: string[] }[]>((acc, cat, i) => {
    if (i < 4) acc.push({ name: cat.name, icon: categoryIcons[cat.name] || categoryIcons.default, items: [] });
    if (acc.length > 0 && acc[acc.length - 1].items.length < 3) acc[acc.length - 1].items.push(cat.description || cat.name);
    return acc;
  }, []);

  const footerLinks = {
    quick: [t('محصولات', 'Products'), t('درباره ما', 'About Us'), t('تماس با ما', 'Contact Us')],
    quickPaths: ['/admin/products', '/about', '/contact'],
    services: [t('پیگیری سفارش', 'Track Order'), t('گارانتی بازگشت', 'Returns'), t('سوالات متداول', 'FAQ')],
    contact: ['info@shophub.com', '۰۲۱-۱۲۳۴۵۶۷۸', 'www.shophub.com'],
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Bar */}
      <div style={{ background: 'var(--primary)', color: 'white', fontSize: '12px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '6px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Truck size={12} /> {t('ارسال رایگان برای خرید بالای ۵۰۰ هزار تومان', 'Free shipping over $50')}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => { const n = lang === 'fa' ? 'en' : 'fa'; setLang(n); localStorage.setItem('lang', n); document.documentElement.dir = n === 'fa' ? 'rtl' : 'ltr'; }} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '12px' }}>{lang === 'fa' ? 'EN' : 'FA'}</button>
            <button onClick={() => { const n = theme === 'light' ? 'dark' : 'light'; setTheme(n); localStorage.setItem('theme', n); document.documentElement.setAttribute('data-theme', n); }} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>{theme === 'light' ? <Icons.Sun size={12} /> : <Icons.Moon size={12} />}</button>
            <a href="/auth/login" style={{ color: 'white', textDecoration: 'none' }}>{t('ورود', 'Login')}</a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100, transition: 'all 0.3s', padding: scrolled ? '8px 0' : '12px 0', boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.08)' : 'none' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Logo */}
          <div onClick={() => router.push('/')} style={{ fontSize: scrolled ? '20px' : '26px', fontWeight: 800, background: 'linear-gradient(135deg, #1e40af, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer', transition: 'font-size 0.3s', flexShrink: 0 }}>ShopHub</div>
          {/* Search */}
          <div style={{ flex: 1, maxWidth: '600px', position: 'relative' }}>
            <input type="text" placeholder={t('جستجو...', 'Search...')} style={{ width: '100%', padding: scrolled ? '10px 44px 10px 16px' : '12px 44px 12px 16px', borderRadius: '12px', border: '2px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none', transition: 'all 0.3s' }} />
            <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><Icons.Search size={18} /></div>
          </div>
          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', padding: '8px', borderRadius: '8px' }}><Icons.Bell size={20} /><span style={{ position: 'absolute', top: '4px', right: '4px', width: '16px', height: '16px', borderRadius: '50%', background: '#ef4444', color: 'white', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>3</span></button>
            <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', padding: '8px', borderRadius: '8px' }}><Icons.ShoppingCart size={20} /><span style={{ position: 'absolute', top: '4px', right: '4px', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--primary)', color: 'white', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>2</span></button>
            <a href="/auth/login" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', background: 'var(--primary)', color: 'white', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}><Icons.Users size={14} /> {t('ورود', 'Login')}</a>
          </div>
        </div>
        {/* Category Bar */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '8px 20px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button onClick={() => setMegaMenuOpen(!megaMenuOpen)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px', border: 'none', background: megaMenuOpen ? 'var(--primary)' : 'var(--hover-bg)', color: megaMenuOpen ? 'white' : 'var(--text)', cursor: 'pointer', fontSize: '14px', fontWeight: 600, transition: 'all 0.2s' }}>
            <Icons.Menu size={16} /> {t('دسته\u200cبندی\u200cها', 'Categories')} <Icons.ChevronDown size={14} />
          </button>
          {navCategories.map((cat, i) => (
            <button key={cat.id} onClick={() => router.push('/products')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>{cat.icon} {cat.name}</button>
          ))}
          <div style={{ flex: 1 }} />
          <button onClick={() => router.push('/about')} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px', borderRadius: '8px', border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px' }}><Icons.Globe size={14} /> {t('درباره ما', 'About')}</button>
          <button onClick={() => router.push('/products')} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px', borderRadius: '8px', border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px' }}><Icons.Package size={14} /> {t('محصولات', 'Products')}</button>
          <button onClick={() => router.push('/contact')} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px', borderRadius: '8px', border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px' }}><Icons.Mail size={14} /> {t('تماس', 'Contact')}</button>
        </div>
        {/* Mega Menu */}
        {megaMenuOpen && (
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '20px', borderTop: '1px solid var(--border-light)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {megaMenuItems.map((mc, i) => (
              <div key={i}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', paddingBottom: '8px', borderBottom: '2px solid var(--primary)' }}><span style={{ color: 'var(--primary)' }}>{mc.icon}</span><span style={{ fontWeight: 700, fontSize: '14px' }}>{mc.name}</span></div>
                {mc.items.map((item, j) => (<p key={j} onClick={() => router.push('/products')} style={{ padding: '5px 0', fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer' }}>{item}</p>))}
              </div>
            ))}
          </div>
        )}
      </nav>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && <div onClick={() => setMobileMenuOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90 }} />}

      {/* Page Content */}
      <main style={{ flex: 1 }}>{children}</main>

      {/* Footer */}
      <footer style={{ background: 'var(--card-bg)', borderTop: '1px solid var(--border)', padding: '36px 20px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '28px', marginBottom: '20px' }}>
            <div><div style={{ fontSize: '22px', fontWeight: 800, background: 'linear-gradient(135deg, #1e40af, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>ShopHub</div><p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{t('فروشگاه آنلاین با بهترین برندها و قیمت\u200cها.', 'Online store with best brands and prices.')}</p></div>
            <div><h4 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 8px' }}>{t('لینک\u200cها', 'Links')}</h4>{footerLinks.quick.map((l, i) => <p key={i} onClick={() => router.push(footerLinks.quickPaths[i])} style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 6px', cursor: 'pointer' }}>{l}</p>)}</div>
            <div><h4 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 8px' }}>{t('خدمات', 'Services')}</h4>{footerLinks.services.map((s, i) => <p key={i} style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 6px' }}>{s}</p>)}</div>
            <div><h4 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 8px' }}>{t('تماس', 'Contact')}</h4>{footerLinks.contact.map((c, i) => <p key={i} style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '6px' }}><Icons.Mail size={13} /> {c}</p>)}</div>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>{t('\u00A9 ۱۴۰۳ ShopHub. تمامی حقوق محفوظ است.', '\u00A9 2024 ShopHub. All rights reserved.')}</div>
        </div>
      </footer>
    </div>
  );
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <PublicLayoutInner>{children}</PublicLayoutInner>;
}
