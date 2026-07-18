'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/app/components/Icons';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const saved = localStorage.getItem('orders');
    if (saved) setOrders(JSON.parse(saved));
  }, []);

  const statusMap: Record<string, { label: string; color: string; bg: string }> = {
    pending: { label: 'در انتظار', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    shipped: { label: 'ارسال شده', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    delivered: { label: 'تحویل شده', color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
    cancelled: { label: 'لغو شده', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  };

  const filtered = orders.filter(o => filter === 'all' || o.status === filter);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>خریدهای من</h1>
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{filtered.length} سفارش</span>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[{ key: 'all', label: 'همه' }, { key: 'pending', label: 'در انتظار' }, { key: 'shipped', label: 'ارسال شده' }, { key: 'delivered', label: 'تحویل شده' }, { key: 'cancelled', label: 'لغو شده' }].map(tab => (
          <button key={tab.key} onClick={() => setFilter(tab.key)} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: filter === tab.key ? 'var(--primary)' : 'var(--card-bg)', color: filter === tab.key ? 'white' : 'var(--text)', cursor: 'pointer', fontSize: '13px', fontWeight: filter === tab.key ? 600 : 400 }}>{tab.label}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <Icons.Package size={48} color="var(--text-muted)" />
          <h3 style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>خریدی یافت نشد</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>اولین خرید خود را انجام دهید</p>
          <button onClick={() => router.push('/products')} className="btn btn-primary" style={{ padding: '10px 20px' }}>مشاهده محصولات</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {filtered.map((order: any, i: number) => {
            const st = statusMap[order.status] || statusMap.pending;
            return (
              <div key={i} className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 4px' }}>شماره سفارش</p>
                    <p style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>#{order.id?.slice(0, 8) || `ORD-${i + 1}`}</p>
                  </div>
                  <span style={{ padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, background: st.bg, color: st.color }}>{st.label}</span>
                </div>

                {order.items && order.items.length > 0 && (
                  <div style={{ display: 'flex', gap: '12px', marginBottom: '12px', flexWrap: 'wrap' }}>
                    {order.items.slice(0, 3).map((item: any, j: number) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px', borderRadius: '8px', background: 'var(--hover-bg)' }}>
                        {item.image && <img src={item.image} alt="" style={{ width: '40px', height: '40px', borderRadius: '6px', objectFit: 'cover' }} />}
                        <div>
                          <p style={{ fontSize: '13px', fontWeight: 500, margin: 0, maxWidth: '150px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>×{item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    {order.items.length > 3 && <span style={{ fontSize: '13px', color: 'var(--text-muted)', alignSelf: 'center' }}>+{order.items.length - 3} مورد دیگر</span>}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{order.date || '—'}</span>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--primary)' }}>{(order.total || 0).toLocaleString('fa-IR')} تومان</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
