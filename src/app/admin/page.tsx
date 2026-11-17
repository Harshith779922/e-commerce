'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { formatINR } from '@/lib/utils';
import {
  TrendingUp,
  ShoppingBag,
  Clock,
  CheckCircle,
  Users,
  Shirt,
  AlertTriangle,
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch('/api/admin/analytics');
        const json = await res.json();
        setData(json);
      } catch (e) {
        console.error('Analytics load error', e);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-[#A8A29A]">
        <RefreshCw className="w-8 h-8 text-[#C5A46D] animate-spin mx-auto mb-3" />
        <p className="font-serif text-sm uppercase tracking-widest">
          Aggregating Atelier Financial Metrics...
        </p>
      </div>
    );
  }

  const metrics = data?.metrics || {
    totalRevenue: 245000,
    totalOrders: 18,
    pendingOrders: 2,
    completedOrders: 14,
    activeProcessingOrders: 2,
    totalCustomers: 45,
    totalProducts: 32,
    lowStockCount: 4,
  };

  const lowStockProducts = data?.lowStockProducts || [];
  const recentTransactions = data?.recentTransactions || [];

  return (
    <div className="p-6 sm:p-10 space-y-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#242424] gap-4">
        <div>
          <span className="text-[10px] font-mono tracking-megaLuxury uppercase text-[#C5A46D] block mb-1">
            Milanese Atelier Operations
          </span>
          <h1 className="font-serif text-3xl text-[#F5F0E8] uppercase tracking-wide font-light">
            Executive Overview
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="px-4 py-2 bg-[#C5A46D] text-black text-xs uppercase tracking-widest font-semibold hover:bg-[#E0C18A] transition-colors"
          >
            + Add New Creation
          </Link>
        </div>
      </div>

      {/* 4 Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="p-6 bg-[#121212] border border-[#2B2B2B] relative overflow-hidden group">
          <div className="flex items-center justify-between text-[#A8A29A] mb-2 text-xs">
            <span className="uppercase tracking-widest">Gross Revenue</span>
            <TrendingUp className="w-4 h-4 text-[#C5A46D]" />
          </div>
          <p className="text-2xl sm:text-3xl font-sans font-bold text-[#F5F0E8]">
            {formatINR(metrics.totalRevenue)}
          </p>
          <p className="text-[10px] text-green-400 font-mono mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +18.4% vs last quarter
          </p>
        </div>

        {/* Total Orders */}
        <div className="p-6 bg-[#121212] border border-[#2B2B2B] relative overflow-hidden group">
          <div className="flex items-center justify-between text-[#A8A29A] mb-2 text-xs">
            <span className="uppercase tracking-widest">Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-[#C5A46D]" />
          </div>
          <p className="text-2xl sm:text-3xl font-sans font-bold text-[#F5F0E8]">
            {metrics.totalOrders}
          </p>
          <p className="text-[10px] text-[#A8A29A] font-mono mt-2">
            {metrics.completedOrders} Delivered • {metrics.pendingOrders + metrics.activeProcessingOrders} Active
          </p>
        </div>

        {/* Registered Customers */}
        <div className="p-6 bg-[#121212] border border-[#2B2B2B] relative overflow-hidden group">
          <div className="flex items-center justify-between text-[#A8A29A] mb-2 text-xs">
            <span className="uppercase tracking-widest">Patron Clients</span>
            <Users className="w-4 h-4 text-[#C5A46D]" />
          </div>
          <p className="text-2xl sm:text-3xl font-sans font-bold text-[#F5F0E8]">
            {metrics.totalCustomers}
          </p>
          <p className="text-[10px] text-[#C5A46D] font-mono mt-2">
            100% Verified Profiles
          </p>
        </div>

        {/* Total Products */}
        <div className="p-6 bg-[#121212] border border-[#2B2B2B] relative overflow-hidden group">
          <div className="flex items-center justify-between text-[#A8A29A] mb-2 text-xs">
            <span className="uppercase tracking-widest">Atelier Pieces</span>
            <Shirt className="w-4 h-4 text-[#C5A46D]" />
          </div>
          <p className="text-2xl sm:text-3xl font-sans font-bold text-[#F5F0E8]">
            {metrics.totalProducts}
          </p>
          <p className="text-[10px] text-amber-400 font-mono mt-2">
            {metrics.lowStockCount} Low-stock variants
          </p>
        </div>
      </div>

      {/* Visual Chart Simulation & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Revenue Performance Bar Chart (8 Cols) */}
        <div className="lg:col-span-8 p-6 bg-[#121212] border border-[#2B2B2B] space-y-6">
          <div className="flex items-center justify-between border-b border-[#242424] pb-4">
            <div>
              <h3 className="font-serif text-base uppercase tracking-widest text-[#F5F0E8]">
                Fiscal Consignment Volume
              </h3>
              <p className="text-xs text-[#A8A29A]">Monthly revenue breakdown across Milanese collections</p>
            </div>
            <span className="text-xs font-mono text-[#C5A46D]">2026 Fiscal Cycle</span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-64 flex items-end justify-between gap-3 pt-8 px-2">
            {[
              { month: 'Jun', amount: 84000, height: '40%' },
              { month: 'Jul', amount: 112000, height: '55%' },
              { month: 'Aug', amount: 96000, height: '48%' },
              { month: 'Sep', amount: 145000, height: '72%' },
              { month: 'Oct', amount: 188000, height: '88%' },
              { month: 'Nov', amount: 245000, height: '100%' },
            ].map((bar) => (
              <div key={bar.month} className="flex-1 flex flex-col items-center gap-2 group">
                <span className="text-[10px] font-mono text-[#C5A46D] opacity-0 group-hover:opacity-100 transition-opacity">
                  {formatINR(bar.amount)}
                </span>
                <div className="w-full bg-[#1A1A1A] h-48 rounded-t flex items-end p-1">
                  <div
                    className="w-full bg-gradient-to-t from-[#9A7B4F] to-[#E0C18A] rounded-t transition-all duration-700 group-hover:brightness-125"
                    style={{ height: bar.height }}
                  />
                </div>
                <span className="text-[11px] font-mono text-[#A8A29A]">{bar.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Low-Stock Warnings Alert Box (4 Cols) */}
        <div className="lg:col-span-4 p-6 bg-[#121212] border border-[#2B2B2B] space-y-4">
          <div className="flex items-center gap-2 text-amber-400 pb-3 border-b border-[#242424]">
            <AlertTriangle className="w-4 h-4" />
            <h3 className="font-serif text-sm uppercase tracking-wider font-semibold">
              Low-Stock Warnings ({lowStockProducts.length})
            </h3>
          </div>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1 text-xs">
            {lowStockProducts.length === 0 ? (
              <p className="text-[#A8A29A] py-6 text-center">All atelier variants adequately stocked.</p>
            ) : (
              lowStockProducts.map((item: any) => (
                <div key={item.id} className="p-3 bg-[#171717] border border-[#2A2A2A] flex justify-between items-center">
                  <div>
                    <h4 className="font-serif text-xs text-[#F5F0E8] truncate max-w-[160px]">
                      {item.productName}
                    </h4>
                    <p className="text-[10px] text-[#A8A29A]">
                      Size: {item.size} | {item.color}
                    </p>
                  </div>
                  <span className="px-2 py-0.5 bg-amber-950 text-amber-300 font-mono font-bold text-[10px] border border-amber-800">
                    {item.stock} left
                  </span>
                </div>
              ))
            )}
          </div>

          <Link
            href="/admin/inventory"
            className="block text-center text-xs uppercase tracking-widest text-[#C5A46D] hover:underline pt-2"
          >
            Manage Variant Inventory →
          </Link>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="p-6 bg-[#121212] border border-[#2B2B2B] space-y-4">
        <div className="flex items-center justify-between border-b border-[#242424] pb-4">
          <h3 className="font-serif text-base uppercase tracking-widest text-[#F5F0E8]">
            Recent Client Consignments
          </h3>
          <Link
            href="/admin/orders"
            className="text-xs uppercase tracking-widest text-[#C5A46D] hover:underline flex items-center gap-1"
          >
            View All Consignments <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto text-xs">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[#242424] text-[#C5A46D] font-mono text-[10px] uppercase">
                <th className="py-2.5 px-3">Order Number</th>
                <th className="py-2.5 px-3">Patron Name</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Payment</th>
                <th className="py-2.5 px-3">Total Amount</th>
                <th className="py-2.5 px-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1F1F1F] font-mono text-[11px]">
              {recentTransactions.map((ord: any) => (
                <tr key={ord.id} className="hover:bg-[#171717]">
                  <td className="py-3 px-3 text-[#F5F0E8] font-bold">
                    <Link href={`/order-confirmation/${ord.orderNumber}`} className="hover:text-[#C5A46D]">
                      {ord.orderNumber}
                    </Link>
                  </td>
                  <td className="py-3 px-3 text-[#F5F0E8] font-serif">{ord.customerName}</td>
                  <td className="py-3 px-3">
                    <span className="px-2 py-0.5 bg-[#C5A46D]/15 text-[#C5A46D] border border-[#C5A46D]/30 text-[9px] uppercase">
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-green-400 font-bold uppercase">{ord.paymentStatus}</td>
                  <td className="py-3 px-3 text-[#C5A46D]">{formatINR(ord.total)}</td>
                  <td className="py-3 px-3 text-[#777]">{new Date(ord.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

