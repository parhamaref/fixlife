/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  X,
  User,
  Package,
  MapPin,
  LogOut,
  Code2,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  AlertCircle,
  Database,
  Copy,
  Check,
  KeyRound,
  ShieldCheck,
  Mail,
  MessageCircle,
  Lock,
  Plus,
  Pencil,
  Trash2,
  BarChart3,
  Boxes,
  Image as ImageIcon,
  Upload,
  RotateCcw,
  Search,
  TrendingUp,
} from 'lucide-react';
import {
  CurrencyConfig,
  CustomerAddress,
  CustomerUser,
  OrderRecord,
  OrderStatus,
  Product,
  ProductCategory,
  SkinConcernId,
} from '../types/ecommerce';
import {
  PHP_MYSQL_API_CONTRACTS,
  PRODUCTS,
  SKIN_CONCERNS,
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
import { buildDatabaseSchemaExportObject } from '../data/databaseSchemaExport';
import {
  ADMIN_NOTIFICATION_EMAIL,
  AdminEmailLogRecord,
  SITE_OFFICIAL_EMAIL,
  calculateProductSalesStats,
  changeCustomerPasswordApi,
  createProductAdminApi,
  deleteProductAdminApi,
  forgotCustomerPasswordApi,
  getAdminEmailLogs,
  getStoredProducts,
  getSupportWhatsAppNumber,
  isAdminAuthenticated,
  loginAdminPanel,
  logoutAdminPanel,
  resetProductsToDefaultAdminApi,
  setSupportWhatsAppNumber,
  updateProductAdminApi,
} from '../services/api';

export type DashboardTabId =
  | 'orders'
  | 'addresses'
  | 'security'
  | 'admin_panel'
  | 'schema_export';

interface CustomerDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  customer: CustomerUser | null;
  orders: OrderRecord[];
  products?: Product[];
  onProductsUpdated?: (products: Product[]) => void;
  currency: CurrencyConfig;
  initialTab?: DashboardTabId;
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (payload: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<void>;
  onLogout: () => void;
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  onUpdateAddress: (
    type: 'billing' | 'shipping',
    address: CustomerAddress
  ) => Promise<void>;
}

const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'در انتظار تایید',
  processing: 'در حال پردازش و ارسال',
  completed: 'تحویل شده',
  cancelled: 'لغو شده',
};

const PRODUCT_CATEGORY_LABELS_FA: Record<Exclude<ProductCategory, 'all'>, string> = {
  serums: 'سرم تخصصی',
  moisturizers: 'کرم و لوسیون مرطوب‌کننده',
  cleansers: 'شوینده و پاک‌کننده',
  sunscreen: 'ضدآفتاب محافظتی',
  sets: 'پکیج روتین کامل',
};

const PHP_EMAIL_NOTIFICATION_SNIPPET = `<?php
// فایل: /api/notifications/admin-email.php (هاست cPanel فیکس لایف)
header('Content-Type: application/json; charset=utf-8');

$raw = file_get_contents('php://input');
$data = json_decode($raw, true);

$fromEmail = 'info@fixlife.ir';
$adminEmail = 'parham.aref87@gmail.com';
$subject = isset($data['subject']) ? $data['subject'] : '[فیکس لایف] اعلان جدید سایت';
$body = isset($data['body']) ? $data['body'] : '';

$headers = "From: FixLife Official <" . $fromEmail . ">\\r\\n";
$headers .= "Reply-To: " . $fromEmail . "\\r\\n";
$headers .= "MIME-Version: 1.0\\r\\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\\r\\n";

$sent = @mail($adminEmail, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, $headers);

echo json_encode([
  'status' => $sent ? 'success' : 'queued',
  'from' => $fromEmail,
  'to' => $adminEmail
]);
`;

interface ProductFormState {
  id: string | null;
  name: string;
  subtitle: string;
  description: string;
  image: string;
  priceUSD: string;
  compareAtPriceUSD: string;
  category: Exclude<ProductCategory, 'all'>;
  concerns: SkinConcernId[];
  sku: string;
  defaultSize: string;
  tag: string;
  stockQuantity: string;
  initialSoldCount: string;
  isBestSeller: boolean;
  isNew: boolean;
}

const EMPTY_PRODUCT_FORM: ProductFormState = {
  id: null,
  name: '',
  subtitle: 'فرمولاسیون تخصصی درماتولوژی و مراقبت پوست فیکس لایف',
  description: '',
  image: '/assets/fixlife/product-4370-1.png',
  priceUSD: '980000',
  compareAtPriceUSD: '',
  category: 'serums',
  concerns: ['dryness'],
  sku: '',
  defaultSize: '۵۰ میلی‌لیتر',
  tag: 'فرمول تخصصی فیکس لایف',
  stockQuantity: '35',
  initialSoldCount: '0',
  isBestSeller: true,
  isNew: true,
};

export const CustomerDashboardModal: React.FC<CustomerDashboardModalProps> = ({
  isOpen,
  onClose,
  customer,
  orders,
  products: externalProducts,
  onProductsUpdated,
  initialTab = 'orders',
  onLogin,
  onRegister,
  onLogout,
  onUpdateOrderStatus,
  onUpdateAddress,
}) => {
  const [activeTab, setActiveTab] = useState<DashboardTabId>(
    initialTab === 'schema_export' ? 'admin_panel' : initialTab
  );
  const [authMode, setAuthMode] = useState<
    'login' | 'register' | 'forgot' | 'admin'
  >('login');

  // Customer Login / Register fields
  const [email, setEmail] = useState('sara.mohammadi@fixlife.ir');
  const [password, setPassword] = useState('fixlife1404');
  const [firstName, setFirstName] = useState('سارا');
  const [lastName, setLastName] = useState('محمدی');
  const [phone, setPhone] = useState('09123456789');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Forgot Password fields
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');

  // Change Password fields (for logged-in user)
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmNewPasswordInput, setConfirmNewPasswordInput] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(
    null
  );
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState<
    string | null
  >(null);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Admin Authentication State (Strictly username: parham, password: parham1382)
  const [isAdminAuth, setIsAdminAuth] = useState<boolean>(() =>
    isAdminAuthenticated()
  );
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoginError, setAdminLoginError] = useState<string | null>(null);
  const [adminSubTab, setAdminSubTab] = useState<
    'products' | 'schema' | 'emails' | 'whatsapp' | 'contracts'
  >('products');
  const [emailLogs, setEmailLogs] = useState<AdminEmailLogRecord[]>([]);
  const [whatsappInput, setWhatsappInput] = useState<string>(() =>
    getSupportWhatsAppNumber()
  );
  const [whatsappSavedMsg, setWhatsappSavedMsg] = useState<string | null>(null);

  // Admin Product Management & Inventory / Sales State
  const [adminProducts, setAdminProducts] = useState<Product[]>(() =>
    externalProducts && externalProducts.length > 0
      ? externalProducts
      : getStoredProducts()
  );
  const [adminProductSearch, setAdminProductSearch] = useState('');
  const [adminCategoryFilter, setAdminCategoryFilter] =
    useState<ProductCategory>('all');
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [productFormMode, setProductFormMode] = useState<'create' | 'edit'>(
    'create'
  );
  const [productForm, setProductForm] =
    useState<ProductFormState>(EMPTY_PRODUCT_FORM);
  const [productFormError, setProductFormError] = useState<string | null>(null);
  const [adminActionBanner, setAdminActionBanner] = useState<string | null>(
    null
  );
  const [confirmDeleteProductId, setConfirmDeleteProductId] = useState<
    string | null
  >(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Address editing state
  const [editingAddressType, setEditingAddressType] = useState<
    'shipping' | 'billing' | null
  >(null);
  const [addrForm, setAddrForm] = useState<CustomerAddress | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // Database Schema Export state (Admin Only)
  const schemaTextareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [copySuccessMessage, setCopySuccessMessage] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (externalProducts && externalProducts.length > 0) {
      setAdminProducts(externalProducts);
    }
  }, [externalProducts]);

  useEffect(() => {
    if (isOpen) {
      setIsAdminAuth(isAdminAuthenticated());
      setEmailLogs(getAdminEmailLogs());
      setAdminProducts(
        externalProducts && externalProducts.length > 0
          ? externalProducts
          : getStoredProducts()
      );
      if (initialTab === 'schema_export' || initialTab === 'admin_panel') {
        setActiveTab('admin_panel');
        if (!customer) {
          setAuthMode('admin');
        }
      } else if (initialTab) {
        setActiveTab(initialTab);
      }
    }
  }, [isOpen, initialTab, customer, externalProducts]);

  const productSalesStats = useMemo(() => {
    return calculateProductSalesStats(adminProducts, orders);
  }, [adminProducts, orders]);

  const filteredProductSalesStats = useMemo(() => {
    return productSalesStats.filter((stat) => {
      if (
        adminCategoryFilter !== 'all' &&
        stat.category !== adminCategoryFilter
      ) {
        return false;
      }
      if (adminProductSearch.trim()) {
        const q = adminProductSearch.trim().toLowerCase();
        return (
          stat.name.toLowerCase().includes(q) ||
          stat.sku.toLowerCase().includes(q) ||
          stat.productId.toLowerCase().includes(q) ||
          stat.subtitle.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [productSalesStats, adminCategoryFilter, adminProductSearch]);

  const overallStoreSummary = useMemo(() => {
    const totalProducts = productSalesStats.length;
    const totalUnitsSold = productSalesStats.reduce(
      (acc, s) => acc + s.totalUnitsSold,
      0
    );
    const totalSalesRevenueToman = productSalesStats.reduce(
      (acc, s) => acc + s.totalRevenueToman,
      0
    );
    const totalStockInWarehouse = productSalesStats.reduce(
      (acc, s) => acc + s.stockQuantity,
      0
    );
    const lowStockCount = productSalesStats.filter(
      (s) => s.stockQuantity <= 10
    ).length;
    return {
      totalProducts,
      totalUnitsSold,
      totalSalesRevenueToman,
      totalStockInWarehouse,
      lowStockCount,
    };
  }, [productSalesStats]);

  const schemaJsonString = useMemo(() => {
    const schemaData = buildDatabaseSchemaExportObject();
    return JSON.stringify(schemaData, null, 2);
  }, []);

  if (!isOpen) return null;

  const formatPrice = (toman: number) => formatToman(toman);

  const showAdminBanner = (msg: string) => {
    setAdminActionBanner(msg);
    window.setTimeout(() => {
      setAdminActionBanner(null);
    }, 4500);
  };

  const syncUpdatedProducts = (updatedList: Product[]) => {
    setAdminProducts(updatedList);
    if (onProductsUpdated) {
      onProductsUpdated(updatedList);
    }
  };

  const handleOpenCreateProduct = () => {
    setProductFormMode('create');
    setProductForm(EMPTY_PRODUCT_FORM);
    setProductFormError(null);
    setIsProductFormOpen(true);
  };

  const handleOpenEditProduct = (productId: string) => {
    const target =
      adminProducts.find((p) => p.id === productId) ||
      PRODUCTS.find((p) => p.id === productId);
    if (!target) return;
    setProductFormMode('edit');
    setProductForm({
      id: target.id,
      name: target.name,
      subtitle: target.subtitle || '',
      description: target.description || '',
      image: target.image || '',
      priceUSD: String(target.priceUSD || 0),
      compareAtPriceUSD: target.compareAtPriceUSD
        ? String(target.compareAtPriceUSD)
        : '',
      category: target.category,
      concerns:
        target.concerns && target.concerns.length > 0
          ? target.concerns
          : ['dryness'],
      sku: target.sku || '',
      defaultSize: target.defaultSize || '۵۰ میلی‌لیتر',
      tag: target.tag || '',
      stockQuantity: String(target.stockQuantity ?? 30),
      initialSoldCount: String(target.initialSoldCount ?? 0),
      isBestSeller: Boolean(target.isBestSeller),
      isNew: Boolean(target.isNew),
    });
    setProductFormError(null);
    setIsProductFormOpen(true);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProductForm((prev) => ({
          ...prev,
          image: reader.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleToggleConcernInForm = (concernId: SkinConcernId) => {
    setProductForm((prev) => {
      const exists = prev.concerns.includes(concernId);
      if (exists && prev.concerns.length === 1) {
        return prev; // Keep at least one skin concern selected
      }
      return {
        ...prev,
        concerns: exists
          ? prev.concerns.filter((c) => c !== concernId)
          : [...prev.concerns, concernId],
      };
    });
  };

  const handleProductFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProductFormError(null);

    if (!productForm.name.trim()) {
      setProductFormError('لطفاً عنوان محصول را وارد نمایید.');
      return;
    }
    if (!productForm.image.trim()) {
      setProductFormError('لطفاً آدرس عکس محصول یا فایل تصویر را وارد نمایید.');
      return;
    }
    if (!productForm.description.trim()) {
      setProductFormError('لطفاً توضیحات (دیسکریپشن) محصول را وارد نمایید.');
      return;
    }
    const numericPrice = Number(normalizeDigits(productForm.priceUSD));
    if (isNaN(numericPrice) || numericPrice <= 0) {
      setProductFormError('لطفاً قیمت معتبر محصول به تومان وارد نمایید.');
      return;
    }
    const numericStock = Math.max(
      0,
      Math.floor(Number(normalizeDigits(productForm.stockQuantity)) || 0)
    );
    const numericSold = Math.max(
      0,
      Math.floor(Number(normalizeDigits(productForm.initialSoldCount)) || 0)
    );
    const numericCompare = productForm.compareAtPriceUSD.trim()
      ? Number(normalizeDigits(productForm.compareAtPriceUSD))
      : undefined;

    if (productFormMode === 'create') {
      const updated = await createProductAdminApi({
        name: productForm.name,
        subtitle: productForm.subtitle,
        description: productForm.description,
        image: productForm.image,
        priceUSD: numericPrice,
        compareAtPriceUSD: numericCompare,
        category: productForm.category,
        concerns: productForm.concerns,
        sku: productForm.sku,
        defaultSize: productForm.defaultSize,
        tag: productForm.tag,
        stockQuantity: numericStock,
        initialSoldCount: numericSold,
        isBestSeller: productForm.isBestSeller,
        isNew: productForm.isNew,
      });
      syncUpdatedProducts(updated);
      setIsProductFormOpen(false);
      showAdminBanner(
        `محصول جدید «${productForm.name}» با موفقیت به فروشگاه فیکس لایف اضافه شد.`
      );
    } else if (productForm.id) {
      const updated = await updateProductAdminApi(productForm.id, {
        name: productForm.name.trim(),
        subtitle: productForm.subtitle.trim(),
        description: productForm.description.trim(),
        image: productForm.image.trim(),
        priceUSD: numericPrice,
        compareAtPriceUSD: numericCompare,
        category: productForm.category,
        concerns: productForm.concerns,
        sku: productForm.sku.trim() || `FIX-${productForm.id}`,
        defaultSize: productForm.defaultSize.trim() || '۵۰ میلی‌لیتر',
        tag: productForm.tag.trim(),
        stockQuantity: numericStock,
        initialSoldCount: numericSold,
        isBestSeller: productForm.isBestSeller,
        isNew: productForm.isNew,
      });
      syncUpdatedProducts(updated);
      setIsProductFormOpen(false);
      showAdminBanner(
        `اطلاعات، تصویر، توضیحات و موجودی محصول «${productForm.name}» با موفقیت بروزرسانی شد.`
      );
    }
  };

  const handleQuickAdjustStock = async (
    productId: string,
    delta: number
  ) => {
    const target = adminProducts.find((p) => p.id === productId);
    if (!target) return;
    const nextStock = Math.max(0, (target.stockQuantity ?? 30) + delta);
    const updated = await updateProductAdminApi(productId, {
      stockQuantity: nextStock,
    });
    syncUpdatedProducts(updated);
  };

  const handleConfirmDeleteProduct = async (productId: string) => {
    const target = adminProducts.find((p) => p.id === productId);
    const updated = await deleteProductAdminApi(productId);
    syncUpdatedProducts(updated);
    setConfirmDeleteProductId(null);
    if (isProductFormOpen && productForm.id === productId) {
      setIsProductFormOpen(false);
    }
    showAdminBanner(
      `محصول «${target?.name || productId}» از لیست محصولات سایت حذف شد.`
    );
  };

  const handleCopySchemaToClipboard = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(schemaJsonString);
      } else if (schemaTextareaRef.current) {
        schemaTextareaRef.current.focus();
        schemaTextareaRef.current.select();
        document.execCommand('copy');
      }
      setCopySuccessMessage(
        'ساختار کامل دیتابیس، تایپ‌ها، فیلدها و داده‌های ماک با موفقیت در کلیپ‌بورد کپی شد!'
      );
      window.setTimeout(() => {
        setCopySuccessMessage(null);
      }, 4500);
    } catch {
      if (schemaTextareaRef.current) {
        schemaTextareaRef.current.focus();
        schemaTextareaRef.current.select();
        document.execCommand('copy');
        setCopySuccessMessage(
          'اطلاعات ساختار دیتابیس انتخاب و در کلیپ‌بورد کپی شد!'
        );
        window.setTimeout(() => {
          setCopySuccessMessage(null);
        }, 4500);
      }
    }
  };

  const handlePhoneChange = (raw: string, onChange: (val: string) => void) => {
    const clean = normalizeDigits(raw).replace(/\D/g, '').slice(0, 11);
    onChange(clean);
  };

  const handlePostalCodeChange = (
    raw: string,
    onChange: (val: string) => void
  ) => {
    const clean = normalizeDigits(raw).replace(/\D/g, '').slice(0, 10);
    onChange(clean);
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setAuthSuccess(null);

    if (authMode === 'admin') {
      const ok = loginAdminPanel(adminUsername, adminPassword);
      if (!ok) {
        setAuthError('نام کاربری یا رمز عبور پنل مدیریت ادمین اشتباه است.');
        return;
      }
      setIsAdminAuth(true);
      setEmailLogs(getAdminEmailLogs());
      setActiveTab('admin_panel');
      setAdminUsername('');
      setAdminPassword('');
      return;
    }

    if (authMode === 'forgot') {
      if (!forgotEmail.trim()) {
        setAuthError('لطفاً ایمیل حساب کاربری خود را وارد کنید.');
        return;
      }
      if (!isValidIranMobile(forgotPhone)) {
        setAuthError(
          'لطفاً شماره موبایل معتبر ۱۱ رقمی ایران (با پیش‌شماره ۰۹) وارد نمایید.'
        );
        return;
      }
      if (forgotNewPassword.length < 6) {
        setAuthError('رمز عبور جدید باید حداقل ۶ کاراکتر باشد.');
        return;
      }
      if (forgotNewPassword !== forgotConfirmPassword) {
        setAuthError('رمز عبور جدید و تکرار آن با یکدیگر مطابقت ندارند.');
        return;
      }

      setIsLoading(true);
      try {
        const res = await forgotCustomerPasswordApi({
          email: forgotEmail,
          phone: normalizeDigits(forgotPhone),
          newPassword: forgotNewPassword,
        });
        setAuthSuccess(res.message);
        setEmail(forgotEmail);
        setPassword(forgotNewPassword);
        setEmailLogs(getAdminEmailLogs());
        setTimeout(() => {
          setAuthMode('login');
        }, 1500);
      } catch (err) {
        setAuthError(
          err instanceof Error ? err.message : 'خطا در بازنشانی رمز عبور.'
        );
      } finally {
        setIsLoading(false);
      }
      return;
    }

    if (authMode === 'register' && !isValidIranMobile(phone)) {
      setAuthError(
        'لطفاً شماره موبایل معتبر ۱۱ رقمی ایران (با پیش‌شماره ۰۹) وارد نمایید.'
      );
      return;
    }

    setIsLoading(true);
    try {
      if (authMode === 'login') {
        await onLogin(email, password);
      } else {
        await onRegister({
          firstName,
          lastName,
          email,
          phone: normalizeDigits(phone),
          password,
        });
      }
      setEmailLogs(getAdminEmailLogs());
      if (activeTab === 'admin_panel' && !isAdminAuth) {
        setActiveTab('orders');
      }
    } catch (err) {
      setAuthError(
        err instanceof Error
          ? err.message
          : 'خطا در احراز هویت. لطفاً دوباره تلاش کنید.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoginError(null);
    const ok = loginAdminPanel(adminUsername, adminPassword);
    if (!ok) {
      setAdminLoginError(
        'نام کاربری یا رمز عبور ادمین اشتباه است. دسترسی به ساختار دیتابیس فقط برای ادمین مجاز است.'
      );
      return;
    }
    setIsAdminAuth(true);
    setEmailLogs(getAdminEmailLogs());
    setAdminUsername('');
    setAdminPassword('');
  };

  const handleChangePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer) return;
    setPasswordChangeError(null);
    setPasswordChangeSuccess(null);

    if (newPasswordInput.length < 6) {
      setPasswordChangeError('رمز عبور جدید باید حداقل ۶ کاراکتر باشد.');
      return;
    }
    if (newPasswordInput !== confirmNewPasswordInput) {
      setPasswordChangeError('رمز عبور جدید و تکرار آن مطابقت ندارند.');
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await changeCustomerPasswordApi({
        email: customer.email,
        currentPassword: currentPasswordInput,
        newPassword: newPasswordInput,
      });
      setPasswordChangeSuccess(res.message);
      setCurrentPasswordInput('');
      setNewPasswordInput('');
      setConfirmNewPasswordInput('');
      setEmailLogs(getAdminEmailLogs());
    } catch (err) {
      setPasswordChangeError(
        err instanceof Error ? err.message : 'خطا در تغییر رمز عبور.'
      );
    } finally {
      setIsChangingPassword(false);
    }
  };

  const renderStatusIndicator = (status: OrderStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{ORDER_STATUS_LABELS.completed}</span>
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C7048]">
            <Truck className="h-3.5 w-3.5" />
            <span>{ORDER_STATUS_LABELS.processing}</span>
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-800">
            <Clock className="h-3.5 w-3.5" />
            <span>{ORDER_STATUS_LABELS.pending}</span>
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-red-800">
            <XCircle className="h-3.5 w-3.5" />
            <span>{ORDER_STATUS_LABELS.cancelled}</span>
          </span>
        );
    }
  };

  const editingProvinceCities = addrForm
    ? IRAN_PROVINCES.find((p) => p.name === addrForm.state)?.cities ||
      IRAN_PROVINCES[0].cities
    : [];

  return (
    <div
      dir="rtl"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-4 backdrop-blur-[2px]"
      role="dialog"
      aria-modal="true"
      aria-label="حساب کاربری و پنل مدیریت فیکس لایف"
    >
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl lg:rounded-none bg-[#FDFBF7] border border-[#E8E4DC] shadow-2xl">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8E4DC] bg-[#FAF7F2] px-5 sm:px-6 py-4">
          <div className="flex items-center gap-2.5">
            <User className="h-4 w-4 text-[#1A1A1A]" strokeWidth={1.5} />
            <h2 className="font-editorial text-lg sm:text-2xl font-bold">
              {isAdminAuth && activeTab === 'admin_panel'
                ? 'پنل مدیریت کل سیستم و دیتابیس فیکس لایف (Admin)'
                : customer
                  ? 'حساب کاربری فیکس لایف'
                  : 'ورود و عضویت در فیکس لایف'}
            </h2>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => {
                if (customer || isAdminAuth) {
                  setActiveTab('admin_panel');
                } else {
                  setAuthMode('admin');
                }
              }}
              className={`inline-flex items-center gap-1.5 border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === 'admin_panel' || (!customer && authMode === 'admin')
                  ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white'
                  : 'border-[#C5A880] bg-[#EFECE6] text-[#1A1A1A] hover:bg-[#E2DBD0]'
              }`}
            >
              <Lock className="h-3.5 w-3.5 text-[#8C7048]" />
              <span>پنل مدیریت ادمین</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-[#4A4640] hover:text-[#1A1A1A] cursor-pointer"
              aria-label="بستن پنجره"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {!customer && !isAdminAuth ? (
          /* Unauthenticated View: Customer Login / Register / Forgot Password / Admin Login */
          <div className="mx-auto w-full max-w-md p-6 sm:p-8 text-right overflow-y-auto">
            <div className="mb-6 flex border-b border-[#E8E4DC]">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('login');
                  setAuthError(null);
                  setAuthSuccess(null);
                }}
                className={`flex-1 pb-3 text-xs font-semibold cursor-pointer ${
                  authMode === 'login'
                    ? 'border-b-2 border-[#1A1A1A] font-bold text-[#1A1A1A]'
                    : 'text-[#787269]'
                }`}
              >
                ورود مشتری
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('register');
                  setAuthError(null);
                  setAuthSuccess(null);
                }}
                className={`flex-1 pb-3 text-xs font-semibold cursor-pointer ${
                  authMode === 'register'
                    ? 'border-b-2 border-[#1A1A1A] font-bold text-[#1A1A1A]'
                    : 'text-[#787269]'
                }`}
              >
                ثبت‌نام جدید
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('forgot');
                  setAuthError(null);
                  setAuthSuccess(null);
                }}
                className={`flex-1 pb-3 text-xs font-semibold cursor-pointer ${
                  authMode === 'forgot'
                    ? 'border-b-2 border-[#1A1A1A] font-bold text-[#1A1A1A]'
                    : 'text-[#787269]'
                }`}
              >
                فراموشی رمز
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('admin');
                  setAuthError(null);
                  setAuthSuccess(null);
                }}
                className={`flex-1 pb-3 text-xs font-semibold cursor-pointer ${
                  authMode === 'admin'
                    ? 'border-b-2 border-[#8C7048] font-bold text-[#8C7048]'
                    : 'text-[#787269]'
                }`}
              >
                ورود ادمین
              </button>
            </div>

            {authError && (
              <div className="mb-4 flex items-center gap-2 border border-red-800/30 bg-red-50 px-3 py-2.5 text-xs text-red-900">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span className="text-justify">{authError}</span>
              </div>
            )}

            {authSuccess && (
              <div className="mb-4 flex items-center gap-2 border border-emerald-800/30 bg-emerald-50 px-3 py-2.5 text-xs text-emerald-900">
                <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700" />
                <span className="text-justify">{authSuccess}</span>
              </div>
            )}

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {authMode === 'admin' ? (
                <>
                  <div className="border border-[#C5A880]/60 bg-[#FAF7F2] p-3.5 text-xs text-[#4A4640] leading-6">
                    <p className="font-bold text-[#1A1A1A] mb-1">
                      ورود اختصاصی مدیر کل سایت (دسترسی به ساختار دیتابیس)
                    </p>
                    <p className="text-[11px]">
                      دسترسی به اطلاعات ساختار دیتابیس (Schema Export)، لاگ ایمیل‌های ارسالی و تنظیمات سرور فقط با نام کاربری و رمز عبور مدیریت امکان‌پذیر است.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A4640] mb-1">
                      نام کاربری ادمین (Username)
                    </label>
                    <input
                      type="text"
                      dir="ltr"
                      value={adminUsername}
                      onChange={(e) => setAdminUsername(e.target.value)}
                      placeholder="username"
                      required
                      className="w-full border border-[#DCD5C9] bg-white px-3 py-2.5 text-xs text-left font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A4640] mb-1">
                      رمز عبور ادمین (Password)
                    </label>
                    <input
                      type="password"
                      dir="ltr"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full border border-[#DCD5C9] bg-white px-3 py-2.5 text-xs text-left font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-[#1A1A1A] py-3.5 text-xs font-semibold text-white hover:bg-[#333333] transition-colors cursor-pointer"
                  >
                    ورود به پنل مدیریت و دیتابیس
                  </button>
                </>
              ) : authMode === 'forgot' ? (
                <>
                  <div className="border border-[#E8E4DC] bg-[#FAF7F2] p-3 text-xs text-[#4A4640] leading-6">
                    برای بازیابی و تغییر رمز عبور، ایمیل و شماره موبایل ثبت‌شده خود را به همراه رمز عبور جدید وارد نمایید.
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A4640] mb-1">
                      ایمیل ثبت‌شده در سایت *
                    </label>
                    <input
                      type="email"
                      dir="ltr"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="user@example.com"
                      required
                      className="w-full border border-[#DCD5C9] bg-white px-3 py-2 text-xs text-left font-mono"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-[#4A4640]">
                        شماره موبایل تایید هویت (۱۱ رقمی) *
                      </label>
                      <span className="text-[10px] text-[#787269] tabular-nums">
                        {toPersianDigits(forgotPhone.length)}/۱۱ رقم
                      </span>
                    </div>
                    <input
                      type="tel"
                      inputMode="tel"
                      dir="ltr"
                      maxLength={11}
                      value={forgotPhone}
                      onChange={(e) =>
                        handlePhoneChange(e.target.value, setForgotPhone)
                      }
                      placeholder="09123456789"
                      required
                      className="w-full border border-[#DCD5C9] bg-white px-3 py-2 text-xs text-left font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A4640] mb-1">
                      رمز عبور جدید (حداقل ۶ کاراکتر) *
                    </label>
                    <input
                      type="password"
                      dir="ltr"
                      value={forgotNewPassword}
                      onChange={(e) => setForgotNewPassword(e.target.value)}
                      required
                      className="w-full border border-[#DCD5C9] bg-white px-3 py-2 text-xs text-left"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#4A4640] mb-1">
                      تکرار رمز عبور جدید *
                    </label>
                    <input
                      type="password"
                      dir="ltr"
                      value={forgotConfirmPassword}
                      onChange={(e) => setForgotConfirmPassword(e.target.value)}
                      required
                      className="w-full border border-[#DCD5C9] bg-white px-3 py-2 text-xs text-left"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#1A1A1A] py-3.5 text-xs font-semibold text-white hover:bg-[#333333] transition-colors cursor-pointer"
                  >
                    {isLoading
                      ? 'در حال بازنشانی رمز عبور...'
                      : 'ثبت رمز عبور جدید'}
                  </button>
                </>
              ) : (
                <>
                  {authMode === 'register' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-[#4A4640] mb-1">
                          نام
                        </label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                          className="w-full border border-[#DCD5C9] bg-white px-3 py-2 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-[#4A4640] mb-1">
                          نام خانوادگی
                        </label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                          className="w-full border border-[#DCD5C9] bg-white px-3 py-2 text-xs"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-[#4A4640] mb-1">
                      پست الکترونیک (ایمیل)
                    </label>
                    <input
                      type="email"
                      dir="ltr"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full border border-[#DCD5C9] bg-white px-3 py-2 text-xs text-left font-mono"
                    />
                  </div>

                  {authMode === 'register' && (
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-[#4A4640]">
                          شماره موبایل (۱۱ رقمی ایران) *
                        </label>
                        <span className="text-[10px] text-[#787269] tabular-nums">
                          {toPersianDigits(phone.length)}/۱۱ رقم
                        </span>
                      </div>
                      <input
                        type="tel"
                        inputMode="tel"
                        dir="ltr"
                        maxLength={11}
                        value={phone}
                        onChange={(e) =>
                          handlePhoneChange(e.target.value, setPhone)
                        }
                        placeholder="09123456789"
                        required
                        className="w-full border border-[#DCD5C9] bg-white px-3 py-2 text-xs text-left font-mono"
                      />
                    </div>
                  )}

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-semibold text-[#4A4640]">
                        رمز عبور
                      </label>
                      {authMode === 'login' && (
                        <button
                          type="button"
                          onClick={() => {
                            setForgotEmail(email);
                            setAuthMode('forgot');
                            setAuthError(null);
                          }}
                          className="text-[11px] font-semibold text-[#8C7048] hover:text-[#1A1A1A] underline cursor-pointer"
                        >
                          رمز عبور خود را فراموش کرده‌اید؟
                        </button>
                      )}
                    </div>
                    <input
                      type="password"
                      dir="ltr"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full border border-[#DCD5C9] bg-white px-3 py-2 text-xs text-left"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#1A1A1A] py-3.5 text-xs font-semibold text-white hover:bg-[#333333] transition-colors cursor-pointer"
                  >
                    {isLoading
                      ? 'در حال بررسی اطلاعات...'
                      : authMode === 'login'
                        ? 'ورود به حساب کاربری'
                        : 'ایجاد حساب کاربری در فیکس لایف'}
                  </button>
                </>
              )}
            </form>
          </div>
        ) : (
          /* Authenticated Customer Dashboard OR Authenticated Admin Panel */
          <div className="grid flex-1 grid-cols-1 overflow-y-auto md:grid-cols-12">
            {/* Sidebar Navigation */}
            <div className="border-b border-[#E8E4DC] bg-[#FAF7F2] p-5 sm:p-6 md:col-span-3 md:border-b-0 md:border-l text-right">
              {customer ? (
                <div className="mb-6 pb-4 border-b border-[#E8E4DC]">
                  <p className="font-editorial text-xl font-bold text-[#1A1A1A]">
                    {customer.firstName} {customer.lastName}
                  </p>
                  <p className="text-[11px] text-[#787269] truncate font-mono">
                    {customer.email}
                  </p>
                  <p className="mt-1 text-[11px] font-semibold text-[#8C7048]">
                    موبایل: {toPersianDigits(customer.phone)}
                  </p>
                </div>
              ) : (
                <div className="mb-6 pb-4 border-b border-[#E8E4DC]">
                  <p className="font-editorial text-lg font-bold text-[#1A1A1A]">
                    مدیر کل سیستم (parham)
                  </p>
                  <p className="text-[11px] font-mono text-[#8C7048]">
                    {ADMIN_NOTIFICATION_EMAIL}
                  </p>
                </div>
              )}

              <nav className="space-y-1.5 text-xs">
                {customer && (
                  <>
                    <button
                      type="button"
                      onClick={() => setActiveTab('orders')}
                      className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-right transition-colors cursor-pointer ${
                        activeTab === 'orders'
                          ? 'bg-[#1A1A1A] text-white font-semibold'
                          : 'text-[#4A4640] hover:bg-[#EFECE6]'
                      }`}
                    >
                      <Package className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                      <span>
                        تاریخچه سفارش‌ها ({toPersianDigits(orders.length)})
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('addresses')}
                      className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-right transition-colors cursor-pointer ${
                        activeTab === 'addresses'
                          ? 'bg-[#1A1A1A] text-white font-semibold'
                          : 'text-[#4A4640] hover:bg-[#EFECE6]'
                      }`}
                    >
                      <MapPin className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                      <span>آدرس‌های منتخب (ایران)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('security')}
                      className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-right transition-colors cursor-pointer ${
                        activeTab === 'security'
                          ? 'bg-[#1A1A1A] text-white font-semibold'
                          : 'text-[#4A4640] hover:bg-[#EFECE6]'
                      }`}
                    >
                      <KeyRound className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                      <span>تغییر رمز عبور</span>
                    </button>
                  </>
                )}

                {/* Admin Panel Access Tab (Requires parham / parham1382 inside) */}
                <button
                  type="button"
                  onClick={() => setActiveTab('admin_panel')}
                  className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-right transition-colors cursor-pointer border ${
                    activeTab === 'admin_panel'
                      ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white font-semibold'
                      : 'border-[#C5A880]/60 bg-[#EFECE6]/70 text-[#1A1A1A] hover:bg-[#EFECE6]'
                  }`}
                >
                  <ShieldCheck
                    className="h-4 w-4 shrink-0 text-[#8C7048]"
                    strokeWidth={1.5}
                  />
                  <span>پنل مدیریت ادمین (دیتابیس)</span>
                </button>

                {customer && (
                  <button
                    type="button"
                    onClick={onLogout}
                    className="mt-4 flex w-full items-center gap-2.5 px-3 py-2.5 text-right text-red-900 hover:bg-red-50 transition-colors cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                    <span>خروج از حساب کاربری</span>
                  </button>
                )}

                {isAdminAuth && (
                  <button
                    type="button"
                    onClick={() => {
                      logoutAdminPanel();
                      setIsAdminAuth(false);
                      if (customer) {
                        setActiveTab('orders');
                      }
                    }}
                    className="mt-2 flex w-full items-center gap-2.5 px-3 py-2 text-right text-xs text-[#8C7048] hover:bg-[#EFECE6] transition-colors cursor-pointer"
                  >
                    <Lock className="h-3.5 w-3.5 shrink-0" />
                    <span>قفل کردن پنل ادمین (خروج ادمین)</span>
                  </button>
                )}
              </nav>
            </div>

            {/* Main Panel */}
            <div className="p-5 sm:p-8 md:col-span-9 text-right">
              {/* TAB: ADMIN PANEL (Strictly protected by username=parham & password=parham1382) */}
              {(activeTab === 'admin_panel' ||
                activeTab === 'schema_export') && (
                <div>
                  {!isAdminAuth ? (
                    <div className="mx-auto max-w-md border border-[#E8E4DC] bg-white p-6 sm:p-8 space-y-4">
                      <div className="flex items-center gap-2.5 border-b border-[#E8E4DC] pb-3">
                        <Lock className="h-5 w-5 text-[#8C7048]" />
                        <div>
                          <h3 className="font-editorial text-lg sm:text-xl font-bold text-[#1A1A1A]">
                            احراز هویت پنل مدیریت (Admin Only)
                          </h3>
                          <p className="text-[11px] text-[#787269]">
                            دسترسی به اطلاعات ساختار دیتابیس فقط مختص ادمین است
                          </p>
                        </div>
                      </div>

                      {adminLoginError && (
                        <div className="flex items-center gap-2 border border-red-800/30 bg-red-50 px-3 py-2.5 text-xs text-red-900">
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          <span>{adminLoginError}</span>
                        </div>
                      )}

                      <form
                        onSubmit={handleAdminFormSubmit}
                        className="space-y-4"
                      >
                        <div>
                          <label className="block text-xs font-semibold text-[#4A4640] mb-1">
                            نام کاربری ادمین (Username)
                          </label>
                          <input
                            type="text"
                            dir="ltr"
                            value={adminUsername}
                            onChange={(e) => setAdminUsername(e.target.value)}
                            required
                            className="w-full border border-[#DCD5C9] bg-[#FAF7F2] px-3 py-2.5 text-xs text-left font-mono"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-[#4A4640] mb-1">
                            رمز عبور ادمین (Password)
                          </label>
                          <input
                            type="password"
                            dir="ltr"
                            value={adminPassword}
                            onChange={(e) => setAdminPassword(e.target.value)}
                            required
                            className="w-full border border-[#DCD5C9] bg-[#FAF7F2] px-3 py-2.5 text-xs text-left font-mono"
                          />
                        </div>

                        <button
                          type="submit"
                          className="w-full bg-[#1A1A1A] py-3 text-xs font-semibold text-white hover:bg-[#333333] transition-colors cursor-pointer"
                        >
                          ورود به پنل ادمین و مشاهده دیتابیس
                        </button>
                      </form>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Admin Header Info Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 border border-[#C5A880] bg-[#FAF7F2] p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-emerald-700" />
                            <span className="text-xs font-bold text-[#1A1A1A]">
                              ادمین فعال: parham
                            </span>
                            <span className="bg-emerald-900/10 text-emerald-900 px-2 py-0.5 text-[10px] font-semibold">
                              دسترسی کامل دیتابیس
                            </span>
                          </div>
                          <p className="text-[11px] text-[#4A4640]">
                            ایمیل رسمی سایت:{' '}
                            <strong className="font-mono text-[#1A1A1A]">
                              {SITE_OFFICIAL_EMAIL}
                            </strong>{' '}
                            | ایمیل دریافت اعلان‌های ادمین:{' '}
                            <strong className="font-mono text-[#8C7048]">
                              {ADMIN_NOTIFICATION_EMAIL}
                            </strong>
                          </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {(
                            [
                              {
                                id: 'products',
                                label: `مدیریت محصولات، انبار و فروش (${toPersianDigits(adminProducts.length)})`,
                                icon: Boxes,
                              },
                              {
                                id: 'schema',
                                label: 'استخراج ساختار دیتابیس',
                                icon: Database,
                              },
                              {
                                id: 'emails',
                                label: `ایمیل‌های ارسالی به ادمین (${toPersianDigits(emailLogs.length)})`,
                                icon: Mail,
                              },
                              {
                                id: 'whatsapp',
                                label: 'تنظیمات واتساپ پشتیبانی',
                                icon: MessageCircle,
                              },
                              {
                                id: 'contracts',
                                label: 'مستندات API بک‌اند',
                                icon: Code2,
                              },
                            ] as const
                          ).map((st) => {
                            const Icon = st.icon;
                            return (
                              <button
                                key={st.id}
                                type="button"
                                onClick={() => setAdminSubTab(st.id)}
                                className={`inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border cursor-pointer transition-colors ${
                                  adminSubTab === st.id
                                    ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white'
                                    : 'border-[#DCD5C9] bg-white text-[#1A1A1A] hover:bg-[#EFECE6]'
                                }`}
                              >
                                <Icon className="h-3.5 w-3.5" />
                                <span>{st.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {adminActionBanner && (
                        <div
                          role="status"
                          aria-live="polite"
                          className="flex items-center justify-between gap-3 border border-emerald-700/40 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-950"
                        >
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
                            <span>{adminActionBanner}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setAdminActionBanner(null)}
                            className="text-emerald-800 hover:text-emerald-950 cursor-pointer"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}

                      {/* ADMIN SUB-TAB 0: PRODUCT CRUD, WAREHOUSE STOCK & PER-PRODUCT SALES ANALYTICS */}
                      {adminSubTab === 'products' && (
                        <div className="space-y-6">
                          {/* Top Summary KPI Cards */}
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                            <div className="border border-[#E8E4DC] bg-white p-4 space-y-1">
                              <div className="flex items-center justify-between text-[#787269]">
                                <span className="text-[11px] font-semibold">
                                  کل محصولات فعال سایت
                                </span>
                                <Package className="h-4 w-4 text-[#8C7048]" />
                              </div>
                              <p className="font-editorial text-2xl font-bold text-[#1A1A1A] tabular-nums">
                                {toPersianDigits(
                                  overallStoreSummary.totalProducts
                                )}{' '}
                                <span className="font-sans text-xs font-normal text-[#787269]">
                                  عنوان محصول
                                </span>
                              </p>
                            </div>

                            <div className="border border-[#E8E4DC] bg-white p-4 space-y-1">
                              <div className="flex items-center justify-between text-[#787269]">
                                <span className="text-[11px] font-semibold">
                                  مجموع تعداد فروش رفته (کل محصولات)
                                </span>
                                <TrendingUp className="h-4 w-4 text-emerald-700" />
                              </div>
                              <p className="font-editorial text-2xl font-bold text-emerald-800 tabular-nums">
                                {toPersianDigits(
                                  overallStoreSummary.totalUnitsSold
                                )}{' '}
                                <span className="font-sans text-xs font-normal text-[#787269]">
                                  عدد فروخته‌شده
                                </span>
                              </p>
                            </div>

                            <div className="border border-[#E8E4DC] bg-white p-4 space-y-1">
                              <div className="flex items-center justify-between text-[#787269]">
                                <span className="text-[11px] font-semibold">
                                  مجموع کل میزان فروش فروشگاه
                                </span>
                                <BarChart3 className="h-4 w-4 text-[#8C7048]" />
                              </div>
                              <p className="text-base sm:text-lg font-bold text-[#1A1A1A] tabular-nums">
                                {formatPrice(
                                  overallStoreSummary.totalSalesRevenueToman
                                )}
                              </p>
                            </div>

                            <div className="border border-[#E8E4DC] bg-white p-4 space-y-1">
                              <div className="flex items-center justify-between text-[#787269]">
                                <span className="text-[11px] font-semibold">
                                  موجودی کل انبار فیکس لایف
                                </span>
                                <Boxes className="h-4 w-4 text-[#1A1A1A]" />
                              </div>
                              <p className="font-editorial text-2xl font-bold text-[#1A1A1A] tabular-nums">
                                {toPersianDigits(
                                  overallStoreSummary.totalStockInWarehouse
                                )}{' '}
                                <span className="font-sans text-xs font-normal text-[#787269]">
                                  عدد در انبار
                                </span>
                              </p>
                              {overallStoreSummary.lowStockCount > 0 && (
                                <p className="text-[10.5px] font-semibold text-amber-800">
                                  {toPersianDigits(
                                    overallStoreSummary.lowStockCount
                                  )}{' '}
                                  محصول کم‌موجودی (زیر ۱۰ عدد)
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Header & Action Toolbar */}
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E4DC] pb-4">
                            <div>
                              <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                                مدیریت محصولات، موجودی انبار و آمار فروش به تفکیک هر محصول
                              </h3>
                              <p className="mt-1 text-xs text-[#5A554E] leading-6">
                                در این بخش می‌توانید عکس، عنوان، دیسکریپشن، قیمت و موجودی انبار هر محصول را ویرایش کنید، محصول جدید اضافه یا حذف نمایید و ببینید از هر محصول دقیقاً چند عدد و به چه مبلغی فروخته‌اید.
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={handleOpenCreateProduct}
                                className="inline-flex items-center gap-1.5 bg-[#1A1A1A] hover:bg-[#333333] text-white px-4 py-2.5 text-xs font-bold transition-colors cursor-pointer shadow-xs"
                              >
                                <Plus className="h-4 w-4 text-[#C5A880]" />
                                <span>افزودن محصول جدید</span>
                              </button>

                              <button
                                type="button"
                                onClick={async () => {
                                  const reset =
                                    await resetProductsToDefaultAdminApi();
                                  syncUpdatedProducts(reset);
                                  showAdminBanner(
                                    'لیست محصولات و موجودی پایه به حالت پیش‌فرض کاتالوگ بازگردانی شد.'
                                  );
                                }}
                                className="inline-flex items-center gap-1.5 border border-[#DCD5C9] bg-white hover:bg-[#EFECE6] text-[#4A4640] px-3 py-2.5 text-[11px] font-semibold transition-colors cursor-pointer"
                                title="بازگردانی کاتالوگ به محصولات اولیه"
                              >
                                <RotateCcw className="h-3.5 w-3.5" />
                                <span>بازنشانی کاتالوگ پیش‌فرض</span>
                              </button>
                            </div>
                          </div>

                          {/* Add / Edit Product Modal Form (Inline Panel) */}
                          {isProductFormOpen && (
                            <form
                              onSubmit={handleProductFormSubmit}
                              className="border-2 border-[#1A1A1A] bg-[#FAF7F2] p-5 sm:p-6 space-y-5 shadow-lg"
                            >
                              <div className="flex items-center justify-between border-b border-[#DCD5C9] pb-3">
                                <div className="flex items-center gap-2">
                                  {productFormMode === 'create' ? (
                                    <Plus className="h-4 w-4 text-[#8C7048]" />
                                  ) : (
                                    <Pencil className="h-4 w-4 text-[#8C7048]" />
                                  )}
                                  <h4 className="font-editorial text-lg sm:text-xl font-bold text-[#1A1A1A]">
                                    {productFormMode === 'create'
                                      ? 'افزودن محصول جدید به فروشگاه فیکس لایف'
                                      : `ویرایش محصول: ${productForm.name} (کد #${productForm.id})`}
                                  </h4>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => setIsProductFormOpen(false)}
                                  className="p-1 text-[#4A4640] hover:text-[#1A1A1A] cursor-pointer"
                                >
                                  <X className="h-5 w-5" />
                                </button>
                              </div>

                              {productFormError && (
                                <div className="flex items-center gap-2 border border-red-800/30 bg-red-50 px-3 py-2.5 text-xs text-red-900">
                                  <AlertCircle className="h-4 w-4 shrink-0" />
                                  <span>{productFormError}</span>
                                </div>
                              )}

                              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                                {/* Image Preview + Image URL & Upload */}
                                <div className="lg:col-span-4 space-y-3">
                                  <label className="block text-xs font-bold text-[#1A1A1A]">
                                    تصویر محصول (لینک مستقیم یا آپلود عکس) *
                                  </label>
                                  <div className="relative aspect-square w-full max-w-[220px] mx-auto border border-[#DCD5C9] bg-white flex items-center justify-center p-3 overflow-hidden">
                                    {productForm.image ? (
                                      <img
                                        src={productForm.image}
                                        alt={productForm.name || 'پیش‌نمایش محصول'}
                                        referrerPolicy="no-referrer"
                                        className="h-full w-full object-contain"
                                      />
                                    ) : (
                                      <div className="flex flex-col items-center gap-1 text-[#787269] text-xs">
                                        <ImageIcon className="h-8 w-8" />
                                        <span>بدون تصویر</span>
                                      </div>
                                    )}
                                  </div>

                                  <div className="space-y-2">
                                    <label className="block text-[11px] font-semibold text-[#4A4640]">
                                      آدرس اینترنتی عکس (URL):
                                    </label>
                                    <input
                                      type="text"
                                      dir="ltr"
                                      value={productForm.image}
                                      onChange={(e) =>
                                        setProductForm({
                                          ...productForm,
                                          image: e.target.value,
                                        })
                                      }
                                      placeholder="https://fixlife.ir/uploads/product.jpg"
                                      className="w-full border border-[#DCD5C9] bg-white px-3 py-2 text-xs text-left font-mono"
                                    />
                                  </div>

                                  <div>
                                    <input
                                      ref={fileInputRef}
                                      type="file"
                                      accept="image/*"
                                      onChange={handleImageFileUpload}
                                      className="hidden"
                                    />
                                    <button
                                      type="button"
                                      onClick={() =>
                                        fileInputRef.current?.click()
                                      }
                                      className="w-full inline-flex items-center justify-center gap-1.5 border border-[#1A1A1A] bg-white hover:bg-[#EFECE6] px-3 py-2 text-xs font-semibold text-[#1A1A1A] transition-colors cursor-pointer"
                                    >
                                      <Upload className="h-3.5 w-3.5 text-[#8C7048]" />
                                      <span>آپلود تصویر از سیستم یا موبایل</span>
                                    </button>
                                  </div>
                                </div>

                                {/* Product Fields: Title, Subtitle, Price, Stock, Sold Count, Description */}
                                <div className="lg:col-span-8 space-y-4">
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                                        عنوان محصول (Title) *
                                      </label>
                                      <input
                                        type="text"
                                        value={productForm.name}
                                        onChange={(e) =>
                                          setProductForm({
                                            ...productForm,
                                            name: e.target.value,
                                          })
                                        }
                                        placeholder="مثال: سرم تخصصی نیاسینامید ۱۰٪ جیورا"
                                        required
                                        className="w-full border border-[#DCD5C9] bg-white px-3 py-2 text-xs"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                                        زیرعنوان کوتاه (Subtitle)
                                      </label>
                                      <input
                                        type="text"
                                        value={productForm.subtitle}
                                        onChange={(e) =>
                                          setProductForm({
                                            ...productForm,
                                            subtitle: e.target.value,
                                          })
                                        }
                                        placeholder="کنترل چربی، کوچک‌کننده منافذ و ضد جوش"
                                        className="w-full border border-[#DCD5C9] bg-white px-3 py-2 text-xs"
                                      />
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <div>
                                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                                        قیمت فروش (تومان) *
                                      </label>
                                      <input
                                        type="text"
                                        inputMode="numeric"
                                        dir="ltr"
                                        value={productForm.priceUSD}
                                        onChange={(e) =>
                                          setProductForm({
                                            ...productForm,
                                            priceUSD: normalizeDigits(
                                              e.target.value
                                            ).replace(/\D/g, ''),
                                          })
                                        }
                                        placeholder="999000"
                                        required
                                        className="w-full border border-[#DCD5C9] bg-white px-3 py-2 text-xs text-left font-mono font-bold"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                                        موجودی انبار (تعداد) *
                                      </label>
                                      <input
                                        type="text"
                                        inputMode="numeric"
                                        dir="ltr"
                                        value={productForm.stockQuantity}
                                        onChange={(e) =>
                                          setProductForm({
                                            ...productForm,
                                            stockQuantity: normalizeDigits(
                                              e.target.value
                                            ).replace(/\D/g, ''),
                                          })
                                        }
                                        placeholder="40"
                                        required
                                        className="w-full border border-[#DCD5C9] bg-white px-3 py-2 text-xs text-left font-mono font-bold text-emerald-900"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                                        تعداد فروش پایه
                                      </label>
                                      <input
                                        type="text"
                                        inputMode="numeric"
                                        dir="ltr"
                                        value={productForm.initialSoldCount}
                                        onChange={(e) =>
                                          setProductForm({
                                            ...productForm,
                                            initialSoldCount: normalizeDigits(
                                              e.target.value
                                            ).replace(/\D/g, ''),
                                          })
                                        }
                                        placeholder="25"
                                        className="w-full border border-[#DCD5C9] bg-white px-3 py-2 text-xs text-left font-mono"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                                        دسته‌بندی محصول
                                      </label>
                                      <select
                                        value={productForm.category}
                                        onChange={(e) =>
                                          setProductForm({
                                            ...productForm,
                                            category: e.target.value as Exclude<
                                              ProductCategory,
                                              'all'
                                            >,
                                          })
                                        }
                                        className="w-full border border-[#DCD5C9] bg-white px-2.5 py-2 text-xs"
                                      >
                                        <option value="serums">
                                          سرم‌های تخصصی
                                        </option>
                                        <option value="moisturizers">
                                          کرم‌ها و مرطوب‌کننده‌ها
                                        </option>
                                        <option value="cleansers">
                                          شوینده‌ها و پاک‌کننده‌ها
                                        </option>
                                        <option value="sunscreen">
                                          ضدآفتاب تخصصی
                                        </option>
                                        <option value="sets">
                                          پکیج روتین کامل
                                        </option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                      <label className="block text-[11px] font-semibold text-[#4A4640] mb-1">
                                        کد کالا (SKU)
                                      </label>
                                      <input
                                        type="text"
                                        dir="ltr"
                                        value={productForm.sku}
                                        onChange={(e) =>
                                          setProductForm({
                                            ...productForm,
                                            sku: e.target.value,
                                          })
                                        }
                                        placeholder="GIORA-SERUM-30ML"
                                        className="w-full border border-[#DCD5C9] bg-white px-3 py-2 text-xs text-left font-mono"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-[11px] font-semibold text-[#4A4640] mb-1">
                                        حجم محصول
                                      </label>
                                      <input
                                        type="text"
                                        value={productForm.defaultSize}
                                        onChange={(e) =>
                                          setProductForm({
                                            ...productForm,
                                            defaultSize: e.target.value,
                                          })
                                        }
                                        placeholder="۳۰ میلی‌لیتر"
                                        className="w-full border border-[#DCD5C9] bg-white px-3 py-2 text-xs"
                                      />
                                    </div>

                                    <div>
                                      <label className="block text-[11px] font-semibold text-[#4A4640] mb-1">
                                        برچسب بالای کارت (Tag)
                                      </label>
                                      <input
                                        type="text"
                                        value={productForm.tag}
                                        onChange={(e) =>
                                          setProductForm({
                                            ...productForm,
                                            tag: e.target.value,
                                          })
                                        }
                                        placeholder="پرفروش‌ترین سرم ضد چروک"
                                        className="w-full border border-[#DCD5C9] bg-white px-3 py-2 text-xs"
                                      />
                                    </div>
                                  </div>

                                  {/* Skin Concerns Multi-Select */}
                                  <div>
                                    <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5">
                                      مناسب برای کدام نیازهای پوستی است؟ (نمایش در فیلتر نیاز پوست)
                                    </label>
                                    <div className="flex flex-wrap gap-2">
                                      {SKIN_CONCERNS.map((sc) => {
                                        const checked =
                                          productForm.concerns.includes(sc.id);
                                        return (
                                          <button
                                            key={sc.id}
                                            type="button"
                                            onClick={() =>
                                              handleToggleConcernInForm(sc.id)
                                            }
                                            className={`px-3 py-1.5 text-xs font-semibold border transition-colors cursor-pointer ${
                                              checked
                                                ? 'border-[#1A1A1A] bg-[#1A1A1A] text-[#C5A880]'
                                                : 'border-[#DCD5C9] bg-white text-[#4A4640] hover:bg-[#EFECE6]'
                                            }`}
                                          >
                                            {checked ? '✓ ' : ''}
                                            {sc.title}
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>

                                  {/* Full Description */}
                                  <div>
                                    <label className="block text-xs font-bold text-[#1A1A1A] mb-1">
                                      توضیحات کامل محصول (Description) *
                                    </label>
                                    <textarea
                                      rows={4}
                                      value={productForm.description}
                                      onChange={(e) =>
                                        setProductForm({
                                          ...productForm,
                                          description: e.target.value,
                                        })
                                      }
                                      placeholder="توضیحات علمی، مزایا، ترکیبات موثره و عملکرد محصول روی پوست را وارد کنید..."
                                      required
                                      className="w-full border border-[#DCD5C9] bg-white p-3 text-xs leading-6"
                                    />
                                  </div>

                                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                                    <div className="flex items-center gap-4 text-xs">
                                      <label className="inline-flex items-center gap-1.5 cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={productForm.isBestSeller}
                                          onChange={(e) =>
                                            setProductForm({
                                              ...productForm,
                                              isBestSeller: e.target.checked,
                                            })
                                          }
                                        />
                                        <span>نمایش در پرفروش‌ترین‌ها</span>
                                      </label>
                                      <label className="inline-flex items-center gap-1.5 cursor-pointer">
                                        <input
                                          type="checkbox"
                                          checked={productForm.isNew}
                                          onChange={(e) =>
                                            setProductForm({
                                              ...productForm,
                                              isNew: e.target.checked,
                                            })
                                          }
                                        />
                                        <span>نشان «جدید» روی محصول</span>
                                      </label>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <button
                                        type="submit"
                                        className="bg-[#1A1A1A] hover:bg-[#333333] text-white px-6 py-2.5 text-xs font-bold transition-colors cursor-pointer"
                                      >
                                        {productFormMode === 'create'
                                          ? 'ثبت و افزودن محصول به سایت'
                                          : 'ذخیره تغییرات محصول'}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() =>
                                          setIsProductFormOpen(false)
                                        }
                                        className="border border-[#DCD5C9] bg-white px-4 py-2.5 text-xs font-semibold text-[#4A4640] hover:text-[#1A1A1A] cursor-pointer"
                                      >
                                        انصراف
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </form>
                          )}

                          {/* Search & Filter Bar for Admin Products */}
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white border border-[#E8E4DC] p-3.5">
                            <div className="relative flex-1">
                              <Search className="h-4 w-4 text-[#787269] absolute right-3 top-1/2 -translate-y-1/2" />
                              <input
                                type="text"
                                value={adminProductSearch}
                                onChange={(e) =>
                                  setAdminProductSearch(e.target.value)
                                }
                                placeholder="جستجوی محصول بر اساس نام، کد کالا (SKU) یا شناسه..."
                                className="w-full border border-[#DCD5C9] bg-[#FAF7F2] pr-9 pl-3 py-2 text-xs focus:outline-none focus:border-[#1A1A1A]"
                              />
                            </div>

                            <div className="flex flex-wrap items-center gap-1.5">
                              {(
                                [
                                  { id: 'all', label: 'همه دسته‌ها' },
                                  { id: 'serums', label: 'سرم‌ها' },
                                  { id: 'moisturizers', label: 'کرم‌ها و لوسیون‌ها' },
                                  { id: 'cleansers', label: 'شوینده‌ها' },
                                  { id: 'sunscreen', label: 'ضدآفتاب' },
                                  { id: 'sets', label: 'پکیج‌ها' },
                                ] as const
                              ).map((cat) => (
                                <button
                                  key={cat.id}
                                  type="button"
                                  onClick={() => setAdminCategoryFilter(cat.id)}
                                  className={`px-3 py-1.5 text-[11px] font-semibold border cursor-pointer transition-colors ${
                                    adminCategoryFilter === cat.id
                                      ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white'
                                      : 'border-[#E8E4DC] bg-[#FAF7F2] text-[#4A4640] hover:bg-[#EFECE6]'
                                  }`}
                                >
                                  {cat.label}
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Per-Product Sales, Stock & Management List */}
                          <div className="space-y-3">
                            {filteredProductSalesStats.map((stat) => {
                              const fullProd = adminProducts.find(
                                (p) => p.id === stat.productId
                              );
                              const revenueSharePercent =
                                overallStoreSummary.totalSalesRevenueToman > 0
                                  ? Math.round(
                                      (stat.totalRevenueToman /
                                        overallStoreSummary.totalSalesRevenueToman) *
                                        100
                                    )
                                  : 0;
                              const isConfirmingDelete =
                                confirmDeleteProductId === stat.productId;

                              return (
                                <div
                                  key={stat.productId}
                                  className="border border-[#E8E4DC] hover:border-[#C5A880] bg-white p-4 sm:p-5 transition-colors space-y-4"
                                >
                                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                                    {/* Product Image & Title / Description Preview */}
                                    <div className="lg:col-span-5 flex items-start gap-3.5">
                                      <div className="h-20 w-20 shrink-0 border border-[#E8E4DC] bg-[#F6F3EE] p-1.5 flex items-center justify-center overflow-hidden">
                                        <img
                                          src={stat.image}
                                          alt={stat.name}
                                          referrerPolicy="no-referrer"
                                          className="h-full w-full object-contain"
                                        />
                                      </div>
                                      <div className="min-w-0 flex-1 space-y-1">
                                        <div className="flex flex-wrap items-center gap-1.5">
                                          <span className="bg-[#FAF7F2] border border-[#E8E4DC] px-2 py-0.5 font-mono text-[10px] font-bold text-[#787269]">
                                            #{stat.productId}
                                          </span>
                                          <span className="font-mono text-[10px] text-[#8C7048]">
                                            {stat.sku}
                                          </span>
                                          <span className="bg-[#EFECE6] px-2 py-0.5 text-[10px] font-semibold text-[#4A4640]">
                                            {
                                              PRODUCT_CATEGORY_LABELS_FA[
                                                stat.category
                                              ]
                                            }
                                          </span>
                                        </div>
                                        <h4 className="text-xs sm:text-sm font-bold text-[#1A1A1A] leading-snug">
                                          {stat.name}
                                        </h4>
                                        <p className="text-[11px] text-[#5A554E] line-clamp-2 leading-5 text-justify">
                                          {fullProd?.description ||
                                            stat.subtitle}
                                        </p>
                                        <p className="text-xs font-bold text-[#8C7048] tabular-nums pt-0.5">
                                          قیمت واحد:{' '}
                                          {formatPrice(stat.unitPriceToman)}
                                        </p>
                                      </div>
                                    </div>

                                    {/* Per-Product Sales Breakdown (Units Sold + Total Revenue in Tomans) */}
                                    <div className="lg:col-span-4 border-y lg:border-y-0 lg:border-x border-[#EFECE6] py-3 lg:py-0 lg:px-4 space-y-2">
                                      <div className="flex items-center justify-between text-xs">
                                        <span className="text-[#5A554E] font-semibold">
                                          تعداد فروخته‌شده این محصول:
                                        </span>
                                        <span className="font-bold text-emerald-800 bg-emerald-50 border border-emerald-800/20 px-2.5 py-0.5 tabular-nums">
                                          {toPersianDigits(stat.totalUnitsSold)}{' '}
                                          عدد فروش رفته
                                        </span>
                                      </div>

                                      <div className="flex items-center justify-between text-[11px] text-[#787269]">
                                        <span>تفکیک فروش:</span>
                                        <span className="tabular-nums">
                                          {toPersianDigits(
                                            stat.initialSoldCount
                                          )}{' '}
                                          فروش قبلی +{' '}
                                          {toPersianDigits(
                                            stat.unitsSoldFromOrders
                                          )}{' '}
                                          در سفارش‌های جاری
                                        </span>
                                      </div>

                                      <div className="flex items-center justify-between text-xs pt-1 border-t border-[#FAF7F2]">
                                        <span className="text-[#5A554E] font-semibold">
                                          میزان کل فروش این محصول:
                                        </span>
                                        <span className="font-bold text-[#1A1A1A] tabular-nums">
                                          {formatPrice(stat.totalRevenueToman)}
                                        </span>
                                      </div>

                                      <div className="space-y-1 pt-0.5">
                                        <div className="flex items-center justify-between text-[10px] text-[#787269]">
                                          <span>سهم از کل فروش فروشگاه:</span>
                                          <span className="font-bold text-[#8C7048] tabular-nums">
                                            {toPersianDigits(
                                              revenueSharePercent
                                            )}
                                            ٪
                                          </span>
                                        </div>
                                        <div className="h-1.5 w-full bg-[#EFECE6] overflow-hidden">
                                          <div
                                            className="h-full bg-[#8C7048]"
                                            style={{
                                              width: `${Math.min(100, Math.max(4, revenueSharePercent))}%`,
                                            }}
                                          />
                                        </div>
                                      </div>
                                    </div>

                                    {/* Warehouse Stock Control & Edit / Delete Buttons */}
                                    <div className="lg:col-span-3 flex flex-col justify-between gap-3">
                                      <div className="flex items-center justify-between bg-[#FAF7F2] border border-[#E8E4DC] px-3 py-2">
                                        <div>
                                          <span className="block text-[10.5px] text-[#787269]">
                                            موجودی فعلی انبار:
                                          </span>
                                          <span
                                            className={`text-xs font-bold tabular-nums ${
                                              stat.stockQuantity === 0
                                                ? 'text-red-700'
                                                : stat.stockQuantity <= 10
                                                  ? 'text-amber-700'
                                                  : 'text-[#1A1A1A]'
                                            }`}
                                          >
                                            {toPersianDigits(
                                              stat.stockQuantity
                                            )}{' '}
                                            عدد در انبار
                                          </span>
                                        </div>

                                        <div className="flex items-center gap-1">
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleQuickAdjustStock(
                                                stat.productId,
                                                -1
                                              )
                                            }
                                            className="h-7 w-7 flex items-center justify-center border border-[#DCD5C9] bg-white hover:bg-[#EFECE6] text-xs font-bold cursor-pointer"
                                            title="کاهش ۱ عدد از موجودی انبار"
                                          >
                                            -
                                          </button>
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleQuickAdjustStock(
                                                stat.productId,
                                                1
                                              )
                                            }
                                            className="h-7 w-7 flex items-center justify-center border border-[#DCD5C9] bg-white hover:bg-[#EFECE6] text-xs font-bold cursor-pointer"
                                            title="افزایش ۱ عدد به موجودی انبار"
                                          >
                                            +
                                          </button>
                                        </div>
                                      </div>

                                      {!isConfirmingDelete ? (
                                        <div className="flex items-center gap-2">
                                          <button
                                            type="button"
                                            onClick={() =>
                                              handleOpenEditProduct(
                                                stat.productId
                                              )
                                            }
                                            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-[#1A1A1A] hover:bg-[#333333] text-white py-2 px-3 text-xs font-semibold transition-colors cursor-pointer"
                                          >
                                            <Pencil className="h-3.5 w-3.5 text-[#C5A880]" />
                                            <span>
                                              ویرایش عکس، عنوان و توضیحات
                                            </span>
                                          </button>

                                          <button
                                            type="button"
                                            onClick={() =>
                                              setConfirmDeleteProductId(
                                                stat.productId
                                              )
                                            }
                                            className="inline-flex items-center justify-center border border-red-800/30 bg-red-50 hover:bg-red-100 text-red-900 p-2 text-xs font-semibold transition-colors cursor-pointer"
                                            title="حذف این محصول"
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </button>
                                        </div>
                                      ) : (
                                        <div className="flex items-center justify-between gap-2 border border-red-800/40 bg-red-50 px-2.5 py-2 text-[11px]">
                                          <span className="font-bold text-red-900">
                                            حذف قطعی محصول؟
                                          </span>
                                          <div className="flex items-center gap-1.5">
                                            <button
                                              type="button"
                                              onClick={() =>
                                                handleConfirmDeleteProduct(
                                                  stat.productId
                                                )
                                              }
                                              className="bg-red-800 text-white px-2.5 py-1 font-bold cursor-pointer"
                                            >
                                              بله، حذف شود
                                            </button>
                                            <button
                                              type="button"
                                              onClick={() =>
                                                setConfirmDeleteProductId(null)
                                              }
                                              className="border border-[#DCD5C9] bg-white px-2 py-1 text-[#4A4640] cursor-pointer"
                                            >
                                              لغو
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {/* ADMIN SUB-TAB 1: DATABASE SCHEMA EXPORT */}
                      {adminSubTab === 'schema' && (
                        <div className="space-y-5">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8E4DC] pb-4">
                            <div>
                              <div className="flex items-center gap-2">
                                <Database className="h-5 w-5 text-[#8C7048]" />
                                <h3 className="font-editorial text-xl sm:text-2xl font-bold text-[#1A1A1A]">
                                  استخراج ساختار دیتابیس (ویژه پنل ادمین)
                                </h3>
                              </div>
                              <p className="mt-1.5 text-xs text-[#5A554E] text-justify leading-6">
                                این بخش فقط برای ادمین (parham) قابل مشاهده است و شامل ساختار کامل جداول MySQL، فیلدها، کلیدهای اصلی/خارجی و داده‌های اولیه محصولات فیکس لایف است.
                              </p>
                            </div>

                            <button
                              type="button"
                              onClick={handleCopySchemaToClipboard}
                              className="inline-flex items-center justify-center gap-2 bg-[#1A1A1A] hover:bg-[#333333] text-white px-5 py-3 text-xs font-bold transition-colors cursor-pointer shrink-0 shadow-sm"
                            >
                              {copySuccessMessage ? (
                                <>
                                  <Check className="h-4 w-4 text-emerald-400" />
                                  <span>کپی شد!</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="h-4 w-4 text-[#C5A880]" />
                                  <span>
                                    کپی اطلاعات دیتابیس (Copy to Clipboard)
                                  </span>
                                </>
                              )}
                            </button>
                          </div>

                          {copySuccessMessage && (
                            <div
                              role="status"
                              aria-live="polite"
                              className="flex items-center gap-2.5 border border-emerald-700/30 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-900"
                            >
                              <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
                              <span>{copySuccessMessage}</span>
                            </div>
                          )}

                          <div>
                            <div className="flex items-center justify-between bg-[#1A1A1A] text-[#EAE3D9] px-4 py-2 text-[11px] font-mono">
                              <span>
                                fixlife_mysql_schema_and_mock_export.json
                              </span>
                              <span>
                                {toPersianDigits(
                                  Math.round(schemaJsonString.length / 1024)
                                )}{' '}
                                کیلوبایت · JSON استاندارد
                              </span>
                            </div>
                            <textarea
                              ref={schemaTextareaRef}
                              readOnly
                              dir="ltr"
                              value={schemaJsonString}
                              onClick={(e) => e.currentTarget.select()}
                              aria-label="ساختار کامل دیتابیس و داده‌های ماک به فرمت JSON"
                              className="w-full h-[420px] border border-[#1A1A1A] bg-[#FAF7F2] p-4 font-mono text-xs leading-relaxed text-[#1A1A1A] text-left focus:outline-none resize-y"
                            />
                          </div>
                        </div>
                      )}

                      {/* ADMIN SUB-TAB 2: EMAIL NOTIFICATIONS LOG & PHP MAIL SCRIPT */}
                      {adminSubTab === 'emails' && (
                        <div className="space-y-5">
                          <div className="border-b border-[#E8E4DC] pb-3">
                            <h3 className="font-editorial text-xl font-bold text-[#1A1A1A]">
                              مرکز اعلان ایمیلی ادمین ({SITE_OFFICIAL_EMAIL} ←{' '}
                              {ADMIN_NOTIFICATION_EMAIL})
                            </h3>
                            <p className="mt-1 text-xs text-[#5A554E] leading-6">
                              به محض ورود هر کاربر، ثبت‌نام مشتری جدید یا ثبت سفارش خرید در فیکس لایف، یک ایمیل به صورت خودکار از آدرس{' '}
                              <span className="font-mono font-bold">
                                {SITE_OFFICIAL_EMAIL}
                              </span>{' '}
                              به ایمیل مدیریت{' '}
                              <span className="font-mono font-bold text-[#8C7048]">
                                {ADMIN_NOTIFICATION_EMAIL}
                              </span>{' '}
                              ارسال و در لیست زیر ثبت می‌گردد.
                            </p>
                          </div>

                          {emailLogs.length === 0 ? (
                            <div className="border border-[#E8E4DC] bg-white p-6 text-center text-xs text-[#787269]">
                              هنوز رویدادی ثبت نشده است. با ورود، ثبت‌نام یا ثبت سفارش، ایمیل ارسالی بلافاصله در اینجا نمایش داده می‌شود.
                            </div>
                          ) : (
                            <div className="space-y-3 max-h-[340px] overflow-y-auto">
                              {emailLogs.map((log) => (
                                <div
                                  key={log.id}
                                  className="border border-[#E8E4DC] bg-white p-4 space-y-2 text-xs"
                                >
                                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#EFECE6] pb-2">
                                    <span className="font-bold text-[#1A1A1A]">
                                      {log.subject}
                                    </span>
                                    <span className="text-[11px] text-[#787269]">
                                      {new Date(log.createdAt).toLocaleString(
                                        'fa-IR'
                                      )}
                                    </span>
                                  </div>
                                  <div className="flex flex-wrap gap-4 text-[11px] font-mono text-[#787269]">
                                    <span>From: {log.from}</span>
                                    <span>To: {log.to}</span>
                                  </div>
                                  <pre className="whitespace-pre-wrap font-sans text-xs text-[#4A4640] bg-[#FAF7F2] p-3 border border-[#EFECE6] leading-6">
                                    {log.body}
                                  </pre>
                                </div>
                              ))}
                            </div>
                          )}

                          <div className="space-y-2 pt-2">
                            <span className="block text-xs font-bold text-[#1A1A1A]">
                              کد آماده PHP ارسال ایمیل در هاست cPanel (`/api/notifications/admin-email.php`):
                            </span>
                            <pre
                              dir="ltr"
                              className="overflow-x-auto bg-[#1A1A1A] text-[#EAE3D9] p-4 text-[11px] font-mono leading-relaxed text-left"
                            >
                              {PHP_EMAIL_NOTIFICATION_SNIPPET}
                            </pre>
                          </div>
                        </div>
                      )}

                      {/* ADMIN SUB-TAB 3: WHATSAPP SUPPORT NUMBER CONFIG */}
                      {adminSubTab === 'whatsapp' && (
                        <div className="space-y-4 border border-[#E8E4DC] bg-white p-5">
                          <h3 className="font-editorial text-xl font-bold text-[#1A1A1A]">
                            تنظیم شماره واتساپ پشتیبانی شناور و مشاوره محصولات
                          </h3>
                          <p className="text-xs text-[#5A554E] leading-6">
                            شماره واتساپ زیر برای دکمه شناور پشتیبانی سایت و دکمه‌های «مشاوره واتساپ» در کنار هر محصول استفاده می‌شود. وقتی مشتری روی مشاوره هر محصول کلیک کند، نام دقیق محصول، کد محصول و قیمت آن به صورت خودکار در پیام واتساپ برای شما ارسال می‌شود.
                          </p>
                          <div className="max-w-sm space-y-3">
                            <label className="block text-xs font-semibold text-[#4A4640]">
                              شماره واتساپ ادمین (با کد کشور ۹۸ یا ۰۹):
                            </label>
                            <input
                              type="tel"
                              dir="ltr"
                              value={whatsappInput}
                              onChange={(e) => setWhatsappInput(e.target.value)}
                              placeholder="989123456789"
                              className="w-full border border-[#DCD5C9] bg-[#FAF7F2] px-3 py-2.5 text-xs text-left font-mono"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const saved =
                                  setSupportWhatsAppNumber(whatsappInput);
                                setWhatsappInput(saved);
                                setWhatsappSavedMsg(
                                  `شماره واتساپ پشتیبانی (${saved}) با موفقیت ذخیره شد.`
                                );
                                setTimeout(
                                  () => setWhatsappSavedMsg(null),
                                  4000
                                );
                              }}
                              className="bg-[#1A1A1A] px-5 py-2.5 text-xs font-semibold text-white hover:bg-[#333333] cursor-pointer"
                            >
                              ذخیره شماره واتساپ
                            </button>
                            {whatsappSavedMsg && (
                              <p className="text-xs font-semibold text-emerald-800">
                                {whatsappSavedMsg}
                              </p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* ADMIN SUB-TAB 4: PHP API CONTRACTS */}
                      {adminSubTab === 'contracts' && (
                        <div className="space-y-4">
                          <h3 className="font-editorial text-xl font-bold">
                            مستندات اتصال به بک‌اند cPanel LAMP/LEMP (PHP + MySQL)
                          </h3>
                          {PHP_MYSQL_API_CONTRACTS.map((contract) => (
                            <div
                              key={contract.endpoint}
                              className="border border-[#E8E4DC] bg-white p-4 space-y-2.5"
                            >
                              <div
                                dir="ltr"
                                className="flex flex-wrap items-center justify-between gap-2"
                              >
                                <div className="flex items-center gap-2 font-mono text-xs">
                                  <span className="bg-[#1A1A1A] px-2 py-0.5 text-[10px] font-semibold text-white">
                                    {contract.method}
                                  </span>
                                  <span className="font-semibold text-[#1A1A1A]">
                                    {contract.endpoint}
                                  </span>
                                </div>
                                <span className="font-mono text-[11px] text-[#8C7048]">
                                  {contract.phpController}
                                </span>
                              </div>
                              <p className="text-xs text-[#4A4640] text-justify">
                                {contract.description}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* TAB: CUSTOMER CHANGE PASSWORD */}
              {activeTab === 'security' && customer && (
                <div className="max-w-md space-y-5">
                  <div className="border-b border-[#E8E4DC] pb-3">
                    <h3 className="font-editorial text-xl font-bold text-[#1A1A1A]">
                      تغییر رمز عبور حساب کاربری
                    </h3>
                    <p className="mt-1 text-xs text-[#787269]">
                      شما می‌توانید در هر زمان پس از ثبت‌نام، رمز عبور حساب کاربری خود ({customer.email}) را تغییر دهید.
                    </p>
                  </div>

                  {passwordChangeError && (
                    <div className="flex items-center gap-2 border border-red-800/30 bg-red-50 px-3 py-2.5 text-xs text-red-900">
                      <AlertCircle className="h-4 w-4 shrink-0" />
                      <span>{passwordChangeError}</span>
                    </div>
                  )}

                  {passwordChangeSuccess && (
                    <div className="flex items-center gap-2 border border-emerald-800/30 bg-emerald-50 px-3 py-2.5 text-xs text-emerald-900">
                      <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700" />
                      <span>{passwordChangeSuccess}</span>
                    </div>
                  )}

                  <form
                    onSubmit={handleChangePasswordSubmit}
                    className="space-y-4 border border-[#E8E4DC] bg-white p-5"
                  >
                    <div>
                      <label className="block text-xs font-semibold text-[#4A4640] mb-1">
                        رمز عبور فعلی *
                      </label>
                      <input
                        type="password"
                        dir="ltr"
                        value={currentPasswordInput}
                        onChange={(e) =>
                          setCurrentPasswordInput(e.target.value)
                        }
                        required
                        className="w-full border border-[#DCD5C9] bg-[#FAF7F2] px-3 py-2 text-xs text-left"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4A4640] mb-1">
                        رمز عبور جدید (حداقل ۶ کاراکتر) *
                      </label>
                      <input
                        type="password"
                        dir="ltr"
                        value={newPasswordInput}
                        onChange={(e) => setNewPasswordInput(e.target.value)}
                        required
                        className="w-full border border-[#DCD5C9] bg-[#FAF7F2] px-3 py-2 text-xs text-left"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#4A4640] mb-1">
                        تکرار رمز عبور جدید *
                      </label>
                      <input
                        type="password"
                        dir="ltr"
                        value={confirmNewPasswordInput}
                        onChange={(e) =>
                          setConfirmNewPasswordInput(e.target.value)
                        }
                        required
                        className="w-full border border-[#DCD5C9] bg-[#FAF7F2] px-3 py-2 text-xs text-left"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isChangingPassword}
                      className="bg-[#1A1A1A] px-6 py-3 text-xs font-semibold text-white hover:bg-[#333333] transition-colors cursor-pointer"
                    >
                      {isChangingPassword
                        ? 'در حال بروزرسانی...'
                        : 'ثبت و تغییر رمز عبور'}
                    </button>
                  </form>
                </div>
              )}

              {/* TAB: CUSTOMER ORDERS */}
              {activeTab === 'orders' && customer && (
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-editorial text-xl font-bold">
                      سفارش‌ها و وضعیت ارسال لحظه‌ای
                    </h3>
                  </div>

                  {orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-[#E8E4DC] bg-white p-5 space-y-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E8E4DC] pb-3">
                        <div>
                          <span className="text-xs font-bold text-[#1A1A1A]">
                            سفارش #{order.orderNumber}
                          </span>
                          <span className="mx-2 text-[#DCD5C9]">·</span>
                          <span className="text-xs text-[#787269]">
                            {new Date(order.createdAt).toLocaleDateString(
                              'fa-IR',
                              {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              }
                            )}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          {renderStatusIndicator(order.status)}
                          <span className="text-sm font-bold tabular-nums text-[#1A1A1A]">
                            {formatPrice(order.totalUSD)}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-2 text-xs">
                        {order.items.map((item, i) => (
                          <div
                            key={i}
                            className="flex items-center justify-between text-[#4A4640]"
                          >
                            <span>
                              <strong className="text-[#1A1A1A]">
                                {item.name}
                              </strong>{' '}
                              ({item.size}) × {toPersianDigits(item.quantity)}
                            </span>
                            <span className="tabular-nums font-semibold">
                              {formatPrice(item.line_total_usd)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#E8E4DC] pt-3 text-[11px]">
                        <span className="text-[#787269]">
                          کد رهگیری پستی:{' '}
                          <span className="font-mono font-semibold text-[#1A1A1A]">
                            {order.trackingNumber ||
                              'پس از تحویل به پست ثبت می‌شود'}
                          </span>
                        </span>
                        {isAdminAuth && (
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="text-[#787269] ml-1">
                              تغییر وضعیت (ادمین):
                            </span>
                            {(
                              [
                                'pending',
                                'processing',
                                'completed',
                                'cancelled',
                              ] as OrderStatus[]
                            ).map((st) => (
                              <button
                                key={st}
                                type="button"
                                onClick={() =>
                                  onUpdateOrderStatus(order.id, st)
                                }
                                className={`px-2.5 py-1 text-[10px] border cursor-pointer ${
                                  order.status === st
                                    ? 'border-[#1A1A1A] bg-[#1A1A1A] text-white font-semibold'
                                    : 'border-[#DCD5C9] bg-[#FAF7F2] text-[#4A4640] hover:border-[#1A1A1A]'
                                }`}
                              >
                                {ORDER_STATUS_LABELS[st]}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB: CUSTOMER ADDRESSES */}
              {activeTab === 'addresses' && customer && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-editorial text-xl font-bold">
                      دفترچه آدرس‌های پستی در ایران
                    </h3>
                    {saveMessage && (
                      <span className="text-xs text-emerald-800 font-semibold">
                        {saveMessage}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    {(['shipping', 'billing'] as const).map((type) => {
                      const addr =
                        type === 'shipping'
                          ? customer.shippingAddress
                          : customer.billingAddress;
                      return (
                        <div
                          key={type}
                          className="border border-[#E8E4DC] bg-white p-5 flex flex-col justify-between"
                        >
                          <div>
                            <div className="flex items-center justify-between border-b border-[#E8E4DC] pb-2.5 mb-3">
                              <span className="text-xs font-bold">
                                {type === 'shipping'
                                  ? 'نشانی پیش‌فرض ارسال مرسوله'
                                  : 'نشانی پیش‌فرض صدور فاکتور'}
                              </span>
                              <button
                                type="button"
                                onClick={() => {
                                  const validProv = IRAN_PROVINCES.some(
                                    (p) => p.name === addr.state
                                  )
                                    ? addr.state
                                    : 'تهران';
                                  const provCities =
                                    IRAN_PROVINCES.find(
                                      (p) => p.name === validProv
                                    )?.cities || ['تهران'];
                                  const validCity = provCities.includes(
                                    addr.city
                                  )
                                    ? addr.city
                                    : provCities[0];
                                  setEditingAddressType(type);
                                  setAddrForm({
                                    ...addr,
                                    state: validProv,
                                    city: validCity,
                                    country: 'ایران',
                                    postalCode: normalizeDigits(
                                      addr.postalCode
                                    ),
                                    phone: normalizeDigits(addr.phone),
                                  });
                                  setAddressError(null);
                                  setSaveMessage(null);
                                }}
                                className="text-xs underline text-[#8C7048] hover:text-[#1A1A1A] cursor-pointer"
                              >
                                ویرایش آدرس
                              </button>
                            </div>
                            <div className="space-y-1.5 text-xs text-[#4A4640]">
                              <p className="font-bold text-[#1A1A1A]">
                                {addr.firstName} {addr.lastName}
                              </p>
                              <p>
                                ایران، استان {addr.state}، شهر {addr.city}
                              </p>
                              <p className="text-justify">{addr.addressLine1}</p>
                              <p>
                                کد پستی ۱۰ رقمی:{' '}
                                <span className="font-mono font-semibold text-[#1A1A1A]">
                                  {toPersianDigits(addr.postalCode)}
                                </span>
                              </p>
                              <p className="pt-1 text-[#787269]">
                                موبایل گیرنده:{' '}
                                <span className="font-mono font-semibold text-[#1A1A1A]">
                                  {toPersianDigits(addr.phone)}
                                </span>
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {editingAddressType && addrForm && (
                    <form
                      onSubmit={async (e) => {
                        e.preventDefault();
                        setAddressError(null);

                        if (
                          !addrForm.firstName.trim() ||
                          !addrForm.lastName.trim()
                        ) {
                          setAddressError('نام و نام خانوادگی الزامی است.');
                          return;
                        }
                        if (
                          !isValidIranLocation(addrForm.state, addrForm.city)
                        ) {
                          setAddressError(
                            'فقط استان‌ها و شهرهای داخل ایران قابل ثبت هستند.'
                          );
                          return;
                        }
                        if (!isValidIranPostalCode(addrForm.postalCode)) {
                          setAddressError(
                            'کد پستی باید دقیقاً ۱۰ رقم عددی باشد.'
                          );
                          return;
                        }
                        if (!isValidIranMobile(addrForm.phone)) {
                          setAddressError(
                            'شماره موبایل باید ۱۱ رقم و با پیش‌شماره ۰۹ باشد.'
                          );
                          return;
                        }

                        try {
                          await onUpdateAddress(editingAddressType, {
                            ...addrForm,
                            country: 'ایران',
                            postalCode: normalizeDigits(addrForm.postalCode),
                            phone: normalizeDigits(addrForm.phone),
                          });
                          setEditingAddressType(null);
                          setSaveMessage(
                            'آدرس جدید با موفقیت اعتبارسنجی و ذخیره شد.'
                          );
                        } catch (err) {
                          setAddressError(
                            err instanceof Error
                              ? err.message
                              : 'خطا در بروزرسانی آدرس.'
                          );
                        }
                      }}
                      className="border border-[#1A1A1A] bg-[#FAF7F2] p-5 space-y-4"
                    >
                      <h4 className="text-xs font-bold">
                        ویرایش{' '}
                        {editingAddressType === 'shipping'
                          ? 'نشانی ارسال مرسوله'
                          : 'نشانی فاکتور'}{' '}
                        (فقط شهرهای ایران)
                      </h4>

                      {addressError && (
                        <div className="flex items-center gap-2 border border-red-800/30 bg-red-50 px-3 py-2 text-xs text-red-900">
                          <AlertCircle className="h-4 w-4 shrink-0" />
                          <span>{addressError}</span>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#4A4640] mb-1">
                            نام گیرنده *
                          </label>
                          <input
                            type="text"
                            value={addrForm.firstName}
                            onChange={(e) =>
                              setAddrForm({
                                ...addrForm,
                                firstName: e.target.value,
                              })
                            }
                            placeholder="نام"
                            className="w-full border border-[#DCD5C9] bg-white px-3 py-2 text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#4A4640] mb-1">
                            نام خانوادگی گیرنده *
                          </label>
                          <input
                            type="text"
                            value={addrForm.lastName}
                            onChange={(e) =>
                              setAddrForm({
                                ...addrForm,
                                lastName: e.target.value,
                              })
                            }
                            placeholder="نام خانوادگی"
                            className="w-full border border-[#DCD5C9] bg-white px-3 py-2 text-xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-[#4A4640] mb-1">
                            کشور
                          </label>
                          <input
                            type="text"
                            value="ایران"
                            disabled
                            readOnly
                            className="w-full border border-[#E8E4DC] bg-[#EFECE6] px-3 py-2 text-xs font-semibold text-[#4A4640]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#4A4640] mb-1">
                            استان *
                          </label>
                          <select
                            value={addrForm.state}
                            onChange={(e) => {
                              const newProv = e.target.value;
                              const cities =
                                IRAN_PROVINCES.find((p) => p.name === newProv)
                                  ?.cities || [];
                              setAddrForm({
                                ...addrForm,
                                state: newProv,
                                city: cities[0] || '',
                              });
                            }}
                            className="w-full border border-[#DCD5C9] bg-white px-2.5 py-2 text-xs"
                          >
                            {IRAN_PROVINCES.map((p) => (
                              <option key={p.name} value={p.name}>
                                {p.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-[#4A4640] mb-1">
                            شهر *
                          </label>
                          <select
                            value={addrForm.city}
                            onChange={(e) =>
                              setAddrForm({ ...addrForm, city: e.target.value })
                            }
                            className="w-full border border-[#DCD5C9] bg-white px-2.5 py-2 text-xs"
                          >
                            {editingProvinceCities.map((c) => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#4A4640] mb-1">
                          نشانی کامل پستی *
                        </label>
                        <input
                          type="text"
                          value={addrForm.addressLine1}
                          onChange={(e) =>
                            setAddrForm({
                              ...addrForm,
                              addressLine1: e.target.value,
                            })
                          }
                          placeholder="خیابان، کوچه، پلاک، طبقه، واحد"
                          className="w-full border border-[#DCD5C9] bg-white px-3 py-2 text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[11px] font-semibold text-[#4A4640]">
                              کد پستی ۱۰ رقمی *
                            </label>
                            <span className="text-[10px] text-[#787269] tabular-nums">
                              {toPersianDigits(addrForm.postalCode.length)}/۱۰ رقم
                            </span>
                          </div>
                          <input
                            type="text"
                            inputMode="numeric"
                            dir="ltr"
                            maxLength={10}
                            value={addrForm.postalCode}
                            onChange={(e) =>
                              handlePostalCodeChange(e.target.value, (val) =>
                                setAddrForm({ ...addrForm, postalCode: val })
                              )
                            }
                            placeholder="1968943111"
                            className="w-full border border-[#DCD5C9] bg-white px-3 py-2 text-xs text-left font-mono tracking-widest"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-[11px] font-semibold text-[#4A4640]">
                              شماره موبایل (۱۱ رقمی) *
                            </label>
                            <span className="text-[10px] text-[#787269] tabular-nums">
                              {toPersianDigits(addrForm.phone.length)}/۱۱ رقم
                            </span>
                          </div>
                          <input
                            type="tel"
                            inputMode="tel"
                            dir="ltr"
                            maxLength={11}
                            value={addrForm.phone}
                            onChange={(e) =>
                              handlePhoneChange(e.target.value, (val) =>
                                setAddrForm({ ...addrForm, phone: val })
                              )
                            }
                            placeholder="09123456789"
                            className="w-full border border-[#DCD5C9] bg-white px-3 py-2 text-xs text-left font-mono"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="submit"
                          className="bg-[#1A1A1A] px-5 py-2.5 text-xs font-semibold text-white cursor-pointer"
                        >
                          ذخیره نشانی
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingAddressType(null)}
                          className="border border-[#DCD5C9] bg-white px-5 py-2.5 text-xs font-semibold cursor-pointer"
                        >
                          انصراف
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

