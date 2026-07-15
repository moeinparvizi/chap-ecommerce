'use client';

import { useState } from 'react';
import { Icons } from '../../components/Icons';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('7days');

  const kpis = [
    { title: 'درآمد کل', value: '$124,563', change: 13, icon: <Icons.DollarSign size={20} />, color: '#22c55e' },
    { title: 'تعداد سفارشات', value: '1,234', change: 12, icon: <Icons.Package size={20} />, color: '#3b82f6' },
    { title: 'مشتریان جدید', value: '788', change: 14, icon: <Icons.Users size={20} />, color: '#8b5cf6' },
    { title: 'نرخ تبدیل', value: '3.24%', change: 14, icon: <Icons.TrendingUp size={20} />, color: '#f59e0b' },
    { title: 'میانگین سفارش', value: '$101', change: 6, icon: <Icons.ShoppingCart size={20} />, color: '#ec4899' },
    { title: 'ترک سبد خرید', value: '68.5%', change: -5, icon: <Icons.LogOut size={20} />, color: '#ef4444' },
  ];

  const weeklyRevenue = [
    { day: 'شنبه', revenue: 18500, orders: 183 },
    { day: 'یکشنبه', revenue: 22300, orders: 221 },
    { day: 'دوشنبه', revenue: 19800, orders: 196 },
    { day: 'سه\u200cشنبه', revenue: 25600, orders: 253 },
    { day: 'چهارشنبه', revenue: 21200, orders: 210 },
    { day: 'پنجشنبه', revenue: 28400, orders: 281 },
    { day: 'جمعه', revenue: 24200, orders: 240 },
  ];
  const maxRevenue = Math.max(...weeklyRevenue.map(d => d.revenue));
  const totalWeeklyRevenue = weeklyRevenue.reduce((a, b) => a + b.revenue, 0);
  const totalWeeklyOrders = weeklyRevenue.reduce((a, b) => a + b.orders, 0);

  const topProducts = [
    { name: 'iPhone 15 Pro Max', category: 'موبایل', sold: 234, revenue: 280566, growth: 18 },
    { name: 'MacBook Pro M3', category: 'لپتاپ', sold: 89, revenue: 177911, growth: 25 },
    { name: 'Nike Air Max 90', category: 'کفش', sold: 567, revenue: 73143, growth: 12 },
    { name: 'Sony WH-1000XM5', category: 'هدست', sold: 456, revenue: 159144, growth: 8 },
    { name: 'iPad Air M2', category: 'تبلت', sold: 123, revenue: 73677, growth: 15 },
  ];

  const recentSales = [
    { date: '۱۵ ژانویه', orders: 45, revenue: 4567, returns: 1 },
    { date: '۱۴ ژانویه', orders: 38, revenue: 3890, returns: 0 },
    { date: '۱۳ ژانویه', orders: 52, revenue: 5234, returns: 2 },
    { date: '۱۲ ژانویه', orders: 41, revenue: 4123, returns: 1 },
    { date: '۱۱ ژانویه', orders: 55, revenue: 5567, returns: 0 },
    { date: '۱۰ ژانویه', orders: 48, revenue: 4890, returns: 3 },
    { date: '۰۹ ژانویه', orders: 62, revenue: 6234, returns: 1 },
  ];
  const maxSaleRevenue = Math.max(...recentSales.map(s => s.revenue));

  const trafficSources = [
    { source: 'جستجوی گوگل', visitors: 12400, percentage: 38, color: '#3b82f6' },
    { source: 'شبکه\u200cهای اجتماعی', visitors: 8200, percentage: 25, color: '#8b5cf6' },
    { source: 'مستقیم', visitors: 6500, percentage: 20, color: '#22c55e' },
    { source: 'ایمیل مارکتینگ', visitors: 3200, percentage: 10, color: '#f59e0b' },
    { source: 'تبلیغات پولی', visitors: 2100, percentage: 7, color: '#ec4899' },
  ];

  const hourlyOrders = [
    { hour: '۸', orders: 5 }, { hour: '۹', orders: 12 }, { hour: '۱۰', orders: 28 },
    { hour: '۱۱', orders: 42 }, { hour: '۱۲', orders: 55 }, { hour: '۱۳', orders: 38 },
    { hour: '۱۴', orders: 48 }, { hour: '۱۵', orders: 62 }, { hour: '۱۶', orders: 58 },
    { hour: '۱۷', orders: 45 }, { hour: '۱۸', orders: 70 }, { hour: '۱۹', orders: 85 },
    { hour: '۲۰', orders: 92 }, { hour: '۲۱', orders: 78 }, { hour: '۲۲', orders: 45 },
  ];
  const maxHourlyOrders = Math.max(...hourlyOrders.map(h => h.orders));

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>تحلیل\u200cها و گزارشات</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '4px 0 0' }}>آمار و عملکرد فروشگاه</p>
        </div>
        <select value={period} onChange={e => setPeriod(e.target.value)} style={{ padding: '8px 16px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', background: 'var(--input-bg)', color: 'var(--text)' }}>
          <option value="7days">۷ روز اخیر</option>
          <option value="30days">۳۰ روز اخیر</option>
          <option value="90days">۹۰ روز اخیر</option>
          <option value="year">یک سال</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {kpis.map((stat, i) => (
          <div key={i} className="card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>{stat.title}</p>
                <p style={{ fontSize: '24px', fontWeight: 700, margin: '6px 0 2px', color: 'var(--text)' }}>{stat.value}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  {stat.change >= 0 ? <Icons.ArrowUp size={14} color="#22c55e" /> : <Icons.ArrowDown size={14} color="#ef4444" />}
                  <span style={{ fontSize: '12px', fontWeight: 600, color: stat.change >= 0 ? '#22c55e' : '#ef4444' }}>
                    {Math.abs(stat.change)}%
                  </span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>نسبت به دوره قبل</span>
                </div>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: stat.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart + Traffic Sources */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>نمودار درآمد</h3>
            <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
              <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.Package size={12} /> سفارشات: {totalWeeklyOrders.toLocaleString()}</span>
              <span style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.DollarSign size={12} /> درآمد: ${(totalWeeklyRevenue / 1000).toFixed(0)}k</span>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '200px', padding: '0 4px' }}>
            {weeklyRevenue.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 500 }}>${(d.revenue / 1000).toFixed(1)}k</span>
                <div style={{ width: '100%', height: `${(d.revenue / maxRevenue) * 100}%`, background: 'linear-gradient(180deg, #3b82f6, #1d4ed8)', borderRadius: '4px 4px 0 0', minHeight: '8px' }} />
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>منابع ترافیک</h3>
          {trafficSources.map((src, i) => (
            <div key={i} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', fontWeight: 500 }}>{src.source}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{src.visitors.toLocaleString()} بازدید</span>
              </div>
              <div style={{ width: '100%', height: '6px', background: 'var(--hover-bg)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: `${src.percentage}%`, height: '100%', background: src.color, borderRadius: '3px' }} />
              </div>
            </div>
          ))}
          <div style={{ marginTop: '16px', padding: '12px', background: 'var(--table-header-bg)', borderRadius: '8px', textAlign: 'center' }}>
            <p style={{ margin: 0, fontSize: '22px', fontWeight: 700, color: 'var(--text)' }}>32,400</p>
            <p style={{ margin: '4px 0 0', fontSize: '12px', color: 'var(--text-secondary)' }}>کل بازدیدکنندگان</p>
          </div>
        </div>
      </div>

      {/* Hourly Orders + Top Products */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div className="card">
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>ساعت پیک سفارشات</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '120px', padding: '0 4px' }}>
            {hourlyOrders.map((h, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{h.orders}</span>
                <div style={{
                  width: '100%', height: `${(h.orders / maxHourlyOrders) * 100}%`,
                  background: h.orders >= 70 ? '#22c55e' : h.orders >= 40 ? '#3b82f6' : '#94a3b8',
                  borderRadius: '3px 3px 0 0', minHeight: '4px'
                }} />
                <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{h.hour}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '16px', marginTop: '12px', fontSize: '11px', color: 'var(--text-secondary)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.AlertCircle size={12} color="#ef4444" /> پیک: ساعت ۲۰-۲۱</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.BarChart size={12} /> میانگین: {Math.round(hourlyOrders.reduce((a, b) => a + b.orders, 0) / hourlyOrders.length)} سفارش/ساعت</span>
          </div>
        </div>

        <div className="card">
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>پرفروش\u200cترین محصولات</h3>
          {topProducts.map((p, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < topProducts.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{
                  width: '24px', height: '24px', borderRadius: '50%',
                  background: i < 3 ? 'var(--primary)' : 'var(--hover-bg)',
                  color: i < 3 ? 'white' : 'var(--text)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600
                }}>{i + 1}</span>
                <div>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 500 }}>{p.name}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>{p.category} · {p.sold} فروش</p>
                </div>
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#22c55e' }}>${p.revenue.toLocaleString()}</p>
                <p style={{ margin: 0, fontSize: '11px', color: '#22c55e', display: 'flex', alignItems: 'center', gap: '2px' }}><Icons.ArrowUp size={10} color="#22c55e" /> {p.growth}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Sales Table */}
      <div className="card">
        <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>گزارش فروش روزانه</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>تاریخ</th>
              <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>سفارشات</th>
              <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>درآمد</th>
              <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>بازگشت</th>
              <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>میانگین</th>
              <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>نمودار</th>
            </tr>
          </thead>
          <tbody>
            {recentSales.map((sale, i) => (
              <tr key={i} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '12px', fontSize: '13px' }}>{sale.date}</td>
                <td style={{ padding: '12px', fontSize: '13px', fontWeight: 500 }}>{sale.orders}</td>
                <td style={{ padding: '12px', fontSize: '13px', fontWeight: 600, color: '#22c55e' }}>${sale.revenue.toLocaleString()}</td>
                <td style={{ padding: '12px', fontSize: '13px' }}>
                  <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '11px', background: sale.returns === 0 ? 'var(--badge-success-bg)' : 'var(--badge-danger-bg)', color: sale.returns === 0 ? 'var(--badge-success-text)' : 'var(--badge-danger-text)' }}>
                    {sale.returns}
                  </span>
                </td>
                <td style={{ padding: '12px', fontSize: '13px', color: 'var(--text-secondary)' }}>${Math.round(sale.revenue / sale.orders)}</td>
                <td style={{ padding: '12px' }}>
                  <div style={{ width: '100%', height: '6px', background: 'var(--hover-bg)', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: `${(sale.revenue / maxSaleRevenue) * 100}%`, height: '100%', background: '#3b82f6', borderRadius: '3px' }} />
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
