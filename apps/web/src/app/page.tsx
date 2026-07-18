'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from './components/Icons';

export default function Home() {
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [lang, setLang] = useState<'fa' | 'en'>('fa');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    const savedLang = localStorage.getItem('lang') as 'fa' | 'en' || 'fa';
    setTheme(savedTheme);
    setLang(savedLang);
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.documentElement.dir = savedLang === 'fa' ? 'rtl' : 'ltr';
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const toggleLang = () => {
    const newLang = lang === 'fa' ? 'en' : 'fa';
    setLang(newLang);
    localStorage.setItem('lang', newLang);
    document.documentElement.dir = newLang === 'fa' ? 'rtl' : 'ltr';
  };

  const t = (fa: string, en: string) => lang === 'fa' ? fa : en;
  const formatPrice = (p: number) => p.toLocaleString('fa-IR') + ' ' + t('تومان', 'Toman');

  const megaMenuCategories = [
    { name: t('موبایل و تبلت', 'Mobile & Tablet'), icon: <Icons.Package size={20} />, items: [t('گوشی هوشمند', 'Smartphone'), t('تبلت', 'Tablet'), t('لوازم جانبی', 'Accessories'), t('شارژر', 'Charger')] },
    { name: t('لپتاپ و کامپیوتر', 'Laptop & PC'), icon: <Icons.Tag size={20} />, items: [t('لپتاپ', 'Laptop'), t('کیس', 'Desktop'), t('مانیتور', 'Monitor'), t('کیبورد', 'Keyboard')] },
    { name: t('پوشاک', 'Fashion'), icon: <Icons.Users size={20} />, items: [t('مردانه', 'Men'), t('زنانه', 'Women'), t('بچه\u200cگانه', 'Kids'), t('اسپرت', 'Sport')] },
    { name: t('لوازم خانگی', 'Home & Kitchen'), icon: <Icons.Image size={20} />, items: [t('آشپزخانه', 'Kitchen'), t('شستشو', 'Laundry'), t('نظافت', 'Cleaning'), t('سیستم صوتی', 'Audio')] },
  ];

  const slides = [
    { title: t('فروش ویژه تا ۵۰٪ تخفیف', 'Special Sale Up to 50% Off'), subtitle: t('بهترین برندهای دنیا با قیمت\u200cهای استثنایی', 'World-class brands at exceptional prices'), bg: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)' },
    { title: t('ارسال رایگان', 'Free Shipping'), subtitle: t('برای خریدهای بالای ۵۰۰ هزار تومان', 'On orders over $50'), bg: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #60a5fa 100%)' },
    { title: t('گارانتی بازگشت ۳۰ روزه', '30-Day Return Guarantee'), subtitle: t('اگر راضی نبودید، پولتان را پس بگیرید', "Money back guarantee"), bg: 'linear-gradient(135deg, #0f172a 0%, #1e40af 50%, #3b82f6 100%)' },
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

  const products = [
    { id: 1, name: t('آیفون ۱۵ پرو مکس', 'iPhone 15 Pro Max'), price: 59990000, oldPrice: 64990000, discount: 8, rating: 4.8, reviews: 1234, image: 'https://picsum.photos/400/400?random=1', badge: t('پرفروش', 'Best Seller'), category: t('موبایل', 'Mobile') },
    { id: 2, name: t('مک\u200cبوک پرو M3', 'MacBook Pro M3'), price: 89990000, oldPrice: 94990000, discount: 5, rating: 4.9, reviews: 567, image: 'https://picsum.photos/400/400?random=2', badge: t('جدید', 'New'), category: t('لپتاپ', 'Laptop') },
    { id: 3, name: t('سامسونگ گلکسی S24', 'Samsung Galaxy S24'), price: 39990000, oldPrice: 44990000, discount: 11, rating: 4.6, reviews: 892, image: 'https://picsum.photos/400/400?random=3', badge: '', category: t('موبایل', 'Mobile') },
    { id: 4, name: t('نایک ایرمکس ۹۰', 'Nike Air Max 90'), price: 3290000, oldPrice: 3990000, discount: 18, rating: 4.5, reviews: 2345, image: 'https://picsum.photos/400/400?random=4', badge: t('تخفیف ویژه', 'Special'), category: t('کفش', 'Shoes') },
    { id: 5, name: t('سونی WH-1000XM5', 'Sony WH-1000XM5'), price: 8990000, oldPrice: 9990000, discount: 10, rating: 4.7, reviews: 678, image: 'https://picsum.photos/400/400?random=5', badge: '', category: t('هدست', 'Headphone') },
    { id: 6, name: t('آیپد ایر M2', 'iPad Air M2'), price: 29990000, oldPrice: 32990000, discount: 9, rating: 4.8, reviews: 445, image: 'https://picsum.photos/400/400?random=6', badge: t('جدید', 'New'), category: t('تبلت', 'Tablet') },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Top Bar */}
      <div style={{ background: 'var(--primary)', color: 'white', fontSize: '12px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '6px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Truck size={12} /> {t('ارسال رایگان برای خرید بالای ۵۰۰ هزار تومان', 'Free shipping on orders over $50')}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button onClick={toggleLang} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: '12px' }}>{lang === 'fa' ? 'EN' : 'FA'}</button>
            <button onClick={toggleTheme} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px' }}>{theme === 'light' ? <Icons.Sun size={12} /> : <Icons.Moon size={12} />}</button>
            <a href="/auth/login" style={{ color: 'white', textDecoration: 'none', fontSize: '12px' }}>{t('ورود', 'Login')}</a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <nav style={{
        background: 'var(--card-bg)',
        borderBottom: '1px solid var(--border)',
        position: 'sticky', top: 0, zIndex: 100,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        padding: scrolled ? '8px 0' : '12px 0',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.08)' : 'none',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ fontSize: scrolled ? '20px' : '26px', fontWeight: 800, background: 'linear-gradient(135deg, #1e40af, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer', transition: 'font-size 0.3s', flexShrink: 0 }} onClick={() => router.push('/')}>ShopHub</div>

          {/* Search */}
          <div style={{ flex: 1, position: 'relative', maxWidth: '600px' }}>
            <input type="text" placeholder={t('جستجوی محصولات، برندها و دسته\u200cبندی\u200cها...', 'Search products, brands, categories...')} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '100%', padding: scrolled ? '10px 44px 10px 16px' : '12px 44px 12px 16px', borderRadius: '12px', border: '2px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none', transition: 'all 0.3s' }} />
            <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><Icons.Search size={18} /></div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
            <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', padding: '8px', borderRadius: '8px', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-bg)'} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
              <Icons.Bell size={20} />
              <span style={{ position: 'absolute', top: '4px', right: '4px', width: '16px', height: '16px', borderRadius: '50%', background: '#ef4444', color: 'white', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>3</span>
            </button>
            <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', padding: '8px', borderRadius: '8px', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'var(--hover-bg)'} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
              <Icons.ShoppingCart size={20} />
              <span style={{ position: 'absolute', top: '4px', right: '4px', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--primary)', color: 'white', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>2</span>
            </button>
            <a href="/auth/login" style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', background: 'var(--primary)', color: 'white', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }}><Icons.Users size={14} /> {t('ورود', 'Login')}</a>
          </div>
        </div>

        {/* Category Bar */}
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', gap: '4px', paddingTop: scrolled ? '0' : '8px' }}>
          <button onClick={() => setMegaMenuOpen(!megaMenuOpen)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 16px', borderRadius: '10px', border: 'none', background: megaMenuOpen ? 'var(--primary)' : 'var(--hover-bg)', color: megaMenuOpen ? 'white' : 'var(--text)', cursor: 'pointer', fontSize: '14px', fontWeight: 600, transition: 'all 0.2s' }}>
            <Icons.Menu size={16} /> {t('دسته\u200cبندی\u200cها', 'Categories')} <Icons.ChevronDown size={14} />
          </button>
          {categories.slice(0, 5).map((cat, i) => (
            <button key={i} onClick={() => router.push('/admin/products')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: 'none', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px', fontWeight: 500, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--hover-bg)'; e.currentTarget.style.color = 'var(--primary)'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}>{cat.icon} {cat.name}</button>
          ))}
        </div>

        {/* Mega Menu */}
        {megaMenuOpen && (
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '20px', borderTop: '1px solid var(--border-light)', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', animation: 'fadeIn 0.2s ease-out' }}>
            {megaMenuCategories.map((mc, i) => (
              <div key={i}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', paddingBottom: '8px', borderBottom: '2px solid var(--primary)' }}>
                  <span style={{ color: 'var(--primary)' }}>{mc.icon}</span>
                  <span style={{ fontWeight: 700, fontSize: '14px' }}>{mc.name}</span>
                </div>
                {mc.items.map((item, j) => (
                  <p key={j} onClick={() => router.push('/admin/products')} style={{ padding: '6px 0', fontSize: '13px', color: 'var(--text-secondary)', cursor: 'pointer', transition: 'color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}>{item}</p>
                ))}
              </div>
            ))}
          </div>
        )}
      </nav>

      {/* Hero Slider */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '20px' }}>
        <div style={{ borderRadius: '20px', overflow: 'hidden', height: '360px', background: slides[currentSlide].bg, transition: 'background 0.5s ease', position: 'relative' }}>
          <div style={{ padding: '50px', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', color: 'white', maxWidth: '550px' }}>
            <h1 style={{ fontSize: '30px', fontWeight: 800, margin: '0 0 10px', lineHeight: 1.3 }}>{slides[currentSlide].title}</h1>
            <p style={{ fontSize: '15px', margin: '0 0 20px', opacity: 0.9 }}>{slides[currentSlide].subtitle}</p>
            <button onClick={() => router.push('/admin/products')} style={{ padding: '12px 28px', borderRadius: '12px', border: 'none', background: 'white', color: '#1e40af', fontWeight: 700, fontSize: '14px', cursor: 'pointer', alignSelf: 'flex-start' }}>{t('مشاهده محصولات', 'View Products')}</button>
          </div>
          <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
            {slides.map((_, i) => (<button key={i} onClick={() => setCurrentSlide(i)} style={{ width: currentSlide === i ? '32px' : '10px', height: '10px', borderRadius: '5px', border: 'none', background: currentSlide === i ? 'white' : 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.3s' }} />))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {[
            { icon: <Icons.Truck size={28} />, title: t('ارسال رایگان', 'Free Shipping'), desc: t('بالای ۵۰۰ هزار تومان', 'Over $50') },
            { icon: <Icons.Shield size={28} />, title: t('گارانتی بازگشت', 'Return Policy'), desc: t('۳۰ روز ضمانت', '30-day guarantee') },
            { icon: <Icons.CreditCard size={28} />, title: t('پرداخت امن', 'Secure Payment'), desc: t('پرداخت آنلاین', 'Online payment') },
            { icon: <Icons.Mail size={28} />, title: t('پشتیبانی ۲۴/۷', '24/7 Support'), desc: t('تمام ساعات', 'Always on') },
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--card-bg)' }}>
              <div style={{ color: 'var(--primary)' }}>{f.icon}</div>
              <div><p style={{ margin: 0, fontSize: '13px', fontWeight: 600 }}>{f.title}</p><p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)' }}>{f.desc}</p></div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px 32px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 16px' }}>{t('دسته\u200cبندی\u200cهای محبوب', 'Popular Categories')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
          {categories.map((cat, i) => (
            <div key={i} onClick={() => router.push('/admin/products')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '20px', borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--card-bg)', cursor: 'pointer', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 30px rgba(37,99,235,0.12)'; e.currentTarget.style.borderColor = cat.color; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.borderColor = 'var(--border)'; }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: cat.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: cat.color }}>{cat.icon}</div>
              <span style={{ fontSize: '13px', fontWeight: 600 }}>{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Products */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px 32px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 16px' }}>{t('پرفروش\u200cترین محصولات', 'Best Sellers')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
          {products.map(p => (
            <div key={p.id} style={{ borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--card-bg)', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(37,99,235,0.12)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{ position: 'relative', height: '220px', background: `url(${p.image}) center/cover` }}>
                {p.badge && <span style={{ position: 'absolute', top: '10px', right: '10px', padding: '3px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, background: '#3b82f6', color: 'white' }}>{p.badge}</span>}
                {p.discount > 0 && <span style={{ position: 'absolute', top: '10px', left: '10px', padding: '3px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, background: '#ef4444', color: 'white' }}>-{p.discount}%</span>}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '10px', background: 'linear-gradient(transparent, rgba(0,0,0,0.6))', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Icons.Star size={13} color="#fbbf24" /><span style={{ color: 'white', fontSize: '12px', fontWeight: 600 }}>{p.rating}</span><span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>({p.reviews})</span>
                </div>
              </div>
              <div style={{ padding: '14px' }}>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 4px' }}>{p.category}</p>
                <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 10px', lineHeight: 1.4 }}>{p.name}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '17px', fontWeight: 800, color: 'var(--primary)' }}>{formatPrice(p.price)}</span>
                  {p.oldPrice && <span style={{ fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>{formatPrice(p.oldPrice)}</span>}
                </div>
                <button style={{ width: '100%', marginTop: '10px', padding: '9px', borderRadius: '10px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Icons.ShoppingCart size={14} /> {t('افزودن به سبد', 'Add to Cart')}</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px 40px' }}>
        <div style={{ borderRadius: '20px', padding: '40px', background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', color: 'white', textAlign: 'center' }}>
          <Icons.Mail size={36} />
          <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '12px 0 6px' }}>{t('عضویت در خبرنامه', 'Subscribe to Newsletter')}</h2>
          <p style={{ fontSize: '14px', margin: '0 0 20px', opacity: 0.9 }}>{t('از تخفیف\u200cها مطلع شوید', 'Get notified about deals')}</p>
          <div style={{ display: 'flex', gap: '8px', maxWidth: '460px', margin: '0 auto' }}>
            <input type="email" placeholder={t('ایمیل خود را وارد کنید', 'Enter your email')} style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: 'none', fontSize: '14px', outline: 'none' }} />
            <button style={{ padding: '12px 24px', borderRadius: '12px', border: 'none', background: 'white', color: '#1e40af', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>{t('عضویت', 'Subscribe')}</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: 'var(--card-bg)', borderTop: '1px solid var(--border)', padding: '40px 20px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '32px', marginBottom: '24px' }}>
            <div>
              <div style={{ fontSize: '22px', fontWeight: 800, background: 'linear-gradient(135deg, #1e40af, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '10px' }}>ShopHub</div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{t('فروشگاه آنلاین با بهترین برندها و قیمت\u200cها.', 'Online store with best brands and prices.')}</p>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 10px' }}>{t('دسترسی سریع', 'Quick Links')}</h4>
              <p onClick={() => router.push('/admin/products')} style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 6px', cursor: 'pointer' }}>{t('محصولات', 'Products')}</p>
              <p onClick={() => router.push('/about')} style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 6px', cursor: 'pointer' }}>{t('درباره ما', 'About Us')}</p>
              <p onClick={() => router.push('/contact')} style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 6px', cursor: 'pointer' }}>{t('تماس با ما', 'Contact')}</p>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 10px' }}>{t('خدمات', 'Services')}</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 6px' }}>{t('پیگیری سفارش', 'Track Order')}</p>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 6px' }}>{t('گارانتی بازگشت', 'Returns')}</p>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 6px' }}>{t('سوالات متداول', 'FAQ')}</p>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 10px' }}>{t('تماس', 'Contact')}</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '6px' }}><Icons.Mail size={13} /> info@shophub.com</p>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: '6px' }}><Icons.Globe size={13} /> www.shophub.com</p>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '16px', textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)' }}>
            {t('\u00A9 ۱۴۰۳ ShopHub. تمامی حقوق محفوظ است.', '\u00A9 2024 ShopHub. All rights reserved.')}
          </div>
        </div>
      </footer>
    </div>
  );
}
