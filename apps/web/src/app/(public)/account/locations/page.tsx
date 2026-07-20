'use client';

import { useState, useEffect } from 'react';
import { Icons } from '@/app/components/Icons';
import { api } from '@/app/lib/api';
import { ListLoader } from '@/app/components/Loading';

const MAX_LOCATIONS = 5;

export default function LocationsPage() {
  const [locations, setLocations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: '', address: '', city: '', postalCode: '', phone: '' });
  const [saved, setSaved] = useState(false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setUserId(user.id || '');
    const token = localStorage.getItem('auth_token');
    if (!token) return;
    if (user.id) {
      api.getLocations(user.id).then((d: any) => { setLocations(d); setLoading(false); }).catch(() => setLoading(false));
    } else { setLoading(false); }
  }, []);

  const persist = (locs: any[]) => { setLocations(locs); };

  const openNew = () => { if (locations.length >= MAX_LOCATIONS) return; setEditing(null); setForm({ title: '', address: '', city: '', postalCode: '', phone: '' }); setShowForm(true); };
  const openEdit = (loc: any) => { setEditing(loc); setForm({ title: loc.title, address: loc.address, city: loc.city, postalCode: loc.postalCode || '', phone: loc.phone || '' }); setShowForm(true); };

  const saveForm = async () => {
    if (!form.title.trim() || !form.address.trim() || !form.city.trim()) return;
    try {
      if (editing) {
        await api.updateLocation(editing.id, form);
      } else {
        await api.createLocation({ ...form, userId, isDefault: locations.length === 0 });
      }
      const updated = await api.getLocations(userId);
      persist(updated);
    } catch (e) {}
    setShowForm(false); setEditing(null);
    setForm({ title: '', address: '', city: '', postalCode: '', phone: '' });
    setSaved(true); setTimeout(() => setSaved(false), 3000);
  };

  const deleteLocation = async (id: string) => {
    await api.deleteLocation(id);
    persist(locations.filter(l => l.id !== id));
  };

  const setDefault = async (id: string) => {
    await api.setDefaultLocation(id, userId);
    const updated = await api.getLocations(userId);
    persist(updated);
  };

  if (loading) return <div style={{ padding: '24px' }}><ListLoader count={3} /></div>;

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, margin: 0 }}>لوکیشنها</h1>
          <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>{locations.length} از {MAX_LOCATIONS} لوکیشن</p>
        </div>
        {locations.length < MAX_LOCATIONS && <button onClick={openNew} className="btn btn-primary" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}><Icons.Plus size={16} /> افزودن</button>}
      </div>

      {saved && <div style={{ padding: '12px 16px', borderRadius: '10px', background: 'rgba(34,197,94,0.1)', color: '#22c55e', fontSize: '14px', fontWeight: 500, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}><Icons.Check size={16} /> لوکیشن ذخیره شد</div>}

      {locations.length === 0 ? (
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <Icons.MapPin size={48} color="var(--text-muted)" />
          <h3 style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>هنوز لوکیشنی ثبت نکردهاید</h3>
          <button onClick={openNew} className="btn btn-primary" style={{ marginTop: '12px', padding: '10px 20px' }}><Icons.Plus size={16} /> افزودن لوکیشن</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '12px' }}>
          {locations.map(loc => (
            <div key={loc.id} className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: loc.isDefault ? 'rgba(34,197,94,0.1)' : 'var(--hover-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icons.MapPin size={20} color={loc.isDefault ? '#22c55e' : 'var(--text-muted)'} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, margin: 0 }}>{loc.title}</h3>
                    {loc.isDefault && <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '10px', background: 'rgba(34,197,94,0.1)', color: '#22c55e', fontWeight: 600 }}>پیشفرض</span>}
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', margin: '0 0 4px' }}>{loc.address}</p>
                  <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <span>{loc.city}</span>
                    {loc.postalCode && <span>کدپستی: {loc.postalCode}</span>}
                    {loc.phone && <span>تلفن: {loc.phone}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  {!loc.isDefault && <button onClick={() => setDefault(loc.id)} style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '12px' }}>پیشفرض</button>}
                  <button onClick={() => openEdit(loc)} style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontSize: '12px' }}><Icons.Edit size={12} /></button>
                  <button onClick={() => deleteLocation(loc.id)} style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--danger)', cursor: 'pointer', fontSize: '12px' }}><Icons.Trash size={12} /></button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }} onClick={() => { setShowForm(false); setEditing(null); }}>
          <div style={{ width: '100%', maxWidth: '480px', background: 'var(--card-bg)', borderRadius: '16px', padding: '24px', border: '1px solid var(--border)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0 }}>{editing ? 'ویرایش لوکیشن' : 'افزودن لوکیشن'}</h3>
              <button onClick={() => { setShowForm(false); setEditing(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '20px' }}>×</button>
            </div>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div><label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>عنوان *</label><input type="text" placeholder="مثلاً: خانه" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none' }} /></div>
              <div><label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>آدرس *</label><textarea placeholder="آدرس کامل..." value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} rows={2} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', resize: 'vertical', outline: 'none', fontFamily: 'inherit' }} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>شهر *</label><input type="text" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none' }} /></div>
                <div><label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>کد پستی</label><input type="text" value={form.postalCode} onChange={e => setForm({ ...form, postalCode: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none' }} /></div>
              </div>
              <div><label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>تلفن</label><input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none' }} /></div>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button onClick={() => { setShowForm(false); setEditing(null); }} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer' }}>انصراف</button>
              <button onClick={saveForm} disabled={!form.title.trim() || !form.address.trim() || !form.city.trim()} className="btn btn-primary" style={{ padding: '10px 20px', opacity: (!form.title.trim() || !form.address.trim() || !form.city.trim()) ? 0.5 : 1 }}><Icons.Check size={14} /> ذخیره</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
