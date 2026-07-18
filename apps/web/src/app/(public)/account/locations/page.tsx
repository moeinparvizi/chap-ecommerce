'use client';

import { useState, useEffect } from 'react';
import { Icons } from '@/app/components/Icons';

interface Location { id: string; title: string; address: string; city: string; postalCode: string; phone: string; isDefault: boolean; }

const MAX_LOCATIONS = 5;

export default function LocationsPage() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [editing, setEditing] = useState<Location | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', address: '', city: '', postalCode: '', phone: '' });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const savedLocs = localStorage.getItem(`locations_${user.id}`);
    if (savedLocs) setLocations(JSON.parse(savedLocs));
  }, []);

  const persist = (locs: Location[]) => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    localStorage.setItem(`locations_${user.id}`, JSON.stringify(locs));
    setLocations(locs);
  };

  const openNew = () => {
    if (locations.length >= MAX_LOCATIONS) return;
    setEditing(null);
    setForm({ title: '', address: '', city: '', postalCode: '', phone: '' });
    setShowForm(true);
  };

  const openEdit = (loc: Location) => {
    setEditing(loc);
    setForm({ title: loc.title, address: loc.address, city: loc.city, postalCode: loc.postalCode, phone: loc.phone });
    setShowForm(true);
  };

  const saveForm = () => {
    if (!form.title.trim() || !form.address.trim() || !form.city.trim()) return;
    if (editing) {
      const updated = locations.map(l => l.id === editing.id ? { ...l, ...form } : l);
      persist(updated);
    } else {
      const newLoc: Location = { id: Date.now().toString(), ...form, isDefault: locations.length === 0 };
      persist([...locations, newLoc]);
    }
    setShowForm(false);
    setEditing(null);
    setForm({ title: '', address: '', city: '', postalCode: '', phone: '' });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const deleteLocation = (id: string) => {
    const updated = locations.filter(l => l.id !== id);
    if (updated.length > 0 && !updated.some(l => l.isDefault)) updated[0].isDefault = true;
    persist(updated);
  };

  const setDefault = (id: string) => {
    persist(locations.map(l => ({ ...l, isDefault: l.id === id })));
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>لوکیشن‌ها</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>{locations.length} از {MAX_LOCATIONS} لوکیشن</p>
        </div>
        {locations.length < MAX_LOCATIONS && (
          <button onClick={openNew} className="btn btn-primary" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}><Icons.Plus size={16} /> افزودن لوکیشن</button>
        )}
      </div>

      {saved && (
        <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(34,197,94,0.1)', color: '#22c55e', fontSize: '14px', fontWeight: 500, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Icons.Check size={16} /> لوکیشن با موفقیت ذخیره شد
        </div>
      )}

      {locations.length === 0 ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <Icons.MapPin size={48} color="var(--text-muted)" />
          <h3 style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>هنوز لوکیشنی ثبت نکرده‌اید</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>حداکثر {MAX_LOCATIONS} لوکیشن می‌توانید ثبت کنید</p>
          <button onClick={openNew} className="btn btn-primary" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '6px', margin: '0 auto' }}><Icons.Plus size={16} /> افزودن لوکیشن</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {locations.map(loc => (
            <div key={loc.id} className="card" style={{ padding: '20px', position: 'relative' }}>
              {loc.isDefault && <span style={{ position: 'absolute', top: '12px', left: '12px', padding: '3px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>پیش‌فرض</span>}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: loc.isDefault ? 'rgba(34,197,94,0.1)' : 'var(--hover-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icons.MapPin size={20} color={loc.isDefault ? '#22c55e' : 'var(--text-muted)'} />
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '15px', fontWeight: 700, margin: '0 0 6px' }}>{loc.title}</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 2px', lineHeight: 1.5 }}>{loc.address}</p>
                  <div style={{ display: 'flex', gap: '16px', marginTop: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Package size={12} /> {loc.city}</span>
                    {loc.postalCode && <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>کدپستی: {loc.postalCode}</span>}
                    {loc.phone && <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>تلفن: {loc.phone}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  {!loc.isDefault && <button onClick={() => setDefault(loc.id)} style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '12px' }}>پیش‌فرض</button>}
                  <button onClick={() => openEdit(loc)} style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Edit size={12} /> ویرایش</button>
                  <button onClick={() => deleteLocation(loc.id)} style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--danger)', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Trash size={12} /> حذف</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }} onClick={() => { setShowForm(false); setEditing(null); }}>
          <div style={{ width: '100%', maxWidth: '480px', background: 'var(--card-bg)', borderRadius: '16px', padding: '24px', border: '1px solid var(--border)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0 }}>{editing ? 'ویرایش لوکیشن' : 'افزودن لوکیشن'}</h3>
              <button onClick={() => { setShowForm(false); setEditing(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '20px' }}>×</button>
            </div>

            <div style={{ display: 'grid', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>عنوان *</label>
                <input type="text" placeholder="مثلاً: خانه، محل کار" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>آدرس *</label>
                <textarea placeholder="آدرس کامل..." value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} rows={2} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', resize: 'vertical', outline: 'none', fontFamily: 'inherit' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>شهر *</label>
                  <input type="text" placeholder="تهران" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>کد پستی</label>
                  <input type="text" placeholder="1234567890" value={form.postalCode} onChange={e => setForm({ ...form, postalCode: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none' }} />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>تلفن</label>
                <input type="text" placeholder="09123456789" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none' }} />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button onClick={() => { setShowForm(false); setEditing(null); }} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontSize: '14px' }}>انصراف</button>
              <button onClick={saveForm} disabled={!form.title.trim() || !form.address.trim() || !form.city.trim()} className="btn btn-primary" style={{ padding: '10px 20px', opacity: (!form.title.trim() || !form.address.trim() || !form.city.trim()) ? 0.5 : 1 }}><Icons.Check size={14} /> {editing ? 'ذخیره تغییرات' : 'افزودن'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
