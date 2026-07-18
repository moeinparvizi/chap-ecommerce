'use client';

import { useState, useEffect } from 'react';
import { Icons } from '@/app/components/Icons';

export default function ProfilePage() {
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', address: '', city: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    if (user) {
      const u = JSON.parse(user);
      setProfile({ name: u.name || '', email: u.email || '', phone: u.phone || '', address: u.address || '', city: u.city || '' });
    }
  }, []);

  const handleSave = () => {
    const user = localStorage.getItem('user');
    const u = user ? JSON.parse(user) : {};
    localStorage.setItem('user', JSON.stringify({ ...u, ...profile }));
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <h1 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 24px' }}>ویرایش پروفایل</h1>

      {saved && (
        <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(34,197,94,0.1)', color: '#22c55e', fontSize: '14px', fontWeight: 500, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icons.Check size={16} /> پروفایل با موفقیت ذخیره شد
        </div>
      )}

      <div className="card" style={{ padding: '24px' }}>
        {/* Avatar */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #1e40af, #3b82f6)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: '32px', fontWeight: 700 }}>
            {profile.name?.charAt(0) || 'U'}
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>{profile.name || 'کاربر'}</h3>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>{profile.email || ''}</p>
        </div>

        {/* Form */}
        <div style={{ display: 'grid', gap: '16px', maxWidth: '500px', margin: '0 auto' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>نام و نام خانوادگی</label>
            <input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none' }} />
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>ایمیل</label>
            <input type="email" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none' }} />
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>تلفن</label>
            <input type="text" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} placeholder="09123456789" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none' }} />
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>شهر</label>
            <input type="text" value={profile.city} onChange={e => setProfile({ ...profile, city: e.target.value })} placeholder="تهران" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none' }} />
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', display: 'block' }}>آدرس</label>
            <textarea value={profile.address} onChange={e => setProfile({ ...profile, address: e.target.value })} rows={3} placeholder="آدرس کامل..." style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', resize: 'vertical', outline: 'none', fontFamily: 'inherit' }} />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button onClick={handleSave} className="btn btn-primary" style={{ padding: '10px 24px', display: 'flex', alignItems: 'center', gap: '6px' }}><Icons.Save size={16} /> ذخیره تغییرات</button>
          </div>
        </div>
      </div>
    </div>
  );
}
