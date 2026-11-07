'use client';
import { useState } from 'react';
import { customPrintApi } from '../../lib/custom-print-api';
import { errorMessage } from './helpers';
export function ReviewForm({
  requestId,
  onReviewed,
}: {
  requestId: string;
  onReviewed: () => void;
}) {
  const [quote, setQuote] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  async function review(decision: 'APPROVED' | 'REJECTED') {
    setError('');
    if (decision === 'APPROVED' && (!Number.isSafeInteger(Number(quote)) || Number(quote) <= 0)) {
      setError('مبلغ نهایی باید یک عدد مثبت به تومان باشد.');
      return;
    }
    if (decision === 'REJECTED' && !note.trim()) {
      setError('دلیل رد درخواست را بنویسید.');
      return;
    }
    setBusy(true);
    try {
      await customPrintApi.review(requestId, {
        decision,
        ...(decision === 'APPROVED' ? { quotedAmount: Number(quote) } : {}),
        reviewNote: note.trim() || undefined,
      });
      onReviewed();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="print-review print-form">
      <div className="print-grid">
        <div className="print-field">
          <label htmlFor={`quote-${requestId}`}>قیمت نهایی (تومان)</label>
          <input
            id={`quote-${requestId}`}
            className="input"
            type="number"
            min="1"
            step="1"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
            disabled={busy}
          />
          <small className="print-subtle">مجموع محصول، چاپ و ارسال</small>
        </div>
        <div className="print-field">
          <label htmlFor={`note-${requestId}`}>یادداشت بررسی / دلیل رد</label>
          <textarea
            id={`note-${requestId}`}
            className="input"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            disabled={busy}
            maxLength={2000}
          />
        </div>
      </div>
      {error && (
        <div role="alert" className="print-error">
          {error}
        </div>
      )}
      <div className="print-actions">
        <button
          type="button"
          className="btn btn-primary"
          disabled={busy}
          onClick={() => review('APPROVED')}
        >
          {busy ? 'در حال ثبت…' : 'تأیید و اعلام قیمت'}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          disabled={busy}
          onClick={() => review('REJECTED')}
        >
          رد درخواست
        </button>
      </div>
    </div>
  );
}
