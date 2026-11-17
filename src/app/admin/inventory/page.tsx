'use client';

import React, { useState, useEffect } from 'react';
import { formatINR } from '@/lib/utils';
import { Boxes, Plus, Minus, Search, AlertTriangle, Check, RefreshCw } from 'lucide-react';

export default function AdminInventoryPage() {
  const [variants, setVariants] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [onlyLowStock, setOnlyLowStock] = useState(false);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadInventory = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/inventory');
      const data = await res.json();
      setVariants(data.variants || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const handleAdjustStock = async (variantId: string, currentQty: number, delta: number) => {
    const nextQty = Math.max(0, currentQty + delta);
    setUpdatingId(variantId);
    try {
      const res = await fetch('/api/admin/inventory', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ variantId, stockQuantity: nextQty }),
      });
      if (res.ok) {
        setVariants((prev) =>
          prev.map((v) => (v.id === variantId ? { ...v, stockQuantity: nextQty } : v))
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = variants.filter((v) => {
    const matchesSearch =
      v.product.name.toLowerCase().includes(search.toLowerCase()) ||
      v.sku.toLowerCase().includes(search.toLowerCase());
    const matchesStock = onlyLowStock ? v.stockQuantity <= 5 : true;
    return matchesSearch && matchesStock;
  });

  return (
    <div className="p-6 sm:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#242424] gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-megaLuxury uppercase text-[#C5A46D] block mb-1">
            Warehouse Logistics
          </span>
          <h1 className="font-serif text-3xl text-[#F5F0E8] uppercase tracking-wide font-light">
            Variant Inventory ({variants.length})
          </h1>
        </div>

        <button
          onClick={loadInventory}
          className="flex items-center gap-2 px-4 py-2 border border-[#34312D] text-xs uppercase tracking-widest text-[#A8A29A] hover:text-[#C5A46D]"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Live Stock
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 max-w-md w-full bg-[#141414] border border-[#2B2B2B] px-3.5 py-2">
          <Search className="w-4 h-4 text-[#C5A46D]" />
          <input
            type="text"
            placeholder="Search piece, variant SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent w-full text-xs text-[#F5F0E8] focus:outline-none"
          />
        </div>

        <label className="flex items-center gap-2 text-xs text-[#A8A29A] cursor-pointer">
          <input
            type="checkbox"
            checked={onlyLowStock}
            onChange={(e) => setOnlyLowStock(e.target.checked)}
            className="accent-[#C5A46D]"
          />
          <span className="flex items-center gap-1.5 text-amber-400">
            <AlertTriangle className="w-3.5 h-3.5" /> Show Low Stock Only (&le; 5 units)
          </span>
        </label>
      </div>

      {/* Inventory Table */}
      <div className="bg-[#121212] border border-[#2B2B2B] overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#242424] text-[#C5A46D] font-mono text-[10px] uppercase">
              <th className="py-3 px-4">Creation Name</th>
              <th className="py-3 px-4">Variant SKU</th>
              <th className="py-3 px-4">Sartorial Size</th>
              <th className="py-3 px-4">Color Hue</th>
              <th className="py-3 px-4">Stock Level</th>
              <th className="py-3 px-4 text-right">Quick Stock Adjustment</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C1C1C]">
            {filtered.map((v) => (
              <tr key={v.id} className="hover:bg-[#171717]">
                <td className="py-3 px-4">
                  <p className="font-serif text-xs text-[#F5F0E8] font-medium">{v.product.name}</p>
                  <p className="text-[10px] text-[#A8A29A]">{v.product.category?.name}</p>
                </td>
                <td className="py-3 px-4 font-mono text-[11px] text-[#A8A29A]">{v.sku}</td>
                <td className="py-3 px-4 font-mono text-[11px] text-[#F5F0E8] font-bold">{v.size}</td>
                <td className="py-3 px-4 flex items-center gap-2">
                  <span
                    className="w-3.5 h-3.5 rounded-full border border-[#444] inline-block"
                    style={{ backgroundColor: v.colorHex || '#111' }}
                  />
                  <span>{v.colorName}</span>
                </td>
                <td className="py-3 px-4 font-mono text-xs">
                  <span
                    className={`inline-block px-2 py-0.5 font-bold ${
                      v.stockQuantity <= 5
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'text-[#F5F0E8]'
                    }`}
                  >
                    {v.stockQuantity} units
                  </span>
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => handleAdjustStock(v.id, v.stockQuantity, -1)}
                      disabled={updatingId === v.id || v.stockQuantity <= 0}
                      className="p-1 border border-[#333] hover:border-[#C5A46D] text-[#A8A29A] hover:text-[#F5F0E8] disabled:opacity-30"
                      title="Deduct 1"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleAdjustStock(v.id, v.stockQuantity, 1)}
                      disabled={updatingId === v.id}
                      className="p-1 border border-[#333] hover:border-[#C5A46D] text-[#A8A29A] hover:text-[#F5F0E8]"
                      title="Add 1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleAdjustStock(v.id, v.stockQuantity, 5)}
                      disabled={updatingId === v.id}
                      className="px-2 py-1 border border-[#333] hover:border-[#C5A46D] text-[10px] font-mono text-[#C5A46D]"
                      title="Add 5"
                    >
                      +5
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

