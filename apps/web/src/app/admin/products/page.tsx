'use client';

import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  status: 'active' | 'draft' | 'archived';
  sales: number;
  rating: number;
  emoji: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Demo products data
  useEffect(() => {
    const demoProducts: Product[] = [
      { id: '1', name: 'iPhone 15 Pro Max', sku: 'IPH-15-PM-256', category: 'موبایل', brand: 'Apple', price: 1199, compareAtPrice: 1299, stock: 45, status: 'active', sales: 234, rating: 4.8, emoji: '📱' },
      { id: '2', name: 'MacBook Pro M3 14"', sku: 'MBP-M3-14', category: 'لپتاپ', brand: 'Apple', price: 1999, compareAtPrice: 2199, stock: 12, status: 'active', sales: 89, rating: 4.9, emoji: '💻' },
      { id: '3', name: 'Sony WH-1000XM5', sku: 'SONY-WH1000', category: 'هدفون', brand: 'Sony', price: 349, compareAtPrice: 399, stock: 78, status: 'active', sales: 456, rating: 4.7, emoji: '🎧' },
      { id: '4', name: 'Samsung Galaxy S24 Ultra', sku: 'SAM-S24U-512', category: 'موبایل', brand: 'Samsung', price: 1299, compareAtPrice: 1399, stock: 34, status: 'active', sales: 187, rating: 4.6, emoji: '📱' },
      { id: '5', name: 'Nike Air Max 90', sku: 'NIKE-AM90-BLK', category: 'کفش', brand: 'Nike', price: 129, compareAtPrice: 150, stock: 156, status: 'active', sales: 567, rating: 4.5, emoji: '👟' },
      { id: '6', name: 'iPad Air M2', sku: 'IPAD-AIR-M2', category: 'تبلت', brand: 'Apple', price: 599, compareAtPrice: 649, stock: 23, status: 'active', sales: 123, rating: 4.8, emoji: '📱' },
      { id: '7', name: 'Canon EOS R6 Mark II', sku: 'CAN-R6M2', category: 'دوربین', brand: 'Canon', price: 2499, compareAtPrice: 2799, stock: 8, status: 'active', sales: 45, rating: 4.7, emoji: '📷' },
      { id: '8', name: 'Dyson V15 Detect', sku: 'DYSON-V15', category: 'خانه', brand: 'Dyson', price: 749, compareAtPrice: 849, stock: 34, status: 'active', sales: 234, rating: 4.6, emoji: '🧹' },
      { id: '9', name: 'PlayStation 5', sku: 'PS5-STD', category: 'گیمینگ', brand: 'Sony', price: 499, compareAtPrice: 549, stock: 0, status: 'active', sales: 890, rating: 4.9, emoji: '🎮' },
      { id: '10', name: 'Apple Watch Series 9', sku: 'AWS9-45MM', category: 'ساعت', brand: 'Apple', price: 399, compareAtPrice: 429, stock: 67, status: 'active', sales: 345, rating: 4.7, emoji: '⌚' },
      { id: '11', name: 'Bose QuietComfort Ultra', sku: 'BOSE-QCU', category: 'هدفون', brand: 'Bose', price: 429, compareAtPrice: 499, stock: 45, status: 'draft', sales: 0, rating: 0, emoji: '🎧' },
      { id: '12', name: 'LG OLED C3 55"', sku: 'LG-OLED-C3-55', category: 'تلویزیون', brand: 'LG', price: 1499, compareAtPrice: 1799, stock: 18, status: 'active', sales: 67, rating: 4.8, emoji: '📺' },
    ];
    setProducts(demoProducts);
    setFilteredProducts(demoProducts);
  }, []);

  // Filter products
  useEffect(() => {
    let result = [...products];
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.sku.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query)
      );
    }
    
    if (statusFilter !== 'all') {
      result = result.filter(p => p.status === statusFilter);
    }
    
    if (categoryFilter !== 'all') {
      result = result.filter(p => p.category === categoryFilter);
    }
    
    setFilteredProducts(result);
  }, [searchQuery, statusFilter, categoryFilter, products]);

  const categories = [...new Set(products.map(p => p.category))];

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string }> = {
      active: { bg: '#dcfce7', text: '#166534' },
      draft: { bg: '#fef3c7', text: '#92400e' },
      archived: { bg: '#e5e7eb', text: '#374151' },
    };
    return colors[status] || { bg: '#f3f4f6', text: '#374151' };
  };

  const getStatusText = (status: string) => {
    const texts: Record<string, string> = {
      active: 'فعال',
      draft: 'پیش‌نویس',
      archived: 'بایگانی',
    };
    return texts[status] || status;
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setShowProductModal(true);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('آیا از حذف این محصول اطمینان دارید؟')) {
      setProducts(products.filter(p => p.id !== productId));
      setShowProductModal(false);
    }
  };

  const handleUpdateStatus = (productId: string, newStatus: string) => {
    setProducts(products.map(p => 
      p.id === productId 
        ? { ...p, status: newStatus as Product['status'] }
        : p
    ));
  };

  const productStats = {
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    draft: products.filter(p => p.status === 'draft').length,
    outOfStock: products.filter(p => p.stock === 0).length,
    lowStock: products.filter(p => p.stock > 0 && p.stock < 10).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
            مدیریت محصولات
          </h1>
          <p style={{ color: '#64748b', marginTop: '4px' }}>
            {filteredProducts.length} محصول یافت شد
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          style={{
            padding: '10px 20px',
            background: '#22c55e',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 500
          }}
        >
          ➕ افزودن محصول
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #e5e7eb' }}>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>کل محصولات</p>
          <p style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: '4px 0' }}>{productStats.total}</p>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #e5e7eb' }}>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>فعال</p>
          <p style={{ fontSize: '24px', fontWeight: 700, color: '#22c55e', margin: '4px 0' }}>{productStats.active}</p>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #e5e7eb' }}>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>پیش‌نویس</p>
          <p style={{ fontSize: '24px', fontWeight: 700, color: '#f59e0b', margin: '4px 0' }}>{productStats.draft}</p>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #e5e7eb' }}>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>ناموجود</p>
          <p style={{ fontSize: '24px', fontWeight: 700, color: '#ef4444', margin: '4px 0' }}>{productStats.outOfStock}</p>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #e5e7eb' }}>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>موجودی کم</p>
          <p style={{ fontSize: '24px', fontWeight: 700, color: '#f59e0b', margin: '4px 0' }}>{productStats.lowStock}</p>
        </div>
        <div style={{ background: 'white', borderRadius: '12px', padding: '16px', border: '1px solid #e5e7eb' }}>
          <p style={{ color: '#64748b', fontSize: '13px', margin: 0 }}>ارزش موجودی</p>
          <p style={{ fontSize: '20px', fontWeight: 700, color: '#0f172a', margin: '4px 0' }}>${productStats.totalValue.toLocaleString()}</p>
        </div>
      </div>

      {/* Filters */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '24px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <input
          type="text"
          placeholder="جستجو در محصولات..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            flex: 1,
            minWidth: '250px',
            padding: '10px 16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none'
          }}
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{
            padding: '10px 16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
            minWidth: '140px'
          }}
        >
          <option value="all">همه وضعیت‌ها</option>
          <option value="active">فعال</option>
          <option value="draft">پیش‌نویس</option>
          <option value="archived">بایگانی</option>
        </select>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          style={{
            padding: '10px 16px',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '14px',
            outline: 'none',
            minWidth: '140px'
          }}
        >
          <option value="all">همه دسته‌بندی‌ها</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        <div style={{ display: 'flex', gap: '4px' }}>
          <button
            onClick={() => setViewMode('grid')}
            style={{
              padding: '10px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              background: viewMode === 'grid' ? '#2563eb' : 'white',
              color: viewMode === 'grid' ? 'white' : '#374151',
              cursor: 'pointer'
            }}
          >
            ▦
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={{
              padding: '10px 12px',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              background: viewMode === 'list' ? '#2563eb' : 'white',
              color: viewMode === 'list' ? 'white' : '#374151',
              cursor: 'pointer'
            }}
          >
            ☰
          </button>
        </div>
      </div>

      {/* Products Grid View */}
      {viewMode === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
          {filteredProducts.map((product) => {
            const statusColor = getStatusColor(product.status);
            const discount = product.compareAtPrice 
              ? Math.round((1 - product.price / product.compareAtPrice) * 100) 
              : 0;
            
            return (
              <div key={product.id} style={{
                background: 'white',
                borderRadius: '12px',
                overflow: 'hidden',
                border: '1px solid #e5e7eb',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <div style={{
                  height: '160px',
                  background: '#f8fafc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '64px',
                  position: 'relative'
                }}>
                  {product.emoji}
                  {discount > 0 && (
                    <span style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      background: '#ef4444',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: 600
                    }}>
                      -{discount}%
                    </span>
                  )}
                  <span style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    fontSize: '11px',
                    fontWeight: 500,
                    background: statusColor.bg,
                    color: statusColor.text
                  }}>
                    {getStatusText(product.status)}
                  </span>
                </div>
                <div style={{ padding: '16px' }}>
                  <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {product.brand}
                  </p>
                  <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: '0 0 8px', lineHeight: '1.4' }}>
                    {product.name}
                  </h3>
                  <p style={{ fontSize: '11px', color: '#94a3b8', margin: '0 0 8px' }}>
                    SKU: {product.sku}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '8px' }}>
                    <span style={{ color: '#fbbf24' }}>★</span>
                    <span style={{ fontSize: '13px', color: '#374151' }}>{product.rating}</span>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>({product.sales} فروش)</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>${product.price}</span>
                    {product.compareAtPrice && (
                      <span style={{ fontSize: '13px', color: '#94a3b8', textDecoration: 'line-through' }}>
                        ${product.compareAtPrice}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ 
                      fontSize: '12px', 
                      color: product.stock === 0 ? '#ef4444' : product.stock < 10 ? '#f59e0b' : '#22c55e'
                    }}>
                      {product.stock === 0 ? 'ناموجود' : `${product.stock} موجود`}
                    </span>
                    <button
                      onClick={() => handleViewProduct(product)}
                      style={{
                        padding: '6px 12px',
                        background: '#2563eb',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '12px',
                        cursor: 'pointer'
                      }}
                    >
                      جزئیات
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc' }}>
                <th style={{ textAlign: 'right', padding: '14px 16px', fontSize: '13px', fontWeight: 600, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>محصول</th>
                <th style={{ textAlign: 'right', padding: '14px 16px', fontSize: '13px', fontWeight: 600, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>SKU</th>
                <th style={{ textAlign: 'right', padding: '14px 16px', fontSize: '13px', fontWeight: 600, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>قیمت</th>
                <th style={{ textAlign: 'right', padding: '14px 16px', fontSize: '13px', fontWeight: 600, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>موجودی</th>
                <th style={{ textAlign: 'right', padding: '14px 16px', fontSize: '13px', fontWeight: 600, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>وضعیت</th>
                <th style={{ textAlign: 'right', padding: '14px 16px', fontSize: '13px', fontWeight: 600, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>فروش</th>
                <th style={{ textAlign: 'right', padding: '14px 16px', fontSize: '13px', fontWeight: 600, color: '#374151', borderBottom: '1px solid #e5e7eb' }}>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const statusColor = getStatusColor(product.status);
                
                return (
                  <tr key={product.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '24px' }}>{product.emoji}</span>
                        <div>
                          <div style={{ fontWeight: 500, color: '#0f172a' }}>{product.name}</div>
                          <div style={{ fontSize: '12px', color: '#64748b' }}>{product.brand}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '12px', color: '#64748b', fontFamily: 'monospace' }}>
                      {product.sku}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, color: '#0f172a' }}>${product.price}</div>
                      {product.compareAtPrice && (
                        <div style={{ fontSize: '12px', color: '#94a3b8', textDecoration: 'line-through' }}>
                          ${product.compareAtPrice}
                        </div>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ 
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 500,
                        background: product.stock === 0 ? '#fee2e2' : product.stock < 10 ? '#fef3c7' : '#dcfce7',
                        color: product.stock === 0 ? '#991b1b' : product.stock < 10 ? '#92400e' : '#166534'
                      }}>
                        {product.stock === 0 ? 'ناموجود' : product.stock}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: 500,
                        background: statusColor.bg,
                        color: statusColor.text
                      }}>
                        {getStatusText(product.status)}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: '14px', color: '#374151' }}>
                      {product.sales}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button
                          onClick={() => handleViewProduct(product)}
                          style={{
                            padding: '4px 10px',
                            background: '#f1f5f9',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            color: '#374151'
                          }}
                        >
                          مشاهده
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          style={{
                            padding: '4px 10px',
                            background: '#fee2e2',
                            border: 'none',
                            borderRadius: '4px',
                            fontSize: '12px',
                            cursor: 'pointer',
                            color: '#991b1b'
                          }}
                        >
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Product Detail Modal */}
      {showProductModal && selectedProduct && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowProductModal(false)}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '100%',
            maxWidth: '600px',
            maxHeight: '90vh',
            overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
                جزئیات محصول
              </h2>
              <button
                onClick={() => setShowProductModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748b' }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
              <div style={{ 
                width: '120px', 
                height: '120px', 
                background: '#f8fafc', 
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '48px'
              }}>
                {selectedProduct.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 4px', fontSize: '18px' }}>{selectedProduct.name}</h3>
                <p style={{ margin: '0 0 4px', color: '#64748b', fontSize: '14px' }}>{selectedProduct.brand}</p>
                <p style={{ margin: '0 0 8px', color: '#94a3b8', fontSize: '12px', fontFamily: 'monospace' }}>SKU: {selectedProduct.sku}</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '24px', fontWeight: 700 }}>${selectedProduct.price}</span>
                  {selectedProduct.compareAtPrice && (
                    <span style={{ fontSize: '14px', color: '#94a3b8', textDecoration: 'line-through' }}>
                      ${selectedProduct.compareAtPrice}
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>موجودی</p>
                <p style={{ margin: '4px 0 0', fontWeight: 700, fontSize: '18px', color: selectedProduct.stock === 0 ? '#ef4444' : '#22c55e' }}>
                  {selectedProduct.stock}
                </p>
              </div>
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>فروش</p>
                <p style={{ margin: '4px 0 0', fontWeight: 700, fontSize: '18px' }}>{selectedProduct.sales}</p>
              </div>
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>امتیاز</p>
                <p style={{ margin: '4px 0 0', fontWeight: 700, fontSize: '18px' }}>★ {selectedProduct.rating}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>دسته‌بندی</p>
                <p style={{ margin: '4px 0 0', fontWeight: 500 }}>{selectedProduct.category}</p>
              </div>
              <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px' }}>
                <p style={{ margin: 0, fontSize: '12px', color: '#64748b' }}>وضعیت</p>
                <span style={{
                  display: 'inline-block',
                  marginTop: '4px',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontSize: '12px',
                  fontWeight: 500,
                  background: getStatusColor(selectedProduct.status).bg,
                  color: getStatusColor(selectedProduct.status).text
                }}>
                  {getStatusText(selectedProduct.status)}
                </span>
              </div>
            </div>

            {/* Status Actions */}
            <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '16px', marginBottom: '16px' }}>
              <p style={{ margin: '0 0 8px', fontWeight: 500, fontSize: '14px' }}>تغییر وضعیت:</p>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['active', 'draft', 'archived'].map(status => (
                  <button
                    key={status}
                    onClick={() => handleUpdateStatus(selectedProduct.id, status)}
                    disabled={selectedProduct.status === status}
                    style={{
                      padding: '6px 12px',
                      fontSize: '12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '6px',
                      background: selectedProduct.status === status ? getStatusColor(status).bg : 'white',
                      color: selectedProduct.status === status ? getStatusColor(status).text : '#374151',
                      cursor: selectedProduct.status === status ? 'default' : 'pointer',
                      opacity: selectedProduct.status === status ? 0.6 : 1
                    }}
                  >
                    {getStatusText(status)}
                  </button>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleDeleteProduct(selectedProduct.id)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#fee2e2',
                  color: '#991b1b',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                حذف محصول
              </button>
              <button
                onClick={() => setShowProductModal(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: 500
                }}
              >
                بستن
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }} onClick={() => setShowAddModal(false)}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflow: 'auto'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
                افزودن محصول جدید
              </h2>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#64748b' }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'grid', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                  نام محصول *
                </label>
                <input
                  id="add-product-name"
                  type="text"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none'
                  }}
                  placeholder="نام محصول را وارد کنید"
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                    SKU *
                  </label>
                  <input
                    id="add-product-sku"
                    type="text"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    placeholder="کد محصول"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                    دسته‌بندی *
                  </label>
                  <select
                    id="add-product-category"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  >
                    <option value="">انتخاب کنید</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                    برند
                  </label>
                  <input
                    id="add-product-brand"
                    type="text"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    placeholder="نام برند"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                    آیکون
                  </label>
                  <input
                    id="add-product-emoji"
                    type="text"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    placeholder="📱"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                    قیمت ($) *
                  </label>
                  <input
                    id="add-product-price"
                    type="number"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                    قیمت مقایسه ($)
                  </label>
                  <input
                    id="add-product-compare-price"
                    type="number"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    placeholder="اختیاری"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                    موجودی *
                  </label>
                  <input
                    id="add-product-stock"
                    type="number"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                    placeholder="0"
                  />
                </div>
                <div>
                  <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: 500, color: '#374151' }}>
                    وضعیت
                  </label>
                  <select
                    id="add-product-status"
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      fontSize: '14px',
                      outline: 'none'
                    }}
                  >
                    <option value="active">فعال</option>
                    <option value="draft">پیش‌نویس</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button
                  onClick={() => {
                    const name = (document.getElementById('add-product-name') as HTMLInputElement)?.value;
                    const sku = (document.getElementById('add-product-sku') as HTMLInputElement)?.value;
                    const category = (document.getElementById('add-product-category') as HTMLSelectElement)?.value;
                    const brand = (document.getElementById('add-product-brand') as HTMLInputElement)?.value || 'Generic';
                    const emoji = (document.getElementById('add-product-emoji') as HTMLInputElement)?.value || '📦';
                    const price = parseFloat((document.getElementById('add-product-price') as HTMLInputElement)?.value || '0');
                    const comparePrice = parseFloat((document.getElementById('add-product-compare-price') as HTMLInputElement)?.value || '0');
                    const stock = parseInt((document.getElementById('add-product-stock') as HTMLInputElement)?.value || '0');
                    const status = (document.getElementById('add-product-status') as HTMLSelectElement)?.value || 'draft';
                    
                    if (!name || !sku || !category || !price) {
                      alert('لطفاً فیلدهای ضروری را پر کنید');
                      return;
                    }

                    const newProduct: Product = {
                      id: String(products.length + 1),
                      name,
                      sku,
                      category,
                      brand,
                      price,
                      compareAtPrice: comparePrice || undefined,
                      stock,
                      status: status as Product['status'],
                      sales: 0,
                      rating: 0,
                      emoji
                    };

                    setProducts([newProduct, ...products]);
                    setShowAddModal(false);
                    alert('محصول با موفقیت اضافه شد!');
                  }}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#22c55e',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 600,
                    fontSize: '14px'
                  }}
                >
                  ✅ ذخیره محصول
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#e5e7eb',
                    color: '#374151',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 500,
                    fontSize: '14px'
                  }}
                >
                  انصراف
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
