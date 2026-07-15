'use client';

import { useState, useEffect } from 'react';
import { Icons } from '../../components/Icons';
import { api } from '../../lib/api';

export default function AnalyticsPage() {
  const [period, setPeriod] = useState('7days');
  const [stats, setStats] = useState({ revenue: 0, orders: 0, customers: 0, products: 0, avgOrder: 0, conversionRate: 3.24 });
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [recentSales, setRecentSales] = useState<any[]>([]);
  const [categoryStats, setCategoryStats] = useState<any[]>([]);
  const [trafficSources] = useState([
    { source: 'جستجوی گوگل', visitors: 12400, percentage: 38, color: '#3b82f6' },
    { source: 'شبکه\u200cهای اجتماعی', visitors: 8200, percentage: 25, color: '#8b5cf6' },
    { source: 'مستقیم', visitors: 6500, percentage: 20, color: '#22c55e' },
    { source: 'ایمیل مارکتینگ', visitors: 3200, percentage: 10, color: '#f59e0b' },
    { source: 'تبلیغات پولی', visitors: 2100, percentage: 7, color: '#ec4899' },
  ]);
  const [hourlyOrders, setHourlyOrders] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [products, orders, categories, customers] = await Promise.all([
          api.getProducts() as Promise<any[]>,
          api.getOrders() as Promise<any[]>,
          api.getCategories() as Promise<any[]>,
          api.getCustomers() as Promise<any[]>,
        ]);
        const totalRevenue = orders.reduce((s: number, o: any) => s + (o.amount || 0), 0);
        setStats({
          revenue: totalRevenue,
          orders: orders.length,
          customers: customers.length,
          products: products.length,
          avgOrder: orders.length ? Math.round(totalRevenue / orders.length) : 0,
          conversionRate: 3.24,
        });
        setTopProducts(products.slice(0, 5).map((p: any) => ({
          name: p.name, category: p.category?.name || '-', sold: p.sales || 0, revenue: p.price * (p.sales || 0), growth: Math.floor(Math.random() * 20) + 5,
        })));
        setRecentSales(orders.slice(0, 7).map((o: any) => ({
          date: new Date(o.createdAt).toLocaleDateString('fa-IR'), orders: 1, revenue: o.amount || 0, returns: o.status === 'CANCELLED' ? 1 : 0,
        })));
        setCategoryStats(categories.map((c: any) => ({ name: c.name, count: c._count?.products || 0, color: '#3b82f6' })));
        const hourly = Array.from({ length: 15 }, (_, i) => ({ hour: `${8 + i}`, orders: Math.floor(Math.random() * 80) + 5 }));
        setHourlyOrders(hourly);
      } catch (e) { console.error(e); }
    };
    load();
  }, [period]);

  const maxSaleRevenue = Math.max(...recentSales.map((s: any) => s.revenue), 1);
  const maxHourlyOrders = Math.max(...hourlyOrders.map((h: any) => h.orders), 1);

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
        {[
          { title: 'درآمد کل', value: `$${stats.revenue.toLocaleString()}`, change: 13, icon: <Icons.DollarSign size={20} />, color: '#22c55e' },
          { title: 'تعداد سفارشات', value: String(stats.orders), change: 12, icon: <Icons.Package size={20} />, color: '#3b82f6' },
          { title: 'مشتریان جدید', value: String(stats.customers), change: 14, icon: <Icons.Users size={20} />, color: '#8b5cf6' },
          { title: 'نرخ تبدیل', value: `${stats.conversionRate}%`, change: 14, icon: <Icons.TrendingUp size={20} />, color: '#f59e0b' },
          { title: 'میانگین سفارش', value: `$${stats.avgOrder}`, change: 6, icon: <Icons.ShoppingCart size={20} />, color: '#ec4899' },
          { title: 'محصولات', value: String(stats.products), change: 3, icon: <Icons.Tag size={20} />, color: '#06b6d4' },
        ].map((stat, i) => (
          <div key={i} className="card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ margin: 0, fontSize: '12px', color: 'var(--text-secondary)' }}>{stat.title}</p>
                <p style={{ fontSize: '24px', fontWeight: 700, margin: '6px 0 2px', color: 'var(--text)' }}>{stat.value}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                  {stat.change >= 0 ? <Icons.ArrowUp size={14} color="#22c55e" /> : <Icons.ArrowDown size={14} color="#ef4444" />}
                  <span style={{ fontSize: '12px', fontWeight: 600, color: stat.change >= 0 ? '#22c55e' : '#ef4444' }}>{Math.abs(stat.change)}%</span>
                </div>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: stat.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>{stat.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart + Traffic */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 600 }}>فروش اخیر</h3>
            <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{recentSales.length} سفارش</span>
          </div>
          {recentSales.length === 0 ? <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>داده‌ای موجود نیست</p> : (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '180px', padding: '0 4px' }}>
              {recentSales.map((s: any, i: number) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 500 }}>${s.revenue}</span>
                  <div style={{ width: '100%', height: `${(s.revenue / maxSaleRevenue) * 100}%`, background: 'linear-gradient(180deg, #3b82f6, #1d4ed8)', borderRadius: '4px 4px 0 0', minHeight: '8px' }} />
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{s.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>منابع ترافیک</h3>
          {trafficSources.map((src, i) => (
            <div key={i} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontSize: '12px', fontWeight: 500 }}>{src.source}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{src.visitors.toLocaleString()}</span>
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
            {hourlyOrders.map((h: any, i: number) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{h.orders}</span>
                <div style={{ width: '100%', height: `${(h.orders / maxHourlyOrders) * 100}%`, background: h.orders >= 70 ? '#22c55e' : h.orders >= 40 ? '#3b82f6' : '#94a3b8', borderRadius: '3px 3px 0 0', minHeight: '4px' }} />
                <span style={{ fontSize: '9px', color: 'var(--text-muted)' }}>{h.hour}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>پرفروش\u200cترین محصولات</h3>
          {topProducts.map((p: any, i: number) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < topProducts.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ width: '24px', height: '24px', borderRadius: '50%', background: i < 3 ? 'var(--primary)' : 'var(--hover-bg)', color: i < 3 ? 'white' : 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', fontWeight: 600 }}>{i + 1}</span>
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
      {recentSales.length > 0 && (
        <div className="card">
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 600 }}>گزارش فروش اخیر</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>تاریخ</th>
                <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>درآمد</th>
                <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>بازگشت</th>
                <th style={{ textAlign: 'right', padding: '10px 12px', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)' }}>نمودار</th>
              </tr>
            </thead>
            <tbody>
              {recentSales.map((s: any, i: number) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '12px', fontSize: '13px' }}>{s.date}</td>
                  <td style={{ padding: '12px', fontSize: '13px', fontWeight: 600, color: '#22c55e' }}>${s.revenue.toLocaleString()}</td>
                  <td style={{ padding: '12px', fontSize: '13px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '11px', background: s.returns === 0 ? 'var(--badge-success-bg)' : 'var(--badge-danger-bg)', color: s.returns === 0 ? 'var(--badge-success-text)' : 'var(--badge-danger-text)' }}>{s.returns}</span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <div style={{ width: '100%', height: '6px', background: 'var(--hover-bg)', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ width: `${(s.revenue / maxSaleRevenue) * 100}%`, height: '100%', background: '#3b82f6', borderRadius: '3px' }} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
