'use client';

import { useState } from 'react';

interface Campaign { id: string; name: string; type: string; status: 'active' | 'scheduled' | 'ended'; discount: string; startDate: string; endDate: string; usageCount: number; }
interface Coupon { id: string; code: string; type: string; value: string; usageCount: number; maxUsage: number; status: 'active' | 'expired' | 'disabled'; }
interface Banner { id: string; name: string; position: string; image: string; }

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    { id: '1', name: 'حراج فصل تابستان', type: 'فصلی', status: 'active', discount: '30%', startDate: '2024-06-01', endDate: '2024-06-30', usageCount: 456 },
    { id: '2', name: 'تخفیف مشتریان جدید', type: 'خوشامدگویی', status: 'active', discount: '20%', startDate: '2024-01-01', endDate: '2024-12-31', usageCount: 234 },
    { id: '3', name: 'فلاش سیل عید', type: 'فلاش سیل', status: 'ended', discount: '50%', startDate: '2024-03-20', endDate: '2024-03-25', usageCount: 890 },
  ]);
  const [coupons, setCoupons] = useState<Coupon[]>([
    { id: '1', code: 'WELCOME20', type: 'درصدی', value: '20%', usageCount: 234, maxUsage: 500, status: 'active' },
    { id: '2', code: 'SUMMER30', type: 'درصدی', value: '30%', usageCount: 456, maxUsage: 1000, status: 'active' },
    { id: '3', code: 'FLAT50', type: 'مبلغ ثابت', value: '$50', usageCount: 123, maxUsage: 200, status: 'active' },
  ]);
  const [banners, setBanners] = useState<Banner[]>([
    { id: '1', name: 'بنر اصلی صفحه خانه', position: 'home', image: '🏠' },
    { id: '2', name: 'بنر دسته‌بندی موبایل', position: 'mobile', image: '📱' },
  ]);

  // Modals
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [editType, setEditType] = useState<'campaign' | 'coupon' | 'banner' | null>(null);

  const tabs = [
    { id: 'campaigns', label: 'کمپین‌ها', icon: '📣' },
    { id: 'coupons', label: 'کوپن‌ها', icon: '🎫' },
    { id: 'banners', label: 'بنرها', icon: '🖼️' },
    { id: 'newsletter', label: 'خبرنامه', icon: '📧' },
  ];

  // Open add modal
  const openAddModal = (type: 'campaign' | 'coupon' | 'banner') => {
    setEditingItem(null);
    setEditType(type);
    if (type === 'campaign') setShowCampaignModal(true);
    if (type === 'coupon') setShowCouponModal(true);
    if (type === 'banner') setShowBannerModal(true);
  };

  // Open edit modal
  const openEditModal = (type: 'campaign' | 'coupon' | 'banner', item: any) => {
    setEditingItem(item);
    setEditType(type);
    if (type === 'campaign') setShowCampaignModal(true);
    if (type === 'coupon') setShowCouponModal(true);
    if (type === 'banner') setShowBannerModal(true);
  };

  // Close all modals
  const closeAllModals = () => {
    setShowCampaignModal(false);
    setShowCouponModal(false);
    setShowBannerModal(false);
    setEditingItem(null);
    setEditType(null);
  };

  // Delete handlers
  const handleDeleteCampaign = (id: string) => {
    if (confirm('آیا از حذف این کمپین اطمینان دارید؟')) {
      setCampaigns(campaigns.filter(c => c.id !== id));
    }
  };
  const handleDeleteCoupon = (id: string) => {
    if (confirm('آیا از حذف این کوپن اطمینان دارید؟')) {
      setCoupons(coupons.filter(c => c.id !== id));
    }
  };
  const handleDeleteBanner = (id: string) => {
    if (confirm('آیا از حذف این بنر اطمینان دارید؟')) {
      setBanners(banners.filter(b => b.id !== id));
    }
  };

  // Save handlers
  const handleSaveCampaign = () => {
    const name = (document.getElementById('c-name') as HTMLInputElement)?.value;
    const type = (document.getElementById('c-type') as HTMLSelectElement)?.value;
    const discount = (document.getElementById('c-discount') as HTMLInputElement)?.value;
    if (!name) { alert('نام ضروری است'); return; }
    if (editingItem) {
      setCampaigns(campaigns.map(c => c.id === editingItem.id ? { ...c, name, type, discount } : c));
    } else {
      setCampaigns([{ id: Date.now().toString(), name, type, status: 'scheduled', discount: discount || '10%', startDate: new Date().toISOString().split('T')[0], endDate: '', usageCount: 0 }, ...campaigns]);
    }
    closeAllModals();
    alert(editingItem ? 'کمپین بروزرسانی شد!' : 'کمپین اضافه شد!');
  };

  const handleSaveCoupon = () => {
    const code = (document.getElementById('cp-code') as HTMLInputElement)?.value;
    const type = (document.getElementById('cp-type') as HTMLSelectElement)?.value;
    const value = (document.getElementById('cp-value') as HTMLInputElement)?.value;
    if (!code || !value) { alert('کد و مقدار ضروری است'); return; }
    if (editingItem) {
      setCoupons(coupons.map(c => c.id === editingItem.id ? { ...c, code: code.toUpperCase(), type, value } : c));
    } else {
      setCoupons([{ id: Date.now().toString(), code: code.toUpperCase(), type, value: type === 'free_shipping' ? 'ارسال رایگان' : (type === 'fixed_amount' ? `$${value}` : `${value}%`), usageCount: 0, maxUsage: 0, status: 'active' }, ...coupons]);
    }
    closeAllModals();
    alert(editingItem ? 'کوپن بروزرسانی شد!' : 'کوپن اضافه شد!');
  };

  const handleSaveBanner = () => {
    const name = (document.getElementById('b-name') as HTMLInputElement)?.value;
    const position = (document.getElementById('b-position') as HTMLSelectElement)?.value;
    if (!name) { alert('نام ضروری است'); return; }
    const icons: Record<string, string> = { home: '🏠', mobile: '📱', category: '📁', sale: '🏷️' };
    if (editingItem) {
      setBanners(banners.map(b => b.id === editingItem.id ? { ...b, name, position, image: icons[position] || '🖼️' } : b));
    } else {
      setBanners([{ id: Date.now().toString(), name, position, image: icons[position] || '🖼️' }, ...banners]);
    }
    closeAllModals();
    alert(editingItem ? 'بنر بروزرسانی شد!' : 'بنر اضافه شد!');
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 24px' }}>بازاریابی</h1>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'white', borderRadius: '12px', padding: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: activeTab === tab.id ? '#2563eb' : 'transparent', color: activeTab === tab.id ? 'white' : '#374151', cursor: 'pointer', fontWeight: 500, fontSize: '14px' }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Campaigns */}
      {activeTab === 'campaigns' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '18px' }}>کمپین‌ها</h2>
            <button onClick={() => openAddModal('campaign')} style={btnGreen}>➕ کمپین جدید</button>
          </div>
          <div style={tableContainer}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={theadStyle}>
                <th style={thStyle}>نام</th><th style={thStyle}>نوع</th><th style={thStyle}>تخفیف</th><th style={thStyle}>وضعیت</th><th style={thStyle}>عملیات</th>
              </tr></thead>
              <tbody>
                {campaigns.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={tdStyle}><strong>{c.name}</strong></td>
                    <td style={tdStyle}>{c.type}</td>
                    <td style={tdStyle}><span style={{ color: '#22c55e', fontWeight: 600 }}>{c.discount}</span></td>
                    <td style={tdStyle}><span style={statusBadge(c.status)}>{c.status === 'active' ? 'فعال' : c.status === 'scheduled' ? 'برنامه‌ریزی' : 'پایان'}</span></td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button onClick={() => openEditModal('campaign', c)} style={btnSmall}>✏️</button>
                        <button onClick={() => handleDeleteCampaign(c.id)} style={btnSmallRed}>🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Coupons */}
      {activeTab === 'coupons' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '18px' }}>کوپن‌ها</h2>
            <button onClick={() => openAddModal('coupon')} style={btnGreen}>➕ کوپن جدید</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {coupons.map(c => (
              <div key={c.id} style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #e5e7eb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '16px' }}>{c.code}</span>
                  <span style={statusBadge(c.status)}>{c.status === 'active' ? 'فعال' : 'منقضی'}</span>
                </div>
                <p style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 700, color: '#2563eb' }}>{c.value}</p>
                <p style={{ margin: '0 0 12px', fontSize: '12px', color: '#64748b' }}>استفاده: {c.usageCount} / {c.maxUsage || '∞'}</p>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button onClick={() => openEditModal('coupon', c)} style={{ ...btnSmall, flex: 1 }}>✏️ ویرایش</button>
                  <button onClick={() => handleDeleteCoupon(c.id)} style={{ ...btnSmallRed, flex: 1 }}>🗑️ حذف</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Banners */}
      {activeTab === 'banners' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '18px' }}>بنرها</h2>
            <button onClick={() => openAddModal('banner')} style={btnGreen}>➕ بنر جدید</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {banners.map(b => (
              <div key={b.id} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                <div style={{ height: '120px', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '48px' }}>{b.image}</div>
                <div style={{ padding: '12px' }}>
                  <p style={{ margin: 0, fontWeight: 500 }}>{b.name}</p>
                  <p style={{ margin: '4px 0 12px', fontSize: '12px', color: '#64748b' }}>موقعیت: {b.position}</p>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button onClick={() => openEditModal('banner', b)} style={{ ...btnSmall, flex: 1 }}>✏️ ویرایش</button>
                    <button onClick={() => handleDeleteBanner(b.id)} style={{ ...btnSmallRed, flex: 1 }}>🗑️ حذف</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Newsletter */}
      {activeTab === 'newsletter' && (
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb' }}>
          <h2 style={{ margin: '0 0 16px', fontSize: '18px' }}>خبرنامه</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[{ l: 'مشترکین', v: '2,345', c: '#2563eb' }, { l: 'نرخ بازشدن', v: '45%', c: '#22c55e' }, { l: 'نرخ کلیک', v: '12%', c: '#8b5cf6' }].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '16px', background: '#f8fafc', borderRadius: '8px' }}>
                <p style={{ fontSize: '24px', fontWeight: 700, color: s.c, margin: 0 }}>{s.v}</p>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== MODALS ===== */}

      {/* Campaign Modal */}
      {showCampaignModal && (
        <div style={overlay} onClick={closeAllModals}>
          <div style={modal} onClick={e => e.stopPropagation()}>
            <h2 style={modalTitle}>{editingItem ? '✏️ ویرایش کمپین' : '➕ کمپین جدید'}</h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div><label style={labelStyle}>نام کمپین *</label><input id="c-name" style={inputStyle} defaultValue={editingItem?.name || ''} placeholder="نام کمپین" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label style={labelStyle}>نوع</label><select id="c-type" style={inputStyle} defaultValue={editingItem?.type || 'فصلی'}><option value="فصلی">فصلی</option><option value="فلاش سیل">فلاش سیل</option><option value="خوشامدگویی">خوشامدگویی</option><option value="ارسال رایگان">ارسال رایگان</option></select></div>
                <div><label style={labelStyle}>تخفیف</label><input id="c-discount" style={inputStyle} defaultValue={editingItem?.discount || ''} placeholder="مثال: 20%" /></div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button onClick={handleSaveCampaign} style={{ ...btnGreen, flex: 1 }}>💾 ذخیره</button>
                <button onClick={closeAllModals} style={{ ...btnGray, flex: 1 }}>انصراف</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {showCouponModal && (
        <div style={overlay} onClick={closeAllModals}>
          <div style={modal} onClick={e => e.stopPropagation()}>
            <h2 style={modalTitle}>{editingItem ? '✏️ ویرایش کوپن' : '🎫 کوپن جدید'}</h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div><label style={labelStyle}>کد کوپن *</label><input id="cp-code" style={inputStyle} defaultValue={editingItem?.code || ''} placeholder="مثال: SUMMER30" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label style={labelStyle}>نوع</label><select id="cp-type" style={inputStyle} defaultValue={editingItem?.type || 'درصدی'}><option value="percentage">درصدی</option><option value="fixed_amount">مبلغ ثابت</option><option value="free_shipping">ارسال رایگان</option></select></div>
                <div><label style={labelStyle}>مقدار *</label><input id="cp-value" style={inputStyle} defaultValue={editingItem?.value || ''} placeholder="مثال: 20" /></div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button onClick={handleSaveCoupon} style={{ ...btnGreen, flex: 1 }}>💾 ذخیره</button>
                <button onClick={closeAllModals} style={{ ...btnGray, flex: 1 }}>انصراف</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Banner Modal */}
      {showBannerModal && (
        <div style={overlay} onClick={closeAllModals}>
          <div style={modal} onClick={e => e.stopPropagation()}>
            <h2 style={modalTitle}>{editingItem ? '✏️ ویرایش بنر' : '🖼️ بنر جدید'}</h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div><label style={labelStyle}>نام بنر *</label><input id="b-name" style={inputStyle} defaultValue={editingItem?.name || ''} placeholder="نام بنر" /></div>
              <div><label style={labelStyle}>موقعیت</label><select id="b-position" style={inputStyle} defaultValue={editingItem?.position || 'home'}><option value="home">صفحه خانه</option><option value="mobile">موبایل</option><option value="category">دسته‌بندی</option><option value="sale">تخفیف‌ها</option></select></div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button onClick={handleSaveBanner} style={{ ...btnGreen, flex: 1 }}>💾 ذخیره</button>
                <button onClick={closeAllModals} style={{ ...btnGray, flex: 1 }}>انصراف</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const overlay = { position: 'fixed' as const, top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 };
const modal = { background: 'white', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '450px' };
const modalTitle = { margin: '0 0 16px', fontSize: '18px', fontWeight: 600 };
const labelStyle = { display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500, color: '#374151' };
const inputStyle = { width: '100%', padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '13px', outline: 'none' };
const btnGreen = { padding: '10px 16px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, fontSize: '13px' };
const btnGray = { padding: '10px 16px', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' };
const btnSmall = { padding: '6px 12px', background: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 500 };
const btnSmallRed = { padding: '6px 12px', background: '#fee2e2', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 500, color: '#991b1b' };
const thStyle = { textAlign: 'right' as const, padding: '14px 16px', fontSize: '13px', fontWeight: 600, color: '#374151', borderBottom: '1px solid #e5e7eb' };
const tdStyle = { padding: '14px 16px', fontSize: '14px', color: '#374151' };
const tableContainer = { background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' };
const theadStyle = { background: '#f8fafc' };
const statusBadge = (status: string) => ({ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', background: status === 'active' ? '#dcfce7' : status === 'scheduled' ? '#dbeafe' : '#e5e7eb', color: status === 'active' ? '#166534' : status === 'scheduled' ? '#1e40af' : '#374151' });
