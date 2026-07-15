'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Icons } from '../components/Icons';

export default function AdminDashboard() {
  const router = useRouter();
  const [period, setPeriod] = useState('7days');

  const stats = [
    { label: 'کل فروش', value: '$124,563', change: '+12.5%', positive: true, icon: <Icons.DollarSign size={22} />, color: '#22c55e', sparkline: [30, 45, 35, 55, 48, 62, 58, 72, 65, 80] },
    { label: 'سفارشات', value: '1,234', change: '+8.2%', positive: true, icon: <Icons.Package size={22} />, color: '#3b82f6', sparkline: [20, 28, 35, 32, 40, 38, 45, 42, 50, 48] },
    { label: 'مشتریان', value: '5,678', change: '+15.3%', positive: true, icon: <Icons.Users size={22} />, color: '#8b5cf6', sparkline: [15, 22, 28, 32, 35, 42, 48, 52, 58, 65] },
    { label: 'نرخ تبدیل', value: '3.24%', change: '+0.8%', positive: true, icon: <Icons.TrendingUp size={22} />, color: '#f59e0b', sparkline: [2.1, 2.3, 2.5, 2.8, 2.9, 3.0, 3.1, 3.2, 3.24, 3.3] },
    { label: 'میانگین سفارش', value: '$101', change: '+6.1%', positive: true, icon: <Icons.ShoppingCart size={22} />, color: '#ec4899', sparkline: [82, 85, 88, 90, 93, 95, 97, 98, 100, 101] },
    { label: 'بازگشت سفارش', value: '2.1%', change: '-0.3%', positive: true, icon: <Icons.RotateCcw size={22} />, color: '#06b6d4', sparkline: [3.2, 3.0, 2.8, 2.7, 2.5, 2.4, 2.3, 2.2, 2.15, 2.1] },
  ];

  const revenueData = [
    { day: 'شنبه', revenue: 18500, orders: 183 },
    { day: 'یکشنبه', revenue: 22300, orders: 221 },
    { day: 'دوشنبه', revenue: 19800, orders: 196 },
    { day: 'سه\u200cشنبه', revenue: 25600, orders: 253 },
    { day: 'چهارشنبه', revenue: 21200, orders: 210 },
    { day: 'پنجشنبه', revenue: 28400, orders: 281 },
    { day: 'جمعه', revenue: 24200, orders: 240 },
  ];
  const maxRevenue = Math.max(...revenueData.map(d => d.revenue));

  const recentOrders = [
    { id: '#10234', customer: 'علی محمدی', amount: '$245', status: 'delivered', time: '۱۵ دقیقه پیش' },
    { id: '#10233', customer: 'سارا احمدی', amount: '$189', status: 'processing', time: '۳۲ دقیقه پیش' },
    { id: '#10232', customer: 'رضا حسینی', amount: '$567', status: 'shipped', time: '۱ ساعت پیش' },
    { id: '#10231', customer: 'مریم کریمی', amount: '$123', status: 'pending', time: '۱ ساعت پیش' },
    { id: '#10230', customer: 'حسن رضایی', amount: '$892', status: 'delivered', time: '۲ ساعت پیش' },
    { id: '#10229', customer: 'زهرا عباسی', amount: '$345', status: 'processing', time: '۲ ساعت پیش' },
    { id: '#10228', customer: 'امیر نوری', amount: '$678', status: 'shipped', time: '۳ ساعت پیش' },
    { id: '#10227', customer: 'نیلوفر شریفی', amount: '$156', status: 'delivered', time: '۴ ساعت پیش' },
  ];

  const topProducts = [
    { name: 'iPhone 15 Pro Max', category: 'موبایل', sold: 234, revenue: 280566, stock: 45 },
    { name: 'MacBook Pro M3', category: 'لپتاپ', sold: 89, revenue: 177911, stock: 12 },
    { name: 'Nike Air Max 90', category: 'کفش', sold: 567, revenue: 73143, stock: 230 },
    { name: 'Sony WH-1000XM5', category: 'هدست', sold: 456, revenue: 159144, stock: 67 },
    { name: 'iPad Air M2', category: 'تبلت', sold: 123, revenue: 73677, stock: 34 },
  ];

  const categoryStats = [
    { name: 'موبایل', percentage: 35, revenue: 43597, color: '#3b82f6' },
    { name: 'لپتاپ', percentage: 25, revenue: 31141, color: '#8b5cf6' },
    { name: 'پوشاک', percentage: 18, revenue: 22421, color: '#ec4899' },
    { name: 'لوازم خانگی', percentage: 12, revenue: 14948, color: '#f59e0b' },
    { name: 'سایر', percentage: 10, revenue: 12456, color: '#6b7280' },
  ];

  const statusLabels: Record<string, { text: string; color: string; bg: string }> = {
    delivered: { text: 'تحویل شده', color: '#166534', bg: '#dcfce7' },
    processing: { text: 'در حال پردازش', color: '#92400e', bg: '#fef3c7' },
    shipped: { text: 'ارسال شده', color: '#1e40af', bg: '#dbeafe' },
    pending: { text: 'در انتظار', color: '#991b1b', bg: '#fee2e2' },
  };

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, margin: 0 }}>داشبورد مدیریت</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '14px', margin: '4px 0 0' }}>خلاصه عملکرد فروشگاه</p>
        </div>
        <select value={period} onChange={e => setPeriod(e.target.value)} style={{ padding: '8px 16px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', background: 'var(--input-bg)', color: 'var(--text)' }}>
          <option value="today">امروز</option>
          <option value="7days">۷ روز اخیر</option>
          <option value="30days">۳۰ روز اخیر</option>
          <option value="90days">۹۰ روز اخیر</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {stats.map((stat, index) => (
          <div key={index} className="card" style={{ padding: '20px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0 }}>{stat.label}</p>
                <p style={{ fontSize: '28px', fontWeight: 700, color: 'var(--text)', margin: '8px 0 4px' }}>{stat.value}</p>
                <span style={{ fontSize: '13px', fontWeight: 500, color: stat.positive ? '#22c55e' : '#ef4444' }}>
                  {stat.positive ? <><Icons.ArrowUp size={14} color="#22c55e" /></> : <><Icons.ArrowDown size={14} color="#ef4444" /></>} {stat.change}
                </span>
              </div>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: stat.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: stat.color }}>
                {stat.icon}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '30px', marginTop: '12px' }}>
              {stat.sparkline.map((v, i) => {
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
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>درآمد روزانه</h3>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>این هفته</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '12px', height: '200px', padding: '0 8px' }}>
            {revenueData.map((d, i) => (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 500 }}>${(d.revenue / 1000).toFixed(1)}k</span>
                <div style={{ width: '100%', height: `${(d.revenue / maxRevenue) * 100}%`, background: 'linear-gradient(180deg, #3b82f6, #1d4ed8)', borderRadius: '6px 6px 0 0', minHeight: '8px' }} />
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{d.day}</span>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: '16px', padding: '12px 0', borderTop: '1px solid var(--border-light)' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>$160,000</p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>کل درآمد هفته</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '20px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>1,584</p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>کل سفارشات هفته</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '20px', fontWeight: 700, color: '#22c55e', margin: 0 }}>$101</p>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '4px 0 0' }}>میانگین سفارش</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 style={{ fontSize: '16px', fontWeight: 600, margin: '0 0 20px' }}>فروش بر اساس دسته</h3>
          {categoryStats.map((cat, i) => (
            <div key={i} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 500 }}>{cat.name}</span>
                <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>${cat.revenue.toLocaleString()}</span>
              </div>
              <div style={{ width: '100%', height: '8px', background: 'var(--hover-bg)', borderRadius: '4px', overflow: 'hidden' }}>
                <div style={{ width: `${cat.percentage}%`, height: '100%', background: cat.color, borderRadius: '4px' }} />
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{cat.percentage}%</span>
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
          {recentOrders.map((order, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: i < recentOrders.length - 1 ? '1px solid var(--border-light)' : 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--hover-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
                  {order.customer.charAt(0)}
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: 500 }}>{order.customer}</p>
                  <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>{order.id} · {order.time}</p>
                </div>
              </div>
              <div style={{ textAlign: 'left' }}>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600 }}>{order.amount}</p>
                <span style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 500, background: statusLabels[order.status]?.bg, color: statusLabels[order.status]?.color }}>
                  {statusLabels[order.status]?.text}
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
          {topProducts.map((p, i) => (
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
