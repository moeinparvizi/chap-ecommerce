'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/app/components/Icons';
import { api } from '@/app/lib/api';
import { ListLoader } from '@/app/components/Loading';

export default function CommentsPage() {
  const router = useRouter();
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('auth_token');
    if (!token) { router.push('/auth/login'); return; }
    if (user.id) {
      api.getComments(user.id).then((d: any) => { setComments(d); setLoading(false); }).catch(() => setLoading(false));
    } else { setLoading(false); }
  }, [router]);

  const deleteComment = async (id: string) => {
    await api.deleteComment(id);
    setComments(comments.filter(c => c.id !== id));
  };

  const grouped = comments.reduce((acc: Record<string, any[]>, c: any) => {
    const key = c.productName || 'عمومی';
    if (!acc[key]) acc[key] = [];
    acc[key].push(c);
    return acc;
  }, {});

  if (loading) return <div style={{ padding: '24px' }}><ListLoader count={3} /></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>کامنتهای من</h1>
        <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{comments.length} کامنت</span>
      </div>
      {Object.keys(grouped).length === 0 ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <Icons.MessageSquare size={48} color="var(--text-muted)" />
          <h3 style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>هنوز کامنتی ندارید</h3>
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
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '14px', margin: '0 0 4px', lineHeight: 1.6 }}>{c.text}</p>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>{new Date(c.createdAt).toLocaleDateString('fa-IR')}</p>
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
