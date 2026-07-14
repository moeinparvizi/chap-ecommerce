'use client';

import { useState } from 'react';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('7days');

  const stats = {
    revenue: { current: 124563, previous: 110234, change: 13 },
    orders: { current: 1234, previous: 1102, change: 12 },
    customers: { current: 5678, previous: 4890, change: 16 },
    conversionRate: { current: 3.2, previous: 2.8, change: 14 },
    avgOrderValue: { current: 101, previous: 95, change: 6 },
    cartAbandonment: { current: 68, previous: 72, change: -6 },
  };

  const topProducts = [
    { name: 'iPhone 15 Pro Max', sales: 234, revenue: 280566 },
    { name: 'MacBook Pro M3', sales: 89, revenue: 177911 },
    { name: 'Nike Air Max 90', sales: 567, revenue: 73143 },
    { name: 'Sony WH-1000XM5', sales: 456, revenue: 159144 },
    { name: 'iPad Air M2', sales: 123, revenue: 73677 },
  ];

  const recentSales = [
    { date: '۱۵ ژانویه', orders: 45, revenue: 4567 },
    { date: '۱۴ ژانویه', orders: 38, revenue: 3890 },
    { date: '۱۳ ژانویه', orders: 52, revenue: 5234 },
    { date: '۱۲ ژانویه', orders: 41, revenue: 4123 },
    { date: '۱۱ ژانویه', orders: 55, revenue: 5567 },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>تحلیل‌ها و گزارشات</h1>
        <select value={period} onChange={e => setPeriod(e.target.value)} style={{ padding: '8px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px' }}>
          <option value="7days">۷ روز اخیر</option>
          <option value="30days">۳۰ روز اخیر</option>
          <option value="90days">۹۰ روز اخیر</option>
          <option value="year">یک سال</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          { title: 'درآمد', value: `$${stats.revenue.current.toLocaleString()}`, change: stats.revenue.change, icon: '💰', color: '#22c55e' },
          { title: 'سفارشات', value: stats.orders.current.toLocaleString(), change: stats.orders.change, icon: '📦', color: '#3b82f6' },
          { title: 'مشتریان', value: stats.customers.current.toLocaleString(), change: stats.customers.change, icon: '👥', color: '#8b5cf6' },
          { title: 'نرخ تبدیل', value: `${stats.conversionRate.current}%`, change: stats.conversionRate.change, icon: '📈', color: '#f59e0b' },
          { title: 'میانگین سفارش', value: `$${stats.avgOrderValue.current}`, change: stats.avgOrderValue.change, icon: '🛒', color: '#ec4899' },
          { title: 'ترک سبد', value: `${stats.cartAbandonment.current}%`, change: stats.cartAbandonment.change, icon: '🛒', color: '#ef4444' },
        ].map((stat, i) => (
          <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '20px', border: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>{stat.title}</p>
                <p style={{ fontSize: '24px', fontWeight: 700, margin: '8px 0' }}>{stat.value}</p>
                <span style={{ fontSize: '12px', color: stat.change >= 0 ? '#22c55e' : '#ef4444' }}>
                  {stat.change >= 0 ? '↑' : '↓'} {Math.abs(stat.change)}%
                </span>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: stat.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Revenue Chart Placeholder */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '16px' }}>نمودار درآمد</h3>
          <div style={{ height: '250px', background: 'linear-gradient(180deg, #eff6ff 0%, #dbeafe 100%)', borderRadius: '8px', display: 'flex', alignItems: 'flex-end', padding: '20px', gap: '8px' }}>
            {[40, 65, 45, 80, 60, 90, 75].map((h, i) => (
              <div key={i} style={{ flex: 1, background: 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)', height: `${h}%`, borderRadius: '4px 4px 0 0', minHeight: '20px' }}></div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', fontSize: '11px', color: '#94a3b8' }}>
            {['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه'].map(d => <span key={d}>{d}</span>)}
          </div>
        </div>

        {/* Top Products */}
        <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb' }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '16px' }}>پرفروش‌ترین محصولات</h3>
          {topProducts.map((p, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < topProducts.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600 }}>{i + 1}</span>
                <span style={{ fontSize: '13px' }}>{p.name}</span>
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '13px' }}>{p.sales} فروش</p>
                <p style={{ margin: 0, fontSize: '11px', color: '#22c55e' }}>${p.revenue.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Sales */}
      <div style={{ background: 'white', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb', marginTop: '20px' }}>
        <h3 style={{ margin: '0 0 16px', fontSize: '16px' }}>فروش روزانه</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ textAlign: 'right', padding: '10px', fontSize: '13px', color: '#64748b' }}>تاریخ</th>
              <th style={{ textAlign: 'right', padding: '10px', fontSize: '13px', color: '#64748b' }}>سفارشات</th>
              <th style={{ textAlign: 'right', padding: '10px', fontSize: '13px', color: '#64748b' }}>درآمد</th>
              <th style={{ textAlign: 'right', padding: '10px', fontSize: '13px', color: '#64748b' }}>نمودار</th>
            </tr>
          </thead>
          <tbody>
            {recentSales.map((sale, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '12px 10px', fontSize: '14px' }}>{sale.date}</td>
                <td style={{ padding: '12px 10px', fontWeight: 500 }}>{sale.orders}</td>
                <td style={{ padding: '12px 10px', fontWeight: 600, color: '#22c55e' }}>${sale.revenue.toLocaleString()}</td>
                <td style={{ padding: '12px 10px' }}>
                  <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${(sale.revenue / 6000) * 100}%`, height: '100%', background: '#3b82f6', borderRadius: '4px' }}></div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
