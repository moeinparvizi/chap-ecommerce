'use client';
import { useState } from 'react';
import type { CatalogProduct, PrintProduct, PrintProductType } from '../../lib/custom-print-types';
import { customPrintApi } from '../../lib/custom-print-api';
import { defaultPositions, errorMessage, positionLabels, typeLabels } from './helpers';
export function ConfigurationForm({
  products,
  configurations,
  onSaved,
}: {
  products: CatalogProduct[];
  configurations: PrintProduct[];
  onSaved: () => void;
}) {
  const [productId, setProductId] = useState('');
  const [type, setType] = useState<PrintProductType>('TSHIRT');
  const [enabled, setEnabled] = useState(true);
  const [positions, setPositions] = useState(defaultPositions.TSHIRT.join('\n'));
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  function selectProduct(id: string) {
    setProductId(id);
    setSaved(false);
    const existing = configurations.find((c) => c.productId === id);
    const kind = existing?.type || 'TSHIRT';
    setType(kind);
    setEnabled(existing?.enabled ?? true);
    setPositions((existing?.positions || defaultPositions[kind]).join('\n'));
  }
  async function save() {
    setError('');
    setSaved(false);
    const selected =
      type === 'MUG'
        ? []
        : Array.from(
            new Set(
              positions
                .split(/[,،\n]/)
                .map((p) => p.trim())
                .filter(Boolean),
            ),
          );
    if (!productId) {
      setError('محصول را انتخاب کنید.');
      return;
    }
    if ((type === 'TSHIRT' || type === 'PANTS') && !selected.length) {
      setError('حداقل یک محل چاپ برای پوشاک مشخص کنید.');
      return;
    }
    setBusy(true);
    try {
      await customPrintApi.saveConfiguration({ productId, type, enabled, positions: selected });
      setSaved(true);
      onSaved();
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <section className="card print-panel">
      <h2>محصولات قابل چاپ</h2>
      <p className="print-subtle">
        یک محصول موجود را انتخاب کنید. نمایش در فروشگاه به فعال‌بودن محصول و موجودی آن نیز وابسته
        است.
      </p>
      <div className="print-form">
        <div className="print-grid">
          <div className="print-field">
            <label htmlFor="config-product">محصول فروشگاه</label>
            <select
              className="input"
              id="config-product"
              value={productId}
              disabled={busy}
              onChange={(e) => selectProduct(e.target.value)}
            >
              <option value="">انتخاب محصول</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                  {configurations.some((c) => c.productId === product.id) ? ' (تنظیم شده)' : ''}
                </option>
              ))}
            </select>
          </div>
          <div className="print-field">
            <label htmlFor="config-type">نوع محصول چاپی</label>
            <select
              className="input"
              id="config-type"
              value={type}
              disabled={busy}
              onChange={(e) => {
                const kind = e.target.value as PrintProductType;
                setType(kind);
                setPositions(defaultPositions[kind].join('\n'));
                setSaved(false);
              }}
            >
              {Object.entries(typeLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
        {type !== 'MUG' && (
          <div className="print-field">
            <label htmlFor="config-positions">محل‌های مجاز چاپ؛ هر محل در یک خط</label>
            <textarea
              className="input"
              id="config-positions"
              value={positions}
              disabled={busy}
              onChange={(e) => setPositions(e.target.value)}
              rows={4}
            />
            <p className="print-subtle">
              {defaultPositions[type].map((p) => `${p}: ${positionLabels[p]}`).join('، ') ||
                'برای محصول بدون محل چاپ، خالی بگذارید.'}
            </p>
          </div>
        )}
        {type === 'MUG' && <p className="print-notice">ماگ بدون انتخاب محل چاپ ثبت می‌شود.</p>}
        <label className="print-checks">
          <input
            type="checkbox"
            checked={enabled}
            disabled={busy}
            onChange={(e) => setEnabled(e.target.checked)}
          />
          فعال برای درخواست چاپ
        </label>
        {error && (
          <div role="alert" className="print-error">
            {error}
          </div>
        )}
        {saved && <p role="status">تنظیمات محصول ذخیره شد.</p>}
        <button className="btn btn-primary" disabled={busy} onClick={save}>
          {busy ? 'در حال ذخیره…' : 'ذخیره تنظیمات چاپ'}
        </button>
      </div>
    </section>
  );
}
