'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '../../components/Icons';
import { api } from '../../lib/api';

export default function AdminCommentsPage() {
  const router = useRouter();
  const [comments, setComments] = useState<any[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => { api.getComments().then((d: any) => setComments(d)).catch(() => {}); }, []);

  const handleReply = async (id: string) => {
    if (!replyText.trim()) return;
    await api.replyComment(id, replyText);
    setComments(comments.map(c => c.id === id ? { ...c, reply: replyText } : c));
    setReplyingTo(null);
    setReplyText('');
  };

  const handleDeleteReply = async (id: string) => {
    if (!confirm('آیا از حذف پاسخ اطمینان دارید؟')) return;
    await api.replyComment(id, '');
    setComments(comments.map(c => c.id === id ? { ...c, reply: null } : c));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('آیا از حذف این کامنت اطمینان دارید؟')) return;
    await api.deleteComment(id);
    setComments(comments.filter(c => c.id !== id));
  };

  const filtered = comments.filter(c => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return c.author?.toLowerCase().includes(q) || c.text?.toLowerCase().includes(q) || c.productName?.toLowerCase().includes(q);
  });

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>مدیریت کامنت‌ها</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>{comments.length} کامنت</p>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '20px' }}>
        <input type="text" placeholder="جستجو در کامنت‌ها..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="input" style={{ maxWidth: '400px' }} />
      </div>

      {filtered.length === 0 ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
          <Icons.MessageSquare size={48} color="var(--text-muted)" />
          <h3 style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>کامنتی یافت نشد</h3>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {filtered.map(c => (
            <div key={c.id} className="card" style={{ padding: '20px' }}>
              {/* Header: User + Product */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '10px', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: 600, flexShrink: 0 }}>{(c.author || 'کاربر').charAt(0)}</div>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 600, margin: 0 }}>{c.author || 'کاربر'}</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>{new Date(c.createdAt).toLocaleString('fa-IR')}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <button onClick={() => router.push(`/product/${c.productId}`)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '5px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--hover-bg)', color: 'var(--primary)', cursor: 'pointer', fontSize: '12px', fontWeight: 500, transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                    <Icons.Package size={12} /> {c.productName || 'محصول'}
                  </button>
                </div>
              </div>

              {/* Comment Text */}
              <div style={{ padding: '12px', borderRadius: '8px', background: 'var(--hover-bg)', marginBottom: '10px' }}>
                <p style={{ fontSize: '14px', margin: 0, lineHeight: 1.6 }}>{c.text}</p>
              </div>

              {/* Admin Reply */}
              {c.reply && (
                <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(37,99,235,0.05)', borderRight: '3px solid var(--primary)', marginBottom: '10px', marginRight: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Icons.Shield size={14} color="var(--primary)" />
                      <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--primary)' }}>پاسخ ادمین</span>
                    </div>
                    <button onClick={() => handleDeleteReply(c.id)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '6px', border: 'none', background: 'transparent', color: 'var(--danger)', cursor: 'pointer', fontSize: '11px' }}><Icons.Trash size={11} /> حذف پاسخ</button>
                  </div>
                  <p style={{ fontSize: '13px', margin: 0, lineHeight: 1.6, color: 'var(--text-secondary)' }}>{c.reply}</p>
                </div>
              )}

              {/* Reply Form */}
              {replyingTo === c.id && (
                <div style={{ marginBottom: '10px' }}>
                  <textarea placeholder="پاسخ خود را بنویسید..." value={replyText} onChange={e => setReplyText(e.target.value)} rows={2} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '13px', color: 'var(--text)', outline: 'none', resize: 'vertical', fontFamily: 'inherit', marginBottom: '8px' }} />
                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button onClick={() => handleReply(c.id)} disabled={!replyText.trim()} className="btn btn-primary btn-sm" style={{ opacity: replyText.trim() ? 1 : 0.5 }}>ارسال پاسخ</button>
                    <button onClick={() => { setReplyingTo(null); setReplyText(''); }} className="btn btn-ghost btn-sm">لغو</button>
                  </div>
                </div>
              )}

              {/* Actions */}
              {!replyingTo && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '4px', paddingTop: '10px', borderTop: '1px solid var(--border-light)' }}>
                  <button onClick={() => { setReplyingTo(c.id); setReplyText(c.reply || ''); }} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'var(--primary)', cursor: 'pointer', fontSize: '12px', fontWeight: 500 }}>
                    <Icons.MessageSquare size={12} /> {c.reply ? 'ویرایش پاسخ' : 'پاسخ'}
                  </button>
                  <button onClick={() => handleDelete(c.id)} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'var(--danger)', cursor: 'pointer', fontSize: '12px', fontWeight: 500 }}>
                    <Icons.Trash size={12} /> حذف کامنت
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
