/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  X,
  CheckCircle2,
  ShieldCheck,
  Lock,
  CreditCard,
  Truck,
  Code2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  MapPin,
} from 'lucide-react';
import {
  CartItem,
  CreateOrderRequestPayload,
  CurrencyConfig,
  CustomerUser,
  OrderRecord,
} from '../types/ecommerce';
import {
  FREE_SHIPPING_THRESHOLD_USD,
  STANDARD_SHIPPING_FEE_TOMAN,
  EXPRESS_SHIPPING_FEE_TOMAN,
} from '../data/catalogData';
import {
  IRAN_PROVINCES,
  formatToman,
  isValidIranLocation,
  isValidIranMobile,
  isValidIranPostalCode,
  normalizeDigits,
  toPersianDigits,
} from '../data/iranLocations';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: CurrencyConfig;
  promoCode: string | null;
  discountPercent: number;
  customer: CustomerUser;
  onSubmitOrder: (payload: CreateOrderRequestPayload) => Promise<OrderRecord>;
  onOpenDashboard: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  promoCode,
  discountPercent,
  customer,
  onSubmitOrder,
  onOpenDashboard,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [firstName, setFirstName] = useState(customer.firstName || 'سارا');
  const [lastName, setLastName] = useState(customer.lastName || 'محمدی');
  const [email, setEmail] = useState(
    customer.email || 'sara.mohammadi@fixlife.ir'
  );
  const [phone, setPhone] = useState(
    normalizeDigits(customer.phone || '09123456789')
  );
  const [addressLine1, setAddressLine1] = useState(
    customer.shippingAddress?.addressLine1 ||
      'خیابان ولیعصر، بالاتر از پارک ساعی، کوچه مهر، پلاک ۲۴، واحد ۸'
  );
  const [stateProv, setStateProv] = useState(
    customer.shippingAddress?.state &&
      IRAN_PROVINCES.some((p) => p.name === customer.shippingAddress?.state)
      ? customer.shippingAddress.state
      : 'تهران'
  );

  const availableCities = useMemo(() => {
    const prov = IRAN_PROVINCES.find((p) => p.name === stateProv);
    return prov ? prov.cities : [];
  }, [stateProv]);

  const [city, setCity] = useState(() => {
    const initialProv = IRAN_PROVINCES.find(
      (p) => p.name === (customer.shippingAddress?.state || 'تهران')
    );
    const defaultCities = initialProv ? initialProv.cities : ['تهران'];
    if (
      customer.shippingAddress?.city &&
      defaultCities.includes(customer.shippingAddress.city)
    ) {
      return customer.shippingAddress.city;
    }
    return defaultCities[0] || 'تهران';
  });

  const [postalCode, setPostalCode] = useState(
    normalizeDigits(customer.shippingAddress?.postalCode || '1968943111')
  );

  // Country is strictly Iran
  const country = 'ایران';

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>(
    'standard'
  );
  const paymentMethod = 'apple_pay' as const;

  const [validationError, setValidationError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);
  const [showJsonPayload, setShowJsonPayload] = useState(false);

  if (!isOpen) return null;

  const formatPrice = (toman: number) => formatToman(toman);

  const subtotalToman = Math.round(
    items.reduce((acc, item) => acc + item.unitPriceUSD * item.quantity, 0)
  );
  const discountToman = Math.round((subtotalToman * discountPercent) / 100);
  const discountedSubtotalToman = Math.max(0, subtotalToman - discountToman);
  const baseShippingToman =
    discountedSubtotalToman >= FREE_SHIPPING_THRESHOLD_USD
      ? 0
      : STANDARD_SHIPPING_FEE_TOMAN;
  const shippingToman =
    shippingMethod === 'express'
      ? EXPRESS_SHIPPING_FEE_TOMAN
      : baseShippingToman;
  const totalToman = discountedSubtotalToman + shippingToman;

  const handleProvinceChange = (newProvince: string) => {
    setStateProv(newProvince);
    const found = IRAN_PROVINCES.find((p) => p.name === newProvince);
    if (found && found.cities.length > 0) {
      setCity(found.cities[0]);
    } else {
      setCity('');
    }
  };

  const handlePhoneInput = (raw: string) => {
    // Normalize Persian/Arabic digits to English and keep only numbers (max 11 digits)
    const normalized = normalizeDigits(raw).replace(/\D/g, '').slice(0, 11);
    setPhone(normalized);
  };

  const handlePostalCodeInput = (raw: string) => {
    // Normalize Persian/Arabic digits to English and keep only numbers (max 10 digits)
    const normalized = normalizeDigits(raw).replace(/\D/g, '').slice(0, 10);
    setPostalCode(normalized);
  };

  const buildOrderPayload = (): CreateOrderRequestPayload => {
    const cleanPhone = normalizeDigits(phone).trim();
    const cleanPostal = normalizeDigits(postalCode).trim();
    const addr = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      addressLine1: addressLine1.trim(),
      city: city.trim(),
      state: stateProv.trim(),
      postalCode: cleanPostal,
      country,
      phone: cleanPhone,
    };
    return {
      customer: {
        email: email.trim(),
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: cleanPhone,
      },
      billing_address: addr,
      shipping_address: addr,
      shipping_method: shippingMethod,
      payment_method: paymentMethod,
      promo_code: promoCode,
      currency: currency.code,
      items: items.map((item) => ({
        product_id: item.productId,
        sku: item.sku,
        name: item.name,
        size: item.selectedSize,
        quantity: item.quantity,
        unit_price_usd: item.unitPriceUSD,
        line_total_usd: Math.round(item.unitPriceUSD * item.quantity),
      })),
      totals: {
        subtotal_usd: subtotalToman,
        discount_usd: discountToman,
        shipping_usd: shippingToman,
        total_usd: totalToman,
      },
    };
  };

  const validateStep1 = (): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!firstName.trim() || !lastName.trim()) {
      setValidationError('لطفاً نام و نام خانوادگی تحویل‌گیرنده را کامل وارد کنید.');
      return false;
    }
    if (!emailRegex.test(email.trim())) {
      setValidationError('لطفاً یک آدرس ایمیل معتبر وارد نمایید.');
      return false;
    }
    if (!isValidIranMobile(phone)) {
      setValidationError(
        'شماره موبایل باید حتماً ۱۱ رقم و با پیش‌شماره ۰۹ باشد (مثال: 09123456789).'
      );
      return false;
    }
    if (!isValidIranLocation(stateProv, city)) {
      setValidationError(
        'فروش و ارسال فیکس لایف فقط در داخل ایران انجام می‌شود؛ لطفاً استان و شهر معتبر در ایران را انتخاب کنید.'
      );
      return false;
    }
    if (!addressLine1.trim() || addressLine1.trim().length < 8) {
      setValidationError(
        'لطفاً نشانی دقیق پستی (خیابان، کوچه، پلاک و واحد) را وارد نمایید.'
      );
      return false;
    }
    if (!isValidIranPostalCode(postalCode)) {
      setValidationError(
        'کد پستی باید دقیقاً ۱۰ رقم عددی بدون خط تیره یا فاصله باشد.'
      );
      return false;
    }
    setValidationError(null);
    return true;
  };

  // تابعی که هنگام کلیک روی «پرداخت نهایی» اجرا می‌شود
  const handleStartPayment = async () => {
    setValidationError(null);
    setIsSubmitting(true);
    try {
      const currentOrder =
        confirmedOrder || (await onSubmitOrder(buildOrderPayload()));
      setConfirmedOrder(currentOrder);

      // ۱. ارسال سفارش به بک‌اند و درخواست توکن زرین‌پال
      const response = await fetch('https://fixlife.ir/api/payment/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: currentOrder.id, // مثلاً ord-172981023
          amount: currentOrder.totalUSD, // مبلغ نهایی سبد خرید به تومان
          mobile: currentOrder.customer.phone, // شماره موبایل کاربر (جهت تسهیل پرداخت در شاپرک)
          email: currentOrder.customer.email,
        }),
      });

      const result = await response.json();

      if (result.status === 'success' && result.paymentUrl) {
        // ۲. هدایت آنی مرورگر کاربر به صفحه امن شاپرک / زرین‌پال
        window.location.href = result.paymentUrl;
      } else {
        setValidationError(
          result.message || 'خطا در برقراری ارتباط با درگاه پرداخت زرین‌پال.'
        );
      }
    } catch (error) {
      console.error('Payment Error:', error);
      setValidationError('عدم برقراری ارتباط با سرور.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const normalizedPostalLength = normalizeDigits(postalCode).replace(/\D/g, '').length;
  const normalizedPhoneLength = normalizeDigits(phone).replace(/\D/g, '').length;

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="تسویه حساب و ثبت سفارش فیکس لایف"
    >
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden bg-[#FDFBF7] border border-[#E8E4DC] shadow-2xl">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#E8E4DC] bg-[#FAF7F2] px-6 py-4">
          <div>
            <span className="block font-editorial text-xl sm:text-2xl font-bold">
              ثبت سفارش و تسویه‌حساب فیکس لایف
            </span>
            <span className="text-xs text-[#787269]">
              مرحله {toPersianDigits(step)} از ۳ ·{' '}
              {step === 1
                ? 'اطلاعات تماس و نشانی پستی در ایران'
                : step === 2
                  ? 'شیوه ارسال و درگاه پرداخت زرین‌پال'
                  : 'تایید نهایی سفارش'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setShowJsonPayload((prev) => !prev)}
              className="inline-flex items-center gap-1.5 border border-[#DCD5C9] bg-white px-3 py-1.5 text-[11px] text-[#4A4640] hover:border-[#1A1A1A] hover:text-[#1A1A1A] cursor-pointer"
              title="مشاهده ساختار JSON ارسالی به بک‌اند PHP/MySQL و درگاه زرین‌پال"
            >
              <Code2 className="h-3.5 w-3.5 text-[#8C7048]" />
              <span>{showJsonPayload ? 'بستن JSON' : 'ساختار API'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-[#4A4640] hover:text-[#1A1A1A] cursor-pointer"
              aria-label="بستن پنجره تسویه‌حساب"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Optional Developer JSON Payload Inspector */}
        {showJsonPayload && (
          <div
            dir="ltr"
            className="border-b border-[#E8E4DC] bg-[#1A1A1A] px-6 py-3 text-left text-[11px] text-[#EAE3D9] overflow-x-auto max-h-56 space-y-3"
          >
            <div>
              <div className="flex items-center justify-between text-[#C5A880] mb-1 font-mono">
                <span>1) POST https://fixlife.ir/api/payment/initiate — ZarinPal Initiate Payload</span>
                <span>Content-Type: application/json</span>
              </div>
              <pre className="font-mono text-[10px] leading-relaxed">
                {JSON.stringify(
                  {
                    orderId: confirmedOrder?.id || 'ord-172981023',
                    amount: confirmedOrder?.totalUSD || totalToman,
                    mobile:
                      confirmedOrder?.customer.phone ||
                      normalizeDigits(phone).trim(),
                    email: confirmedOrder?.customer.email || email.trim(),
                  },
                  null,
                  2
                )}
              </pre>
            </div>
            <div className="border-t border-white/10 pt-2">
              <div className="flex items-center justify-between text-[#C5A880] mb-1 font-mono">
                <span>2) POST /api/orders — Full Order Schema Payload</span>
                <span>Content-Type: application/json</span>
              </div>
              <pre className="font-mono text-[10px] leading-relaxed">
                {JSON.stringify(buildOrderPayload(), null, 2)}
              </pre>
            </div>
          </div>
        )}

        {/* Main Body */}
        <div className="grid flex-1 grid-cols-1 overflow-y-auto md:grid-cols-12">
          {/* Right Column in RTL: Steps */}
          <div className="p-6 sm:p-8 md:col-span-7 text-right">
            {validationError && (
              <div className="mb-5 space-y-2 border border-red-800/30 bg-red-50/70 px-4 py-3 text-xs text-red-900">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span className="text-justify font-medium">{validationError}</span>
                </div>
                {confirmedOrder && step === 2 && (
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={handleStartPayment}
                      className="bg-red-900 text-white px-3 py-1.5 text-[11px] font-semibold hover:bg-red-800 cursor-pointer"
                    >
                      تلاش مجدد اتصال به زرین‌پال
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setValidationError(null);
                        setStep(3);
                      }}
                      className="border border-red-900/40 bg-white text-red-950 px-3 py-1.5 text-[11px] font-semibold hover:bg-red-100/50 cursor-pointer"
                    >
                      مشاهده پیش‌فاکتور ثبت‌شده (#{confirmedOrder.orderNumber})
                    </button>
                  </div>
                )}
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-editorial text-xl font-bold text-[#1A1A1A]">
                    ۱. مشخصات گیرنده و آدرس پستی (ویژه ایران)
                  </h3>
                  <span className="inline-flex items-center gap-1 bg-[#EFECE6] px-2.5 py-1 text-[11px] font-medium text-[#8C7048]">
                    <MapPin className="h-3 w-3" />
                    <span>فقط شهرهای ایران</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A4640] mb-1">
                      نام *
                    </label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="نام"
                      className="w-full border border-[#DCD5C9] bg-white px-3 py-2 text-xs focus:border-[#1A1A1A] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#4A4640] mb-1">
                      نام خانوادگی *
                    </label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="نام خانوادگی"
                      className="w-full border border-[#DCD5C9] bg-white px-3 py-2 text-xs focus:border-[#1A1A1A] focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-[#4A4640]">
                        شماره موبایل (۱۱ رقمی) *
                      </label>
                      <span
                        className={`text-[10px] tabular-nums ${
                          isValidIranMobile(phone)
                            ? 'text-emerald-700 font-semibold'
                            : 'text-[#787269]'
                        }`}
                      >
                        {toPersianDigits(normalizedPhoneLength)}/۱۱ رقم
                      </span>
                    </div>
                    <input
                      type="tel"
                      inputMode="tel"
                      dir="ltr"
                      maxLength={11}
                      value={phone}
                      onChange={(e) => handlePhoneInput(e.target.value)}
                      placeholder="09123456789"
                      className={`w-full border bg-white px-3 py-2 text-xs text-left font-mono focus:outline-none ${
                        phone.length > 0 && !isValidIranMobile(phone)
                          ? 'border-red-600 focus:border-red-700'
                          : 'border-[#DCD5C9] focus:border-[#1A1A1A]'
                      }`}
                    />
                    <p className="mt-1 text-[10px] text-[#787269]">
                      فقط شماره موبایل ایران با پیش‌شماره ۰۹ مجاز است.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A4640] mb-1">
                      پست الکترونیک (ایمیل) *
                    </label>
                    <input
                      type="email"
                      dir="ltr"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@fixlife.ir"
                      className="w-full border border-[#DCD5C9] bg-white px-3 py-2 text-xs text-left font-mono focus:border-[#1A1A1A] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Iran Province & City Selectors */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#4A4640] mb-1">
                      کشور
                    </label>
                    <input
                      type="text"
                      value="ایران"
                      disabled
                      readOnly
                      className="w-full border border-[#E8E4DC] bg-[#F4F1EA] px-3 py-2 text-xs font-semibold text-[#4A4640] cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A4640] mb-1">
                      استان *
                    </label>
                    <select
                      value={stateProv}
                      onChange={(e) => handleProvinceChange(e.target.value)}
                      className="w-full border border-[#DCD5C9] bg-white px-2.5 py-2 text-xs focus:border-[#1A1A1A] focus:outline-none"
                    >
                      {IRAN_PROVINCES.map((prov) => (
                        <option key={prov.name} value={prov.name}>
                          {prov.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A4640] mb-1">
                      شهر *
                    </label>
                    <select
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full border border-[#DCD5C9] bg-white px-2.5 py-2 text-xs focus:border-[#1A1A1A] focus:outline-none"
                    >
                      {availableCities.map((cityName) => (
                        <option key={cityName} value={cityName}>
                          {cityName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#4A4640] mb-1">
                    نشانی دقیق پستی (خیابان، کوچه، پلاک، طبقه و واحد) *
                  </label>
                  <input
                    type="text"
                    value={addressLine1}
                    onChange={(e) => setAddressLine1(e.target.value)}
                    placeholder="خیابان، کوچه، پلاک، واحد"
                    className="w-full border border-[#DCD5C9] bg-white px-3 py-2 text-xs focus:border-[#1A1A1A] focus:outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-[#4A4640]">
                      کد پستی ۱۰ رقمی (بدون خط تیره) *
                    </label>
                    <span
                      className={`text-[10px] tabular-nums ${
                        isValidIranPostalCode(postalCode)
                          ? 'text-emerald-700 font-semibold'
                          : 'text-[#787269]'
                      }`}
                    >
                      {toPersianDigits(normalizedPostalLength)}/۱۰ رقم
                    </span>
                  </div>
                  <input
                    type="text"
                    inputMode="numeric"
                    dir="ltr"
                    maxLength={10}
                    value={postalCode}
                    onChange={(e) => handlePostalCodeInput(e.target.value)}
                    placeholder="1968943111"
                    className={`w-full border bg-white px-3 py-2 text-xs text-left font-mono tracking-widest focus:outline-none ${
                      postalCode.length > 0 && !isValidIranPostalCode(postalCode)
                        ? 'border-red-600 focus:border-red-700'
                        : 'border-[#DCD5C9] focus:border-[#1A1A1A]'
                    }`}
                  />
                  <p className="mt-1 text-[10px] text-[#787269]">
                    ثبت دقیق ۱۰ رقم کد پستی جهت ارسال مرسوله توسط پست پیشتاز یا تیپاکس الزامی است.
                  </p>
                </div>

                <div className="pt-3">
                  <button
                    type="button"
                    onClick={() => {
                      if (validateStep1()) setStep(2);
                    }}
                    className="flex w-full items-center justify-center gap-2 bg-[#1A1A1A] py-3.5 px-6 text-xs font-semibold text-white hover:bg-[#333333] transition-colors cursor-pointer"
                  >
                    <span>تایید آدرس و ادامه به مرحله ارسال و پرداخت</span>
                    <ArrowLeft className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-editorial text-xl font-bold text-[#1A1A1A]">
                    ۲. انتخاب شیوه ارسال و پرداخت
                  </h3>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-1 text-xs text-[#787269] hover:text-[#1A1A1A] cursor-pointer"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                    <span>ویرایش آدرس و موبایل</span>
                  </button>
                </div>

                {/* Summary of verified Iran address */}
                <div className="border border-[#E8E4DC] bg-[#FAF7F2] p-3.5 text-xs text-[#4A4640] space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1A1A1A]">
                      گیرنده: {firstName} {lastName} ({toPersianDigits(phone)})
                    </span>
                    <span className="text-[11px] text-[#8C7048] font-semibold">
                      استان {stateProv}، شهر {city}
                    </span>
                  </div>
                  <p className="text-justify">{addressLine1}</p>
                  <p className="text-[11px] text-[#787269]">
                    کد پستی ۱۰ رقمی: <span className="font-mono">{toPersianDigits(postalCode)}</span>
                  </p>
                </div>

                {/* Shipping Method Selection */}
                <div className="space-y-2">
                  <span className="block text-xs font-semibold text-[#4A4640]">
                    شیوه ارسال در ایران:
                  </span>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setShippingMethod('standard')}
                      className={`flex items-center justify-between border p-3 text-right text-xs cursor-pointer ${
                        shippingMethod === 'standard'
                          ? 'border-[#1A1A1A] bg-[#EFECE6]'
                          : 'border-[#DCD5C9] bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-[#8C7048] shrink-0" />
                        <div>
                          <div className="font-bold">پست پیشتاز / تیپاکس</div>
                          <div className="text-[10px] text-[#787269]">
                            تحویل ۲ تا ۴ روز کاری
                          </div>
                        </div>
                      </div>
                      <span className="font-bold tabular-nums">
                        {baseShippingToman === 0
                          ? 'رایگان'
                          : formatPrice(baseShippingToman)}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShippingMethod('express')}
                      className={`flex items-center justify-between border p-3 text-right text-xs cursor-pointer ${
                        shippingMethod === 'express'
                          ? 'border-[#1A1A1A] bg-[#EFECE6]'
                          : 'border-[#DCD5C9] bg-white'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Truck className="h-4 w-4 text-[#1A1A1A] shrink-0" />
                        <div>
                          <div className="font-bold">ارسال ویژه اکسپرس (پیک VIP)</div>
                          <div className="text-[10px] text-[#787269]">
                            تحویل سریع ۲۴ ساعته
                          </div>
                        </div>
                      </div>
                      <span className="font-bold tabular-nums">
                        {formatPrice(EXPRESS_SHIPPING_FEE_TOMAN)}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="space-y-2">
                  <span className="block text-xs font-semibold text-[#4A4640]">
                    روش پرداخت:
                  </span>
                  <div className="border border-[#1A1A1A] bg-[#1A1A1A] py-3 px-4 text-xs font-semibold text-white flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-[#C6A87C]" />
                      <span>زرین‌پال / شاپرک (کلیه کارت‌های عضو شبکه شتاب)</span>
                    </span>
                    <CheckCircle2 className="h-4 w-4 text-[#C6A87C]" />
                  </div>
                </div>

                <div className="border border-[#E8E4DC] bg-[#FAF7F2] p-4 text-xs text-[#4A4640] text-justify leading-6 space-y-1.5">
                  <div className="flex items-center justify-between font-bold text-[#1A1A1A]">
                    <span>درگاه پرداخت امن زرین‌پال (شاپرک بانک مرکزی)</span>
                    <span className="font-mono text-[10px] text-[#8C7048]">
                      POST https://fixlife.ir/api/payment/initiate
                    </span>
                  </div>
                  <p>
                    با کلیک روی دکمه پرداخت نهایی، سفارش شما ثبت شده و به صورت خودکار با کلیه کارت‌های عضو شبکه شتاب به صفحه امن شاپرک / زرین‌پال هدایت می‌شوید.
                  </p>
                </div>

                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleStartPayment}
                  className="flex w-full items-center justify-center gap-2 bg-[#1A1A1A] py-3.5 px-6 text-xs font-semibold text-white hover:bg-[#333333] transition-colors cursor-pointer"
                >
                  <Lock className="h-3.5 w-3.5" />
                  <span>
                    {isSubmitting
                      ? 'در حال اتصال به درگاه پرداخت زرین‌پال...'
                      : `ثبت نهایی سفارش و پرداخت — ${formatPrice(totalToman)}`}
                  </span>
                </button>
              </div>
            )}

            {step === 3 && confirmedOrder && (
              <div className="space-y-5 py-4">
                <div className="flex items-center gap-3 text-[#1A1A1A]">
                  <CheckCircle2 className="h-8 w-8 text-[#8C7048] shrink-0" />
                  <div>
                    <span className="text-xs font-semibold text-[#8C7048]">
                      از خرید شما از فیکس لایف (fixlife.ir) سپاسگزاریم
                    </span>
                    <h3 className="font-editorial text-2xl sm:text-3xl font-bold">
                      سفارش #{confirmedOrder.orderNumber} با موفقیت ثبت شد
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-[#4A4640] leading-7 text-justify">
                  پیامک تایید سفارش به شماره موبایل{' '}
                  <strong className="text-[#1A1A1A] font-mono">
                    {toPersianDigits(confirmedOrder.shippingAddress.phone)}
                  </strong>{' '}
                  و رسید الکترونیکی به ایمیل{' '}
                  <strong className="text-[#1A1A1A]">
                    {confirmedOrder.customerEmail}
                  </strong>{' '}
                  ارسال شد. محصولات مراقبت پوستی شما در مرکز پردازش فیکس لایف در حال بسته‌بندی هستند.
                </p>

                <div className="border border-[#E8E4DC] bg-[#FAF7F2] p-4 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#787269]">شناسه سفارش (orderId):</span>
                    <span className="font-mono text-[11px] font-bold">
                      {confirmedOrder.id}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#787269]">وضعیت پردازش:</span>
                    <span className="font-bold text-[#8C7048]">
                      در انتظار ارسال ({confirmedOrder.status})
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#787269] shrink-0">نشانی تحویل:</span>
                    <span className="text-left">
                      استان {confirmedOrder.shippingAddress.state}، شهر{' '}
                      {confirmedOrder.shippingAddress.city}،{' '}
                      {confirmedOrder.shippingAddress.addressLine1} (کد پستی:{' '}
                      {toPersianDigits(confirmedOrder.shippingAddress.postalCode)})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#787269]">کد رهگیری مرسوله:</span>
                    <span className="font-mono text-[11px] font-bold">
                      {confirmedOrder.trackingNumber}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 pt-2">
                  <button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleStartPayment}
                    className="bg-[#8C7048] px-5 py-3 text-xs font-semibold text-white hover:bg-[#735B39] cursor-pointer"
                  >
                    {isSubmitting
                      ? 'در حال اتصال به زرین‌پال...'
                      : 'پرداخت آنلاین از طریق درگاه زرین‌پال'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenDashboard();
                    }}
                    className="bg-[#1A1A1A] px-6 py-3 text-xs font-semibold text-white hover:bg-[#333333] cursor-pointer"
                  >
                    پیگیری سفارش در پنل کاربری
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="border border-[#1A1A1A] px-6 py-3 text-xs font-semibold text-[#1A1A1A] hover:bg-[#EFECE6] cursor-pointer"
                  >
                    بازگشت به فروشگاه فیکس لایف
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Left Column in RTL: Order Summary */}
          <div className="border-t border-[#E8E4DC] bg-[#FAF7F2] p-6 sm:p-8 md:col-span-5 md:border-r md:border-t-0 text-right">
            <h4 className="font-editorial text-lg font-bold mb-4">
              خلاصه فاکتور سفارش
            </h4>
            <div className="space-y-3 max-h-60 overflow-y-auto pl-1 divide-y divide-[#E8E4DC]">
              {(confirmedOrder ? confirmedOrder.items : items).map(
                (item: any, idx) => {
                  const name = item.name;
                  const qty = item.quantity;
                  const size = item.selectedSize || item.size;
                  const lineTotal =
                    item.line_total_usd ?? item.unitPriceUSD * item.quantity;
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between pt-3 first:pt-0 text-xs"
                    >
                      <div>
                        <p className="font-bold text-[#1A1A1A]">
                          {name} × {toPersianDigits(qty)}
                        </p>
                        <p className="text-[11px] text-[#787269]">{size}</p>
                      </div>
                      <span className="font-semibold tabular-nums">
                        {formatPrice(lineTotal)}
                      </span>
                    </div>
                  );
                }
              )}
            </div>

            <div className="mt-5 space-y-2 border-t border-[#E8E4DC] pt-4 text-xs">
              <div className="flex justify-between text-[#4A4640]">
                <span>جمع اقلام</span>
                <span className="tabular-nums">
                  {formatPrice(
                    confirmedOrder ? confirmedOrder.subtotalUSD : subtotalToman
                  )}
                </span>
              </div>
              {(confirmedOrder ? confirmedOrder.discountUSD : discountToman) >
                0 && (
                <div className="flex justify-between text-[#8C7048] font-semibold">
                  <span>تخفیف کد هدیه</span>
                  <span className="tabular-nums">
                    -
                    {formatPrice(
                      confirmedOrder
                        ? confirmedOrder.discountUSD
                        : discountToman
                    )}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-[#4A4640]">
                <span>هزینه ارسال</span>
                <span className="tabular-nums">
                  {(confirmedOrder
                    ? confirmedOrder.shippingUSD
                    : shippingToman) === 0
                    ? 'رایگان'
                    : formatPrice(
                        confirmedOrder
                          ? confirmedOrder.shippingUSD
                          : shippingToman
                      )}
                </span>
              </div>
              <div className="flex justify-between border-t border-[#E8E4DC] pt-3 text-sm font-bold text-[#1A1A1A]">
                <span>مبلغ کل (تومان)</span>
                <span className="tabular-nums">
                  {formatPrice(
                    confirmedOrder ? confirmedOrder.totalUSD : totalToman
                  )}
                </span>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2 border-t border-[#E8E4DC] pt-4 text-[11px] text-[#787269]">
              <ShieldCheck className="h-4 w-4 text-[#8C7048] shrink-0" />
              <span className="text-justify">
                دارای مجوز بهداشتی · ارسال ایمن به ۳۱ استان ایران · ضمانت بازگشت ۳۰ روزه فیکس لایف
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
