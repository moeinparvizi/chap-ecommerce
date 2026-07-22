'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Icons } from '@/app/components/Icons';
import { api } from '@/app/lib/api';
import { getSiteSettings, initSiteSettings, type SiteSettings } from '@/app/lib/site-settings';
import SmartSearch from '@/app/components/SmartSearch';

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

  const [searchText, setSearchText] = useState('');
  const [cartToast, setCartToast] = useState<{ name: string; show: boolean }>({ name: '', show: false });
  const [siteSettings, setSiteSettings] = useState<SiteSettings | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    const savedLang = localStorage.getItem('lang') as 'fa' | 'en' || 'fa';
    setTheme(savedTheme); setLang(savedLang);
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.documentElement.dir = savedLang === 'fa' ? 'rtl' : 'ltr';
    api.getCategories().then((d: any) => setCategories(d.filter((c: Category) => c.status === 'active'))).catch(() => {});
    initSiteSettings();
    setSiteSettings(getSiteSettings());
  }, []);

  useEffect(() => { setMegaMenuOpen(false); setMobileMenuOpen(false); }, [pathname]);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  // Cart toast listener
  useEffect(() => {
    const handleCartAdd = (e: CustomEvent) => {
      setCartToast({ name: e.detail.name, show: true });
      setTimeout(() => setCartToast({ name: '', show: false }), 3000);
    };
    window.addEventListener('cart-added', handleCartAdd as EventListener);
    return () => window.removeEventListener('cart-added', handleCartAdd as EventListener);
  }, []);

  // Cart count
  const [cartCount, setCartCount] = useState(0);
  const [notifCount, setNotifCount] = useState(0);
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close notifications on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifs(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  const [notifications, setNotifications] = useState<any[]>([]);
  useEffect(() => {
    const updateCount = () => {
      const saved = localStorage.getItem('cart');
      const cart: any[] = saved ? JSON.parse(saved) : [];
      setCartCount(cart.reduce((sum: number, c: any) => sum + c.quantity, 0));
    };
    updateCount();
    window.addEventListener('cart-updated', updateCount);
    return () => window.removeEventListener('cart-updated', updateCount);
  }, []);

  // Fetch notifications
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.id) {
      api.getNotifications(user.id).then((d: any) => {
        setNotifications(d);
        setNotifCount(d.filter((n: any) => !n.read).length);
      }).catch(() => {});
    }
  }, []);

  // Nav user state
  useEffect(() => {
    const checkUser = () => {
      const u = localStorage.getItem('user');
      setNavUser(u ? JSON.parse(u) : null);
    };
    checkUser();
    window.addEventListener('storage', checkUser);
    window.addEventListener('user-updated', checkUser);
    return () => { window.removeEventListener('storage', checkUser); window.removeEventListener('user-updated', checkUser); };
  }, []);
  const [navUser, setNavUser] = useState<any>(null);

  const categoryTree = useMemo(() => {
    const roots = categories.filter(c => !c.parentId);
    return roots.map(root => ({ ...root, children: categories.filter(c => c.parentId === root.id) }));
  }, [categories]);

  const categoryIcons: Record<string, any> = { 'موبایل': <Icons.Package size={24} />, 'لپتاپ': <Icons.Tag size={24} />, 'پوشاک': <Icons.Users size={24} />, 'لوازم خانگی': <Icons.Image size={24} />, 'کفش': <Icons.Tag size={24} />, default: <Icons.Package size={24} /> };
  const categoryColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#22c55e', '#ef4444', '#06b6d4', '#6b7280'];
  const navCategories = categoryTree.slice(0, 5).map((c, i) => ({ ...c, icon: categoryIcons[c.name] || categoryIcons.default, color: categoryColors[i % categoryColors.length] }));

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)', display: 'flex', flexDirection: 'column' }}>
      {/* ===== Top Bar (desktop only) ===== */}
      <div className="top-bar" style={{ background: 'var(--primary)', color: 'white', fontSize: '12px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '6px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Truck size={12} /> ارسال رایگان برای خرید بالای ۵ میلیون ریال</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={() => { const n = lang === 'fa' ? 'en' : 'fa'; setLang(n); localStorage.setItem('lang', n); document.documentElement.dir = n === 'fa' ? 'rtl' : 'ltr'; }} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '12px' }}>{lang === 'fa' ? 'EN' : 'FA'}</button>
            <button onClick={() => { const n = theme === 'light' ? 'dark' : 'light'; setTheme(n); localStorage.setItem('theme', n); document.documentElement.setAttribute('data-theme', n); }} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>{theme === 'light' ? <Icons.Sun size={12} /> : <Icons.Moon size={12} />}</button>
            {navUser ? <button onClick={() => router.push(navUser.role === 'admin' ? '/admin' : '/account')} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '12px' }}>پروفایل</button> : <a href="/auth/login" style={{ color: 'white', textDecoration: 'none' }}>ورود</a>}
          </div>
        </div>
      </div>

      {/* ===== Navbar ===== */}
      <nav className="navbar" style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100, transition: 'all 0.3s', padding: scrolled ? '8px 0' : '12px 0', boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.08)' : 'none' }}>
        <div className="navbar-inner" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Mobile hamburger */}
          <button className="mobile-only" onClick={() => setMobileMenuOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', padding: '8px', borderRadius: '8px', flexShrink: 0 }}>
            <Icons.Menu size={24} />
          </button>

          {/* Logo */}
          <div onClick={() => router.push('/')} style={{ cursor: 'pointer', flexShrink: 0 }}>
            {siteSettings?.siteInfo.logo ? (
              <img src={siteSettings.siteInfo.logo} alt={siteSettings.siteInfo.name || 'ShopHub'} style={{ height: scrolled ? '28px' : '36px', objectFit: 'contain', transition: 'height 0.3s' }} />
            ) : (
              <span style={{ fontSize: scrolled ? '20px' : '26px', fontWeight: 800, background: `linear-gradient(135deg, ${siteSettings?.siteInfo.primaryColor || '#1e40af'}, ${siteSettings?.siteInfo.primaryColor || '#3b82f6'})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', transition: 'font-size 0.3s' }}>{siteSettings?.siteInfo.name || 'ShopHub'}</span>
            )}
          </div>

          {/* Search - desktop only */}
          <div className="desktop-only" style={{ flex: 1, maxWidth: '600px' }}>
            <SmartSearch />
          </div>

          {/* Nav actions - desktop only */}
          <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button onClick={() => router.push('/cart')} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', padding: '8px', borderRadius: '8px' }}><Icons.ShoppingCart size={20} />{cartCount > 0 && <span style={{ position: 'absolute', top: '2px', right: '2px', minWidth: '18px', height: '18px', borderRadius: '9px', background: 'var(--primary)', color: 'white', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, padding: '0 4px' }}>{cartCount}</span>}</button>
            {navUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {/* Notifications */}
                <div ref={notifRef} style={{ position: 'relative' }}>
                  <button onClick={() => setShowNotifs(!showNotifs)} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', padding: '8px', borderRadius: '8px' }}><Icons.Bell size={20} />{notifCount > 0 && <span style={{ position: 'absolute', top: '2px', right: '2px', minWidth: '16px', height: '16px', borderRadius: '8px', background: '#ef4444', color: 'white', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{notifCount}</span>}</button>
                  {showNotifs && (
                    <div style={{ position: 'absolute', top: 'calc(100% + 8px)', left: 0, width: '340px', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: '0 12px 40px rgba(0,0,0,0.15)', zIndex: 200, maxHeight: '400px', overflowY: 'auto' }}>
                      <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 600, fontSize: '14px' }}>اعلان‌ها</span>
                        {notifCount > 0 && <button onClick={async () => { await api.markAllNotificationsRead(navUser.id); setNotifications(notifications.map(n => ({ ...n, read: true }))); setNotifCount(0); }} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '12px' }}>خواندن همه</button>}
                      </div>
                      {notifications.length === 0 ? (
                        <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>اعلانی وجود ندارد</div>
                      ) : (
                        <div>
                          {notifications.slice(0, 10).map(n => (
                            <div key={n.id} onClick={async () => { if (!n.read) { await api.markNotificationRead(n.id); setNotifications(notifications.map(x => x.id === n.id ? { ...x, read: true } : x)); setNotifCount(prev => Math.max(0, prev - 1)); } }} style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-light)', cursor: 'pointer', background: n.read ? 'transparent' : 'rgba(37,99,235,0.03)', transition: 'background 0.2s' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: n.read ? 'transparent' : '#ef4444', flexShrink: 0 }} />
                                <span style={{ fontSize: '13px', fontWeight: 600 }}>{n.title}</span>
                              </div>
                              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>{n.message}</p>
                              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '4px 0 0' }}>{new Date(n.createdAt).toLocaleString('fa-IR')}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <button onClick={() => router.push(navUser.role === 'admin' ? '/admin' : '/account')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: '10px', border: 'none', background: 'var(--primary)', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 700 }}>{navUser.name?.charAt(0) || 'U'}</div>
                  {navUser.name || 'پروفایل'}
                </button>
                <button onClick={() => { localStorage.removeItem('auth_token'); localStorage.removeItem('user'); setNavUser(null); router.push('/'); }} style={{ padding: '8px 12px', borderRadius: '10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontSize: '13px' }}>خروج</button>
              </div>
            ) : (
              <a href="/auth/login" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', background: 'var(--primary)', color: 'white', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}><Icons.Users size={14} /> ورود</a>
            )}
          </div>

          {/* Mobile-only: cart icon + search icon */}
          <div className="mobile-only" style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0, marginLeft: 'auto' }}>
            <button onClick={() => { setMobileMenuOpen(true); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', padding: '8px', borderRadius: '8px' }}><Icons.Search size={20} /></button>
            <button onClick={() => router.push('/cart')} style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', padding: '8px', borderRadius: '8px' }}><Icons.ShoppingCart size={20} />{cartCount > 0 && <span style={{ position: 'absolute', top: '0', right: '0', minWidth: '16px', height: '16px', borderRadius: '8px', background: 'var(--primary)', color: 'white', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{cartCount}</span>}</button>
          </div>
        </div>

        {/* Category Bar - desktop only */}
        <div className="desktop-only" style={{ maxWidth: '1280px', margin: '0 auto', padding: '8px 20px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button onClick={() => setMegaMenuOpen(!megaMenuOpen)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px', border: 'none', background: megaMenuOpen ? 'var(--primary)' : 'var(--hover-bg)', color: megaMenuOpen ? 'white' : 'var(--text)', cursor: 'pointer', fontSize: '14px', fontWeight: 600, transition: 'all 0.2s' }}>
            <Icons.Menu size={16} /> دستهبندیها <Icons.ChevronDown size={14} />
          </button>
          {navCategories.map((cat) => (
            <button key={cat.id} onClick={() => router.push(`/products?category=${encodeURIComponent(cat.name)}`)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>{cat.icon} {cat.name}</button>
          ))}
          <div style={{ flex: 1 }} />
          <button onClick={() => router.push('/about')} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px', borderRadius: '8px', border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px' }}><Icons.Globe size={14} /> درباره ما</button>
          <button onClick={() => router.push('/products')} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px', borderRadius: '8px', border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px' }}><Icons.Package size={14} /> محصولات</button>
          <button onClick={() => router.push('/contact')} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '8px 12px', borderRadius: '8px', border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px' }}><Icons.Mail size={14} /> تماس</button>
        </div>

        {/* Mega Menu - desktop only */}
        {megaMenuOpen && (
          <div className="desktop-only mega-menu-enter" style={{ maxWidth: '1280px', margin: '0 auto', padding: '20px', borderTop: '1px solid var(--border-light)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
              {categoryTree.map((cat, i) => (
                <div key={cat.id}>
                  <div onClick={() => router.push(`/products?category=${encodeURIComponent(cat.name)}`)} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', paddingBottom: '8px', borderBottom: `2px solid ${categoryColors[i % categoryColors.length]}`, cursor: 'pointer', transition: 'opacity 0.2s' }} onMouseEnter={e => e.currentTarget.style.opacity = '0.7'} onMouseLeave={e => e.currentTarget.style.opacity = '1'}>
                    <span style={{ color: categoryColors[i % categoryColors.length] }}>{categoryIcons[cat.name] || categoryIcons.default}</span>
                    <span style={{ fontWeight: 700, fontSize: '14px' }}>{cat.name}</span>
                  </div>
                  {cat.children.length > 0 && (
                    <div style={{ paddingLeft: '8px', borderRight: `2px solid ${categoryColors[i % categoryColors.length]}20`, paddingRight: '8px' }}>
                      {cat.children.map((sub) => (
                        <div key={sub.id} onClick={() => router.push(`/products?category=${encodeURIComponent(sub.name)}`)} style={{ padding: '4px 0', fontSize: '12px', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }} onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: categoryColors[i % categoryColors.length], flexShrink: 0 }} />
                          {sub.name}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* ===== Mobile Sidebar Drawer ===== */}
      {mobileMenuOpen && (
        <div className="mobile-sidebar-overlay" onClick={() => setMobileMenuOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, animation: 'fadeIn 0.2s' }}>
          <div onClick={e => e.stopPropagation()} className="mobile-sidebar" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '300px', maxWidth: '85vw', background: 'var(--card-bg)', boxShadow: '-4px 0 20px rgba(0,0,0,0.15)', overflowY: 'auto', padding: '20px', animation: 'slideInRight 0.3s ease-out' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <span style={{ fontSize: '22px', fontWeight: 800 }}>{siteSettings?.siteInfo.logo ? <img src={siteSettings.siteInfo.logo} alt={siteSettings.siteInfo.name || 'ShopHub'} style={{ height: '32px', objectFit: 'contain' }} /> : <span style={{ background: `linear-gradient(135deg, ${siteSettings?.siteInfo.primaryColor || '#1e40af'}, ${siteSettings?.siteInfo.primaryColor || '#3b82f6'})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{siteSettings?.siteInfo.name || 'ShopHub'}</span>}</span>
              <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', padding: '4px' }}><Icons.X size={24} /></button>
            </div>

            {/* Search */}
            <div style={{ marginBottom: '16px' }}><SmartSearch /></div>

            {/* User */}
            {navUser ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '10px', background: 'var(--hover-bg)', marginBottom: '16px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>{navUser.name?.charAt(0) || 'U'}</div>
                <div style={{ flex: 1 }}><p style={{ fontWeight: 600, fontSize: '14px', margin: 0 }}>{navUser.name}</p><p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>{navUser.email}</p></div>
              </div>
            ) : (
              <a href="/auth/login" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', borderRadius: '10px', background: 'var(--primary)', color: 'white', textDecoration: 'none', fontWeight: 600, fontSize: '14px', marginBottom: '16px' }}><Icons.Users size={16} /> ورود / ثبت نام</a>
            )}

            {/* Nav Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '16px' }}>
              {[{ icon: <Icons.Truck size={18} />, label: 'خانه', href: '/' }, { icon: <Icons.Package size={18} />, label: 'محصولات', href: '/products' }, { icon: <Icons.Users size={18} />, label: 'درباره ما', href: '/about' }, { icon: <Icons.Mail size={18} />, label: 'تماس با ما', href: '/contact' }, { icon: <Icons.ShoppingCart size={18} />, label: 'سبد خرید', href: '/cart' }, ...(navUser ? [{ icon: <Icons.User size={18} />, label: 'داشبورد من', href: navUser.role === 'admin' ? '/admin' : '/account' }] : [])].map(link => (
                <button key={link.href} onClick={() => { router.push(link.href); setMobileMenuOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px 14px', borderRadius: '10px', border: 'none', background: pathname === link.href ? 'var(--primary)' : 'transparent', color: pathname === link.href ? 'white' : 'var(--text)', cursor: 'pointer', fontSize: '14px', fontWeight: pathname === link.href ? 600 : 400, textAlign: 'right', width: '100%' }}>{link.icon} {link.label}</button>
              ))}
            </div>

            {/* Categories */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-secondary)', margin: '0 0 8px' }}>دسته بندی ها</p>
              {categoryTree.map((cat, i) => (
                <div key={cat.id}>
                  <button onClick={() => { router.push(`/products?category=${encodeURIComponent(cat.name)}`); setMobileMenuOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', borderRadius: '8px', border: 'none', background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontSize: '13px', fontWeight: 600, width: '100%', textAlign: 'right' }}><span style={{ color: categoryColors[i % categoryColors.length] }}>{categoryIcons[cat.name] || categoryIcons.default}</span> {cat.name}</button>
                  {cat.children.length > 0 && (
                    <div style={{ paddingRight: '16px' }}>
                      {cat.children.map((sub) => (
                        <button key={sub.id} onClick={() => { router.push(`/products?category=${encodeURIComponent(sub.name)}`); setMobileMenuOpen(false); }} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '6px', border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '12px', width: '100%', textAlign: 'right' }}>
                          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: categoryColors[i % categoryColors.length], flexShrink: 0 }} />
                          {sub.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Theme/Lang */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '12px', display: 'flex', gap: '8px', marginTop: '12px' }}>
              <button onClick={() => { const n = theme === 'light' ? 'dark' : 'light'; setTheme(n); localStorage.setItem('theme', n); document.documentElement.setAttribute('data-theme', n); }} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--hover-bg)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontSize: '13px', color: 'var(--text)' }}>{theme === 'light' ? <><Icons.Moon size={14} /> تاریک</> : <><Icons.Sun size={14} /> روشن</>}</button>
              <button onClick={() => { const n = lang === 'fa' ? 'en' : 'fa'; setLang(n); localStorage.setItem('lang', n); document.documentElement.dir = n === 'fa' ? 'rtl' : 'ltr'; }} style={{ flex: 1, padding: '10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--hover-bg)', cursor: 'pointer', fontSize: '13px', color: 'var(--text)' }}>{lang === 'fa' ? 'EN' : 'FA'}</button>
            </div>

            {navUser && (
              <button onClick={() => { localStorage.removeItem('auth_token'); localStorage.removeItem('user'); setNavUser(null); setMobileMenuOpen(false); router.push('/'); }} style={{ width: '100%', marginTop: '12px', padding: '10px', borderRadius: '8px', border: '1px solid var(--danger)', background: 'transparent', color: 'var(--danger)', cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>خروج</button>
            )}
          </div>
        </div>
      )}

      {/* ===== Main Content ===== */}
      <main style={{ flex: 1 }} key={pathname}>
        {cartToast.show && (
          <div style={{ position: 'fixed', top: '80px', left: '50%', transform: 'translateX(-50%)', zIndex: 9999, padding: '12px 24px', borderRadius: '12px', background: 'linear-gradient(135deg, #1e40af, #3b82f6)', color: 'white', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px', boxShadow: '0 8px 30px rgba(37,99,235,0.4)', animation: 'cartToastIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)', whiteSpace: 'nowrap' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icons.Check size={16} /></div>
            <span>{cartToast.name} به سبد خرید اضافه شد</span>
            <button onClick={() => setCartToast({ name: '', show: false })} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px' }}>×</button>
          </div>
        )}
        {children}
      </main>

      {/* ===== Footer ===== */}
      <footer className="footer" style={{ background: 'var(--card-bg)', borderTop: '1px solid var(--border)', padding: '36px 20px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '28px', marginBottom: '20px' }}>
            <div>{siteSettings?.siteInfo.logo ? <img src={siteSettings.siteInfo.logo} alt={siteSettings.siteInfo.name || 'ShopHub'} style={{ height: '36px', objectFit: 'contain', marginBottom: '8px' }} /> : <div style={{ fontSize: '22px', fontWeight: 800, background: `linear-gradient(135deg, ${siteSettings?.siteInfo.primaryColor || '#1e40af'}, ${siteSettings?.siteInfo.primaryColor || '#3b82f6'})`, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>{siteSettings?.siteInfo.name || 'ShopHub'}</div>}<p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{siteSettings?.footer.about || 'فروشگاه آنلاین با بهترین برندها و قیمت ها.'}</p></div>
            <div><h4 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 8px' }}>لینک ها</h4><p onClick={() => router.push('/about')} style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 6px', cursor: 'pointer' }}>درباره ما</p><p onClick={() => router.push('/contact')} style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 6px', cursor: 'pointer' }}>تماس با ما</p><p onClick={() => router.push('/products')} style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 6px', cursor: 'pointer' }}>محصولات</p></div>
            <div><h4 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 8px' }}>خدمات</h4><p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 6px' }}>پیگیری سفارش</p><p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 6px' }}>گارانتی بازگشت</p></div>
            <div><h4 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 8px' }}>تماس</h4><p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '6px' }}><Icons.Mail size={13} /> {siteSettings?.footer.email || 'info@shophub.com'}</p><p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '6px' }}><Icons.Bell size={13} /> {siteSettings?.footer.phone || '\u06F0\u06F2\u06F1-\u06F1\u06F2\u06F3\u06F4\u06F5\u06F6\u06F7\u06F8'}</p><p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0', lineHeight: 1.5 }}>{siteSettings?.footer.address || ''}</p></div>
          </div>
          {siteSettings?.footer.socialLinks && siteSettings.footer.socialLinks.length > 0 && (
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {siteSettings.footer.socialLinks.map((link, i) => (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--border)', color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '12px', fontWeight: 500 }}>{link.name}</a>
              ))}
            </div>
          )}
          <div className="footer-bottom" style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>{siteSettings?.footer.copyright || '\u00A9 \u06F1\u06F4\u06F0\u06F5 ShopHub. تمامی حقوق محفوظ است.'}</div>
        </div>
      </footer>
    </div>
  );
}

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <PublicLayoutInner>{children}</PublicLayoutInner>;
}
