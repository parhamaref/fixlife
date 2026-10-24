/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Lock, RotateCcw, Leaf } from 'lucide-react';
import { ProductCategory, SkinConcernId } from '../types/ecommerce';
import { FIXLIFE_LOGO_URL } from '../data/catalogData';

interface FooterProps {
  onSelectCategory: (cat: ProductCategory) => void;
  onSelectBestSellers: () => void;
  onSelectConcern: (concern: SkinConcernId) => void;
  onOpenAbout: () => void;
  onOpenJournal: (index: number) => void;
  onOpenFaq: () => void;
  onOpenDashboard: () => void;
  onOpenGiftSet: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onSelectCategory,
  onSelectBestSellers,
  onSelectConcern,
  onOpenAbout,
  onOpenJournal,
  onOpenFaq,
  onOpenDashboard,
  onOpenGiftSet,
}) => {
  return (
    <footer
      dir="rtl"
      className="mt-auto border-t border-[#E8E4DC] bg-[#FDFBF7] pt-10 sm:pt-12 pb-8 text-[#1A1A1A]"
    >
      <div className="fixlife-container">
        <div className="grid grid-cols-2 gap-6 sm:gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-12 pb-10 border-b border-[#ECE7DF] text-right">
          {/* Col 1: Brand Wordmark, Tagline & Social Icons */}
          <div className="col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-3 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={FIXLIFE_LOGO_URL}
                alt="لوگوی فیکس لایف (FixLife)"
                className="h-11 w-auto object-contain"
              />
              <div>
                <span className="block font-editorial text-xl font-bold text-[#1A1A1A]">
                  فیکس لایف | FIXLIFE
                </span>
                <span className="block text-[10px] font-medium text-[#8C7048] mt-0.5">
                  فروشگاه تخصصی مراقبت از پوست · FIXLIFE.IR
                </span>
              </div>
            </div>
            <p className="text-xs leading-7 text-[#4A4640] max-w-xs text-justify">
              فیکس لایف (fixlife.ir) مرجع تخصصی محصولات ارگانیک، وگان و بالینی مراقبت از پوست با ارسال سریع و تضمین اصالت کالا به تمامی شهرهای ایران است.
            </p>
            <p className="text-xs text-[#4A4640]">
              ایمیل رسمی سایت:{' '}
              <a
                href="mailto:info@fixlife.ir"
                dir="ltr"
                className="font-mono font-bold text-[#8C7048] hover:text-[#1A1A1A] transition-colors"
              >
                info@fixlife.ir
              </a>
            </p>
            <div className="flex items-center gap-4 pt-2 text-[#1A1A1A]">
              <a
                href="#newsletter"
                aria-label="اینستاگرام فیکس لایف"
                className="hover:text-[#8C7048] transition-colors"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
              <a
                href="#newsletter"
                aria-label="فیسبوک فیکس لایف"
                className="hover:text-[#8C7048] transition-colors"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                </svg>
              </a>
              <a
                href="#newsletter"
                aria-label="پینترست فیکس لایف"
                className="hover:text-[#8C7048] transition-colors"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2a10 10 0 0 0-3.54 19.36c-.09-.8-.16-2.01.03-2.87.18-.78 1.17-4.97 1.17-4.97s-.3-.6-.3-1.48c0-1.39.81-2.43 1.81-2.43.86 0 1.27.64 1.27 1.41 0 .86-.55 2.14-.83 3.33-.24.99.5 1.8 1.48 1.8 1.78 0 3.14-1.87 3.14-4.58 0-2.39-1.72-4.06-4.18-4.06-2.84 0-4.51 2.13-4.51 4.34 0 .86.33 1.78.75 2.28.08.1.09.19.07.29-.08.31-.25 1-.28 1.14-.05.19-.15.23-.35.14-1.31-.61-2.13-2.52-2.13-4.06 0-3.31 2.41-6.35 6.94-6.35 3.64 0 6.47 2.6 6.47 6.07 0 3.62-2.28 6.53-5.45 6.53-1.06 0-2.07-.55-2.41-1.2l-.66 2.5c-.24.91-.88 2.06-1.31 2.76A10 10 0 1 0 12 2z" />
                </svg>
              </a>
              <a
                href="#newsletter"
                aria-label="تیک‌تاک فیکس لایف"
                className="hover:text-[#8C7048] transition-colors"
              >
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: SHOP */}
          <div className="lg:col-span-2 space-y-2.5">
            <h3 className="text-xs font-bold text-[#1A1A1A]">
              فروشگاه فیکس لایف
            </h3>
            <ul className="space-y-2 text-xs text-[#4A4640]">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('all')}
                  className="hover:text-[#1A1A1A] cursor-pointer"
                >
                  همه محصولات پوستی
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onSelectBestSellers}
                  className="hover:text-[#1A1A1A] cursor-pointer"
                >
                  پرفروش‌ترین‌ها
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('serums')}
                  className="hover:text-[#1A1A1A] cursor-pointer"
                >
                  سرم‌های درمانی جدید
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectCategory('sets')}
                  className="hover:text-[#1A1A1A] cursor-pointer"
                >
                  پکیج‌های مراقبت کامل
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenGiftSet}
                  className="hover:text-[#1A1A1A] cursor-pointer"
                >
                  ست هدیه اختصاصی
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: SKIN CONCERNS */}
          <div className="lg:col-span-2 space-y-2.5">
            <h3 className="text-xs font-bold text-[#1A1A1A]">
              نیازهای تخصصی پوست
            </h3>
            <ul className="space-y-2 text-xs text-[#4A4640]">
              <li>
                <button
                  type="button"
                  onClick={() => onSelectConcern('acne')}
                  className="hover:text-[#1A1A1A] cursor-pointer"
                >
                  ضد جوش و کنترل منافذ
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectConcern('dryness')}
                  className="hover:text-[#1A1A1A] cursor-pointer"
                >
                  آبرسانی و رفع خشکی
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectConcern('anti-aging')}
                  className="hover:text-[#1A1A1A] cursor-pointer"
                >
                  جوانسازی و ضد چروک
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectConcern('brightening')}
                  className="hover:text-[#1A1A1A] cursor-pointer"
                >
                  روشن‌کننده و ضد لک
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onSelectConcern('sensitive')}
                  className="hover:text-[#1A1A1A] cursor-pointer"
                >
                  مخصوص پوست حساس
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: ABOUT */}
          <div className="lg:col-span-1 space-y-2.5">
            <h3 className="text-xs font-bold text-[#1A1A1A]">
              درباره ما
            </h3>
            <ul className="space-y-2 text-xs text-[#4A4640]">
              <li>
                <button
                  type="button"
                  onClick={onOpenAbout}
                  className="hover:text-[#1A1A1A] cursor-pointer"
                >
                  داستان فیکس لایف
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenJournal(2)}
                  className="hover:text-[#1A1A1A] cursor-pointer"
                >
                  ترکیبات گیاهی ما
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenAbout}
                  className="hover:text-[#1A1A1A] cursor-pointer"
                >
                  مسئولیت زیست‌محیطی
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onOpenJournal(0)}
                  className="hover:text-[#1A1A1A] cursor-pointer"
                >
                  مجله علمی پوست
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenFaq}
                  className="hover:text-[#1A1A1A] cursor-pointer"
                >
                  تماس با ما
                </button>
              </li>
            </ul>
          </div>

          {/* Col 5: CUSTOMER CARE */}
          <div className="lg:col-span-2 space-y-2.5">
            <h3 className="text-xs font-bold text-[#1A1A1A]">
              خدمات مشتریان
            </h3>
            <ul className="space-y-2 text-xs text-[#4A4640]">
              <li>
                <button
                  type="button"
                  onClick={onOpenFaq}
                  className="hover:text-[#1A1A1A] cursor-pointer"
                >
                  پرسش‌های متداول
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenFaq}
                  className="hover:text-[#1A1A1A] cursor-pointer"
                >
                  شرایط ارسال به سراسر ایران
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenFaq}
                  className="hover:text-[#1A1A1A] cursor-pointer"
                >
                  ضمانت بازگشت ۳۰ روزه
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenDashboard}
                  className="hover:text-[#1A1A1A] cursor-pointer"
                >
                  پیگیری مرسوله پستی
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenFaq}
                  className="hover:text-[#1A1A1A] cursor-pointer"
                >
                  پشتیبانی آنلاین
                </button>
              </li>
            </ul>
          </div>

          {/* Col 6: Checkout Trust Stack */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-start gap-3">
              <Lock
                className="h-4 w-4 text-[#2C2926] shrink-0 mt-0.5"
                strokeWidth={1.5}
              />
              <div>
                <p className="text-xs font-bold text-[#1A1A1A]">
                  پرداخت امن شتاب
                </p>
                <p className="text-[10.5px] text-[#787269]">
                  درگاه رسمی شاپرک و زرین‌پال
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <RotateCcw
                className="h-4 w-4 text-[#2C2926] shrink-0 mt-0.5"
                strokeWidth={1.5}
              />
              <div>
                <p className="text-xs font-bold text-[#1A1A1A]">
                  ضمانت بازگشت وجه
                </p>
                <p className="text-[10.5px] text-[#787269]">
                  تا ۳۰ روز پس از تحویل در ایران
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Leaf
                className="h-4 w-4 text-[#2C2926] shrink-0 mt-0.5"
                strokeWidth={1.5}
              />
              <div>
                <p className="text-xs font-bold text-[#1A1A1A]">
                  اصالت و سلامت کالا
                </p>
                <p className="text-[10.5px] text-[#787269]">
                  دارای مجوز رسمی بهداشتی
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#787269]">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="border border-[#E2DBD1] bg-white px-2.5 py-1 text-[10px] font-bold text-[#1A3668]">
              شتاب (SHETAB)
            </span>
            <span className="border border-[#E2DBD1] bg-white px-2.5 py-1 text-[10px] font-bold text-[#1A1A1A]">
              شاپرک
            </span>
            <span className="border border-[#E2DBD1] bg-[#2E77BC] px-2.5 py-1 text-[10px] font-bold text-white">
              زرین‌پال
            </span>
            <span className="border border-[#E2DBD1] bg-white px-2.5 py-1 text-[10px] font-bold text-[#003087]">
              اسنپ‌پی
            </span>
            <a
              referrerPolicy="origin"
              target="_blank"
              href="https://trustseal.enamad.ir/?id=725194&Code=UAOrIqRgbHhqDIUh5eBvtzq22dSpuYiF"
              className="inline-flex items-center justify-center border border-[#E2DBD1] bg-white p-1.5 rounded-sm hover:border-[#C5A880] transition-colors"
              title="نماد اعتماد الکترونیکی فیکس لایف (eNamad)"
            >
              <img
                referrerPolicy="origin"
                src="https://trustseal.enamad.ir/logo.aspx?id=725194&Code=UAOrIqRgbHhqDIUh5eBvtzq22dSpuYiF"
                alt=""
                className="h-14 w-auto object-contain cursor-pointer"
                {...({
                  code: 'UAOrIqRgbHhqDIUh5eBvtzq22dSpuYiF',
                } as React.ImgHTMLAttributes<HTMLImageElement>)}
              />
            </a>
          </div>

          <p className="text-center">
            © ۱۴۰۵ کلیه حقوق این وب‌سایت متعلق به برند{' '}
            <strong className="text-[#1A1A1A]">فیکس لایف (fixlife.ir)</strong>{' '}
            می‌باشد.
          </p>
        </div>
      </div>

      {/* Google Tag Manager (noscript) */}
      <noscript
        dangerouslySetInnerHTML={{
          __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-T4V7HDLC" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
        }}
      />
    </footer>
  );
};
