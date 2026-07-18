'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Icons } from '@/app/components/Icons';
import { api } from '@/app/lib/api';

interface Category { id: string; name: string; slug: string; description: string; image: string | null; parentId: string | null; status: string; }
interface CategoryTree extends Category { children: CategoryTree[]; }

function PublicLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [lang, setLang] = useState<'fa' | 'en'>('fa');
  const [scrolled, setScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [showSubcategories, setShowSubcategories] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    const savedLang = localStorage.getItem('lang') as 'fa' | 'en' || 'fa';
    const savedSub = localStorage.getItem('showSubcategories');
    setTheme(savedTheme); setLang(savedLang);
    if (savedSub !== null) setShowSubcategories(savedSub === 'true');
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.documentElement.dir = savedLang === 'fa' ? 'rtl' : 'ltr';
    api.getCategories().then((d: any) => setCategories(d.filter((c: Category) => c.status === 'active'))).catch(() => {});
  }, []);

  useEffect(() => { localStorage.setItem('showSubcategories', String(showSubcategories)); }, [showSubcategories]);
  useEffect(() => { setMegaMenuOpen(false); }, [pathname]);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  // Build category tree
  const categoryTree = useMemo(() => {
    const roots = categories.filter(c => !c.parentId);
    return roots.map(root => ({
      ...root,
      children: categories.filter(c => c.parentId === root.id),
    }));
  }, [categories]);

  const categoryIcons: Record<string, any> = { 'موبایل': <Icons.Package size={24} />, 'لپتاپ': <Icons.Tag size={24} />, 'پوشاک': <Icons.Users size={24} />, 'لوازم خانگی': <Icons.Image size={24} />, 'کفش': <Icons.Tag size={24} />, default: <Icons.Package size={24} /> };
  const categoryColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#22c55e', '#ef4444', '#06b6d4', '#6b7280'];

  const navCategories = categoryTree.slice(0, 5).map((c, i) => ({ ...c, icon: categoryIcons[c.name] || categoryIcons.default, color: categoryColors[i % categoryColors.length] }));

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', display: 'flex', flexDirection: 'column' }}>
      {/* Top Bar */}
      <div style={{ background: 'var(--primary)', color: 'white', fontSize: '12px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '6px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Truck size={12} /> ارسال رایگان برای خرید بالای ۵۰۰ هزار تومان</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => { const n = lang === 'fa' ? 'en' : 'fa'; setLang(n); localStorage.setItem('lang', n); document.documentElement.dir = n === 'fa' ? 'rtl' : 'ltr'; }} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '12px' }}>{lang === 'fa' ? 'EN' : 'FA'}</button>
            <button onClick={() => { const n = theme === 'light' ? 'dark' : 'light'; setTheme(n); localStorage.setItem('theme', n); document.documentElement.setAttribute('data-theme', n); }} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>{theme === 'light' ? <Icons.Sun size={12} /> : <Icons.Moon size={12} />}</button>
            <a href="/auth/login" style={{ color: 'white', textDecoration: 'none' }}>ورود</a>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100, transition: 'all 0.3s', padding: scrolled ? '8px 0' : '12px 0', boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.08)' : 'none' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div onClick={() => router.push('/')} style={{ fontSize: scrolled ? '20px' : '26px', fontWeight: 800, background: 'linear-gradient(135deg, #1e40af, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer', transition: 'font-size 0.3s', flexShrink: 0 }}>ShopHub</div>
          <div style={{ flex: 1, maxWidth: '600px', position: 'relative' }}>
            <input type="text" placeholder="جستجو..." style={{ width: '100%', padding: scrolled ? '10px 44px 10px 16px' : '12px 44px 12px 16px', borderRadius: '12px', border: '2px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none', transition: 'all 0.3s' }} />
            <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><Icons.Search size={18} /></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', padding: '8px', borderRadius: '8px' }}><Icons.Bell size={20} /><span style={{ position: 'absolute', top: '4px', right: '4px', width: '16px', height: '16px', borderRadius: '50%', background: '#ef4444', color: 'white', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>3</span></button>
            <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', padding: '8px', borderRadius: '8px' }}><Icons.ShoppingCart size={20} /><span style={{ position: 'absolute', top: '4px', right: '4px', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--primary)', color: 'white', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>2</span></button>
            <a href="/auth/login" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', background: 'var(--primary)', color: 'white', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}><Icons.Users size={14} /> ورود</a>
          </div>
        </div>

        {/* Category Bar */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '8px 20px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button onClick={() => setMegaMenuOpen(!megaMenuOpen)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px', border: 'none', background: megaMenuOpen ? 'var(--primary)' : 'var(--hover-bg)', color: megaMenuOpen ? 'white' : 'var(--text)', cursor: 'pointer', fontSize: '14px', fontWeight: 600, transition: 'all 0.2s' }}>
            <Icons.Menu size={16} /> دسته‌بندی‌ها <Icons.ChevronDown size={14} />
          </button>
          {navCategories.map((cat) => (
            <button key={cat.id} onClick={() => router.push('/products')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>{cat.icon} {cat.name}</button>
          ))}
          <div style={{ flex: 1 }} />
          <button onClick={() => router.push('/about')} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px', borderRadius: '8px', border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px' }}><Icons.Globe size={14} /> درباره ما</button>
          <button onClick={() => router.push('/products')} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px', borderRadius: '8px', border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px' }}><Icons.Package size={14} /> محصولات</button>
          <button onClick={() => router.push('/contact')} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px', borderRadius: '8px', border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px' }}><Icons.Mail size={14} /> تماس</button>
        </div>

        {/* Mega Menu */}
        {megaMenuOpen && (
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '20px', borderTop: '1px solid var(--border-light)' }}>
            {/* Toggle for subcategories */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
              <button onClick={() => setShowSubcategories(!showSubcategories)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--hover-bg)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '12px' }}>
                {showSubcategories ? <Icons.Eye size={14} /> : <Icons.Eye size={14} />}
                {showSubcategories ? 'پنهان کردن ساب کتگوری‌ها' : 'نمایش ساب کتگوری‌ها'}
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
              {categoryTree.map((cat, i) => (
                <div key={cat.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', paddingBottom: '8px', borderBottom: `2px solid ${categoryColors[i % categoryColors.length]}` }}>
                    <span style={{ color: categoryColors[i % categoryColors.length] }}>{categoryIcons[cat.name] || categoryIcons.default}</span>
                    <span style={{ fontWeight: 700, fontSize: '14px' }}>{cat.name}</span>
                  </div>
                  {cat.description && <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 8px' }}>{cat.description}</p>}
                  {showSubcategories && cat.children.length > 0 && (
                    <div style={{ paddingLeft: '8px', borderRight: `2px solid ${categoryColors[i % categoryColors.length]}20`, paddingRight: '8px' }}>
                      {cat.children.map((sub) => (
                        <p key={sub.id} onClick={() => router.push('/products')} style={{ padding: '4px 0', fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }}
                          onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: categoryColors[i % categoryColors.length], flexShrink: 0 }} />
                          {sub.name}
                        </p>
                      ))}
                    </div>
                  )}
                  {showSubcategories && cat.children.length === 0 && <p style={{ fontSize: '12px', color: 'var(--text-muted)', fontStyle: 'italic' }}>بدون ساب کتگوری</p>}
                  {!showSubcategories && <p onClick={() => router.push('/products')} style={{ padding: '4px 0', fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer' }}>مشاهده همه</p>}
                </div>
              ))}
              {categoryTree.length === 0 && <p style={{ color: 'var(--text-muted)', gridColumn: '1/-1', textAlign: 'center', padding: '20px' }}>دسته‌بندی‌ای یافت نشد</p>}
            </div>
          </div>
        )}
      </nav>

      <main style={{ flex: 1 }}>{children}</main>

      {/* Footer */}
      <footer style={{ background: 'var(--card-bg)', borderTop: '1px solid var(--border)', padding: '36px 20px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '28px', marginBottom: '20px' }}>
            <div><div style={{ fontSize: '22px', fontWeight: 800, background: 'linear-gradient(135deg, #1e40af, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>ShopHub</div><p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>فروشگاه آنلاین با بهترین برندها و قیمت‌ها.</p></div>
            <div><h4 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 8px' }}>لینک‌ها</h4><p onClick={() => router.push('/about')} style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 6px', cursor: 'pointer' }}>درباره ما</p><p onClick={() => router.push('/contact')} style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 6px', cursor: 'pointer' }}>تماس با ما</p><p onClick={() => router.push('/products')} style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 6px', cursor: 'pointer' }}>محصولات</p></div>
            <div><h4 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 8px' }}>خدمات</h4><p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 6px' }}>پیگیری سفارش</p><p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 6px' }}>گارانتی بازگشت</p></div>
            <div><h4 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 8px' }}>تماس</h4><p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '6px' }}><Icons.Mail size={13} /> info@shophub.com</p></div>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>© ۱۴۰۳ ShopHub. تمامی حقوق محفوظ است.</div>
        </div>
      </footer>
    </div>
  );
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <PublicLayoutInner>{children}</PublicLayoutInner>;
}
