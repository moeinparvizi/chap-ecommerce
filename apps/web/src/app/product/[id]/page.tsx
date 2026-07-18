'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '../../components/Icons';
import { api } from '../../lib/api';

interface ProductImage { id: string; url: string; name: string; }
interface Product {
  id: string; name: string; sku: string; price: number; compareAtPrice?: number; stock: number; brand: string; description: string; rating: number; sales: number; status: string;
  images: ProductImage[];
  category?: { name: string; slug: string } | null;
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getProducts().then((data: any[]) => {
      const found = data.find((p: any) => p.id === id);
      if (found) setProduct(found);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh', color: 'var(--text-muted)' }}><Icons.Package size={48} /></div>;
  if (!product) return <div style={{ textAlign: 'center', padding: '60px 20px' }}><Icons.Package size={48} /><h2 style={{ marginTop: '16px' }}>محصول یافت نشد</h2></div>;

  const discount = product.compareAtPrice ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0;
  const mainImage = product.images?.[selectedImage]?.url || 'https://picsum.photos/600/400';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      {/* Header */}
      <nav style={{ background: 'var(--card-bg)', borderBottom: '1px solid var(--border)', padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '12px', position: 'sticky', top: 0, zIndex: 100 }}>
        <button onClick={() => router.push('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)', padding: '4px' }}><Icons.ArrowUp size={18} /></button>
        <div style={{ fontSize: '22px', fontWeight: 800, background: 'linear-gradient(135deg, #1e40af, #3b82f6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>ShopHub</div>
        <div style={{ flex: 1 }} />
        <button onClick={() => { const n = localStorage.getItem('theme') === 'dark' ? 'light' : 'dark'; localStorage.setItem('theme', n); document.documentElement.setAttribute('data-theme', n); }} style={{ background: 'none', border: 'none', color: 'var(--text)', padding: '8px', borderRadius: '8px' }}>{localStorage.getItem('theme') === 'dark' ? <Icons.Sun size={16} /> : <Icons.Moon size={16} />}</button>
        <button style={{ position: 'relative', background: 'none', border: 'none', color: 'var(--text)', padding: '8px' }}><Icons.ShoppingCart size={20} /><span style={{ position: 'absolute', top: '4px', right: '4px', width: '16px', height: '16px', borderRadius: '50%', background: 'var(--primary)', color: 'white', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>2</span></button>
      </nav>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '24px 20px' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
          <span onClick={() => router.push('/')} style={{ cursor: 'pointer' }}>خانه</span>
          <span>/</span>
          <span onClick={() => router.push('/admin/products')} style={{ cursor: 'pointer' }}>محصولات</span>
          <span>/</span>
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
                {product.images.map((img, i) => (
                  <div key={img.id} onClick={() => setSelectedImage(i)} style={{ width: '72px', height: '72px', borderRadius: '10px', overflow: 'hidden', border: selectedImage === i ? '2px solid var(--primary)' : '2px solid var(--border)', cursor: 'pointer', flexShrink: 0 }}>
                    <img src={img.url} alt={img.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '0 0 4px', fontWeight: 500 }}>{product.brand}</p>
            <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 8px', lineHeight: 1.3 }}>{product.name}</h1>

            {/* Rating */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', gap: '2px' }}>
                {[1,2,3,4,5].map(s => <Icons.Star key={s} size={16} color={s <= Math.round(product.rating) ? '#fbbf24' : '#d1d5db'} />)}
              </div>
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
              <span style={{ fontSize: '14px', fontWeight: 500 }}>
                {product.stock === 0 ? 'ناموجود' : product.stock < 10 ? `${product.stock} باقیمانده` : `${product.stock} موجود`}
              </span>
            </div>

            {/* Category */}
            {product.category && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px', padding: '8px 12px', background: 'var(--hover-bg)', borderRadius: '8px', fontSize: '13px' }}>
                <Icons.Folder size={14} /> {product.category.name}
              </div>
            )}

            {/* Quantity + Add to cart */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden' }}>
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} style={{ padding: '10px 16px', background: 'var(--hover-bg)', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--text)' }}>-</button>
                <span style={{ padding: '10px 16px', fontSize: '16px', fontWeight: 600, minWidth: '40px', textAlign: 'center' }}>{quantity}</span>
                <button onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} style={{ padding: '10px 16px', background: 'var(--hover-bg)', border: 'none', cursor: 'pointer', fontSize: '18px', color: 'var(--text)' }}>+</button>
              </div>
              <button style={{ flex: 1, padding: '12px', borderRadius: '12px', border: 'none', background: product.stock > 0 ? 'var(--primary)' : 'var(--hover-bg)', color: product.stock > 0 ? 'white' : 'var(--text-muted)', fontWeight: 700, fontSize: '15px', cursor: product.stock > 0 ? 'pointer' : 'default', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }} disabled={product.stock === 0}>
                <Icons.ShoppingCart size={18} /> {product.stock > 0 ? 'افزودن به سبد' : 'ناموجود'}
              </button>
            </div>

            {/* Description */}
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '10px' }}>توضیحات محصول</h3>
              <p style={{ fontSize: '14px', lineHeight: 1.8, color: 'var(--text-secondary)' }}>{product.description}</p>
            </div>

            {/* Specs */}
            <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
              <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '10px' }}>مشخصات</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                {[
                  { label: 'برند', value: product.brand },
                  { label: 'کد محصول', value: product.sku },
                  { label: 'امتیاز', value: `${product.rating} از ۵` },
                  { label: 'تعداد فروش', value: `${product.sales.toLocaleString()}` },
                ].map((s, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--table-header-bg)', borderRadius: '8px', fontSize: '13px' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>{s.label}</span>
                    <span style={{ fontWeight: 600 }}>{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
