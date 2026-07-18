'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from './components/Icons';

export default function Home() {
  const router = useRouter();
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [lang, setLang] = useState<'fa' | 'en'>('fa');
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
    const savedLang = localStorage.getItem('lang') as 'fa' | 'en' || 'fa';
    setTheme(savedTheme);
    setLang(savedLang);
    document.documentElement.setAttribute('data-theme', savedTheme);
    document.documentElement.dir = savedLang === 'fa' ? 'rtl' : 'ltr';
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

  const slides = [
    { title: t('فروش ویژه تا ۵۰٪ تخفیف', 'Special Sale Up to 50% Off'), subtitle: t('بهترین برندهای دنیا با قیمت‌های استثنایی', 'World-class brands at exceptional prices'), bg: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%)', btnText: t('مشاهده محصولات', 'View Products') },
    { title: t('ارسال رایگان برای خریدهای بالای ۵۰۰ هزار تومان', 'Free Shipping on Orders Over $50'), subtitle: t('تحویل سریع و مطمئن به سراسر کشور', 'Fast & Reliable Delivery Nationwide'), bg: 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #60a5fa 100%)', btnText: t('خرید کنید', 'Shop Now') },
    { title: t('گارانتی بازگشت ۳۰ روزه', '30-Day Money Back Guarantee'), subtitle: t('اگر راضی نبودید، پولتان را پس بگیرید', "If you're not satisfied, get your money back"), bg: 'linear-gradient(135deg, #0f172a 0%, #1e40af 50%, #3b82f6 100%)', btnText: t('اطلاعات بیشتر', 'Learn More') },
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
    { id: 2, name: t('مک‌بوک پرو M3', 'MacBook Pro M3'), price: 89990000, oldPrice: 94990000, discount: 5, rating: 4.9, reviews: 567, image: 'https://picsum.photos/400/400?random=2', badge: t('جدید', 'New'), category: t('لپتاپ', 'Laptop') },
    { id: 3, name: t('سامسونگ گلکسی S24', 'Samsung Galaxy S24'), price: 39990000, oldPrice: 44990000, discount: 11, rating: 4.6, reviews: 892, image: 'https://picsum.photos/400/400?random=3', badge: '', category: t('موبایل', 'Mobile') },
    { id: 4, name: t('نایک ایرمکس ۹۰', 'Nike Air Max 90'), price: 3290000, oldPrice: 3990000, discount: 18, rating: 4.5, reviews: 2345, image: 'https://picsum.photos/400/400?random=4', badge: t('تخفیف ویژه', 'Special'), category: t('کفش', 'Shoes') },
    { id: 5, name: t('سونی WH-1000XM5', 'Sony WH-1000XM5'), price: 8990000, oldPrice: 9990000, discount: 10, rating: 4.7, reviews: 678, image: 'https://picsum.photos/400/400?random=5', badge: '', category: t('هدست', 'Headphone') },
    { id: 6, name: t('آیپد ایر M2', 'iPad Air M2'), price: 29990000, oldPrice: 32990000, discount: 9, rating: 4.8, reviews: 445, image: 'https://picsum.photos/400/400?random=6', badge: t('جدید', 'New'), category: t('تبلت', 'Tablet') },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Header */}
      <header style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border-light)', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span>{t('خوش آمدید!', 'Welcome!')}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Truck size={12} /> {t('ارسال رایگان', 'Free Shipping')}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button onClick={toggleLang} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '12px' }}>{lang === 'fa' ? 'EN' : 'FA'}</button>
              <button onClick={toggleTheme} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>{theme === 'light' ? <Icons.Sun size={12} /> : <Icons.Moon size={12} />}</button>
              <a href="/auth/login" style={{ color: 'var(--text-secondary)', textDecoration: 'none' }}>{t('ورود / ثبت\u200cنام', 'Login / Register')}</a>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', padding: '12px 0' }}>
            <div style={{ fontSize: '24px', fontWeight: 800, background: 'linear-gradient(135deg, #1e40af, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', cursor: 'pointer' }} onClick={() => router.push('/')}>ShopHub</div>
            <div style={{ flex: 1, position: 'relative' }}>
              <input type="text" placeholder={t('جستجو در محصولات...', 'Search products...')} value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ width: '100%', padding: '12px 44px 12px 16px', borderRadius: '12px', border: '2px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none', transition: 'all 0.2s' }} />
              <div style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}><Icons.Search size={18} /></div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', padding: '8px' }}><Icons.Bell size={22} /><span style={{ position: 'absolute', top: '2px', right: '2px', width: '18px', height: '18px', borderRadius: '50%', background: '#ef4444', color: 'white', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>3</span></button>
              <button style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', padding: '8px' }}><Icons.ShoppingCart size={22} /><span style={{ position: 'absolute', top: '2px', right: '2px', width: '18px', height: '18px', borderRadius: '50%', background: 'var(--primary)', color: 'white', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>2</span></button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', padding: '8px 0 12px', overflowX: 'auto' }}>
            {categories.map((cat, i) => (
              <button key={i} onClick={() => router.push('/admin/products')} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--hover-bg)', color: 'var(--text)', cursor: 'pointer', fontSize: '13px', fontWeight: 500, whiteSpace: 'nowrap', transition: 'all 0.2s' }}>{cat.icon} {cat.name}</button>
            ))}
          </div>
        </div>
      </header>

      {/* Hero */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '20px' }}>
        <div style={{ borderRadius: '20px', overflow: 'hidden', height: '380px', background: slides[currentSlide].bg, transition: 'all 0.5s ease', position: 'relative' }}>
          <div style={{ padding: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center', height: '100%', color: 'white', maxWidth: '600px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '0 0 12px', lineHeight: 1.3 }}>{slides[currentSlide].title}</h1>
            <p style={{ fontSize: '16px', margin: '0 0 24px', opacity: 0.9 }}>{slides[currentSlide].subtitle}</p>
            <button onClick={() => router.push('/admin/products')} style={{ padding: '14px 32px', borderRadius: '12px', border: 'none', background: 'white', color: '#1e40af', fontWeight: 700, fontSize: '15px', cursor: 'pointer', alignSelf: 'flex-start', transition: 'transform 0.2s' }}>{slides[currentSlide].btnText}</button>
          </div>
          <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '8px' }}>
            {slides.map((_, i) => (
              <button key={i} onClick={() => setCurrentSlide(i)} style={{ width: currentSlide === i ? '32px' : '10px', height: '10px', borderRadius: '5px', border: 'none', background: currentSlide === i ? 'white' : 'rgba(255,255,255,0.4)', cursor: 'pointer', transition: 'all 0.3s' }} />
            ))}
          </div>
        </div>
      </div>

      {/* Features */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {[
            { icon: <Icons.Truck size={32} />, title: t('ارسال رایگان', 'Free Shipping'), desc: t('برای خریدهای بالای ۵۰۰ هزار تومان', 'On orders over $50') },
            { icon: <Icons.Shield size={32} />, title: t('گارانتی بازگشت', 'Return Policy'), desc: t('۳۰ روز ضمانت بازگشت کالا', '30-day return guarantee') },
            { icon: <Icons.CreditCard size={32} />, title: t('پرداخت امن', 'Secure Payment'), desc: t('پرداخت آنلاین و امن', 'Safe online payment') },
            { icon: <Icons.Mail size={32} />, title: t('پشتیبانی ۲۴/۷', '24/7 Support'), desc: t('پشتیبانی در تمام ساعات شبانه\u200cروز', 'Round the clock support') },
          ].map((f, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--card-bg)' }}>
              <div style={{ color: 'var(--primary)', flexShrink: 0 }}>{f.icon}</div>
              <div><p style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>{f.title}</p><p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>{f.desc}</p></div>
            </div>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px 32px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 20px' }}>{t('دسته\u200cبندی\u200cهای محبوب', 'Popular Categories')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
          {categories.map((cat, i) => (
            <div key={i} onClick={() => router.push('/admin/products')} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '24px 16px', borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--card-bg)', cursor: 'pointer', transition: 'all 0.3s' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '16px', background: cat.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: cat.color }}>{cat.icon}</div>
              <span style={{ fontSize: '14px', fontWeight: 600 }}>{cat.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Products */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px 32px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 20px' }}>{t('پرفروش\u200cترین محصولات', 'Best Sellers')}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {products.map(p => (
            <div key={p.id} style={{ borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--card-bg)', overflow: 'hidden', transition: 'all 0.3s', cursor: 'pointer' }}>
              <div style={{ position: 'relative', height: '240px', background: `url(${p.image}) center/cover` }}>
                {p.badge && <span style={{ position: 'absolute', top: '12px', right: '12px', padding: '4px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: 700, background: '#3b82f6', color: 'white' }}>{p.badge}</span>}
                {p.discount > 0 && <span style={{ position: 'absolute', top: '12px', left: '12px', padding: '4px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, background: '#ef4444', color: 'white' }}>-{p.discount}%</span>}
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '12px', background: 'linear-gradient(transparent, rgba(0,0,0,0.7))', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Icons.Star size={14} color="#fbbf24" />
                  <span style={{ color: 'white', fontSize: '13px', fontWeight: 600 }}>{p.rating}</span>
                  <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>({p.reviews})</span>
                </div>
              </div>
              <div style={{ padding: '16px' }}>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 4px' }}>{p.category}</p>
                <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 12px', lineHeight: 1.4 }}>{p.name}</h3>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                  <span style={{ fontSize: '18px', fontWeight: 800, color: 'var(--primary)' }}>{formatPrice(p.price)}</span>
                  {p.oldPrice && <span style={{ fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>{formatPrice(p.oldPrice)}</span>}
                </div>
                <button style={{ width: '100%', marginTop: '12px', padding: '10px', borderRadius: '10px', border: 'none', background: 'var(--primary)', color: 'white', fontWeight: 600, fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Icons.ShoppingCart size={14} /> {t('افزودن به سبد', 'Add to Cart')}</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 20px 40px' }}>
        <div style={{ borderRadius: '20px', padding: '48px', background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)', color: 'white', textAlign: 'center' }}>
          <Icons.Mail size={40} />
          <h2 style={{ fontSize: '24px', fontWeight: 700, margin: '16px 0 8px' }}>{t('عضویت در خبرنامه', 'Subscribe to Newsletter')}</h2>
          <p style={{ fontSize: '14px', margin: '0 0 24px', opacity: 0.9 }}>{t('از تخفیف\u200cها و جدیدترین محصولات مطلع شوید', 'Get notified about deals and new products')}</p>
          <div style={{ display: 'flex', gap: '8px', maxWidth: '500px', margin: '0 auto' }}>
            <input type="email" placeholder={t('ایمیل خود را وارد کنید', 'Enter your email')} style={{ flex: 1, padding: '14px 18px', borderRadius: '12px', border: 'none', fontSize: '14px', outline: 'none' }} />
            <button style={{ padding: '14px 28px', borderRadius: '12px', border: 'none', background: 'white', color: '#1e40af', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>{t('عضویت', 'Subscribe')}</button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ background: 'var(--card-bg)', borderTop: '1px solid var(--border)', padding: '40px 20px' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '32px', marginBottom: '32px' }}>
            <div>
              <div style={{ fontSize: '22px', fontWeight: 800, background: 'linear-gradient(135deg, #1e40af, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '12px' }}>ShopHub</div>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>{t('فروشگاه آنلاین ShopHub با بهترین برندها و قیمت\u200cها.', 'Online store ShopHub with best brands and prices.')}</p>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 12px' }}>{t('دسترسی سریع', 'Quick Links')}</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 8px', cursor: 'pointer' }}>{t('محصولات', 'Products')}</p>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 8px', cursor: 'pointer' }}>{t('دسته\u200cبندی\u200cها', 'Categories')}</p>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 8px', cursor: 'pointer' }}>{t('تخفیف\u200cها', 'Deals')}</p>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 12px' }}>{t('خدمات', 'Services')}</h4>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 8px', cursor: 'pointer' }}>{t('پیگیری سفارش', 'Track Order')}</p>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 8px', cursor: 'pointer' }}>{t('گارانتی بازگشت', 'Returns')}</p>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 8px', cursor: 'pointer' }}>{t('تماس با ما', 'Contact Us')}</p>
            </div>
            <div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 12px' }}>{t('تماس با ما', 'Contact')}</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Icons.Mail size={14} /> info@shophub.com</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Icons.Globe size={14} /> www.shophub.com</span>
              </div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', textAlign: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
            {t('\u00A9 ۱۴۰۳ ShopHub. تمامی حقوق محفوظ است.', '\u00A9 2024 ShopHub. All rights reserved.')}
          </div>
        </div>
      </footer>
    </div>
  );
}
