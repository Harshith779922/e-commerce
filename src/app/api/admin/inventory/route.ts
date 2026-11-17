import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const variants = await prisma.productVariant.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
            sku: true,
            price: true,
            category: { select: { name: true } },
          },
        },
      },
      orderBy: { stockQuantity: 'asc' },
    });

    return NextResponse.json({ variants });
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to load inventory' }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { variantId, stockQuantity } = await req.json();

    const updated = await prisma.productVariant.update({
      where: { id: variantId },
      data: { stockQuantity: parseInt(stockQuantity) },
    });

    return NextResponse.json({ success: true, variant: updated });
  } catch (e: any) {
    return NextResponse.json({ error: 'Failed to update stock' }, { status: 500 });
  }
}

