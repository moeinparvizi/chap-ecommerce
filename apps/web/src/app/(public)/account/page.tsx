'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/app/components/Icons';

export default function AccountPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const saved = localStorage.getItem('user');
    if (saved) setUser(JSON.parse(saved));
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) setOrders(JSON.parse(savedOrders));
  }, []);

  const totalSpent = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o: any) => o.status === 'pending').length;
  const deliveredOrders = orders.filter((o: any) => o.status === 'delivered').length;

  const stats = [
    { label: 'کل خریدها', value: totalOrders, icon: 'Package', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    { label: 'در انتظار ارسال', value: pendingOrders, icon: 'Clock', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    { label: 'تحویل شده', value: deliveredOrders, icon: 'CheckCircle', color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
    { label: 'مجموع خرید', value: totalSpent.toLocaleString('fa-IR') + ' تومان', icon: 'CreditCard', color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)' },
  ];

  const recentOrders = orders.slice(-5).reverse();

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 24px' }}>داشبورد من</h1>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {stats.map((s, i) => {
          const IconComp = Icons[s.icon as keyof typeof Icons];
          return (
            <div key={i} className="card" style={{ padding: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                {IconComp && <IconComp size={22} color={s.color} />}
              </div>
              <div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 4px' }}>{s.label}</p>
                <p style={{ fontSize: '18px', fontWeight: 700, margin: 0 }}>{s.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <button onClick={() => router.push('/account/orders')} className="card" style={{ padding: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'right', border: '1px solid var(--border)', background: 'var(--card-bg)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icons.Package size={20} color="#3b82f6" /></div>
          <div><p style={{ fontWeight: 600, margin: 0 }}>خریدهای من</p><p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>{totalOrders} سفارش</p></div>
        </button>
        <button onClick={() => router.push('/account/locations')} className="card" style={{ padding: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'right', border: '1px solid var(--border)', background: 'var(--card-bg)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icons.MapPin size={20} color="#f59e0b" /></div>
          <div><p style={{ fontWeight: 600, margin: 0 }}>لوکیشن‌ها</p><p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>آدرس‌های شما</p></div>
        </button>
        <button onClick={() => router.push('/account/comments')} className="card" style={{ padding: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'right', border: '1px solid var(--border)', background: 'var(--card-bg)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icons.MessageSquare size={20} color="#8b5cf6" /></div>
          <div><p style={{ fontWeight: 600, margin: 0 }}>کامنت‌ها</p><p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>نظرات شما</p></div>
        </button>
        <button onClick={() => router.push('/account/profile')} className="card" style={{ padding: '20px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'right', border: '1px solid var(--border)', background: 'var(--card-bg)' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icons.User size={20} color="#22c55e" /></div>
          <div><p style={{ fontWeight: 600, margin: 0 }}>پروفایل</p><p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>ویرایش اطلاعات</p></div>
        </button>
      </div>

      {/* Recent Orders */}
      <div className="card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px' }}>آخرین خریدها</h3>
        {recentOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
            <Icons.Package size={40} />
            <p style={{ marginTop: '8px' }}>هنوز خریدی انجام نداده‌اید</p>
            <button onClick={() => router.push('/products')} className="btn btn-primary" style={{ marginTop: '8px', padding: '10px 20px' }}>مشاهده محصولات</button>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead><tr style={{ borderBottom: '2px solid var(--border)' }}>
              <th style={{ padding: '10px', textAlign: 'right', color: 'var(--text-secondary)', fontWeight: 600 }}>شماره سفارش</th>
              <th style={{ padding: '10px', textAlign: 'right', color: 'var(--text-secondary)', fontWeight: 600 }}>تاریخ</th>
              <th style={{ padding: '10px', textAlign: 'right', color: 'var(--text-secondary)', fontWeight: 600 }}>مبلغ</th>
              <th style={{ padding: '10px', textAlign: 'right', color: 'var(--text-secondary)', fontWeight: 600 }}>وضعیت</th>
            </tr></thead>
            <tbody>
              {recentOrders.map((o: any, i: number) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '10px', fontWeight: 500 }}>#{o.id?.slice(0, 8) || i + 1}</td>
                  <td style={{ padding: '10px', color: 'var(--text-secondary)' }}>{o.date || '—'}</td>
                  <td style={{ padding: '10px', fontWeight: 600, color: 'var(--primary)' }}>{(o.total || 0).toLocaleString('fa-IR')} تومان</td>
                  <td style={{ padding: '10px' }}><span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 600, background: o.status === 'delivered' ? 'rgba(34,197,94,0.1)' : o.status === 'shipped' ? 'rgba(59,130,246,0.1)' : 'rgba(245,158,11,0.1)', color: o.status === 'delivered' ? '#22c55e' : o.status === 'shipped' ? '#3b82f6' : '#f59e0b' }}>{o.status === 'delivered' ? 'تحویل شده' : o.status === 'shipped' ? 'ارسال شده' : 'در انتظار'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
