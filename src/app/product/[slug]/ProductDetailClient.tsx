'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { formatINR } from '@/lib/utils';
import ProductCard from '@/components/shop/ProductCard';
import SizeGuideModal from '@/components/layout/SizeGuideModal';
import {
  Heart,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
  Ruler,
  Maximize2,
  X,
  Star,
  Plus,
  Minus,
} from 'lucide-react';

interface ProductDetailClientProps {
  product: Product;
  recommended: Product[];
  companion: Product | null;
}

export default function ProductDetailClient({
  product,
  recommended,
  companion,
}: ProductDetailClientProps) {
  const router = useRouter();
  const { addItem } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(
    product.variants?.[0]?.size || ''
  );
  const [selectedColor, setSelectedColor] = useState<string>(
    product.variants?.[0]?.colorName || ''
  );
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Accordion active state
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    description: true,
    fabric: true,
    care: false,
    shipping: false,
    specs: false,
  });

  const toggleAccordion = (section: string) => {
    setOpenAccordions((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const currentVariant = product.variants?.find(
    (v) => v.size === selectedSize && v.colorName === selectedColor
  ) || product.variants?.[0];

  const maxStock = currentVariant ? currentVariant.stockQuantity : 10;
  const isOutOfStock = maxStock <= 0;
  const inWishlist = isInWishlist(product.id);

  // Unique sizes and colors
  const sizes = Array.from(new Set(product.variants?.map((v) => v.size) || []));
  const colors = Array.from(
    new Map(product.variants?.map((v) => [v.colorName, v.colorHex]) || []).entries()
  );

  const images = product.images?.length
    ? product.images
    : [{ id: '1', url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1200', isPrimary: true, displayOrder: 0 }];

  const handleAddToCart = () => {
    if (!currentVariant || isOutOfStock) return;

    addItem({
      productId: product.id,
      variantId: currentVariant.id,
      name: product.name,
      slug: product.slug,
      price: product.salePrice || product.price,
      image: images[0]?.url,
      size: selectedSize,
      color: selectedColor,
      quantity,
      maxStock,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  };

  const handleBuyNow = () => {
    if (!currentVariant || isOutOfStock) return;
    addItem({
      productId: product.id,
      variantId: currentVariant.id,
      name: product.name,
      slug: product.slug,
      price: product.salePrice || product.price,
      image: images[0]?.url,
      size: selectedSize,
      color: selectedColor,
      quantity,
      maxStock,
    });
    router.push('/checkout');
  };

  // Add bundle (Product + Companion)
  const handleAddBundle = () => {
    handleAddToCart();
    if (companion && companion.variants?.[0]) {
      const compVar = companion.variants[0];
      addItem({
        productId: companion.id,
        variantId: compVar.id,
        name: companion.name,
        slug: companion.slug,
        price: companion.salePrice || companion.price,
        image: companion.images[0]?.url || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=400',
        size: compVar.size,
        color: compVar.colorName,
        quantity: 1,
        maxStock: compVar.stockQuantity,
      });
    }
  };

  // Parse specifications JSON
  let specsObj: Record<string, string> = {};
  if (product.specifications) {
    try {
      specsObj = JSON.parse(product.specifications);
    } catch (e) {
      specsObj = {};
    }
  }

  return (
    <div className="bg-[#0B0B0B] text-[#F5F0E8] min-h-screen pt-4 pb-24">
      {/* Breadcrumb Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <nav className="text-[10px] uppercase tracking-widestLuxury text-[#A8A29A] flex items-center gap-2">
          <Link href="/" className="hover:text-[#C5A46D]">Boutique</Link>
          <span>/</span>
          <Link href={`/shop?category=${product.category?.slug}`} className="hover:text-[#C5A46D]">
            {product.category?.name || 'Creations'}
          </Link>
          <span>/</span>
          <span className="text-[#C5A46D] truncate max-w-xs">{product.name}</span>
        </nav>
      </div>

      {/* Main PDP Grid: Left Gallery, Right Specifications & Purchase */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Image Gallery (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="flex md:flex-col gap-3 overflow-x-auto md:overflow-y-auto max-h-[600px] flex-shrink-0">
                {images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setSelectedImageIdx(idx)}
                    className={`w-16 h-20 md:w-20 md:h-28 overflow-hidden border transition-all flex-shrink-0 ${
                      selectedImageIdx === idx
                        ? 'border-[#C5A46D] ring-1 ring-[#C5A46D]'
                        : 'border-[#262626] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main Stage Image with Zoom Lightbox Trigger */}
            <div className="relative flex-1 aspect-[3/4] overflow-hidden bg-[#121212] border border-[#2B2B2B] group">
              <img
                src={images[selectedImageIdx]?.url || images[0]?.url}
                alt={product.name}
                className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105 cursor-zoom-in"
                onClick={() => setLightboxOpen(true)}
              />

              <button
                onClick={() => setLightboxOpen(true)}
                aria-label="Enlarge view"
                className="absolute bottom-4 right-4 p-2.5 bg-black/70 hover:bg-black text-[#F5F0E8] hover:text-[#C5A46D] backdrop-blur-sm border border-[#444] transition-colors"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {product.isNewArrival && (
                <span className="absolute top-4 left-4 bg-[#C5A46D] text-black text-[9px] uppercase tracking-widest font-bold px-3 py-1 shadow-md">
                  New Arrival
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Details, Sizing, Add to Bag (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              {product.collection && (
                <Link
                  href={`/collections/${product.collection.slug}`}
                  className="text-[10px] uppercase tracking-megaLuxury text-[#C5A46D] hover:underline block mb-1 font-mono"
                >
                  {product.collection.name}
                </Link>
              )}

              <h1 className="font-serif text-3xl sm:text-4xl text-[#F5F0E8] font-light uppercase tracking-wide leading-tight mb-3">
                {product.name}
              </h1>

              {/* Price & SKU */}
              <div className="flex items-center gap-4 pb-4 border-b border-[#262626]">
                <span className="font-sans text-2xl text-[#C5A46D] font-medium">
                  {formatINR(product.salePrice || product.price)}
                </span>
                {product.salePrice && (
                  <span className="font-sans text-sm line-through text-[#888]">
                    {formatINR(product.price)}
                  </span>
                )}
                <span className="text-[10px] text-[#A8A29A] font-mono border border-[#34312D] px-2 py-0.5 uppercase">
                  SKU: {product.sku}
                </span>
              </div>
            </div>

            {/* Short Description */}
            <p className="text-xs text-[#A8A29A] leading-relaxed font-light">
              {product.shortDescription || product.description.slice(0, 200)}
            </p>

            {/* Colors Swatches */}
            {colors.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-[#A8A29A] uppercase tracking-wider text-[11px]">Selected Hue</span>
                  <span className="text-[#F5F0E8] font-medium">{selectedColor}</span>
                </div>
                <div className="flex gap-2">
                  {colors.map(([name, hex]) => (
                    <button
                      key={name}
                      onClick={() => setSelectedColor(name)}
                      title={name}
                      className={`w-8 h-8 rounded-full border-2 transition-all p-0.5 ${
                        selectedColor === name ? 'border-[#C5A46D] scale-110' : 'border-[#333]'
                      }`}
                    >
                      <span className="block w-full h-full rounded-full" style={{ backgroundColor: hex || '#111' }} />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes Selector */}
            {sizes.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-[#A8A29A] uppercase tracking-wider text-[11px]">Sartorial Size</span>
                  <button
                    onClick={() => setShowSizeGuide(true)}
                    className="text-[10px] text-[#C5A46D] hover:underline flex items-center gap-1 uppercase tracking-wider"
                  >
                    <Ruler className="w-3.5 h-3.5" /> Size Guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((s) => {
                    const variantForSize = product.variants?.find(
                      (v) => v.size === s && v.colorName === selectedColor
                    );
                    const isAvailable = variantForSize && variantForSize.stockQuantity > 0;

                    return (
                      <button
                        key={s}
                        disabled={!isAvailable}
                        onClick={() => setSelectedSize(s)}
                        className={`px-4 py-2 text-xs font-mono border transition-all ${
                          selectedSize === s
                            ? 'border-[#C5A46D] bg-[#C5A46D] text-black font-semibold shadow-goldGlow'
                            : isAvailable
                            ? 'border-[#34312D] text-[#F5F0E8] hover:border-[#C5A46D]'
                            : 'border-[#222] text-[#555] line-through cursor-not-allowed bg-[#141414]'
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock and Quantity */}
            <div className="flex items-center gap-6 pt-2">
              <div className="flex items-center border border-[#34312D] bg-[#141414]">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-[#A8A29A] hover:text-[#F5F0E8] transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-4 text-xs font-mono font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(maxStock, q + 1))}
                  disabled={quantity >= maxStock}
                  className="px-3 py-2 text-[#A8A29A] hover:text-[#F5F0E8] transition-colors disabled:opacity-30"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {maxStock <= 5 && maxStock > 0 && (
                <span className="text-[11px] text-amber-400 font-mono">
                  Only {maxStock} left in atelier stock.
                </span>
              )}
            </div>

            {/* Action Buttons: Add to Bag, Buy Now, Wishlist */}
            <div className="space-y-3 pt-2">
              <div className="flex gap-3">
                <button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 text-xs uppercase tracking-widestLuxury font-semibold transition-all ${
                    added
                      ? 'bg-green-600 text-white'
                      : isOutOfStock
                      ? 'bg-[#222] text-[#666] cursor-not-allowed'
                      : 'bg-gradient-to-r from-[#9A7B4F] via-[#C5A46D] to-[#E0C18A] text-black hover:brightness-110 shadow-luxury'
                  }`}
                >
                  {added ? (
                    <>
                      <Check className="w-4 h-4" /> Added to Shopping Bag
                    </>
                  ) : isOutOfStock ? (
                    'Sold Out'
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" /> Add to Shopping Bag
                    </>
                  )}
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  aria-label="Wishlist toggle"
                  className={`px-5 py-4 border transition-colors ${
                    inWishlist
                      ? 'border-[#C5A46D] text-[#C5A46D]'
                      : 'border-[#34312D] text-[#A8A29A] hover:text-[#F5F0E8] hover:border-[#C5A46D]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-current' : ''}`} />
                </button>
              </div>

              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full py-3.5 border border-[#34312D] text-[#F5F0E8] hover:border-[#C5A46D] hover:text-[#C5A46D] text-xs uppercase tracking-widestLuxury font-medium transition-all bg-[#121212] disabled:opacity-30"
              >
                Buy Now — Instant Checkout
              </button>
            </div>

            {/* Assurance Badges */}
            <div className="grid grid-cols-2 gap-3 pt-4 border-t border-[#262626] text-[11px] text-[#A8A29A]">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-[#C5A46D]" />
                <span>Complimentary Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-[#C5A46D]" />
                <span>14-Day Doorstep Returns</span>
              </div>
            </div>

            {/* Collapsible Accordions: Description, Fabric, Care, Shipping, Specifications */}
            <div className="border-t border-[#262626] divide-y divide-[#262626] text-xs">
              {/* 1. Description */}
              <div className="py-3">
                <button
                  onClick={() => toggleAccordion('description')}
                  className="w-full flex items-center justify-between text-left py-1 font-serif uppercase tracking-widest text-[#F5F0E8] hover:text-[#C5A46D]"
                >
                  <span>Atelier Description</span>
                  {openAccordions.description ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordions.description && (
                  <p className="pt-2 text-[#A8A29A] leading-relaxed font-light">
                    {product.description}
                  </p>
                )}
              </div>

              {/* 2. Fabric & Material */}
              {product.fabricDetails && (
                <div className="py-3">
                  <button
                    onClick={() => toggleAccordion('fabric')}
                    className="w-full flex items-center justify-between text-left py-1 font-serif uppercase tracking-widest text-[#F5F0E8] hover:text-[#C5A46D]"
                  >
                    <span>Fabric & Textile Composition</span>
                    {openAccordions.fabric ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {openAccordions.fabric && (
                    <p className="pt-2 text-[#A8A29A] leading-relaxed font-light">
                      {product.fabricDetails}
                    </p>
                  )}
                </div>
              )}

              {/* 3. Care Instructions */}
              {product.careInstructions && (
                <div className="py-3">
                  <button
                    onClick={() => toggleAccordion('care')}
                    className="w-full flex items-center justify-between text-left py-1 font-serif uppercase tracking-widest text-[#F5F0E8] hover:text-[#C5A46D]"
                  >
                    <span>Care & Preservation</span>
                    {openAccordions.care ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {openAccordions.care && (
                    <p className="pt-2 text-[#A8A29A] leading-relaxed font-light">
                      {product.careInstructions}
                    </p>
                  )}
                </div>
              )}

              {/* 4. Specifications */}
              {Object.keys(specsObj).length > 0 && (
                <div className="py-3">
                  <button
                    onClick={() => toggleAccordion('specs')}
                    className="w-full flex items-center justify-between text-left py-1 font-serif uppercase tracking-widest text-[#F5F0E8] hover:text-[#C5A46D]"
                  >
                    <span>Bespoke Specifications</span>
                    {openAccordions.specs ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                  {openAccordions.specs && (
                    <div className="pt-2 space-y-1 font-mono text-[11px]">
                      {Object.entries(specsObj).map(([k, v]) => (
                        <div key={k} className="flex justify-between py-1 border-b border-[#1c1c1c]">
                          <span className="text-[#A8A29A]">{k}</span>
                          <span className="text-[#F5F0E8]">{v}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 5. Shipping & Returns */}
              <div className="py-3">
                <button
                  onClick={() => toggleAccordion('shipping')}
                  className="w-full flex items-center justify-between text-left py-1 font-serif uppercase tracking-widest text-[#F5F0E8] hover:text-[#C5A46D]"
                >
                  <span>Shipping & Concierge Service</span>
                  {openAccordions.shipping ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordions.shipping && (
                  <p className="pt-2 text-[#A8A29A] leading-relaxed font-light">
                    Complimentary white-glove express courier for qualifying orders. Delivered in custom embossed wardrobe garment boxes with scented cedar wood accessories. 14-day seamless concierge return pickup.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Frequently Bought Together Bundle */}
        {companion && (
          <div className="mt-24 p-6 sm:p-8 bg-[#121212] border border-[#2B2B2B]">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#C5A46D] block mb-1">
              Atelier Pairing
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-[#F5F0E8] uppercase tracking-wide mb-6">
              Frequently Styled Together
            </h3>

            <div className="flex flex-col md:flex-row items-center gap-6">
              {/* Main Product */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                <img
                  src={images[0]?.url}
                  alt={product.name}
                  className="w-20 h-24 object-cover border border-[#333]"
                />
                <div>
                  <h4 className="font-serif text-xs text-[#F5F0E8]">{product.name}</h4>
                  <p className="text-xs text-[#C5A46D] font-sans font-medium mt-1">
                    {formatINR(product.salePrice || product.price)}
                  </p>
                </div>
              </div>

              <span className="text-[#C5A46D] font-serif text-xl font-bold">+</span>

              {/* Companion Product */}
              <div className="flex items-center gap-4 w-full md:w-auto">
                <img
                  src={companion.images[0]?.url || 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=300'}
                  alt={companion.name}
                  className="w-20 h-24 object-cover border border-[#333]"
                />
                <div>
                  <h4 className="font-serif text-xs text-[#F5F0E8]">{companion.name}</h4>
                  <p className="text-xs text-[#C5A46D] font-sans font-medium mt-1">
                    {formatINR(companion.salePrice || companion.price)}
                  </p>
                </div>
              </div>

              <div className="md:ml-auto text-center md:text-right w-full md:w-auto">
                <p className="text-xs text-[#A8A29A] mb-1">Combined Total:</p>
                <p className="text-lg font-sans font-bold text-[#C5A46D] mb-3">
                  {formatINR(
                    (product.salePrice || product.price) +
                      (companion.salePrice || companion.price)
                  )}
                </p>
                <button
                  onClick={handleAddBundle}
                  className="w-full md:w-auto px-6 py-2.5 bg-[#C5A46D] text-black text-xs uppercase tracking-widest font-semibold hover:bg-[#E0C18A] transition-colors"
                >
                  Add Both to Bag
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Customer Reviews Section */}
        <div className="mt-24 pt-16 border-t border-[#262626]">
          <div className="max-w-3xl">
            <span className="text-[10px] font-mono tracking-widest uppercase text-[#C5A46D] block mb-1">
              Patron Testimonials
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl text-[#F5F0E8] uppercase tracking-wide mb-6">
              Client Reviews & Appraisals
            </h3>

            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-6">
                {product.reviews.map((rev) => (
                  <div key={rev.id} className="p-5 bg-[#121212] border border-[#2B2B2B]">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1 text-[#C5A46D]">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-[#C5A46D]" />
                        ))}
                      </div>
                      <span className="text-[10px] text-[#A8A29A] font-mono">
                        {new Date(rev.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    {rev.title && (
                      <h4 className="font-serif text-sm text-[#F5F0E8] font-medium mb-1">
                        {rev.title}
                      </h4>
                    )}
                    <p className="text-xs text-[#A8A29A] leading-relaxed font-light mb-3">
                      “{rev.comment}”
                    </p>
                    <div className="flex items-center gap-2 text-[10px] text-[#C5A46D] uppercase font-mono">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Verified Bespoke Client — {rev.userName || 'Devon S.'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#A8A29A]">
                Be the first to review this atelier masterpiece. Reviews are curated exclusively from verified clients.
              </p>
            )}
          </div>
        </div>

        {/* Recommended Products Carousel */}
        {recommended.length > 0 && (
          <div className="mt-24 pt-16 border-t border-[#262626]">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-[10px] font-mono tracking-megaLuxury uppercase text-[#C5A46D] mb-2 block">
                Complementary Pieces
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#F5F0E8] uppercase tracking-wide">
                You May Also Admire
              </h3>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              {recommended.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile Sticky Add to Bag Bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#111111]/95 backdrop-blur-md border-t border-[#262626] px-4 py-3 flex items-center justify-between gap-3 shadow-2xl">
        <div className="flex flex-col min-w-0 pr-2">
          <span className="text-[11px] text-[#F5F0E8] font-serif truncate">{product.name}</span>
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold text-[#B89A6A]">
              {formatINR(product.salePrice || product.price)}
            </span>
            {selectedSize && (
              <span className="text-[10px] text-[#85817A] font-mono">({selectedSize})</span>
            )}
          </div>
        </div>
        <button
          onClick={handleAddToCart}
          disabled={isOutOfStock}
          className={`px-5 py-2.5 text-[11px] uppercase tracking-widest font-semibold flex items-center gap-1.5 shrink-0 transition-all ${
            added
              ? 'bg-green-600 text-white'
              : isOutOfStock
              ? 'bg-[#222] text-[#666] cursor-not-allowed'
              : 'bg-gradient-to-r from-[#9A7B4F] via-[#B89A6A] to-[#E0C18A] text-black hover:brightness-110 shadow-luxury'
          }`}
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5" /> Added
            </>
          ) : isOutOfStock ? (
            'Sold Out'
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" /> Add to Bag
            </>
          )}
        </button>
      </div>

      {/* Fullscreen Lightbox Zoom Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setLightboxOpen(false)}
            aria-label="Close zoom"
            className="absolute top-6 right-6 p-2 text-[#A8A29A] hover:text-[#C5A46D]"
          >
            <X className="w-8 h-8" />
          </button>
          <img
            src={images[selectedImageIdx]?.url}
            alt={product.name}
            className="max-h-[90vh] max-w-[90vw] object-contain shadow-2xl"
          />
        </div>
      )}

      {/* Sizing Modal */}
      <SizeGuideModal isOpen={showSizeGuide} onClose={() => setShowSizeGuide(false)} />
    </div>
  );
}

