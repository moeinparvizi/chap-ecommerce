'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '../components/Icons';
import { api } from '../lib/api';

export default function AdminDashboard() {
  const router = useRouter();
  const [period, setPeriod] = useState('7days');
  const [stats, setStats] = useState({ products: 0, categories: 0, orders: 0, revenue: 0, customers: 0 });
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [categoryStats, setCategoryStats] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [products, orders, categories, customers] = await Promise.all([
          api.getProducts() as Promise<any[]>,
          api.getOrders() as Promise<any[]>,
          api.getCategories() as Promise<any[]>,
          api.getCustomers() as Promise<any[]>,
        ]);
        const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.amount || 0), 0);
        setStats({
          products: products.length,
          categories: categories.length,
          orders: orders.length,
          revenue: totalRevenue,
          customers: customers.length,
        });
        setTopProducts(products.slice(0, 5).map((p: any) => ({
          name: p.name, category: p.category?.name || '-', sold: p.sales || 0, revenue: p.price * (p.sales || 0), stock: p.stock
        })));
        setRecentOrders(orders.slice(0, 8).map((o: any) => ({
          id: '#' + o.id.slice(0, 8).toUpperCase(), customer: o.customerName, amount: `$${o.amount}`,
          status: o.status?.toLowerCase() || 'pending', time: new Date(o.createdAt).toLocaleDateString('fa-IR'),
        })));
        setCategoryStats(categories.map((c: any) => ({
          name: c.name, count: c._count?.products || 0,
        })));
      } catch (e) { console.error(e); }
    };
    load();
  }, []);

  const kpiStats = [
    { label: 'کل فروش', value: `$${stats.revenue.toLocaleString()}`, icon: <Icons.DollarSign size={22} />, color: '#22c55e', sparkline: [30, 45, 35, 55, 48, 62, 58, 72, 65, 80] },
    { label: 'سفارشات', value: String(stats.orders), icon: <Icons.Package size={22} />, color: '#3b82f6', sparkline: [20, 28, 35, 32, 40, 38, 45, 42, 50, 48] },
    { label: 'مشتریان', value: String(stats.customers), icon: <Icons.Users size={22} />, color: '#8b5cf6', sparkline: [15, 22, 28, 32, 35, 42, 48, 52, 58, 65] },
    { label: 'محصولات', value: String(stats.products), icon: <Icons.Tag size={22} />, color: '#f59e0b', sparkline: [40, 42, 45, 48, 50, 52, 55, 58, 60, stats.products] },
    { label: 'دسته‌بندی‌ها', value: String(stats.categories), icon: <Icons.Folder size={22} />, color: '#ec4899', sparkline: [3, 3, 4, 4, 4, 5, 5, 5, 6, stats.categories] },
    { label: 'میانگین سفارش', value: stats.orders ? `$${Math.round(stats.revenue / stats.orders)}` : '$0', icon: <Icons.ShoppingCart size={22} />, color: '#06b6d4', sparkline: [82, 85, 88, 90, 93, 95, 97, 98, 100, 101] },
  ];

  const maxCatCount = Math.max(...categoryStats.map((c: any) => c.count), 1);
  const categoryColors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#22c55e', '#ef4444', '#06b6d4', '#6b7280'];

  const statusLabels: Record<string, { text: string; color: string; bg: string }> = {
    pending: { text: 'در انتظار', color: '#991b1b', bg: 'var(--badge-danger-bg)' },
    processing: { text: 'در حال پردازش', color: '#92400e', bg: 'rgba(245,158,11,0.15)' },
    shipped: { text: 'ارسال شده', color: '#1e40af', bg: '#dbeafe' },
    delivered: { text: 'تحویل شده', color: '#166534', bg: 'var(--badge-success-bg)' },
    cancelled: { text: 'لغو شده', color: '#991b1b', bg: 'var(--badge-danger-bg)' },
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>داشبورد مدیریت</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '4px 0 0' }}>خلاصه عملکرد فروشگاه</p>
        </div>
        <select value={period} onChange={e => setPeriod(e.target.value)} style={{ padding: '8px 16px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', background: 'var(--input-bg)', color: 'var(--text)' }}>
          <option value="today">امروز</option>
          <option value="7days">۷ روز اخیر</option>
          <option value="30days">۳۰ روز اخیر</option>
        </select>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {kpiStats.map((stat, index) => (
          <div key={index} className="card" style={{ padding: '20px', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0 }}>{stat.label}</p>
                <p style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text)', margin: '8px 0 4px' }}>{stat.value}</p>
              </div>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: stat.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                {stat.icon}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '30px', marginTop: '12px' }}>
              {stat.sparkline.map((v: number, i: number) => {
                const max = Math.max(...stat.sparkline);
                const h = (v / max) * 100;
                return <div key={i} style={{ flex: 1, height: `${h}%`, background: stat.color + '40', borderRadius: '2px' }} />;
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart + Category Breakdown */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* Stats Summary */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>خلاصه آمار</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', padding: '16px 0' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>${(stats.revenue / 1000).toFixed(0)}k</p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>درآمد کل</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '22px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>{stats.orders}</p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>کل سفارشات</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '22px', fontWeight: 700, color: '#22c55e', margin: 0 }}>{stats.orders ? `$${Math.round(stats.revenue / stats.orders)}` : '$0'}</p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>میانگین سفارش</p>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 20px' }}>فروش بر اساس دسته</h3>
          {categoryStats.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>داده‌ای موجود نیست</p>
          ) : categoryStats.map((cat: any, i: number) => (
            <div key={i} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 500 }}>{cat.name}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{cat.count} محصول</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--hover-bg)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${(cat.count / maxCatCount) * 100}%`, height: '100%', background: categoryColors[i % categoryColors.length], borderRadius: '4px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Orders + Top Products */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>آخرین سفارشات</h3>
            <button onClick={() => router.push('/admin/orders')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>مشاهده همه <Icons.ExternalLink size={12} /></button>
          </div>
          {recentOrders.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '20px' }}>داده‌ای موجود نیست</p>
          ) : recentOrders.map((order: any, i: number) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < recentOrders.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--hover-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {order.customer.charAt(0)}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 500 }}>{order.customer}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>{order.id}</p>
                </div>
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600 }}>{order.amount}</p>
                <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 500, background: statusLabels[order.status]?.bg || 'var(--hover-bg)', color: statusLabels[order.status]?.color || 'var(--text-secondary)' }}>
                  {statusLabels[order.status]?.text || order.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>پرفروش\u200cترین محصولات</h3>
            <button onClick={() => router.push('/admin/products')} style={{ background: 'none', border: 'none', color: 'var(--primary)', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>مشاهده همه <Icons.ExternalLink size={12} /></button>
          </div>
          {topProducts.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', textAlign: 'center', padding: '20px' }}>داده‌ای موجود نیست</p>
          ) : topProducts.map((p: any, i: number) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < topProducts.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ width: '28px', height: '28px', borderRadius: '8px', background: i < 3 ? 'var(--primary)' : 'var(--hover-bg)', color: i < 3 ? 'white' : 'var(--text)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 600 }}>{i + 1}</span>
                <div>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 500 }}>{p.name}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>{p.category} · {p.sold} فروش</p>
                </div>
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#22c55e' }}>${p.revenue.toLocaleString()}</p>
                <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>{p.stock} موجود</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 16px' }}>دسترسی سریع</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '12px' }}>
          {[
            { icon: <Icons.Package size={24} />, label: 'سفارشات', path: '/admin/orders' },
            { icon: <Icons.Tag size={24} />, label: 'محصولات', path: '/admin/products' },
            { icon: <Icons.Users size={24} />, label: 'مشتریان', path: '/admin/customers' },
            { icon: <Icons.TrendingUp size={24} />, label: 'تحلیل\u200cها', path: '/admin/analytics' },
            { icon: <Icons.Megaphone size={24} />, label: 'بازاریابی', path: '/admin/marketing' },
            { icon: <Icons.Settings size={24} />, label: 'تنظیمات', path: '/admin/settings' },
          ].map((item, i) => (
            <button key={i} onClick={() => router.push(item.path)} style={{ padding: '16px', background: 'var(--table-header-bg)', border: '1px solid var(--border)', borderRadius: '10px', cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
              <div style={{ marginBottom: '8px', color: 'var(--text-secondary)' }}>{item.icon}</div>
              <div style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text)' }}>{item.label}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
