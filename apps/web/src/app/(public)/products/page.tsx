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
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]);
  const [showFilters, setShowFilters] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [minRating, setMinRating] = useState(0);
  const [likedProducts, setLikedProducts] = useState<Record<string, boolean>>({});

  useEffect(() => { api.getProducts().then((d: any) => setProducts(d)).catch(() => {}); }, []);
  useEffect(() => { const cat = searchParams.get('category'); if (cat) setSelectedCategory(decodeURIComponent(cat)); }, [searchParams]);
  useEffect(() => { const q = searchParams.get('search'); if (q) setSearchQuery(decodeURIComponent(q)); }, [searchParams]);

  const [allApiCategories, setAllApiCategories] = useState<any[]>([]);
  useEffect(() => { api.getCategories().then((d: any) => setAllApiCategories(d)).catch(() => {}); }, []);

  const getCategoryFamily = (parentName: string): string[] => {
    const parent = allApiCategories.find((c: any) => c.name === parentName && !c.parentId);
    if (!parent) return [parentName];
    const children = allApiCategories.filter((c: any) => c.parentId === parent.id).map((c: any) => c.name);
    return [parentName, ...children];
  };

  const fmt = (p: number) => p.toLocaleString('fa-IR') + ' تومان';
  const getDiscount = (p: Product) => p.compareAtPrice ? Math.round((1 - p.price / p.compareAtPrice) * 100) : 0;
  const getImg = (p: Product) => p.images?.length > 0 ? p.images[0].url : 'https://picsum.photos/400/400?random=' + p.id;
  const getCat = (p: Product) => p.category?.name || '';

  const allCategories = [...new Set(products.map(p => getCat(p)).filter(Boolean))];
  const maxPrice = Math.max(...products.map(p => p.price), 1000000);

  const filtered = products.filter(p => {
    if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.brand.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedCategory !== 'all') {
      const family = getCategoryFamily(selectedCategory);
      if (!family.includes(getCat(p))) return false;
    }
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
    if (minRating > 0 && p.rating < minRating) return false;
    return true;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'cheapest': return a.price - b.price;
      case 'expensive': return b.price - a.price;
      case 'popular': return b.sales - a.sales;
      case 'rating': return b.rating - a.rating;
      default: return 0;
    }
  });

  const addToCart = (e: React.MouseEvent, p: Product) => {
    e.stopPropagation();
    const saved = localStorage.getItem('cart');
    const cart: any[] = saved ? JSON.parse(saved) : [];
    const existing = cart.find((c: any) => c.id === p.id);
    if (existing) { existing.quantity += 1; } else { cart.push({ id: p.id, name: p.name, price: p.price, image: getImg(p), quantity: 1 }); }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cart-added', { detail: { name: p.name } }));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLikedProducts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const ProductCard = ({ p }: { p: Product }) => {
    const d = getDiscount(p);
    const isLiked = likedProducts[p.id] || false;
    return (
      <div className="product-card">
        <div className="card-image" style={{ height: '220px', position: 'relative' }} onClick={() => router.push(`/product/${p.id}`)}>
          <img src={getImg(p)} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <button className={`like-btn ${isLiked ? 'liked animate-like' : ''}`} onClick={(e) => toggleLike(e, p.id)}><Icons.Star size={18} color={isLiked ? 'white' : '#ef4444'} /></button>
          {d > 0 && <span style={{ position: 'absolute', top: '12px', left: '12px', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white', boxShadow: '0 2px 8px rgba(239,68,68,0.3)' }}>-{d}%</span>}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ display: 'flex', gap: '1px' }}>{[1,2,3,4,5].map(s => <Icons.Star key={s} size={12} color={s <= Math.round(p.rating) ? '#fbbf24' : 'rgba(255,255,255,0.3)'} />)}</div>
            <span style={{ color: 'white', fontSize: '12px', fontWeight: 600 }}>{p.rating}</span>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px' }}>({p.sales.toLocaleString()})</span>
          </div>
        </div>
        <div className="card-body" onClick={() => router.push(`/product/${p.id}`)}>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 4px', fontWeight: 500 }}>{getCat(p)}</p>
          <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 8px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span className="card-price" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>{fmt(p.price)}</span>
            {p.compareAtPrice && <span style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>{fmt(p.compareAtPrice)}</span>}
          </div>
        </div>
        <div style={{ padding: '0 16px 16px' }}>
          <button onClick={(e) => { e.stopPropagation(); addToCart(e, p); }} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #1e40af, #3b82f6)', color: 'white', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(37,99,235,0.3)', transition: 'all 0.2s' }}><Icons.ShoppingCart size={14} /> افزودن به سبد</button>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Header */}
      <div className="products-header" style={{ maxWidth: '1280px', margin: '0 auto', padding: '24px 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>همه محصولات</h1><p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>{filtered.length} محصول</p></div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={() => setShowFilters(!showFilters)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--hover-bg)', color: 'var(--text)', cursor: 'pointer', fontSize: '13px' }}><Icons.Filter size={14} /> فیلتر</button>
          <button onClick={() => setViewMode('grid')} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: viewMode === 'grid' ? 'var(--primary)' : 'var(--hover-bg)', color: viewMode === 'grid' ? 'white' : 'var(--text)', cursor: 'pointer' }}><Icons.Grid size={16} /></button>
          <button onClick={() => setViewMode('list')} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: viewMode === 'list' ? 'var(--primary)' : 'var(--hover-bg)', color: viewMode === 'list' ? 'white' : 'var(--text)', cursor: 'pointer' }}><Icons.List size={16} /></button>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', color: 'var(--text)', fontSize: '13px' }}><option value="newest">جدیدترین</option><option value="cheapest">ارزان\u200cترین</option><option value="expensive">گران\u200cترین</option><option value="popular">محبوب\u200cترین</option><option value="rating">بالاترین امتیاز</option></select>
        </div>
      </div>
      <div className="products-layout" style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 20px', display: 'flex', gap: '24px' }}>
        {/* Filters Sidebar */}
        {showFilters && (
          <div className="products-sidebar" style={{ width: '260px', flexShrink: 0 }}>
            <div className="card" style={{ padding: '20px', position: 'sticky', top: '80px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}><h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>فیلترها</h3><button onClick={() => { setSelectedCategory('all'); setMinRating(0); setPriceRange([0, maxPrice]); }} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '12px' }}>پاک کردن</button></div>
              <div style={{ marginBottom: '20px' }}><label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>جستجو</label><div style={{ position: 'relative' }}><input type="text" placeholder="نام محصول..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '10px 36px 10px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '13px', color: 'var(--text)', outline: 'none' }} /><div style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><Icons.Search size={14} /></div></div></div>
              <div style={{ marginBottom: '20px' }}><label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>دسته\u200cبندی</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <button onClick={() => setSelectedCategory('all')} style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', background: selectedCategory === 'all' ? 'var(--primary)' : 'transparent', color: selectedCategory === 'all' ? 'white' : 'var(--text)', cursor: 'pointer', fontSize: '13px', textAlign: 'right', width: '100%', fontWeight: selectedCategory === 'all' ? 600 : 400 }}>همه محصولات</button>
                  {allApiCategories.filter((c: any) => !c.parentId).map((parent: any) => {
                    const children = allApiCategories.filter((c: any) => c.parentId === parent.id);
                    return (<div key={parent.id}><button onClick={() => setSelectedCategory(parent.name)} style={{ padding: '6px 10px', borderRadius: '6px', border: 'none', background: selectedCategory === parent.name ? 'var(--primary)' : 'transparent', color: selectedCategory === parent.name ? 'white' : 'var(--text)', cursor: 'pointer', fontSize: '13px', textAlign: 'right', width: '100%', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>{parent.name}{children.length > 0 && <span style={{ fontSize: '10px', opacity: 0.7 }}>{children.length}</span>}</button>
                      {children.map((child: any) => (<button key={child.id} onClick={() => setSelectedCategory(child.name)} style={{ padding: '4px 10px 4px 24px', borderRadius: '6px', border: 'none', background: selectedCategory === child.name ? 'var(--primary)' : 'transparent', color: selectedCategory === child.name ? 'white' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '12px', textAlign: 'right', width: '100%', fontWeight: selectedCategory === child.name ? 600 : 400 }}><span style={{ marginLeft: '4px', fontSize: '10px', color: selectedCategory === child.name ? 'rgba(255,255,255,0.6)' : 'var(--text-muted)' }}>└</span> {child.name}</button>))}</div>);
                  })}</div></div>
              <div style={{ marginBottom: '20px' }}><label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>محدوده قیمت</label><input type="range" min={0} max={maxPrice} value={priceRange[1]} onChange={e => setPriceRange([0, Number(e.target.value)])} style={{ width: '100%', accentColor: 'var(--primary)' }} /><div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}><span>۰</span><span>{fmt(priceRange[1])}</span></div></div>
              <div><label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>حداقل امتیاز</label>
                <div style={{ display: 'flex', gap: '4px' }}>{[0, 3, 3.5, 4, 4.5].map(r => <button key={r} onClick={() => setMinRating(r)} style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: minRating === r ? 'var(--primary)' : 'var(--hover-bg)', color: minRating === r ? 'white' : 'var(--text)', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '2px' }}>{r === 0 ? 'همه' : <><Icons.Star size={10} color={minRating === r ? 'white' : '#fbbf24'} /> {r}</>}</button>)}</div></div>
            </div>
          </div>
        )}
        {/* Products */}
        <div style={{ flex: 1 }}>
          {filtered.length === 0 ? <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}><Icons.Search size={48} /><h3 style={{ marginTop: '12px' }}>محصولی یافت نشد</h3><p>فیلترها را تغییر دهید</p></div>
            : viewMode === 'grid' ? <div className="products-grid-view" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>{filtered.map(p => <ProductCard key={p.id} p={p} />)}</div>
            : <div className="products-list-view" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>{filtered.map(p => (
              <div key={p.id} className="product-card" style={{ display: 'flex', padding: '16px' }}>
                <div style={{ width: '140px', height: '140px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, position: 'relative', cursor: 'pointer' }} onClick={() => router.push(`/product/${p.id}`)}>
                  <img src={getImg(p)} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  {getDiscount(p) > 0 && <span style={{ position: 'absolute', top: '6px', left: '6px', padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: 700, background: '#ef4444', color: 'white' }}>-{getDiscount(p)}%</span>}
                </div>
                <div style={{ flex: 1, padding: '0 16px', cursor: 'pointer' }} onClick={() => router.push(`/product/${p.id}`)}>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 4px' }}>{getCat(p)}</p>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 6px' }}>{p.name}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '0 0 8px', lineHeight: 1.4 }}>{p.description?.substring(0, 80)}...</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><Icons.Star size={12} color="#fbbf24" /><span style={{ fontSize: '12px', fontWeight: 600 }}>{p.rating}</span></div><span style={{ fontSize: '17px', fontWeight: 800, color: 'var(--primary)' }}>{fmt(p.price)}</span></div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
                  <button className={`like-btn ${likedProducts[p.id] ? 'liked' : ''}`} style={{ position: 'relative' }} onClick={(e) => toggleLike(e, p.id)}><Icons.Star size={16} color={likedProducts[p.id] ? 'white' : '#ef4444'} /></button>
                  <button onClick={(e) => addToCart(e, p)} style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 600, fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.ShoppingCart size={12} /> سبد</button>
                </div>
              </div>
            ))}</div>
          }
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return <Suspense fallback={<div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>loading...</div>}><ProductsContent /></Suspense>;
}
