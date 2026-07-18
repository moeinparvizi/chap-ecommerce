'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Icons } from '../components/Icons';
import { I18nProvider, useI18n } from '../lib/i18n';
import { NotificationProvider } from '../lib/notifications';

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { t, toggleLang, lang } = useI18n();
  const [user, setUser] = useState<any>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<string[]>(['products']);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user');
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    
    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'admin') {
      router.push('/account');
      return;
    }

    setUser(parsedUser);
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    // Auto-collapse on mobile
  }, [router]);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  const toggleSubmenu = (id: string) => {
    setOpenSubmenus(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const navigate = (path: string) => {
    router.push(path);
    setMobileMenuOpen(false);
  };

  if (!user) return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>{t('loading')}</div>;

  const menuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: <Icons.BarChart size={18} />, path: '/admin' },
    { id: 'orders', label: t('orders'), icon: <Icons.Package size={18} />, path: '/admin/orders' },
    { id: 'products', label: t('products'), icon: <Icons.Tag size={18} />, path: '/admin/products', children: [
      { id: 'product-list', label: t('products'), icon: <Icons.Clipboard size={18} />, path: '/admin/products' },
      { id: 'categories', label: t('categories'), icon: <Icons.Folder size={18} />, path: '/admin/categories' },
      { id: 'brands', label: lang === 'fa' ? 'برندها' : 'Brands', icon: <Icons.Sparkles size={18} />, path: '/admin/brands' },
    ]},
    { id: 'customers', label: t('customers'), icon: <Icons.Users size={18} />, path: '/admin/customers' },
    { id: 'analytics', label: t('analytics'), icon: <Icons.TrendingUp size={18} />, path: '/admin/analytics' },
    { id: 'marketing', label: t('marketing'), icon: <Icons.Megaphone size={18} />, path: '/admin/marketing' },
    { id: 'settings', label: t('settings'), icon: <Icons.Settings size={18} />, path: '/admin/settings' },
  ];

  const getActiveTab = () => {
    if (pathname === '/admin') return 'dashboard';
    if (pathname.startsWith('/admin/orders')) return 'orders';
    if (pathname.startsWith('/admin/categories')) return 'categories';
    if (pathname.startsWith('/admin/products')) return 'products';
    if (pathname.startsWith('/admin/customers')) return 'customers';
    if (pathname.startsWith('/admin/analytics')) return 'analytics';
    if (pathname.startsWith('/admin/marketing')) return 'marketing';
    if (pathname.startsWith('/admin/settings')) return 'settings';
    return 'dashboard';
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="mobile-menu-btn"
        style={{
          position: 'fixed', top: '12px', left: '12px', zIndex: 60,
          width: '44px', height: '44px', display: 'none',
          alignItems: 'center', justifyContent: 'center',
          background: 'var(--glass-bg)', backdropFilter: 'blur(20px)',
          border: '1px solid var(--glass-border)', borderRadius: '12px',
          cursor: 'pointer', color: 'var(--text)',
        }}
      >
        {mobileMenuOpen ? <Icons.X size={20} /> : <Icons.Menu size={20} />}
      </button>

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div onClick={() => setMobileMenuOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 90, animation: 'fadeIn 0.2s ease-out' }} />
      )}

      {/* Sidebar */}
      <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`} style={{ right: 0, position: 'fixed' }}>
        <div className="sidebar-logo">
          <Icons.ShoppingCart size={24} />
          <span>ShopHub</span>
        </div>
        
        <nav style={{ flex: 1, overflowY: 'auto' }}>
          {menuItems.map(item => renderMenuItem(item))}
        </nav>

        <div style={{ paddingTop: '16px', borderTop: '1px solid var(--glass-border)' }}>
          <button onClick={handleLogout} className="menu-item" style={{ color: 'var(--danger)' }}>
            <span className="icon"><Icons.LogOut size={18} /></span>
            <span className="label">{t('logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="main-content" style={{ flex: 1, transition: 'margin 0.3s ease' }}>
        {/* Header */}
        <header className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: 'var(--text-secondary)' }} className="desktop-only">{t('welcome')} {user.name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Language Toggle */}
            <button onClick={toggleLang} className="btn btn-ghost btn-sm" style={{ fontSize: '12px' }}>
              {lang === 'fa' ? 'EN' : 'FA'}
            </button>
            {/* Theme Toggle */}
            <div className="theme-toggle">
              <button className={`theme-btn ${theme === 'light' ? 'active' : ''}`} onClick={toggleTheme}><Icons.Sun size={16} /></button>
              <button className={`theme-btn ${theme === 'dark' ? 'active' : ''}`} onClick={toggleTheme}><Icons.Moon size={16} /></button>
            </div>
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }} className="desktop-only">{user.email}</span>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'var(--accent)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'white', fontWeight: 600,
            }}>
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ padding: '24px', minHeight: 'calc(100vh - 60px)' }}>
          <div className="page-enter" key={pathname}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );

  function renderMenuItem(item: any, isSubmenu = false) {
    const isActive = getActiveTab() === item.id || pathname === item.path;
    const hasChildren = item.children?.length > 0;
    const isExpanded = openSubmenus.includes(item.id);

    return (
      <div key={item.id}>
        <button
          onClick={() => hasChildren ? toggleSubmenu(item.id) : navigate(item.path)}
          className={`menu-item ${isActive ? 'active' : ''}`}
          style={isSubmenu ? { paddingLeft: '40px' } : {}}
        >
          <span className="icon">{item.icon}</span>
          <span className="label">{item.label}</span>
          {hasChildren && <span className={`arrow ${isExpanded ? 'expanded' : ''}`}><Icons.ChevronDown size={12} /></span>}
        </button>
        {hasChildren && isExpanded && (
          <div className="submenu">
            {item.children.map((child: any) => renderMenuItem(child, true))}
          </div>
        )}
      </div>
    );
  }
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <NotificationProvider>
      <I18nProvider>
        <AdminLayoutInner>{children}</AdminLayoutInner>
      </I18nProvider>
    </NotificationProvider>
  );
}
