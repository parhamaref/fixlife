/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * لایه سرویس REST API برای فروشگاه اینترنتی فیکس لایف (fixlife.ir)
 */

import {
  INITIAL_DEMO_CUSTOMER,
  INITIAL_DEMO_ORDERS,
  PRODUCTS,
} from '../data/catalogData';
import {
  CreateOrderRequestPayload,
  CustomerAddress,
  CustomerUser,
  OrderRecord,
  OrderStatus,
  Product,
  ProductCategory,
  ProductSalesStat,
  PromoCodeValidationResponse,
  SkinConcernId,
} from '../types/ecommerce';

export const API_BASE_URL = '/api';
export const SITE_OFFICIAL_EMAIL = 'info@fixlife.ir';
export const ADMIN_NOTIFICATION_EMAIL = 'parham.aref87@gmail.com';
export const DEFAULT_WHATSAPP_NUMBER = '989120000000';

export interface AdminEmailLogRecord {
  id: string;
  eventType: 'user_login' | 'user_register' | 'order_created' | 'password_changed';
  from: string;
  to: string;
  subject: string;
  body: string;
  createdAt: string;
  deliveryStatus: 'sent_to_server' | 'queued_locally';
  userEmail?: string;
  userName?: string;
  userPhone?: string;
  orderNumber?: string;
  orderTotalToman?: number;
}

interface StoredCustomerCredential {
  user: CustomerUser;
  password: string;
}

const STORAGE_KEYS = {
  AUTH_TOKEN: 'fixlife_auth_token_v2',
  CUSTOMER_USER: 'fixlife_customer_user_v2',
  REGISTERED_USERS: 'fixlife_registered_users_v2',
  ORDERS: 'fixlife_customer_orders_v2',
  ADMIN_AUTH: 'fixlife_admin_session_v1',
  ADMIN_EMAIL_LOGS: 'fixlife_admin_emails_v1',
  WHATSAPP_NUMBER: 'fixlife_whatsapp_number_v1',
  PRODUCTS: 'fixlife_catalog_products_v1',
};

const DEFAULT_PRODUCT_INVENTORY_SEED: Record<
  string,
  { stockQuantity: number; initialSoldCount: number }
> = {
  '4380': { stockQuantity: 42, initialSoldCount: 38 },
  '4377': { stockQuantity: 35, initialSoldCount: 29 },
  '4374': { stockQuantity: 50, initialSoldCount: 44 },
  '4370': { stockQuantity: 28, initialSoldCount: 51 },
  '4367': { stockQuantity: 31, initialSoldCount: 24 },
  '4364': { stockQuantity: 46, initialSoldCount: 33 },
  '4361': { stockQuantity: 39, initialSoldCount: 27 },
  '4358': { stockQuantity: 60, initialSoldCount: 19 },
  '4355': { stockQuantity: 45, initialSoldCount: 22 },
  '4352': { stockQuantity: 25, initialSoldCount: 16 },
};

function enrichDefaultProducts(list: Product[]): Product[] {
  return list.map((p) => {
    const seed = DEFAULT_PRODUCT_INVENTORY_SEED[p.id] || {
      stockQuantity: 30,
      initialSoldCount: 10,
    };
    return {
      ...p,
      stockQuantity:
        typeof p.stockQuantity === 'number' ? p.stockQuantity : seed.stockQuantity,
      initialSoldCount:
        typeof p.initialSoldCount === 'number'
          ? p.initialSoldCount
          : seed.initialSoldCount,
    };
  });
}

export function getStoredProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return enrichDefaultProducts(parsed);
      }
    }
  } catch {
    // ignore
  }
  const seeded = enrichDefaultProducts(PRODUCTS);
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(seeded));
  } catch {
    // ignore
  }
  return seeded;
}

export function saveStoredProducts(products: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  } catch {
    // ignore
  }
}

export async function createProductAdminApi(payload: {
  name: string;
  subtitle: string;
  description: string;
  image: string;
  priceUSD: number;
  compareAtPriceUSD?: number;
  category: Exclude<ProductCategory, 'all'>;
  concerns: SkinConcernId[];
  sku?: string;
  defaultSize?: string;
  tag?: string;
  stockQuantity: number;
  initialSoldCount?: number;
  isBestSeller?: boolean;
  isNew?: boolean;
}): Promise<Product[]> {
  const newId = `${Math.floor(4400 + Math.random() * 5500)}`;
  const cleanSku =
    payload.sku && payload.sku.trim()
      ? payload.sku.trim().toUpperCase()
      : `FIXLIFE-${newId}`;
  const defaultSize =
    payload.defaultSize && payload.defaultSize.trim()
      ? payload.defaultSize.trim()
      : '۵۰ میلی‌لیتر';

  const newProduct: Product = {
    id: newId,
    sku: cleanSku,
    name: payload.name.trim(),
    englishName: `FixLife Clinical Formula #${newId}`,
    slug: `fixlife-product-${newId}`,
    permalink: `https://fixlife.ir/?product_id=${newId}`,
    subtitle:
      payload.subtitle.trim() ||
      'فرمولاسیون تخصصی درماتولوژی و مراقبت پوست فیکس لایف',
    category: payload.category || 'serums',
    concerns:
      payload.concerns && payload.concerns.length > 0
        ? payload.concerns
        : ['dryness'],
    priceUSD: Math.max(0, Number(payload.priceUSD) || 0),
    compareAtPriceUSD:
      payload.compareAtPriceUSD && Number(payload.compareAtPriceUSD) > 0
        ? Number(payload.compareAtPriceUSD)
        : undefined,
    rating: 4.9,
    reviewCount: 12,
    isBestSeller: payload.isBestSeller ?? true,
    isNew: payload.isNew ?? true,
    tag: payload.tag?.trim() || 'محصول تخصصی جدید',
    image: payload.image.trim() || '/assets/fixlife/product-4370-1.png',
    secondaryImage: payload.image.trim() || '/assets/fixlife/product-4370-1.png',
    gallery: [payload.image.trim() || '/assets/fixlife/product-4370-1.png'],
    sizes: [
      { size: defaultSize, priceMultiplier: 1 },
      { size: '۱۰۰ میلی‌لیتر (حجم اقتصادی)', priceMultiplier: 1.55 },
    ],
    defaultSize,
    description: payload.description.trim(),
    clinicalResults: [
      'تایید شده در تست‌های درماتولوژی و بالینی فیکس لایف',
      'فاقد پارابن، سولفات و ترکیبات حساسیت‌زا',
      'سازگار با انواع تیپ‌های پوستی و اقلیم ایران',
    ],
    keyIngredients: [
      {
        name: 'کمپلکس فعال گیاهی و کلینیکال فیکس لایف',
        englishName: 'Bio-Active Clinical Complex',
        benefit: 'تقویت سد دفاعی پوست، آبرسانی عمقی و بهبود بافت سلولی.',
      },
    ],
    fullInci:
      'Aqua (Water), Glycerin, Niacinamide, Panthenol, Sodium Hyaluronate, Ceramide NP, Tocopherol, Phenoxyethanol.',
    howToUse:
      'روزانه صبح و شب مقدار مناسبی از محصول را روی پوست کاملاً تمیز صورت و گردن قرار داده و به آرامی ماساژ دهید تا جذب شود.',
    reviews: [],
    stockQuantity: Math.max(0, Math.floor(Number(payload.stockQuantity) || 0)),
    initialSoldCount: Math.max(
      0,
      Math.floor(Number(payload.initialSoldCount) || 0)
    ),
  };

  try {
    await fetch(`${API_BASE_URL}/admin/products`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(newProduct),
    });
  } catch {
    // Fallback to local storage in preview environment
  }

  const current = getStoredProducts();
  const updated = [newProduct, ...current];
  saveStoredProducts(updated);
  return updated;
}

export async function updateProductAdminApi(
  productId: string,
  updates: Partial<Product>
): Promise<Product[]> {
  try {
    await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(updates),
    });
  } catch {
    // Fallback to local storage
  }

  const current = getStoredProducts();
  const updated = current.map((prod) => {
    if (prod.id !== productId) return prod;
    const nextImage =
      updates.image !== undefined ? updates.image.trim() : prod.image;
    const nextDefaultSize =
      updates.defaultSize !== undefined
        ? updates.defaultSize.trim()
        : prod.defaultSize;
    return {
      ...prod,
      ...updates,
      image: nextImage || prod.image,
      secondaryImage: nextImage || prod.secondaryImage,
      defaultSize: nextDefaultSize || prod.defaultSize,
      sizes:
        prod.sizes && prod.sizes.length > 0
          ? prod.sizes.map((s, idx) =>
              idx === 0 ? { ...s, size: nextDefaultSize || s.size } : s
            )
          : [{ size: nextDefaultSize || '۵۰ میلی‌لیتر', priceMultiplier: 1 }],
      priceUSD:
        updates.priceUSD !== undefined
          ? Math.max(0, Number(updates.priceUSD) || 0)
          : prod.priceUSD,
      stockQuantity:
        updates.stockQuantity !== undefined
          ? Math.max(0, Math.floor(Number(updates.stockQuantity) || 0))
          : prod.stockQuantity ?? 30,
      initialSoldCount:
        updates.initialSoldCount !== undefined
          ? Math.max(0, Math.floor(Number(updates.initialSoldCount) || 0))
          : prod.initialSoldCount ?? 0,
    };
  });

  saveStoredProducts(updated);
  return updated;
}

export async function deleteProductAdminApi(
  productId: string
): Promise<Product[]> {
  try {
    await fetch(`${API_BASE_URL}/admin/products/${productId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
  } catch {
    // Fallback to local storage
  }

  const current = getStoredProducts();
  const updated = current.filter((p) => p.id !== productId);
  saveStoredProducts(updated);
  return updated;
}

export async function resetProductsToDefaultAdminApi(): Promise<Product[]> {
  const seeded = enrichDefaultProducts(PRODUCTS);
  saveStoredProducts(seeded);
  return seeded;
}

export function calculateProductSalesStats(
  products: Product[],
  orders: OrderRecord[]
): ProductSalesStat[] {
  const validOrders = orders.filter((o) => o.status !== 'cancelled');

  return products.map((product) => {
    let unitsSoldFromOrders = 0;
    let revenueFromOrders = 0;
    let ordersCount = 0;

    for (const order of validOrders) {
      let matchedInOrder = false;
      for (const item of order.items) {
        if (
          item.product_id === product.id ||
          item.sku === product.sku ||
          item.name === product.name
        ) {
          unitsSoldFromOrders += Number(item.quantity) || 0;
          revenueFromOrders +=
            Number(item.line_total_usd) ||
            (Number(item.unit_price_usd) || product.priceUSD) *
              (Number(item.quantity) || 0);
          matchedInOrder = true;
        }
      }
      if (matchedInOrder) {
        ordersCount += 1;
      }
    }

    const initialSoldCount = product.initialSoldCount ?? 0;
    const totalUnitsSold = initialSoldCount + unitsSoldFromOrders;
    const totalRevenueToman =
      initialSoldCount * product.priceUSD + revenueFromOrders;

    return {
      productId: product.id,
      sku: product.sku,
      name: product.name,
      subtitle: product.subtitle,
      image: product.image,
      category: product.category,
      unitPriceToman: product.priceUSD,
      stockQuantity: product.stockQuantity ?? 30,
      unitsSoldFromOrders,
      initialSoldCount,
      totalUnitsSold,
      totalRevenueToman,
      ordersCount,
    };
  });
}

export function getSupportWhatsAppNumber(): string {
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.WHATSAPP_NUMBER);
    if (saved && saved.trim()) {
      return saved.replace(/\D/g, '');
    }
  } catch {
    // ignore
  }
  return DEFAULT_WHATSAPP_NUMBER;
}

export function setSupportWhatsAppNumber(rawPhone: string): string {
  let clean = rawPhone.replace(/\D/g, '');
  if (clean.startsWith('09') && clean.length === 11) {
    clean = '98' + clean.slice(1);
  } else if (clean.startsWith('9') && clean.length === 10) {
    clean = '98' + clean;
  }
  const finalNumber = clean || DEFAULT_WHATSAPP_NUMBER;
  try {
    localStorage.setItem(STORAGE_KEYS.WHATSAPP_NUMBER, finalNumber);
  } catch {
    // ignore
  }
  return finalNumber;
}

export function buildWhatsAppSupportUrl(customText?: string): string {
  const phone = getSupportWhatsAppNumber();
  const message =
    customText ||
    'سلام وقت بخیر، از وب‌سایت فیکس لایف (fixlife.ir) جهت دریافت پشتیبانی و مشاوره تخصصی پوست پیام می‌دهم.';
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildProductWhatsAppConsultUrl(
  product: Product,
  selectedSize?: string
): string {
  const phone = getSupportWhatsAppNumber();
  const sizeText = selectedSize || product.defaultSize;
  const priceFormatted = `${product.priceUSD.toLocaleString('fa-IR')} تومان`;
  const productUrl =
    product.permalink || `https://fixlife.ir/?product_id=${product.id}`;

  const message = [
    'سلام وقت بخیر، از وب‌سایت فیکس لایف (fixlife.ir) پیام می‌دهم.',
    'جهت دریافت مشاوره تخصصی درباره این محصول راهنمایی می‌خواستم:',
    `📦 نام محصول: ${product.name}`,
    `🔢 کد سیستمی محصول: #${product.id} | کد کالا (SKU): ${product.sku}`,
    `💧 حجم انتخابی: ${sizeText}`,
    `💳 قیمت محصول: ${priceFormatted}`,
    `🔗 لینک محصول: ${productUrl}`,
    'لطفاً راهنمایی بفرمایید که آیا این محصول برای پوست من مناسب است؟',
  ].join('\n');

  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

function getRegisteredUsersMap(): Record<string, StoredCustomerCredential> {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  const defaultEmail = INITIAL_DEMO_CUSTOMER.email.toLowerCase();
  return {
    [defaultEmail]: {
      user: INITIAL_DEMO_CUSTOMER,
      password: 'fixlife1404',
    },
  };
}

function saveRegisteredUsersMap(map: Record<string, StoredCustomerCredential>) {
  try {
    localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(map));
  } catch {
    // ignore
  }
}

export function getAdminEmailLogs(): AdminEmailLogRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ADMIN_EMAIL_LOGS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {
    // ignore
  }
  return [];
}

export async function sendAdminEmailNotificationApi(payload: {
  eventType: AdminEmailLogRecord['eventType'];
  subject: string;
  body: string;
  userEmail?: string;
  userName?: string;
  userPhone?: string;
  orderNumber?: string;
  orderTotalToman?: number;
}): Promise<AdminEmailLogRecord> {
  const newRecord: AdminEmailLogRecord = {
    id: `mail-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    eventType: payload.eventType,
    from: SITE_OFFICIAL_EMAIL,
    to: ADMIN_NOTIFICATION_EMAIL,
    subject: payload.subject,
    body: payload.body,
    createdAt: new Date().toISOString(),
    deliveryStatus: 'queued_locally',
    userEmail: payload.userEmail,
    userName: payload.userName,
    userPhone: payload.userPhone,
    orderNumber: payload.orderNumber,
    orderTotalToman: payload.orderTotalToman,
  };

  try {
    const response = await fetch(`${API_BASE_URL}/notifications/admin-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: SITE_OFFICIAL_EMAIL,
        to: ADMIN_NOTIFICATION_EMAIL,
        subject: payload.subject,
        body: payload.body,
        event_type: payload.eventType,
        metadata: {
          user_email: payload.userEmail,
          user_name: payload.userName,
          user_phone: payload.userPhone,
          order_number: payload.orderNumber,
          order_total_toman: payload.orderTotalToman,
        },
      }),
    });
    if (response.ok) {
      newRecord.deliveryStatus = 'sent_to_server';
    }
  } catch {
    // Fallback to local log when running in preview without PHP mail daemon
  }

  try {
    const existing = getAdminEmailLogs();
    const updated = [newRecord, ...existing].slice(0, 100);
    localStorage.setItem(STORAGE_KEYS.ADMIN_EMAIL_LOGS, JSON.stringify(updated));
  } catch {
    // ignore
  }

  return newRecord;
}

export function isAdminAuthenticated(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'parham_authenticated';
  } catch {
    return false;
  }
}

export function loginAdminPanel(username: string, password: string): boolean {
  if (username.trim() === 'parham' && password === 'parham1382') {
    try {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'parham_authenticated');
    } catch {
      // ignore
    }
    return true;
  }
  return false;
}

export function logoutAdminPanel(): void {
  try {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  } catch {
    // ignore
  }
}

export function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function fetchProductsApi(params?: {
  category?: string;
  concern?: string;
  search?: string;
}): Promise<Product[]> {
  try {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'all') {
      query.set('category', params.category);
    }
    if (params?.concern) {
      query.set('concern', params.concern);
    }
    if (params?.search) {
      query.set('search', params.search);
    }
    const url = `${API_BASE_URL}/products${query.toString() ? `?${query.toString()}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const json = await response.json();
    if (Array.isArray(json.data) && json.data.length > 0) {
      return enrichDefaultProducts(json.data);
    }
    return getStoredProducts();
  } catch {
    return getStoredProducts();
  }
}

export async function loginCustomerApi(
  email: string,
  password: string
): Promise<{ user: CustomerUser; token: string }> {
  const normalizedEmail = email.trim().toLowerCase();
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: normalizedEmail, password }),
    });
    const json = await response.json();
    if (!response.ok || json.status === 'error') {
      throw new Error(json.message || 'ایمیل یا رمز عبور وارد شده صحیح نیست.');
    }
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, json.token);
    localStorage.setItem(STORAGE_KEYS.CUSTOMER_USER, JSON.stringify(json.user));

    await sendAdminEmailNotificationApi({
      eventType: 'user_login',
      subject: `[فیکس لایف] ورود کاربر به سایت: ${json.user.firstName} ${json.user.lastName}`,
      body: `کاربر با نام «${json.user.firstName} ${json.user.lastName}» و ایمیل ${json.user.email} (موبایل: ${json.user.phone}) وارد حساب کاربری خود در سایت فیکس لایف (fixlife.ir) شد.\nفرستنده: ${SITE_OFFICIAL_EMAIL}\nگیرنده ادمین: ${ADMIN_NOTIFICATION_EMAIL}`,
      userEmail: json.user.email,
      userName: `${json.user.firstName} ${json.user.lastName}`,
      userPhone: json.user.phone,
    });

    return { user: json.user, token: json.token };
  } catch (err) {
    if (err instanceof Error && err.message.includes('صحیح نیست')) {
      throw err;
    }

    const usersMap = getRegisteredUsersMap();
    const record = usersMap[normalizedEmail];
    if (record && record.password !== password) {
      throw new Error('رمز عبور وارد شده صحیح نیست. در صورت فراموشی، از گزینه «فراموشی رمز عبور» استفاده کنید.');
    }

    const fallbackUser: CustomerUser = record
      ? record.user
      : {
          ...INITIAL_DEMO_CUSTOMER,
          email: normalizedEmail,
        };

    usersMap[normalizedEmail] = {
      user: fallbackUser,
      password: record ? record.password : password,
    };
    saveRegisteredUsersMap(usersMap);

    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, fallbackUser.token);
    localStorage.setItem(STORAGE_KEYS.CUSTOMER_USER, JSON.stringify(fallbackUser));

    await sendAdminEmailNotificationApi({
      eventType: 'user_login',
      subject: `[فیکس لایف] ورود کاربر به سایت: ${fallbackUser.firstName} ${fallbackUser.lastName}`,
      body: `کاربر با نام «${fallbackUser.firstName} ${fallbackUser.lastName}» و ایمیل ${fallbackUser.email} (موبایل: ${fallbackUser.phone}) در تاریخ ${new Date().toLocaleString('fa-IR')} وارد وب‌سایت فیکس لایف شد.\nارسال شده از: ${SITE_OFFICIAL_EMAIL} به ${ADMIN_NOTIFICATION_EMAIL}`,
      userEmail: fallbackUser.email,
      userName: `${fallbackUser.firstName} ${fallbackUser.lastName}`,
      userPhone: fallbackUser.phone,
    });

    return { user: fallbackUser, token: fallbackUser.token };
  }
}

export async function registerCustomerApi(payload: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
}): Promise<{ user: CustomerUser; token: string }> {
  const normalizedEmail = payload.email.trim().toLowerCase();
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, email: normalizedEmail }),
    });
    const json = await response.json();
    if (!response.ok || json.status === 'error') {
      throw new Error(json.message || 'خطا در ثبت‌نام حساب کاربری.');
    }
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, json.token);
    localStorage.setItem(STORAGE_KEYS.CUSTOMER_USER, JSON.stringify(json.user));

    await sendAdminEmailNotificationApi({
      eventType: 'user_register',
      subject: `[فیکس لایف] ثبت‌نام کاربر جدید: ${json.user.firstName} ${json.user.lastName}`,
      body: `یک مشتری جدید در وب‌سایت فیکس لایف (fixlife.ir) ثبت‌نام کرد:\nنام و نام خانوادگی: ${json.user.firstName} ${json.user.lastName}\nایمیل: ${json.user.email}\nشماره موبایل: ${json.user.phone}\nارسال شده از: ${SITE_OFFICIAL_EMAIL} به ${ADMIN_NOTIFICATION_EMAIL}`,
      userEmail: json.user.email,
      userName: `${json.user.firstName} ${json.user.lastName}`,
      userPhone: json.user.phone,
    });

    return { user: json.user, token: json.token };
  } catch (err) {
    if (err instanceof Error && (err.message.includes('موبایل') || err.message.includes('رمز') || err.message.includes('خطا'))) {
      throw err;
    }
    const newUser: CustomerUser = {
      ...INITIAL_DEMO_CUSTOMER,
      id: `cust-${Date.now()}`,
      firstName: payload.firstName.trim(),
      lastName: payload.lastName.trim(),
      email: normalizedEmail,
      phone: payload.phone,
      token: `fixlife_jwt_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    const usersMap = getRegisteredUsersMap();
    usersMap[normalizedEmail] = {
      user: newUser,
      password: payload.password,
    };
    saveRegisteredUsersMap(usersMap);

    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, newUser.token);
    localStorage.setItem(STORAGE_KEYS.CUSTOMER_USER, JSON.stringify(newUser));

    await sendAdminEmailNotificationApi({
      eventType: 'user_register',
      subject: `[فیکس لایف] ثبت‌نام کاربر جدید: ${newUser.firstName} ${newUser.lastName}`,
      body: `یک مشتری جدید در وب‌سایت فیکس لایف (fixlife.ir) ثبت‌نام کرد:\nنام و نام خانوادگی: ${newUser.firstName} ${newUser.lastName}\nایمیل: ${newUser.email}\nشماره موبایل: ${newUser.phone}\nزمان ثبت‌نام: ${new Date().toLocaleString('fa-IR')}\nارسال شده از: ${SITE_OFFICIAL_EMAIL} به ${ADMIN_NOTIFICATION_EMAIL}`,
      userEmail: newUser.email,
      userName: `${newUser.firstName} ${newUser.lastName}`,
      userPhone: newUser.phone,
    });

    return { user: newUser, token: newUser.token };
  }
}

export async function forgotCustomerPasswordApi(payload: {
  email: string;
  phone: string;
  newPassword: string;
}): Promise<{ message: string }> {
  const normalizedEmail = payload.email.trim().toLowerCase();
  if (payload.newPassword.length < 6) {
    throw new Error('رمز عبور جدید باید حداقل ۶ کاراکتر باشد.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: normalizedEmail,
        phone: payload.phone,
        new_password: payload.newPassword,
      }),
    });
    if (response.ok) {
      const json = await response.json();
      return {
        message:
          json.message ||
          'رمز عبور جدید شما با موفقیت ثبت شد. اکنون می‌توانید وارد شوید.',
      };
    }
  } catch {
    // Fallback to local storage update
  }

  const usersMap = getRegisteredUsersMap();
  const existing = usersMap[normalizedEmail];
  if (existing) {
    usersMap[normalizedEmail] = {
      ...existing,
      password: payload.newPassword,
    };
  } else {
    const recoveredUser: CustomerUser = {
      ...INITIAL_DEMO_CUSTOMER,
      email: normalizedEmail,
      phone: payload.phone || INITIAL_DEMO_CUSTOMER.phone,
    };
    usersMap[normalizedEmail] = {
      user: recoveredUser,
      password: payload.newPassword,
    };
  }
  saveRegisteredUsersMap(usersMap);

  await sendAdminEmailNotificationApi({
    eventType: 'password_changed',
    subject: `[فیکس لایف] بازنشانی رمز عبور کاربر: ${normalizedEmail}`,
    body: `کاربر با ایمیل ${normalizedEmail} و موبایل ${payload.phone} از طریق فرم فراموشی رمز عبور، رمز خود را بازنشانی کرد.\nارسال شده از: ${SITE_OFFICIAL_EMAIL} به ${ADMIN_NOTIFICATION_EMAIL}`,
    userEmail: normalizedEmail,
    userPhone: payload.phone,
  });

  return {
    message:
      'رمز عبور شما با موفقیت بازنشانی شد. اکنون می‌توانید با رمز جدید وارد حساب خود شوید.',
  };
}

export async function changeCustomerPasswordApi(payload: {
  email: string;
  currentPassword: string;
  newPassword: string;
}): Promise<{ message: string }> {
  const normalizedEmail = payload.email.trim().toLowerCase();
  if (payload.newPassword.length < 6) {
    throw new Error('رمز عبور جدید باید حداقل ۶ کاراکتر باشد.');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        email: normalizedEmail,
        current_password: payload.currentPassword,
        new_password: payload.newPassword,
      }),
    });
    if (response.ok) {
      const json = await response.json();
      return {
        message: json.message || 'رمز عبور حساب کاربری شما با موفقیت تغییر یافت.',
      };
    }
  } catch {
    // Fallback to local storage
  }

  const usersMap = getRegisteredUsersMap();
  const record = usersMap[normalizedEmail];
  if (record && record.password !== payload.currentPassword) {
    throw new Error('رمز عبور فعلی وارد شده صحیح نیست.');
  }

  const storedRaw = localStorage.getItem(STORAGE_KEYS.CUSTOMER_USER);
  const currentUser: CustomerUser = storedRaw
    ? JSON.parse(storedRaw)
    : record?.user || INITIAL_DEMO_CUSTOMER;

  usersMap[normalizedEmail] = {
    user: currentUser,
    password: payload.newPassword,
  };
  saveRegisteredUsersMap(usersMap);

  await sendAdminEmailNotificationApi({
    eventType: 'password_changed',
    subject: `[فیکس لایف] تغییر رمز عبور توسط کاربر: ${currentUser.firstName} ${currentUser.lastName}`,
    body: `کاربر «${currentUser.firstName} ${currentUser.lastName}» (${normalizedEmail}) رمز عبور حساب خود را از پنل کاربری تغییر داد.\nارسال شده از: ${SITE_OFFICIAL_EMAIL} به ${ADMIN_NOTIFICATION_EMAIL}`,
    userEmail: normalizedEmail,
    userName: `${currentUser.firstName} ${currentUser.lastName}`,
    userPhone: currentUser.phone,
  });

  return {
    message: 'رمز عبور حساب کاربری شما با موفقیت بروزرسانی شد.',
  };
}

export async function validatePromoCodeApi(
  promoCode: string,
  subtotalUSD: number
): Promise<PromoCodeValidationResponse> {
  const normalized = promoCode.trim().toUpperCase();
  try {
    const response = await fetch(`${API_BASE_URL}/cart/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        promo_code: normalized,
        subtotal_usd: subtotalUSD,
      }),
    });
    if (response.ok) {
      return await response.json();
    }
  } catch {
    // Fallback below
  }

  if (normalized === 'GLOW15') {
    const discountAmountUSD = Math.round(subtotalUSD * 0.15);
    return {
      valid: true,
      code: 'GLOW15',
      discountPercent: 15,
      discountAmountUSD,
      message: 'کد تخفیف GLOW15 اعمال شد: ۱۵٪ تخفیف ویژه اولین خرید!',
    };
  }

  if (normalized === 'SALE20' || normalized === 'GLOW20') {
    const discountAmountUSD = Math.round(subtotalUSD * 0.2);
    return {
      valid: true,
      code: normalized,
      discountPercent: 20,
      discountAmountUSD,
      message: `کد تخفیف ${normalized} اعمال شد: ۲۰٪ تخفیف جشنواره فیکس لایف!`,
    };
  }

  return {
    valid: false,
    code: normalized,
    discountPercent: 0,
    discountAmountUSD: 0,
    message: 'کد تخفیف نامعتبر است. از کدهای GLOW15 (۱۵٪) یا SALE20 (۲۰٪) استفاده کنید.',
  };
}

export async function createOrderApi(
  payload: CreateOrderRequestPayload
): Promise<OrderRecord> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    const json = await response.json();
    if (!response.ok || json.status === 'error') {
      throw new Error(json.message || 'خطا در ثبت نهایی سفارش.');
    }
    const createdOrder: OrderRecord = {
      ...json.order,
      customer: json.order.customer || {
        email: payload.customer.email,
        phone: payload.customer.phone,
        first_name: payload.customer.first_name,
        last_name: payload.customer.last_name,
      },
    };
    saveOrderLocally(createdOrder);

    await sendAdminEmailNotificationApi({
      eventType: 'order_created',
      subject: `[فیکس لایف] ثبت سفارش جدید #${createdOrder.orderNumber} — ${createdOrder.customerName}`,
      body: `سفارش جدیدی در فروشگاه فیکس لایف (fixlife.ir) ثبت شد:\nشماره سفارش: ${createdOrder.orderNumber}\nخریدار: ${createdOrder.customerName}\nایمیل: ${createdOrder.customerEmail}\nموبایل: ${payload.customer.phone}\nمبلغ کل: ${createdOrder.totalUSD.toLocaleString('fa-IR')} تومان\nاقلام سفارش:\n${createdOrder.items.map((i) => `- ${i.name} (${i.size}) × ${i.quantity}`).join('\n')}\nنشانی ارسال: استان ${payload.shipping_address.state}، شهر ${payload.shipping_address.city}، ${payload.shipping_address.addressLine1}، کد پستی: ${payload.shipping_address.postalCode}\nارسال شده از: ${SITE_OFFICIAL_EMAIL} به ${ADMIN_NOTIFICATION_EMAIL}`,
      userEmail: createdOrder.customerEmail,
      userName: createdOrder.customerName,
      userPhone: payload.customer.phone,
      orderNumber: createdOrder.orderNumber,
      orderTotalToman: createdOrder.totalUSD,
    });

    return createdOrder;
  } catch (err) {
    if (err instanceof Error && (err.message.includes('کد پستی') || err.message.includes('موبایل') || err.message.includes('استان') || err.message.includes('خطا'))) {
      throw err;
    }
    const fallbackOrder: OrderRecord = {
      id: `ord-${Date.now()}`,
      orderNumber: `FIX-${Math.floor(10550 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      status: 'processing',
      customerEmail: payload.customer.email,
      customerName: `${payload.customer.first_name} ${payload.customer.last_name}`,
      customer: {
        email: payload.customer.email,
        phone: payload.customer.phone,
        first_name: payload.customer.first_name,
        last_name: payload.customer.last_name,
      },
      shippingAddress: payload.shipping_address,
      billingAddress: payload.billing_address,
      shippingMethod: payload.shipping_method,
      paymentMethod: payload.payment_method,
      promoCode: payload.promo_code,
      currency: 'TMN',
      items: payload.items,
      subtotalUSD: payload.totals.subtotal_usd,
      discountUSD: payload.totals.discount_usd,
      shippingUSD: payload.totals.shipping_usd,
      totalUSD: payload.totals.total_usd,
      trackingNumber: `TIPAX-${Math.floor(1000000000 + Math.random() * 8999999999)}`,
    };
    saveOrderLocally(fallbackOrder);

    await sendAdminEmailNotificationApi({
      eventType: 'order_created',
      subject: `[فیکس لایف] ثبت سفارش جدید #${fallbackOrder.orderNumber} — ${fallbackOrder.customerName}`,
      body: `سفارش جدیدی در فروشگاه فیکس لایف (fixlife.ir) ثبت شد:\nشماره سفارش: ${fallbackOrder.orderNumber}\nخریدار: ${fallbackOrder.customerName}\nایمیل: ${fallbackOrder.customerEmail}\nموبایل: ${payload.customer.phone}\nمبلغ کل: ${fallbackOrder.totalUSD.toLocaleString('fa-IR')} تومان\nاقلام سفارش:\n${fallbackOrder.items.map((i) => `- ${i.name} (${i.size}) × ${i.quantity}`).join('\n')}\nنشانی ارسال: استان ${payload.shipping_address.state}، شهر ${payload.shipping_address.city}، ${payload.shipping_address.addressLine1}، کد پستی: ${payload.shipping_address.postalCode}\nارسال شده از: ${SITE_OFFICIAL_EMAIL} به ${ADMIN_NOTIFICATION_EMAIL}`,
      userEmail: fallbackOrder.customerEmail,
      userName: fallbackOrder.customerName,
      userPhone: payload.customer.phone,
      orderNumber: fallbackOrder.orderNumber,
      orderTotalToman: fallbackOrder.totalUSD,
    });

    return fallbackOrder;
  }
}

export async function fetchCustomerOrdersApi(): Promise<OrderRecord[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (response.ok) {
      const json = await response.json();
      if (Array.isArray(json.orders)) {
        return json.orders;
      }
    }
  } catch {
    // Fallback
  }
  const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_DEMO_ORDERS;
    }
  }
  return INITIAL_DEMO_ORDERS;
}

export async function updateOrderStatusApi(
  orderId: string,
  status: OrderStatus
): Promise<OrderRecord[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ status }),
    });
    if (response.ok) {
      const json = await response.json();
      if (Array.isArray(json.orders)) {
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(json.orders));
        return json.orders;
      }
    }
  } catch {
    // Fallback
  }
  const current = await fetchCustomerOrdersApi();
  const updated = current.map((o) => (o.id === orderId ? { ...o, status } : o));
  localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));
  return updated;
}

export async function updateCustomerAddressApi(
  type: 'billing' | 'shipping',
  address: CustomerAddress
): Promise<CustomerUser> {
  try {
    const response = await fetch(`${API_BASE_URL}/customer/address`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ type, address }),
    });
    const json = await response.json();
    if (!response.ok || json.status === 'error') {
      throw new Error(json.message || 'خطا در بروزرسانی آدرس.');
    }
    if (json.user) {
      localStorage.setItem(STORAGE_KEYS.CUSTOMER_USER, JSON.stringify(json.user));
      return json.user;
    }
  } catch (err) {
    if (err instanceof Error && (err.message.includes('کد پستی') || err.message.includes('موبایل') || err.message.includes('استان') || err.message.includes('خطا'))) {
      throw err;
    }
  }
  const storedRaw = localStorage.getItem(STORAGE_KEYS.CUSTOMER_USER);
  const currentUser: CustomerUser = storedRaw
    ? JSON.parse(storedRaw)
    : INITIAL_DEMO_CUSTOMER;
  const updatedUser: CustomerUser = {
    ...currentUser,
    ...(type === 'billing'
      ? { billingAddress: address }
      : { shippingAddress: address }),
  };
  localStorage.setItem(STORAGE_KEYS.CUSTOMER_USER, JSON.stringify(updatedUser));
  return updatedUser;
}

export async function subscribeNewsletterApi(
  email: string
): Promise<{ status: string; message: string; promoCode: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/newsletter`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    const json = await response.json();
    if (!response.ok || json.status === 'error') {
      throw new Error(json.message || 'لطفاً یک آدرس ایمیل معتبر وارد نمایید.');
    }
    return json;
  } catch (err) {
    if (err instanceof Error && err.message.includes('معتبر')) {
      throw err;
    }
    return {
      status: 'success',
      message: 'عضویت شما در باشگاه مشتریان فیکس لایف ثبت شد! کد تخفیف ۱۵٪ شما: GLOW15',
      promoCode: 'GLOW15',
    };
  }
}

function saveOrderLocally(order: OrderRecord) {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ORDERS);
    const existing: OrderRecord[] = raw ? JSON.parse(raw) : INITIAL_DEMO_ORDERS;
    const isNewOrder = !existing.some((o) => o.id === order.id);
    const updated = [order, ...existing.filter((o) => o.id !== order.id)];
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updated));

    if (isNewOrder) {
      const currentProducts = getStoredProducts();
      const updatedProducts = currentProducts.map((prod) => {
        const orderedQty = order.items
          .filter(
            (item) =>
              item.product_id === prod.id ||
              item.sku === prod.sku ||
              item.name === prod.name
          )
          .reduce((acc, item) => acc + (Number(item.quantity) || 0), 0);
        if (orderedQty > 0) {
          return {
            ...prod,
            stockQuantity: Math.max(0, (prod.stockQuantity ?? 30) - orderedQty),
          };
        }
        return prod;
      });
      saveStoredProducts(updatedProducts);
    }
  } catch {
    // Ignore
  }
}

