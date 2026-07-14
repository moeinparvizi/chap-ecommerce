'use client';

import { useState, useEffect } from 'react';

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

  useEffect(() => {
    setCustomers([
      { id: '1', name: 'علی رضایی', email: 'ali@email.com', phone: '09121234567', orders: 12, totalSpent: 2450, status: 'active', joinDate: '2024-01-01', lastLogin: '2024-01-15' },
      { id: '2', name: 'مریم احمدی', email: 'maryam@email.com', phone: '09351234567', orders: 8, totalSpent: 1890, status: 'active', joinDate: '2024-01-03', lastLogin: '2024-01-14' },
      { id: '3', name: 'محمد حسینی', email: 'mohammad@email.com', phone: '09191234567', orders: 15, totalSpent: 4500, status: 'active', joinDate: '2023-12-15', lastLogin: '2024-01-15' },
      { id: '4', name: 'زهرا کریمی', email: 'zahra@email.com', phone: '09011234567', orders: 5, totalSpent: 890, status: 'active', joinDate: '2024-01-05', lastLogin: '2024-01-12' },
      { id: '5', name: 'امیر محمدی', email: 'amir@email.com', phone: '09121112233', orders: 22, totalSpent: 7800, status: 'active', joinDate: '2023-11-20', lastLogin: '2024-01-15' },
      { id: '6', name: 'سارا نوری', email: 'sara@email.com', phone: '09351112233', orders: 3, totalSpent: 340, status: 'inactive', joinDate: '2024-01-10', lastLogin: '2024-01-11' },
      { id: '7', name: 'رضا عباسی', email: 'reza@email.com', phone: '09191112233', orders: 18, totalSpent: 5600, status: 'active', joinDate: '2023-12-01', lastLogin: '2024-01-14' },
      { id: '8', name: 'نیلوفر شریفی', email: 'niloofar@email.com', phone: '09011112233', orders: 7, totalSpent: 1230, status: 'active', joinDate: '2024-01-08', lastLogin: '2024-01-13' },
    ]);
  }, []);

  const filtered = customers.filter(c => {
    const matchSearch = !searchQuery || c.name.includes(searchQuery) || c.email.includes(searchQuery);
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total: customers.length,
    active: customers.filter(c => c.status === 'active').length,
    totalRevenue: customers.reduce((s, c) => s + c.totalSpent, 0),
    avgSpent: Math.round(customers.reduce((s, c) => s + c.totalSpent, 0) / customers.length),
  };

  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 700, margin: '0 0 24px' }}>مدیریت مشتریان</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[{ l: 'کل مشتریان', v: stats.total, c: '#0f172a' }, { l: 'فعال', v: stats.active, c: '#22c55e' }, { l: 'درآمد کل', v: `$${stats.totalRevenue.toLocaleString()}`, c: '#2563eb' }, { l: 'میانگین خرید', v: `$${stats.avgSpent}`, c: '#8b5cf6' }].map((s, i) => (
          <div key={i} style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #e5e7eb' }}>
            <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>{s.l}</p>
            <p style={{ fontSize: '22px', fontWeight: 700, color: s.c, margin: '4px 0' }}>{s.v}</p>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <input type="text" placeholder="جستجو..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} style={{ flex: 1, padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={{ padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
          <option value="all">همه</option>
          <option value="active">فعال</option>
          <option value="inactive">غیرفعال</option>
        </select>
      </div>

      <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={thStyle}>نام</th>
              <th style={thStyle}>ایمیل</th>
              <th style={thStyle}>تلفن</th>
              <th style={thStyle}>سفارشات</th>
              <th style={thStyle}>مجموع خرید</th>
              <th style={thStyle}>وضعیت</th>
              <th style={thStyle}>تاریخ عضویت</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(c => (
              <tr key={c.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={tdStyle}><strong>{c.name}</strong></td>
                <td style={tdStyle}>{c.email}</td>
                <td style={tdStyle} dir="ltr">{c.phone}</td>
                <td style={tdStyle}>{c.orders}</td>
                <td style={tdStyle}><strong>${c.totalSpent.toLocaleString()}</strong></td>
                <td style={tdStyle}>
                  <span style={{ padding: '4px 10px', borderRadius: '20px', fontSize: '12px', background: c.status === 'active' ? '#dcfce7' : '#fee2e2', color: c.status === 'active' ? '#166534' : '#991b1b' }}>
                    {c.status === 'active' ? 'فعال' : 'غیرفعال'}
                  </span>
                </td>
                <td style={tdStyle}>{c.joinDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle = { textAlign: 'right' as const, padding: '14px 16px', fontSize: '13px', fontWeight: 600, color: '#374151', borderBottom: '1px solid #e5e7eb' };
const tdStyle = { padding: '14px 16px', fontSize: '14px', color: '#374151' };
