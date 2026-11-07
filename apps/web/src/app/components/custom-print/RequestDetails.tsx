import type { PrintOrderSummary } from '../../lib/custom-print-types';
import { Artwork } from './Artwork';
import { addressText, positionLabels, typeLabels } from './helpers';
export function RequestDetails({
  request,
  filename,
  mimeType,
}: {
  request: PrintOrderSummary;
  filename?: string;
  mimeType?: string;
}) {
  return (
    <>
      <dl className="print-details">
        <div>
          <dt>محصول و تعداد</dt>
          <dd>
            {request.productName} · {typeLabels[request.productType]} · {request.quantity} عدد
          </dd>
        </div>
        {request.positions?.length > 0 && (
          <div>
            <dt>محل چاپ</dt>
            <dd>{request.positions.map((p) => positionLabels[p] || p).join('، ')}</dd>
          </div>
        )}
        {request.size && (
          <div>
            <dt>سایز</dt>
            <dd>{request.size}</dd>
          </div>
        )}
        {request.color && (
          <div>
            <dt>رنگ</dt>
            <dd>{request.color}</dd>
          </div>
        )}
        <div>
          <dt>تلفن تماس</dt>
          <dd>
            <a dir="ltr" href={`tel:${request.phone}`}>
              {request.phone}
            </a>
          </dd>
        </div>
        <div className="print-wide">
          <dt>آدرس ارسال ثبت‌شده</dt>
          <dd>{addressText(request.locationJson)}</dd>
        </div>
        {request.notes && (
          <div className="print-wide">
            <dt>توضیحات طرح</dt>
            <dd>{request.notes}</dd>
          </div>
        )}
      </dl>
      <Artwork uploadId={request.designUploadId} filename={filename} mimeType={mimeType} />
    </>
  );
}
export function PrintOrderDetails({ request }: { request?: PrintOrderSummary | null }) {
  if (!request) return null;
  return (
    <section className="print-page print-order-detail" aria-label="جزئیات چاپ سفارشی">
      <h3>چاپ سفارشی</h3>
      <RequestDetails request={request} />
    </section>
  );
}
