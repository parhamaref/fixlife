/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type CurrencyCode = 'TMN';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rate: number;
  label: string;
}

export type SkinConcernId =
  | 'acne'
  | 'dryness'
  | 'anti-aging'
  | 'brightening'
  | 'sensitive';

export type ProductCategory =
  | 'all'
  | 'serums'
  | 'cleansers'
  | 'moisturizers'
  | 'sunscreen'
  | 'sets';

export interface SkinConcernItem {
  id: SkinConcernId;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  recommendedIngredients: string[];
}

export interface ProductReview {
  id: string;
  author: string;
  skinType: string;
  verified: boolean;
  rating: number;
  date: string;
  title: string;
  comment: string;
}

export interface ProductSizeOption {
  size: string;
  priceMultiplier: number;
}

export interface ProductTechnicalSpec {
  label: string;
  spec: string;
  benefit: string;
}

export interface ProductProtocolStep {
  stepNumber: string;
  title: string;
  instruction: string;
}

export interface ProductFaqItem {
  question: string;
  answer: string;
}

export interface ProductSeoMeta {
  title: string;
  description: string;
  canonicalUrl: string;
  keywords: string[];
  schemaJsonLd: Record<string, unknown>;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  englishName?: string;
  slug?: string;
  permalink?: string;
  subtitle: string;
  category: Exclude<ProductCategory, 'all'>;
  concerns: SkinConcernId[];
  priceUSD: number; // ذخیره قیمت پایه به تومان (Toman)
  compareAtPriceUSD?: number;
  rating: number;
  reviewCount: number;
  isBestSeller: boolean;
  isNew?: boolean;
  tag?: string;
  image: string;
  secondaryImage?: string;
  gallery?: string[];
  sizes: ProductSizeOption[];
  defaultSize: string;
  description: string;
  clinicalResults: string[];
  keyIngredients: {
    name: string;
    englishName?: string;
    benefit: string;
  }[];
  technicalSpecs?: ProductTechnicalSpec[];
  protocolSteps?: ProductProtocolStep[];
  faqs?: ProductFaqItem[];
  scientificReferences?: string[];
  seoMeta?: ProductSeoMeta;
  fullInci: string;
  howToUse: string;
  reviews: ProductReview[];
  stockQuantity?: number; // موجودی فعلی انبار (تعداد)
  initialSoldCount?: number; // تعداد فروش پایه ثبت‌شده قبل از سفارش‌های جاری
}

export interface ProductSalesStat {
  productId: string;
  sku: string;
  name: string;
  subtitle: string;
  image: string;
  category: Exclude<ProductCategory, 'all'>;
  unitPriceToman: number;
  stockQuantity: number;
  unitsSoldFromOrders: number;
  initialSoldCount: number;
  totalUnitsSold: number; // مجموع کل تعداد فروخته‌شده از این محصول
  totalRevenueToman: number; // مجموع مبلغ فروش این محصول به تومان
  ordersCount: number; // تعداد فاکتورهایی که شامل این محصول بوده‌اند
}

export interface CartItem {
  productId: string;
  sku: string;
  name: string;
  image: string;
  selectedSize: string;
  unitPriceUSD: number; // قیمت واحد به تومان
  quantity: number;
}

export interface PromoCodeValidationResponse {
  valid: boolean;
  code: string;
  discountPercent: number;
  discountAmountUSD: number;
  message: string;
}

export interface CustomerAddress {
  firstName: string;
  lastName: string;
  company?: string;
  addressLine1: string;
  addressLine2?: string;
  city: string; // فقط شهرهای ایران
  state: string; // فقط استان‌های ایران
  postalCode: string; // کد پستی ۱۰ رقمی ایران
  country: string; // ثابت: ایران
  phone: string; // شماره موبایل ۱۱ رقمی ایران (09xxxxxxxxx)
}

export type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';

export interface OrderItemPayload {
  product_id: string;
  sku: string;
  name: string;
  size: string;
  quantity: number;
  unit_price_usd: number;
  line_total_usd: number;
}

export interface CreateOrderRequestPayload {
  customer: {
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
  };
  billing_address: CustomerAddress;
  shipping_address: CustomerAddress;
  shipping_method: 'standard' | 'express';
  payment_method: 'card' | 'apple_pay' | 'paypal' | 'cod';
  promo_code?: string | null;
  currency: CurrencyCode;
  items: OrderItemPayload[];
  totals: {
    subtotal_usd: number;
    discount_usd: number;
    shipping_usd: number;
    total_usd: number;
  };
  notes?: string;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  createdAt: string;
  status: OrderStatus;
  customerEmail: string;
  customerName: string;
  customer: {
    email: string;
    phone: string;
    first_name?: string;
    last_name?: string;
  };
  shippingAddress: CustomerAddress;
  billingAddress: CustomerAddress;
  shippingMethod: 'standard' | 'express';
  paymentMethod: 'card' | 'apple_pay' | 'paypal' | 'cod';
  promoCode?: string | null;
  currency: CurrencyCode;
  items: OrderItemPayload[];
  subtotalUSD: number;
  discountUSD: number;
  shippingUSD: number;
  totalUSD: number;
  trackingNumber?: string;
}

export interface ZarinpalPaymentInitiateRequest {
  orderId: string;
  amount: number;
  mobile: string;
  email: string;
}

export interface ZarinpalPaymentInitiateResponse {
  status: 'success' | 'error';
  paymentUrl?: string;
  authority?: string;
  message?: string;
}

export interface CustomerUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  token: string;
  createdAt: string;
  skinProfile?: {
    skinType: string;
    primaryConcerns: SkinConcernId[];
  };
  billingAddress: CustomerAddress;
  shippingAddress: CustomerAddress;
}

export interface JournalArticle {
  id: string;
  slug: string;
  title: string;
  category: string;
  readTime: string;
  publishedAt: string;
  author: {
    name: string;
    role: string;
  };
  image: string;
  excerpt: string;
  content: string[];
  keyTakeaways: string[];
  relatedProductIds: string[];
}

export interface ApiContractEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  phpController: string;
  description: string;
  requestExample?: Record<string, unknown>;
  responseExample: Record<string, unknown>;
}
