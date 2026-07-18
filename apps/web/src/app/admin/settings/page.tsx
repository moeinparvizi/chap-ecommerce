'use client';

import { useState, useEffect } from 'react';
import { Icons } from '../../components/Icons';
import { useNotification } from '../../lib/notifications';
import { getSiteSettings, saveSiteSettings, SiteSettings, SiteBanner } from '../../lib/site-settings';

type Tab = 'banners' | 'footer' | 'siteInfo';

export default function SettingsPage() {
  const notify = useNotification();
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('siteInfo');
  const [editingBanner, setEditingBanner] = useState<SiteBanner | null>(null);
  const [showBannerForm, setShowBannerForm] = useState(false);

  useEffect(() => { setSettings(getSiteSettings()); }, []);

  const save = (newSettings: SiteSettings) => {
    setSettings(newSettings);
    saveSiteSettings(newSettings);
    notify?.success('تنظیمات ذخیره شد');
  };

  if (!settings) return null;

  const tabs: { key: Tab; label: string; icon: any }[] = [
    { key: 'siteInfo', label: 'اطلاعات سایت', icon: 'Settings' },
    { key: 'banners', label: 'بنرها', icon: 'Image' },
    { key: 'footer', label: 'فوتر', icon: 'Layout' },
  ];

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 24px' }}>تنظیمات سایت</h1>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '2px solid var(--border)', paddingBottom: 0 }}>
        {tabs.map(tab => {
          const IconComp = Icons[tab.icon as keyof typeof Icons];
          return (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ padding: '10px 20px', borderRadius: '0', border: 'none', borderBottom: activeTab === tab.key ? '3px solid var(--primary)' : '3px solid transparent', background: 'transparent', color: activeTab === tab.key ? 'var(--primary)' : 'var(--text-secondary)', cursor: 'pointer', fontSize: '14px', fontWeight: activeTab === tab.key ? 700 : 500, display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '-2px' }}>
              {IconComp && <IconComp size={16} />} {tab.label}
            </button>
          );
        })}
      </div>

      {/* Site Info Tab */}
      {activeTab === 'siteInfo' && (
        <div className="card" style={{ padding: '24px', maxWidth: '600px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 700, margin: '0 0 20px' }}>اطلاعات کلی سایت</h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>نام سایت</label>
              <input type="text" value={settings.siteInfo.name} onChange={e => save({ ...settings, siteInfo: { ...settings.siteInfo, name: e.target.value } })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>شعار سایت</label>
              <input type="text" value={settings.siteInfo.slogan} onChange={e => save({ ...settings, siteInfo: { ...settings.siteInfo, slogan: e.target.value } })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>لگو (URL تصویر)</label>
              <input type="text" value={settings.siteInfo.logo} onChange={e => save({ ...settings, siteInfo: { ...settings.siteInfo, logo: e.target.value } })} placeholder="https://..." style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>رنگ اصلی</label>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <input type="color" value={settings.siteInfo.primaryColor} onChange={e => save({ ...settings, siteInfo: { ...settings.siteInfo, primaryColor: e.target.value } })} style={{ width: '40px', height: '40px', borderRadius: '8px', border: '1px solid var(--border)', cursor: 'pointer' }} />
                <input type="text" value={settings.siteInfo.primaryColor} onChange={e => save({ ...settings, siteInfo: { ...settings.siteInfo, primaryColor: e.target.value } })} style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none', width: '120px' }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Banners Tab */}
      {activeTab === 'banners' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>{settings.banners.length} بنر</span>
            <button onClick={() => { setEditingBanner(null); setShowBannerForm(true); }} style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'var(--primary)', color: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}><Icons.Plus size={14} /> افزودن بنر</button>
          </div>
          <div style={{ display: 'grid', gap: '16px' }}>
            {settings.banners.sort((a, b) => a.order - b.order).map(banner => (
              <div key={banner.id} className="card" style={{ padding: 0, overflow: 'hidden', opacity: banner.active ? 1 : 0.6 }}>
                {/* Banner Preview — full width like actual banner */}
                <div style={{ position: 'relative', height: '180px', borderRadius: '12px 12px 0 0', overflow: 'hidden' }}>
                  {banner.image ? (
                    <img src={banner.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #1e40af, #3b82f6)' }} />
                  )}
                  {/* Text overlay on banner */}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.7), transparent)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '24px', color: 'white' }}>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '0 0 4px' }}>{banner.title}</h3>
                    <p style={{ fontSize: '13px', margin: 0, opacity: 0.9 }}>{banner.subtitle}</p>
                  </div>
                  {/* Status badge */}
                  <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                    <span style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: 600, background: banner.active ? 'rgba(34,197,94,0.9)' : 'rgba(239,68,68,0.9)', color: 'white' }}>{banner.active ? 'فعال' : 'غیرفعال'}</span>
                  </div>
                </div>
                {/* Action bar */}
                <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--hover-bg)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: 'var(--text-muted)' }}>
                    <Icons.ExternalLink size={12} /> {banner.link}
                  </div>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button onClick={() => { setEditingBanner(banner); setShowBannerForm(true); }} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'var(--text)', cursor: 'pointer', fontSize: '12px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Edit size={12} /> ویرایش</button>
                    <button onClick={() => save({ ...settings, banners: settings.banners.map(b => b.id === banner.id ? { ...b, active: !b.active } : b) })} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--card-bg)', color: banner.active ? '#ef4444' : '#22c55e', cursor: 'pointer', fontSize: '12px', fontWeight: 500 }}>{banner.active ? 'غیرفعال' : 'فعال'}</button>
                    <button onClick={() => save({ ...settings, banners: settings.banners.filter(b => b.id !== banner.id) })} style={{ padding: '6px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--card-bg)', color: 'var(--danger)', cursor: 'pointer', fontSize: '12px', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Trash size={12} /> حذف</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer Tab */}
      {activeTab === 'footer' && (
        <div className="card" style={{ padding: '24px', maxWidth: '700px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 700, margin: '0 0 20px' }}>تنظیمات فوتر</h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>درباره ما</label>
              <textarea value={settings.footer.about} onChange={e => save({ ...settings, footer: { ...settings.footer, about: e.target.value } })} rows={3} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none', resize: 'vertical', fontFamily: 'inherit' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>تلفن</label>
                <input type="text" value={settings.footer.phone} onChange={e => save({ ...settings, footer: { ...settings.footer, phone: e.target.value } })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>ایمیل</label>
                <input type="text" value={settings.footer.email} onChange={e => save({ ...settings, footer: { ...settings.footer, email: e.target.value } })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none' }} />
              </div>
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>آدرس</label>
              <input type="text" value={settings.footer.address} onChange={e => save({ ...settings, footer: { ...settings.footer, address: e.target.value } })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none' }} />
            </div>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>متن کپی‌رایت</label>
              <input type="text" value={settings.footer.copyright} onChange={e => save({ ...settings, footer: { ...settings.footer, copyright: e.target.value } })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none' }} />
            </div>
          </div>

          {/* Social Links */}
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ fontSize: '15px', fontWeight: 600, margin: 0 }}>لینک‌های شبکه اجتماعی</h4>
              <button onClick={() => save({ ...settings, footer: { ...settings.footer, socialLinks: [...settings.footer.socialLinks, { name: '', url: '', icon: 'Link' }] } })} style={{ padding: '4px 10px', borderRadius: '6px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--primary)', cursor: 'pointer', fontSize: '12px' }}><Icons.Plus size={12} /> افزودن</button>
            </div>
            <div style={{ display: 'grid', gap: '8px' }}>
              {settings.footer.socialLinks.map((link, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <input type="text" value={link.name} onChange={e => { const sl = [...settings.footer.socialLinks]; sl[i].name = e.target.value; save({ ...settings, footer: { ...settings.footer, socialLinks: sl } }); }} placeholder="نام" style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '13px', color: 'var(--text)', outline: 'none' }} />
                  <input type="text" value={link.url} onChange={e => { const sl = [...settings.footer.socialLinks]; sl[i].url = e.target.value; save({ ...settings, footer: { ...settings.footer, socialLinks: sl } }); }} placeholder="لینک" style={{ flex: 2, padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '13px', color: 'var(--text)', outline: 'none' }} />
                  <button onClick={() => save({ ...settings, footer: { ...settings.footer, socialLinks: settings.footer.socialLinks.filter((_, j) => j !== i) } })} style={{ padding: '6px', borderRadius: '6px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--danger)', cursor: 'pointer' }}><Icons.Trash size={12} /></button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Banner Form Modal */}
      {showBannerForm && (
        <BannerForm banner={editingBanner} onSave={(banner) => {
          if (editingBanner) {
            save({ ...settings, banners: settings.banners.map(b => b.id === banner.id ? banner : b) });
          } else {
            save({ ...settings, banners: [...settings.banners, { ...banner, order: settings.banners.length }] });
          }
          setShowBannerForm(false);
          setEditingBanner(null);
        }} onClose={() => { setShowBannerForm(false); setEditingBanner(null); }} />
      )}
    </div>
  );
}

function BannerForm({ banner, onSave, onClose }: { banner: SiteBanner | null; onSave: (b: SiteBanner) => void; onClose: () => void }) {
  const [form, setForm] = useState<SiteBanner>(banner || { id: Date.now().toString(), title: '', subtitle: '', image: '', link: '/products', active: true, order: 0 });
  const [uploading, setUploading] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { alert('حجم فایل باید کمتر از ۲ مگابایت باشد'); return; }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm({ ...form, image: ev.target?.result as string });
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '20px' }} onClick={onClose}>
      <div style={{ width: '100%', maxWidth: '500px', background: 'var(--card-bg)', borderRadius: '16px', padding: '24px', border: '1px solid var(--border)', maxHeight: '90vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '17px', fontWeight: 700, margin: 0 }}>{banner ? 'ویرایش بنر' : 'افزودن بنر'}</h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: '20px' }}>×</button>
        </div>

        {/* Image Upload / Preview */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>تصویر بنر</label>
          {form.image ? (
            <div style={{ position: 'relative', borderRadius: '10px', overflow: 'hidden' }}>
              <img src={form.image} alt="preview" style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '10px' }} />
              <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', gap: '6px' }}>
                <label style={{ padding: '6px 10px', borderRadius: '6px', background: 'rgba(0,0,0,0.6)', color: 'white', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Icons.Edit size={12} /> تغییر
                  <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
                </label>
                <button onClick={() => setForm({ ...form, image: '' })} style={{ padding: '6px 10px', borderRadius: '6px', background: 'rgba(239,68,68,0.8)', color: 'white', border: 'none', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Trash size={12} /> حذف</button>
              </div>
            </div>
          ) : (
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '30px', borderRadius: '10px', border: '2px dashed var(--border)', background: 'var(--hover-bg)', cursor: 'pointer', transition: 'border-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
              {uploading ? (
                <div className="loader-spinner" style={{ width: '32px', height: '32px' }} />
              ) : (
                <>
                  <Icons.Image size={32} color="var(--text-muted)" />
                  <p style={{ margin: '8px 0 2px', fontSize: '14px', fontWeight: 500, color: 'var(--text-secondary)' }}>کلیک کنید یا تصویر را بکشید</p>
                  <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-muted)' }}>PNG, JPG, WebP — حداکثر ۲ مگابایت</p>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleUpload} style={{ display: 'none' }} />
            </label>
          )}
          <input type="text" value={form.image.startsWith('data:') ? '' : form.image} onChange={e => setForm({ ...form, image: e.target.value })} placeholder="یا لینک تصویر وارد کنید: https://..." style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '13px', color: 'var(--text)', outline: 'none', marginTop: '8px' }} />
        </div>

        <div style={{ display: 'grid', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>عنوان</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none' }} />
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>زیرعنوان</label>
            <input type="text" value={form.subtitle} onChange={e => setForm({ ...form, subtitle: e.target.value })} style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none' }} />
          </div>
          <div>
            <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>لینک هدف</label>
            <input type="text" value={form.link} onChange={e => setForm({ ...form, link: e.target.value })} placeholder="/products" style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--input-bg)', fontSize: '14px', color: 'var(--text)', outline: 'none' }} />
          </div>
        </div>
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
          <button onClick={onClose} style={{ padding: '10px 20px', borderRadius: '10px', border: '1px solid var(--border)', background: 'transparent', color: 'var(--text)', cursor: 'pointer' }}>انصراف</button>
          <button onClick={() => onSave(form)} disabled={!form.title.trim()} style={{ padding: '10px 20px', borderRadius: '10px', border: 'none', background: 'var(--primary)', color: 'white', cursor: 'pointer', fontWeight: 600, opacity: form.title.trim() ? 1 : 0.5 }}>ذخیره</button>
        </div>
      </div>
    </div>
  );
}
