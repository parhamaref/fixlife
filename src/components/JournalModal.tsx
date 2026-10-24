/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Clock, Check, ArrowLeft, HelpCircle } from 'lucide-react';
import {
  CurrencyConfig,
  JournalArticle,
  Product,
} from '../types/ecommerce';
import { FAQ_ITEMS } from '../data/catalogData';
import { formatToman } from '../data/iranLocations';

interface JournalModalProps {
  article: JournalArticle | null;
  relatedProducts: Product[];
  currency: CurrencyConfig;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const JournalModal: React.FC<JournalModalProps> = ({
  article,
  relatedProducts,
  onClose,
  onSelectProduct,
}) => {
  if (!article) return null;

  const formatPrice = (toman: number) => formatToman(toman);

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label={article.title}
    >
      <div className="fixed inset-0" onClick={onClose} />

      <article className="relative z-10 max-h-[90vh] w-full max-w-3xl overflow-y-auto bg-[#FDFBF7] border border-[#E8E4DC] shadow-2xl text-right">
        <button
          onClick={onClose}
          className="sticky top-4 float-left ml-4 mt-4 z-20 bg-[#FDFBF7]/90 p-2 text-[#1A1A1A] hover:bg-[#EFECE6] cursor-pointer"
          aria-label="بستن مقاله"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="h-64 w-full overflow-hidden bg-[#EFECE6]">
          <img
            src={article.image}
            alt={article.title}
            referrerPolicy="no-referrer"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="p-6 sm:p-10 space-y-6">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-[#8C7048]">
            <span>{article.category}</span>
            <span aria-hidden="true">·</span>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {article.readTime}
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-[#787269]">{article.publishedAt}</span>
          </div>

          <h2 className="font-editorial text-2xl sm:text-3xl font-bold leading-snug text-[#1A1A1A]">
            {article.title}
          </h2>

          <div className="border-y border-[#E8E4DC] py-3 text-xs text-[#787269]">
            نویسنده:{' '}
            <strong className="text-[#1A1A1A]">{article.author.name}</strong> —{' '}
            {article.author.role}
          </div>

          <div className="space-y-4 text-sm leading-8 text-[#33302C]">
            {article.content.map((para, idx) => (
              <p key={idx} className="text-justify">
                {para}
              </p>
            ))}
          </div>

          <div className="bg-[#FAF7F2] border border-[#E8E4DC] p-5 space-y-2.5">
            <h3 className="text-xs font-bold text-[#1A1A1A]">
              نکات کلیدی متخصصین پوست فیکس لایف:
            </h3>
            {article.keyTakeaways.map((point) => (
              <div
                key={point}
                className="flex items-start gap-2 text-xs text-[#4A4640]"
              >
                <Check className="h-4 w-4 text-[#8C7048] shrink-0 mt-0.5" />
                <span className="text-justify">{point}</span>
              </div>
            ))}
          </div>

          {relatedProducts.length > 0 && (
            <div className="pt-4 border-t border-[#E8E4DC]">
              <h4 className="font-editorial text-xl font-bold mb-4">
                محصولات مرتبط معرفی‌شده در این مقاله
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {relatedProducts.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      onClose();
                      onSelectProduct(prod);
                    }}
                    className="flex items-center gap-4 border border-[#E8E4DC] bg-white p-3 hover:border-[#1A1A1A] transition-colors cursor-pointer"
                  >
                    <img
                      src={prod.image}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="h-16 w-16 object-cover bg-[#F4EFEA]"
                    />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-[#1A1A1A]">
                        {prod.name}
                      </p>
                      <p className="text-xs text-[#787269] tabular-nums mt-0.5">
                        {formatPrice(prod.priceUSD)}
                      </p>
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#8C7048] mt-1">
                        <span>مشاهده و خرید محصول</span>
                        <ArrowLeft className="h-3 w-3" />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApiDocs: () => void;
}

export const FaqModal: React.FC<FaqModalProps> = ({
  isOpen,
  onClose,
  onOpenApiDocs,
}) => {
  if (!isOpen) return null;

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="پشتیبانی و پرسش‌های متداول فیکس لایف"
    >
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 max-h-[88vh] w-full max-w-2xl overflow-y-auto bg-[#FDFBF7] border border-[#E8E4DC] p-6 sm:p-8 shadow-2xl text-right">
        <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-4 mb-6">
          <div className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-[#8C7048]" />
            <h2 className="font-editorial text-xl sm:text-2xl font-bold">
              مرکز پشتیبانی و پرسش‌های متداول فیکس لایف
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#4A4640] hover:text-[#1A1A1A] cursor-pointer"
            aria-label="بستن پنجره سوالات متداول"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 divide-y divide-[#E8E4DC]">
          {FAQ_ITEMS.map((item) => (
            <div key={item.question} className="pt-4 first:pt-0">
              <h3 className="text-sm font-bold text-[#1A1A1A]">
                {item.question}
              </h3>
              <p className="mt-1.5 text-xs leading-7 text-[#4A4640] text-justify">
                {item.answer}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-[#E8E4DC] bg-[#FAF7F2] p-4 text-xs">
          <div>
            <p className="font-bold text-[#1A1A1A]">
              مشاوره تخصصی پوست و پشتیبانی ۲۴ ساعته فیکس لایف
            </p>
            <p className="text-[#787269] mt-0.5">
              info@fixlife.ir · تلفن دفتر مرکزی تهران: ۰۲۱-۸۸۷۷۶۶۵۵ · وب‌سایت رسمی: fixlife.ir
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              onClose();
              onOpenApiDocs();
            }}
            className="border border-[#1A1A1A] px-4 py-2 text-xs font-semibold hover:bg-[#1A1A1A] hover:text-white transition-colors cursor-pointer"
          >
            مشاهده مستندات فنی API
          </button>
        </div>
      </div>
    </div>
  );
};
