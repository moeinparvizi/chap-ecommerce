'use client';

import { useState } from 'react';

interface Campaign {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'scheduled' | 'ended';
  discount: string;
  startDate: string;
  endDate: string;
  usageCount: number;
  totalBudget: number;
}

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: string;
  usageCount: number;
  maxUsage: number;
  status: 'active' | 'expired' | 'disabled';
}

export default function MarketingPage() {
  const [activeTab, setActiveTab] = useState('campaigns');

  const campaigns: Campaign[] = [
    { id: '1', name: 'حراج فصل تابستان', type: 'فصلی', status: 'active', discount: '30%', startDate: '2024-06-01', endDate: '2024-06-30', usageCount: 456, totalBudget: 5000 },
    { id: '2', name: 'تخفیف ویژه مشتریان جدید', type: 'خوشامدگویی', status: 'active', discount: '20%', startDate: '2024-01-01', endDate: '2024-12-31', usageCount: 234, totalBudget: 3000 },
    { id: '3', name: 'فلاش سیل عید', type: 'فلاش سیل', status: 'ended', discount: '50%', startDate: '2024-03-20', endDate: '2024-03-25', usageCount: 890, totalBudget: 10000 },
    { id: '4', name: 'تخفیف ارسال رایگان', type: 'ارسال رایگان', status: 'active', discount: 'ارسال رایگان', startDate: '2024-01-01', endDate: '2024-12-31', usageCount: 1234, totalBudget: 2000 },
    { id: '5', name: 'جمعه سیاه', type: 'فصلی', status: 'scheduled', discount: '40%', startDate: '2024-11-24', endDate: '2024-11-30', usageCount: 0, totalBudget: 8000 },
  ];

  const coupons: Coupon[] = [
    { id: '1', code: 'WELCOME20', type: 'درصدی', value: '20%', usageCount: 234, maxUsage: 500, status: 'active' },
    { id: '2', code: 'SUMMER30', type: 'درصدی', value: '30%', usageCount: 456, maxUsage: 1000, status: 'active' },
    { id: '3', code: 'FLAT50', type: 'مبلغ ثابت', value: '$50', usageCount: 123, maxUsage: 200, status: 'active' },
    { id: '4', code: 'FREESHIP', type: 'ارسال رایگان', value: 'رایگان', usageCount: 890, maxUsage: -1, status: 'active' },
    { id: '5', code: 'EXPIRED10', type: 'درصدی', value: '10%', usageCount: 100, maxUsage: 100, status: 'expired' },
  ];

  const tabs = [
    { id: 'campaigns', label: 'کمپین‌ها', icon: '📣' },
    { id: 'coupons', label: 'کوپن‌ها', icon: '🎫' },
    { id: 'banners', label: 'بنرها', icon: '🖼️' },
    { id: 'newsletter', label: 'خبرنامه', icon: '📧' },
  ];

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

      {/* Campaigns Tab */}
      {activeTab === 'campaigns' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '18px' }}>کمپین‌های بازاریابی</h2>
            <button style={{ padding: '8px 16px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>➕ کمپین جدید</button>
          </div>
          <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={thStyle}>نام کمپین</th>
                  <th style={thStyle}>نوع</th>
                  <th style={thStyle}>تخفیف</th>
                  <th style={thStyle}>وضعیت</th>
                  <th style={thStyle}>استفاده</th>
                  <th style={thStyle}>تاریخ</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={tdStyle}><strong>{c.name}</strong></td>
                    <td style={tdStyle}>{c.type}</td>
                    <td style={tdStyle}><span style={{ color: '#22c55e', fontWeight: 600 }}>{c.discount}</span></td>
                    <td style={tdStyle}>
                      <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', background: c.status === 'active' ? '#dcfce7' : c.status === 'scheduled' ? '#dbeafe' : '#e5e7eb', color: c.status === 'active' ? '#166534' : c.status === 'scheduled' ? '#1e40af' : '#374151' }}>
                        {c.status === 'active' ? 'فعال' : c.status === 'scheduled' ? 'برنامه‌ریزی شده' : 'پایان یافته'}
                      </span>
                    </td>
                    <td style={tdStyle}>{c.usageCount}</td>
                    <td style={tdStyle}>{c.startDate} تا {c.endDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Coupons Tab */}
      {activeTab === 'coupons' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '18px' }}>کوپن‌های تخفیف</h2>
            <button style={{ padding: '8px 16px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>➕ کوپن جدید</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '16px' }}>
            {coupons.map(c => (
              <div key={c.id} style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #e5e7eb', opacity: c.status === 'expired' ? 0.6 : 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '16px' }}>{c.code}</span>
                  <span style={{ padding: '2px 8px', borderRadius: '12px', fontSize: '11px', background: c.status === 'active' ? '#dcfce7' : '#fee2e2', color: c.status === 'active' ? '#166534' : '#991b1b' }}>
                    {c.status === 'active' ? 'فعال' : 'منقضی'}
                  </span>
                </div>
                <p style={{ margin: '0 0 8px', fontSize: '20px', fontWeight: 700, color: '#2563eb' }}>{c.value}</p>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>
                  استفاده: {c.usageCount} {c.maxUsage > 0 ? `/ ${c.maxUsage}` : '/ نامحدود'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Banners Tab */}
      {activeTab === 'banners' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '18px' }}>بنرهای تبلیغاتی</h2>
            <button style={{ padding: '8px 16px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>➕ بنر جدید</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {['بنر اصلی صفحه خانه', 'بنر دسته‌بندی موبایل', 'بنر تخفیف‌های ویژه'].map((name, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e7eb' }}>
                <div style={{ height: '150px', background: `linear-gradient(135deg, ${['#3b82f6', '#22c55e', '#f59e0b'][i]}22, ${['#3b82f6', '#22c55e', '#f59e0b']}44)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ['#3b82f6', '#22c55e', '#f59e0b'][i], fontSize: '24px', fontWeight: 600 }}>
                  🖼️ {name}
                </div>
                <div style={{ padding: '12px' }}>
                  <p style={{ margin: 0, fontWeight: 500 }}>{name}</p>
                  <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>موقعیت: خانه</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Newsletter Tab */}
      {activeTab === 'newsletter' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ margin: 0, fontSize: '18px' }}>خبرنامه</h2>
            <button style={{ padding: '8px 16px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>📧 ارسال خبرنامه</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
            {[{ l: 'مشترکین', v: '2,345', c: '#2563eb' }, { l: 'نرخ بازشدن', v: '45%', c: '#22c55e' }, { l: 'نرخ کلیک', v: '12%', c: '#8b5cf6' }].map((s, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #e5e7eb', textAlign: 'center' }}>
                <p style={{ fontSize: '24px', fontWeight: 700, color: s.c, margin: '0 0 4px' }}>{s.v}</p>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>{s.l}</p>
              </div>
            ))}
          </div>
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '16px' }}>آخرین کمپین‌های ایمیلی</h3>
            {[{ name: 'خوشامدگویی', sent: '1,234', opened: '56%', clicked: '12%' }, { name: 'تخفیف ویژه', sent: '2,345', opened: '45%', clicked: '8%' }].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: i === 0 ? '1px solid #e5e7eb' : 'none' }}>
                <span style={{ fontWeight: 500 }}>{item.name}</span>
                <span style={{ color: '#64748b', fontSize: '13px' }}>{item.sent} ارسال | {item.opened} بازشده | {item.clicked} کلیک</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

const thStyle = { textAlign: 'right' as const, padding: '14px 16px', fontSize: '13px', fontWeight: 600, color: '#374151', borderBottom: '1px solid #e5e7eb' };
const tdStyle = { padding: '14px 16px', fontSize: '14px', color: '#374151' };
