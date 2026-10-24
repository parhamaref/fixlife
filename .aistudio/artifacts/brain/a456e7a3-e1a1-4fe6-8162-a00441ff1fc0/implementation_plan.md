# LUMIÈRE SKINCARE — Luxury Botanical Skincare E-Commerce Flagship

A warm-neutral, editorial luxury skincare storefront and full-featured e-commerce platform crafted to match the LUMIÈRE SKINCARE reference visual system while delivering complete shopping, multi-step checkout, customer order management, and decoupled REST API integration.

### User Review & Critical Decisions

> [!IMPORTANT]
> Please review the confirmed architectural and product choices below before we proceed to implementation.

- **Confirmed Decision — Checkout & Customer Account Flow**: Full multi-step checkout modal (Shipping/Billing Details $\to$ Delivery & Payment Method $\to$ Order Review & Confirmation) paired with an interactive Customer Account & Order Dashboard supporting authentication, live fulfillment status tracking (`pending`, `processing`, `completed`, `cancelled`), and saved address management.
- **Confirmed Decision — Storefront Interactive Features**:
  - **Expanded Product Catalog**: Complete collection spanning Serums, Cleansers, Moisturizers, Sunscreens, and Skincare Sets mapped across all 5 skin concerns (*Acne & Blemishes*, *Dryness*, *Anti-Aging*, *Brightening*, *Sensitive Skin*).
  - **Interactive Promo Engine**: Live coupon validation in the slide-over cart drawer and checkout for `GLOW15` (15% off first order) and `GLOW20` / `SALE20` (20% off sitewide promotional banner offer), alongside the dynamic $60 Free Shipping progress bar.
  - **Full Editorial Journal Reader & Skin Concern Finder**: Clickable journal articles with full long-form editorial reading view, ingredient spotlights, and an interactive Skin Routine & Concern Filter.
  - **Multi-Currency Switcher**: Real-time currency conversion (`USD $`, `EUR €`, `GBP £`, `CAD $`) in the announcement bar that dynamically updates prices, thresholds, and subtotals across the entire storefront.
- **Confirmed Default — Backend & Persistence Strategy**: Express REST API (`/api/*`) with stateful persistence and client-side synchronization, accompanied by complete JSON request/response payload documentation for seamless cPanel LAMP/LEMP (PHP + MySQL) integration.

---

### 1. Overview & Core Concept

- **What It Does**: Recreates the exact sunlit travertine, frosted glass, and warm-ivory editorial flagship experience of LUMIÈRE SKINCARE while functioning as a complete, end-to-end WooCommerce-grade digital store. Customers can browse by category or skin concern, inspect clinical ingredients in quick-view modals, apply promotional codes in a frictionless slide-over bag, complete validated multi-step checkouts, and manage orders and addresses in their personal account dashboard.
- **Target Audience / Persona**: Discerning skincare enthusiasts seeking clean, clinically tested botanical formulations presented in a calm, tactile, magazine-grade shopping environment free of visual clutter.
- **Key Value**: Bridges high-fashion editorial aesthetics with high-conversion e-commerce ergonomics—combining instant search, skin-concern filtering, transparent ingredient education, and a decoupled REST architecture ready for production deployment.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Discovery & Filtering**: Users land on the split editorial hero, explore the 4-column clinical trust bar, and click any of the 5 *Shop by Skin Concern* portrait cards or header dropdown items to filter the product catalog in place or open the interactive Skin Routine Matcher.
  2. **Product Inspection & Quick Add**: Hovering over product cards reveals a smooth *Quick Add* bar and wishlist toggle. Clicking a product opens the *Contiguous Purchase & Quick-View Modal* featuring size variants (`30ml`, `50ml`, `100ml`), clinical efficacy metrics, full INCI ingredient lists, how-to-use rituals, and verified customer reviews.
  3. **Slide-Over Bag & Promo Application**: Adding an item opens the *Side Cart Drawer* displaying the dynamic Free Shipping progress meter ($60 threshold), quantity steppers, one-click promo code application (`GLOW15` for 15% off or `SALE20` for 20% off), and live currency-converted subtotals.
  4. **Multi-Step Validated Checkout**: Proceeding to checkout opens a structured 3-step flow with regex validation for email, phone, and postal code, shipping method selection, payment method choice (Card, Apple Pay, PayPal, or Cash on Delivery), and instant Order Receipt generation.
  5. **Customer Dashboard & Editorial Journal**: Users can sign in or register to view their order history, track real-time fulfillment badges, manage billing/shipping addresses, or read full-length skincare articles from the *From The Journal* section.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Warm Quiet Luxury & Sunlit Travertine Editorial (*Vogue* / *Harper's Bazaar* beauty aesthetic).
  - *Color Palette & Mood* (60-30-10 Discipline):
    - **60% Dominant Neutral Canvas**: Warm Alabaster / Soft Ivory (`#FDFBF7` primary background, `#FAF7F2` card canvas).
    - **30% Structural Surfaces**: Muted Sandy Travertine (`#EFECE6` / `#EAE3D9` promotional & concern surfaces), Warm Sand (`#ECE7E1` announcement bar), Delicate Hairline Warm Gray (`#E8E4DC` borders), Warm Tan (`#D9CEBE` concern label strips).
    - **10% Accent & High-Intent Contrast**: Deep Espresso Charcoal (`#1A1A1A` primary text and solid primary CTA buttons with `#FFFFFF` crisp text) paired with Warm Champagne Gold (`#C5A880` / `#B89B72` metallic accents, stars, and badges).
  - *Typography & Hierarchy* (2+1 Font Rule):
    - **Display & Brand Wordmark**: `Cormorant Garamond` / `Playfair Display` — high-contrast editorial serif with graceful ligatures for the `LUMIÈRE SKINCARE` lockup, hero headline (*"Skincare That Brings Out Your Natural Glow"*), and section titles.
    - **UI, Navigation & Body Copy**: `Plus Jakarta Sans` — clean geometric sans-serif for navigation links, tracked micro-labels (`0.15em` letter-spacing), product titles, and comfortable body copy (`1.6` line-height).
    - **Numeric & Price Precision**: Tabular numerals (`tabular-nums`) for all prices, star review counts, order totals, and discount calculations.
  - *Component Styling & Layout*:
    - 1440px desktop baseline with airy container padding, single-elevation cards, and hairline dividers (`1px solid #E8E4DC`).
    - Exact visual parity with the reference screenshot across all 12 core sections:
      1. Top Announcement Bar (`FREE SHIPPING ON ORDERS OVER $60` | `15% OFF YOUR FIRST ORDER | CODE: GLOW15` | Currency Switcher `USD $ ▾`, `HELP & FAQ`, Social Icons).
      2. Sticky Main Header (`LUMIÈRE SKINCARE` stacked wordmark, `SHOP ▾`, `BEST SELLERS`, `SKIN CONCERNS ▾`, `ABOUT US`, `JOURNAL`, `CONTACT`, and Search, Account, Wishlist, and Bag counter icons).
      3. Split Editorial Hero with dappled sunlight imagery of the *Radiance Serum*, *Daily Cleanser*, and *Moisture Cream* resting on a travertine stone slab with botanical sprigs.
      4. 4-Column Minimal Trust Bar (*Clean & Safe Ingredients*, *Clinically Tested*, *Free Shipping Over $60*, *24/7 Customer Support*) separated by fine vertical dividers.
      5. *Shop by Skin Concern* 5-card portrait grid (*Acne & Blemishes*, *Dryness*, *Anti-Aging*, *Brightening*, *Sensitive Skin*) with warm `#D9CEBE` bottom label strips.
      6. *Best Sellers* 4-column studio product showcase (*Radiance Serum $42.00*, *Moisture Cream $38.00*, *Gentle Cleanser $28.00*, *Daily Sunscreen SPF 50 $26.00*) plus expandable full catalog filter bar.
      7. *Promotional Callout Banner* (*"LIMITED TIME ONLY — GLOW BETTER. SAVE MORE."* with brass tray flat-lay on the left, CTA in the center, and circular *20% OFF SITEWIDE* badge on the right).
      8. *From The Journal* 3-column editorial beauty cards with macro texture photography and *Read More →* drawers.
      9. *Join Our Glow Community* horizontal newsletter bar with envelope icon and instant subscription toast.
      10. *Complete 5-Column Footer + Trust Column* (*Secure Payment*, *Easy Returns*, *Clean & Sustainable*) and bottom payment method badges.

- **Interactive Feedback & Motion**:
  - Compositor-only transitions (`transform`, `opacity`) settling within `150ms–200ms` (`cubic-bezier(0.16, 1, 0.3, 1)`).
  - Subtle image scale (`scale(1.03)`) on concern and journal card hover; smooth slide-up *Quick Add* button on product cards.
  - Non-intrusive toast notifications for cart updates, wishlist toggles, promo code applications, and newsletter signups.

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Faithful Reference Composition + Expandable Interactive Catalog**
  - *Chosen Approach*: Preserve the exact 4-card *Best Sellers* row and 5-card *Shop by Skin Concern* layout by default so the landing page matches the reference screenshot 1:1, while allowing users to click any concern, category dropdown, or *"VIEW ALL →"* to expand the full 12-product catalog with live sorting and filtering.
  - *Why*: Achieves 100% visual fidelity to the provided screenshot on initial load while fulfilling full e-commerce catalog depth on interaction.
  - *Alternatives Considered*: Rendering all 12 products on initial load (rejected because it alters the clean 4-card visual rhythm of the reference screenshot).

- **Decision 2: Decoupled REST API Architecture (`/api/*`) with Local Fallback**
  - *Chosen Approach*: Implement a full Express REST backend (`API_BASE_URL = "/api"`) handling authentication, product queries, cart calculation, promo validation, order creation, and customer profile updates, paired with automatic client-side state synchronization and comprehensive PHP/MySQL contract documentation.
  - *Why*: Ensures every action dispatches real `fetch` requests with loading states and `try/catch` error banners, making migration to a cPanel LAMP/LEMP backend effortless.

---

### 4. Technical Architecture & Data Strategy *(Technical Reference)*

- **Architecture & Component Diagram**:

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                        LUMIÈRE SKINCARE CLIENT APPLICATION                   │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ Global Storefront Context (Currency, Auth Session, Cart, Wishlist)     │  │
│  └───────────────┬────────────────────────────────────────┬───────────────┘  │
│                  │                                        │                  │
│                  ▼                                        ▼                  │
│  ┌───────────────────────────────────┐    ┌───────────────────────────────┐  │
│  │ Editorial Landing & Catalog Views │    │ Interactive Overlays & Modals │  │
│  ├───────────────────────────────────┤    ├───────────────────────────────┤  │
│  │ • Announcement Bar (Currency/FAQ) │    │ • Slide-Over Cart & Promo Bar │  │
│  │ • Sticky Header & Mega Dropdowns  │    │ • 3-Step Validated Checkout   │  │
│  │ • Split Sunlit Hero Banner        │    │ • Customer Account Dashboard  │  │
│  │ • 4-Col Clinical Trust Bar        │    │ • Product Quick-View & INCI   │  │
│  │ • 5-Col Skin Concern Portrait Row │    │ • Live Search & Skin Quiz     │  │
│  │ • Best Sellers & Expanded Catalog │    │ • Full Journal Article Reader │  │
│  │ • 20% Off Brass Tray Promo Banner │    │ • Help/FAQ & API Contract Doc │  │
│  │ • From The Journal & Newsletter   │    └───────────────┬───────────────┘  │
│  └───────────────┬───────────────────┘                    │                  │
└──────────────────┼────────────────────────────────────────┼──────────────────┘
                   │          REST Fetch (/api/*)           │
                   ▼                                        ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                 EXPRESS REST API LAYER (LAMP/LEMP CONTRACT PARITY)           │
├──────────────────────────────────────────────────────────────────────────────┤
│  • GET  /api/products          (Catalog, concern & category filtering)       │
│  • POST /api/auth/login        (JWT/Token session authentication)            │
│  • POST /api/auth/register     (Customer account registration)               │
│  • POST /api/cart/validate     (Promo codes GLOW15, SALE20 & shipping calc)  │
│  • POST /api/orders            (Validated checkout payload & order creation) │
│  • GET  /api/orders            (Customer order history & fulfillment status) │
│  • PUT  /api/customer/address  (Billing & shipping address management)       │
│  • POST /api/newsletter        (Glow Community email subscription)           │
└──────────────────────────────────────────────────────────────────────────────┘
```

- **Data Model & State**:
  - **Product**: `id`, `sku`, `name`, `subtitle`, `category` (`serums` | `cleansers` | `moisturizers` | `sunscreen` | `sets`), `concerns` (`acne` | `dryness` | `anti-aging` | `brightening` | `sensitive`), `priceUSD`, `compareAtPriceUSD`, `rating`, `reviewCount`, `isBestSeller`, `isNew`, `tag`, `sizes` (`30ml`, `50ml`, `100ml`), `image`, `description`, `benefits`, `keyIngredients`, `fullInci`, `howToUse`, `reviews`.
  - **CartState**: `items` (`productId`, `selectedSize`, `quantity`, `unitPriceUSD`), `promoCode` (`GLOW15` = 15% off, `SALE20` = 20% off), `discountAmountUSD`, `subtotalUSD`, `shippingUSD` (Free $\ge \$60$, else $\$8$), `totalUSD`.
  - **Customer & Order**: `user` (`id`, `name`, `email`, `token`, `billingAddress`, `shippingAddress`), `orders` (`orderNumber`, `createdAt`, `status`: `'pending'` | `'processing'` | `'completed'` | `'cancelled'`, `items`, `shippingAddress`, `paymentMethod`, `subtotal`, `discount`, `shipping`, `total`, `currency`).

- **Interactive Component & State Mapping**:
  - **Currency Switcher (`USD`, `EUR`, `GBP`, `CAD`)**: Updates active exchange multiplier and currency symbol across all product cards, cart drawer, free-shipping threshold bar, and checkout summary.
  - **Concern & Category Filters**: Clicking any of the 5 concern portrait cards or header dropdown items smoothly scrolls to the catalog, activates the filter pill, and fetches/filters matching formulations.
  - **Promo Banner & Code Application**: Clicking *"SHOP THE SALE"* on the 20% off banner automatically applies code `SALE20` (20% off sitewide) to the user's bag and opens a confirmation toast.
  - **Checkout Validation**: Enforces RFC-compliant email regex, international phone validation, and postal code format checks before dispatching `POST /api/orders`, transitioning into an order confirmation view and appending the new order to the Customer Dashboard.
