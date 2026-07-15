'use client';

import { useState, useRef, useEffect } from 'react';
import { Icons } from '../../components/Icons';
import { api } from '../../lib/api';

interface Campaign { id: string; name: string; type: string; status: string; discount: string; startDate: string; endDate: string; usageCount: number; }
interface Coupon { id: string; code: string; type: string; value: string; usageCount: number; maxUsage: number; status: string; }
interface BannerImage { id: string; url: string; name: string; }
interface Banner { id: string; name: string; position: string; images: BannerImage[]; }

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState('campaigns');
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);

  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [showBannerModal, setShowBannerModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [bannerImages, setBannerImages] = useState<BannerImage[]>([]);
  const bannerFileRef = useRef<HTMLInputElement>(null);

  const tabs = [
    { id: 'campaigns', label: 'کمپین\u200cها', icon: <Icons.Megaphone size={14} /> },
    { id: 'coupons', label: 'کوپن\u200cها', icon: <Icons.Tag size={14} /> },
    { id: 'banners', label: 'بنرها', icon: <Icons.Image size={14} /> },
    { id: 'newsletter', label: 'خبرنامه', icon: <Icons.Mail size={14} /> },
  ];

  const refreshData = async () => {
    try {
      const [cData, cpData, bData] = await Promise.all([
        api.getCampaigns() as Promise<any[]>,
        api.getCoupons() as Promise<any[]>,
        api.getBanners() as Promise<any[]>,
      ]);
      setCampaigns(cData.map((c: any) => ({ id: c.id, name: c.name, type: c.type, status: c.status, discount: c.discount, startDate: c.startDate, endDate: c.endDate, usageCount: c.usageCount })));
      setCoupons(cpData.map((c: any) => ({ id: c.id, code: c.code, type: c.type, value: c.value, usageCount: c.usageCount, maxUsage: c.maxUsage, status: c.status })));
      setBanners(bData.map((b: any) => ({ id: b.id, name: b.name, position: b.position, images: (b.images || []).map((img: any) => ({ id: img.id, url: img.url, name: img.name })) })));
    } catch (e) { console.error(e); }
  };

  useEffect(() => { refreshData(); }, []);

  const closeAllModals = () => { setShowCampaignModal(false); setShowCouponModal(false); setShowBannerModal(false); setEditingItem(null); setBannerImages([]); };

  const handleBannerImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    const remaining = 5 - bannerImages.length;
    if (remaining <= 0) { alert('حداکثر ۵ تصویر مجاز است'); return; }
    Array.from(files).slice(0, remaining).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (event) => { setBannerImages(prev => [...prev, { id: Date.now().toString() + Math.random().toString(36).substr(2, 9), url: event.target?.result as string, name: file.name }]); };
      reader.readAsDataURL(file);
    });
    if (bannerFileRef.current) bannerFileRef.current.value = '';
  };

  const removeBannerImage = (id: string) => setBannerImages(prev => prev.filter(img => img.id !== id));

  const handleSaveCampaign = async () => {
    const name = (document.getElementById('c-name') as HTMLInputElement)?.value;
    const type = (document.getElementById('c-type') as HTMLSelectElement)?.value;
    const discount = (document.getElementById('c-discount') as HTMLInputElement)?.value;
    if (!name) { alert('نام ضروری است'); return; }
    try {
      if (editingItem) {
        await api.updateCampaign(editingItem.id, { name, type, discount });
      } else {
        await api.createCampaign({ name, type, discount: discount || '10%', status: 'scheduled', startDate: new Date().toISOString().split('T')[0], endDate: '', usageCount: 0 });
      }
      await refreshData();
      closeAllModals();
    } catch (e) { alert('خطا'); }
  };

  const handleSaveCoupon = async () => {
    const code = (document.getElementById('cp-code') as HTMLInputElement)?.value;
    const type = (document.getElementById('cp-type') as HTMLSelectElement)?.value;
    const value = (document.getElementById('cp-value') as HTMLInputElement)?.value;
    if (!code || !value) { alert('کد و مقدار ضروری است'); return; }
    try {
      if (editingItem) {
        await api.updateCoupon(editingItem.id, { code: code.toUpperCase(), type, value });
      } else {
        await api.createCoupon({ code: code.toUpperCase(), type, value: type === 'free_shipping' ? 'ارسال رایگان' : (type === 'fixed_amount' ? `$${value}` : `${value}%`), usageCount: 0, maxUsage: 0, status: 'active' });
      }
      await refreshData();
      closeAllModals();
    } catch (e) { alert('خطا'); }
  };

  const handleSaveBanner = async () => {
    const name = (document.getElementById('b-name') as HTMLInputElement)?.value;
    const position = (document.getElementById('b-position') as HTMLSelectElement)?.value;
    if (!name) { alert('نام ضروری است'); return; }
    try {
      if (editingItem) {
        await api.updateBanner(editingItem.id, { name, position, images: bannerImages.map(img => ({ url: img.url, name: img.name })) });
      } else {
        await api.createBanner({ name, position, images: bannerImages.map(img => ({ url: img.url, name: img.name })) });
      }
      await refreshData();
      closeAllModals();
    } catch (e) { alert('خطا'); }
  };

  const handleDeleteCampaign = async (id: string) => { if (confirm('حذف شود؟')) { await api.deleteCampaign(id); await refreshData(); } };
  const handleDeleteCoupon = async (id: string) => { if (confirm('حذف شود؟')) { await api.deleteCoupon(id); await refreshData(); } };
  const handleDeleteBanner = async (id: string) => { if (confirm('حذف شود؟')) { await api.deleteBanner(id); await refreshData(); } };

  const btnGreen = 'btn btn-success btn-sm';
  const btnSmall = 'btn btn-ghost btn-xs';
  const btnSmallRed = 'btn btn-danger btn-xs';
  const tdStyle: React.CSSProperties = { padding: '12px', fontSize: '13px', borderBottom: '1px solid var(--border-light)' };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', background: 'var(--input-bg)', color: 'var(--text)' };
  const modalTitle: React.CSSProperties = { margin: 0, fontSize: '16px', fontWeight: 600 };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'campaigns': return (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ margin: 0 }}>کمپین\u200cها</h2>
            <button onClick={() => { setEditingItem(null); setShowCampaignModal(true); }} className={btnGreen}><Icons.Plus size={14} /> جدید</button>
          </div>
          <div className="table-container">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>
                <th style={tdStyle}>نام</th><th style={tdStyle}>نوع</th><th style={tdStyle}>تخفیف</th><th style={tdStyle}>وضعیت</th><th style={tdStyle}>عملیات</th>
              </tr></thead>
              <tbody>
                {campaigns.map(c => (
                  <tr key={c.id}>
                    <td style={tdStyle}>{c.name}</td><td style={tdStyle}>{c.type}</td>
                    <td style={{ ...tdStyle, color: '#22c55e', fontWeight: 600 }}>{c.discount}</td>
                    <td style={tdStyle}><span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', background: c.status === 'active' ? 'var(--badge-success-bg)' : 'var(--hover-bg)', color: c.status === 'active' ? 'var(--badge-success-text)' : 'var(--text-secondary)' }}>{c.status === 'active' ? 'فعال' : c.status === 'scheduled' ? 'برنامه\u200cریزی شده' : 'پایان یافته'}</span></td>
                    <td style={tdStyle}><div style={{ display: 'flex', gap: '4px' }}><button onClick={() => { setEditingItem(c); setShowCampaignModal(true); }} className={btnSmall}><Icons.Edit size={14} /></button><button onClick={() => handleDeleteCampaign(c.id)} className={btnSmallRed}><Icons.Trash size={14} /></button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
      case 'coupons': return (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ margin: 0 }}>کوپن\u200cها</h2>
            <button onClick={() => { setEditingItem(null); setShowCouponModal(true); }} className={btnGreen}><Icons.Plus size={14} /> جدید</button>
          </div>
          <div className="table-container">
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead><tr>
                <th style={tdStyle}>کد</th><th style={tdStyle}>نوع</th><th style={tdStyle}>مقدار</th><th style={tdStyle}>وضعیت</th><th style={tdStyle}>عملیات</th>
              </tr></thead>
              <tbody>
                {coupons.map(c => (
                  <tr key={c.id}>
                    <td style={{ ...tdStyle, fontFamily: 'monospace', fontWeight: 600 }}>{c.code}</td><td style={tdStyle}>{c.type}</td>
                    <td style={{ ...tdStyle, color: '#22c55e', fontWeight: 600 }}>{c.value}</td>
                    <td style={tdStyle}><span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', background: c.status === 'active' ? 'var(--badge-success-bg)' : 'var(--hover-bg)', color: c.status === 'active' ? 'var(--badge-success-text)' : 'var(--text-secondary)' }}>{c.status === 'active' ? 'فعال' : 'غیرفعال'}</span></td>
                    <td style={tdStyle}><div style={{ display: 'flex', gap: '4px' }}><button onClick={() => { setEditingItem(c); setShowCouponModal(true); }} className={btnSmall}><Icons.Edit size={14} /> ویرایش</button><button onClick={() => handleDeleteCoupon(c.id)} className={btnSmallRed}><Icons.Trash size={14} /> حذف</button></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
      case 'banners': return (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ margin: 0 }}>بنرها</h2>
            <button onClick={() => { setEditingItem(null); setBannerImages([]); setShowBannerModal(true); }} className={btnGreen}><Icons.Plus size={14} /> جدید</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
            {banners.map(b => (
              <div key={b.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                <div style={{ height: '150px', background: b.images.length > 0 ? `url(${b.images[0].url}) center/cover` : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  {b.images.length > 0 && <span style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Image size={11} /> {b.images.length} تصویر</span>}
                </div>
                <div style={{ padding: '12px' }}>
                  <h3 style={{ margin: '0 0 4px', fontSize: '14px', fontWeight: 600 }}>{b.name}</h3>
                  <p style={{ margin: '0 0 8px', fontSize: '12px', color: 'var(--text-muted)' }}>موقعیت: {b.position}</p>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button onClick={() => { setEditingItem(b); setBannerImages(b.images); setShowBannerModal(true); }} className={btnSmall}><Icons.Edit size={14} /> ویرایش</button>
                    <button onClick={() => handleDeleteBanner(b.id)} className={btnSmallRed}><Icons.Trash size={14} /> حذف</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
      case 'newsletter': return (
        <div>
          <h2 style={{ margin: '0 0 16px' }}>خبرنامه</h2>
          <div className="card">
            <p style={{ color: 'var(--text-secondary)', marginBottom: '16px' }}>مدیریت ایمیل\u200cهای خبرنامه</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '12px' }}>
              {[{ l: 'مشترکین', v: '1,234', ic: <Icons.Users size={20} /> }, { l: 'نرخ بازشدن', v: '45.2%', ic: <Icons.TrendingUp size={20} /> }, { l: 'نرخ کلیک', v: '12.8%', ic: <Icons.ExternalLink size={20} /> }, { l: 'ایمیل ارسالی', v: '3,456', ic: <Icons.Mail size={20} /> }].map((s, i) => (
                <div key={i} style={{ textAlign: 'center', padding: '16px', background: 'var(--table-header-bg)', borderRadius: '8px' }}>
                  <div style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>{s.ic}</div>
                  <p style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>{s.v}</p>
                  <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>{s.l}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 20px' }}>بازاریابی</h1>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '10px 20px', borderRadius: '8px', border: 'none', background: activeTab === tab.id ? 'var(--primary)' : 'transparent', color: activeTab === tab.id ? 'white' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: 500, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>
      {renderTabContent()}

      <input ref={bannerFileRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={handleBannerImageUpload} />

      {/* Campaign Modal */}
      {showCampaignModal && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={modalTitle}>{editingItem ? 'ویرایش کمپین' : 'کمپین جدید'}</h2>
              <button onClick={closeAllModals} className="btn-close"><Icons.X size={20} /></button>
            </div>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div><label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>نام</label><input id="c-name" defaultValue={editingItem?.name} style={inputStyle} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>نوع</label><select id="c-type" defaultValue={editingItem?.type || 'seasonal'} style={inputStyle}><option value="seasonal">فصلی</option><option value="welcome">خوشامدگویی</option><option value="loyalty">وفاداری</option></select></div>
                <div><label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>تخفیف</label><input id="c-discount" defaultValue={editingItem?.discount} style={inputStyle} /></div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button onClick={handleSaveCampaign} className="btn btn-success" style={{ flex: 1 }}>{editingItem ? 'ذخیره' : 'ایجاد'}</button>
              <button onClick={closeAllModals} className="btn btn-ghost" style={{ flex: 1 }}>انصراف</button>
            </div>
          </div>
        </div>
      )}

      {/* Coupon Modal */}
      {showCouponModal && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={modalTitle}>{editingItem ? 'ویرایش کوپن' : 'کوپن جدید'}</h2>
              <button onClick={closeAllModals} className="btn-close"><Icons.X size={20} /></button>
            </div>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div><label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>کد</label><input id="cp-code" defaultValue={editingItem?.code} style={inputStyle} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>نوع</label><select id="cp-type" defaultValue={editingItem?.type || 'percentage'} style={inputStyle}><option value="percentage">درصدی</option><option value="fixed_amount">مبلغ ثابت</option><option value="free_shipping">ارسال رایگان</option></select></div>
                <div><label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>مقدار</label><input id="cp-value" defaultValue={editingItem?.value} style={inputStyle} /></div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button onClick={handleSaveCoupon} className="btn btn-success" style={{ flex: 1 }}>{editingItem ? 'ذخیره' : 'ایجاد'}</button>
              <button onClick={closeAllModals} className="btn btn-ghost" style={{ flex: 1 }}>انصراف</button>
            </div>
          </div>
        </div>
      )}

      {/* Banner Modal */}
      {showBannerModal && (
        <div className="modal-overlay" onClick={closeAllModals}>
          <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={modalTitle}>{editingItem ? 'ویرایش بنر' : 'بنر جدید'}</h2>
              <button onClick={closeAllModals} className="btn-close"><Icons.X size={20} /></button>
            </div>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div><label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>نام</label><input id="b-name" defaultValue={editingItem?.name} style={inputStyle} /></div>
              <div><label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>موقعیت</label><select id="b-position" defaultValue={editingItem?.position || 'home'} style={inputStyle}><option value="home">صفحه خانه</option><option value="category">دسته\u200cبندی</option><option value="product">محصول</option></select></div>
              <div>
                <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>تصاویر (حداکثر ۵)</label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '8px' }}>
                  {bannerImages.map(img => (
                    <div key={img.id} style={{ position: 'relative', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                      <img src={img.url} alt={img.name} style={{ width: '100%', height: '80px', objectFit: 'cover', display: 'block' }} />
                      <button onClick={() => removeBannerImage(img.id)} className="btn-close" style={{ position: 'absolute', top: '4px', right: '4px', width: '20px', height: '20px', borderRadius: '50%', background: 'var(--danger)', color: 'white', fontSize: '10px' }}><Icons.X size={10} /></button>
                    </div>
                  ))}
                  {bannerImages.length < 5 && (
                    <button onClick={() => bannerFileRef.current?.click()} style={{ height: '80px', border: '2px dashed var(--border)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'transparent', color: 'var(--text-muted)', fontSize: '11px', flexDirection: 'column', gap: '4px' }}>
                      <Icons.Plus size={16} />
                      انتخاب تصویر
                    </button>
                  )}
                </div>
                <p style={{ margin: '4px 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>{bannerImages.length} از ۵ تصویر انتخاب شده</p>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button onClick={handleSaveBanner} className="btn btn-success" style={{ flex: 1 }}>{editingItem ? 'ذخیره' : 'ایجاد'}</button>
              <button onClick={closeAllModals} className="btn btn-ghost" style={{ flex: 1 }}>انصراف</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
