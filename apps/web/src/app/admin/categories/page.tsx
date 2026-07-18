'use client';

import { useState, useRef, useEffect } from 'react';
import { Icons } from '../../components/Icons';
import { useNotification } from '../../lib/notifications';
import { api } from '../../lib/api';

interface Category { id: string; name: string; slug: string; description: string; productCount: number; image: string; parentId: string | null; status: string; }

export default function CategoriesPage() {
  const notify = useNotification();
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [editImage, setEditImage] = useState<string | null>(null);
  const [addImage, setAddImage] = useState<string | null>(null);
  const [addParentId, setAddParentId] = useState<string>('');
  const [editParentId, setEditParentId] = useState<string>('');
  const [expandedParents, setExpandedParents] = useState<Record<string, boolean>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshCategories = async () => {
    try {
      const data = await api.getCategories() as any[];
      const mapped = data.map((c: any) => ({ id: c.id, name: c.name, slug: c.slug, description: c.description || '', productCount: c._count?.products || 0, image: c.image || '', parentId: c.parentId, status: c.status || 'active' }));
      setCategories(mapped);
      const expanded: Record<string, boolean> = {};
      data.forEach((c: any) => { if (!c.parentId) expanded[c.id] = true; });
      setExpandedParents(expanded);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { refreshCategories(); }, []);

  const parents = categories.filter(c => !c.parentId);
  const getChildren = (parentId: string) => categories.filter(c => c.parentId === parentId);
  const filtered = categories.filter(c => c.name.includes(searchQuery) || c.slug.includes(searchQuery));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (fileInputRef.current?.dataset.context === 'edit') setEditImage(event.target?.result as string);
      else setAddImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAddCategory = async () => {
    const name = (document.getElementById('add-name') as HTMLInputElement)?.value;
    const slug = (document.getElementById('add-slug') as HTMLInputElement)?.value;
    const description = (document.getElementById('add-description') as HTMLTextAreaElement)?.value;
    if (!name) { notify.warning('نام ضروری است'); return; }
    try {
      await api.createCategory({ name, slug: slug || name.toLowerCase().replace(/\s+/g, '-'), description: description || '', image: addImage || null, parentId: addParentId || null, status: 'active' });
      await refreshCategories(); setAddImage(null); setAddParentId(''); setShowAddModal(false); notify.success('دسته‌بندی اضافه شد');
    } catch (e) { notify.error('خطا در اضافه کردن'); }
  };

  const handleEditCategory = async () => {
    if (!selectedCategory) return;
    const name = (document.getElementById('edit-name') as HTMLInputElement)?.value;
    const slug = (document.getElementById('edit-slug') as HTMLInputElement)?.value;
    const description = (document.getElementById('edit-description') as HTMLTextAreaElement)?.value;
    const status = (document.getElementById('edit-status') as HTMLSelectElement)?.value;
    if (!name) { notify.warning('نام ضروری است'); return; }
    try {
      await api.updateCategory(selectedCategory.id, { name, slug: slug || name.toLowerCase().replace(/\s+/g, '-'), description: description || '', image: editImage || selectedCategory.image || null, parentId: editParentId || null, status });
      await refreshCategories(); setEditImage(null); setEditParentId(''); setShowEditModal(false); notify.success('بروزرسانی شد');
    } catch (e) { notify.error('خطا'); }
  };

  const handleDeleteCategory = async (id: string) => {
    const children = getChildren(id);
    if (children.length > 0) { notify.warning('ابتدا ساب کتگوری‌ها را حذف کنید'); return; }
    const confirmed = await notify.confirm({ message: 'آیا از حذف اطمینان دارید؟', type: 'danger' });
    if (confirmed) { try { await api.deleteCategory(id); await refreshCategories(); notify.success('حذف شد'); } catch (e) { notify.error('خطا'); } }
  };

  const openEditModal = (cat: Category) => {
    setSelectedCategory(cat); setEditImage(cat.image || null); setEditParentId(cat.parentId || ''); setShowEditModal(true);
  };

  const inputStyle = { width: '100%', padding: '8px 12px', border: '1px solid var(--border)', borderRadius: '8px', fontSize: '14px', background: 'var(--input-bg)', color: 'var(--text)' };
  const labelStyle = { fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: 500 };

  return (
    <div style={{ padding: '24px' }}>
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageUpload} data-context="add" />

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div><h1 style={{ fontSize: '24px', fontWeight: 700, color: 'var(--text)', margin: 0 }}>مدیریت دسته‌بندی‌ها</h1><p style={{ color: 'var(--text-secondary)', marginTop: '4px' }}>{parents.length} دسته اصلی · {filtered.length} کل</p></div>
        <button onClick={() => { setShowAddModal(true); setAddParentId(''); setAddImage(null); }} className="btn btn-success"><Icons.Plus size={14} /> افزودن دسته‌بندی</button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '20px' }}><input type="text" placeholder="جستجو..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="input" style={{ maxWidth: '400px' }} /></div>

      {/* Category Tree */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {parents.length === 0 ? <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>دسته‌بندی‌ای وجود ندارد</p> : (
          parents.filter(c => filtered.includes(c) || getChildren(c.id).some(ch => filtered.includes(ch))).map(parent => {
            const children = getChildren(parent.id);
            const isExpanded = expandedParents[parent.id] !== false;
            return (
              <div key={parent.id} className="card" style={{ padding: '16px' }}>
                {/* Parent Category */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: children.length > 0 && isExpanded ? '12px' : 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                    <button onClick={() => setExpandedParents(prev => ({ ...prev, [parent.id]: !prev[parent.id] }))} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '2px', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0)' }}><Icons.ChevronDown size={16} /></button>
                    <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--hover-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                      {parent.image ? <img src={parent.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Icons.Folder size={20} color="var(--text-muted)" />}
                    </div>
                    <div style={{ flex: 1 }}><h3 style={{ margin: 0, fontSize: '15px', fontWeight: 600 }}>{parent.name}</h3><p style={{ margin: '2px 0 0', fontSize: '12px', color: 'var(--text-muted)' }}>{children.length} ساب کتگوری · {parent.productCount} محصول</p></div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button onClick={() => { setAddParentId(parent.id); setShowAddModal(true); setAddImage(null); }} className="btn btn-primary btn-xs"><Icons.Plus size={12} /> ساب کتگوری</button>
                      <button onClick={() => openEditModal(parent)} className="btn btn-ghost btn-xs"><Icons.Edit size={12} /> ویرایش</button>
                      <button onClick={() => handleDeleteCategory(parent.id)} className="btn btn-danger btn-xs"><Icons.Trash size={12} /> حذف</button>
                    </div>
                  </div>
                </div>

                {/* Subcategories */}
                {children.length > 0 && isExpanded && (
                  <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid var(--border-light)', paddingLeft: '24px' }}>
                    {children.map(sub => (
                      <div key={sub.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--hover-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                            {sub.image ? <img src={sub.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <Icons.Folder size={16} color="var(--text-muted)" />}
                          </div>
                          <div style={{ flex: 1 }}><h4 style={{ margin: 0, fontSize: '14px', fontWeight: 500 }}>{sub.name}</h4><p style={{ margin: '2px 0 0', fontSize: '11px', color: 'var(--text-muted)' }}>{sub.productCount} محصول</p></div>
                        </div>
                        <div style={{ display: 'flex', gap: '4px' }}>
                          <button onClick={() => openEditModal(sub)} className="btn btn-ghost btn-xs"><Icons.Edit size={11} /></button>
                          <button onClick={() => handleDeleteCategory(sub.id)} className="btn btn-danger btn-xs"><Icons.Trash size={11} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}>{addParentId ? 'افزودن ساب کتگوری' : 'افزودن دسته‌بندی'}</h2>
              <button onClick={() => setShowAddModal(false)} className="btn-close"><Icons.X size={20} /></button>
            </div>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div><label style={labelStyle}>نام *</label><input id="add-name" style={inputStyle} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label style={labelStyle}>اسلاگ</label><input id="add-slug" style={inputStyle} placeholder="خودکار" /></div>
                <div><label style={labelStyle}>ساب کتگوری</label><select value={addParentId} onChange={e => setAddParentId(e.target.value)} style={inputStyle}><option value="">ندارد (دسته اصلی)</option>{parents.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
              </div>
              <div><label style={labelStyle}>توضیحات</label><textarea id="add-description" rows={2} style={inputStyle} /></div>
              <div>
                <label style={labelStyle}>تصویر</label>
                {addImage ? <div style={{ position: 'relative' }}><img src={addImage} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }} /><button onClick={() => setAddImage(null)} className="btn-close" style={{ position: 'absolute', top: '4px', right: '4px', background: 'var(--danger)', color: 'white', borderRadius: '50%', width: '24px', height: '24px', fontSize: '12px' }}><Icons.X size={12} /></button></div>
                  : <button onClick={() => fileInputRef.current?.click()} style={{ width: '100%', padding: '16px', border: '2px dashed var(--border)', borderRadius: '8px', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Icons.Upload size={16} /> انتخاب تصویر</button>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button onClick={handleAddCategory} className="btn btn-success" style={{ flex: 1 }}><Icons.Save size={14} /> ذخیره</button>
              <button onClick={() => setShowAddModal(false)} className="btn btn-ghost" style={{ flex: 1 }}>انصراف</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedCategory && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600, margin: 0 }}><Icons.Edit size={14} /> ویرایش {selectedCategory.name}</h2>
              <button onClick={() => setShowEditModal(false)} className="btn-close"><Icons.X size={20} /></button>
            </div>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div><label style={labelStyle}>نام *</label><input id="edit-name" defaultValue={selectedCategory.name} style={inputStyle} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div><label style={labelStyle}>اسلاگ</label><input id="edit-slug" defaultValue={selectedCategory.slug} style={inputStyle} /></div>
                <div><label style={labelStyle}>ساب کتگوری</label><select id="edit-status" value={editParentId} onChange={e => setEditParentId(e.target.value)} style={inputStyle}><option value="">ندارد</option>{parents.filter(p => p.id !== selectedCategory.id).map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
              </div>
              <div><label style={labelStyle}>توضیحات</label><textarea id="edit-description" defaultValue={selectedCategory.description} rows={2} style={inputStyle} /></div>
              <div>
                <label style={labelStyle}>تصویر</label>
                {editImage ? <div style={{ position: 'relative' }}><img src={editImage} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px' }} /><button onClick={() => setEditImage(null)} className="btn-close" style={{ position: 'absolute', top: '4px', right: '4px', background: 'var(--danger)', color: 'white', borderRadius: '50%', width: '24px', height: '24px', fontSize: '12px' }}><Icons.X size={12} /></button></div>
                  : <button onClick={() => fileInputRef.current?.click()} style={{ width: '100%', padding: '16px', border: '2px dashed var(--border)', borderRadius: '8px', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}><Icons.Upload size={16} /> انتخاب تصویر</button>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
              <button onClick={handleEditCategory} className="btn btn-primary" style={{ flex: 1 }}><Icons.Save size={14} /> ذخیره</button>
              <button onClick={() => setShowEditModal(false)} className="btn btn-ghost" style={{ flex: 1 }}>انصراف</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
