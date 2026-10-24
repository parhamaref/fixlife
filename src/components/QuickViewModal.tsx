/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Star,
  Heart,
  Check,
  Sparkles,
  ShieldCheck,
  Leaf,
  Plus,
  Minus,
  ExternalLink,
  Copy,
  CheckCircle2,
  BookOpen,
  FlaskConical,
  HelpCircle,
  Code2,
  MessageCircle,
} from 'lucide-react';
import { CurrencyConfig, Product } from '../types/ecommerce';
import { SKIN_CONCERNS } from '../data/catalogData';
import { formatToman, toPersianDigits } from '../data/iranLocations';
import { buildProductWhatsAppConsultUrl } from '../services/api';

interface QuickViewModalProps {
  product: Product | null;
  currency: CurrencyConfig;
  isWishlisted: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, selectedSize: string, quantity: number) => void;
  onToggleWishlist: (productId: string) => void;
}

const CATEGORY_LABELS: Record<string, string> = {
  serums: 'سرم‌های تخصصی فیکس لایف',
  cleansers: 'شوینده‌های گیاهی',
  moisturizers: 'کرم‌ها و لوسیون‌های تخصصی',
  sunscreen: 'ضدآفتاب',
  sets: 'پکیج‌های مراقبتی',
};

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  isWishlisted,
  onClose,
  onAddToCart,
  onToggleWishlist,
}) => {
  const [selectedSize, setSelectedSize] = useState<string>(
    product?.defaultSize || ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImage, setActiveImage] = useState<string>(product?.image || '');
  const [activeTab, setActiveTab] = useState<
    'overview' | 'ingredients' | 'ritual' | 'faqs_reviews' | 'seo'
  >('overview');
  const [copiedSeo, setCopiedSeo] = useState(false);

  React.useEffect(() => {
    if (product) {
      setSelectedSize(product.defaultSize);
      setQuantity(1);
      setActiveImage(product.image);
      setActiveTab('overview');
      setCopiedSeo(false);
    }
  }, [product]);

  if (!product) return null;

  const sizeOption =
    product.sizes.find((s) => s.size === selectedSize) || product.sizes[0];
  const unitPriceToman = Math.round(
    product.priceUSD * (sizeOption?.priceMultiplier || 1)
  );

  const formatPrice = (toman: number) => formatToman(toman);

  const concernLabels = product.concerns
    .map((cId) => SKIN_CONCERNS.find((c) => c.id === cId)?.title)
    .filter(Boolean);

  const galleryImages =
    product.gallery && product.gallery.length > 0
      ? product.gallery
      : [product.image];

  const handleCopyJsonLd = async () => {
    if (!product.seoMeta) return;
    try {
      await navigator.clipboard.writeText(
        JSON.stringify(product.seoMeta, null, 2)
      );
      setCopiedSeo(true);
      setTimeout(() => setCopiedSeo(false), 3000);
    } catch {
      // ignore
    }
  };

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-end lg:items-center justify-center bg-black/55 p-0 sm:p-3 lg:p-6 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label={product.name}
    >
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 grid max-h-[92dvh] w-full max-w-5xl 2xl:max-w-6xl grid-cols-1 overflow-y-auto rounded-t-3xl sm:rounded-2xl lg:rounded-none bg-[#FDFBF7] border border-[#E8E4DC] shadow-2xl lg:grid-cols-12">
        {/* Mobile/Tablet App Sheet Drag Handle */}
        <div className="sticky top-0 z-30 flex items-center justify-between bg-[#FDFBF7]/95 backdrop-blur-md px-4 py-2.5 border-b border-[#E8E4DC] lg:hidden">
          <div className="w-8" />
          <div className="h-1.5 w-12 rounded-full bg-[#D5CFC4]" />
          <button
            onClick={onClose}
            className="rounded-full bg-[#EFECE6] p-1.5 text-[#1A1A1A] cursor-pointer"
            aria-label="بستن پنجره محصول"
          >
            <X className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>

        <button
          onClick={onClose}
          className="hidden lg:flex absolute left-4 top-4 z-20 bg-[#FDFBF7]/90 p-2 text-[#1A1A1A] hover:bg-[#EFECE6] transition-colors cursor-pointer"
          aria-label="بستن پنجره محصول"
        >
          <X className="h-5 w-5" strokeWidth={1.5} />
        </button>

        {/* Right Sticky Studio Gallery (in RTL first column) */}
        <div className="flex flex-col justify-between bg-[#F4EFEA] p-5 sm:p-7 lg:p-8 lg:col-span-5 border-b lg:border-b-0 lg:border-l border-[#E8E4DC]">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-medium text-[#787269]">
              <div>
                <span>{CATEGORY_LABELS[product.category] || product.category}</span>
                {product.tag && (
                  <>
                    <span className="mx-1.5" aria-hidden="true">
                      ·
                    </span>
                    <span className="text-[#8C7048] font-semibold">
                      {product.tag}
                    </span>
                  </>
                )}
              </div>
              <span className="bg-[#E8E1D5] px-2 py-0.5 text-[10px] font-mono text-[#1A1A1A]">
                ID: {product.id}
              </span>
            </div>

            {product.permalink && (
              <a
                href={product.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#8C7048] hover:text-[#1A1A1A] transition-colors"
              >
                <ExternalLink className="h-3 w-3" />
                <span>مشاهده لینک اصلی در fixlife.ir</span>
              </a>
            )}
          </div>

          <div className="my-4 sm:my-5 flex flex-col items-center justify-center">
            <div className="flex h-52 sm:h-64 lg:h-72 2xl:h-80 w-full items-center justify-center rounded-xl lg:rounded-none bg-[#FDFBF7]/60 p-4 border border-[#E6DFD5]">
              <img
                src={activeImage || product.image}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="max-h-full w-auto object-contain transition-transform duration-300 hover:scale-105"
              />
            </div>

            {galleryImages.length > 1 && (
              <div className="mt-3 flex items-center justify-center gap-2.5">
                {galleryImages.map((imgUrl, idx) => (
                  <button
                    key={imgUrl}
                    type="button"
                    onClick={() => setActiveImage(imgUrl)}
                    className={`h-13 w-13 sm:h-14 sm:w-14 rounded-lg lg:rounded-none overflow-hidden border p-1 bg-white transition-all cursor-pointer ${
                      activeImage === imgUrl
                        ? 'border-[#1A1A1A] ring-1 ring-[#1A1A1A]'
                        : 'border-[#DCD5C9] opacity-70 hover:opacity-100'
                    }`}
                    aria-label={`تصویر ${toPersianDigits(idx + 1)} از ${product.name}`}
                  >
                    <img
                      src={imgUrl}
                      alt=""
                      className="h-full w-full object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 border-t border-[#E2DBD1] pt-3.5 text-center text-[10.5px] sm:text-[11px] font-medium text-[#4A4640]">
            <div className="flex flex-col items-center gap-1">
              <Leaf className="h-3.5 w-3.5 text-[#8C7048]" strokeWidth={1.5} />
              <span>فرمولاسیون تخصصی</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <ShieldCheck
                className="h-3.5 w-3.5 text-[#8C7048]"
                strokeWidth={1.5}
              />
              <span>ضمانت اصالت فیکس لایف</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <Sparkles
                className="h-3.5 w-3.5 text-[#8C7048]"
                strokeWidth={1.5}
              />
              <span>فاقد پارابن و مضرات</span>
            </div>
          </div>
        </div>

        {/* Left Contiguous Purchase & Clinical Data Module */}
        <div className="flex flex-col justify-between p-5 sm:p-7 lg:p-8 lg:col-span-7 text-right">
          <div>
            {/* Rating & SKU */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[#787269] mb-2">
              <div className="flex items-center gap-1.5">
                <div className="flex text-[#1A1A1A]">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className="h-3.5 w-3.5 fill-[#1A1A1A] text-[#1A1A1A]"
                    />
                  ))}
                </div>
                <span className="tabular-nums font-bold text-[#1A1A1A]">
                  {toPersianDigits(product.rating.toFixed(1))}
                </span>
                <span className="tabular-nums">
                  ({toPersianDigits(product.reviewCount)} دیدگاه ثبت‌شده)
                </span>
              </div>
              <span className="text-[11px] font-mono">
                کد کالا: {product.sku}
              </span>
            </div>

            {/* Title & English Name */}
            <h2 className="font-editorial text-lg sm:text-2xl font-bold text-[#1A1A1A]">
              {product.name}
            </h2>
            {product.englishName && (
              <p
                dir="ltr"
                className="mt-0.5 text-[11px] font-mono text-[#8C7048] text-right"
              >
                {product.englishName}
              </p>
            )}
            <p className="mt-1.5 text-xs text-[#5A554E] text-justify leading-6">
              {product.subtitle}
            </p>

            {/* Price */}
            <div className="mt-3.5 flex flex-wrap items-baseline gap-3">
              <span className="text-lg sm:text-xl font-bold tabular-nums text-[#1A1A1A]">
                {formatPrice(unitPriceToman)}
              </span>
              {product.compareAtPriceUSD && (
                <span className="text-xs sm:text-sm text-[#787269] line-through tabular-nums">
                  {formatPrice(
                    Math.round(
                      product.compareAtPriceUSD *
                        (sizeOption?.priceMultiplier || 1)
                    )
                  )}
                </span>
              )}
              <span className="text-[11px] font-semibold text-[#8C7048]">
                موجود در انبار فیکس لایف · ارسال به سراسر ایران
              </span>
            </div>

            {/* Skin Concerns Metadata */}
            <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-xs text-[#4A4640]">
              <span className="text-[#787269]">کاربرد تخصصی:</span>
              {concernLabels.map((label, idx) => (
                <React.Fragment key={label}>
                  {idx > 0 && <span aria-hidden="true">·</span>}
                  <span className="font-semibold text-[#1A1A1A]">{label}</span>
                </React.Fragment>
              ))}
            </div>

            {/* Size & Quantity + Add to Bag CTA */}
            <div className="mt-4 flex flex-wrap items-center gap-2.5 sm:gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-[#4A4640]">
                  حجم:
                </span>
                {product.sizes.map((opt) => (
                  <button
                    key={opt.size}
                    type="button"
                    onClick={() => setSelectedSize(opt.size)}
                    className={`rounded-lg lg:rounded-none px-3 py-2 text-xs transition-colors cursor-pointer border ${
                      selectedSize === opt.size
                        ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white font-semibold'
                        : 'border-[#DCD5C9] bg-white text-[#1A1A1A] hover:border-[#1A1A1A]'
                    }`}
                  >
                    {opt.size}
                  </button>
                ))}
              </div>

              <div className="flex items-center rounded-lg lg:rounded-none border border-[#DCD5C9] bg-white">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-2.5 py-2 text-[#4A4640] hover:text-[#1A1A1A] cursor-pointer"
                  aria-label="افزایش تعداد"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
                <span className="w-7 text-center text-xs font-bold tabular-nums">
                  {toPersianDigits(quantity)}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-2.5 py-2 text-[#4A4640] hover:text-[#1A1A1A] cursor-pointer"
                  aria-label="کاهش تعداد"
                >
                  <Minus className="h-3.5 w-3.5" />
                </button>
              </div>

              <button
                type="button"
                onClick={() => {
                  onAddToCart(product, selectedSize, quantity);
                  onClose();
                }}
                className="flex-1 min-w-[170px] rounded-xl lg:rounded-none bg-[#1A1A1A] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#333333] active:scale-[0.99] transition-all cursor-pointer"
              >
                افزودن به سبد خرید — {formatPrice(unitPriceToman * quantity)}
              </button>

              <button
                type="button"
                onClick={() => onToggleWishlist(product.id)}
                className={`flex items-center justify-center rounded-xl lg:rounded-none border p-2.5 transition-colors cursor-pointer ${
                  isWishlisted
                    ? 'border-[#1A1A1A] bg-[#EFECE6] text-[#1A1A1A]'
                    : 'border-[#DCD5C9] bg-white text-[#4A4640] hover:border-[#1A1A1A]'
                }`}
                aria-label="افزودن به علاقه‌مندی‌ها"
              >
                <Heart
                  className={`h-4 w-4 ${isWishlisted ? 'fill-[#1A1A1A]' : ''}`}
                  strokeWidth={1.5}
                />
              </button>

              <a
                href={buildProductWhatsAppConsultUrl(product, selectedSize)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl lg:rounded-none border border-[#25D366]/60 bg-[#25D366]/10 hover:bg-[#25D366] text-[#075E54] hover:text-white px-4 py-2.5 text-xs font-bold transition-colors"
                title={`مشاوره تخصصی واتساپ درباره ${product.name}`}
              >
                <MessageCircle className="h-4 w-4 shrink-0" />
                <span>مشاوره واتساپ درباره این محصول</span>
              </a>
            </div>

            {/* 5 Rich Navigation Tabs (Swipeable on Mobile/Tablet) */}
            <div className="mt-5 border-b border-[#E8E4DC] flex overflow-x-auto no-scrollbar gap-4 sm:gap-5 text-xs">
              {(
                [
                  {
                    id: 'overview',
                    label: 'معرفی و مشخصات فنی',
                    icon: BookOpen,
                  },
                  {
                    id: 'ingredients',
                    label: 'ترکیبات و مکانیسم علمی',
                    icon: FlaskConical,
                  },
                  {
                    id: 'ritual',
                    label: 'پروتکل مصرف گام‌به‌گام',
                    icon: Sparkles,
                  },
                  {
                    id: 'faqs_reviews',
                    label: 'سوالات متداول و نظرات',
                    icon: HelpCircle,
                  },
                  {
                    id: 'seo',
                    label: 'اطلاعات سئو و اسکیما',
                    icon: Code2,
                  },
                ] as const
              ).map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 pb-2.5 transition-colors cursor-pointer whitespace-nowrap shrink-0 ${
                      activeTab === tab.id
                        ? 'border-b-2 border-[#1A1A1A] font-bold text-[#1A1A1A]'
                        : 'text-[#787269] hover:text-[#1A1A1A]'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="mt-4 text-xs leading-relaxed text-[#4A4640] max-h-[340px] 2xl:max-h-[420px] overflow-y-auto pl-1">
              {/* TAB 1: OVERVIEW & TECHNICAL SPECS */}
              {activeTab === 'overview' && (
                <div className="space-y-4">
                  <p className="text-justify leading-7 text-[#2C2926]">
                    {product.description}
                  </p>

                  <div className="space-y-1.5 bg-[#FAF7F2] border border-[#E8E4DC] p-3.5">
                    <span className="block text-xs font-bold text-[#1A1A1A] mb-1">
                      آمار و نتایج بالینی اثبات‌شده در فیکس لایف:
                    </span>
                    {product.clinicalResults.map((res) => (
                      <div key={res} className="flex items-start gap-2">
                        <Check className="h-3.5 w-3.5 text-[#8C7048] shrink-0 mt-1" />
                        <span className="text-justify">{res}</span>
                      </div>
                    ))}
                  </div>

                  {product.technicalSpecs && product.technicalSpecs.length > 0 && (
                    <div>
                      <span className="block text-xs font-bold text-[#1A1A1A] mb-2">
                        جدول مشخصات تخصصی محصول:
                      </span>
                      <div className="overflow-x-auto border border-[#E8E4DC]">
                        <table className="w-full text-right text-[11px]">
                          <thead className="bg-[#EFECE6] text-[#1A1A1A]">
                            <tr>
                              <th className="p-2 border-l border-[#E8E4DC]">
                                ویژگی
                              </th>
                              <th className="p-2 border-l border-[#E8E4DC]">
                                مشخصات
                              </th>
                              <th className="p-2">مزیت و کارایی بالینی</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#E8E4DC] bg-white">
                            {product.technicalSpecs.map((row) => (
                              <tr key={row.label}>
                                <td className="p-2 font-bold text-[#1A1A1A] border-l border-[#E8E4DC] whitespace-nowrap">
                                  {row.label}
                                </td>
                                <td className="p-2 text-[#33302C] border-l border-[#E8E4DC]">
                                  {row.spec}
                                </td>
                                <td className="p-2 text-[#5A554E]">
                                  {row.benefit}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ACTIVE INGREDIENTS & SCIENTIFIC MECHANISM */}
              {activeTab === 'ingredients' && (
                <div className="space-y-4">
                  <div className="space-y-2.5">
                    {product.keyIngredients.map((ing) => (
                      <div
                        key={ing.name}
                        className="border border-[#E8E4DC] bg-[#FAF7F2] p-3 text-justify"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                          <span className="font-bold text-[#1A1A1A]">
                            {ing.name}
                          </span>
                          {ing.englishName && (
                            <span
                              dir="ltr"
                              className="text-[10.5px] font-mono text-[#8C7048]"
                            >
                              {ing.englishName}
                            </span>
                          )}
                        </div>
                        <p className="text-[11.5px] leading-6 text-[#4A4640]">
                          {ing.benefit}
                        </p>
                      </div>
                    ))}
                  </div>

                  {product.scientificReferences &&
                    product.scientificReferences.length > 0 && (
                      <div className="border border-[#DCD5C9] bg-[#F4EFEA] p-3">
                        <span className="block text-[11px] font-bold text-[#1A1A1A] mb-1.5">
                          منابع و ژورنال‌های علمی پشتیبان فرمولاسیون (E-E-A-T):
                        </span>
                        <ul
                          dir="ltr"
                          className="list-disc pl-4 space-y-1 text-[10.5px] font-mono text-[#4A4640] text-left"
                        >
                          {product.scientificReferences.map((ref) => (
                            <li key={ref}>{ref}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                  <div className="border-t border-[#E8E4DC] pt-2.5">
                    <span className="block text-[11px] font-bold text-[#787269] mb-1">
                      فهرست کامل ترکیبات (INCI):
                    </span>
                    <p
                      dir="ltr"
                      className="text-[11px] text-[#787269] leading-relaxed text-left font-mono"
                    >
                      {product.fullInci}
                    </p>
                  </div>
                </div>
              )}

              {/* TAB 3: STEP-BY-STEP CLINICAL PROTOCOL */}
              {activeTab === 'ritual' && (
                <div className="space-y-3.5">
                  <div className="bg-[#EFECE6] border border-[#DFD7CA] p-3 text-justify">
                    <span className="block font-bold text-[#1A1A1A] mb-1">
                      خلاصه دستور مصرف تخصصی فیکس لایف:
                    </span>
                    <p className="leading-6 text-[#2C2926]">
                      {product.howToUse}
                    </p>
                  </div>

                  {product.protocolSteps && product.protocolSteps.length > 0 && (
                    <div className="space-y-2.5">
                      {product.protocolSteps.map((step) => (
                        <div
                          key={step.stepNumber}
                          className="border border-[#E8E4DC] bg-white p-3.5 text-justify"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="bg-[#1A1A1A] text-white px-2 py-0.5 text-[10px] font-bold">
                              {step.stepNumber}
                            </span>
                            <span className="font-bold text-[#1A1A1A]">
                              {step.title}
                            </span>
                          </div>
                          <p className="text-[11.5px] leading-6 text-[#4A4640]">
                            {step.instruction}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: FAQs & VERIFIED REVIEWS */}
              {activeTab === 'faqs_reviews' && (
                <div className="space-y-4">
                  {product.faqs && product.faqs.length > 0 && (
                    <div className="space-y-2.5">
                      <span className="block font-bold text-[#1A1A1A]">
                        سوالات متداول علمی درباره {product.name}:
                      </span>
                      {product.faqs.map((faq) => (
                        <div
                          key={faq.question}
                          className="border border-[#E8E4DC] bg-[#FAF7F2] p-3 text-justify"
                        >
                          <p className="font-bold text-[#1A1A1A]">
                            ؟ {faq.question}
                          </p>
                          <p className="mt-1 text-[11.5px] leading-6 text-[#4A4640]">
                            {faq.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="border-t border-[#E8E4DC] pt-3 space-y-2.5">
                    <span className="block font-bold text-[#1A1A1A]">
                      دیدگاه خریداران تاییدشده ({toPersianDigits(product.reviewCount)} نظر):
                    </span>
                    {product.reviews.map((rev) => (
                      <div
                        key={rev.id}
                        className="border border-[#E8E4DC] bg-white p-3"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-[#1A1A1A]">
                            {rev.title}
                          </span>
                          <span className="text-[11px] text-[#787269]">
                            {rev.date}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-[#4A4640] text-justify leading-6">
                          {rev.comment}
                        </p>
                        <div className="mt-1.5 text-[11px] text-[#8C7048] font-medium">
                          <span>{rev.author}</span>
                          <span aria-hidden="true"> · </span>
                          <span>خریدار تاییدشده ({rev.skinType})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: SEO & SCHEMA.ORG JSON-LD METADATA */}
              {activeTab === 'seo' && product.seoMeta && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-[#EFECE6] border border-[#DCD5C9] px-3 py-2">
                    <span className="font-bold text-[#1A1A1A]">
                      اطلاعات سئو و اسکیما استخراج‌شده از fixlife.ir
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyJsonLd}
                      className="inline-flex items-center gap-1.5 bg-[#1A1A1A] text-white px-3 py-1 text-[11px] font-semibold hover:bg-[#333333] cursor-pointer"
                    >
                      {copiedSeo ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5 text-[#C5A880]" />
                          <span>کپی شد!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3.5 w-3.5 text-[#C5A880]" />
                          <span>کپی JSON سئو محصول</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="space-y-2 border border-[#E8E4DC] bg-[#FAF7F2] p-3 text-[11.5px]">
                    <div>
                      <span className="font-bold text-[#1A1A1A]">
                        عنوان سئو (Meta Title):{' '}
                      </span>
                      <span>{product.seoMeta.title}</span>
                    </div>
                    <div>
                      <span className="font-bold text-[#1A1A1A]">
                        توضیحات متا (Meta Description):{' '}
                      </span>
                      <span className="text-justify">
                        {product.seoMeta.description}
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-[#1A1A1A]">
                        آدرس کانونیکال (Canonical URL):{' '}
                      </span>
                      <a
                        href={product.seoMeta.canonicalUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        dir="ltr"
                        className="font-mono text-[#8C7048] underline break-all"
                      >
                        {product.seoMeta.canonicalUrl}
                      </a>
                    </div>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      <span className="font-bold text-[#1A1A1A]">
                        کلمات کلیدی هدف:
                      </span>
                      {product.seoMeta.keywords.map((kw) => (
                        <span
                          key={kw}
                          className="bg-white border border-[#DCD5C9] px-2 py-0.5 text-[10.5px]"
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="block text-[11px] font-bold text-[#1A1A1A] mb-1">
                      ساختار کامل Schema.org Product JSON-LD:
                    </span>
                    <pre
                      dir="ltr"
                      className="overflow-x-auto bg-[#1E1C1A] text-[#F5F1EC] p-3 text-[10.5px] font-mono leading-relaxed text-left"
                    >
                      {JSON.stringify(product.seoMeta.schemaJsonLd, null, 2)}
                    </pre>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
