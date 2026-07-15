'use client';

import { useState, useEffect } from 'react';
import { Icons } from '../../components/Icons';
import { api } from '../../lib/api';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  orders: number;
  totalSpent: number;
  status: 'active' | 'inactive';
  joinDate: string;
  lastLogin: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const refreshCustomers = async () => {
    try {
      const data = await api.getCustomers() as any[];
      const mapped = data.map((c: any) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone || '-',
        orders: c.orders || 0,
        totalSpent: c.totalSpent || 0,
        status: 'active' as const,
        joinDate: new Date(c.createdAt).toLocaleDateString('fa-IR'),
        lastLogin: new Date(c.updatedAt).toLocaleDateString('fa-IR'),
      }));
      setCustomers(mapped);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { refreshCustomers(); }, []);

  const filteredCustomers = customers.filter(c => {
    const matchSearch = !searchQuery || c.name.includes(searchQuery) || c.email.includes(searchQuery) || c.phone.includes(searchQuery);
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalSpent = filteredCustomers.reduce((sum, c) => sum + c.totalSpent, 0);
  const activeCustomers = filteredCustomers.filter(c => c.status === 'active').length;

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>مدیریت مشتریان</h1>
        <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>{filteredCustomers.length} مشتری ثبت‌شده</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'کل مشتریان', value: filteredCustomers.length, color: '#3b82f6', icon: <Icons.Users size={20} /> },
          { label: 'مشتریان فعال', value: activeCustomers, color: '#22c55e', icon: <Icons.Check size={20} /> },
          { label: 'کل خرید', value: `$${totalSpent.toLocaleString()}`, color: '#8b5cf6', icon: <Icons.DollarSign size={20} /> },
          { label: 'میانگین خرید', value: filteredCustomers.length ? `$${Math.round(totalSpent / filteredCustomers.length)}` : '$0', color: '#f59e0b', icon: <Icons.TrendingUp size={20} /> },
        ].map((s, i) => (
          <div key={i} className="card" style={{ padding: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0 }}>{s.label}</p>
                <p style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text)', margin: '6px 0 0' }}>{s.value}</p>
              </div>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: s.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color }}>{s.icon}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input type="text" placeholder="جستجو..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="input" style={{ flex: 1, minWidth: '200px' }} />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input" style={{ width: '160px' }}>
          <option value="all">همه وضعیت‌ها</option>
          <option value="active">فعال</option>
          <option value="inactive">غیرفعال</option>
        </select>
      </div>

      {/* Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>مشتری</th>
              <th>ایمیل</th>
              <th>تلفن</th>
              <th>سفارشات</th>
              <th>مجموع خرید</th>
              <th>تاریخ عضویت</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map(c => (
              <tr key={c.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--hover-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
                      {c.name.charAt(0)}
                    </div>
                    <span style={{ fontWeight: 500 }}>{c.name}</span>
                  </div>
                </td>
                <td style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{c.email}</td>
                <td style={{ fontSize: '13px', direction: 'ltr' }}>{c.phone}</td>
                <td style={{ fontWeight: 500 }}>{c.orders}</td>
                <td style={{ fontWeight: 600, color: '#22c55e' }}>${c.totalSpent.toLocaleString()}</td>
                <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{c.joinDate}</td>
              </tr>
            ))}
            {filteredCustomers.length === 0 && (
              <tr><td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>مشتری‌ای یافت نشد</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
