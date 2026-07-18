'use client';

import { useState, useEffect } from 'react';
import { Icons } from '@/app/components/Icons';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const saved = localStorage.getItem('reviews');
    if (saved) {
      const all = JSON.parse(saved);
      setReviews(all.filter((r: any) => r.userId === user.id));
    }
  }, []);

  const deleteReview = (id: string) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const allReviews = JSON.parse(localStorage.getItem('reviews') || '[]');
    const updatedAll = allReviews.filter((r: any) => r.id !== id);
    localStorage.setItem('reviews', JSON.stringify(updatedAll));
    setReviews(updatedAll.filter((r: any) => r.userId === user.id));
  };

  const grouped = reviews.reduce((acc: Record<string, any[]>, r: any) => {
    const key = r.productName || 'نامشخص';
    if (!acc[key]) acc[key] = [];
    acc[key].push(r);
    return acc;
  }, {});

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>ریویوهای من</h1>
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{reviews.length} ریویو</span>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <Icons.Star size={48} color="var(--text-muted)" />
          <h3 style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>هنوز ریویویی ندارید</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>از صفحه محصولات ریویو ثبت کنید</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {Object.entries(grouped).map(([product, items]) => (
            <div key={product} className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
                <Icons.Star size={16} color="#fbbf24" />
                <h3 style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>{product}</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'var(--hover-bg)', padding: '2px 8px', borderRadius: '4px' }}>{items.length} ریویو</span>
              </div>
              <div style={{ display: 'grid', gap: '10px' }}>
                {items.map((r: any) => (
                  <div key={r.id} style={{ padding: '14px', borderRadius: '10px', background: 'var(--hover-bg)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '13px' }}>{r.rating}</div>
                        <div>
                          <div style={{ display: 'flex', gap: '2px' }}>{[1, 2, 3, 4, 5].map(s => <Icons.Star key={s} size={11} color={s <= r.rating ? '#fbbf24' : '#d1d5db'} />)}</div>
                          {r.title && <p style={{ fontSize: '13px', fontWeight: 600, margin: '2px 0 0' }}>{r.title}</p>}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{r.date}</span>
                        <button onClick={() => deleteReview(r.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: '2px' }}><Icons.Trash size={13} /></button>
                      </div>
                    </div>
                    <p style={{ fontSize: '14px', margin: '8px 0 0', lineHeight: 1.6, color: 'var(--text-secondary)' }}>{r.text}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
