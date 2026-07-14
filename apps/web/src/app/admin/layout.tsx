'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [openSubmenus, setOpenSubmenus] = useState<string[]>(['products']);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userData = localStorage.getItem('user');
    
    if (!token || !userData) {
      router.push('/auth/login');
      return;
    }
    
    setUser(JSON.parse(userData));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const toggleSubmenu = (id: string) => {
    setOpenSubmenus(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  if (!user) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  const menuItems = [
    { id: 'dashboard', label: 'داشبورد', icon: '📊', path: '/admin' },
    { id: 'orders', label: 'سفارشات', icon: '📦', path: '/admin/orders' },
    { 
      id: 'products', 
      label: 'محصولات', 
      icon: '🏷️', 
      path: '/admin/products',
      children: [
        { id: 'product-list', label: 'لیست محصولات', icon: '📋', path: '/admin/products' },
        { id: 'categories', label: 'دسته‌بندی‌ها', icon: '📁', path: '/admin/categories' },
        { id: 'brands', label: 'برندها', icon: '✨', path: '/admin/brands' },
      ]
    },
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
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = openSubmenus.includes(item.id);

    return (
      <div key={item.id}>
        <button
          onClick={() => {
            if (hasChildren && sidebarOpen) {
              toggleSubmenu(item.id);
            } else {
              handleNavigation(item.path);
            }
          }}
          title={item.label}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
            padding: isSubmenu ? (sidebarOpen ? '10px 16px 10px 40px' : '10px') : (sidebarOpen ? '12px 16px' : '12px'),
            marginBottom: '2px',
            background: isActive ? '#1e40af' : 'transparent',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
            fontSize: isSubmenu ? '13px' : '14px',
            textAlign: 'right',
            justifyContent: sidebarOpen ? 'flex-start' : 'center',
            transition: 'all 0.2s'
          }}
        >
          <span style={{ fontSize: isSubmenu ? '14px' : '18px' }}>{item.icon}</span>
          {sidebarOpen && (
            <>
              <span style={{ flex: 1 }}>{item.label}</span>
              {hasChildren && (
                <span style={{ 
                  fontSize: '10px', 
                  transition: 'transform 0.2s',
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                }}>▼</span>
              )}
            </>
          )}
        </button>
        
        {hasChildren && isExpanded && sidebarOpen && (
          <div style={{ marginTop: '2px' }}>
            {item.children.map((child: any) => renderMenuItem(child, true))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: sidebarOpen ? '260px' : '60px',
        background: '#0f172a',
        color: 'white',
        padding: sidebarOpen ? '24px 16px' : '24px 12px',
        flexShrink: 0,
        transition: 'width 0.3s ease',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* Logo */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: sidebarOpen ? 'flex-start' : 'center',
          marginBottom: '32px',
          gap: '12px'
        }}>
          <div style={{ fontSize: '24px' }}>🛒</div>
          {sidebarOpen && (
            <span style={{ fontSize: '18px', fontWeight: 700, color: '#60a5fa' }}>
              ShopHub
            </span>
          )}
        </div>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            padding: '8px',
            marginBottom: '24px',
            background: '#1e293b',
            border: 'none',
            borderRadius: '8px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          {sidebarOpen ? '◀ بستن منو' : '▶'}
        </button>

        {/* Navigation */}
        <nav style={{ flex: 1 }}>
          {menuItems.map(item => renderMenuItem(item))}
        </nav>

        {/* Logout */}
        <div style={{ paddingTop: '16px', borderTop: '1px solid #334155' }}>
          <button
            onClick={handleLogout}
            title="خروج"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: sidebarOpen ? 'flex-start' : 'center',
              gap: '12px',
              width: '100%',
              padding: sidebarOpen ? '12px 16px' : '12px',
              background: 'transparent',
              border: 'none',
              color: '#ef4444',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            <span style={{ fontSize: '18px' }}>🚪</span>
            {sidebarOpen && <span>خروج</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header style={{
          background: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '12px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#64748b' }}>خوش آمدید {user.name}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ color: '#64748b', fontSize: '14px' }}>{user.email}</span>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 600,
              fontSize: '14px'
            }}>
              {user.name.charAt(0)}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main style={{ flex: 1, background: '#f8fafc', overflow: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
