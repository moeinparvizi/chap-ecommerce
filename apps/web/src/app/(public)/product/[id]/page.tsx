'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/app/components/Icons';
import { api } from '@/app/lib/api';

interface Product { id: string; name: string; sku: string; price: number; compareAtPrice?: number; stock: number; brand: string; description: string; rating: number; sales: number; status: string; images: { id: string; url: string; name: string }[]; category?: { name: string; slug: string } | null; }

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedMessage, setAddedMessage] = useState(false);

  useEffect(() => {
    api.getProducts().then((data: any[]) => {
      const found = data.find((p: any) => p.id === id);
      if (found) setProduct(found);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: 'var(--text-muted)' }}><Icons.Package size={48} /></div>;
  if (!product) return <div style={{ textAlign: 'center', padding: '60px 20px' }}><Icons.Package size={48} /><h2 style={{ marginTop: '16px' }}>محصول یافت نشد</h2><button className="btn btn-primary" onClick={() => router.push('/')}>بازگشت</button></div>;

  const discount = product.compareAtPrice ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0;
  const mainImage = product.images?.[selectedImage]?.url || 'https://picsum.photos/600/400';

  const addToCart = () => {
    if (!product || product.stock === 0) return;
    const saved = localStorage.getItem('cart');
    const cart: any[] = saved ? JSON.parse(saved) : [];
    const existing = cart.find((c: any) => c.id === product.id);
    if (existing) { existing.quantity += quantity; } else { cart.push({ id: product.id, name: product.name, price: product.price, image: mainImage, quantity }); }
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new CustomEvent('cart-added', { detail: { name: product.name } }));
    window.dispatchEvent(new Event('cart-updated'));
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 3000);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 20px' }}>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
        <span onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>خانه</span><span>/</span>
        <span style={{ color: 'var(--text)' }}>{product.name}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* Images */}
        <div>
          <div style={{ borderRadius: '16px', overflow: 'hidden', background: 'var(--card-bg)', border: '1px solid var(--border)', marginBottom: '12px' }}>
            <img src={mainImage} alt={product.name} style={{ width: '100%', height: '400px', objectFit: 'cover' }} />
          </div>
          {product.images.length > 1 && (
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
              {product.images.map((img, i) => <div key={img.id} onClick={() => setSelectedImage(i)} style={{ width: '72px', height: '72px', borderRadius: '10px', overflow: 'hidden', border: selectedImage === i ? '2px solid var(--primary)' : '2px solid var(--border)', cursor: 'pointer', flexShrink: 0 }}><img src={img.url} alt={img.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>)}
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 4px' }}>{product.brand}</p>
          <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 8px' }}>{product.name}</h1>
          {/* Rating */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', gap: '2px' }}>{[1,2,3,4,5].map(s => <Icons.Star key={s} size={16} color={s <= Math.round(product.rating) ? '#fbbf24' : '#d1d5db'} />)}</div>
            <span style={{ fontSize: '14px', fontWeight: 600 }}>{product.rating}</span>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>({product.sales} فروش)</span>
          </div>
          {/* Price */}
          <div style={{ padding: '16px', background: 'var(--table-header-bg)', borderRadius: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '12px' }}>
              <span style={{ fontSize: '28px', fontWeight: 800, color: 'var(--primary)' }}>${product.price.toLocaleString()}</span>
              {product.compareAtPrice && <span style={{ fontSize: '16px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>${product.compareAtPrice.toLocaleString()}</span>}
              {discount > 0 && <span style={{ padding: '4px 10px', borderRadius: '8px', fontSize: '13px', fontWeight: 700, background: '#ef4444', color: 'white' }}>-{discount}%</span>}
            </div>
          </div>
          {/* Stock */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: product.stock === 0 ? '#ef4444' : product.stock < 10 ? '#f59e0b' : '#22c55e' }} />
            <span style={{ fontSize: '14px' }}>{product.stock === 0 ? 'ناموجود' : product.stock < 10 ? `${product.stock} باقیمانده` : `${product.stock} موجود`}</span>
          </div>
          {/* Category */}
          {product.category && <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px', padding: '8px 12px', background: 'var(--hover-bg)', borderRadius: '8px', fontSize: '13px' }}><Icons.Folder size={14} /> {product.category.name}</div>}
          {/* Quantity + Cart */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
              <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: '10px 16px', background: 'var(--hover-bg)', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--text)' }}>-</button>
              <span style={{ padding: '10px 16px', fontSize: '16px', fontWeight: 600 }}>{quantity}</span>
              <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} style={{ padding: '10px 16px', background: 'var(--hover-bg)', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--text)' }}>+</button>
            </div>
            <button onClick={addToCart} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: product.stock > 0 ? 'var(--primary)' : 'var(--hover-bg)', color: product.stock > 0 ? 'white' : 'var(--text-muted)', fontWeight: 700, fontSize: '15px', cursor: product.stock > 0 ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} disabled={product.stock === 0}>
              {addedMessage ? <><Icons.Check size={18} /> اضافه شد!</> : <><Icons.ShoppingCart size={18} /> {product.stock > 0 ? 'افزودن به سبد' : 'ناموجود'}</>}
            </button>
          </div>
          {/* Description */}
          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '10px' }}>توضیحات</h3>
            <p style={{ fontSize: '14px', lineHeight: 1.8, color: 'var(--text-secondary)' }}>{product.description}</p>
          </div>
          {/* Specs */}
          <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '10px' }}>مشخصات</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {[{ l: 'برند', v: product.brand }, { l: 'کد', v: product.sku }, { l: 'امتیاز', v: `${product.rating} از ۵` }, { l: 'فروش', v: product.sales.toLocaleString() }].map((s, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--table-header-bg)', borderRadius: '8px', fontSize: '13px' }}><span style={{ color: 'var(--text-secondary)' }}>{s.l}</span><span style={{ fontWeight: 600 }}>{s.v}</span></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews & Comments Section */}
      <ProductReviewsComments productId={id} productName={product.name} />
    </div>
  );
}

function ProductReviewsComments({ productId, productName }: { productId: string; productName: string }) {
  const [activeTab, setActiveTab] = useState<'reviews' | 'comments'>('reviews');
  const [reviews, setReviews] = useState<any[]>([]);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem('auth_token'));
  }, []);

  useEffect(() => {
    import('@/app/lib/api').then(({ api }) => {
      Promise.all([
        api.getReviews(undefined, productId).catch(() => []),
        api.getComments(undefined, productId).catch(() => []),
      ]).then(([r, c]) => { setReviews(r); setComments(c); });
    });
  }, [productId]);

  const addComment = async () => {
    if (!isLoggedIn) { localStorage.setItem('redirectAfterLogin', window.location.pathname); window.location.href = '/auth/login'; return; }
    if (!newComment.trim()) return;
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const { api } = await import('@/app/lib/api');
    await api.createComment({ userId: user.id, productId, productName, text: newComment, author: user.name || 'کاربر' });
    const all = await api.getComments(undefined, productId);
    setComments(all);
    setNewComment('');
  };

  const avgRating = reviews.length > 0 ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1) : '0';

  return (
    <div style={{ marginTop: '40px', paddingTop: '30px', borderTop: '2px solid var(--border)' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '2px solid var(--border)', paddingBottom: '0' }}>
        <button onClick={() => setActiveTab('reviews')} style={{ padding: '10px 20px', borderRadius: '0', border: 'none', borderBottom: activeTab === 'reviews' ? '3px solid var(--primary)' : '3px solid transparent', background: 'transparent', color: activeTab === 'reviews' ? 'var(--primary)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '14px', fontWeight: activeTab === 'reviews' ? 700 : 500, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '-2px' }}>
          <Icons.Star size={16} /> ریویوها ({reviews.length})
        </button>
        <button onClick={() => setActiveTab('comments')} style={{ padding: '10px 20px', borderRadius: '0', border: 'none', borderBottom: activeTab === 'comments' ? '3px solid var(--primary)' : '3px solid transparent', background: 'transparent', color: activeTab === 'comments' ? 'var(--primary)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '14px', fontWeight: activeTab === 'comments' ? 700 : 500, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '-2px' }}>
          <Icons.MessageSquare size={16} /> کامنت‌ها ({comments.length})
        </button>
      </div>

      {/* Reviews Tab — View Only */}
      {activeTab === 'reviews' && (
        <div>
          {reviews.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px', borderRadius: '12px', background: 'var(--hover-bg)', marginBottom: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '32px', fontWeight: 800, color: 'var(--primary)', margin: 0 }}>{avgRating}</p>
                <div style={{ display: 'flex', gap: '2px', marginTop: '4px' }}>{[1,2,3,4,5].map(s => <Icons.Star key={s} size={14} color={s <= Math.round(Number(avgRating)) ? '#fbbf24' : '#d1d5db'} />)}</div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '4px 0 0' }}>{reviews.length} ریویو</p>
              </div>
            </div>
          )}

          {!isLoggedIn ? (
            <div style={{ padding: '20px', borderRadius: '12px', border: '1px dashed var(--border)', background: 'var(--hover-bg)', marginBottom: '16px', textAlign: 'center' }}>
              <Icons.Users size={28} color="var(--text-muted)" />
              <p style={{ margin: '8px 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>برای مشاهده ریویوها وارد شوید</p>
            </div>
          ) : (
            <div style={{ padding: '16px', borderRadius: '12px', border: '1px dashed var(--border)', background: 'var(--hover-bg)', marginBottom: '16px', textAlign: 'center' }}>
              <Icons.Star size={20} color="#fbbf24" />
              <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '13px' }}>ثبت ریویو فقط از بخش <strong>خریدهای من</strong> در داشبورد امکان‌پذیر است (برای محصولات تحویل شده)</p>
            </div>
          )}

          {reviews.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}><Icons.Star size={32} /><p style={{ marginTop: '8px' }}>هنوز ریویویی ثبت نشده</p></div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {reviews.map(r => (
                <div key={r.id} style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--card-bg)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '14px' }}>{r.rating}</div>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: 600, margin: 0 }}>{r.author || 'کاربر'}</p>
                        <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>{[1,2,3,4,5].map(s => <Icons.Star key={s} size={11} color={s <= r.rating ? '#fbbf24' : '#d1d5db'} />)}</div>
                      </div>
                    </div>
                    <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{r.date}</span>
                  </div>
                  {r.title && <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '10px 0 4px' }}>{r.title}</h4>}
                  <p style={{ fontSize: '14px', margin: '0', lineHeight: 1.7, color: 'var(--text-secondary)' }}>{r.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Comments Tab */}
      {activeTab === 'comments' && (
        <div>
          {!isLoggedIn ? (
            <div style={{ padding: '24px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--card-bg)', marginBottom: '16px', textAlign: 'center' }}>
              <Icons.Users size={32} color="var(--text-muted)" />
              <p style={{ margin: '10px 0 12px', color: 'var(--text-secondary)', fontSize: '14px' }}>برای ثبت کامنت باید وارد شوید</p>
              <button onClick={() => { localStorage.setItem('redirectAfterLogin', window.location.pathname); window.location.href = '/auth/login'; }} className="btn btn-primary" style={{ padding: '8px 20px' }}><Icons.Users size={14} /> ورود به حساب</button>
            </div>
          ) : (
          <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--card-bg)', marginBottom: '16px' }}>
            <h4 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 12px' }}>کامنت بگذارید</h4>
            <textarea placeholder="نظر خود را بنویسید..." value={newComment} onChange={e => setNewComment(e.target.value)} rows={3} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', resize: 'vertical', outline: 'none', fontFamily: 'inherit', marginBottom: '10px' }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}><button onClick={addComment} disabled={!newComment.trim()} className="btn btn-primary" style={{ padding: '8px 20px', opacity: newComment.trim() ? 1 : 0.5 }}><Icons.Send size={14} /> ارسال کامنت</button></div>
          </div>
          )}

          {comments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}><Icons.MessageSquare size={32} /><p style={{ marginTop: '8px' }}>هنوز کامنتی ثبت نشده</p></div>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {comments.map(c => (
                <div key={c.id} style={{ padding: '16px', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--card-bg)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 600 }}>{(c.author || 'کاربر').charAt(0)}</div>
                      <div><p style={{ fontSize: '13px', fontWeight: 600, margin: 0 }}>{c.author || 'کاربر'}</p><p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: 0 }}>{c.date}</p></div>
                    </div>
                  </div>
                  <p style={{ fontSize: '14px', margin: 0, lineHeight: 1.7, color: 'var(--text-secondary)' }}>{c.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
