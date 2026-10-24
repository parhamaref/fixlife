/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  ShoppingBag,
  Plus,
  Minus,
  Trash2,
  Truck,
  Tag,
  ArrowLeft,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';
import { CartItem, CurrencyConfig } from '../types/ecommerce';
import {
  FREE_SHIPPING_THRESHOLD_USD,
  STANDARD_SHIPPING_FEE_TOMAN,
} from '../data/catalogData';
import { formatToman, toPersianDigits } from '../data/iranLocations';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: CurrencyConfig;
  promoCode: string | null;
  discountPercent: number;
  promoMessage: string | null;
  isApplyingPromo: boolean;
  onUpdateQuantity: (productId: string, size: string, delta: number) => void;
  onRemoveItem: (productId: string, size: string) => void;
  onApplyPromoCode: (code: string) => Promise<void>;
  onRemovePromoCode: () => void;
  onProceedToCheckout: () => void;
  onQuickAddProduct: (productId: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  promoCode,
  discountPercent,
  promoMessage,
  isApplyingPromo,
  onUpdateQuantity,
  onRemoveItem,
  onApplyPromoCode,
  onRemovePromoCode,
  onProceedToCheckout,
  onQuickAddProduct,
}) => {
  const [couponInput, setCouponInput] = useState(promoCode || '');

  if (!isOpen) return null;

  const formatPrice = (toman: number) => formatToman(toman);

  const subtotalToman = items.reduce(
    (sum, item) => sum + item.unitPriceUSD * item.quantity,
    0
  );
  const discountToman = Math.round((subtotalToman * discountPercent) / 100);
  const discountedSubtotalToman = Math.max(0, subtotalToman - discountToman);
  const amountAwayFromFreeShippingToman = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD_USD - discountedSubtotalToman
  );
  const freeShippingProgress = Math.min(
    100,
    (discountedSubtotalToman / FREE_SHIPPING_THRESHOLD_USD) * 100
  );
  const shippingToman =
    items.length === 0
      ? 0
      : discountedSubtotalToman >= FREE_SHIPPING_THRESHOLD_USD
        ? 0
        : STANDARD_SHIPPING_FEE_TOMAN;
  const totalToman = discountedSubtotalToman + shippingToman;

  const handlePromoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    await onApplyPromoCode(couponInput.trim().toUpperCase());
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex justify-start bg-black/40 backdrop-blur-[2px] transition-opacity duration-200"
      role="dialog"
      aria-modal="true"
      aria-label="سبد خرید فیکس لایف"
    >
      <div className="fixed inset-0" onClick={onClose} />

      <aside className="relative z-10 flex h-full w-full max-w-md flex-col bg-[#FDFBF7] text-[#1A1A1A] shadow-2xl border-l border-[#E8E4DC]">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-[#E8E4DC] px-6 py-5">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-4 w-4 text-[#1A1A1A]" strokeWidth={1.5} />
            <h2 className="font-editorial text-lg font-bold">
              سبد خرید شما
            </h2>
            <span className="text-xs text-[#787269] tabular-nums">
              ({toPersianDigits(items.reduce((acc, i) => acc + i.quantity, 0))} کالا)
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-[#4A4640] hover:text-[#1A1A1A] transition-colors cursor-pointer"
            aria-label="بستن سبد خرید"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Free Shipping Threshold Bar */}
        <div className="bg-[#EFECE6] px-6 py-3.5 border-b border-[#E8E4DC]">
          <div className="flex items-center gap-2 text-xs text-[#1A1A1A] mb-2">
            <Truck className="h-4 w-4 text-[#B89B72] shrink-0" strokeWidth={1.5} />
            {amountAwayFromFreeShippingToman === 0 && items.length > 0 ? (
              <span className="font-semibold">
                تبریک! سفارش شما شامل ارسال رایگان به سراسر ایران شد.
              </span>
            ) : (
              <span>
                فقط{' '}
                <strong className="font-bold tabular-nums">
                  {formatPrice(amountAwayFromFreeShippingToman)}
                </strong>{' '}
                تا{' '}
                <span className="underline decoration-[#C5A880] font-semibold">
                  ارسال رایگان سراسر ایران
                </span>{' '}
                باقی مانده است.
              </span>
            )}
          </div>
          <div className="h-1.5 w-full overflow-hidden bg-[#DCD5C9]">
            <div
              className="h-full bg-[#1A1A1A] transition-all duration-300"
              style={{ width: `${items.length === 0 ? 0 : freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto px-6 py-5 divide-y divide-[#E8E4DC]">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center border border-[#E8E4DC] bg-[#FAF7F2]">
                <ShoppingBag
                  className="h-6 w-6 text-[#787269]"
                  strokeWidth={1.25}
                />
              </div>
              <h3 className="font-editorial text-xl font-bold mb-2">
                سبد خرید شما خالی است
              </h3>
              <p className="text-xs text-[#787269] max-w-xs mb-6 leading-relaxed text-justify">
                فرمولاسیون‌های گیاهی و بالینی فیکس لایف را برای بازگرداندن شادابی و درخشش طبیعی به پوست خود بررسی کنید.
              </p>
              <button
                onClick={() => onQuickAddProduct('4370')}
                className="bg-[#1A1A1A] text-white text-xs font-semibold px-6 py-3 hover:bg-[#333333] transition-colors cursor-pointer"
              >
                افزودن سرم رتینول تخصصی و ضد چروک جیورا
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={`${item.productId}-${item.selectedSize}`}
                className="flex gap-4 py-4 first:pt-0 last:pb-0"
              >
                <div className="h-22 w-20 shrink-0 overflow-hidden bg-[#F4EFEA] border border-[#E8E4DC]">
                  <img
                    src={item.image}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="text-xs font-bold text-[#1A1A1A]">
                        {item.name}
                      </h4>
                      <button
                        onClick={() =>
                          onRemoveItem(item.productId, item.selectedSize)
                        }
                        className="text-[#787269] hover:text-[#1A1A1A] transition-colors p-0.5 cursor-pointer"
                        aria-label={`حذف ${item.name}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                    </div>
                    <p className="mt-0.5 text-[11px] text-[#787269]">
                      حجم: {item.selectedSize} · کد کالا: {item.sku}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="inline-flex items-center border border-[#E8E4DC] bg-white">
                      <button
                        onClick={() =>
                          onUpdateQuantity(
                            item.productId,
                            item.selectedSize,
                            1
                          )
                        }
                        className="px-2.5 py-1 text-[#4A4640] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                        aria-label="افزایش تعداد"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <span className="px-2.5 text-xs font-semibold tabular-nums">
                        {toPersianDigits(item.quantity)}
                      </span>
                      <button
                        onClick={() =>
                          onUpdateQuantity(
                            item.productId,
                            item.selectedSize,
                            -1
                          )
                        }
                        className="px-2.5 py-1 text-[#4A4640] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                        aria-label="کاهش تعداد"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="text-xs font-bold tabular-nums text-[#1A1A1A]">
                      {formatPrice(item.unitPriceUSD * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer & Promo Section */}
        {items.length > 0 && (
          <div className="border-t border-[#E8E4DC] bg-[#FAF7F2] px-6 py-5 space-y-4">
            {/* Interactive Promo Code Bar */}
            <div>
              <form onSubmit={handlePromoSubmit} className="flex gap-2">
                <div className="relative flex-1">
                  <Tag
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#787269]"
                    strokeWidth={1.5}
                  />
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="کد تخفیف (مثلاً GLOW15 یا SALE20)"
                    className="w-full border border-[#DCD5C9] bg-white pr-8 pl-3 py-2 text-xs text-[#1A1A1A] placeholder:text-[#787269] focus:border-[#1A1A1A] focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isApplyingPromo}
                  className="border border-[#1A1A1A] bg-transparent px-4 py-2 text-xs font-semibold text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white transition-colors cursor-pointer whitespace-nowrap"
                >
                  {isApplyingPromo ? 'در حال بررسی...' : 'اعمال کد'}
                </button>
              </form>

              {/* Quick Promo Toggle Buttons */}
              <div className="mt-2 flex items-center justify-between text-[11px] text-[#787269]">
                <span>کدهای تخفیف فعال:</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCouponInput('GLOW15');
                      onApplyPromoCode('GLOW15');
                    }}
                    className={`underline cursor-pointer hover:text-[#1A1A1A] ${
                      promoCode === 'GLOW15' ? 'font-bold text-[#1A1A1A]' : ''
                    }`}
                  >
                    GLOW15 (۱۵٪ تخفیف)
                  </button>
                  <span>·</span>
                  <button
                    type="button"
                    onClick={() => {
                      setCouponInput('SALE20');
                      onApplyPromoCode('SALE20');
                    }}
                    className={`underline cursor-pointer hover:text-[#1A1A1A] ${
                      promoCode === 'SALE20' ? 'font-bold text-[#1A1A1A]' : ''
                    }`}
                  >
                    SALE20 (۲۰٪ تخفیف)
                  </button>
                </div>
              </div>

              {promoMessage && (
                <div className="mt-2 flex items-center justify-between bg-[#EFECE6] px-3 py-1.5 text-[11px] text-[#1A1A1A]">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-[#8C7048] shrink-0" />
                    <span>{promoMessage}</span>
                  </span>
                  {promoCode && (
                    <button
                      type="button"
                      onClick={() => {
                        setCouponInput('');
                        onRemovePromoCode();
                      }}
                      className="text-[11px] underline mr-2 cursor-pointer"
                    >
                      حذف کد
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Totals Breakdown */}
            <div className="space-y-1.5 border-t border-[#E8E4DC] pt-3 text-xs">
              <div className="flex justify-between text-[#4A4640]">
                <span>جمع کل کالاها</span>
                <span className="tabular-nums">{formatPrice(subtotalToman)}</span>
              </div>
              {discountToman > 0 && (
                <div className="flex justify-between text-[#8C7048] font-semibold">
                  <span>تخفیف ({promoCode} · {toPersianDigits(discountPercent)}٪)</span>
                  <span className="tabular-nums">-{formatPrice(discountToman)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#4A4640]">
                <span>هزینه ارسال (سراسر ایران)</span>
                <span className="tabular-nums">
                  {shippingToman === 0 ? 'رایگان' : formatPrice(shippingToman)}
                </span>
              </div>
              <div className="flex justify-between border-t border-[#E8E4DC] pt-2.5 text-sm font-bold text-[#1A1A1A]">
                <span>مبلغ قابل پرداخت</span>
                <span className="tabular-nums">{formatPrice(totalToman)}</span>
              </div>
            </div>

            {/* Primary Checkout Button */}
            <button
              onClick={onProceedToCheckout}
              className="flex w-full items-center justify-center gap-2 bg-[#1A1A1A] py-3.5 px-6 text-xs font-semibold text-white hover:bg-[#333333] transition-colors cursor-pointer"
            >
              <span>ادامه جهت ثبت سفارش و پرداخت</span>
              <ArrowLeft className="h-3.5 w-3.5" />
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#787269]">
              <ShieldCheck className="h-3.5 w-3.5 text-[#B89B72]" />
              <span>پرداخت امن شتاب · ضمانت اصالت کالا و بازگشت ۳۰ روزه</span>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
};
