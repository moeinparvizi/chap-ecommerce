'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Icons } from '@/app/components/Icons';
import { api } from '@/app/lib/api';

interface Product { id: string; name: string; price: number; compareAtPrice?: number; stock: number; brand: string; description: string; rating: number; sales: number; status: string; images: { id: string; url: string }[]; category?: { name: string; slug: string } | null; }

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]);
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [minRating, setMinRating] = useState(0);

  useEffect(() => { api.getProducts().then((d: any) => setProducts(d)).catch(() => {}); }, []);

  // Sync category filter from URL
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setSelectedCategory(decodeURIComponent(cat));
  }, [searchParams]);

  // Build category hierarchy for filtering
  const [allApiCategories, setAllApiCategories] = useState<any[]>([]);
  useEffect(() => { api.getCategories().then((d: any) => setAllApiCategories(d)).catch(() => {}); }, []);

  // Get all category names that belong to a parent (parent + children)
  const getCategoryFamily = (parentName: string): string[] => {
    const parent = allApiCategories.find((c: any) => c.name === parentName && !c.parentId);
    if (!parent) return [parentName];
    const children = allApiCategories.filter((c: any) => c.parentId === parent.id).map((c: any) => c.name);
    return [parentName, ...children];
  };

  const t = (fa: string, en: string) => fa;
  const fmt = (p: number) => p.toLocaleString('fa-IR') + ' تومان';
  const getDiscount = (p: Product) => p.compareAtPrice ? Math.round((1 - p.price / p.compareAtPrice) * 100) : 0;
  const getImg = (p: Product) => p.images?.length > 0 ? p.images[0].url : 'https://picsum.photos/400/400?random=' + p.id;
  const getCat = (p: Product) => p.category?.name || '';

  const allCategories = [...new Set(products.map(p => getCat(p)).filter(Boolean))];
  const allBrands = [...new Set(products.map(p => p.brand).filter(Boolean))];
  const maxPrice = Math.max(...products.map(p => p.price), 1000000);

  const filtered = products.filter(p => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.brand.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedCategory !== 'all') {
      const family = getCategoryFamily(selectedCategory);
      if (!family.includes(getCat(p))) return false;
    }
    if (selectedBrand !== 'all' && p.brand !== selectedBrand) return false;
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
    if (minRating > 0 && p.rating < minRating) return false;
    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'cheapest': return a.price - b.price;
      case 'expensive': return b.price - a.price;
      case 'popular': return b.sales - a.sales;
      case 'rating': return b.rating - a.rating;
      case 'newest': return 0;
      default: return 0;
    }
  });

  const ProductCard = ({ p }: { p: Product }) => {
    const d = getDiscount(p);
    return (
      <div onClick={() => router.push(`/product/${p.id}`)} style={{ borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--card-bg)', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(37,99,235,0.12)'; }} onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
        <div style={{ position: 'relative', height: '220px', background: `url(${getImg(p)}) center/cover` }}>
          {d > 0 && <span style={{ position: 'absolute', top: '10px', left: '10px', padding: '3px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, background: '#ef4444', color: 'white' }}>-{d}%</span>}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px', background: 'linear-gradient(transparent, rgba(0,0,0,0.6))', display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Star size={13} color="#fbbf24" /><span style={{ color: 'white', fontSize: '12px', fontWeight: 600 }}>{p.rating}</span><span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>({p.sales})</span></div>
        </div>
        <div style={{ padding: '14px' }}>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 4px' }}>{getCat(p)} · {p.brand}</p>
          <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 10px', lineHeight: 1.4 }}>{p.name}</h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '17px', fontWeight: 800, color: 'var(--primary)' }}>{fmt(p.price)}</span>
            {p.compareAtPrice && <span style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>{fmt(p.compareAtPrice)}</span>}
          </div>
        </div>
      </div>
    );
  };

  const ProductListItem = ({ p }: { p: Product }) => {
    const d = getDiscount(p);
    return (
      <div onClick={() => router.push(`/product/${p.id}`)} style={{ display: 'flex', gap: '16px', padding: '16px', borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--card-bg)', cursor: 'pointer', transition: 'all 0.2s' }}>
        <div style={{ width: '140px', height: '140px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, position: 'relative' }}>
          <img src={getImg(p)} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          {d > 0 && <span style={{ position: 'absolute', top: '6px', left: '6px', padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 700, background: '#ef4444', color: 'white' }}>-{d}%</span>}
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 4px' }}>{getCat(p)} · {p.brand}</p>
          <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 8px' }}>{p.name}</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 10px', lineHeight: 1.5 }}>{p.description?.substring(0, 100)}...</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><Icons.Star size={13} color="#fbbf24" /><span style={{ fontSize: '13px', fontWeight: 600 }}>{p.rating}</span><span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>({p.sales})</span></div>
            <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>{fmt(p.price)}</span>
            {p.compareAtPrice && <span style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>{fmt(p.compareAtPrice)}</span>}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>همه محصولات</h1><p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>{filtered.length} محصول</p></div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={() => setShowFilters(!showFilters)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--hover-bg)', color: 'var(--text)', cursor: 'pointer', fontSize: '13px' }}><Icons.Filter size={14} /> فیلتر</button>
          <button onClick={() => setViewMode('grid')} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: viewMode === 'grid' ? 'var(--primary)' : 'var(--hover-bg)', color: viewMode === 'grid' ? 'white' : 'var(--text)', cursor: 'pointer' }}><Icons.Grid size={16} /></button>
          <button onClick={() => setViewMode('list')} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: viewMode === 'list' ? 'var(--primary)' : 'var(--hover-bg)', color: viewMode === 'list' ? 'white' : 'var(--text)', cursor: 'pointer' }}><Icons.List size={16} /></button>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', color: 'var(--text)', fontSize: '13px' }}>
            <option value="newest">جدیدترین</option>
            <option value="cheapest">ارزان\u200cترین</option>
            <option value="expensive">گران\u200cترین</option>
            <option value="popular">محبوب\u200cترین</option>
            <option value="rating">بالاترین امتیاز</option>
          </select>
        </div>
      </div>

      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 20px', display: 'flex', gap: '24px' }}>
        {/* Filters Sidebar */}
        {showFilters && (
          <div style={{ width: '260px', flexShrink: 0 }}>
            <div className="card" style={{ padding: '20px', position: 'sticky', top: '80px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}><h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>فیلترها</h3><button onClick={() => { setSelectedCategory('all'); setSelectedBrand('all'); setMinRating(0); setPriceRange([0, maxPrice]); }} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '12px' }}>پاک کردن</button></div>

              {/* Search */}
              <div style={{ marginBottom: '20px' }}><label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>جستجو</label><div style={{ position: 'relative' }}><input type="text" placeholder="نام محصول..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '10px 36px 10px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '13px', color: 'var(--text)', outline: 'none' }} /><div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><Icons.Search size={14} /></div></div></div>

              {/* Category */}
              <div style={{ marginBottom: '20px' }}><label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>دسته\u200cبندی</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <button onClick={() => setSelectedCategory('all')} style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', background: selectedCategory === 'all' ? 'var(--primary)' : 'transparent', color: selectedCategory === 'all' ? 'white' : 'var(--text)', cursor: 'pointer', fontSize: '13px', textAlign: 'right', width: '100%' }}>همه</button>
                  {allCategories.map(c => <button key={c} onClick={() => setSelectedCategory(c)} style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', background: selectedCategory === c ? 'var(--primary)' : 'transparent', color: selectedCategory === c ? 'white' : 'var(--text)', cursor: 'pointer', fontSize: '13px', textAlign: 'right', width: '100%' }}>{c}</button>)}
                </div>
              </div>

              {/* Brand */}
              <div style={{ marginBottom: '20px' }}><label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>برند</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxHeight: '120px', overflowY: 'auto' }}>
                  <button onClick={() => setSelectedBrand('all')} style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', background: selectedBrand === 'all' ? 'var(--primary)' : 'transparent', color: selectedBrand === 'all' ? 'white' : 'var(--text)', cursor: 'pointer', fontSize: '13px', textAlign: 'right', width: '100%' }}>همه</button>
                  {allBrands.map(b => <button key={b} onClick={() => setSelectedBrand(b)} style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', background: selectedBrand === b ? 'var(--primary)' : 'transparent', color: selectedBrand === b ? 'white' : 'var(--text)', cursor: 'pointer', fontSize: '13px', textAlign: 'right', width: '100%' }}>{b}</button>)}
                </div>
              </div>

              {/* Price Range */}
              <div style={{ marginBottom: '20px' }}><label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>محدوده قیمت</label>
                <input type="range" min={0} max={maxPrice} value={priceRange[1]} onChange={e => setPriceRange([0, Number(e.target.value)])} style={{ width: '100%', accentColor: 'var(--primary)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}><span>۰</span><span>{fmt(priceRange[1])}</span></div>
              </div>

              {/* Rating */}
              <div><label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>حداقل امتیاز</label>
                <div style={{ display: 'flex', gap: '4px' }}>
                  {[0, 3, 3.5, 4, 4.5].map(r => <button key={r} onClick={() => setMinRating(r)} style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: minRating === r ? 'var(--primary)' : 'var(--hover-bg)', color: minRating === r ? 'white' : 'var(--text)', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '2px' }}>{r === 0 ? 'همه' : <><Icons.Star size={10} color={minRating === r ? 'white' : '#fbbf24'} /> {r}</>}</button>)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid/List */}
        <div style={{ flex: 1 }}>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}><Icons.Search size={48} /><h3 style={{ marginTop: '12px' }}>محصولی یافت نشد</h3><p>فیلترها را تغییر دهید</p></div>
          ) : viewMode === 'grid' ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>{filtered.map(p => <ProductCard key={p.id} p={p} />)}</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>{filtered.map(p => <ProductListItem key={p.id} p={p} />)}</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return <Suspense fallback={<div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>loading...</div>}><ProductsContent /></Suspense>;
}
