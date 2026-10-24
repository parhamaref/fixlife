/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { CheckCircle2, XCircle, ShoppingBag, Home } from 'lucide-react';

interface CheckoutResultProps {
  onReturnToCart?: () => void;
  onReturnHome?: () => void;
}

export default function CheckoutResult({
  onReturnToCart,
  onReturnHome,
}: CheckoutResultProps) {
  // خواندن پارامترهای URL
  const queryParams = new URLSearchParams(
    window.location.hash.split('?')[1] || window.location.search
  );
  const status = queryParams.get('status');
  const refId = queryParams.get('refId');
  const orderId = queryParams.get('orderId');

  if (status === 'success') {
    return (
      <div
        dir="rtl"
        className="mx-auto max-w-xl px-5 py-12 text-center"
      >
        <div className="border border-[#E8E4DC] bg-white p-8 sm:p-10 shadow-sm space-y-4">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#EBF3EC] text-[#2e7d32]">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#2e7d32]">
            پرداخت با موفقیت انجام شد
          </h2>
          <p className="text-sm text-[#4A4640] leading-7">
            سفارش شما در فیکس لایف ثبت گردید و در حال پردازش است.
          </p>
          <div className="border border-[#E8E4DC] bg-[#FAF7F2] p-4 space-y-2 text-sm text-[#1A1A1A]">
            <p>
              <strong>شماره سفارش:</strong>{' '}
              <span className="font-mono font-bold">{orderId || '—'}</span>
            </p>
            <p>
              <strong>کد پیگیری بانکی (Ref ID):</strong>{' '}
              <span className="font-mono font-bold text-[#2e7d32]">
                {refId || '—'}
              </span>
            </p>
          </div>
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
            <a
              href="/#/"
              onClick={() => onReturnHome?.()}
              className="inline-flex items-center gap-2 bg-[#1A1A1A] px-6 py-3 text-xs font-semibold text-white hover:bg-[#333333] transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>بازگشت به صفحه اصلی فروشگاه</span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      dir="rtl"
      className="mx-auto max-w-xl px-5 py-12 text-center"
    >
      <div className="border border-[#E8E4DC] bg-white p-8 sm:p-10 shadow-sm space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#FDECEA] text-[#d32f2f]">
          <XCircle className="h-8 w-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-[#d32f2f]">
          تراکنش ناموفق بود یا لغو شد
        </h2>
        <p className="text-sm text-[#4A4640] leading-7">
          اگر مبلغی از حساب شما کسر شده است، ظرف حداکثر ۷۲ ساعت آینده بازمیگردد.
        </p>
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <a
            href="/#/cart"
            onClick={() => onReturnToCart?.()}
            className="inline-flex items-center gap-2 bg-[#1A1A1A] px-6 py-3 text-xs font-semibold text-white hover:bg-[#333333] transition-colors"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>بازگشت به سبد خرید</span>
          </a>
          <a
            href="/#/"
            onClick={() => onReturnHome?.()}
            className="inline-flex items-center gap-2 border border-[#DCD5C9] bg-white px-5 py-3 text-xs font-semibold text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors"
          >
            <Home className="h-4 w-4" />
            <span>صفحه اصلی</span>
          </a>
        </div>
      </div>
    </div>
  );
}
