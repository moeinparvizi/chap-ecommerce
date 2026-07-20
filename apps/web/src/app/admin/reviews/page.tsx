'use client';

import { useState, useEffect } from 'react';
import { Icons } from '../../components/Icons';
import { api } from '../../lib/api';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState(0);

  useEffect(() => { api.getReviews().then((d: any) => setReviews(d)).catch(() => {}); }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این ریویو اطمینان دارید؟')) return;
    await api.deleteReview(id);
    setReviews(reviews.filter(r => r.id !== id));
  };

  const filtered = reviews.filter(r => {
    if (filterRating > 0 && r.rating !== filterRating) return false;
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return r.author?.toLowerCase().includes(q) || r.text?.toLowerCase().includes(q) || r.productName?.toLowerCase().includes(q);
  });

  const avgRating = filtered.length > 0 ? (filtered.reduce((s: number, r: any) => s + r.rating, 0) / filtered.length).toFixed(1) : '0';

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>مدیریت ریویوها</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>{reviews.length} ریویو | میانگین: {avgRating} ⭐</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input type="text" placeholder="جستجو..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="input" style={{ maxWidth: '300px' }} />
        <select value={filterRating} onChange={e => setFilterRating(Number(e.target.value))} className="input" style={{ maxWidth: '150px' }}>
          <option value={0}>همه امتیازات</option>
          <option value={5}>⭐⭐⭐⭐⭐</option>
          <option value={4}>⭐⭐⭐⭐</option>
          <option value={3}>⭐⭐⭐</option>
          <option value={2}>⭐⭐</option>
          <option value={1}>⭐</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
          <Icons.Star size={48} color="var(--text-muted)" />
          <h3 style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>ریویویی یافت نشد</h3>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {filtered.map(r => (
            <div key={r.id} className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px' }}>{r.rating}</div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>{r.author || 'کاربر'}</p>
                    <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>{[1,2,3,4,5].map(s => <Icons.Star key={s} size={11} color={s <= r.rating ? '#fbbf24' : '#d1d5db'} />)}</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ padding: '3px 10px', borderRadius: '6px', fontSize: '11px', background: 'var(--hover-bg)', color: 'var(--text-secondary)' }}>{r.productName}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{new Date(r.createdAt).toLocaleDateString('fa-IR')}</span>
                  <button onClick={() => handleDelete(r.id)} style={{ padding: '4px 8px', borderRadius: '6px', border: 'none', background: 'transparent', color: 'var(--danger)', cursor: 'pointer' }}><Icons.Trash size={14} /></button>
                </div>
              </div>
              {r.title && <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '8px 0 4px' }}>{r.title}</h4>}
              <p style={{ fontSize: '14px', margin: 0, lineHeight: 1.7, color: 'var(--text-secondary)' }}>{r.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
