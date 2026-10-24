/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 *
 * Complete Database Schema & Mock Data Export for FixLife (fixlife.ir)
 * Designed for direct MySQL / MariaDB (cPanel LAMP/LEMP) schema generation.
 */

import {
  CURRENCIES,
  EXPRESS_SHIPPING_FEE_TOMAN,
  FAQ_ITEMS,
  FREE_SHIPPING_THRESHOLD_USD,
  INITIAL_DEMO_CUSTOMER,
  INITIAL_DEMO_ORDERS,
  JOURNAL_ARTICLES,
  PHP_MYSQL_API_CONTRACTS,
  PRODUCTS,
  SKIN_CONCERNS,
  STANDARD_SHIPPING_FEE_TOMAN,
} from './catalogData';
import { IRAN_PROVINCES } from './iranLocations';

export interface FormFieldSpecification {
  fieldName: string;
  labelFa: string;
  formInputType:
    | 'text'
    | 'number'
    | 'select'
    | 'radio'
    | 'textarea'
    | 'file/image'
    | 'boolean'
    | 'date'
    | 'email'
    | 'tel'
    | 'password'
    | 'json_array';
  mySqlColumnType: string;
  required: boolean;
  validationRule?: string;
  options?: string[] | { value: string; label: string }[];
}

export interface EntitySchemaSpecification {
  entityName: string;
  tableName: string;
  typescriptInterface: string;
  description: string;
  formFields: FormFieldSpecification[];
  tableDisplayOnlyFields: {
    fieldName: string;
    mySqlColumnType: string;
    description: string;
  }[];
}

export const buildDatabaseSchemaExportObject = () => {
  const iranProvinceNames = IRAN_PROVINCES.map((p) => p.name);

  const entities: Record<string, EntitySchemaSpecification> = {
    Products: {
      entityName: 'Products',
      tableName: 'fixlife_products',
      typescriptInterface: 'Product (src/types/ecommerce.ts)',
      description: 'جدول اصلی محصولات مراقبت از پوست و زیبایی فیکس لایف',
      formFields: [
        {
          fieldName: 'sku',
          labelFa: 'کد کالا (SKU)',
          formInputType: 'text',
          mySqlColumnType: 'VARCHAR(64) UNIQUE NOT NULL',
          required: true,
          validationRule: 'Unique alphanumeric SKU (e.g. FIX-SRM-001)',
        },
        {
          fieldName: 'name',
          labelFa: 'نام محصول',
          formInputType: 'text',
          mySqlColumnType: 'VARCHAR(255) NOT NULL',
          required: true,
        },
        {
          fieldName: 'subtitle',
          labelFa: 'زیرعنوان / خلاصه ترکیبات',
          formInputType: 'text',
          mySqlColumnType: 'VARCHAR(500) NOT NULL',
          required: true,
        },
        {
          fieldName: 'category',
          labelFa: 'دسته‌بندی محصول',
          formInputType: 'select',
          mySqlColumnType:
            "ENUM('serums', 'cleansers', 'moisturizers', 'sunscreen', 'sets') NOT NULL",
          required: true,
          options: [
            { value: 'serums', label: 'سرم‌های تخصصی' },
            { value: 'cleansers', label: 'شوینده‌های گیاهی' },
            { value: 'moisturizers', label: 'مرطوب‌کننده‌ها' },
            { value: 'sunscreen', label: 'ضدآفتاب SPF 50' },
            { value: 'sets', label: 'پکیج‌های مراقبتی' },
          ],
        },
        {
          fieldName: 'concerns',
          labelFa: 'نیازهای پوستی مرتبط',
          formInputType: 'select',
          mySqlColumnType: 'JSON NOT NULL',
          required: true,
          options: [
            { value: 'acne', label: 'ضد جوش و منافذ' },
            { value: 'dryness', label: 'آبرسان و خشکی پوست' },
            { value: 'anti-aging', label: 'جوانساز و ضد چروک' },
            { value: 'brightening', label: 'روشن‌کننده و ضد لک' },
            { value: 'sensitive', label: 'پوست حساس' },
          ],
        },
        {
          fieldName: 'priceUSD',
          labelFa: 'قیمت پایه (تومان)',
          formInputType: 'number',
          mySqlColumnType: 'BIGINT UNSIGNED NOT NULL',
          required: true,
          validationRule: 'Positive integer in Iranian Toman (e.g. 1890000)',
        },
        {
          fieldName: 'compareAtPriceUSD',
          labelFa: 'قیمت قبل از تخفیف (تومان)',
          formInputType: 'number',
          mySqlColumnType: 'BIGINT UNSIGNED NULL',
          required: false,
        },
        {
          fieldName: 'image',
          labelFa: 'تصویر اصلی محصول',
          formInputType: 'file/image',
          mySqlColumnType: 'VARCHAR(500) NOT NULL',
          required: true,
        },
        {
          fieldName: 'hoverImage',
          labelFa: 'تصویر دوم (هاور)',
          formInputType: 'file/image',
          mySqlColumnType: 'VARCHAR(500) NULL',
          required: false,
        },
        {
          fieldName: 'tag',
          labelFa: 'برچسب ویژه (Tag)',
          formInputType: 'text',
          mySqlColumnType: 'VARCHAR(100) NULL',
          required: false,
        },
        {
          fieldName: 'isBestSeller',
          labelFa: 'نمایش در پرفروش‌ترین‌ها',
          formInputType: 'boolean',
          mySqlColumnType: 'TINYINT(1) NOT NULL DEFAULT 0',
          required: true,
        },
        {
          fieldName: 'isNew',
          labelFa: 'محصول جدید',
          formInputType: 'boolean',
          mySqlColumnType: 'TINYINT(1) NOT NULL DEFAULT 0',
          required: false,
        },
        {
          fieldName: 'defaultSize',
          labelFa: 'حجم پیش‌فرض',
          formInputType: 'text',
          mySqlColumnType: 'VARCHAR(100) NOT NULL',
          required: true,
        },
        {
          fieldName: 'sizes',
          labelFa: 'تنوع حجم و ضریب قیمت (ProductSizeOption[])',
          formInputType: 'json_array',
          mySqlColumnType: 'JSON NOT NULL',
          required: true,
        },
        {
          fieldName: 'description',
          labelFa: 'توضیحات کامل محصول',
          formInputType: 'textarea',
          mySqlColumnType: 'TEXT NOT NULL',
          required: true,
        },
        {
          fieldName: 'clinicalResults',
          labelFa: 'نتایج بالینی اثبات‌شده (string[])',
          formInputType: 'json_array',
          mySqlColumnType: 'JSON NOT NULL',
          required: true,
        },
        {
          fieldName: 'keyIngredients',
          labelFa: 'ترکیبات موثره کلیدی ({name, benefit}[])',
          formInputType: 'json_array',
          mySqlColumnType: 'JSON NOT NULL',
          required: true,
        },
        {
          fieldName: 'englishName',
          labelFa: 'نام انگلیسی محصول (English Title)',
          formInputType: 'text',
          mySqlColumnType: 'VARCHAR(255) NULL',
          required: false,
        },
        {
          fieldName: 'slug',
          labelFa: 'نامک یکتای محصول در سایت (URL Slug)',
          formInputType: 'text',
          mySqlColumnType: 'VARCHAR(255) UNIQUE NOT NULL',
          required: true,
        },
        {
          fieldName: 'permalink',
          labelFa: 'لینک مستقیم محصول در fixlife.ir',
          formInputType: 'text',
          mySqlColumnType: 'VARCHAR(500) NOT NULL',
          required: true,
        },
        {
          fieldName: 'gallery',
          labelFa: 'گالری تصاویر محصول (string[])',
          formInputType: 'json_array',
          mySqlColumnType: 'JSON NULL',
          required: false,
        },
        {
          fieldName: 'technicalSpecs',
          labelFa: 'جدول مشخصات فنی محصول ({label, spec, benefit}[])',
          formInputType: 'json_array',
          mySqlColumnType: 'JSON NULL',
          required: false,
        },
        {
          fieldName: 'protocolSteps',
          labelFa: 'گام‌های پروتکل مصرف ({stepNumber, title, instruction}[])',
          formInputType: 'json_array',
          mySqlColumnType: 'JSON NULL',
          required: false,
        },
        {
          fieldName: 'faqs',
          labelFa: 'سوالات متداول اختصاصی محصول ({question, answer}[])',
          formInputType: 'json_array',
          mySqlColumnType: 'JSON NULL',
          required: false,
        },
        {
          fieldName: 'scientificReferences',
          labelFa: 'منابع و رفرنس‌های علمی (string[])',
          formInputType: 'json_array',
          mySqlColumnType: 'JSON NULL',
          required: false,
        },
        {
          fieldName: 'seoMeta',
          labelFa: 'اطلاعات سئو، متاتگ‌ها و اسکیما (ProductSeoMeta)',
          formInputType: 'json_array',
          mySqlColumnType: 'JSON NOT NULL',
          required: true,
        },
        {
          fieldName: 'fullInci',
          labelFa: 'فهرست کامل ترکیبات (INCI)',
          formInputType: 'textarea',
          mySqlColumnType: 'TEXT NOT NULL',
          required: true,
        },
        {
          fieldName: 'howToUse',
          labelFa: 'روش مصرف',
          formInputType: 'textarea',
          mySqlColumnType: 'TEXT NOT NULL',
          required: true,
        },
      ],
      tableDisplayOnlyFields: [
        {
          fieldName: 'id',
          mySqlColumnType: 'VARCHAR(64) PRIMARY KEY',
          description: 'شناسه یکتای محصول (مثلاً prod-radiance-serum)',
        },
        {
          fieldName: 'rating',
          mySqlColumnType: 'DECIMAL(3,2) NOT NULL DEFAULT 5.00',
          description: 'میانگین امتیاز کاربران از ۵ ستاره',
        },
        {
          fieldName: 'reviewCount',
          mySqlColumnType: 'INT UNSIGNED NOT NULL DEFAULT 0',
          description: 'تعداد کل دیدگاه‌های تاییدشده محصول',
        },
        {
          fieldName: 'createdAt',
          mySqlColumnType: 'DATETIME DEFAULT CURRENT_TIMESTAMP',
          description: 'تاریخ ثبت محصول در دیتابیس',
        },
      ],
    },

    Categories: {
      entityName: 'Categories',
      tableName: 'fixlife_categories',
      typescriptInterface: 'ProductCategory (src/types/ecommerce.ts)',
      description: 'دسته‌بندی‌های اصلی محصولات فروشگاه فیکس لایف',
      formFields: [
        {
          fieldName: 'slug',
          labelFa: 'نامک دسته‌بندی (Slug)',
          formInputType: 'select',
          mySqlColumnType: 'VARCHAR(64) PRIMARY KEY',
          required: true,
          options: [
            'all',
            'serums',
            'cleansers',
            'moisturizers',
            'sunscreen',
            'sets',
          ],
        },
        {
          fieldName: 'titleFa',
          labelFa: 'عنوان فارسی دسته‌بندی',
          formInputType: 'text',
          mySqlColumnType: 'VARCHAR(128) NOT NULL',
          required: true,
        },
      ],
      tableDisplayOnlyFields: [
        {
          fieldName: 'productCount',
          mySqlColumnType: 'INT UNSIGNED NOT NULL DEFAULT 0',
          description: 'تعداد محصولات موجود در این دسته‌بندی',
        },
      ],
    },

    SkinConcerns: {
      entityName: 'SkinConcerns',
      tableName: 'fixlife_skin_concerns',
      typescriptInterface: 'SkinConcernCategory (src/types/ecommerce.ts)',
      description: 'دسته‌بندی نیازها و دغدغه‌های پوستی',
      formFields: [
        {
          fieldName: 'id',
          labelFa: 'شناسه نیاز پوستی',
          formInputType: 'select',
          mySqlColumnType:
            "ENUM('acne', 'dryness', 'anti-aging', 'brightening', 'sensitive') PRIMARY KEY",
          required: true,
          options: [
            'acne',
            'dryness',
            'anti-aging',
            'brightening',
            'sensitive',
          ],
        },
        {
          fieldName: 'title',
          labelFa: 'عنوان نیاز پوستی',
          formInputType: 'text',
          mySqlColumnType: 'VARCHAR(150) NOT NULL',
          required: true,
        },
        {
          fieldName: 'description',
          labelFa: 'توضیح کوتاه نیاز پوستی',
          formInputType: 'textarea',
          mySqlColumnType: 'VARCHAR(500) NOT NULL',
          required: true,
        },
        {
          fieldName: 'image',
          labelFa: 'تصویر کاور نیاز پوستی',
          formInputType: 'file/image',
          mySqlColumnType: 'VARCHAR(500) NOT NULL',
          required: true,
        },
      ],
      tableDisplayOnlyFields: [],
    },

    Orders: {
      entityName: 'Orders',
      tableName: 'fixlife_orders',
      typescriptInterface:
        'OrderRecord & CreateOrderRequestPayload (src/types/ecommerce.ts)',
      description:
        'سفارش‌های ثبت‌شده مشتریان در ایران به همراه آدرس، روش ارسال، کد تخفیف و وضعیت پردازش',
      formFields: [
        {
          fieldName: 'customer.first_name',
          labelFa: 'نام گیرنده',
          formInputType: 'text',
          mySqlColumnType: 'VARCHAR(100) NOT NULL',
          required: true,
        },
        {
          fieldName: 'customer.last_name',
          labelFa: 'نام خانوادگی گیرنده',
          formInputType: 'text',
          mySqlColumnType: 'VARCHAR(100) NOT NULL',
          required: true,
        },
        {
          fieldName: 'customer.email',
          labelFa: 'پست الکترونیک (ایمیل)',
          formInputType: 'email',
          mySqlColumnType: 'VARCHAR(191) NOT NULL',
          required: true,
          validationRule: '/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/',
        },
        {
          fieldName: 'customer.phone',
          labelFa: 'شماره موبایل ایران (۱۱ رقمی)',
          formInputType: 'tel',
          mySqlColumnType: 'CHAR(11) NOT NULL',
          required: true,
          validationRule: '/^09\\d{9}$/ (فقط موبایل ۱۱ رقمی ایران با پیش‌شماره ۰۹)',
        },
        {
          fieldName: 'shipping_address.country',
          labelFa: 'کشور',
          formInputType: 'text',
          mySqlColumnType: "VARCHAR(32) NOT NULL DEFAULT 'ایران'",
          required: true,
          options: ['ایران'],
        },
        {
          fieldName: 'shipping_address.state',
          labelFa: 'استان (۳۱ استان ایران)',
          formInputType: 'select',
          mySqlColumnType: 'VARCHAR(64) NOT NULL',
          required: true,
          options: iranProvinceNames,
        },
        {
          fieldName: 'shipping_address.city',
          labelFa: 'شهر (شهرهای استان انتخاب‌شده در ایران)',
          formInputType: 'select',
          mySqlColumnType: 'VARCHAR(64) NOT NULL',
          required: true,
          options: ['وابسته به استان انتخاب‌شده از لیست شهرهای ایران در IRAN_PROVINCES'],
        },
        {
          fieldName: 'shipping_address.addressLine1',
          labelFa: 'نشانی دقیق پستی (خیابان، کوچه، پلاک، واحد)',
          formInputType: 'text',
          mySqlColumnType: 'VARCHAR(500) NOT NULL',
          required: true,
          validationRule: 'Minimum 8 characters',
        },
        {
          fieldName: 'shipping_address.postalCode',
          labelFa: 'کد پستی ۱۰ رقمی',
          formInputType: 'text',
          mySqlColumnType: 'CHAR(10) NOT NULL',
          required: true,
          validationRule: '/^\\d{10}$/ (دقیقاً ۱۰ رقم عددی بدون خط تیره)',
        },
        {
          fieldName: 'shipping_method',
          labelFa: 'شیوه ارسال در ایران',
          formInputType: 'radio',
          mySqlColumnType: "ENUM('standard', 'express') NOT NULL",
          required: true,
          options: [
            {
              value: 'standard',
              label: 'پست پیشتاز / تیپاکس (۸۵,۰۰۰ تومان یا رایگان بالای ۲,۵۰۰,۰۰۰ تومان)',
            },
            {
              value: 'express',
              label: 'ارسال ویژه اکسپرس VIP (۱۶۵,۰۰۰ تومان)',
            },
          ],
        },
        {
          fieldName: 'payment_method',
          labelFa: 'روش پرداخت',
          formInputType: 'radio',
          mySqlColumnType:
            "ENUM('card', 'apple_pay', 'paypal', 'cod') NOT NULL",
          required: true,
          options: [
            { value: 'card', label: 'درگاه بانکی شتاب' },
            { value: 'apple_pay', label: 'زرین‌پال / شاپرک' },
            { value: 'paypal', label: 'پرداخت اقساطی اسنپ‌پی' },
            { value: 'cod', label: 'پرداخت در محل' },
          ],
        },
        {
          fieldName: 'promo_code',
          labelFa: 'کد تخفیف اعمال‌شده',
          formInputType: 'text',
          mySqlColumnType: 'VARCHAR(32) NULL',
          required: false,
          options: ['GLOW15', 'SALE20', 'FIXLIFE15'],
        },
        {
          fieldName: 'currency',
          labelFa: 'واحد پول سفارش',
          formInputType: 'select',
          mySqlColumnType: "CHAR(3) NOT NULL DEFAULT 'TMN'",
          required: true,
          options: ['TMN'],
        },
      ],
      tableDisplayOnlyFields: [
        {
          fieldName: 'id',
          mySqlColumnType: 'VARCHAR(64) PRIMARY KEY',
          description: 'شناسه داخلی سفارش (مثلاً ord-90412)',
        },
        {
          fieldName: 'orderNumber',
          mySqlColumnType: 'VARCHAR(64) UNIQUE NOT NULL',
          description: 'شماره پیگیری سفارش مشتری (مثلاً FIX-1405-8841)',
        },
        {
          fieldName: 'createdAt',
          mySqlColumnType: 'DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP',
          description: 'زمان دقیق ثبت سفارش',
        },
        {
          fieldName: 'status',
          mySqlColumnType:
            "ENUM('pending', 'processing', 'completed', 'cancelled') NOT NULL DEFAULT 'processing'",
          description: 'وضعیت پردازش و ارسال سفارش در پنل ادمین و کاربر',
        },
        {
          fieldName: 'trackingNumber',
          mySqlColumnType: 'VARCHAR(100) NULL',
          description: 'کد رهگیری ۲۴ رقمی پست پیشتاز یا تیپاکس',
        },
        {
          fieldName: 'subtotalUSD',
          mySqlColumnType: 'BIGINT UNSIGNED NOT NULL',
          description: 'جمع کل اقلام سفارش به تومان',
        },
        {
          fieldName: 'discountUSD',
          mySqlColumnType: 'BIGINT UNSIGNED NOT NULL DEFAULT 0',
          description: 'مبلغ تخفیف کسرشده به تومان',
        },
        {
          fieldName: 'shippingUSD',
          mySqlColumnType: 'BIGINT UNSIGNED NOT NULL DEFAULT 0',
          description: 'هزینه ارسال به تومان',
        },
        {
          fieldName: 'totalUSD',
          mySqlColumnType: 'BIGINT UNSIGNED NOT NULL',
          description: 'مبلغ نهایی قابل پرداخت به تومان',
        },
      ],
    },

    OrderItems: {
      entityName: 'OrderItems',
      tableName: 'fixlife_order_items',
      typescriptInterface: 'OrderItemPayload (src/types/ecommerce.ts)',
      description: 'اقلام هر سفارش (جدول واسط یک‌به‌چند با جدول سفارش‌ها)',
      formFields: [
        {
          fieldName: 'product_id',
          labelFa: 'شناسه محصول',
          formInputType: 'text',
          mySqlColumnType: 'VARCHAR(64) NOT NULL',
          required: true,
        },
        {
          fieldName: 'sku',
          labelFa: 'کد کالا (SKU)',
          formInputType: 'text',
          mySqlColumnType: 'VARCHAR(64) NOT NULL',
          required: true,
        },
        {
          fieldName: 'name',
          labelFa: 'نام محصول در زمان خرید',
          formInputType: 'text',
          mySqlColumnType: 'VARCHAR(255) NOT NULL',
          required: true,
        },
        {
          fieldName: 'size',
          labelFa: 'حجم انتخاب‌شده',
          formInputType: 'text',
          mySqlColumnType: 'VARCHAR(100) NOT NULL',
          required: true,
        },
        {
          fieldName: 'quantity',
          labelFa: 'تعداد',
          formInputType: 'number',
          mySqlColumnType: 'INT UNSIGNED NOT NULL DEFAULT 1',
          required: true,
        },
        {
          fieldName: 'unit_price_usd',
          labelFa: 'قیمت واحد (تومان)',
          formInputType: 'number',
          mySqlColumnType: 'BIGINT UNSIGNED NOT NULL',
          required: true,
        },
      ],
      tableDisplayOnlyFields: [
        {
          fieldName: 'id',
          mySqlColumnType: 'BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY',
          description: 'شناسه ردیف آیتم سفارش',
        },
        {
          fieldName: 'order_id',
          mySqlColumnType: 'VARCHAR(64) NOT NULL',
          description: 'کلید خارجی به fixlife_orders.id',
        },
        {
          fieldName: 'line_total_usd',
          mySqlColumnType: 'BIGINT UNSIGNED NOT NULL',
          description: 'حاصل‌ضرب قیمت واحد در تعداد (تومان)',
        },
      ],
    },

    Users: {
      entityName: 'Users',
      tableName: 'fixlife_users',
      typescriptInterface: 'CustomerUser & CustomerAddress (src/types/ecommerce.ts)',
      description: 'جدول مشتریان و کاربران عضو در فروشگاه فیکس لایف',
      formFields: [
        {
          fieldName: 'firstName',
          labelFa: 'نام',
          formInputType: 'text',
          mySqlColumnType: 'VARCHAR(100) NOT NULL',
          required: true,
        },
        {
          fieldName: 'lastName',
          labelFa: 'نام خانوادگی',
          formInputType: 'text',
          mySqlColumnType: 'VARCHAR(100) NOT NULL',
          required: true,
        },
        {
          fieldName: 'email',
          labelFa: 'ایمیل کاربری',
          formInputType: 'email',
          mySqlColumnType: 'VARCHAR(191) UNIQUE NOT NULL',
          required: true,
        },
        {
          fieldName: 'phone',
          labelFa: 'شماره موبایل ۱۱ رقمی ایران',
          formInputType: 'tel',
          mySqlColumnType: 'CHAR(11) UNIQUE NOT NULL',
          required: true,
          validationRule: '/^09\\d{9}$/',
        },
        {
          fieldName: 'password',
          labelFa: 'رمز عبور (هش‌شده در دیتابیس)',
          formInputType: 'password',
          mySqlColumnType: 'VARCHAR(255) NOT NULL',
          required: true,
        },
        {
          fieldName: 'shippingAddress',
          labelFa: 'نشانی پیش‌فرض ارسال مرسوله در ایران',
          formInputType: 'json_array',
          mySqlColumnType: 'JSON NOT NULL',
          required: true,
        },
        {
          fieldName: 'billingAddress',
          labelFa: 'نشانی پیش‌فرض فاکتور در ایران',
          formInputType: 'json_array',
          mySqlColumnType: 'JSON NOT NULL',
          required: true,
        },
      ],
      tableDisplayOnlyFields: [
        {
          fieldName: 'id',
          mySqlColumnType: 'VARCHAR(64) PRIMARY KEY',
          description: 'شناسه یکتای کاربر (مثلاً usr-1001)',
        },
        {
          fieldName: 'token',
          mySqlColumnType: 'VARCHAR(512) NULL',
          description: 'توکن نشست JWT',
        },
        {
          fieldName: 'createdAt',
          mySqlColumnType: 'DATETIME DEFAULT CURRENT_TIMESTAMP',
          description: 'تاریخ عضویت کاربر',
        },
      ],
    },

    Reviews: {
      entityName: 'Reviews',
      tableName: 'fixlife_product_reviews',
      typescriptInterface: 'ProductReview (src/types/ecommerce.ts)',
      description: 'نظرات و امتیازهای خریداران برای هر محصول',
      formFields: [
        {
          fieldName: 'productId',
          labelFa: 'شناسه محصول',
          formInputType: 'select',
          mySqlColumnType: 'VARCHAR(64) NOT NULL',
          required: true,
          options: PRODUCTS.map((p) => ({ value: p.id, label: p.name })),
        },
        {
          fieldName: 'author',
          labelFa: 'نام نویسنده دیدگاه',
          formInputType: 'text',
          mySqlColumnType: 'VARCHAR(120) NOT NULL',
          required: true,
        },
        {
          fieldName: 'skinType',
          labelFa: 'نوع پوست خریدار',
          formInputType: 'select',
          mySqlColumnType: 'VARCHAR(100) NOT NULL',
          required: true,
          options: [
            'پوست مختلط و مستعد لک',
            'پوست خشک و حساس',
            'پوست چرب و مستعد آکنه',
            'پوست نرمال',
            'پوست دهیدراته',
          ],
        },
        {
          fieldName: 'rating',
          labelFa: 'امتیاز (۱ تا ۵ ستاره)',
          formInputType: 'number',
          mySqlColumnType: 'TINYINT UNSIGNED NOT NULL DEFAULT 5',
          required: true,
          options: ['1', '2', '3', '4', '5'],
        },
        {
          fieldName: 'title',
          labelFa: 'عنوان دیدگاه',
          formInputType: 'text',
          mySqlColumnType: 'VARCHAR(200) NOT NULL',
          required: true,
        },
        {
          fieldName: 'comment',
          labelFa: 'متن دیدگاه',
          formInputType: 'textarea',
          mySqlColumnType: 'TEXT NOT NULL',
          required: true,
        },
      ],
      tableDisplayOnlyFields: [
        {
          fieldName: 'id',
          mySqlColumnType: 'VARCHAR(64) PRIMARY KEY',
          description: 'شناسه دیدگاه',
        },
        {
          fieldName: 'date',
          mySqlColumnType: 'VARCHAR(64) NOT NULL',
          description: 'تاریخ شمسی ثبت دیدگاه',
        },
        {
          fieldName: 'isVerifiedBuyer',
          mySqlColumnType: 'TINYINT(1) NOT NULL DEFAULT 1',
          description: 'وضعیت خریدار تاییدشده',
        },
      ],
    },

    Discounts: {
      entityName: 'Discounts',
      tableName: 'fixlife_discounts',
      typescriptInterface: 'PromoValidationResponse (src/types/ecommerce.ts)',
      description: 'کدهای تخفیف و جشنواره‌های فروش فیکس لایف',
      formFields: [
        {
          fieldName: 'code',
          labelFa: 'کد تخفیف',
          formInputType: 'text',
          mySqlColumnType: 'VARCHAR(32) PRIMARY KEY',
          required: true,
          options: ['GLOW15', 'SALE20', 'FIXLIFE15'],
        },
        {
          fieldName: 'discountPercent',
          labelFa: 'درصد تخفیف',
          formInputType: 'number',
          mySqlColumnType: 'TINYINT UNSIGNED NOT NULL',
          required: true,
        },
        {
          fieldName: 'message',
          labelFa: 'پیام تایید کد تخفیف',
          formInputType: 'text',
          mySqlColumnType: 'VARCHAR(255) NOT NULL',
          required: true,
        },
        {
          fieldName: 'isActive',
          labelFa: 'فعال / غیرفعال',
          formInputType: 'boolean',
          mySqlColumnType: 'TINYINT(1) NOT NULL DEFAULT 1',
          required: true,
        },
      ],
      tableDisplayOnlyFields: [
        {
          fieldName: 'usageCount',
          mySqlColumnType: 'INT UNSIGNED NOT NULL DEFAULT 0',
          description: 'تعداد دفعات استفاده از کد تخفیف',
        },
      ],
    },

    JournalArticles: {
      entityName: 'JournalArticles',
      tableName: 'fixlife_journal_articles',
      typescriptInterface: 'JournalArticle (src/types/ecommerce.ts)',
      description: 'مقالات علمی و آموزشی مجله تخصصی پوست فیکس لایف',
      formFields: [
        {
          fieldName: 'slug',
          labelFa: 'نامک مقاله (Slug)',
          formInputType: 'text',
          mySqlColumnType: 'VARCHAR(191) UNIQUE NOT NULL',
          required: true,
        },
        {
          fieldName: 'title',
          labelFa: 'عنوان مقاله',
          formInputType: 'text',
          mySqlColumnType: 'VARCHAR(255) NOT NULL',
          required: true,
        },
        {
          fieldName: 'category',
          labelFa: 'دسته‌بندی علمی مقاله',
          formInputType: 'text',
          mySqlColumnType: 'VARCHAR(100) NOT NULL',
          required: true,
        },
        {
          fieldName: 'readTime',
          labelFa: 'زمان مطالعه',
          formInputType: 'text',
          mySqlColumnType: 'VARCHAR(50) NOT NULL',
          required: true,
        },
        {
          fieldName: 'image',
          labelFa: 'تصویر شاخص مقاله',
          formInputType: 'file/image',
          mySqlColumnType: 'VARCHAR(500) NOT NULL',
          required: true,
        },
        {
          fieldName: 'excerpt',
          labelFa: 'خلاصه مقاله',
          formInputType: 'textarea',
          mySqlColumnType: 'TEXT NOT NULL',
          required: true,
        },
        {
          fieldName: 'content',
          labelFa: 'پاراگراف‌های متن مقاله (string[])',
          formInputType: 'json_array',
          mySqlColumnType: 'JSON NOT NULL',
          required: true,
        },
        {
          fieldName: 'keyTakeaways',
          labelFa: 'نکات کلیدی متخصصین پوست (string[])',
          formInputType: 'json_array',
          mySqlColumnType: 'JSON NOT NULL',
          required: true,
        },
        {
          fieldName: 'relatedProductIds',
          labelFa: 'شناسه‌های محصولات مرتبط (string[])',
          formInputType: 'json_array',
          mySqlColumnType: 'JSON NOT NULL',
          required: false,
        },
      ],
      tableDisplayOnlyFields: [
        {
          fieldName: 'id',
          mySqlColumnType: 'VARCHAR(64) PRIMARY KEY',
          description: 'شناسه مقاله',
        },
        {
          fieldName: 'publishedAt',
          mySqlColumnType: 'VARCHAR(64) NOT NULL',
          description: 'تاریخ انتشار شمسی',
        },
      ],
    },
  };

  return {
    meta: {
      brandNameFa: 'فیکس لایف',
      brandNameEn: 'FixLife',
      domain: 'https://fixlife.ir',
      locale: 'fa_IR',
      direction: 'rtl',
      currency: CURRENCIES.TMN,
      targetDatabaseEngine: 'MySQL 8.0+ / MariaDB 10.6+ (utf8mb4_persian_ci)',
      exportedAt: new Date().toISOString(),
    },
    validationRules: {
      countryFixed: 'ایران',
      iranMobileRegex: '^09\\d{9}$',
      iranPostalCodeRegex: '^\\d{10}$',
      allowedProvincesCount: IRAN_PROVINCES.length,
    },
    storeSettings: {
      freeShippingThresholdToman: FREE_SHIPPING_THRESHOLD_USD,
      standardShippingFeeToman: STANDARD_SHIPPING_FEE_TOMAN,
      expressShippingFeeToman: EXPRESS_SHIPPING_FEE_TOMAN,
      activeDiscounts: [
        {
          code: 'GLOW15',
          discountPercent: 15,
          message: 'کد تخفیف GLOW15 اعمال شد: ۱۵٪ تخفیف ویژه اولین خرید شما در فیکس لایف.',
        },
        {
          code: 'SALE20',
          discountPercent: 20,
          message: 'کد جشنواره SALE20 اعمال شد: ۲۰٪ تخفیف ویژه کل محصولات فیکس لایف.',
        },
        {
          code: 'FIXLIFE15',
          discountPercent: 15,
          message: 'کد تخفیف اختصاصی FIXLIFE15 با موفقیت اعمال شد (۱۵٪ تخفیف).',
        },
      ],
    },
    entities,
    mockData: {
      products: PRODUCTS,
      skinConcerns: SKIN_CONCERNS,
      initialDemoCustomer: INITIAL_DEMO_CUSTOMER,
      initialDemoOrders: INITIAL_DEMO_ORDERS,
      journalArticles: JOURNAL_ARTICLES,
      faqItems: FAQ_ITEMS,
      iranProvincesAndCities: IRAN_PROVINCES,
      apiContracts: PHP_MYSQL_API_CONTRACTS,
    },
  };
};
