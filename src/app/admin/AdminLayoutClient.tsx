'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
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
  Menu,
  X,
} from 'lucide-react';

export default function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { settings } = useSettings();
  const [mobileAdminOpen, setMobileAdminOpen] = useState(false);

  useEffect(() => {
    setMobileAdminOpen(false);
  }, [pathname]);

  const navItems = [
    { label: 'Executive Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Products & Atelier', href: '/admin/products', icon: Shirt },
    { label: 'Orders & Consignments', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Client Directory', href: '/admin/customers', icon: Users },
    { label: 'Inventory & Variants', href: '/admin/inventory', icon: Boxes },
    { label: 'Marketing & Privileges', href: '/admin/marketing', icon: TicketPercent },
  ];

  return (
    <div className="min-h-screen bg-[#090909] text-[#F5F2EC] flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#0E0E0E] border-b border-[#242424] sticky top-0 z-30">
        <Link href="/admin" className="flex items-center gap-2">
          <span className="font-serif text-base tracking-[0.18em] text-[#F5F2EC] uppercase font-light">
            {settings.brandName}
          </span>
          <span className="text-[9px] font-mono tracking-widest text-[#B89A6A] uppercase px-1.5 py-0.5 bg-[#B89A6A]/10 border border-[#B89A6A]/30">
            Console
          </span>
        </Link>
        <button
          onClick={() => setMobileAdminOpen(!mobileAdminOpen)}
          className="p-1.5 text-[#85817A] hover:text-[#B89A6A] transition-colors"
          aria-label="Toggle admin menu"
        >
          {mobileAdminOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Backdrop */}
      <div
        className={`md:hidden fixed inset-0 z-40 bg-black/85 backdrop-blur-md drawer-backdrop transition-all duration-300 ${
          mobileAdminOpen ? 'pointer-events-auto visible opacity-100' : 'pointer-events-none invisible opacity-0'
        }`}
        onClick={() => setMobileAdminOpen(false)}
      />

      {/* Sidebar: Persistent on Desktop, Smooth Slide Drawer on Mobile */}
      <aside
        className={`fixed md:static top-0 bottom-0 left-0 z-50 md:z-0 w-72 md:w-64 bg-[#0E0E0E] border-r border-[#242424] flex-shrink-0 flex flex-col justify-between drawer-left transform md:transform-none transition-transform duration-300 ${
          mobileAdminOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div>
          {/* Logo / Header */}
          <div className="p-5 sm:p-6 border-b border-[#242424] flex items-center justify-between">
            <Link href="/" className="block">
              <span className="font-serif text-lg tracking-[0.2em] text-[#F5F2EC] uppercase font-light">
                {settings.brandName}
              </span>
              <span className="block text-[9px] font-mono tracking-widest text-[#B89A6A] uppercase">
                Administration Console
              </span>
            </Link>
            <button
              onClick={() => setMobileAdminOpen(false)}
              className="md:hidden p-1 text-[#85817A] hover:text-[#B89A6A]"
              aria-label="Close admin menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1 text-xs uppercase tracking-wider font-medium scroll-touch-contain">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileAdminOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-3 transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-[#947A4F] via-[#B89A6A] to-[#CDB388] text-black font-semibold shadow-sm'
                      : 'text-[#85817A] hover:text-[#F5F2EC] hover:bg-[#161616]'
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
        <div className="p-4 border-t border-[#242424] space-y-3 pb-safe">
          <Link
            href="/"
            className="flex items-center justify-between text-xs text-[#85817A] hover:text-[#B89A6A] py-1 transition-colors"
          >
            <span>Return to Boutique</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <div className="flex items-center justify-between pt-2 border-t border-[#1C1C1C]">
            <div className="text-[11px] truncate">
              <p className="font-medium text-[#F5F2EC] font-serif">{user?.name || 'Lorenzo De Luca'}</p>
              <p className="text-[#777] font-mono text-[9px]">Atelier Director</p>
            </div>
            <button
              onClick={logout}
              className="text-[#85817A] hover:text-red-400 p-1"
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

