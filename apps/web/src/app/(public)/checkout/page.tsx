'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '@/app/components/Icons';

export default function CheckoutPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      localStorage.setItem('redirectAfterLogin', '/checkout');
      router.push('/auth/login');
      return;
    }
    setIsLoggedIn(true);
  }, [router]);

  if (!isLoggedIn) return null;

  return (
    <div>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 20px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 20px' }}>تکمیل خرید</h1>
        <div style={{ display: 'grid', gap: '20px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px' }}>اطلاعات ارسال</h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <input type="text" placeholder="نام و نام خانوادگی" className="input" />
              <input type="text" placeholder="آدرس" className="input" />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <input type="text" placeholder="شهر" className="input" />
                <input type="text" placeholder="کد پستی" className="input" />
              </div>
              <input type="text" placeholder="تلفن" className="input" />
            </div>
          </div>
          <div className="card" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 700, margin: '0 0 16px' }}>روش پرداخت</h3>
            <div style={{ display: 'grid', gap: '10px' }}>
              {['پرداخت آنلاین', 'پرداخت درب منزل', 'کارت به کارت'].map((method, i) => (
                <label key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '10px', border: '2px solid var(--border)', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                  <input type="radio" name="payment" defaultChecked={i === 0} style={{ accentColor: 'var(--primary)' }} />
                  <span style={{ fontSize: '14px', fontWeight: 500 }}>{method}</span>
                </label>
              ))}
            </div>
          </div>
          <button className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '15px' }}><Icons.CreditCard size={18} /> ثبت سفارش</button>
        </div>
      </div>
    </div>
  );
}
