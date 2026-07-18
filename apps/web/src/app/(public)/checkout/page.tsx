'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/app/components/Icons';
import { api } from '@/app/lib/api';

interface CartItem { id: string; name: string; price: number; image: string; quantity: number; }
interface Location { id: string; title: string; address: string; city: string; postalCode: string; phone: string; isDefault: boolean; }

export default function CheckoutPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      localStorage.setItem('redirectAfterLogin', '/checkout');
      router.push('/auth/login');
      return;
    }
    setIsLoggedIn(true);

    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsed = JSON.parse(savedCart);
      setCart(parsed);
      if (parsed.length === 0) router.push('/cart');
    }

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    api.getLocations(user.id).then((locs: any) => {
      setLocations(locs);
      const def = locs.find((l: Location) => l.isDefault);
      if (def) setSelectedLocation(def.id);
      else if (locs.length > 0) setSelectedLocation(locs[0].id);
    }).catch(() => {});
  }, [router]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = total > 500000 ? 0 : 35000;
  const discount = Math.round(total * 0.05);
  const finalPrice = total - discount + shipping;
  const activeLocation = locations.find(l => l.id === selectedLocation);

  const placeOrder = async () => {
    if (!selectedLocation || cart.length === 0) return;
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    try {
      await api.createOrder({
        customerName: user.name || 'کاربر',
        userId: user.id,
        amount: finalPrice,
        items: cart.length,
        itemsJson: JSON.stringify(cart.map(c => ({ id: c.id, name: c.name, price: c.price, image: c.image, quantity: c.quantity }))),
        locationJson: JSON.stringify(activeLocation),
        paymentMethod: 'online',
      });
    } catch (e) {
      // fallback to localStorage if API fails
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      orders.push({ id: `ord-${Date.now()}`, userId: user.id, items: cart.map(c => ({ id: c.id, name: c.name, price: c.price, image: c.image, quantity: c.quantity })), total: finalPrice, status: 'pending', date: new Date().toLocaleDateString('fa-IR'), location: activeLocation });
      localStorage.setItem('orders', JSON.stringify(orders));
    }

    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cart-updated'));
    setOrderPlaced(true);
  };

  if (!isLoggedIn) return null;

  if (orderPlaced) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '60px 20px', textAlign: 'center' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(34,197,94,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Icons.Check size={40} color="#22c55e" />
        </div>
        <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '0 0 8px' }}>سفارش ثبت شد!</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '15px', marginBottom: '24px' }}>سفارش شما با موفقیت ثبت شد و در انتظار پرداخت است.</p>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
          <button onClick={() => router.push('/account/orders')} className="btn btn-primary" style={{ padding: '10px 24px' }}>مشاهده سفارشات</button>
          <button onClick={() => router.push('/')} style={{ padding: '10px 24px', borderRadius: '10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer' }}>بازگشت به خانه</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px 20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 24px', display: 'flex', alignItems: 'center', gap: '10px' }}><Icons.CreditCard size={24} /> تکمیل خرید</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '24px', alignItems: 'start' }}>
        {/* Left — Location + Payment */}
        <div style={{ display: 'grid', gap: '20px' }}>
          {/* Location Selection */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Icons.MapPin size={18} /> آدرس ارسال</h3>
            {locations.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px', background: 'var(--hover-bg)', borderRadius: '10px' }}>
                <Icons.MapPin size={32} color="var(--text-muted)" />
                <p style={{ margin: '8px 0 12px', color: 'var(--text-secondary)', fontSize: '14px' }}>هنوز آدرسی ثبت نکرده‌اید</p>
                <button onClick={() => { localStorage.setItem('redirectAfterLogin', '/checkout'); router.push('/account/locations'); }} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>افزودن آدرس</button>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '8px' }}>
                {locations.map(loc => (
                  <label key={loc.id} onClick={() => setSelectedLocation(loc.id)} style={{ display: 'flex', gap: '12px', padding: '14px', borderRadius: '10px', border: `2px solid ${selectedLocation === loc.id ? 'var(--primary)' : 'var(--border)'}`, background: selectedLocation === loc.id ? 'rgba(37,99,235,0.04)' : 'transparent', cursor: 'pointer', transition: 'all 0.2s' }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: `2px solid ${selectedLocation === loc.id ? 'var(--primary)' : 'var(--border)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '2px' }}>
                      {selectedLocation === loc.id && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' }} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 600, fontSize: '14px' }}>{loc.title}</span>
                        {loc.isDefault && <span style={{ padding: '1px 6px', borderRadius: '4px', fontSize: '10px', background: 'rgba(34,197,94,0.1)', color: '#22c55e', fontWeight: 600 }}>پیش‌فرض</span>}
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 2px' }}>{loc.address}</p>
                      <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                        <span>{loc.city}</span>
                        {loc.postalCode && <span>کدپستی: {loc.postalCode}</span>}
                        {loc.phone && <span>تلفن: {loc.phone}</span>}
                      </div>
                    </div>
                  </label>
                ))}
                <button onClick={() => router.push('/account/locations')} style={{ padding: '8px', borderRadius: '8px', border: '1px dashed var(--border)', background: 'transparent', color: 'var(--primary)', cursor: 'pointer', fontSize: '13px', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Icons.Plus size={14} /> افزودن آدرس جدید</button>
              </div>
            )}
          </div>

          {/* Payment */}
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Icons.CreditCard size={18} /> روش پرداخت</h3>
            <div style={{ padding: '16px', borderRadius: '10px', border: '2px solid var(--primary)', background: 'rgba(37,99,235,0.04)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' }} />
              </div>
              <Icons.CreditCard size={20} color="var(--primary)" />
              <div>
                <p style={{ fontWeight: 600, fontSize: '14px', margin: 0 }}>پرداخت آنلاین</p>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>پرداخت از طریق درگاه بانکی</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right — Order Summary */}
        <div className="card" style={{ padding: '24px', position: 'sticky', top: '80px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px' }}>خلاصه سفارش</h3>

          <div style={{ maxHeight: '240px', overflowY: 'auto', marginBottom: '16px' }}>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', gap: '10px', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
                <img src={item.image} alt="" style={{ width: '48px', height: '48px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: '13px', fontWeight: 500, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</p>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0' }}>×{item.quantity}</p>
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)', flexShrink: 0 }}>{(item.price * item.quantity).toLocaleString('fa-IR')}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>جمع کل</span><span>{total.toLocaleString('fa-IR')} تومان</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>تخفیف (۵٪)</span><span style={{ color: '#22c55e' }}>-{discount.toLocaleString('fa-IR')} تومان</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: 'var(--text-secondary)' }}>ارسال</span><span>{shipping === 0 ? <span style={{ color: '#22c55e' }}>رایگان</span> : `${shipping.toLocaleString('fa-IR')} تومان`}</span></div>
            <div style={{ borderTop: '2px solid var(--border)', paddingTop: '10px', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, fontSize: '15px' }}>مبلغ قابل پرداخت</span>
              <span style={{ fontWeight: 800, fontSize: '18px', color: 'var(--primary)' }}>{finalPrice.toLocaleString('fa-IR')} تومان</span>
            </div>
          </div>

          <button onClick={placeOrder} disabled={!selectedLocation || cart.length === 0} className="btn btn-primary" style={{ width: '100%', marginTop: '16px', padding: '14px', fontSize: '15px', borderRadius: '12px', opacity: (!selectedLocation || cart.length === 0) ? 0.5 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            <Icons.CreditCard size={18} /> پرداخت آنلاین
          </button>

          <button onClick={() => router.push('/cart')} style={{ width: '100%', marginTop: '8px', padding: '10px', borderRadius: '10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '13px' }}>بازگشت به سبد خرید</button>
        </div>
      </div>
    </div>
  );
}
