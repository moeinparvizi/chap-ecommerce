'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/app/components/Icons';
import { api } from '@/app/lib/api';

interface SearchResult { type: 'product' | 'category' | 'page'; id?: string; name: string; subtitle?: string; icon: any; }

export default function SmartSearch() {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Live search
  useEffect(() => {
    if (!query.trim()) { setResults([]); setOpen(false); return; }
    setLoading(true);
    const timer = setTimeout(async () => {
      const q = query.toLowerCase();
      const results: SearchResult[] = [];

      // Search products
      try {
        const products = await api.getProducts() as any[];
        const matchedProducts = products.filter((p: any) =>
          p.name.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.category?.name?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
        ).slice(0, 5);
        matchedProducts.forEach((p: any) => {
          results.push({ type: 'product', id: p.id, name: p.name, subtitle: `${p.category?.name || ''} • ${(p.price * 10).toLocaleString('fa-IR')} ریال`, icon: <Icons.Package size={18} color="#3b82f6" /> });
        });
      } catch (e) {}

      // Search categories
      try {
        const categories = await api.getCategories() as any[];
        const matchedCategories = categories.filter((c: any) => c.name.toLowerCase().includes(q)).slice(0, 3);
        matchedCategories.forEach((c: any) => {
          results.push({ type: 'category', name: c.name, subtitle: `${c.parentId ? 'ساب‌کتگوری' : 'دسته‌بندی'}`, icon: <Icons.Folder size={18} color="#8b5cf6" /> });
        });
      } catch (e) {}

      // Quick links
      const pages = [
        { name: 'محصولات', path: '/products', icon: <Icons.Package size={18} color="#22c55e" /> },
        { name: 'درباره ما', path: '/about', icon: <Icons.Users size={18} color="#f59e0b" /> },
        { name: 'تماس با ما', path: '/contact', icon: <Icons.Mail size={18} color="#ec4899" /> },
      ].filter(p => p.name.includes(q) || p.name.toLowerCase().includes(q)).slice(0, 2);
      pages.forEach(p => results.push({ type: 'page', name: p.name, subtitle: p.path, icon: p.icon }));

      setResults(results);
      setOpen(true);
      setLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (r: SearchResult) => {
    setOpen(false);
    setQuery('');
    if (r.type === 'product') router.push(`/product/${r.id}`);
    else if (r.type === 'category') router.push(`/products?category=${encodeURIComponent(r.name)}`);
    else if (r.type === 'page') router.push(r.subtitle || '/');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setOpen(false);
      router.push(`/products?search=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div ref={ref} style={{ position: 'relative', flex: 1, maxWidth: '600px' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', width: '100%' }}>
        <input type="text" placeholder="جستجوی محصولات، دسته‌بندی..." value={query} onChange={e => { setQuery(e.target.value); if (e.target.value.trim()) setOpen(true); }} onFocus={() => { if (query.trim()) setOpen(true); }} style={{ width: '100%', padding: '12px 44px 12px 16px', borderRadius: '12px', border: '2px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none', transition: 'all 0.2s' }} onFocusCapture={e => e.currentTarget.style.borderColor = 'var(--primary)'} onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'} />
        <button type="submit" style={{ position: 'absolute', right: '4px', top: '50%', transform: 'translateY(-50%)', background: 'var(--primary)', color: 'white', border: 'none', borderRadius: '8px', padding: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icons.Search size={16} /></button>
      </form>

      {/* Results dropdown */}
      {open && query.trim() && (
        <div style={{ position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '12px', boxShadow: '0 12px 40px rgba(0,0,0,0.15)', zIndex: 200, maxHeight: '420px', overflowY: 'auto', animation: 'slideInRight 0.2s ease-out' }}>
          {loading ? (
            <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}><div className="loader-spinner" style={{ width: '24px', height: '24px', margin: '0 auto 8px' }} /> در حال جستجو...</div>
          ) : results.length === 0 ? (
            <div style={{ padding: '24px', textAlign: 'center' }}><Icons.Search size={32} color="var(--text-muted)" /><p style={{ margin: '8px 0 0', color: 'var(--text-muted)', fontSize: '13px' }}>نتیجه‌ای برای "{query}" یافت نشد</p></div>
          ) : (
            <div style={{ padding: '8px' }}>
              {/* Products */}
              {results.some(r => r.type === 'product') && (
                <div style={{ marginBottom: '8px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', margin: '0 4px 6px', textTransform: 'uppercase' }}>محصولات</p>
                  {results.filter(r => r.type === 'product').map((r, i) => (
                    <div key={i} onClick={() => handleSelect(r)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-bg)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(59,130,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{r.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}><p style={{ fontSize: '13px', fontWeight: 500, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.name}</p><p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>{r.subtitle}</p></div>
                      <Icons.ChevronDown size={14} color="var(--text-muted)" />
                    </div>
                  ))}
                </div>
              )}

              {/* Categories */}
              {results.some(r => r.type === 'category') && (
                <div style={{ marginBottom: '8px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', margin: '0 4px 6px', textTransform: 'uppercase' }}>دسته‌بندی‌ها</p>
                  {results.filter(r => r.type === 'category').map((r, i) => (
                    <div key={i} onClick={() => handleSelect(r)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-bg)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(139,92,246,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{r.icon}</div>
                      <div style={{ flex: 1 }}><p style={{ fontSize: '13px', fontWeight: 500, margin: 0 }}>{r.name}</p><p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>{r.subtitle}</p></div>
                      <Icons.ChevronDown size={14} color="var(--text-muted)" />
                    </div>
                  ))}
                </div>
              )}

              {/* Pages */}
              {results.some(r => r.type === 'page') && (
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-muted)', margin: '0 4px 6px', textTransform: 'uppercase' }}>صفحات</p>
                  {results.filter(r => r.type === 'page').map((r, i) => (
                    <div key={i} onClick={() => handleSelect(r)} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.15s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-bg)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{r.icon}</div>
                      <p style={{ fontSize: '13px', fontWeight: 500, margin: 0, flex: 1 }}>{r.name}</p>
                      <Icons.ChevronDown size={14} color="var(--text-muted)" />
                    </div>
                  ))}
                </div>
              )}

              {/* See all results */}
              <div onClick={() => { setOpen(false); router.push(`/products?search=${encodeURIComponent(query)}`); }} style={{ textAlign: 'center', padding: '10px', marginTop: '4px', borderTop: '1px solid var(--border)', cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: 'var(--primary)', transition: 'background 0.15s', borderRadius: '0 0 12px 12px' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-bg)'} onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                مشاهده همه نتایج "{query}" →
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
