'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '../components/Icons';
import { api } from '../lib/api';

interface Product {
  id: string; name: string; price: number; compareAtPrice?: number; stock: number; brand: string; description: string; rating: number; sales: number; status: string;
  images: { id: string; url: string }[];
  category?: { name: string } | null;
}

export default function Home() {
  const router = useRouter();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => { api.getProducts().then((d: any) => setProducts(d)).catch(() => {}); }, []);

  const t = (fa: string, en: string) => fa;
  const fmt = (p: number) => p.toLocaleString('fa-IR') + ' تومان';
  const bestSellers = [...products].sort((a, b) => b.sales - a.sales).slice(0, 6);
  const featured = products.filter(p => p.status === 'ACTIVE').slice(0, 6);
  const discounted = products.filter(p => p.compareAtPrice && p.compareAtPrice > p.price).slice(0, 6);
  const getDiscount = (p: Product) => p.compareAtPrice ? Math.round((1 - p.price / p.compareAtPrice) * 100) : 0;
  const getImg = (p: Product) => p.images?.length > 0 ? p.images[0].url : 'https://picsum.photos/400/400?random=' + p.id;
  const getCat = (p: Product) => p.category?.name || '';

  const slides = [
    { title: 'فروش ویژه تا ۵۰٪ تخفیف', sub: 'بهترین برندهای دنیا با قیمت‌های استثنایی', bg: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)' },
    { title: 'ارسال رایگان', sub: 'برای خریدهای بالای ۵۰۰ هزار تومان', bg: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #60a5fa 100%)' },
    { title: 'گارانتی بازگشت ۳۰ روزه', sub: 'اگر راضی نبودید، پولتان را پس بگیرید', bg: 'linear-gradient(135deg, #0f172a 0%, #1e40af 50%, #3b82f6 100%)' },
  ];

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

  const toggleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setLikedProducts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const PC = ({ p, badge }: { p: Product; badge?: string }) => {
    const d = getDiscount(p);
    const isLiked = likedProducts[p.id] || false;
    return (
      <div className="product-card" onClick={() => router.push(`/product/${p.id}`)}>
        {/* Image */}
        <div className="card-image" style={{ height: '240px', position: 'relative' }}>
          <img src={getImg(p)} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          {/* Like Button */}
          <button className={`like-btn ${isLiked ? 'liked animate-like' : ''}`} onClick={(e) => toggleLike(e, p.id)}>
            <Icons.Star size={18} color={isLiked ? 'white' : '#ef4444'} />
          </button>
          {/* Badge */}
          {badge && <span style={{ position: 'absolute', top: '12px', right: '50px', padding: '4px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, background: badge.includes('پرفروش') ? '#3b82f6' : badge.includes('ویژه') ? '#8b5cf6' : '#22c55e', color: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.2)' }}>{badge}</span>}
          {/* Discount */}
          {d > 0 && <span style={{ position: 'absolute', top: '12px', left: '12px', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, background: 'linear-gradient(135deg, #ef4444, #dc2626)', color: 'white', boxShadow: '0 2px 8px rgba(239,68,68,0.3)' }}>-{d}%</span>}
          {/* Rating overlay */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ display: 'flex', gap: '1px' }}>{[1,2,3,4,5].map(s => <Icons.Star key={s} size={12} color={s <= Math.round(p.rating) ? '#fbbf24' : 'rgba(255,255,255,0.3)'} />)}</div>
            <span style={{ color: 'white', fontSize: '12px', fontWeight: 600 }}>{p.rating}</span>
            <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px' }}>({p.sales.toLocaleString()})</span>
          </div>
        </div>
        {/* Body */}
        <div className="card-body">
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 4px', fontWeight: 500 }}>{getCat(p)}</p>
          <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 8px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.name}</h3>
          {/* Price */}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '12px' }}>
            <span className="card-price" style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>{fmt(p.price)}</span>
            {p.compareAtPrice && <span style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>{fmt(p.compareAtPrice)}</span>}
          </div>
          {/* Add to Cart */}
          <button style={{ width: '100%', padding: '10px', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg, #1e40af, #3b82f6)', color: 'white', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', boxShadow: '0 4px 12px rgba(37,99,235,0.3)', transition: 'all 0.2s' }} onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 20px rgba(37,99,235,0.4)'} onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 12px rgba(37,99,235,0.3)'}>
            <Icons.ShoppingCart size={14} /> افزودن به سبد
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Hero */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '20px' }}>
        <div style={{ borderRadius: '20px', overflow: 'hidden', height: '340px', background: slides[currentSlide].bg, transition: 'background 0.5s', position: 'relative' }}>
          <div style={{ padding: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', color: 'white', maxWidth: '500px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 8px', lineHeight: 1.3 }}>{slides[currentSlide].title}</h1>
            <p style={{ fontSize: '14px', margin: '0 0 20px', opacity: 0.9 }}>{slides[currentSlide].sub}</p>
            <button onClick={() => router.push('/admin/products')} style={{ padding: '12px 28px', borderRadius: '12px', border: 'none', background: 'white', color: '#1e40af', fontWeight: 700, fontSize: '14px', cursor: 'pointer', alignSelf: 'flex-start' }}>مشاهده</button>
          </div>
          <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
            {slides.map((_, i) => <button key={i} onClick={() => setCurrentSlide(i)} style={{ width: currentSlide === i ? '32px' : '10px', height: '10px', borderRadius: '5px', border: 'none', background: currentSlide === i ? 'white' : 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.3s' }} />)}
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {[{ icon: <Icons.Truck size={24} />, t1: 'ارسال رایگان', t2: 'بالای ۵۰۰ هزار تومان' }, { icon: <Icons.Shield size={24} />, t1: 'گارانتی بازگشت', t2: '۳۰ روز ضمانت' }, { icon: <Icons.CreditCard size={24} />, t1: 'پرداخت امن', t2: 'آنلاین' }, { icon: <Icons.Mail size={24} />, t1: 'پشتیبانی ۲۴/۷', t2: 'همیشه' }].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--card-bg)' }}><div style={{ color: 'var(--primary)' }}>{f.icon}</div><div><p style={{ margin: 0, fontSize: '13px', fontWeight: 600 }}>{f.t1}</p><p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)' }}>{f.t2}</p></div></div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px 28px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 14px' }}>دسته‌بندی‌ها</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {cats.map((c, i) => <div key={i} onClick={() => router.push('/admin/products')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '18px', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--card-bg)', cursor: 'pointer', transition: 'all 0.3s' }} onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = c.color; }} onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}><div style={{ width: '52px', height: '52px', borderRadius: '14px', background: c.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color }}>{c.icon}</div><span style={{ fontSize: '13px', fontWeight: 600 }}>{c.name}</span></div>)}
        </div>
      </div>

      {/* Best Sellers */}
      {bestSellers.length > 0 && <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px 28px' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}><h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><Icons.TrendingUp size={22} color="#3b82f6" /> پرفروش‌ترین محصولات</h2></div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>{bestSellers.map(p => <PC key={p.id} p={p} badge="پرفروش" />)}</div></div>}

      {/* Featured */}
      {featured.length > 0 && <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px 28px' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}><h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><Icons.Sparkles size={22} color="#8b5cf6" /> محصولات ویژه</h2></div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>{featured.map(p => <PC key={p.id} p={p} badge="ویژه" />)}</div></div>}

      {/* Discounted */}
      {discounted.length > 0 && <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px 28px' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}><h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><Icons.DollarSign size={22} color="#ef4444" /> تخفیف‌ها</h2></div><div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>{discounted.map(p => <PC key={p.id} p={p} badge={`-${getDiscount(p)}%`} />)}</div></div>}

      {/* Newsletter */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px 40px' }}>
        <div style={{ borderRadius: '20px', padding: '40px', background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', color: 'white', textAlign: 'center' }}>
          <Icons.Mail size={36} />
          <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '12px 0 6px' }}>عضویت در خبرنامه</h2>
          <p style={{ fontSize: '14px', margin: '0 0 20px', opacity: 0.9 }}>از تخفیف‌ها مطلع شوید</p>
          <div style={{ display: 'flex', gap: '8px', maxWidth: '460px', margin: '0 auto' }}>
            <input type="email" placeholder="ایمیل خود را وارد کنید" style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: 'none', fontSize: '14px', outline: 'none' }} />
            <button style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', background: 'white', color: '#1e40af', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>عضویت</button>
          </div>
        </div>
      </div>
    </div>
  );
}
