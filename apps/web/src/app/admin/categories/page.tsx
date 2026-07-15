'use client';

import { useState, useRef, useEffect } from 'react';
import { Icons } from '../../components/Icons';
import { api } from '../../lib/api';

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

  const refreshCategories = async () => {
    try {
      const data = await api.getCategories() as any[];
      const mapped = data.map((c: any) => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        description: c.description || '',
        productCount: c._count?.products || 0,
        image: c.image ? { id: '1', url: c.image, name: 'category.jpg' } : null,
        parentId: c.parentId,
        status: c.status || 'active',
      }));
      setCategories(mapped);
    } catch (e) { console.error(e); }
  };

  // Load from API
  useEffect(() => {
    refreshCategories();
  }, []);

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

  const handleAddCategory = async () => {
    const name = (document.getElementById('add-name') as HTMLInputElement)?.value;
    const slug = (document.getElementById('add-slug') as HTMLInputElement)?.value;
    const description = (document.getElementById('add-description') as HTMLTextAreaElement)?.value;

    if (!name) { alert('نام دسته‌بندی ضروری است'); return; }

    try {
      await api.createCategory({ name, slug: slug || name.toLowerCase().replace(/\s+/g, '-'), description: description || '', image: addImage?.url || null, status: 'active' });
      await refreshCategories();
      setAddImage(null); setShowAddModal(false);
    } catch (e) { alert('خطا در اضافه کردن'); }
  };

  const handleEditCategory = async () => {
    if (!selectedCategory) return;
    const name = (document.getElementById('edit-name') as HTMLInputElement)?.value;
    const slug = (document.getElementById('edit-slug') as HTMLInputElement)?.value;
    const description = (document.getElementById('edit-description') as HTMLTextAreaElement)?.value;
    const status = (document.getElementById('edit-status') as HTMLSelectElement)?.value;
    if (!name) { alert('نام ضروری است'); return; }
    try {
      await api.updateCategory(selectedCategory.id, { name, slug: slug || name.toLowerCase().replace(/\s+/g, '-'), description: description || '', image: editImage?.url || selectedCategory.image?.url || null, status });
      await refreshCategories();
      setEditImage(null); setShowEditModal(false);
    } catch (e) { alert('خطا در بروزرسانی'); }
  };

  const handleDeleteCategory = async (id: string) => {
    const cat = categories.find(c => c.id === id);
    if (cat && cat.productCount > 0) { alert(`"${cat.name}" محصول دارد`); return; }
    if (confirm('آیا از حذف اطمینان دارید؟')) {
      try { await api.deleteCategory(id); await refreshCategories(); } catch (e) { alert('خطا'); }
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
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>مدیریت دسته‌بندی‌ها</h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>{filteredCategories.length} دسته‌بندی</p>
        </div>
        <button onClick={() => { setShowAddModal(true); setUploadContext('add'); }} style={{ padding: '10px 20px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}>{<Icons.Plus size={14} />} افزودن دسته‌بندی</button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '24px' }}>
        <input type="text" placeholder="جستجو در دسته‌بندی‌ها..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} style={{ width: '300px', padding: '10px 16px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', outline: 'none' }} />
      </div>

      {/* Categories Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
        {filteredCategories.map((category) => (
          <div key={category.id} style={{ background: 'var(--card-bg)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ height: '150px', background: category.image ? `url(${category.image.url}) center/cover` : 'var(--table-header-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {!category.image && <span style={{ fontSize: '48px', opacity: 0.3 }}>{<Icons.Folder size={48} />}</span>}
              <span style={{ position: 'absolute', top: '10px', left: '10px', padding: '4px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 500, background: category.status === 'active' ? '#dcfce7' : '#fee2e2', color: category.status === 'active' ? '#166534' : '#991b1b' }}>
                {category.status === 'active' ? 'فعال' : 'غیرفعال'}
              </span>
            </div>
            <div style={{ padding: '16px' }}>
              <h3 style={{ margin: '0 0 4px', fontSize: '16px', fontWeight: 600 }}>{category.name}</h3>
              <p style={{ margin: '0 0 4px', fontSize: '12px', color: 'var(--text-muted)' }}>/ {category.slug}</p>
              @if (category.description) {
                <p style={{ margin: '0 0 8px', fontSize: '13px', color: 'var(--text-secondary)' }}>{category.description}</p>
              }
              <p style={{ margin: '0 0 12px', fontSize: '13px', color: '#2563eb' }}>{<Icons.Package size={14} />} {category.productCount} محصول</p>
              <div style={{ display: 'flex', gap: '6px' }}>
                <button onClick={() => openEditModal(category)} style={{ flex: 1, padding: '8px', background: 'var(--hover-bg)', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 500 }}>{<Icons.Edit size={14} />} ویرایش</button>
                <button onClick={() => handleDeleteCategory(category.id)} style={{ flex: 1, padding: '8px', background: '#fee2e2', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: 500, color: '#991b1b' }}>{<Icons.Trash size={14} />} حذف</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowAddModal(false)}>
          <div style={{ background: 'var(--card-bg)', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 600 }}>{<Icons.Plus size={14} />} افزودن دسته‌بندی جدید</h2>
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
                <button onClick={() => { setUploadContext('add'); fileInputRef.current?.click(); }} style={{ width: '100%', padding: '12px', border: '2px dashed var(--border)', borderRadius: '8px', background: 'var(--card-bg)', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  {<Icons.Image size={14} />} {addImage ? 'تغییر تصویر' : 'انتخاب تصویر'}
                </button>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button onClick={handleAddCategory} style={{ flex: 1, padding: '10px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>{<Icons.Check size={14} />} ذخیره</button>
                <button onClick={() => { setShowAddModal(false); setAddImage(null); }} style={{ flex: 1, padding: '10px', background: 'var(--hover-bg)', color: 'var(--text)', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>انصراف</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedCategory && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowEditModal(false)}>
          <div style={{ background: 'var(--card-bg)', borderRadius: '12px', padding: '24px', width: '100%', maxWidth: '500px' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ margin: '0 0 16px', fontSize: '18px', fontWeight: 600 }}>{<Icons.Edit size={14} />} ویرایش دسته‌بندی</h2>
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
                <button onClick={() => { setUploadContext('edit'); fileInputRef.current?.click(); }} style={{ width: '100%', padding: '12px', border: '2px dashed var(--border)', borderRadius: '8px', background: 'var(--card-bg)', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                  {<Icons.Image size={14} />} {editImage ? 'تغییر تصویر' : 'انتخاب تصویر'}
                </button>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <button onClick={handleEditCategory} style={{ flex: 1, padding: '10px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>{<Icons.Save size={14} />} ذخیره تغییرات</button>
                <button onClick={() => { setShowEditModal(false); setEditImage(null); }} style={{ flex: 1, padding: '10px', background: 'var(--hover-bg)', color: 'var(--text)', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>انصراف</button>
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
