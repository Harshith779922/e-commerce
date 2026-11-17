'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/utils';
import { Order } from '@/lib/types';
import {
  User,
  Package,
  Heart,
  MapPin,
  LogOut,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

function AccountContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout, isLoading } = useAuth();
  const { wishlistItems, toggleWishlist } = useWishlist();

  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist' | 'profile' | 'addresses'>(
    (searchParams.get('tab') as any) || 'orders'
  );
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/auth/login');
    }
  }, [user, isLoading, router]);

  // Fetch orders for user
  useEffect(() => {
    if (!user) return;

    async function loadOrders() {
      setLoadingOrders(true);
      try {
        const res = await fetch(`/api/orders?email=${encodeURIComponent(user!.email)}`);
        const data = await res.json();
        setOrders(data.orders || []);
      } catch (err) {
        console.error('Failed to load orders', err);
      } finally {
        setLoadingOrders(false);
      }
    }
    loadOrders();
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] text-[#F5F0E8] flex items-center justify-center">
        <p className="font-serif text-sm tracking-widest text-[#C5A46D] uppercase">
          Verifying Client Identity...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-[#0B0B0B] text-[#F5F0E8] min-h-screen pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="p-8 bg-[#121212] border border-[#2B2B2B] mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#1C1C1C] border border-[#C5A46D] flex items-center justify-center text-[#C5A46D] font-serif text-xl font-bold">
              {user.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-serif text-2xl text-[#F5F0E8] font-light">{user.name}</h1>
                <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 bg-[#C5A46D]/15 border border-[#C5A46D]/30 text-[#C5A46D]">
                  {user.loyaltyTier || 'Platinum'} Patron
                </span>
              </div>
              <p className="text-xs text-[#A8A29A] font-mono mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.role === 'ADMIN' && (
              <Link
                href="/admin"
                className="px-4 py-2 bg-[#C5A46D] text-black text-xs uppercase tracking-widest font-semibold hover:bg-[#E0C18A] transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5" /> Staff Dashboard
              </Link>
            )}
            <button
              onClick={logout}
              className="px-4 py-2 border border-[#34312D] text-[#A8A29A] hover:text-red-400 hover:border-red-800 text-xs uppercase tracking-widest transition-colors flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign Out
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#262626] mb-8 overflow-x-auto text-xs uppercase tracking-widest">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-3 px-5 border-b-2 font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-[#C5A46D] text-[#C5A46D]'
                : 'border-transparent text-[#A8A29A] hover:text-[#F5F0E8]'
            }`}
          >
            <Package className="w-3.5 h-3.5" /> Orders & Tracking ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`pb-3 px-5 border-b-2 font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'wishlist'
                ? 'border-[#C5A46D] text-[#C5A46D]'
                : 'border-transparent text-[#A8A29A] hover:text-[#F5F0E8]'
            }`}
          >
            <Heart className="w-3.5 h-3.5" /> Wishlist ({wishlistItems.length})
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`pb-3 px-5 border-b-2 font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'addresses'
                ? 'border-[#C5A46D] text-[#C5A46D]'
                : 'border-transparent text-[#A8A29A] hover:text-[#F5F0E8]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" /> Address Book
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`pb-3 px-5 border-b-2 font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'border-[#C5A46D] text-[#C5A46D]'
                : 'border-transparent text-[#A8A29A] hover:text-[#F5F0E8]'
            }`}
          >
            <User className="w-3.5 h-3.5" /> Profile & Sizing
          </button>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {loadingOrders ? (
              <p className="text-xs text-[#A8A29A] py-12 text-center">Loading consignment records...</p>
            ) : orders.length === 0 ? (
              <div className="p-12 text-center bg-[#121212] border border-[#262626]">
                <Package className="w-8 h-8 text-[#A8A29A] mx-auto mb-3" />
                <h3 className="font-serif text-lg text-[#F5F0E8] mb-1">No Consignment History Yet</h3>
                <p className="text-xs text-[#A8A29A] mb-6">Your ordered atelier pieces will appear here with live courier updates.</p>
                <Link
                  href="/shop"
                  className="px-6 py-2.5 bg-[#C5A46D] text-black text-xs uppercase tracking-widest font-semibold"
                >
                  Explore Boutique
                </Link>
              </div>
            ) : (
              orders.map((ord) => (
                <div key={ord.id} className="p-6 bg-[#121212] border border-[#2B2B2B] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#222] gap-2">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs font-bold text-[#C5A46D]">
                          #{ord.orderNumber}
                        </span>
                        <span
                          className={`text-[9px] uppercase tracking-wider px-2 py-0.5 font-bold ${
                            ord.status === 'DELIVERED'
                              ? 'bg-green-950 text-green-300 border border-green-800'
                              : 'bg-[#C5A46D]/15 text-[#C5A46D] border border-[#C5A46D]/30'
                          }`}
                        >
                          {ord.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#A8A29A] font-mono mt-1">
                        Placed on {new Date(ord.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="font-sans text-sm font-semibold text-[#F5F0E8] block">
                        {formatINR(ord.total)}
                      </span>
                      <span className="text-[10px] text-[#A8A29A] font-mono">
                        Carrier: {ord.carrier || 'Bespoke Express'} ({ord.trackingNumber || 'Pending'})
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-3">
                    {ord.items?.map((it) => (
                      <div key={it.id} className="flex items-center justify-between gap-4 text-xs">
                        <div className="flex items-center gap-3">
                          {it.imageUrl && (
                            <img
                              src={it.imageUrl}
                              alt={it.productName}
                              className="w-12 h-16 object-cover border border-[#222]"
                            />
                          )}
                          <div>
                            <p className="font-serif text-[#F5F0E8]">{it.productName}</p>
                            <p className="text-[10px] text-[#A8A29A]">
                              Qty: {it.quantity} | Size: {it.size} | Color: {it.color}
                            </p>
                          </div>
                        </div>
                        <span className="text-[#C5A46D] font-mono">{formatINR(it.subtotal)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-[#222] flex justify-between items-center text-xs">
                    <Link
                      href={`/order-confirmation/${ord.orderNumber}`}
                      className="text-[#C5A46D] hover:underline flex items-center gap-1 uppercase tracking-wider text-[11px]"
                    >
                      View Invoice & Live Consignment Timeline <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Wishlist */}
        {activeTab === 'wishlist' && (
          <div>
            {wishlistItems.length === 0 ? (
              <div className="p-12 text-center bg-[#121212] border border-[#262626]">
                <Heart className="w-8 h-8 text-[#A8A29A] mx-auto mb-3" />
                <h3 className="font-serif text-lg text-[#F5F0E8] mb-1">Your Wishlist is Empty</h3>
                <p className="text-xs text-[#A8A29A] mb-6">Save your favored tailoring creations to review later.</p>
                <Link
                  href="/shop"
                  className="px-6 py-2.5 bg-[#C5A46D] text-black text-xs uppercase tracking-widest font-semibold"
                >
                  Explore Boutique
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {wishlistItems.map((prod) => (
                  <div key={prod.id} className="bg-[#121212] border border-[#2B2B2B] p-4 flex flex-col justify-between">
                    <Link href={`/product/${prod.slug}`}>
                      <img
                        src={prod.images?.[0]?.url || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=600'}
                        alt={prod.name}
                        className="w-full aspect-[3/4] object-cover mb-3"
                      />
                      <h4 className="font-serif text-sm text-[#F5F0E8] hover:text-[#C5A46D] transition-colors">
                        {prod.name}
                      </h4>
                    </Link>
                    <p className="text-xs text-[#C5A46D] font-mono mt-1 mb-4">
                      {formatINR(prod.salePrice || prod.price)}
                    </p>
                    <div className="flex gap-2">
                      <Link
                        href={`/product/${prod.slug}`}
                        className="flex-1 py-2 text-center bg-[#C5A46D] text-black text-[11px] uppercase tracking-wider font-semibold hover:bg-[#E0C18A]"
                      >
                        Select Size
                      </Link>
                      <button
                        onClick={() => toggleWishlist(prod)}
                        className="p-2 border border-[#34312D] text-[#A8A29A] hover:text-red-400"
                        aria-label="Remove from wishlist"
                      >
                        <Heart className="w-4 h-4 fill-current text-[#C5A46D]" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Addresses */}
        {activeTab === 'addresses' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-[#121212] border border-[#C5A46D] relative">
              <span className="absolute top-4 right-4 bg-[#C5A46D] text-black text-[9px] uppercase tracking-widest font-bold px-2 py-0.5">
                Primary Residence
              </span>
              <h3 className="font-serif text-base text-[#F5F0E8] mb-2">{user.name}</h3>
              <p className="text-xs text-[#A8A29A] leading-relaxed">
                Villa 14, Golf Links, Lodhi Road<br />
                New Delhi, Delhi - 110003<br />
                India
              </p>
              <p className="text-xs text-[#A8A29A] font-mono mt-3">Phone: {user.phone || '+91 98112 34567'}</p>
            </div>

            <div className="p-6 bg-[#121212] border border-[#2B2B2B]">
              <span className="text-[10px] text-[#A8A29A] uppercase tracking-widest font-mono">
                Secondary Residence
              </span>
              <h3 className="font-serif text-base text-[#F5F0E8] mb-2">{user.name}</h3>
              <p className="text-xs text-[#A8A29A] leading-relaxed">
                Executive Penthouse 8B, Maker Towers, Cuffe Parade<br />
                Mumbai, Maharashtra - 400005<br />
                India
              </p>
              <p className="text-xs text-[#A8A29A] font-mono mt-3">Phone: +91 98112 34567</p>
            </div>
          </div>
        )}

        {/* Tab 4: Profile */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl bg-[#121212] border border-[#2B2B2B] p-6 space-y-4 text-xs">
            <h3 className="font-serif text-lg text-[#F5F0E8] tracking-widest uppercase mb-4">
              Client Specifications
            </h3>
            <div className="grid grid-cols-2 gap-4 border-b border-[#222] pb-4">
              <div>
                <span className="text-[#A8A29A] block mb-1">Patron Tier</span>
                <span className="text-[#C5A46D] font-bold font-serif text-sm">
                  {user.loyaltyTier || 'Platinum'} VIP
                </span>
              </div>
              <div>
                <span className="text-[#A8A29A] block mb-1">Preferred Sizing</span>
                <span className="text-[#F5F0E8] font-mono">Italian 48 (Medium Drop 7)</span>
              </div>
            </div>
            <div className="space-y-3 pt-2">
              <p className="text-[#A8A29A]">
                To update your bespoke measurements or request a private salon appointment at our Milanese showroom, please notify the concierge.
              </p>
              <p className="text-[#C5A46D] font-mono">concierge@bespokemilano.com</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center text-[#C5A46D]">Loading Account...</div>}>
      <AccountContent />
    </Suspense>
  );
}
