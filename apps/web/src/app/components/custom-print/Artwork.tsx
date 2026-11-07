'use client';
import { useEffect, useState } from 'react';
import { downloadArtwork } from '../../lib/custom-print-api';
import { errorMessage } from './helpers';
export function Artwork({
  uploadId,
  filename,
  mimeType,
}: {
  uploadId: string;
  filename?: string;
  mimeType?: string;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState('');
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );
  async function load(showPreview: boolean) {
    setBusy(true);
    setError('');
    try {
      const result = await downloadArtwork(uploadId);
      const url = URL.createObjectURL(result.blob);
      if (showPreview && result.blob.type.startsWith('image/')) setPreview(url);
      else {
        const link = document.createElement('a');
        link.href = url;
        link.download = result.filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    } catch (e) {
      setError(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div>
      {filename && <p className="print-subtle">{filename}</p>}
      <div className="print-actions">
        <button
          type="button"
          className="btn btn-secondary"
          disabled={busy}
          onClick={() => load(false)}
        >
          {busy ? 'دریافت فایل…' : 'دانلود خصوصی طرح'}
        </button>
        {mimeType?.startsWith('image/') && !preview && (
          <button
            type="button"
            className="btn btn-ghost"
            disabled={busy}
            onClick={() => load(true)}
          >
            نمایش طرح
          </button>
        )}
      </div>
      {preview && <img src={preview} alt="پیش‌نمایش طرح ارسالی" className="print-preview" />}
      {error && (
        <p role="alert" className="print-error">
          {error}
        </p>
      )}
    </div>
  );
}
