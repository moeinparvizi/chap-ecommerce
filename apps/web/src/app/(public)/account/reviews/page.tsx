'use client';

import { useState, useEffect } from 'react';
import { Icons } from '@/app/components/Icons';

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [newReview, setNewReview] = useState({ rating: 5, title: '', text: '' });

  useEffect(() => {
    const saved = localStorage.getItem('reviews');
    if (saved) setReviews(JSON.parse(saved));
    import('@/app/lib/api').then(({ api }) => {
      api.getProducts().then((d: any) => setProducts(d)).catch(() => {});
    });
  }, []);

  const addReview = () => {
    if (!selectedProduct || !newReview.text.trim()) return;
    const product = products.find((p: any) => p.id === selectedProduct);
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const review = {
      id: Date.now().toString(),
      productId: selectedProduct,
      productName: product?.name || '',
      rating: newReview.rating,
      title: newReview.title,
      text: newReview.text,
      author: user.name || 'کاربر',
      date: new Date().toLocaleDateString('fa-IR'),
    };
    const updated = [...reviews, review];
    setReviews(updated);
    localStorage.setItem('reviews', JSON.stringify(updated));
    setNewReview({ rating: 5, title: '', text: '' });
    setSelectedProduct('');
  };

  const deleteReview = (id: string) => {
    const updated = reviews.filter(r => r.id !== id);
    setReviews(updated);
    localStorage.setItem('reviews', JSON.stringify(updated));
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

      {/* New Review */}
      <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 12px' }}>ریویو جدید</h3>
        <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', marginBottom: '10px', outline: 'none' }}>
          <option value="">انتخاب محصول</option>
          {products.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>امتیاز:</span>
          <div style={{ display: 'flex', gap: '2px' }}>{[1, 2, 3, 4, 5].map(s => <button key={s} onClick={() => setNewReview({ ...newReview, rating: s })} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}><Icons.Star size={22} color={s <= newReview.rating ? '#fbbf24' : '#d1d5db'} /></button>)}</div>
        </div>
        <input type="text" placeholder="عنوان ریویو (اختیاری)" value={newReview.title} onChange={e => setNewReview({ ...newReview, title: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none', marginBottom: '10px' }} />
        <textarea placeholder="متن ریویو..." value={newReview.text} onChange={e => setNewReview({ ...newReview, text: e.target.value })} rows={4} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', resize: 'vertical', outline: 'none', fontFamily: 'inherit' }} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <button onClick={addReview} disabled={!selectedProduct || !newReview.text.trim()} className="btn btn-primary" style={{ padding: '8px 20px', opacity: (!selectedProduct || !newReview.text.trim()) ? 0.5 : 1 }}><Icons.Send size={14} /> ارسال ریویو</button>
        </div>
      </div>

      {/* Grouped Reviews */}
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
