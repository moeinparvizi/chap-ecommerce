'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Icons } from '@/app/components/Icons';
import { api } from '@/app/lib/api';

interface Product { id: string; name: string; price: number; compareAtPrice?: number; stock: number; brand: string; description: string; rating: number; sales: number; status: string; images: { id: string; url: string }[]; category?: { name: string } | null; }

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'all');
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000000]);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [minRating, setMinRating] = useState(0);
  const [likedProducts, setLikedProducts] = useState<Record<string, boolean>>({});

  useEffect(() => { api.getProducts().then((d: any) => setProducts(d)).catch(() => {}); const user = JSON.parse(localStorage.getItem('user') || '{}'); if (user.id) { api.getWishlist(user.id).then((w: any) => { const map: Record<string, boolean> = {}; w.forEach((item: any) => { map[item.productId] = true; }); setLikedProducts(map); }).catch(() => {}); } }, []);
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

  const fmt = (p: number) => (p * 10).toLocaleString('fa-IR') + ' ریال';
  const getDiscount = (p: Product) => p.compareAtPrice ? Math.round((1 - p.price / p.compareAtPrice) * 100) : 0;
  const getImg = (p: Product) => p.images?.length > 0 ? p.images[0].url : `https://placehold.co/800x800/f0f2f5/94a3b8?text=${encodeURIComponent(p.name)}`;
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

  const addToCart = async (e: React.MouseEvent, p: Product) => {
    e.stopPropagation();
    if (p.stock <= 0) return;
    const saved = localStorage.getItem('cart');
    const cart: any[] = saved ? JSON.parse(saved) : [];
    const existing = cart.find((c: any) => c.id === p.id);
    if (existing) {
      if (existing.quantity >= p.stock) return;
      existing.quantity += 1;
    } else {
      cart.push({ id: p.id, name: p.name, price: p.price, image: getImg(p), quantity: 1, stock: p.stock });
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cart-added', { detail: { name: p.name } }));
    window.dispatchEvent(new Event('cart-updated'));
  };

  const toggleLike = async (e: React.MouseEvent, p: Product) => {
    e.stopPropagation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) { router.push('/auth/login'); return; }
    setLikedProducts(prev => ({ ...prev, [p.id]: !prev[p.id] }));
    try { await api.toggleWishlist({ userId: user.id, productId: p.id, productName: p.name, productPrice: p.price, productImage: getImg(p) }); } catch (err) {}
  };

  const ProductCard = ({ p }: { p: Product }) => {
    const d = getDiscount(p);
    const isLiked = likedProducts[p.id] || false;
    return (
      <div className="product-card">
        <div className="card-image" style={{ height: '220px', position: 'relative' }} onClick={() => router.push(`/product/${p.id}`)}>
          <img src={getImg(p)} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          {d > 0 && <span style={{ position: 'absolute', top: '12px', left: '12px', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white', boxShadow: '0 2px 8px rgba(239,68,68,0.3)' }}>-{d}%</span>}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ display: 'flex', gap: '1px' }}>{[1,2,3,4,5].map(s => <Icons.Star key={s} size={12} color={s <= Math.round(p.rating) ? '#fbbf24' : 'rgba(255,255,255,0.3)'} />)}</div>
            <span style={{ color: 'white', fontSize: '12px', fontWeight: 600 }}>{p.rating}</span>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px' }}>{p.sales.toLocaleString()} فروش</span>
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
        <div style={{ padding: '0 16px 16px', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <button onClick={(e) => { e.stopPropagation(); toggleLike(e, p); }} style={{ width: '36px', height: '36px', borderRadius: '10px', border: 'none', background: isLiked ? 'rgba(239,68,68,0.1)' : 'var(--hover-bg)', color: isLiked ? '#ef4444' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.3s', flexShrink: 0 }}><Icons.Heart size={16} color={isLiked ? '#ef4444' : 'currentColor'} /></button>
          <button onClick={(e) => { e.stopPropagation(); addToCart(e, p); }} style={{ flex: 1, padding: '8px', borderRadius: '10px', border: 'none', background: 'var(--hover-bg)', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s', fontSize: '13px', fontWeight: 600 }}><Icons.ShoppingCart size={14} /></button>
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
          <button onClick={() => setShowFilters(true)} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--hover-bg)', color: 'var(--text)', cursor: 'pointer', fontSize: '13px' }}><Icons.Filter size={14} /> فیلتر</button>
          <button onClick={() => setViewMode('grid')} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: viewMode === 'grid' ? 'var(--primary)' : 'var(--hover-bg)', color: viewMode === 'grid' ? 'white' : 'var(--text)', cursor: 'pointer' }}><Icons.Grid size={16} /></button>
          <button onClick={() => setViewMode('list')} style={{ padding: '8px', borderRadius: '8px', border: '1px solid var(--border)', background: viewMode === 'list' ? 'var(--primary)' : 'var(--hover-bg)', color: viewMode === 'list' ? 'white' : 'var(--text)', cursor: 'pointer' }}><Icons.List size={16} /></button>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', color: 'var(--text)', fontSize: '13px' }}><option value="newest">جدیدترین</option><option value="cheapest">ارزان‌ترین</option><option value="expensive">گران‌ترین</option><option value="popular">محبوب‌ترین</option><option value="rating">بالاترین امتیاز</option></select>
        </div>
      </div>

      {/* Products Grid */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '16px 20px' }}>
        {filtered.length === 0 ? <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}><Icons.Search size={48} /><h3 style={{ marginTop: '12px' }}>محصولی یافت نشد</h3><p>فیلترها را تغییر دهید</p></div>
          : viewMode === 'grid' ? <div className="products-grid-view" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>{filtered.map(p => <ProductCard key={p.id} p={p} />)}</div>
          : <div className="products-list-view" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>{filtered.map(p => (
            <div key={p.id} className="product-card" style={{ display: 'flex', padding: '16px' }}>
              <div style={{ width: '140px', height: '140px', borderRadius: '12px', overflow: 'hidden', flexShrink: 0, cursor: 'pointer' }} onClick={() => router.push(`/product/${p.id}`)}>
                <img src={getImg(p)} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1, padding: '0 16px', cursor: 'pointer' }} onClick={() => router.push(`/product/${p.id}`)}>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 4px' }}>{getCat(p)}</p>
                <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 6px' }}>{p.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}><Icons.Star size={12} color="#fbbf24" /><span style={{ fontSize: '12px', fontWeight: 600 }}>{p.rating}</span></div><span style={{ fontSize: '17px', fontWeight: 800, color: 'var(--primary)' }}>{fmt(p.price)}</span></div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', justifyContent: 'center', alignItems: 'center' }}>
                <button onClick={(e) => { e.stopPropagation(); toggleLike(e, p); }} style={{ padding: '6px', borderRadius: '8px', border: 'none', background: likedProducts[p.id] ? 'rgba(239,68,68,0.1)' : 'var(--hover-bg)', color: likedProducts[p.id] ? '#ef4444' : 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icons.Heart size={14} color={likedProducts[p.id] ? '#ef4444' : 'currentColor'} /></button>
                <button onClick={(e) => addToCart(e, p)} style={{ padding: '6px 10px', borderRadius: '8px', border: 'none', background: 'var(--hover-bg)', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Icons.ShoppingCart size={14} /></button>
              </div>
            </div>
          ))}</div>
        }
      </div>

      {/* Filter Drawer */}
      {showFilters && (
        <div className="filter-drawer-overlay" onClick={() => setShowFilters(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 300, animation: 'fadeIn 0.2s' }}>
          <div onClick={e => e.stopPropagation()} className="filter-drawer" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: '340px', maxWidth: '90vw', background: 'var(--card-bg)', boxShadow: '-4px 0 24px rgba(0,0,0,0.15)', overflowY: 'auto', animation: 'slideInRight 0.3s ease-out' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 20px 16px', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--card-bg)', zIndex: 1 }}>
              <h3 style={{ margin: 0, fontSize: '17px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}><Icons.Filter size={18} /> فیلترها</h3>
              <button onClick={() => setShowFilters(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px' }}><Icons.X size={22} /></button>
            </div>

            {/* Content */}
            <div style={{ padding: '16px 20px' }}>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '16px' }}>
                <button onClick={() => { setSelectedCategory('all'); setMinRating(0); setPriceRange([0, maxPrice]); setSearchQuery(''); }} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>پاک کردن همه</button>
              </div>

              {/* Search */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}><Icons.Search size={14} /> جستجو</label>
                <input type="text" placeholder="نام محصول..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '13px', color: 'var(--text)', outline: 'none' }} />
              </div>

              {/* Category */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}><Icons.Folder size={14} /> دسته‌بندی</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', maxHeight: '200px', overflowY: 'auto' }}>
                  <button onClick={() => setSelectedCategory('all')} style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', background: selectedCategory === 'all' ? 'var(--primary)' : 'transparent', color: selectedCategory === 'all' ? 'white' : 'var(--text)', cursor: 'pointer', fontSize: '13px', textAlign: 'right', width: '100%', fontWeight: selectedCategory === 'all' ? 600 : 400 }}>همه محصولات</button>
                  {allApiCategories.filter((c: any) => !c.parentId).map((parent: any) => {
                    const children = allApiCategories.filter((c: any) => c.parentId === parent.id);
                    return (<div key={parent.id}><button onClick={() => setSelectedCategory(parent.name)} style={{ padding: '8px 12px', borderRadius: '8px', border: 'none', background: selectedCategory === parent.name ? 'var(--primary)' : 'transparent', color: selectedCategory === parent.name ? 'white' : 'var(--text)', cursor: 'pointer', fontSize: '13px', textAlign: 'right', width: '100%', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>{parent.name}{children.length > 0 && <span style={{ fontSize: '10px', opacity: 0.7 }}>{children.length}</span>}</button>
                      {children.map((child: any) => (<button key={child.id} onClick={() => setSelectedCategory(child.name)} style={{ padding: '6px 12px 6px 28px', borderRadius: '6px', border: 'none', background: selectedCategory === child.name ? 'var(--primary)' : 'transparent', color: selectedCategory === child.name ? 'white' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '12px', textAlign: 'right', width: '100%', fontWeight: selectedCategory === child.name ? 600 : 400 }}><span style={{ marginLeft: '4px', fontSize: '10px' }}>└</span> {child.name}</button>))}</div>);
                  })}
                </div>
              </div>

              {/* Price */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}><Icons.DollarSign size={14} /> محدوده قیمت</label>
                <input type="range" min={0} max={maxPrice} value={priceRange[1]} onChange={e => setPriceRange([0, Number(e.target.value)])} style={{ width: '100%', accentColor: 'var(--primary)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--text-secondary)' }}><span>۰</span><span>{fmt(priceRange[1])}</span></div>
              </div>

              {/* Rating */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}><Icons.Star size={14} /> امتیاز</label>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>{[0, 3, 3.5, 4, 4.5].map(r => <button key={r} onClick={() => setMinRating(r)} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: minRating === r ? 'var(--primary)' : 'var(--hover-bg)', color: minRating === r ? 'white' : 'var(--text)', cursor: 'pointer', fontSize: '13px' }}>{r === 0 ? 'همه' : <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Star size={12} color={minRating === r ? 'white' : '#fbbf24'} /> {r}</span>}</button>)}</div>
              </div>

              {/* Active Filters */}
              {(selectedCategory !== 'all' || minRating > 0 || searchQuery) && (
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '8px' }}>فیلترهای فعال:</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {selectedCategory !== 'all' && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '6px', background: 'rgba(37,99,235,0.1)', color: 'var(--primary)', fontSize: '12px' }}>{selectedCategory} <button onClick={() => setSelectedCategory('all')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', padding: 0, fontSize: '14px' }}>×</button></span>}
                    {minRating > 0 && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '6px', background: 'rgba(37,99,235,0.1)', color: 'var(--primary)', fontSize: '12px' }}>{minRating}⭐ <button onClick={() => setMinRating(0)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', padding: 0, fontSize: '14px' }}>×</button></span>}
                    {searchQuery && <span style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 10px', borderRadius: '6px', background: 'rgba(37,99,235,0.1)', color: 'var(--primary)', fontSize: '12px' }}>{searchQuery} <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', padding: 0, fontSize: '14px' }}>×</button></span>}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', position: 'sticky', bottom: 0, background: 'var(--card-bg)' }}>
              <button onClick={() => setShowFilters(false)} style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', background: 'var(--primary)', color: 'white', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>نمایش {filtered.length} محصول</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return <Suspense fallback={<div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>loading...</div>}><ProductsContent /></Suspense>;
}
