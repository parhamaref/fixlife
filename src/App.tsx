/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Search,
  User,
  ShoppingBag,
  Heart,
  ChevronDown,
  Truck,
  Leaf,
  FlaskConical,
  Headphones,
  Star,
  ArrowLeft,
  Mail,
  CheckCircle2,
  X,
  Menu,
  Sparkles,
  MapPin,
  MessageCircle,
  Home,
  LayoutGrid,
} from 'lucide-react';
import {
  CURRENCIES,
  FIXLIFE_LOGO_URL,
  FREE_SHIPPING_THRESHOLD_USD,
  INITIAL_DEMO_CUSTOMER,
  INITIAL_DEMO_ORDERS,
  JOURNAL_ARTICLES,
  PRIMARY_REFERENCE_ASSET,
  PRODUCTS,
  SKIN_CONCERNS,
} from './data/catalogData';
import { formatToman, toPersianDigits } from './data/iranLocations';
import {
  CartItem,
  CreateOrderRequestPayload,
  CurrencyCode,
  CustomerAddress,
  CustomerUser,
  JournalArticle,
  OrderRecord,
  OrderStatus,
  Product,
  ProductCategory,
  SkinConcernId,
} from './types/ecommerce';
import {
  buildProductWhatsAppConsultUrl,
  buildWhatsAppSupportUrl,
  createOrderApi,
  fetchCustomerOrdersApi,
  fetchProductsApi,
  getStoredProducts,
  loginCustomerApi,
  registerCustomerApi,
  subscribeNewsletterApi,
  updateCustomerAddressApi,
  updateOrderStatusApi,
  validatePromoCodeApi,
} from './services/api';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { CheckoutModal } from './components/CheckoutModal';
import {
  CustomerDashboardModal,
  DashboardTabId,
} from './components/CustomerDashboardModal';
import { FaqModal, JournalModal } from './components/JournalModal';
import { Footer } from './components/Footer';
import { ScrollVideoHero } from './components/ScrollVideoHero';
import CheckoutResult from './components/CheckoutResult';

const CATEGORY_TITLES_FA: Record<ProductCategory, string> = {
  all: 'همه محصولات فیکس لایف',
  serums: 'مجموعه سرم‌های تخصصی',
  cleansers: 'مجموعه شوینده‌های گیاهی',
  moisturizers: 'مجموعه کرم‌ها و مرطوب‌کننده‌ها',
  sunscreen: 'مجموعه ضدآفتاب‌های محافظتی',
  sets: 'پکیج‌های مراقبت کامل پوست',
};

export default function App() {
  const [currencyCode] = useState<CurrencyCode>('TMN');

  const [products, setProducts] = useState<Product[]>(() =>
    getStoredProducts()
  );
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory>('all');
  const [selectedConcern, setSelectedConcern] = useState<SkinConcernId | null>(
    null
  );
  const [showAllProducts, setShowAllProducts] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showWishlistOnly, setShowWishlistOnly] = useState(false);

  const [activeNavDropdown, setActiveNavDropdown] = useState<
    'shop' | 'concerns' | null
  >(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('fixlife_cart_v3');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      {
        productId: '4370',
        sku: 'GIORA-RETINOL-30ML',
        name: 'سرم رتینول تخصصی و ضد چروک جیورا (Giora)',
        image: '/assets/fixlife/product-4370-1.png',
        selectedSize: '۳۰ میلی‌لیتر',
        unitPriceUSD: 999000,
        quantity: 1,
      },
    ];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fixlife_wishlist_v3');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return ['4370'];
  });

  const [promoCode, setPromoCode] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);
  const [promoMessage, setPromoMessage] = useState<string | null>(null);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);
  const [dashboardInitialTab, setDashboardInitialTab] =
    useState<DashboardTabId>('orders');
  const [activeArticle, setActiveArticle] = useState<JournalArticle | null>(
    null
  );
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isCheckoutResultRoute, setIsCheckoutResultRoute] = useState<boolean>(
    () =>
      window.location.hash.startsWith('#/checkout/result') ||
      window.location.pathname.startsWith('/checkout/result')
  );

  const [customer, setCustomer] = useState<CustomerUser | null>(
    INITIAL_DEMO_CUSTOMER
  );
  const [orders, setOrders] = useState<OrderRecord[]>(INITIAL_DEMO_ORDERS);

  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const [toast, setToast] = useState<string | null>(null);
  const toastTimeoutRef = useRef<number | null>(null);

  const catalogSectionRef = useRef<HTMLElement | null>(null);
  const concernsSectionRef = useRef<HTMLElement | null>(null);
  const journalSectionRef = useRef<HTMLElement | null>(null);

  const currency = CURRENCIES[currencyCode];

  const showToast = (msg: string) => {
    setToast(msg);
    if (toastTimeoutRef.current) {
      window.clearTimeout(toastTimeoutRef.current);
    }
    toastTimeoutRef.current = window.setTimeout(() => {
      setToast(null);
    }, 3800);
  };

  useEffect(() => {
    try {
      localStorage.setItem('fixlife_cart_v3', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('fixlife_wishlist_v3', JSON.stringify(wishlist));
    } catch {
      // ignore
    }
  }, [wishlist]);

  useEffect(() => {
    fetchProductsApi().then((data) => {
      if (data.length > 0) setProducts(data);
    });
    fetchCustomerOrdersApi().then((data) => {
      if (data.length > 0) setOrders(data);
    });
  }, []);

  useEffect(() => {
    const syncRouteFromLocation = () => {
      const hash = window.location.hash;
      const pathname = window.location.pathname;
      const isResult =
        hash.startsWith('#/checkout/result') ||
        pathname.startsWith('/checkout/result');
      setIsCheckoutResultRoute(isResult);

      if (isResult) {
        const queryParams = new URLSearchParams(
          hash.split('?')[1] || window.location.search
        );
        if (queryParams.get('status') === 'success') {
          setCart([]);
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash.startsWith('#/cart')) {
        setIsCartOpen(true);
      }
    };

    syncRouteFromLocation();
    window.addEventListener('hashchange', syncRouteFromLocation);
    window.addEventListener('popstate', syncRouteFromLocation);
    return () => {
      window.removeEventListener('hashchange', syncRouteFromLocation);
      window.removeEventListener('popstate', syncRouteFromLocation);
    };
  }, []);

  const formatPrice = (toman: number) => formatToman(toman);

  const displayedProducts = useMemo(() => {
    let list = [...products];

    if (showWishlistOnly) {
      return list.filter((p) => wishlist.includes(p.id));
    }

    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (selectedConcern) {
      list = list.filter((p) => p.concerns.includes(selectedConcern));
    }

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.subtitle.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.fullInci.toLowerCase().includes(q)
      );
    }

    const isDefaultView =
      selectedCategory === 'all' &&
      !selectedConcern &&
      searchQuery.trim() === '' &&
      !showAllProducts;

    if (isDefaultView) {
      return list.filter((p) => p.isBestSeller).slice(0, 4);
    }

    return list;
  }, [
    products,
    selectedCategory,
    selectedConcern,
    searchQuery,
    showAllProducts,
    showWishlistOnly,
    wishlist,
  ]);

  const handleAddToCart = (
    product: Product,
    selectedSize = product.defaultSize,
    quantity = 1
  ) => {
    const sizeOption =
      product.sizes.find((s) => s.size === selectedSize) || product.sizes[0];
    const unitPriceToman = Math.round(
      product.priceUSD * (sizeOption?.priceMultiplier || 1)
    );

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.productId === product.id && item.selectedSize === selectedSize
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }
      return [
        ...prev,
        {
          productId: product.id,
          sku: product.sku,
          name: product.name,
          image: product.image,
          selectedSize,
          unitPriceUSD: unitPriceToman,
          quantity,
        },
      ];
    });

    showToast(`«${product.name}» (${selectedSize}) به سبد خرید اضافه شد.`);
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (
    productId: string,
    size: string,
    delta: number
  ) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.productId === productId && item.selectedSize === size
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (productId: string, size: string) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.productId === productId && item.selectedSize === size)
      )
    );
  };

  const handleApplyPromoCode = async (code: string) => {
    setIsApplyingPromo(true);
    try {
      const subtotalToman = cart.reduce(
        (sum, item) => sum + item.unitPriceUSD * item.quantity,
        0
      );
      const res = await validatePromoCodeApi(code, subtotalToman);
      if (res.valid) {
        setPromoCode(res.code);
        setDiscountPercent(res.discountPercent);
        setPromoMessage(res.message);
        showToast(res.message);
      } else {
        setPromoMessage(res.message);
      }
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const handleRemovePromoCode = () => {
    setPromoCode(null);
    setDiscountPercent(0);
    setPromoMessage(null);
  };

  const handleToggleWishlist = (productId: string) => {
    const prod = products.find((p) => p.id === productId);
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        if (prod) showToast(`«${prod.name}» از فهرست علاقه‌مندی‌ها حذف شد.`);
        return prev.filter((id) => id !== productId);
      } else {
        if (prod) showToast(`«${prod.name}» به علاقه‌مندی‌ها اضافه شد.`);
        return [...prev, productId];
      }
    });
  };

  const scrollToCatalog = () => {
    catalogSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSelectCategory = (cat: ProductCategory) => {
    setSelectedCategory(cat);
    setSelectedConcern(null);
    setShowWishlistOnly(false);
    setShowAllProducts(cat !== 'all');
    setActiveNavDropdown(null);
    setIsMobileMenuOpen(false);
    scrollToCatalog();
  };

  const handleSelectConcern = (
    concernId: SkinConcernId,
    shouldScroll = false
  ) => {
    if (selectedConcern === concernId) {
      setSelectedConcern(null);
    } else {
      setSelectedConcern(concernId);
      setSelectedCategory('all');
      setShowWishlistOnly(false);
      setShowAllProducts(true);
    }
    setActiveNavDropdown(null);
    setIsMobileMenuOpen(false);
    if (shouldScroll) {
      concernsSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleShopSaleBanner = async () => {
    await handleApplyPromoCode('SALE20');
    setShowAllProducts(true);
    scrollToCatalog();
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setIsSubscribing(true);
    try {
      const res = await subscribeNewsletterApi(newsletterEmail.trim());
      showToast(res.message);
      setNewsletterEmail('');
      setPromoCode('GLOW15');
      setDiscountPercent(15);
      setPromoMessage('کد تخفیف GLOW15 فعال شد: ۱۵٪ تخفیف اولین سفارش شما!');
    } catch (err) {
      showToast(
        err instanceof Error
          ? err.message
          : 'لطفاً یک آدرس ایمیل معتبر وارد کنید.'
      );
    } finally {
      setIsSubscribing(false);
    }
  };

  const totalBagCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1A1A1A] text-right pb-20 lg:pb-0"
      data-reference-asset={PRIMARY_REFERENCE_ASSET}
    >
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#E9E2D8] border-b border-[#DDD5C9] text-[#22201E] text-[10.5px] sm:text-xs">
        <div className="fixlife-container flex items-center justify-between py-1.5 sm:py-2">
          <div className="hidden md:flex items-center gap-2 whitespace-nowrap">
            <Truck className="h-3.5 w-3.5 text-[#4A4640]" strokeWidth={1.5} />
            <span>
              ارسال رایگان به سراسر ایران برای سفارش‌های بالای{' '}
              <strong>{formatPrice(FREE_SHIPPING_THRESHOLD_USD)}</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={() => handleApplyPromoCode('GLOW15')}
            className="mx-auto md:mx-0 font-semibold hover:underline cursor-pointer text-center truncate"
            title="برای اعمال کد تخفیف ۱۵ درصدی کلیک کنید"
          >
            ۱۵٪ تخفیف ویژه اولین خرید در فیکس لایف <span className="mx-1">|</span> کد تخفیف:{' '}
            <strong className="font-bold font-mono">GLOW15</strong>
          </button>

          <div className="hidden lg:flex items-center gap-4 whitespace-nowrap">
            <div className="flex items-center gap-1.5 text-[#4A4640] font-semibold">
              <MapPin className="h-3.5 w-3.5 text-[#8C7048]" />
              <span>فروش ویژه ایران · واحد پول: تومان</span>
            </div>

            <button
              type="button"
              onClick={() => setIsFaqOpen(true)}
              className="hover:underline cursor-pointer font-medium"
            >
              راهنما و سوالات متداول
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN STICKY HEADER (App-Shell on Mobile/Tablet, Full Editorial Nav on Laptop/AIO/Monitor) */}
      <header
        className="sticky top-0 z-40 bg-[#FDFBF7]/95 backdrop-blur-xl border-b border-[#ECE7DF] transition-colors shadow-xs lg:shadow-none"
        onMouseLeave={() => setActiveNavDropdown(null)}
      >
        <div className="fixlife-container flex items-center justify-between gap-3 sm:gap-6 py-2.5 sm:py-3.5 lg:py-4.5">
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((o) => !o)}
              className="lg:hidden p-2 rounded-xl bg-[#F4F0EA] text-[#1A1A1A] active:scale-95 transition-transform cursor-pointer"
              aria-label="منوی موبایل"
            >
              <Menu className="h-5 w-5" strokeWidth={1.75} />
            </button>

            <a
              href="#top"
              onClick={(e) => {
                e.preventDefault();
                setSelectedCategory('all');
                setSelectedConcern(null);
                setShowAllProducts(true);
                setShowWishlistOnly(false);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center whitespace-nowrap shrink-0"
              aria-label="فیکس لایف | FIXLIFE.IR"
            >
              <img
                src={FIXLIFE_LOGO_URL}
                alt="لوگوی فیکس لایف (FixLife)"
                className="h-9 sm:h-11 lg:h-12 w-auto object-contain"
              />
            </a>
          </div>

          {/* Mobile & Tablet Inline App Search Pill (visible on sm–md tablets, or expandable on mobile) */}
          <div className="hidden sm:flex lg:hidden flex-1 max-w-md mx-2">
            <div className="flex w-full items-center gap-2 rounded-full border border-[#E2DBD0] bg-[#F6F3EE] px-3.5 py-1.5">
              <Search className="h-4 w-4 text-[#787269] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowAllProducts(true);
                }}
                placeholder="جستجوی سرم، کرم یا نیاز پوستی..."
                className="w-full bg-transparent text-xs text-[#1A1A1A] placeholder:text-[#787269] focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-[10px] text-[#787269] hover:text-[#1A1A1A]"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          </div>

          <nav
            className="hidden lg:flex items-center gap-6 xl:gap-8 2xl:gap-10 text-xs 2xl:text-[13px] font-semibold text-[#1A1A1A]"
            aria-label="منوی اصلی فیکس لایف"
          >
            <div
              className="relative py-1"
              onMouseEnter={() => setActiveNavDropdown('shop')}
            >
              <button
                type="button"
                onClick={() =>
                  setActiveNavDropdown((cur) =>
                    cur === 'shop' ? null : 'shop'
                  )
                }
                className="flex items-center gap-1 hover:text-[#8C7048] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>محصولات</span>
                <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>

              {activeNavDropdown === 'shop' && (
                <div className="absolute right-0 top-full w-56 bg-[#FDFBF7] border border-[#E8E4DC] shadow-xl py-2.5 z-50 text-right">
                  {(
                    [
                      { id: 'all', label: 'همه محصولات فیکس لایف' },
                      { id: 'serums', label: 'سرم‌های تخصصی و غلیظ' },
                      { id: 'cleansers', label: 'شوینده‌ها و پاک‌کننده‌های گیاهی' },
                      { id: 'moisturizers', label: 'کرم‌ها و مرطوب‌کننده‌های سد پوستی' },
                      { id: 'sunscreen', label: 'ضدآفتاب نامرئی SPF 50' },
                      { id: 'sets', label: 'پکیج‌های روتین مراقبت کامل' },
                    ] as const
                  ).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectCategory(item.id)}
                      className="block w-full px-5 py-2 text-right text-xs text-[#4A4640] hover:bg-[#EFECE6] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedConcern(null);
                setShowWishlistOnly(false);
                setShowAllProducts(false);
                scrollToCatalog();
              }}
              className="hover:text-[#8C7048] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              پرفروش‌ترین‌ها
            </button>

            <div
              className="relative py-1"
              onMouseEnter={() => setActiveNavDropdown('concerns')}
            >
              <button
                type="button"
                onClick={() =>
                  setActiveNavDropdown((cur) =>
                    cur === 'concerns' ? null : 'concerns'
                  )
                }
                className="flex items-center gap-1 hover:text-[#8C7048] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>نیازهای پوستی</span>
                <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.5} />
              </button>

              {activeNavDropdown === 'concerns' && (
                <div className="absolute right-0 top-full w-56 bg-[#FDFBF7] border border-[#E8E4DC] shadow-xl py-2.5 z-50 text-right">
                  {SKIN_CONCERNS.map((concern) => (
                    <button
                      key={concern.id}
                      type="button"
                      onClick={() => handleSelectConcern(concern.id, true)}
                      className="block w-full px-5 py-2 text-right text-xs text-[#4A4640] hover:bg-[#EFECE6] hover:text-[#1A1A1A] transition-colors cursor-pointer"
                    >
                      {concern.title}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setIsAboutModalOpen(true)}
              className="hover:text-[#8C7048] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              درباره فیکس لایف
            </button>

            <button
              type="button"
              onClick={() =>
                journalSectionRef.current?.scrollIntoView({
                  behavior: 'smooth',
                })
              }
              className="hover:text-[#8C7048] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              مجله تخصصی پوست
            </button>

            <button
              type="button"
              onClick={() => setIsFaqOpen(true)}
              className="hover:text-[#8C7048] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              پشتیبانی و تماس
            </button>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3.5 lg:gap-5 shrink-0">
            <button
              type="button"
              onClick={() => setIsSearchOpen((o) => !o)}
              className="p-2 lg:p-1 rounded-xl lg:rounded-none bg-[#F4F0EA] lg:bg-transparent text-[#1A1A1A] hover:text-[#8C7048] transition-colors cursor-pointer sm:hidden lg:inline-flex"
              aria-label="جستجوی محصولات"
            >
              <Search className="h-4.5 w-4.5 lg:h-5 lg:w-5" strokeWidth={1.6} />
            </button>

            <button
              type="button"
              onClick={() => {
                setDashboardInitialTab('orders');
                setIsDashboardOpen(true);
              }}
              className="hidden sm:inline-flex p-2 lg:p-1 rounded-xl lg:rounded-none bg-[#F4F0EA] lg:bg-transparent text-[#1A1A1A] hover:text-[#8C7048] transition-colors cursor-pointer"
              aria-label="حساب کاربری"
            >
              <User className="h-4.5 w-4.5 lg:h-5 lg:w-5" strokeWidth={1.6} />
            </button>

            <button
              type="button"
              onClick={() => {
                setShowWishlistOnly((prev) => !prev);
                scrollToCatalog();
              }}
              className="relative p-2 lg:p-1 rounded-xl lg:rounded-none bg-[#F4F0EA] lg:bg-transparent text-[#1A1A1A] hover:text-[#8C7048] transition-colors cursor-pointer"
              aria-label="علاقه‌مندی‌ها"
            >
              <Heart
                className={`h-4.5 w-4.5 lg:h-5 lg:w-5 ${
                  showWishlistOnly ? 'fill-[#1A1A1A]' : ''
                }`}
                strokeWidth={1.6}
              />
              {wishlist.length > 0 && (
                <span className="absolute -left-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#C5A880] text-[9px] font-bold text-[#1A1A1A] tabular-nums">
                  {toPersianDigits(wishlist.length)}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 lg:p-1 rounded-xl lg:rounded-none bg-[#1A1A1A] lg:bg-transparent text-white lg:text-[#1A1A1A] hover:text-[#8C7048] transition-colors cursor-pointer"
              aria-label="سبد خرید"
            >
              <ShoppingBag className="h-4.5 w-4.5 lg:h-5 lg:w-5" strokeWidth={1.6} />
              <span className="absolute -left-1.5 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#C5A880] lg:bg-[#1A1A1A] text-[9.5px] font-bold text-[#1A1A1A] lg:text-white tabular-nums">
                {toPersianDigits(totalBagCount)}
              </span>
            </button>
          </div>
        </div>

        {isSearchOpen && (
          <div className="border-t border-[#E8E4DC] bg-[#FAF7F2] py-3.5">
            <div className="fixlife-container flex max-w-3xl items-center gap-3">
              <Search className="h-4 w-4 text-[#787269] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowAllProducts(true);
                }}
                placeholder="جستجو بر اساس نام محصول، ترکیبات موثره (رتینول، نیاسینامید، هیالورونیک اسید) یا نیاز پوستی..."
                autoFocus
                className="w-full bg-transparent text-xs sm:text-sm text-[#1A1A1A] placeholder:text-[#787269] focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-xs text-[#787269] hover:text-[#1A1A1A] cursor-pointer shrink-0"
                >
                  پاک کردن
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-1 text-[#4A4640] hover:text-[#1A1A1A] cursor-pointer shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-[#E8E4DC] bg-[#FDFBF7] px-4 sm:px-6 py-5 space-y-4 shadow-xl">
            <div className="space-y-2.5">
              <p className="text-xs font-bold text-[#787269]">
                دسته‌بندی محصولات فیکس لایف
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(
                  [
                    {
                      id: 'all',
                      label: `همه محصولات (${toPersianDigits(products.length)})`,
                    },
                    {
                      id: 'serums',
                      label: `سرم‌های تخصصی (${toPersianDigits(products.filter((p) => p.category === 'serums').length)})`,
                    },
                    {
                      id: 'moisturizers',
                      label: `کرم‌ها و لوسیون‌ها (${toPersianDigits(products.filter((p) => p.category === 'moisturizers').length)})`,
                    },
                  ] as const
                ).map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleSelectCategory(cat.id)}
                    className="rounded-xl border border-[#E8E4DC] bg-[#FAF7F2] px-3.5 py-2.5 text-right text-xs font-semibold active:scale-98 transition-transform"
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E8E4DC]">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsAboutModalOpen(true);
                }}
                className="rounded-xl bg-[#EFECE6] px-3 py-2.5 text-xs font-bold text-[#1A1A1A] text-center"
              >
                درباره فیکس لایف
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  setIsFaqOpen(true);
                }}
                className="rounded-xl bg-[#EFECE6] px-3 py-2.5 text-xs font-bold text-[#1A1A1A] text-center"
              >
                راهنما و سوالات متداول
              </button>
            </div>

            <div className="flex items-center justify-between border-t border-[#E8E4DC] pt-3 text-xs text-[#4A4640]">
              <span>محدوده فروش و ارسال:</span>
              <span className="font-bold text-[#1A1A1A]">
                سراسر ایران (واحد پول: تومان)
              </span>
            </div>
          </div>
        )}
      </header>

      {isCheckoutResultRoute ? (
        <main className="flex-1 bg-[#FDFBF7] py-8 sm:py-14">
          <CheckoutResult
            onReturnToCart={() => {
              setIsCheckoutResultRoute(false);
              setIsCartOpen(true);
            }}
            onReturnHome={() => {
              setIsCheckoutResultRoute(false);
            }}
          />
        </main>
      ) : (
        <>
          {/* 3. SCROLL-DRIVEN 3D VIDEO HERO SECTION */}
          <ScrollVideoHero
            onShopNow={() => {
              setShowAllProducts(true);
              scrollToCatalog();
        }}
        onExploreCollection={() =>
          concernsSectionRef.current?.scrollIntoView({
            behavior: 'smooth',
          })
        }
      />

      {/* 4. VALUE PROPOSITIONS & TRUST BAR */}
      <section className="bg-[#FAF8F5] border-b border-[#ECE7DF]">
        <div className="fixlife-container py-5 sm:py-7 lg:py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-0 sm:divide-y-0 lg:divide-x lg:divide-x-reverse divide-[#E5DFD5]">
            <div className="flex flex-col sm:flex-row items-start gap-2.5 sm:gap-4 rounded-2xl sm:rounded-none bg-white sm:bg-transparent p-3.5 sm:py-2 sm:px-6 border sm:border-0 border-[#ECE7DF] first:pr-0">
              <Leaf
                className="h-6 w-6 sm:h-7 sm:w-7 text-[#8C7048] sm:text-[#2C2926] shrink-0 mt-0.5"
                strokeWidth={1.4}
              />
              <div>
                <h2 className="font-sans text-[11px] sm:text-xs 2xl:text-sm font-bold text-[#1A1A1A]">
                  ترکیبات ۱۰۰٪ گیاهی و پاک
                </h2>
                <p className="mt-1 text-[10.5px] sm:text-xs leading-5 sm:leading-6 text-[#5A554E] text-justify">
                  فرموله‌شده با عصاره‌های گیاهی ارگانیک بدون پارابن، سولفات و اسانس مصنوعی.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-2.5 sm:gap-4 rounded-2xl sm:rounded-none bg-white sm:bg-transparent p-3.5 sm:py-2 sm:px-6 border sm:border-0 border-[#ECE7DF]">
              <FlaskConical
                className="h-6 w-6 sm:h-7 sm:w-7 text-[#8C7048] sm:text-[#2C2926] shrink-0 mt-0.5"
                strokeWidth={1.4}
              />
              <div>
                <h2 className="font-sans text-[11px] sm:text-xs 2xl:text-sm font-bold text-[#1A1A1A]">
                  تاییدشده در آزمایشگاه بالینی
                </h2>
                <p className="mt-1 text-[10.5px] sm:text-xs leading-5 sm:leading-6 text-[#5A554E] text-justify">
                  اثربخشی اثبات‌شده توسط متخصصین پوست و سازگار با اقلیم آب‌وهوایی ایران.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-2.5 sm:gap-4 rounded-2xl sm:rounded-none bg-white sm:bg-transparent p-3.5 sm:py-2 sm:px-6 border sm:border-0 border-[#ECE7DF]">
              <Truck
                className="h-6 w-6 sm:h-7 sm:w-7 text-[#8C7048] sm:text-[#2C2926] shrink-0 mt-0.5"
                strokeWidth={1.4}
              />
              <div>
                <h2 className="font-sans text-[11px] sm:text-xs 2xl:text-sm font-bold text-[#1A1A1A]">
                  ارسال رایگان بالای {formatPrice(FREE_SHIPPING_THRESHOLD_USD)}
                </h2>
                <p className="mt-1 text-[10.5px] sm:text-xs leading-5 sm:leading-6 text-[#5A554E] text-justify">
                  ارسال سریع با پست پیشتاز و تیپاکس به تمامی ۳۱ استان کشور.
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start gap-2.5 sm:gap-4 rounded-2xl sm:rounded-none bg-white sm:bg-transparent p-3.5 sm:py-2 sm:px-6 border sm:border-0 border-[#ECE7DF] last:pl-0">
              <Headphones
                className="h-6 w-6 sm:h-7 sm:w-7 text-[#8C7048] sm:text-[#2C2926] shrink-0 mt-0.5"
                strokeWidth={1.4}
              />
              <div>
                <h2 className="font-sans text-[11px] sm:text-xs 2xl:text-sm font-bold text-[#1A1A1A]">
                  مشاوره تخصصی ۲۴ ساعته
                </h2>
                <p className="mt-1 text-[10.5px] sm:text-xs leading-5 sm:leading-6 text-[#5A554E] text-justify">
                  پشتیبانی مستقیم مشاوران پوست فیکس لایف برای انتخاب بهترین روتین.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SHOP BY SKIN CONCERN */}
      <section
        ref={concernsSectionRef}
        className="fixlife-container pt-8 sm:pt-12 pb-4"
      >
        <div className="text-center mb-5 sm:mb-7">
          <h2 className="font-editorial text-xl sm:text-2xl lg:text-[28px] 2xl:text-3xl font-bold text-[#1A1A1A]">
            انتخاب محصول بر اساس نیاز پوست شما
          </h2>
          <p className="mt-1.5 text-[11px] sm:text-xs 2xl:text-sm text-[#5A554E]">
            روی هر نوع نیاز پوستی کلیک کنید تا فقط محصول تخصصی متناسب با همان نیاز نمایش داده شود
          </p>
        </div>

        <div className="flex gap-3 sm:gap-4 2xl:gap-6 overflow-x-auto no-scrollbar pb-2 sm:grid sm:grid-cols-3 lg:grid-cols-5 sm:overflow-visible snap-x snap-mandatory">
          {SKIN_CONCERNS.map((concern) => {
            const isSelected = selectedConcern === concern.id;
            const matchingCount = products.filter((p) =>
              p.concerns.includes(concern.id)
            ).length;
            return (
              <button
                key={concern.id}
                type="button"
                onClick={() => handleSelectConcern(concern.id, false)}
                aria-pressed={isSelected}
                className={`snap-start group flex flex-col min-w-[165px] xs:min-w-[190px] sm:min-w-0 overflow-hidden rounded-2xl lg:rounded-[4px] text-right transition-all cursor-pointer ${
                  isSelected
                    ? 'ring-2 ring-[#1A1A1A] shadow-lg scale-[1.01]'
                    : 'hover:shadow-md opacity-95 hover:opacity-100'
                }`}
              >
                <div className="relative aspect-[130/88] w-full overflow-hidden bg-[#E6DFD5]">
                  <img
                    src={concern.image}
                    alt={concern.title}
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <span
                    className={`absolute top-2.5 right-2.5 rounded-full lg:rounded-none px-2.5 py-0.5 text-[10px] font-bold shadow-xs ${
                      isSelected
                        ? 'bg-[#1A1A1A] text-[#C5A880]'
                        : 'bg-[#FDFBF7]/95 text-[#1A1A1A]'
                    }`}
                  >
                    {toPersianDigits(matchingCount)} محصول تخصصی
                  </span>
                </div>
                <div
                  className={`w-full py-2.5 sm:py-3 px-2 text-center text-xs 2xl:text-sm font-bold transition-colors ${
                    isSelected
                      ? 'bg-[#1A1A1A] text-white'
                      : 'bg-[#DFD3C3] text-[#1A1A1A] group-hover:bg-[#D4C5B2]'
                  }`}
                >
                  {concern.title}
                </div>
              </button>
            );
          })}
        </div>

        {selectedConcern && (
          <div className="mt-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl lg:rounded-none bg-[#EFECE6] border border-[#DCD5C9] p-4 sm:px-6">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full lg:rounded-none bg-[#1A1A1A] text-[#C5A880] px-2.5 py-0.5 text-[11px] font-bold">
                  فیلتر فعال نیاز پوستی
                </span>
                <h3 className="text-sm sm:text-base font-bold text-[#1A1A1A]">
                  {SKIN_CONCERNS.find((c) => c.id === selectedConcern)?.title} —{' '}
                  {
                    SKIN_CONCERNS.find((c) => c.id === selectedConcern)
                      ?.subtitle
                  }
                </h3>
              </div>
              <p className="mt-1.5 text-xs text-[#4A4640] text-justify leading-6">
                {
                  SKIN_CONCERNS.find((c) => c.id === selectedConcern)
                    ?.description
                }
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setSelectedConcern(null);
                setShowAllProducts(true);
              }}
              className="w-full sm:w-auto shrink-0 rounded-xl lg:rounded-none bg-[#1A1A1A] text-white px-4 py-2.5 text-xs font-semibold hover:bg-[#333333] transition-colors cursor-pointer text-center"
            >
              نمایش همه محصولات ({toPersianDigits(products.length)})
            </button>
          </div>
        )}
      </section>

      {/* 6. BEST SELLERS & PRODUCT CATALOG (App-Style Cards on Mobile/Tablet + Multi-Column on Laptop/AIO/Monitor) */}
      <section
        ref={catalogSectionRef}
        className="fixlife-container py-6 sm:py-8"
      >
        <div className="relative flex flex-col sm:flex-row items-center justify-between mb-6 gap-3">
          <div className="hidden lg:block w-32" />
          <div className="text-center">
            <h2 className="font-editorial text-xl sm:text-2xl lg:text-[28px] 2xl:text-3xl font-bold text-[#1A1A1A]">
              {showWishlistOnly
                ? 'محصولات منتخب و مورد علاقه شما'
                : selectedConcern
                  ? `محصول تخصصی مناسب برای «${
                      SKIN_CONCERNS.find((c) => c.id === selectedConcern)?.title
                    }» (${toPersianDigits(displayedProducts.length)} محصول)`
                  : selectedCategory !== 'all'
                    ? CATEGORY_TITLES_FA[selectedCategory]
                    : showAllProducts
                      ? 'مجموعه کامل محصولات مراقبت از پوست فیکس لایف'
                      : 'پرفروش‌ترین محصولات فیکس لایف'}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            {(selectedConcern ||
              selectedCategory !== 'all' ||
              showWishlistOnly ||
              searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSelectedConcern(null);
                  setSelectedCategory('all');
                  setShowWishlistOnly(false);
                  setSearchQuery('');
                  setShowAllProducts(true);
                }}
                className="text-xs font-semibold underline text-[#8C7048] hover:text-[#1A1A1A] cursor-pointer whitespace-nowrap"
              >
                حذف فیلتر و نمایش همه
              </button>
            )}

            {!selectedConcern && (
              <button
                type="button"
                onClick={() => {
                  setShowWishlistOnly(false);
                  setSelectedConcern(null);
                  setSelectedCategory('all');
                  setShowAllProducts((prev) => !prev);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1A1A1A] hover:text-[#8C7048] transition-colors cursor-pointer whitespace-nowrap"
              >
                <span>
                  {showAllProducts
                    ? 'نمایش پرفروش‌ترین‌ها'
                    : 'مشاهده همه محصولات'}
                </span>
                <ArrowLeft className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {!selectedConcern &&
          (showAllProducts ||
            selectedCategory !== 'all' ||
            showWishlistOnly) && (
            <div className="mb-7 flex items-center justify-start sm:justify-center gap-2 overflow-x-auto no-scrollbar border-y border-[#E8E4DC] py-3">
              {(
                [
                  {
                    id: 'all',
                    label: `همه محصولات فیکس لایف (${toPersianDigits(products.length)})`,
                  },
                  {
                    id: 'serums',
                    label: `سرم‌های تخصصی جیورا (${toPersianDigits(products.filter((p) => p.category === 'serums').length)})`,
                  },
                  {
                    id: 'moisturizers',
                    label: `کرم‌ها و لوسیون‌های تخصصی (${toPersianDigits(products.filter((p) => p.category === 'moisturizers').length)})`,
                  },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(tab.id);
                    setSelectedConcern(null);
                    setShowWishlistOnly(false);
                    setShowAllProducts(true);
                  }}
                  className={`shrink-0 rounded-full lg:rounded-none px-4 py-1.5 text-xs transition-colors cursor-pointer ${
                    selectedCategory === tab.id &&
                    !selectedConcern &&
                    !showWishlistOnly
                      ? 'bg-[#1A1A1A] text-white font-semibold'
                      : 'bg-[#FAF7F2] text-[#4A4640] hover:bg-[#EFECE6] hover:text-[#1A1A1A]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          )}

        {displayedProducts.length === 0 ? (
          <div className="rounded-2xl lg:rounded-none border border-[#E8E4DC] bg-[#FAF7F2] py-14 text-center">
            <p className="font-editorial text-xl font-bold text-[#1A1A1A]">
              محصولی مطابق با فیلتر انتخابی شما یافت نشد
            </p>
            <p className="mt-1 text-xs text-[#787269]">
              فیلترها را پاک کنید یا لیست پرفروش‌ترین محصولات فیکس لایف را ببینید.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedConcern(null);
                setShowWishlistOnly(false);
                setSearchQuery('');
                setShowAllProducts(false);
              }}
              className="mt-4 rounded-xl lg:rounded-none bg-[#1A1A1A] px-6 py-2.5 text-xs font-semibold text-white cursor-pointer"
            >
              نمایش پرفروش‌ترین محصولات
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-5 2xl:gap-7">
            {displayedProducts.map((product) => {
              const isWishlisted = wishlist.includes(product.id);
              return (
                <div
                  key={product.id}
                  className="group flex flex-col overflow-hidden rounded-2xl lg:rounded-none bg-[#F5F1EC] border border-[#E8E2D9] lg:border-transparent hover:border-[#E2DBD0] shadow-xs lg:shadow-none transition-all duration-200"
                >
                  <div className="relative aspect-square sm:aspect-[4/3] w-full overflow-hidden bg-[#F4EFEA]">
                    {product.isNew && (
                      <span className="absolute right-2.5 top-2.5 z-10 rounded-full lg:rounded-none bg-[#FDFBF7]/95 px-2.5 py-0.5 text-[10px] font-bold text-[#8C7048] shadow-2xs">
                        جدید
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleWishlist(product.id);
                      }}
                      className="absolute left-2.5 top-2.5 z-10 rounded-full bg-white/80 lg:bg-transparent p-1.5 text-[#4A4640] opacity-90 lg:opacity-70 hover:opacity-100 hover:text-[#1A1A1A] transition-opacity cursor-pointer"
                      aria-label={`افزودن ${product.name} به علاقه‌مندی‌ها`}
                    >
                      <Heart
                        className={`h-4 w-4 ${
                          isWishlisted ? 'fill-[#1A1A1A] text-[#1A1A1A]' : ''
                        }`}
                        strokeWidth={1.6}
                      />
                    </button>

                    <div
                      onClick={() => setQuickViewProduct(product)}
                      className="h-full w-full cursor-pointer flex items-center justify-center p-2.5 sm:p-3"
                    >
                      <img
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    {/* Desktop/Laptop Hover Action Bar (lg+) */}
                    <div className="hidden lg:flex absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-200 bg-[#1A1A1A]/95 text-white">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 py-2.5 text-xs font-semibold hover:bg-[#333333] transition-colors cursor-pointer"
                      >
                        افزودن به سبد
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuickViewProduct(product)}
                        className="border-r border-white/20 px-3 py-2.5 text-[11px] hover:bg-[#333333] transition-colors cursor-pointer"
                      >
                        جزئیات
                      </button>
                      <a
                        href={buildProductWhatsAppConsultUrl(product)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 border-r border-white/20 bg-[#128C7E] hover:bg-[#075E54] px-3 py-2.5 text-[11px] font-semibold text-white transition-colors"
                        title={`مشاوره واتساپ درباره ${product.name}`}
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span>مشاوره</span>
                      </a>
                    </div>
                  </div>

                  <div
                    onClick={() => setQuickViewProduct(product)}
                    className="flex flex-1 flex-col items-center justify-between px-2.5 sm:px-4 pt-3 pb-2.5 text-center cursor-pointer"
                  >
                    <div>
                      {product.tag && (
                        <span className="inline-block mb-1 text-[10px] font-semibold text-[#8C7048]">
                          {product.tag}
                        </span>
                      )}
                      <h3 className="text-[11.5px] sm:text-[13.5px] 2xl:text-[15px] font-bold text-[#1A1A1A] leading-snug line-clamp-2">
                        {product.name}
                      </h3>
                      <p className="mt-1.5 text-xs sm:text-[13.5px] 2xl:text-sm font-bold tabular-nums text-[#8C7048]">
                        {formatPrice(product.priceUSD)}
                      </p>
                    </div>

                    <div className="mt-2 flex items-center justify-center gap-1 text-[10.5px] sm:text-[11px] text-[#4A4640]">
                      <div
                        className="flex items-center gap-0.5 text-[#1A1A1A]"
                        aria-label={`امتیاز ${product.rating} از ۵`}
                      >
                        {Array.from({ length: 5 }).map((_, idx) => {
                          const filled = idx < Math.floor(product.rating);
                          return (
                            <Star
                              key={idx}
                              className={`h-2.5 w-2.5 sm:h-3 sm:w-3 ${
                                filled
                                  ? 'fill-[#1A1A1A] text-[#1A1A1A]'
                                  : 'text-[#BDB6AC]'
                              }`}
                            />
                          );
                        })}
                      </div>
                      <span className="tabular-nums text-[#5A554E]">
                        ({toPersianDigits(product.reviewCount)} نظر)
                      </span>
                    </div>
                  </div>

                  {/* Per-Product Direct WhatsApp Consultation Button (Visible on all screens alongside product) */}
                  <div className="px-2.5 sm:px-4 pb-2.5 space-y-1.5">
                    <div className="flex lg:hidden items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        className="flex-1 rounded-xl bg-[#1A1A1A] py-2 text-[11px] font-bold text-white active:scale-97 transition-transform cursor-pointer"
                      >
                        + افزودن به سبد
                      </button>
                      <button
                        type="button"
                        onClick={() => setQuickViewProduct(product)}
                        className="rounded-xl border border-[#D8D0C5] bg-white px-2.5 py-2 text-[10.5px] font-bold text-[#1A1A1A] active:scale-97 transition-transform cursor-pointer"
                      >
                        پروتکل
                      </button>
                    </div>

                    <a
                      href={buildProductWhatsAppConsultUrl(product)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center justify-center gap-1.5 rounded-xl lg:rounded-none border border-[#25D366]/50 bg-[#25D366]/10 hover:bg-[#25D366] text-[#075E54] hover:text-white py-1.5 px-2.5 text-[10.5px] sm:text-[11px] font-bold transition-colors"
                      title={`مشاوره تخصصی واتساپ درباره ${product.name}`}
                    >
                      <MessageCircle className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">
                        مشاوره واتساپ این محصول
                      </span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 7. PROMOTIONAL CALLOUT BANNER */}
      <section className="fixlife-container py-5 sm:py-6">
        <div className="relative overflow-hidden rounded-2xl lg:rounded-[3px] bg-[#E8DFD3] border border-[#DFD5C7]">
          <div className="grid grid-cols-1 md:grid-cols-12 items-center">
            <div className="md:col-span-5 h-48 sm:h-60 md:h-full overflow-hidden">
              <img
                src="/assets/lumiere/promo-flatlay.jpg"
                alt="جشنواره تخفیف فیکس لایف — محصولات مراقبت از پوست"
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover object-left"
              />
            </div>

            <div className="p-5 sm:p-8 md:col-span-5 text-right">
              <p className="text-xs font-semibold text-[#8C7048]">
                جشنواره محدود فصل در فیکس لایف
              </p>
              <h2 className="mt-1.5 font-editorial text-xl sm:text-3xl 2xl:text-4xl font-bold text-[#1A1A1A]">
                درخشش بیشتر پوست، خرید به‌صرفه‌تر
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-[#3D3935] text-justify leading-7">
                تنها تا پایان این هفته، تمامی محصولات تخصصی مراقبت از پوست فیکس لایف را با ۲۰٪ تخفیف ویژه و ارسال به سراسر ایران تهیه کنید.
              </p>
              <button
                type="button"
                onClick={handleShopSaleBanner}
                className="mt-4 w-full sm:w-auto rounded-xl lg:rounded-none bg-[#1E1C1A] text-white px-6 py-3 sm:py-2.5 text-xs font-semibold hover:bg-[#36332F] transition-colors cursor-pointer"
              >
                اعمال ۲۰٪ تخفیف و مشاهده محصولات
              </button>
            </div>

            <div className="pb-6 md:pb-0 md:pl-8 md:col-span-2 flex items-center justify-center">
              <button
                type="button"
                onClick={handleShopSaleBanner}
                className="flex h-24 w-24 sm:h-32 sm:w-32 flex-col items-center justify-center rounded-full bg-[#C7B296]/85 text-[#1A1A1A] shadow-sm hover:scale-105 transition-transform cursor-pointer"
                aria-label="اعمال کد تخفیف ۲۰ درصدی SALE20"
              >
                <span className="font-editorial text-2xl sm:text-4xl font-bold leading-none">
                  ۲۰٪
                </span>
                <span className="mt-1 text-xs sm:text-sm font-bold">
                  تخفیف
                </span>
                <span className="mt-0.5 text-[10px] font-semibold">
                  کل سایت
                </span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 8. FROM THE JOURNAL */}
      <section
        ref={journalSectionRef}
        className="fixlife-container py-6 sm:py-8"
      >
        <div className="relative flex items-center justify-between mb-6">
          <div className="hidden sm:block w-24" />
          <h2 className="font-editorial text-xl sm:text-[26px] 2xl:text-3xl font-bold text-[#1A1A1A] text-center">
            مجله علمی و آموزشی فیکس لایف
          </h2>
          <button
            type="button"
            onClick={() => setActiveArticle(JOURNAL_ARTICLES[0])}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#1A1A1A] hover:text-[#8C7048] transition-colors cursor-pointer whitespace-nowrap"
          >
            <span>مشاهده همه مقالات</span>
            <ArrowLeft className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 2xl:gap-7">
          {JOURNAL_ARTICLES.map((article) => (
            <article
              key={article.id}
              onClick={() => setActiveArticle(article)}
              className="group grid grid-cols-12 overflow-hidden rounded-2xl lg:rounded-none bg-[#F6F4F0] border border-[#ECE7DF] hover:border-[#C5A880] transition-colors cursor-pointer"
            >
              <div className="col-span-5 overflow-hidden bg-[#EAE3D9]">
                <img
                  src={article.image}
                  alt={article.title}
                  referrerPolicy="no-referrer"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="col-span-7 flex flex-col justify-between p-4 sm:p-5 text-right">
                <div>
                  <h3 className="font-sans text-xs sm:text-[13px] 2xl:text-sm font-bold leading-relaxed text-[#1A1A1A]">
                    {article.title}
                  </h3>
                  <p className="mt-1.5 text-[11px] text-[#5A554E] line-clamp-2 text-justify leading-5">
                    {article.excerpt}
                  </p>
                </div>

                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C7048] group-hover:text-[#1A1A1A] transition-colors">
                  <span>مطالعه کامل مقاله</span>
                  <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 9. NEWSLETTER SUBSCRIPTION BAR */}
      <section
        id="newsletter"
        className="fixlife-container py-5 sm:py-6"
      >
        <div className="flex flex-col lg:flex-row items-center justify-between gap-5 sm:gap-6 rounded-2xl lg:rounded-none bg-[#F4F2EE] border border-[#E6E1D8] px-5 sm:px-10 py-6">
          <div className="flex items-center gap-4">
            <Mail
              className="h-7 w-7 text-[#2C2926] shrink-0"
              strokeWidth={1.25}
            />
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-[#1A1A1A]">
                عضویت در باشگاه مشتریان فیکس لایف (fixlife.ir)
              </h2>
              <p className="mt-1 text-xs text-[#5A554E] text-justify">
                با ثبت ایمیل خود، کد تخفیف ۱۵ درصدی اولین خرید و راهنمای تخصصی مراقبت از پوست را دریافت کنید.
              </p>
            </div>
          </div>

          <form
            onSubmit={handleNewsletterSubmit}
            className="flex w-full lg:w-auto max-w-md flex-1 items-stretch overflow-hidden rounded-xl lg:rounded-none"
          >
            <input
              type="email"
              dir="ltr"
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="name@example.com"
              required
              aria-label="ایمیل جهت عضویت در خبرنامه فیکس لایف"
              className="flex-1 border border-[#D5CFC4] bg-white px-4 py-2.5 text-xs text-left font-mono text-[#1A1A1A] placeholder:text-[#8C857B] focus:border-[#1A1A1A] focus:outline-none"
            />
            <button
              type="submit"
              disabled={isSubscribing}
              className="bg-[#1E1C1A] px-5 sm:px-6 py-2.5 text-xs font-semibold text-white hover:bg-[#36332F] transition-colors cursor-pointer whitespace-nowrap"
            >
              {isSubscribing ? 'در حال ثبت...' : 'عضویت و دریافت کد'}
            </button>
          </form>
        </div>
      </section>
        </>
      )}

      {/* 10. COMPLETE FOOTER */}
      <Footer
        onSelectCategory={handleSelectCategory}
        onSelectBestSellers={() => {
          setShowAllProducts(false);
          setSelectedCategory('all');
          setSelectedConcern(null);
          scrollToCatalog();
        }}
        onSelectConcern={(concernId) => handleSelectConcern(concernId, true)}
        onOpenAbout={() => setIsAboutModalOpen(true)}
        onOpenJournal={(idx) =>
          setActiveArticle(JOURNAL_ARTICLES[idx] || JOURNAL_ARTICLES[0])
        }
        onOpenFaq={() => setIsFaqOpen(true)}
        onOpenDashboard={() => setIsDashboardOpen(true)}
        onOpenGiftSet={() =>
          setQuickViewProduct(
            products.find((p) => p.id === '4380') || products[0]
          )
        }
      />

      {/* INTERACTIVE MODALS & DRAWERS */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        currency={currency}
        promoCode={promoCode}
        discountPercent={discountPercent}
        promoMessage={promoMessage}
        isApplyingPromo={isApplyingPromo}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onApplyPromoCode={handleApplyPromoCode}
        onRemovePromoCode={handleRemovePromoCode}
        onProceedToCheckout={() => {
          setIsCartOpen(false);
          setIsCheckoutOpen(true);
        }}
        onQuickAddProduct={(prodId) => {
          const prod = products.find((p) => p.id === prodId) || products[0];
          handleAddToCart(prod);
        }}
      />

      <QuickViewModal
        product={quickViewProduct}
        currency={currency}
        isWishlisted={
          quickViewProduct ? wishlist.includes(quickViewProduct.id) : false
        }
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cart}
        currency={currency}
        promoCode={promoCode}
        discountPercent={discountPercent}
        customer={customer || INITIAL_DEMO_CUSTOMER}
        onSubmitOrder={async (payload: CreateOrderRequestPayload) => {
          const created = await createOrderApi(payload);
          setOrders((prev) => [created, ...prev]);
          setProducts(getStoredProducts());
          showToast(`سفارش شماره #${created.orderNumber} ثبت و آماده انتقال به درگاه شد.`);
          return created;
        }}
        onOpenDashboard={() => setIsDashboardOpen(true)}
      />

      <CustomerDashboardModal
        isOpen={isDashboardOpen}
        onClose={() => setIsDashboardOpen(false)}
        customer={customer}
        orders={orders}
        products={products}
        onProductsUpdated={(updatedList) => {
          setProducts(updatedList);
          if (quickViewProduct) {
            const refreshed = updatedList.find(
              (p) => p.id === quickViewProduct.id
            );
            setQuickViewProduct(refreshed || null);
          }
        }}
        currency={currency}
        initialTab={dashboardInitialTab}
        onLogin={async (email, password) => {
          const res = await loginCustomerApi(email, password);
          setCustomer(res.user);
          showToast(`${res.user.firstName} عزیز، به فیکس لایف خوش آمدید.`);
        }}
        onRegister={async (payload) => {
          const res = await registerCustomerApi(payload);
          setCustomer(res.user);
          showToast(`حساب کاربری برای ${res.user.firstName} ایجاد شد.`);
        }}
        onLogout={() => {
          setCustomer(null);
          showToast('از حساب کاربری فیکس لایف خارج شدید.');
        }}
        onUpdateOrderStatus={async (orderId: string, status: OrderStatus) => {
          const updated = await updateOrderStatusApi(orderId, status);
          setOrders(updated);
          showToast('وضعیت سفارش بروزرسانی شد.');
        }}
        onUpdateAddress={async (
          type: 'billing' | 'shipping',
          address: CustomerAddress
        ) => {
          const updatedUser = await updateCustomerAddressApi(type, address);
          setCustomer(updatedUser);
          showToast('نشانی پستی شما در ایران با موفقیت ذخیره شد.');
        }}
      />

      <JournalModal
        article={activeArticle}
        relatedProducts={
          activeArticle
            ? products.filter((p) =>
                activeArticle.relatedProductIds.includes(p.id)
              )
            : []
        }
        currency={currency}
        onClose={() => setActiveArticle(null)}
        onSelectProduct={(prod) => setQuickViewProduct(prod)}
      />

      <FaqModal
        isOpen={isFaqOpen}
        onClose={() => setIsFaqOpen(false)}
        onOpenApiDocs={() => setIsDashboardOpen(true)}
      />

      {isAboutModalOpen && (
        <div
          dir="rtl"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
          role="dialog"
          aria-modal="true"
          aria-label="درباره برند فیکس لایف (FixLife)"
        >
          <div
            className="fixed inset-0"
            onClick={() => setIsAboutModalOpen(false)}
          />
          <div className="relative z-10 max-w-2xl bg-[#FDFBF7] border border-[#E8E4DC] p-6 sm:p-10 shadow-2xl space-y-5 text-right">
            <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-[#8C7048]" />
                <h2 className="font-editorial text-xl sm:text-2xl font-bold">
                  فلسفه و داستان برند فیکس لایف (fixlife.ir)
                </h2>
              </div>
              <button
                onClick={() => setIsAboutModalOpen(false)}
                className="p-1 text-[#4A4640] hover:text-[#1A1A1A] cursor-pointer"
                aria-label="بستن پنجره درباره ما"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm leading-8 text-[#33302C] text-justify">
              برند <strong>فیکس لایف (FixLife)</strong> با هدف پیوند دانش درماتولوژی بالینی و خلوص عصاره‌های گیاهی ارگانیک، مجموعه‌ای از محصولات تخصصی مراقبت از پوست را متناسب با نیازهای پوستی و شرایط اقلیمی ایران طراحی و عرضه کرده است.
            </p>
            <p className="text-xs leading-7 text-[#4A4640] text-justify">
              تمامی محصولات عرضه‌شده در وب‌سایت رسمی <strong>fixlife.ir</strong> در ظروف شیشه‌ای مات محافظ اشعه UV و قابل بازیافت بسته‌بندی شده و عاری از هرگونه پارابن، سولفات خشن، سیلیکون سنگین و اسانس‌های حساسیت‌زا هستند. ما به پشتوانه ترکیبات دارویی استاندارد همچون نیاسینامید خالص، سرامیدهای زیست‌همسان، باکوچیول گیاهی و پپتیدهای ترمیم‌کننده، سلامت و درخشش ماندگار پوست شما را تضمین می‌کنیم.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsAboutModalOpen(false);
                  scrollToCatalog();
                }}
                className="bg-[#1A1A1A] px-6 py-3 text-xs font-semibold text-white cursor-pointer"
              >
                مشاهده محصولات تخصصی فیکس لایف
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NATIVE MOBILE & TABLET BOTTOM APP NAVIGATION BAR (< lg) */}
      <nav
        aria-label="نوار ناوبری اپلیکیشن فیکس لایف"
        className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-[#E2DBD0] bg-[#FDFBF7]/95 backdrop-blur-xl pb-safe-bottom shadow-[0_-4px_20px_rgba(26,26,26,0.06)]"
      >
        <div className="mx-auto grid max-w-md grid-cols-5 items-center px-2 py-1.5">
          <button
            type="button"
            onClick={() => {
              setSelectedConcern(null);
              setSelectedCategory('all');
              setShowWishlistOnly(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex flex-col items-center justify-center gap-1 py-1 text-[#1A1A1A] active:scale-95 transition-transform cursor-pointer"
          >
            <Home className="h-5 w-5 text-[#8C7048]" strokeWidth={1.8} />
            <span className="text-[10px] font-bold">خانه</span>
          </button>

          <button
            type="button"
            onClick={() =>
              concernsSectionRef.current?.scrollIntoView({ behavior: 'smooth' })
            }
            className="flex flex-col items-center justify-center gap-1 py-1 text-[#4A4640] hover:text-[#1A1A1A] active:scale-95 transition-transform cursor-pointer"
          >
            <LayoutGrid className="h-5 w-5" strokeWidth={1.7} />
            <span className="text-[10px] font-semibold">نیاز پوست</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setIsSearchOpen(true);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex flex-col items-center justify-center gap-1 py-1 text-[#4A4640] hover:text-[#1A1A1A] active:scale-95 transition-transform cursor-pointer"
          >
            <Search className="h-5 w-5" strokeWidth={1.7} />
            <span className="text-[10px] font-semibold">جستجو</span>
          </button>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="relative flex flex-col items-center justify-center gap-1 py-1 text-[#4A4640] hover:text-[#1A1A1A] active:scale-95 transition-transform cursor-pointer"
          >
            <div className="relative">
              <ShoppingBag className="h-5 w-5" strokeWidth={1.7} />
              {totalBagCount > 0 && (
                <span className="absolute -top-1.5 -left-2 flex h-4 w-4 items-center justify-center rounded-full bg-[#1A1A1A] text-[9px] font-bold text-[#C5A880] tabular-nums">
                  {toPersianDigits(totalBagCount)}
                </span>
              )}
            </div>
            <span className="text-[10px] font-semibold">سبد خرید</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setDashboardInitialTab('orders');
              setIsDashboardOpen(true);
            }}
            className="flex flex-col items-center justify-center gap-1 py-1 text-[#4A4640] hover:text-[#1A1A1A] active:scale-95 transition-transform cursor-pointer"
          >
            <User className="h-5 w-5" strokeWidth={1.7} />
            <span className="text-[10px] font-semibold">حساب من</span>
          </button>
        </div>
      </nav>

      {/* FLOATING WHATSAPP SUPPORT WIDGET */}
      <a
        href={buildWhatsAppSupportUrl()}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="پشتیبانی آنلاین واتساپ فیکس لایف"
        className="fixed bottom-20 lg:bottom-6 right-4 sm:right-6 z-40 group flex items-center gap-2.5 rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white pl-4 pr-3 py-2.5 shadow-xl transition-all duration-200 hover:scale-105"
      >
        <span className="relative flex h-6 w-6 items-center justify-center">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-35" />
          <MessageCircle className="relative h-5 w-5 fill-white text-[#25D366]" />
        </span>
        <span className="text-xs font-bold whitespace-nowrap">
          پشتیبانی و مشاوره واتساپ
        </span>
      </a>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 lg:bottom-5 left-4 right-4 sm:right-auto sm:left-5 z-50 flex items-center gap-2.5 rounded-xl lg:rounded-none border border-[#C5A880] bg-[#1A1A1A] px-5 py-3.5 text-xs text-white shadow-xl transition-all"
        >
          <CheckCircle2 className="h-4 w-4 text-[#C5A880] shrink-0" />
          <span>{toast}</span>
        </div>
      )}
    </div>
  );
}
