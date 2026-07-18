'use client';

import { useState, useEffect } from 'react';
import { Icons } from '../../components/Icons';
import { api } from '../../lib/api';

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ name: '', percentage: 10, targetType: 'all', targetId: '', active: true, startDate: '', endDate: '' });

  useEffect(() => {
    api.getDiscounts().then((d: any) => setDiscounts(d)).catch(() => {});
    api.getProducts().then((d: any) => setProducts(d)).catch(() => {});
    api.getCategories().then((d: any) => setCategories(d)).catch(() => {});
  }, []);

  const openNew = () => { setEditing(null); setForm({ name: '', percentage: 10, targetType: 'all', targetId: '', active: true, startDate: '', endDate: '' }); setShowForm(true); };
  const openEdit = (d: any) => { setEditing(d); setForm({ name: d.name, percentage: d.percentage, targetType: d.targetType, targetId: d.targetId || '', active: d.active, startDate: d.startDate || '', endDate: d.endDate || '' }); setShowForm(true); };

  const saveForm = async () => {
    if (!form.name.trim() || form.percentage < 1 || form.percentage > 100) return;
    try {
      if (editing) { await api.updateDiscount(editing.id, form); }
      else { await api.createDiscount(form); }
      const d = await api.getDiscounts();
      setDiscounts(d);
    } catch (e) {}
    setShowForm(false); setEditing(null);
  };

  const deleteDiscount = async (id: string) => {
    if (!confirm('آیا از حذف این تخفیف اطمینان دارید؟')) return;
    await api.deleteDiscount(id);
    setDiscounts(discounts.filter(d => d.id !== id));
  };

  const toggleActive = async (d: any) => {
    await api.updateDiscount(d.id, { active: !d.active });
    setDiscounts(discounts.map(x => x.id === d.id ? { ...x, active: !x.active } : x));
  };

  const targetTypeLabels: Record<string, string> = { all: 'همه محصولات', product: 'محصول خاص', category: 'دسته‌بندی' };
  const getTargetName = (d: any) => {
    if (d.targetType === 'all') return 'همه محصولات';
    if (d.targetType === 'product') return products.find((p: any) => p.id === d.targetId)?.name || d.targetId;
    if (d.targetType === 'category') return categories.find((c: any) => c.id === d.targetId)?.name || d.targetId;
    return '—';
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>مدیریت تخفیف‌ها</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>{discounts.length} تخفیف فعال</p>
        </div>
        <button onClick={openNew} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'var(--primary)', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}><Icons.Plus size={16} /> افزودن تخفیف</button>
      </div>

      {discounts.length === 0 ? (
        <div className="card" style={{ padding: '60px', textAlign: 'center' }}>
          <Icons.DollarSign size={48} color="var(--text-muted)" />
          <h3 style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>هنوز تخفیفی ثبت نشده</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginBottom: '16px' }}>اولین تخفیف خود را ایجاد کنید</p>
          <button onClick={openNew} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'var(--primary)', color: 'white', cursor: 'pointer', fontSize: '14px', fontWeight: 600 }}>افزودن تخفیف</button>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>نام تخفیف</th>
                <th>درصد</th>
                <th>نوع</th>
                <th>هدف</th>
                <th>وضعیت</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {discounts.map(d => (
                <tr key={d.id}>
                  <td style={{ fontWeight: 600 }}>{d.name}</td>
                  <td><span style={{ padding: '4px 12px', borderRadius: '8px', fontSize: '14px', fontWeight: 700, background: 'rgba(34,197,94,0.1)', color: '#22c55e' }}>%{d.percentage}</span></td>
                  <td><span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '12px', background: 'var(--hover-bg)' }}>{targetTypeLabels[d.targetType]}</span></td>
                  <td style={{ fontSize: '13px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{getTargetName(d)}</td>
                  <td><button onClick={() => toggleActive(d)} style={{ padding: '4px 10px', borderRadius: '6px', border: 'none', fontSize: '12px', fontWeight: 600, cursor: 'pointer', background: d.active ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', color: d.active ? '#22c55e' : '#ef4444' }}>{d.active ? 'فعال' : 'غیرفعال'}</button></td>
                  <td>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => openEdit(d)} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer', fontSize: '12px' }}><Icons.Edit size={12} /></button>
                      <button onClick={() => deleteDiscount(d.id)} style={{ padding: '6px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--danger)', cursor: 'pointer', fontSize: '12px' }}><Icons.Trash size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }} onClick={() => { setShowForm(false); setEditing(null); }}>
          <div style={{ width: '100%', maxWidth: '500px', background: 'var(--card-bg)', borderRadius: '16px', padding: '24px', border: '1px solid var(--border)' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0 }}>{editing ? 'ویرایش تخفیف' : 'افزودن تخفیف'}</h3>
              <button onClick={() => { setShowForm(false); setEditing(null); }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '20px' }}>×</button>
            </div>

            <div style={{ display: 'grid', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>نام تخفیف *</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="مثلاً: تخفیف تابستانه" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none' }} />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>درصد تخفیف * ({form.percentage}%)</label>
                <input type="range" min={1} max={90} value={form.percentage} onChange={e => setForm({ ...form, percentage: Number(e.target.value) })} style={{ width: '100%', accentColor: 'var(--primary)' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)' }}><span>۱٪</span><span>۹۰٪</span></div>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>اعمال روی *</label>
                <select value={form.targetType} onChange={e => setForm({ ...form, targetType: e.target.value, targetId: '' })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none' }}>
                  <option value="all">همه محصولات</option>
                  <option value="product">یک محصول خاص</option>
                  <option value="category">یک دسته‌بندی</option>
                </select>
              </div>

              {form.targetType === 'product' && (
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>انتخاب محصول</label>
                  <select value={form.targetId} onChange={e => setForm({ ...form, targetId: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none' }}>
                    <option value="">انتخاب کنید</option>
                    {products.map((p: any) => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
              )}

              {form.targetType === 'category' && (
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>انتخاب دسته‌بندی</label>
                  <select value={form.targetId} onChange={e => setForm({ ...form, targetId: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none' }}>
                    <option value="">انتخاب کنید</option>
                    {categories.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>تاریخ شروع</label>
                  <input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none' }} />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>تاریخ پایان</label>
                  <input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none' }} />
                </div>
              </div>

              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '14px' }}>
                <input type="checkbox" checked={form.active} onChange={e => setForm({ ...form, active: e.target.checked })} style={{ accentColor: 'var(--primary)' }} /> فعال باشد
              </label>
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button onClick={() => { setShowForm(false); setEditing(null); }} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer' }}>انصراف</button>
              <button onClick={saveForm} disabled={!form.name.trim()} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'var(--primary)', color: 'white', cursor: 'pointer', fontWeight: 600, opacity: form.name.trim() ? 1 : 0.5 }}>ذخیره</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
