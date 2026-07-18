'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/app/components/Icons';

export default function CommentsPage() {
  const router = useRouter();
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const saved = localStorage.getItem('comments');
    if (saved) {
      const all = JSON.parse(saved);
      setComments(all.filter((c: any) => c.userId === user.id));
    }
    import('@/app/lib/api').then(({ api }) => {
      api.getProducts().then((d: any) => setProducts(d)).catch(() => {});
    });
  }, []);

  const addComment = () => {
    if (!newComment.trim()) return;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const comment = {
      id: Date.now().toString(),
      text: newComment,
      productId: selectedProduct || '',
      productName: selectedProduct ? products.find((p: any) => p.id === selectedProduct)?.name || '' : '',
      userId: user.id,
      author: user.name || 'کاربر',
      date: new Date().toLocaleDateString('fa-IR'),
    };
    const allComments = JSON.parse(localStorage.getItem('comments') || '[]');
    const updatedAll = [...allComments, comment];
    localStorage.setItem('comments', JSON.stringify(updatedAll));
    setComments(updatedAll.filter((c: any) => c.userId === user.id));
    setNewComment('');
    setSelectedProduct('');
  };

  const deleteComment = (id: string) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const allComments = JSON.parse(localStorage.getItem('comments') || '[]');
    const updatedAll = allComments.filter((c: any) => c.id !== id);
    localStorage.setItem('comments', JSON.stringify(updatedAll));
    setComments(updatedAll.filter((c: any) => c.userId === user.id));
  };

  const grouped = comments.reduce((acc: Record<string, any[]>, c: any) => {
    const key = c.productName || 'عمومی';
    if (!acc[key]) acc[key] = [];
    acc[key].push(c);
    return acc;
  }, {});

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>کامنت‌های من</h1>
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{comments.length} کامنت</span>
      </div>

      {/* New Comment */}
      <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 12px' }}>کامنت جدید</h3>
        <select value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', marginBottom: '10px', outline: 'none' }}>
          <option value="">انتخاب محصول (اختیاری)</option>
          {products.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <textarea placeholder="نظر خود را بنویسید..." value={newComment} onChange={e => setNewComment(e.target.value)} rows={3} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', resize: 'vertical', outline: 'none', fontFamily: 'inherit' }} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <button onClick={addComment} disabled={!newComment.trim()} className="btn btn-primary" style={{ padding: '8px 20px', opacity: newComment.trim() ? 1 : 0.5 }}><Icons.Send size={14} /> ارسال نظر</button>
        </div>
      </div>

      {/* Grouped Comments */}
      {Object.keys(grouped).length === 0 ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <Icons.MessageSquare size={48} color="var(--text-muted)" />
          <h3 style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>هنوز کامنتی ندارید</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>از صفحه محصولات نظر خود را ثبت کنید</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {Object.entries(grouped).map(([product, items]) => (
            <div key={product} className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', paddingBottom: '10px', borderBottom: '1px solid var(--border)' }}>
                <Icons.Package size={16} color="var(--primary)" />
                <h3 style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>{product}</h3>
                <span style={{ fontSize: '12px', color: 'var(--text-muted)', background: 'var(--hover-bg)', padding: '2px 8px', borderRadius: '4px' }}>{items.length}</span>
              </div>
              <div style={{ display: 'grid', gap: '10px' }}>
                {items.map((c: any) => (
                  <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '12px', borderRadius: '8px', background: 'var(--hover-bg)' }}>
                    <div>
                      <p style={{ fontSize: '14px', margin: '0 0 4px', lineHeight: 1.6 }}>{c.text}</p>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>{c.date}</p>
                    </div>
                    <button onClick={() => deleteComment(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: '4px', flexShrink: 0 }}><Icons.Trash size={14} /></button>
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
