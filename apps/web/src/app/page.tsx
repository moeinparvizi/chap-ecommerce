'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from './components/Icons';
import { api } from './lib/api';

interface Product {
  id: string; name: string; sku: string; price: number; compareAtPrice?: number; stock: number; brand: string; description: string; rating: number; sales: number; status: string;
  images: { id: string; url: string; name: string }[];
  category?: { name: string } | null;
}

export default function Home() {
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [lang, setLang] = useState<'fa' | 'en'>('fa');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    const savedLang = localStorage.getItem('lang') as 'fa' | 'en' || 'fa';
    setTheme(savedTheme); setLang(savedLang);
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.documentElement.dir = savedLang === 'fa' ? 'rtl' : 'ltr';
    api.getProducts().then((data: any) => setProducts(data)).catch(() => {});
  }, []);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  const toggleTheme = () => { const n = theme === 'light' ? 'dark' : 'light'; setTheme(n); localStorage.setItem('theme', n); document.documentElement.setAttribute('data-theme', n); };
  const toggleLang = () => { const n = lang === 'fa' ? 'en' : 'fa'; setLang(n); localStorage.setItem('lang', n); document.documentElement.dir = n === 'fa' ? 'rtl' : 'ltr'; };
  const t = (fa: string, en: string) => lang === 'fa' ? fa : en;
  const fmt = (p: number) => p.toLocaleString('fa-IR') + ' ' + t('تومان', 'Toman');

  // Derived product lists
  const bestSellers = [...products].sort((a, b) => b.sales - a.sales).slice(0, 6);
  const featured = products.filter(p => p.status === 'ACTIVE').slice(0, 6);
  const discounted = products.filter(p => p.compareAtPrice && p.compareAtPrice > p.price).slice(0, 6);
  const getDiscount = (p: Product) => p.compareAtPrice ? Math.round((1 - p.price / p.compareAtPrice) * 100) : 0;
  const getImage = (p: Product) => p.images?.length > 0 ? p.images[0].url : 'https://picsum.photos/400/400?random=' + p.id;
  const getCat = (p: Product) => p.category?.name || '';

  const slides = [
    { title: t('فروش ویژه تا ۵۰٪ تخفیف', 'Special Sale Up to 50% Off'), subtitle: t('بهترین برندهای دنیا', 'World-class brands'), bg: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)' },
    { title: t('ارسال رایگان', 'Free Shipping'), subtitle: t('برای خریدهای بالای ۵۰۰ هزار تومان', 'On orders over $50'), bg: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #60a5fa 100%)' },
    { title: t('گارانتی بازگشت ۳۰ روزه', '30-Day Return'), subtitle: t('پولتان را پس بگیرید', 'Money back guarantee'), bg: 'linear-gradient(135deg, #0f172a 0%, #1e40af 50%, #3b82f6 100%)' },
  ];

  const categories = [
    { icon: <Icons.Package size={28} />, name: t('موبایل', 'Mobile'), color: '#3b82f6' },
    { icon: <Icons.Tag size={28} />, name: t('لپتاپ', 'Laptop'), color: '#8b5cf6' },
    { icon: <Icons.Users size={28} />, name: t('پوشاک', 'Fashion'), color: '#ec4899' },
    { icon: <Icons.Image size={28} />, name: t('لوازم خانگی', 'Home'), color: '#f59e0b' },
    { icon: <Icons.Tag size={28} />, name: t('کفش', 'Shoes'), color: '#22c55e' },
    { icon: <Icons.Settings size={28} />, name: t('گیمینگ', 'Gaming'), color: '#ef4444' },
    { icon: <Icons.Image size={28} />, name: t('زیبایی', 'Beauty'), color: '#ec4899' },
    { icon: <Icons.Package size={28} />, name: t('اسپرت', 'Sport'), color: '#06b6d4' },
  ];

  const megaMenuCategories = [
    { name: t('موبایل و تبلت', 'Mobile & Tablet'), icon: <Icons.Package size={18} />, items: [t('گوشی هوشمند', 'Smartphone'), t('تبلت', 'Tablet'), t('لوازم جانبی', 'Accessories')] },
    { name: t('لپتاپ و کامپیوتر', 'Laptop & PC'), icon: <Icons.Tag size={18} />, items: [t('لپتاپ', 'Laptop'), t('مانیتور', 'Monitor'), t('کیبورد', 'Keyboard')] },
    { name: t('پوشاک', 'Fashion'), icon: <Icons.Users size={18} />, items: [t('مردانه', 'Men'), t('زنانه', 'Women'), t('اسپرت', 'Sport')] },
    { name: t('لوازم خانگی', 'Home'), icon: <Icons.Image size={18} />, items: [t('آشپزخانه', 'Kitchen'), t('نظافت', 'Cleaning'), t('صوتی', 'Audio')] },
  ];

  const ProductCard = ({ p, badge }: { p: Product; badge?: string }) => {
    const discount = getDiscount(p);
    return (
      <div onClick={() => router.push(`/product/${p.id}`)} style={{ borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--card-bg)', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s' }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(37,99,235,0.12)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
        <div style={{ position: 'relative', height: '220px', background: `url(${getImage(p)}) center/cover` }}>
          {badge && <span style={{ position: 'absolute', top: '10px', right: '10px', padding: '3px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, background: badge.includes(t('ویژه', 'Feat')) ? '#8b5cf6' : badge.includes(t('پرفروش', 'Best')) ? '#3b82f6' : '#22c55e', color: 'white' }}>{badge}</span>}
          {discount > 0 && <span style={{ position: 'absolute', top: '10px', left: '10px', padding: '3px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, background: '#ef4444', color: 'white' }}>-{discount}%</span>}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px', background: 'linear-gradient(transparent, rgba(0,0,0,0.6))', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Icons.Star size={13} color="#fbbf24" /><span style={{ color: 'white', fontSize: '12px', fontWeight: 600 }}>{p.rating}</span>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>({p.sales})</span>
          </div>
        </div>
        <div style={{ padding: '14px' }}>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 4px' }}>{getCat(p)}</p>
          <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 10px', lineHeight: 1.4 }}>{p.name}</h3>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
            <span style={{ fontSize: '17px', fontWeight: 800, color: 'var(--primary)' }}>{fmt(p.price)}</span>
            {p.compareAtPrice && <span style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>{fmt(p.compareAtPrice)}</span>}
          </div>
          <button style={{ width: '100%', marginTop: '10px', padding: '9px', borderRadius: '10px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Icons.ShoppingCart size={14} /> {t('افزودن به سبد', 'Add to Cart')}</button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Top Bar */}
      <div style={{ background: 'var(--primary)', color: 'white', fontSize: '12px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '6px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Truck size={12} /> {t('ارسال رایگان برای خرید بالای ۵۰۰ هزار تومان', 'Free shipping over $50')}</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={toggleLang} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '12px' }}>{lang === 'fa' ? 'EN' : 'FA'}</button>
            <button onClick={toggleTheme} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>{theme === 'light' ? <Icons.Sun size={12} /> : <Icons.Moon size={12} />}</button>
            <a href="/auth/login" style={{ color: 'white', textDecoration: 'none', fontSize: '12px' }}>{t('ورود', 'Login')}</a>
          </div>
        </div>
      </div>

      {/* Navbar */}
      <nav style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100, transition: 'all 0.3s', padding: scrolled ? '8px 0' : '12px 0', boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.08)' : 'none' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ fontSize: scrolled ? '20px' : '26px', fontWeight: 800, background: 'linear-gradient(135deg, #1e40af, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer', transition: 'font-size 0.3s', flexShrink: 0 }} onClick={() => router.push('/')}>ShopHub</div>
          <div style={{ flex: 1, maxWidth: '600px', position: 'relative' }}>
            <input type="text" placeholder={t('جستجو...', 'Search...')} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '100%', padding: scrolled ? '10px 44px 10px 16px' : '12px 44px 12px 16px', borderRadius: '12px', border: '2px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none', transition: 'all 0.3s' }} />
            <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><Icons.Search size={18} /></div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', padding: '8px', borderRadius: '8px' }}><Icons.Bell size={20} /><span style={{ position: 'absolute', top: '4px', right: '4px', width: '16px', height: '16px', borderRadius: '50%', background: '#ef4444', color: 'white', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>3</span></button>
            <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', padding: '8px', borderRadius: '8px' }}><Icons.ShoppingCart size={20} /><span style={{ position: 'absolute', top: '4px', right: '4px', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--primary)', color: 'white', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>2</span></button>
            <a href="/auth/login" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', background: 'var(--primary)', color: 'white', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}><Icons.Users size={14} /> {t('ورود', 'Login')}</a>
          </div>
        </div>
        {/* Category Bar */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '8px 20px 0', display: 'flex', alignItems: 'center', gap: '4px' }}>
          <button onClick={() => setMegaMenuOpen(!megaMenuOpen)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px', border: 'none', background: megaMenuOpen ? 'var(--primary)' : 'var(--hover-bg)', color: megaMenuOpen ? 'white' : 'var(--text)', cursor: 'pointer', fontSize: '14px', fontWeight: 600, transition: 'all 0.2s' }}>
            <Icons.Menu size={16} /> {t('دسته\u200cبندی\u200cها', 'Categories')} <Icons.ChevronDown size={14} />
          </button>
          {categories.slice(0, 5).map((cat, i) => (
            <button key={i} onClick={() => router.push('/admin/products')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px', fontWeight: 500 }}>{cat.icon} {cat.name}</button>
          ))}
        </div>
        {/* Mega Menu */}
        {megaMenuOpen && (
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '20px', borderTop: '1px solid var(--border-light)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
            {megaMenuCategories.map((mc, i) => (
              <div key={i}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', paddingBottom: '8px', borderBottom: '2px solid var(--primary)' }}><span style={{ color: 'var(--primary)' }}>{mc.icon}</span><span style={{ fontWeight: 700, fontSize: '14px' }}>{mc.name}</span></div>
                {mc.items.map((item, j) => (<p key={j} onClick={() => router.push('/admin/products')} style={{ padding: '5px 0', fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer' }}>{item}</p>))}
              </div>
            ))}
          </div>
        )}
      </nav>

      {/* Hero Slider */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '20px' }}>
        <div style={{ borderRadius: '20px', overflow: 'hidden', height: '340px', background: slides[currentSlide].bg, transition: 'background 0.5s', position: 'relative' }}>
          <div style={{ padding: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', color: 'white', maxWidth: '500px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 8px', lineHeight: 1.3 }}>{slides[currentSlide].title}</h1>
            <p style={{ fontSize: '14px', margin: '0 0 20px', opacity: 0.9 }}>{slides[currentSlide].subtitle}</p>
            <button onClick={() => router.push('/admin/products')} style={{ padding: '12px 28px', borderRadius: '12px', border: 'none', background: 'white', color: '#1e40af', fontWeight: 700, fontSize: '14px', cursor: 'pointer', alignSelf: 'flex-start' }}>{t('مشاهده', 'View')}</button>
          </div>
          <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
            {slides.map((_, i) => (<button key={i} onClick={() => setCurrentSlide(i)} style={{ width: currentSlide === i ? '32px' : '10px', height: '10px', borderRadius: '5px', border: 'none', background: currentSlide === i ? 'white' : 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.3s' }} />))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {[{ icon: <Icons.Truck size={24} />, t1: t('ارسال رایگان', 'Free Ship'), t2: t('بالای ۵۰۰ هزار تومان', 'Over $50') }, { icon: <Icons.Shield size={24} />, t1: t('گارانتی بازگشت', 'Returns'), t2: t('۳۰ روز ضمانت', '30-day') }, { icon: <Icons.CreditCard size={24} />, t1: t('پرداخت امن', 'Secure'), t2: t('آنلاین', 'Online') }, { icon: <Icons.Mail size={24} />, t1: t('پشتیبانی ۲۴/۷', 'Support'), t2: t('همیشه', 'Always') }].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--card-bg)' }}><div style={{ color: 'var(--primary)' }}>{f.icon}</div><div><p style={{ margin: 0, fontSize: '13px', fontWeight: 600 }}>{f.t1}</p><p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)' }}>{f.t2}</p></div></div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px 28px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 700, margin: '0 0 14px' }}>{t('دسته\u200cبندی\u200cها', 'Categories')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {categories.map((cat, i) => (
            <div key={i} onClick={() => router.push('/admin/products')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', padding: '18px', borderRadius: '14px', border: '1px solid var(--border)', background: 'var(--card-bg)', cursor: 'pointer', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.borderColor = cat.color; }} onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: cat.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: cat.color }}>{cat.icon}</div>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><Icons.TrendingUp size={22} color="#3b82f6" /> {t('پرفروش\u200cترین محصولات', 'Best Sellers')}</h2>
            <button onClick={() => router.push('/admin/products')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>{t('مشاهده همه', 'View All')} <Icons.ExternalLink size={12} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {bestSellers.map(p => <ProductCard key={p.id} p={p} badge={t('پرفروش', 'Best Seller')} />)}
          </div>
        </div>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><Icons.Sparkles size={22} color="#8b5cf6" /> {t('محصولات ویژه', 'Featured')}</h2>
            <button onClick={() => router.push('/admin/products')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>{t('مشاهده همه', 'View All')} <Icons.ExternalLink size={12} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {featured.map(p => <ProductCard key={p.id} p={p} badge={t('ویژه', 'Featured')} />)}
          </div>
        </div>
      )}

      {/* Discounted Products */}
      {discounted.length > 0 && (
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px 28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 700, margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}><Icons.DollarSign size={22} color="#ef4444" /> {t('تخفیف\u200cها', 'Discounts')}</h2>
            <button onClick={() => router.push('/admin/products')} style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>{t('مشاهده همه', 'View All')} <Icons.ExternalLink size={12} /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {discounted.map(p => <ProductCard key={p.id} p={p} badge={`-${getDiscount(p)}%`} />)}
          </div>
        </div>
      )}

      {/* Newsletter */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px 40px' }}>
        <div style={{ borderRadius: '20px', padding: '40px', background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', color: 'white', textAlign: 'center' }}>
          <Icons.Mail size={36} />
          <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '12px 0 6px' }}>{t('عضویت در خبرنامه', 'Newsletter')}</h2>
          <p style={{ fontSize: '14px', margin: '0 0 20px', opacity: 0.9 }}>{t('از تخفیف\u200cها مطلع شوید', 'Get notified')}</p>
          <div style={{ display: 'flex', gap: '8px', maxWidth: '460px', margin: '0 auto' }}>
            <input type="email" placeholder={t('ایمیل', 'Email')} style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: 'none', fontSize: '14px', outline: 'none' }} />
            <button style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', background: 'white', color: '#1e40af', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>{t('عضویت', 'Subscribe')}</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: 'var(--card-bg)', borderTop: '1px solid var(--border)', padding: '36px 20px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '28px', marginBottom: '20px' }}>
            <div><div style={{ fontSize: '22px', fontWeight: 800, background: 'linear-gradient(135deg, #1e40af, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '8px' }}>ShopHub</div><p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{t('فروشگاه آنلاین با بهترین برندها.', 'Online store with best brands.')}</p></div>
            <div><h4 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 8px' }}>{t('لینک\u200cها', 'Links')}</h4><p onClick={() => router.push('/about')} style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 6px', cursor: 'pointer' }}>{t('درباره ما', 'About')}</p><p onClick={() => router.push('/contact')} style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 6px', cursor: 'pointer' }}>{t('تماس با ما', 'Contact')}</p><p onClick={() => router.push('/admin/products')} style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 6px', cursor: 'pointer' }}>{t('محصولات', 'Products')}</p></div>
            <div><h4 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 8px' }}>{t('خدمات', 'Services')}</h4><p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 6px' }}>{t('پیگیری سفارش', 'Track')}</p><p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 6px' }}>{t('گارانتی', 'Return')}</p></div>
            <div><h4 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 8px' }}>{t('تماس', 'Contact')}</h4><p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '6px' }}><Icons.Mail size={13} /> info@shophub.com</p></div>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>{t('\u00A9 ۱۴۰۳ ShopHub', '\u00A9 2024 ShopHub')}</div>
        </div>
      </footer>
    </div>
  );
}
