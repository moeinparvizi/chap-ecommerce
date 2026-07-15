'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '../../components/Icons';
import { api } from '../../lib/api';

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  items: number;
  total: number;
  status: string;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  const refreshOrders = async () => {
    try {
      const data = await api.getOrders() as any[];
      const mapped = data.map((o: any) => ({
        id: o.id,
        orderNumber: '#' + o.id.slice(0, 8).toUpperCase(),
        customer: o.customerName,
        email: o.customerName + '@email.com',
        items: o.items || 1,
        total: o.amount,
        status: o.status?.toLowerCase() || 'pending',
        paymentStatus: o.status === 'DELIVERED' ? 'paid' : o.status === 'CANCELLED' ? 'refunded' : 'paid',
        createdAt: new Date(o.createdAt).toLocaleDateString('fa-IR'),
        updatedAt: new Date(o.updatedAt).toLocaleDateString('fa-IR'),
      }));
      setOrders(mapped);
      setFilteredOrders(mapped);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { refreshOrders(); }, []);

  useEffect(() => {
    let result = [...orders];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(o => o.customer.toLowerCase().includes(q) || o.orderNumber.toLowerCase().includes(q));
    }
    if (statusFilter !== 'all') result = result.filter(o => o.status === statusFilter);
    setFilteredOrders(result);
  }, [searchQuery, statusFilter, orders]);

  const getStatusColor = (s: string) => {
    const c: Record<string, { bg: string; text: string }> = {
      pending: { bg: 'var(--badge-danger-bg)', text: 'var(--badge-danger-text)' },
      processing: { bg: 'rgba(59,130,246,0.15)', text: '#3b82f6' },
      shipped: { bg: 'var(--badge-success-bg)', text: 'var(--badge-success-text)' },
      delivered: { bg: 'var(--badge-success-bg)', text: 'var(--badge-success-text)' },
      cancelled: { bg: 'var(--badge-danger-bg)', text: 'var(--badge-danger-text)' },
    };
    return c[s] || { bg: 'var(--hover-bg)', text: 'var(--text-secondary)' };
  };

  const getStatusText = (s: string) => {
    const t: Record<string, string> = { pending: 'در انتظار', confirmed: 'تایید شده', processing: 'در حال پردازش', shipped: 'ارسال شده', delivered: 'تحویل شده', cancelled: 'لغو شده' };
    return t[s] || s;
  };

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await api.updateOrder(orderId, { status: newStatus.toUpperCase() });
      await refreshOrders();
    } catch (e) { alert('خطا در بروزرسانی وضعیت'); }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (confirm('آیا از حذف این سفارش اطمینان دارید؟')) {
      try {
        await api.deleteOrder(orderId);
        await refreshOrders();
        setShowOrderModal(false);
      } catch (e) { alert('خطا در حذف'); }
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>مدیریت سفارشات</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>{filteredOrders.length} سفارش</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <input type="text" placeholder="جستجو..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="input" style={{ flex: 1, minWidth: '200px' }} />
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input" style={{ width: '160px' }}>
          <option value="all">همه وضعیت‌ها</option>
          <option value="pending">در انتظار</option>
          <option value="processing">در حال پردازش</option>
          <option value="shipped">ارسال شده</option>
          <option value="delivered">تحویل شده</option>
          <option value="cancelled">لغو شده</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>شماره سفارش</th>
              <th>مشتری</th>
              <th>تعداد اقلام</th>
              <th>مبلغ</th>
              <th>وضعیت</th>
              <th>تاریخ</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id}>
                <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{order.orderNumber}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--hover-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', color: 'var(--text-secondary)' }}>
                      {order.customer.charAt(0)}
                    </div>
                    <div>
                      <p style={{ margin: 0, fontSize: '13px', fontWeight: 500 }}>{order.customer}</p>
                      <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-muted)' }}>{order.email}</p>
                    </div>
                  </div>
                </td>
                <td>{order.items}</td>
                <td style={{ fontWeight: 600 }}>${order.total.toLocaleString()}</td>
                <td><span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, ...getStatusColor(order.status) }}>{getStatusText(order.status)}</span></td>
                <td style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{order.createdAt}</td>
                <td>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button onClick={() => { setSelectedOrder(order); setShowOrderModal(true); }} className="btn btn-ghost" style={{ padding: '6px 10px', fontSize: '12px' }}>
                      <Icons.Eye size={14} />
                    </button>
                    <select value={order.status} onChange={e => handleStatusChange(order.id, e.target.value)} style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid var(--border)', background: 'var(--input-bg)', color: 'var(--text)', fontSize: '11px', cursor: 'pointer' }}>
                      <option value="pending">در انتظار</option>
                      <option value="processing">پردازش</option>
                      <option value="shipped">ارسال</option>
                      <option value="delivered">تحویل</option>
                      <option value="cancelled">لغو</option>
                    </select>
                  </div>
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr><td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>سفارشی یافت نشد</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowOrderModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>جزئیات سفارش {selectedOrder.orderNumber}</h2>
              <button onClick={() => setShowOrderModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', fontSize: '20px' }}><Icons.X size={20} /></button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>مشتری</p>
                <p style={{ fontSize: '14px', fontWeight: 600 }}>{selectedOrder.customer}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>ایمیل</p>
                <p style={{ fontSize: '14px' }}>{selectedOrder.email}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>مبلغ</p>
                <p style={{ fontSize: '18px', fontWeight: 700, color: '#22c55e' }}>${selectedOrder.total.toLocaleString()}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>تعداد اقلام</p>
                <p style={{ fontSize: '14px', fontWeight: 600 }}>{selectedOrder.items}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>تاریخ ایجاد</p>
                <p style={{ fontSize: '13px' }}>{selectedOrder.createdAt}</p>
              </div>
              <div>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '4px' }}>وضعیت</p>
                <span style={{ padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 500, ...getStatusColor(selectedOrder.status) }}>{getStatusText(selectedOrder.status)}</span>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
              <select value={selectedOrder.status} onChange={e => handleStatusChange(selectedOrder.id, e.target.value)} className="input" style={{ flex: 1 }}>
                <option value="pending">در انتظار</option>
                <option value="processing">پردازش</option>
                <option value="shipped">ارسال شده</option>
                <option value="delivered">تحویل شده</option>
                <option value="cancelled">لغو شده</option>
              </select>
              <button onClick={() => handleDeleteOrder(selectedOrder.id)} style={{ padding: '10px 20px', background: 'var(--badge-danger-bg)', color: 'var(--badge-danger-text)', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>حذف</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
