'use client';

import { useState, useEffect, useRef } from 'react';

interface ProductImage {
  id: string;
  url: string;
  name: string;
  size: number;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  brand: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  costPrice?: number;
  stock: number;
  status: 'active' | 'draft' | 'archived';
  sales: number;
  rating: number;
  images: ProductImage[];
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [showProductModal, setShowProductModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editImages, setEditImages] = useState<ProductImage[]>([]);
  
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const addFileInputRef = useRef<HTMLInputElement>(null);
  const [addModalImages, setAddModalImages] = useState<ProductImage[]>([]);

  // Demo products
  useEffect(() => {
    const demoProducts: Product[] = [
      { id: '1', name: 'iPhone 15 Pro Max', sku: 'IPH-15-PM-256', category: 'موبایل', brand: 'Apple', description: 'گوشی هوشمند اپل آیفون ۱۵ پرو مکس با تراشه A17 Pro', price: 1199, compareAtPrice: 1299, stock: 45, status: 'active', sales: 234, rating: 4.8, images: [{ id: '1', url: 'https://picsum.photos/400/300?random=1', name: 'front.jpg', size: 245000 }, { id: '2', url: 'https://picsum.photos/400/300?random=2', name: 'back.jpg', size: 198000 }] },
      { id: '2', name: 'MacBook Pro M3 14"', sku: 'MBP-M3-14', category: 'لپتاپ', brand: 'Apple', description: 'لپتاپ اپل مک‌بوک پرو با تراشه M3', price: 1999, compareAtPrice: 2199, stock: 12, status: 'active', sales: 89, rating: 4.9, images: [{ id: '1', url: 'https://picsum.photos/400/300?random=3', name: 'front.jpg', size: 312000 }] },
      { id: '3', name: 'Sony WH-1000XM5', sku: 'SONY-WH1000', category: 'هدفون', brand: 'Sony', description: 'هدفون بی‌سیم سونی با حذف نویز', price: 349, compareAtPrice: 399, stock: 78, status: 'active', sales: 456, rating: 4.7, images: [{ id: '1', url: 'https://picsum.photos/400/300?random=4', name: 'front.jpg', size: 89000 }] },
      { id: '4', name: 'Samsung Galaxy S24', sku: 'SAM-S24', category: 'موبایل', brand: 'Samsung', description: 'گوشی هوشمند سامسونگ گلکسی اس ۲۴', price: 899, compareAtPrice: 999, stock: 56, status: 'active', sales: 187, rating: 4.6, images: [{ id: '1', url: 'https://picsum.photos/400/300?random=5', name: 'front.jpg', size: 178000 }] },
      { id: '5', name: 'Nike Air Max 90', sku: 'NIKE-AM90', category: 'کفش', brand: 'Nike', description: 'کفش ورزشی نایک ایرمکس ۹۰', price: 129, compareAtPrice: 150, stock: 156, status: 'active', sales: 567, rating: 4.5, images: [{ id: '1', url: 'https://picsum.photos/400/300?random=6', name: 'main.jpg', size: 145000 }] },
      { id: '6', name: 'iPad Air M2', sku: 'IPAD-AIR', category: 'تبلت', brand: 'Apple', description: 'تبلت اپل آیپد ایر با تراشه M2', price: 599, compareAtPrice: 649, stock: 23, status: 'active', sales: 123, rating: 4.8, images: [{ id: '1', url: 'https://picsum.photos/400/300?random=7', name: 'front.jpg', size: 198000 }] },
    ];
    setProducts(demoProducts);
    setFilteredProducts(demoProducts);
  }, []);

  useEffect(() => {
    let result = [...products];
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(p => p.name.toLowerCase().includes(query) || p.sku.toLowerCase().includes(query) || p.brand.toLowerCase().includes(query));
    }
    if (statusFilter !== 'all') result = result.filter(p => p.status === statusFilter);
    if (categoryFilter !== 'all') result = result.filter(p => p.category === categoryFilter);
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

  const getStatusText = (s: string) => ({ active: 'فعال', draft: 'پیش‌نویس', archived: 'بایگانی' }[s] || s);

  const formatFileSize = (bytes: number) => bytes < 1024 ? bytes + ' B' : bytes < 1024 * 1024 ? (bytes / 1024).toFixed(1) + ' KB' : (bytes / (1024 * 1024)).toFixed(1) + ' MB';

  // Image upload handlers
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'edit' | 'add') => {
    const files = e.target.files;
    if (!files) return;

    const currentImages = target === 'edit' ? editImages : addModalImages;
    const remainingSlots = 10 - currentImages.length;
    if (remainingSlots <= 0) { alert('حداکثر ۱۰ تصویر مجاز است'); return; }

    Array.from(files).slice(0, remainingSlots).forEach(file => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const newImage: ProductImage = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          url: event.target?.result as string,
          name: file.name,
          size: file.size,
        };
        if (target === 'edit') setEditImages(prev => [...prev, newImage]);
        else setAddModalImages(prev => [...prev, newImage]);
      };
      reader.readAsDataURL(file);
    });
    if (target === 'edit' && editFileInputRef.current) editFileInputRef.current.value = '';
    if (target === 'add' && addFileInputRef.current) addFileInputRef.current.value = '';
  };

  const removeImage = (imageId: string, target: 'edit' | 'add') => {
    if (target === 'edit') setEditImages(prev => prev.filter(img => img.id !== imageId));
    else setAddModalImages(prev => prev.filter(img => img.id !== imageId));
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setEditImages([...product.images]);
    setEditMode(false);
    setShowProductModal(true);
  };

  const handleEditProduct = () => {
    setEditMode(true);
  };

  const handleSaveEdit = () => {
    if (!selectedProduct) return;
    
    const name = (document.getElementById('edit-name') as HTMLInputElement)?.value;
    const sku = (document.getElementById('edit-sku') as HTMLInputElement)?.value;
    const category = (document.getElementById('edit-category') as HTMLSelectElement)?.value;
    const brand = (document.getElementById('edit-brand') as HTMLInputElement)?.value;
    const description = (document.getElementById('edit-description') as HTMLTextAreaElement)?.value;
    const price = parseFloat((document.getElementById('edit-price') as HTMLInputElement)?.value || '0');
    const comparePrice = parseFloat((document.getElementById('edit-compare-price') as HTMLInputElement)?.value || '0');
    const stock = parseInt((document.getElementById('edit-stock') as HTMLInputElement)?.value || '0');
    const status = (document.getElementById('edit-status') as HTMLSelectElement)?.value;

    if (!name || !sku || !price) {
      alert('لطفاً فیلدهای ضروری را پر کنید');
      return;
    }

    setProducts(products.map(p => 
      p.id === selectedProduct.id 
        ? { ...p, name, sku, category, brand, description, price, compareAtPrice: comparePrice || undefined, stock, status: status as Product['status'], images: [...editImages] }
        : p
    ));
    setEditMode(false);
    setShowProductModal(false);
    alert('محصول با موفقیت بروزرسانی شد!');
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('آیا از حذف این محصول اطمینان دارید؟')) {
      setProducts(products.filter(p => p.id !== productId));
      setShowProductModal(false);
    }
  };

  const handleAddProduct = () => {
    const name = (document.getElementById('add-name') as HTMLInputElement)?.value;
    const sku = (document.getElementById('add-sku') as HTMLInputElement)?.value;
    const category = (document.getElementById('add-category') as HTMLSelectElement)?.value;
    const brand = (document.getElementById('add-brand') as HTMLInputElement)?.value || 'Generic';
    const description = (document.getElementById('add-description') as HTMLTextAreaElement)?.value || '';
    const price = parseFloat((document.getElementById('add-price') as HTMLInputElement)?.value || '0');
    const stock = parseInt((document.getElementById('add-stock') as HTMLInputElement)?.value || '0');

    if (!name || !sku || !category || !price) { alert('لطفاً فیلدهای ضوری را پر کنید'); return; }

    const newProduct: Product = {
      id: String(Date.now()), name, sku, category, brand, description, price, stock,
      status: 'draft', sales: 0, rating: 0, images: [...addModalImages]
    };

    setProducts([newProduct, ...products]);
    setAddModalImages([]);
    setShowAddModal(false);
    alert('محصول با موفقیت اضافه شد!');
  };

  const productStats = {
    total: products.length,
    active: products.filter(p => p.status === 'active').length,
    draft: products.filter(p => p.status === 'draft').length,
    outOfStock: products.filter(p => p.stock === 0).length,
    totalValue: products.reduce((sum, p) => sum + (p.price * p.stock), 0),
    totalImages: products.reduce((sum, p) => sum + p.images.length, 0),
  };

  return (
    <div style={{ padding: '24px' }}>
      <input ref={editFileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={(e) => handleImageUpload(e, 'edit')} />
      <input ref={addFileInputRef} type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={(e) => handleImageUpload(e, 'add')} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>مدیریت محصولات</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>{filteredProducts.length} محصول | {productStats.totalImages} تصویر</p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{ padding: '10px 20px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>➕ افزودن محصول</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'کل', value: productStats.total, color: 'var(--text)' },
          { label: 'فعال', value: productStats.active, color: '#22c55e' },
          { label: 'پیش‌نویس', value: productStats.draft, color: '#f59e0b' },
          { label: 'ناموجود', value: productStats.outOfStock, color: '#ef4444' },
          { label: 'تصاویر', value: productStats.totalImages, color: '#8b5cf6' },
        ].map((s, i) => (
          <div key={i} style={{ background: 'var(--card-bg)', borderRadius: '12px', padding: '16px', border: '1px solid var(--border)' }}>
            <p style={{ color: 'var(--text-secondary)', fontSize: '13px', margin: 0 }}>{s.label}</p>
            <p style={{ fontSize: '24px', fontWeight: 700, color: s.color, margin: '4px 0' }}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <input type="text" placeholder="جستجو..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ flex: 1, minWidth: '200px', padding: '10px 16px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '10px 16px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
          <option value="all">همه وضعیت‌ها</option>
          <option value="active">فعال</option>
          <option value="draft">پیش‌نویس</option>
        </select>
        <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} style={{ padding: '10px 16px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none' }}>
          <option value="all">همه دسته‌بندی‌ها</option>
          {categories.map(cat => (<option key={cat} value={cat}>{cat}</option>))}
        </select>
      </div>

      {/* Products Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {filteredProducts.map((product) => {
          const mainImage = product.images.length > 0 ? product.images[0].url : null;
          const discount = product.compareAtPrice ? Math.round((1 - product.price / product.compareAtPrice) * 100) : 0;
          return (
            <div key={product.id} style={{ background: 'var(--card-bg)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ height: '180px', background: mainImage ? `url(${mainImage}) center/cover` : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {!mainImage && <span style={{ fontSize: '48px' }}>📦</span>}
                {discount > 0 && <span style={{ position: 'absolute', top: '10px', right: '10px', background: '#ef4444', color: 'white', padding: '3px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 600 }}>-{discount}%</span>}
                {product.images.length > 0 && <span style={{ position: 'absolute', top: '10px', left: '10px', background: 'rgba(0,0,0,0.6)', color: 'white', padding: '3px 8px', borderRadius: '4px', fontSize: '11px' }}>📷 {product.images.length}</span>}
              </div>
              <div style={{ padding: '12px' }}>
                <p style={{ fontSize: '10px', color: 'var(--text-secondary)', margin: '0 0 2px' }}>{product.brand}</p>
                <h3 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 6px', lineHeight: '1.3' }}>{product.name}</h3>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)', margin: '0 0 6px' }}>{product.description?.substring(0, 50)}...</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                  <span style={{ color: '#fbbf24', fontSize: '12px' }}>★ {product.rating}</span>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>({product.sales} فروش)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                  <span style={{ fontSize: '15px', fontWeight: 700 }}>${product.price}</span>
                  {product.compareAtPrice && <span style={{ fontSize: '11px', color: 'var(--text-muted)', textDecoration: 'line-through' }}>${product.compareAtPrice}</span>}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: product.stock === 0 ? '#ef4444' : '#22c55e' }}>{product.stock === 0 ? 'ناموجود' : `${product.stock} موجود`}</span>
                  <button onClick={() => handleViewProduct(product)} style={{ padding: '5px 10px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '5px', fontSize: '11px', cursor: 'pointer' }}>مشاهده</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Product Modal */}
      {showProductModal && selectedProduct && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowProductModal(false)}>
          <div style={{ background: 'var(--card-bg)', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '700px', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>{editMode ? '✏️ ویرایش محصول' : '📦 جزئیات محصول'}</h2>
              <button onClick={() => { setShowProductModal(false); setEditMode(false); }} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
            </div>

            {editMode ? (
              /* EDIT MODE */
              <div style={{ display: 'grid', gap: '12px' }}>
                <div><label style={labelStyle}>نام محصول *</label><input id="edit-name" defaultValue={selectedProduct.name} style={inputStyle} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div><label style={labelStyle}>SKU *</label><input id="edit-sku" defaultValue={selectedProduct.sku} style={inputStyle} /></div>
                  <div><label style={labelStyle}>دسته‌بندی</label><select id="edit-category" defaultValue={selectedProduct.category} style={inputStyle}>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div><label style={labelStyle}>برند</label><input id="edit-brand" defaultValue={selectedProduct.brand} style={inputStyle} /></div>
                  <div><label style={labelStyle}>وضعیت</label><select id="edit-status" defaultValue={selectedProduct.status} style={inputStyle}><option value="active">فعال</option><option value="draft">پیش‌نویس</option><option value="archived">بایگانی</option></select></div>
                </div>
                <div><label style={labelStyle}>توضیحات</label><textarea id="edit-description" defaultValue={selectedProduct.description} style={{ ...inputStyle, height: '80px', resize: 'vertical' }} /></div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                  <div><label style={labelStyle}>قیمت ($) *</label><input id="edit-price" type="number" defaultValue={selectedProduct.price} style={inputStyle} /></div>
                  <div><label style={labelStyle}>قیمت مقایسه ($)</label><input id="edit-compare-price" type="number" defaultValue={selectedProduct.compareAtPrice || ''} style={inputStyle} /></div>
                  <div><label style={labelStyle}>موجودی *</label><input id="edit-stock" type="number" defaultValue={selectedProduct.stock} style={inputStyle} /></div>
                </div>
                
                {/* Images in edit mode */}
                <div>
                  <label style={labelStyle}>تصاویر ({editImages.length} از ۱۰)</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: '8px', marginBottom: '8px' }}>
                    {editImages.map(img => (
                      <div key={img.id} style={{ position: 'relative', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                        <img src={img.url} alt={img.name} style={{ width: '100%', height: '80px', objectFit: 'cover' }} />
                        <button onClick={() => removeImage(img.id, 'edit')} style={{ position: 'absolute', top: '2px', right: '2px', width: '20px', height: '20px', borderRadius: '50%', background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer', fontSize: '10px' }}>×</button>
                      </div>
                    ))}
                    {editImages.length < 10 && <div onClick={() => editFileInputRef.current?.click()} style={{ height: '80px', border: '2px dashed var(--border)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '20px', color: '#9ca3af' }}>+</div>}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <button onClick={handleSaveEdit} style={{ flex: 1, padding: '10px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>💾 ذخیره تغییرات</button>
                  <button onClick={() => setEditMode(false)} style={{ flex: 1, padding: '10px', background: 'var(--hover-bg)', color: 'var(--text)', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>انصراف</button>
                </div>
              </div>
            ) : (
              /* VIEW MODE */
              <div>
                <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                  <div style={{ width: '150px', height: '150px', borderRadius: '8px', overflow: 'hidden', background: 'var(--table-header-bg)', flexShrink: 0 }}>
                    {selectedProduct.images.length > 0 ? <img src={selectedProduct.images[0].url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '48px' }}>📦</div>}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{ margin: '0 0 4px' }}>{selectedProduct.name}</h3>
                    <p style={{ margin: '0 0 4px', color: 'var(--text-secondary)', fontSize: '13px' }}>{selectedProduct.brand} | {selectedProduct.category}</p>
                    <p style={{ margin: '0 0 8px', fontSize: '12px', color: 'var(--text-muted)' }}>SKU: {selectedProduct.sku}</p>
                    <p style={{ margin: '0 0 8px', color: 'var(--text-secondary)', fontSize: '13px' }}>{selectedProduct.description}</p>
                    <p style={{ margin: 0, fontSize: '20px', fontWeight: 700 }}>${selectedProduct.price}</p>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '16px' }}>
                  {[{ l: 'موجودی', v: selectedProduct.stock, c: selectedProduct.stock === 0 ? '#ef4444' : '#22c55e' }, { l: 'فروش', v: selectedProduct.sales, c: '#0f172a' }, { l: 'امتیاز', v: `★ ${selectedProduct.rating}`, c: '#fbbf24' }, { l: 'تصاویر', v: selectedProduct.images.length, c: '#8b5cf6' }].map((s, i) => (
                    <div key={i} style={{ padding: '10px', background: 'var(--table-header-bg)', borderRadius: '6px', textAlign: 'center' }}>
                      <p style={{ margin: 0, fontSize: '11px', color: 'var(--text-secondary)' }}>{s.l}</p>
                      <p style={{ margin: '4px 0 0', fontWeight: 700, color: s.c }}>{s.v}</p>
                    </div>
                  ))}
                </div>

                {/* Images preview */}
                {selectedProduct.images.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <p style={{ margin: '0 0 8px', fontWeight: 500, fontSize: '13px' }}>تصاویر:</p>
                    <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px' }}>
                      {selectedProduct.images.map(img => (
                        <img key={img.id} src={img.url} alt={img.name} style={{ width: '100px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid var(--border)' }} />
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e5e7eb' }}>
                  <button onClick={handleEditProduct} style={{ flex: 1, padding: '10px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>✏️ ویرایش</button>
                  <button onClick={() => handleDeleteProduct(selectedProduct.id)} style={{ flex: 1, padding: '10px', background: '#fee2e2', color: '#991b1b', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>🗑️ حذف</button>
                  <button onClick={() => { setShowProductModal(false); setEditMode(false); }} style={{ flex: 1, padding: '10px', background: 'var(--hover-bg)', color: 'var(--text)', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>بستن</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowAddModal(false)}>
          <div style={{ background: 'var(--card-bg)', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>➕ افزودن محصول جدید</h2>
              <button onClick={() => { setShowAddModal(false); setAddModalImages([]); }} style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer' }}>×</button>
            </div>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div><label style={labelStyle}>نام محصول *</label><input id="add-name" style={inputStyle} placeholder="نام محصول" /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label style={labelStyle}>SKU *</label><input id="add-sku" style={inputStyle} placeholder="کد محصول" /></div>
                <div><label style={labelStyle}>دسته‌بندی *</label><select id="add-category" style={inputStyle}><option value="">انتخاب</option>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label style={labelStyle}>برند</label><input id="add-brand" style={inputStyle} placeholder="نام برند" /></div>
                <div><label style={labelStyle}>قیمت ($) *</label><input id="add-price" type="number" style={inputStyle} placeholder="0" /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label style={labelStyle}>موجودی *</label><input id="add-stock" type="number" style={inputStyle} placeholder="0" /></div>
                <div><label style={labelStyle}>قیمت مقایسه ($)</label><input id="add-compare-price" type="number" style={inputStyle} placeholder="اختیاری" /></div>
              </div>
              <div><label style={labelStyle}>توضیحات</label><textarea id="add-description" style={{ ...inputStyle, height: '80px', resize: 'vertical' }} placeholder="توضیحات محصول" /></div>
              
              {/* Image Upload */}
              <div>
                <label style={labelStyle}>تصاویر ({addModalImages.length} از ۱۰)</label>
                {addModalImages.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', gap: '6px', marginBottom: '8px' }}>
                    {addModalImages.map(img => (
                      <div key={img.id} style={{ position: 'relative', borderRadius: '6px', overflow: 'hidden', border: '1px solid var(--border)' }}>
                        <img src={img.url} alt="" style={{ width: '100%', height: '70px', objectFit: 'cover' }} />
                        <button onClick={() => removeImage(img.id, 'add')} style={{ position: 'absolute', top: '2px', right: '2px', width: '18px', height: '18px', borderRadius: '50%', background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer', fontSize: '10px' }}>×</button>
                      </div>
                    ))}
                  </div>
                )}
                {addModalImages.length < 10 && <div onClick={() => addFileInputRef.current?.click()} style={{ border: '2px dashed var(--border)', borderRadius: '8px', padding: '16px', textAlign: 'center', cursor: 'pointer' }}><span style={{ fontSize: '24px' }}>📷</span><p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '12px' }}>کلیک کنید تا تصویر انتخاب کنید</p></div>}
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button onClick={handleAddProduct} style={{ flex: 1, padding: '10px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>✅ ذخیره</button>
                <button onClick={() => { setShowAddModal(false); setAddModalImages([]); }} style={{ flex: 1, padding: '10px', background: 'var(--hover-bg)', color: 'var(--text)', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>انصراف</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const labelStyle = { display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500, color: 'var(--text)' };
const inputStyle = { width: '100%', padding: '8px 10px', border: '1px solid var(--border)', borderRadius: '6px', fontSize: '13px', outline: 'none' };
