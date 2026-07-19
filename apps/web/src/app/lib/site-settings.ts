// Site settings stored in localStorage, shared between admin and frontend
const SETTINGS_KEY = 'site_settings';

export interface SiteBanner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  active: boolean;
  order: number;
}

export interface SiteFooter {
  about: string;
  phone: string;
  email: string;
  address: string;
  socialLinks: { name: string; url: string; icon: string }[];
  copyright: string;
}

export interface SiteInfo {
  name: string;
  logo: string;
  slogan: string;
  primaryColor: string;
}

export interface SiteSettings {
  banners: SiteBanner[];
  footer: SiteFooter;
  siteInfo: SiteInfo;
}

const defaultSettings: SiteSettings = {
  banners: [
    { id: 'b1', title: 'فروش ویژه تابستانه', subtitle: 'تا ۵۰٪ تخفیف روی محصولات منتخب', image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?w=1200&h=400&fit=crop', link: '/products', active: true, order: 0 },
    { id: 'b2', title: 'جدیدترین محصولات', subtitle: 'با ما همراه باشید', image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=400&fit=crop', link: '/products', active: true, order: 1 },
    { id: 'b3', title: 'ارسال رایگان', subtitle: 'برای خریدهای بالای ۵۰۰ هزار تومان', image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1200&h=400&fit=crop', link: '/products', active: true, order: 2 },
  ],
  footer: {
    about: 'ShopHub فروشگاه آنلاین معتبر شما برای خرید محصولات با کیفیت و قیمت مناسب.',
    phone: '۰۲۱-۱۲۳۴۵۶۷۸',
    email: 'info@shophub.ir',
    address: 'تهران، خیابان ولیعصر، برج ShopHub',
    socialLinks: [
      { name: 'اینستاگرام', url: 'https://instagram.com/shophub', icon: 'Instagram' },
      { name: 'تلگرام', url: 'https://t.me/shophub', icon: 'Send' },
      { name: 'توییتر', url: 'https://twitter.com/shophub', icon: 'Twitter' },
    ],
    copyright: '© ۱۴۰۵ ShopHub. تمامی حقوق محفوظ است.',
  },
  siteInfo: {
    name: 'ShopHub',
    logo: '',
    slogan: 'فروشگاه آنلاین شما',
    primaryColor: '#3b82f6',
  },
};

export function getSiteSettings(): SiteSettings {
  if (typeof window === 'undefined') return defaultSettings;
  const saved = localStorage.getItem(SETTINGS_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return { ...defaultSettings, ...parsed };
    } catch {
      return defaultSettings;
    }
  }
  return defaultSettings;
}

export function saveSiteSettings(settings: SiteSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

export function initSiteSettings(): void {
  if (typeof window === 'undefined') return;
  if (!localStorage.getItem(SETTINGS_KEY)) {
    saveSiteSettings(defaultSettings);
  }
}
