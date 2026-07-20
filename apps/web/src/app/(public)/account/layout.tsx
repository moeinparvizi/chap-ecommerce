'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Icons } from '@/app/components/Icons';

const menuItems = [
  { href: '/account', icon: 'LayoutDashboard', label: 'داشبورد', exact: true },
  { href: '/account/orders', icon: 'Package', label: 'خریدها', exact: false },
  { href: '/account/wishlist', icon: 'Heart', label: 'علاقهمندیها', exact: false },
  { href: '/account/locations', icon: 'MapPin', label: 'لوکیشنها', exact: false },
  { href: '/account/comments', icon: 'MessageSquare', label: 'کامنتها', exact: false },
  { href: '/account/reviews', icon: 'Star', label: 'ریویوها', exact: false },
  { href: '/account/profile', icon: 'User', label: 'ویرایش پروفایل', exact: false },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) { router.push('/auth/login'); return; }
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
  }, [router]);

  if (!user) return <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>loading...</div>;

  return (
    <div className="account-layout" style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 20px', display: 'flex', gap: '24px' }}>
      {/* Sidebar */}
      <div className="account-sidebar" style={{ width: '260px', flexShrink: 0 }}>
        {/* User Card */}
        <div className="card" style={{ padding: '20px', marginBottom: '16px', textAlign: 'center' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #1e40af, #3b82f6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '24px', fontWeight: 700 }}>
            {user.name?.charAt(0) || 'U'}
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 4px' }}>{user.name || 'کاربر'}</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: 0 }}>{user.email || ''}</p>
        </div>

        {/* Menu */}
        <div className="card menu-list" style={{ padding: '8px' }}>
          {menuItems.map(item => {
            const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href);
            const IconComp = Icons[item.icon as keyof typeof Icons];
            return (
              <button key={item.href} onClick={() => router.push(item.href)} style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 14px', borderRadius: '10px', border: 'none', background: isActive ? 'var(--primary)' : 'transparent', color: isActive ? 'white' : 'var(--text)', cursor: 'pointer', fontSize: '14px', fontWeight: isActive ? 600 : 400, transition: 'all 0.2s', textAlign: 'right' }}>
                {IconComp && <IconComp size={18} />}
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {children}
      </div>
    </div>
  );
}
