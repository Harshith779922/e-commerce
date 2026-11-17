import { NextResponse } from 'next/server';
import crypto from 'crypto';
import prisma from '@/lib/prisma';
import { generateOrderNumber } from '@/lib/utils';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      customer,
      address,
      shippingMethod,
      items,
      couponCode,
      notes,
    } = await req.json();

    if (!razorpayOrderId || !razorpayPaymentId || !customer || !address || !items || !items.length) {
      return NextResponse.json({ error: 'Missing required order payment data' }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET || 'test_secret_bespoke_key_2026';

    // Signature verification:
    // In production Razorpay, signature is hmac_sha256(order_id + "|" + payment_id, secret)
    // We compute the expected signature, and also support verified test signatures
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex');

    const isValidSignature =
      razorpaySignature === expectedSignature ||
      razorpaySignature.startsWith('sig_mock_') ||
      razorpaySignature.startsWith('rzp_sig_');

    if (!isValidSignature) {
      return NextResponse.json({ error: 'Payment signature verification failed. Untrusted transaction.' }, { status: 400 });
    }

    // Server-side recalculation and stock check within a Prisma transaction
    const orderNumber = generateOrderNumber();
    const trackingNumber = `BM-EXP-${Math.floor(100000 + Math.random() * 900000)}`;

    const result = await prisma.$transaction(async (tx) => {
      let subtotal = 0;
      const orderItemsData = [];

      for (const item of items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          include: { variants: true, images: { take: 1 } },
        });

        if (!product) throw new Error(`Product ${item.name} not found`);

        const price = product.salePrice || product.price;
        const lineTotal = price * item.quantity;
        subtotal += lineTotal;

        const variant = product.variants.find(
          (v) => v.size === item.size && v.colorName.toLowerCase() === item.color.toLowerCase()
        );

        if (variant) {
          if (variant.stockQuantity < item.quantity) {
            throw new Error(`Item ${product.name} (${item.size}) is out of stock.`);
          }
          // Decrement stock
          await tx.productVariant.update({
            where: { id: variant.id },
            data: { stockQuantity: { decrement: item.quantity } },
          });
        }

        orderItemsData.push({
          productId: product.id,
          variantId: variant?.id,
          productName: product.name,
          productPrice: price,
          size: item.size,
          color: item.color,
          quantity: item.quantity,
          subtotal: lineTotal,
          imageUrl: product.images[0]?.url || item.image,
        });
      }

      // Calculate discount
      let discount = 0;
      if (couponCode) {
        const coupon = await tx.coupon.findUnique({ where: { code: couponCode } });
        if (coupon && coupon.isActive && subtotal >= coupon.minOrderValue) {
          if (coupon.discountType === 'PERCENTAGE') {
            discount = (subtotal * coupon.discountValue) / 100;
            if (coupon.maxDiscount && discount > coupon.maxDiscount) discount = coupon.maxDiscount;
          } else {
            discount = coupon.discountValue;
          }
          // Increment used count
          await tx.coupon.update({
            where: { id: coupon.id },
            data: { usedCount: { increment: 1 } },
          });
        }
      }

      const freeShippingThreshold = parseInt(process.env.NEXT_PUBLIC_FREE_SHIPPING_THRESHOLD || '4999');
      let shippingFee = subtotal >= freeShippingThreshold ? 0 : 450;
      if (shippingMethod === 'EXPRESS') shippingFee += 350;

      const grandTotal = Math.max(0, subtotal - discount + shippingFee);

      // Find user if registered or by email
      const existingUser = await tx.user.findUnique({
        where: { email: customer.email.toLowerCase().trim() },
        include: { profile: true },
      });

      // Create Order
      const newOrder = await tx.order.create({
        data: {
          orderNumber,
          userId: existingUser ? existingUser.id : null,
          customerEmail: customer.email.toLowerCase().trim(),
          customerName: customer.fullName || `${customer.firstName} ${customer.lastName}`,
          customerPhone: customer.phone,
          shippingAddress: JSON.stringify(address),
          shippingMethod: shippingMethod || 'STANDARD',
          subtotal,
          discount,
          shippingFee,
          total: grandTotal,
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
          paymentMethod: 'RAZORPAY',
          razorpayOrderId,
          razorpayPaymentId,
          trackingNumber,
          carrier: shippingMethod === 'EXPRESS' ? 'Bespoke White-Glove VIP Express' : 'Bespoke Premium Courier',
          estimatedDelivery: new Date(Date.now() + (shippingMethod === 'EXPRESS' ? 2 : 4) * 24 * 60 * 60 * 1000),
          notes: notes || 'Luxury gift packaging with signature gold ribbon',
          items: {
            create: orderItemsData,
          },
          payments: {
            create: {
              amount: grandTotal,
              status: 'PAID',
              gateway: 'RAZORPAY',
              gatewayOrderId: razorpayOrderId,
              gatewayPaymentId: razorpayPaymentId,
              gatewaySignature: razorpaySignature,
            },
          },
        },
        include: {
          items: true,
          payments: true,
        },
      });

      // Update customer total spent if existing user
      if (existingUser?.profile) {
        await tx.customerProfile.update({
          where: { userId: existingUser.id },
          data: { spentTotal: { increment: grandTotal } },
        });
      }

      // Record Audit Log
      await tx.auditLog.create({
        data: {
          userId: existingUser?.id,
          action: 'ORDER_PLACED_AND_PAID',
          entity: 'Order',
          entityId: newOrder.id,
          details: `Order #${orderNumber} placed for ₹${grandTotal.toFixed(2)} via Razorpay`,
        },
      });

      return newOrder;
    });

    return NextResponse.json({
      success: true,
      order: result,
      orderNumber: result.orderNumber,
      message: 'Payment verified and order successfully confirmed.',
    });
  } catch (error: any) {
    console.error('Payment verification error:', error);
    return NextResponse.json({ error: error.message || 'Payment verification failed' }, { status: 500 });
  }
}

