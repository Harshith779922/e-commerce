'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Shirt,
  ShoppingBag,
  Users,
  Boxes,
  TicketPercent,
  ExternalLink,
  ShieldCheck,
  LogOut,
} from 'lucide-react';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Executive Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Products & Atelier', href: '/admin/products', icon: Shirt },
    { label: 'Orders & Consignments', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Client Directory', href: '/admin/customers', icon: Users },
    { label: 'Inventory & Variants', href: '/admin/inventory', icon: Boxes },
    { label: 'Marketing & Privileges', href: '/admin/marketing', icon: TicketPercent },
  ];

  return (
    <div className="min-h-screen bg-[#090909] text-[#F5F0E8] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0E0E0E] border-r border-[#242424] flex-shrink-0 flex flex-col justify-between">
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-[#242424]">
            <Link href="/" className="block">
              <span className="font-serif text-lg tracking-[0.2em] text-[#F5F0E8] uppercase">
                BESPOKE MILANO
              </span>
              <span className="block text-[9px] font-mono tracking-widest text-[#C5A46D] uppercase">
                Administration Console
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5 text-xs uppercase tracking-wider font-medium">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-3 transition-all ${
                    isActive
                      ? 'bg-[#C5A46D] text-black font-semibold shadow-sm'
                      : 'text-[#A8A29A] hover:text-[#F5F0E8] hover:bg-[#161616]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile & Return link */}
        <div className="p-4 border-t border-[#242424] space-y-3">
          <Link
            href="/"
            className="flex items-center justify-between text-xs text-[#A8A29A] hover:text-[#C5A46D] py-1 transition-colors"
          >
            <span>Return to Boutique</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center justify-between pt-2 border-t border-[#1C1C1C]">
            <div className="text-[11px] truncate">
              <p className="font-medium text-[#F5F0E8] font-serif">{user?.name || 'Lorenzo De Luca'}</p>
              <p className="text-[#777] font-mono text-[9px]">Atelier Director</p>
            </div>
            <button
              onClick={logout}
              className="text-[#A8A29A] hover:text-red-400 p-1"
              aria-label="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-x-hidden min-h-screen bg-[#090909]">
        {children}
      </main>
    </div>
  );
}

