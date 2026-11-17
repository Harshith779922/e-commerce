'use client';

import React, { useState, useEffect } from 'react';
import { Product, Category, Collection } from '@/lib/types';
import { formatINR } from '@/lib/utils';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  Star,
  Sparkles,
  RefreshCw,
  Eye,
} from 'lucide-react';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditingProduct, setCurrentEditingProduct] = useState<Product | null>(null);

  // Form State for Add / Edit
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    price: '',
    salePrice: '',
    gender: 'UNISEX',
    categoryId: '',
    collectionId: '',
    isFeatured: false,
    isNewArrival: true,
    shortDescription: '',
    description: '',
    imageUrl: '',
    size: '48 / M',
    colorName: 'Obsidian Black',
    colorHex: '#0B0B0B',
    stockQuantity: '10',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes, colRes] = await Promise.all([
        fetch('/api/products?sort=newest'),
        fetch('/api/categories'),
        fetch('/api/collections'),
      ]);
      const prodJson = await prodRes.json();
      const catJson = await catRes.json();
      const colJson = await colRes.json();
      setProducts(prodJson.products || []);
      setCategories(catJson.categories || []);
      setCollections(colJson.collections || []);
      if (catJson.categories?.length && !formData.categoryId) {
        setFormData((prev) => ({ ...prev, categoryId: catJson.categories[0].id }));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        name: formData.name,
        sku: formData.sku || `BM-MAN-${Date.now().toString().slice(-4)}`,
        price: parseFloat(formData.price),
        salePrice: formData.salePrice ? parseFloat(formData.salePrice) : null,
        gender: formData.gender,
        categoryId: formData.categoryId || categories[0]?.id,
        collectionId: formData.collectionId || null,
        isFeatured: formData.isFeatured,
        isNewArrival: formData.isNewArrival,
        shortDescription: formData.shortDescription,
        description: formData.description,
        images: [
          {
            url:
              formData.imageUrl ||
              'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1000',
            altText: formData.name,
          },
        ],
        variants: [
          {
            size: formData.size,
            colorName: formData.colorName,
            colorHex: formData.colorHex,
            stockQuantity: parseInt(formData.stockQuantity) || 10,
          },
        ],
      };

      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setIsAddModalOpen(false);
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEditingProduct) return;
    try {
      const res = await fetch(`/api/products/${currentEditingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          price: formData.price,
          salePrice: formData.salePrice,
          isFeatured: formData.isFeatured,
          isNewArrival: formData.isNewArrival,
          shortDescription: formData.shortDescription,
          description: formData.description,
        }),
      });

      if (res.ok) {
        setIsEditModalOpen(false);
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you certain you wish to archive this bespoke creation?')) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        loadData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const openEditModal = (p: Product) => {
    setCurrentEditingProduct(p);
    setFormData({
      name: p.name,
      sku: p.sku,
      price: p.price.toString(),
      salePrice: p.salePrice ? p.salePrice.toString() : '',
      gender: p.gender,
      categoryId: p.categoryId,
      collectionId: p.collectionId || '',
      isFeatured: p.isFeatured,
      isNewArrival: p.isNewArrival,
      shortDescription: p.shortDescription || '',
      description: p.description,
      imageUrl: p.images[0]?.url || '',
      size: p.variants[0]?.size || '48 / M',
      colorName: p.variants[0]?.colorName || 'Obsidian',
      colorHex: p.variants[0]?.colorHex || '#000000',
      stockQuantity: p.variants[0]?.stockQuantity.toString() || '10',
    });
    setIsEditModalOpen(true);
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 sm:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#242424] gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-megaLuxury uppercase text-[#C5A46D] block mb-1">
            Collection Management
          </span>
          <h1 className="font-serif text-3xl text-[#F5F0E8] uppercase tracking-wide font-light">
            Atelier Products ({products.length})
          </h1>
        </div>

        <button
          onClick={() => {
            setFormData({
              name: '',
              sku: `BM-${Date.now().toString().slice(-4)}`,
              price: '',
              salePrice: '',
              gender: 'MEN',
              categoryId: categories[0]?.id || '',
              collectionId: collections[0]?.id || '',
              isFeatured: false,
              isNewArrival: true,
              shortDescription: '',
              description: '',
              imageUrl: '',
              size: '48 / M',
              colorName: 'Obsidian Black',
              colorHex: '#0B0B0B',
              stockQuantity: '10',
            });
            setIsAddModalOpen(true);
          }}
          className="px-5 py-2.5 bg-[#C5A46D] text-black text-xs uppercase tracking-widest font-semibold hover:bg-[#E0C18A] transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Add Atelier Piece
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 max-w-md bg-[#141414] border border-[#2B2B2B] px-3.5 py-2">
        <Search className="w-4 h-4 text-[#C5A46D]" />
        <input
          type="text"
          placeholder="Search by title, SKU..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent w-full text-xs text-[#F5F0E8] focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="bg-[#121212] border border-[#2B2B2B] overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#242424] text-[#C5A46D] font-mono text-[10px] uppercase">
              <th className="py-3 px-4">Creation</th>
              <th className="py-3 px-4">SKU</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">Variants / Stock</th>
              <th className="py-3 px-4">Badges</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C1C1C]">
            {filteredProducts.map((p) => {
              const totalStock = p.variants?.reduce((sum, v) => sum + v.stockQuantity, 0) || 0;
              return (
                <tr key={p.id} className="hover:bg-[#171717]">
                  <td className="py-3 px-4 flex items-center gap-3">
                    <img
                      src={p.images[0]?.url || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=200'}
                      alt={p.name}
                      className="w-10 h-14 object-cover border border-[#333]"
                    />
                    <div>
                      <h4 className="font-serif text-xs text-[#F5F0E8] font-medium">{p.name}</h4>
                      <p className="text-[10px] text-[#A8A29A] uppercase">{p.gender}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px] text-[#A8A29A]">{p.sku}</td>
                  <td className="py-3 px-4 text-[#A8A29A]">{p.category?.name || 'Exclusive'}</td>
                  <td className="py-3 px-4 font-sans font-medium text-[#C5A46D]">
                    {formatINR(p.salePrice || p.price)}
                    {p.salePrice && <span className="line-through text-[#666] text-[10px] ml-1">{formatINR(p.price)}</span>}
                  </td>
                  <td className="py-3 px-4 font-mono text-[11px]">
                    <span className={totalStock <= 5 ? 'text-amber-400 font-bold' : 'text-[#F5F0E8]'}>
                      {totalStock} in stock
                    </span>
                    <span className="text-[10px] text-[#777] block">({p.variants?.length || 0} variants)</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      {p.isFeatured && (
                        <span className="px-1.5 py-0.5 bg-[#C5A46D]/15 text-[#C5A46D] border border-[#C5A46D]/30 text-[9px] uppercase font-mono">
                          Featured
                        </span>
                      )}
                      {p.isNewArrival && (
                        <span className="px-1.5 py-0.5 bg-black text-[#F5F0E8] border border-[#333] text-[9px] uppercase font-mono">
                          New
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 border border-[#333] text-[#A8A29A] hover:text-[#C5A46D] hover:border-[#C5A46D]"
                        title="Edit Creation"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1.5 border border-[#333] text-[#A8A29A] hover:text-red-400 hover:border-red-800"
                        title="Delete Creation"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Modal */}
      {(isAddModalOpen || isEditModalOpen) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121212] border border-[#34312D] text-[#F5F0E8] w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#262626] pb-4">
              <h3 className="font-serif text-xl tracking-wide uppercase">
                {isAddModalOpen ? 'Create New Atelier Piece' : 'Edit Piece Details'}
              </h3>
              <button
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                }}
                className="text-[#A8A29A] hover:text-[#C5A46D]"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form
              onSubmit={isAddModalOpen ? handleCreateProduct : handleUpdateProduct}
              className="space-y-4 text-xs"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">
                    Product Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-[#34312D] px-3 py-2 text-xs text-[#F5F0E8] focus:border-[#C5A46D]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">
                    SKU Code *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-[#34312D] px-3 py-2 text-xs text-[#F5F0E8] font-mono focus:border-[#C5A46D]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">
                    Price (INR) *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-[#34312D] px-3 py-2 text-xs text-[#F5F0E8] focus:border-[#C5A46D]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">
                    Sale Price (Optional)
                  </label>
                  <input
                    type="number"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-[#34312D] px-3 py-2 text-xs text-[#F5F0E8] focus:border-[#C5A46D]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">
                    Gender
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full bg-[#1A1A1A] border border-[#34312D] px-3 py-2 text-xs text-[#F5F0E8] focus:border-[#C5A46D]"
                  >
                    <option value="MEN">MEN</option>
                    <option value="WOMEN">WOMEN</option>
                    <option value="UNISEX">UNISEX</option>
                  </select>
                </div>
              </div>

              {isAddModalOpen && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">
                      Editorial Image URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full bg-[#1A1A1A] border border-[#34312D] px-3 py-2 text-xs text-[#F5F0E8]"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">Initial Size</label>
                      <input
                        type="text"
                        value={formData.size}
                        onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                        className="w-full bg-[#1A1A1A] border border-[#34312D] px-3 py-2 text-xs text-[#F5F0E8]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">Color Name</label>
                      <input
                        type="text"
                        value={formData.colorName}
                        onChange={(e) => setFormData({ ...formData, colorName: e.target.value })}
                        className="w-full bg-[#1A1A1A] border border-[#34312D] px-3 py-2 text-xs text-[#F5F0E8]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">Stock Qty</label>
                      <input
                        type="number"
                        value={formData.stockQuantity}
                        onChange={(e) => setFormData({ ...formData, stockQuantity: e.target.value })}
                        className="w-full bg-[#1A1A1A] border border-[#34312D] px-3 py-2 text-xs text-[#F5F0E8]"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">
                  Short Editorial Subtitle
                </label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-[#34312D] px-3 py-2 text-xs text-[#F5F0E8]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">
                  Full Atelier Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-[#1A1A1A] border border-[#34312D] px-3 py-2 text-xs text-[#F5F0E8]"
                />
              </div>

              <div className="flex gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="accent-[#C5A46D]"
                  />
                  <span>Mark as Featured</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isNewArrival}
                    onChange={(e) => setFormData({ ...formData, isNewArrival: e.target.checked })}
                    className="accent-[#C5A46D]"
                  />
                  <span>Mark as New Arrival</span>
                </label>
              </div>

              <div className="pt-4 border-t border-[#262626] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddModalOpen(false);
                    setIsEditModalOpen(false);
                  }}
                  className="px-5 py-2.5 border border-[#34312D] text-xs uppercase tracking-widest text-[#A8A29A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#C5A46D] text-black text-xs uppercase tracking-widest font-semibold hover:bg-[#E0C18A]"
                >
                  {isAddModalOpen ? 'Create Creation' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

