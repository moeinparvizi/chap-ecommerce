'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/app/components/Icons';

interface CartItem { id: string; name: string; price: number; image: string; quantity: number; }

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);

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
    <div>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 20px', display: 'flex', alignItems: 'center', gap: '10px' }}><Icons.ShoppingCart size={24} /> سبد خرید ({cart.length})</h1>

        {cart.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Icons.ShoppingCart size={48} color="var(--text-muted)" />
            <h3 style={{ marginTop: '16px', color: 'var(--text-secondary)' }}>سبد خرید شما خالی است</h3>
            <button onClick={() => router.push('/products')} className="btn btn-primary" style={{ marginTop: '12px' }}>مشاهده محصولات</button>
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '16px' }}>
            {/* Cart Items */}
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: '16px', padding: '16px', borderRadius: '16px', border: '1px solid var(--border)', background: 'var(--card-bg)', alignItems: 'center' }}>
                <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', borderRadius: '10px', objectFit: 'cover' }} />
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 4px' }}>{item.name}</h3>
                  <p style={{ fontSize: '16px', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>${item.price.toLocaleString()}</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--border)', borderRadius: '8px' }}>
                  <button onClick={() => updateQuantity(item.id, -1)} style={{ padding: '8px 12px', background: 'var(--hover-bg)', border: 'none', cursor: 'pointer', color: 'var(--text)' }}>-</button>
                  <span style={{ padding: '8px 12px', fontWeight: 600 }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, 1)} style={{ padding: '8px 12px', background: 'var(--hover-bg)', border: 'none', cursor: 'pointer', color: 'var(--text)' }}>+</button>
                </div>
                <button onClick={() => removeItem(item.id)} className="btn-close" style={{ color: 'var(--danger)' }}><Icons.Trash size={16} /></button>
              </div>
            ))}

            {/* Summary */}
            <div className="card" style={{ padding: '20px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px' }}>خلاصه سفارش</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>جمع کل</span><span>${total.toLocaleString()}</span></div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>تخفیف (۵٪)</span><span style={{ color: '#22c55e' }}>-${discount.toLocaleString()}</span></div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '10px', display: 'flex', justifyContent: 'space-between' }}><span style={{ fontWeight: 700, fontSize: '16px' }}>مبلغ قابل پرداخت</span><span style={{ fontWeight: 700, fontSize: '18px', color: 'var(--primary)' }}>${finalPrice.toLocaleString()}</span></div>
              </div>
              <button onClick={handleCheckout} className="btn btn-primary" style={{ width: '100%', marginTop: '16px', padding: '14px', fontSize: '15px' }}><Icons.CreditCard size={18} /> ادامه و پرداخت</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
