'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatINR } from '@/lib/utils';
import { Order } from '@/lib/types';
import {
  Search,
  CheckCircle,
  Truck,
  RotateCcw,
  Clock,
  Eye,
  Edit2,
  X,
  ExternalLink,
  ChevronDown,
} from 'lucide-react';

const STATUS_LIST = [
  'ALL',
  'PENDING',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
  'REFUNDED',
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  // Edit status modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [newTracking, setNewTracking] = useState('');
  const [newCarrier, setNewCarrier] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (search) params.set('search', search);

      const res = await fetch(`/api/orders?${params.toString()}`);
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadOrders();
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/orders/${selectedOrder.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          trackingNumber: newTracking,
          carrier: newCarrier,
        }),
      });

      if (res.ok) {
        setSelectedOrder(null);
        loadOrders();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsUpdating(false);
    }
  };

  const openStatusModal = (ord: Order) => {
    setSelectedOrder(ord);
    setNewStatus(ord.status);
    setNewTracking(ord.trackingNumber || '');
    setNewCarrier(ord.carrier || 'Bespoke Express Courier');
  };

  return (
    <div className="p-6 sm:p-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#242424] gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-megaLuxury uppercase text-[#C5A46D] block mb-1">
            Fulfillment Atelier
          </span>
          <h1 className="font-serif text-3xl text-[#F5F0E8] uppercase tracking-wide font-light">
            Client Consignments ({orders.length})
          </h1>
        </div>
      </div>

      {/* Filter Chips & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full bg-[#141414] border border-[#2B2B2B] px-3.5 py-2">
          <Search className="w-4 h-4 text-[#C5A46D]" />
          <input
            type="text"
            placeholder="Search order number, client name, email, tracking..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent w-full text-xs text-[#F5F0E8] focus:outline-none"
          />
          <button type="submit" className="text-[10px] uppercase font-mono text-[#C5A46D] hover:underline">
            Search
          </button>
        </form>

        <div className="flex items-center gap-2 overflow-x-auto text-[10px] uppercase tracking-wider font-mono">
          {STATUS_LIST.slice(0, 6).map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 border transition-all ${
                statusFilter === st
                  ? 'bg-[#C5A46D] text-black border-[#C5A46D] font-bold'
                  : 'bg-[#141414] text-[#A8A29A] border-[#2A2A2A] hover:border-[#444]'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#121212] border border-[#2B2B2B] overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-[#242424] text-[#C5A46D] font-mono text-[10px] uppercase">
              <th className="py-3 px-4">Order Ref</th>
              <th className="py-3 px-4">Patron Details</th>
              <th className="py-3 px-4">Creations Ordered</th>
              <th className="py-3 px-4">Consignment Total</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Tracking Code</th>
              <th className="py-3 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1C1C1C]">
            {orders.map((ord) => (
              <tr key={ord.id} className="hover:bg-[#171717]">
                <td className="py-3 px-4 font-mono font-bold text-[#F5F0E8]">
                  <Link
                    href={`/order-confirmation/${ord.orderNumber}`}
                    className="hover:text-[#C5A46D] flex items-center gap-1"
                  >
                    {ord.orderNumber}
                    <ExternalLink className="w-3 h-3 text-[#777]" />
                  </Link>
                </td>
                <td className="py-3 px-4">
                  <p className="font-serif text-xs text-[#F5F0E8] font-medium">{ord.customerName}</p>
                  <p className="text-[10px] text-[#A8A29A] font-mono">{ord.customerEmail}</p>
                  <p className="text-[10px] text-[#777] font-mono">{ord.customerPhone}</p>
                </td>
                <td className="py-3 px-4">
                  <div className="space-y-1">
                    {ord.items?.map((it) => (
                      <p key={it.id} className="text-[11px] text-[#A8A29A] truncate max-w-xs">
                        • {it.quantity}x {it.productName} ({it.size})
                      </p>
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4 font-sans font-medium text-[#C5A46D]">
                  {formatINR(ord.total)}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`inline-block px-2 py-0.5 text-[9px] uppercase tracking-wider font-bold ${
                      ord.status === 'DELIVERED'
                        ? 'bg-green-950 text-green-300 border border-green-800'
                        : ord.status === 'CANCELLED' || ord.status === 'REFUNDED'
                        ? 'bg-red-950 text-red-300 border border-red-800'
                        : 'bg-[#C5A46D]/15 text-[#C5A46D] border border-[#C5A46D]/30'
                    }`}
                  >
                    {ord.status}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-[10px] text-[#A8A29A]">
                  {ord.trackingNumber || 'Awaiting dispatch'}
                </td>
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => openStatusModal(ord)}
                    className="px-3 py-1.5 bg-[#222] hover:bg-[#C5A46D] hover:text-black border border-[#3A3A3A] text-[10px] uppercase tracking-wider transition-colors"
                  >
                    Update Consignment
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Update Consignment Status Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121212] border border-[#34312D] text-[#F5F0E8] w-full max-w-md p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#262626] pb-3">
              <h3 className="font-serif text-lg tracking-wide uppercase">
                Update #{selectedOrder.orderNumber}
              </h3>
              <button onClick={() => setSelectedOrder(null)} className="text-[#A8A29A] hover:text-[#C5A46D]">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">
                  Consignment Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-[#1A1A1A] border border-[#34312D] px-3 py-2 text-xs text-[#F5F0E8]"
                >
                  <option value="CONFIRMED">CONFIRMED (Payment Verified)</option>
                  <option value="PROCESSING">PROCESSING (In Atelier Tailoring)</option>
                  <option value="SHIPPED">SHIPPED (Handed to Express Courier)</option>
                  <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                  <option value="DELIVERED">DELIVERED</option>
                  <option value="CANCELLED">CANCELLED</option>
                  <option value="REFUNDED">REFUNDED</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">
                  Consignment Tracking Identifier
                </label>
                <input
                  type="text"
                  value={newTracking}
                  onChange={(e) => setNewTracking(e.target.value)}
                  placeholder="BM-EXP-902184"
                  className="w-full bg-[#1A1A1A] border border-[#34312D] px-3 py-2 text-xs font-mono text-[#F5F0E8]"
                />
              </div>

              <div>
                <label className="block text-[11px] uppercase tracking-wider text-[#A8A29A] mb-1">
                  Assigned Carrier
                </label>
                <input
                  type="text"
                  value={newCarrier}
                  onChange={(e) => setNewCarrier(e.target.value)}
                  placeholder="Bespoke White-Glove VIP Express"
                  className="w-full bg-[#1A1A1A] border border-[#34312D] px-3 py-2 text-xs text-[#F5F0E8]"
                />
              </div>

              <div className="pt-4 border-t border-[#262626] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border border-[#34312D] text-xs uppercase tracking-widest text-[#A8A29A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-5 py-2 bg-[#C5A46D] text-black text-xs uppercase tracking-widest font-semibold hover:bg-[#E0C18A]"
                >
                  {isUpdating ? 'Saving...' : 'Confirm Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

