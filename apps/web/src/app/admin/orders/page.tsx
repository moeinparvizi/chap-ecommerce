'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  items: number;
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
  updatedAt: string;
}

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);

  // Demo orders data
  useEffect(() => {
    const demoOrders: Order[] = [
      { id: '1', orderNumber: '#ORD-2024-001', customer: 'علی رضایی', email: 'ali@email.com', items: 3, total: 299.00, status: 'delivered', paymentStatus: 'paid', createdAt: '2024-01-15', updatedAt: '2024-01-18' },
      { id: '2', orderNumber: '#ORD-2024-002', customer: 'مریم احمدی', email: 'maryam@email.com', items: 1, total: 149.50, status: 'shipped', paymentStatus: 'paid', createdAt: '2024-01-15', updatedAt: '2024-01-16' },
      { id: '3', orderNumber: '#ORD-2024-003', customer: 'محمد حسینی', email: 'mohammad@email.com', items: 5, total: 89.99, status: 'delivered', paymentStatus: 'paid', createdAt: '2024-01-14', updatedAt: '2024-01-17' },
      { id: '4', orderNumber: '#ORD-2024-004', customer: 'زهرا کریمی', email: 'zahra@email.com', items: 2, total: 450.00, status: 'pending', paymentStatus: 'pending', createdAt: '2024-01-14', updatedAt: '2024-01-14' },
      { id: '5', orderNumber: '#ORD-2024-005', customer: 'امیر محمدی', email: 'amir@email.com', items: 1, total: 175.25, status: 'delivered', paymentStatus: 'paid', createdAt: '2024-01-13', updatedAt: '2024-01-16' },
      { id: '6', orderNumber: '#ORD-2024-006', customer: 'سارا نوری', email: 'sara@email.com', items: 4, total: 320.00, status: 'processing', paymentStatus: 'paid', createdAt: '2024-01-13', updatedAt: '2024-01-14' },
      { id: '7', orderNumber: '#ORD-2024-007', customer: 'رضا عباسی', email: 'reza@email.com', items: 2, total: 199.99, status: 'cancelled', paymentStatus: 'refunded', createdAt: '2024-01-12', updatedAt: '2024-01-13' },
      { id: '8', orderNumber: '#ORD-2024-008', customer: 'نیلوفر شریفی', email: 'niloofar@email.com', items: 6, total: 567.50, status: 'delivered', paymentStatus: 'paid', createdAt: '2024-01-12', updatedAt: '2024-01-15' },
      { id: '9', orderNumber: '#ORD-2024-009', customer: 'حسین رستمی', email: 'hossein@email.com', items: 1, total: 89.00, status: 'confirmed', paymentStatus: 'paid', createdAt: '2024-01-11', updatedAt: '2024-01-12' },
      { id: '10', orderNumber: '#ORD-2024-010', customer: 'فاطمه زارعی', email: 'fateme@email.com', items: 3, total: 245.75, status: 'shipped', paymentStatus: 'paid', createdAt: '2024-01-11', updatedAt: '2024-01-14' },
    ];
    setOrders(demoOrders);
    setFilteredOrders(demoOrders);
  }, []);

  // Filter orders
  useEffect(() => {
    let result = [...orders];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(order => 
        order.orderNumber.toLowerCase().includes(query) ||
        order.customer.toLowerCase().includes(query) ||
        order.email.toLowerCase().includes(query)
      );
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }
    
    if (paymentFilter !== 'all') {
      result = result.filter(order => order.paymentStatus === paymentFilter);
    }
    
    setFilteredOrders(result);
  }, [searchQuery, statusFilter, paymentFilter, orders]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      pending: { bg: '#fef3c7', text: '#92400e' },
      confirmed: { bg: '#dbeafe', text: '#1e40af' },
      processing: { bg: '#e0e7ff', text: '#4338ca' },
      shipped: { bg: '#fef3c7', text: '#92400e' },
      delivered: { bg: '#dcfce7', text: '#166534' },
      cancelled: { bg: '#fee2e2', text: '#991b1b' },
    };
    return colors[status] || { bg: '#f3f4f6', text: '#374151' };
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: 'در انتظار',
      confirmed: 'تایید شده',
      processing: 'در حال پردازش',
      shipped: 'ارسال شده',
      delivered: 'تحویل شده',
      cancelled: 'لغو شده',
    };
    return texts[status] || status;
  };

  const getPaymentStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      pending: { bg: '#fef3c7', text: '#92400e' },
      paid: { bg: '#dcfce7', text: '#166534' },
      failed: { bg: '#fee2e2', text: '#991b1b' },
      refunded: { bg: '#e0e7ff', text: '#4338ca' },
    };
    return colors[status] || { bg: '#f3f4f6', text: '#374151' };
  };

  const getPaymentStatusText = (status: string) => {
    const texts: Record<string, string> = {
      pending: 'در انتظار پرداخت',
      paid: 'پرداخت شده',
      failed: 'ناموفق',
      refunded: 'بازپرداخت شده',
    };
    return texts[status] || status;
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderModal(true);
  };

  const handleUpdateStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus as Order['status'], updatedAt: new Date().toISOString().split('T')[0] }
        : order
    ));
    setShowOrderModal(false);
  };

  const handleDeleteOrder = (orderId: string) => {
    if (confirm('آیا از حذف این سفارش اطمینان دارید؟')) {
      setOrders(orders.filter(order => order.id !== orderId));
      setShowOrderModal(false);
    }
  };

  const orderStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing' || o.status === 'confirmed').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
    totalRevenue: orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.total, 0),
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            مدیریت سفارشات
          </h1>
          <p style={{ color: '#64748b', marginTop: '4px' }}>
            {filteredOrders.length} سفارش یافت شد
          </p>
        </div>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '10px 20px',
            background: '#2563eb',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          🔄 بروزرسانی
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #e5e7eb' }}>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>کل سفارشات</p>
          <p style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: '4px 0' }}>{orderStats.total}</p>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #e5e7eb' }}>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>در انتظار</p>
          <p style={{ fontSize: '24px', fontWeight: 700, color: '#f59e0b', margin: '4px 0' }}>{orderStats.pending}</p>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #e5e7eb' }}>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>در حال پردازش</p>
          <p style={{ fontSize: '24px', fontWeight: 700, color: '#8b5cf6', margin: '4px 0' }}>{orderStats.processing}</p>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #e5e7eb' }}>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>ارسال شده</p>
          <p style={{ fontSize: '24px', fontWeight: 700, color: '#3b82f6', margin: '4px 0' }}>{orderStats.shipped}</p>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #e5e7eb' }}>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>تحویل شده</p>
          <p style={{ fontSize: '24px', fontWeight: 700, color: '#22c55e', margin: '4px 0' }}>{orderStats.delivered}</p>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #e5e7eb' }}>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>لغو شده</p>
          <p style={{ fontSize: '24px', fontWeight: 700, color: '#ef4444', margin: '4px 0' }}>{orderStats.cancelled}</p>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #e5e7eb' }}>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>درآمد کل</p>
          <p style={{ fontSize: '24px', fontWeight: 700, color: '#22c55e', margin: '4px 0' }}>${orderStats.totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        <input
          type="text"
          placeholder="جستجو در سفارشات..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            minWidth: '250px',
            padding: '10px 16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none'
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '10px 16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
            minWidth: '150px'
          }}
        >
          <option value="all">همه وضعیت‌ها</option>
          <option value="pending">در انتظار</option>
          <option value="confirmed">تایید شده</option>
          <option value="processing">در حال پردازش</option>
          <option value="shipped">ارسال شده</option>
          <option value="delivered">تحویل شده</option>
          <option value="cancelled">لغو شده</option>
        </select>
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          style={{
            padding: '10px 16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
            minWidth: '150px'
          }}
        >
          <option value="all">همه وضعیت پرداخت</option>
          <option value="pending">در انتظار پرداخت</option>
          <option value="paid">پرداخت شده</option>
          <option value="failed">ناموفق</option>
          <option value="refunded">بازپرداخت شده</option>
        </select>
      </div>

      {/* Orders Table */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ textAlign: 'right', padding: '14px 16px', fontSize: '13px', fontWeight: 600, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                شماره سفارش
              </th>
              <th style={{ textAlign: 'right', padding: '14px 16px', fontSize: '13px', fontWeight: 600, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                مشتری
              </th>
              <th style={{ textAlign: 'right', padding: '14px 16px', fontSize: '13px', fontWeight: 600, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                اقلام
              </th>
              <th style={{ textAlign: 'right', padding: '14px 16px', fontSize: '13px', fontWeight: 600, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                مبلغ کل
              </th>
              <th style={{ textAlign: 'right', padding: '14px 16px', fontSize: '13px', fontWeight: 600, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                وضعیت سفارش
              </th>
              <th style={{ textAlign: 'right', padding: '14px 16px', fontSize: '13px', fontWeight: 600, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                وضعیت پرداخت
              </th>
              <th style={{ textAlign: 'right', padding: '14px 16px', fontSize: '13px', fontWeight: 600, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                تاریخ
              </th>
              <th style={{ textAlign: 'right', padding: '14px 16px', fontSize: '13px', fontWeight: 600, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                عملیات
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => {
              const statusColor = getStatusColor(order.status);
              const paymentColor = getPaymentStatusColor(order.paymentStatus);
              
              return (
                <tr key={order.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#2563eb' }}>
                    {order.orderNumber}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 500, color: '#0f172a' }}>{order.customer}</div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{order.email}</div>
                  </td>
                  <td style={{ padding: '14px 16px', color: '#374151' }}>
                    {order.items} قلم
                  </td>
                  <td style={{ padding: '14px 16px', fontWeight: 600, color: '#0f172a' }}>
                    ${order.total.toFixed(2)}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 500,
                      background: statusColor.bg,
                      color: statusColor.text
                    }}>
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 500,
                      background: paymentColor.bg,
                      color: paymentColor.text
                    }}>
                      {getPaymentStatusText(order.paymentStatus)}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#64748b' }}>
                    {order.createdAt}
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <button
                      onClick={() => handleViewOrder(order)}
                      style={{
                        padding: '6px 12px',
                        background: '#f1f5f9',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        color: '#374151'
                      }}
                    >
                      مشاهده
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowOrderModal(false)}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
                جزئیات سفارش {selectedOrder.orderNumber}
              </h2>
              <button
                onClick={() => setShowOrderModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748b' }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'grid', gap: '16px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>مشتری</p>
                  <p style={{ margin: '4px 0 0', fontWeight: 600 }}>{selectedOrder.customer}</p>
                </div>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>ایمیل</p>
                  <p style={{ margin: '4px 0 0', fontWeight: 500 }}>{selectedOrder.email}</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>مبلغ کل</p>
                  <p style={{ margin: '4px 0 0', fontWeight: 700, fontSize: '18px' }}>${selectedOrder.total.toFixed(2)}</p>
                </div>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>تعداد اقلام</p>
                  <p style={{ margin: '4px 0 0', fontWeight: 600 }}>{selectedOrder.items} قلم</p>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>وضعیت سفارش</p>
                  <span style={{
                    display: 'inline-block',
                    marginTop: '4px',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 500,
                    background: getStatusColor(selectedOrder.status).bg,
                    color: getStatusColor(selectedOrder.status).text
                  }}>
                    {getStatusText(selectedOrder.status)}
                  </span>
                </div>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>وضعیت پرداخت</p>
                  <span style={{
                    display: 'inline-block',
                    marginTop: '4px',
                    padding: '4px 12px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 500,
                    background: getPaymentStatusColor(selectedOrder.paymentStatus).bg,
                    color: getPaymentStatusColor(selectedOrder.paymentStatus).text
                  }}>
                    {getPaymentStatusText(selectedOrder.paymentStatus)}
                  </span>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>تاریخ ایجاد</p>
                  <p style={{ margin: '4px 0 0', fontWeight: 500 }}>{selectedOrder.createdAt}</p>
                </div>
                <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                  <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>آخرین بروزرسانی</p>
                  <p style={{ margin: '4px 0 0', fontWeight: 500 }}>{selectedOrder.updatedAt}</p>
                </div>
              </div>

              {/* Status Update */}
              <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px' }}>
                <p style={{ margin: '0 0 8px', fontWeight: 500, fontSize: '14px' }}>تغییر وضعیت:</p>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                    <button
                      key={status}
                      onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                      disabled={selectedOrder.status === status}
                      style={{
                        padding: '6px 12px',
                        fontSize: '12px',
                        border: '1px solid #e5e7eb',
                        borderRadius: '6px',
                        background: selectedOrder.status === status ? getStatusColor(status).bg : 'white',
                        color: selectedOrder.status === status ? getStatusColor(status).text : '#374151',
                        cursor: selectedOrder.status === status ? 'default' : 'pointer',
                        opacity: selectedOrder.status === status ? 0.6 : 1
                      }}
                    >
                      {getStatusText(status)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
                <button
                  onClick={() => handleDeleteOrder(selectedOrder.id)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: '#fee2e2',
                    color: '#991b1b',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  حذف سفارش
                </button>
                <button
                  onClick={() => setShowOrderModal(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 500
                  }}
                >
                  بستن
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
