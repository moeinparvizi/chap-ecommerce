'use client';

import { useState, useRef, useEffect } from 'react';
import { Icons } from '../../components/Icons';

interface Campaign { id: string; name: string; type: string; status: 'active' | 'scheduled' | 'ended'; discount: string; startDate: string; endDate: string; usageCount: number; }
interface Coupon { id: string; code: string; type: string; value: string; usageCount: number; maxUsage: number; status: 'active' | 'expired' | 'disabled'; }
interface BannerImage { id: string; url: string; name: string; }
interface Banner { id: string; name: string; position: string; images: BannerImage[]; }

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);

  // Load from localStorage
  useEffect(() => {
    const savedCampaigns = localStorage.getItem('admin_campaigns');
    const savedCoupons = localStorage.getItem('admin_coupons');
    const savedBanners = localStorage.getItem('admin_banners');
    setCampaigns(savedCampaigns ? JSON.parse(savedCampaigns) : [
      { id: '1', name: 'حراج فصل تابستان', type: 'فصلی', status: 'active', discount: '30%', startDate: '2024-06-01', endDate: '2024-06-30', usageCount: 456 },
      { id: '2', name: 'تخفیف مشتریان جدید', type: 'خوشامدگویی', status: 'active', discount: '20%', startDate: '2024-01-01', endDate: '2024-12-31', usageCount: 234 },
    ]);
    setCoupons(savedCoupons ? JSON.parse(savedCoupons) : [
      { id: '1', code: 'WELCOME20', type: 'درصدی', value: '20%', usageCount: 234, maxUsage: 500, status: 'active' },
      { id: '2', code: 'SUMMER30', type: 'درصدی', value: '30%', usageCount: 456, maxUsage: 1000, status: 'active' },
    ]);
    setBanners(savedBanners ? JSON.parse(savedBanners) : [
      { id: '1', name: 'بنر اصلی صفحه خانه', position: 'home', images: [] },
      { id: '2', name: 'بنر دسته\u200cبندی موبایل', position: 'mobile', images: [] },
    ]);
  }, []);

  // Auto-save to localStorage
  useEffect(() => { if (campaigns.length > 0) localStorage.setItem('admin_campaigns', JSON.stringify(campaigns)); }, [campaigns]);
  useEffect(() => { if (coupons.length > 0) localStorage.setItem('admin_coupons', JSON.stringify(coupons)); }, [coupons]);
  useEffect(() => { if (banners.length > 0) localStorage.setItem('admin_banners', JSON.stringify(banners)); }, [banners]);

  // Modals
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  
  // Banner images state (up to 5)
  const [bannerImages, setBannerImages] = useState<BannerImage[]>([]);
  const bannerFileRef = useRef<HTMLInputElement>(null);

  const tabs = [
    { id: 'campaigns', label: 'کمپین‌ها', icon: <Icons.Megaphone size={14} /> },
    { id: 'coupons', label: 'کوپن‌ها', icon: <Icons.Tag size={14} /> },
    { id: 'banners', label: 'بنرها', icon: <Icons.Image size={14} /> },
    { id: 'newsletter', label: 'خبرنامه', icon: <Icons.Mail size={14} /> },
  ];

  const closeAllModals = () => {
    setShowCampaignModal(false);
    setShowCouponModal(false);
    setShowBannerModal(false);
    setEditingItem(null);
    setBannerImages([]);
  };

  // Banner image upload (supports up to 5 images)
  const handleBannerImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    const remainingSlots = 5 - bannerImages.length;
    if (remainingSlots <= 0) {
      alert('حداکثر ۵ تصویر مجاز است');
      return;
    }

    Array.from(files).slice(0, remainingSlots).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage: BannerImage = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          url: event.target?.result as string,
          name: file.name,
        };
        setBannerImages(prev => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });
    if (bannerFileRef.current) bannerFileRef.current.value = '';
  };

  const removeBannerImage = (id: string) => {
    setBannerImages(prev => prev.filter(img => img.id !== id));
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
  };

  const handleSaveBanner = () => {
    const name = (document.getElementById('b-name') as HTMLInputElement)?.value;
    const position = (document.getElementById('b-position') as HTMLSelectElement)?.value;
    if (!name) { alert('نام ضروری است'); return; }
    if (editingItem) {
      setBanners(banners.map(b => b.id === editingItem.id ? { ...b, name, position, images: [...bannerImages] } : b));
    } else {
      setBanners([{ id: Date.now().toString(), name, position, images: [...bannerImages] }, ...banners]);
    }
    closeAllModals();
  };

  const openAddBanner = () => {
    setEditingItem(null);
    setBannerImages([]);
    setShowBannerModal(true);
  };

  const openEditBanner = (banner: Banner) => {
    setEditingItem(banner);
    setBannerImages([...banner.images]);
    setShowBannerModal(true);
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 24px' }}>بازاریابی</h1>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', background: 'var(--card-bg)', borderRadius: '12px', padding: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
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
            <h2 style={{ margin: 0 }}>کمپین‌ها</h2>
            <button onClick={() => { setEditingItem(null); setShowCampaignModal(true); }} style={btnGreen}>{<Icons.Plus size={14} />} جدید</button>
          </div>
          <div style={tableContainer}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr style={theadStyle}><th style={thStyle}>نام</th><th style={thStyle}>نوع</th><th style={thStyle}>تخفیف</th><th style={thStyle}>وضعیت</th><th style={thStyle}>عملیات</th></tr></thead>
              <tbody>
                {campaigns.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                    <td style={tdStyle}><strong>{c.name}</strong></td>
                    <td style={tdStyle}>{c.type}</td>
                    <td style={tdStyle}><span style={{ color: '#22c55e', fontWeight: 600 }}>{c.discount}</span></td>
                    <td style={tdStyle}><span style={badge(c.status)}>{c.status === 'active' ? 'فعال' : c.status === 'scheduled' ? 'برنامه‌ریزی' : 'پایان'}</span></td>
                    <td style={tdStyle}><div style={{ display: 'flex', gap: '4px' }}><button onClick={() => { setEditingItem(c); setShowCampaignModal(true); }} style={btnSmall}>{<Icons.Edit size={14} />}</button><button onClick={() => setCampaigns(campaigns.filter(x => x.id !== c.id))} style={btnSmallRed}>{<Icons.Trash size={14} />}</button></div></td>
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
            <h2 style={{ margin: 0 }}>کوپن‌ها</h2>
            <button onClick={() => { setEditingItem(null); setShowCouponModal(true); }} style={btnGreen}>{<Icons.Plus size={14} />} جدید</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {coupons.map(c => (
              <div key={c.id} style={{ background: 'var(--card-bg)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{c.code}</span>
                  <span style={badge(c.status)}>{c.status === 'active' ? 'فعال' : 'منقضی'}</span>
                </div>
                <p style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 700, color: '#2563eb' }}>{c.value}</p>
                <p style={{ margin: '0 0 12px', fontSize: '12px', color: 'var(--text-secondary)' }}>استفاده: {c.usageCount} / {c.maxUsage || '∞'}</p>
                <div style={{ display: 'flex', gap: '4px' }}>
                  <button onClick={() => { setEditingItem(c); setShowCouponModal(true); }} style={{ ...btnSmall, flex: 1 }}>{<Icons.Edit size={14} />} ویرایش</button>
                  <button onClick={() => setCoupons(coupons.filter(x => x.id !== c.id))} style={{ ...btnSmallRed, flex: 1 }}>{<Icons.Trash size={14} />} حذف</button>
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
            <h2 style={{ margin: 0 }}>بنرها</h2>
            <button onClick={openAddBanner} style={btnGreen}>{<Icons.Plus size={14} />} جدید</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {banners.map(b => (
              <div key={b.id} style={{ background: 'var(--card-bg)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                <div style={{ height: '150px', background: b.images.length > 0 ? `url(${b.images[0].url}) center/cover` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  {b.images.length === 0 && <span style={{ color: 'white', fontSize: '24px', fontWeight: 600 }}>{b.name}</span>}
                  {b.images.length > 0 && <span style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '11px' }}>{<Icons.Image size={14} />} {b.images.length} تصویر</span>}
                </div>
                <div style={{ padding: '12px' }}>
                  <p style={{ margin: 0, fontWeight: 500 }}>{b.name}</p>
                  <p style={{ margin: '4px 0 12px', fontSize: '12px', color: 'var(--text-secondary)' }}>موقعیت: {b.position} | {b.images.length} تصویر</p>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button onClick={() => openEditBanner(b)} style={{ ...btnSmall, flex: 1 }}>{<Icons.Edit size={14} />} ویرایش</button>
                    <button onClick={() => setBanners(banners.filter(x => x.id !== b.id))} style={{ ...btnSmallRed, flex: 1 }}>{<Icons.Trash size={14} />} حذف</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Newsletter */}
      {activeTab === 'newsletter' && (
        <div style={{ background: 'var(--card-bg)', borderRadius: '12px', padding: '24px' }}>
          <h2 style={{ margin: '0 0 16px' }}>خبرنامه</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {[{ l: 'مشترکین', v: '2,345', c: '#2563eb' }, { l: 'نرخ بازشدن', v: '45%', c: '#22c55e' }, { l: 'نرخ کلیک', v: '12%', c: '#8b5cf6' }].map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '16px', background: 'var(--table-header-bg)', borderRadius: '8px' }}>
                <p style={{ fontSize: '24px', fontWeight: 700, color: s.c, margin: 0 }}>{s.v}</p>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>{s.l}</p>
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
            <h2 style={modalTitle}>{editingItem ? <>{<Icons.Edit size={14} />} ویرایش کمپین</> : <>{<Icons.Plus size={14} />} کمپین جدید</>}</h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div><label style={labelStyle}>نام کمپین *</label><input id="c-name" style={inputStyle} defaultValue={editingItem?.name || ''} placeholder="نام کمپین" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label style={labelStyle}>نوع</label><select id="c-type" style={inputStyle} defaultValue={editingItem?.type || 'فصلی'}><option value="فصلی">فصلی</option><option value="فلاش سیل">فلاش سیل</option><option value="خوشامدگویی">خوشامدگویی</option></select></div>
                <div><label style={labelStyle}>تخفیف</label><input id="c-discount" style={inputStyle} defaultValue={editingItem?.discount || ''} placeholder="20%" /></div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button onClick={handleSaveCampaign} style={{ ...btnGreen, flex: 1 }}>{<Icons.Save size={14} />} ذخیره</button>
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
            <h2 style={modalTitle}>{editingItem ? <>{<Icons.Edit size={14} />} ویرایش کوپن</> : <>{<Icons.Tag size={14} />} کوپن جدید</>}</h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div><label style={labelStyle}>کد کوپن *</label><input id="cp-code" style={inputStyle} defaultValue={editingItem?.code || ''} placeholder="SUMMER30" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label style={labelStyle}>نوع</label><select id="cp-type" style={inputStyle} defaultValue={editingItem?.type || 'درصدی'}><option value="percentage">درصدی</option><option value="fixed_amount">مبلغ ثابت</option><option value="free_shipping">ارسال رایگان</option></select></div>
                <div><label style={labelStyle}>مقدار *</label><input id="cp-value" style={inputStyle} defaultValue={editingItem?.value || ''} placeholder="20" /></div>
              </div>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button onClick={handleSaveCoupon} style={{ ...btnGreen, flex: 1 }}>{<Icons.Save size={14} />} ذخیره</button>
                <button onClick={closeAllModals} style={{ ...btnGray, flex: 1 }}>انصراف</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Banner Modal with Multi-Image Upload */}
      {showBannerModal && (
        <div style={overlay} onClick={closeAllModals}>
          <div style={{ ...modal, maxWidth: '550px' }} onClick={e => e.stopPropagation()}>
            <h2 style={modalTitle}>{editingItem ? <>{<Icons.Edit size={14} />} ویرایش بنر</> : <>{<Icons.Image size={14} />} بنر جدید</>}</h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div><label style={labelStyle}>نام بنر *</label><input id="b-name" style={inputStyle} defaultValue={editingItem?.name || ''} placeholder="نام بنر" /></div>
              
              <div><label style={labelStyle}>موقعیت</label>
                <select id="b-position" style={inputStyle} defaultValue={editingItem?.position || 'home'}>
                  <option value="home">صفحه خانه</option>
                  <option value="mobile">موبایل</option>
                  <option value="category">دسته‌بندی</option>
                  <option value="sale">تخفیف‌ها</option>
                </select>
              </div>

              {/* Multi-Image Upload Section */}
              <div>
                <label style={labelStyle}>تصاویر بنر ({bannerImages.length} از ۵)</label>
                
                {/* Images Grid */}
                {bannerImages.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '8px', marginBottom: '12px' }}>
                    {bannerImages.map((image) => (
                      <div key={image.id} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                        <img 
                          src={image.url} 
                          alt={image.name} 
                          style={{ width: '100%', height: '80px', objectFit: 'cover' }} 
                        />
                        <button 
                          onClick={() => removeBannerImage(image.id)}
                          style={{ 
                            position: 'absolute', 
                            top: '4px', 
                            right: '4px', 
                            width: '20px', 
                            height: '20px', 
                            borderRadius: '50%', 
                            background: '#ef4444', 
                            color: 'white', 
                            border: 'none', 
                            cursor: 'pointer',
                            fontSize: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >×</button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Upload Button */}
                <input 
                  ref={bannerFileRef}
                  type="file" 
                  accept="image/*" 
                  multiple
                  style={{ display: 'none' }} 
                  onChange={handleBannerImageUpload} 
                />
                <button 
                  onClick={() => bannerFileRef.current?.click()}
                  disabled={bannerImages.length >= 5}
                  style={{ 
                    width: '100%', 
                    padding: '12px', 
                    border: '2px dashed var(--border)', 
                    borderRadius: '8px', 
                    background: bannerImages.length >= 5 ? '#f9fafb' : 'white', 
                    cursor: bannerImages.length >= 5 ? 'not-allowed' : 'pointer',
                    color: bannerImages.length >= 5 ? '#9ca3af' : '#64748b',
                    fontSize: '14px'
                  }}
                >
                  {bannerImages.length >= 5 ? 'حداکثر ۵ تصویر' : <>{<Icons.Image size={14} />} کلیک کنید تا تصویر انتخاب کنید</>}
                </button>
                <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>PNG, JPG (حداکثر ۵ تصویر)</p>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button onClick={handleSaveBanner} style={{ ...btnGreen, flex: 1 }}>{<Icons.Save size={14} />} ذخیره</button>
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
const modal = { background: 'var(--card-bg)', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '450px' };
const modalTitle = { margin: '0 0 16px', fontSize: '18px', fontWeight: 600 };
const labelStyle = { display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500, color: 'var(--text)' };
const inputStyle = { width: '100%', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '13px', outline: 'none' };
const btnGreen = { padding: '10px 16px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, fontSize: '13px' };
const btnGray = { padding: '10px 16px', background: 'var(--hover-bg)', color: 'var(--text)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' };
const btnSmall = { padding: '6px 12px', background: 'var(--hover-bg)', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' };
const btnSmallRed = { padding: '6px 12px', background: '#fee2e2', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', color: '#991b1b' };
const thStyle = { textAlign: 'right' as const, padding: '14px 16px', fontSize: '13px', fontWeight: 600, color: 'var(--text)', borderBottom: '1px solid var(--border)' };
const tdStyle = { padding: '14px 16px', fontSize: '14px', color: 'var(--text)' };
const tableContainer = { background: 'var(--card-bg)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' };
const theadStyle = { background: 'var(--table-header-bg)' };
const badge = (status: string) => ({ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', background: status === 'active' ? '#dcfce7' : '#e5e7eb', color: status === 'active' ? '#166534' : '#374151' });
