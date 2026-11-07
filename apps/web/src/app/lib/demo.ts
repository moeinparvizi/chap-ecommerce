/** Fictional browser-only data. No requests, payments or shared database writes. */
const KEY = 'chap-demo-v1';
type Row = Record<string, any>;
type Store = Record<string, Row[]>;
const date = '2026-10-25T12:00:00.000Z';

export function createDemoData(): Store {
  const categories = ['موبایل', 'لپتاپ', 'هدفون', 'گیمینگ', 'ساعت هوشمند', 'لوازم جانبی'].map(
    (name, i) => ({
      id: `cat-${i}`,
      name,
      slug: ['mobile', 'laptop', 'headphone', 'gaming', 'watch', 'accessories'][i],
      description: `منتخب ${name}`,
      image: `/demo/category-${i}.svg`,
      _count: { products: 2 },
    }),
  );
  const catalog = [
    ['iPhone 15 Pro', 0, 58900000, 'Apple', 'phone'],
    ['Samsung Galaxy S24', 0, 42500000, 'Samsung', 'phone'],
    ['MacBook Air M3', 1, 78900000, 'Apple', 'laptop'],
    ['ASUS Zenbook 14', 1, 56900000, 'ASUS', 'laptop'],
    ['Sony WH-1000XM5', 2, 18900000, 'Sony', 'headphones'],
    ['AirPods Pro 2', 2, 12500000, 'Apple', 'earbuds'],
    ['PlayStation 5', 3, 35900000, 'Sony', 'console'],
    ['Xbox Controller', 3, 4200000, 'Microsoft', 'controller'],
    ['Apple Watch Series 9', 4, 21500000, 'Apple', 'watch'],
    ['Galaxy Watch 6', 4, 9900000, 'Samsung', 'watch'],
    ['Logitech MX Master 3S', 5, 7400000, 'Logitech', 'mouse'],
    ['Keychron K2', 5, 6200000, 'Keychron', 'keyboard'],
  ];
  const products = catalog.map(([name, cat, price, brand, image], i) => ({
    id: `product-${i + 1}`,
    name,
    slug: String(name).toLowerCase().replace(/\s+/g, '-'),
    sku: `CHAP-${1001 + i}`,
    categoryId: categories[Number(cat)].id,
    category: categories[Number(cat)],
    price,
    compareAtPrice: Math.round(Number(price) * 1.2),
    stock: 12 + i * 3,
    brand,
    description: `${name}، انتخابی برای استفاده روزمره با طراحی زیبا و کیفیت ساخت بالا. این محصول و قیمت آن صرفاً برای نمایش امکانات فروشگاه درج شده‌اند.`,
    rating: 4.5 + (i % 5) / 10,
    sales: 45 + i * 31,
    status: 'ACTIVE',
    images: [{ id: `img-${i}`, url: `/demo/${image}.svg`, name: `${image}.svg` }],
    createdAt: date,
    updatedAt: date,
  }));
  const customers = [
    'کاربر نمایشی',
    'سارا احمدی',
    'علی رضایی',
    'نگار کریمی',
    'امیر حسینی',
    'مریم نوری',
  ].map((name, i) => ({
    id: i === 0 ? 'customer-demo' : `customer-${i}`,
    name,
    email: i === 0 ? 'customer@example.com' : `customer${i}@example.com`,
    password: 'Demo123!',
    role: 'customer',
    phone: '',
    orders: 2,
    totalSpent: products[i].price,
    createdAt: date,
    updatedAt: date,
  }));
  const orders = Array.from({ length: 12 }, (_, i) => ({
    id: `demo-order-${1001 + i}`,
    userId: customers[i % 6].id,
    customerName: customers[i % 6].name,
    amount: products[i].price,
    items: 1,
    status: ['DELIVERED', 'PROCESSING', 'SHIPPED', 'PENDING'][i % 4],
    paymentMethod: 'demo',
    itemsJson: JSON.stringify([
      {
        id: products[i].id,
        name: products[i].name,
        price: products[i].price,
        quantity: 1,
        image: products[i].images[0].url,
      },
    ]),
    locationJson: JSON.stringify({
      title: 'آدرس نمایشی',
      address: 'نشانی ساختگی برای نمایش',
      city: 'تهران',
      phone: '',
    }),
    createdAt: date,
    updatedAt: date,
  }));
  return {
    products,
    categories,
    customers: [
      {
        id: 'admin-demo',
        name: 'مدیر نمایشی',
        email: 'admin@example.com',
        password: 'Demo123!',
        role: 'admin',
        createdAt: date,
        updatedAt: date,
      },
      ...customers,
    ],
    orders,
    reviews: products.map((p, i) => ({
      id: `review-${i}`,
      productId: p.id,
      product: p,
      userId: 'customer-demo',
      user: customers[0],
      name: customers[0].name,
      rating: 5,
      title: 'کیفیت عالی',
      comment: 'نمونه نظر ساختگی برای بررسی ظاهر صفحه محصول.',
      content: 'نمونه نظر ساختگی برای بررسی ظاهر صفحه محصول.',
      createdAt: date,
    })),
    comments: [
      {
        id: 'comment-1',
        productId: products[0].id,
        product: products[0],
        userId: 'customer-demo',
        user: customers[0],
        content: 'آیا این محصول موجود است؟',
        text: 'آیا این محصول موجود است؟',
        reply: 'بله، این یک محصول نمایشی است.',
        createdAt: date,
      },
    ],
    locations: [
      {
        id: 'location-demo',
        userId: 'customer-demo',
        title: 'خانه نمایشی',
        address: 'نشانی ساختگی؛ لطفاً اطلاعات واقعی وارد نکنید',
        city: 'تهران',
        postalCode: '0000000000',
        phone: '',
        isDefault: true,
      },
    ],
    wishlist: [
      { id: 'wish-1', userId: 'customer-demo', productId: products[2].id, product: products[2] },
    ],
    notifications: [
      {
        id: 'notice-1',
        userId: 'customer-demo',
        title: 'به دموی فروشگاه خوش آمدید',
        message: 'تمام اطلاعات این محیط ساختگی است.',
        read: false,
        createdAt: date,
      },
    ],
    'marketing/campaigns': [
      {
        id: 'campaign-1',
        name: 'جشنواره پاییز',
        type: 'فصلی',
        status: 'active',
        discount: '20%',
        startDate: '2026-10-01',
        endDate: '2026-12-01',
        usageCount: 42,
      },
    ],
    'marketing/coupons': [
      {
        id: 'coupon-1',
        code: 'DEMO20',
        type: 'percentage',
        value: '20',
        usageCount: 12,
        maxUsage: 100,
        status: 'active',
      },
    ],
    'marketing/banners': [
      {
        id: 'banner-1',
        name: 'منتخب محصولات',
        position: 'home',
        status: 'active',
        images: [{ url: '/demo/banner.svg', name: 'banner.svg' }],
      },
    ],
    discounts: [
      {
        id: 'discount-1',
        name: 'تخفیف نمایشی',
        type: 'percentage',
        value: 20,
        active: true,
        productId: products[0].id,
        product: products[0],
        startDate: '2026-10-01',
        endDate: '2026-12-01',
      },
    ],
    markups: [],
  };
}
function load(): Store {
  try {
    const saved = localStorage.getItem(KEY);
    if (saved) return JSON.parse(saved);
  } catch {
    /* Restore corrupt or unavailable storage. */
  }
  return createDemoData();
}
function save(store: Store) {
  localStorage.setItem(KEY, JSON.stringify(store));
}
export function resetDemo() {
  localStorage.removeItem(KEY);
  for (const key of ['cart', 'orders', 'user', 'auth_token', 'redirectAfterLogin', 'site_settings'])
    localStorage.removeItem(key);
}
export async function demoRequest(path: string, options: RequestInit = {}): Promise<any> {
  const url = new URL(path, 'https://demo.invalid');
  const segments = url.pathname.slice(1).split('/');
  const store = load();
  const method = options.method || 'GET';
  const body = options.body ? JSON.parse(String(options.body)) : {};
  if (path === '/auth/login') {
    const user = store.customers.find(
      (c) => c.email === body.email && c.password === body.password,
    );
    if (!user) return null;
    const { password, ...publicUser } = user;
    return publicUser;
  }
  let resource = segments[0] === 'marketing' ? segments.slice(0, 2).join('/') : segments[0];
  const id = segments[resource.startsWith('marketing/') ? 2 : 1];
  if (resource === 'profile') resource = 'customers';
  if (!store[resource]) throw new Error(`Unknown demo endpoint: ${url.pathname}`);
  const rows = store[resource];
  const publicRow = (row: Row) => {
    const { password, ...data } = row;
    return data;
  };
  if (method === 'GET') {
    let result = rows.filter((row) =>
      ['userId', 'productId'].every(
        (key) => !url.searchParams.has(key) || row[key] === url.searchParams.get(key),
      ),
    );
    if (id) return publicRow(result.find((row) => row.id === id) || {});
    return result.map(publicRow);
  }
  if (resource === 'wishlist' && id === 'toggle') {
    const index = rows.findIndex(
      (row) => row.userId === body.userId && row.productId === body.productId,
    );
    if (index >= 0) rows.splice(index, 1);
    else
      rows.push({
        id: crypto.randomUUID(),
        ...body,
        product: store.products.find((p) => p.id === body.productId),
      });
    save(store);
    return { success: true };
  }
  if (id === 'read-all') {
    rows.filter((r) => r.userId === url.searchParams.get('userId')).forEach((r) => (r.read = true));
    save(store);
    return { success: true };
  }
  if (method === 'POST') {
    const row = {
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: resource === 'orders' ? 'PENDING' : 'ACTIVE',
      ...body,
    };
    if (resource === 'products')
      row.category = store.categories.find((c) => c.id === body.categoryId) || null;
    if (resource === 'customers') {
      row.role = 'customer';
      row.password = body.password;
    }
    if (resource === 'categories') rows.unshift(row);
    else rows.push(row);
    save(store);
    return publicRow(row);
  }
  const index = rows.findIndex((r) => r.id === id);
  if (index < 0) throw new Error('Demo record not found');
  if (method === 'DELETE') {
    rows.splice(index, 1);
    save(store);
    return { success: true };
  }
  if (method === 'PUT') {
    if (segments[2] === 'default')
      rows.filter((r) => r.userId === body.userId).forEach((r) => (r.isDefault = r.id === id));
    else
      Object.assign(
        rows[index],
        body,
        { updatedAt: new Date().toISOString() },
        segments[2] === 'read' ? { read: true } : {},
      );
    if (resource === 'products')
      rows[index].category = store.categories.find((c) => c.id === rows[index].categoryId) || null;
    save(store);
    return publicRow(rows[index]);
  }
  throw new Error('Unsupported demo operation');
}

/** Starts only a fictional browser session; never authorizes backend access. */
export async function enterDemo(role: 'admin' | 'customer') {
  const user = await demoRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email: `${role}@example.com`, password: 'Demo123!' }),
  });
  if (!user) throw new Error('Demo account missing; reset demo data to restore it.');
  localStorage.setItem('auth_token', `auth-${user.id}`);
  localStorage.setItem('user', JSON.stringify(user));
  return role === 'admin' ? '/admin' : '/account';
}
