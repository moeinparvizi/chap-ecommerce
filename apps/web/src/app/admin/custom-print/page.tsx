'use client';
import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { customPrintApi } from '../../lib/custom-print-api';
import type { CatalogProduct, PrintProduct, PrintRequest } from '../../lib/custom-print-types';
import { ConfigurationForm } from '../../components/custom-print/ConfigurationForm';
import { RequestDetails } from '../../components/custom-print/RequestDetails';
import { ReviewForm } from '../../components/custom-print/ReviewForm';
import { errorMessage, statusLabels, toman } from '../../components/custom-print/helpers';
import '../../components/custom-print/custom-print.css';
export default function AdminCustomPrintPage() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [configurations, setConfigurations] = useState<PrintProduct[]>([]);
  const [requests, setRequests] = useState<PrintRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('ALL');
  async function load() {
    setLoading(true);
    setError('');
    try {
      const [catalog, configs, list] = await Promise.all([
        api.getProducts(),
        customPrintApi.configurations(),
        customPrintApi.requests(),
      ]);
      setProducts(catalog);
      setConfigurations(configs);
      setRequests(list);
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
  }, []);
  const filtered = requests.filter((r) => filter === 'ALL' || r.status === filter);
  return (
    <div className="print-page">
      <div className="print-request-header">
        <h1>چاپ سفارشی</h1>
        <button className="btn btn-secondary" disabled={loading} onClick={load}>
          تازه‌سازی
        </button>
      </div>
      <p className="print-subtle">
        طرح و مشخصات را بررسی کنید و قیمت نهایی شامل محصول، چاپ و ارسال را به تومان اعلام کنید.
        پرداخت این نسخه فقط آزمایشی است.
      </p>
      {error && (
        <div role="alert" className="print-error">
          {error}
        </div>
      )}
      {loading && <p role="status">در حال دریافت اطلاعات…</p>}
      {!loading && !error && (
        <ConfigurationForm products={products} configurations={configurations} onSaved={load} />
      )}
      <section aria-labelledby="print-requests-title">
        <div className="print-request-header">
          <h2 id="print-requests-title">درخواست‌های چاپ</h2>
          <div className="print-field">
            <label htmlFor="print-filter">فیلتر وضعیت درخواست</label>
            <select
              id="print-filter"
              className="input"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="ALL">همه</option>
              {['PENDING_REVIEW', 'APPROVED', 'REJECTED', 'PAID'].map((status) => (
                <option key={status} value={status}>
                  {statusLabels[status]}
                </option>
              ))}
            </select>
          </div>
        </div>
        {!loading && !error && !filtered.length && (
          <p className="print-notice">درخواستی با این وضعیت وجود ندارد.</p>
        )}
        {filtered.map((request) => (
          <article key={request.id} className="card print-panel">
            <div className="print-request-header">
              <div>
                <h2>{request.productName}</h2>
                <p className="print-subtle">
                  {request.customerName} · {new Date(request.createdAt).toLocaleDateString('fa-IR')}{' '}
                  · #{request.id.slice(0, 8)}
                </p>
              </div>
              <span
                className={`badge ${request.status === 'REJECTED' ? 'badge-danger' : request.status === 'PENDING_REVIEW' ? 'badge-warning' : 'badge-success'}`}
              >
                {statusLabels[request.status]}
              </span>
            </div>
            {request.productImage && (
              <img className="print-preview" src={request.productImage} alt={request.productName} />
            )}
            <RequestDetails
              request={request}
              filename={request.designUpload?.filename}
              mimeType={request.designUpload?.mimeType}
            />
            {request.reviewNote && (
              <p className="print-notice">یادداشت بررسی: {request.reviewNote}</p>
            )}
            {request.quotedAmount != null && (
              <p>
                <strong>مبلغ نهایی کل: {toman(request.quotedAmount)}</strong>
              </p>
            )}
            {request.status === 'PENDING_REVIEW' && (
              <ReviewForm requestId={request.id} onReviewed={load} />
            )}
            {request.orderId && (
              <p className="print-notice">
                سفارش #{request.orderId.slice(0, 8)} ·{' '}
                {statusLabels[request.order?.status || 'PROCESSING']}
                <br />
                پرداخت آزمایشی — بدون برداشت وجه
                <br />
                <a href="/admin/orders">پیگیری در سفارش‌ها</a>
              </p>
            )}
          </article>
        ))}
      </section>
    </div>
  );
}
