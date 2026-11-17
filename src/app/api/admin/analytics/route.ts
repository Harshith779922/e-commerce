import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [
      totalOrders,
      pendingOrders,
      deliveredOrders,
      confirmedOrders,
      totalCustomers,
      totalProducts,
      orders,
      variants,
      recentOrders,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: 'PENDING' } }),
      prisma.order.count({ where: { status: 'DELIVERED' } }),
      prisma.order.count({ where: { status: 'CONFIRMED' } }),
      prisma.user.count({ where: { role: 'CUSTOMER' } }),
      prisma.product.count({ where: { isActive: true } }),
      prisma.order.findMany({
        where: { paymentStatus: 'PAID' },
        select: { total: true, createdAt: true },
      }),
      prisma.productVariant.findMany({
        where: { stockQuantity: { lte: 5 } },
        include: { product: true },
      }),
      prisma.order.findMany({
        take: 6,
        orderBy: { createdAt: 'desc' },
        include: { items: true },
      }),
    ]);

    const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);

    return NextResponse.json({
      metrics: {
        totalRevenue,
        totalOrders,
        pendingOrders,
        completedOrders: deliveredOrders,
        activeProcessingOrders: confirmedOrders,
        totalCustomers,
        totalProducts,
        lowStockCount: variants.length,
      },
      lowStockProducts: variants.map((v) => ({
        id: v.id,
        productId: v.productId,
        productName: v.product.name,
        size: v.size,
        color: v.colorName,
        stock: v.stockQuantity,
        sku: v.sku,
      })),
      recentTransactions: recentOrders,
    });
  } catch (error: any) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}

