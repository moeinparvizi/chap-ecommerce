'use client';

import { useState, useEffect } from 'react';
import { Icons } from '../../components/Icons';

interface Setting { id: string; key: string; value: string; type: string; group: string; }

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState<Record<string, string>>({
    storeName: 'ShopHub',
    storeEmail: 'admin@shophub.com',
    storePhone: '+98 912 123 4567',
    storeAddress: 'تهران، خیابان ولیعصر',
    currency: 'USD',
    timezone: 'Asia/Tehran',
    language: 'fa',
    theme: 'light',
    maintenanceMode: 'false',
    minOrderAmount: '50',
    freeShippingThreshold: '100',
    taxRate: '10',
    smtpHost: 'smtp.gmail.com',
    smtpPort: '587',
    smtpUser: '',
    smtpPass: '',
    seoTitle: 'ShopHub - فروشگاه آنلاین',
    seoDescription: 'بهترین فروشگاه آنلاین با بهترین قیمت‌ها',
    analyticsId: '',
  });
  const [saving, setSaving] = useState(false);

  const sections = [
    { id: 'general', label: 'عمومی', icon: <Icons.Settings size={14} /> },
    { id: 'appearance', label: 'ظاهر', icon: <Icons.Image size={14} /> },
    { id: 'shipping', label: 'ارسال', icon: <Icons.Truck size={14} /> },
    { id: 'payment', label: 'پرداخت', icon: <Icons.CreditCard size={14} /> },
    { id: 'tax', label: 'مالیات', icon: <Icons.FileText size={14} /> },
    { id: 'email', label: 'ایمیل', icon: <Icons.Mail size={14} /> },
    { id: 'seo', label: 'SEO', icon: <Icons.Search size={14} /> },
    { id: 'advanced', label: 'پیشرفته', icon: <Icons.Settings size={14} /> },
  ];

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    setSaving(true);
    // Simulate save
    setTimeout(() => {
      setSaving(false);
      alert('تنظیمات با موفقیت ذخیره شد!');
    }, 500);
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 24px' }}>تنظیمات</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '24px' }}>
        {/* Sidebar Menu */}
        <div className="card" style={{ height: 'fit-content' }}>
          <nav>
            {sections.map(s => (
              <button
                key={s.id}
                onClick={() => setActiveSection(s.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '10px 12px',
                  marginBottom: '4px',
                  background: activeSection === s.id ? 'var(--primary)' : 'transparent',
                  color: activeSection === s.id ? 'white' : 'var(--text)',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  textAlign: 'right',
                }}
              >
                <span>{s.icon}</span>
                <span>{s.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Settings Content */}
        <div className="card animate-in">
          {/* General Settings */}
          {activeSection === 'general' && (
            <div>
              <h2 style={{ margin: '0 0 20px', fontSize: '18px' }}>تنظیمات عمومی</h2>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>نام فروشگاه</label>
                  <input className="input" value={settings.storeName} onChange={e => updateSetting('storeName', e.target.value)} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>ایمیل فروشگاه</label>
                    <input className="input" type="email" value={settings.storeEmail} onChange={e => updateSetting('storeEmail', e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>تلفن فروشگاه</label>
                    <input className="input" value={settings.storePhone} onChange={e => updateSetting('storePhone', e.target.value)} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>آدرس فروشگاه</label>
                  <input className="input" value={settings.storeAddress} onChange={e => updateSetting('storeAddress', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* Appearance Settings */}
          {activeSection === 'appearance' && (
            <div>
              <h2 style={{ margin: '0 0 20px', fontSize: '18px' }}>تنظیمات ظاهر</h2>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>ارز پیش‌فرض</label>
                  <select className="input" value={settings.currency} onChange={e => updateSetting('currency', e.target.value)}>
                    <option value="USD">دلار آمریکا (USD)</option>
                    <option value="EUR">یورو (EUR)</option>
                    <option value="IRR">ریال ایران (IRR)</option>
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>زبان</label>
                    <select className="input" value={settings.language} onChange={e => updateSetting('language', e.target.value)}>
                      <option value="fa">فارسی</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>منطقه زمانی</label>
                    <select className="input" value={settings.timezone} onChange={e => updateSetting('timezone', e.target.value)}>
                      <option value="Asia/Tehran">تهران (GMT+3:30)</option>
                      <option value="UTC">UTC</option>
                      <option value="America/New_York">نیویورک (GMT-5)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Shipping Settings */}
          {activeSection === 'shipping' && (
            <div>
              <h2 style={{ margin: '0 0 20px', fontSize: '18px' }}>تنظیمات ارسال</h2>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>حداقل مبلغ سفارش ($)</label>
                    <input className="input" type="number" value={settings.minOrderAmount} onChange={e => updateSetting('minOrderAmount', e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>ارسال رایگان از ($)</label>
                    <input className="input" type="number" value={settings.freeShippingThreshold} onChange={e => updateSetting('freeShippingThreshold', e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Settings */}
          {activeSection === 'payment' && (
            <div>
              <h2 style={{ margin: '0 0 20px', fontSize: '18px' }}>تنظیمات پرداخت</h2>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ padding: '16px', background: 'rgba(16,185,129,0.1)', borderRadius: '10px', border: '1px solid rgba(16,185,129,0.2)' }}>
                  <p style={{ margin: 0, color: '#10b981', fontWeight: 500 }}>{<Icons.Check size={14} />} Stripe متصل است</p>
                  <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>پرداخت آماده استفاده است</p>
                </div>
                <div style={{ padding: '16px', background: 'rgba(245,158,11,0.1)', borderRadius: '10px', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <p style={{ margin: 0, color: '#f59e0b', fontWeight: 500 }}>{<Icons.AlertCircle size={14} />} PayPal در انتظار پیکربندی</p>
                  <p style={{ margin: '4px 0 0', fontSize: '13px', color: 'var(--text-secondary)' }}>برای فعال‌سازی تنظیمات را وارد کنید</p>
                </div>
              </div>
            </div>
          )}

          {/* Tax Settings */}
          {activeSection === 'tax' && (
            <div>
              <h2 style={{ margin: '0 0 20px', fontSize: '18px' }}>تنظیمات مالیات</h2>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>نرخ مالیات (%)</label>
                  <input className="input" type="number" value={settings.taxRate} onChange={e => updateSetting('taxRate', e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* Email Settings */}
          {activeSection === 'email' && (
            <div>
              <h2 style={{ margin: '0 0 20px', fontSize: '18px' }}>تنظیمات ایمیل</h2>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>SMTP Host</label>
                    <input className="input" value={settings.smtpHost} onChange={e => updateSetting('smtpHost', e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>SMTP Port</label>
                    <input className="input" type="number" value={settings.smtpPort} onChange={e => updateSetting('smtpPort', e.target.value)} />
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={labelStyle}>نام کاربری</label>
                    <input className="input" value={settings.smtpUser} onChange={e => updateSetting('smtpUser', e.target.value)} />
                  </div>
                  <div>
                    <label style={labelStyle}>رمز عبور</label>
                    <input className="input" type="password" value={settings.smtpPass} onChange={e => updateSetting('smtpPass', e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SEO Settings */}
          {activeSection === 'seo' && (
            <div>
              <h2 style={{ margin: '0 0 20px', fontSize: '18px' }}>تنظیمات SEO</h2>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>عنوان سایت</label>
                  <input className="input" value={settings.seoTitle} onChange={e => updateSetting('seoTitle', e.target.value)} />
                </div>
                <div>
                  <label style={labelStyle}>توضیحات متا</label>
                  <textarea className="input" rows={3} value={settings.seoDescription} onChange={e => updateSetting('seoDescription', e.target.value)} style={{ resize: 'vertical' }} />
                </div>
                <div>
                  <label style={labelStyle}>Google Analytics ID</label>
                  <input className="input" value={settings.analyticsId} onChange={e => updateSetting('analyticsId', e.target.value)} placeholder="G-XXXXXXXXXX" />
                </div>
              </div>
            </div>
          )}

          {/* Advanced Settings */}
          {activeSection === 'advanced' && (
            <div>
              <h2 style={{ margin: '0 0 20px', fontSize: '18px' }}>تنظیمات پیشرفته</h2>
              <div style={{ display: 'grid', gap: '16px' }}>
                <div>
                  <label style={labelStyle}>حالت تعمیرات</label>
                  <select className="input" value={settings.maintenanceMode} onChange={e => updateSetting('maintenanceMode', e.target.value)}>
                    <option value="false">غیرفعال</option>
                    <option value="true">فعال</option>
                  </select>
                  {settings.maintenanceMode === 'true' && (
                    <p style={{ marginTop: '8px', padding: '8px', background: 'rgba(245,158,11,0.1)', borderRadius: '6px', fontSize: '13px', color: '#f59e0b' }}>
                      {<Icons.AlertCircle size={14} />} سایت در حالت تعمیرات است و برای کاربران قابل دسترسی نیست
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'flex-end' }}>
            <button className="btn btn-success" onClick={handleSave} disabled={saving}>
              {saving ? <>{<Icons.Save size={14} />} در حال ذخیره...</> : <>{<Icons.Save size={14} />} ذخیره تنظیمات</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const labelStyle = { display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 500, color: 'var(--text)' };
