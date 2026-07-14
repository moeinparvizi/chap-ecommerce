'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  if (!user) {
    return <div style={{ padding: '40px', textAlign: 'center' }}>Loading...</div>;
  }

  const menuItems = [
    { id: 'dashboard', label: 'داشبورد', icon: '📊', path: '/admin' },
    { id: 'orders', label: 'سفارشات', icon: '📦', path: '/admin/orders' },
    { id: 'products', label: 'محصولات', icon: '🏷️', path: '/admin/products' },
    { id: 'customers', label: 'مشتریان', icon: '👥', path: '/admin/customers' },
    { id: 'analytics', label: 'تحلیل‌ها', icon: '📈', path: '/admin/analytics' },
    { id: 'marketing', label: 'بازاریابی', icon: '📣', path: '/admin/marketing' },
    { id: 'settings', label: 'تنظیمات', icon: '⚙️', path: '/admin/settings' },
  ];

  const getActiveTab = () => {
    if (pathname === '/admin') return 'dashboard';
    if (pathname.startsWith('/admin/orders')) return 'orders';
    if (pathname.startsWith('/admin/products')) return 'products';
    if (pathname.startsWith('/admin/customers')) return 'customers';
    if (pathname.startsWith('/admin/analytics')) return 'analytics';
    if (pathname.startsWith('/admin/marketing')) return 'marketing';
    if (pathname.startsWith('/admin/settings')) return 'settings';
    return 'dashboard';
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
        overflow: 'hidden'
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
            cursor: 'pointer'
          }}
        >
          {sidebarOpen ? '◀' : '▶'}
        </button>

        {/* Navigation */}
        <nav>
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.path)}
              title={item.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                width: '100%',
                padding: sidebarOpen ? '12px 16px' : '12px',
                marginBottom: '4px',
                background: getActiveTab() === item.id ? '#1e40af' : 'transparent',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                textAlign: 'right',
                justifyContent: sidebarOpen ? 'flex-start' : 'center'
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid #334155' }}>
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
