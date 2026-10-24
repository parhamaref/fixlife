/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * فیکس لایف (FixLife | fixlife.ir) — سرور فول‌استک Express + Vite
 * پیاده‌سازی اندپوینت‌های REST (`/api/*`) با اعتبارسنجی استان و شهرهای ایران،
 * کد پستی ۱۰ رقمی و شماره موبایل ۱۱ رقمی ایران (09xxxxxxxxx).
 */

import express from 'express';
import http from 'http';
import path from 'path';
import { createServer as createViteServer } from 'vite';

// Ensure Vite config evaluates hmr: false in the Cloud Run preview environment
process.env.DISABLE_HMR = 'true';

import {
  INITIAL_DEMO_CUSTOMER,
  INITIAL_DEMO_ORDERS,
  PHP_MYSQL_API_CONTRACTS,
  PRODUCTS,
} from './src/data/catalogData';
import {
  isValidIranLocation,
  isValidIranMobile,
  isValidIranPostalCode,
  normalizeDigits,
} from './src/data/iranLocations';
import {
  CreateOrderRequestPayload,
  CustomerUser,
  OrderRecord,
  OrderStatus,
} from './src/types/ecommerce';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  let currentCustomer: CustomerUser = { ...INITIAL_DEMO_CUSTOMER };
  let ordersStore: OrderRecord[] = [...INITIAL_DEMO_ORDERS];
  const newsletterSubscribers = new Set<string>(['sara.mohammadi@fixlife.ir']);

  // 1. GET /api/products
  app.get('/api/products', (req, res) => {
    const { category, concern, search } = req.query;
    let filtered = [...PRODUCTS];

    if (typeof category === 'string' && category !== 'all') {
      filtered = filtered.filter((p) => p.category === category);
    }

    if (typeof concern === 'string' && concern.trim() !== '') {
      filtered = filtered.filter((p) => p.concerns.includes(concern as any));
    }

    if (typeof search === 'string' && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.fullInci.toLowerCase().includes(q)
      );
    }

    res.json({
      status: 'success',
      count: filtered.length,
      currency_base: 'TMN',
      data: filtered,
    });
  });

  // 2. POST /api/auth/login
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body || {};
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      res.status(400).json({
        status: 'error',
        message: 'لطفاً یک آدرس ایمیل معتبر وارد نمایید.',
      });
      return;
    }
    if (!password || String(password).length < 4) {
      res.status(401).json({
        status: 'error',
        message: 'رمز عبور نامعتبر است. رمز عبور باید حداقل ۴ کاراکتر باشد.',
      });
      return;
    }

    if (email.toLowerCase() !== currentCustomer.email.toLowerCase()) {
      currentCustomer = {
        ...currentCustomer,
        email: email.trim(),
        token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fixlife_${Date.now()}`,
      };
    }

    res.json({
      status: 'success',
      token: currentCustomer.token,
      user: currentCustomer,
    });
  });

  // 3. POST /api/auth/register
  app.post('/api/auth/register', (req, res) => {
    const { firstName, lastName, email, phone, password } = req.body || {};
    if (!firstName || !lastName || !email || !email.includes('@')) {
      res.status(400).json({
        status: 'error',
        message: 'وارد کردن نام، نام خانوادگی و ایمیل معتبر الزامی است.',
      });
      return;
    }

    const cleanPhone = normalizeDigits(String(phone || ''));
    if (!isValidIranMobile(cleanPhone)) {
      res.status(400).json({
        status: 'error',
        message:
          'شماره موبایل باید یک شماره موبایل معتبر ۱۱ رقمی ایران (شروع با ۰۹) باشد.',
      });
      return;
    }

    if (!password || String(password).length < 6) {
      res.status(400).json({
        status: 'error',
        message: 'رمز عبور باید حداقل ۶ کاراکتر باشد.',
      });
      return;
    }

    const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fixlife_${Date.now()}`;
    currentCustomer = {
      id: `cust-${Date.now()}`,
      firstName: String(firstName).trim(),
      lastName: String(lastName).trim(),
      email: String(email).trim(),
      phone: cleanPhone,
      token,
      createdAt: new Date().toISOString(),
      billingAddress: {
        ...INITIAL_DEMO_CUSTOMER.billingAddress,
        firstName: String(firstName).trim(),
        lastName: String(lastName).trim(),
        phone: cleanPhone,
      },
      shippingAddress: {
        ...INITIAL_DEMO_CUSTOMER.shippingAddress,
        firstName: String(firstName).trim(),
        lastName: String(lastName).trim(),
        phone: cleanPhone,
      },
    };

    res.status(201).json({
      status: 'success',
      token,
      user: currentCustomer,
    });
  });

  // 4. POST /api/cart/validate
  app.post('/api/cart/validate', (req, res) => {
    const { promo_code, subtotal_usd } = req.body || {};
    const code = String(promo_code || '').trim().toUpperCase();
    const subtotal = Number(subtotal_usd) || 0;

    if (code === 'GLOW15') {
      const discountAmountUSD = Math.round(subtotal * 0.15);
      res.json({
        valid: true,
        code: 'GLOW15',
        discountPercent: 15,
        discountAmountUSD,
        message: 'کد تخفیف GLOW15 اعمال شد: ۱۵٪ تخفیف اولین خرید!',
      });
      return;
    }

    if (code === 'SALE20' || code === 'GLOW20') {
      const discountAmountUSD = Math.round(subtotal * 0.2);
      res.json({
        valid: true,
        code,
        discountPercent: 20,
        discountAmountUSD,
        message: `کد تخفیف ${code} اعمال شد: ۲۰٪ تخفیف ویژه جشنواره فیکس لایف!`,
      });
      return;
    }

    res.json({
      valid: false,
      code,
      discountPercent: 0,
      discountAmountUSD: 0,
      message:
        'کد تخفیف وارد شده معتبر نیست. از کد GLOW15 (۱۵٪) یا SALE20 (۲۰٪) استفاده نمایید.',
    });
  });

  // 5. GET /api/orders & POST /api/orders
  app.get('/api/orders', (_req, res) => {
    res.json({
      status: 'success',
      count: ordersStore.length,
      orders: ordersStore,
    });
  });

  app.post('/api/orders', (req, res) => {
    const payload = req.body as CreateOrderRequestPayload;
    if (
      !payload ||
      !payload.customer?.email ||
      !Array.isArray(payload.items) ||
      payload.items.length === 0
    ) {
      res.status(400).json({
        status: 'error',
        message: 'اطلاعات مشتری و اقلام سفارش الزامی است.',
      });
      return;
    }

    const cleanPhone = normalizeDigits(payload.customer.phone || '');
    if (!isValidIranMobile(cleanPhone)) {
      res.status(400).json({
        status: 'error',
        message:
          'خطای اعتبارسنجی موبایل: فقط شماره موبایل ۱۱ رقمی ایران (مثال: 09123456789) مجاز است.',
      });
      return;
    }

    const shipAddr = payload.shipping_address;
    const cleanPostal = normalizeDigits(shipAddr?.postalCode || '');
    if (!isValidIranPostalCode(cleanPostal)) {
      res.status(400).json({
        status: 'error',
        message:
          'خطای کد پستی: کد پستی باید دقیقاً ۱۰ رقم عددی معتبر ایران باشد.',
      });
      return;
    }

    if (!isValidIranLocation(shipAddr?.state || '', shipAddr?.city || '')) {
      res.status(400).json({
        status: 'error',
        message:
          'خطای آدرس: ارسال سفارش فقط به استان‌ها و شهرهای داخل ایران امکان‌پذیر است.',
      });
      return;
    }

    const normalizedAddress = {
      ...shipAddr,
      postalCode: cleanPostal,
      phone: cleanPhone,
      country: 'ایران',
    };

    const newOrder: OrderRecord = {
      id: `ord-${Date.now()}`,
      orderNumber: `FIX-${Math.floor(10550 + Math.random() * 8999)}`,
      createdAt: new Date().toISOString(),
      status: 'processing',
      customerEmail: payload.customer.email,
      customerName: `${payload.customer.first_name} ${payload.customer.last_name}`.trim(),
      customer: {
        email: payload.customer.email,
        phone: cleanPhone,
        first_name: payload.customer.first_name,
        last_name: payload.customer.last_name,
      },
      shippingAddress: normalizedAddress,
      billingAddress: normalizedAddress,
      shippingMethod: payload.shipping_method || 'standard',
      paymentMethod: payload.payment_method || 'card',
      promoCode: payload.promo_code || null,
      currency: 'TMN',
      items: payload.items,
      subtotalUSD: payload.totals.subtotal_usd,
      discountUSD: payload.totals.discount_usd,
      shippingUSD: payload.totals.shipping_usd,
      totalUSD: payload.totals.total_usd,
      trackingNumber: `TIPAX-${Math.floor(1000000000 + Math.random() * 8999999999)}`,
    };

    ordersStore = [newOrder, ...ordersStore];

    res.status(201).json({
      status: 'success',
      message: 'سفارش شما با موفقیت ثبت و به واحد پردازش ارسال شد.',
      order: newOrder,
    });
  });

  // 6. PATCH /api/orders/:id/status
  app.patch('/api/orders/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body as { status: OrderStatus };
    const allowed: OrderStatus[] = [
      'pending',
      'processing',
      'completed',
      'cancelled',
    ];
    if (!allowed.includes(status)) {
      res.status(400).json({
        status: 'error',
        message: 'وضعیت سفارش نامعتبر است.',
      });
      return;
    }

    ordersStore = ordersStore.map((order) =>
      order.id === id ? { ...order, status } : order
    );

    res.json({
      status: 'success',
      orders: ordersStore,
    });
  });

  // 7. PUT /api/customer/address
  app.put('/api/customer/address', (req, res) => {
    const { type, address } = req.body || {};
    if (!address || !address.addressLine1) {
      res.status(400).json({
        status: 'error',
        message: 'وارد کردن نشانی دقیق پستی الزامی است.',
      });
      return;
    }

    const cleanPhone = normalizeDigits(String(address.phone || ''));
    if (!isValidIranMobile(cleanPhone)) {
      res.status(400).json({
        status: 'error',
        message: 'شماره موبایل باید ۱۱ رقم و با پیش‌شماره ۰۹ باشد.',
      });
      return;
    }

    const cleanPostal = normalizeDigits(String(address.postalCode || ''));
    if (!isValidIranPostalCode(cleanPostal)) {
      res.status(400).json({
        status: 'error',
        message: 'کد پستی باید دقیقاً ۱۰ رقم عددی باشد.',
      });
      return;
    }

    if (!isValidIranLocation(address.state || '', address.city || '')) {
      res.status(400).json({
        status: 'error',
        message: 'لطفاً استان و شهر معتبری از داخل ایران انتخاب نمایید.',
      });
      return;
    }

    const normalizedAddr = {
      ...address,
      phone: cleanPhone,
      postalCode: cleanPostal,
      country: 'ایران',
    };

    if (type === 'billing') {
      currentCustomer = { ...currentCustomer, billingAddress: normalizedAddr };
    } else {
      currentCustomer = { ...currentCustomer, shippingAddress: normalizedAddr };
    }

    res.json({
      status: 'success',
      message: 'آدرس شما با موفقیت در سامانه فیکس لایف ثبت شد.',
      user: currentCustomer,
    });
  });

  // 8. POST /api/newsletter
  app.post('/api/newsletter', (req, res) => {
    const { email } = req.body || {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(String(email).trim())) {
      res.status(400).json({
        status: 'error',
        message: 'لطفاً یک آدرس ایمیل معتبر وارد نمایید.',
      });
      return;
    }

    newsletterSubscribers.add(String(email).trim().toLowerCase());
    res.json({
      status: 'success',
      message:
        'به خانواده فیکس لایف خوش آمدید! کد تخفیف ۱۵٪ اولین خرید شما: GLOW15',
      promoCode: 'GLOW15',
    });
  });

  // 9. GET /api/contracts
  app.get('/api/contracts', (_req, res) => {
    res.json({
      status: 'success',
      endpoints: PHP_MYSQL_API_CONTRACTS,
    });
  });

  const httpServer = http.createServer(app);

  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
        watch: null,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`FixLife (fixlife.ir) server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
