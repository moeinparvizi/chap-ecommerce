'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/app/components/Icons';

export default function ReviewsPage() {
  const router = useRouter();
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({ product: '', rating: 5, title: '', text: '' });

  useEffect(() => {
    const saved = localStorage.getItem('reviews');
    if (saved) setReviews(JSON.parse(saved));
  }, []);

  const addReview = () => {
    if (!newReview.product.trim() || !newReview.text.trim()) return;
    const review = {
      id: Date.now().toString(),
      ...newReview,
      date: new Date().toLocaleDateString('fa-IR'),
    };
    const updated = [...reviews, review];
    setReviews(updated);
    localStorage.setItem('reviews', JSON.stringify(updated));
    setNewReview({ product: '', rating: 5, title: '', text: '' });
  };

  const deleteReview = (id: string) => {
    const updated = reviews.filter(r => r.id !== id);
    setReviews(updated);
    localStorage.setItem('reviews', JSON.stringify(updated));
  };

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 24px' }}>ریویوهای من</h1>

      {/* New Review */}
      <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 12px' }}>ریویو جدید</h3>
        <div style={{ display: 'grid', gap: '10px' }}>
          <input type="text" placeholder="نام محصول" value={newReview.product} onChange={e => setNewReview({ ...newReview, product: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none' }} />
          <div>
            <label style={{ fontSize: '13px', fontWeight: 500, marginBottom: '6px', display: 'block' }}>امتیاز</label>
            <div style={{ display: 'flex', gap: '4px' }}>
              {[1, 2, 3, 4, 5].map(s => (
                <button key={s} onClick={() => setNewReview({ ...newReview, rating: s })} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}>
                  <Icons.Star size={24} color={s <= newReview.rating ? '#fbbf24' : 'var(--border)'} />
                </button>
              ))}
            </div>
          </div>
          <input type="text" placeholder="عنوان ریویو" value={newReview.title} onChange={e => setNewReview({ ...newReview, title: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none' }} />
          <textarea placeholder="متن ریویو..." value={newReview.text} onChange={e => setNewReview({ ...newReview, text: e.target.value })} rows={4} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', resize: 'vertical', outline: 'none', fontFamily: 'inherit' }} />
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={addReview} disabled={!newReview.product.trim() || !newReview.text.trim()} className="btn btn-primary" style={{ padding: '8px 20px', opacity: (!newReview.product.trim() || !newReview.text.trim()) ? 0.5 : 1 }}><Icons.Send size={14} /> ارسال ریویو</button>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <Icons.Star size={48} color="var(--text-muted)" />
          <h3 style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>هنوز ریویویی ندارید</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>اولین ریویو خود را بنویسید</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {reviews.map(r => (
            <div key={r.id} className="card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '16px' }}>{r.rating}</div>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 2px' }}>{r.product}</h4>
                    <div style={{ display: 'flex', gap: '2px' }}>{[1, 2, 3, 4, 5].map(s => <Icons.Star key={s} size={12} color={s <= r.rating ? '#fbbf24' : 'var(--border)'} />)}</div>
                  </div>
                </div>
                <button onClick={() => deleteReview(r.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: '4px' }}><Icons.Trash size={14} /></button>
              </div>
              {r.title && <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '10px 0 4px' }}>{r.title}</h4>}
              <p style={{ fontSize: '14px', margin: '0 0 6px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>{r.text}</p>
              <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>{r.date}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
