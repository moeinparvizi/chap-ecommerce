'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [openSubmenus, setOpenSubmenus] = useState<string[]>(['products']);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user');
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    
    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }
    
    setUser(JSON.parse(userData));
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
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

  if (!user) return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;

  const menuItems = [
    { id: 'dashboard', label: 'داشبورد', icon: '📊', path: '/admin' },
    { id: 'orders', label: 'سفارشات', icon: '📦', path: '/admin/orders' },
    { id: 'products', label: 'محصولات', icon: '🏷️', path: '/admin/products', children: [
      { id: 'product-list', label: 'لیست محصولات', icon: '📋', path: '/admin/products' },
      { id: 'categories', label: 'دسته‌بندی‌ها', icon: '📁', path: '/admin/categories' },
      { id: 'brands', label: 'برندها', icon: '✨', path: '/admin/brands' },
    ]},
    { id: 'customers', label: 'مشتریان', icon: '👥', path: '/admin/customers' },
    { id: 'analytics', label: 'تحلیل‌ها', icon: '📈', path: '/admin/analytics' },
    { id: 'marketing', label: 'بازاریابی', icon: '📣', path: '/admin/marketing' },
    { id: 'settings', label: 'تنظیمات', icon: '⚙️', path: '/admin/settings' },
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

  const renderMenuItem = (item: any, isSubmenu = false) => {
    const isActive = getActiveTab() === item.id || pathname === item.path;
    const hasChildren = item.children?.length > 0;
    const isExpanded = openSubmenus.includes(item.id);

    return (
      <div key={item.id}>
        <button
          onClick={() => hasChildren ? toggleSubmenu(item.id) : router.push(item.path)}
          className={`menu-item ${isActive ? 'active' : ''}`}
          style={isSubmenu ? { paddingLeft: '40px' } : {}}
        >
          <span className="icon">{item.icon}</span>
          <span className="label">{item.label}</span>
          {hasChildren && <span className={`arrow ${isExpanded ? 'expanded' : ''}`}>▼</span>}
        </button>
        {hasChildren && isExpanded && (
          <div className="submenu">
            {item.children.map((child: any) => renderMenuItem(child, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <span style={{ fontSize: '24px' }}>🛒</span>
          <span>ShopHub</span>
        </div>
        
        <nav style={{ flex: 1 }}>
          {menuItems.map(item => renderMenuItem(item))}
        </nav>

        <div style={{ paddingTop: '16px', borderTop: '1px solid var(--glass-border)' }}>
          <button onClick={handleLogout} className="menu-item" style={{ color: '#ef4444' }}>
            <span className="icon">🚪</span>
            <span className="label">خروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, marginRight: '260px' }}>
        {/* Header */}
        <header className="header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: 'var(--text-secondary)' }}>خوش آمدید {user.name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Theme Toggle */}
            <div className="theme-toggle">
              <button className={`theme-btn ${theme === 'light' ? 'active' : ''}`} onClick={toggleTheme} title="روشن">
                ☀️
              </button>
              <button className={`theme-btn ${theme === 'dark' ? 'active' : ''}`} onClick={toggleTheme} title="تاریک">
                🌙
              </button>
            </div>
            <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{user.email}</span>
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'var(--accent)', display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: 'white', fontWeight: 600
            }}>
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ padding: '24px', minHeight: 'calc(100vh - 60px)' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
