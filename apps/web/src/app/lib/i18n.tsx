'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Lang = 'fa' | 'en';
type Dict = Record<string, string>;

const fa: Dict = {
  // Navigation
  'dashboard': 'داشبورد',
  'orders': 'سفارشات',
  'products': 'محصولات',
  'categories': 'دسته\u200cبندی\u200cها',
  'customers': 'مشتریان',
  'analytics': 'تحلیل\u200cها',
  'marketing': 'بازاریابی',
  'settings': 'تنظیمات',
  'logout': 'خروج',
  'welcome': 'خوش آمدید',
  'quickAccess': 'دسترسی سریع',
  // Products
  'productManagement': 'مدیریت محصولات',
  'addProduct': 'افزودن محصول',
  'editProduct': 'ویرایش محصول',
  'deleteProduct': 'حذف محصول',
  'productDetails': 'جزئیات محصول',
  'productName': 'نام محصول',
  'sku': 'SKU',
  'category': 'دسته\u200cبندی',
  'brand': 'برند',
  'description': 'توضیحات',
  'price': 'قیمت',
  'comparePrice': 'قیمت مقایسه',
  'stock': 'موجودی',
  'status': 'وضعیت',
  'active': 'فعال',
  'draft': 'پیش\u200cنویس',
  'archived': 'بایگانی',
  'inStock': 'موجود',
  'outOfStock': 'ناموجود',
  'lowStock': 'باقیمانده',
  'sales': 'فروش',
  'rating': 'امتیاز',
  'images': 'تصاویر',
  'addImages': 'افزودن تصویر',
  'selectImage': 'انتخاب تصویر',
  'changeImage': 'تغییر تصویر',
  'save': 'ذخیره',
  'saveChanges': 'ذخیره تغییرات',
  'cancel': 'انصراف',
  'close': 'بستن',
  'delete': 'حذف',
  'edit': 'ویرایش',
  'view': 'مشاهده',
  'create': 'ایجاد',
  'search': 'جستجو...',
  'allStatus': 'همه وضعیت\u200cها',
  'allCategories': 'همه دسته\u200cبندی\u200cها',
  'productsCount': 'محصول',
  'imagesCount': 'تصویر',
  // Categories
  'categoryManagement': 'مدیریت دسته\u200cبندی\u200cها',
  'addCategory': 'افزودن دسته\u200cبندی',
  'editCategory': 'ویرایش دسته\u200cبندی',
  'deleteCategory': 'حذف دسته\u200cبندی',
  'slug': 'اسلاگ',
  // Orders
  'orderManagement': 'مدیریت سفارشات',
  'orderNumber': 'شماره سفارش',
  'customer': 'مشتری',
  'email': 'ایمیل',
  'amount': 'مبلغ',
  'items': 'اقلام',
  'totalSpent': 'مجموع خرید',
  'date': 'تاریخ',
  'pending': 'در انتظار',
  'processing': 'در حال پردازش',
  'shipped': 'ارسال شده',
  'delivered': 'تحویل شده',
  'cancelled': 'لغو شده',
  'paid': 'پرداخت شده',
  'failed': 'ناموفق',
  'refunded': 'بازگشت داده شده',
  // Customers
  'customerManagement': 'مدیریت مشتریان',
  'phone': 'تلفن',
  'totalOrders': 'سفارشات',
  'totalPurchases': 'مجموع خرید',
  'joinDate': 'تاریخ عضویت',
  'lastLogin': 'آخرین ورود',
  // Marketing
  'campaigns': 'کمپین\u200cها',
  'coupons': 'کوپن\u200cها',
  'banners': 'بنرها',
  'newsletter': 'خبرنامه',
  'newCampaign': 'کمپین جدید',
  'newCoupon': 'کوپن جدید',
  'newBanner': 'بنر جدید',
  'discount': 'تخفیف',
  'code': 'کد',
  'value': 'مقدار',
  'position': 'موقعیت',
  'homePage': 'صفحه خانه',
  'uploadImages': 'آپلود تصاویر',
  'maxImages': 'حداکثر ۵ تصویر',
  // Analytics
  'analyticsTitle': 'تحلیل\u200cها و گزارشات',
  'analyticsSubtitle': 'آمار و عملکرد فروشگاه',
  'totalRevenue': 'درآمد کل',
  'allOrders': 'کل سفارشات',
  'avgOrder': 'میانگین سفارش',
  'recentSales': 'فروش اخیر',
  'trafficSources': 'منابع ترافیک',
  'totalVisitors': 'کل بازدیدکنندگان',
  'peakHours': 'ساعت پیک سفارشات',
  'topProducts': 'پرفروش\u200cترین محصولات',
  'dailyReport': 'گزارش فروش اخیر',
  'days7': '۷ روز اخیر',
  'days30': '۳۰ روز اخیر',
  'days90': '۹۰ روز اخیر',
  'oneYear': 'یک سال',
  // Settings
  'settingsTitle': 'تنظیمات',
  // Common
  'confirm': 'آیا اطمینان دارید؟',
  'noData': 'داده\u200cای موجود نیست',
  'loading': 'در حال بارگذاری...',
  'error': 'خطا',
  'success': 'موفقیت',
};

const en: Dict = {
  'dashboard': 'Dashboard',
  'orders': 'Orders',
  'products': 'Products',
  'categories': 'Categories',
  'customers': 'Customers',
  'analytics': 'Analytics',
  'marketing': 'Marketing',
  'settings': 'Settings',
  'logout': 'Logout',
  'welcome': 'Welcome',
  'quickAccess': 'Quick Access',
  'productManagement': 'Product Management',
  'addProduct': 'Add Product',
  'editProduct': 'Edit Product',
  'deleteProduct': 'Delete Product',
  'productDetails': 'Product Details',
  'productName': 'Product Name',
  'sku': 'SKU',
  'category': 'Category',
  'brand': 'Brand',
  'description': 'Description',
  'price': 'Price',
  'comparePrice': 'Compare Price',
  'stock': 'Stock',
  'status': 'Status',
  'active': 'Active',
  'draft': 'Draft',
  'archived': 'Archived',
  'inStock': 'In Stock',
  'outOfStock': 'Out of Stock',
  'lowStock': 'left',
  'sales': 'sales',
  'rating': 'Rating',
  'images': 'Images',
  'addImages': 'Add Image',
  'selectImage': 'Select Image',
  'changeImage': 'Change Image',
  'save': 'Save',
  'saveChanges': 'Save Changes',
  'cancel': 'Cancel',
  'close': 'Close',
  'delete': 'Delete',
  'edit': 'Edit',
  'view': 'View',
  'create': 'Create',
  'search': 'Search...',
  'allStatus': 'All Status',
  'allCategories': 'All Categories',
  'productsCount': 'products',
  'imagesCount': 'images',
  'categoryManagement': 'Category Management',
  'addCategory': 'Add Category',
  'editCategory': 'Edit Category',
  'deleteCategory': 'Delete Category',
  'slug': 'Slug',
  'orderManagement': 'Order Management',
  'orderNumber': 'Order #',
  'customer': 'Customer',
  'email': 'Email',
  'amount': 'Amount',
  'items': 'Items',
  'totalSpent': 'Total Spent',
  'date': 'Date',
  'pending': 'Pending',
  'processing': 'Processing',
  'shipped': 'Shipped',
  'delivered': 'Delivered',
  'cancelled': 'Cancelled',
  'paid': 'Paid',
  'failed': 'Failed',
  'refunded': 'Refunded',
  'customerManagement': 'Customer Management',
  'phone': 'Phone',
  'totalOrders': 'Orders',
  'totalPurchases': 'Total Purchases',
  'joinDate': 'Join Date',
  'lastLogin': 'Last Login',
  'campaigns': 'Campaigns',
  'coupons': 'Coupons',
  'banners': 'Banners',
  'newsletter': 'Newsletter',
  'newCampaign': 'New Campaign',
  'newCoupon': 'New Coupon',
  'newBanner': 'New Banner',
  'discount': 'Discount',
  'code': 'Code',
  'value': 'Value',
  'position': 'Position',
  'homePage': 'Home Page',
  'uploadImages': 'Upload Images',
  'maxImages': 'Max 5 images',
  'analyticsTitle': 'Analytics & Reports',
  'analyticsSubtitle': 'Store statistics and performance',
  'totalRevenue': 'Total Revenue',
  'allOrders': 'Total Orders',
  'avgOrder': 'Avg Order',
  'recentSales': 'Recent Sales',
  'trafficSources': 'Traffic Sources',
  'totalVisitors': 'Total Visitors',
  'peakHours': 'Peak Order Hours',
  'topProducts': 'Top Products',
  'dailyReport': 'Daily Sales Report',
  'days7': 'Last 7 days',
  'days30': 'Last 30 days',
  'days90': 'Last 90 days',
  'oneYear': 'One Year',
  'settingsTitle': 'Settings',
  'confirm': 'Are you sure?',
  'noData': 'No data available',
  'loading': 'Loading...',
  'error': 'Error',
  'success': 'Success',
};

const i18nContext = createContext<{ lang: Lang; t: (key: string) => string; toggleLang: () => void }>({
  lang: 'fa',
  t: (key: string) => key,
  toggleLang: () => {},
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('fa');

  useEffect(() => {
    const saved = localStorage.getItem('lang') as Lang;
    if (saved) {
      setLang(saved);
      document.documentElement.dir = saved === 'fa' ? 'rtl' : 'ltr';
      document.documentElement.lang = saved;
    }
  }, []);

  const toggleLang = () => {
    const newLang = lang === 'fa' ? 'en' : 'fa';
    setLang(newLang);
    localStorage.setItem('lang', newLang);
    document.documentElement.dir = newLang === 'fa' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
  };

  const dict = lang === 'fa' ? fa : en;
  const t = (key: string) => dict[key] || key;

  return (
    <i18nContext.Provider value={{ lang, t, toggleLang }}>
      {children}
    </i18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(i18nContext);
}
