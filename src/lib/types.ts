export interface ProductImage {
  id: string;
  url: string;
  altText?: string | null;
  isPrimary: boolean;
  displayOrder: number;
}

export interface ProductVariant {
  id: string;
  size: string;
  colorName: string;
  colorHex: string;
  sku: string;
  stockQuantity: number;
  priceDelta?: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  bannerImage?: string | null;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  subtitle?: string | null;
  description?: string | null;
  image?: string | null;
  featured?: boolean;
}

export interface Review {
  id: string;
  userId: string;
  userName?: string;
  rating: number;
  title?: string | null;
  comment: string;
  isVerifiedPurchase: boolean;
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  shortDescription?: string | null;
  description: string;
  price: number;
  salePrice?: number | null;
  gender: string;
  isFeatured: boolean;
  isNewArrival: boolean;
  isActive: boolean;
  categoryId: string;
  category?: Category;
  collectionId?: string | null;
  collection?: Collection | null;
  fabricDetails?: string | null;
  careInstructions?: string | null;
  specifications?: string | null;
  images: ProductImage[];
  variants: ProductVariant[];
  reviews?: Review[];
}

export interface CartItem {
  id: string;
  productId: string;
  variantId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  maxStock: number;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string | null;
  role: 'CUSTOMER' | 'ADMIN';
  loyaltyTier?: string;
}

export interface Address {
  id?: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pinCode: string;
  country: string;
  isDefault?: boolean;
  type?: 'HOME' | 'WORK';
}

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  size: string;
  color: string;
  quantity: number;
  subtotal: number;
  imageUrl?: string | null;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string; // JSON parsed
  shippingMethod: string;
  subtotal: number;
  discount: number;
  shippingFee: number;
  total: number;
  status: string;
  paymentStatus: string;
  paymentMethod: string;
  trackingNumber?: string | null;
  carrier?: string | null;
  createdAt: string;
  items: OrderItem[];
}

export interface Coupon {
  id: string;
  code: string;
  description?: string;
  discountType: 'PERCENTAGE' | 'FIXED';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number | null;
}

