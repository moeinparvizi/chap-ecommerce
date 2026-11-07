import type { PrintProductType, PrintRequestStatus } from '@ecommerce/shared';
export type { PrintProductType, PrintRequestStatus };
export interface CatalogProduct {
  id: string;
  name: string;
  stock: number;
  status?: string;
  images?: { url: string }[];
}
export interface PrintProduct {
  id: string;
  productId: string;
  type: PrintProductType;
  enabled: boolean;
  positions: string[];
  product: CatalogProduct;
}
export interface PrintUpload {
  id: string;
  filename: string;
  mimeType: string;
  size: number;
  totalChunks: number;
  completed: boolean;
}
export interface PrintOrder {
  id: string;
  status: string;
  amount: number;
  paymentMethod: string;
}
export interface PrintRequest {
  id: string;
  userId: string;
  customerName: string;
  productId: string;
  productName: string;
  productImage?: string | null;
  productType: PrintProductType;
  quantity: number;
  size?: string | null;
  color?: string | null;
  positions: string[];
  notes?: string | null;
  phone: string;
  locationJson: string;
  designUploadId: string;
  designUpload: PrintUpload;
  status: PrintRequestStatus;
  quotedAmount?: number | null;
  reviewNote?: string | null;
  orderId?: string | null;
  createdAt: string;
  updatedAt: string;
  order?: PrintOrder | null;
}
export type PrintOrderSummary = Pick<
  PrintRequest,
  | 'id'
  | 'productName'
  | 'productType'
  | 'quantity'
  | 'positions'
  | 'size'
  | 'color'
  | 'notes'
  | 'phone'
  | 'locationJson'
  | 'designUploadId'
>;
export interface PrintSettings {
  testPaymentEnabled: boolean;
  maxUploadBytes: number;
  chunkBytes: number;
}
export interface CreatePrintRequest {
  productId: string;
  designUploadId: string;
  locationId: string;
  phone: string;
  quantity: number;
  positions: string[];
  size?: string;
  color?: string;
  notes?: string;
}
export interface ReviewPrintRequest {
  decision: 'APPROVED' | 'REJECTED';
  quotedAmount?: number;
  reviewNote?: string;
}
export interface PrintLocation {
  id: string;
  title: string;
  address: string;
  city: string;
  postalCode?: string;
  phone?: string;
  isDefault?: boolean;
}
