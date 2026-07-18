'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/app/components/Icons';
import { api } from '@/app/lib/api';
import { ListLoader } from '@/app/components/Loading';

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewing, setReviewing] = useState<{ orderId: string; itemId: string; itemName: string } | null>(null);
  const [reviewData, setReviewData] = useState({ rating: 5, title: '', text: '' });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('auth_token');
    if (!token) { router.push('/auth/login'); return; }
    if (user.id) {
      Promise.all([
        api.getUserOrders(user.id).catch(() => []),
        api.getReviews(user.id).catch(() => []),
      ]).then(([o, r]) => { setOrders(o); setReviews(r); setLoading(false); });
    } else { setLoading(false); }
  }, [router]);

  const statusMap: Record<string, { label: string; color: string; bg: string }> = {
    PENDING: { label: 'در انتظار', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' },
    PROCESSING: { label: 'در حال پردازش', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    SHIPPED: { label: 'ارسال شده', color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' },
    DELIVERED: { label: 'تحویل شده', color: '#22c55e', bg: 'rgba(34,197,94,0.1)' },
    CANCELLED: { label: 'لغو شده', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' },
  };

  const hasReviewed = (itemId: string) => reviews.some((r: any) => r.productId === itemId);

  const submitReview = async () => {
    if (!reviewing || !reviewData.text.trim()) return;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    try {
      await api.createReview({ userId: user.id, productId: reviewing.itemId, productName: reviewing.itemName, rating: reviewData.rating, title: reviewData.title, text: reviewData.text, author: user.name || 'کاربر' });
      const r = await api.getReviews(user.id);
      setReviews(r);
    } catch (e) {}
    setReviewing(null);
    setReviewData({ rating: 5, title: '', text: '' });
  };

  if (loading) return <div style={{ padding: '24px' }}><ListLoader count={5} /></div>;

  const filtered = orders.filter(o => filter === 'all' || o.status === filter);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>خریدهای من</h1>
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{filtered.length} سفارش</span>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' }}>
        {[{ key: 'all', label: 'همه' }, { key: 'PENDING', label: 'در انتظار' }, { key: 'SHIPPED', label: 'ارسال شده' }, { key: 'DELIVERED', label: 'تحویل شده' }, { key: 'CANCELLED', label: 'لغو شده' }].map(tab => (
          <button key={tab.key} onClick={() => setFilter(tab.key)} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: filter === tab.key ? 'var(--primary)' : 'var(--card-bg)', color: filter === tab.key ? 'white' : 'var(--text)', cursor: 'pointer', fontSize: '13px', fontWeight: filter === tab.key ? 600 : 400 }}>{tab.label}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <Icons.Package size={48} color="var(--text-muted)" />
          <h3 style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>خریدی یافت نشد</h3>
          <button onClick={() => router.push('/products')} className="btn btn-primary" style={{ padding: '10px 20px' }}>مشاهده محصولات</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {filtered.map((order: any, i: number) => {
            const st = statusMap[order.status] || statusMap.PENDING;
            const items = order.itemsJson ? JSON.parse(order.itemsJson) : [];
            return (
              <div key={i} className="card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 4px' }}>شماره سفارش</p>
                    <p style={{ fontSize: '16px', fontWeight: 700, margin: 0 }}>#{order.id?.slice(0, 8)}</p>
                  </div>
                  <span style={{ padding: '4px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, background: st.bg, color: st.color }}>{st.label}</span>
                </div>

                {items.length > 0 && (
                  <div style={{ display: 'grid', gap: '8px', marginBottom: '12px' }}>
                    {items.map((item: any, j: number) => (
                      <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '10px', background: 'var(--hover-bg)' }}>
                        {item.image && <img src={item.image} alt="" style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />}
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: '13px', fontWeight: 600, margin: 0 }}>{item.name}</p>
                          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>×{item.quantity} — ${(item.price * item.quantity).toLocaleString()}</p>
                        </div>
                        {order.status === 'DELIVERED' && (
                          hasReviewed(item.id) ? (
                            <span style={{ padding: '5px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, background: 'rgba(34,197,94,0.1)', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Check size={12} /> ریویو ثبت شده</span>
                          ) : (
                            <button onClick={() => setReviewing({ orderId: order.id, itemId: item.id, itemName: item.name })} style={{ padding: '5px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, background: 'var(--primary)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Star size={12} /> ثبت ریویو</button>
                          )
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                  <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{new Date(order.createdAt).toLocaleDateString('fa-IR')}</span>
                  <span style={{ fontSize: '16px', fontWeight: 700, color: 'var(--primary)' }}>{(order.amount || 0).toLocaleString('fa-IR')} تومان</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Review Modal */}
      {reviewing && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }} onClick={() => setReviewing(null)}>
          <div style={{ width: '100%', maxWidth: '480px', background: 'var(--card-bg)', borderRadius: '16px', padding: '24px', border: '1px solid var(--border)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0 }}>ثبت ریویو</h3>
              <button onClick={() => setReviewing(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '20px' }}>×</button>
            </div>
            <div style={{ padding: '12px', borderRadius: '10px', background: 'var(--hover-bg)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Icons.Star size={20} color="#fbbf24" />
              <span style={{ fontWeight: 600, fontSize: '14px' }}>{reviewing.itemName}</span>
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>امتیاز</label>
              <div style={{ display: 'flex', gap: '4px' }}>{[1, 2, 3, 4, 5].map(s => <button key={s} onClick={() => setReviewData({ ...reviewData, rating: s })} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}><Icons.Star size={28} color={s <= reviewData.rating ? '#fbbf24' : '#d1d5db'} /></button>)}</div>
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>عنوان (اختیاری)</label>
              <input type="text" placeholder="عنوان ریویو..." value={reviewData.title} onChange={e => setReviewData({ ...reviewData, title: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none' }} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>متن ریویو</label>
              <textarea placeholder="تجربه خود از این محصول..." value={reviewData.text} onChange={e => setReviewData({ ...reviewData, text: e.target.value })} rows={4} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', resize: 'vertical', outline: 'none', fontFamily: 'inherit' }} />
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button onClick={() => setReviewing(null)} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer' }}>انصراف</button>
              <button onClick={submitReview} disabled={!reviewData.text.trim()} className="btn btn-primary" style={{ padding: '10px 20px', opacity: reviewData.text.trim() ? 1 : 0.5 }}><Icons.Send size={14} /> ارسال ریویو</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
