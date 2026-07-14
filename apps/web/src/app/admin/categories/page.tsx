'use client';

import { useState, useRef } from 'react';

interface CategoryImage {
  id: string;
  url: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  productCount: number;
  image: CategoryImage | null;
  parentId: string | null;
  status: 'active' | 'inactive';
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [editImage, setEditImage] = useState<CategoryImage | null>(null);
  const [addImage, setAddImage] = useState<CategoryImage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadContext, setUploadContext] = useState<'add' | 'edit'>('add');

  // Demo categories
  useState(() => {
    const demoCategories: Category[] = [
      { id: '1', name: 'موبایل', slug: 'mobile', description: 'گوشی‌های هوشمند و تلفن‌های همراه', productCount: 125, image: { id: '1', url: 'https://picsum.photos/100/100?random=10', name: 'mobile.jpg' }, parentId: null, status: 'active' },
      { id: '2', name: 'لپتاپ', slug: 'laptop', description: 'لپتاپ و نوت‌بوک', productCount: 89, image: { id: '2', url: 'https://picsum.photos/100/100?random=11', name: 'laptop.jpg' }, parentId: null, status: 'active' },
      { id: '3', name: 'هدفون', slug: 'headphone', description: 'هدفون و هندزفری', productCount: 156, image: { id: '3', url: 'https://picsum.photos/100/100?random=12', name: 'headphone.jpg' }, parentId: null, status: 'active' },
      { id: '4', name: 'تبلت', slug: 'tablet', description: 'تبلت و آیپد', productCount: 67, image: { id: '4', url: 'https://picsum.photos/100/100?random=13', name: 'tablet.jpg' }, parentId: null, status: 'active' },
      { id: '5', name: 'کفش', slug: 'shoes', description: 'کفش‌های ورزشی و روزمره', productCount: 234, image: { id: '5', url: 'https://picsum.photos/100/100?random=14', name: 'shoes.jpg' }, parentId: null, status: 'active' },
      { id: '6', name: 'دوربین', slug: 'camera', description: 'دوربین عکاسی و فیلمبرداری', productCount: 45, image: null, parentId: null, status: 'active' },
      { id: '7', name: 'خانه', slug: 'home', description: 'لوازم خانگی', productCount: 178, image: { id: '7', url: 'https://picsum.photos/100/100?random=15', name: 'home.jpg' }, parentId: null, status: 'active' },
      { id: '8', name: 'گیمینگ', slug: 'gaming', description: 'کنسول و بازی', productCount: 92, image: { id: '8', url: 'https://picsum.photos/100/100?random=16', name: 'gaming.jpg' }, parentId: null, status: 'active' },
    ];
    setCategories(demoCategories);
  });

  const filteredCategories = categories.filter(c => 
    c.name.includes(searchQuery) || c.slug.includes(searchQuery)
  );

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const newImage: CategoryImage = {
        id: Date.now().toString(),
        url: event.target?.result as string,
        name: file.name,
      };
      if (uploadContext === 'edit') setEditImage(newImage);
      else setAddImage(newImage);
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddCategory = () => {
    const name = (document.getElementById('add-name') as HTMLInputElement)?.value;
    const slug = (document.getElementById('add-slug') as HTMLInputElement)?.value;
    const description = (document.getElementById('add-description') as HTMLTextAreaElement)?.value;

    if (!name) { alert('نام دسته‌بندی ضروری است'); return; }

    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
      description: description || '',
      productCount: 0,
      image: addImage,
      parentId: null,
      status: 'active',
    };

    setCategories([newCategory, ...categories]);
    setAddImage(null);
    setShowAddModal(false);
    alert('دسته‌بندی با موفقیت اضافه شد!');
  };

  const handleEditCategory = () => {
    if (!selectedCategory) return;

    const name = (document.getElementById('edit-name') as HTMLInputElement)?.value;
    const slug = (document.getElementById('edit-slug') as HTMLInputElement)?.value;
    const description = (document.getElementById('edit-description') as HTMLTextAreaElement)?.value;
    const status = (document.getElementById('edit-status') as HTMLSelectElement)?.value;

    if (!name) { alert('نام دسته‌بندی ضوری است'); return; }

    setCategories(categories.map(c => 
      c.id === selectedCategory.id 
        ? { ...c, name, slug: slug || name.toLowerCase().replace(/\s+/g, '-'), description, status: status as Category['status'], image: editImage || c.image }
        : c
    ));
    setEditImage(null);
    setShowEditModal(false);
  };

  const handleDeleteCategory = (id: string) => {
    const cat = categories.find(c => c.id === id);
    if (cat && cat.productCount > 0) {
      alert(`امکان حذف دسته‌بندی "${cat.name}" وجود ندارد چون ${cat.productCount} محصول دارد`);
      return;
    }
    if (confirm('آیا از حذف این دسته‌بندی اطمینان دارید؟')) {
      setCategories(categories.filter(c => c.id !== id));
    }
  };

  const openEditModal = (category: Category) => {
    setSelectedCategory(category);
    setEditImage(category.image);
    setShowEditModal(true);
  };

  return (
    <div style={{ padding: '24px' }}>
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#0f172a', margin: 0 }}>مدیریت دسته‌بندی‌ها</h1>
          <p style={{ color: '#64748b', marginTop: '4px' }}>{filteredCategories.length} دسته‌بندی</p>
        </div>
        <button onClick={() => { setShowAddModal(true); setUploadContext('add'); }} style={{ padding: '10px 20px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>➕ افزودن دسته‌بندی</button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '24px' }}>
        <input type="text" placeholder="جستجو در دسته‌بندی‌ها..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '300px', padding: '10px 16px', border: '1px solid #e5e7eb', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
      </div>

      {/* Categories Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {filteredCategories.map((category) => (
          <div key={category.id} style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', border: '1px solid #e5e7eb', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ height: '150px', background: category.image ? `url(${category.image.url}) center/cover` : '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {!category.image && <span style={{ fontSize: '48px', opacity: 0.3 }}>📁</span>}
              <span style={{ position: 'absolute', top: '10px', left: '10px', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 500, background: category.status === 'active' ? '#dcfce7' : '#fee2e2', color: category.status === 'active' ? '#166534' : '#991b1b' }}>
                {category.status === 'active' ? 'فعال' : 'غیرفعال'}
              </span>
            </div>
            <div style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 600 }}>{category.name}</h3>
              <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#94a3b8' }}>/ {category.slug}</p>
              @if (category.description) {
                <p style={{ margin: '0 0 8px', fontSize: '13px', color: '#64748b' }}>{category.description}</p>
              }
              <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#2563eb' }}>📦 {category.productCount} محصول</p>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => openEditModal(category)} style={{ flex: 1, padding: '8px', background: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 500 }}>✏️ ویرایش</button>
                <button onClick={() => handleDeleteCategory(category.id)} style={{ flex: 1, padding: '8px', background: '#fee2e2', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 500, color: '#991b1b' }}>🗑️ حذف</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowAddModal(false)}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 600 }}>➕ افزودن دسته‌بندی جدید</h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div><label style={labelStyle}>نام دسته‌بندی *</label><input id="add-name" style={inputStyle} placeholder="نام دسته‌بندی" /></div>
              <div><label style={labelStyle}>اسلاگ (اختیاری)</label><input id="add-slug" style={inputStyle} placeholder="category-slug" /></div>
              <div><label style={labelStyle}>توضیحات</label><textarea id="add-description" style={{ ...inputStyle, height: '80px', resize: 'vertical' }} placeholder="توضیحات دسته‌بندی" /></div>
              
              <div>
                <label style={labelStyle}>تصویر دسته‌بندی</label>
                {addImage && (
                  <div style={{ position: 'relative', marginBottom: '8px' }}>
                    <img src={addImage.url} alt="" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />
                    <button onClick={() => setAddImage(null)} style={{ position: 'absolute', top: '8px', right: '8px', width: '28px', height: '28px', borderRadius: '50%', background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer', fontSize: '14px' }}>×</button>
                  </div>
                )}
                <button onClick={() => { setUploadContext('add'); fileInputRef.current?.click(); }} style={{ width: '100%', padding: '12px', border: '2px dashed #d1d5db', borderRadius: '8px', background: 'white', cursor: 'pointer', color: '#64748b' }}>
                  📷 {addImage ? 'تغییر تصویر' : 'انتخاب تصویر'}
                </button>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button onClick={handleAddCategory} style={{ flex: 1, padding: '10px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>✅ ذخیره</button>
                <button onClick={() => { setShowAddModal(false); setAddImage(null); }} style={{ flex: 1, padding: '10px', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>انصراف</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedCategory && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowEditModal(false)}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 600 }}>✏️ ویرایش دسته‌بندی</h2>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div><label style={labelStyle}>نام دسته‌بندی *</label><input id="edit-name" defaultValue={selectedCategory.name} style={inputStyle} /></div>
              <div><label style={labelStyle}>اسلاگ</label><input id="edit-slug" defaultValue={selectedCategory.slug} style={inputStyle} /></div>
              <div><label style={labelStyle}>توضیحات</label><textarea id="edit-description" defaultValue={selectedCategory.description} style={{ ...inputStyle, height: '80px', resize: 'vertical' }} /></div>
              <div><label style={labelStyle}>وضعیت</label><select id="edit-status" defaultValue={selectedCategory.status} style={inputStyle}><option value="active">فعال</option><option value="inactive">غیرفعال</option></select></div>
              
              <div>
                <label style={labelStyle}>تصویر دسته‌بندی</label>
                {editImage && (
                  <div style={{ position: 'relative', marginBottom: '8px' }}>
                    <img src={editImage.url} alt="" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }} />
                    <button onClick={() => setEditImage(null)} style={{ position: 'absolute', top: '8px', right: '8px', width: '28px', height: '28px', borderRadius: '50%', background: '#ef4444', color: 'white', border: 'none', cursor: 'pointer', fontSize: '14px' }}>×</button>
                  </div>
                )}
                <button onClick={() => { setUploadContext('edit'); fileInputRef.current?.click(); }} style={{ width: '100%', padding: '12px', border: '2px dashed #d1d5db', borderRadius: '8px', background: 'white', cursor: 'pointer', color: '#64748b' }}>
                  📷 {editImage ? 'تغییر تصویر' : 'انتخاب تصویر'}
                </button>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button onClick={handleEditCategory} style={{ flex: 1, padding: '10px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>💾 ذخیره تغییرات</button>
                <button onClick={() => { setShowEditModal(false); setEditImage(null); }} style={{ flex: 1, padding: '10px', background: '#e5e7eb', color: '#374151', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>انصراف</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const labelStyle = { display: 'block', marginBottom: '4px', fontSize: '13px', fontWeight: 500, color: '#374151' };
const inputStyle = { width: '100%', padding: '8px 10px', border: '1px solid #e5e7eb', borderRadius: '6px', fontSize: '13px', outline: 'none' };
