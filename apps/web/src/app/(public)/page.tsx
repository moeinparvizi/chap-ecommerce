'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '../components/Icons';
import { CardLoader } from '../components/Loading';
import { getSiteSettings, initSiteSettings } from '../lib/site-settings';
import { api } from '../lib/api';

interface Product { id: string; name: string; price: number; compareAtPrice?: number; stock: number; brand: string; description: string; rating: number; sales: number; status: string; images: { id: string; url: string }[]; category?: { name: string } | null; }

export default function Home() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [siteBanners, setSiteBanners] = useState<any[]>([]);

  useEffect(() => {
    initSiteSettings();
    const settings = getSiteSettings();
    setSiteBanners(settings.banners.filter(b => b.active).sort((a: any, b: any) => a.order - b.order));
    api.getProducts().then((d: any) => { setProducts(d); setLoading(false); }).catch(() => setLoading(false));
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user.id) { api.getWishlist(user.id).then((w: any) => { const map: Record<string, boolean> = {}; w.forEach((item: any) => { map[item.productId] = true; }); setLikedProducts(map); }).catch(() => {}); }
  }, []);

  // Auto-slide banners
  useEffect(() => {
    if (siteBanners.length <= 1) return;
    const timer = setInterval(() => setCurrentSlide(p => (p + 1) % siteBanners.length), 5000);
    return () => clearInterval(timer);
  }, [siteBanners.length]);

  const fmt = (p: number) => (p * 10).toLocaleString('fa-IR') + ' ریال';
  const getDiscount = (p: Product) => p.compareAtPrice ? Math.round((1 - p.price / p.compareAtPrice) * 100) : 0;
  const getImg = (p: Product) => p.images?.length > 0 ? p.images[0].url : `https://placehold.co/800x800/f0f2f5/94a3b8?text=${encodeURIComponent(p.name)}`;
  const getCat = (p: Product) => p.category?.name || '';

  const bestSellers = [...products].sort((a, b) => b.sales - a.sales).slice(0, 6);
  const featured = products.filter(p => p.status === 'ACTIVE').slice(0, 6);
  const discounted = products.filter(p => p.compareAtPrice && p.compareAtPrice > p.price).slice(0, 6);

  const cats = [
    { icon: <Icons.Package size={28} />, name: 'موبایل', color: '#3b82f6' },
    { icon: <Icons.Tag size={28} />, name: 'لپتاپ', color: '#8b5cf6' },
    { icon: <Icons.Users size={28} />, name: 'پوشاک', color: '#ec4899' },
    { icon: <Icons.Image size={28} />, name: 'لوازم خانگی', color: '#f59e0b' },
    { icon: <Icons.Tag size={28} />, name: 'کفش', color: '#22c55e' },
    { icon: <Icons.Settings size={28} />, name: 'گیمینگ', color: '#ef4444' },
    { icon: <Icons.Image size={28} />, name: 'زیبایی', color: '#ec4899' },
    { icon: <Icons.Package size={28} />, name: 'اسپرت', color: '#06b6d4' },
  ];

  const [likedProducts, setLikedProducts] = useState<Record<string, boolean>>({});

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

  const toggleLike = async (e: React.MouseEvent, p: Product) => {
    e.stopPropagation();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) { router.push('/auth/login'); return; }
    setLikedProducts(prev => ({ ...prev, [p.id]: !prev[p.id] }));
    try { await api.toggleWishlist({ userId: user.id, productId: p.id, productName: p.name, productPrice: p.price, productImage: getImg(p) }); } catch (e) {}
  };

  const PC = ({ p, badge }: { p: Product; badge?: string }) => {
    const d = getDiscount(p);
    const isLiked = likedProducts[p.id] || false;
    return (
      <div className="product-card">
        <div className="card-image" style={{ height: '240px', position: 'relative' }} onClick={() => router.push(`/product/${p.id}`)}>
          <img src={getImg(p)} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          {badge && <span style={{ position: 'absolute', top: '12px', right: '12px', padding: '4px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, background: badge.includes('پرفروش') ? '#3b82f6' : badge.includes('ویژه') ? '#8b5cf6' : '#22c55e', color: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>{badge}</span>}
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
          <button onClick={(e) => { e.stopPropagation(); addToCart(e, p); }} style={{ flex: 1, padding: '8px', borderRadius: '10px', border: 'none', background: 'var(--hover-bg)', color: 'var(--primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.2s', fontSize: '13px', fontWeight: 600 }} onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = 'white'; }} onMouseLeave={e => { e.currentTarget.style.background = 'var(--hover-bg)'; e.currentTarget.style.color = 'var(--primary)'; }}><Icons.ShoppingCart size={14} /></button>
        </div>
      </div>
    );
  };

  const ProductSection = ({ title, icon, iconColor, items, badge }: { title: string; icon: any; iconColor: string; items: Product[]; badge?: string }) => (
    items.length > 0 && (
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h2 className="section-title" style={{ fontSize: '20px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>{icon} {title}</h2>
        </div>
        <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {items.map(p => <PC key={p.id} p={p} badge={badge} />)}
        </div>
      </div>
    )
  );

  return (
    <div>
      {/* Hero */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '20px' }}>
        {siteBanners.length > 0 ? (
          <div className="hero-banner" style={{ borderRadius: '20px', overflow: 'hidden', height: '340px', position: 'relative', cursor: 'pointer' }} onClick={() => siteBanners[currentSlide]?.link && router.push(siteBanners[currentSlide].link)}>
            <img src={siteBanners[currentSlide]?.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div className="hero-content" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.7), transparent)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '50px', color: 'white' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 8px', lineHeight: 1.3 }}>{siteBanners[currentSlide]?.title}</h1>
              <p style={{ fontSize: '14px', margin: '0 0 20px', opacity: 0.9 }}>{siteBanners[currentSlide]?.subtitle}</p>
              <button style={{ padding: '12px 28px', borderRadius: '12px', border: 'none', background: 'white', color: '#1e40af', fontWeight: 700, fontSize: '14px', cursor: 'pointer', alignSelf: 'flex-start' }}>مشاهده</button>
            </div>
            <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
              {siteBanners.map((_: any, i: number) => <button key={i} onClick={(e) => { e.stopPropagation(); setCurrentSlide(i); }} style={{ width: currentSlide === i ? '32px' : '10px', height: '10px', borderRadius: '5px', border: 'none', background: currentSlide === i ? 'white' : 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.3s' }} />)}
            </div>
            {/* Next/Prev arrows */}
            {siteBanners.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); setCurrentSlide(p => (p - 1 + siteBanners.length) % siteBanners.length); }} className="banner-arrow banner-arrow-left" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', right: '16px', width: '44px', height: '44px', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', color: '#1e40af', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', transition: 'all 0.3s', fontSize: '18px' }}><Icons.ChevronDown size={22} /></button>
                <button onClick={(e) => { e.stopPropagation(); setCurrentSlide(p => (p + 1) % siteBanners.length); }} className="banner-arrow banner-arrow-right" style={{ position: 'absolute', top: '50%', transform: 'translateY(-50%)', left: '16px', width: '44px', height: '44px', borderRadius: '50%', border: 'none', background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(8px)', color: '#1e40af', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 16px rgba(0,0,0,0.2)', transition: 'all 0.3s', fontSize: '18px' }}><Icons.ChevronDown size={22} /></button>
              </>
            )}
          </div>
        ) : (
          <div className="hero-banner" style={{ borderRadius: '20px', overflow: 'hidden', height: '340px', background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)', position: 'relative' }}>
            <div className="hero-content" style={{ padding: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', color: 'white', maxWidth: '500px' }}>
              <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 8px', lineHeight: 1.3 }}>به ShopHub خوش آمدید</h1>
              <p style={{ fontSize: '14px', margin: '0 0 20px', opacity: 0.9 }}>محصولات متنوع با بهترین قیمتها</p>
            </div>
          </div>
        )}
      </div>

      {/* Features */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px 28px' }}>
        <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {[{ icon: <Icons.Truck size={24} />, t1: 'ارسال رایگان', t2: 'بالای ۵۰۰ هزار تومان' }, { icon: <Icons.Shield size={24} />, t1: 'گارانتی بازگشت', t2: '۳۰ روز ضمانت' }, { icon: <Icons.CreditCard size={24} />, t1: 'پرداخت امن', t2: 'آنلاین' }, { icon: <Icons.Mail size={24} />, t1: 'پشتیبانی ۲۴/۷', t2: 'همیشه' }].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--card-bg)' }}><div style={{ color: 'var(--primary)' }}>{f.icon}</div><div><p style={{ margin: 0, fontSize: '13px', fontWeight: 600 }}>{f.t1}</p><p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)' }}>{f.t2}</p></div></div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px 28px' }}>
        <h2 className="section-title" style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 14px' }}>دستهبندیها</h2>
        <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {cats.map((c, i) => <div key={i} onClick={() => router.push('/products')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '18px', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--card-bg)', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = c.color; }} onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}><div style={{ width: '52px', height: '52px', borderRadius: '14px', background: c.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color }}>{c.icon}</div><span style={{ fontSize: '13px', fontWeight: 600 }}>{c.name}</span></div>)}
        </div>
      </div>

      {/* Best Sellers */}
      {loading ? <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px 28px' }}><CardLoader count={6} /></div> : <ProductSection title="پرفروشترین محصولات" icon={<Icons.TrendingUp size={22} color="#3b82f6" />} iconColor="#3b82f6" items={bestSellers} badge="پرفروش" />}

      {/* Featured */}
      <ProductSection title="محصولات ویژه" icon={<Icons.Sparkles size={22} color="#8b5cf6" />} iconColor="#8b5cf6" items={featured} badge="ویژه" />

      {/* Discounted */}
      <ProductSection title="تخفیفها" icon={<Icons.DollarSign size={22} color="#ef4444" />} iconColor="#ef4444" items={discounted} />

      {/* Newsletter */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px 40px' }}>
        <div className="newsletter" style={{ borderRadius: '20px', padding: '40px', background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', color: 'white', textAlign: 'center' }}>
          <Icons.Mail size={36} />
          <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '12px 0 6px' }}>عضویت در خبرنامه</h2>
          <p style={{ fontSize: '14px', margin: '0 0 20px', opacity: 0.9 }}>از تخفیفها مطلع شوید</p>
          <div style={{ display: 'flex', gap: '8px', maxWidth: '460px', margin: '0 auto' }}>
            <input type="email" placeholder="ایمیل خود را وارد کنید" style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: 'none', fontSize: '14px', outline: 'none' }} />
            <button style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', background: 'white', color: '#1e40af', fontWeight: 700, fontSize: '14px', cursor: 'pointer', whiteSpace: 'nowrap' }}>عضویت</button>
          </div>
        </div>
      </div>
    </div>
  );
}
