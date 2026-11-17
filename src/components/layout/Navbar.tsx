'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from '@/context/SettingsContext';
import { Search, ShoppingBag, Heart, User, Menu, X, ChevronDown, ShieldCheck } from 'lucide-react';
import SearchModal from './SearchModal';

export default function Navbar() {
  const pathname = usePathname();
  const { openCart, itemCount } = useCart();
  const { wishlistIds } = useWishlist();
  const { user, logout } = useAuth();
  const { settings } = useSettings();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoryOpen, setMobileCategoryOpen] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);

  const toggleMobileCategory = (cat: string) => {
    setMobileCategoryOpen((prev) => (prev === cat ? null : cat));
  };

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setActiveMegaMenu(null);
    setAccountDropdownOpen(false);
  }, [pathname]);

  const isHome = pathname === '/';

  return (
    <>
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled || !isHome
            ? 'bg-[#111111]/95 backdrop-blur-md border-b border-[#262626] py-3.5 shadow-xl'
            : 'bg-gradient-to-b from-[#111111]/90 via-[#111111]/50 to-transparent py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Mobile Menu Hamburger button */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="text-[#F5F2EC] hover:text-[#B89A6A] transition-colors p-1.5 focus:outline-none"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Brand Logo / Wordmark (Original letter spacing and typography) */}
            <div className="flex-1 lg:flex-none text-center lg:text-left">
              <Link href="/" className="inline-block group py-1">
                <span className="font-serif text-lg sm:text-xl md:text-2xl tracking-[0.22em] text-[#F5F2EC] group-hover:text-[#B89A6A] transition-colors uppercase font-light">
                  {settings.brandName}
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7 text-xs tracking-widestLuxury uppercase font-medium">
              {/* Home */}
              <Link
                href="/"
                className={`hover:text-[#B89A6A] transition-colors ${
                  pathname === '/' ? 'text-[#B89A6A]' : 'text-[#F5F2EC]'
                }`}
              >
                Home
              </Link>

              {/* Men with Mega Menu */}
              <div
                className="relative py-2"
                onMouseEnter={() => setActiveMegaMenu('men')}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <Link
                  href="/men"
                  className={`hover:text-[#B89A6A] transition-colors flex items-center gap-1 ${
                    pathname.startsWith('/men') ? 'text-[#B89A6A]' : 'text-[#F5F2EC]'
                  }`}
                >
                  Men
                  <ChevronDown className="w-3 h-3 text-[#85817A]" />
                </Link>

                {activeMegaMenu === 'men' && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-[620px] bg-[#141414] border border-[#2B2B27] p-6 shadow-2xl rounded-none grid grid-cols-3 gap-6 animate-fadeIn">
                    <div>
                      <h4 className="text-[#B89A6A] font-serif text-sm tracking-widestLuxury uppercase mb-3 border-b border-[#2B2B27] pb-1">
                        Tailoring
                      </h4>
                      <ul className="space-y-2 text-[11px] text-[#85817A]">
                        <li><Link href="/shop?category=suits-blazers&gender=men" className="hover:text-[#F5F2EC] transition-colors">Evening Tuxedos & Blazers</Link></li>
                        <li><Link href="/shop?category=suits-blazers&gender=men" className="hover:text-[#F5F2EC] transition-colors">Double-Breasted Suits</Link></li>
                        <li><Link href="/shop?category=trousers-footwear&gender=men" className="hover:text-[#F5F2EC] transition-colors">Pleated Wool Trousers</Link></li>
                        <li><Link href="/shop?category=suits-blazers&gender=men" className="hover:text-[#F5F2EC] transition-colors">Cashmere Overcoats</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-[#B89A6A] font-serif text-sm tracking-widestLuxury uppercase mb-3 border-b border-[#2B2B27] pb-1">
                        Shirts & Knits
                      </h4>
                      <ul className="space-y-2 text-[11px] text-[#85817A]">
                        <li><Link href="/shop?category=designer-shirts&gender=men" className="hover:text-[#F5F2EC] transition-colors">Egyptian Giza Cotton</Link></li>
                        <li><Link href="/shop?category=designer-shirts&gender=men" className="hover:text-[#F5F2EC] transition-colors">Silk Band-Collar Shirts</Link></li>
                        <li><Link href="/shop?category=designer-shirts&gender=men" className="hover:text-[#F5F2EC] transition-colors">Fine Knitted Polos</Link></li>
                        <li><Link href="/shop?category=trousers-footwear&gender=men" className="hover:text-[#F5F2EC] transition-colors">Hand-Welted Loafers</Link></li>
                      </ul>
                    </div>
                    <div className="relative group overflow-hidden border border-[#2B2B27]">
                      <img
                        src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop"
                        alt="Men’s Editorial"
                        className="w-full h-40 object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex items-end p-3">
                        <Link href="/men" className="text-[10px] tracking-widest text-[#F5F2EC] hover:text-[#B89A6A] font-medium uppercase underline">
                          Explore Men’s Wardrobe →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Women with Mega Menu */}
              <div
                className="relative py-2"
                onMouseEnter={() => setActiveMegaMenu('women')}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <Link
                  href="/women"
                  className={`hover:text-[#B89A6A] transition-colors flex items-center gap-1 ${
                    pathname.startsWith('/women') ? 'text-[#B89A6A]' : 'text-[#F5F2EC]'
                  }`}
                >
                  Women
                  <ChevronDown className="w-3 h-3 text-[#85817A]" />
                </Link>

                {activeMegaMenu === 'women' && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-[620px] bg-[#141414] border border-[#2B2B27] p-6 shadow-2xl rounded-none grid grid-cols-3 gap-6 animate-fadeIn">
                    <div>
                      <h4 className="text-[#B89A6A] font-serif text-sm tracking-widestLuxury uppercase mb-3 border-b border-[#2B2B27] pb-1">
                        Couture & Gowns
                      </h4>
                      <ul className="space-y-2 text-[11px] text-[#85817A]">
                        <li><Link href="/shop?category=dresses-eveningwear&gender=women" className="hover:text-[#F5F2EC] transition-colors">Silk Crepe Column Gowns</Link></li>
                        <li><Link href="/shop?category=dresses-eveningwear&gender=women" className="hover:text-[#F5F2EC] transition-colors">Brocade Cocktail Dresses</Link></li>
                        <li><Link href="/shop?category=dresses-eveningwear&gender=women" className="hover:text-[#F5F2EC] transition-colors">Liquid Gold Silk Slips</Link></li>
                        <li><Link href="/shop?category=dresses-eveningwear&gender=women" className="hover:text-[#F5F2EC] transition-colors">Pleated Silk Chiffon Skirts</Link></li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-[#B89A6A] font-serif text-sm tracking-widestLuxury uppercase mb-3 border-b border-[#2B2B27] pb-1">
                        Tailoring & Tops
                      </h4>
                      <ul className="space-y-2 text-[11px] text-[#85817A]">
                        <li><Link href="/shop?category=suits-blazers&gender=women" className="hover:text-[#F5F2EC] transition-colors">Hourglass Filigree Blazers</Link></li>
                        <li><Link href="/shop?category=designer-shirts&gender=women" className="hover:text-[#F5F2EC] transition-colors">Silk Georgette Blouses</Link></li>
                        <li><Link href="/shop?category=suits-blazers&gender=women" className="hover:text-[#F5F2EC] transition-colors">Cashmere Wrap Coats</Link></li>
                        <li><Link href="/shop?category=trousers-footwear&gender=women" className="hover:text-[#F5F2EC] transition-colors">Stiletto Suede Pumps</Link></li>
                      </ul>
                    </div>
                    <div className="relative group overflow-hidden border border-[#2B2B27]">
                      <img
                        src="https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=600&auto=format&fit=crop"
                        alt="Women’s Editorial"
                        className="w-full h-40 object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex items-end p-3">
                        <Link href="/women" className="text-[10px] tracking-widest text-[#F5F2EC] hover:text-[#B89A6A] font-medium uppercase underline">
                          Explore Women’s Collection →
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Collections with Dropdown */}
              <div
                className="relative py-2"
                onMouseEnter={() => setActiveMegaMenu('collections')}
                onMouseLeave={() => setActiveMegaMenu(null)}
              >
                <Link
                  href="/shop?tab=collections"
                  className="hover:text-[#B89A6A] text-[#F5F2EC] transition-colors flex items-center gap-1"
                >
                  Collections
                  <ChevronDown className="w-3 h-3 text-[#85817A]" />
                </Link>

                {activeMegaMenu === 'collections' && (
                  <div className="absolute top-full left-0 w-64 bg-[#141414] border border-[#2B2B27] p-4 shadow-2xl space-y-3 animate-fadeIn">
                    <Link
                      href="/collections/the-signature-collection"
                      className="block hover:text-[#B89A6A] text-[#F5F2EC] text-xs transition-colors border-b border-[#222] pb-2"
                    >
                      <span className="font-serif block text-sm">The Signature Collection</span>
                      <span className="text-[10px] text-[#85817A] normal-case">Contemporary silhouettes & intention</span>
                    </Link>
                    <Link
                      href="/collections/the-italian-collection"
                      className="block hover:text-[#B89A6A] text-[#F5F2EC] text-xs transition-colors border-b border-[#222] pb-2"
                    >
                      <span className="font-serif block text-sm">The Italian Collection</span>
                      <span className="text-[10px] text-[#85817A] normal-case">Tailored Luxury for the Modern Icon</span>
                    </Link>
                    <Link
                      href="/collections/sartoriale-silk-cashmere"
                      className="block hover:text-[#B89A6A] text-[#F5F2EC] text-xs transition-colors"
                    >
                      <span className="font-serif block text-sm">Silk & Cashmere</span>
                      <span className="text-[10px] text-[#85817A] normal-case">Featherweight Knitwear & Stoles</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Accessories */}
              <Link
                href="/accessories"
                className={`hover:text-[#B89A6A] transition-colors ${
                  pathname.startsWith('/accessories') ? 'text-[#B89A6A]' : 'text-[#F5F2EC]'
                }`}
              >
                Accessories
              </Link>

              {/* New Arrivals */}
              <Link
                href="/shop?newArrival=true"
                className="hover:text-[#B89A6A] text-[#F5F2EC] transition-colors flex items-center gap-1"
              >
                New Arrivals
                <span className="w-1.5 h-1.5 rounded-full bg-[#B89A6A] inline-block animate-ping"></span>
              </Link>
            </nav>

            {/* Right Action Icons: Search, Account, Wishlist, Shopping Bag */}
            <div className="flex items-center space-x-3 sm:space-x-5">
              {/* Search */}
              <button
                onClick={() => setSearchOpen(true)}
                aria-label="Search"
                className="text-[#F5F2EC] hover:text-[#B89A6A] transition-colors p-1"
              >
                <Search className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              {/* Account Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setAccountDropdownOpen(!accountDropdownOpen)}
                  aria-label="Account"
                  className="text-[#F5F2EC] hover:text-[#B89A6A] transition-colors p-1 flex items-center"
                >
                  <User className="w-4 h-4 sm:w-5 sm:h-5" />
                  {user?.role === 'ADMIN' && (
                    <span className="absolute -top-1 -right-1 bg-[#B89A6A] text-black text-[9px] font-bold px-1 rounded-full">
                      ADM
                    </span>
                  )}
                </button>

                {accountDropdownOpen && (
                  <div className="absolute right-0 mt-3 w-56 bg-[#141414] border border-[#2B2B27] shadow-2xl py-3 z-50 animate-fadeIn text-xs">
                    {user ? (
                      <div>
                        <div className="px-4 py-2 border-b border-[#262626]">
                          <p className="text-[#F5F2EC] font-medium font-serif">{user.name}</p>
                          <p className="text-[10px] text-[#85817A] truncate">{user.email}</p>
                          <span className="inline-block mt-1 text-[9px] uppercase tracking-wider px-2 py-0.5 bg-[#B89A6A]/15 text-[#B89A6A] border border-[#B89A6A]/30">
                            {user.role === 'ADMIN' ? 'Atelier Director' : 'Patron Member'}
                          </span>
                        </div>

                        {user.role === 'ADMIN' && (
                          <Link
                            href="/admin"
                            className="flex items-center gap-2 px-4 py-2.5 text-[#B89A6A] hover:bg-[#1E1E1E] transition-colors font-medium border-b border-[#262626]"
                          >
                            <ShieldCheck className="w-4 h-4" />
                            Admin Console
                          </Link>
                        )}

                        <Link
                          href="/account"
                          className="block px-4 py-2 text-[#F5F2EC] hover:bg-[#1E1E1E] hover:text-[#B89A6A] transition-colors"
                        >
                          Orders & Profile
                        </Link>
                        <button
                          onClick={logout}
                          className="w-full text-left px-4 py-2 text-[#85817A] hover:bg-[#1E1E1E] hover:text-red-400 transition-colors"
                        >
                          Sign Out
                        </button>
                      </div>
                    ) : (
                      <div>
                        <Link
                          href="/auth/login"
                          className="block px-4 py-2 text-[#F5F2EC] hover:bg-[#1E1E1E] hover:text-[#B89A6A] transition-colors font-medium"
                        >
                          Client Login
                        </Link>
                        <Link
                          href="/auth/register"
                          className="block px-4 py-2 text-[#85817A] hover:bg-[#1E1E1E] hover:text-[#F5F2EC] transition-colors"
                        >
                          Register for Account
                        </Link>
                        <div className="border-t border-[#262626] mt-2 pt-2 px-4">
                          <Link
                            href="/admin"
                            className="flex items-center gap-1.5 text-[11px] text-[#B89A6A] hover:underline"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            Staff Admin
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Wishlist */}
              <Link
                href="/account?tab=wishlist"
                aria-label="Wishlist"
                className="relative text-[#F5F2EC] hover:text-[#B89A6A] transition-colors p-1"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5" />
                {wishlistIds.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#B89A6A] text-black font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                    {wishlistIds.length}
                  </span>
                )}
              </Link>

              {/* Shopping Bag */}
              <button
                onClick={openCart}
                aria-label="Shopping Bag"
                className="relative text-[#F5F2EC] hover:text-[#B89A6A] transition-colors p-1 flex items-center"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-[#B89A6A] text-black font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-goldGlow">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden animate-fadeIn">
            <div
              className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-300"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="fixed top-0 bottom-0 left-0 w-[88vw] max-w-sm bg-[#0E0E0E] border-r border-[#262626] flex flex-col justify-between shadow-2xl z-10 overflow-hidden">
              {/* Drawer Top Header */}
              <div className="p-5 border-b border-[#262626] flex items-center justify-between bg-[#121212]">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="inline-block">
                  <span className="font-serif text-lg tracking-[0.2em] text-[#F5F2EC] uppercase font-light">
                    {settings.brandName}
                  </span>
                </Link>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label="Close menu"
                  className="p-1.5 text-[#85817A] hover:text-[#B89A6A] hover:bg-[#1A1A1A] transition-colors rounded-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Quick Search Bar inside Drawer */}
              <div className="p-4 border-b border-[#1F1F1F] bg-[#0E0E0E]">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setSearchOpen(true);
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 bg-[#161616] border border-[#2B2B27] text-left text-xs text-[#85817A] hover:text-[#F5F2EC] hover:border-[#B89A6A] transition-colors"
                >
                  <Search className="w-3.5 h-3.5 text-[#B89A6A]" />
                  <span className="tracking-wide">Search atelier creations...</span>
                </button>
              </div>

              {/* Main Scrollable Nav Links */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-1">
                {/* Home */}
                <Link
                  href="/"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-3 text-xs tracking-widestLuxury uppercase font-medium border-b border-[#1A1A1A] transition-colors ${
                    pathname === '/' ? 'text-[#B89A6A]' : 'text-[#F5F2EC] hover:text-[#B89A6A]'
                  }`}
                >
                  Home
                </Link>

                {/* Men Accordion */}
                <div className="border-b border-[#1A1A1A]">
                  <button
                    onClick={() => toggleMobileCategory('men')}
                    className="w-full flex items-center justify-between py-3 text-xs tracking-widestLuxury uppercase font-medium text-[#F5F2EC] hover:text-[#B89A6A] transition-colors"
                  >
                    <span>Men’s Wardrobe</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#85817A] transition-transform duration-300 ${
                        mobileCategoryOpen === 'men' ? 'rotate-180 text-[#B89A6A]' : ''
                      }`}
                    />
                  </button>
                  {mobileCategoryOpen === 'men' && (
                    <div className="pl-4 pb-3 space-y-2.5 text-[11px] text-[#85817A] animate-fadeIn">
                      <Link
                        href="/men"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-[#B89A6A] font-medium tracking-wider uppercase py-0.5"
                      >
                        Explore All Men →
                      </Link>
                      <Link
                        href="/shop?category=suits-blazers&gender=men"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block hover:text-[#F5F2EC] py-0.5"
                      >
                        Evening Tuxedos & Blazers
                      </Link>
                      <Link
                        href="/shop?category=designer-shirts&gender=men"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block hover:text-[#F5F2EC] py-0.5"
                      >
                        Egyptian Giza Cotton Shirts
                      </Link>
                      <Link
                        href="/shop?category=trousers-footwear&gender=men"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block hover:text-[#F5F2EC] py-0.5"
                      >
                        Pleated Trousers & Footwear
                      </Link>
                    </div>
                  )}
                </div>

                {/* Women Accordion */}
                <div className="border-b border-[#1A1A1A]">
                  <button
                    onClick={() => toggleMobileCategory('women')}
                    className="w-full flex items-center justify-between py-3 text-xs tracking-widestLuxury uppercase font-medium text-[#F5F2EC] hover:text-[#B89A6A] transition-colors"
                  >
                    <span>Women’s Wardrobe</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#85817A] transition-transform duration-300 ${
                        mobileCategoryOpen === 'women' ? 'rotate-180 text-[#B89A6A]' : ''
                      }`}
                    />
                  </button>
                  {mobileCategoryOpen === 'women' && (
                    <div className="pl-4 pb-3 space-y-2.5 text-[11px] text-[#85817A] animate-fadeIn">
                      <Link
                        href="/women"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-[#B89A6A] font-medium tracking-wider uppercase py-0.5"
                      >
                        Explore All Women →
                      </Link>
                      <Link
                        href="/shop?category=dresses-eveningwear&gender=women"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block hover:text-[#F5F2EC] py-0.5"
                      >
                        Silk Crepe Column Gowns
                      </Link>
                      <Link
                        href="/shop?category=suits-blazers&gender=women"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block hover:text-[#F5F2EC] py-0.5"
                      >
                        Hourglass Filigree Blazers
                      </Link>
                      <Link
                        href="/shop?category=designer-shirts&gender=women"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block hover:text-[#F5F2EC] py-0.5"
                      >
                        Silk Georgette Blouses
                      </Link>
                    </div>
                  )}
                </div>

                {/* Collections Accordion */}
                <div className="border-b border-[#1A1A1A]">
                  <button
                    onClick={() => toggleMobileCategory('collections')}
                    className="w-full flex items-center justify-between py-3 text-xs tracking-widestLuxury uppercase font-medium text-[#F5F2EC] hover:text-[#B89A6A] transition-colors"
                  >
                    <span>Atelier Collections</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#85817A] transition-transform duration-300 ${
                        mobileCategoryOpen === 'collections' ? 'rotate-180 text-[#B89A6A]' : ''
                      }`}
                    />
                  </button>
                  {mobileCategoryOpen === 'collections' && (
                    <div className="pl-4 pb-3 space-y-2.5 text-[11px] text-[#85817A] animate-fadeIn">
                      <Link
                        href="/collections/the-signature-collection"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-[#B89A6A] font-medium py-0.5 flex items-center justify-between"
                      >
                        <span>The Signature Collection</span>
                        <span className="text-[9px] px-1.5 py-0.5 bg-[#B89A6A]/10 border border-[#B89A6A]/30 uppercase font-mono">
                          Campaign
                        </span>
                      </Link>
                      <Link
                        href="/collections/the-italian-collection"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block hover:text-[#F5F2EC] py-0.5"
                      >
                        The Italian Collection
                      </Link>
                      <Link
                        href="/collections/the-dolce-collection"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block hover:text-[#F5F2EC] py-0.5"
                      >
                        The Dolce Collection
                      </Link>
                      <Link
                        href="/collections/sartoriale-silk-cashmere"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block hover:text-[#F5F2EC] py-0.5"
                      >
                        Silk & Cashmere Knitwear
                      </Link>
                      <Link
                        href="/collections/alta-notte-evening"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block hover:text-[#F5F2EC] py-0.5"
                      >
                        Alta Notte Gala Evening
                      </Link>
                    </div>
                  )}
                </div>

                {/* Accessories Accordion */}
                <div className="border-b border-[#1A1A1A]">
                  <button
                    onClick={() => toggleMobileCategory('accessories')}
                    className="w-full flex items-center justify-between py-3 text-xs tracking-widestLuxury uppercase font-medium text-[#F5F2EC] hover:text-[#B89A6A] transition-colors"
                  >
                    <span>Accessories & Leather</span>
                    <ChevronDown
                      className={`w-4 h-4 text-[#85817A] transition-transform duration-300 ${
                        mobileCategoryOpen === 'accessories' ? 'rotate-180 text-[#B89A6A]' : ''
                      }`}
                    />
                  </button>
                  {mobileCategoryOpen === 'accessories' && (
                    <div className="pl-4 pb-3 space-y-2.5 text-[11px] text-[#85817A] animate-fadeIn">
                      <Link
                        href="/accessories"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-[#B89A6A] font-medium tracking-wider uppercase py-0.5"
                      >
                        All Accessories →
                      </Link>
                      <Link
                        href="/shop?category=bags-travel"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block hover:text-[#F5F2EC] py-0.5"
                      >
                        Tuscan Calfskin Bags & Duffels
                      </Link>
                      <Link
                        href="/shop?category=accessories"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block hover:text-[#F5F2EC] py-0.5"
                      >
                        Silk Twill Pocket Squares & Cufflinks
                      </Link>
                    </div>
                  )}
                </div>

                {/* New Arrivals direct link */}
                <Link
                  href="/shop?newArrival=true"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between py-3 text-xs tracking-widestLuxury uppercase font-medium text-[#F5F2EC] hover:text-[#B89A6A] border-b border-[#1A1A1A]"
                >
                  <span>New Arrivals</span>
                  <span className="w-2 h-2 rounded-full bg-[#B89A6A]" />
                </Link>

                {/* Complete Shop */}
                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block py-3 text-xs tracking-widestLuxury uppercase font-medium text-[#85817A] hover:text-[#F5F2EC] border-b border-[#1A1A1A]"
                >
                  Complete Catalogue
                </Link>

                {/* Quick Account Links Row */}
                <div className="pt-3 grid grid-cols-2 gap-2 text-xs">
                  <Link
                    href="/account?tab=wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 p-2.5 bg-[#141414] border border-[#262626] text-[#F5F2EC] hover:text-[#B89A6A] transition-colors"
                  >
                    <Heart className="w-3.5 h-3.5 text-[#B89A6A]" />
                    <span className="text-[11px] uppercase tracking-wider">Wishlist ({wishlistIds.length})</span>
                  </Link>

                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openCart();
                    }}
                    className="flex items-center gap-2 p-2.5 bg-[#141414] border border-[#262626] text-[#F5F2EC] hover:text-[#B89A6A] transition-colors text-left"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 text-[#B89A6A]" />
                    <span className="text-[11px] uppercase tracking-wider">Bag ({itemCount})</span>
                  </button>
                </div>
              </div>

              {/* Drawer Footer: Client Authentication / Concierge */}
              <div className="p-5 border-t border-[#262626] bg-[#121212] space-y-3">
                {user ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-[#85817A]">
                      <span>Client Account</span>
                      <span className="text-[#F5F2EC] font-medium">{user.name}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href="/account"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block text-center py-2.5 px-3 border border-[#B89A6A] text-[#B89A6A] text-[10px] uppercase tracking-widest font-medium hover:bg-[#B89A6A] hover:text-black transition-colors"
                      >
                        My Orders
                      </Link>
                      {user.role === 'ADMIN' ? (
                        <Link
                          href="/admin"
                          onClick={() => setMobileMenuOpen(false)}
                          className="block text-center py-2.5 px-3 bg-[#B89A6A] text-black text-[10px] uppercase tracking-widest font-semibold"
                        >
                          Admin
                        </Link>
                      ) : (
                        <button
                          onClick={() => {
                            logout();
                            setMobileMenuOpen(false);
                          }}
                          className="block text-center py-2.5 px-3 border border-[#2B2B27] text-[#85817A] text-[10px] uppercase tracking-widest hover:text-[#F5F2EC]"
                        >
                          Sign Out
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href="/auth/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-center py-2.5 border border-[#2B2B27] text-[#F5F2EC] text-[11px] uppercase tracking-widest hover:border-[#B89A6A] transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block text-center py-2.5 bg-[#B89A6A] text-black text-[11px] uppercase tracking-widest font-medium hover:bg-[#CDB388] transition-colors"
                    >
                      Register
                    </Link>
                  </div>
                )}

                <div className="flex items-center justify-between pt-2 border-t border-[#1F1F1F] text-[10px] text-[#85817A]">
                  <span>Atelier Milano • Curated in Italy</span>
                  <span className="font-mono text-[#B89A6A]">INR (₹)</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Instant Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
