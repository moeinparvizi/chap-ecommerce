'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { customPrintApi } from '../../../lib/custom-print-api';
import type { PrintRequest, PrintSettings } from '../../../lib/custom-print-types';
import { RequestDetails } from '../../../components/custom-print/RequestDetails';
import { errorMessage, statusLabels, toman } from '../../../components/custom-print/helpers';
import '../../../components/custom-print/custom-print.css';
export default function PrintRequestsPage() {
  const router = useRouter();
  const [requests, setRequests] = useState<PrintRequest[]>([]);
  const [settings, setSettings] = useState<PrintSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paying, setPaying] = useState('');
  async function load() {
    if (!localStorage.getItem('auth_token')) {
      localStorage.setItem('redirectAfterLogin', '/account/print-requests');
      router.push('/auth/login');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const [data, config] = await Promise.all([
        customPrintApi.requests(),
        customPrintApi.settings(),
      ]);
      setRequests(data);
      setSettings(config);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  async function pay(id: string) {
    setPaying(id);
    setError('');
    try {
      const order = await customPrintApi.payTest(id);
      setRequests((current) =>
        current.map((r) => (r.id === id ? { ...r, status: 'PAID', orderId: order.id, order } : r)),
      );
      router.push('/account/orders');
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setPaying('');
    }
  }
  return (
    <div className="print-page">
      <div className="print-request-header">
        <h1>درخواست‌های چاپ من</h1>
        <div className="print-actions">
          <a href="/custom-print">درخواست چاپ جدید</a>
          <button
            className="btn btn-secondary"
            disabled={loading || Boolean(paying)}
            onClick={load}
          >
            تازه‌سازی
          </button>
        </div>
      </div>
      <p className="print-subtle">
        قیمت نهایی پس از بررسی مدیر اعلام می‌شود. پرداخت این نسخه آزمایشی است و هیچ وجهی برداشت
        نمی‌شود.
      </p>
      {error && (
        <div role="alert" className="print-error">
          {error}
        </div>
      )}
      {loading && <p role="status">در حال دریافت درخواست‌ها…</p>}
      {!loading && !error && !requests.length && (
        <p className="print-notice">
          هنوز درخواست چاپی ثبت نکرده‌اید. <a href="/custom-print">اولین طرح خود را ارسال کنید.</a>
        </p>
      )}
      {requests.map((request) => (
        <article key={request.id} className="card print-panel">
          <div className="print-request-header">
            <div>
              <h2>{request.productName}</h2>
              <p className="print-subtle">
                {new Date(request.createdAt).toLocaleDateString('fa-IR')} · #
                {request.id.slice(0, 8)}
              </p>
            </div>
            <span
              className={`badge ${request.status === 'REJECTED' ? 'badge-danger' : request.status === 'PENDING_REVIEW' ? 'badge-warning' : 'badge-success'}`}
            >
              {statusLabels[request.status]}
            </span>
          </div>
          <RequestDetails
            request={request}
            filename={request.designUpload?.filename}
            mimeType={request.designUpload?.mimeType}
          />
          {request.reviewNote && (
            <p className="print-notice">
              <strong>{request.status === 'REJECTED' ? 'دلیل رد: ' : 'یادداشت مدیر: '}</strong>
              {request.reviewNote}
            </p>
          )}
          {request.status === 'REJECTED' && <a href="/custom-print">ارسال درخواست جدید</a>}
          {request.quotedAmount != null && (
            <p>
              <strong>مبلغ نهایی کل: {toman(request.quotedAmount)}</strong>
              <br />
              <small className="print-subtle">شامل محصول، چاپ و ارسال</small>
            </p>
          )}
          {request.status === 'APPROVED' &&
            (settings?.testPaymentEnabled === true ? (
              <button
                className="btn btn-primary"
                disabled={Boolean(paying) || loading}
                onClick={() => pay(request.id)}
              >
                {paying === request.id
                  ? 'در حال ثبت پرداخت آزمایشی…'
                  : 'پرداخت آزمایشی — بدون برداشت وجه'}
              </button>
            ) : (
              <p className="print-notice">پرداخت آزمایشی در حال حاضر غیرفعال است.</p>
            ))}
          {request.orderId && (
            <p className="print-notice">
              سفارش #{request.orderId.slice(0, 8)} ·{' '}
              {statusLabels[request.order?.status || 'PROCESSING'] || request.order?.status}
              <br />
              پرداخت آزمایشی — بدون برداشت وجه
              <br />
              <a href="/account/orders">مشاهده در خریدهای من</a>
            </p>
          )}
        </article>
      ))}
    </div>
  );
}
