'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Icons } from '../../components/Icons';
import { useNotification } from '../../lib/notifications';
import { api } from '../../lib/api';

interface Order {
  id: string;
  orderNumber: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  locationTitle: string;
  items: number;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  localItems: any[];
}

export default function OrdersPage() {
  const router = useRouter();
  const notify = useNotification();
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const refreshOrders = async () => {
    try {
      let apiOrders: any[] = [];
      try {
        const data = await api.getOrders() as any[];
        // Fetch all customers for email lookup
        let customers: any[] = [];
        try { customers = await api.getCustomers() as any[]; } catch (e) {}
        const customerMap: Record<string, any> = {};
        customers.forEach((c: any) => { customerMap[c.id] = c; });

        apiOrders = data.map((o: any) => {
          const items = o.itemsJson ? JSON.parse(o.itemsJson) : [];
          const location = o.locationJson ? JSON.parse(o.locationJson) : null;
          const customer = o.userId ? customerMap[o.userId] : null;
          return {
            id: o.id,
            orderNumber: '#' + o.id.slice(0, 8).toUpperCase(),
            customer: o.customerName,
            email: customer?.email || '—',
            phone: customer?.phone || location?.phone || '—',
            address: location ? `${location.address}, ${location.city}` : '—',
            locationTitle: location?.title || '',
            items: items.length || o.items || 1,
            total: o.amount,
            status: o.status?.toLowerCase() || 'pending',
            paymentStatus: o.status === 'DELIVERED' ? 'paid' : o.status === 'CANCELLED' ? 'refunded' : 'paid',
            createdAt: new Date(o.createdAt).toLocaleDateString('fa-IR'),
            updatedAt: new Date(o.updatedAt).toLocaleDateString('fa-IR'),
            localItems: items,
            paymentMethod: o.paymentMethod || '—',
          };
        });
      } catch (e) { /* API not available */ }

      setOrders(apiOrders);
      setFilteredOrders(apiOrders);
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
    setCurrentPage(1);
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
    } catch (e) { notify.error('خطا در بروزرسانی وضعیت'); }
  };

  const handleDeleteOrder = async (orderId: string) => {
    const confirmed = await notify.confirm({ message: 'آیا از حذف این سفارش اطمینان دارید؟', type: 'danger' });
    if (confirmed) {
      try {
        await api.deleteOrder(orderId);
        await refreshOrders();
        setShowOrderModal(false);
      } catch (e) { notify.error('خطا در حذف'); }
    }
  };

  const totalPages = Math.ceil(filteredOrders.length / ITEMS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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
            {paginatedOrders.map(order => (
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

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px', marginTop: '20px' }}>
          <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1} style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--card-bg)', color: currentPage === 1 ? 'var(--text-muted)' : 'var(--text)', cursor: currentPage === 1 ? 'default' : 'pointer', fontSize: '13px', opacity: currentPage === 1 ? 0.5 : 1 }}>قبلی</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button key={page} onClick={() => setCurrentPage(page)} style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border)', background: page === currentPage ? 'var(--primary)' : 'var(--card-bg)', color: page === currentPage ? 'white' : 'var(--text)', cursor: 'pointer', fontSize: '13px', fontWeight: page === currentPage ? 700 : 400, minWidth: '36px' }}>{page}</button>
          ))}
          <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages} style={{ padding: '8px 14px', borderRadius: '8px', border: '1px solid var(--border)', background: 'var(--card-bg)', color: currentPage === totalPages ? 'var(--text-muted)' : 'var(--text)', cursor: currentPage === totalPages ? 'default' : 'pointer', fontSize: '13px', opacity: currentPage === totalPages ? 0.5 : 1 }}>بعدی</button>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', marginRight: '10px' }}>صفحه {currentPage} از {totalPages}</span>
        </div>
      )}

      {/* Order Detail Modal */}
      {showOrderModal && selectedOrder && (
        <div className="modal-overlay" onClick={() => setShowOrderModal(false)}>
          <div className="modal" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 600, margin: 0 }}>جزئیات سفارش {selectedOrder.orderNumber}</h2>
              <button onClick={() => setShowOrderModal(false)} className="btn-close"><Icons.X size={20} /></button>
            </div>

            {/* Customer Info */}
            <div style={{ padding: '16px', borderRadius: '12px', background: 'var(--hover-bg)', marginBottom: '16px' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: '6px' }}><Icons.User size={16} /> اطلاعات مشتری</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 2px' }}>نام</p><p style={{ fontSize: '13px', fontWeight: 600, margin: 0 }}>{selectedOrder.customer}</p></div>
                <div><p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 2px' }}>ایمیل</p><p style={{ fontSize: '13px', margin: 0, direction: 'ltr', textAlign: 'left' }}>{selectedOrder.email}</p></div>
                <div><p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 2px' }}>تلفن</p><p style={{ fontSize: '13px', margin: 0, direction: 'ltr', textAlign: 'left' }}>{selectedOrder.phone}</p></div>
                <div><p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 2px' }}>روش پرداخت</p><p style={{ fontSize: '13px', margin: 0 }}>{selectedOrder.paymentMethod === 'online' ? 'پرداخت آنلاین' : selectedOrder.paymentMethod || '—'}</p></div>
              </div>
              {selectedOrder.address !== '—' && (
                <div style={{ marginTop: '10px', padding: '10px', borderRadius: '8px', background: 'var(--card-bg)', border: '1px solid var(--border)' }}>
                  <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 4px', display: 'flex', alignItems: 'center', gap: '4px' }}><Icons.MapPin size={12} /> آدرس ارسال {selectedOrder.locationTitle && `(${selectedOrder.locationTitle})`}</p>
                  <p style={{ fontSize: '13px', margin: 0, lineHeight: 1.5 }}>{selectedOrder.address}</p>
                </div>
              )}
            </div>

            {/* Order Items */}
            {selectedOrder.localItems && selectedOrder.localItems.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <h4 style={{ fontSize: '14px', fontWeight: 700, margin: '0 0 10px', display: 'flex', alignItems: 'center', gap: '6px' }}><Icons.Package size={16} /> اقلام سفارش</h4>
                <div style={{ display: 'grid', gap: '8px' }}>
                  {selectedOrder.localItems.map((item: any, i: number) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '8px', background: 'var(--hover-bg)' }}>
                      {item.image && <img src={item.image} alt="" style={{ width: '40px', height: '40px', borderRadius: '8px', objectFit: 'cover', flexShrink: 0 }} />}
                      <div style={{ flex: 1 }}><p style={{ fontSize: '13px', fontWeight: 500, margin: 0 }}>{item.name}</p><p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '2px 0 0' }}>×{item.quantity}</p></div>
                      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--primary)' }}>${(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', padding: '14px', borderRadius: '10px', background: 'var(--hover-bg)', marginBottom: '16px' }}>
              <div><p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 2px' }}>مبلغ</p><p style={{ fontSize: '16px', fontWeight: 700, color: '#22c55e', margin: 0 }}>${selectedOrder.total.toLocaleString()}</p></div>
              <div><p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 2px' }}>تاریخ</p><p style={{ fontSize: '13px', margin: 0 }}>{selectedOrder.createdAt}</p></div>
              <div><p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 2px' }}>وضعیت</p><span style={{ padding: '3px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 600, ...getStatusColor(selectedOrder.status) }}>{getStatusText(selectedOrder.status)}</span></div>
            </div>

            <div style={{ display: 'flex', gap: '8px', paddingTop: '16px', borderTop: '1px solid var(--border)' }}>
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
