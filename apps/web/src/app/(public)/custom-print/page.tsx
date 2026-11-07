'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';
import { artworkError, customPrintApi, uploadArtwork } from '../../lib/custom-print-api';
import type {
  PrintLocation,
  PrintProduct,
  PrintSettings,
  PrintUpload,
} from '../../lib/custom-print-types';
import {
  errorMessage,
  normalizePhone,
  positionLabels,
} from '../../components/custom-print/helpers';
import '../../components/custom-print/custom-print.css';

export default function CustomPrintPage() {
  const router = useRouter();
  const [products, setProducts] = useState<PrintProduct[]>([]);
  const [settings, setSettings] = useState<PrintSettings | null>(null);
  const [locations, setLocations] = useState<PrintLocation[]>([]);
  const [signedIn, setSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [locationError, setLocationError] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [productId, setProductId] = useState('');
  const [positions, setPositions] = useState<string[]>([]);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [phone, setPhone] = useState('');
  const [locationId, setLocationId] = useState('');
  const [notes, setNotes] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState('');
  const completedUpload = useRef<PrintUpload | null>(null);
  const product = products.find((p) => p.productId === productId);
  const apparel = product?.type === 'TSHIRT' || product?.type === 'PANTS';
  const allowedPositions = product?.type === 'MUG' ? [] : product?.positions || [];

  async function loadLocations() {
    const token = localStorage.getItem('auth_token');
    setSignedIn(Boolean(token));
    if (!token) return;
    let user: { id?: string; phone?: string } = {};
    try {
      user = JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      /* Sign-in data can expire independently of the token. */
    }
    if (user.phone) setPhone((value) => value || user.phone || '');
    if (!user.id) {
      setLocationError('اطلاعات حساب در دسترس نیست. دوباره وارد حساب شوید.');
      return;
    }
    setLocationError('');
    try {
      const result: PrintLocation[] = await api.getLocations(user.id);
      setLocations(result);
      const initial = result.find((l) => l.isDefault) || result[0];
      if (initial) {
        setLocationId(initial.id);
        setPhone((value) => value || initial.phone || '');
      }
    } catch (e) {
      setLocationError(errorMessage(e));
    }
  }
  async function load(background = false) {
    if (!background) setLoading(true);
    setLoadError('');
    try {
      const [available, config] = await Promise.all([
        customPrintApi.products(),
        customPrintApi.settings(),
      ]);
      setProducts(available);
      setSettings(config);
      setProductId((current) =>
        available.some((p) => p.productId === current) ? current : available[0]?.productId || '',
      );
    } catch (e) {
      setLoadError(errorMessage(e));
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    void load();
    void loadLocations();
    const refresh = () => {
      void load(true);
    };
    window.addEventListener('focus', refresh);
    return () => window.removeEventListener('focus', refresh);
  }, []);
  useEffect(() => {
    if (!file?.type.startsWith('image/')) {
      setPreview('');
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  function signIn() {
    localStorage.setItem('redirectAfterLogin', '/custom-print');
    router.push('/auth/login');
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (!signedIn) {
      signIn();
      return;
    }
    if (!product) {
      setError('یک محصول قابل چاپ انتخاب کنید.');
      return;
    }
    if (product.product.stock <= 0) {
      setError('این محصول ناموجود است؛ پس از افزایش موجودی دوباره تلاش کنید.');
      return;
    }
    if (!file) {
      setError('فایل طرح را انتخاب کنید.');
      return;
    }
    const contactPhone = normalizePhone(phone);
    if (!/^\+?[0-9]{10,15}$/.test(contactPhone)) {
      setError('شماره تلفن تماس معتبر وارد کنید.');
      return;
    }
    if (!locationId || !locations.some((l) => l.id === locationId)) {
      setError('یک آدرس ارسال از حساب خود انتخاب کنید.');
      return;
    }
    if (allowedPositions.length && !positions.length) {
      setError('حداقل یک محل چاپ انتخاب کنید.');
      return;
    }
    if (apparel && (!size.trim() || !color.trim())) {
      setError('سایز و رنگ پوشاک را وارد کنید.');
      return;
    }
    const count = Number(quantity);
    if (!Number.isInteger(count) || count < 1 || count > Math.min(100, product.product.stock)) {
      setError('تعداد باید بین ۱ تا موجودی محصول (حداکثر ۱۰۰) باشد.');
      return;
    }
    setBusy(true);
    try {
      const upload = completedUpload.current || (await uploadArtwork(file, setProgress));
      completedUpload.current = upload;
      await customPrintApi.createRequest({
        productId,
        designUploadId: upload.id,
        locationId,
        phone: contactPhone,
        quantity: count,
        positions: product.type === 'MUG' ? [] : positions,
        ...(apparel ? { size: size.trim(), color: color.trim() } : {}),
        ...(notes.trim() ? { notes: notes.trim() } : {}),
      });
      router.push('/account/print-requests');
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="print-page print-public">
      <h1>چاپ طرح دلخواه شما</h1>
      <p className="print-subtle">
        محصول و طرح را ارسال کنید. مدیر پس از بررسی، قیمت نهایی شامل محصول، چاپ و ارسال را اعلام
        می‌کند.
      </p>
      <p className="print-notice">
        این نسخه آزمایشی است؛ پرداخت آزمایشی پس از تأیید طرح انجام می‌شود و هیچ وجهی از شما برداشت
        نمی‌شود.
      </p>
      <div className="print-actions">
        <a href="/account/print-requests">پیگیری درخواست‌های چاپ من</a>
      </div>
      {loading && <p role="status">در حال دریافت محصولات چاپ…</p>}
      {loadError && (
        <div role="alert" className="print-error">
          {loadError}{' '}
          <button
            className="btn btn-ghost"
            onClick={() => {
              void load();
            }}
          >
            تلاش مجدد
          </button>
        </div>
      )}
      {!loading && !loadError && !products.length && (
        <p className="print-notice">
          در حال حاضر محصولی برای چاپ فعال نیست. بعداً دوباره مراجعه کنید.
        </p>
      )}
      {!loading && !loadError && products.length > 0 && (
        <form
          className="card print-panel print-form"
          onSubmit={submit}
          noValidate
          aria-label="درخواست چاپ"
        >
          <h2>مشخصات درخواست چاپ</h2>
          <fieldset disabled={busy} className="print-form">
            <div className="print-grid">
              <div className="print-field">
                <label htmlFor="print-product">محصول</label>
                <select
                  id="print-product"
                  className="input"
                  value={productId}
                  onChange={(e) => {
                    setProductId(e.target.value);
                    setPositions([]);
                    setSize('');
                    setColor('');
                  }}
                >
                  {products.map((p) => (
                    <option key={p.productId} value={p.productId}>
                      {p.product.name}
                      {p.product.stock <= 0 ? ' — ناموجود' : ''}
                    </option>
                  ))}
                </select>
                {product && product.product.stock <= 0 && (
                  <p className="print-notice" role="status">
                    این محصول ناموجود است؛ ارسال طرح پس از افزایش موجودی فعال می‌شود.
                  </p>
                )}
                {product?.product.images?.[0]?.url && (
                  <img
                    className="print-preview"
                    src={product.product.images[0].url}
                    alt={product.product.name}
                  />
                )}
              </div>
              <div className="print-field">
                <label htmlFor="print-quantity">تعداد</label>
                <input
                  id="print-quantity"
                  className="input"
                  type="number"
                  min="1"
                  max={Math.min(100, product?.product.stock || 100)}
                  step="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                />
                <small className="print-subtle">
                  موجودی: {product?.product.stock.toLocaleString('fa-IR')} عدد
                </small>
              </div>
            </div>
            {allowedPositions.length > 0 && (
              <fieldset>
                <legend>محل چاپ</legend>
                <div className="print-checks">
                  {allowedPositions.map((position) => (
                    <label key={position}>
                      <input
                        type="checkbox"
                        checked={positions.includes(position)}
                        onChange={(e) =>
                          setPositions((current) =>
                            e.target.checked
                              ? [...current, position]
                              : current.filter((p) => p !== position),
                          )
                        }
                      />
                      {positionLabels[position] || position}
                    </label>
                  ))}
                </div>
              </fieldset>
            )}
            {apparel && (
              <div className="print-grid">
                <div className="print-field">
                  <label htmlFor="print-size">سایز</label>
                  <input
                    id="print-size"
                    className="input"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    placeholder="مثلاً XL"
                    maxLength={80}
                  />
                </div>
                <div className="print-field">
                  <label htmlFor="print-color">رنگ</label>
                  <input
                    id="print-color"
                    className="input"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    placeholder="مثلاً سفید"
                    maxLength={80}
                  />
                </div>
              </div>
            )}
            <div className="print-field">
              <label htmlFor="print-artwork">فایل طرح</label>
              <p id="artwork-help" className="print-subtle">
                یک فایل PNG، JPG یا PDF؛ حداکثر 10 MiB. فایل شما خصوصی است و فقط شما و مدیر به آن
                دسترسی دارید.
              </p>
              <input
                id="print-artwork"
                className="input"
                type="file"
                accept="image/png,image/jpeg,application/pdf"
                aria-describedby="artwork-help"
                onChange={(e) => {
                  const next = e.target.files?.[0] || null;
                  completedUpload.current = null;
                  setProgress(0);
                  if (next) {
                    const problem = artworkError(next);
                    if (problem) {
                      setError(problem);
                      setFile(null);
                      e.target.value = '';
                      return;
                    }
                  }
                  setError('');
                  setFile(next);
                }}
              />
              {file && <p className="print-subtle">{file.name}</p>}
              {preview && (
                <img className="print-preview" src={preview} alt="پیش‌نمایش طرح انتخابی" />
              )}
            </div>
            <div className="print-grid">
              <div className="print-field">
                <label htmlFor="print-phone">تلفن تماس</label>
                <input
                  id="print-phone"
                  className="input"
                  type="tel"
                  dir="ltr"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
              <div className="print-field">
                <label htmlFor="print-location">آدرس ارسال</label>
                <select
                  id="print-location"
                  className="input"
                  value={locationId}
                  onChange={(e) => {
                    setLocationId(e.target.value);
                    const location = locations.find((l) => l.id === e.target.value);
                    if (location?.phone) setPhone(location.phone);
                  }}
                >
                  <option value="">انتخاب آدرس</option>
                  {locations.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.title} — {l.city}، {l.address}
                    </option>
                  ))}
                </select>
                <a href="/account/locations">مدیریت آدرس‌ها</a>
                {signedIn && !locations.length && !locationError && (
                  <small>ابتدا یک آدرس در حساب خود ثبت کنید.</small>
                )}
              </div>
            </div>
            {locationError && (
              <div role="alert" className="print-error">
                {locationError}
                <button className="btn btn-ghost" type="button" onClick={loadLocations}>
                  دریافت دوباره آدرس‌ها
                </button>
              </div>
            )}
            <div className="print-field">
              <label htmlFor="print-notes">توضیحات (اختیاری)</label>
              <textarea
                id="print-notes"
                className="input"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={2000}
                rows={3}
              />
            </div>
          </fieldset>
          {!signedIn && (
            <p className="print-notice">برای ارسال طرح و انتخاب آدرس، وارد حساب خود شوید.</p>
          )}
          {settings && !settings.testPaymentEnabled && (
            <p className="print-subtle">
              ثبت و بررسی طرح فعال است؛ پرداخت آزمایشی در حال حاضر غیرفعال است.
            </p>
          )}
          {busy && (
            <div role="status">
              <label htmlFor="print-progress">
                {progress < 100 ? `در حال بارگذاری طرح: ${progress}٪` : 'در حال ثبت درخواست…'}
              </label>
              <progress id="print-progress" max="100" value={progress} />
            </div>
          )}
          {error && (
            <div role="alert" className="print-error">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="btn btn-primary"
            disabled={busy || !product || product.product.stock <= 0}
          >
            {busy ? 'در حال ارسال…' : signedIn ? 'ارسال برای بررسی' : 'ورود و ارسال طرح'}
          </button>
        </form>
      )}
    </div>
  );
}
