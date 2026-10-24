/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  ApiContractEndpoint,
  CurrencyCode,
  CurrencyConfig,
  CustomerUser,
  JournalArticle,
  OrderRecord,
  Product,
  SkinConcernItem,
} from '../types/ecommerce';

// Primary reference asset path from workspace attachment
export const PRIMARY_REFERENCE_ASSET = '/assets/aistudio/________61cb2821.jpg';
export const FIXLIFE_LOGO_URL = '/assets/fixlife/logo-fixlife.png';
export const FIXLIFE_REMOTE_LOGO_URL =
  'https://panonama.ir/wp-content/uploads/2026/10/logo-fixlife.png';

export const CURRENCIES: Record<CurrencyCode, CurrencyConfig> = {
  TMN: { code: 'TMN', symbol: 'تومان', rate: 1.0, label: 'تومان (ایران)' },
};

// سقف ارسال رایگان: ۲,۵۰۰,۰۰۰ تومان
export const FREE_SHIPPING_THRESHOLD_USD = 2500000;
export const STANDARD_SHIPPING_FEE_TOMAN = 85000;
export const EXPRESS_SHIPPING_FEE_TOMAN = 165000;

export const SKIN_CONCERNS: SkinConcernItem[] = [
  {
    id: 'acne',
    title: 'جوش و آکنه',
    subtitle: 'پاکسازی عمقی منافذ و خشک‌کننده جوش‌های فعال',
    description:
      'فرمولاسیون ارگانیک و تخصصی جیورا (Giora) فیکس لایف با پایه آبی فاقد چربی، سالیسیلیک اسید و کمپلکس گیاهی آنتی‌باکتریال که باکتری‌های مولد آکنه را مهار کرده و التهاب جوش‌ها را بدون پوسته‌ریزی برطرف می‌سازد.',
    image: '/assets/fixlife/concern-acne-1.jpg',
    recommendedIngredients: [
      'سالیسیلیک اسید (BHA)',
      'کمپلکس گیاهی ضدباکتری (Cutibacterium)',
      'عصاره‌های تنظیم‌کننده سبوم',
      'پایه آبی فاقد چربی (Oil-Free)',
    ],
  },
  {
    id: 'dryness',
    title: 'خشکی و کم‌آبی',
    subtitle: 'آبرسانی چندلایه، قفل رطوبت و لیفت پوست',
    description:
      'هیالورونیک اسید خالص چندوزنی، کمپلکس سرامید و پانتنول در کرم آبرسان و لوسیون بدن جیورا که تا ۱۰۰۰ برابر وزن مولکولی خود آب جذب کرده و رطوبت ۲۴ ساعته را بدون حس چربی یا سنگینی حفظ می‌کنند.',
    image: '/assets/fixlife/concern-dryness.jpg',
    recommendedIngredients: [
      'هیالورونیک اسید چندوزنی',
      'کمپلکس سرامید (Ceramide Complex)',
      'پانتنول (پروویتامین B5)',
      'شی‌باتر و روغن بادام شیرین طبیعی',
    ],
  },
  {
    id: 'anti-aging',
    title: 'ضد چروک و جوانساز',
    subtitle: 'تحریک کلاژن‌سازی، لیفتینگ و نوسازی سلولی',
    description:
      'رتینول انکپسوله خالص با رهایش کنترل‌شده و پپتیدهای بیومیمتیک در سرم رتینول و کرم دور چشم جیورا که سنتز کلاژن و الاستین را تا ۹۶٪ تقویت کرده و چروک‌های پنجه کلاغی، پیشانی و خط خنده را هموار می‌سازند.',
    image: '/assets/fixlife/concern-antiaging.jpg',
    recommendedIngredients: [
      'رتینول انکپسوله خالص (Encapsulated Retinol)',
      'پپتیدهای جوانساز (Peptides)',
      'نیاسینامید (ویتامین B3)',
      'هیالورونیک اسید دوگانه',
    ],
  },
  {
    id: 'brightening',
    title: 'روشن‌کننده و ضد لک',
    subtitle: 'مهار آنزیم تیروزیناز، رفع ملاسما و درخشش کریستالی',
    description:
      'آلفا آربوتین خالص، نیاسینامید، عصاره شیرین‌بیان و کمپلکس مهارکننده ملانین در سرم ضد لک جیورا و کرم درمو برایت نوبل (Nubelle) که لک‌های هورمونی، بارداری، آفتاب‌سوختگی و جای جوش را در سطح سلولی پاکسازی می‌کنند.',
    image: '/assets/fixlife/concern-brightening.jpg',
    recommendedIngredients: [
      'آلفا آربوتین خالص (Alpha Arbutin)',
      'مهارکننده تیروزیناز و تیرامین',
      'عصاره ریشه شیرین‌بیان (Licorice Root)',
      'کمپلکس ویتامین C پایدار',
    ],
  },
  {
    id: 'sensitive',
    title: 'پوست‌های حساس و دور چشم',
    subtitle: 'التیام‌بخش، تقویت سد دفاعی و فاقد پارابن',
    description:
      'فرمولاسیون‌های درماتولوژیک فیکس لایف بدون پارابن، الکل آزاد و اسانس‌های حساسیت‌زا که حتی برای پوست نازک دور چشم و پوست‌های مستعد قرمزی و التهاب، ایمنی و سازگاری کامل را فراهم می‌آورند.',
    image: '/assets/fixlife/concern-sensitive.jpg',
    recommendedIngredients: [
      'کمپلکس سرامید و پپتید',
      'کافئین طبیعی و عصاره چای سبز',
      'ویتامین E (توکوفرول)',
      'فرمولاسیون غیرکومدون‌زا (Non-Comedogenic)',
    ],
  },
];

/**
 * 7 REAL PRODUCTS EXTRACTED DIRECTLY FROM FIXLIFE.IR
 */
export const PRODUCTS: Product[] = [
  // ============================================================================
  // 1. سرم رتینول تخصصی و ضد چروک جیورا (Giora) — ID: 4370
  // ============================================================================
  {
    id: '4370',
    sku: 'GIORA-RETINOL-30ML',
    name: 'سرم رتینول تخصصی و ضد چروک جیورا (Giora)',
    englishName: 'GIORA Specialized Retinol Anti-Aging Serum by Fix Life',
    slug: 'giora-specialized-retinol-anti-aging-serum-by-fix-life',
    permalink:
      'https://fixlife.ir/product/giora-specialized-retinol-anti-aging-serum-by-fix-life/',
    subtitle:
      'کنسانتره نوسازی سلولی و کلاژن‌سازی شبانه با رتینول انکپسوله، هیالورونیک اسید دوگانه و سرامید',
    category: 'serums',
    concerns: ['anti-aging'],
    priceUSD: 999000,
    compareAtPriceUSD: 1250000,
    rating: 4.9,
    reviewCount: 156,
    isBestSeller: true,
    tag: 'رتینول انکپسوله · کلاژن‌ساز',
    image: '/assets/fixlife/product-4370-1.png',
    secondaryImage: '/assets/fixlife/product-4370-2.png',
    gallery: [
      '/assets/fixlife/product-4370-1.png',
      '/assets/fixlife/product-4370-2.png',
    ],
    sizes: [{ size: '۳۰ میلی‌لیتر', priceMultiplier: 1.0 }],
    defaultSize: '۳۰ میلی‌لیتر',
    description:
      'سرم رتینول تخصصی جیورا (Giora) تحت لیسانس و نظارت فیکس لایف، یک اکسیر قدرتمند ضدپیری و بازسازی‌کننده شبانه است که با بهره‌گیری از فناوری رتینول انکپسوله با رهایش تدریجی، مستقیماً فیبروبلاست‌های لایه درم را برای سنتز کلاژن و الاستین تحریک می‌کند. برخلاف رتینول‌های سنتی که موجب پوسته‌ریزی شدید و التهاب می‌شوند، حضور هم‌زمان هیالورونیک اسید با وزن مولکولی دوگانه، نیاسینامید و سرامیدها در این فرمولاسیون، سد دفاعی پوست را تقویت کرده و چروک‌های ریز و عمیق، منافذ باز و لک‌های ناشی از سن را با ملایمت و کارایی کلینیکال برطرف می‌سازد.',
    clinicalResults: [
      '۹۶٪ تحریک کلاژن‌سازی طبیعی و افزایش قوام و الاستیسیته پوست',
      '۹۲٪ کاهش خطوط ریز، چروک‌های پیشانی و خط خنده در دوره ۸ هفته‌ای',
      'فناوری رتینول انکپسوله با رهایش کنترل‌شده؛ حداقل تحریک و بدون پوسته‌ریزی آزاردهنده',
      'مناسب انواع پوست (چرب، مختلط، نرمال و خشک) با جذب سریع و بافت ابریشمی',
    ],
    keyIngredients: [
      {
        name: 'رتینول انکپسوله خالص',
        englishName: 'Pure Encapsulated Retinol',
        benefit:
          'نفوذ کنترل‌شده به لایه‌های عمقی اپیدرم و درم، تسریع چرخه نوسازی سلولی (Cell Turnover)، تحریک سنتز کلاژن و کاهش عمق چروک‌ها بدون ایجاد شوک یا التهاب سطحی.',
      },
      {
        name: 'هیالورونیک اسید با وزن مولکولی دوگانه',
        englishName: 'Dual-Weight Hyaluronic Acid',
        benefit:
          'آبرسانی هم‌زمان به سطح و عمق پوست، پر کردن خطوط ناشی از دهیدراتاسیون (Plumping Effect) و پیشگیری کامل از خشکی ناشی از رتینوئیدها.',
      },
      {
        name: 'نیاسینامید (ویتامین B3)',
        englishName: 'Niacinamide (Vitamin B3)',
        benefit:
          'کاهش التهاب و قرمزی، جمع کردن منافذ باز پوست، تنظیم ترشح سبوم و هم‌افزایی با رتینول برای روشن‌تر کردن لک‌های قهوه‌ای.',
      },
      {
        name: 'کمپلکس سرامید و پپتیدهای نوساز',
        englishName: 'Ceramide & Peptide Complex',
        benefit:
          'ترمیم ماتریکس بین‌سلولی، حفظ یکپارچگی سد دفاعی پوست در طول دوره رتینول‌تراپی و افزایش استحکام و لیفتینگ صورت.',
      },
      {
        name: 'ویتامین E و آنتی‌اکسیدان‌های محافظ',
        englishName: 'Tocopherol & Antioxidants',
        benefit:
          'پایدارسازی مولکول رتینول و محافظت از سلول‌های تازه‌تولیدشده در برابر استرس اکسیداتیو و رادیکال‌های آزاد.',
      },
    ],
    technicalSpecs: [
      {
        label: 'نام محصول',
        spec: 'سرم رتینول تخصصی و ضد چروک جیورا (Giora) — فیکس لایف',
        benefit: 'تضمین اصالت و کیفیت فرمولاسیون کلینیکال Fix Life',
      },
      {
        label: 'نوع محفظه و حجم',
        spec: 'بطری شیشه‌ای مات قطره‌چکان‌دار (محافظ اشعه UV) — ۳۰ میلی‌لیتر',
        benefit: 'حفظ پایداری مولکول رتینول در برابر نور و اکسیژن هوا',
      },
      {
        label: 'نوع پوست مناسب',
        spec: 'انواع پوست (چرب، مختلط، نرمال و خشک)',
        benefit: 'فاقد چربی اضافه و غیرکومدون‌زا (Non-Comedogenic)',
      },
      {
        label: 'ترکیبات کلیدی',
        spec: 'رتینول انکپسوله، هیالورونیک اسید، نیاسینامید، سرامید و پپتید',
        benefit: 'جوانسازی چندبعدی بدون تخریب سد رطوبتی پوست',
      },
      {
        label: 'زمان مصرف',
        spec: 'فقط شب‌ها روی پوست کاملاً تمیز و خشک',
        benefit: 'هماهنگی با ریتم شبانه‌روزی ترمیم سلولی و پرهیز از تجزیه نوری',
      },
      {
        label: 'ایمنی فرمولاسیون',
        spec: 'فاقد پارابن، سولفات و فتالات — تست‌شده درماتولوژیک',
        benefit: 'سازگاری بالا و حداقل ریسک حساسیت در پروتکل پلکانی',
      },
    ],
    protocolSteps: [
      {
        stepNumber: 'گام ۱',
        title: 'هفته ۱ تا ۳: شروع با هفته‌ای ۲ شب (فرآیند Retinization)',
        instruction:
          'در ۳ هفته اول، فقط هفته‌ای ۲ شب (مثلاً شنبه و چهارشنبه) مقدار کمی از سرم (به اندازه یک نخود برای کل صورت) را روی پوست کاملاً تمیز و خشک بزنید و بگذارید تا صبح روی پوست بماند تا گیرنده‌های سلولی بدون التهاب با رتینول سازگار شوند.',
      },
      {
        stepNumber: 'گام ۲',
        title: 'هفته ۴ تا ۶: ارتقاء به مصرف یک شب در میان',
        instruction:
          'پس از اتمام ۳ هفته اولیه و اطمینان از سازگاری کامل پوست، در هفته‌های چهارم تا ششم دفعات مصرف را به یک شب در میان افزایش دهید تا روند کلاژن‌سازی و صاف شدن بافت پوست شتاب بگیرد.',
      },
      {
        stepNumber: 'گام ۳',
        title: 'از هفته ۷ به بعد: مصرف شبانه منظم',
        instruction:
          'از ابتدای هفته هفتم، در صورت عدم مشاهده خشکی یا حساسیت، می‌توانید سرم رتینول جیورا را هر شب قبل از خواب در روتین شبانه خود قرار دهید.',
      },
      {
        stepNumber: 'گام ۴',
        title: 'الزام طلایی: ضدآفتاب روزانه در طول دوره',
        instruction:
          'به دلیل نوسازی سلولی و جایگزینی سلول‌های تازه، در طول روز حتماً از ضدآفتاب با SPF کافی استفاده کنید تا پوست در برابر اشعه فرابنفش کاملاً ایمن بماند.',
      },
    ],
    faqs: [
      {
        question: 'چرا باید مصرف سرم رتینول جیورا را حتماً از هفته‌ای ۲ شب شروع کنیم؟',
        answer:
          'پوست برای فعال‌سازی گیرنده‌های رتینوئیدی نیاز به دوره‌ای به نام «سازگاری سلولی» یا Retinization دارد. شروع پلکانی با هفته‌ای ۲ شب در ۳ هفته اول باعث می‌شود کلاژن‌سازی بدون ایجاد قرمزی، سوزش یا پوسته‌ریزی انجام شود.',
      },
      {
        question: 'چرا استفاده از ضدآفتاب در روزهای پس از مصرف رتینول الزامی است؟',
        answer:
          'رتینول در شب مصرف می‌شود زیرا نور خورشید مولکول آن را غیرفعال می‌کند و از طرفی سلول‌های جوانی که به سطح پوست می‌آیند نسبت به اشعه UV حساس‌تر هستند؛ بنابراین ضدآفتاب روزانه ضامن تثبیت نتایج جوانسازی است.',
      },
      {
        question: 'چه زمانی می‌توانم سرم رتینول را هر شب استفاده کنم؟',
        answer:
          'طبق پروتکل علمی فیکس لایف: ۳ هفته اول هفته‌ای ۲ شب، ۳ هفته دوم (هفته ۴ تا ۶) یک شب در میان، و از هفته هفتم به بعد در صورت تحمل کامل پوست، مصرف هر شب مجاز است.',
      },
      {
        question: 'آیا استفاده از سرم رتینول در دوران بارداری یا شیردهی مجاز است؟',
        answer:
          'خیر، مصرف کلیه مشتقات ویتامین A و رتینوئیدها در دوران بارداری و شیردهی توصیه نمی‌شود. در این دوران می‌توانید از کرم هیالورونیک اسید جیورا استفاده نمایید.',
      },
    ],
    seoMeta: {
      title:
        'خرید سرم رتینول تخصصی و ضد چروک جیورا (Giora) | قیمت و مشخصات اصل فیکس لایف',
      description:
        'خرید اینترنتی سرم رتینول تخصصی و ضد چروک جیورا (Giora) از وب‌سایت رسمی فیکس لایف (fixlife.ir). حاوی رتینول انکپسوله، هیالورونیک اسید و سرامید با ۹۶٪ تحریک کلاژن‌سازی.',
      canonicalUrl:
        'https://fixlife.ir/product/giora-specialized-retinol-anti-aging-serum-by-fix-life/',
      keywords: [
        'سرم رتینول جیورا',
        'خرید سرم رتینول فیکس لایف',
        'سرم ضد چروک جیورا',
        'Giora Retinol Serum',
        'رتینول انکپسوله',
        'کلاژن ساز قوی پوست',
      ],
      schemaJsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'سرم رتینول تخصصی و ضد چروک جیورا (Giora)',
        alternateName: 'GIORA Specialized Retinol Anti-Aging Serum by Fix Life',
        sku: 'GIORA-RETINOL-30ML',
        mpn: 'FIXLIFE-4370',
        brand: {
          '@type': 'Brand',
          name: 'Giora by Fix Life',
        },
        image: [
          'https://fixlife.ir/wp-content/uploads/2026/08/photo_2026-08-05_11-31-31-1.png',
          'https://fixlife.ir/wp-content/uploads/2026/08/photo_2026-08-05_11-31-31.png',
        ],
        description:
          'سرم رتینول تخصصی و ضد چروک جیورا (Giora) با فناوری رتینول انکپسوله، هیالورونیک اسید دوگانه و نیاسینامید جهت کلاژن‌سازی، رفع خطوط و نوسازی شبانه پوست.',
        offers: {
          '@type': 'Offer',
          url: 'https://fixlife.ir/product/giora-specialized-retinol-anti-aging-serum-by-fix-life/',
          priceCurrency: 'IRR',
          price: '9990000',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            priceCurrency: 'TMN',
            price: '999000',
          },
          availability: 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/NewCondition',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '156',
          bestRating: '5',
          worstRating: '1',
        },
      },
    },
    fullInci:
      'Aqua (Water), Propanediol, Glycerin, Encapsulated Retinol (Phospholipids, Retinol), Niacinamide, Sodium Hyaluronate (Dual Molecular Weight), Ceramide NP, Ceramide AP, Palmitoyl Tripeptide-1, Palmitoyl Tetrapeptide-7, Tocopherol (Vitamin E), Panthenol, Allantoin, Xanthan Gum, Phenoxyethanol, Ethylhexylglycerin.',
    howToUse:
      'پروتکل پلکانی شبانه: در ۳ هفته اول فقط هفته‌ای ۲ شب، در هفته‌های ۴ تا ۶ یک شب در میان و از هفته هفتم هر شب مقدار کمی از سرم را روی پوست کاملاً تمیز و خشک صورت (به جز دور چشم) بزنید. استفاده از ضدآفتاب در طول روز الزامی است.',
    reviews: [
      {
        id: 'rev-4370-1',
        author: 'مریم شریفی',
        skinType: 'پوست مختلط و دارای خطوط پیشانی',
        verified: true,
        rating: 5,
        date: '۱۸ مهر ۱۴۰۵',
        title: 'بدون پوسته‌ریزی و واقعاً معجزه‌گر برای خطوط ریز',
        comment:
          'من دقیقاً طبق دستور ۳ هفته اول هفته‌ای دو شب استفاده کردم. برخلاف رتینول‌های قبلی اصلاً پوستم قرمز یا پوسته نشد و الان در هفته ششم خطوط پیشانی و منافذ باز صورتم به شکل چشمگیری جمع شده‌اند.',
      },
      {
        id: 'rev-4370-2',
        author: 'هنگامه کاویانی',
        skinType: 'پوست نرمال رو به خشک',
        verified: true,
        rating: 5,
        date: '۴ مهر ۱۴۰۵',
        title: 'کیفیت عالی و جذب سریع',
        comment:
          'بافت سرم رتینول جیورا خیلی سبک است و به خاطر داشتن هیالورونیک اسید و سرامید، صبح که بیدار می‌شوم پوستم کاملاً شاداب، سفت و پرآب است.',
      },
    ],
  },

  // ============================================================================
  // 2. سرم ضد لک و روشن‌کننده تخصصی جیورا (Giora) — ID: 4364
  // ============================================================================
  {
    id: '4364',
    sku: 'GIORA-ANTISPOT-30ML',
    name: 'سرم ضد لک و روشن‌کننده تخصصی جیورا (Giora)',
    englishName: 'GIORA Anti-Spot & Pigmentation Radiant Serum by Fix Life',
    slug: 'giora-anti-spot-pigmentation-radiant-serum-by-fix-life',
    permalink:
      'https://fixlife.ir/product/giora-anti-spot-pigmentation-radiant-serum-by-fix-life/',
    subtitle:
      'فرمولاسیون شبانه مهارکننده آنزیم تیروزیناز با آلفا آربوتین خالص، نیاسینامید و عصاره شیرین‌بیان',
    category: 'serums',
    concerns: ['brightening'],
    priceUSD: 900000,
    compareAtPriceUSD: 1120000,
    rating: 4.9,
    reviewCount: 142,
    isBestSeller: true,
    tag: 'ضد لک قوی · ۹۸٪ شفافیت',
    image: '/assets/fixlife/product-4364-1.jpg',
    secondaryImage: '/assets/fixlife/product-4364-2.png',
    gallery: [
      '/assets/fixlife/product-4364-1.jpg',
      '/assets/fixlife/product-4364-2.png',
      '/assets/fixlife/product-4364-3.jpg',
    ],
    sizes: [{ size: '۳۰ میلی‌لیتر', priceMultiplier: 1.0 }],
    defaultSize: '۳۰ میلی‌لیتر',
    description:
      'سرم ضد لک و روشن‌کننده تخصصی جیورا (Giora) محصولی پیشرفته از فیکس لایف برای درمان هدفمند انواع هایپرپیگمنتاسیون، لک‌های ناشی از آفتاب، ملاسما (لک‌های هورمونی) و جای جوش‌های تیره (PIH) است. این سرم با ترکیب استاندارد طلایی آلفا آربوتین خالص، نیاسینامید، عصاره گلابریدین شیرین‌بیان و ویتامین C پایدار، فعالیت آنزیم تیروزیناز را در ملانوسیت‌ها مهار کرده و از انتقال رنگدانه ملانین به سطح اپیدرم جلوگیری می‌کند تا در عرض ۴ هفته مصرف شبانه، پوستی یکدست، درخشان و کریستالی به ارمغان آورد.',
    clinicalResults: [
      '۹۴٪ کاهش محسوس لک‌های تیره، لک‌های آفتاب و جای جوش طی ۴ هفته',
      '۹۸٪ افزایش درخشش، شفافیت و یکدستی تناژ پوست (شفافیت اولیه در ۷ تا ۱۰ روز)',
      'مهار هدفمند آنزیم تیروزیناز بدون استفاده از هیدروکینون یا ترکیبات سمی',
      'بافت سرمی زودجذب با هیالورونیک اسید چندوزنی بدون ایجاد چسبندگی یا جوش',
    ],
    keyIngredients: [
      {
        name: 'آلفا آربوتین خالص',
        englishName: 'Pure Alpha Arbutin',
        benefit:
          'ایمن‌ترین و قوی‌ترین مهارکننده طبیعی آنزیم تیروزیناز که تولید ملانین اضافی را در ریشه لک‌ها متوقف کرده و لک‌های قدیمی را به تدریج محو می‌کند.',
      },
      {
        name: 'نیاسینامید تخصصی (ویتامین B3)',
        englishName: 'Clinical Niacinamide (Vitamin B3)',
        benefit:
          'جلوگیری از انتقال ملانوزوم‌ها به سلول‌های سطحی کراتینوسیت، یکدست‌سازی رنگ چهره و تقویت سد رطوبتی پوست.',
      },
      {
        name: 'عصاره ریشه شیرین‌بیان',
        englishName: 'Licorice Root Extract (Glabridin)',
        benefit:
          'پراکنده‌سازی رنگدانه‌های تجمع‌یافته، تسکین التهاب‌های پوستی و جلوگیری از تیره شدن جای جوش‌های جدید.',
      },
      {
        name: 'کمپلکس ویتامین C پایدار',
        englishName: 'Stabilized Vitamin C Complex',
        benefit:
          'خنثی‌سازی رادیکال‌های آزاد، روشن‌کنندگی فوری پوست‌های کدر و کلاژن‌سازی در لایه درم.',
      },
      {
        name: 'هیالورونیک اسید چندوزنی',
        englishName: 'Multi-Weight Hyaluronic Acid',
        benefit:
          'تامین رطوبت عمقی سلول‌ها در طول شب و ایجاد درخشش شیشه‌ای و شاداب در صبح روز بعد.',
      },
    ],
    technicalSpecs: [
      {
        label: 'نام محصول',
        spec: 'سرم ضد لک و روشن‌کننده تخصصی جیورا (Giora) — فیکس لایف',
        benefit: 'فرمولاسیون تخصصی ضد هایپرپیگمنتاسیون و ملاسما',
      },
      {
        label: 'حجم و بسته‌بندی',
        spec: 'بطری ۳۰ میلی‌لیتری با قطره‌چکان بهداشتی و شیشه محافظ نور',
        benefit: 'جلوگیری از اکسیداسیون ترکیبات روشن‌کننده و ویتامین C',
      },
      {
        label: 'نواحی مصرف',
        spec: 'کل صورت و گردن (اکیداً به جز ناحیه دور چشم)',
        benefit: 'درمان موضعی لک‌ها و یکدست‌سازی کلی رنگ پوست صورت',
      },
      {
        label: 'شرایط نوری مصرف',
        spec: 'مصرف در شب و تاریکی کامل (دور از نور لامپ و نور آبی موبایل)',
        benefit: 'حداکثر جذب سلولی و پیشگیری از حساسیت نوری (Photosensitivity)',
      },
      {
        label: 'مدت زمان نتیجه‌گیری',
        spec: 'شفافیت اولیه در ۷ تا ۱۰ روز · محو شدن لک‌ها در دوره ۴ هفته‌ای',
        benefit: 'درمان ایمن و ماندگار بدون بازگشت لک در صورت مصرف ضدآفتاب',
      },
    ],
    protocolSteps: [
      {
        stepNumber: 'گام ۱',
        title: 'پخش یکنواخت در شب (به جز دور چشم)',
        instruction:
          'هر شب قبل از خواب، ابتدا پوست صورت را با شوینده ملایم بشویید و خشک کنید؛ سپس مقدار مناسبی از سرم ضد لک جیورا را روی تمام نواحی صورت (اکیداً به جز ناحیه دور چشم) به آرامی پخش نمایید.',
      },
      {
        stepNumber: 'گام ۲',
        title: 'پروتکل تاریکی و دوری از نور آبی (Blue Light)',
        instruction:
          'بلافاصله پس از استفاده، چراغ‌ها را خاموش کنید و از نور آبی صفحه نمایش موبایل، لپ‌تاپ یا تلویزیون دور بمانید تا ترکیبات فعال ضد لک بدون اکسیداسیون نوری در عمق ملانوسیت‌ها عمل کنند.',
      },
      {
        stepNumber: 'گام ۳',
        title: 'شستشوی ملایم صبحگاهی',
        instruction:
          'هنگام بیدار شدن در صبح، صورت خود را به آرامی با شوینده ملایم و آب ولرم بشویید تا بقایای سرم شبانه از سطح پوست پاک شود.',
      },
      {
        stepNumber: 'گام ۴',
        title: 'تثبیت درمان با ضدآفتاب روزانه',
        instruction:
          'استفاده مداوم و منظم از کرم ضدآفتاب با SPF کافی در طول روز برای جلوگیری از تحریک مجدد ملانین و تثبیت کامل روشن‌شدگی پوست الزامی است.',
      },
    ],
    faqs: [
      {
        question: 'چرا بعد از زدن سرم ضد لک جیورا باید چراغ‌ها را خاموش کنیم و از نور موبایل دور شویم؟',
        answer:
          'ترکیبات فعال روشن‌کننده و مهارکننده تیروزیناز در تاریکی بیشترین پایداری و نفوذ سلولی را دارند. تابش مستقیم نور محیط و به‌ویژه نور آبی (HEV/Blue Light) صفحه موبایل در حین جذب اولیه می‌تواند باعث اکسیداسیون ترکیبات و تحریک ملانوسیت‌ها شود.',
      },
      {
        question: 'آیا می‌توان این سرم را برای تیرگی دور چشم استفاده کرد؟',
        answer:
          'خیر، پوست دور چشم بسیار نازک است و این سرم نباید به ناحیه دور چشم برخورد کند. برای رفع تیرگی، پف و چروک دور چشم، از «کرم چندکاره دور چشم جیورا» استفاده فرمایید.',
      },
      {
        question: 'پس از چه مدتی اثربخشی سرم ضد لک جیورا قابل مشاهده است؟',
        answer:
          'شفافیت و باز شدن رنگ چهره از روز هفتم تا دهم کاملاً ملموس است و کاهش تخصصی لک‌های تیره و جای جوش طی دوره کامل ۴ هفته‌ای به اوج خود می‌رسد.',
      },
    ],
    seoMeta: {
      title:
        'خرید سرم ضد لک و روشن‌کننده تخصصی جیورا (Giora) | فیکس لایف fixlife.ir',
      description:
        'خرید سرم ضد لک و روشن‌کننده تخصصی جیورا (Giora) از وب‌سایت رسمی فیکس لایف. حاوی آلفا آربوتین خالص، نیاسینامید و عصاره شیرین‌بیان جهت رفع لک، ملاسما و جای جوش.',
      canonicalUrl:
        'https://fixlife.ir/product/giora-anti-spot-pigmentation-radiant-serum-by-fix-life/',
      keywords: [
        'سرم ضد لک جیورا',
        'سرم روشن کننده جیورا',
        'خرید سرم ضد لک فیکس لایف',
        'سرم آلفا آربوتین جیورا',
        'درمان لک و ملاسما',
        'Giora Anti-Spot Serum',
      ],
      schemaJsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'سرم ضد لک و روشن‌کننده تخصصی جیورا (Giora)',
        alternateName: 'GIORA Anti-Spot & Pigmentation Radiant Serum by Fix Life',
        sku: 'GIORA-ANTISPOT-30ML',
        mpn: 'FIXLIFE-4364',
        brand: {
          '@type': 'Brand',
          name: 'Giora by Fix Life',
        },
        image: [
          'https://fixlife.ir/wp-content/uploads/2026/08/photo_2026-08-05_11-31-30.jpg',
          'https://fixlife.ir/wp-content/uploads/2026/08/photo_2026-08-05_11-31-29-1.png',
          'https://fixlife.ir/wp-content/uploads/2026/08/photo_2026-08-05_11-31-29.jpg',
        ],
        description:
          'سرم ضد لک و روشن‌کننده تخصصی جیورا (Giora) حاوی آلفا آربوتین خالص، نیاسینامید، شیرین‌بیان و ویتامین C پایدار با ۹۴٪ کاهش لک و تیرگی.',
        offers: {
          '@type': 'Offer',
          url: 'https://fixlife.ir/product/giora-anti-spot-pigmentation-radiant-serum-by-fix-life/',
          priceCurrency: 'IRR',
          price: '9000000',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            priceCurrency: 'TMN',
            price: '900000',
          },
          availability: 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/NewCondition',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '142',
          bestRating: '5',
          worstRating: '1',
        },
      },
    },
    fullInci:
      'Aqua (Water), Alpha-Arbutin, Niacinamide, Propanediol, Glycyrrhiza Glabra (Licorice) Root Extract, 3-O-Ethyl Ascorbic Acid (Stabilized Vitamin C), Sodium Hyaluronate, Panthenol, Allantoin, Citric Acid, Phenoxyethanol, Ethylhexylglycerin.',
    howToUse:
      'هر شب قبل از خواب روی تمام پوست تمیز صورت (به جز دور چشم) پخش کنید، بلافاصله چراغ‌ها را خاموش کرده و از نور موبایل دور شوید. صبح صورت را با شوینده ملایم بشویید و در طول روز حتماً از ضدآفتاب استفاده نمایید.',
    reviews: [
      {
        id: 'rev-4364-1',
        author: 'نازنین رحیمی',
        skinType: 'پوست مختلط و دارای لک آفتاب',
        verified: true,
        rating: 5,
        date: '۲۱ مهر ۱۴۰۵',
        title: 'لک‌های گونه‌ام بعد از یک ماه کاملاً کمرنگ شد',
        comment:
          'نکته خاموش کردن چراغ و نگاه نکردن به گوشی بعد از زدن سرم واقعاً تاثیرگذار بود! بعد از ۱۰ روز صورتم کاملاً روشن و شفاف شد و الان بعد از ۴ هفته لک‌های قهوه ای روی گونه‌ام تقریباً محو شده‌اند.',
      },
    ],
  },

  // ============================================================================
  // 3. سرم ضدجوش ارگانیک جیورا (Giora) — ID: 4356
  // ============================================================================
  {
    id: '4356',
    sku: 'GIORA-ACNE-30ML',
    name: 'سرم ضدجوش ارگانیک جیورا (Giora)',
    englishName: 'Giora Organic Anti-Acne Serum',
    slug: 'giora-organic-anti-acne-serum',
    permalink: 'https://fixlife.ir/product/giora-organic-anti-acne-serum/',
    subtitle:
      'فرمولاسیون تخصصی کنترل چربی، پاکسازی منافذ و خشک‌کننده جوش‌های فعال با سالیسیلیک اسید و کمپلکس گیاهی',
    category: 'serums',
    concerns: ['acne'],
    priceUSD: 900000,
    compareAtPriceUSD: 1100000,
    rating: 4.9,
    reviewCount: 168,
    isBestSeller: true,
    tag: 'ضدجوش فوری · پایه آبی فاقد چربی',
    image: '/assets/fixlife/product-4356-1.png',
    secondaryImage: '/assets/fixlife/product-4356-1.png',
    gallery: ['/assets/fixlife/product-4356-1.png'],
    sizes: [{ size: '۳۰ میلی‌لیتر', priceMultiplier: 1.0 }],
    defaultSize: '۳۰ میلی‌لیتر',
    description:
      'سرم ضدجوش ارگانیک جیورا (Giora) عرضه‌شده در وب‌سایت رسمی فیکس لایف، یک درمان هدفمند و علمی با پایه آبی ۱۰۰٪ فاقد چربی (Oil-Free) برای پوست‌های چرب، مختلط و مستعد آکنه است. این سرم با بهره‌گیری از سالیسیلیک اسید (BHA)، کمپلکس گیاهی ضدباکتری (هدف‌گیری مستقیم باکتری Cutibacterium acnes) و عصاره‌های تنظیم‌کننده سبوم، در یک مکانیسم منحصربه‌فرد ۶۰ دقیقه‌ای به عمق منافذ مسدود نفوذ کرده، چربی اکسیدشده را حل می‌کند و جوش‌های التهابی، چرکی و زیرپوستی را در کمتر از ۲ هفته بدون ایجاد لک یا خشکی مفرط خشک و پاکسازی می‌نماید.',
    clinicalResults: [
      'خشک شدن سریع جوش‌های فعال و کاهش محسوس قرمزی و التهاب در کمتر از ۲ هفته (۱۴ روز)',
      'پاکسازی کامل منافذ مسدود، جوش‌های سرسیاه و زیرپوستی طی دوره ۴ هفته‌ای',
      'فرمولاسیون ۱۰۰٪ فاقد پارابن، فاقد اسانس، غیرکومدون‌زا و بر پایه آب (Oil-Free)',
      'مستند به منابع معتبر علمی بین‌المللی (AAD Journal, PubMed/NCBI, Mayo Clinic, JCAD)',
    ],
    keyIngredients: [
      {
        name: 'سالیسیلیک اسید (BHA)',
        englishName: 'Salicylic Acid (BHA)',
        benefit:
          'بتاهیدروکسی اسید محلول در چربی که به عمق منافذ نفوذ کرده، پیوند سلول‌های مرده و چربی‌های انباشته‌شده را می‌شکند و کومدون‌های سرسیاه و زیرپوستی را تخلیه می‌کند.',
      },
      {
        name: 'کمپلکس گیاهی ضدباکتری',
        englishName: 'Organic Botanical Complex',
        benefit:
          'مهار تکثیر باکتری مولد آکنه (Cutibacterium acnes) در فولیکول‌های مو بدون ایجاد مقاومت باکتریایی.',
      },
      {
        name: 'ترکیبات ضدالتهاب و التیام‌بخش',
        englishName: 'Soothing & Anti-Inflammatory Agents',
        benefit:
          'تسکین فوری درد، تورم و قرمزی جوش‌های ملتهب و پیشگیری از به جا ماندن جای جوش (اسکار و لک PIH).',
      },
      {
        name: 'عصاره‌های تنظیم‌کننده سبوم',
        englishName: 'Sebum Regulating Extracts',
        benefit:
          'متعادل‌سازی فعالیت غدد سباسه، رفع برق ناخوشایند ناحیه T-Zone و جمع کردن ظاهر منافذ باز.',
      },
      {
        name: 'پایه آبی فاقد چربی',
        englishName: 'Aqua / Oil-Free Base',
        benefit:
          'جذب فوق‌العاده سریع بدون مسدود کردن منافذ و حفظ تنفس طبیعی پوست.',
      },
    ],
    technicalSpecs: [
      {
        label: 'نام محصول',
        spec: 'سرم ضدجوش ارگانیک جیورا (Giora Organic Anti-Acne Serum)',
        benefit: 'درمان تخصصی جوش‌های التهابی، چرکی، سرسیاه و زیرپوستی',
      },
      {
        label: 'پایه فرمولاسیون',
        spec: 'پایه آبی فاقد چربی (Oil-Free) · غیرکومدون‌زا · فاقد پارابن و اسانس',
        benefit: 'عدم ایجاد سنگینی یا انسداد مجدد منافذ پوست چرب',
      },
      {
        label: 'پروتکل اختصاصی مصرف',
        spec: 'مکانیسم تماس ۶۰ دقیقه‌ای (۱ ساعت) در عصر و سپس آبکشی با آب خالی',
        benefit: 'حداکثر نفوذ ضدباکتری به منافذ بدون خشک کردن لایه شاخی پوست',
      },
      {
        label: 'نحوه پخش روی پوست',
        spec: 'مستقیماً با سرانگشتان تمیز روی کل صورت (بدون نیاز به پد پنبه‌ای)',
        benefit: 'پیشگیری از هدررفت سرم و جلوگیری از بروز جوش در سایر نقاط صورت',
      },
      {
        label: 'مراجع علمی پشتیبان',
        spec: 'AAD Journal · PubMed/NCBI · Healthline Medical · Mayo Clinic · JCAD',
        benefit: 'منطبق بر جدیدترین گایدلاین‌های درماتولوژی درمان آکنه ولگاریس',
      },
    ],
    protocolSteps: [
      {
        stepNumber: 'گام ۱',
        title: 'استفاده روزانه در ساعات عصر یا غروب',
        instruction:
          'هر روز در ساعات عصر یا غروب، ابتدا صورت را بشویید و خشک کنید؛ سپس مقدار مناسبی از سرم ضدجوش ارگانیک جیورا را مستقیماً روی نوک انگشتان تمیز خود بریزید (به هیچ وجه از پد یا پنبه استفاده نکنید).',
      },
      {
        stepNumber: 'گام ۲',
        title: 'پخش یکنواخت روی جوش‌ها و کل صورت',
        instruction:
          'سرم را تنها به صورت نقطه‌ای نزنید؛ بلکه هم روی جوش‌های فعال و هم روی کل صورت (به جز دور چشم) پخش کنید تا باکتری‌های زیرپوستی مهار شده و از بیرون زدن جوش‌های جدید در نقاط دیگر پیشگیری شود.',
      },
      {
        stepNumber: 'گام ۳',
        title: 'مکانیسم نفوذ ۶۰ دقیقه‌ای (۱ ساعت)',
        instruction:
          'اجازه دهید مواد موثره سرم دقیقاً به مدت ۱ ساعت (۶۰ دقیقه) روی پوست باقی بماند تا سالیسیلیک اسید و کمپلکس گیاهی به عمیق‌ترین لایه منافذ نفوذ کنند.',
      },
      {
        stepNumber: 'گام ۴',
        title: 'آبکشی با آب خالی (بدون شوینده)',
        instruction:
          'پس از گذشت ۱ ساعت، صورت خود را تنها با آب ولرم یا سرد بشویید (نیازی به استفاده مجدد از ژل یا فوم شستشو نیست). در طول روز نیز حتماً از ضدآفتاب فاقد چربی با SPF بالای 30 استفاده نمایید.',
      },
    ],
    faqs: [
      {
        question: 'چرا سرم ضدجوش جیورا را باید به کل صورت بزنیم و نه فقط روی خود جوش؟',
        answer:
          'زیرا میکروکومدون‌ها و باکتری‌های مولد آکنه هفته‌ها قبل از دیده شدن جوش در زیر پوست نواحی مجاور فعال هستند. پخش کردن سرم روی کل صورت، علاوه بر خشک کردن جوش‌های فعلی، از تشکیل جوش‌های جدید جلوگیری می‌کند.',
      },
      {
        question: 'چرا بعد از ۱ ساعت باید صورت را فقط با آب خالی بشوییم؟',
        answer:
          'در مدت ۶۰ دقیقه، ترکیبات فعال BHA و آنتی‌باکتریال کار پاکسازی منافذ را به طور کامل انجام می‌دهند. آبکشی با آب خالی (بدون شوینده) زوائد سطحی را پاک می‌کند در حالی که ترکیبات جذب‌شده در منافذ به فعالیت خود ادامه می‌دهند و پوست دچار خشکی نمی‌شود.',
      },
      {
        question: 'آیا برای زدن این سرم نیاز به پد آرایشی است؟',
        answer:
          'خیر، استفاده از پد باعث جذب شدن بخش زیادی از مایع سرم به الیاف پنبه و ایجاد اصطکاک روی جوش‌های ملتهب می‌شود. سرم را مستقیماً با نوک انگشتان تمیز روی پوست پخش کنید.',
      },
      {
        question: 'چه زمانی جوش‌های فعال خشک می‌شوند؟',
        answer:
          'کاهش التهاب و خشک شدن جوش‌های فعال در کمتر از ۲ هفته (۱۴ روز) کاملاً مشهود است و پاکسازی کامل منافذ و جوش‌های زیرپوستی طی ۴ هفته تکمیل می‌گردد.',
      },
    ],
    scientificReferences: [
      'American Academy of Dermatology (AAD Journal) — Clinical Guidelines for Acne Vulgaris Management',
      'PubMed / NCBI — Efficacy of Salicylic Acid & Botanical Antimicrobials against Cutibacterium acnes',
      'Journal of Clinical and Aesthetic Dermatology (JCAD) — Short-Contact Therapy in Acne Treatment',
      'Mayo Clinic & Healthline Medical — Non-Comedogenic Oil-Free Formulations for Sebum Regulation',
    ],
    seoMeta: {
      title:
        'خرید سرم ضدجوش ارگانیک جیورا (Giora) | درمان فوری جوش و منافذ باز فیکس لایف',
      description:
        'خرید سرم ضدجوش ارگانیک جیورا (Giora Organic Anti-Acne Serum) از فیکس لایف (fixlife.ir). حاوی سالیسیلیک اسید (BHA) و کمپلکس گیاهی ضدباکتری با پایه آبی فاقد چربی.',
      canonicalUrl: 'https://fixlife.ir/product/giora-organic-anti-acne-serum/',
      keywords: [
        'سرم ضدجوش جیورا',
        'سرم ضد جوش ارگانیک جیورا',
        'خرید سرم ضد جوش فیکس لایف',
        'Giora Organic Anti-Acne Serum',
        'درمان جوش زیرپوستی و چرکی',
        'سرم سالیسیلیک اسید جیورا',
      ],
      schemaJsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'سرم ضدجوش ارگانیک جیورا (Giora)',
        alternateName: 'Giora Organic Anti-Acne Serum',
        sku: 'GIORA-ACNE-30ML',
        mpn: 'FIXLIFE-4356',
        brand: {
          '@type': 'Brand',
          name: 'Giora by Fix Life',
        },
        image: [
          'https://fixlife.ir/wp-content/uploads/2026/08/photo_2026-08-05_11-31-28.png',
        ],
        description:
          'سرم ضدجوش ارگانیک جیورا با پایه آبی فاقد چربی، سالیسیلیک اسید و کمپلکس گیاهی ضدباکتری جهت خشک کردن جوش‌های فعال در کمتر از ۲ هفته.',
        offers: {
          '@type': 'Offer',
          url: 'https://fixlife.ir/product/giora-organic-anti-acne-serum/',
          priceCurrency: 'IRR',
          price: '9000000',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            priceCurrency: 'TMN',
            price: '900000',
          },
          availability: 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/NewCondition',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '168',
          bestRating: '5',
          worstRating: '1',
        },
      },
    },
    fullInci:
      'Aqua (Water), Salicylic Acid (BHA), Propanediol, Melaleuca Alternifolia (Tea Tree) Leaf Extract*, Salix Alba (Willow) Bark Extract, Centella Asiatica Extract, Niacinamide, Zinc PCA, Panthenol, Allantoin, Phenoxyethanol, Ethylhexylglycerin.',
    howToUse:
      'هر روز عصر مقدار مناسبی از سرم را با نوک انگشتان تمیز روی جوش‌ها و کل صورت پخش کنید. اجازه دهید ۱ ساعت (۶۰ دقیقه) روی پوست بماند و سپس فقط با آب ولرم یا سرد بشویید (بدون نیاز به شوینده).',
    reviews: [
      {
        id: 'rev-4356-1',
        author: 'کیمیا صادقی',
        skinType: 'پوست چرب و مستعد آکنه التهابی',
        verified: true,
        rating: 5,
        date: '۲۴ مهر ۱۴۰۵',
        title: 'در عرض ده روز تمام جوش‌های التهابی صورتم خشک شد',
        comment:
          'روش مصرف ۱ ساعته و شستن با آب خالی فوق‌العاده است چون برخلاف ژل‌های ضدجوش داروخانه‌ای اصلاً پوستم را نسوزاند و پوسته نکرد، اما جوش‌های قرمز و زیرپوستی‌ام را کاملاً جمع کرد.',
      },
    ],
  },

  // ============================================================================
  // 4. کرم چندکاره دور چشم جیورا (Giora) — ID: 4382
  // ============================================================================
  {
    id: '4382',
    sku: 'GIORA-EYE-20ML',
    name: 'کرم چندکاره دور چشم جیورا (Giora)',
    englishName: 'Giora Organic Multi-Action Eye Cream by Fix Life',
    slug: 'giora-organic-multi-action-eye-cream-by-fix-life',
    permalink:
      'https://fixlife.ir/product/giora-organic-multi-action-eye-cream-by-fix-life/',
    subtitle:
      'فرمولاسیون ۴ کاره ضدچروک، ضدپف، روشن‌کننده تیرگی و آبرسان دور چشم با پپتید، کافئین و سرامید',
    category: 'moisturizers',
    concerns: ['sensitive'],
    priceUSD: 1200000,
    compareAtPriceUSD: 1480000,
    rating: 4.9,
    reviewCount: 134,
    isBestSeller: true,
    tag: '۴ عملکرد هم‌زمان · بدون ایجاد میلیا',
    image: '/assets/fixlife/product-4382-1.png',
    secondaryImage: '/assets/fixlife/product-4382-2.png',
    gallery: [
      '/assets/fixlife/product-4382-1.png',
      '/assets/fixlife/product-4382-2.png',
    ],
    sizes: [{ size: '۲۰ میلی‌لیتر', priceMultiplier: 1.0 }],
    defaultSize: '۲۰ میلی‌لیتر',
    description:
      'کرم چندکاره دور چشم جیورا (Giora) تحت لیسانس فیکس لایف، یک کمپلکس تخصصی ۴ در ۱ برای نازک‌ترین و حساس‌ترین پوست صورت است. این محصول هم‌زمان چهار دغدغه اصلی ناحیه دور چشم یعنی خطوط پنجه کلاغی، پف و ورم صبحگاهی، حلقه‌های تیره (Dark Circles) و خشکی زیر چشم را هدف قرار می‌دهد. به لطف ترکیب پپتیدهای جوانساز، کافئین طبیعی، عصاره چای سبز، نیاسینامید، ویتامین C پایدار و سرامیدها، گردش خون مویرگی زیر چشم را فعال کرده و بدون ایجاد دانه‌های سفید چربی (میلیا)، نگاهی شاداب، جوان و درخشان به شما هدیه می‌دهد.',
    clinicalResults: [
      '۹۸٪ کاهش محسوس پف صبحگاهی و روشن شدن تیرگی زیر چشم',
      '۹۶٪ کاهش خطوط ریز و چروک‌های پنجه کلاغی و افزایش لیفت دور چشم طی ۶ هفته',
      'فرمولاسیون سبک و زودجذب با تضمین عدم ایجاد میلیا (Milia-Free)',
      'قابل استفاده به عنوان زیرساز ایده‌آل کانسیلر و آرایش چشم بدون ماسیدن',
    ],
    keyIngredients: [
      {
        name: 'پپتیدهای جوانساز',
        englishName: 'Rejuvenating Peptides',
        benefit:
          'تحریک ساخت کلاژن و الاستین در پوست نازک دور چشم، افزایش ضخامت اپیدرم و صاف کردن خطوط پنجه کلاغی.',
      },
      {
        name: 'کافئین طبیعی و عصاره چای سبز',
        englishName: 'Natural Caffeine & Green Tea Extract',
        benefit:
          'افزایش میکروسیرکولاسیون مویرگی، تخلیه مایعات احتباس‌یافته (رفع پف و ورم زیر چشم) و مهار تیرگی‌های عروقی.',
      },
      {
        name: 'نیاسینامید و ویتامین C پایدار',
        englishName: 'Niacinamide & Stabilized Vitamin C',
        benefit:
          'روشن‌کنندگی ملایم رنگدانه‌های قهوه‌ای دور چشم و محافظت در برابر پیری نوری.',
      },
      {
        name: 'هیالورونیک اسید و سرامید کمپلکس',
        englishName: 'Hyaluronic Acid & Ceramide Complex',
        benefit:
          'آبرسانی عمیق و ۲۴ ساعته به پوست زیر چشم و جلوگیری از شکستن کانسیلر در خطوط.',
      },
    ],
    technicalSpecs: [
      {
        label: 'نام محصول',
        spec: 'کرم چندکاره دور چشم جیورا (Giora Multi-Action Eye Cream)',
        benefit: 'درمان جامع ۴ گانه (ضدچروک، ضدپف، ضدتیرگی و آبرسان)',
      },
      {
        label: 'بافت و جذب',
        spec: 'امولسیون ابریشمی سبک و غیرکومدون‌زا (فاقد چربی‌های سنگین)',
        benefit: 'عدم ایجاد میلیا (دانه‌های سفید زیر پوستی) در ناحیه دور چشم',
      },
      {
        label: 'تعداد دفعات مصرف',
        spec: 'روزی ۲ بار (صبح و شب) روی پوست تمیز دور چشم',
        benefit: 'محافظت و رفع پف در روز + بازسازی و کلاژن‌سازی در شب',
      },
      {
        label: 'شیوه صحیح استفاده',
        spec: 'ضربات بسیار ملایم با انگشت حلقه از گوشه داخلی به سمت شقیقه',
        benefit: 'جلوگیری از کشیدگی پوست نازک دور چشم و هدایت لنفاوی پف',
      },
    ],
    protocolSteps: [
      {
        stepNumber: 'گام ۱',
        title: 'پاکسازی ملایم ناحیه دور چشم',
        instruction:
          'ابتدا پوست صورت و دور چشم را با شوینده ملایم از هرگونه آرایش و آلودگی کاملاً پاک کرده و به آرامی خشک نمایید.',
      },
      {
        stepNumber: 'گام ۲',
        title: 'ضربات ملایم با انگشت حلقه (Ring Finger)',
        instruction:
          'مقداری به اندازه یک نخود کوچک از کرم را روی نوک انگشت حلقه (که کمترین فشار را به پوست وارد می‌کند) قرار دهید و با ضربات آهسته (Tapping) از گوشه داخلی زیر چشم به سمت گوشه بیرونی و شقیقه پخش کنید.',
      },
      {
        stepNumber: 'گام ۳',
        title: 'استمرار صبح و شب (روزی ۲ بار)',
        instruction:
          'این روتین را هر روز دو بار (صبح‌ها قبل از ضدآفتاب/کانسیلر و شب‌ها قبل از خواب) به مدت حداقل ۶ هفته ادامه دهید تا حداکثر لیفت و شفافیت حاصل شود.',
      },
    ],
    faqs: [
      {
        question: 'آیا کرم دور چشم جیورا باعث ایجاد میلیا (دانه‌های سفید زیر چشم) می‌شود؟',
        answer:
          'خیر، فرمولاسیون این کرم فاقد روغن‌های معدنی سنگین و ترکیبات مسدودکننده منافذ است و با بافت سبک خود کاملاً جذب شده و به هیچ عنوان میلیا ایجاد نمی‌کند.',
      },
      {
        question: 'چرا تاکید می‌شود کرم دور چشم را حتماً با انگشت حلقه بزنیم؟',
        answer:
          'پوست دور چشم ۵ برابر نازک‌تر از سایر بخش‌های صورت است. انگشت حلقه به طور طبیعی ضعیف‌ترین عضله دست را دارد و مانع از کشیدن یا فشار بیش از حد به بافت ظریف زیر چشم می‌شود.',
      },
      {
        question: 'آیا می‌توان قبل از آرایش و کانسیلر از این کرم استفاده کرد؟',
        answer:
          'بله، این کرم خطوط ریز زیر چشم را آبرسانی و پر می‌کند و باعث می‌شود کانسیلر بسیار یکدست‌تر روی پوست بخوابد و در طول روز خط نیندازد.',
      },
    ],
    seoMeta: {
      title:
        'خرید کرم چندکاره دور چشم جیورا (Giora) | ضد تیرگی، پف و چروک فیکس لایف',
      description:
        'خرید اینترنتی کرم چندکاره دور چشم جیورا (Giora Multi-Action Eye Cream) از فیکس لایف (fixlife.ir). حاوی پپتید، کافئین، چای سبز و سرامید بدون ایجاد میلیا.',
      canonicalUrl:
        'https://fixlife.ir/product/giora-organic-multi-action-eye-cream-by-fix-life/',
      keywords: [
        'کرم دور چشم جیورا',
        'خرید کرم دور چشم فیکس لایف',
        'کرم ضد تیرگی و پف دور چشم',
        'Giora Multi-Action Eye Cream',
        'بهترین کرم دور چشم ضد چروک',
        'کرم دور چشم بدون میلیا',
      ],
      schemaJsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'کرم چندکاره دور چشم جیورا (Giora)',
        alternateName: 'Giora Organic Multi-Action Eye Cream by Fix Life',
        sku: 'GIORA-EYE-20ML',
        mpn: 'FIXLIFE-4382',
        brand: {
          '@type': 'Brand',
          name: 'Giora by Fix Life',
        },
        image: [
          'https://fixlife.ir/wp-content/uploads/2026/08/photo_2026-08-05_11-31-36.png',
          'https://fixlife.ir/wp-content/uploads/2026/08/photo_2026-08-05_11-31-35.png',
        ],
        description:
          'کرم چندکاره دور چشم جیورا با ۴ عملکرد هم‌زمان ضدچروک، ضدپف، روشن‌کننده تیرگی و آبرسان عمقی حاوی پپتید، کافئین و سرامید.',
        offers: {
          '@type': 'Offer',
          url: 'https://fixlife.ir/product/giora-organic-multi-action-eye-cream-by-fix-life/',
          priceCurrency: 'IRR',
          price: '12000000',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            priceCurrency: 'TMN',
            price: '1200000',
          },
          availability: 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/NewCondition',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '134',
          bestRating: '5',
          worstRating: '1',
        },
      },
    },
    fullInci:
      'Aqua (Water), Glycerin, Caffeine, Camellia Sinensis (Green Tea) Leaf Extract, Niacinamide, Acetyl Hexapeptide-8, Palmitoyl Tripeptide-1, Sodium Ascorbyl Phosphate (Vitamin C), Sodium Hyaluronate, Ceramide NP, Panthenol, Tocopherol, Phenoxyethanol.',
    howToUse:
      'روزی ۲ بار (صبح و شب) به اندازه یک نخود روی نوک انگشت حلقه قرار داده و با ضربات ملایم از گوشه داخلی زیر چشم به سمت شقیقه پخش کنید.',
    reviews: [
      {
        id: 'rev-4382-1',
        author: 'الناز طاهری',
        skinType: 'پوست خشک و دارای تیرگی زیر چشم',
        verified: true,
        rating: 5,
        date: '۱۵ مهر ۱۴۰۵',
        title: 'پف صبحگاهی و خطوط ریز زیر چشمم کاملاً برطرف شد',
        comment:
          'من به خاطر کار طولانی با لپ‌تاپ زیر چشمم همیشه کبود و پف‌دار بود. کرم دور چشم جیورا واقعاً سبک است، اصلاً میلیا نیاورد و تیرگی زیر چشمم را خیلی روشن‌تر کرده است.',
      },
    ],
  },

  // ============================================================================
  // 5. کرم ضد لک تخصصی درمو برایت نوبل (Nubelle) — ID: 4380
  // ============================================================================
  {
    id: '4380',
    sku: 'NUBELLE-DERMOBRITE-30ML',
    name: 'کرم ضد لک تخصصی درمو برایت نوبل (Nubelle)',
    englishName: 'Nubelle Dermo-Brite Anti-Spot Cream by Fix Life',
    slug: 'nubelle-dermo-brite-anti-spot-cream-by-fix-life',
    permalink:
      'https://fixlife.ir/product/nubelle-dermo-brite-anti-spot-cream-by-fix-life/',
    subtitle:
      'درمان کلینیکال لک‌های مقاوم، ملاسما و لک‌های هورمونی با کمپلکس مهارکننده تیروزیناز و تیرامین',
    category: 'moisturizers',
    concerns: ['brightening'],
    priceUSD: 1900000,
    compareAtPriceUSD: 2350000,
    rating: 5.0,
    reviewCount: 189,
    isBestSeller: false,
    isNew: true,
    tag: 'درمان لک‌های مقاوم و ملاسما',
    image: '/assets/fixlife/product-4380-1.jpg',
    secondaryImage: '/assets/fixlife/product-4380-1.jpg',
    gallery: ['/assets/fixlife/product-4380-1.jpg'],
    sizes: [{ size: '۳۰ میلی‌لیتر', priceMultiplier: 1.0 }],
    defaultSize: '۳۰ میلی‌لیتر',
    description:
      'کرم ضد لک تخصصی درمو برایت نوبل (Nubelle Dermo-Brite) عرضه‌شده توسط فیکس لایف، قوی‌ترین فرمولاسیون درماتولوژیک برای پاکسازی لک‌های قدیمی، مقاوم و عمیق از جمله ملاسما (لک‌های بارداری و هورمونی)، لک‌های ناشی از آفتاب‌سوختگی شدید، کک‌ومک و تیرگی‌های قدیمی به جا مانده از آکنه است. این کرم با مکانیسم دوگانه مهار آنزیم تیروزیناز و مسدودسازی مسیر تیرامین، سنتز رنگدانه‌های تیره را در عمق درم و اپیدرم متوقف کرده و طی یک دوره درمانی ۴ تا ۸ هفته‌ای، پوستی صاف، روشن و بدون لک را بازمی‌گرداند.',
    clinicalResults: [
      '۹۵٪ محو شدن لک‌های مقاوم، ملاسما و لک‌های هورمونی در پایان هفته هشتم',
      '۹۳٪ یکدستی، شفافیت و روشن شدن تناژ کلی پوست صورت',
      'فرمولاسیون درماتولوژیک بدون بازگشت لک در صورت رعایت پروتکل ضدآفتاب',
      'دارای کمپلکس آبرسان عمقی جهت جلوگیری از خشکی و التهاب در طول دوره درمان',
    ],
    keyIngredients: [
      {
        name: 'ترکیب پیشرفته ضد لک (مهارکننده تیروزیناز و تیرامین)',
        englishName: 'Advanced Tyrosinase & Tyramine Inhibitor Complex',
        benefit:
          'توقف مستقیم فرمان تولید ملانین در سلول‌های ملانوسیت و شکستن کلونی‌های رنگدانه‌ای رسوب‌کرده در لایه‌های زیرین پوست.',
      },
      {
        name: 'نیاسینامید دارویی (ویتامین B3)',
        englishName: 'Pharmaceutical Grade Niacinamide',
        benefit:
          'ممانعت از انتقال ملانین به سطح پوست، تقویت سد دفاعی و کاهش قرمزی و التهاب.',
      },
      {
        name: 'عصاره‌های گیاهی روشن‌کننده و شیرین‌بیان',
        englishName: 'Botanical Brightening & Licorice Extracts',
        benefit:
          'روشن‌کنندگی طبیعی، آنتی‌اکسیدان قوی و جلوگیری از تشکیل لک‌های جدید در اثر استرس محیطی.',
      },
      {
        name: 'کمپلکس آبرسان و مرطوب‌کننده عمقی',
        englishName: 'Deep Hydrating & Barrier Repair Complex',
        benefit:
          'حفظ نرمی و لطافت پوست در طول دوره ۴ تا ۸ هفته‌ای درمان ضد لک.',
      },
    ],
    technicalSpecs: [
      {
        label: 'نام محصول',
        spec: 'کرم ضد لک تخصصی درمو برایت نوبل (Nubelle Dermo-Brite)',
        benefit: 'قوی‌ترین رده درمانی فیکس لایف برای لک‌های مقاوم و عمیق',
      },
      {
        label: 'موارد مصرف تخصصی',
        spec: 'ملاسما (لک بارداری/هورمونی)، لک آفتاب، لک سن و جای جوش قدیمی',
        benefit: 'نفوذ به لایه‌های عمقی اپیدرم و مهار ریشه‌ای ملانین',
      },
      {
        label: 'طول دوره درمان کامل',
        spec: '۴ تا ۸ هفته مصرف منظم شبانه (اوج اثربخشی در هفته ۷ و ۸)',
        benefit: 'تکمیل دو چرخه کامل نوسازی سلولی اپیدرم برای پاکسازی دائمی لک',
      },
      {
        label: 'شرایط مصرف',
        spec: 'فقط شب‌ها در محیط تاریک روی نواحی لک (به دور چشم زده نشود)',
        benefit: 'جذب خالص اکتیوها بدون تداخل با اشعه نورانی',
      },
    ],
    protocolSteps: [
      {
        stepNumber: 'گام ۱',
        title: 'شستشو و خشک کردن کامل پوست در شب',
        instruction:
          'هر شب قبل از خواب، پوست صورت را با شوینده ملایم شسته و با حوله تمیز کاملاً خشک نمایید.',
      },
      {
        stepNumber: 'گام ۲',
        title: 'استفاده موضعی در محیط تاریک (بدون برخورد با دور چشم)',
        instruction:
          'مقدار کافی از کرم درمو برایت نوبل را مستقیماً روی نواحی دارای لک (و در صورت تمایل لایه نازکی روی کل صورت به جز دور چشم) بزنید و در محیط تاریک استراحت کنید تا بدون تداخل نوری جذب شود.',
      },
      {
        stepNumber: 'گام ۳',
        title: 'شستشوی صبحگاهی و ضدآفتاب الزامی (دوره ۴ تا ۸ هفته)',
        instruction:
          'صبح‌ها پوست را با آب ولرم و شوینده ملایم بشویید و حتماً در طول روز از ضدآفتاب باکیفیت استفاده کنید. این پروتکل را ۴ تا ۸ هفته ادامه دهید.',
      },
    ],
    faqs: [
      {
        question: 'تفاوت کرم درمو برایت نوبل با سرم ضد لک جیورا چیست؟',
        answer:
          'سرم ضد لک جیورا بافتی سرمی دارد و برای روشن‌کنندگی کل صورت، شفافیت و لک‌های سطحی تا متوسط ایده‌آل است؛ اما کرم درمو برایت نوبل (Nubelle) یک کرم درمانی فوق‌تخصصی و متمرکز برای لک‌های قدیمی، عمیق و مقاوم نظیر ملاسما و لک‌های هورمونی است.',
      },
      {
        question: 'دوره درمان کامل کرم ضد لک نوبل چند هفته است؟',
        answer:
          'نتایج اولیه از هفته سوم و چهارم آغاز می‌شود، اما برای پاکسازی ریشه‌ای لک‌های عمیق و جلوگیری از بازگشت آن‌ها، تکمیل دوره ۴ تا ۸ هفته‌ای توصیه می‌شود.',
      },
      {
        question: 'آیا می‌توان این کرم را به دور چشم زد؟',
        answer:
          'خیر، کرم درمو برایت نوبل دارای اکتیوهای قوی مهارکننده ملانین است و نباید در ناحیه دور چشم استفاده شود.',
      },
    ],
    seoMeta: {
      title:
        'خرید کرم ضد لک تخصصی درمو برایت نوبل (Nubelle) | درمان ملاسما و لک عمیق فیکس لایف',
      description:
        'خرید کرم ضد لک تخصصی درمو برایت نوبل (Nubelle Dermo-Brite Anti-Spot Cream) از فیکس لایف (fixlife.ir). درمان قطعی ملاسما، لک بارداری و لک‌های مقاوم در ۴ تا ۸ هفته.',
      canonicalUrl:
        'https://fixlife.ir/product/nubelle-dermo-brite-anti-spot-cream-by-fix-life/',
      keywords: [
        'کرم ضد لک نوبل',
        'کرم درمو برایت نوبل',
        'خرید کرم ضد لک فیکس لایف',
        'Nubelle Dermo-Brite Anti-Spot Cream',
        'درمان قطعی ملاسما و لک بارداری',
        'قوی ترین کرم ضد لک',
      ],
      schemaJsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'کرم ضد لک تخصصی درمو برایت نوبل (Nubelle)',
        alternateName: 'Nubelle Dermo-Brite Anti-Spot Cream by Fix Life',
        sku: 'NUBELLE-DERMOBRITE-30ML',
        mpn: 'FIXLIFE-4380',
        brand: {
          '@type': 'Brand',
          name: 'Nubelle by Fix Life',
        },
        image: [
          'https://fixlife.ir/wp-content/uploads/2026/08/photo_2026-08-05_11-31-35.jpg',
        ],
        description:
          'کرم ضد لک تخصصی درمو برایت نوبل (Nubelle) با ۹۵٪ اثربخشی در محو کردن لک‌های مقاوم، ملاسما و لک‌های ناشی از آفتاب طی ۴ تا ۸ هفته.',
        offers: {
          '@type': 'Offer',
          url: 'https://fixlife.ir/product/nubelle-dermo-brite-anti-spot-cream-by-fix-life/',
          priceCurrency: 'IRR',
          price: '19000000',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            priceCurrency: 'TMN',
            price: '1900000',
          },
          availability: 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/NewCondition',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '5.0',
          reviewCount: '189',
          bestRating: '5',
          worstRating: '1',
        },
      },
    },
    fullInci:
      'Aqua (Water), Cetearyl Alcohol, Glycerin, Alpha-Arbutin, Niacinamide, Kojic Dipalmitate, Glycyrrhiza Glabra (Licorice) Root Extract, Tetrahexyldecyl Ascorbate, Tocopheryl Acetate, Panthenol, Allantoin, Dimethicone, Phenoxyethanol.',
    howToUse:
      'هر شب قبل از خواب روی پوست تمیز و خشک، مستقیماً روی نواحی دارای لک (به جز دور چشم) بزنید و در محیط تاریک بمانید. صبح‌ها بشویید و حتماً در طول روز از ضدآفتاب استفاده کنید (دوره ۴ تا ۸ هفته).',
    reviews: [
      {
        id: 'rev-4380-1',
        author: 'فرزانه مرادی',
        skinType: 'پوست نرمال دارای ملاسمای قدیمی',
        verified: true,
        rating: 5,
        date: '۱۲ مهر ۱۴۰۵',
        title: 'بهترین کرم ضدلکی که بعد از سال‌ها نتیجه داد',
        comment:
          'لک‌های هورمونی روی گونه‌ام با هیچ کرمی نرفته بود. الان هفته هفتم مصرف کرم درمو برایت نوبل هستم و بیش از ۹۰ درصد لک‌ها کاملاً محو شده و پوستم یکدست شده است.',
      },
    ],
  },

  // ============================================================================
  // 6. کرم هیالورونیک اسید جیورا (Giora) — ID: 4360
  // ============================================================================
  {
    id: '4360',
    sku: 'GIORA-HYALURONIC-50ML',
    name: 'کرم هیالورونیک اسید جیورا (Giora)',
    englishName: 'GIORA Hyaluronic Acid Hydrating & Lifting Cream by Fix Life',
    slug: 'آبرسان-هیالورونیک-اسید',
    permalink: 'https://fixlife.ir/product/آبرسان-هیالورونیک-اسید/',
    subtitle:
      'آبرسان چندلایه، قفل‌کننده رطوبت و فرم‌دهنده (لیفتینگ) پوست با هیالورونیک اسید چندوزنی و سرامید',
    category: 'moisturizers',
    concerns: ['dryness'],
    priceUSD: 900000,
    compareAtPriceUSD: 1150000,
    rating: 4.9,
    reviewCount: 175,
    isBestSeller: false,
    tag: 'آبرسان ۱۰۰۰ برابری · لیفت و فرم‌دهی',
    image: '/assets/fixlife/product-4360-1.jpg',
    secondaryImage: '/assets/fixlife/product-4360-2.jpg',
    gallery: [
      '/assets/fixlife/product-4360-1.jpg',
      '/assets/fixlife/product-4360-2.jpg',
    ],
    sizes: [{ size: '۵۰ میلی‌لیتر', priceMultiplier: 1.0 }],
    defaultSize: '۵۰ میلی‌لیتر',
    description:
      'کرم آبرسان هیالورونیک اسید جیورا (Giora) از وب‌سایت رسمی فیکس لایف، یک بمب هیدراتاسیون چندلایه و کرم لیفتینگ روزانه است که با بهره‌گیری از هیالورونیک اسید خالص چندوزنی (Multi-Molecular Weight)، تا ۱۰۰۰ برابر وزن مولکولی خود آب را جذب و در لایه‌های اپیدرم قفل می‌کند. ترکیب هوشمندانه نیاسینامید، کمپلکس سرامید، ویتامین E و پانتنول (پروویتامین B5) در این کرم، علاوه بر رفع کامل خشکی، کشیدگی و دهیدراتاسیون، هنگام استفاده با تکنیک ماساژ ۱۰ دقیقه‌ای رو به بالا، گردش خون مویرگی را فعال کرده و موجب فرم‌دهی، پر شدن خطوط و سفتی محسوس پوست بدون ایجاد چربی یا جوش (Non-Comedogenic) می‌گردد.',
    clinicalResults: [
      '۹۸٪ جذب فوری و آبرسانی عمیق چندلایه از اولین نوبت استفاده',
      '۹۲٪ افزایش لیفت، سفتی و فرم‌دهی خطوط چهره با پروتکل ماساژ ضدجاذبه',
      'جذب آب تا ۱۰۰۰ برابر وزن مولکولی بدون ایجاد حس چربی، سنگینی یا جوش',
      'ترمیم کامل سد دفاعی پوست‌های دهیدراته، حساس یا تحت درمان با رتینول و ضدلک',
    ],
    keyIngredients: [
      {
        name: 'هیالورونیک اسید خالص چندوزنی',
        englishName: 'Multi-Molecular Weight Hyaluronic Acid',
        benefit:
          'مولکول‌های درشت سطح پوست را نرم و محافظت می‌کنند و مولکول‌های ریز به عمق اپیدرم نفوذ کرده و سلول‌ها را از درون پرآب و حجیم (Plump) می‌سازند.',
      },
      {
        name: 'کمپلکس سرامید',
        englishName: 'Ceramide Complex',
        benefit:
          'بازسازی سیمان بین‌سلولی پوست و جلوگیری از تبخیر آب (TEWL) در طول شبانه‌روز.',
      },
      {
        name: 'نیاسینامید (ویتامین B3)',
        englishName: 'Niacinamide (Vitamin B3)',
        benefit:
          'افزایش شفافیت، تعادل چربی و رطوبت، و جمع شدن منافذ باز پوست.',
      },
      {
        name: 'پانتنول (پروویتامین B5) و ویتامین E',
        englishName: 'Panthenol (Pro-Vitamin B5) & Tocopherol',
        benefit:
          'تسکین التهاب و قرمزی، افزایش خاصیت ارتجاعی و محافظت آنتی‌اکسیدانی در برابر آلودگی هوا.',
      },
    ],
    technicalSpecs: [
      {
        label: 'نام محصول',
        spec: 'کرم آبرسان هیالورونیک اسید جیورا (Giora Hyaluronic Acid Cream)',
        benefit: 'هیدراتاسیون چندلایه + لیفتینگ و فرم‌دهی طبیعی صورت',
      },
      {
        label: 'ظرفیت جذب رطوبت',
        spec: 'جذب و نگهداری مولکول‌های آب تا ۱۰۰۰ برابر وزن خود',
        benefit: 'حجم‌دهی طبیعی به گونه‌ها و پر کردن خطوط ناشی از کم‌آبی',
      },
      {
        label: 'نوع پوست مناسب',
        spec: 'انواع پوست (حتی پوست‌های چرب و مستعد جوش به دلیل فرمول Non-Comedogenic)',
        benefit: 'تامین آب مورد نیاز پوست بدون اضافه کردن چربی مسدودکننده منافذ',
      },
      {
        label: 'پروتکل اختصاصی جذب',
        spec: 'ماساژ ۱۰ دقیقه‌ای خلاف جهت جاذبه زمین (از پایین به بالا)',
        benefit: 'تحریک کلاژن‌سازی مکانیکی، drenaje لنفاوی و لیفت عضلات صورت',
      },
    ],
    protocolSteps: [
      {
        stepNumber: 'گام ۱',
        title: 'پخش کرم روی پوست تمیز (صبح و شب)',
        instruction:
          'روزی دو بار (صبح و شب) ابتدا پوست صورت و گردن را با شوینده مناسب تمیز کنید و مقدار کمی از کرم هیالورونیک اسید جیورا را روی نقاط مختلف صورت پخش نمایید.',
      },
      {
        stepNumber: 'گام ۲',
        title: 'حرکات لیفتینگ خلاف جهت جاذبه زمین',
        instruction:
          'با بند انگشتان یا کف دست، حرکات را همواره از پایین به بالا اجرا کنید: از پایین گردن به سمت چانه، از زاویه فک به سمت لاله گوش، و از کنار بینی و گونه‌ها به سمت شقیقه‌ها.',
      },
      {
        stepNumber: 'گام ۳',
        title: 'ماساژ ملایم ۱۰ دقیقه‌ای جهت فرم‌دهی سلولی',
        instruction:
          'این ماساژ ملایم را به مدت ۱۰ دقیقه ادامه دهید تا کرم به طور کامل جذب لایه‌های زیرین سلولی شده و گردش خون مویرگی برای فرم‌دهی و لیفتینگ پوست فعال گردد.',
      },
    ],
    faqs: [
      {
        question: 'آیا کرم هیالورونیک اسید جیورا برای پوست چرب و جوش‌دار هم مناسب است؟',
        answer:
          'بله! بسیاری از پوست‌های چرب در واقع «دهیدراته» (کم‌آب) هستند و به دلیل کمبود آب، چربی بیشتری ترشح می‌کنند. این کرم کاملاً غیرکومدون‌زا (Non-Comedogenic) است و بدون ایجاد جوش، آب سلولی را تامین و ترشح سبوم را متعادل می‌کند.',
      },
      {
        question: 'چرا ماساژ ۱۰ دقیقه‌ای رو به بالا در زمان مصرف این کرم توصیه شده است؟',
        answer:
          'ماساژ رو به بالا (خلاف جهت جاذبه زمین) به همراه بافت ابریشمی کرم هیالورونیک اسید جیورا، جریان خون و اکسیژن‌رسانی به فیبروبلاست‌ها را افزایش داده و اثر لیفتینگ و فرم‌دهی چهره را دوچندان می‌سازد.',
      },
      {
        question: 'آیا می‌توان از این کرم در کنار سرم رتینول یا سرم ضدجوش جیورا استفاده کرد؟',
        answer:
          'بله، این کرم بهترین مکمل آبرسان و ترمیم‌کننده سد دفاعی پوست در کنار تمامی سرم‌های درمانی فیکس لایف است.',
      },
    ],
    seoMeta: {
      title:
        'خرید کرم آبرسان هیالورونیک اسید جیورا (Giora) | آبرسان عمقی و لیفتینگ فیکس لایف',
      description:
        'خرید کرم هیالورونیک اسید جیورا (Giora) از وب‌سایت رسمی فیکس لایف (fixlife.ir). آبرسانی چندلایه تا ۱۰۰۰ برابر وزن مولکولی، حاوی سرامید، نیاسینامید و ویتامین B5.',
      canonicalUrl: 'https://fixlife.ir/product/آبرسان-هیالورونیک-اسید/',
      keywords: [
        'کرم هیالورونیک اسید جیورا',
        'آبرسان هیالورونیک اسید فیکس لایف',
        'خرید کرم آبرسان جیورا',
        'کرم آبرسان و لیفتینگ صورت',
        'Giora Hyaluronic Acid Cream',
        'درمان پوست دهیدراته و خشک',
      ],
      schemaJsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'کرم هیالورونیک اسید جیورا (Giora)',
        alternateName: 'GIORA Hyaluronic Acid Hydrating & Lifting Cream by Fix Life',
        sku: 'GIORA-HYALURONIC-50ML',
        mpn: 'FIXLIFE-4360',
        brand: {
          '@type': 'Brand',
          name: 'Giora by Fix Life',
        },
        image: [
          'https://fixlife.ir/wp-content/uploads/2026/08/photo_2026-08-05_11-31-26.jpg',
          'https://fixlife.ir/wp-content/uploads/2026/08/photo_2026-08-05_11-31-27.jpg',
        ],
        description:
          'کرم آبرسان هیالورونیک اسید جیورا حاوی هیالورونیک اسید چندوزنی، سرامید، نیاسینامید و پانتنول با ۹۸٪ جذب و آبرسانی چندلایه و ۹۲٪ لیفت پوست.',
        offers: {
          '@type': 'Offer',
          url: 'https://fixlife.ir/product/آبرسان-هیالورونیک-اسید/',
          priceCurrency: 'IRR',
          price: '9000000',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            priceCurrency: 'TMN',
            price: '900000',
          },
          availability: 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/NewCondition',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '175',
          bestRating: '5',
          worstRating: '1',
        },
      },
    },
    fullInci:
      'Aqua (Water), Sodium Hyaluronate (Multi-Molecular Weight), Hydrolyzed Hyaluronic Acid, Glycerin, Niacinamide, Ceramide NP, Ceramide AP, Ceramide EOP, Panthenol (Pro-Vitamin B5), Tocopherol (Vitamin E), Squalane, Cetearyl Olivate, Sorbitan Olivate, Phenoxyethanol.',
    howToUse:
      'روزی دو بار (صبح و شب) روی پوست تمیز صورت پخش کرده و به مدت ۱۰ دقیقه با حرکات رو به بالا (خلاف جهت جاذبه زمین: از گردن به چانه، از چانه به گوش‌ها و از گونه‌ها به گیجگاه) ماساژ دهید تا کاملاً جذب شود.',
    reviews: [
      {
        id: 'rev-4360-1',
        author: 'شقایق بهرامی',
        skinType: 'پوست مختلط و به شدت دهیدراته',
        verified: true,
        rating: 5,
        date: '۱۹ مهر ۱۴۰۵',
        title: 'پوستم واقعاً پرآب و شیشه‌ای شده است',
        comment:
          'بافت کرم هیالورونیک اسید جیورا فوق‌العاده است؛ نه چرب است و نه سنگین، و وقتی با ماساژ رو به بالا می‌زنم صورتم کاملاً لیفت و شاداب می‌شود.',
      },
    ],
  },

  // ============================================================================
  // 7. لوسیون بدن جیورا (Giora) — ID: 4376
  // ============================================================================
  {
    id: '4376',
    sku: 'GIORA-BODYLOTION-200ML',
    name: 'لوسیون بدن جیورا (Giora)',
    englishName: 'Giora Deep Hydrating Body Lotion by Fix Life',
    slug: 'giora-deep-hydrating-body-lotion-by-fix-life',
    permalink:
      'https://fixlife.ir/product/giora-deep-hydrating-body-lotion-by-fix-life/',
    subtitle:
      'آبرسان عمقی ۲۴ ساعته، نرم‌کننده ابریشمی و روشن‌کننده پوست بدن و صورت پس از استحمام',
    category: 'moisturizers',
    concerns: ['dryness'],
    priceUSD: 640000,
    compareAtPriceUSD: 820000,
    rating: 4.9,
    reviewCount: 128,
    isBestSeller: false,
    tag: 'هیدراتاسیون ۹۹٪ · بدون چسبندگی لباس',
    image: '/assets/fixlife/product-4376-1.png',
    secondaryImage: '/assets/fixlife/product-4376-2.png',
    gallery: [
      '/assets/fixlife/product-4376-1.png',
      '/assets/fixlife/product-4376-2.png',
    ],
    sizes: [{ size: '۲۰۰ میلی‌لیتر', priceMultiplier: 1.0 }],
    defaultSize: '۲۰۰ میلی‌لیتر',
    description:
      'لوسیون بدن آبرسان عمقی جیورا (Giora Deep Hydrating Body Lotion) تحت نظارت فیکس لایف، یک امولسیون ابریشمی و مغذی برای رفع کامل خشکی، پوسته‌پوسته شدن و کدری پوست بدن پس از استحمام است. این لوسیون با ترکیب هیالورونیک اسید هیدرولیزشده، شی‌باتر ارگانیک، روغن بادام شیرین طبیعی، نیاسینامید، ویتامین E و پانتنول، رطوبت را به مدت ۲۴ ساعت در پوست قفل کرده و بدون ایجاد کوچک‌ترین حس چربی یا چسبندگی روی لباس، لطافتی مخملی و درخششی یکدست به پوست بدن و حتی صورت می‌بخشد.',
    clinicalResults: [
      '۹۹٪ افزایش فوری سطح هیدراتاسیون و رفع کشیدگی پوست پس از حمام',
      '۹۸٪ ایجاد لطافت ابریشمی، نرمی و درخشش طبیعی روی پوست بدن',
      'جذب فوق‌سریع در کمتر از ۶۰ ثانیه بدون ایجاد چسبندگی یا لک روی لباس',
      'فرمولاسیون ملایم و غنی از ویتامین B3، B5 و E؛ قابل استفاده برای بدن و صورت',
    ],
    keyIngredients: [
      {
        name: 'هیالورونیک اسید هیدرولیزشده',
        englishName: 'Hydrolyzed Hyaluronic Acid',
        benefit:
          'نفوذ سریع به لایه شاخی پوست‌های خشک بدن و حبس مولکول‌های آب پس از استحمام.',
      },
      {
        name: 'شی‌باتر و روغن بادام شیرین طبیعی',
        englishName: 'Shea Butter & Sweet Almond Oil',
        benefit:
          'تغذیه اسیدهای چرب ضروری امگا ۶ و ۹، رفع زبری آرنج، زانو و ساق پا و ایجاد نرمی ابریشمی.',
      },
      {
        name: 'نیاسینامید و ویتامین E',
        englishName: 'Niacinamide & Vitamin E',
        benefit:
          'روشن‌کنندگی تناژ پوست بدن، بهبود تیرگی‌های ناشی از اصطکاک و محافظت آنتی‌اکسیدانی.',
      },
      {
        name: 'پانتنول (پروویتامین B5)',
        englishName: 'Panthenol (Pro-Vitamin B5)',
        benefit:
          'تسکین التهاب، خارش ناشی از خشکی یا اصلاح (شیو) و ترمیم سد دفاعی پوست.',
      },
    ],
    technicalSpecs: [
      {
        label: 'نام محصول',
        spec: 'لوسیون بدن آبرسان عمقی جیورا (Giora Deep Hydrating Body Lotion)',
        benefit: 'مراقبت جامع ۲۴ ساعته از پوست بدن پس از استحمام',
      },
      {
        label: 'بافت و سرعت جذب',
        spec: 'لوسیون سبک ابریشمی با جذب فوری (Fast-Absorbing Non-Greasy)',
        benefit: 'امکان پوشیدن لباس بلافاصله پس از مصرف بدون حس چسبندگی',
      },
      {
        label: 'بهترین زمان مصرف',
        spec: 'بلافاصله پس از حمام روی پوست کمی نمدار (Damp Skin Protocol)',
        benefit: 'قفل کردن رطوبت آب در اپیدرم و افزایش ۳ برابری کارایی آبرسانی',
      },
      {
        label: 'نواحی قابل استفاده',
        spec: 'تمامی نواحی پوست بدن، دست‌ها و حتی صورت‌های خشک',
        benefit: 'فرمولاسیون ایمن، فاقد پارابن و سازگار با پوست‌های حساس',
      },
    ],
    protocolSteps: [
      {
        stepNumber: 'گام ۱',
        title: 'استفاده پس از حمام روی پوست نمدار',
        instruction:
          'پس از پایان استحمام، اجازه دهید آب اضافه با حوله به آرامی گرفته شود اما پوستتان همچنان کمی مرطوب و نم‌دار باقی بماند (پوست را کاملاً خشک نکنید).',
      },
      {
        stepNumber: 'گام ۲',
        title: 'ماساژ دورانی روی بدن و صورت',
        instruction:
          'مقدار کافی از لوسیون بدن جیورا را روی تمام نواحی پوست بدن (به‌ویژه ساق پا، بازوها، آرنج و زانو) و حتی صورت با حرکات دورانی ملایم ماساژ دهید تا جذب شود.',
      },
      {
        stepNumber: 'گام ۳',
        title: 'تداوم روزانه برای لطافت ۲۴ ساعته',
        instruction:
          'استفاده روزانه و منظم از این لوسیون، هیدراتاسیون ۲۴ ساعته، نرمی ابریشمی و تناژ یکدست و درخشان پوست را بدون هیچ‌گونه چسبندگی روی لباس تضمین می‌کند.',
      },
    ],
    faqs: [
      {
        question: 'چرا بهترین زمان زدن لوسیون بدن جیورا بلافاصله بعد از حمام روی پوست نمدار است؟',
        answer:
          'در ۳ دقیقه اول پس از حمام، منافذ و لایه شاخی پوست مملو از رطوبت هستند. زدن لوسیون روی پوست کمی نمدار، این رطوبت را در زیر لایه شی‌باتر و هیالورونیک اسید حبس کرده و ماندگاری نرمی پوست را به ۲۴ ساعت می‌رساند.',
      },
      {
        question: 'آیا لوسیون بدن جیورا روی لباس رد چربی یا چسبندگی ایجاد می‌کند؟',
        answer:
          'خیر، فرمولاسیون این محصول بر پایه امولسیون سبک و زودجذب طراحی شده است که در کمتر از یک دقیقه کاملاً جذب پوست شده و هیچ حس چسبندگی یا لک چربی روی لباس به جا نمی‌گذارد.',
      },
      {
        question: 'آیا بعد از اصلاح و شیو می‌توان از این لوسیون استفاده کرد؟',
        answer:
          'بله، به دلیل حضور پانتنول (ویتامین B5)، نیاسینامید و ویتامین E، التهاب، قرمزی و خارش پس از اصلاح یا اپیلاسیون را به سرعت آرام می‌کند.',
      },
    ],
    seoMeta: {
      title:
        'خرید لوسیون بدن آبرسان عمقی جیورا (Giora) | نرم‌کننده ۲۴ ساعته فیکس لایف',
      description:
        'خرید لوسیون بدن آبرسان عمقی جیورا (Giora Deep Hydrating Body Lotion) از فیکس لایف (fixlife.ir). حاوی هیالورونیک اسید، شی‌باتر، روغن بادام شیرین و ویتامین B5 و E.',
      canonicalUrl:
        'https://fixlife.ir/product/giora-deep-hydrating-body-lotion-by-fix-life/',
      keywords: [
        'لوسیون بدن جیورا',
        'خرید لوسیون بدن فیکس لایف',
        'لوسیون آبرسان عمقی بدن',
        'Giora Deep Hydrating Body Lotion',
        'بهترین لوسیون بعد از حمام بدون چسبندگی',
        'لوسیون روشن کننده بدن جیورا',
      ],
      schemaJsonLd: {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: 'لوسیون بدن جیورا (Giora)',
        alternateName: 'Giora Deep Hydrating Body Lotion by Fix Life',
        sku: 'GIORA-BODYLOTION-200ML',
        mpn: 'FIXLIFE-4376',
        brand: {
          '@type': 'Brand',
          name: 'Giora by Fix Life',
        },
        image: [
          'https://fixlife.ir/wp-content/uploads/2026/08/photo_2026-08-05_11-31-33.png',
          'https://fixlife.ir/wp-content/uploads/2026/08/photo_2026-08-05_11-31-33-1.png',
        ],
        description:
          'لوسیون بدن آبرسان عمقی جیورا حاوی هیالورونیک اسید هیدرولیزشده، شی‌باتر، روغن بادام شیرین و نیاسینامید با ۹۹٪ سطح هیدراتاسیون و جذب فوری.',
        offers: {
          '@type': 'Offer',
          url: 'https://fixlife.ir/product/giora-deep-hydrating-body-lotion-by-fix-life/',
          priceCurrency: 'IRR',
          price: '6400000',
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            priceCurrency: 'TMN',
            price: '640000',
          },
          availability: 'https://schema.org/InStock',
          itemCondition: 'https://schema.org/NewCondition',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.9',
          reviewCount: '128',
          bestRating: '5',
          worstRating: '1',
        },
      },
    },
    fullInci:
      'Aqua (Water), Glycerin, Butyrospermum Parkii (Shea) Butter*, Prunus Amygdalus Dulcis (Sweet Almond) Oil, Hydrolyzed Hyaluronic Acid, Niacinamide, Panthenol (Pro-Vitamin B5), Tocopheryl Acetate (Vitamin E), Cetearyl Alcohol, Glyceryl Stearate, Allantoin, Phenoxyethanol.',
    howToUse:
      'پس از حمام روی پوست کمی مرطوب و نم‌دار، مقدار کافی از لوسیون را روی تمام نواحی بدن و صورت با حرکات دورانی ماساژ دهید تا جذب شود.',
    reviews: [
      {
        id: 'rev-4376-1',
        author: 'پریسا احمدوند',
        skinType: 'پوست بدن خشک و حساس',
        verified: true,
        rating: 5,
        date: '۱۶ مهر ۱۴۰۵',
        title: 'لطافت ابریشمی بدون ذره‌ای چسبندگی به لباس',
        comment:
          'بعد از حمام روی پوست نمدار می‌زنم، در عرض چند ثانیه جذب می‌شود و تا حمام بعدی پوستم کاملاً نرم، خوش‌حالت و درخشان می‌ماند.',
      },
    ],
  },
];

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    id: 'art-retinol-protocol',
    slug: 'giora-retinol-step-by-step-retinization-guide',
    title: 'راهنمای علمی رتینول‌تراپی (Retinization): چرا شروع پلکانی الزامی است؟',
    category: 'پروتکل‌های کلینیکال جیورا',
    readTime: '۵ دقیقه مطالعه',
    publishedAt: '۲۶ مهر ۱۴۰۵',
    author: {
      name: 'دکتر روشنک فرهمند',
      role: 'متخصص پوست و مشاور فرمولاسیون فیکس لایف (fixlife.ir)',
    },
    image: '/assets/fixlife/product-4370-1.png',
    excerpt:
      'چگونه با پروتکل ۳ مرحله‌ای سرم رتینول تخصصی جیورا (هفته‌ای ۲ شب تا مصرف شبانه)، کلاژن‌سازی را تا ۹۶٪ بدون پوسته‌ریزی یا التهاب فعال کنیم؟',
    content: [
      'رتینول استاندارد طلایی درماتولوژی برای معکوس کردن روند پیری پوست، تحریک فیبروبلاست‌ها و رفع خطوط ریز و چروک‌ها است. با این حال، بسیاری از افراد به دلیل شروع نادرست و مصرف هر شب از روز اول، دچار واکنش‌های تحریکی، قرمزی و پوسته‌ریزی می‌شوند. در فرمولاسیون سرم رتینول تخصصی جیورا (Giora) فیکس لایف، از فناوری «رتینول انکپسوله» در کنار هیالورونیک اسید دوگانه و سرامید استفاده شده تا رهایش ماده موثره به شکل تدریجی صورت گیرد.',
      'کلید موفقیت در رتینول‌تراپی، رعایت فرآیند زیستی «انطباق سلولی» یا Retinization است: در ۳ هفته اول، سرم را تنها هفته‌ای ۲ شب روی پوست کاملاً تمیز و خشک استفاده کنید تا گیرنده‌های اسید رتینوئیک در اپیدرم بدون شوک فعال شوند. در هفته‌های چهارم تا ششم، مصرف را به یک شب در میان ارتقاء دهید و از هفته هفتم به بعد، مصرف شبانه منظم را آغاز نمایید.',
      'فراموش نکنید که رتینول تنها باید در شب مصرف شود و استفاده از ضدآفتاب وسیع‌الطیف در طول روز برای محافظت از سلول‌های جوان و تازه‌تولیدشده، یک اصل جدانشدنی از این پروتکل است.',
    ],
    keyTakeaways: [
      'هفته ۱ تا ۳: فقط هفته‌ای ۲ شب روی پوست تمیز و خشک (فرآیند Retinization).',
      'هفته ۴ تا ۶: ارتقاء به مصرف یک شب در میان؛ از هفته هفتم: مصرف هر شب.',
      'رتینول انکپسوله جیورا به همراه سرامید و هیالورونیک اسید، ۹۶٪ کلاژن‌سازی را بدون التهاب فراهم می‌کند.',
    ],
    relatedProductIds: ['4370', '4360', '4382'],
  },
  {
    id: 'art-darkness-anti-spot',
    slug: 'why-anti-spot-serums-require-complete-darkness',
    title: 'راز پروتکل تاریکی در درمان لک و ملاسما با سرم جیورا و کرم نوبل',
    category: 'درمان تخصصی لک و تیرگی',
    readTime: '۵ دقیقه مطالعه',
    publishedAt: '۲۰ مهر ۱۴۰۵',
    author: {
      name: 'دکتر روشنک فرهمند',
      role: 'متخصص پوست و مشاور فرمولاسیون فیکس لایف (fixlife.ir)',
    },
    image: '/assets/fixlife/product-4364-1.jpg',
    excerpt:
      'چرا پس از استفاده از سرم ضد لک جیورا و کرم درمو برایت نوبل باید چراغ‌ها را خاموش کرد و از نور آبی موبایل دور ماند؟',
    content: [
      'لک‌های پوستی، ملاسما و تیرگی‌های پس از التهاب (PIH) نتیجه بیش‌فعالی آنزیم تیروزیناز و تجمع رنگدانه ملانین در لایه‌های اپیدرم و درم هستند. سرم ضد لک جیورا (حاوی آلفا آربوتین خالص، نیاسینامید و شیرین‌بیان) و کرم ضد لک تخصصی درمو برایت نوبل (Nubelle) مستقیماً این مسیر آنزیمی را مسدود می‌کنند.',
      'اما یکی از مهم‌ترین نکات کلینیکی که در وب‌سایت رسمی فیکس لایف (fixlife.ir) بر آن تاکید شده، «پروتکل تاریکی شبانه» است: پس از زدن سرم ضد لک یا کرم درمو برایت نوبل در شب، باید بلافاصله چراغ‌ها را خاموش کرده و از نگاه کردن به صفحه موبایل یا تلویزیون خودداری کنید. نور مرئی پرانرژی و نور آبی (Blue Light / HEV) نه‌تنها باعث اکسیداسیون نوری اکتیوهای روشن‌کننده می‌شوند، بلکه گیرنده‌های نوری ملانوسیت‌ها (Opsin-3) را تحریک کرده و روند درمان لک را کند می‌کنند.',
      'با رعایت پروتکل مصرف شبانه در تاریکی، شستشوی ملایم صبحگاهی و استفاده حتمی از ضدآفتاب در روز، شفافیت اولیه پوست در ۷ تا ۱۰ روز و محو شدن ۹۴ تا ۹۵ درصدی لک‌های مقاوم طی دوره ۴ تا ۸ هفته‌ای محقق می‌شود.',
    ],
    keyTakeaways: [
      'سرم ضد لک جیورا و کرم درمو برایت نوبل را فقط شب‌ها (به جز ناحیه دور چشم) استفاده کنید.',
      'بلافاصله پس از مصرف، چراغ‌ها را خاموش کرده و از نور آبی صفحه موبایل دور بمانید.',
      'صبح‌ها صورت را با شوینده ملایم بشویید و در طول روز حتماً ضدآفتاب بزنید.',
    ],
    relatedProductIds: ['4364', '4380'],
  },
  {
    id: 'art-acne-60min-protocol',
    slug: 'giora-organic-anti-acne-60-minute-short-contact-therapy',
    title: 'مکانیسم ۶۰ دقیقه‌ای سرم ضدجوش ارگانیک جیورا و ماساژ ضدجاذبه هیالورونیک',
    category: 'پاکسازی و هیدراتاسیون',
    readTime: '۶ دقیقه مطالعه',
    publishedAt: '۱۲ مهر ۱۴۰۵',
    author: {
      name: 'الهام رادمنش',
      role: 'پژوهشگر درماتولوژی و سردبیر مجله فیکس لایف',
    },
    image: '/assets/fixlife/product-4356-1.png',
    excerpt:
      'آشنایی با روش علمی تماس ۱ ساعته (Short-Contact Therapy) در سرم ضدجوش جیورا و تکنیک ماساژ ۱۰ دقیقه‌ای کرم هیالورونیک اسید.',
    content: [
      'درمان جوش‌های فعال نیازمند تعادل ظریفی میان «پاکسازی باکتری Cutibacterium acnes و چربی منافذ» و «حفظ رطوبت سد دفاعی پوست» است. سرم ضدجوش ارگانیک جیورا با پایه آبی فاقد چربی و سالیسیلیک اسید (BHA)، بر اساس متد علمی تماس کنترل‌شده طراحی شده است: هر روز عصر سرم را با سرانگشتان تمیز (بدون پد) روی جوش‌ها و کل صورت پخش کنید، اجازه دهید دقیقاً ۱ ساعت (۶۰ دقیقه) بماند تا به عمق منافذ نفوذ کند و سپس فقط با آب ولرم یا سرد (بدون شوینده) آبکشی نمایید.',
      'در کنار درمان جوش، آبرسانی به پوست با کرم هیالورونیک اسید جیورا (که تا ۱۰۰۰ برابر وزن مولکولی خود آب جذب می‌کند) از دهیدراته شدن پوست جلوگیری می‌نماید. اجرای ماساژ ۱۰ دقیقه‌ای خلاف جهت جاذبه زمین (از گردن به چانه، از چانه به گوش‌ها و از گونه‌ها به گیجگاه) هنگام مصرف این کرم، علاوه بر جذب ۹۸ درصدی، موجب لیفت و فرم‌دهی طبیعی صورت می‌شود.',
      'برای تکمیل روتین مراقبت از پوست بدن نیز استفاده از لوسیون بدن جیورا بلافاصله پس از حمام روی پوست کمی نمدار، هیدراتاسیون ۹۹ درصدی را برای ۲۴ ساعت کامل قفل می‌کند.',
    ],
    keyTakeaways: [
      'سرم ضدجوش جیورا را عصرها به کل صورت بزنید و پس از ۱ ساعت فقط با آب خالی بشویید.',
      'کرم هیالورونیک اسید جیورا را روزی ۲ بار با ۱۰ دقیقه ماساژ رو به بالا جذب پوست کنید.',
      'لوسیون بدن جیورا را بلافاصله بعد از حمام روی پوست کمی نمدار استفاده نمایید.',
    ],
    relatedProductIds: ['4356', '4360', '4376'],
  },
];

export const INITIAL_DEMO_CUSTOMER: CustomerUser = {
  id: 'cust-fixlife-001',
  firstName: 'سارا',
  lastName: 'محمدی',
  email: 'sara.mohammadi@fixlife.ir',
  phone: '09123456789',
  token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fixlife_session_token_2026',
  createdAt: '2026-02-14T10:00:00Z',
  skinProfile: {
    skinType: 'پوست مختلط و کم‌آب',
    primaryConcerns: ['brightening', 'anti-aging'],
  },
  billingAddress: {
    firstName: 'سارا',
    lastName: 'محمدی',
    company: 'استودیو طراحی سارا',
    addressLine1: 'خیابان ولیعصر، بالاتر از پارک ساعی، کوچه مهر، پلاک ۲۴، واحد ۸',
    city: 'تهران',
    state: 'تهران',
    postalCode: '1968943111',
    country: 'ایران',
    phone: '09123456789',
  },
  shippingAddress: {
    firstName: 'سارا',
    lastName: 'محمدی',
    company: 'استودیو طراحی سارا',
    addressLine1: 'خیابان ولیعصر، بالاتر از پارک ساعی، کوچه مهر، پلاک ۲۴، واحد ۸',
    city: 'تهران',
    state: 'تهران',
    postalCode: '1968943111',
    country: 'ایران',
    phone: '09123456789',
  },
};

export const INITIAL_DEMO_ORDERS: OrderRecord[] = [
  {
    id: 'ord-9042',
    orderNumber: 'FIX-10482',
    createdAt: '2026-10-18T14:22:00Z',
    status: 'completed',
    customerEmail: 'sara.mohammadi@fixlife.ir',
    customerName: 'سارا محمدی',
    customer: {
      email: 'sara.mohammadi@fixlife.ir',
      phone: '09123456789',
      first_name: 'سارا',
      last_name: 'محمدی',
    },
    shippingAddress: INITIAL_DEMO_CUSTOMER.shippingAddress,
    billingAddress: INITIAL_DEMO_CUSTOMER.billingAddress,
    shippingMethod: 'express',
    paymentMethod: 'card',
    promoCode: 'GLOW15',
    currency: 'TMN',
    items: [
      {
        product_id: '4370',
        sku: 'GIORA-RETINOL-30ML',
        name: 'سرم رتینول تخصصی و ضد چروک جیورا (Giora)',
        size: '۳۰ میلی‌لیتر',
        quantity: 1,
        unit_price_usd: 999000,
        line_total_usd: 999000,
      },
      {
        product_id: '4380',
        sku: 'NUBELLE-DERMOBRITE-30ML',
        name: 'کرم ضد لک تخصصی درمو برایت نوبل (Nubelle)',
        size: '۳۰ میلی‌لیتر',
        quantity: 1,
        unit_price_usd: 1900000,
        line_total_usd: 1900000,
      },
    ],
    subtotalUSD: 2899000,
    discountUSD: 434850,
    shippingUSD: 165000,
    totalUSD: 2629150,
    trackingNumber: 'TIPAX-7845129630',
  },
  {
    id: 'ord-9058',
    orderNumber: 'FIX-10519',
    createdAt: '2026-10-23T09:15:00Z',
    status: 'processing',
    customerEmail: 'sara.mohammadi@fixlife.ir',
    customerName: 'سارا محمدی',
    customer: {
      email: 'sara.mohammadi@fixlife.ir',
      phone: '09123456789',
      first_name: 'سارا',
      last_name: 'محمدی',
    },
    shippingAddress: INITIAL_DEMO_CUSTOMER.shippingAddress,
    billingAddress: INITIAL_DEMO_CUSTOMER.billingAddress,
    shippingMethod: 'standard',
    paymentMethod: 'card',
    promoCode: null,
    currency: 'TMN',
    items: [
      {
        product_id: '4364',
        sku: 'GIORA-ANTISPOT-30ML',
        name: 'سرم ضد لک و روشن‌کننده تخصصی جیورا (Giora)',
        size: '۳۰ میلی‌لیتر',
        quantity: 1,
        unit_price_usd: 900000,
        line_total_usd: 900000,
      },
      {
        product_id: '4360',
        sku: 'GIORA-HYALURONIC-50ML',
        name: 'کرم هیالورونیک اسید جیورا (Giora)',
        size: '۵۰ میلی‌لیتر',
        quantity: 1,
        unit_price_usd: 900000,
        line_total_usd: 900000,
      },
      {
        product_id: '4382',
        sku: 'GIORA-EYE-20ML',
        name: 'کرم چندکاره دور چشم جیورا (Giora)',
        size: '۲۰ میلی‌لیتر',
        quantity: 1,
        unit_price_usd: 1200000,
        line_total_usd: 1200000,
      },
    ],
    subtotalUSD: 3000000,
    discountUSD: 0,
    shippingUSD: 0,
    totalUSD: 3000000,
    trackingNumber: 'در حال آماده‌سازی در انبار مرکزی تهران',
  },
];

export const FAQ_ITEMS = [
  {
    question:
      'چگونه محصولات اصلی جیورا (Giora) و نوبل (Nubelle) را از فیکس لایف تهیه کنیم و پروتکل مصرف آن‌ها چیست؟',
    answer:
      'تمامی ۷ محصول تخصصی فیکس لایف شامل سرم رتینول جیورا، سرم ضد لک جیورا، سرم ضدجوش ارگانیک جیورا، کرم دور چشم چندکاره جیورا، کرم ضد لک درمو برایت نوبل، کرم آبرسان هیالورونیک اسید جیورا و لوسیون بدن جیورا با ضمانت اصالت ۱۰۰٪ در این وب‌سایت عرضه می‌شوند. در پنجره جزئیات هر محصول، جدول مشخصات فنی، ترکیبات موثره و پروتکل مصرف گام‌به‌گام (مانند شروع پلکانی رتینول، پروتکل تاریکی ضد لک و مکانیسم ۱ ساعته سرم ضدجوش) به طور کامل درج شده است.',
  },
  {
    question: 'شرایط ارسال رایگان به سراسر ایران چگونه است؟',
    answer:
      'تمامی سفارش‌هایی که مبلغ نهایی سبد خرید آن‌ها بالای ۲,۵۰۰,۰۰۰ تومان باشد، به صورت کاملاً رایگان از طریق پست پیشتاز یا تیپاکس به تمامی ۳۱ استان و شهرهای ایران ارسال می‌شوند. برای سفارش‌های کمتر از این مبلغ، هزینه ارسال استاندارد ۸۵,۰۰۰ تومان است.',
  },
  {
    question: 'نحوه ثبت آدرس، کد پستی ۱۰ رقمی و شماره موبایل در هنگام خرید چگونه است؟',
    answer:
      'فروشگاه اینترنتی فیکس لایف (fixlife.ir) ویژه فروش در داخل ایران طراحی شده است. در فرم تسویه‌حساب کافی است استان و شهر خود را از لیست شهرهای ایران انتخاب کرده، کد پستی دقیق ۱۰ رقمی (بدون خط تیره) و شماره موبایل ۱۱ رقمی فعال خود (با پیش‌شماره ۰۹) را وارد نمایید تا کد رهگیری مرسوله برای شما پیامک شود.',
  },
  {
    question: 'آیا امکان استفاده از کد تخفیف GLOW15 یا جشنواره ۲۰٪ (SALE20) وجود دارد؟',
    answer:
      'بله، شما می‌توانید در سبد خرید خود کد GLOW15 (معادل ۱۵٪ تخفیف اولین خرید) یا کد SALE20 (معادل ۲۰٪ تخفیف ویژه جشنواره فیکس لایف) را وارد و به صورت آنی روی مبلغ کل سفارش به تومان اعمال نمایید.',
  },
];

export const PHP_MYSQL_API_CONTRACTS: ApiContractEndpoint[] = [
  {
    method: 'GET',
    endpoint: '/api/products?category=serums&concern=brightening',
    phpController: 'public_html/api/v1/CatalogController.php -> index()',
    description:
      'واکشی لیست ۷ محصول اصلی جیورا (Giora) و نوبل (Nubelle) از جدول MySQL `wc_fixlife_products` به همراه اطلاعات سئو، پروتکل مصرف و قیمت به تومان.',
    responseExample: {
      status: 'success',
      count: 7,
      currency_base: 'TMN',
      data: [
        {
          id: '4370',
          sku: 'GIORA-RETINOL-30ML',
          name: 'سرم رتینول تخصصی و ضد چروک جیورا (Giora)',
          permalink:
            'https://fixlife.ir/product/giora-specialized-retinol-anti-aging-serum-by-fix-life/',
          priceUSD: 999000,
          rating: 4.9,
          reviewCount: 156,
          concerns: ['anti-aging', 'brightening'],
        },
      ],
    },
  },
  {
    method: 'POST',
    endpoint: '/api/auth/login',
    phpController: 'public_html/api/v1/AuthController.php -> login()',
    description:
      'احراز هویت مشتری در جدول `wc_fixlife_customers` و بازگرداندن توکن JWT به همراه آدرس‌های ثبت‌شده در ایران.',
    requestExample: {
      email: 'sara.mohammadi@fixlife.ir',
      password: '••••••••••••',
    },
    responseExample: {
      status: 'success',
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      user: {
        id: 'cust-fixlife-001',
        firstName: 'سارا',
        lastName: 'محمدی',
        email: 'sara.mohammadi@fixlife.ir',
        phone: '09123456789',
      },
    },
  },
  {
    method: 'POST',
    endpoint: '/api/cart/validate',
    phpController: 'public_html/api/v1/CartController.php -> validatePromo()',
    description:
      'اعتبارسنجی کدهای تخفیف (`GLOW15` یا `SALE20`) در جدول `wc_fixlife_coupons` و محاسبه تخفیف به تومان.',
    requestExample: {
      promo_code: 'GLOW15',
      subtotal_usd: 2899000,
    },
    responseExample: {
      valid: true,
      code: 'GLOW15',
      discountPercent: 15,
      discountAmountUSD: 434850,
      shippingUSD: 0,
      message: 'کد تخفیف ۱۵٪ اولین خرید (GLOW15) با موفقیت اعمال شد!',
    },
  },
  {
    method: 'POST',
    endpoint: '/api/orders',
    phpController: 'public_html/api/v1/OrderController.php -> store()',
    description:
      'بررسی دقیق استان و شهر ایران، کد پستی ۱۰ رقمی و شماره موبایل ۱۱ رقمی (`09xxxxxxxxx`) و ثبت سفارش در جداول `wc_fixlife_orders` و `wc_fixlife_order_items`.',
    requestExample: {
      customer: {
        email: 'sara.mohammadi@fixlife.ir',
        first_name: 'سارا',
        last_name: 'محمدی',
        phone: '09123456789',
      },
      shipping_method: 'standard',
      payment_method: 'card',
      promo_code: 'GLOW15',
      currency: 'TMN',
      items: [
        {
          product_id: '4370',
          sku: 'GIORA-RETINOL-30ML',
          name: 'سرم رتینول تخصصی و ضد چروک جیورا (Giora)',
          size: '۳۰ میلی‌لیتر',
          quantity: 1,
          unit_price_usd: 999000,
          line_total_usd: 999000,
        },
      ],
      totals: {
        subtotal_usd: 999000,
        discount_usd: 149850,
        shipping_usd: 85000,
        total_usd: 934150,
      },
    },
    responseExample: {
      status: 'success',
      message: 'سفارش شما با موفقیت ثبت شد',
      order: {
        id: 'ord-9091',
        orderNumber: 'FIX-10540',
        status: 'processing',
        createdAt: '2026-10-24T14:50:00Z',
      },
    },
  },
  {
    method: 'POST',
    endpoint: 'https://fixlife.ir/api/payment/initiate',
    phpController: 'public_html/api/payment/initiate.php -> initiateZarinpal()',
    description:
      'دریافت اطلاعات سفارش ثبت‌شده (مبلغ به تومان، شماره سفارش، موبایل و ایمیل)، دریافت توکن Authority از وب‌سرویس زرین‌پال (ZarinPal v4 REST API) و بازگرداندن لینک هدایت شاپرک (`paymentUrl`).',
    requestExample: {
      orderId: 'ord-172981023',
      amount: 934150,
      mobile: '09123456789',
      email: 'sara.mohammadi@fixlife.ir',
    },
    responseExample: {
      status: 'success',
      authority: 'A00000000000000000000000000012345678',
      paymentUrl: 'https://payment.zarinpal.com/pg/StartPay/A00000000000000000000000000012345678',
      message: 'در حال انتقال به درگاه امن زرین‌پال...',
    },
  },
  {
    method: 'PUT',
    endpoint: '/api/customer/address',
    phpController: 'public_html/api/v1/CustomerController.php -> updateAddress()',
    description:
      'بروزرسانی آدرس مشتری در جدول `wc_fixlife_customer_addresses` با اعتبارسنجی استان/شهر ایران، کد پستی ۱۰ رقمی و موبایل ۱۱ رقمی.',
    requestExample: {
      type: 'shipping',
      address: {
        firstName: 'سارا',
        lastName: 'محمدی',
        addressLine1: 'خیابان ولیعصر، بالاتر از پارک ساعی، پلاک ۲۴، واحد ۸',
        city: 'تهران',
        state: 'تهران',
        postalCode: '1968943111',
        country: 'ایران',
        phone: '09123456789',
      },
    },
    responseExample: {
      status: 'success',
      message: 'آدرس ارسال با موفقیت بروزرسانی شد.',
    },
  },
];
