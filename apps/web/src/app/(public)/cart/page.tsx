'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/app/components/Icons';

interface CartItem { id: string; name: string; price: number; image: string; quantity: number; }

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const updateCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const updateQuantity = (id: string, delta: number) => {
    updateCart(cart.map(item => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item));
  };

  const removeItem = (id: string) => {
    updateCart(cart.filter(item => item.id !== id));
    setMessage('محصول از سبد حذف شد');
    setTimeout(() => setMessage(''), 2000);
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const discount = Math.round(total * 0.05);
  const finalPrice = total - discount;

  const handleCheckout = () => {
    const isLoggedIn = localStorage.getItem('auth_token');
    if (!isLoggedIn) {
      localStorage.setItem('redirectAfterLogin', '/checkout');
      router.push('/auth/login');
      return;
    }
    router.push('/checkout');
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 20px' }}>
      {/* Notification */}
      {message && (
        <div style={{ position: 'fixed', top: '20px', left: '50%', transform: 'translateX(-50%)', padding: '12px 24px', borderRadius: '12px', background: 'var(--card-bg)', border: '1px solid var(--border)', boxShadow: '0 8px 25px rgba(0,0,0,0.15)', fontSize: '14px', fontWeight: 500, zIndex: 1000, display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icons.Check size={16} color="#22c55e" /> {message}
        </div>
      )}

      <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: '10px' }}><Icons.ShoppingCart size={24} /> سبد خرید <span style={{ fontSize: '14px', fontWeight: 400, color: 'var(--text-secondary)' }}>({cart.length} محصول)</span></h1>

      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <Icons.ShoppingCart size={64} color="var(--text-muted)" />
          <h3 style={{ marginTop: '16px', color: 'var(--text-secondary)', fontWeight: 600 }}>سبد خرید شما خالی است</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: '8px 0 16px' }}>محصولات مورد علاقه خود را به سبد اضافه کنید</p>
          <button onClick={() => router.push('/products')} className="btn btn-primary" style={{ padding: '12px 24px' }}><Icons.Package size={16} /> مشاهده محصولات</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {cart.map(item => (
            <div key={item.id} style={{ display: 'flex', gap: '16px', padding: '16px', borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--card-bg)', alignItems: 'center', transition: 'all 0.2s' }}>
              <img src={item.image} alt={item.name} style={{ width: '90px', height: '90px', borderRadius: '12px', objectFit: 'cover', flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, margin: '0 0 4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</h3>
                <p style={{ fontSize: '17px', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>${(item.price * item.quantity).toLocaleString()}</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '2px', border: '1px solid var(--border)', borderRadius: '10px', overflow: 'hidden', flexShrink: 0 }}>
                <button onClick={() => updateQuantity(item.id, -1)} style={{ padding: '10px 14px', background: 'var(--hover-bg)', border: 'none', cursor: 'pointer', color: 'var(--text)', fontSize: '16px', transition: 'background 0.2s' }}>-</button>
                <span style={{ padding: '10px 14px', fontWeight: 700, minWidth: '32px', textAlign: 'center' }}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, 1)} style={{ padding: '10px 14px', background: 'var(--hover-bg)', border: 'none', cursor: 'pointer', color: 'var(--text)', fontSize: '16px', transition: 'background 0.2s' }}>+</button>
              </div>
              <button onClick={() => removeItem(item.id)} style={{ padding: '10px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--danger)', borderRadius: '8px', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'} onMouseLeave={e => e.currentTarget.style.background = 'none'}>
                <Icons.Trash size={18} />
              </button>
            </div>
          ))}

          {/* Summary */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px' }}>خلاصه سفارش</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}><span style={{ color: 'var(--text-secondary)' }}>جمع کل ({cart.length} محصول)</span><span style={{ fontWeight: 600 }}>${total.toLocaleString()}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}><span style={{ color: 'var(--text-secondary)' }}>تخفیف (۵٪)</span><span style={{ color: '#22c55e', fontWeight: 600 }}>-${discount.toLocaleString()}</span></div>
              <div style={{ borderTop: '2px solid var(--border)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '16px' }}>مبلغ قابل پرداخت</span>
                <span style={{ fontWeight: 800, fontSize: '20px', color: 'var(--primary)' }}>${finalPrice.toLocaleString()}</span>
              </div>
            </div>
            <button onClick={handleCheckout} className="btn btn-primary" style={{ width: '100%', marginTop: '20px', padding: '14px', fontSize: '15px', borderRadius: '12px' }}>
              <Icons.CreditCard size={18} /> ادامه و پرداخت
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
