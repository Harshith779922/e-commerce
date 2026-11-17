import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { items, couponCode, shippingMethod } = await req.json();

    if (!items || !items.length) {
      return NextResponse.json({ error: 'Shopping bag is empty' }, { status: 400 });
    }

    // 1. Server-side validation of products and stock
    let serverSubtotal = 0;
    const verifiedItems = [];

    for (const item of items) {
      const dbProduct = await prisma.product.findUnique({
        where: { id: item.productId },
        include: { variants: true },
      });

      if (!dbProduct || !dbProduct.isActive) {
        return NextResponse.json({ error: `Product "${item.name}" is no longer available.` }, { status: 400 });
      }

      const variant = dbProduct.variants.find(
        (v) => v.size === item.size && v.colorName.toLowerCase() === item.color.toLowerCase()
      );

      if (variant && variant.stockQuantity < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for "${dbProduct.name}" in size ${item.size}. Available: ${variant.stockQuantity}` },
          { status: 400 }
        );
      }

      const activePrice = dbProduct.salePrice || dbProduct.price;
      serverSubtotal += activePrice * item.quantity;

      verifiedItems.push({
        productId: dbProduct.id,
        name: dbProduct.name,
        price: activePrice,
        size: item.size,
        color: item.color,
        quantity: item.quantity,
        variantId: variant?.id,
      });
    }

    // 2. Server-side coupon verification
    let discount = 0;
    if (couponCode) {
      const coupon = await prisma.coupon.findUnique({
        where: { code: couponCode.toUpperCase().trim() },
      });
      if (coupon && coupon.isActive && serverSubtotal >= coupon.minOrderValue) {
        if (coupon.discountType === 'PERCENTAGE') {
          discount = (serverSubtotal * coupon.discountValue) / 100;
          if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
          }
        } else {
          discount = coupon.discountValue;
        }
      }
    }

    // 3. Shipping fee calculation
    const freeShippingThreshold = parseInt(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD || '4999');
    let shippingFee = serverSubtotal >= freeShippingThreshold ? 0 : 450;
    if (shippingMethod === 'EXPRESS') {
      shippingFee += 350; // Express white-glove upgrade
    }

    const total = Math.max(0, serverSubtotal - discount + shippingFee);

    // 4. Create Razorpay order simulation payload
    const rzpKey = process.env.RAZORPAY_KEY_ID || 'rzp_test_luxuryMilano2026';
    const razorpayOrderId = `order_rzp_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    return NextResponse.json({
      success: true,
      razorpayOrderId,
      amount: Math.round(total * 100), // In paise
      currency: 'INR',
      keyId: rzpKey,
      breakdown: {
        subtotal: serverSubtotal,
        discount,
        shippingFee,
        total,
      },
      verifiedItems,
    });
  } catch (error: any) {
    console.error('Razorpay order creation error:', error);
    return NextResponse.json({ error: 'Failed to initiate secure checkout' }, { status: 500 });
  }
}

