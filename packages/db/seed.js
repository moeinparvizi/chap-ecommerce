const { PrismaClient } = require('@ecommerce/db');
const prisma = new PrismaClient();

async function main() {
  // Seed categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'mobile' }, update: {}, create: { name: 'موبایل', slug: 'mobile', description: 'گوشی های هوشمند', image: 'https://picsum.photos/100/100?random=10' } }),
    prisma.category.upsert({ where: { slug: 'laptop' }, update: {}, create: { name: 'لپتاپ', slug: 'laptop', description: 'لپتاپ و نوت بوک', image: 'https://picsum.photos/100/100?random=11' } }),
    prisma.category.upsert({ where: { slug: 'headphone' }, update: {}, create: { name: 'هدفون', slug: 'headphone', description: 'هدفون و هندزفری', image: 'https://picsum.photos/100/100?random=12' } }),
    prisma.category.upsert({ where: { slug: 'tablet' }, update: {}, create: { name: 'تبلت', slug: 'tablet', description: 'تبلت و آیپد', image: 'https://picsum.photos/100/100?random=13' } }),
    prisma.category.upsert({ where: { slug: 'shoes' }, update: {}, create: { name: 'کفش', slug: 'shoes', description: 'کفش های ورزشی', image: 'https://picsum.photos/100/100?random=14' } }),
  ]);

  // Seed products
  const products = [
    { name: 'iPhone 15 Pro Max', sku: 'IPH-15-PM-256', price: 1199, compareAtPrice: 1299, stock: 45, status: 'ACTIVE', brand: 'Apple', description: 'گوشی هوشمند اپل', categoryId: categories[0].id, rating: 4.8, sales: 234, images: [{ url: 'https://picsum.photos/400/300?random=1', name: 'front.jpg' }] },
    { name: 'MacBook Pro M3', sku: 'MBP-M3-14', price: 1999, compareAtPrice: 2199, stock: 12, status: 'ACTIVE', brand: 'Apple', description: 'لپتاپ اپل', categoryId: categories[1].id, rating: 4.9, sales: 89, images: [{ url: 'https://picsum.photos/400/300?random=3', name: 'front.jpg' }] },
    { name: 'Sony WH-1000XM5', sku: 'SONY-WH1000', price: 349, compareAtPrice: 399, stock: 78, status: 'ACTIVE', brand: 'Sony', description: 'هدفون بی سیم', categoryId: categories[2].id, rating: 4.7, sales: 456, images: [{ url: 'https://picsum.photos/400/300?random=4', name: 'front.jpg' }] },
    { name: 'Samsung Galaxy S24', sku: 'SAM-S24', price: 899, compareAtPrice: 999, stock: 56, status: 'ACTIVE', brand: 'Samsung', description: 'گوشی سامسونگ', categoryId: categories[0].id, rating: 4.6, sales: 187, images: [{ url: 'https://picsum.photos/400/300?random=5', name: 'front.jpg' }] },
    { name: 'Nike Air Max 90', sku: 'NIKE-AM90', price: 129, compareAtPrice: 150, stock: 156, status: 'ACTIVE', brand: 'Nike', description: 'کفش ورزشی نایک', categoryId: categories[4].id, rating: 4.5, sales: 567, images: [{ url: 'https://picsum.photos/400/300?random=6', name: 'main.jpg' }] },
    { name: 'iPad Air M2', sku: 'IPAD-AIR', price: 599, compareAtPrice: 649, stock: 23, status: 'ACTIVE', brand: 'Apple', description: 'تبلت اپل', categoryId: categories[3].id, rating: 4.8, sales: 123, images: [{ url: 'https://picsum.photos/400/300?random=7', name: 'front.jpg' }] },
  ];

  for (const p of products) {
    const { images, ...data } = p;
    await prisma.product.upsert({
      where: { sku: p.sku },
      update: {},
      create: { ...data, slug: p.name.toLowerCase().replace(/\s+/g, '-'), images: { create: images } },
    });
  }

  // Seed campaigns
  await prisma.campaign.create({ data: { name: 'حراج فصل تابستان', type: 'فصلی', status: 'active', discount: '30%', startDate: '2024-06-01', endDate: '2024-06-30', usageCount: 456 } });
  await prisma.campaign.create({ data: { name: 'تخفیف مشتریان جدید', type: 'خوشامدگویی', status: 'active', discount: '20%', startDate: '2024-01-01', endDate: '2024-12-31', usageCount: 234 } });

  // Seed coupons
  await prisma.coupon.create({ data: { code: 'WELCOME20', type: 'درصدی', value: '20%', usageCount: 234, maxUsage: 500, status: 'active' } });
  await prisma.coupon.create({ data: { code: 'SUMMER30', type: 'درصدی', value: '30%', usageCount: 456, maxUsage: 1000, status: 'active' } });

  // Seed orders
  const statuses = ['DELIVERED', 'PROCESSING', 'SHIPPED', 'PENDING'];
  const names = ['علی محمدی', 'سارا احمدی', 'رضا حسینی', 'مریم کریمی', 'حسن رضایی', 'زهرا عباسی', 'امیر نوری', 'نیلوفر شریفی'];
  for (let i = 0; i < 8; i++) {
    await prisma.order.create({
      data: {
        customerName: names[i],
        amount: Math.floor(Math.random() * 800) + 100,
        status: statuses[i % 4],
        items: Math.floor(Math.random() * 5) + 1,
      },
    });
  }

  console.log('Seeded!');
}

main().then(() => prisma.$disconnect());
