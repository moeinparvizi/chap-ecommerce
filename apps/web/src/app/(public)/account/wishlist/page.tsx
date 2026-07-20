'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/app/components/Icons';
import { api } from '@/app/lib/api';
import { ListLoader } from '@/app/components/Loading';

export default function WishlistPage() {
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('auth_token');
    if (!token) { router.push('/auth/login'); return; }
    if (user.id) {
      api.getWishlist(user.id).then((d: any) => { setItems(d); setLoading(false); }).catch(() => setLoading(false));
    } else { setLoading(false); }
  }, [router]);

  const removeItem = async (id: string) => {
    await api.deleteWishlist(id);
    setItems(items.filter(i => i.id !== id));
  };

  const fmt = (p: number) => p.toLocaleString('fa-IR') + ' تومان';

  if (loading) return <div style={{ padding: '24px' }}><ListLoader count={3} /></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>علاقه‌مندی‌ها</h1>
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{items.length} محصول</span>
      </div>

      {items.length === 0 ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <Icons.Heart size={48} color="var(--text-muted)" />
          <h3 style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>هنوز محصولی لایک نکرده‌اید</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>روی آیکون قلب محصولات کلیک کنید</p>
          <button onClick={() => router.push('/products')} className="btn btn-primary" style={{ padding: '10px 20px' }}>مشاهده محصولات</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {items.map(item => (
            <div key={item.id} className="card" style={{ padding: '16px', display: 'flex', gap: '16px', alignItems: 'center', cursor: 'pointer' }} onClick={() => router.push(`/product/${item.productId}`)}>
              <img src={item.productImage || `https://placehold.co/200x200/f0f2f5/94a3b8?text=${encodeURIComponent(item.productName)}`} alt={item.productName} style={{ width: '80px', height: '80px', borderRadius: '10px', objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.productName}</h3>
                <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--primary)', margin: '0 0 4px' }}>{fmt(item.productPrice)}</p>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>{new Date(item.createdAt).toLocaleDateString('fa-IR')}</p>
              </div>
              <button onClick={(e) => { e.stopPropagation(); removeItem(item.id); }} style={{ padding: '8px', borderRadius: '8px', border: 'none', background: 'rgba(239,68,68,0.1)', color: 'var(--danger)', cursor: 'pointer', flexShrink: 0 }}><Icons.Heart size={18} color="#ef4444" /></button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
