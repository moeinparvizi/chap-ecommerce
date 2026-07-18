'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/app/components/Icons';

export default function CommentsPage() {
  const router = useRouter();
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('comments');
    if (saved) setComments(JSON.parse(saved));
  }, []);

  const addComment = () => {
    if (!newComment.trim()) return;
    const comment = {
      id: Date.now().toString(),
      text: newComment,
      product: selectedProduct || 'عمومی',
      date: new Date().toLocaleDateString('fa-IR'),
      likes: 0,
    };
    const updated = [...comments, comment];
    setComments(updated);
    localStorage.setItem('comments', JSON.stringify(updated));
    setNewComment('');
    setSelectedProduct('');
  };

  const deleteComment = (id: string) => {
    const updated = comments.filter(c => c.id !== id);
    setComments(updated);
    localStorage.setItem('comments', JSON.stringify(updated));
  };

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 24px' }}>کامنت‌های من</h1>

      {/* New Comment */}
      <div className="card" style={{ padding: '20px', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 12px' }}>نظر جدید</h3>
        <input type="text" placeholder="نام محصول (اختیاری)" value={selectedProduct} onChange={e => setSelectedProduct(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', marginBottom: '10px', outline: 'none' }} />
        <textarea placeholder="نظر خود را بنویسید..." value={newComment} onChange={e => setNewComment(e.target.value)} rows={3} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', resize: 'vertical', outline: 'none', fontFamily: 'inherit' }} />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
          <button onClick={addComment} disabled={!newComment.trim()} className="btn btn-primary" style={{ padding: '8px 20px', opacity: newComment.trim() ? 1 : 0.5 }}><Icons.Send size={14} /> ارسال نظر</button>
        </div>
      </div>

      {/* Comments List */}
      {comments.length === 0 ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <Icons.MessageSquare size={48} color="var(--text-muted)" />
          <h3 style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>هنوز کامنتی ندارید</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>اولین نظر خود را بنویسید</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {comments.map(c => (
            <div key={c.id} className="card" style={{ padding: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 600 }}>ن</div>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 500, margin: 0 }}>شما</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>{c.date}</p>
                  </div>
                </div>
                <button onClick={() => deleteComment(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', padding: '4px' }}><Icons.Trash size={14} /></button>
              </div>
              <p style={{ fontSize: '14px', margin: '10px 0 0', lineHeight: 1.6 }}>{c.text}</p>
              {c.product !== 'عمومی' && <span style={{ display: 'inline-block', marginTop: '8px', padding: '2px 8px', borderRadius: '4px', background: 'var(--hover-bg)', fontSize: '11px', color: 'var(--text-secondary)' }}>{c.product}</span>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
