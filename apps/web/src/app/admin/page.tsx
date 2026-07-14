'use client';

import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();

  const stats = [
    { label: 'کل فروش', value: '$124,563', change: '+12.5%', icon: '💰', color: '#22c55e' },
    { label: 'سفارشات', value: '1,234', change: '+8.2%', icon: '📦', color: '#3b82f6' },
    { label: 'مشتریان', value: '5,678', change: '+15.3%', icon: '👥', color: '#8b5cf6' },
    { label: 'محصولات', value: '892', change: '+3.1%', icon: '🏷️', color: '#f59e0b' },
  ];

  return (
    <div style={{ padding: '24px' }}>
      {/* Stats Cards */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
        gap: '20px',
        marginBottom: '24px'
      }}>
        {stats.map((stat, index) => (
          <div key={index} style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>{stat.label}</p>
                <p style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', margin: '8px 0' }}>
                  {stat.value}
                </p>
                <span style={{ 
                  color: stat.change.startsWith('+') ? '#22c55e' : '#ef4444',
                  fontSize: '14px',
                  fontWeight: 500
                }}>
                  {stat.change}
                </span>
              </div>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: stat.color + '20',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <h2 style={{ fontSize: '18px', fontWeight: 600, color: '#0f172a', margin: '0 0 16px' }}>
          دسترسی سریع
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px' }}>
          <button 
            onClick={() => router.push('/admin/orders')}
            style={{
              padding: '16px',
              background: '#f8fafc',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📦</div>
            <div style={{ fontSize: '14px', fontWeight: 500 }}>سفارشات</div>
          </button>
          <button 
            onClick={() => router.push('/admin/products')}
            style={{
              padding: '16px',
              background: '#f8fafc',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏷️</div>
            <div style={{ fontSize: '14px', fontWeight: 500 }}>محصولات</div>
          </button>
          <button 
            onClick={() => router.push('/admin/customers')}
            style={{
              padding: '16px',
              background: '#f8fafc',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>👥</div>
            <div style={{ fontSize: '14px', fontWeight: 500 }}>مشتریان</div>
          </button>
          <button 
            onClick={() => router.push('/admin/analytics')}
            style={{
              padding: '16px',
              background: '#f8fafc',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📈</div>
            <div style={{ fontSize: '14px', fontWeight: 500 }}>تحلیل‌ها</div>
          </button>
          <button 
            onClick={() => router.push('/admin/orders')}
            style={{
              padding: '16px',
              background: '#f8fafc',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🎫</div>
            <div style={{ fontSize: '14px', fontWeight: 500 }}>کوپن‌ها</div>
          </button>
          <button 
            onClick={() => router.push('/admin/settings')}
            style={{
              padding: '16px',
              background: '#f8fafc',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              cursor: 'pointer',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>⚙️</div>
            <div style={{ fontSize: '14px', fontWeight: 500 }}>تنظیمات</div>
          </button>
        </div>
      </div>
    </div>
  );
}
